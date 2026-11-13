---
domain: _root
type: index
links: []
created: 2026-11-12
updated: 2026-11-12
---

# Brain — Log

Append-only ingest/spec log. Newest first. Cap at 50 entries; drop the oldest when over.

<!-- Entries are appended by create-spec (spec creation) and docs-maintenance (ingest). Format:

## [YYYY-MM-DD] ingest | <spec title>
- Source: [[specs/<domain>/<spec>/SPEC]]
- Flows written: <count>
- Concepts written: <count>
-->

## [2026-11-13] plan | Sezione clienti in home ("Muro")
- Plan: [[specs/home/clienti-muro/PLAN]] (T0–T7, 6 ondate; T0 e T6 di Omar)
- Motion budget: design-engineer; gate: adversarial-verifier (DO NOT SHIP, 0 blocker / 5 major / 6 minor, tutti corretti nel piano e nella spec)
- Spec aggiornata: domande 1, 3, 4, 5 chiuse, motion brief con reduced motion a `--dur-swap`

## [2026-11-13] spec | Sezione clienti in home ("Muro")
- Created spec: [[specs/home/clienti-muro/SPEC]]
- Flow: [[specs/home/clienti-muro/FLOW]]
- Domain: home
- Status: Draft
- Source: prototipo approvato `src/lab/loghi/` (`/lab/loghi`), review ux-advisor e ui-reviewer (round 2)

## [2026-11-12] chore | motion tokens, personas, product
- Motion tokens in `src/styles/global.css`; decisions in [[chore/motion]]
- [[personas]] (paths.personas set), [[chore/product]]

## [2026-11-12] init | brain bootstrap
- brain-manager 0.10.0, fresh init, provider: claude, review.mode: plan
- Stack profile: [[chore/motion-stack]] (Astro 7.3 + React islands, motion 14)
