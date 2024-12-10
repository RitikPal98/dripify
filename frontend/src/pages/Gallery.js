import {
  SimpleGrid,
  Container,
  Heading,
  Text,
  Spinner,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
  VStack,
  Badge,
  useDisclosure,
  Box,
  Fade,
} from "@chakra-ui/react";
import { useCollabs } from "../context/CollabContext";
import CollabCard from "../components/CollabCard";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import config from "../config/config.js";

function Gallery() {
  const { deleteCollab } = useCollabs();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCollab, setSelectedCollab] = useState(null);
  const [collabs, setCollabs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchCollabs = async (page) => {
    try {
      const response = await axios.get(`${config.API_URL}/api/collabs`, {
        params: { page, limit: 6 },
      });
      if (response.data.success) {
        setCollabs((prev) => [...prev, ...response.data.data]);
        setTotal(response.data.total);
      }
    } catch (error) {
      console.error("Error fetching collabs:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchCollabs(page);
  }, [page]);

  const handleView = (collab) => {
    setSelectedCollab(collab);
    onOpen();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this collab?")) {
      await deleteCollab(id);
      setCollabs((prev) => prev.filter((collab) => collab._id !== id));
      if (selectedCollab && selectedCollab._id === id) {
        onClose();
      }
    }
  };

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.offsetHeight &&
      collabs.length < total
    ) {
      setLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  }, [collabs.length, total]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  if (loading && page === 1) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color="purple.500" />
      </Center>
    );
  }

  return (
    <>
      <Container maxW="container.xl" py={8}>
        <Heading color="rgb(112, 41, 99)" mb={2}>
          Drip Gallery
        </Heading>
        <Text color="gray.600" mb={8}>
          Check out these fire collabs 🔥
        </Text>
        {collabs.length === 0 ? (
          <Text color="gray.500" textAlign="center">
            No collabs generated yet. Head to the generator to create some drip!
          </Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {collabs.map((collab, index) => (
              <Fade
                key={collab._id}
                in={loadingMore || index < collabs.length}
                transition={{ enter: { duration: 0.5 } }}
              >
                <CollabCard
                  collab={collab}
                  handleView={handleView}
                  handleDelete={handleDelete}
                />
              </Fade>
            ))}
          </SimpleGrid>
        )}
        {loadingMore && (
          <Center mt={4}>
            <Spinner size="lg" color="purple.500" />
          </Center>
        )}
      </Container>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          {selectedCollab && (
            <>
              <ModalHeader>
                <Badge colorScheme="purple" fontSize="lg">
                  {selectedCollab.brand1} x {selectedCollab.brand2}
                </Badge>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack spacing={4} align="stretch">
                  <Image
                    src={selectedCollab.imageUrl}
                    alt={`${selectedCollab.brand1} x ${selectedCollab.brand2}`}
                    borderRadius="md"
                    width="100%"
                    height="auto"
                    loading="lazy"
                  />
                  <Box>
                    <Text fontSize="lg" fontWeight="bold" mb={2}>
                      Description
                    </Text>
                    <Text color="gray.700">{selectedCollab.description}</Text>
                  </Box>
                  <Text fontSize="sm" color="gray.500">
                    Created on:{" "}
                    {new Date(selectedCollab.createdAt).toLocaleString()}
                  </Text>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="purple" mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button
                  display="none"
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => handleDelete(selectedCollab._id)}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default Gallery;
