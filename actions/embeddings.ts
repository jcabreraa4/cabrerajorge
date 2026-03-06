'use server';

import { PDFParse } from 'pdf-parse';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { openai } from '@ai-sdk/openai';
import { embedMany } from 'ai';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { embed } from 'ai';

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 20,
  separators: [' ']
});

export async function processFile(file: File) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: 'Unauthorized'
      };
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const parser = new PDFParse({ data: buffer });
    const data = await parser.getText();
    if (!data?.text?.trim()) {
      return {
        success: false,
        message: 'No text found in PDF'
      };
    }
    return await processText(data.text);
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: `PDF processing error: ${error}`
      };
    }
  }
}

export async function processText(text: string) {
  try {
    const { userId, getToken } = await auth();
    if (!userId) {
      return {
        success: false,
        message: 'Unauthorized'
      };
    }
    const cleanText = text
      .replace(/\r\n|\n|\r/g, ' ')
      .replace(/\s+/g, ' ')
      .normalize('NFC')
      .trim();
    const textChunks = await textSplitter.splitText(cleanText);
    const { embeddings: embeddingList } = await embedMany({
      model: openai.embeddingModel('text-embedding-3-small'),
      values: textChunks
    });
    const records = textChunks.map((chunk, index) => ({
      content: chunk,
      vector: embeddingList[index]
    }));
    const token = await getToken({ template: 'convex' });
    client.setAuth(token!);
    await Promise.all(
      records.map((record) =>
        client.mutation(api.embeddings.create, {
          content: record.content,
          vector: Array.from(record.vector) as number[]
        })
      )
    );
    return {
      success: true,
      message: 'Embedding files created'
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: `Text processing error: ${error}`
      };
    }
  }
}

export async function searchEmbeddings(query: string, limit = 8): Promise<string | { success: false; message: string }> {
  const { userId, getToken } = await auth();
  if (!userId) {
    return {
      success: false,
      message: 'Unauthorized'
    };
  }
  const token = await getToken({ template: 'convex' });
  client.setAuth(token!);
  const { embedding } = await embed({
    model: openai.embeddingModel('text-embedding-3-small'),
    value: query
  });
  const results = await client.action(api.embeddings.search, {
    vector: Array.from(embedding) as number[],
    limit
  });
  if (!results?.length) return 'No relevant knowledge found.';
  const chunks = await client.query(api.embeddings.getByIds, { ids: results.map((r) => r._id) });
  const byId = new Map(chunks.filter(Boolean).map((c) => [c!._id, c!.content]));
  return results
    .map((r, i) => (byId.get(r._id) ? `[${i + 1}] (${r._score.toFixed(4)}) ${byId.get(r._id)}` : null))
    .filter(Boolean)
    .join('\n\n');
}
