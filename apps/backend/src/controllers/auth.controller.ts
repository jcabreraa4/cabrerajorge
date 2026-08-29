import { db } from '@/db';
import { tasks } from '@/db/schema';

export async function listTasks() {
  return await db.select().from(tasks);
}

export async function createTask({ name, note }: { name: string; note?: string }) {
  return await db.insert(tasks).values({ name, note }).returning();
}
