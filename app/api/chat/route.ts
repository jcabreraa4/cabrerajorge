import { streamText, UIMessage, convertToModelMessages, stepCountIs, UIDataTypes, InferUITools } from 'ai';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { mistral } from '@ai-sdk/mistral';
import { NextResponse } from 'next/server';
import { models } from '@/lib/chatbot/models';
import { auth, currentUser } from '@clerk/nextjs/server';
import { tools } from './tools';

export const maxDuration = 30;

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(request: Request) {
  const { messages, model, information }: { messages: UIMessage[]; model: string; information?: string } = await request.json();

  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await currentUser();

  const selectedModel = models.find((m) => m.id === model);

  const result = streamText({
    model: selectedModel?.chefSlug === 'openai' ? openai(model) : selectedModel?.chefSlug === 'google' ? google(model) : mistral(model),
    messages: await convertToModelMessages(messages),
    system: `
        You are a helpful, approachable, personal assistant inside a web application with useful features.
        Feature 1: "Documents". User's Google-docs-like text documents with a tiptap-editor format. App location: (/documents) or (/documents/:documentId) if they are inside a document. When updating a document, first LOAD that document to see whats inside and always return content as valid ProseMirror JSON, preserving existing content unless told otherwise. Base structure: {"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"Text in the document"}]}]}
        Feature 2: "Multimedia". User's images, videos, audios and pdfs. App location: (/multimedia).
        User's first name: ${user!.firstName}.
        Relevant information about user activity: ${information || 'none'}
    `,
    tools: tools,
    stopWhen: stepCountIs(5)
  });
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true
  });
}
