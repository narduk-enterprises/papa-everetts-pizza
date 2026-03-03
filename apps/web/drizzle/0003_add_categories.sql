-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Seed with existing categories
INSERT OR IGNORE INTO categories (name, sort_order) VALUES
  ('Build Your Own Masterpiece', 0),
  ('Gourmet Pizzas', 1),
  ('Favorite Pizzas', 2),
  ('Exclusive Pizzas', 3),
  ('Oven-Baked Pastas', 4),
  ('Appetizers', 5),
  ('Salads', 6),
  ('Desserts', 7);
