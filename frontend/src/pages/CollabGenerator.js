import { useState } from "react";
import {
  VStack,
  Input,
  Button,
  Container,
  Heading,
  Text,
  Image,
  Box,
  useToast,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { useCollabs } from "../context/CollabContext";
import axios from "axios";
import config from "../config/config.js";

function CollabGenerator() {
  const [brand1, setBrand1] = useState("");
  const [brand2, setBrand2] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedCollab, setGeneratedCollab] = useState(null);
  const { addCollab, refreshCollabs } = useCollabs();
  const toast = useToast();

  const handleGenerate = async () => {
    if (!brand1 || !brand2) {
      toast({
        title: "Error",
        description: "Please enter both brands",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    setGeneratedCollab(null);

    try {
      const response = await axios.post(
        `${config.API_URL}/api/generate-collab`,
        {
          brand1: brand1.trim(),
          brand2: brand2.trim(),
        }
      );

      if (response.data.success) {
        const newCollab = response.data.data;
        setGeneratedCollab(newCollab);
        addCollab(newCollab);
        await refreshCollabs();
        toast({
          title: "Success!",
          description: "Your drip has been generated",
          status: "success",
          duration: 3000,
        });
        setBrand1("");
        setBrand2("");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to generate collab",
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <VStack spacing={3}>
          <Heading>Generate Your Dream Collab</Heading>
          <Text color="gray.600" textAlign="center">
            Mix any two brands for some AI-powered drip
          </Text>
        </VStack>

        <Box
          p={6}
          borderRadius="lg"
          bg="white"
          boxShadow="sm"
          border="1px"
          borderColor="gray.100"
        >
          <VStack spacing={4}>
            <Input
              placeholder="Enter first brand (e.g., Nike)"
              value={brand1}
              onChange={(e) => setBrand1(e.target.value)}
              size="lg"
            />
            <Input
              placeholder="Enter second brand (e.g., IKEA)"
              value={brand2}
              onChange={(e) => setBrand2(e.target.value)}
              size="lg"
            />
            <Button
              colorScheme="purple"
              size="lg"
              onClick={handleGenerate}
              isLoading={loading}
              loadingText="Generating Drip..."
              w="100%"
            >
              Generate Drip
            </Button>
          </VStack>
        </Box>

        {loading && (
          <Box textAlign="center" py={4}>
            <Text fontSize="lg" color="purple.600" fontWeight="medium">
              Please wait, your drip is getting ready! 🔥
            </Text>
          </Box>
        )}

        {generatedCollab && (
          <Box
            mt={8}
            p={6}
            borderRadius="lg"
            bg="white"
            boxShadow="xl"
            border="1px"
            borderColor="purple.100"
          >
            <VStack spacing={6} align="stretch">
              <Badge
                colorScheme="purple"
                fontSize="lg"
                p={2}
                borderRadius="md"
                textAlign="center"
              >
                {generatedCollab.brand1} × {generatedCollab.brand2}
              </Badge>

              <Box
                borderRadius="lg"
                overflow="hidden"
                border="1px"
                borderColor="gray.200"
              >
                <Image
                  src={generatedCollab.imageUrl}
                  alt={`${generatedCollab.brand1} x ${generatedCollab.brand2}`}
                  w="100%"
                  h="auto"
                  objectFit="cover"
                />
              </Box>

              <VStack align="stretch" spacing={3}>
                <Text fontWeight="bold" fontSize="lg" color="gray.700">
                  Description
                </Text>
                <Text color="gray.600">{generatedCollab.description}</Text>
                <Text fontSize="sm" color="gray.400">
                  Generated on:{" "}
                  {new Date(generatedCollab.createdAt).toLocaleString()}
                </Text>
              </VStack>
            </VStack>
          </Box>
        )}
      </VStack>
    </Container>
  );
}

export default CollabGenerator;
