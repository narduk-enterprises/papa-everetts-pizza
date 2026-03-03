import { eq } from 'drizzle-orm'
import { menuItems } from '../../../database/schema'
import { requireAdminUser } from '../../../utils/auth-guards'
import { updateFallbackMenuItem } from '../../../utils/menu-fallback'

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, message: 'Invalid menu item id' })
  }

  try {
    const db = useDatabase(event)
    const result = await db
      .update(menuItems)
      .set({
        isActive: false,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(menuItems.id, id))
      .returning()

    if (!result.length) {
      throw createError({ statusCode: 404, message: 'Menu item not found' })
    }
  } catch {
    const fallbackItem = updateFallbackMenuItem(id, { isActive: false })
    if (!fallbackItem) {
      throw createError({ statusCode: 404, message: 'Menu item not found' })
    }
  }

  return { success: true }
})
