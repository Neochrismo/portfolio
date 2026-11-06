import React from "react";
import FullScreenSection from "./FullScreenSection";
import { Box, Heading, VStack, Text, Image, Stack, Button, HStack } from "@chakra-ui/react";
import { LuArrowDown } from "react-icons/lu";

const MyStory = "Building What Matters";
const StorySection = "Every Project Starts with a Story — Mine is Environment-Driven";
const MyPhilosophy = "Your Ideas Are Not Useless — They Just Need the Right Platform";
const MyMission = "From Inspiration to Impact";

const LandingSection = () => {
  const handleScrollToContact = () => {
    const contactElement = document.getElementById("contactme-section");
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <FullScreenSection display="flex" flexDirection="column" justifyContent="center" py={20}>
      <VStack spacing={16} w="full" maxW="1200px" mx="auto" px={{ base: 4, md: 8 }}>

        {/* --- MAIN TITLE --- */}
        <VStack spacing={2} textAlign="center">
          <Heading as="h1" textStyle={{ base: "2xl", md: "5xl" }} fontWeight="bold">
            {MyStory}
          </Heading>
        </VStack>

        {/* --- SECTION 1: Intro --- */}
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={{ base: 6, md: 12 }}
          align="center"
          justify="space-between"
          w="full"
        >
          <Box flex="1">
            <Text textStyle={{ base: "md", md: "xl" }} lineHeight="tall">
              Every project starts with a story —
              <span style={{ color: "#319795", fontWeight: "bold" }}> yours and mine.</span>
              <br /><br />
              I help clients transform ideas into meaningful digital experiences that connect with people and grow businesses.
            </Text>
          </Box>

          <Box flexShrink={0} mx="auto">
            <Image
              boxSize={{ base: "220px", md: "280px" }}
              objectFit="cover"
              borderRadius="xl"
              boxShadow="lg"
              src="/building.jpeg"
              alt="Building What Matters"
            />
          </Box>
        </Stack>

        {/* --- SECTION 2: Story Section --- */}
        <VStack spacing={8} align="stretch" w="full">
          <Heading
            as="h2"
            textStyle={{ base: "xl", md: "3xl" }}
            textAlign="center"
            fontWeight="semibold"
          >
            {StorySection}
          </Heading>

          <Stack
            direction={{ base: "column", md: "row-reverse" }}
            spacing={{ base: 6, md: 12 }}
            align="center"
            justify="space-between"
          >
            <Box flex="1">
              <Text textStyle={{ base: "md", md: "xl" }} lineHeight="tall">
                I have always been someone who wanted to do something new. That mindset changed when I read “Steal Like an Artist.” The book taught me that nothing in the creative world is entirely new; every idea is inspired by something that came before it, reimagined into something meaningful.
                <br /><br />
                That message changed how I see creativity. I began to find value in what others might overlook. I believe nothing is truly a waste, we just have not discovered its purpose yet.
              </Text>
            </Box>

            <Box flexShrink={0} mx="auto">
              <Image
                boxSize={{ base: "220px", md: "280px" }}
                objectFit="cover"
                borderRadius="xl"
                boxShadow="lg"
                src="/anartist.jpeg"
                alt="Steal Like an Artist"
              />
            </Box>
          </Stack>
        </VStack>

        {/* --- SECTION 3: Philosophy --- */}
        <VStack spacing={6} textAlign="center" maxW="900px" mx="auto">
          <Heading as="h2" textStyle={{ base: "xl", md: "4xl" }} fontWeight="semibold">
            {MyPhilosophy}
          </Heading>
          <Text textStyle={{ base: "md", md: "xl" }} lineHeight="tall">
            Every concept has <span style={{ color: "#319795", fontWeight: "bold" }}>potential.</span>
            <br />
            Sometimes, others do not see it, not because your idea lacks value, but because its purpose has not been fully understood.
            <br /><br />
            That is where I come in. My passion lies in helping clients uncover that hidden potential, shaping raw ideas into digital products that inspire confidence and drive results.
          </Text>
        </VStack>

        {/* --- SECTION 4: Why I Build & CTA --- */}
        <VStack spacing={6} textAlign="center" maxW="900px" mx="auto" pb={10}>
          <Text fontSize="sm" fontWeight="bold" letterSpacing="widest" color="#319795" textTransform="uppercase">
            Why I Build
          </Text>
          <Heading as="h2" textStyle={{ base: "2xl", md: "4xl" }}>
            {MyMission}
          </Heading>
          <Text textStyle={{ base: "md", md: "xl" }} lineHeight="tall">
            This belief sparked my journey into web development, turning creativity into clarity, and ideas into results.
            <br />
            Today, I build with one goal: To create meaningful digital experiences that truly matter to you and your business.
          </Text>

          <Button
            size="lg"
            bg="#319795"
            color="white"
            _hover={{ bg: "#2c7a7b" }}
            onClick={handleScrollToContact}
            mt={4}
          >
            <HStack spacing={2} align="center">
              <span>Contact me now</span>
              <LuArrowDown />
            </HStack>
          </Button>
        </VStack>

      </VStack>
    </FullScreenSection>
  );
};

export default LandingSection;