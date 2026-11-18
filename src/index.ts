import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Welcome to CabreraJorge API!');
});

export default app;
