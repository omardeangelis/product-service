---
domain: _root
type: index
links: []
created: 2026-11-12
updated: 2026-11-15
---

# Brain — Log

Append-only ingest/spec log. Newest first. Cap at 50 entries; drop the oldest when over.

<!-- Entries are appended by create-spec (spec creation) and docs-maintenance (ingest). Format:

## [YYYY-MM-DD] ingest | <spec title>
- Source: [[specs/<domain>/<spec>/SPEC]]
- Flows written: <count>
- Concepts written: <count>
-->

## [2026-11-15] review | Correzioni del count-up dei casi studio
- Report: [[review/2026-11-15-count-up-fix/REPORT]]
- Scope: standalone
- Verdict: DO NOT SHIP
- Impact: critical
- Verifiers: 4 (1 major sullo schema delle date; count-up SHIP su logica, motion e UI)

## [2026-11-15] review | Basi SEO/GEO e count-up dei casi studio
- Report: [[review/2026-11-15-seo-geo-basi/REPORT]]
- Scope: standalone
- Verdict: DO NOT SHIP
- Impact: critical
- Verifiers: 8 (1 blocker, 2 major)

## [2026-11-15] implemented | Sezione confronto in home ("Ticket")
- Source: [[specs/home/confronto-ticket/SPEC]] (AC1–AC18)
- Scelte di Omar in corsa: spostamento a 400 ms (T7b), il freelancer porta in produzione un ticket (T7c), fino a 760 px la vista statica "Stesso ticket" al posto della board (T7d, AC18)
- Prototipo `src/lab/` e rotta `/lab/[slug]` cancellati (T9, prima di T8 su richiesta di Omar)
- Aperto: T8 (iPhone, iPad, VoiceOver); review indipendente offerta, non lanciata (`review.mode: plan`)

## [2026-11-14] plan | Sezione confronto in home ("Ticket")
- Plan: [[specs/home/confronto-ticket/PLAN]] (T1–T9, 7 ondate; T8 di Omar)
- Motion budget: design-engineer (150 ms/giorno, FLIP a --dur-ui, tempo fermo con tab nascosta); gate: adversarial-verifier (DO NOT SHIP, 0 blocker / 5 major / 8 minor, tutti corretti nel piano)
- Spec approvata: domande 1–7 chiuse (demo settimanali in 02 e Prezzi, riga scenario, corsia "Agenzia", eccezione pezzi forti)

## [2026-11-14] spec | Sezione confronto in home ("Ticket")
- Created spec: [[specs/home/confronto-ticket/SPEC]]
- Domain: home
- Status: Draft
- Source: prototipo approvato `src/lab/confronto/` (`/lab/confronto`); nessuna review ux-advisor / ui-reviewer, quindi niente FLOW.md

## [2026-11-13] implemented | Sezione clienti in home (Muro)
- Source: [[specs/home/clienti-muro/SPEC]]
- T5 chiuso sulla build: corretti due bug visibili solo in produzione (piano fuori parete, lazy loading). CPU 4× con esito aperto in headless.
- Prototipo `src/lab/loghi` cancellato.

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
