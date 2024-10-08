import { sql } from 'drizzle-orm';
import { index, mysqlTable } from 'drizzle-orm/mysql-core';

export const __jobs = mysqlTable(
  '__jobs',
  (t) => ({
    id: t.int().primaryKey().autoincrement(),
    name: t.varchar({ length: 191 }).notNull(),
    data: t.json().notNull(),
    allowedRetries: t.int().default(0).notNull(),
    currentRetries: t.int().default(0).notNull(),
    fatal: t.boolean().default(false).notNull(),
    status: t
      .mysqlEnum(['pending', 'success', 'failed', 'retry'])
      .default('pending'),
    createdAt: t
      .datetime()
      .default(sql`NOW()`)
      .notNull(),
    processedAt: t.datetime(),
  }),
  (t) => ({
    statusIndex: index('status_index').on(t.status),
  }),
);

export type DatabaseJob = typeof __jobs.$inferSelect;
