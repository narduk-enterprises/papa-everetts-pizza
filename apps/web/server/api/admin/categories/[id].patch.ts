import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { categories, menuItems } from '../../../database/schema'
import { requireAdminUser } from '../../../utils/auth-guards'

const patchSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'No fields provided for update',
})

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, message: 'Invalid category id' })
  }

  const body = await readBody(event)
  const parsed = patchSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 400, message: parsed.error.issues[0]?.message || 'Invalid input' })
  }

  const db = useAppDatabase(event)

  // Get current category to check old name for renaming
  const [existing] = await db.select().from(categories).where(eq(categories.id, id))
  if (!existing) {
    throw createError({ statusCode: 404, message: 'Category not found' })
  }

  const updates: Record<string, unknown> = {
    updatedAt: new Date().toISOString(),
  }

  if (parsed.data.name !== undefined) updates.name = parsed.data.name.trim()
  if (parsed.data.sortOrder !== undefined) updates.sortOrder = parsed.data.sortOrder
  if (parsed.data.isActive !== undefined) updates.isActive = parsed.data.isActive

  try {
    const [updated] = await db
      .update(categories)
      .set(updates)
      .where(eq(categories.id, id))
      .returning()

    // If renamed, update all menu items with the old category name
    if (parsed.data.name && parsed.data.name.trim() !== existing.name) {
      await db
        .update(menuItems)
        .set({ category: parsed.data.name.trim() })
        .where(eq(menuItems.category, existing.name))
    }

    return { category: updated }
  } catch (error: unknown) {
    if ((error as Error)?.message?.includes('UNIQUE constraint failed')) {
      throw createError({ statusCode: 409, message: 'A category with that name already exists' })
    }
    throw error
  }
})
