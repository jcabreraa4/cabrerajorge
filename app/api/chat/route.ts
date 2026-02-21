import { streamText, UIMessage, convertToModelMessages, stepCountIs, UIDataTypes } from 'ai';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { mistral } from '@ai-sdk/mistral';
import { NextResponse } from 'next/server';
import { models } from '@/lib/chatbot/models';
import { auth, currentUser } from '@clerk/nextjs/server';

export const maxDuration = 30;

export type ChatMessage = UIMessage<never, UIDataTypes>;

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
        Feature 1: "Documents". Google-docs-like documents inside the app, for whatever they need to write. (/documents) or (/documents/:documentId) if they are inside a document.
        User's full name: ${user!.fullName}.
        Relevant information about user activity: ${information || 'none'}
    `,
    stopWhen: stepCountIs(5)
  });
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true
  });
}
