import { asc } from 'drizzle-orm'
import { categories } from '../../database/schema'
import { requireAdminUser } from '../../utils/auth-guards'

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const db = useDatabase()
  const rows = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.sortOrder), asc(categories.name))

  return { categories: rows }
})
