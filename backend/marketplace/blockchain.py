from web3 import Web3
import json

ganache_url = "http://127.0.0.1:7545"  # Ganache RPC URL
web3 = Web3(Web3.HTTPProvider(ganache_url))

with open("C:/Users/Soham/EcoVoyage/backend/blockchain/build/contracts/Marketplace.json", "r") as file:
    contract_data = json.load(file)

CONTRACT_ADDRESS = "0xadF77ad51435753087E13dA8Cf58FD4FCdd7C2Be"
CONTRACT_ABI = contract_data["abi"]

contract = web3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)

# Add points to a user
def add_points(user_address, points):
    tx_hash = contract.functions.addPoints(user_address, points).transact({"from": web3.eth.accounts[0]})
    web3.eth.wait_for_transaction_receipt(tx_hash)

# Purchase a product
def purchase_product(user_address, product_id):
    tx_hash = contract.functions.purchaseProduct(product_id).transact({"from": web3.eth.accounts[0]})
    web3.eth.wait_for_transaction_receipt(tx_hash)
