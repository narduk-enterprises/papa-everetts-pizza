import { z } from 'zod'

const querySchema = z.object({
  propertyId: z.string().optional().default(process.env.GA_PROPERTY_ID || '526158939'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const query = await getValidatedQuery(event, querySchema.parse)

  const endDate = query.endDate || new Date().toISOString().split('T')[0]
  const start = new Date(endDate || new Date().toISOString())
  start.setDate(start.getDate() - 30)
  const startDate = query.startDate || start.toISOString().split('T')[0]

  try {
    const data = (await googleApiFetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${query.propertyId}:runReport`,
      GA_SCOPES,
      {
        method: 'POST',
        body: JSON.stringify({
          dateRanges: [{ startDate, endDate }],
          metrics: [
            { name: 'activeUsers' },
            { name: 'sessions' },
            { name: 'screenPageViews' },
            { name: 'bounceRate' },
            { name: 'averageSessionDuration' },
          ],
          dimensions: [{ name: 'date' }],
        }),
      },
    )) as { totals?: Array<{ metricValues?: Array<{ value: string }> }>; rows?: Array<Record<string, unknown>> }

    const totals = data.totals
    const rows = data.rows

    return {
      totals: totals?.[0]?.metricValues || [],
      rows: rows || [],
      startDate,
      endDate,
    }
  } catch (error: unknown) {
    const err = error as { statusCode?: number; statusMessage?: string; message?: string }
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: `GA4 Error: ${err.statusMessage || err.message}`,
    })
  }
})
