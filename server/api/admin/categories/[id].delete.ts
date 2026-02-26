import { eq, and } from 'drizzle-orm'
import { categories, menuItems } from '../../../database/schema'
import { requireAdminUser } from '../../../utils/auth-guards'

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, message: 'Invalid category id' })
  }

  const db = useDatabase()

  // Get the category
  const [existing] = await db.select().from(categories).where(eq(categories.id, id))
  if (!existing) {
    throw createError({ statusCode: 404, message: 'Category not found' })
  }

  // Check for active menu items using this category
  const activeItems = await db
    .select({ id: menuItems.id })
    .from(menuItems)
    .where(and(eq(menuItems.category, existing.name), eq(menuItems.isActive, true)))
    .limit(1)

  if (activeItems.length > 0) {
    throw createError({
      statusCode: 409,
      message: 'Cannot delete a category that has active menu items. Deactivate or move the items first.',
    })
  }

  // Soft delete
  await db
    .update(categories)
    .set({ isActive: false, updatedAt: new Date().toISOString() })
    .where(eq(categories.id, id))

  return { success: true }
})
