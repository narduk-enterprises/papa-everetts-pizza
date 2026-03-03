# User Journeys (Phase 1)

Three highest-value user journeys for Papa Everett's Pizza. Each defines entry, core action, completion, success threshold, and drop-off risk.

---

## Journey 1: Order intent — Browse menu and call to order

| Field | Value |
|-------|--------|
| **Entry route** | `/` (home) or direct `/menu` |
| **Core action** | View menu (and optionally pizza builder), then call to place order |
| **Completion state** | User has decided what to order and has phone number visible or has called |
| **Success time threshold** | LCP on home < 2.5s; menu content visible < 2.5s; tap-to-call within 2 taps from any page |
| **Drop-off risk** | Menu fetch blocks first paint on home/menu; slow INP on pizza builder toggles; unclear CTA hierarchy |

**Key routes:** `index.vue`, `menu.vue`, `pizza-builder.vue`. Hero image and menu API drive LCP. Pizza builder (size/toppings) is INP-heavy.

---

## Journey 2: Catering inquiry

| Field | Value |
|-------|--------|
| **Entry route** | `/catering` (from nav or SEO) |
| **Core action** | Read catering info, optionally view gallery, submit catering request form |
| **Completion state** | Form submitted with success message |
| **Success time threshold** | Hero + form above fold visible < 2.5s; form submit < 200ms INP; no CLS on success toast |
| **Drop-off risk** | Form validation/accessibility; hero image LCP; copy clarity (“Request Catering” vs “Get a quote”) |

**Key routes:** `catering.vue`. Single form + hero; external image for hero can affect LCP.

---

## Journey 3: Contact / visit info

| Field | Value |
|-------|--------|
| **Entry route** | `/contact` |
| **Core action** | Get address, hours, or phone; optionally send message via form |
| **Completion state** | User has address/phone/hours or has submitted contact form |
| **Success time threshold** | Address and phone visible < 2.5s; map loads non-blocking; form submit accessible |
| **Drop-off risk** | Iframe map layout shift; form and map competing for attention; no visible focus on form fields |

**Key routes:** `contact.vue`. Map iframe and form are main content; CLS risk from map loading.

---

## Summary

| Journey | Primary route(s) | LCP element | INP hotspot |
|---------|------------------|-------------|-------------|
| Order intent | /, /menu, /pizza-builder | Hero image, menu section | Pizza builder toggles, lightbox |
| Catering | /catering | Hero + form card | Submit button |
| Contact | /contact | Header + address card / map | Form submit, map |

These three journeys drive the friction map and perf audit; sprints should improve them within the allowed fix types (rendering, hydration, tokens, variants, copy, a11y, latency).
