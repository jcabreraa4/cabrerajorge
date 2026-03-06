import { ConvexError, v } from 'convex/values';
import { action, query, mutation } from './_generated/server';
import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';

export const getAll = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError('Unauthorized');
    return await ctx.db
      .query('embeddings')
      .withIndex('by_owner', (q) => q.eq('owner', user.subject))
      .collect();
  }
});

export const create = mutation({
  args: {
    content: v.string(),
    vector: v.array(v.number())
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError('Unauthorized');
    return await ctx.db.insert('embeddings', {
      content: args.content,
      vector: args.vector,
      owner: user.subject
    });
  }
});

export const deleteAll = mutation({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError('Unauthorized');
    const embeddings = await ctx.db
      .query('embeddings')
      .withIndex('by_owner', (q) => q.eq('owner', user.subject))
      .collect();
    await Promise.all(embeddings.map((e) => ctx.db.delete(e._id)));
  }
});

export const deleteById = mutation({
  args: { id: v.id('embeddings') },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError('Unauthorized');
    const embedding = await ctx.db.get(args.id);
    if (!embedding) throw new ConvexError('Not found');
    const isOwner = embedding.owner === user.subject;
    if (!isOwner) throw new ConvexError('Unauthorized');
    await ctx.db.delete(args.id);
  }
});

export const search = action({
  args: {
    content: v.string(),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError('Unauthorized');

    const cleanContent = args.content.trim();
    if (!cleanContent) return [];

    const { embedding } = await embed({
      model: openai.embeddingModel('text-embedding-3-small'),
      value: cleanContent
    });

    const vectorMatches = await ctx.vectorSearch('embeddings', 'by_vector', {
      vector: Array.from(embedding),
      limit: Math.max(1, Math.min(args.limit ?? 5, 20)),
      filter: (q) => q.eq('owner', user.subject)
    });

    return vectorMatches;
  }
});

export const getById = query({
  args: { id: v.id('embeddings') },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError('Unauthorized');

    const embedding = await ctx.db.get(args.id);
    if (!embedding) return null;
    if (embedding.owner !== user.subject) throw new ConvexError('Unauthorized');

    return embedding;
  }
});
