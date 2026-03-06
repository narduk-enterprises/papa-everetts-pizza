/**
 * POST /api/auth/logout
 *
 * Destroys the current session and clears both the custom session cookie
 * and the nuxt-auth-utils sealed session.
 */
export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, 'session')
  const secureCookie = !import.meta.dev

  if (sessionId) {
    await deleteSession(sessionId)
  }

  deleteCookie(event, 'session', {
    httpOnly: true,
    secure: secureCookie,
    sameSite: 'lax',
    path: '/',
  })

  await clearUserSession(event)

  return { success: true }
})
