import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

export function ChatMessage({ message, isStreaming = false }: ChatMessageProps) {
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
        
        <div className="max-w-full">
          {/* Timestamp above message */}
          <p className={cn(
            "text-xs mb-1",
            isUser ? "text-right text-muted-foreground" : "text-left text-muted-foreground"
          )}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
          
          <Card className={cn(
            "max-w-full",
            isUser 
              ? "bg-primary text-primary-foreground border-primary" 
              : "bg-card"
          )}>
            <CardContent className="p-3">
              <div className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert prose-pre:bg-muted prose-pre:border">
                {isUser ? (
                  // User messages: plain text with line breaks
                  <div className="whitespace-pre-wrap">{message.content}</div>
                ) : (
                  // Assistant messages: markdown rendering
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      // Custom code block styling
                      code: (props: any) => {
                        const { inline, className, children, ...otherProps } = props;
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <div className="relative">
                            <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                              {match[1]}
                            </div>
                            <code className={className} {...otherProps}>
                              {children}
                            </code>
                          </div>
                        ) : (
                          <code className={cn("bg-muted px-1 py-0.5 rounded text-xs", className)} {...otherProps}>
                            {children}
                          </code>
                        );
                      },
                      // Custom pre styling
                      pre: ({ children, ...props }) => (
                        <pre className="bg-muted border rounded-lg p-4 overflow-x-auto my-2" {...props}>
                          {children}
                        </pre>
                      ),
                      // Custom paragraph styling
                      p: ({ children, ...props }) => (
                        <p className="mb-2 last:mb-0" {...props}>
                          {children}
                        </p>
                      ),
                      // Custom list styling
                      ul: ({ children, ...props }) => (
                        <ul className="list-disc list-inside mb-2 space-y-1" {...props}>
                          {children}
                        </ul>
                      ),
                      ol: ({ children, ...props }) => (
                        <ol className="list-decimal list-inside mb-2 space-y-1" {...props}>
                          {children}
                        </ol>
                      ),
                      // Custom blockquote styling
                      blockquote: ({ children, ...props }) => (
                        <blockquote className="border-l-4 border-muted-foreground/20 pl-4 italic my-2" {...props}>
                          {children}
                        </blockquote>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                )}
                {isStreaming && !isUser && (
                  <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}