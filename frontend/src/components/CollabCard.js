import {
  Box,
  Image,
  Text,
  Badge,
  VStack,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { DeleteIcon, ViewIcon, DownloadIcon } from "@chakra-ui/icons";
import React from "react";

const CollabCard = React.memo(({ collab, handleView, handleDelete }) => {
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
        loading="lazy"
      />
      <VStack p={4} align="start" spacing={2}>
        <HStack justify="space-between" width="100%">
          <Badge colorScheme="purple" fontSize="sm">
            {collab.brand1} x {collab.brand2}
          </Badge>
          <HStack spacing={2}>
            <IconButton
              icon={<ViewIcon fontSize={"1.4rem"} />}
              size="md"
              colorScheme="purple"
              variant="outline"
              onClick={() => handleView(collab)}
              aria-label="View collab"
            />
            <IconButton
              icon={<DeleteIcon />}
              size="sm"
              colorScheme="red"
              variant="outline"
              onClick={() => handleDelete(collab._id)}
              aria-label="Delete collab"
              display="none"
            />
            <IconButton
              icon={<DownloadIcon />}
              as="a"
              href={collab.imageUrl}
              download
              size="md"
              colorScheme="purple"
              variant="outline"
              aria-label="Download image"
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
});

export default CollabCard;
