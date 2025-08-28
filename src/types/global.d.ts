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
