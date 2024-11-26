import { Box, Text, Link, Flex } from "@chakra-ui/react";

function Footer() {
  return (
    <Box as="footer" bg="gray.100" py={4} mt="auto">
      <Flex
        maxW="1200px"
        mx="auto"
        px={4}
        justify="center"
        align="center"
        direction="column"
      >
        <Text fontSize="lg" fontWeight="bold" color="purple.600">
          Where memes meet fashion 👕✨
        </Text>
        <Text fontSize="sm" color="gray.600" mt={2}>
          Made with 🔥 by Ritik Pal
        </Text>
      </Flex>
    </Box>
  );
}

export default Footer;
