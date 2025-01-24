from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from web3 import Web3
from .models import *
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import User, Product, Transaction
from .blockchain import add_points as blockchain_add_points, purchase_product as blockchain_purchase_product
import json
from Crypto.Hash import keccak

def generate_ethereum_address(user_id):
    # Convert the user ID to bytes (e.g., if the user_id is an integer, we can convert it to bytes)
    user_id_bytes = str(user_id).encode('utf-8')

    # Apply keccak256 hash function
    keccak_hash = keccak.new(digest_bits=256)
    keccak_hash.update(user_id_bytes)

    # Get the first 20 bytes of the hash to create a valid Ethereum address
    eth_address = keccak_hash.digest()[-20:]

    # Convert to hexadecimal format and prepend '0x' to match Ethereum address format
    return '0x' + eth_address.hex()


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_points_view(request):
    """
    Add points to a user and update the database after a blockchain transaction.
    The user ID is fetched from the authentication token.
    """
    user = request.user  # Fetch user from the authentication token
    data = request.data
    points = int(data.get("points"))
    print(user.eth_address)
    try:
        # Add points to the blockchain using user ID as the blockchain address
        blockchain_add_points(str(user.eth_address), points)

        # Update the user's points in the database
        user.total_points += points
        user.save()

        return Response({"status": "success", "message": "Points added successfully!"}, status=200)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def purchase_product_view(request):
    """
    Handle product purchases, update the database and blockchain, and create a transaction record.
    The user ID is fetched from the authentication token and used as the blockchain address.
    """
    user = request.user  # Fetch user from the authentication token
    data = request.data
    product_id = data.get("product_id")
    print(user.eth_address)
    product = get_object_or_404(Product, id=product_id)

    # Ensure there is enough stock and the user has enough points
    if product.stock <= 0:
        return Response({"status": "error", "message": "Product out of stock!"}, status=400)
    if user.total_points < product.price_in_points:
        return Response({"status": "error", "message": "Insufficient points!"}, status=400)

    try:
        # Perform the blockchain transaction using user ID as the blockchain address
        blockchain_purchase_product(str(user.eth_address), product_id)

        # Deduct points from the user and update the product stock
        user.total_points -= product.price_in_points
        product.stock -= 1
        user.save()
        product.save()

        # Create a transaction entry
        transaction = Transaction.objects.create(
            user=user,
            product=product,
            points_spent=product.price_in_points,
        )
        transaction.save()

        return Response({"status": "success", "message": "Product purchased successfully!"}, status=200)
    except Exception as e:
        print(str(e))
        return Response({"status": "error", "message": str(e)}, status=500)


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        request_data = request.data.copy()
        del request_data['username']
        del request_data['password']
        del request_data['email']
        del request_data['confirmpassword']

        if not username or not password or not email:
            return Response({'error': 'Please provide username, password and email'},status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'},status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username,email=email,password=password)
        user_eth_address = generate_ethereum_address(user.id)
        user_address_checksum = Web3.to_checksum_address(user_eth_address)
        user.eth_address = user_address_checksum

        user.save()
        print(request_data)
        User.objects.filter(id=user.id).update(**request_data)
        refresh = RefreshToken.for_user(user)

        return Response({'data':{
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        print(username,password)

        user = authenticate(username=username, password=password)
        print(user)
        if user is None:
            return Response({'error': 'Invalid credentials'},status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)

        return Response({'data':{
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }})

    except Exception as e:
        return Response({'error': 'Something went wrong'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        refresh_token = request.data.get('refresh_token')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Successfully logged out'},status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': 'Invalid token'},status=status.HTTP_400_BAD_REQUEST)
