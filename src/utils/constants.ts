export const AVAILABLE_MODELS: LLMModel[] = [
  { id: "openai/gpt-4", name: "GPT-4", provider: "OpenAI" },
  { id: "openai/gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI" },
  {
    id: "anthropic/claude-3-sonnet",
    name: "Claude 3 Sonnet",
    provider: "Anthropic",
  },
  {
    id: "anthropic/claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "Anthropic",
  },
  { id: "google/gemini-pro", name: "Gemini Pro", provider: "Google" },
  { id: "meta-llama/llama-2-70b-chat", name: "Llama 2 70B", provider: "Meta" },
];