/**
 * Canonical Domain Redirect Middleware
 *
 * Ensures all traffic is served from the primary domain: papaeverettspizza.com
 * Deny-by-default: any host that isn't the primary domain gets a 301 redirect.
 */
export default defineEventHandler((event) => {
  const host = getRequestHost(event, { xForwardedHost: true })
  const PRIMARY_DOMAIN = 'papaeverettspizza.com'

  // Skip in development
  if (import.meta.dev) return

  // Skip API routes so internal Nitro SSR fetch calls don't get 301 HTML redirected
  if (event.path.startsWith('/api/')) return

  // If already on the primary domain (non-www), do nothing
  if (host === PRIMARY_DOMAIN) return

  // Redirect all other domains/subdomains to the primary
  const url = getRequestURL(event)
  const redirectUrl = `https://${PRIMARY_DOMAIN}${url.pathname}${url.search}`
  return sendRedirect(event, redirectUrl, 301)
})
