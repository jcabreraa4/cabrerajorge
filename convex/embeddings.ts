import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';

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
  args: { content: v.string(), vector: v.array(v.number()) },
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
