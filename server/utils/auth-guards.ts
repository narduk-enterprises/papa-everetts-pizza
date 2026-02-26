import type { H3Event } from 'h3'

export async function requireAuthUser(event: H3Event) {
  const sessionId = getCookie(event, 'session')
  if (!sessionId) {
    throw createError({ statusCode: 401, message: 'Authentication required' })
  }

  const auth = await getAuthSession(sessionId)
  if (!auth) {
    throw createError({ statusCode: 401, message: 'Session expired. Please log in again.' })
  }

  return auth.user
}

export async function requireAdminUser(event: H3Event) {
  const user = await requireAuthUser(event)

  if (!user.isAdmin) {
    throw createError({ statusCode: 403, message: 'Admin access required' })
  }

  return user
}
