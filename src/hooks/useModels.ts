import { useState, useEffect, useCallback } from "react";
import { fetchModels } from "@/services/openrouter";

export function useModels(apiKey: string | null, isValidKey: boolean) {
  const [models, setModels] = useState<LLMModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert OpenRouter model to our LLM model format
  const convertToLLMModel = useCallback((openRouterModel: OpenRouterModel): LLMModel => {
    // Extract provider from model ID (e.g., "openai/gpt-4" -> "OpenAI")
    const provider = openRouterModel.id.split('/')[0].toLowerCase();
    
    // Map provider names to display names (only allowed providers)
    const providerMap: Record<string, string> = {
      'openai': 'OpenAI',
      'anthropic': 'Anthropic', 
      'google': 'Google',
      'deepseek': 'DeepSeek',
      'mistralai': 'Mistral',
      'xai': 'Grok (xAI)',
    };

    const providerDisplayName = providerMap[provider] || 
                               provider.charAt(0).toUpperCase() + provider.slice(1);

    return {
      id: openRouterModel.id,
      name: openRouterModel.name,
      provider: providerDisplayName,
    };
  }, []);

  const loadModels = useCallback(async () => {
    if (!apiKey || !isValidKey) {
      // Return default models when no API key is available
      const defaultModels: LLMModel[] = [
        { id: "openai/gpt-4o", name: "GPT-4o", provider: "OpenAI" },
        { id: "openai/gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI" },
        { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic" },
        { id: "anthropic/claude-3-haiku", name: "Claude 3 Haiku", provider: "Anthropic" },
        { id: "google/gemini-pro-1.5", name: "Gemini Pro 1.5", provider: "Google" },
        { id: "deepseek/deepseek-chat", name: "DeepSeek Chat", provider: "DeepSeek" },
        { id: "mistralai/mistral-large", name: "Mistral Large", provider: "Mistral" },
        { id: "xai/grok-beta", name: "Grok Beta", provider: "Grok (xAI)" },
      ];
      setModels(defaultModels);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const openRouterModels = await fetchModels(apiKey);
      console.log('Total models fetched from OpenRouter:', openRouterModels.length);
      
      // Filter models to only include specific providers
      const allowedProviders = ['openai', 'anthropic', 'google', 'deepseek', 'mistralai', 'xai'];
      
      const filteredModels = openRouterModels
        .filter(model => {
          // Check if model is from allowed providers
          const provider = model.id.split('/')[0].toLowerCase();
          const isAllowedProvider = allowedProviders.includes(provider);
          
          // Filter out non-chat models
          const isNotEmbedding = !model.id.toLowerCase().includes("embedding") &&
                               !model.id.toLowerCase().includes("embed");
          
          const isNotAudio = !model.id.toLowerCase().includes("whisper") &&
                           !model.id.toLowerCase().includes("audio");
          
          const isNotImage = !model.id.toLowerCase().includes("vision") &&
                           !model.id.toLowerCase().includes("image") &&
                           !model.id.toLowerCase().includes("dall-e") &&
                           !model.id.toLowerCase().includes("midjourney");
          
          return isAllowedProvider && isNotEmbedding && isNotAudio && isNotImage;
        })
        .sort((a, b) => {
          // Sort by provider and then by name
          const providerA = a.id.split('/')[0];
          const providerB = b.id.split('/')[0];
          if (providerA !== providerB) {
            return providerA.localeCompare(providerB);
          }
          return a.name.localeCompare(b.name);
        })
        .slice(0, 100) // Increased limit to 100 models
        .map(convertToLLMModel);

      console.log('Filtered models count:', filteredModels.length);
      console.log('Sample models:', filteredModels.slice(0, 10));
      setModels(filteredModels);
    } catch (error) {
      console.error('Failed to fetch models:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch models');
      
      // Fallback to default models on error
      const defaultModels: LLMModel[] = [
        { id: "openai/gpt-4o", name: "GPT-4o", provider: "OpenAI" },
        { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic" },
        { id: "google/gemini-pro-1.5", name: "Gemini Pro 1.5", provider: "Google" },
        { id: "deepseek/deepseek-chat", name: "DeepSeek Chat", provider: "DeepSeek" },
      ];
      setModels(defaultModels);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, isValidKey, convertToLLMModel]);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  return {
    models,
    isLoading,
    error,
    refetch: loadModels,
  };
}