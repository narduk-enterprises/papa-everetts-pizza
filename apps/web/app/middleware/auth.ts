/**
 * Client-side route middleware: redirects unauthenticated users to `/`.
 *
 * Usage in a page:
 *   definePageMeta({ middleware: 'auth' })
 */
export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn, refresh } = useAuth()

  if (!loggedIn.value) {
    await refresh()
  }

  if (!loggedIn.value) {
    return navigateTo('/')
  }
})
