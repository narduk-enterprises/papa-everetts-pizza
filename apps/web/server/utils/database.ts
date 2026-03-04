/// <reference types="@cloudflare/workers-types" />
import type { H3Event } from 'h3'
import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1'
import * as schema from '../database/schema'

type AppDB = DrizzleD1Database<typeof schema>

/**
 * Return a Drizzle ORM instance for the current request.
 * Uses useAppDatabase pattern to avoid type collision with layer's useDatabase.
 * Memoized on event.context to avoid redundant instantiation within a single request.
 */
export function useAppDatabase(event: H3Event): AppDB {
  if (event.context._appDb) {
    return event.context._appDb as AppDB
  }

  const d1 = (event.context.cloudflare?.env as { DB?: D1Database })?.DB
  if (!d1) {
    throw createError({
      statusCode: 500,
      message: 'D1 database binding not available. Ensure DB is configured in wrangler.json.',
    })
  }

  const db = drizzle(d1, { schema })
  event.context._appDb = db
  return db
}
