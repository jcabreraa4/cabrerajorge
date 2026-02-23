import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const getAll = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError('Unauthorized');
    const multimedia = await ctx.db
      .query('multimedia')
      .withIndex('by_owner', (q) => q.eq('owner', user.subject))
      .collect();
    return await Promise.all(multimedia.map(async (file) => ({ ...file, url: await ctx.storage.getUrl(file.storage) })));
  }
});

export const generateUrl = mutation({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError('Unauthorized');
    return await ctx.storage.generateUploadUrl();
  }
});

export const create = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    size: v.number(),
    storage: v.id('_storage')
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError('Unauthorized');
    return await ctx.db.insert('multimedia', {
      name: args.name,
      note: '',
      type: args.type,
      size: args.size,
      storage: args.storage,
      starred: false,
      owner: user.subject
    });
  }
});

export const deleteById = mutation({
  args: { id: v.id('multimedia') },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError('Unauthorized');
    const file = await ctx.db.get(args.id);
    if (!file) throw new ConvexError('Not found');
    const isOwner = file.owner === user.subject;
    if (!isOwner) throw new ConvexError('Unauthorized');
    await ctx.storage.delete(file.storage);
    await ctx.db.delete(args.id);
  }
});

export const updateById = mutation({
  args: {
    id: v.id('multimedia'),
    name: v.optional(v.string()),
    note: v.optional(v.string()),
    starred: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError('Unauthorized');
    const file = await ctx.db.get(args.id);
    if (!file) throw new ConvexError('Not found');
    const isOwner = file.owner === user.subject;
    if (!isOwner) throw new ConvexError('Unauthorized');
    await ctx.db.patch(args.id, {
      ...(args.name !== undefined ? { name: args.name } : {}),
      ...(args.note !== undefined ? { note: args.note } : {}),
      ...(args.starred !== undefined ? { starred: args.starred } : {})
    });
  }
});
