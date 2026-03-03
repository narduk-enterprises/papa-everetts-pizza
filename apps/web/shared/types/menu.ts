/**
 * Shared menu types and constants.
 *
 * Used by both the client-side (app/composables) and server-side (server/utils).
 * This file lives in `shared/` so Nuxt auto-imports it on both sides.
 */

export type MenuPrices = Record<string, number | null>

export const menuCategoryOrder = [
  'Build Your Own Masterpiece',
  'Gourmet Pizzas',
  'Favorite Pizzas',
  'Exclusive Pizzas',
  'Oven-Baked Pastas',
  'Appetizers',
  'Salads',
  'Desserts',
] as const
