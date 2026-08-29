import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';

import { authRoutes } from '@/routes/auth.routes';
import { tasksRoutes } from '@/routes/tasks.routes';

const app = new Hono();

const origins = process.env.ALLOWED_ORIGINS!.split(',');

// Middlewares

app.use(
  cors({
    origin: origins, // Allowed request origins
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed request methods
    allowHeaders: ['Content-Type', 'Authorization'], // Allowed request headers
    credentials: true, // Allow cookies and credentials (Auth related)
    maxAge: 600 // Cache preflight options (Origins, methods, headers)
  })
);

app.use(logger()); // Logs every request
app.use(prettyJSON()); // Pretty responses - On demand (?pretty)

// Public Routes

app.get('/', (c) => c.text('CabreraJorge API'));

app.get('/health', (c) => {
  return c.json({ status: 'OK' }, { status: 200 });
});

app.route('/', authRoutes);
app.route('/tasks', tasksRoutes);

// Protected Routes

// Not Found

app.notFound((c) => {
  return c.text('Not Found', { status: 404 });
});

// Serve App

export default app;
