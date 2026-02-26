import { z } from 'zod'
import { menuItems } from '../../database/schema'
import { requireAdminUser } from '../../utils/auth-guards'
import { addFallbackMenuItem } from '../../utils/menu-fallback'

const createSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional().default(''),
  imageUrl: z.string().nullable().optional(),
  prices: z.record(z.string(), z.number().nullable()),
  sortOrder: z.number().int().min(0).default(0),
})

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const body = await readBody(event)
  const parsed = createSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 400, message: parsed.error.issues[0]?.message || 'Invalid input' })
  }

  try {
    const db = useDatabase()
    const now = new Date().toISOString()

    const result = await db
      .insert(menuItems)
      .values({
        category: parsed.data.category,
        name: parsed.data.name,
        description: parsed.data.description || '',
        imageUrl: parsed.data.imageUrl || null,
        prices: JSON.stringify(parsed.data.prices),
        sortOrder: parsed.data.sortOrder,
        isActive: true,
        updatedAt: now,
      })
      .returning()

    return { item: result[0] }
  } catch (e) {
    console.error('D1 Error (POST menu_items):', e)
    const item = addFallbackMenuItem({
      category: parsed.data.category,
      name: parsed.data.name,
      description: parsed.data.description || '',
      imageUrl: parsed.data.imageUrl || null,
      prices: parsed.data.prices,
      sortOrder: parsed.data.sortOrder,
    })
    return { item, source: 'fallback' }
  }
})
