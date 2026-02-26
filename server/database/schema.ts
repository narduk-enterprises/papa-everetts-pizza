import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

// ─── Users ──────────────────────────────────────────────────
export const users = sqliteTable('users', {
  id: text('id').primaryKey(), // UUID
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash'),
  name: text('name'),
  appleId: text('apple_id').unique(),
  isAdmin: integer('is_admin', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
})

// ─── Sessions ───────────────────────────────────────────────
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(), // session token
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at').notNull(), // Unix timestamp
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
})

// ─── Categories ─────────────────────────────────────────────
export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
})

// ─── Menu Items ─────────────────────────────────────────────
// prices stores JSON such as:
// {"le_petit": 6.99, "small": 8.99, "medium": 10.99, "large": 13.49, "xl": 17.79}
// Use null for "Call for price" values.
export const menuItems = sqliteTable('menu_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  category: text('category').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  prices: text('prices').notNull(), // JSON string
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
})

// ─── Contact Submissions ────────────────────────────────────
export const contactSubmissions = sqliteTable('contact_submissions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  message: text('message').notNull(),
  topic: text('topic').notNull().default('contact'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
})

// ─── Type helpers ───────────────────────────────────────────
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Session = typeof sessions.$inferSelect

export type MenuItem = typeof menuItems.$inferSelect
export type NewMenuItem = typeof menuItems.$inferInsert

export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert

export type ContactSubmission = typeof contactSubmissions.$inferSelect
