import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import type { Doc } from '@/convex/_generated/dataModel';

export default defineSchema({
  papers: defineTable({
    title: v.string(),
    content: v.string(),
    owner: v.string()
  })
});

export type Paper = Doc<'papers'>;
