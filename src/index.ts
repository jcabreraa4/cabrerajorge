import { Hono } from 'hono';
import { ContactPage } from '@/pages/contact';
import { HomePage } from '@/pages/home';

const app = new Hono();

// Landing Page
app.get('/', (c) => c.html(HomePage));
app.get('/contact', (c) => c.html(ContactPage));

export default app;
