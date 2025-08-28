import { useState } from "react";
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
import { useApiKey } from "@/hooks/useApiKey";
import { validateOpenRouterApiKey } from "@/utils/apiValidation";
import { Eye, EyeOff, Key, Loader2, CheckCircle, XCircle, ExternalLink } from "lucide-react";

interface APIKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function APIKeyDialog({ open, onOpenChange }: APIKeyDialogProps) {
  const { apiKeyData, saveApiKey, clearApiKey, updateStatus } = useApiKey();
  const [inputKey, setInputKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  // Initialize input with current key when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setInputKey(apiKeyData.key || "");
      setValidationMessage("");
    }
    onOpenChange(newOpen);
  };

  const handleValidateAndSave = async () => {
    if (!inputKey.trim()) {
      setValidationMessage("Please enter an API key");
      return;
    }

    setIsValidating(true);
    setValidationMessage("");
    updateStatus("checking");

    try {
      const result = await validateOpenRouterApiKey(inputKey);
      
      if (result.isValid) {
        saveApiKey(inputKey, "valid");
        setValidationMessage("✓ API key is valid and saved!");
        setTimeout(() => {
          onOpenChange(false);
        }, 1500);
      } else {
        updateStatus("invalid");
        setValidationMessage(`✗ ${result.error}`);
      }
    } catch (error) {
      updateStatus("invalid");
      setValidationMessage("✗ Failed to validate API key. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleSaveWithoutValidation = () => {
    if (!inputKey.trim()) {
      setValidationMessage("Please enter an API key");
      return;
    }

    saveApiKey(inputKey, "not-set");
    setValidationMessage("API key saved (not validated)");
    setTimeout(() => {
      onOpenChange(false);
    }, 1000);
  };

  const handleRemove = () => {
    clearApiKey();
    setInputKey("");
    setValidationMessage("API key removed");
    setTimeout(() => {
      onOpenChange(false);
    }, 1000);
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
                  {showKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          </div>

          {validationMessage && (
            <div className={`text-sm p-2 rounded ${
              validationMessage.startsWith("✓") ? "bg-green-50 text-green-700" :
              validationMessage.startsWith("✗") ? "bg-red-50 text-red-700" :
              "bg-blue-50 text-blue-700"
            }`}>
              {validationMessage}
            </div>
          )}

          {apiKeyData.key && (
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Current status: {apiKeyData.status}</div>
              {apiKeyData.lastValidated && (
                <div>Last validated: {apiKeyData.lastValidated.toLocaleString()}</div>
              )}
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
            variant="outline" 
            onClick={handleSaveWithoutValidation}
            disabled={isValidating || !inputKey.trim()}
          >
            Save Only
          </Button>
          
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