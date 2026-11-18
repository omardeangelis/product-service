---
domain: _root
type: index
links: []
created: 2026-11-12
updated: 2026-11-18
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

| Domain | Map | Contract | Flows | Concepts |
|---|---|---|---|---|
| sito | [[domains/sito/sito]] | [[domains/sito/sito-contract]] | 3 | 3 |
| showcase | [[domains/showcase/showcase]] | [[domains/showcase/showcase-contract]] | 2 | 2 |

## Specs (per domain)

| Domain | Spec | Status |
|---|---|---|
| home | [[specs/home/clienti-muro/SPEC]] | Implemented |
| home | [[specs/home/confronto-ticket/SPEC]] | Implemented (prove sul dispositivo aperte) |
| sito | [[specs/sito/un-posto-solo/SPEC]] | Implemented (in produzione dal 2026-11-16) |
| showcase | [[specs/showcase/log-articoli/SPEC]] | Approved (con PLAN) |
| showcase | [[specs/showcase/cta-articoli/SPEC]] | Implemented, ingested (2026-11-18) |

Spec map: [[specs/home/home-specs|home-specs.md]] · [[specs/sito/sito-specs|sito-specs.md]] · [[specs/showcase/showcase-specs|showcase-specs.md]]

## Tech debt

- [[tech-debt/showcase/cta-articoli]] — 1 NIT dalla review: pareggio tra release con la stessa data

## Feature improvements

> One page per feature under `feature-improvement/<domain>/`. Entries are proposed by the suite and recorded only when the user accepts them (see `AGENTS.md` → `feature-improvement/`).

- [[feature-improvement/_unscoped/_unscoped]] — SEO/GEO, metadati e build fuori da una spec: 1 open, 1 planned con [[specs/showcase/log-articoli/SPEC]], 3 done con [[specs/sito/un-posto-solo/SPEC]] (2026-11-16)
- [[feature-improvement/sito/un-posto-solo]] — dopo [[specs/sito/un-posto-solo/SPEC]]: 1 done, i prezzi nel JSON-LD di `/pricing`, implementata su richiesta di Omar (2026-11-16)

## Reviews

> `adversarial-review` writes SHIP/DO-NOT-SHIP reports. Standalone reviews land under `<reviews>/<slug>/`; spec-implementation reviews land in the spec's review folder — inside the spec folder (`review.location: spec-folder`) or at `<reviews>/<domain>/<spec>/` (`review-tree`). Paths come from `brain/brain.config.json` (see `AGENTS.md` → Project configuration).

- [[specs/showcase/cta-articoli/REPORT|showcase/cta-articoli]] — spec · do-not-ship · critical · 2026-11-18 · corretto prima del push, ingested
- [[review/2026-11-15-count-up-fix/REPORT|2026-11-15-count-up-fix]] — standalone · do-not-ship · critical · 2026-11-15
- [[review/2026-11-15-seo-geo-basi/REPORT|2026-11-15-seo-geo-basi]] — standalone · do-not-ship · critical · 2026-11-15

## Log

- [[log|log.md]] — append-only ingest/spec log (max 50 entries)
