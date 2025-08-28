import { useState, useEffect, useCallback } from "react";

const API_KEY_STORAGE_KEY = "openrouter_api_key";

export function useApiKey() {
  const [apiKeyData, setApiKeyData] = useState<ApiKeyData>({
    key: "",
    status: "not-set",
  });

  // Load API key from localStorage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedKey) {
      try {
        const parsed = JSON.parse(storedKey);
        setApiKeyData(parsed);
      } catch (error) {
        // If parsing fails, treat as a plain string key
        setApiKeyData({
          key: storedKey,
          status: "not-set",
        });
      }
    }
  }, []);

  const saveApiKey = useCallback((key: string, status: ApiKeyStatus = "not-set") => {
    const newApiKeyData: ApiKeyData = {
      key: key.trim(),
      status,
      lastValidated: status === "valid" ? new Date() : undefined,
    };

    setApiKeyData(newApiKeyData);
    
    if (key.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, JSON.stringify(newApiKeyData));
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
  }, []);

  const clearApiKey = useCallback(() => {
    setApiKeyData({
      key: "",
      status: "not-set",
    });
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  }, []);

  const updateStatus = useCallback((status: ApiKeyStatus) => {
    setApiKeyData(prev => {
      const updated = {
        ...prev,
        status,
        lastValidated: status === "valid" ? new Date() : prev.lastValidated,
      };
      
      if (prev.key) {
        localStorage.setItem(API_KEY_STORAGE_KEY, JSON.stringify(updated));
      }
      
      return updated;
    });
  }, []);

  return {
    apiKeyData,
    saveApiKey,
    clearApiKey,
    updateStatus,
    hasApiKey: !!apiKeyData.key,
    isValidApiKey: apiKeyData.status === "valid",
  };
}