import {
  Box,
  Image,
  Text,
  Badge,
  VStack,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { DeleteIcon, ViewIcon } from "@chakra-ui/icons";

function CollabCard({ collab, handleView, handleDelete }) {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      transition="transform 0.2s"
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "lg",
        borderColor: "purple.200",
      }}
      bg="white"
    >
      <Image
        src={collab.imageUrl}
        alt={`${collab.brand1} x ${collab.brand2}`}
        width="100%"
        height="200px"
        objectFit="cover"
      />
      <VStack p={4} align="start" spacing={2}>
        <HStack justify="space-between" width="100%">
          <Badge colorScheme="purple" fontSize="sm">
            {collab.brand1} x {collab.brand2}
          </Badge>
          <HStack spacing={2}>
            <IconButton
              icon={<ViewIcon fontSize="1.5rem" />}
              size="lg"
              colorScheme="purple"
              variant="ghost"
              onClick={() => handleView(collab)}
              aria-label="View collab"
            />
            <IconButton
              icon={<DeleteIcon />}
              size="sm"
              colorScheme="red"
              variant="ghost"
              onClick={() => handleDelete(collab._id)}
              aria-label="Delete collab"
              display="none"
            />
          </HStack>
        </HStack>
        <Text fontSize="md" color="gray.600" noOfLines={2}>
          {collab.description}
        </Text>
        <Text fontSize="xs" color="gray.400">
          {new Date(collab.createdAt).toLocaleDateString()}
        </Text>
      </VStack>
    </Box>
  );
}

export default CollabCard;
