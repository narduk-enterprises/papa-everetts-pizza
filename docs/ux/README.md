# Antigravity UX — Papa Everett's Pizza

Systematic UX improvement using Nuxt 4 + Nuxt UI v4: rendering control, tokens, hydration discipline, performance budgets, and accessibility gates.

## Success metrics (hard gates)

| Metric | Target |
|--------|--------|
| LCP (p75) | < 2.5s |
| INP (p75) | < 200ms |
| CLS (p75) | < 0.10 |
| No layout shift on navigation | Required |
| Keyboard accessible forms | Required |
| Visible focus states | Required |

## Artifacts

| Document | Purpose |
|----------|---------|
| [journeys.md](./journeys.md) | Top 3 user journeys, entry → completion, success thresholds |
| [friction-map.md](./friction-map.md) | UX friction by route/component, cause, impact |
| [perf-audit.md](./perf-audit.md) | Rendering strategy, blocking fetches, LCP/INP/CLS, hydration |
| [design-tokens.md](./design-tokens.md) | Semantic colors, typography, spacing, radii — no component overrides |
| [component-standards.md](./component-standards.md) | Buttons, forms, cards, loading/empty/error — Nuxt UI variants only |
| [sprints/](./sprints/) | Per-sprint fixes, before/after metrics |

## Execution loop

1. Audit (Phases 1–3)
2. Standardize (Phase 4)
3. Sprint (Phase 5 — max 3 fixes per sprint)
4. Measure
5. Gate (accessibility + performance)
6. Document

Stop when all three journeys meet budgets, no high-impact friction remains, and UI is consistent.
