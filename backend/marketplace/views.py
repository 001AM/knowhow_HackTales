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
import torch
from transformers import AutoModelForImageClassification
import requests
from io import BytesIO
from torchvision import transforms
import google.generativeai as genai
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.http import JsonResponse
from PIL import Image
from django.views.decorators.csrf import csrf_exempt
from ultralyticsplus import YOLO
import os
from dotenv import load_dotenv
import razorpay

yolo_model = YOLO('foduucom/plant-leaf-detection-and-classification')
load_dotenv()

@api_view(['POST'])
@permission_classes([AllowAny])
def leafclassify(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)

    try:
        if 'image' not in request.FILES:
            return JsonResponse({'error': 'No image file provided'}, status=400)

        image_file = request.FILES['image']
        image = Image.open(image_file)
        results = yolo_model.predict(image)

        if not results[0].boxes:
            return JsonResponse({"error": "No leaves detected"}, status=404)

        most_confident_box = max(results[0].boxes, key=lambda box: box.conf)
        leaf_name = yolo_model.names[int(most_confident_box.cls)]

        # Gemini prompts for details and locations
        details_prompt = f"Provide comprehensive details about {leaf_name} leaf, including its botanical characteristics, nutritional value, and ecological importance. Dont give me the name of leaf at the beginning."
        locations_prompt = f"List 5 specific countries/regions where {leaf_name} leaf is commonly found, with latitude and longitude coordinates."

        # Generate responses
        model = genai.GenerativeModel('gemini-pro')
        details_response = model.generate_content(details_prompt)
        locations_response = model.generate_content(locations_prompt)

        details_response_final = create_dictionary_from_text(details_response.text)
        locations_response_final = create_dictionary_from_text(locations_response.text)
        # Prepare JSON response
        response_data = {
            "Leaf Name": str(leaf_name).upper(),
            "Details": details_response_final,
            "Locations": locations_response_final
        }

        return JsonResponse(response_data, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def create_dictionary_from_text(text):
    import re
    sections = re.split(r"\n\n", text.strip())
    result = {}
    current_key = None

    for section in sections:
        # Identify main headers (keys)
        if section.startswith("**") and section.endswith("**"):
            current_key = section.strip("**").strip()
            result[current_key] = {}
        # Handle bullet points or key-value pairs
        elif section.startswith("* "):
            if current_key:
                if "Details" not in result[current_key]:
                    result[current_key]["Details"] = []
                bullet_points = section.split("\n")
                for point in bullet_points:
                    if point.startswith("* "):
                        result[current_key]["Details"].append(point.strip("* ").strip())
        # Handle free text or paragraphs under headers
        elif current_key and ":" not in section:
            if "Details" not in result[current_key]:
                result[current_key]["Details"] = []
            result[current_key]["Details"].append(section.strip())
        # Handle subsections with colon (key-value pairs)
        elif current_key and ":" in section:
            sub_key, sub_value = section.split(":", 1)
            sub_key = sub_key.strip("* ").strip()
            sub_value = sub_value.strip()
            result[current_key][sub_key] = sub_value

    return result

class BirdSpeciesClassifier:
    def __init__(self, model_name='chriamue/bird-species-classifier'):
        """Initialize bird species classification model"""
        self.model = AutoModelForImageClassification.from_pretrained(model_name)

        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                  std=[0.229, 0.224, 0.225])
        ])

        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)

    def predict_species(self, image):
        """Predict bird species from image"""
        # Convert to RGB if needed
        image = image.convert('RGB')

        # Preprocess image
        input_tensor = self.transform(image).unsqueeze(0).to(self.device)

        # Perform prediction
        with torch.no_grad():
            outputs = self.model(input_tensor)
            logits = outputs.logits

        # Process predictions
        probabilities = torch.softmax(logits, dim=1)
        top_k = torch.topk(probabilities, k=5)

        # Prepare results
        results = []
        for idx, prob in zip(top_k.indices[0], top_k.values[0]):
            results.append({
                'species': self.model.config.id2label[idx.item()],
                'confidence': prob.item() * 100
            })

        return results

# Global classifier instance
classifier = BirdSpeciesClassifier()


# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-pro')

@api_view(['POST'])
@permission_classes([AllowAny])
def birdclassify(request):
    """
    Django view for bird species classification and detail retrieval
    """
    if request.method == 'POST':
        try:
            # Check if image is in request
            if 'image' not in request.FILES:
                return JsonResponse({'error': 'No image uploaded'}, status=400)

            # Get image file
            image_file = request.FILES['image']

            # Open image with Pillow
            image = Image.open(image_file)

            # Classify image
            predictions = classifier.predict_species(image)

            # Take the top predicted bird name
            top_bird = predictions[0]['species']

            # Query Gemini for bird details
            prompt = f"""Provide detailed information about the {top_bird} bird species, including its global distribution and habitat. Dont Give me the name of the bird at at the beginning."""
            gemini_response = model.generate_content(prompt)
            gemini_response_final = create_dictionary_from_text(str(gemini_response.text))
            return JsonResponse({
                'Bird Name': top_bird,
                'Bird Details': gemini_response_final
            })

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Only POST method allowed'}, status=405)

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
def update_profile(request):
    try:
        request_data = request.data.copy()
        User.objects.filter(id=request.user.id).update(**request_data)
        return Response({"message":"Updated Successfully."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def get_profile(request):
    try:
        user = User.objects.get(id=request.user.id)
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'phone_number': user.phone_number,
            'city': user.city,
            'state': user.state,
            'pincode': user.pincode,
            'total_points': user.total_points,
            'eth_address': user.eth_address,
            'is_vendor': user.is_vendor
        }, status=status.HTTP_200_OK)
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
            'is_vendor': user.is_vendor
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


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Product
from .serializers import ProductSerializer

class ProductListCreateView(APIView):
    """
    Handles listing all products and creating a new product.
    """
    def get(self, request):
        if request.GET.get('vendor_product') == True:
            products = Product.objects.filter(created_by=request.user)
        else:
            products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data.copy()
        data['created_by'] = request.user.id
        if 'image' in request.FILES:
            data['image'] = request.FILES['image']
        serializer = ProductSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProductDetailView(APIView):
    """
    Handles retrieving, updating, and deleting a single product.
    """
    def get_object(self, pk):
        try:
            return Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return None

    def get(self, request, pk):
        product = self.get_object(pk)
        if product is None:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    def put(self, request, pk):
        product = self.get_object(pk)
        if product is None:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        data = request.data.copy()
        if 'image' in request.FILES:
            data['image'] = request.FILES['image']
        serializer = ProductSerializer(product, data=data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        product = self.get_object(pk)
        if product is None:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        product.delete()
        return Response({"message": "Product deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
client = razorpay.Client(auth=("rzp_test_mXMcUep0P0pD3m", "e807kfLD8jlSuOarSsRHOStE"))

@api_view(['POST'])
@csrf_exempt
def create_razorpay_order(request):
    amount = request.data['amount']
    
    # Create order
    order = client.order.create({
        'amount': amount * 100,  # amount in paise
        'currency': 'INR',
        'payment_capture': 1
    })
    
    return Response({'order': order})

@csrf_exempt
def verify_razorpay_payment(request):
    # Verify payment signature
    params_dict = {
        'razorpay_payment_id': request.data['razorpay_payment_id'],
        'razorpay_order_id': request.data['razorpay_order_id'],
        'razorpay_signature': request.data['razorpay_signature']
    }
    
    try:
        client.utility.verify_payment_signature(params_dict)
        # Payment successful, update order status
        return Response({'status': 'success'})
    except:
        return Response({'status': 'failure'}, status=400)
