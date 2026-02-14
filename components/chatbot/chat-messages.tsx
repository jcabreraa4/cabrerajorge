import { Fragment } from 'react';
import { Conversation, ConversationContent, ConversationScrollButton } from '@/components/ui/conversation';
import { Source, Sources, SourcesContent, SourcesTrigger } from '@/components/ui/sources';
import { Message, MessageAction, MessageActions, MessageContent, MessageResponse } from '@/components/ui/message';
import { Reasoning, ReasoningContent, ReasoningTrigger } from '@/components/ui/reasoning';
import { OpenIn, OpenInChatGPT, OpenInClaude, OpenInContent, OpenInT3, OpenInTrigger } from '@/components/ui/open-in-chat';
import { Attachment, AttachmentPreview, AttachmentRemove, Attachments, type AttachmentData } from '@/components/ui/attachments';
import { toast } from 'sonner';

import type { ChatMessage } from '@/app/api/chat/route';
import { CopyIcon, Loader2Icon, RefreshCcwIcon } from 'lucide-react';

interface ChatConversationProps {
  messages: ChatMessage[];
  status: string;
  regenerate: () => Promise<void>;
  lastInput: string;
}

export function ChatMessages({ messages, status, regenerate, lastInput }: ChatConversationProps) {
  function copyMessage(message: string) {
    navigator.clipboard.writeText(message);
    toast.success('Message copied to clipboard successfully.');
  }

  return (
    <Conversation>
      <ConversationContent>
        {messages.map((message, messageIndex) => {
          const isLastMessage = messageIndex === messages.length - 1;
          const fileParts = message.parts.filter((part) => part.type === 'file');
          return (
            <Fragment key={message.id}>
              {message.role === 'assistant' && message.parts.filter((part) => part.type === 'source-url').length > 0 && (
                <Sources className="my-0">
                  <SourcesTrigger
                    count={message.parts.filter((part) => part.type === 'source-url').length}
                    className="cursor-pointer"
                  />
                  {message.parts
                    .filter((part) => part.type === 'source-url')
                    .map((part, i) => (
                      <SourcesContent key={`${message.id}-${i}`}>
                        <Source
                          key={`${message.id}-${i}`}
                          href={part.url}
                          title={part.url}
                        />
                      </SourcesContent>
                    ))}
                </Sources>
              )}
              {message.parts.map((part, partIndex) => {
                if (part.type === 'text') {
                  return (
                    <Fragment key={`${message.id}-${partIndex}`}>
                      <Message from={message.role}>
                        {message.role === 'user' && fileParts.length > 0 && (
                          <Attachments variant="grid">
                            {fileParts.map((file, fileIndex) => {
                              const attachmentData: AttachmentData = {
                                ...file,
                                id: `${message.id}-${fileIndex}`
                              };

                              return (
                                <Attachment
                                  key={attachmentData.id}
                                  data={attachmentData}
                                >
                                  <AttachmentPreview />
                                  <AttachmentRemove />
                                </Attachment>
                              );
                            })}
                          </Attachments>
                        )}
                        {part.text.trim() && (
                          <MessageContent>
                            <MessageResponse>{part.text}</MessageResponse>
                          </MessageContent>
                        )}
                      </Message>
                      {message.role === 'assistant' && isLastMessage && (
                        <MessageActions>
                          <MessageAction
                            label="Retry"
                            className="cursor-pointer"
                            onClick={() => regenerate()}
                          >
                            <RefreshCcwIcon className="size-3" />
                          </MessageAction>
                          <MessageAction
                            label="Copy"
                            className="cursor-pointer"
                            onClick={() => copyMessage(part.text)}
                          >
                            <CopyIcon className="size-3" />
                          </MessageAction>
                          <OpenIn query={lastInput}>
                            <OpenInTrigger />
                            <OpenInContent>
                              <OpenInChatGPT />
                              <OpenInClaude />
                              <OpenInT3 />
                            </OpenInContent>
                          </OpenIn>
                        </MessageActions>
                      )}
                    </Fragment>
                  );
                } else if (part.type === 'reasoning') {
                  return (
                    <Reasoning
                      key={`${message.id}-${partIndex}`}
                      className="w-full"
                      isStreaming={status === 'streaming' && partIndex === message.parts.length - 1 && message.id === messages.at(-1)?.id}
                    >
                      <ReasoningTrigger />
                      <ReasoningContent>{part.text}</ReasoningContent>
                    </Reasoning>
                  );
                }
              })}
            </Fragment>
          );
        })}
        {status === 'submitted' && <Loader2Icon className="animate-spin text-muted-foreground" />}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
