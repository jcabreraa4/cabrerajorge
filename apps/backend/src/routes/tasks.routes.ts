import { Hono } from 'hono';

import { createTask, listTasks } from '@/controllers/auth.controller';

const router = new Hono();

// List Tasks
router.get('/', async (c) => {
  const tasks = await listTasks();
  return c.json(tasks);
});

// Get Task
router.get('/:id', (c) => {
  return c.text('Get task');
});

// Create Task
router.post('/', (c) => {
  const task = createTask({ name: 'Task name', note: 'Task note' });
  return c.json(task);
});

// Update Task
router.put('/:id', (c) => {
  return c.text('Update task');
});

// Delete Task
router.delete('/:id', (c) => {
  return c.text('Delete task');
});

export { router as tasksRoutes };
