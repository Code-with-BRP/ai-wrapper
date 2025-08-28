type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

type LLMModel = {
  id: string;
  name: string;
  provider: string;
};

type OpenRouterModel = {
  id: string;
  name: string;
  description?: string;
  context_length: number;
  architecture: {
    modality: string;
    tokenizer: string;
    instruct_type?: string;
  };
  pricing: {
    prompt: string;
    completion: string;
  };
  top_provider: {
    max_completion_tokens?: number;
  };
  per_request_limits?: {
    prompt_tokens?: number;
    completion_tokens?: number;
  };
};

type ApiKeyStatus = "valid" | "invalid" | "checking" | "not-set";

type ApiKeyData = {
  key: string;
  status: ApiKeyStatus;
  lastValidated?: Date;
  creditInfo?: CreditInfo;
};

type CreditInfo = {
  balance: number;
  limit: number;
  usageThisMonth: number;
  label: string;
  isUnlimited: boolean;
  rateLimitPerMinute: number | null;
};

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type ChatCompletionOptions = {
  maxTokens?: number;
  temperature?: number;
  topP?: number;
};
