import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ marginTop: "8vh" }}>
      <Box>
        <Box display="flex" bg="#38a169" borderBottomRadius="80%">
          <Box
            width="60%"
            display="flex"
            justifyContent="center"
            flexDirection="row"
            alignItems="center"
          >
            <Text px="10%" fontWeight="extrabold" color="white" fontSize="5xl">
              Travel Green, Explore More, Sustain Forever
            </Text>
          </Box>
          <Box width="40%">
            <Image src="/hero.png" alt="src" width="100%" />
          </Box>
        </Box>
        <Box mt="10%" px="5%" mb="5%">
          <Text fontSize="3xl" fontWeight="bold">
            {/* Explore our EcoSystem */}
            Discover the Green Way Forward
          </Text>
          <Box display="flex" gap="20px" flexDirection="row">
            <Card>
              <CardHeader>
                <Heading size="md">Sustainable Travel Route Planner</Heading>
              </CardHeader>
              <CardBody>
                <Text fontStyle="italic" fontWeight="light">
                  "Plan Smarter, Travel Greener: Discover eco-friendly routes
                  for a better tomorrow!"
                </Text>
              </CardBody>
              <Link to="/travelplan">
                <CardFooter
                  cursor="pointer"
                  display="flex"
                  alignItems="center"
                  gap="5px"
                >
                  <Text fontSize="larger">Explore Now</Text>
                  <FaArrowAltCircleRight fontSize="larger" />
                </CardFooter>
              </Link>
            </Card>
            <Card>
              <CardHeader>
                <Heading size="md">Explore Biodiversity</Heading>
              </CardHeader>
              <CardBody>
                <Text fontStyle="italic" fontWeight="light">
                  "Snap, Learn, Conserve: Unlock the secrets of nature with just
                  a photo!"
                </Text>
              </CardBody>
              <Link to="/biodiversity">
                <CardFooter
                  cursor="pointer"
                  display="flex"
                  alignItems="center"
                  gap="5px"
                >
                  <Text fontSize="larger">Explore Now</Text>
                  <FaArrowAltCircleRight fontSize="larger" />
                </CardFooter>
              </Link>
            </Card>
            <Card>
              <CardHeader>
                <Heading size="md">Carbon Points & Marketplace</Heading>
              </CardHeader>
              <CardBody>
                <Text fontStyle="italic" fontWeight="light">
                  "Earn Green Rewards: Save emissions, redeem eco-friendly
                  treasures!"
                </Text>
              </CardBody>
              <Link to="/marketplace">
                <CardFooter
                  cursor="pointer"
                  display="flex"
                  alignItems="center"
                  gap="5px"
                >
                  <Text fontSize="larger">Explore Now</Text>
                  <FaArrowAltCircleRight fontSize="larger" />
                </CardFooter>
              </Link>
            </Card>
            <Card>
              <CardHeader>
                <Heading size="md">VR Nature Exploration</Heading>
              </CardHeader>
              <CardBody>
                <Text fontStyle="italic" fontWeight="light">
                  "Experience Nature Anywhere: Dive into breathtaking VR
                  adventures!"
                </Text>
              </CardBody>
              <CardFooter
                cursor="pointer"
                display="flex"
                alignItems="center"
                gap="5px"
              >
                <Text fontSize="larger">Explore Now</Text>
                <FaArrowAltCircleRight fontSize="larger" />
              </CardFooter>
            </Card>
          </Box>
        </Box>
      </Box>
    </div>
  );
}
