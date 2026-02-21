import { mutation, query } from './_generated/server';
import { ConvexError, v } from 'convex/values';
import type { Id } from './_generated/dataModel';

export const getAll = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError('Unauthorized');
    return await ctx.db
      .query('documents')
      .withIndex('by_owner', (q) => q.eq('owner', user.subject))
      .collect();
  }
});

export const getById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    try {
      const user = await ctx.auth.getUserIdentity();
      if (!user) throw new ConvexError('Unauthorized');
      const document = await ctx.db.get(args.id as Id<'documents'>);
      if (!document) return null;
      if (document.owner !== user.subject) return null;
      return document;
    } catch {
      return null;
    }
  }
});

export const create = mutation({
  args: { title: v.optional(v.string()), content: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError('Unauthorized');
    return await ctx.db.insert('documents', {
      title: args.title ?? 'Untitled Document',
      content: args.content ?? '{"type":"doc","content":[]}',
      owner: user.subject
    });
  }
});

export const deleteById = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError('Unauthorized');
    const document = await ctx.db.get(args.id);
    if (!document) throw new ConvexError('Not found');
    const isOwner = document.owner === user.subject;
    if (!isOwner) throw new ConvexError('Unauthorized');
    await ctx.db.delete(args.id);
  }
});

export const updateById = mutation({
  args: {
    id: v.id('documents'),
    title: v.optional(v.string()),
    content: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError('Unauthorized');
    const document = await ctx.db.get(args.id);
    if (!document) throw new ConvexError('Not found');
    const isOwner = document.owner === user.subject;
    if (!isOwner) throw new ConvexError('Unauthorized');
    await ctx.db.patch(args.id, {
      ...(args.title !== undefined ? { title: args.title } : {}),
      ...(args.content !== undefined ? { content: args.content } : {})
    });
  }
});
