import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'mysql',
  schema: './server/database/schema/index.ts',
  out: './server/database/drizzle',
  migrations: {
    prefix: 'unix',
  },
  dbCredentials: {
    host: process.env.NUXT_DATABASE_HOST!,
    port: Number(process.env.NUXT_DATABASE_PORT!),
    user: process.env.NUXT_DATABASE_USER!,
    password: process.env.NUXT_DATABASE_PASS!,
    database: process.env.NUXT_DATABASE_NAME!,
  },
});
