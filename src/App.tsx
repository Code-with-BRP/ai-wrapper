import { useRef, useEffect } from 'react';
import { useChat } from './hooks/useChat';
import { ModelSelector } from './components/ModelSelector';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { UserAvatar } from './components/UserAvatar';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Trash2 } from "lucide-react";

function App() {
  const { messages, selectedModel, setSelectedModel, isLoading, sendMessage, clearChat } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <Card className="rounded-none border-x-0 border-t-0">
        <CardContent className="p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-xl font-semibold">AI LLM Wrapper</h1>
                <p className="text-sm text-muted-foreground">
                  Chat with any LLM model through OpenRouter
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <ModelSelector
                selectedModel={selectedModel}
                onModelSelect={setSelectedModel}
              />
              
              {messages.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={clearChat}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Chat
                </Button>
              )}

              <UserAvatar />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <Card className="w-full max-w-md">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
                  <p className="text-muted-foreground">
                    {selectedModel 
                      ? `Selected model: ${selectedModel.name}. Type a message to get started!`
                      : "Select a model from the dropdown above and start chatting."
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="flex items-start space-x-3 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-medium">
                      AI
                    </div>
                    <Card>
                      <CardContent className="p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="px-4 pb-4">
          <ChatInput
            onSendMessage={sendMessage}
            isLoading={isLoading}
            disabled={!selectedModel}
          />
        </div>
      </div>
    </div>
  );
}

export default App;