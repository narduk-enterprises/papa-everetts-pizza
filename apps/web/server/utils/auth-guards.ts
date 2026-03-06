import type { H3Event } from 'h3'

export async function requireAuthUser(event: H3Event) {
  const session = await requireAuth(event)
  return session
}

export async function requireAdminUser(event: H3Event) {
  const user = await requireAuthUser(event)
  if (!user.isAdmin) {
    throw createError({ statusCode: 403, message: 'Admin access required' })
  }
  return user
}
