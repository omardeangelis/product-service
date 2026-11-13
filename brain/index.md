---
domain: _root
type: index
links: []
created: 2026-11-12
updated: 2026-11-13
---

# Brain — Master Map

Entry point of the knowledge base. Links the work areas: chore (informal planning), specs (PM-authored), domains (synthesized by `docs-maintenance`), the tech-debt store (`<techDebt>`, persistent drift), the feature-improvement store (`feature-improvement/`, improvements the user accepted), and the project config (`brain.config.json`).

## Chore (planning material)

- [[chore/product|product.md]] — cosa promuove il sito, obiettivo (call prenotata), tono e offerta
- [[chore/motion|motion.md]] — personalità del motion, token e deviazioni volute dagli standard
- [[chore/motion-stack|motion-stack.md]] — frontend stack (Astro 7.3 + React islands, motion 14) and how the design-engineering references apply
- [[personas|personas.md]] — CTO, agenzie di design, software house in white label

## Domains

> Domain pages (`domains/<domain>/<domain>.md` + `<domain>-contract.md` + `concepts/` + `flows/` + `decisions/`) are created by the `docs-maintenance` flow when a spec in that domain is ready to be ingested. Until then a domain appears here only via its spec map.

_empty_

## Specs (per domain)

| Domain | Spec | Status |
|---|---|---|
| home | [[specs/home/clienti-muro/SPEC]] | Draft |

Spec map: [[specs/home/home-specs|home-specs.md]]

## Tech debt

_empty_

## Feature improvements

> One page per feature under `feature-improvement/<domain>/`. Entries are proposed by the suite and recorded only when the user accepts them (see `AGENTS.md` → `feature-improvement/`).

_empty_

## Reviews

> `adversarial-review` writes SHIP/DO-NOT-SHIP reports. Standalone reviews land under `<reviews>/<slug>/`; spec-implementation reviews land in the spec's review folder — inside the spec folder (`review.location: spec-folder`) or at `<reviews>/<domain>/<spec>/` (`review-tree`). Paths come from `brain/brain.config.json` (see `AGENTS.md` → Project configuration).

_empty_

## Log

- [[log|log.md]] — append-only ingest/spec log (max 50 entries)
