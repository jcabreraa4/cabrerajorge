import { ConvexError } from 'convex/values';
import { ProsemirrorSync } from '@convex-dev/prosemirror-sync';
import { components } from './_generated/api';
import { MutationCtx, QueryCtx } from './_generated/server';
import { Id, DataModel } from './_generated/dataModel';

export const prosemirrorSync = new ProsemirrorSync((components as any).prosemirrorSync);

async function requireOwner(ctx: QueryCtx | MutationCtx, documentId: string) {
  const user = await ctx.auth.getUserIdentity();
  if (!user) throw new ConvexError('Unauthorized');
  const document = await ctx.db.get(documentId as Id<'documents'>);
  if (!document) throw new ConvexError('Not found');
  if (document.owner !== user.subject) throw new ConvexError('Unauthorized');
}

export const { getSnapshot, submitSnapshot, latestVersion, getSteps, submitSteps } = prosemirrorSync.syncApi<DataModel>({
  checkRead: requireOwner,
  checkWrite: requireOwner,
  onSnapshot: async (ctx, id, snapshot) => {
    await ctx.db.patch(id as Id<'documents'>, { content: snapshot });
  }
});
