import { relations, sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  hashedPassword: text('hashed_password').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  expiresAt: integer('expires_at').notNull(),
})

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  userId: text('user_id')
    .references(() => users.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })
    .notNull(),
  // TODO: use order for drag and drop in categories page and sorting in library
  order: integer('order').notNull().default(0),
})

export const novels = sqliteTable('novels', {
  id: integer('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  categoryId: integer('category_id').references(() => categories.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  title: text('title').notNull(),
  url: text('url', { length: 255 }).notNull(),
  author: text('author').notNull(),
  thumbnail: text('thumbnail').notNull(),
  summary: text('summary').notNull(),
  genres: text('genres', { mode: 'json' })
    .notNull()
    .default([])
    .$type<string[]>(),
  status: text('status', { length: 255 }).notNull(),
  sourceId: text('source_id').notNull(),
  inLibrary: integer('in_library', { mode: 'boolean' })
    .notNull()
    .default(false),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})

export const chapters = sqliteTable('chapters', {
  id: integer('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  novelId: integer('novel_id')
    .notNull()
    .references(() => novels.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  title: text('title').notNull(),
  url: text('url', { length: 255 }).notNull(),
  number: integer('number').notNull(),
  content: text('content'),
  read: integer('read', { mode: 'boolean' }).notNull().default(false),
  downloaded: integer('downloaded', { mode: 'boolean' })
    .notNull()
    .default(false),
  releaseDate: integer('release_date', { mode: 'timestamp' }).notNull(),
  // TODO: use for tracking chapter progress
  progress: integer('progress').notNull().default(0),
})

export const history = sqliteTable('history', {
  id: integer('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  novelId: integer('novel_id')
    .notNull()
    .unique()
    .references(() => novels.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  chapterId: integer('chapter_id')
    .notNull()
    .references(() => chapters.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})

export const updatedChapters = sqliteTable('updated_chapters', {
  id: integer('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  chapterId: integer('chapter_id')
    .notNull()
    .references(() => chapters.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  novelId: integer('novel_id')
    .notNull()
    .references(() => novels.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})

export const userRelations = relations(users, ({ many }) => ({
  novels: many(novels),
  history: many(history),
  updatedChapters: many(updatedChapters),
}))

export const novelRelations = relations(novels, ({ many, one }) => ({
  user: one(users, {
    fields: [novels.userId],
    references: [users.id],
  }),
  chapters: many(chapters),
  latestRead: one(history, {
    fields: [novels.id],
    references: [history.novelId],
  }),
}))

export const chapterRelations = relations(chapters, ({ one }) => ({
  novel: one(novels, {
    fields: [chapters.novelId],
    references: [novels.id],
  }),
  history: one(history, {
    fields: [chapters.id],
    references: [history.chapterId],
  }),
}))

export const historyRelations = relations(history, ({ one }) => ({
  user: one(users, {
    fields: [history.userId],
    references: [users.id],
  }),
  novel: one(novels, {
    fields: [history.novelId],
    references: [novels.id],
  }),
  chapter: one(chapters, {
    fields: [history.chapterId],
    references: [chapters.id],
  }),
}))

export const updatedChaptersRelations = relations(
  updatedChapters,
  ({ one }) => ({
    user: one(users, {
      fields: [updatedChapters.userId],
      references: [users.id],
    }),
    novel: one(novels, {
      fields: [updatedChapters.novelId],
      references: [novels.id],
    }),
    chapter: one(chapters, {
      fields: [updatedChapters.chapterId],
      references: [chapters.id],
    }),
  }),
)

export type NewUser = typeof users.$inferInsert
export type NewCategory = typeof categories.$inferInsert
export type NewNovel = typeof novels.$inferInsert
export type NewChapter = typeof chapters.$inferInsert
export type NewHistory = typeof history.$inferInsert
export type NewUpdatedChapter = typeof updatedChapters.$inferInsert

export type User = typeof users.$inferSelect
export type Category = typeof categories.$inferSelect
export type Novel = typeof novels.$inferSelect
export type Chapter = typeof chapters.$inferSelect
export type History = typeof history.$inferSelect
export type UpdatedChapter = typeof updatedChapters.$inferSelect
