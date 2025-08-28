import { useState, useCallback } from "react";

const DEFAULT_RESPONSES = [
  "Hello! I'm a demo AI assistant. This is a placeholder response while we build the OpenRouter integration.",
  "That's an interesting question! In the real implementation, I would connect to the selected LLM model to provide a proper response.",
  "I understand what you're asking. Once we integrate with OpenRouter, I'll be able to give you much better answers using the selected model.",
  "Thanks for your message! This is just a demo response. Soon you'll be able to chat with real AI models through OpenRouter.",
  "Great question! The actual AI model will provide much more detailed and accurate responses once the integration is complete.",
];

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState<LLMModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: content.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 1000)
    );

    const randomResponse =
      DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)];
    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      content: randomResponse,
      role: "assistant",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    selectedModel,
    setSelectedModel,
    isLoading,
    sendMessage,
    clearChat,
  };
}
