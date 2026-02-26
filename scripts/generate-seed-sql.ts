import fs from 'fs'
import { menuSeedData } from '../server/database/menu-seed-data'

let sql = 'DELETE FROM menu_items;\n'

for (const item of menuSeedData) {
  const category = item.category.replace(/'/g, "''")
  const name = item.name.replace(/'/g, "''")
  const description = (item.description || '').replace(/'/g, "''")
  const imageUrl = item.imageUrl ? `'${item.imageUrl}'` : 'NULL'
  const prices = JSON.stringify(item.prices).replace(/'/g, "''")
  
  sql += `INSERT INTO menu_items (category, name, description, image_url, prices, sort_order, is_active, updated_at) VALUES ('${category}', '${name}', '${description}', ${imageUrl}, '${prices}', ${item.sortOrder}, 1, CURRENT_TIMESTAMP);\n`
}

fs.writeFileSync('drizzle/0002_seed.sql', sql)
console.log('Seed SQL generated to drizzle/0002_seed.sql')
