import { relations } from 'drizzle-orm';
import {
  boolean,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { randomUUID } from 'node:crypto';
import { passwordResets } from '.';

export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => randomUUID()),
  firstname: varchar('firstname', { length: 191 }).notNull(),
  lastname: varchar('lastname', { length: 191 }).notNull(),
  email: varchar('email', { length: 191 }).notNull().unique(),
  password: varchar('password', { length: 191 }).notNull(),
  addressLine1: varchar('address_line1', { length: 191 }).notNull(),
  addressLine2: varchar('address_line2', { length: 191 }),
  addressPostalCode: varchar('address_postal_code', { length: 5 }),
  addressCity: varchar('address_city', { length: 191 }).notNull(),
  isEnabled: boolean('is_enabled').notNull().default(false),
  validationCode: varchar('validation_code', { length: 16 }).unique(),
  role: mysqlEnum('role', ['SUPER_ADMIN', 'ADMIN', 'USER'])
    .default('USER')
    .notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  passwordReset: many(passwordResets),
}));

export type FullUser = typeof users.$inferSelect;
export type User = Omit<FullUser, 'password' | 'validationCode'>;
