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
import { useState, useEffect } from "react";

function Gallery() {
  const { collabs, loading, deleteCollab } = useCollabs();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCollab, setSelectedCollab] = useState(null);
  const [visibleCollabs, setVisibleCollabs] = useState(9); // Track visible collabs
  const [loadingMore, setLoadingMore] = useState(false); // Track loading state for new collabs

  // Define the view handler
  const handleView = (collab) => {
    setSelectedCollab(collab);
    onOpen();
  };

  // Define the delete handler
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this collab?")) {
      await deleteCollab(id);
      if (selectedCollab && selectedCollab._id === id) {
        onClose();
      }
    }
  };

  // Load more collabs on scroll
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.offsetHeight
    ) {
      setLoadingMore(true); // Set loading state to true
      setVisibleCollabs((prev) => prev + 9); // Load 9 more collabs
      setTimeout(() => setLoadingMore(false), 300); // Reset loading state after animation duration
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (loading) {
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
            {collabs.slice(0, visibleCollabs).map((collab, index) => (
              <Fade
                key={collab._id}
                in={loadingMore || index < visibleCollabs}
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
      </Container>

      {/* View Modal */}
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
