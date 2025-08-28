import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn("flex mb-4", isUser ? "justify-end" : "justify-start")}>
      <div className={cn(
        "flex items-start space-x-3 max-w-[80%]",
        isUser ? "flex-row-reverse space-x-reverse" : ""
      )}>
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarFallback className={cn(
            "text-xs font-medium",
            isUser 
              ? "bg-primary text-primary-foreground" 
              : "bg-secondary text-secondary-foreground"
          )}>
            {isUser ? 'U' : 'AI'}
          </AvatarFallback>
        </Avatar>
        
        <Card className={cn(
          "max-w-full",
          isUser 
            ? "bg-primary text-primary-foreground border-primary" 
            : "bg-card"
        )}>
          <CardContent className="p-3">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
            <p className={cn(
              "text-xs mt-2",
              isUser ? "text-primary-foreground/70" : "text-muted-foreground"
            )}>
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}