import { relations } from 'drizzle-orm';
import { mysqlTable } from 'drizzle-orm/mysql-core';
import { users } from '.';

export const passwordResets = mysqlTable('password_resets', (t) => ({
  token: t.varchar('token', { length: 16 }).notNull().unique().primaryKey(),
  userId: t
    .varchar('user_id', { length: 36 })
    .notNull()
    .references(() => users.id),
}));

export const passwordResetsRelations = relations(passwordResets, ({ one }) => ({
  user: one(users, {
    fields: [passwordResets.userId],
    references: [users.id],
  }),
}));
