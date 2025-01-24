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
  
  export default function Marketplace() {
    const products = [
      {
        id: 1,
        name: "Reusable Bamboo Cutlery Set",
        price: 15.99,
        stock: 10,
        description:
          "A set of lightweight, durable bamboo cutlery including a fork, knife, spoon, chopsticks, and a straw with a cleaning brush, all in a compact travel pouch.",
      },

      {
        id: 2,
        name: "Organic Cotton Tote Bag",
        price: 12.5,
        stock: 10,
        description:
          "A reusable and biodegradable tote bag made from 100% organic cotton, perfect for grocery shopping or carrying daily essentials.",
      },
      {
        id: 3,
        name: "Biodegradable Plant-Based Toothbrush",
        price: 4.99,
        stock: 10,
        description:
          "An eco-friendly toothbrush with a biodegradable bamboo handle and soft, plant-based bristles for effective cleaning.",
      },
      {
        id: 4,
        name: "Compostable Food Wraps",
        price: 19.95,
        stock: 10,
        description:
          "A pack of three reusable, compostable food wraps made from organic cotton, beeswax, jojoba oil, and tree resin, designed to replace single-use plastic wrap.",
      },
      {
        id: 5,
        name: "Solar-Powered LED Lantern",
        price: 25.0,
        stock: 10,
        description:
          "A portable and collapsible LED lantern powered by solar energy, ideal for camping, hiking, or emergency use.",
      },
      {
        id: 6,
        name: "Eco-Friendly Laundry Detergent Sheets",
        price: 16.99,
        stock: 10,
        description:
          "Dissolvable, zero-waste detergent sheets made with plant-based ingredients, offering an eco-conscious alternative to traditional laundry detergents.",
      },
      {
        id: 7,
        name: "Recycled Paper Notebook",
        price: 8.99,
        stock: 10,
        description:
          "A durable notebook made from 100% recycled paper with a stylish cover, perfect for jotting down ideas, notes, or sketches.",
      },
      {
        id:8,
        name: "Stainless Steel Reusable Water Bottle",
        price: 24.99,
        stock: 10,
        description:
          "A double-wall insulated stainless steel water bottle that keeps beverages hot or cold for hours, reducing the need for single-use plastic bottles.",
      },
      {
        id:9,
        name: "Natural Loofah Sponge",
        price: 7.49,
        stock: 10,
        description:
          "A biodegradable, natural loofah sponge for exfoliating and cleansing, perfect for reducing synthetic plastic sponges.",
      },
      {
        id:10,
        name: "Eco-Friendly Yoga Mat",
        price: 45.0,
        stock: 10,
        description:
          "A non-toxic, biodegradable yoga mat made from sustainably harvested natural rubber, offering excellent grip and cushioning.",
      },
    ];
  
    return (
      <>
        <Box px="5%">
          <Text mt="9%" fontSize="4xl" fontWeight="extrabold">
            Redeem our Sustainable Products
          </Text>
          <Box display="flex" justifyContent="space-between" minWidth="300px" flexWrap="wrap">
            {products.map((product, index) => (
              <Card key={index} maxW="sm" mb="4">
                <CardBody>
                  <Image
                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                    alt="Eco-friendly product"
                    borderRadius="lg"
                  />
                  <Stack mt="6" spacing="3">
                    <Heading size="md">{product.name}</Heading>
                    <Text>{product.description}</Text>
                    
                  </Stack>
                </CardBody>
                <Divider />
                <CardFooter display="flex" justifyContent="space-between">
                    <Text fontSize="2xl">
                    🪙{product.price}
                    </Text>
                    <Button variant="solid" colorScheme="green">
                      Buy now
                    </Button>
                </CardFooter>
              </Card>
            ))}
          </Box>
        </Box>
      </>
    );
  }
  