import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { menuItems } from '../server/database/schema'
import { menuSeedData } from '../server/database/menu-seed-data'

async function main() {
  const dbFile = process.env.DB_PATH || '.data/local.db'
  const sqlite = new Database(dbFile)
  const db = drizzle(sqlite)

  db.delete(menuItems).run()

  const now = new Date().toISOString()
  for (const item of menuSeedData) {
    db.insert(menuItems).values({
      category: item.category,
      name: item.name,
      description: item.description,
      prices: JSON.stringify(item.prices),
      sortOrder: item.sortOrder,
      isActive: true,
      updatedAt: now,
    }).run()
  }

  console.log(`Seeded ${menuSeedData.length} menu items into ${dbFile}`)
}

main()
