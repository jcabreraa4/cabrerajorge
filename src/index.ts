import { Hono } from 'hono';
import { TimeBadge } from '@/components/fragments';
import { ContactPage } from '@/pages/contact';
import { HomePage } from '@/pages/home';

const app = new Hono();

// Landing Page
app.get('/', (c) => c.html(HomePage));
app.get('/contact', (c) => c.html(ContactPage));

// API Routes
app.get('/api/time', (c) => {
  return c.html(TimeBadge());
});

export default app;
