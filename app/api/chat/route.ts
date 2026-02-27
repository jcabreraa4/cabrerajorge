import { streamText, UIMessage, convertToModelMessages, stepCountIs, UIDataTypes, InferUITools } from 'ai';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { mistral } from '@ai-sdk/mistral';
import { NextResponse } from 'next/server';
import { models } from '@/lib/chatbot/models';
import { auth, currentUser } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { tools } from './tools';

export const maxDuration = 30;

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(request: Request) {
  const headersList = await headers();
  const referer = headersList.get('referer') ?? 'unknown';
  const url = new URL(referer);
  const currentPath = url.pathname + (url.search ? url.search : '');
  const date = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const { messages, model }: { messages: UIMessage[]; model: string } = await request.json();

  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await currentUser();

  const selectedModel = models.find((m) => m.id === model);

  const result = streamText({
    model: selectedModel?.chefSlug === 'openai' ? openai(model) : selectedModel?.chefSlug === 'google' ? google(model) : mistral(model),
    messages: await convertToModelMessages(messages),
    system: `
        You are Baldomero, a helpful, approachable, personal assistant inside a web application with useful features. You must chat in the same language the user does. This is today's date: ${date}.
        Page 1: "Overview". Just a dashboard with basic info about the user and the app (Nothing relevant from the url location here).
        Page 2: "Baldomero". The main chatbot UI when talking to AI (Nothing relevant from the url location here).
        Page 3: "Documents". User's Google-docs-like text documents with a tiptap-editor format. App location: (/documents) or (/documents/:documentId) if they are inside a document. When updating a document, first LOAD that document to see whats inside and always return content as valid ProseMirror JSON, preserving existing content unless told otherwise. Base structure: {"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"Text in the document"}]}]}
        Page 4: "Multimedia". User's images, videos, audios and pdfs. App location: (/multimedia) or (/multimedia/:fileId) if they are watching a file.
        User's first name: ${user!.firstName}.
        Relevant information about user activity: ${currentPath || 'unknown'}.
    `,
    tools: tools,
    stopWhen: stepCountIs(5)
  });
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true
  });
}
