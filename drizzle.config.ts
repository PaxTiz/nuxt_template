import type { Config } from 'drizzle-kit';

export default {
  dialect: 'mysql',
  schema: './server/database/schema/index.ts',
  out: './server/database/drizzle',
} satisfies Config;
