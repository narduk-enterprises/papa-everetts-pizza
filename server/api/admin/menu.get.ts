import { asc } from 'drizzle-orm'
import { menuItems } from '../../database/schema'
import { serializeMenuItem, getCategoryNames } from '../../utils/menu'
import { requireAdminUser } from '../../utils/auth-guards'
import { getFallbackMenu } from '../../utils/menu-fallback'

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  try {
    const db = useDatabase()
    const [items, categoryNames] = await Promise.all([
      db.select().from(menuItems).orderBy(asc(menuItems.category), asc(menuItems.sortOrder), asc(menuItems.name)),
      getCategoryNames(),
    ])

    return {
      items: items.map(serializeMenuItem),
      categories: categoryNames,
    }
  } catch {
    const categoryNames = await getCategoryNames()
    return {
      items: getFallbackMenu(false),
      categories: categoryNames,
      source: 'fallback',
    }
  }
})
