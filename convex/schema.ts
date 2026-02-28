import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import type { Doc } from '@/convex/_generated/dataModel';

export default defineSchema({
  information: defineTable({
    context: v.string(),
    owner: v.string()
  }).index('by_owner', ['owner']),
  documents: defineTable({
    title: v.string(),
    content: v.string(),
    owner: v.string()
  }).index('by_owner', ['owner']),
  multimedia: defineTable({
    name: v.string(),
    note: v.string(),
    type: v.string(),
    size: v.number(),
    starred: v.boolean(),
    storage: v.id('_storage'),
    owner: v.string()
  }).index('by_owner', ['owner']),
  embeddings: defineTable({
    content: v.string(),
    vector: v.array(v.number()),
    owner: v.string()
  }).index('by_owner', ['owner'])
});

export type Document = Doc<'documents'>;
export type MediaFile = Doc<'multimedia'>;
export type Embedding = Doc<'embeddings'>;
