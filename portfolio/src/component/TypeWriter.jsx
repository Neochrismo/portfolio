import React from "react";
import { Box } from "@chakra-ui/react";
import { useTypingEffect } from "../Hook/useTypingEffect";

const TypewriterMessage = ({ text, isLatest, onTypingComplete }) => {
  // Only apply typing animation if it's the latest message being added
  const animatedText = useTypingEffect(isLatest ? text : "", 30, onTypingComplete);
  const content = isLatest ? animatedText : text;

  return (
    <Box
      alignSelf="flex-start"
      bg="white"
      color="gray.800"
      px={3}
      py={2}
      borderRadius="lg"
      maxW="82%"
      fontSize="sm"
      shadow="xs"
      border="1px solid"
      borderColor="gray.200"
    >
      {content}
    </Box>
  );
};

export default TypewriterMessage;