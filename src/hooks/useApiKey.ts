import { useState, useEffect, useCallback } from "react";
import { fetchCreditInfo, validateApiKey } from "@/services/openrouter";

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
        // Convert date strings back to Date objects
        if (parsed.lastValidated) {
          parsed.lastValidated = new Date(parsed.lastValidated);
        }
        setApiKeyData(parsed);
      } catch (error) {
        console.error("Failed to parse API key from localStorage:", error);
        // If parsing fails, treat as a plain string key
        setApiKeyData({
          key: storedKey,
          status: "not-set",
        });
      }
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
    setApiKeyData((prev) => {
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

  const validateAndFetchCredit = useCallback(
    async (key: string): Promise<{ isValid: boolean; error?: string }> => {
      const trimmedKey = key.trim();
      if (!trimmedKey) {
        return { isValid: false, error: "API key is required" };
      }

      updateStatus("checking");

      try {
        console.log("Validating API key...");
        const validationResult = await validateApiKey(trimmedKey);

        if (validationResult.isValid) {
          console.log("API key is valid, fetching credit info...");
          // Fetch credit info after successful validation
          try {
            const creditInfo = await fetchCreditInfo(trimmedKey);
            const updated = {
              key: trimmedKey,
              status: "valid" as ApiKeyStatus,
              lastValidated: new Date(),
              creditInfo,
            };

            setApiKeyData(updated);
            localStorage.setItem(API_KEY_STORAGE_KEY, JSON.stringify(updated));
            console.log("API key and credit info saved successfully");
            return { isValid: true };
          } catch (creditError) {
            console.warn("Credit fetch failed, but key is valid:", creditError);
            // Key is valid but credit fetch failed - still save as valid
            const updated = {
              key: trimmedKey,
              status: "valid" as ApiKeyStatus,
              lastValidated: new Date(),
            };

            setApiKeyData(updated);
            localStorage.setItem(API_KEY_STORAGE_KEY, JSON.stringify(updated));
            return {
              isValid: true,
              error: "API key valid, but couldn't fetch credit info",
            };
          }
        } else {
          console.log("API key validation failed:", validationResult.error);
          updateStatus("invalid");
          return { isValid: false, error: validationResult.error };
        }
      } catch (error) {
        console.error("Validation error:", error);
        updateStatus("invalid");
        return {
          isValid: false,
          error: error instanceof Error ? error.message : "Validation failed",
        };
      }
    },
    [updateStatus]
  );

  const refreshCreditInfo = useCallback(async () => {
    if (!apiKeyData.key || apiKeyData.status !== "valid") {
      return;
    }

    try {
      const creditInfo = await fetchCreditInfo(apiKeyData.key);
      setApiKeyData((prev) => {
        const updated = { ...prev, creditInfo };
        localStorage.setItem(API_KEY_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error("Failed to refresh credit info:", error);
    }
  }, [apiKeyData.key, apiKeyData.status]);

  return {
    apiKeyData,
    clearApiKey,
    updateStatus,
    validateAndFetchCredit,
    refreshCreditInfo,
    hasApiKey: !!apiKeyData.key,
    isValidApiKey: apiKeyData.status === "valid",
  };
}
