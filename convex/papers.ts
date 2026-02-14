import { mutation, query } from './_generated/server';
import { ConvexError, v } from 'convex/values';
import type { Id } from './_generated/dataModel';

export const get = query({
  handler: async (ctx) => {
    return await ctx.db.query('papers').collect();
  }
});

export const getById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    try {
      return await ctx.db.get(args.id as Id<'papers'>);
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
    const paperId = await ctx.db.insert('papers', {
      title: args.title ?? 'Untitled Paper',
      content: args.content ?? '',
      owner: user.subject
    });
    return paperId;
  }
});

export const deleteById = mutation({
  args: { id: v.id('papers') },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError('Unauthorized');
    const paper = await ctx.db.get(args.id);
    if (!paper) throw new ConvexError('Paper not found');
    const isOwner = paper.owner === user.subject;
    if (!isOwner) throw new ConvexError('You are not the owner');
    await ctx.db.delete(args.id);
  }
});

export const updateById = mutation({
  args: { id: v.id('papers'), title: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError('Unauthorized');
    const paper = await ctx.db.get(args.id);
    if (!paper) throw new ConvexError('Paper not found');
    const isOwner = paper.owner === user.subject;
    if (!isOwner) throw new ConvexError('You are not the owner');
    await ctx.db.patch(args.id, { title: args.title });
  }
});

export const updateContentById = mutation({
  args: { id: v.id('papers'), content: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError('Unauthorized');
    const paper = await ctx.db.get(args.id);
    if (!paper) throw new ConvexError('Paper not found');
    const isOwner = paper.owner === user.subject;
    if (!isOwner) throw new ConvexError('You are not the owner');
    await ctx.db.patch(args.id, { content: args.content });
  }
});
