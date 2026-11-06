import * as React from "react";
import { VStack } from "@chakra-ui/react";
import { useColorModeValue } from "../components/color-mode";


const FullScreenSection = ({ children, backgroundColor, ...boxProps }) => {

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