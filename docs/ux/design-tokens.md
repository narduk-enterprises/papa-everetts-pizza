# Design Tokens (Phase 4.1)

Single source of truth for semantic colors, typography, spacing, radii, and elevation. All UI must use these (via Nuxt UI theme or CSS variables); no component-level color overrides.

---

## Current definition

### app.config.ts (Nuxt UI)

```ts
ui: {
  colors: {
    primary: 'red',   // maps to pizza-red in practice via @theme
    neutral: 'slate',
  },
}
```

### main.css @theme (Tailwind CSS 4)

| Token | Value | Usage |
|-------|--------|--------|
| `--font-sans` | 'Inter', system-ui, -apple-system, sans-serif | Body, inputs |
| `--font-display` | 'Playfair Display', Georgia, serif | Headings, hero |
| `--color-pizza-red` | #ce2029 | Primary CTAs, links, accents |
| `--color-pizza-red-dark` | #b01b23 | Hover states (e.g. cta-phone) |
| `--color-pizza-blue` | #1e3a8a | Footer, secondary brand |
| `--color-pizza-blue-light` | #2548a8 | — |
| `--color-pizza-gold` | #ffcb05 | Highlights, stars, footer headings |
| `--color-pizza-bg` | #f0f4f8 | Page background |
| `--color-pizza-bg-soft` | #e8edf3 | — |
| `--color-pizza-surface` | #ffffff | Cards, inputs |
| `--color-pizza-border` | #d1d9e6 | Borders |
| `--color-pizza-text` | #1e293b | Primary text |
| `--color-pizza-muted` | #64748b | Secondary text |
| `--color-pizza-highlight` | #ce2029 | Same as primary |
| `--color-pizza-footer-text` | #e2e8f0 | Footer links and text on blue |

### main.css :root (Nuxt UI overrides — force light)

- `--ui-bg`, `--ui-bg-elevated`, `--ui-bg-accented`, `--ui-border`, `--ui-text`, `--ui-text-dimmed`, `--ui-text-muted`, etc. set to light palette so `.dark` is effectively disabled.

---

## Semantic roles (standardized)

| Role | Token | Notes |
|------|--------|--------|
| Primary action | `primary` (red) / `pizza-red` | Buttons, main CTAs |
| Secondary / neutral | `neutral` (slate) | Secondary buttons, borders |
| Destructive | `error` (Nuxt UI) | Delete, danger |
| Background | `pizza-bg` / body | Page |
| Surface | `pizza-surface` / warm-card | Cards, modals |
| Border | `pizza-border` | Dividers, card outlines |
| Text | `pizza-text` | Body |
| Muted | `pizza-muted` / warm-muted | Captions, hints |
| Focus/Highlight | primary or `pizza-red` | Focus rings, links |

---

## Typography scale

- **Display:** `font-display` (Playfair) — H1, H2, section titles.
- **Body:** `font-sans` (Inter) — body, forms, labels.
- Sizes: use Tailwind/Nuxt UI scale (`text-sm`, `text-lg`, etc.); no arbitrary font sizes. Prefer `text-lg` for section intros, `text-sm` for captions and form help.

---

## Spacing scale

Use Tailwind spacing (4px base): `p-4`, `gap-4`, `space-y-6`, etc. Section padding: `py-12`, `py-16`; container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.

---

## Border radii

- Cards / surfaces: `rounded-2xl` (1rem) or `rounded-xl` (0.75rem) — matches `.warm-card` (1rem).
- Buttons: Nuxt UI default (typically `rounded-lg`).
- Pills: `rounded-full` (e.g. cta-phone).

---

## Elevation / shadows

- Cards: `box-shadow: 0 1px 3px rgba(0,0,0,0.06)` (warm-card).
- No ad-hoc shadows; use Nuxt UI card/panel variants or this single card shadow.

---

## Rules

- No inline hex in templates; use `text-pizza-red`, `bg-pizza-blue`, `border-pizza-border`, or Nuxt UI `color`/`variant`.
- No new one-off CSS variables without adding them to `@theme` and documenting here.
- Force light mode is intentional; `.dark` overrides keep light tokens.
