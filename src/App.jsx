import React, { useState, useRef, useEffect } from "react";
import {
  ChakraProvider, Box, Flex, Input, Button, Text, VStack, HStack, Heading, useColorMode, IconButton,
  Avatar, Divider, InputGroup, InputRightElement, Textarea, useDisclosure,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Tabs, TabList, TabPanels, Tab, TabPanel, Badge, Select, Checkbox
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
  const [baseUrl, setBaseUrl] = useState("http://localhost:9068/v1");
  const [tempBaseUrl, setTempBaseUrl] = useState("http://localhost:9068/v1");
  const [useStreaming, setUseStreaming] = useState(true);
  const [tempUseStreaming, setTempUseStreaming] = useState(true);
  const [activeSettingsTab, setActiveSettingsTab] = useState(0);
  const [colorTheme, setColorTheme] = useState("Auto");
  const [language, setLanguage] = useState("English");
  const [showSideButtonLabels, setShowSideButtonLabels] = useState(false);
  const [modelGuardrails, setModelGuardrails] = useState("Strict");
  const [showPresetConfirmation, setShowPresetConfirmation] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen: isSidebarOpen, onToggle: toggleSidebar } = useDisclosure();
  const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure();
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

  const handleSettingsOpen = () => {
    setTempBaseUrl(baseUrl);
    setTempUseStreaming(useStreaming);
    onSettingsOpen();
  };

  const handleSettingsSave = () => {
    setBaseUrl(tempBaseUrl);
    setUseStreaming(tempUseStreaming);
    onSettingsClose();
  };

  const handleSettingsCancel = () => {
    setTempBaseUrl(baseUrl);
    setTempUseStreaming(useStreaming);
    onSettingsClose();
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
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [...messages, userMessage],
          stream: useStreaming,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (useStreaming) {
        // Handle streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let streamingMessage = { role: "assistant", content: "" };

        // Add the streaming message to the chat immediately
        setMessages((msgs) => [...msgs, streamingMessage]);

        if (reader) {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value);
              const lines = chunk.split('\n');

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.slice(6);
                  if (data === '[DONE]') {
                    break;
                  }

                  try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices?.[0]?.delta?.content;
                    if (content) {
                      streamingMessage.content += content;
                      // Update the last message in real-time
                      setMessages((msgs) => {
                        const newMsgs = [...msgs];
                        newMsgs[newMsgs.length - 1] = { ...streamingMessage };
                        return newMsgs;
                      });
                    }
                  } catch (e) {
                    // Skip invalid JSON lines
                    console.warn('Failed to parse SSE data:', data);
                  }
                }
              }
            }
          } finally {
            reader.releaseLock();
          }
        }
      } else {
        // Handle non-streaming response
        const data = await response.json();
        const aiMessage = data.choices[0].message;
        setMessages((msgs) => [...msgs, aiMessage]);
      }
    } catch (e) {
      console.error('Request failed:', e);
      alert("请求失败: " + (e.message || "Unknown error"));
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
                onClick={handleSettingsOpen}
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

      {/* Settings Modal */}
      <Modal isOpen={isSettingsOpen} onClose={handleSettingsCancel} size="6xl">
        <ModalOverlay />
        <ModalContent maxW="800px" maxH="80vh">
          <ModalHeader
            borderBottom="1px"
            borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
            pb={4}
          >
            <HStack justify="space-between">
              <Text fontSize="lg" fontWeight="600">App Settings</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody p={0} maxH="calc(80vh - 140px)" overflowY="auto">
            <Tabs
              orientation="vertical"
              variant="line"
              h="100%"
              index={activeSettingsTab}
              onChange={setActiveSettingsTab}
            >
              <TabList
                w="200px"
                borderRight="1px"
                borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
                bg={colorMode === "dark" ? "gray.800" : "gray.50"}
                p={4}
              >
                <Tab
                  justifyContent="flex-start"
                  px={4}
                  py={3}
                  _selected={{
                    bg: colorMode === "dark" ? "gray.700" : "white",
                    borderColor: "blue.500",
                    color: "blue.500"
                  }}
                >
                  General
                </Tab>
                <Tab
                  justifyContent="flex-start"
                  px={4}
                  py={3}
                  _selected={{
                    bg: colorMode === "dark" ? "gray.700" : "white",
                    borderColor: "blue.500",
                    color: "blue.500"
                  }}
                >
                  Chat
                </Tab>
                <Tab
                  justifyContent="flex-start"
                  px={4}
                  py={3}
                  _selected={{
                    bg: colorMode === "dark" ? "gray.700" : "white",
                    borderColor: "blue.500",
                    color: "blue.500"
                  }}
                >
                  Server
                </Tab>
                <Tab
                  justifyContent="flex-start"
                  px={4}
                  py={3}
                  _selected={{
                    bg: colorMode === "dark" ? "gray.700" : "white",
                    borderColor: "blue.500",
                    color: "blue.500"
                  }}
                >
                  Developer
                </Tab>
                <Tab
                  justifyContent="flex-start"
                  px={4}
                  py={3}
                  _selected={{
                    bg: colorMode === "dark" ? "gray.700" : "white",
                    borderColor: "blue.500",
                    color: "blue.500"
                  }}
                >
                  Integrations
                </Tab>
              </TabList>

              <TabPanels
                flex="1"
                p={6}
                bg={colorMode === "dark" ? "gray.800" : "white"}
                overflowY="auto"
              >
                {/* General Tab */}
                <TabPanel p={0} h="100%">
                  <VStack spacing={6} align="stretch" h="100%">
                    {/* App Update Section */}
                    <Box>
                      <HStack mb={4}>
                        <Heading size="md">App Update</Heading>
                        <Button size="sm" variant="outline" leftIcon={<Text>🔄</Text>}>
                          Check for updates
                        </Button>
                      </HStack>
                      <Box
                        bg={colorMode === "dark" ? "gray.700" : "gray.100"}
                        p={4}
                        borderRadius="md"
                      >
                        <Text mb={2}>You are all up to date! The current version is 0.3.20</Text>
                        <HStack>
                          <Text fontSize="sm" color="gray.500">Updates Channel</Text>
                          <Select size="sm" w="120px" value="Stable">
                            <option value="Stable">Stable</option>
                            <option value="Beta">Beta</option>
                          </Select>
                        </HStack>
                      </Box>
                    </Box>

                    {/* Language Section */}
                    <Box>
                      <Heading size="md" color="blue.500" mb={2}>Language</Heading>
                      <Text fontSize="sm" color="gray.500" mb={4}>
                        Choose app language (still in development)
                      </Text>
                      <FormControl>
                        <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
                          <option value="English">English</option>
                          <option value="Chinese">中文</option>
                          <option value="Japanese">日本語</option>
                        </Select>
                      </FormControl>
                      <Text fontSize="xs" color="blue.400" mt={2}>
                        Want to help translate Oji to your language? We would love your help!
                      </Text>
                    </Box>

                    {/* General Section */}
                    <Box>
                      <Heading size="md" color="blue.500" mb={4}>General</Heading>
                      <VStack spacing={4} align="stretch">
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="600">Color Theme</FormLabel>
                          <HStack spacing={2}>
                            {["Auto", "Classic", "Light", "Sepia", "Dark", "Solarized Dark"].map((theme) => (
                              <Button
                                key={theme}
                                size="sm"
                                variant={colorTheme === theme ? "solid" : "outline"}
                                colorScheme={colorTheme === theme ? "blue" : "gray"}
                                onClick={() => setColorTheme(theme)}
                              >
                                {theme}
                              </Button>
                            ))}
                          </HStack>
                        </FormControl>

                        <FormControl>
                          <Checkbox
                            isChecked={showSideButtonLabels}
                            onChange={(e) => setShowSideButtonLabels(e.target.checked)}
                          >
                            <Text fontSize="sm">Show side button labels</Text>
                          </Checkbox>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="600">
                            Model loading guardrails
                            <Text as="span" fontSize="xs" color="gray.500" ml={1}>ⓘ</Text>
                          </FormLabel>
                          <Select
                            value={modelGuardrails}
                            onChange={(e) => setModelGuardrails(e.target.value)}
                          >
                            <option value="None">None</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Strict">Strict</option>
                          </Select>
                          <Text fontSize="xs" color="gray.500" mt={1}>
                            Strong precautions against system overload
                          </Text>
                        </FormControl>

                        <FormControl>
                          <Checkbox
                            isChecked={showPresetConfirmation}
                            onChange={(e) => setShowPresetConfirmation(e.target.checked)}
                          >
                            <Text fontSize="sm">
                              Presets: Show confirmation dialog when committing new fields to the preset
                              <Text as="span" fontSize="xs" color="gray.500" ml={1}>ⓘ</Text>
                            </Text>
                          </Checkbox>
                        </FormControl>
                      </VStack>
                    </Box>
                  </VStack>
                </TabPanel>

                {/* Chat Tab */}
                <TabPanel p={0}>
                  <VStack spacing={6} align="stretch">
                    <Heading size="md">Chat Settings</Heading>
                    <Text color="gray.500">Chat configuration options will be available here.</Text>
                  </VStack>
                </TabPanel>

                {/* Server Tab */}
                <TabPanel p={0}>
                  <VStack spacing={6} align="stretch">
                    <Heading size="md">Server Settings</Heading>
                    <Text color="gray.500" mb={4}>
                      Configure your AI service connection and server settings
                    </Text>

                    {/* AI Service Configuration */}
                    <Box>
                      <Heading size="sm" color="blue.500" mb={4}>AI Service Configuration</Heading>
                      <VStack spacing={4} align="stretch">
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="600">AI Service Base URL</FormLabel>
                          <Input
                            value={tempBaseUrl}
                            onChange={(e) => setTempBaseUrl(e.target.value)}
                            placeholder="http://localhost:9068/v1"
                          />
                          <Text fontSize="xs" color="gray.500" mt={1}>
                            Configure the base URL for your AI service endpoint
                          </Text>
                        </FormControl>

                        <FormControl>
                          <Checkbox
                            isChecked={tempUseStreaming}
                            onChange={(e) => setTempUseStreaming(e.target.checked)}
                          >
                            <VStack align="start" spacing={1}>
                              <Text fontSize="sm">Enable Streaming Response</Text>
                              <Text fontSize="xs" color="gray.500">
                                Stream responses in real-time for faster perceived response times
                              </Text>
                            </VStack>
                          </Checkbox>
                        </FormControl>
                      </VStack>
                    </Box>
                  </VStack>
                </TabPanel>

                {/* Developer Tab */}
                <TabPanel p={0}>
                  <VStack spacing={6} align="stretch">
                    <Heading size="md">Developer Settings</Heading>
                    <Text color="gray.500">Developer tools and advanced options will be available here.</Text>
                  </VStack>
                </TabPanel>

                {/* Integrations Tab */}
                <TabPanel p={0}>
                  <VStack spacing={6} align="stretch">
                    <Heading size="md">Integrations</Heading>
                    <Text color="gray.500">Third-party integrations and plugins will be available here.</Text>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>

          <ModalFooter
            borderTop="1px"
            borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
          >
            <Button variant="ghost" mr={3} onClick={handleSettingsCancel}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSettingsSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
}

export default App;
