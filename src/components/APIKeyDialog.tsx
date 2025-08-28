import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useApiKey } from "@/hooks/useApiKey";
import { useModels } from "@/hooks/useModels";
import { CreditDisplay } from "./CreditDisplay";
import { cn } from "@/lib/utils";
import {
  Eye,
  EyeOff,
  Key,
  Loader2,
  CheckCircle,
  XCircle,
  ExternalLink,
  Check,
  ChevronsUpDown,
} from "lucide-react";

interface APIKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function APIKeyDialog({ open, onOpenChange }: APIKeyDialogProps) {
  const { apiKeyData, clearApiKey, validateAndFetchCredit, refreshCreditInfo } =
    useApiKey();
  const { models } = useModels(apiKeyData.key, apiKeyData.status === "valid");
  const [inputKey, setInputKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [defaultModel, setDefaultModel] = useState<string>("");
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [modelSearchValue, setModelSearchValue] = useState("");

  // Load default model from localStorage
  useEffect(() => {
    const savedDefaultModel = localStorage.getItem("ai-chat-default-model");
    if (savedDefaultModel) {
      setDefaultModel(savedDefaultModel);
    }
  }, []);

  // Sync input key with apiKeyData whenever it changes
  useEffect(() => {
    if (open) {
      setInputKey(apiKeyData.key || "");
    }
  }, [apiKeyData.key, open]);

  // Initialize input with current key when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setInputKey(apiKeyData.key || "");
      setValidationMessage("");
      // Reload default model when dialog opens
      const savedDefaultModel = localStorage.getItem("ai-chat-default-model");
      if (savedDefaultModel) {
        setDefaultModel(savedDefaultModel);
      }
    }
    onOpenChange(newOpen);
  };

  // Save default model to localStorage
  const handleDefaultModelChange = (modelId: string) => {
    setDefaultModel(modelId);
    localStorage.setItem("ai-chat-default-model", modelId);
    setModelSelectorOpen(false);
    setModelSearchValue("");
  };

  // Get selected model details
  const selectedModelDetails = models.find(
    (model) => model.id === defaultModel
  );

  // Group models by provider for better organization
  const groupedModels = models.reduce((groups, model) => {
    const provider = model.provider;
    if (!groups[provider]) {
      groups[provider] = [];
    }
    groups[provider].push(model);
    return groups;
  }, {} as Record<string, LLMModel[]>);

  const providers = Object.keys(groupedModels).sort();

  const handleValidateAndSave = async () => {
    if (!inputKey.trim()) {
      setValidationMessage("Please enter an API key");
      return;
    }

    setIsValidating(true);
    setValidationMessage("");

    try {
      const result = await validateAndFetchCredit(inputKey.trim());

      if (result.isValid) {
        setValidationMessage("✓ API key is valid and saved!");
        // Add a small delay to ensure localStorage is updated
        setTimeout(() => {
          onOpenChange(false);
        }, 1500);
      } else {
        setValidationMessage(`✗ ${result.error || "Validation failed"}`);
      }
    } catch (error) {
      console.error("Validation error:", error);
      setValidationMessage(
        `✗ Failed to validate API key: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsValidating(false);
    }
  };

  const handleRefreshCredit = async () => {
    setIsRefreshing(true);
    try {
      await refreshCreditInfo();
    } catch (error) {
      console.error("Refresh error:", error);
      setValidationMessage("Failed to refresh credit information");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRemove = () => {
    try {
      clearApiKey();
      setInputKey("");
      setDefaultModel("");
      localStorage.removeItem("ai-chat-default-model");
      setValidationMessage("API key and settings removed");
      setTimeout(() => {
        onOpenChange(false);
      }, 1000);
    } catch (error) {
      console.error("Remove error:", error);
      setValidationMessage("✗ Failed to remove API key");
    }
  };

  const getStatusIcon = () => {
    switch (apiKeyData.status) {
      case "valid":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "invalid":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "checking":
        return <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />;
      default:
        return <Key className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            OpenRouter API Key
          </DialogTitle>
          <DialogDescription>
            Enter your OpenRouter API key to enable chat functionality.{" "}
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              Get your API key here
              <ExternalLink className="h-3 w-3" />
            </a>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showKey ? "text" : "password"}
                placeholder="sk-or-..."
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {apiKeyData.key === inputKey && getStatusIcon()}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {validationMessage && (
            <div
              className={`text-sm p-2 rounded ${
                validationMessage.startsWith("✓")
                  ? "bg-green-50 text-green-700"
                  : validationMessage.startsWith("✗")
                  ? "bg-red-50 text-red-700"
                  : "bg-blue-50 text-blue-700"
              }`}
            >
              {validationMessage}
            </div>
          )}

          {/* Credit Information */}
          {apiKeyData.creditInfo && apiKeyData.status === "valid" && (
            <div className="space-y-2">
              <CreditDisplay
                creditInfo={apiKeyData.creditInfo}
                isRefreshing={isRefreshing}
                onRefresh={handleRefreshCredit}
              />
            </div>
          )}

          {apiKeyData.key && !apiKeyData.creditInfo && (
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Current status: {apiKeyData.status}</div>
              {apiKeyData.lastValidated && (
                <div>
                  Last validated:{" "}
                  {apiKeyData.lastValidated instanceof Date
                    ? apiKeyData.lastValidated.toLocaleString()
                    : new Date(apiKeyData.lastValidated).toLocaleString()}
                </div>
              )}
            </div>
          )}

          {/* Default Model Selection */}
          {models.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="default-model">Default Model</Label>
              <Popover
                open={modelSelectorOpen}
                onOpenChange={setModelSelectorOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={modelSelectorOpen}
                    className="w-full justify-between text-left h-auto p-3"
                  >
                    {selectedModelDetails ? (
                      <div className="flex flex-col items-start">
                        <span className="font-medium truncate max-w-[200px]">
                          {selectedModelDetails.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {selectedModelDetails.provider}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">
                        Select a default model...
                      </span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Search models..."
                      value={modelSearchValue}
                      onValueChange={setModelSearchValue}
                    />
                    <CommandList className="max-h-60">
                      <CommandEmpty>No models found.</CommandEmpty>
                      {providers.map((provider) => (
                        <CommandGroup key={provider} heading={provider}>
                          {groupedModels[provider].map((model) => (
                            <CommandItem
                              key={model.id}
                              value={`${model.name} ${model.provider} ${model.id}`}
                              onSelect={() =>
                                handleDefaultModelChange(model.id)
                              }
                              className="flex items-center gap-2 py-2"
                            >
                              <Check
                                className={cn(
                                  "h-4 w-4",
                                  defaultModel === model.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col flex-1 min-w-0">
                                <span className="font-medium truncate">
                                  {model.name}
                                </span>
                                <span className="text-xs text-muted-foreground truncate">
                                  {model.id}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <div className="text-xs text-muted-foreground">
                This model will be automatically selected when you start the
                app.
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          {apiKeyData.key && (
            <Button variant="destructive" onClick={handleRemove}>
              Remove Key
            </Button>
          )}

          <Button
            onClick={handleValidateAndSave}
            disabled={isValidating || !inputKey.trim()}
          >
            {isValidating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : (
              "Validate & Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
