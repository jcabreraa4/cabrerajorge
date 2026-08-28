import { integer, pgTable, text, varchar } from 'drizzle-orm/pg-core';

export const tasks = pgTable('tasks', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
  note: text()
});
