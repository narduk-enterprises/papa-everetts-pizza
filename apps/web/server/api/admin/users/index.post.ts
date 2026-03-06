import { requireAdminUser } from '../../../utils/auth-guards'
import { z } from 'zod'
import { users } from '../../../../../../layers/narduk-nuxt-layer/server/database/schema'

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
    throw createError({
      statusCode: 400,
      message: result.error.issues?.[0]?.message || 'Invalid input',
    })
  }

  const { email, password, name, isAdmin } = result.data
  try {
    const hashedPassword = await hashUserPassword(password)
    const db = useDatabase(event)

    const [newUser] = await db
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        email,
        passwordHash: hashedPassword,
        name,
        isAdmin,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning()

    if (!newUser) throw createError({ statusCode: 500, message: 'Failed to create user' })

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      isAdmin: newUser.isAdmin,
      createdAt: newUser.createdAt,
    }
  } catch (_e: unknown) {
    throw createError({
      statusCode: 400,
      message: 'Could not create user. Email may already exist.',
    })
  }
})
