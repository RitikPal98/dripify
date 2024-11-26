import { useState } from "react";
import {
  VStack,
  Input,
  Button,
  Container,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useCollabs } from "../context/CollabContext";
import axios from "axios";
import config from "../config/config.js";

function CollabGenerator() {
  const [brand1, setBrand1] = useState("");
  const [brand2, setBrand2] = useState("");
  const [loading, setLoading] = useState(false);
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
        `${config.API_URL}/api/generate-collab`,
        {
          brand1: brand1.trim(),
          brand2: brand2.trim(),
        }
      );

      if (response.data.success) {
        const newCollab = response.data.data;
        addCollab(newCollab);
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
      </VStack>
    </Container>
  );
}

export default CollabGenerator;
