import { Box, Image, Text } from "@chakra-ui/react";

export default function Home() {
  return (
    <>
      <Box>
        <Box display="flex" bg="#38a169" borderBottomRadius="80%">
          <Box width="60%" display="flex" justifyContent="center" flexDirection="row" alignItems="center">
            <Text px="10%" fontWeight="extrabold" color="white" fontSize="5xl">Travel Green, Explore More, Sustain Forever</Text>
          </Box>
          <Box width="40%">
            <Image src="/hero.png" alt="src" />
          </Box>
        </Box>
      </Box>
    </>
  );
}
