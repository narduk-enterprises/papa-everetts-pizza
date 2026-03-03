# Sprint 1 — Implementation Summary

Single sprint implementing high-impact fixes from the Antigravity UX workflow (Phases 1–4 + allowed fix types). No architectural rewrites; no new UI libraries.

---

## Journey coverage

- **Journey 1 (Order intent):** Menu/reviews non-blocking; LCP hero; loading skeletons; pizza builder collapsible a11y; error states.
- **Journey 2 (Catering):** LCP hero priority.
- **Journey 3 (Contact):** Map CLS prevention; global focus-visible.

---

## Changes implemented

### 1. Route rules (`nuxt.config.ts`)

- Added `routeRules`: `swr: 60` for `/` and `/menu`; `swr: 300` for `/about`, `/contact`, `/catering`, `/gallery`, `/fundraisers`, `/schools`, `/paper-menu`.
- Reduces TTFB variance by caching responses at the edge.

### 2. Non-blocking data fetches

- **useMenu:** `useAsyncData(..., { lazy: true, dedupe: 'defer' })`. Menu no longer blocks first paint on `/`, `/menu`, `/pizza-builder`.
- **useReviews:** `useAsyncData(..., { lazy: true, dedupe: 'defer' })`. Reviews no longer block home LCP.

### 3. LCP and CLS

- **Home hero:** `fetchpriority="high"` and `width="1920"` / `height="1080"` on hero image.
- **Catering hero:** `fetchpriority="high"` and dimensions on hero image.
- **Contact map:** Container `min-h-[280px] h-[280px] w-full` to reserve space and prevent CLS when iframe loads.

### 4. Loading and error consistency

- **Home (Featured Favorites):** Skeleton grid (4 placeholder cards) when `pending`; `aria-busy`, `aria-label`.
- **Menu:** Skeleton blocks for pizza builder + category list when `pending`; error block with `role="alert"` and consistent copy.
- **Pizza builder:** Skeleton card when `pending`; error block with `role="alert"`.
- **CustomerReviews:** Loading `aria-busy`/`aria-label`; error `role="alert"` and bordered container.

### 5. Accessibility

- **Focus:** Global `:focus-visible { outline: 2px solid var(--color-pizza-red); outline-offset: 2px; }` in `main.css`.
- **Pizza builder collapsible:** Replaced `div` trigger with `UButton` (variant="ghost", block); keyboard operable (Enter/Space); `aria-label="Toggle Build Your Own Masterpiece pizza builder"`; `focus-visible:ring-2 focus-visible:ring-pizza-red` on trigger.

### 6. Token alignment

- **Footer:** New token `--color-pizza-footer-text: #e2e8f0` in `@theme`; `.site-footer` and `.site-footer a` use `var(--color-pizza-footer-text)` instead of hex.
- **design-tokens.md:** Documented new token.

---

## Files touched

| File | Change |
|------|--------|
| `nuxt.config.ts` | routeRules |
| `app/composables/useMenu.ts` | lazy, dedupe |
| `app/composables/useReviews.ts` | lazy, dedupe |
| `app/pages/index.vue` | hero fetchpriority/dims; Featured Favorites skeleton |
| `app/pages/menu.vue` | collapsible UButton trigger + a11y; loading skeleton; error role="alert" |
| `app/pages/pizza-builder.vue` | loading skeleton; error role="alert" |
| `app/pages/contact.vue` | map container min-height |
| `app/pages/catering.vue` | hero fetchpriority/dims |
| `app/components/CustomerReviews.vue` | loading/error a11y and styling |
| `app/assets/css/main.css` | :focus-visible; footer token; new token in @theme |
| `docs/ux/design-tokens.md` | pizza-footer-text token |

---

## Before/after metrics (to be measured)

- **LCP:** Expect improvement on `/` and `/catering` from non-blocking menu/reviews and hero `fetchpriority`.
- **INP:** Collapsible trigger is now a native button (keyboard + no extra handlers).
- **CLS:** Map and loading skeletons should reduce layout shift.
- **A11y:** Focus visible globally; collapsible keyboard and label; error regions announced.

Run Lighthouse (or project perf suite) and accessibility audit to capture baseline and post-sprint numbers.

---

## Prohibited (not done)

- No new UI libraries.
- No re-theming beyond token addition.
- No large architectural rewrites.
- Admin `await refreshAuth()` left as-is (intentional for admin-only).
