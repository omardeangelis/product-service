---
domain: _root
type: index
links: []
created: 2026-11-12
updated: 2026-11-18
---

# Brain — Log

Append-only ingest/spec log. Newest first. Cap at 50 entries; drop the oldest when over.

<!-- Entries are appended by create-spec (spec creation) and docs-maintenance (ingest). Format:

## [YYYY-MM-DD] ingest | <spec title>
- Source: [[specs/<domain>/<spec>/SPEC]]
- Flows written: <count>
- Concepts written: <count>
-->

## [2026-11-18] review | CTA negli articoli di release (pre-push)
- Report: [[specs/showcase/cta-articoli/REPORT]]
- Scope: spec
- Verdict: DO NOT SHIP
- Impact: critical
- Verifiers: 7 (1 blocker, 2 major: float invisibile sopra la Firma con reduced motion, punteggio 1–100 vs 0–100, percorso locale in launch.json)

## [2026-11-18] implemented | Le CTA negli articoli di release
- Source: [[specs/showcase/cta-articoli/SPEC]] (T8 fatto: prototipo `src/lab/` e rotta `/lab/[slug]` cancellati su richiesta di Omar, prima del deploy)
- Chiuse anche D11 (resta la salita del banner) e la regola reduced motion del pulsante flottante (`global.css`)
- Spec `implemented`, piano `Complete`. Da fare: `docs-maintenance`

## [2026-11-17] implementing | Le CTA negli articoli di release: T1–T7
- Source: [[specs/showcase/cta-articoli/SPEC]] (T1–T7 completati; T8 dopo il deploy)
- Firma con foto in fondo alle 6 release; un banner Partner/Team a metà corpo, deciso in build; entrate armate visibili senza JS; flottante nascosto sulla Firma
- Build verde; verificato nel browser da 224 a 1440 px, a 1× e 1,25×, con reduced motion e senza JS. Note: [[specs/showcase/cta-articoli/IMPLEMENTATION-NOTES]]

## [2026-11-17] plan | Le CTA negli articoli di release ("Firma" e banner intermedio)
- Plan: [[specs/showcase/cta-articoli/PLAN]] (T1–T8 in catena; T1 e T8 con Omar)
- Grill: banner automatico a metà, foto di Omar al posto delle iniziali, flottante nascosto quando la Firma è in vista (nuovo AC12 nella spec, ora Approved)
- Motion: `design-engineer` conferma i valori del prototipo, con entrate armate (`data-armed`) invece di `.reveal` per AC10; salita del banner da riconfermare in T7 (D11)
- Gate: adversarial-verifier (DO NOT SHIP, 0 blocker / 3 major / 4 minor / 5 nit, tutti integrati: lingua del banner nella release inglese, T6 dopo T5, controllo finale su stringhe sbagliate, margine 36 px, guardia D2, lampo del flottante, strumenti del browser)

## [2026-11-17] spec | Le CTA negli articoli di release ("Firma" e banner intermedio)
- Created spec: [[specs/showcase/cta-articoli/SPEC]]
- Domain: showcase
- Status: Draft
- Da prototipo: `src/lab/cta-articoli/` (rotta `/lab/cta-articoli`), senza review UX/UI né state sweep

## [2026-11-17] implementing | Showcase: in produzione, prototipo cancellato
- Source: [[specs/showcase/log-articoli/SPEC]] (T15, T16 e T18 completati)
- Sei release vere al posto dei 13 segnaposto; build di produzione verde; PR #5 mergiata su main (732b96d) e deploy confermato da Omar
- Prototipo `src/lab/` (con UX-REVIEW e UI-REVIEW) e rotta `/lab/[...slug]` cancellati
- Aperto: T17 (prove a mano su iPhone Safari, VoiceOver, NVDA, Firefox, Safari desktop)

## [2026-11-16] implementing | Showcase: gli articoli in home e nella pagina /showcase ("Fila")
- Source: [[specs/showcase/log-articoli/SPEC]] (T1–T14 completati, in sequenza, worker supervisionati; nessuna escalation)
- Verifica completa T14 sui segnaposto: 6 difetti trovati e corretti (chip premuto illeggibile, anello tagliato nella fila e sotto la nav, pulsante flottante sopra il focus, nav a 125 %, filtro perso senza bfcache)
- Aperto: T15 (release vere di Omar), T16, T17, T18; AC4 bloccato fino a T15. Nessun commit

## [2026-11-16] plan | Showcase: chiuse le domande aperte
- Plan: [[specs/showcase/log-articoli/PLAN]] (D29–D32); spec e FLOW aggiornati, domande aperte 1 e 2 della spec chiuse
- Date dei casi studio da Omar: Excel 2025-05-21, Onboarding 2026-03-20, Offerte AI 2026-04-30, Motion 2026-07-26, senza segnaposto
- Nuova regola in AC10: la data della scheda porta l'anno quando è diverso da quello dell'articolo più recente («21 mag 2025»)
- Zoom della copertina da `left top` confermato; refuso «Da form  chat» corretto in `offerte-ai.md` (già online nella sezione 04 di oggi)

