import { z } from 'zod'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  // Rate limit: 5 signup attempts per minute per IP
  await enforceRateLimit(event, 'auth-signup', 5, 60_000)
  const body = await readBody(event)
  const parsed = signupSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 400, message: parsed.error?.issues[0]?.message || 'Invalid input' })
  }

  const { email, password, name } = parsed.data

  const isFirstUser = (await getUserCount()) === 0

  // After the first admin user is created, public signup is disabled.
  // Only an existing admin can create new accounts.
  if (!isFirstUser) {
    // Check if the request comes from an authenticated admin
    const sessionId = getCookie(event, 'session')
    if (!sessionId) {
      throw createError({ statusCode: 403, message: 'Public registration is disabled. Contact the administrator.' })
    }
    const auth = await getAuthSession(sessionId)
    if (!auth || !auth.user.isAdmin) {
      throw createError({ statusCode: 403, message: 'Only administrators can create new accounts.' })
    }
  }

  // Check for existing user
  const existing = await getUserByEmail(email)
  if (existing) {
    throw createError({ statusCode: 409, message: 'An account with this email already exists' })
  }

  const user = await createUser(email, password, name, isFirstUser)
  const sessionId = await createSession(user.id)
  const secureCookie = !import.meta.dev

  setCookie(event, 'session', sessionId, {
    httpOnly: true,
    secure: secureCookie,
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  })

  // Sync with nuxt-auth-utils so layer requireAuth / useUserSession see the same user
  const sessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    isAdmin: user.isAdmin,
  }
  await setUserSession(event, { user: sessionUser })

  return { user: sessionUser }
})
