import { ConvexError } from 'convex/values';
import { ProsemirrorSync } from '@convex-dev/prosemirror-sync';
import { components } from './_generated/api';
import { MutationCtx, QueryCtx } from './_generated/server';
import { Id, DataModel } from './_generated/dataModel';

const prosemirrorSync = new ProsemirrorSync((components as any).prosemirrorSync);

async function requireOwner(ctx: QueryCtx | MutationCtx, paperId: string) {
  const user = await ctx.auth.getUserIdentity();
  if (!user) throw new ConvexError('Unauthorized');

  const paper = await ctx.db.get(paperId as Id<'papers'>);
  if (!paper) throw new ConvexError('Paper not found');
  if (paper.owner !== user.subject) throw new ConvexError('You are not the owner');
}

export const { getSnapshot, submitSnapshot, latestVersion, getSteps, submitSteps } = prosemirrorSync.syncApi<DataModel>({
  checkRead: requireOwner,
  checkWrite: requireOwner,
  onSnapshot: async (ctx, id, snapshot) => {
    await ctx.db.patch(id as Id<'papers'>, { content: snapshot });
  }
});
