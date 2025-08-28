import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApiKey } from "@/hooks/useApiKey";
import { APIKeyDialog } from "./APIKeyDialog";
import { Key, User, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function UserAvatar() {
  const { apiKeyData, hasApiKey, isValidApiKey } = useApiKey();
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);

  const getStatusIcon = () => {
    switch (apiKeyData.status) {
      case "valid":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "invalid":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "checking":
        return <AlertCircle className="h-4 w-4 text-yellow-500 animate-pulse" />;
      default:
        return <Key className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (apiKeyData.status) {
      case "valid":
        return "API Key Valid";
      case "invalid":
        return "API Key Invalid";
      case "checking":
        return "Validating...";
      default:
        return hasApiKey ? "API Key Not Validated" : "No API Key";
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
            <AvatarFallback className={cn(
              "relative",
              isValidApiKey ? "bg-green-100 text-green-700" : 
              hasApiKey ? "bg-yellow-100 text-yellow-700" : 
              "bg-muted text-muted-foreground"
            )}>
              <User className="h-4 w-4" />
              {/* Status indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-background border border-background flex items-center justify-center">
                {apiKeyData.status === "valid" && (
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                )}
                {apiKeyData.status === "invalid" && (
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                )}
                {apiKeyData.status === "checking" && (
                  <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                )}
                {apiKeyData.status === "not-set" && hasApiKey && (
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                )}
              </div>
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Account Settings
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => setShowApiKeyDialog(true)}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <span>API Key Settings</span>
              </div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          
          <div className="px-2 py-1.5">
            <div className="text-xs text-muted-foreground">
              Status: {getStatusText()}
            </div>
            {apiKeyData.lastValidated && (
              <div className="text-xs text-muted-foreground">
                Last validated: {apiKeyData.lastValidated.toLocaleDateString()}
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <APIKeyDialog 
        open={showApiKeyDialog}
        onOpenChange={setShowApiKeyDialog}
      />
    </>
  );
}