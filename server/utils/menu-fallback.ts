import { menuSeedData } from '../database/menu-seed-data'

const fallbackCategoryOrder = [
  'Build Your Own Masterpiece', 'Gourmet Pizzas', 'Favorite Pizzas', 'Exclusive Pizzas',
  'Oven-Baked Pastas', 'Appetizers', 'Salads', 'Desserts',
]

export interface FallbackMenuItem {
  id: number
  category: string
  name: string
  description: string
  imageUrl?: string | null
  prices: Record<string, number | null>
  sortOrder: number
  isActive: boolean
  updatedAt: string
}

let fallbackMenu: FallbackMenuItem[] | null = null

function ensureFallbackMenu() {
  if (fallbackMenu) return fallbackMenu

  const now = new Date().toISOString()
  fallbackMenu = menuSeedData.map((item, index) => ({
    id: index + 1,
    category: item.category,
    name: item.name,
    description: item.description,
    imageUrl: item.imageUrl || null,
    prices: { ...item.prices },
    sortOrder: item.sortOrder,
    isActive: true,
    updatedAt: now,
  }))

  return fallbackMenu
}

export function getFallbackMenu(activeOnly = true) {
  const items = ensureFallbackMenu()
    .filter(item => (activeOnly ? item.isActive : true))
    .sort((a, b) => {
      if (a.category !== b.category) {
        const aIndex = fallbackCategoryOrder.indexOf(a.category)
        const bIndex = fallbackCategoryOrder.indexOf(b.category)
        const normalizedAIndex = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex
        const normalizedBIndex = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex
        return normalizedAIndex - normalizedBIndex
      }
      if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder
      return a.name.localeCompare(b.name)
    })

  return items.map(item => ({ ...item, prices: { ...item.prices } }))
}

export function updateFallbackMenuItem(id: number, updates: Partial<Omit<FallbackMenuItem, 'id'>>) {
  const items = ensureFallbackMenu()
  const item = items.find(entry => entry.id === id)
  if (!item) return null

  if (updates.category !== undefined) item.category = updates.category
  if (updates.name !== undefined) item.name = updates.name
  if (updates.description !== undefined) item.description = updates.description
  if (updates.imageUrl !== undefined) item.imageUrl = updates.imageUrl
  if (updates.prices !== undefined) item.prices = { ...updates.prices }
  if (updates.sortOrder !== undefined) item.sortOrder = updates.sortOrder
  if (updates.isActive !== undefined) item.isActive = updates.isActive
  item.updatedAt = new Date().toISOString()

  return { ...item, prices: { ...item.prices } }
}

export function addFallbackMenuItem(input: {
  category: string
  name: string
  description: string
  imageUrl?: string | null
  prices: Record<string, number | null>
  sortOrder: number
}) {
  const items = ensureFallbackMenu()
  const nextId = items.length ? Math.max(...items.map(item => item.id)) + 1 : 1

  const item: FallbackMenuItem = {
    id: nextId,
    category: input.category,
    name: input.name,
    description: input.description,
    imageUrl: input.imageUrl || null,
    prices: { ...input.prices },
    sortOrder: input.sortOrder,
    isActive: true,
    updatedAt: new Date().toISOString(),
  }

  items.push(item)
  return { ...item, prices: { ...item.prices } }
}
