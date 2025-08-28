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

type ApiKeyStatus = "valid" | "invalid" | "checking" | "not-set";

type ApiKeyData = {
  key: string;
  status: ApiKeyStatus;
  lastValidated?: Date;
};
