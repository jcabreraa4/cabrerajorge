'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { PromptInput, PromptInputBody, PromptInputButton, PromptInputFooter, PromptInputSubmit, PromptInputTextarea, PromptInputTools } from '@/components/ui/prompt-input';
import { models, type ModelId } from '@/lib/chatbot/models';
import { GlobeIcon, PlusIcon, WrenchIcon } from 'lucide-react';
import { ChatMessages } from '@/components/chatbots/chat-messages';
import { ChatSuggestions } from '@/components/chatbots/chat-suggestions';
import { AttachedFiles } from '@/components/chatbots/attached-files';
import { ModelsDialog } from '@/components/chatbots/models-dialog';
import type { ChatMessage } from '@/app/api/chat/route';

export default function Page() {
  const { messages, status, sendMessage, regenerate } = useChat<ChatMessage>();

  const [input, setInput] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);

  const [lastInput, setLastInput] = useState<string>('');
  const [chatModel, setChatModel] = useState<ModelId>('mistral-large-latest');

  const selectedModel = models.find((m) => m.id === chatModel);

  function handleSubmit() {
    const dt = new DataTransfer();
    files.forEach((file) => dt.items.add(file));
    sendMessage({ text: input, files: dt.files }, { body: { model: chatModel } });
    setLastInput(input);
    setInput('');
    setFiles([]);
  }

  return (
    <main className="h-full w-full flex flex-col gap-1 items-center">
      <section className="flex-1 min-h-0 w-full overflow-y-scroll flex justify-center">
        <div className="w-full max-w-200">
          <ChatMessages
            messages={messages}
            status={status}
            regenerate={regenerate}
            lastInput={lastInput}
          />
        </div>
      </section>
      {((messages.length == 0 && !input.trim()) || files.length != 0) && (
        <section className="w-full max-w-200 h-9">
          {messages.length == 0 && !input.trim() && files.length === 0 ? (
            <ChatSuggestions
              sendMessage={sendMessage}
              setLastInput={setLastInput}
              chatModel={chatModel}
            />
          ) : (
            <AttachedFiles
              files={files}
              setFiles={setFiles}
            />
          )}
        </section>
      )}
      <PromptInput
        globalDrop
        multiple
        onSubmit={handleSubmit}
        className="w-full max-w-200 mt-2"
      >
        <PromptInputBody>
          <PromptInputTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Can I help you with anything?"
          />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools className="flex w-full justify-between items-between pe-3">
            <div className="flex gap-2">
              <PromptInputButton
                asChild
                variant="outline"
                className="cursor-pointer"
              >
                <label htmlFor="file-upload">
                  <PlusIcon size={16} />
                </label>
              </PromptInputButton>
              <input
                multiple
                id="file-upload"
                type="file"
                className="hidden"
                onChange={(e) => e.target.files && setFiles([...files, ...Array.from(e.target.files)])}
              />
              <PromptInputButton
                variant={selectedModel?.useTools ? 'default' : 'outline'}
                className={`hidden xl:flex cursor-pointer ${selectedModel?.useTools ? 'hover:bg-primary' : 'hover:bg-transparent text-black dark:text-white'}`}
              >
                <WrenchIcon size={16} />
                Tool Calling
              </PromptInputButton>
              <PromptInputButton
                variant={selectedModel?.webSearch ? 'default' : 'outline'}
                className={`hidden xl:flex cursor-pointer ${selectedModel?.webSearch ? 'hover:bg-primary' : 'hover:bg-transparent text-black dark:text-white'}`}
              >
                <GlobeIcon size={16} />
                Web Search
              </PromptInputButton>
            </div>
            <ModelsDialog
              chatModel={chatModel}
              setChatModel={setChatModel}
            />
          </PromptInputTools>
          <PromptInputSubmit
            disabled={!(input.trim() || files.length > 0) || status === 'streaming'}
            status={status}
            className="cursor-pointer"
          />
        </PromptInputFooter>
      </PromptInput>
    </main>
  );
}
