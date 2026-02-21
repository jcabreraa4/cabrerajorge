import { cn } from '@/lib/utils';
import { Suggestion, Suggestions } from '@/components/ui/suggestion';
import { suggestions } from '@/lib/chatbot/suggestions';

interface ChatSuggestionsProps {
  sendMessage: (message: { text: string }, options: { body: { model: string } }) => void;
  setLastInput: (input: string) => void;
  chatModel: string;
  className?: string;
}

export function ChatSuggestions({ sendMessage, setLastInput, chatModel, className }: ChatSuggestionsProps) {
  function handleSuggestion(suggestion: string) {
    sendMessage({ text: suggestion }, { body: { model: chatModel } });
    setLastInput(suggestion);
  }

  return (
    <Suggestions className={cn('max-w-120 lg:max-w-none', className)}>
      {suggestions.map((suggestion) => (
        <Suggestion
          key={suggestion}
          onClick={() => handleSuggestion(suggestion)}
          suggestion={suggestion}
          className="rounded-lg h-9"
        />
      ))}
    </Suggestions>
  );
}
