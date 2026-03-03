# UI/UX Enhancer — Audit Report & Changelog

**Run:** Full app polish via Nuxt UI v4 best practices  
**Scope:** Papa Everett's Pizza — `apps/web/app/`

---

## 1. App Inventory (Summary)

| Type | Count | Notes |
|------|--------|------|
| **Routes (pages)** | 16 | index, menu, about, contact, catering, fundraisers, schools, gallery, pizza-builder, paper-menu, admin/* (index, users, guide, gsc, analytics, posthog) |
| **Components** | 6 | AdminPriceEditor, PizzaBuilderWidget, PhotoGallery, AppFormCard, CustomerReviews, PhotoStrip |
| **Layouts** | 0 | Single default layout in app.vue |
| **Nuxt UI usage** | UApp, UMain, ULink, UButton, UIcon, UForm, UFormField, UInput, UTextarea, USelect, USwitch, UCard, UCarousel, UCollapsible, USeparator |

- **Design tokens:** `main.css` @theme defines `--color-pizza-*`; `app.config.ts` sets `primary: 'red'`, `neutral: 'slate'`.
- **No UDivider** (v4 uses USeparator). Icons use `i-lucide-*`. No raw hex in Vue files.

---

## 2. Browser Audit (Homepage)

- **Console:** No hydration errors. Only Vite connect + Vue Suspense + Nuxt DevTools messages.
- **Accessibility snapshot:** Landmarks and links present; "Home" and root link show `[current]` (active state).
- **Recommendation:** Carousel Prev/Next show `[disabled]` when few items — expected; consider hiding arrows when only one slide if desired later.

---

## 3. Nuxt UI MCP Cross-Check

- Button: uses `color`, `variant`, `size`, `icon`; theme uses compoundVariants. App usage aligns.
- Form / FormField: schema + state + UFormField name; app uses Zod + useFormHandler + toasts.
- Main: renders `<main>`; id and tabindex forwarded for skip-link target.

---

## 4. Diagnosis (Prioritized)

1. **Accessibility (WCAG 2.2 AA)** — Add skip link, aria-current on nav, focus-visible on nav/footer, main landmark id.
2. **Consistency** — Prefer ULink in header/footer for active state and focus; add `<nav>` and aria-labels.
3. **Loading UX** — Replace spinner with skeleton placeholders in CustomerReviews.
4. **Design system** — Already token-based; no changes needed for this pass.

---

## 5. Changes Applied

| File | Change |
|------|--------|
| **app/app.vue** | Skip-to-main link (sr-only, focus visible); logo NuxtLink → ULink; desktop nav NuxtLink → ULink with active-class/inactive-class, `<nav>` + aria-label, focus-visible ring; mobile nav same + `<nav>`; UMain given `id="main-content"` and `tabindex="-1"` for skip target; footer Quick Links NuxtLink → ULink with hover/focus-visible. |
| **app/components/CustomerReviews.vue** | Pending state: spinner replaced with 3× UCard + USkeleton placeholders (author, date, stars, lines), aria-busy and aria-label. |
| **.agents/workflows/ui-ux-enhancer.md** | New workflow definition for `/ui-ux-enhancer`. |

---

## 6. Before / After (Summary)

- **Before:** Nav used NuxtLink; no skip link; no explicit main id; footer links NuxtLink; reviews loading = single spinner.
- **After:** ULink nav with aria-current and focus-visible; skip link and #main-content; footer ULink with focus ring; skeleton loading for reviews.

---

## 7. Commit & Next Steps

**Suggested commit:**

```bash
git add apps/web/app/app.vue apps/web/app/components/CustomerReviews.vue .agents/workflows/ui-ux-enhancer.md .agents/artifacts/ui-ux-enhancer-report.md
git commit -m "enhance(ui/ux): full app polish via Nuxt UI v4 best practices"
```

**Optional follow-ups (not done this run):**

- Mobile viewport crawl + Lighthouse (a11y, performance).
- Dark mode check (app currently forces light via main.css).
- Carousel: hide arrows when items.length <= 1.
- Consider UContainer for max-width consistency on content sections.
