-- Initial schema: users, sessions, and menu_items tables
-- Generated from server/database/schema.ts

CREATE TABLE IF NOT EXISTS `users` (
  `id` text PRIMARY KEY NOT NULL,
  `email` text NOT NULL,
  `password_hash` text,
  `name` text,
  `apple_id` text,
  `is_admin` integer DEFAULT false,
  `created_at` text NOT NULL,
  `updated_at` text NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS `users_email_unique` ON `users` (`email`);
CREATE UNIQUE INDEX IF NOT EXISTS `users_apple_id_unique` ON `users` (`apple_id`);

CREATE TABLE IF NOT EXISTS `sessions` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL REFERENCES `users`(`id`) ON DELETE CASCADE,
  `expires_at` integer NOT NULL,
  `created_at` text NOT NULL
);

CREATE TABLE IF NOT EXISTS `menu_items` (
  `id` integer PRIMARY KEY AUTOINCREMENT,
  `category` text NOT NULL,
  `name` text NOT NULL,
  `description` text,
  `prices` text NOT NULL,
  `sort_order` integer NOT NULL DEFAULT 0,
  `is_active` integer NOT NULL DEFAULT true,
  `updated_at` text NOT NULL
);

CREATE INDEX IF NOT EXISTS `menu_items_category_idx` ON `menu_items` (`category`);
CREATE INDEX IF NOT EXISTS `menu_items_active_idx` ON `menu_items` (`is_active`);
