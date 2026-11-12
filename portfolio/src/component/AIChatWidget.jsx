import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  Spinner,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import TypewriterMessage from "./TypeWriter";

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hi! I'm Neo's AI assistant. Ask me about his tech stack, projects, or availability!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  // Auto-scroll as text types out or user sends message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading || isTyping) return;

    const userMsg = input.trim();
    setInput("");

    const currentMessages = [...messages, { sender: "user", text: userMsg }];
    setMessages(currentMessages);
    setLoading(true);

    try {
      // Filter out initial welcome message and any empty AI placeholder entries
      const historyPayload = currentMessages
        .slice(1, -1)
        .filter((msg) => msg.text && msg.text.trim() !== "");

      const response = await fetch(`${BACKEND_URL}/api/ai-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: userMsg,
          history: historyPayload,
        }),
      });

      if (!response.ok) throw new Error("Failed to open connection.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiReply = "";

      // Add initial placeholder for the AI response
      setMessages((prev) => [...prev, { sender: "ai", text: "" }]);
      setLoading(false);
      setIsTyping(true); // <- was missing

      let isFinished = false;

      while (!isFinished) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.replace("data: ", "").trim();

            if (jsonStr === "[DONE]") {
              isFinished = true;
              break;
            }

            try {
              const parsed = JSON.parse(jsonStr);
              if (parsed.text) {
                aiReply += parsed.text;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { sender: "ai", text: aiReply };
                  return updated;
                });
              }
            } catch {
              // Ignore partial JSON chunk parsing errors safely
            }
          }
        }
      }
    } catch {
      console.error("AI Chat SSE Error encountered");
      setIsTyping(false); // make sure the input never stays locked after an error
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Unable to reach the server. Please check your connection.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box position="fixed" bottom="20px" right="20px" zIndex="1000">
      {!isOpen && (
        <Button
          colorScheme="blue"
          color="white"
          borderRadius="full"
          px={5}
          py={6}
          shadow="lg"
          onClick={() => setIsOpen(true)}
          _hover={{ transform: "scale(1.05)" }}
          transition="all 0.2s ease"
        >
          💬 Ask AI Assistant
        </Button>
      )}

      {isOpen && (
        <Flex
          direction="column"
          w={{ base: "290px", sm: "340px" }}
          h="min(440px, 75dvh)"
          bg="white"
          borderRadius="xl"
          shadow="2xl"
          border="1px solid"
          borderColor="gray.200"
          overflow="hidden"
        >
          {/* Header */}
          <Flex
            bg="blue.600"
            color="white"
            px={4}
            py={3}
            justify="space-between"
            align="center"
          >
            <Text fontWeight="bold" fontSize="sm">
              AI Portfolio Assistant
            </Text>
            <IconButton
              aria-label="Close chat"
              size="xs"
              variant="ghost"
              color="white"
              _hover={{ bg: "whiteAlpha.300" }}
              onClick={() => setIsOpen(false)}
            >
              ✕
            </IconButton>
          </Flex>

          {/* Messages Body */}
          <VStack
            flex="1"
            p={3}
            overflowY="auto"
            spacing={3}
            align="stretch"
            bg="gray.50"
          >
            {messages.map((msg, idx) => {
              const isLatestAI =
                msg.sender === "ai" && idx === messages.length - 1;

              if (msg.sender === "user") {
                return (
                  <Box
                    key={idx}
                    alignSelf="flex-end"
                    bg="blue.500"
                    color="white"
                    px={3}
                    py={2}
                    borderRadius="lg"
                    maxW="82%"
                    fontSize="sm"
                    shadow="xs"
                  >
                    {msg.text}
                  </Box>
                );
              }

              return (
                <TypewriterMessage
                  key={idx}
                  text={msg.text}
                  isLatest={isLatestAI && isTyping}
                  onTypingComplete={() => setIsTyping(false)}
                />
              );
            })}

            {loading && (
              <Flex
                alignSelf="flex-start"
                align="center"
                gap={2}
                bg="white"
                px={3}
                py={2}
                borderRadius="lg"
                shadow="xs"
                border="1px solid"
                borderColor="gray.200"
              >
                <Spinner size="xs" color="blue.500" />
                <Text fontSize="xs" color="gray.500">
                  AI is thinking...
                </Text>
              </Flex>
            )}
            <div ref={chatEndRef} />
          </VStack>

          {/* Input Form */}
          <Box
            as="form"
            onSubmit={handleSend}
            p={2}
            bg="white"
            borderTop="1px solid"
            borderColor="gray.100"
          >
            <Flex gap={2}>
              <Input
                placeholder="Ask a follow-up question..."
                size="sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                bg="white"
                color="gray.800"
                _placeholder={{ color: "gray.500" }}
                _disabled={{ opacity: 0.7 }}
                borderColor="gray.300"
                borderRadius="md"
                fontSize="16px"
                isDisabled={loading || isTyping}
              />
              <Button
                type="submit"
                bg="blue.500"
                color="white"
                _hover={{ bg: "blue.600" }}
                _active={{ bg: "blue.700" }}
                _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
                size="sm"
                isLoading={loading}
                isDisabled={isTyping}
              >
                Send
              </Button>
            </Flex>
          </Box>
        </Flex>
      )}
    </Box>
  );
};

export default AIChatWidget;