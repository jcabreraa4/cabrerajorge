import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { auth } from '@clerk/nextjs/server';
import { generateImage, tool } from 'ai';
import { ConvexHttpClient } from 'convex/browser';
import { tiptapToText, textToTiptap } from '@/lib/tiptap';
import { z } from 'zod';
import { searchEmbeddings } from '@/actions/embeddings';

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
  loadKnowledge: tool({
    description: `Search in knowledge base given a query.`,
    inputSchema: z.object({
      query: z.string().describe('The question or text to search semantically.'),
      limit: z.number().min(1).max(20).optional().describe('Max number of chunks to retrieve.')
    }),
    async execute({ query, limit }) {
      try {
        const content = await searchEmbeddings(query, limit);
        return {
          status: 200,
          content
        };
      } catch (error) {
        return {
          status: 500,
          message: `Error loading embeddings: ${error}`
        };
      }
    }
  }),
  loadDocuments: tool({
    description: `Load all text documents in user's account.`,
    inputSchema: z.object({}),
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
          content: documents.map((doc) => ({
            ...doc,
            content: tiptapToText(doc.content)
          }))
        };
      } catch (error) {
        return {
          status: 500,
          message: `Error loading documents: ${error}`
        };
      }
    }
  }),
  loadDocument: tool({
    description: `Load a specific document given its ID.`,
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
          content: {
            ...document,
            content: tiptapToText(document.content)
          }
        };
      } catch (error) {
        return {
          status: 500,
          message: `Error loading document: ${error}`
        };
      }
    }
  }),
  updateDocument: tool({
    description: `Update a specific document's content from user's account.`,
    inputSchema: z.object({
      id: z.string().describe('The ID of the document to update.'),
      content: z.string().describe('The new plain text content of the document.')
    }),
    async execute({ id, content }) {
      try {
        const { getToken } = await auth();
        const token = await getToken({ template: 'convex' });
        client.setAuth(token!);
        const tiptapContent = textToTiptap(content);
        await client.action(api.documents.updateWithAI, { id: id as Id<'documents'>, content: tiptapContent });
        return {
          status: 200,
          message: 'Document updated successfully.'
        };
      } catch (error) {
        return {
          status: 500,
          message: `Error updating document: ${error}`
        };
      }
    }
  }),
  loadMediaFiles: tool({
    description: `Load all media files in user's account.`,
    inputSchema: z.object(),
    async execute() {
      try {
        const { getToken } = await auth();
        const token = await getToken({ template: 'convex' });
        client.setAuth(token!);
        const mediaFiles = await client.query(api.multimedia.getAll);
        if (!mediaFiles || mediaFiles.length === 0) {
          return {
            status: 200,
            content: 'No media files found.'
          };
        }
        return {
          status: 200,
          content: mediaFiles
        };
      } catch (error) {
        return {
          status: 500,
          message: `Error loading media files: ${error}`
        };
      }
    }
  }),
  loadMediaFile: tool({
    description: `Load an specific media file given its ID.`,
    inputSchema: z.object({
      id: z.string().describe('The ID of the media file to load.')
    }),
    async execute({ id }) {
      try {
        const { getToken } = await auth();
        const token = await getToken({ template: 'convex' });
        client.setAuth(token!);
        const mediaFile = await client.query(api.multimedia.getById, { id: id as Id<'multimedia'> });
        if (!mediaFile) {
          return {
            status: 200,
            content: 'No media file found.'
          };
        }
        return {
          status: 200,
          content: mediaFile
        };
      } catch (error) {
        return {
          status: 500,
          message: `Error loading media file: ${error}`
        };
      }
    }
  })
};
