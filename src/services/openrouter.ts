// OpenRouter API service functions

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

class OpenRouterAPIError extends Error {
  public status: number;
  public response?: any;
  
  constructor(status: number, message: string, response?: any) {
    super(message);
    this.name = 'OpenRouterAPIError';
    this.status = status;
    this.response = response;
  }
}

async function makeRequest(endpoint: string, apiKey: string, options: RequestInit = {}) {
  const url = `${OPENROUTER_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'AI LLM Wrapper',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new OpenRouterAPIError(
      response.status,
      errorData?.error?.message || `API request failed with status ${response.status}`,
      errorData
    );
  }

  return response.json();
}

// Fetch available models
export async function fetchModels(apiKey: string): Promise<OpenRouterModel[]> {
  try {
    const data = await makeRequest('/models', apiKey);
    return data.data || [];
  } catch (error) {
    console.error('Error fetching models:', error);
    throw error;
  }
}

// Fetch credit information
export async function fetchCreditInfo(apiKey: string): Promise<CreditInfo> {
  try {
    const data = await makeRequest('/auth/key', apiKey);
    return {
      balance: data.data?.usage || 0,
      limit: data.data?.limit || 0,
      usageThisMonth: data.data?.usage || 0,
      label: data.data?.label || 'API Key',
      isUnlimited: data.data?.is_free_tier === false && data.data?.limit === null,
      rateLimitPerMinute: data.data?.rate_limit?.requests_per_minute || null,
    };
  } catch (error) {
    console.error('Error fetching credit info:', error);
    throw error;
  }
}

// Send chat completion request (non-streaming)
export async function sendChatCompletion(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  options: ChatCompletionOptions = {}
): Promise<string> {
  try {
    const body = {
      model,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      max_tokens: options.maxTokens || 1000,
      temperature: options.temperature || 0.7,
      top_p: options.topP || 1,
      stream: false,
    };

    const data = await makeRequest('/chat/completions', apiKey, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return data.choices?.[0]?.message?.content || 'No response generated.';
  } catch (error) {
    console.error('Error sending chat completion:', error);
    if (error instanceof OpenRouterAPIError) {
      if (error.status === 402) {
        throw new Error('Insufficient credits. Please check your OpenRouter account balance.');
      } else if (error.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      } else if (error.status === 400) {
        throw new Error('Invalid request. Please check your model selection and message format.');
      }
    }
    throw new Error('Failed to get response from the AI model. Please try again.');
  }
}

// Send streaming chat completion request
export async function sendStreamingChatCompletion(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void,
  options: ChatCompletionOptions = {}
): Promise<void> {
  try {
    const body = {
      model,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      max_tokens: options.maxTokens || 1000,
      temperature: options.temperature || 0.7,
      top_p: options.topP || 1,
      stream: true,
    };

    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'AI LLM Wrapper',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new OpenRouterAPIError(
        response.status,
        errorData?.error?.message || `API request failed with status ${response.status}`,
        errorData
      );
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body reader available');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || !trimmedLine.startsWith('data: ')) continue;

          const data = trimmedLine.slice(6);
          if (data === '[DONE]') {
            onComplete();
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              onChunk(content);
            }
          } catch (parseError) {
            console.warn('Failed to parse streaming chunk:', parseError);
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    onComplete();
  } catch (error) {
    console.error('Error in streaming chat completion:', error);
    if (error instanceof OpenRouterAPIError) {
      if (error.status === 402) {
        onError(new Error('Insufficient credits. Please check your OpenRouter account balance.'));
      } else if (error.status === 429) {
        onError(new Error('Rate limit exceeded. Please try again in a moment.'));
      } else if (error.status === 400) {
        onError(new Error('Invalid request. Please check your model selection and message format.'));
      } else {
        onError(new Error(error.message));
      }
    } else {
      onError(new Error('Failed to get response from the AI model. Please try again.'));
    }
  }
}

// Validate API key and return basic info
export async function validateApiKey(apiKey: string): Promise<{ isValid: boolean; error?: string; keyInfo?: any }> {
  try {
    const data = await makeRequest('/auth/key', apiKey);
    return {
      isValid: true,
      keyInfo: data.data,
    };
  } catch (error) {
    if (error instanceof OpenRouterAPIError) {
      if (error.status === 401) {
        return { isValid: false, error: 'Invalid API key' };
      } else if (error.status === 429) {
        return { isValid: false, error: 'Rate limited. Please try again later.' };
      }
      return { isValid: false, error: `API error: ${error.message}` };
    }
    return { isValid: false, error: 'Network error. Please check your connection.' };
  }
}