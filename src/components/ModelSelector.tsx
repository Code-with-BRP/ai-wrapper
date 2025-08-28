import { useState } from "react";
import { Check, ChevronsUpDown, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { useModels } from "@/hooks/useModels";
import { useApiKey } from "@/hooks/useApiKey";

interface ModelSelectorProps {
  selectedModel: LLMModel | null;
  onModelSelect: (model: LLMModel) => void;
}

export function ModelSelector({
  selectedModel,
  onModelSelect,
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { apiKeyData, isValidApiKey } = useApiKey();
  const { models, isLoading, error } = useModels(apiKeyData.key, isValidApiKey);

  const handleModelSelect = (model: LLMModel) => {
    onModelSelect(model);
    setOpen(false);
    setSearchValue("");
  };

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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="p-6">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-64 justify-between"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading models...</span>
            </div>
          ) : selectedModel ? (
            <div className="flex flex-col items-start text-left">
              <span className="font-medium truncate max-w-48">
                {selectedModel.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {selectedModel.provider}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground">
              {error ? "Using default models" : "Select a model"}
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search models..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList className="max-h-80">
            <CommandEmpty>No models found.</CommandEmpty>

            {error && (
              <div className="p-2">
                <div className="flex items-center gap-2 text-yellow-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>Using default models due to API error</span>
                </div>
              </div>
            )}

            {providers.map((provider) => (
              <CommandGroup key={provider} heading={provider}>
                {groupedModels[provider].map((model) => (
                  <CommandItem
                    key={model.id}
                    value={`${model.name} ${model.provider} ${model.id}`}
                    onSelect={() => handleModelSelect(model)}
                    className="flex items-center gap-2 py-2"
                  >
                    <Check
                      className={cn(
                        "h-4 w-4",
                        selectedModel?.id === model.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-medium truncate">{model.name}</span>
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
  );
}
