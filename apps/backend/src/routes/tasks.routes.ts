import { sValidator } from '@hono/standard-validator';
import { Hono } from 'hono';
import { z } from 'zod';

import { createTask, listTasks } from '@/controllers/auth.controller';

const router = new Hono();

// List Tasks
router.get('/', async (c) => {
  const tasks = await listTasks();
  return c.json(tasks);
});

// Get Task
router.get('/:id', (c) => {
  const { id } = c.req.param();
  return c.text(`Get task ${id}`);
});

// Create Task

export const createTaskSchema = z.object({
  name: z.string(),
  note: z.string()
});

router.post('/', sValidator('json', createTaskSchema), (c) => {
  const task = createTask({ name: 'Task name', note: 'Task note' });
  return c.json(task);
});

// Update Task
router.put('/:id', (c) => {
  const { id } = c.req.param();
  return c.text(`Update task ${id}`);
});

// Delete Task
router.delete('/:id', (c) => {
  const { id } = c.req.param();
  return c.text(`Delete task ${id}`);
});

export { router as tasksRoutes };
