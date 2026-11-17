---
domain: showcase
type: implementation-notes
spec: log-articoli
links:
  - "[[specs/showcase/log-articoli/SPEC]]"
ingested: false
last_ingested: null
created: 2026-11-16
updated: 2026-11-17
---

# Implementation Notes

## Summary

- T1–T14 completati il 2026-11-16, in sequenza, con i 13 articoli segnaposto. Il codice della feature è tutto scritto e verificato: contenuti e guardia, `/showcase/`, pagine delle release, sezione 04 in home con frecce e motion, feed, `/llms.txt`, JSON-LD rigido, link del sito.
- T15 e T16 chiusi il 2026-11-17: sei release vere (Jev, Agenda, Skill suggerite, UI sweep, Beautiful UI, CV anonimo e report, dal 22 set al 17 nov), segnaposto cancellati, build di produzione verde. Testi di `/showcase/` e della sezione 04 riscritti da Omar; il pulsante dell'hero ora dice «Vedi portfolio ↓».
- Deploy in produzione il 2026-11-17 (PR #5). T18 chiuso lo stesso giorno: prototipo `src/lab/` cancellato, rotta `/lab` tolta.
- Resta solo T17 (prove a mano di Omar). Per questo la spec resta `approved` e il piano non è `Complete`.

## Execution Mode

- Mode: sequential (D28: i task condividono `dist/` e le prove cambiano i contenuti).
- Delegation: supervised. `low` → haiku, `medium` → sonnet, `high` → modello dell'orchestratore. Validazioni nel browser fatte dall'orchestratore.
- Escalations: nessuna. Ogni task ha passato la prima revisione; i difetti trovati dopo (T2, T5, T13) sono stati corretti dall'orchestratore o da un worker di correzione dopo T14.
- Worker: haiku per T2, T3, T10, T11, T12; sonnet per T1, T4, T5, T7, T8, T14; modello dell'orchestratore per T6, T9, T13 e per le correzioni F2–F6.
- Advisor: `design-engineer` non richiamato per T13, perché i valori erano già fissati in create-plan (D26, D27, D31).

## Deviations From the Plan

- T5 → T13: la regola `.chip` di `Filtri.astro` era globale e dava `min-height: 40px` e `cursor: pointer` ai `.chip` già presenti in home (sezione 01). Trovata dal worker di T13, corretta dall'orchestratore (`.sc-chips .chip`).
- T2: il worker ha saltato `caseStudy: dati-da-excel` in `segnaposto-immagine`, e la mia revisione non l'ha visto. L'ha trovato il worker di T4; corretto dall'orchestratore prima di chiudere T4.
- T6: dopo la prova con tutte le release in bozza, il ripristino a mano può aver spostato la riga `draft: true` di `segnaposto-bozza.md` (ora dopo `project`); lo shasum di partenza non era stato stampato. Il contenuto è equivalente.
- T9: la validazione del piano chiedeva chip **e frecce** su una riga da 358 px. AC19 della spec parla solo dei chip, che rispettano la regola (una riga da 357 px). Con le frecce (2 × 44 px + spazio) la riga dei controlli sta su una riga solo da circa 459 px: tra 358 e 458 px le frecce vanno sotto i chip, tra 280 e 357 px fino a tre righe. Le frecce compaiono solo con un puntatore fine, quindi il caso è una finestra desktop molto stretta. Lasciato così; da decidere con Omar se serve un'altra disposizione.

## Surprises and Decisions

- T1: la cartella `src/content/releases/` può mancare (il loader `glob` dà solo un WARN). In `onboarding-saas` e `offerte-ai` `published` sta dopo `order`, perché non hanno `draft`.
- T4: `articoli-testi.ts` esporta anche `isTag`, `oggiLocale` (giorno locale del visitatore, per gli script) e `articoli.ts` esporta `annoRif`.
- T6: contratto per la home: chip con `data-total`, link `a[data-cta]` con `[data-cta-label]`, riga «l'ultimo <time datetime data-rel-riga>il 15 nov</time>» (il testo HTML è il caso lontano, preposizione compresa). `bindTags` non annuncia niente all'apertura, solo al cambio filtro.

## Sanity Checks

| Check | Result | Notes |
|------|--------|-------|
| `npm run build` (Node 26) | ok | 21 pagine, dopo ogni task e dopo le correzioni di T14 |
| `VERCEL_ENV=production npm run build` | ok dal 2026-11-17 | prima falliva, come voluto, sui 13 segnaposto (T2); passa dopo T15 |
| `t4-testi.mjs` (testi e date) | ok | 25 controlli |
| `t5-dist.mjs`, `t7-dist.mjs`, `t8-dist.mjs` | ok | `/showcase/`, pagine release, sezione 04 |
| `t11-rss.sh` (`xmllint` e feed) | ok | 16 item |
| `ld.mjs` (JSON-LD di ogni pagina) | ok | niente `<>&`/U+2028/U+2029 in chiaro |
| Verifica completa T14 | ok dopo le correzioni | rapporto in `verifica/T14-REPORT.md` |

## Acceptance Criteria Status

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC1 | met | schema, guardia, bozze escluse ovunque |
| AC2 | met | `PROJECTS`, divieto di `caseStudy` in white label; la scelta release per release resta a Omar (T15) |
| AC3 | met | controllato su sezione 04, `/showcase/`, release, feed, `/llms.txt` |
| AC4 | met | sei release vere, nessun segnaposto, gate di produzione verde |
| AC5–AC8 | met | |
| AC9 | met in Chromium | VoiceOver e NVDA in T17 |
| AC10 | met | orologio finto al 16, 20 e 23 novembre |
| AC11 | met in Chromium | tap su iPhone e NVDA in T17 |
| AC12–AC16 | met | |
| AC17 | met | VoiceOver in T17 |
| AC18 | met in Chromium | esito annunciato da verificare con VoiceOver in T17 |
| AC19 | met | i chip stanno su una riga da 357 px; con le frecce (solo puntatore fine) la riga è unica da circa 459 px, vedi Deviations |
| AC20–AC24 | met | |
| AC25 | met | titoli segnaposto e prova a 100 caratteri; da ripetere con i titoli veri in T16 |
| AC26 | met | dopo F2 |
| AC27 | met | dopo F3; in orizzontale il pulsante flottante copre il 4–9 % del fondo delle schede più alte dello spazio libero |
| AC28 | met | dopo F1 e F5; la home a 280 px con testo al 125 % sborda di 28 px nel pannello prezzi, fuori da questa spec |
| AC29–AC31 | met | |

## Out of Scope Observations

- T14: su `/showcase/` a 800 px di altezza alcune schede raggiunte con Tab hanno il fondo dell'anello 5 px sotto il bordo dello schermo (la scheda è in parte visibile e Chrome non scorre). Non corretto: estendere l'aiuto al bordo basso farebbe comparire il pulsante flottante a metà scorrimento.
- T14: la home a 280 px con testo al 125 % sborda di 28 px nel pannello prezzi, e `/pricing/` sborda di 51 px a 280 px anche a 1×. Preesistenti, fuori da questa spec.
- T8 (rischio per AC27, da riprendere in T14): in orizzontale (667×375, 844×390) una scheda della home è più alta dello schermo (474 px). Scendendo con Tab l'anello resta sotto la nav; risalendo con Shift+Tab da sotto, Chrome allinea il bordo più vicino e la cima dell'anello finisce sotto la nav (−15 px). Il piano verifica solo la discesa. → Confermato da T14 e corretto con F3 (`tieniVisibile`).
- T8, dal worker: il pulsante flottante «Prenota 30 minuti» copre il fondo delle schede a 900 px di altezza. Comportamento già esistente del sito.
- T10, dal worker: `/pricing/` scorre di lato a 280 px (`scrollWidth` 331, scheda Partner). Già così prima di questo lavoro. È un difetto preesistente fuori da questa spec: da segnalare a Omar, non corretto qui.

## Remaining Work

- T17: prove a mano su iPhone Safari, VoiceOver, NVDA, Firefox e Safari desktop.
- Review indipendente (`adversarial-review`) non lanciata: con `review.mode: plan` si offre e non parte da sola.
