import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { menuItems } from '../../../database/schema'
import { requireAdminUser } from '../../../utils/auth-guards'
import { updateFallbackMenuItem } from '../../../utils/menu-fallback'

const patchSchema = z.object({
  category: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  imageUrl: z.string().nullable().optional(),
  prices: z.record(z.string(), z.number().nullable()).optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'No fields provided for update',
})

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, message: 'Invalid menu item id' })
  }

  const body = await readBody(event)
  const parsed = patchSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 400, message: parsed.error.issues[0]?.message || 'Invalid input' })
  }

  const updates: Record<string, unknown> = {
    updatedAt: new Date().toISOString(),
  }

  if (parsed.data.category !== undefined) updates.category = parsed.data.category
  if (parsed.data.name !== undefined) updates.name = parsed.data.name
  if (parsed.data.description !== undefined) updates.description = parsed.data.description
  if (parsed.data.imageUrl !== undefined) updates.imageUrl = parsed.data.imageUrl
  if (parsed.data.sortOrder !== undefined) updates.sortOrder = parsed.data.sortOrder
  if (parsed.data.isActive !== undefined) updates.isActive = parsed.data.isActive
  if (parsed.data.prices !== undefined) updates.prices = JSON.stringify(parsed.data.prices)

  try {
    const db = useAppDatabase(event)
    const result = await db
      .update(menuItems)
      .set(updates)
      .where(eq(menuItems.id, id))
      .returning()

    if (!result.length) {
      throw createError({ statusCode: 404, message: 'Menu item not found' })
    }

    return { item: result[0] }
  } catch (e) {
    console.error('D1 Database Error:', e)
    console.error('D1 Error (PATCH menu_items):', e)
    const fallbackItem = updateFallbackMenuItem(id, {
      category: parsed.data.category,
      name: parsed.data.name,
      description: parsed.data.description,
      imageUrl: parsed.data.imageUrl,
      prices: parsed.data.prices,
      sortOrder: parsed.data.sortOrder,
      isActive: parsed.data.isActive,
    })

    if (!fallbackItem) {
      throw createError({ statusCode: 404, message: 'Menu item not found' })
    }

    return { item: fallbackItem, source: 'fallback' }
  }
})
