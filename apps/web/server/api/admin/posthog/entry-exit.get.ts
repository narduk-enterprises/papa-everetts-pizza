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
  const value = Number.parseInt(period) || (isHours ? 1 : 30)
  const intervalExp = isHours ? `toIntervalHour(${value})` : `toIntervalDay(${value})`

  try {
    // Entry pages — first page viewed in a session
    const entryRes = await $fetch<{ results?: (string | number)[][] }>(
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
              count() AS entries
            FROM events
            WHERE event = '$pageview'
              AND timestamp >= now() - ${intervalExp}
              AND properties.$current_url LIKE '%${DOMAIN}%'
              AND properties.$is_initial_landing = true
            GROUP BY page
            ORDER BY entries DESC
            LIMIT 10
          `,
          },
        },
      },
    )

    // Exit pages — approximate via last pageview per session
    const exitRes = await $fetch<{ results?: (string | number)[][] }>(
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
              count() AS exits
            FROM events
            WHERE event = '$pageleave'
              AND timestamp >= now() - ${intervalExp}
              AND properties.$current_url LIKE '%${DOMAIN}%'
            GROUP BY page
            ORDER BY exits DESC
            LIMIT 10
          `,
          },
        },
      },
    )

    const entryPages = (entryRes.results || []).map((row: (string | number)[]) => ({
      page: row[0] || '/',
      count: row[1] || 0,
    }))

    const exitPages = (exitRes.results || []).map((row: (string | number)[]) => ({
      page: row[0] || '/',
      count: row[1] || 0,
    }))

    return { entryPages, exitPages }
  } catch (error: unknown) {
    const err = error as { status?: number; statusCode?: number; message?: string }
    throw createError({
      statusCode: err.status || err.statusCode || 500,
      statusMessage: `PostHog Error: ${err.message}`,
    })
  }
})
