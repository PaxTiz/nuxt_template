import { randomUUID } from 'node:crypto';
import mysql from 'mysql2/promise';
import { drizzle, type MySql2Database } from 'drizzle-orm/mysql2';
import { defineRelations, sql } from 'drizzle-orm';
import { foreignKey, index, mysqlTable } from 'drizzle-orm/mysql-core';

export const __jobsTable = mysqlTable(
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
  (t) => [index('status_index').on(t.status)],
);

export const __mediasTable = mysqlTable(
  '__medias',
  (t) => ({
    id: t.int().primaryKey().autoincrement(),

    // UUID used as filename stored on the disk
    filename: t.varchar({ length: 191 }).notNull(),

    originalFilename: t.varchar({ length: 191 }).notNull(),

    // Path of the file on the disk
    publicPath: t.varchar({ length: 255 }).notNull(),

    // Path of the file on the disk
    diskPath: t.varchar({ length: 255 }).notNull().unique(),

    // Width in case of an image
    width: t.int(),

    // Image in case of an image
    height: t.int(),

    // Automatically dectected mime type
    mimeType: t.varchar({ length: 191 }),

    modifiersKey: t.varchar({ length: 191 }),

    parentId: t.int(),

    createdAt: t
      .datetime()
      .$default(() => sql`NOW()`)
      .notNull(),
  }),
  (table) => [
    index('public_path_index').on(table.publicPath),
    index('public_path_modifiers_index').on(
      table.publicPath,
      table.modifiersKey,
    ),
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
    }).onDelete('cascade'),
  ],
);

export const passwordResetsTable = mysqlTable('password_resets', (t) => ({
  token: t.varchar('token', { length: 16 }).notNull().unique().primaryKey(),

  userId: t
    .varchar('user_id', { length: 36 })
    .notNull()
    .references(() => usersTable.id),
}));

export const usersTable = mysqlTable('users', (t) => ({
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

  addressPostalCode: t.varchar('address_postal_code', { length: 5 }).notNull(),

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
    .default(sql`NOW()`),

  lastLoginAt: t
    .datetime('last_login_at')
    .notNull()
    .default(sql`NOW()`),
}));

export const databaseSchema = {
  __jobs: __jobsTable,
  __medias: __mediasTable,
  users: usersTable,
  passwordResets: passwordResetsTable,
};

export const databaseSchemaRelations = defineRelations(databaseSchema, (r) => ({
  medias: {
    parent: r.one.__medias({
      from: r.__medias.parentId,
      to: r.__medias.id,
    }),

    children: r.many.__medias(),
  },

  users: {
    passwordResets: r.many.passwordResets(),
  },

  passwordResets: {
    user: r.one.users({
      from: r.passwordResets.userId,
      to: r.users.id,
    }),
  },
}));

export type Database = MySql2Database<
  typeof databaseSchema,
  typeof databaseSchemaRelations
>;

let _db: Database | undefined;
export const useDatabase = () => {
  if (!_db) {
    const config = useRuntimeConfig();
    const connection = mysql.createPool({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.name,
    });

    _db = drizzle(connection, {
      mode: 'default',
      casing: 'snake_case',
      logger: config.database.logs,
      relations: databaseSchemaRelations,
      schema: databaseSchema,
    });
  }

  return _db;
};

export type DatabaseJob = typeof __jobsTable.$inferSelect;
