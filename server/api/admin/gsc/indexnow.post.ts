import { z } from 'zod'

const bodySchema = z.object({
    url: z.string().url(),
})

/**
 * POST /api/admin/gsc/indexnow
 * Pings IndexNow to request (re)crawling of a specific URL.
 * Uses the Microsoft/Bing IndexNow endpoint (which also notifies Yandex, Seznam, Naver).
 */
export default defineEventHandler(async (event) => {
    await requireAdminUser(event)

    const body = bodySchema.parse(await readBody(event))
    const config = useRuntimeConfig(event)
    const indexNowKey = config.public.indexNowKey

    if (!indexNowKey) {
        throw createError({
            statusCode: 400,
            statusMessage: 'IndexNow key is not configured. Set INDEXNOW_KEY env var.',
        })
    }

    const siteUrl: string = config.public.appUrl as string || 'https://papaeverettspizza.com'

    try {
        await $fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                host: new URL(siteUrl).hostname,
                key: indexNowKey,
                urlList: [body.url],
            }),
        })

        return { success: true, url: body.url, service: 'IndexNow' }
    } catch (error: unknown) {
        const err = error as { statusCode?: number; message?: string }
        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: `IndexNow error: ${err.message}`,
        })
    }
})
