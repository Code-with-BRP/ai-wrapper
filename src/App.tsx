import { useRef, useEffect, useState } from 'react';
import { useChat } from './hooks/useChat';
import { useModels } from './hooks/useModels';
import { useApiKey } from './hooks/useApiKey';
import { ModelSelector } from './components/ModelSelector';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { UserAvatar } from './components/UserAvatar';
import { ModelChangeDialog } from './components/ModelChangeDialog';
import { DeleteConfirmDialog } from './components/DeleteConfirmDialog';
import { ModeToggle } from './components/mode-toggle';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Trash2 } from "lucide-react";

function App() {
  const { 
    messages, 
    selectedModel, 
    setSelectedModel, 
    confirmModelChange,
    isLoading, 
    streamingMessageId,
    sendMessage, 
    clearChat
  } = useChat();
  const { apiKeyData, isValidApiKey } = useApiKey();
  const { models } = useModels(apiKeyData.key, isValidApiKey);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [pendingModel, setPendingModel] = useState<LLMModel | null>(null);
  const [showModelChangeDialog, setShowModelChangeDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [hasLoadedDefaultModel, setHasLoadedDefaultModel] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load default model when models are available
  useEffect(() => {
    if (models.length > 0 && !selectedModel && !hasLoadedDefaultModel) {
      const savedDefaultModel = localStorage.getItem('ai-chat-default-model');
      if (savedDefaultModel) {
        const defaultModel = models.find(model => model.id === savedDefaultModel);
        if (defaultModel) {
          setSelectedModel(defaultModel);
          setHasLoadedDefaultModel(true);
        }
      }
    }
  }, [models, selectedModel, hasLoadedDefaultModel, setSelectedModel]);

  const handleModelSelect = (model: LLMModel) => {
    const changed = setSelectedModel(model, () => {
      // Show confirmation dialog
      setPendingModel(model);
      setShowModelChangeDialog(true);
    });
    
    // If changed without confirmation, no need for dialog
    if (!changed) {
      // Dialog will be shown by the callback
    }
  };

  const handleConfirmModelChange = () => {
    if (pendingModel) {
      confirmModelChange(pendingModel);
      setPendingModel(null);
    }
  };

  const handleDeleteConfirm = () => {
    clearChat();
    setShowDeleteDialog(false);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Fixed Header */}
      <Card className="rounded-none border-x-0 border-t-0 border-b shadow-sm z-10 sticky top-0 bg-background">
        <CardContent className="p-3 sm:p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            {/* Mobile: Stack vertically, Desktop: Side by side */}
            <div className="flex items-center space-x-2 min-w-0">
              <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-semibold truncate">AI-CHAT</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  Chat with any AI model through OpenRouter
                </p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <ModelSelector
                selectedModel={selectedModel}
                onModelSelect={handleModelSelect}
              />
              
              {messages.length > 0 && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Chat
                </Button>
              )}

              <ModeToggle />
              <UserAvatar />
            </div>

            {/* Mobile: Theme toggle and Avatar */}
            <div className="md:hidden flex items-center space-x-2">
              <ModeToggle />
              <UserAvatar />
            </div>
          </div>

          {/* Mobile: Model selector and clear chat below on mobile */}
          <div className="md:hidden mt-3 flex items-center justify-between space-x-2">
            <div className="flex-1">
              <ModelSelector
                selectedModel={selectedModel}
                onModelSelect={handleModelSelect}
              />
            </div>
            
            {messages.length > 0 && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="gap-2 flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden xs:inline">Clear</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Scrollable Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full min-h-0">
        {/* Messages - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
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
                <ChatMessage 
                  key={message.id} 
                  message={message}
                  isStreaming={streamingMessageId === message.id}
                />
              ))}
              {isLoading && !streamingMessageId && (
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

        {/* Fixed Input Area */}
        <div className="border-t bg-background p-4">
          <ChatInput
            onSendMessage={sendMessage}
            isLoading={isLoading}
            disabled={!selectedModel}
          />
        </div>
      </div>

      {/* Model Change Confirmation Dialog */}
      <ModelChangeDialog
        open={showModelChangeDialog}
        onOpenChange={setShowModelChangeDialog}
        currentModel={selectedModel}
        newModel={pendingModel}
        onConfirm={handleConfirmModelChange}
        messageCount={messages.length}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteConfirm}
        messageCount={messages.length}
      />
    </div>
  );
}

export default App;