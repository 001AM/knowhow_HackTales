import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  Text,
} from "@chakra-ui/react";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Biodiversity() {
  return (
    <>
      <Box mt="10%">
        <Text fontSize="4xl" textAlign="center">
        Get Expert Knowledge by Uploading Any Species Photo
        </Text>
        <Box display="flex" justifyContent="space-around" my="5%">
          <Card>
            <CardBody
              display="flex"
              justifyContent="center"
              flexDirection="column"
              alignItems="center"
            >
              <Image src="/leaf.png" maxH="200px" maxW="200px" />
              <Text fontSize="xl">
              Share Your Plant Pics Here to Unlock Amazing Insights
              </Text>
            </CardBody>
            <CardFooter display="flex" justifyContent="center">
              <Link to="/biodiversity/leaf">
                <Button colorScheme="green" gap="10px">
                  <Text>Explore Now</Text>
                  <FaArrowAltCircleRight />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardBody
              display="flex"
              justifyContent="center"
              flexDirection="column"
              alignItems="center"
            >
              <Image src="/eagle.png" maxH="200px" maxW="200px" />
              <Text fontSize="xl">
              Upload Your Bird Photos Here for Fascinating Facts
              </Text>
            </CardBody>
            <CardFooter display="flex" justifyContent="center">
              <Link to="/biodiversity/bird">
                <Button colorScheme="green" gap="10px">
                  <Text>Explore Now</Text>
                  <FaArrowAltCircleRight />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </Box>
      </Box>
    </>
  );
}
