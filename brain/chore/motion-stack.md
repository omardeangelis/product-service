---
domain: _root
type: concept
links: ["[[index]]"]
created: 2026-11-12
updated: 2026-11-12
---

# Motion stack profile

Written by the design-engineering stack adaptation. Regenerate it when the stack changes instead of patching rows by hand. Taste decisions (personality, chosen values, deliberate deviations) belong in `motion.md`, not here.

## Stack

| | Value | Evidence |
| --- | --- | --- |
| Framework | Astro 7.3.5 with React 19.3.0 islands (`@astrojs/react` 7.0.0) | `package.json`, `package-lock.json` |
| Rendering | Static output (no adapter). `.astro` pages ship no framework JS; React runs only in the prototypes under `/p` | `astro.config.mjs` |
| Styling | Plain CSS: `src/styles/global.css` (color/radius tokens) + scoped `<style>` in `.astro` files | `src/styles/global.css` |
| Motion / gestures | `motion` 14.0.0 — `motion/react` (`motion`, `AnimatePresence`, `MotionConfig`) in the prototypes; inline `<script>` + CSS transitions in `.astro` pages | `src/prototypes/esempio-4k9x2/*.tsx`, `src/components/MotionDemos.astro` |
| UI primitives | none (no Radix/Base UI, Sonner, Vaul) | `package.json` |
| Routing in prototypes | `wouter` 3.13.0 | `package.json` |
| Motion tokens | `--ease-*`, `--dur-*`, `--stagger` in `src/styles/global.css` (`:root`); decisions in `brain/chore/motion.md`. Reduced motion handled per page via `@media (prefers-reduced-motion: reduce)` and `matchMedia` | `src/styles/global.css` |
| Scope | whole repo (single frontend) | detected |

## How the references apply

- **As written:** the gate and values (`standards.md`), the procedures (`review`, `audit`, `opportunities`, `diagnose`, `motion-brief`), the CSS material, and — inside React islands (`src/prototypes/**`) — every Motion for React API, since the installed `motion` package is the one the references use.
- **`.astro` pages (no React):** use the CSS sections first; for JS-driven motion use vanilla `motion` (`animate`, `inView`, `scroll` from `motion`) or WAAPI in a `<script>`, never a React island just to animate.
- **Not applicable:** nothing.

## Translation

| # | Concept | References (React) | This project | Source | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | Component motion, exit after removal, global config | `motion.*`, `AnimatePresence`, `MotionConfig` | same, from `motion/react` (islands only) | `motion` 14.0.0 in `package-lock.json`; already used in `src/prototypes/` | verified (14.0) |
| 2 | Motion in non-React pages | — | CSS transitions/keyframes, or vanilla `animate`/`inView` from `motion` in an Astro `<script>` | Astro pages in `src/pages/` | verified (in repo) |
| 3 | Reduced motion | `useReducedMotion`, `MotionConfig reducedMotion` | islands: `MotionConfig reducedMotion="user"`; `.astro`: `@media (prefers-reduced-motion: reduce)` + `matchMedia` (already the pattern) | `src/styles/global.css:53`, `src/pages/index.astro:1141` | verified (in repo) |

## Stack-specific traps

- An island only animates once hydrated: anything visible on first paint must also look right before hydration (`client:*` directive timing).
- `.astro` `<style>` is scoped: shared easing/duration values must live as custom properties in `global.css` to be reused.

## Open decisions

- No toast/drawer/primitive library is installed; the references' Sonner/Vaul/Radix examples route to native `<dialog>`/`popover` + CSS until one is needed.
