/**
 * CSRF protection middleware.
 *
 * Allows state-changing requests when either:
 * 1) an `X-Requested-With` header is present, or
 * 2) the request is same-origin by `Origin` / `Referer`.
 *
 * Skipped for non-mutating methods and preflight (OPTIONS) requests.
 */
export default defineEventHandler((event) => {
  const method = event.method.toUpperCase()

  // Only protect state-changing methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) return

  const xRequestedWith = getHeader(event, 'x-requested-with')
  if (xRequestedWith) return

  const origin = getHeader(event, 'origin')
  const referer = getHeader(event, 'referer')
  const requestHost = getRequestHost(event, { xForwardedHost: true })
  const requestProtocol = getRequestProtocol(event, { xForwardedProto: true })
  const expectedOrigin = `${requestProtocol}://${requestHost}`

  if (origin && isSameOrigin(origin, expectedOrigin)) return
  if (!origin && referer && isSameOrigin(referer, expectedOrigin)) return

  throw createError({
    statusCode: 403,
    message: 'Forbidden: cross-origin mutation request blocked',
  })
})

function isSameOrigin(value: string, expectedOrigin: string): boolean {
  try {
    return new URL(value).origin === expectedOrigin
  } catch {
    return false
  }
}
