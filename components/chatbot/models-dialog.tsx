import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { ModelSelector, ModelSelectorContent, ModelSelectorEmpty, ModelSelectorGroup, ModelSelectorInput, ModelSelectorItem, ModelSelectorList, ModelSelectorLogo, ModelSelectorLogoGroup, ModelSelectorName, ModelSelectorTrigger } from '@/components/ui/model-selector';
import { PromptInputButton } from '@/components/ui/prompt-input';
import { useState } from 'react';
import { models, chefs, type ModelId } from '@/lib/chatbot/models';

interface ModelsDialogProps {
  chatModel: ModelId;
  setChatModel: (model: ModelId) => void;
}

export function ModelsDialog({ chatModel, setChatModel }: ModelsDialogProps) {
  const [openSelector, setOpenSelector] = useState<boolean>(false);

  const selectedModel = models.find((m) => m.id === chatModel);

  return (
    <ModelSelector
      onOpenChange={setOpenSelector}
      open={openSelector}
    >
      <ModelSelectorTrigger
        asChild
        className="cursor-pointer truncate"
      >
        <PromptInputButton variant="ghost">
          {selectedModel?.chefSlug && <ModelSelectorLogo provider={selectedModel.chefSlug} />}
          {selectedModel?.name && <ModelSelectorName>{selectedModel.name}</ModelSelectorName>}
          <ChevronDownIcon />
        </PromptInputButton>
      </ModelSelectorTrigger>
      <ModelSelectorContent>
        <ModelSelectorInput placeholder="Search models..." />
        <ModelSelectorList>
          <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
          {chefs.map((chef) => (
            <ModelSelectorGroup
              key={chef}
              heading={chef}
            >
              {models
                .filter((model) => model.chef === chef)
                .map((model) => (
                  <ModelSelectorItem
                    key={model.id}
                    onSelect={() => {
                      setChatModel(model.id);
                      setOpenSelector(false);
                    }}
                    value={model.id}
                  >
                    <ModelSelectorLogo provider={model.chefSlug} />
                    <ModelSelectorName>{model.name}</ModelSelectorName>
                    <ModelSelectorLogoGroup>
                      {model.providers.map((provider) => (
                        <ModelSelectorLogo
                          key={provider}
                          provider={provider}
                        />
                      ))}
                    </ModelSelectorLogoGroup>
                    {chatModel === model.id ? <CheckIcon className="ml-auto size-4" /> : <div className="ml-auto size-4" />}
                  </ModelSelectorItem>
                ))}
            </ModelSelectorGroup>
          ))}
        </ModelSelectorList>
      </ModelSelectorContent>
    </ModelSelector>
  );
}
