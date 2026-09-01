import type z from 'zod';

import { db } from '@/db';
import { tasks } from '@/db/schema';
import type { createTaskSchema } from '@/routes/tasks.routes';

export async function listTasks() {
  return await db.select().from(tasks);
}

export async function createTask({ name, note }: z.infer<typeof createTaskSchema>) {
  return await db.insert(tasks).values({ name, note }).returning();
}
