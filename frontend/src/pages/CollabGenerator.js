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
} from "@chakra-ui/react";
import { useCollabs } from "../context/CollabContext";
import axios from "axios";

function CollabGenerator() {
  const [brand1, setBrand1] = useState("");
  const [brand2, setBrand2] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentCollab, setCurrentCollab] = useState(null);
  const { addCollab } = useCollabs();
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
    try {
      const response = await axios.post(
        "http://localhost:5000/api/generate-collab",
        {
          brand1: brand1.trim(),
          brand2: brand2.trim(),
        }
      );

      if (response.data.success) {
        const newCollab = response.data.data;
        setCurrentCollab(newCollab);
        addCollab(newCollab);
        toast({
          title: "Success!",
          description: "Your drip has been generated",
          status: "success",
          duration: 3000,
        });
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
      <VStack spacing={8}>
        <Heading>Generate Your Dream Collab</Heading>
        <Text color="gray.600">
          Mix any two brands for some AI-powered drip
        </Text>

        <VStack w="100%" spacing={4}>
          <Input
            placeholder="Enter first brand (e.g., Nike)"
            value={brand1}
            onChange={(e) => setBrand1(e.target.value)}
          />
          <Input
            placeholder="Enter second brand (e.g., IKEA)"
            value={brand2}
            onChange={(e) => setBrand2(e.target.value)}
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

        {currentCollab && (
          <Box
            w="100%"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="xl"
            bg="white"
          >
            <Image
              src={currentCollab.imageUrl}
              alt={`${currentCollab.brand1} x ${currentCollab.brand2}`}
              w="100%"
              h="auto"
            />
            <Box p={6}>
              <Text fontSize="xl" fontWeight="bold" mb={2}>
                {currentCollab.brand1} x {currentCollab.brand2}
              </Text>
              <Text color="gray.600">{currentCollab.description}</Text>
            </Box>
          </Box>
        )}
      </VStack>
    </Container>
  );
}

export default CollabGenerator;
