import { z } from 'zod'

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
    throw createError({ statusCode: 400, message: result.error.issues?.[0]?.message || 'Invalid input' })
  }

  const { password } = result.data

  try {
    const updatedUser = await updateUserPassword(id, password)
    return {
      message: 'Password updated successfully',
      id: updatedUser.id,
      email: updatedUser.email
    }
  } catch (error: any) {
    console.error('[updateUserPassword]', error)
    throw createError({ statusCode: 500, message: 'Failed to update user password.' })
  }
})
