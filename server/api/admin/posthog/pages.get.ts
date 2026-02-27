import { z } from 'zod'

const config = useRuntimeConfig()
const POSTHOG_PROJECT_ID = config.posthogProjectId
const DOMAIN = 'papaeverettspizza.com'

const querySchema = z.object({
  period: z.string().optional().default('30d'),
})

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const config = useRuntimeConfig()
  const apiKey = config.posthogApiKey || ''
  const query = await getValidatedQuery(event, querySchema.parse)

  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'PostHog API key not configured' })
  }

  const period = query.period
  const isHours = period.endsWith('h')
  const value = parseInt(period) || (isHours ? 1 : 30)
  const intervalExp = isHours ? `toIntervalHour(${value})` : `toIntervalDay(${value})`

  try {
    const res = await $fetch<{ results?: (string | number)[][] }>(
      `https://us.posthog.com/api/projects/${POSTHOG_PROJECT_ID}/query/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: {
          query: {
            kind: 'HogQLQuery',
            query: `
            SELECT
              replaceRegexpAll(properties.$pathname, '\\\\?.*', '') AS page,
              count() AS pageviews,
              count(DISTINCT person_id) AS unique_visitors
            FROM events
            WHERE event = '$pageview'
              AND timestamp >= now() - ${intervalExp}
              AND properties.$current_url LIKE '%${DOMAIN}%'
            GROUP BY page
            ORDER BY pageviews DESC
            LIMIT 20
          `,
          },
        },
      },
    )

    const rows = (res.results || []).map((row: (string | number)[]) => ({
      page: row[0] || '/',
      pageviews: row[1] || 0,
      uniqueVisitors: row[2] || 0,
    }))

    return { rows }
  } catch (error: unknown) {
    const err = error as { status?: number; statusCode?: number; message?: string }
    throw createError({
      statusCode: err.status || err.statusCode || 500,
      statusMessage: `PostHog Error: ${err.message}`,
    })
  }
})
