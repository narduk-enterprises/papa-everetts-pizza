import { z } from 'zod'
import { categories } from '../../database/schema'
import { requireAdminUser } from '../../utils/auth-guards'

const createSchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  sortOrder: z.number().int().min(0).default(0),
})

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const body = await readBody(event)
  const parsed = createSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 400, message: parsed.error.issues[0]?.message || 'Invalid input' })
  }

  const db = useAppDatabase(event)
  const now = new Date().toISOString()

  try {
    const result = await db
      .insert(categories)
      .values({
        name: parsed.data.name.trim(),
        sortOrder: parsed.data.sortOrder,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      })
      .returning()

    return { category: result[0] }
  } catch (error: unknown) {
    if ((error as Error)?.message?.includes('UNIQUE constraint failed')) {
      throw createError({ statusCode: 409, message: 'A category with that name already exists' })
    }
    throw error
  }
})
