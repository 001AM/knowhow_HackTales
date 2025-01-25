import {
  Box,
  Button,
  Image,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { FaBoxOpen } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axios/axiosInstance";
import MetaMask from "../Metamask/MetaMask";

export default function ProductPage() {
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return null;

  const handleRazorpayPayment = async () => {
    try {
      // Create order on backend
      const response = await axiosInstance.post("create-razorpay-order/", {
        amount: product.price_in_points,
        currency: "INR",
      });

      const { order } = response.data;
      console.log("razorpay order created");

      const options = {
        key: "rzp_test_mXMcUep0P0pD3m", // Replace with your actual key
        amount: order.amount,
        currency: order.currency,
        name: "Your Company Name",
        description: product.name,
        order_id: order.id,
        handler: async (response) => {
          // Verify payment on backend
          await axiosInstance.post("/verify-razorpay-payment", {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });

          // Handle successful payment (e.g., show success message, update UI)
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment initialization error:", error);
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Box width="50%" pt="10%" px="10%" pb="5%">
          <Image
            src={`http://127.0.0.1:8000/${product.image}`}
            alt="Eco-friendly product"
            borderRadius="lg"
            width="500px"
            height="450px"
          />
        </Box>
        <Box width="50%" pt="15%">
          <Text fontSize="4xl" fontWeight="extrabold">
            {product.name}
          </Text>
          <Text fontSize="lg" fontWeight="medium">
            {product.description}
          </Text>
          <Box
            display="flex"
            flexDirection="row"
            gap="20px"
            mt="3%"
            alignItems="center"
          >
            <Text fontSize="2xl" fontWeight="bold">
              ₹ {product.price_in_points} or{" "}
              {product.price_in_points * 0.0000035} ETH
            </Text>
          </Box>
          <Box>
            <Text
              fontSize="2xl"
              fontWeight="medium"
              display="flex"
              alignItems="center"
              gap="10px"
            >
              <FaBoxOpen />
              {product.stock} In Stock
            </Text>
          </Box>
          <Box gap="20px" display="flex">
            <Button colorScheme="green" mt="5%" onClick={handleRazorpayPayment}>
              Buy In INR
            </Button>
            <Button colorScheme="green" mt="5%" onClick={onOpen}>
              Buy In ETH
            </Button>
          </Box>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Buy with Ethereum</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <MetaMask productPriceInEth={product.price_in_points * 0.0000035} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
