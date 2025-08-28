import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string, onSent?: () => void) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, isLoading, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message, () => {
        // Focus back to input after sending
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 100);
      });
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  // Auto-focus when component becomes enabled
  useEffect(() => {
    if (!disabled && !isLoading) {
      textareaRef.current?.focus();
    }
  }, [disabled, isLoading]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? "Select a model to start chatting..." : "Type your message..."}
            disabled={disabled || isLoading}
            className="min-h-[40px] max-h-[120px] resize-none"
            rows={1}
          />
        </div>
        
        <Button
          onClick={handleSubmit}
          disabled={!message.trim() || isLoading || disabled}
          size="icon"
          className="h-10 w-10"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}