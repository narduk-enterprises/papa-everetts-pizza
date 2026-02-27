import { requireAdminUser } from '../../../utils/auth-guards'
import { createUser } from '../../../utils/auth'
import { z } from 'zod'

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
  isAdmin: z.boolean().default(false),
})

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const body = await readBody(event)
  
  const result = userSchema.safeParse(body)
  if (!result.success) {
    throw createError({ statusCode: 400, message: result.error.issues?.[0]?.message || 'Invalid input' })
  }

  const { email, password, name, isAdmin } = result.data
  try {
    const newUser = await createUser(email, password, name, isAdmin)
    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      isAdmin: newUser.isAdmin,
      createdAt: newUser.createdAt,
    }
  } catch (_e: any) {
    throw createError({ statusCode: 400, message: 'Could not create user. Email may already exist.' })
  }
})
