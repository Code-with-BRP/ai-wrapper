import { useState, useCallback, useRef } from "react";
import { sendStreamingChatCompletion } from "@/services/openrouter";
import { useApiKey } from "./useApiKey";

const DEFAULT_RESPONSES = [
  "Hello! I'm a demo AI assistant. Please add your OpenRouter API key to enable real AI conversations.",
  "To start chatting with real AI models, please configure your OpenRouter API key in the avatar menu.",
  "This is a placeholder response. Add your API key to unlock the full power of various LLM models!",
  "Demo mode active. Configure your OpenRouter API key to chat with actual AI models.",
];

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState<LLMModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const { apiKeyData, isValidApiKey } = useApiKey();
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string, onSent?: () => void) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: content.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Call onSent callback to handle focus
    onSent?.();

    // Cancel any ongoing streaming
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    try {
      // Check if we have a valid API key and selected model
      if (isValidApiKey && apiKeyData.key && selectedModel) {
        // Prepare chat messages for API
        const chatMessages: ChatMessage[] = messages
          .slice(-10) // Limit context to last 10 messages
          .map(msg => ({
            role: msg.role === "user" ? "user" : "assistant",
            content: msg.content,
          }));

        // Add the current user message
        chatMessages.push({
          role: "user",
          content: content.trim(),
        });

        // Create streaming assistant message
        const assistantMessageId = crypto.randomUUID();
        const assistantMessage: Message = {
          id: assistantMessageId,
          content: "",
          role: "assistant",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setStreamingMessageId(assistantMessageId);

        // Stream the response
        await sendStreamingChatCompletion(
          apiKeyData.key,
          selectedModel.id,
          chatMessages,
          // onChunk
          (chunk: string) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: msg.content + chunk }
                  : msg
              )
            );
          },
          // onComplete
          () => {
            setStreamingMessageId(null);
            setIsLoading(false);
          },
          // onError
          (error: Error) => {
            setStreamingMessageId(null);
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: `Error: ${error.message}` }
                  : msg
              )
            );
            setIsLoading(false);
          },
          {
            maxTokens: 1000,
            temperature: 0.7,
          }
        );
      } else {
        // Fallback to demo responses
        let responseContent: string;
        if (!selectedModel) {
          responseContent = "Please select a model from the dropdown to start chatting.";
        } else if (!isValidApiKey || !apiKeyData.key) {
          responseContent = DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)];
        } else {
          responseContent = "Please check your API key configuration.";
        }

        // Simulate typing delay for demo responses
        await new Promise((resolve) =>
          setTimeout(resolve, 800 + Math.random() * 1200)
        );

        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          content: responseContent,
          role: "assistant",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Unexpected error in sendMessage:', error);
      
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: "An unexpected error occurred. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      setStreamingMessageId(null);
      setIsLoading(false);
    }
  }, [messages, isValidApiKey, apiKeyData.key, selectedModel, isLoading]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setStreamingMessageId(null);
    // Cancel any ongoing streaming
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const setSelectedModelWithConfirmation = useCallback((model: LLMModel, onConfirm?: () => void) => {
    // If no messages or same model, change directly
    if (messages.length === 0 || selectedModel?.id === model.id) {
      setSelectedModel(model);
      return true; // Changed without confirmation
    }

    // If there are messages, require confirmation
    onConfirm?.();
    return false; // Needs confirmation
  }, [messages.length, selectedModel?.id]);

  const confirmModelChange = useCallback((model: LLMModel) => {
    setSelectedModel(model);
  }, []);

  return {
    messages,
    selectedModel,
    setSelectedModel: setSelectedModelWithConfirmation,
    confirmModelChange,
    isLoading,
    streamingMessageId,
    sendMessage,
    clearChat,
    hasActiveChat: messages.length > 0,
  };
}
