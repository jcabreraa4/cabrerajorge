import { mutation, query } from './_generated/server';
import { ConvexError, v } from 'convex/values';
import type { Id } from './_generated/dataModel';
import { action } from './_generated/server';
import { getSchema } from '@tiptap/core';
import { EditorState } from '@tiptap/pm/state';
import { extensions } from './editor';
import { prosemirrorSync } from './prosemirror';
import { internalMutation } from './_generated/server';

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

export const patchTitle = internalMutation({
  args: { id: v.id('documents'), title: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { title: args.title });
  }
});

export const updateWithAI = action({
  args: {
    id: v.id('documents'),
    content: v.string()
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError('Unauthorized');
    const schema = getSchema(extensions);
    const newDoc = schema.nodeFromJSON(JSON.parse(args.content!));
    await prosemirrorSync.transform(ctx, args.id, schema, (doc) => {
      const tr = EditorState.create({ doc }).tr;
      tr.replaceWith(0, doc.content.size, newDoc.content);
      return tr;
    });
  }
});
