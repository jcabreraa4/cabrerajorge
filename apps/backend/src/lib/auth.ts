import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { db } from '@/db/drizzle';
import { schema } from '@/db/schema';

const origins = process.env.ALLOWED_ORIGINS!.split(',');

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  basePath: '/auth',
  trustedOrigins: origins,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: schema
  }),
  emailAndPassword: {
    enabled: true
  }
});
