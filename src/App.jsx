import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ChakraProvider, Box, Flex, Input, Button, Text, VStack, HStack, Heading, useColorMode, IconButton,
  Avatar, Divider, InputGroup, InputRightElement, InputLeftElement, Textarea, useDisclosure, Tooltip,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Tabs, TabList, TabPanels, Tab, TabPanel, Badge, Select, Checkbox,
  Menu, MenuButton, MenuList, MenuItem, MenuDivider, extendTheme, ColorModeScript,
  Alert, AlertIcon, AlertTitle, AlertDescription
} from "@chakra-ui/react";
import { SunIcon, MoonIcon, AddIcon, ChatIcon, SettingsIcon, HamburgerIcon, EditIcon, DeleteIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { PenTool, ImagePlus, Paperclip, MoreHorizontal, PanelLeft, PanelLeftClose } from "lucide-react";
import ReactMarkdown from "react-markdown";
import packageInfo from "../package.json";

// 主题配置
const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    classic: {
      50: '#f7fafc',
      100: '#edf2f7',
      200: '#e2e8f0',
      300: '#cbd5e0',
      400: '#a0aec0',
      500: '#718096',
      600: '#4a5568',
      700: '#2d3748',
      800: '#1a202c',
      900: '#171923',
    },
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.800' : 'gray.50',
      },
    }),
  },
});

function ChatBubble({ role, content, images = [] }) {
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
        maxW={{ base: "85%", md: "600px", lg: "650px" }}
        minW="fit-content"
        width="fit-content"
        boxShadow={isUser ? "md" : "none"}
        border={!isUser && colorMode === "light" ? "1px solid" : "none"}
        borderColor={!isUser && colorMode === "light" ? "gray.200" : "transparent"}
      >
        {/* 图片显示区域 */}
        {images && images.length > 0 && (
          <VStack spacing={2} align="stretch" mb={content ? 3 : 0}>
            {images.map((image, index) => (
              <Box key={index} borderRadius="md" overflow="hidden">
                <img
                  src={image.url || image}
                  alt={image.name || `Image ${index + 1}`}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "300px",
                    objectFit: "contain",
                    borderRadius: "8px"
                  }}
                />
              </Box>
            ))}
          </VStack>
        )}

        {/* 文本内容区域 */}
        {content && (
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
        )}
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

