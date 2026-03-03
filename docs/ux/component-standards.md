# Component Standards (Phase 4.2)

All implemented using Nuxt UI v4 variants and tokens. No duplicated UI logic; no inline overrides that break tokens.

---

## Buttons

| Variant | Use case | Nuxt UI |
|---------|----------|---------|
| Primary | Main CTA (View Menu, Send Message, Submit) | `UButton` `color="primary"` |
| Secondary | Secondary actions (Learn More, Reset) | `color="neutral"` `variant="soft"` |
| Destructive | Delete, remove, danger | `color="error"` |
| Ghost | Tertiary, icon-only (close, logout) | `variant="ghost"` |
| Outline | Size/crust/topping toggles in pizza builder | `variant="outline"` |

- Use `UButton` for in-app actions; `ULink` for navigation and external (e.g. phone).
- Phone CTA: custom `.cta-phone` is allowed as branded pill; do not duplicate elsewhere — use one component or class.
- Icons: `i-lucide-*` only; use `icon` prop or `UIcon` with `name="i-lucide-*"`.

---

## Forms

- **Structure:** `UForm` with `schema` (Zod) and `state`; `UFormField` per field with `label`, optional `name`, `required`, `description`.
- **Layout:** `.form-section` (vertical gap), `.form-row` (two-column on sm+), `.form-actions` / `.form-actions-full` for submit row.
- **Fields:** `UInput`, `UTextarea`, `USelect` with `class="w-full"` (required for width).
- **Errors:** Schema-driven; errors shown via UFormField. Ensure `aria-describedby` / association for errors (accessibility gate).
- **Wrapper:** `AppFormCard` for login/signup and grouped form sections (title, description, icon).

No custom form layouts that bypass this structure.

---

## Cards

- **Pattern:** Header (optional) / body / footer (optional).
- **Chrome:** `.warm-card` (border, surface, radius, shadow) or Nuxt UI `UCard` with consistent `ui` overrides.
- **Content:** Use `warm-muted` for secondary text; `font-display` for card titles when they are section-level.

Info cards (Visit Us, Call Us, Hours): reuse same structure — icon + title + body; consider a single `AppInfoCard` component to avoid duplication.

---

## Tables / lists

- Menu item list: current pattern (grid of warm-card articles) is acceptable.
- Admin tables: use Nuxt UI table components or card list; no custom table markup without shared component.

---

## Modals / overlays

- Lightbox (menu): `ClientOnly` + `Teleport`; use `UButton` for close; ensure focus trap and Escape close (already in place).
- Future modals: use Nuxt UI modal component with focus trap and `aria-modal`.

---

## Loading states

- **Inline:** “Loading menu...”, “Loading builder pricing...” (warm-muted text).
- **Spinner:** `UIcon name="i-lucide-loader-2" class="animate-spin"` (e.g. CustomerReviews).
- Prefer consistent copy: “Loading [resource]…” and same spinner style.

---

## Empty states

- **Pattern:** Centered block; icon (e.g. `i-lucide-package-open`), short message, optional action.
- **Example:** Admin “No items match your current selection” — use same pattern elsewhere (e.g. empty search).

---

## Error states

- **Inline:** “Unable to load menu right now.” — `text-pizza-red`.
- **Toast:** useToast() for form submit and API errors (already in use).
- **Page error:** error.vue; no custom error UI without reusing same pattern.

---

## Consistency checks (Phase 8)

- No inline Tailwind that overrides tokens (e.g. arbitrary `text-[#...]` or `bg-[#...]`).
- No color hardcoding; use `pizza-*` or Nuxt UI semantic colors.
- All primary CTAs use `UButton` primary or `ULink.cta-phone`; no ad-hoc red buttons.
- All forms use `UForm` + `UFormField` + schema; label/help/error in one structure.
- Single loading and empty pattern; single error style for inline and toast.