## [2026-11-16] plan | Showcase: gli articoli in home e nella pagina /showcase ("Fila")
- Plan: [[specs/showcase/log-articoli/PLAN]] (T1–T18 in sequenza; T15 e T17 con Omar)
- Gate: adversarial-verifier (DO NOT SHIP, 0 blocker / 6 major / 9 minor / 4 nit, tutti integrati: `reference()` che non blocca la build, dipendenze di T7 e T10, esecuzione in sequenza per `dist/` condiviso, ritorno dalla release in una scheda nuova, indice delle frecce dopo uno scorrimento a mano)
- design-engineer: budget di motion confermato; chiuso l'open risk del brief, aggiunte le regole su swap, frecce e controlli prima del paint
- Grill con Omar: release scritte da lui alla fine, segnaposto bloccati in produzione; corpo della release di lunghezza libera; AC3 solo per lo showcase; copertine dei casi studio dal prototipo. Spec aggiornata e approvata

## [2026-11-16] spec | Showcase: gli articoli in home e nella pagina /showcase ("Fila")
- Created spec: [[specs/showcase/log-articoli/SPEC]]
- Flow: [[specs/showcase/log-articoli/FLOW]]
- Domain: showcase (nuovo; tocca home e sito)
- Status: Draft
- Source: prototipo approvato `src/lab/showcase/` (`/lab/showcase`), review ux-advisor e ui-reviewer (proceed with decisions), state sweep saltato
- Presa in carico la miglioria "Serializer JSON-LD più rigido" ([[feature-improvement/_unscoped/_unscoped]], ora planned)

## [2026-11-16] closed | Un posto solo — T6, deploy su Vercel con Node 26
- Source: [[specs/sito/un-posto-solo/IMPLEMENTATION-NOTES]] (AC14 met: tutti gli AC soddisfatti)
- PR #4 mergiata (`e858e2e`); Node 26.x confermato da Omar nel log di Vercel; produzione verificata con `curl` (sitemap 7 URL, `/llms.txt`, 5 `Offer` su `/pricing`)
- Dominio principale reso `spatalo.tech` su Vercel (prima reindirizzava a www, in contrasto con il canonical)

## [2026-11-16] ingest | Un posto solo — prezzi, sitemap e versione di Node
- Source: [[specs/sito/un-posto-solo/SPEC]] (con IMPLEMENTATION-NOTES)
- Flows written: 3
- Concepts written: 3
- Review ingested: none
- Nuovo dominio [[domains/sito/sito]] con contract; migliorie "Prezzi in un posto solo", "Esclusioni della sitemap", "Versione di Node" e "Prezzi nei dati strutturati" passate a done

## [2026-11-16] implemented | Un posto solo — prezzi, sitemap e versione di Node
- Source: [[specs/sito/un-posto-solo/SPEC]] (AC1–AC13, AC15–AC16 met; AC14 blocked)
- T1–T5 sequenziali, T2/T4/T5 a worker `sonnet` rivisti dall'orchestratore, nessuna escalation; HTML, `/llms.txt` e sitemap identici alla fotografia di partenza
- Aperto: T6, deploy su Vercel con Node 26.x, quando Omar chiede push e PR; review indipendente offerta, non lanciata (`review.mode: plan`)
- Dopo l'audit, su richiesta di Omar: piani e prezzi nel JSON-LD di `/pricing` (`Service` con `Offer`, da `PRICES`); registrata in [[feature-improvement/sito/un-posto-solo]]

## [2026-11-15] plan | Un posto solo — prezzi, sitemap e versione di Node
- Plan: [[specs/sito/un-posto-solo/PLAN]] (T1–T6 in sequenza; T6 con Omar sul log di Vercel)
- Gate: adversarial-verifier (DO NOT SHIP, 0 blocker / 3 major / 5 minor / 8 nit, tutti integrati nel piano: `outDir` stringa, grep di AC1 rifatto, mutazioni per ogni derivato, bundle client senza `Intl`)
- Spec approvata: "da" del Team resta 5.000€, blocco di Node anche su `dev` (nuovo AC12), Node 26 default di nvm; Vercel supporta Node 26

## [2026-11-15] spec | Un posto solo — prezzi, sitemap e versione di Node
- Created spec: [[specs/sito/un-posto-solo/SPEC]]
- Domain: sito
- Status: Draft
- Source: evolutive 1, 3, 4 di [[feature-improvement/_unscoped/_unscoped]] (ora planned)

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
