import { requireAdminUser } from '../../../../utils/auth-guards'
import { z } from 'zod'
import { users } from '../../../../../../../layers/narduk-nuxt-layer/server/database/schema'
import { eq } from 'drizzle-orm'

const passwordSchema = z.object({
  password: z.string().min(6),
})

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'User ID is required' })
  }

  const body = await readBody(event)
  const result = passwordSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: result.error.issues?.[0]?.message || 'Invalid input',
    })
  }

  const { password } = result.data

  try {
    const db = useDatabase(event)
    const hashedPassword = await hashUserPassword(password)
    const [updatedUser] = await db
      .update(users)
      .set({ passwordHash: hashedPassword, updatedAt: new Date().toISOString() })
      .where(eq(users.id, String(id)))
      .returning()

    if (!updatedUser) throw createError({ statusCode: 404, message: 'User not found' })

    return {
      message: 'Password updated successfully',
      id: updatedUser.id,
      email: updatedUser.email,
    }
  } catch (error: unknown) {
    console.error('[updateUserPassword]', error)
    throw createError({ statusCode: 500, message: 'Failed to update user password.' })
  }
})
