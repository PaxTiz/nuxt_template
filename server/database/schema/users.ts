import { relations } from 'drizzle-orm';
import { mysqlTable } from 'drizzle-orm/mysql-core';
import { randomUUID } from 'node:crypto';
import type { UserRole } from '~/types';
import { passwordResets } from '.';

export const users = mysqlTable('users', (t) => ({
  id: t
    .varchar('id', { length: 36 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => randomUUID()),
  firstname: t.varchar('firstname', { length: 191 }).notNull(),
  lastname: t.varchar('lastname', { length: 191 }).notNull(),
  email: t.varchar('email', { length: 191 }).notNull().unique(),
  password: t.varchar('password', { length: 191 }).notNull(),
  addressLine1: t.varchar('address_line1', { length: 191 }).notNull(),
  addressLine2: t.varchar('address_line2', { length: 191 }),
  addressPostalCode: t.varchar('address_postal_code', { length: 5 }),
  addressCity: t.varchar('address_city', { length: 191 }).notNull(),
  isEnabled: t.boolean('is_enabled').notNull().default(false),
  validationCode: t.varchar('validation_code', { length: 16 }).unique(),
  role: t
    .mysqlEnum('role', ['DEVELOPER', 'ADMIN', 'USER'])
    .$type<UserRole>()
    .default('USER')
    .notNull(),
  createdAt: t
    .datetime('created_at')
    .notNull()
    .$defaultFn(() => new Date()),
}));

export const userRelations = relations(users, ({ many }) => ({
  passwordReset: many(passwordResets),
}));

export type FullUser = typeof users.$inferSelect;
export type User = Omit<FullUser, 'password' | 'validationCode'>;
