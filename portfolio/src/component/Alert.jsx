import React from 'react';
import { Box, Heading, Text } from "@chakra-ui/react";
import { useAlertContext } from "../context/alertContext";

/**
 * Global alert component using context state to display notification banners.
 */
function Alert() {
  const { isOpen, type, message, onClose } = useAlertContext();

  if (!isOpen) return null;

  const isSuccess = type === "success";

  return (
    <Box
      position="fixed"
      top="20px"
      right="20px"
      zIndex="9999"
      minW="300px"
      maxW="md"
      p={4}
      bg={isSuccess ? '#81C784' : '#852305'}
      color="white"
      borderRadius="md"
      boxShadow="lg"
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      gap={4}
    >
      <Box>
        <Heading as="h4" size="sm" fontWeight="bold" mb={1}>
          {isSuccess ? 'All good!' : 'Oops!'}
        </Heading>
        <Text fontSize="sm">{message}</Text>
      </Box>
      <Box
        as="button"
        onClick={onClose}
        fontSize="lg"
        fontWeight="bold"
        cursor="pointer"
        background="transparent"
        border="none"
        color="white"
        _hover={{ opacity: 0.7 }}
      >
        &times;
      </Box>
    </Box>
  );
}

export default Alert;