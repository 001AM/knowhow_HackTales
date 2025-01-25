import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../axios/axiosInstance";

export default function Marketplace() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <Box px="5%">
        <Text mt="9%" fontSize="4xl" fontWeight="extrabold">
          Redeem our Sustainable Products
        </Text>
        <Box
          display="flex"
          justifyContent="space-between"
          minWidth="300px"
          flexWrap="wrap"
        >
          {products.map((product, index) => (
            <Card key={index} maxW="sm" mb="4">
              <CardBody>
                <Image
                  src={`http://127.0.0.1:8000/${product.image}`}
                  alt="Eco-friendly product"
                  borderRadius="lg"
                  width="350px"
                  height="300px"
                />
                <Stack mt="6" spacing="3">
                  <Heading size="md">{product.name}</Heading>
                  <Text>{product.description}</Text>
                </Stack>
              </CardBody>
              <Divider />
              <CardFooter display="flex" justifyContent="space-between">
                <Text fontSize="xl">₹{product.price_in_points} or {product.price_in_points*0.0000035} ETH</Text>
                <Link to={`/products/${product.id}`}>
                  <Button variant="solid" colorScheme="green">
                    Buy now
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </Box>
      </Box>
    </>
  );
}
