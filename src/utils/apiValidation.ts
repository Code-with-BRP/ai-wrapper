// OpenRouter API validation utility
export async function validateOpenRouterApiKey(apiKey: string): Promise<{ isValid: boolean; error?: string }> {
  if (!apiKey.trim()) {
    return { isValid: false, error: "API key is required" };
  }

  // Basic format validation - OpenRouter keys typically start with "sk-or-"
  if (!apiKey.startsWith("sk-or-")) {
    return { isValid: false, error: "Invalid API key format. OpenRouter keys should start with 'sk-or-'" };
  }

  try {
    // Test the API key by making a request to OpenRouter's models endpoint
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return { isValid: true };
    } else if (response.status === 401) {
      return { isValid: false, error: "Invalid API key. Please check your OpenRouter API key." };
    } else if (response.status === 429) {
      return { isValid: false, error: "Rate limited. Please try again later." };
    } else {
      return { isValid: false, error: `API validation failed with status ${response.status}` };
    }
  } catch (error) {
    // Network error or other issues
    if (error instanceof Error) {
      return { isValid: false, error: `Network error: ${error.message}` };
    }
    return { isValid: false, error: "Failed to validate API key. Please check your connection." };
  }
}