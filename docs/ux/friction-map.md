# Friction Map (Phase 2)

UX friction along the three journeys. Each issue: location, symptom, hypothesized cause, category, impact.

---

## Journey 1: Order intent

| # | Location | Symptom | Cause | Category | Impact |
|---|----------|---------|--------|----------|--------|
| F1 | `/`, `/menu` | Menu section shows “Loading menu...” then content | `useMenu()` uses blocking `useAsyncData` (no `lazy`) | Rendering / Data fetch | High — delays LCP and first meaningful content |
| F2 | `/menu` | Pizza builder (collapsible) feels heavy on first open | Full `PizzaBuilderWidget` + `usePizzaBuilder` hydrate on expand | Hydration | Medium — INP on first interaction |
| F3 | `/menu` | Lightbox (image zoom) only works after client hydrate | Lightbox in `ClientOnly` + `Teleport` | Hydration | Low — expected for overlay |
| F4 | `/menu` | Collapsible header uses `tabindex="0"` but no keyboard toggle doc | UCollapsible trigger keyboard behavior unclear | Accessibility | Medium — keyboard users may not discover expand |
| F5 | `/pizza-builder` | Page shows “Loading builder pricing...” then widget | Same menu fetch blocks; dedicated page duplicates fetch | Rendering | High — dedicated route blocks on same data |
| F6 | `/`, Featured Favorites | “Loading menu highlights...” then grid | Same as F1; featured items derived from menu | Rendering | High |
| F7 | Home hero | CTA “Order Now” is custom `.cta-phone`; “View Full Menu” is UButton | Inconsistent primary action styling | Design inconsistency | Low |
| F8 | Menu cards | Price pills use inline `border-pizza-border`, `bg-white` | Not using a single card/price variant | Design inconsistency | Low |

---

## Journey 2: Catering

| # | Location | Symptom | Cause | Category | Impact |
|---|----------|---------|--------|----------|--------|
| F9 | `/catering` | Hero image (external/Unsplash) can be slow | No explicit priority/fetchpriority; image LCP candidate | Rendering | High — LCP variance |
| F10 | `/catering` | Form layout matches contact but label/help/error not in one standard | Form structure ad hoc per page | Design inconsistency | Low |
| F11 | `/catering` | “Request Catering” vs “Send Request” copy | Slight inconsistency with contact “Send Message” | Copy clarity | Low |

---

## Journey 3: Contact

| # | Location | Symptom | Cause | Category | Impact |
|---|----------|---------|--------|----------|--------|
| F12 | `/contact` | Map iframe loads after paint; can shift layout | Iframe `height="280"` fixed but container can cause CLS if font/line change | Rendering / CLS | Medium |
| F13 | `/contact` | Form fields: focus ring depends on Nuxt UI defaults | No explicit focus-visible audit | Accessibility | Medium — gate requirement |
| F14 | `/contact` | Three info cards (Visit, Call, Hours) repeat same icon+title+body pattern | No shared card variant; warm-card used manually | Design inconsistency | Low |

---

## Cross-cutting

| # | Location | Symptom | Cause | Category | Impact |
|---|----------|---------|--------|----------|--------|
| F15 | All forms | Error messages: tied to inputs via UFormField; need aria-describedby check | UForm schema errors may not announce to screen readers | Accessibility | High — gate |
| F16 | Admin `/admin` | Full admin panel waits for `await refreshAuth()` | Blocking auth before render | Rendering | Medium — admin only |
| F17 | Global | No routeRules defined | Every route uses default SSR; no ISR/static for content-heavy pages | Rendering | Medium — TTFB/LCP not tuned per route |
| F18 | Home | CustomerReviews fetches reviews via useAsyncData (blocking) | Reviews block below-fold content | Rendering | Low — below fold but still blocking |

---

## Priority for sprints

- **High:** F1, F5, F6 (menu fetch blocking); F9 (catering LCP); F15 (form a11y).
- **Medium:** F2, F4, F12, F16, F17.
- **Low:** F3, F7, F8, F10, F11, F14, F18.

Sprint selection: pick one journey, up to 3 fixes per sprint from this map.
