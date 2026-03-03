# Rendering + Hydration Audit (Phase 3)

Route-level strategy, data fetches, client-only boundaries, and LCP/INP/CLS notes. No `routeRules` exist today; all routes use default Nuxt SSR.

---

## Route matrix

| Route | SSR/SSG/ISR/Hybrid | Route rules | Blocking fetches | Client-only / heavy hydration | LCP element | INP hotspot |
|-------|--------------------|-------------|------------------|--------------------------------|-------------|-------------|
| `/` | SSR | (none) | `useMenu()` (public-menu), `useReviews()` (customer-reviews) | CustomerReviews carousel; PhotoStrip | Hero image; “Featured Favorites” when menu resolves | Nav, CTAs, carousel |
| `/menu` | SSR | (none) | `useMenu()` (public-menu) | Lightbox (ClientOnly); UCollapsible + PizzaBuilderWidget | H1 + paper menu CTA; then menu grid | Pizza builder toggles; lightbox; collapsible |
| `/pizza-builder` | SSR | (none) | `useMenu()` (public-menu) | PizzaBuilderWidget (sizes, crust, toppings); IntersectionObserver in widget | Hero image; then builder card | Size/crust/topping buttons; sticky price bar |
| `/contact` | SSR | (none) | None (static + form) | None significant | H1; address card; map container | Form submit; map iframe |
| `/catering` | SSR | (none) | None (static + form) | PhotoGallery | Hero image | Form submit; gallery |
| `/about` | SSR | (none) | None | — | Hero or first heading | — |
| `/gallery` | SSR | (none) | None (photos from composable) | PhotoGallery | First image grid | Gallery interactions |
| `/fundraisers` | SSR | (none) | None | — | First content | — |
| `/schools` | SSR | (none) | None | — | First content | — |
| `/paper-menu` | SSR | (none) | None | ClientOnly (PDF/viewer) | — | Viewer controls |
| `/admin` | SSR | (none) | Auth `refresh` awaited; `useAdminMenu()` (useAsyncData) | Full admin UI (forms, switches, uploads) | Login form or dashboard header | All form and button interactions |
| `/admin/*` | SSR | (none) | useFetch (posthog, analytics, gsc) | Charts/tables | First data panel | Filters, tabs |

---

## Data fetch summary

| Key | Composable / usage | Blocking? | Notes |
|-----|--------------------|-----------|--------|
| `public-menu` | useMenu() — useAsyncData, no lazy | **Yes** | Used on /, /menu, /pizza-builder; blocks until API resolves |
| `customer-reviews` | useReviews() — useAsyncData, no lazy | **Yes** | Home only; below fold but still blocks SSR payload |
| `auth-user` | useAuth() — useAsyncData, lazy: true | No | Auth not blocking; admin then awaits refreshAuth() in page |
| Admin menu | useAdminMenu() — useAsyncData | **Yes** (admin) | Blocks admin dashboard after auth |
| PostHog/GA/GSC | useFetch in admin pages | Yes (per page) | Admin only |

---

## TTFB variance

- No routeRules: no explicit `isr`, `swr`, or `static`; every request hits server (or edge).
- Menu API and reviews API called during SSR for `/`, `/menu`, `/pizza-builder`; TTFB can increase with slow D1/API.
- Admin: sequential auth then admin menu fetch increases TTFB for dashboard.

---

## Hydration-heavy components

| Component | Where | Why |
|-----------|--------|-----|
| PizzaBuilderWidget | /menu (collapsible), /pizza-builder | Many reactive toggles, computed prices, IntersectionObserver |
| CustomerReviews | / (UCarousel) | Carousel state, arrows, items |
| Lightbox (menu.vue) | /menu | ClientOnly + Teleport; DOM outside main tree |
| Paper menu viewer | /paper-menu | ClientOnly |
| Admin panel | /admin | Full form tree, file inputs, switches |

---

## Recommendations (for sprint consideration)

1. **routeRules:** Add `swr` or `isr` for `/menu` (and optionally `/`) so menu payload can be cached and not block every request.
2. **useMenu:** Consider `lazy: true` and show skeleton or static shell so LCP is not gated by menu API on `/` and `/menu`.
3. **LCP:** Ensure hero images have explicit dimensions and `fetchpriority="high"` where they are LCP (e.g. home, catering).
4. **Pizza builder:** Keep as client-heavy; ensure first interaction (expand or first click) is fast; consider deferring non-critical JS.
5. **Contact map:** Reserve space (min-height) for iframe to avoid CLS; keep iframe lazy.
6. **Auth (admin):** Already non-blocking in useAuth; admin page’s `await refreshAuth()` is intentional so UI doesn’t flash; acceptable for admin-only.

These recommendations are candidates for Phase 5 sprints within the allowed fix types (no large rewrites, no new UI libraries).
