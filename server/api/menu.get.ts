import { asc, eq } from 'drizzle-orm'
import { menuItems } from '../database/schema'
import { serializeMenuItem, getCategoryNames } from '../utils/menu'
import { getFallbackMenu } from '../utils/menu-fallback'

export default defineEventHandler(async () => {
  try {
    const db = useDatabase()

    const [items, categoryNames] = await Promise.all([
      db.select().from(menuItems)
        .where(eq(menuItems.isActive, true))
        .orderBy(asc(menuItems.category), asc(menuItems.sortOrder), asc(menuItems.name)),
      getCategoryNames(),
    ])

    const serialized = items.map(serializeMenuItem)

    const grouped = categoryNames.map(category => ({
      category,
      items: serialized.filter(item => item.category === category),
    }))

    return {
      items: serialized,
      categories: grouped,
    }
  } catch {
    const [items, categoryNames] = await Promise.all([
      getFallbackMenu(true),
      getCategoryNames(),
    ])
    const grouped = categoryNames.map(category => ({
      category,
      items: items.filter(item => item.category === category),
    }))

    return {
      items,
      categories: grouped,
      source: 'fallback',
    }
  }
})
