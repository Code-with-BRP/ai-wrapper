import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AVAILABLE_MODELS } from "@/utils/constants";

interface ModelSelectorProps {
  selectedModel: LLMModel | null;
  onModelSelect: (model: LLMModel) => void;
}

export function ModelSelector({ selectedModel, onModelSelect }: ModelSelectorProps) {
  return (
    <Select
      value={selectedModel?.id || ""}
      onValueChange={(value) => {
        const model = AVAILABLE_MODELS.find((m) => m.id === value);
        if (model) {
          onModelSelect(model);
        }
      }}
    >
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Select a model">
          {selectedModel && (
            <div className="flex flex-col items-start">
              <span className="font-medium">{selectedModel.name}</span>
              <span className="text-xs text-muted-foreground">
                {selectedModel.provider}
              </span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {AVAILABLE_MODELS.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            <div className="flex flex-col items-start">
              <span className="font-medium">{model.name}</span>
              <span className="text-xs text-muted-foreground">
                {model.provider}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}