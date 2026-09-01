import { integer, pgTable, text } from 'drizzle-orm/pg-core';

export const tasks = pgTable('tasks', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  note: text()
});
