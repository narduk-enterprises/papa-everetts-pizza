import type { MenuItem } from '../database/schema'
import { categories } from '../database/schema'
import type { MenuPrices } from '#shared/types/menu'
import { asc, eq } from 'drizzle-orm'
export type { MenuPrices }

/** Fetch ordered category names from the DB. */
export async function getCategoryNames(): Promise<string[]> {
  try {
    const db = useDatabase()
    const rows = await db
      .select({ name: categories.name })
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(asc(categories.sortOrder), asc(categories.name))
    return rows.map(r => r.name)
  } catch {
    // Fallback if table doesn't exist yet
    return [
      'Build Your Own Masterpiece', 'Gourmet Pizzas', 'Favorite Pizzas', 'Exclusive Pizzas',
      'Oven-Baked Pastas', 'Appetizers', 'Salads', 'Desserts',
    ]
  }
}

const categoryAliases: Record<string, string> = {
  'Build Your Own': 'Build Your Own Masterpiece',
  Pastas: 'Oven-Baked Pastas',
}

const priceKeyAliases: Record<string, string> = {
  'le petit': 'le_petit',
  le_petit: 'le_petit',
  s: 'small',
  small: 'small',
  m: 'medium',
  medium: 'medium',
  l: 'large',
  large: 'large',
  xl: 'xl',
  'one size': 'single',
  one_size: 'single',
  single: 'single',
  price: 'single',
}

function canonicalizePriceKey(key: string) {
  const normalized = key.trim().toLowerCase().replace(/\s+/g, ' ')
  return priceKeyAliases[normalized] || normalized.replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
}

function normalizePrices(prices: unknown): MenuPrices {
  if (!prices || typeof prices !== 'object') return {}

  const normalized: MenuPrices = {}
  for (const [rawKey, rawValue] of Object.entries(prices)) {
    const key = canonicalizePriceKey(rawKey)
    if (!key) continue

    if (rawValue === null) {
      normalized[key] = null
      continue
    }

    if (typeof rawValue === 'number' && Number.isFinite(rawValue)) {
      normalized[key] = rawValue
      continue
    }

    const numeric = Number(rawValue)
    normalized[key] = Number.isFinite(numeric) ? numeric : null
  }

  return normalized
}

function normalizeCategory(category: string) {
  return categoryAliases[category] || category
}

export function parsePrices(prices: string): MenuPrices {
  try {
    const parsed = JSON.parse(prices)
    return normalizePrices(parsed)
  } catch {
    return {}
  }
}

export function serializeMenuItem(item: MenuItem) {
  return {
    ...item,
    category: normalizeCategory(item.category),
    prices: parsePrices(item.prices),
  }
}
