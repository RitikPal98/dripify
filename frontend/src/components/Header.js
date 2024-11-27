import { Box, Flex, Heading, Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

function Header() {
  return (
    <Box as="header" bg="purple.600" color="white" py={4}>
      <Flex
        maxW="1200px"
        mx="auto"
        px={4}
        align="center"
        justify="space-between"
      >
        <RouterLink to="/">
          <Heading size="lg">Dripify</Heading>
        </RouterLink>
        <Flex gap={6}>
          <ChakraLink
            as={RouterLink}
            to="/"
            fontSize="1.2rem"
            fontWeight="bold"
            _hover={{ color: "purple.200" }}
          >
            Generate
          </ChakraLink>
          <ChakraLink
            as={RouterLink}
            to="/gallery"
            fontSize="1.2rem"
            fontWeight="bold"
            _hover={{ color: "purple.200" }}
          >
            Gallery
          </ChakraLink>
        </Flex>
      </Flex>
    </Box>
  );
}

export default Header;
