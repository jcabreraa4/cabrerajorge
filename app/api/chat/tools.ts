import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { auth } from '@clerk/nextjs/server';
import { generateImage, tool } from 'ai';
import { ConvexHttpClient } from 'convex/browser';
import { z } from 'zod';

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const tools = {
  searchWebInfo: google.tools.googleSearch({}),
  generateImage: tool({
    description: 'Generate an image given a prompt.',
    inputSchema: z.object({
      prompt: z.string().describe('The prompt that describes the image.')
    }),
    async execute({ prompt }) {
      try {
        const { image } = await generateImage({
          model: openai.image('dall-e-3'),
          prompt: prompt,
          size: '1024x1024',
          n: 1
        });
        return {
          status: 200,
          image: image.base64,
          prompt: prompt
        };
      } catch (error) {
        return {
          status: 500,
          message: `Error generating the image: ${error}`
        };
      }
    }
  }),
  loadAllDocuments: tool({
    description: `Load all text documents in user's account.`,
    inputSchema: z.object(),
    async execute() {
      try {
        const { getToken } = await auth();
        const token = await getToken({ template: 'convex' });
        client.setAuth(token!);
        const documents = await client.query(api.documents.getAll);
        if (!documents || documents.length === 0) {
          return {
            status: 200,
            content: 'No documents found.'
          };
        }
        return {
          status: 200,
          content: documents
        };
      } catch (error) {
        return {
          status: 500,
          message: `Error loading user's documents: ${error}`
        };
      }
    }
  }),
  loadOneDocument: tool({
    description: `Load an specific document from user's account.`,
    inputSchema: z.object({
      id: z.string().describe('The ID of the document to load.')
    }),
    async execute({ id }) {
      try {
        const { getToken } = await auth();
        const token = await getToken({ template: 'convex' });
        client.setAuth(token!);
        const document = await client.query(api.documents.getById, { id: id as Id<'documents'> });
        if (!document) {
          return {
            status: 200,
            content: 'No document found.'
          };
        }
        return {
          status: 200,
          content: document
        };
      } catch (error) {
        return {
          status: 500,
          message: `Error loading user's document: ${error}`
        };
      }
    }
  }),
  updateDocumentContent: tool({
    description: `Update an specific document's content from user's account.`,
    inputSchema: z.object({
      id: z.string().describe('The ID of the document to load.'),
      content: z.string().describe('The content of the document to update.')
    }),
    async execute({ id, content }) {
      try {
        const { getToken } = await auth();
        const token = await getToken({ template: 'convex' });
        client.setAuth(token!);
        await client.action(api.documents.updateWithAI, { id: id as Id<'documents'>, content });
        return {
          status: 200,
          message: 'Document updated successfully.'
        };
      } catch (error) {
        return {
          status: 500,
          message: `Error updating user's document: ${error}`
        };
      }
    }
  }),
  updateDocumentTitle: tool({
    description: `Update an specific document's title from user's account.`,
    inputSchema: z.object({
      id: z.string().describe('The ID of the document to load.'),
      title: z.string().describe('The title of the document to update.')
    }),
    async execute({ id, title }) {
      try {
        const { getToken } = await auth();
        const token = await getToken({ template: 'convex' });
        client.setAuth(token!);
        await client.mutation(api.documents.updateById, { id: id as Id<'documents'>, title });
        return {
          status: 200,
          message: 'Document updated successfully.'
        };
      } catch (error) {
        return {
          status: 500,
          message: `Error updating user's document: ${error}`
        };
      }
    }
  }),
  loadAllMultimedia: tool({
    description: `Load all media files in user's account.`,
    inputSchema: z.object(),
    async execute() {
      try {
        const { getToken } = await auth();
        const token = await getToken({ template: 'convex' });
        client.setAuth(token!);
        const multimedia = await client.query(api.multimedia.getAll);
        if (!multimedia || multimedia.length === 0) {
          return {
            status: 200,
            content: 'No media files found.'
          };
        }
        return {
          status: 200,
          content: multimedia
        };
      } catch (error) {
        return {
          status: 500,
          message: `Error loading user's media files: ${error}`
        };
      }
    }
  })
};
