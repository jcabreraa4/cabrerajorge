import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import type { Doc } from '@/convex/_generated/dataModel';

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    content: v.string(),
    owner: v.string()
  }).index('by_owner', ['owner']),
  multimedia: defineTable({
    name: v.string(),
    type: v.string(),
    size: v.number(),
    starred: v.boolean(),
    storage: v.id('_storage'),
    owner: v.string()
  }).index('by_owner', ['owner'])
});

export type Document = Doc<'documents'>;
export type MediaFile = Doc<'multimedia'>;
