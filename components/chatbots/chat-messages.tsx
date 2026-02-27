import { Fragment } from 'react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { toast } from 'sonner';
import type { ChatMessage } from '@/app/api/chat/route';
import { CopyIcon, DownloadIcon, ImageIcon, Loader2Icon, MessageSquareIcon, RefreshCcwIcon, SaveIcon } from 'lucide-react';
import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton } from '@/components/ui/conversation';
import { Source, Sources, SourcesContent, SourcesTrigger } from '@/components/ui/sources';
import { Message, MessageAction, MessageActions, MessageContent, MessageResponse } from '@/components/ui/message';
import { Reasoning, ReasoningContent, ReasoningTrigger } from '@/components/ui/reasoning';
import { OpenIn, OpenInChatGPT, OpenInClaude, OpenInContent, OpenInT3, OpenInTrigger } from '@/components/ui/open-in-chat';
import { Attachment, AttachmentPreview, AttachmentRemove, Attachments, type AttachmentData } from '@/components/ui/attachments';
import { Label } from '@/components/ui/label';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from '@/components/ui/tool';
import { CodeBlock } from '@/components/ui/code-block';

interface ChatMessagesProps {
  messages: ChatMessage[];
  status: string;
  regenerate: () => Promise<void>;
  lastInput: string;
}

export function ChatMessages({ messages, status, regenerate, lastInput }: ChatMessagesProps) {
  const { user, isLoaded } = useUser();

  function copyMessage(message: string) {
    navigator.clipboard.writeText(message);
    toast.success('Message copied to clipboard successfully.');
  }

  return (
    <Conversation>
      <ConversationContent>
        {messages.length === 0 && (
          <ConversationEmptyState className="mt-40">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MessageSquareIcon className="size-6" />
                </EmptyMedia>
                <EmptyTitle className="text-xl">No Messages Yet</EmptyTitle>
                {isLoaded && <EmptyDescription className="text-md">How can I help you today, {user?.firstName}?</EmptyDescription>}
              </EmptyHeader>
            </Empty>
          </ConversationEmptyState>
        )}
        {messages.map((message, messageIndex) => {
          const isLastMessage = messageIndex === messages.length - 1;
          const fileParts = message.parts.filter((part) => part.type === 'file');
          const sourceParts = message.parts.filter((part) => part.type === 'source-url');

          return (
            <Fragment key={message.id}>
              {message.role === 'assistant' && sourceParts.length > 0 && (
                <Sources className="my-0">
                  <SourcesTrigger
                    count={sourceParts.length}
                    className="cursor-pointer"
                  />
                  {sourceParts.map((part, i) => (
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
                          <Attachments variant="inline">
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
                          <MessageContent className="text-lg">
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
                            <RefreshCcwIcon />
                          </MessageAction>
                          <MessageAction
                            label="Copy"
                            className="cursor-pointer"
                            onClick={() => copyMessage(part.text)}
                          >
                            <CopyIcon />
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
                } else if (part.type === 'tool-generateImage') {
                  return (
                    <Fragment key={`${message.id}-${partIndex}`}>
                      <Message
                        from={message.role}
                        className="flex flex-col gap-5 items-start"
                      >
                        {part.state != 'output-available' ? (
                          <div className="bg-gray-200 animate-pulse size-50 lg:size-75 xl:size-100 rounded-lg flex gap-2 items-center justify-center">
                            <ImageIcon size={30} />
                            <Label className="text-xl">Generating Image...</Label>
                          </div>
                        ) : (
                          part.output?.status === 200 && (
                            <div className="relative size-50 lg:size-75 xl:size-100 rounded-lg overflow-hidden">
                              <Image
                                fill
                                alt="Image"
                                src={`data:image/png;base64,${part.output.image}`}
                              />
                            </div>
                          )
                        )}
                      </Message>
                      {part.state === 'output-available' && part.output?.status === 200 && (
                        <MessageActions>
                          <MessageAction
                            label="Copy"
                            className="cursor-pointer"
                            onClick={() => {}}
                          >
                            <CopyIcon className="size-3" />
                          </MessageAction>
                          <MessageAction
                            label="Save"
                            className="cursor-pointer"
                            onClick={() => {}}
                          >
                            <SaveIcon className="size-3" />
                          </MessageAction>
                          <MessageAction
                            label="Download"
                            className="cursor-pointer"
                            onClick={() => {}}
                          >
                            <DownloadIcon className="size-3" />
                          </MessageAction>
                          <OpenIn query={'Generate an image with the following prompt: ' + part.output.prompt!}>
                            <OpenInTrigger />
                            <OpenInContent>
                              <OpenInChatGPT />
                              <OpenInClaude />
                            </OpenInContent>
                          </OpenIn>
                        </MessageActions>
                      )}
                    </Fragment>
                  );
                } else if (part.type === 'tool-loadAllDocuments' || part.type === 'tool-loadOneDocument' || part.type === 'tool-updateDocumentContent' || part.type === 'tool-updateDocumentTitle' || part.type === 'tool-loadAllMultimedia') {
                  return (
                    <Tool key={`${message.id}-${partIndex}`}>
                      <ToolHeader
                        type={part.type}
                        state={part.state}
                        className="cursor-pointer"
                      />
                      <ToolContent>
                        <ToolInput input={part.input} />
                        {part.state === 'output-available' && (
                          <ToolOutput
                            output={
                              <CodeBlock
                                code={JSON.stringify(part.output, null, 2)}
                                language="json"
                              />
                            }
                            errorText={part.errorText}
                          />
                        )}
                      </ToolContent>
                    </Tool>
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
