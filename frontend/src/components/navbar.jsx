import { Box, Button, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function Navbar({bg="#38a169"}) {
  return (
    <>
      <Box
        height="16"
        bg={bg}
        display="flex"
        justifyContent="space-between"
        flexDirection="row"
        alignItems="center"
        px="2%"
      >
        <Box>
          <Text fontSize="4xl" fontWeight="extrabold" color="white">
            EcoVoyage
          </Text>
        </Box>
        <Box>
          <Link to="/login">
            <Button mx="10px">Login</Button>
          </Link>
          <Link to="/signup">
            <Button colorScheme="#38a169">SignUp</Button>
          </Link>
        </Box>
      </Box>
    </>
  );
}
