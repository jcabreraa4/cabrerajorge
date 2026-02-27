'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { PromptInput, PromptInputBody, PromptInputButton, PromptInputFooter, PromptInputSubmit, PromptInputTextarea, PromptInputTools } from '@/components/ui/prompt-input';
import type { ChatMessage } from '@/app/api/chat/route';
import { GlobeIcon, PlusIcon, WrenchIcon } from 'lucide-react';
import { ChatMessages } from '@/components/chatbots/chat-messages';
import { useChatHelperStore } from '@/store/helper-store';
import { usePathname, useSearchParams } from 'next/navigation';
import { AttachedFiles } from '@/components/chatbots/attached-files';
import { ModelsDialog } from '@/components/chatbots/models-dialog';
import { cn } from '@/lib/utils';
import { models, type ModelId } from '@/lib/chatbot/models';

const chatbotPage = 'baldomero';

export function AppChatbot({ className }: { className?: string }) {
  const { messages, status, sendMessage, regenerate } = useChat<ChatMessage>();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const segments = pathname.split('/').filter(Boolean);

  const show = useChatHelperStore((state) => state.show);
  const isChatbotPage = segments[0] === chatbotPage;

  const [input, setInput] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);

  const [lastInput, setLastInput] = useState<string>('');
  const [chatModel, setChatModel] = useState<ModelId>('mistral-large-latest');

  const selectedModel = models.find((m) => m.id === chatModel);

  const fullPath = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
  const information = `The user location within the app is ${fullPath} so maybe he is asking for something related to that.`;

  function handleSubmit() {
    const dt = new DataTransfer();
    files.forEach((file) => dt.items.add(file));
    sendMessage({ text: input, files: dt.files }, { body: { model: chatModel, information } });
    setLastInput(input);
    setInput('');
    setFiles([]);
  }

  if (!show || isChatbotPage) return null;

  return (
    <section className={cn('h-full w-120 flex flex-col gap-2 items-center print:hidden border-l py-4', className)}>
      <div className="flex flex-1 min-h-0 w-full overflow-y-scroll justify-center">
        <div className="w-full">
          <ChatMessages
            messages={messages}
            status={status}
            regenerate={regenerate}
            lastInput={lastInput}
          />
        </div>
      </div>
      <div className="w-full px-4">
        {files.length !== 0 && (
          <AttachedFiles
            files={files}
            setFiles={setFiles}
          />
        )}
      </div>
      <PromptInput
        globalDrop
        multiple
        onSubmit={handleSubmit}
        className="w-full max-w-200 px-4"
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
              </PromptInputButton>
              <PromptInputButton
                variant={selectedModel?.webSearch ? 'default' : 'outline'}
                className={`hidden xl:flex cursor-pointer ${selectedModel?.webSearch ? 'hover:bg-primary' : 'hover:bg-transparent text-black dark:text-white'}`}
              >
                <GlobeIcon size={16} />
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
    </section>
  );
}
