---
description: Full app UI/UX audit and enhancement via Nuxt UI v4 + browser testing
---

# Full App UI/UX Enhancer

Autonomous whole-app workflow: scan every route, component, layout, and page; run a full UI/UX audit; apply production-grade improvements using Nuxt UI MCP + browser testing.

**Trigger:** `/ui-ux-enhancer` (optional: "focus on dashboard" or "mobile-first" for targeted runs)

## Steps (in order)

1. **Full App Inventory** — Discover all routes (`app/pages/`), components (`app/components/`), layouts. Build component tree + Tailwind class map. No `UDivider`; use `USeparator`. Icons: `i-` prefix. Colors: design tokens in `main.css` / `app.config.ts`.

2. **Multi-Page Browser Audit** — Launch browser. Crawl key routes at desktop + mobile. Capture screenshots, console errors, hydration warnings.

3. **Nuxt UI MCP** — Use `list-components` / `get-component` for v4 docs, variants, slots. Cross-reference detected components (UButton, UForm, UCard, UCarousel, USeparator, etc.).

4. **Diagnosis** — Prioritize: design consistency (colors, typography, spacing), accessibility (WCAG 2.2 AA, ARIA, focus, contrast), responsiveness, dark/light sync, performance (FOUC, icons), modern UX (skeletons, toasts, transitions), raw Tailwind → Nuxt UI migration.

5. **Enhancement Plan** — Ranked list of changes (atomic diffs). Prefer Nuxt UI built-ins. Include before/after and impact.

6. **Iterative Application** — Apply file-by-file. Re-run browser after major edits; compare screenshots.

7. **Validation** — Re-crawl routes, re-check console. Test dark mode + breakpoints if applicable.

8. **Finalize** — Commit: `enhance(ui/ux): full app polish via Nuxt UI v4 best practices`. Deliver: audit report + before/after gallery + changelog.

## Rules

- Prefer official Nuxt UI components/variants first.
- No new dependencies.
- Minimal, reversible changes.
- Stop and ask before large refactors.
