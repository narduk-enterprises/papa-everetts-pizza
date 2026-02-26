import { z } from 'zod'

const SITE_URL = 'https://papaeverettspizza.com/'

const bodySchema = z.object({
  sitemapUrl: z.string().url().optional(),
})

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const body = bodySchema.parse(await readBody(event))
  const sitemapUrl = body.sitemapUrl || `${SITE_URL}/sitemap.xml`

  await googleApiFetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/sitemaps/${encodeURIComponent(sitemapUrl)}`,
    GSC_WRITE_SCOPES,
    { method: 'PUT' },
  )

  return { success: true, submitted: sitemapUrl }
})
