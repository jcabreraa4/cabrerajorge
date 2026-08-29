import { Hono } from 'hono';

const router = new Hono();

router.post('/sign-in', (c) => {
  return c.json({ status: 'OK' }, { status: 200 });
});

export { router as authRoutes };
