import React, { useState, useRef, useEffect } from "react";
import {
  ChakraProvider, Box, Flex, Input, Button, Text, VStack, HStack, Heading, useColorMode, IconButton,
  Avatar, Divider, InputGroup, InputRightElement, Textarea, useDisclosure
} from "@chakra-ui/react";
import { SunIcon, MoonIcon, AddIcon, ChatIcon, SettingsIcon, HamburgerIcon } from "@chakra-ui/icons";
import ReactMarkdown from "react-markdown";

function ChatBubble({ role, content }) {
  const isUser = role === "user";
  const { colorMode } = useColorMode();

  return (
    <Flex justify={isUser ? "flex-end" : "flex-start"} mb={4} align="flex-start">
      {!isUser && (
        <Avatar
          size="sm"
          name="Oji"
          bg="purple.500"
          color="white"
          mr={3}
          mt={1}
        />
      )}
      <Box
        bg={isUser ? "blue.500" : (colorMode === "dark" ? "gray.700" : "gray.100")}
        color={isUser ? "white" : (colorMode === "dark" ? "white" : "black")}
        px={4}
        py={3}
        borderRadius="xl"
        maxW="75%"
        minW="fit-content"
        width="fit-content"
        boxShadow={isUser ? "md" : "none"}
        border={!isUser && colorMode === "light" ? "1px solid" : "none"}
        borderColor={!isUser && colorMode === "light" ? "gray.200" : "transparent"}
      >
        <Box lineHeight="1.5" sx={{
          '& p': { margin: 0, marginBottom: 2 },
          '& p:last-child': { marginBottom: 0 },
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            marginTop: 2,
            marginBottom: 1,
            fontWeight: 'bold'
          },
          '& ul, & ol': {
            marginLeft: 4,
            marginBottom: 2
          },
          '& li': { marginBottom: 1 },
          '& pre': {
            backgroundColor: colorMode === "dark" ? "gray.800" : "gray.50",
            padding: 2,
            borderRadius: "md",
            marginBottom: 2,
            overflow: "auto"
          },
          '& code': {
            backgroundColor: colorMode === "dark" ? "gray.800" : "gray.50",
            padding: "2px 4px",
            borderRadius: "sm",
            fontSize: "0.9em"
          },
          '& blockquote': {
            borderLeft: "4px solid",
            borderColor: colorMode === "dark" ? "gray.600" : "gray.300",
            paddingLeft: 3,
            marginLeft: 2,
            marginBottom: 2
          }
        }}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </Box>
      </Box>
      {isUser && (
        <Avatar
          size="sm"
          name="User"
          bg="blue.500"
          color="white"
          ml={3}
          mt={1}
        />
      )}
    </Flex>
  );
}

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([
    { id: 1, name: "New Chat" }
  ]);
  const [activeChat, setActiveChat] = useState(1);
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen: isSidebarOpen, onToggle: toggleSidebar } = useDisclosure();
  const chatRef = useRef(null);

  const createNewChat = () => {
    const newId = chats.length + 1;
    setChats([...chats, { id: newId, name: "New Chat" }]);
    setActiveChat(newId);
    setMessages([]);
  };

  const generateChatName = (message) => {
    // 获取消息的前30个字符作为聊天名称
    const cleanMessage = message.trim().replace(/\n/g, ' ');
    if (cleanMessage.length <= 30) {
      return cleanMessage;
    }
    return cleanMessage.substring(0, 30) + '...';
  };

  const updateChatName = (chatId, newName) => {
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId ? { ...chat, name: newName } : chat
      )
    );
  };

  const WelcomeScreen = () => (
    <Flex
      direction="column"
      align="center"
      justify="center"
      height="100%"
      textAlign="center"
      px={8}
    >
      <Avatar
        size="2xl"
        name="Oji"
        bg="purple.500"
        color="white"
        mb={6}
      />
      <Heading size="lg" mb={2} color={colorMode === "dark" ? "white" : "gray.800"}>
        Welcome to Oji
      </Heading>
      <Text color={colorMode === "dark" ? "gray.400" : "gray.600"} fontSize="lg">
        How can I help you today?
      </Text>
    </Flex>
  );

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    const currentInput = input.trim();

    // 如果这是第一条消息，自动生成聊天名称
    if (messages.length === 0) {
      const newChatName = generateChatName(currentInput);
      updateChatName(activeChat, newChatName);
    }

    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:9068/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [...messages, userMessage],
        }),
      });
      const data = await response.json();
      const aiMessage = data.choices[0].message;
      setMessages((msgs) => [...msgs, aiMessage]);
    } catch (e) {
      alert("请求失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChakraProvider>
      <Flex
        height="100vh"
        width="100vw"
        bg={colorMode === "dark" ? "gray.800" : "gray.50"}
        position="relative"
        overflow="hidden"
      >
        {/* 移动端遮罩层 */}
        {isSidebarOpen && (
          <Box
            position="fixed"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="blackAlpha.600"
            zIndex={5}
            display={{ base: "block", md: "none" }}
            onClick={toggleSidebar}
          />
        )}

        {/* 左侧侧边栏 */}
        <Box
          w={{ base: isSidebarOpen ? "min(280px, 80vw)" : "0", md: "min(280px, 25vw)", lg: "280px" }}
          display={{ base: isSidebarOpen ? "flex" : "none", md: "flex" }}
          bg={colorMode === "dark" ? "gray.900" : "white"}
          borderRight="1px"
          borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
          flexDirection="column"
          position={{ base: "absolute", md: "relative" }}
          zIndex={{ base: 10, md: "auto" }}
          height="100vh"
          transition="all 0.3s"
        >
          {/* 侧边栏头部 */}
          <Box p={4}>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              variant="outline"
              size="sm"
              width="100%"
              onClick={createNewChat}
            >
              New Chat
            </Button>
          </Box>

          {/* 聊天列表 */}
          <Box flex="1" overflowY="auto">
            <Text
              px={4}
              py={2}
              fontSize="sm"
              fontWeight="bold"
              color={colorMode === "dark" ? "gray.400" : "gray.600"}
            >
              Chats
            </Text>
            {chats.map((chat) => (
              <Box
                key={chat.id}
                px={4}
                py={3}
                cursor="pointer"
                bg={activeChat === chat.id ? (colorMode === "dark" ? "gray.700" : "blue.50") : "transparent"}
                borderLeft={activeChat === chat.id ? "3px solid" : "3px solid transparent"}
                borderColor={activeChat === chat.id ? "blue.500" : "transparent"}
                _hover={{ bg: colorMode === "dark" ? "gray.700" : "gray.100" }}
                onClick={() => setActiveChat(chat.id)}
              >
                <HStack>
                  <ChatIcon size="sm" color={colorMode === "dark" ? "gray.400" : "gray.500"} />
                  <Text fontSize="sm" fontWeight="medium" isTruncated flex="1">
                    {chat.name}
                  </Text>
                </HStack>
              </Box>
            ))}
          </Box>

          {/* 侧边栏底部 */}
          <Box p={4} borderTop="1px" borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}>
            <HStack justify="space-between">
              <IconButton
                icon={<SettingsIcon />}
                variant="ghost"
                size="sm"
                aria-label="Settings"
              />
              <IconButton
                icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
                onClick={toggleColorMode}
                variant="ghost"
                size="sm"
                aria-label="Toggle theme"
              />
            </HStack>
          </Box>
        </Box>

        {/* 主聊天区域 */}
        <Flex flex="1" direction="column">
          {/* 移动端顶部栏 */}
          <Box
            display={{ base: "block", md: "none" }}
            px={4}
            py={3}
            borderBottom="1px"
            borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
            bg={colorMode === "dark" ? "gray.900" : "white"}
          >
            <HStack justify="space-between" align="center">
              <IconButton
                icon={<HamburgerIcon />}
                onClick={toggleSidebar}
                variant="ghost"
                size="sm"
                aria-label="Toggle menu"
              />
              <Heading size="sm">Oji</Heading>
              <IconButton
                icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
                onClick={toggleColorMode}
                variant="ghost"
                size="sm"
                aria-label="Toggle theme"
              />
            </HStack>
          </Box>

          {/* 聊天内容区 */}
          <Box
            ref={chatRef}
            flex="1"
            overflowY="auto"
            px={{ base: 4, md: 6 }}
            py={4}
            pb="120px"
            bg={colorMode === "dark" ? "gray.800" : "gray.50"}
          >
            {messages.length === 0 ? (
              <WelcomeScreen />
            ) : (
              <VStack align="stretch" spacing={1} w="100%">
                {messages.map((msg, idx) => (
                  <ChatBubble key={idx} role={msg.role} content={msg.content} />
                ))}
                {loading && (
                  <Flex align="center" mb={4}>
                    <Avatar size="sm" name="Oji" bg="purple.500" color="white" mr={3} />
                    <Text color={colorMode === "dark" ? "gray.400" : "gray.600"}>
                      Oji is thinking...
                    </Text>
                  </Flex>
                )}
              </VStack>
            )}
          </Box>

          {/* 输入区 */}
          <Box
            position="sticky"
            bottom={0}
            left={0}
            right={0}
            px={{ base: 4, md: 6 }}
            py={4}
            borderTop="1px"
            borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
            bg={colorMode === "dark" ? "gray.800" : "gray.50"}
            zIndex={1}
          >
            <Box maxW="600px" mx="auto" w="100%">
              <InputGroup>
                <Textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  isDisabled={loading}
                  resize="none"
                  minH="50px"
                  pr="90px"
                  bg={colorMode === "dark" ? "gray.700" : "white"}
                  border="1px solid"
                  borderColor={colorMode === "dark" ? "gray.600" : "gray.300"}
                  _focus={{
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 1px blue.500"
                  }}
                />
                <InputRightElement
                  height="50px"
                  width="90px"
                  top={0}
                  right="4px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Button
                    onClick={sendMessage}
                    isLoading={loading}
                    colorScheme="blue"
                    size="sm"
                    px={4}
                    minW="70px"
                    height="40px"
                    isDisabled={!input.trim()}
                  >
                    Send
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Text
                fontSize="xs"
                color={colorMode === "dark" ? "gray.500" : "gray.400"}
                textAlign="center"
                mt={2}
              >
                Press Enter to send, Shift+Enter for new line
              </Text>
            </Box>
          </Box>
        </Flex>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