function AppContent() {
  // 获取默认值的优先级：运行时环境变量 > 构建时环境变量 > 默认值
  const getDefaultBaseUrl = () => {
    const runtimeBaseUrl = import.meta.env.VITE_RUNTIME_AI_SERVICE_BASE_URL;
    const defaultBaseUrl = import.meta.env.VITE_DEFAULT_AI_SERVICE_BASE_URL;

    const result = runtimeBaseUrl || defaultBaseUrl || "";

    // 开发模式下显示调试信息
    if (import.meta.env.DEV) {
      console.log('Environment Variables Debug:');
      console.log('  AI_BASE_URL (runtime):', runtimeBaseUrl || 'not set');
      console.log('  VITE_DEFAULT_AI_SERVICE_BASE_URL (build-time):', defaultBaseUrl || 'not set');
      console.log('  Selected Base URL:', result || 'empty');
    }

    return result;
  };

  const getDefaultApiKey = () => {
    const runtimeApiKey = import.meta.env.VITE_RUNTIME_AI_API_KEY;

    // 开发模式下显示调试信息（不显示完整 API key）
    if (import.meta.env.DEV) {
      console.log('  AI_API_KEY (runtime):', runtimeApiKey ? `${runtimeApiKey.substring(0, 8)}...` : 'not set');
    }

    return runtimeApiKey || "";
  };

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([
    { id: 1, name: "New Chat", messages: [] }
  ]);
  const [activeChat, setActiveChat] = useState(1);
  const [baseUrl, setBaseUrl] = useState(getDefaultBaseUrl());
  const [tempBaseUrl, setTempBaseUrl] = useState(getDefaultBaseUrl());
  const [apiKey, setApiKey] = useState(getDefaultApiKey());
  const [tempApiKey, setTempApiKey] = useState(getDefaultApiKey());
  const [showApiKey, setShowApiKey] = useState(false);
  const [useStreaming, setUseStreaming] = useState(true);
  const [tempUseStreaming, setTempUseStreaming] = useState(true);
  const [activeSettingsTab, setActiveSettingsTab] = useState(0);
  const [colorTheme, setColorTheme] = useState("Auto");
  const [language, setLanguage] = useState("English");
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful AI assistant.");
  const [tempSystemPrompt, setTempSystemPrompt] = useState("You are a helpful AI assistant.");
  const [maxCompletionTokens, setMaxCompletionTokens] = useState(8192);
  const [tempMaxCompletionTokens, setTempMaxCompletionTokens] = useState(8192);
  const [selectedImages, setSelectedImages] = useState([]);
  const [renamingChat, setRenamingChat] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [deletingChat, setDeletingChat] = useState(null);
  const [showChats, setShowChats] = useState(true);
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [modelsLoading, setModelsLoading] = useState(false);
  const [tempAvailableModels, setTempAvailableModels] = useState([]);
  const [tempSelectedModel, setTempSelectedModel] = useState("");
  const [tempModelsLoading, setTempModelsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(""); // "success", "error", "timeout", "cancelled", or ""
  const [connectionAbortController, setConnectionAbortController] = useState(null);
  const [connectionTimer, setConnectionTimer] = useState(0);
  const [connectionErrorMessage, setConnectionErrorMessage] = useState("");
  const [userCancelledConnection, setUserCancelledConnection] = useState(false);
  const { colorMode, toggleColorMode: TOGGLE_COLOR_MODE, setColorMode } = useColorMode();
  const { isOpen: isSidebarOpen, onToggle: toggleSidebar } = useDisclosure();
  const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure();
  const { isOpen: isSystemPromptOpen, onOpen: onSystemPromptOpen, onClose: onSystemPromptClose } = useDisclosure();
  const { isOpen: isRenameOpen, onOpen: onRenameOpen, onClose: onRenameClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isErrorOpen, onOpen: onErrorOpen, onClose: onErrorClose } = useDisclosure();
  const [errorMessage, setErrorMessage] = useState("");
  const [errorTitle, setErrorTitle] = useState("Error");
  const chatRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  const createNewChat = () => {
    const newId = chats.length + 1;
    setChats([...chats, { id: newId, name: "New Chat", messages: [] }]);
    setActiveChat(newId);
    setMessages([]); // 只为新聊天设置空消息
  };

  // 保存当前聊天的消息到chats状态中
  const saveCurrentChatMessages = () => {
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === activeChat
          ? { ...chat, messages: messages }
          : chat
      )
    );
  };

  // 切换聊天
  const switchToChat = (chatId) => {
    if (chatId === activeChat) return; // 如果已经是当前聊天，不需要切换

    // 保存当前聊天的消息
    saveCurrentChatMessages();

    // 切换到新聊天并加载消息
    setChats(prevChats => {
      const targetChat = prevChats.find(chat => chat.id === chatId);
      if (targetChat) {
        setMessages(targetChat.messages || []);
      }
      return prevChats;
    });

    setActiveChat(chatId);
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

  const deleteChat = (chatId) => {
    if (chats.length <= 1) {
      // 不允许删除最后一个聊天
      return;
    }

    // 先计算删除后剩余的聊天
    const remainingChats = chats.filter(chat => chat.id !== chatId);

    // 如果删除的是当前活跃的聊天，切换到第一个可用的聊天
    if (activeChat === chatId && remainingChats.length > 0) {
      setActiveChat(remainingChats[0].id);
      setMessages(remainingChats[0].messages || []); // 加载新聊天的消息
    }

    // 删除聊天
    setChats(remainingChats);
  };

  const duplicateChat = (chatId) => {
    const chatToDuplicate = chats.find(chat => chat.id === chatId);
    if (chatToDuplicate) {
      const newId = Math.max(...chats.map(c => c.id)) + 1;
      const newChat = {
        id: newId,
        name: `${chatToDuplicate.name} (Copy)`,
        messages: [...(chatToDuplicate.messages || [])] // 复制消息
      };
      setChats(prevChats => [...prevChats, newChat]);
    }
  };

  const RENAME_CHAT = (chatId, newName) => {
    updateChatName(chatId, newName);
  };

  const startRenaming = (chat) => {
    setRenamingChat(chat);
    setRenameValue(chat.name);
    onRenameOpen();
  };

  const handleRenameSubmit = () => {
    if (renamingChat && renameValue.trim()) {
      updateChatName(renamingChat.id, renameValue.trim());
      onRenameClose();
      setRenamingChat(null);
      setRenameValue("");
    }
  };

  const handleRenameCancel = () => {
    onRenameClose();
    setRenamingChat(null);
    setRenameValue("");
  };

  const startDeleting = (chat) => {
    setDeletingChat(chat);
    onDeleteOpen();
  };

  const handleDeleteConfirm = () => {
    if (deletingChat) {
      deleteChat(deletingChat.id);
      onDeleteClose();
      setDeletingChat(null);
    }
  };

  const handleDeleteCancel = () => {
    onDeleteClose();
    setDeletingChat(null);
  };

  // 显示错误信息的函数
  const showError = useCallback((title, message) => {
    setErrorTitle(title);
    setErrorMessage(message);
    onErrorOpen();
  }, [onErrorOpen]);

  const handleErrorClose = () => {
    onErrorClose();
    setErrorMessage("");
    setErrorTitle("Error");
  };

  const handleSettingsOpen = () => {
    setTempBaseUrl(baseUrl);
    setTempApiKey(apiKey);
    setTempUseStreaming(useStreaming);
    setTempMaxCompletionTokens(maxCompletionTokens);

    // 初始化临时模型状态
    setTempAvailableModels(availableModels);
    setTempSelectedModel(selectedModel);
    setConnectionStatus(availableModels.length > 0 ? "success" : "");

    onSettingsOpen();
  };

  const handleSettingsSave = () => {
    setBaseUrl(tempBaseUrl);
    setApiKey(tempApiKey);
    setUseStreaming(tempUseStreaming);
    setMaxCompletionTokens(tempMaxCompletionTokens);

    // 如果有选择的临时模型，更新到主状态
    if (tempSelectedModel) {
      setSelectedModel(tempSelectedModel);
    }

    // 如果连接成功，更新主模型列表
    if (connectionStatus === "success" && tempAvailableModels.length > 0) {
      setAvailableModels(tempAvailableModels);
    }

    onSettingsClose();
  };

  const handleSettingsCancel = () => {
    setTempBaseUrl(baseUrl);
    setTempApiKey(apiKey);
    setTempUseStreaming(useStreaming);
    setTempMaxCompletionTokens(maxCompletionTokens);

    // 取消正在进行的连接
    if (connectionAbortController) {
      connectionAbortController.abort();
      setConnectionAbortController(null);
      setTempModelsLoading(false);
    }

    // 重置临时状态
    setTempAvailableModels([]);
    setTempSelectedModel("");
    setConnectionStatus("");
    setConnectionErrorMessage("");
    setUserCancelledConnection(false);
    setConnectionTimer(0);

    onSettingsClose();
  };

  const handleSystemPromptOpen = () => {
    setTempSystemPrompt(systemPrompt);
    onSystemPromptOpen();
  };

  const handleSystemPromptSave = () => {
    setSystemPrompt(tempSystemPrompt);
    onSystemPromptClose();
  };

  const handleSystemPromptCancel = () => {
    setTempSystemPrompt(systemPrompt);
    onSystemPromptClose();
  };

  // 测试连接并获取模型列表（用于设置页面）
  const testConnectionAndFetchModels = useCallback(async () => {
    setTempModelsLoading(true);
    setConnectionStatus("");
    setConnectionErrorMessage("");
    setUserCancelledConnection(false);
    setConnectionTimer(0);

    // 创建AbortController用于取消请求
    const abortController = new AbortController();
    setConnectionAbortController(abortController);

    // 设置超时时间（30秒）
    const timeoutId = setTimeout(() => {
      abortController.abort();
    }, 30000);

    // 设置计时器更新
    const timerInterval = setInterval(() => {
      setConnectionTimer(prev => prev + 1);
    }, 1000);

    try {
      const response = await fetch(`${tempBaseUrl}/models`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(tempApiKey.trim() && { 'Authorization': `Bearer ${tempApiKey.trim()}` })
        },
        signal: abortController.signal
      });

      // 清除超时和计时器
      clearTimeout(timeoutId);
      clearInterval(timerInterval);

      if (response.ok) {
        const data = await response.json();
        const models = data.data || [];
        setTempAvailableModels(models);
        setConnectionStatus("success");

        // 如果还没有选择模型且有可用模型，选择第一个
        if (!tempSelectedModel && models.length > 0) {
          setTempSelectedModel(models[0].id);
        }
      } else {
        const errorText = await response.text();
        console.log('Connection test API error response:', errorText);
        let errorMsg = `HTTP ${response.status}: ${response.statusText}`;

        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error?.message) {
            errorMsg += `\n\nError: ${errorData.error.message}`;
          } else if (errorData.message) {
            errorMsg += `\n\nMessage: ${errorData.message}`;
          } else if (errorData.detail) {
            errorMsg += `\n\nDetail: ${errorData.detail}`;
          }
        } catch {
          if (errorText.trim()) {
            errorMsg += `\n\nServer Response:\n${errorText}`;
          }
        }

        setTempAvailableModels([]);
        setConnectionStatus("error");

        // 设置简化的错误消息用于UI显示
        let uiErrorMessage = `HTTP ${response.status}`;
        if (response.status === 401) {
          uiErrorMessage = "Authentication failed - Check API key";
        } else if (response.status === 403) {
          uiErrorMessage = "Access denied - Invalid permissions";
        } else if (response.status === 404) {
          uiErrorMessage = "Endpoint not found - Check URL path";
        } else if (response.status === 500) {
          uiErrorMessage = "Server error - Service may be down";
        } else if (response.status >= 400 && response.status < 500) {
          uiErrorMessage = "Client error - Check request format";
        } else if (response.status >= 500) {
          uiErrorMessage = "Server error - Try again later";
        }

        setConnectionErrorMessage(uiErrorMessage);
        showError("Connection Failed", errorMsg);
      }
    } catch (error) {
      // 清除超时和计时器
      clearTimeout(timeoutId);
      clearInterval(timerInterval);

      if (error.name === 'AbortError') {
        // 请求被取消
        setTempAvailableModels([]);

        if (userCancelledConnection) {
          // 用户主动取消，不显示任何错误信息
          setConnectionStatus("");
          setConnectionErrorMessage("");
          console.log('Connection test was cancelled by user');
        } else {
          // 超时取消，显示为连接失败，但不弹窗
          setConnectionStatus("timeout");
          setConnectionErrorMessage("Connection timed out after 30 seconds");
          console.log('Connection test timed out');
        }
      } else {
        console.warn('Connection test error:', error);
        setTempAvailableModels([]);
        setConnectionStatus("error");

        // 设置更具体的网络错误信息
        let uiErrorMessage = "Network error";
        if (error.message.includes('Failed to fetch')) {
          uiErrorMessage = "Cannot reach server - Check URL and network";
        } else if (error.message.includes('NetworkError')) {
          uiErrorMessage = "Network error - Check internet connection";
        } else if (error.message.includes('CORS')) {
          uiErrorMessage = "CORS error - Server configuration issue";
        } else {
          uiErrorMessage = `Network error: ${error.message}`;
        }
        setConnectionErrorMessage(uiErrorMessage);

        showError("Network Error", `Unable to connect to AI Service:\n\n${error.message}\n\nPlease check:\n1. AI Service is running\n2. Base URL is correct\n3. Network connection`);
      }
    } finally {
      setTempModelsLoading(false);
      setConnectionAbortController(null);
      setConnectionTimer(0);
      // 不在这里清理错误消息，让状态信息保持显示
    }
  }, [tempBaseUrl, tempApiKey, showError, tempSelectedModel, userCancelledConnection]);

  // 取消连接
  const cancelConnection = useCallback(() => {
    if (connectionAbortController) {
      setUserCancelledConnection(true); // 标记为用户主动取消
      connectionAbortController.abort();
      setConnectionAbortController(null);
      setTempModelsLoading(false);
      setConnectionStatus("");
      setConnectionErrorMessage("");
      setConnectionTimer(0);
    }
  }, [connectionAbortController]);

  // 获取可用的模型列表
  const fetchAvailableModels = useCallback(async () => {
    setModelsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/models`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey.trim() && { 'Authorization': `Bearer ${apiKey.trim()}` })
        }
      });

      if (response.ok) {
        const data = await response.json();
        const models = data.data || [];
        setAvailableModels(models);

        // 如果还没有选择模型且有可用模型，选择第一个
        if (!selectedModel && models.length > 0) {
          setSelectedModel(models[0].id);
        }
      } else {
        const errorText = await response.text();
        console.log('Models API error response:', errorText); // 调试日志
        let errorMsg = `HTTP ${response.status}: ${response.statusText}`;

        // 尝试解析JSON错误响应
        try {
          const errorData = JSON.parse(errorText);
          console.log('Parsed models error data:', errorData); // 调试日志

          // 优先查找嵌套的error对象（OpenAI格式）
          if (errorData.error) {
            if (errorData.error.message) {
              errorMsg += `\n\nError: ${errorData.error.message}`;
            }
            if (errorData.error.type) {
              errorMsg += `\nType: ${errorData.error.type}`;
            }
            if (errorData.error.code) {
              errorMsg += `\nCode: ${errorData.error.code}`;
            }
            if (errorData.error.details) {
              errorMsg += `\nDetails: ${errorData.error.details}`;
            }
          }
          // 查找顶级message字段
          else if (errorData.message) {
            errorMsg += `\n\nMessage: ${errorData.message}`;
          }
          // 查找detail字段（FastAPI格式）
          else if (errorData.detail) {
            errorMsg += `\n\nDetail: ${errorData.detail}`;
          }
          // 查找其他可能的错误字段
          else if (errorData.error_message) {
            errorMsg += `\n\nError Message: ${errorData.error_message}`;
          }
          else if (errorData.description) {
            errorMsg += `\n\nDescription: ${errorData.description}`;
          }
          // 如果有多个字段，尝试找到最相关的
          else {
            const possibleErrorFields = ['msg', 'reason', 'info', 'error_description'];
            for (const field of possibleErrorFields) {
              if (errorData[field]) {
                errorMsg += `\n\n${field}: ${errorData[field]}`;
                break;
              }
            }
          }
        } catch (parseError) {
          console.log('Models JSON parse error:', parseError); // 调试日志
          // 如果不是JSON，显示原始错误文本
          if (errorText.trim()) {
            errorMsg += `\n\nServer Response:\n${errorText}`;
          }
        }
        console.warn('Failed to fetch models:', response.status);
        setAvailableModels([]);
        showError("Failed to Load Models", errorMsg);
      }
    } catch (error) {
      console.warn('Error fetching models:', error);
      setAvailableModels([]);
      showError("Network Error", `Unable to connect to AI Service:\n\n${error.message}\n\nPlease check:\n1. AI Service is running\n2. Base URL is correct\n3. Network connection`);
    } finally {
      setModelsLoading(false);
    }
  }, [baseUrl, apiKey, showError, selectedModel]);

  // 当Base URL或API Key改变时重新获取模型
  const handleModelRefresh = () => {
    fetchAvailableModels();
  };

  // 图片处理函数
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = {
            id: Date.now() + Math.random(),
            file: file,
            url: e.target.result,
            name: file.name,
            size: file.size
          };
          setSelectedImages(prev => [...prev, imageData]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (imageId) => {
    setSelectedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const clearAllImages = () => {
    setSelectedImages([]);
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

  // 同步消息到对应的聊天
  useEffect(() => {
    if (messages.length > 0) {
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === activeChat
            ? { ...chat, messages: messages }
            : chat
        )
      );
    }
  }, [messages, activeChat]);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages, loading]);

  // 处理颜色主题变化
  useEffect(() => {
    switch (colorTheme) {
      case "Light":
        setColorMode("light");
        break;
      case "Classic":
        // Classic 主题使用深色模式，但使用经典的配色方案
        setColorMode("dark");
        break;
      case "Auto":
      default: {
        // Auto 模式根据系统偏好设置
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setColorMode(mediaQuery.matches ? 'dark' : 'light');

        // 监听系统主题变化
        const handleChange = (e) => {
          if (colorTheme === "Auto") {
            setColorMode(e.matches ? 'dark' : 'light');
          }
        };
        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
      }
    }
  }, [colorTheme, setColorMode]);

  // 键盘快捷键：Cmd/Ctrl + B 切换聊天列表显示，并设置初始焦点
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'b') {
        event.preventDefault();
        setShowChats(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // 页面加载后将焦点设置到输入框
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 500);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const sendMessage = async () => {
    if (!input.trim() && selectedImages.length === 0) return;

    const userMessage = {
      role: "user",
      content: input,
      images: selectedImages.length > 0 ? selectedImages : undefined
    };
    const currentInput = input.trim();

    // 如果这是第一条消息，自动生成聊天名称
    if (messages.length === 0) {
      const newChatName = generateChatName(currentInput || "Image");
      updateChatName(activeChat, newChatName);
    }

    setMessages([...messages, userMessage]);
    setInput("");
    setSelectedImages([]); // 清空选中的图片
    setLoading(true);

    try {
      // Prepare messages array with system prompt
      const messagesToSend = [];
      if (systemPrompt.trim()) {
        messagesToSend.push({ role: "system", content: systemPrompt });
      }

      // 将之前的消息添加到发送队列
      messagesToSend.push(...messages);

      // 准备当前用户消息，如果有图片则转换为API格式
      const currentMessage = { role: "user", content: input };
      if (selectedImages.length > 0) {
        // 对于支持多模态的API，添加图片内容
        currentMessage.content = [
          { type: "text", text: input || "Please analyze this image." },
          ...selectedImages.map(img => {
            // 提取Base64字符串部分（去掉data:image/jpeg;base64,前缀）
            const base64Data = img.url.split(',')[1];
            return {
              type: "image_url",
              image_url: { url: base64Data }
            };
          })
        ];
      }
      messagesToSend.push(currentMessage);

      // 准备请求头
      const headers = { "Content-Type": "application/json" };
      if (apiKey && apiKey.trim()) {
        headers["Authorization"] = `Bearer ${apiKey.trim()}`;
      }

      // 使用标准fetch进行网络请求
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          model: selectedModel || "Unknown", // 使用选择的模型
          messages: messagesToSend,
          stream: useStreaming,
          max_completion_tokens: maxCompletionTokens,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response text:', errorText); // 调试日志
        let errorMsg = `HTTP ${response.status}: ${response.statusText}`;

        // 尝试解析JSON错误响应
        try {
          const errorData = JSON.parse(errorText);
          console.log('Parsed error data:', errorData); // 调试日志

          // 优先查找嵌套的error对象（OpenAI格式）
          if (errorData.error) {
            if (errorData.error.message) {
              errorMsg += `\n\nError: ${errorData.error.message}`;
            }
            if (errorData.error.type) {
              errorMsg += `\nType: ${errorData.error.type}`;
            }
            if (errorData.error.code) {
              errorMsg += `\nCode: ${errorData.error.code}`;
            }
            if (errorData.error.details) {
              errorMsg += `\nDetails: ${errorData.error.details}`;
            }
          }
          // 查找顶级message字段
          else if (errorData.message) {
            errorMsg += `\n\nMessage: ${errorData.message}`;
          }
          // 查找detail字段（FastAPI格式）
          else if (errorData.detail) {
            errorMsg += `\n\nDetail: ${errorData.detail}`;
          }
          // 查找其他可能的错误字段
          else if (errorData.error_message) {
            errorMsg += `\n\nError Message: ${errorData.error_message}`;
          }
          else if (errorData.description) {
            errorMsg += `\n\nDescription: ${errorData.description}`;
          }
          // 如果有多个字段，尝试找到最相关的
          else {
            const possibleErrorFields = ['msg', 'reason', 'info', 'error_description'];
            for (const field of possibleErrorFields) {
              if (errorData[field]) {
                errorMsg += `\n\n${field}: ${errorData[field]}`;
                break;
              }
            }
          }
        } catch (parseError) {
          console.log('JSON parse error:', parseError); // 调试日志
          // 如果不是JSON，显示原始错误文本
          if (errorText.trim()) {
            errorMsg += `\n\nServer Response:\n${errorText}`;
          }
        }
        throw new Error(errorMsg);
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
                  } catch {
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
      console.log('Request details:', {
        baseUrl,
        endpoint: `${baseUrl}/chat/completions`,
        isElectron: !!window.electronAPI
      });

      let errorTitle = "Chat Request Failed";
      let errorMessage = e.message || "Unknown error";

      if (e.message.includes('fetch') || e.message.includes('Failed to fetch')) {
        errorTitle = "Network Error";
        errorMessage = `Unable to connect to AI Service:\n\n${e.message}\n\nPlease check:\n1. AI Service is running\n2. Base URL is correct (current: ${baseUrl})\n3. Network connection is normal`;
      } else if (e.message.includes('HTTP 401') || e.message.includes('Unauthorized')) {
        errorTitle = "Authentication Error";

        // 提取详细错误信息
        const lines = e.message.split('\n');
        const statusLine = lines[0];
        const detailsStartIndex = lines.findIndex(line => line.trim() && !line.startsWith('HTTP'));

        let serverDetails = "";
        if (detailsStartIndex !== -1) {
          serverDetails = lines.slice(detailsStartIndex).join('\n').trim();
        }

        errorMessage = `Authentication failed:\n\n${statusLine}`;

        if (serverDetails) {
          errorMessage += `\n\nServer Response:\n${serverDetails}`;
        }

        errorMessage += `\n\nSolutions:\n• Check your API Key in settings\n• Verify the API Key is valid and active\n• Ensure the API Key has the correct permissions`;
      } else if (e.message.includes('HTTP 403') || e.message.includes('Forbidden')) {
        errorTitle = "Access Denied";

        // 提取详细错误信息
        const lines = e.message.split('\n');
        const statusLine = lines[0];
        const detailsStartIndex = lines.findIndex(line => line.trim() && !line.startsWith('HTTP'));

        let serverDetails = "";
        if (detailsStartIndex !== -1) {
          serverDetails = lines.slice(detailsStartIndex).join('\n').trim();
        }

        errorMessage = `Access denied:\n\n${statusLine}`;

        if (serverDetails) {
          errorMessage += `\n\nServer Response:\n${serverDetails}`;
        }

        errorMessage += `\n\nSolutions:\n• Check your API Key permissions\n• Verify your account has access to this service\n• Contact your administrator if this is unexpected`;
      } else if (e.message.includes('HTTP 429') || e.message.includes('Too Many Requests')) {
        errorTitle = "Rate Limit Exceeded";

        // 提取详细错误信息和rate limit信息
        const lines = e.message.split('\n');
        const statusLine = lines[0];
        const detailsStartIndex = lines.findIndex(line => line.trim() && !line.startsWith('HTTP'));

        let serverDetails = "";
        if (detailsStartIndex !== -1) {
          serverDetails = lines.slice(detailsStartIndex).join('\n').trim();
        }

        errorMessage = `Rate limit exceeded:\n\n${statusLine}`;

        if (serverDetails) {
          errorMessage += `\n\nServer Response:\n${serverDetails}`;
        }

        errorMessage += `\n\nSolutions:\n• Wait a moment before trying again\n• Check your usage limits\n• Consider upgrading your plan if needed\n• Reduce request frequency`;
      } else if (e.message.includes('HTTP 500') || e.message.includes('Internal Server Error')) {
        errorTitle = "Server Error";

        // 直接使用完整的错误消息，因为它已经包含了解析后的详细信息
        errorMessage = e.message;

        // 如果消息太简短，添加故障排除信息
        if (!e.message.includes('Error:') && !e.message.includes('Detail:') && !e.message.includes('Message:')) {
          errorMessage += `\n\nTroubleshooting:\n• Check server logs for detailed error information\n• Verify the AI service is running properly\n• Try again in a few moments\n• Contact support if the issue persists`;
        }
      } else if (e.message.includes('HTTP 400') || e.message.includes('Bad Request')) {
        errorTitle = "Bad Request";

        // 直接使用完整的错误消息
        errorMessage = e.message;

        // 如果消息太简短，添加解决方案
        if (!e.message.includes('Error:') && !e.message.includes('Detail:') && !e.message.includes('Message:')) {
          errorMessage += `\n\nSolutions:\n• Check your request parameters\n• Verify the selected model is valid\n• Try with different input\n• Check the API documentation`;
        }
      } else if (e.message.includes('HTTP 404') || e.message.includes('Not Found')) {
        errorTitle = "Service Not Found";

        // 直接使用完整的错误消息
        errorMessage = e.message;

        // 如果消息太简短，添加解决方案
        if (!e.message.includes('Error:') && !e.message.includes('Detail:') && !e.message.includes('Message:')) {
          errorMessage += `\n\nSolutions:\n• Check the Base URL in settings\n• Verify the AI service is running\n• Ensure the API endpoint is correct\n• Contact administrator for correct endpoint`;
        }
      } else if (e.message.startsWith('HTTP')) {
        // 处理其他HTTP错误
        errorTitle = "HTTP Error";

        // 直接使用完整的错误消息
        errorMessage = e.message;

        // 如果消息太简短，添加解决方案
        if (!e.message.includes('Error:') && !e.message.includes('Detail:') && !e.message.includes('Message:')) {
          errorMessage += `\n\nSolutions:\n• Check the AI service status\n• Verify your connection settings\n• Try again later\n• Contact support if the issue persists`;
        }
      }

      showError(errorTitle, errorMessage);
    } finally {
      setLoading(false);
      // 将焦点返回到输入框
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  return (
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
          w={{
            base: isSidebarOpen ? "min(280px, 80vw)" : "0",
            md: showChats ? "min(280px, 25vw)" : "0",
            lg: showChats ? "280px" : "0"
          }}
          display={{
            base: isSidebarOpen ? "flex" : "none",
            md: showChats ? "flex" : "none"
          }}
          bg={colorMode === "dark" ? "gray.900" : "white"}
          borderRight="1px"
          borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
          flexDirection="column"
          position={{ base: "absolute", md: "relative" }}
          zIndex={{ base: 10, md: "auto" }}
          height="100vh"
          transition="all 0.3s"
          overflow="hidden"
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
                position="relative"
                onClick={() => switchToChat(chat.id)}
                role="group"
              >
                <HStack justify="space-between" align="center">
                  <HStack flex="1" minW="0">
                    <ChatIcon size="sm" color={colorMode === "dark" ? "gray.400" : "gray.500"} />
                    <Text fontSize="sm" fontWeight="medium" isTruncated flex="1">
                      {chat.name}
                    </Text>
                  </HStack>

                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<MoreHorizontal size={16} />}
                      variant="ghost"
                      size="sm"
                      opacity={0}
                      _groupHover={{ opacity: 1 }}
                      _hover={{ opacity: 1 }}
                      _focus={{ opacity: 1 }}
                      onClick={(e) => e.stopPropagation()}
                      aria-label="Chat options"
                    />
                    <MenuList>
                      <MenuItem
                        icon={<EditIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          startRenaming(chat);
                        }}
                      >
                        Rename
                      </MenuItem>
                      <MenuItem
                        icon={<ChatIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateChat(chat.id);
                        }}
                      >
                        Duplicate
                      </MenuItem>
                      <MenuDivider />
                      <MenuItem
                        icon={<DeleteIcon />}
                        color="red.500"
                        onClick={(e) => {
                          e.stopPropagation();
                          startDeleting(chat);
                        }}
                        isDisabled={chats.length <= 1}
                      >
                        Delete
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>
              </Box>
            ))}
          </Box>
        </Box>

        {/* 主聊天区域 */}
        <Flex flex="1" direction="column">
          {/* 桌面端顶部工具栏 */}
          <Box
            display={{ base: "none", md: "block" }}
            px={6}
            py={3}
            borderBottom="1px"
            borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
            bg={colorMode === "dark" ? "gray.900" : "white"}
          >
            <HStack justify="space-between" align="center">
              <HStack spacing={3}>
                <Button
                  onClick={() => setShowChats(!showChats)}
                  variant="ghost"
                  size="sm"
                  leftIcon={showChats ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
                  aria-label={showChats ? "Hide chats" : "Show chats"}
                  title={`${showChats ? "Hide" : "Show"} chats (⌘/Ctrl+B)`}
                >
                  {showChats ? "Hide Chats" : "Show Chats"}
                </Button>
              </HStack>

              {/* 中间的模型选择器 */}
              <HStack spacing={3} align="center">
                <Text fontSize="sm" color={colorMode === "dark" ? "gray.400" : "gray.600"}>
                  Model:
                </Text>
                <Select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  size="sm"
                  width="200px"
                  bg={colorMode === "dark" ? "gray.700" : "white"}
                  isDisabled={modelsLoading || availableModels.length === 0}
                  placeholder={modelsLoading ? "Loading..." : availableModels.length === 0 ? "Configure AI service first" : "Select model"}
                >
                  {availableModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.id}
                    </option>
                  ))}
                </Select>
                {availableModels.length === 0 && !modelsLoading && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleModelRefresh}
                    title="Refresh models"
                  >
                    🔄
                  </Button>
                )}
              </HStack>

              <HStack spacing={3}>
                <Tooltip
                  label="Configure system prompt"
                  aria-label="System prompt tooltip"
                  placement="bottom"
                  hasArrow
                >
                  <Button
                    onClick={handleSystemPromptOpen}
                    variant="ghost"
                    size="sm"
                    leftIcon={<PenTool size={16} />}
                  >
                    System Prompt
                  </Button>
                </Tooltip>
                <Tooltip
                  label="Open app settings"
                  aria-label="Settings tooltip"
                  placement="bottom"
                  hasArrow
                >
                  <IconButton
                    icon={<SettingsIcon />}
                    onClick={handleSettingsOpen}
                    variant="ghost"
                    size="sm"
                    aria-label="Settings"
                  />
                </Tooltip>
              </HStack>
            </HStack>
          </Box>
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

              {/* 移动端模型选择器 */}
              <HStack spacing={2} flex="1" justify="center">
                <Select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  size="sm"
                  width="140px"
                  bg={colorMode === "dark" ? "gray.700" : "white"}
                  isDisabled={modelsLoading || availableModels.length === 0}
                  placeholder={modelsLoading ? "Loading..." : availableModels.length === 0 ? "No models" : "Model"}
                >
                  {availableModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.id.length > 15 ? `${model.id.substring(0, 15)}...` : model.id}
                    </option>
                  ))}
                </Select>
              </HStack>

              <HStack spacing={2}>
                <Tooltip
                  label="Configure system prompt"
                  aria-label="System prompt tooltip"
                  placement="bottom"
                  hasArrow
                >
                  <Button
                    onClick={handleSystemPromptOpen}
                    variant="ghost"
                    size="sm"
                    fontSize="xs"
                    px={2}
                  >
                    System Prompt
                  </Button>
                </Tooltip>
              </HStack>
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
              <Box maxW="900px" mx="auto" w="100%">
                <VStack align="stretch" spacing={1} w="100%">
                  {messages.map((msg, idx) => (
                    <ChatBubble key={idx} role={msg.role} content={msg.content} images={msg.images} />
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
              </Box>
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
            <Box maxW="900px" mx="auto" w="100%">
              {/* 图片预览区域 */}
              {selectedImages.length > 0 && (
                <Box mb={3}>
                  <HStack justify="space-between" align="center" mb={2}>
                    <Text fontSize="sm" color="gray.500">
                      Selected Images ({selectedImages.length})
                    </Text>
                    <Button size="xs" variant="ghost" onClick={clearAllImages}>
                      Clear All
                    </Button>
                  </HStack>
                  <HStack spacing={2} overflowX="auto" pb={2}>
                    {selectedImages.map((image) => (
                      <Box key={image.id} position="relative" flexShrink={0}>
                        <img
                          src={image.url}
                          alt={image.name}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "1px solid #ccc"
                          }}
                        />
                        <IconButton
                          icon={<Text fontSize="xs">×</Text>}
                          position="absolute"
                          top="-5px"
                          right="-5px"
                          size="xs"
                          colorScheme="red"
                          borderRadius="full"
                          onClick={() => removeImage(image.id)}
                          aria-label="Remove image"
                        />
                      </Box>
                    ))}
                  </HStack>
                </Box>
              )}

              <InputGroup>
                {/* 隐藏的文件输入 */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                />

                {/* 左侧图片上传按钮 */}
                <InputLeftElement
                  height="50px"
                  width="50px"
                  top={0}
                  left="4px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Tooltip
                    label="Upload images (supports multiple files)"
                    aria-label="Upload images tooltip"
                    placement="top"
                    hasArrow
                  >
                    <IconButton
                      icon={<ImagePlus size={16} />}
                      onClick={() => fileInputRef.current?.click()}
                      variant="ghost"
                      size="sm"
                      aria-label="Upload image"
                      isDisabled={loading}
                    />
                  </Tooltip>
                </InputLeftElement>

                <Textarea
                  ref={inputRef}
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
                  pl="60px"
                  pr="80px"
                  bg={colorMode === "dark" ? "gray.700" : "white"}
                  border="1px solid"
                  borderColor={colorMode === "dark" ? "gray.600" : "gray.300"}
                  _focus={{
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 1px blue.500"
                  }}
                />

                {/* 右侧发送按钮 */}
                <InputRightElement
                  height="50px"
                  width="80px"
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
                    isDisabled={!input.trim() && selectedImages.length === 0}
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

        {/* Settings Modal */}
        <Modal
          isOpen={isSettingsOpen}
          onClose={handleSettingsCancel}
          size="6xl"
          closeOnEsc={true}
          blockScrollOnMount={false}
        >
        <ModalOverlay />
        <ModalContent
          maxW="800px"
          maxH="80vh"
        >
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
                        <Text mb={2}>You are all up to date! The current version is {import.meta.env.VITE_APP_VERSION || packageInfo.version}.</Text>
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
                            {["Auto", "Classic", "Light"].map((theme) => (
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
                      </VStack>
                    </Box>
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
                          <HStack spacing={2}>
                            <Input
                              value={tempBaseUrl}
                              onChange={(e) => setTempBaseUrl(e.target.value)}
                              placeholder="Enter AI service base URL (e.g., http://localhost:9068/v1)"
                              autoComplete="off"
                              spellCheck="false"
                              onPaste={(e) => {
                                console.log('Base URL paste event triggered:', e);
                                // 确保粘贴功能正常工作
                                setTimeout(() => {
                                  const pastedValue = e.target.value;
                                  if (pastedValue !== tempBaseUrl) {
                                    setTempBaseUrl(pastedValue);
                                    console.log('Base URL updated via paste:', pastedValue);
                                  }
                                }, 0);
                              }}
                              onKeyDown={(e) => {
                                if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
                                  console.log('Base URL paste shortcut detected:', e);
                                  // 确保事件不被阻止
                                  e.stopPropagation = () => {};
                                  e.preventDefault = () => {};
                                }
                              }}
                            />
                            {tempModelsLoading ? (
                              <Button
                                onClick={cancelConnection}
                                colorScheme="red"
                                variant="outline"
                                size="md"
                                minW="80px"
                              >
                                Cancel
                              </Button>
                            ) : (
                              <Button
                                onClick={testConnectionAndFetchModels}
                                colorScheme={
                                  connectionStatus === "success" ? "green" :
                                  connectionStatus === "error" ? "red" :
                                  connectionStatus === "timeout" ? "red" : "blue"
                                }
                                variant={connectionStatus === "success" ? "solid" : "outline"}
                                size="md"
                                minW="100px"
                              >
                                {connectionStatus === "success" ? "Connected" :
                                 connectionStatus === "error" ? "Retry" :
                                 connectionStatus === "timeout" ? "Retry" : "Connect"}
                              </Button>
                            )}
                          </HStack>
                          <Text fontSize="xs" color="gray.500" mt={1}>
                            Configure the base URL for your AI service endpoint
                          </Text>
                          {tempModelsLoading && (
                            <Text fontSize="xs" color="blue.500" mt={1}>
                              🔄 Connecting... {connectionTimer}s / 30s (Click Cancel to stop)
                            </Text>
                          )}
                          {connectionStatus === "success" && tempAvailableModels.length > 0 && (
                            <Text fontSize="xs" color="green.500" mt={1}>
                              ✅ Successfully connected - {tempAvailableModels.length} model(s) available
                            </Text>
                          )}
                          {connectionStatus === "success" && tempAvailableModels.length === 0 && (
                            <Alert status="warning" variant="subtle" size="sm" borderRadius="md" mt={2}>
                              <AlertIcon boxSize={3} />
                              <AlertDescription fontSize="xs">
                                Connected successfully but no models available. Check your AI service.
                              </AlertDescription>
                            </Alert>
                          )}
                          {connectionStatus === "error" && (
                            <Text fontSize="xs" color="red.500" mt={1}>
                              ❌ Connection failed - {connectionErrorMessage}
                            </Text>
                          )}
                          {connectionStatus === "timeout" && (
                            <Text fontSize="xs" color="red.500" mt={1}>
                              ❌ Connection failed - {connectionErrorMessage}
                            </Text>
                          )}
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="600">
                            API Key
                            <Text as="span" fontSize="xs" color="gray.500" fontWeight="normal" ml={1}>
                              (Optional)
                            </Text>
                          </FormLabel>
                          <InputGroup>
                            <Input
                              type={showApiKey ? "text" : "password"}
                              value={tempApiKey}
                              onChange={(e) => setTempApiKey(e.target.value)}
                              placeholder="Enter your API key (optional)"
                              autoComplete="off"
                              spellCheck="false"
                              onPaste={(e) => {
                                console.log('API Key paste event triggered:', e);
                                // 确保粘贴功能正常工作
                                setTimeout(() => {
                                  const pastedValue = e.target.value;
                                  if (pastedValue !== tempApiKey) {
                                    setTempApiKey(pastedValue);
                                    console.log('API Key updated via paste:', pastedValue);
                                  }
                                }, 0);
                              }}
                              onKeyDown={(e) => {
                                if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
                                  console.log('API Key paste shortcut detected:', e);
                                  // 确保事件不被阻止
                                  e.stopPropagation = () => {};
                                  e.preventDefault = () => {};
                                }
                              }}
                            />
                            <InputRightElement>
                              <IconButton
                                variant="ghost"
                                size="sm"
                                aria-label={showApiKey ? "Hide API key" : "Show API key"}
                                icon={showApiKey ? <ViewOffIcon /> : <ViewIcon />}
                                onClick={() => setShowApiKey(!showApiKey)}
                              />
                            </InputRightElement>
                          </InputGroup>
                          <Text fontSize="xs" color="gray.500" mt={1}>
                            API key for authenticated access to your AI service (will be sent in Authorization header)
                          </Text>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="600">
                            Model
                            <Text as="span" fontSize="xs" color="gray.500" fontWeight="normal" ml={1}>
                              (Available after connecting)
                            </Text>
                          </FormLabel>
                          <Select
                            value={tempSelectedModel}
                            onChange={(e) => setTempSelectedModel(e.target.value)}
                            placeholder={tempModelsLoading ? "Loading models..." : connectionStatus === "success" ? "Select a model" : "Connect to see available models"}
                            isDisabled={tempModelsLoading || tempAvailableModels.length === 0}
                          >
                            {tempAvailableModels.map((model) => (
                              <option key={model.id} value={model.id}>
                                {model.id}
                              </option>
                            ))}
                          </Select>
                          <Text fontSize="xs" color="gray.500" mt={1}>
                            Select the AI model to use for conversations
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

                {/* Chat Tab */}
                <TabPanel p={0}>
                  <VStack spacing={6} align="stretch">
                    <Heading size="md">Chat Settings</Heading>

                    <Box
                      p={6}
                      borderRadius="md"
                      border="1px"
                      borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
                      bg={colorMode === "dark" ? "gray.800" : "white"}
                    >
                      <VStack spacing={4} align="stretch">
                        <FormControl>
                          <FormLabel>Max Completion Tokens</FormLabel>
                          <Input
                            type="number"
                            min="1"
                            max="100000"
                            step="1"
                            value={tempMaxCompletionTokens}
                            onChange={(e) => setTempMaxCompletionTokens(parseInt(e.target.value) || 8192)}
                            placeholder="8192"
                          />
                          <Text fontSize="sm" color="gray.500" mt={1}>
                            Maximum number of tokens that can be generated in the completion. Default: 8192
                          </Text>
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

      {/* System Prompt Modal */}
      <Modal
        isOpen={isSystemPromptOpen}
        onClose={handleSystemPromptCancel}
        size="xl"
        scrollBehavior="inside"
      >
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent
          maxH="80vh"
          bg={colorMode === "dark" ? "gray.800" : "white"}
          borderRadius="xl"
          mx={4}
        >
          <ModalHeader
            borderBottom="1px"
            borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
          >
            <HStack>
              <PenTool size={20} />
              <Text>System Prompt</Text>
            </HStack>
          </ModalHeader>

          <ModalBody p={6}>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color="gray.500">
                Define the system behavior and personality. This message will be sent before every conversation.
              </Text>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600">
                  System Prompt
                </FormLabel>
                <Textarea
                  value={tempSystemPrompt}
                  onChange={(e) => setTempSystemPrompt(e.target.value)}
                  placeholder="You are a helpful AI assistant..."
                  rows={12}
                  resize="vertical"
                  fontSize="sm"
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  This prompt will be included at the beginning of every conversation with the AI.
                </Text>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter
            borderTop="1px"
            borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
          >
            <Button variant="ghost" mr={3} onClick={handleSystemPromptCancel}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSystemPromptSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Rename Chat Modal */}
      <Modal isOpen={isRenameOpen} onClose={handleRenameCancel} size="md">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent
          bg={colorMode === "dark" ? "gray.800" : "white"}
          borderRadius="xl"
          mx={4}
        >
          <ModalHeader
            borderBottom="1px"
            borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
          >
            <HStack>
              <EditIcon />
              <Text>Rename Chat</Text>
            </HStack>
          </ModalHeader>

          <ModalBody p={6}>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color="gray.500">
                Enter a new name for this chat conversation.
              </Text>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600">
                  Chat Name
                </FormLabel>
                <Input
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  placeholder="Enter chat name..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleRenameSubmit();
                    } else if (e.key === "Escape") {
                      handleRenameCancel();
                    }
                  }}
                  autoFocus
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter
            borderTop="1px"
            borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
          >
            <Button variant="ghost" mr={3} onClick={handleRenameCancel}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleRenameSubmit}
              isDisabled={!renameValue.trim()}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Chat Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={handleDeleteCancel} size="md">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent
          bg={colorMode === "dark" ? "gray.800" : "white"}
          borderRadius="xl"
          mx={4}
        >
          <ModalHeader
            borderBottom="1px"
            borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
          >
            <HStack>
              <DeleteIcon color="red.500" />
              <Text>Delete Chat</Text>
            </HStack>
          </ModalHeader>

          <ModalBody p={6}>
            <VStack spacing={4} align="stretch">
              <Text fontSize="md" fontWeight="500">
                Are you sure you want to delete this chat?
              </Text>

              {deletingChat && (
                <Box
                  bg={colorMode === "dark" ? "gray.700" : "gray.100"}
                  p={3}
                  borderRadius="md"
                  borderLeft="4px solid"
                  borderColor="red.500"
                >
                  <Text fontSize="sm" fontWeight="500" color="red.500">
                    "{deletingChat.name}"
                  </Text>
                </Box>
              )}

              <Text fontSize="sm" color="gray.500">
                This action cannot be undone. All messages in this conversation will be permanently lost.
              </Text>
            </VStack>
          </ModalBody>

          <ModalFooter
            borderTop="1px"
            borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
          >
            <Button variant="ghost" mr={3} onClick={handleDeleteCancel}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 错误显示Modal */}
      <Modal
        isOpen={isErrorOpen}
        onClose={handleErrorClose}
        size="md"
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          bg={colorMode === "dark" ? "gray.800" : "white"}
          borderRadius="xl"
          mx={4}
        >
          <ModalHeader
            borderBottom="1px"
            borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
          >
            <HStack>
              <Text color="red.500" fontSize="lg">⚠️</Text>
              <Text>{errorTitle}</Text>
            </HStack>
          </ModalHeader>

          <ModalBody p={6}>
            <Text
              fontSize="md"
              whiteSpace="pre-line"
              color={colorMode === "dark" ? "gray.300" : "gray.700"}
            >
              {errorMessage}
            </Text>
          </ModalBody>

          <ModalFooter
            borderTop="1px"
            borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
          >
            <Button
              colorScheme="blue"
              onClick={handleErrorClose}
              width="100%"
            >
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </Flex>
    );
  }function App() {
  return (
    <ChakraProvider theme={theme}>
      <AppContent />
    </ChakraProvider>
  );
}

export default App;
