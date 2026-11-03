import React from "react";
import {  Heading, VStack,Image } from "@chakra-ui/react";
import FullScreenSection from "./FullScreenSection";

const greeting = "Hello, I am Oluwaniyi!";
const bio1 = "A full-stack developer";
const bio2 = "specialized in React and Node.js";

const HeroSection = () => {

  return (
<FullScreenSection
   display="flex"
 >
   <VStack w= "100%" px={{ base: "6", md: "12"}}>
     <VStack gap="2" alignItems="center">
      <Image
        src="/myphoto.JPG"
        alt="Oluwaniyi Adeloye"
        style={{ borderRadius: "50%", width: "150px", height: "150px" }}
      />
       <Heading as="h4" size="md" alignItems="center" textAlign="center">
         {greeting}
       </Heading>
     </VStack>
     <VStack gap="2">
       <Heading as="h1" size="lg" alignItems="center" textAlign="center">
         {bio1}
       </Heading>
       <Heading as="h1" size="lg" alignItems="center" textAlign="center">
         {bio2}
       </Heading>
     </VStack>
   </VStack>
 </FullScreenSection>
  );
}

export default HeroSection;