import { relations, sql } from 'drizzle-orm';
import { foreignKey, index, mysqlTable } from 'drizzle-orm/mysql-core';

export const __medias = mysqlTable(
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

export const __mediasRelations = relations(__medias, ({ one, many }) => ({
  parent: one(__medias, {
    fields: [__medias.parentId],
    references: [__medias.id],
  }),

  children: many(__medias),
}));
