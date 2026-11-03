import * as React from "react";
import { VStack } from "@chakra-ui/react";
import { useColorModeValue } from "../components/color-mode";

/**
 * Illustrates the use of children prop and spread operator with responsive padding and clean default background.
 */
const FullScreenSection = ({ children, backgroundColor, ...boxProps }) => {
  // Set default light mode background to pure white
  const defaultBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");

  return (
    <VStack
      width="100vw"
      minHeight="100dvh"
      backgroundColor={backgroundColor || defaultBg}
      color={textColor}
      display="flex"
      justifyContent="center"
      alignItems="center"
      // Added responsive padding (px) and py so content isn't flush against small screen edges
      px={{ base: 4, md: 8, lg: 12 }}
      py={{ base: 8, md: 12 }}
      {...boxProps}
    >
      <VStack maxWidth="1280px" width="100%">
        {children}
      </VStack>
    </VStack>
  );
};

export default FullScreenSection;