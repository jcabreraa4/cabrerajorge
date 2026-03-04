import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const getOne = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError('Unauthorized');
    return await ctx.db
      .query('information')
      .withIndex('by_owner', (q) => q.eq('owner', user.subject))
      .unique();
  }
});

export const upsertOne = mutation({
  args: { context: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError('Unauthorized');
    const owner = user.subject;
    const existing = await ctx.db
      .query('information')
      .withIndex('by_owner', (q) => q.eq('owner', owner))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { context: args.context });
    } else {
      await ctx.db.insert('information', { context: args.context, owner });
    }
  }
});
