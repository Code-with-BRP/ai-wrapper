import { useState } from 'react';
import { AVAILABLE_MODELS } from '../utils/constants';

interface ModelSelectorProps {
  selectedModel: LLMModel | null;
  onModelSelect: (model: LLMModel) => void;
}

export function ModelSelector({ selectedModel, onModelSelect }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <div className="flex flex-col">
          {selectedModel ? (
            <>
              <span className="font-medium text-gray-900">{selectedModel.name}</span>
              <span className="text-sm text-gray-500">{selectedModel.provider}</span>
            </>
          ) : (
            <span className="text-gray-500">Select a model</span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="py-1 max-h-60 overflow-auto">
            {AVAILABLE_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onModelSelect(model);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{model.name}</span>
                  <span className="text-sm text-gray-500">{model.provider}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}