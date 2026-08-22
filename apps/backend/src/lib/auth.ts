import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { openAPI } from 'better-auth/plugins';

import { db } from '@/db/index';
import { schema } from '@/db/schema';

const url = process.env.BETTER_AUTH_URL!;
const origins = process.env.ALLOWED_ORIGINS!.split(',');
const secret = process.env.BETTER_AUTH_SECRET!;
const domain = process.env.COOKIE_DOMAIN!;

export const auth = betterAuth({
  baseURL: url,
  secret: secret,
  basePath: '/auth',
  trustedOrigins: origins,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: schema
  }),
  advanced: {
    defaultCookieAttributes: {
      secure: true,
      httpOnly: true,
      sameSite: 'lax'
    },
    crossSubDomainCookies: {
      enabled: true,
      domain: domain
    },
    database: {
      joins: true
    }
  },
  emailAndPassword: {
    enabled: true
  },
  plugins: [openAPI()]
});
