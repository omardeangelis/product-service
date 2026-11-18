---
domain: showcase
type: implementation-notes
spec: cta-articoli
links:
  - "[[specs/showcase/cta-articoli/SPEC]]"
ingested: false
last_ingested: null
created: 2026-11-17
updated: 2026-11-18
---

# Implementation Notes

## Summary

- T1–T7 completati il 2026-11-17, in sequenza.
  - In fondo alle 6 release c'è la Firma, con la foto di Omar.
  - A metà corpo c'è un solo banner Partner o Team, deciso in build: oggi P, T, P, T, P, T dalla release più vecchia.
  - Banner e Firma entrano con un'entrata armata e senza JavaScript restano visibili.
  - Il pulsante flottante sparisce mentre la Firma è in vista.
- T8 fatto il 2026-11-18: Omar ha chiesto di cancellare il prototipo e committare tutto prima del deploy. `src/lab/` e la rotta `/lab/[slug]` non ci sono più; la spec è `implemented` e il piano `Complete`.
- D11 chiusa il 2026-11-18: Omar tiene la salita del banner (24 px, 700 ms).
- Commit fatto il 2026-11-18, su richiesta di Omar, insieme alla pulizia di T8.

## Execution Mode

- **Mode:** sequential. Lo impone D14: i task condividono `dist/` e alcune prove cambiano config e contenuti.
- **Delegation:** supervised, con questa corrispondenza: `low` → haiku, `medium` → sonnet, `high` → modello dell'orchestratore.
  - Le validazioni nel browser le ha fatte l'orchestratore.
  - T1 (foto e una riga di config) e T7 (solo verifica) li ha fatti l'orchestratore, senza worker.
- **Worker:**
  - haiku per T2, T4 e T6;
  - sonnet per T3 e T5.
- **Escalations:** nessuna. Ogni task ha passato la prima revisione. L'unica correzione è stata banale: T4 aveva una riga `</content>` di troppo in fondo a `Firma.astro`, che l'orchestratore ha tolto.
- **Advisor:** `design-engineer` non è stato richiamato prima di T5 e T6. I valori di motion erano già suoi e fissati nel piano (D8–D11).
- **Review:** `review.mode` è `plan`, quindi `adversarial-review` non parte da sola. Va offerta.

## Deviations From the Plan

- **T1, foto.** Omar non ha salvato l'originale nel repo.
  - La foto era già in `~/Downloads/profile-image.jpeg`: 800×800, la stessa mandata in chat.
  - L'orchestratore l'ha ritagliata da lì: un quadrato di 160 px da (531, 308), più stretto dei 200 px di D6, così il viso viene più grande nel cerchio da 48 px. Poi l'ha portata a 192×192.
  - L'originale non è mai entrato nel repo e resta in Downloads.
- **T5, nome della keyframe.** La keyframe della Firma si chiama `firma-fade` invece di `cta-fade`. Così due componenti non definiscono due keyframe globali con lo stesso nome.
- **T4, release temporanea.** Non è servita: beautiful-ui ha un caso studio pubblicato (`offerte-ai`) e le altre 5 no, quindi le 6 release vere coprono già entrambi i link secondari.
- **T8, prima del deploy.** D15 voleva la pulizia dopo il deploy confermato; Omar l'ha chiesta prima, insieme al commit di tutto il lavoro. Il prototipo non serve più: i valori sono nel codice e le schermate in `verifica/`.
- **T7, stringhe del feed.** «Pausa e disdetta» compare una volta in `/llms.txt`, ma è la riga dei prezzi già su `main` (`src/pages/llms.txt.ts:29`), non il banner. Per i testi del banner il controllo usa le frasi intere: «il codice è tuo dal primo giorno» e «valida uno sprint per volta». Nessuna delle due compare.

## Surprises and Decisions

- **L'espressione del corpo** `{parti && piano ? <>…</> : <Content />}` in `[slug].astro` deve stare su una riga sola. Se la si spezza, Astro mette spazi bianchi attorno al banner e il corpo non è più identico a quello di `<Content />`. Il vincolo è scritto nel commento in testa al file.
- **Ricaricando con l'ancora** `#pulizia-e-sinonimi`, il banner è nascosto dal primo paint ed entra appena è in vista. Non c'è un lampo da visibile a nascosto, perché lo script inline arma `<main>` prima che il corpo venga letto.

## Sanity Checks

| Check | Result | Notes |
|------|--------|-------|
| `sips -g pixelWidth -g pixelHeight public/firma/omar.jpg` | 192×192 | T1 |
| `scratchpad/red/t2.mjs` (Node 26) | `T2 OK` | T2: divisione, turni, input non mutato |
| `npm run build` + `scratchpad/red/t3.mjs` | `T3 OK` | Dopo T3, T4, T5, T6 e T7. Corpo senza `aside` identico byte per byte al confronto salvato prima di T3 |
| `t3.mjs … team` con `SLOTS.taken = 2` | `T3 OK` | Tutte Team; `shasum` di config e contenuti identico dopo |
| Release temporanea a un titolo | nessun `aside`, turni invariati | `shasum` identico dopo |
| Release temporanea con `./x.jpg` (file vero) | build ferma con il messaggio di D2 | `shasum` identico dopo |
| `npm run build` + `scratchpad/red/t4.mjs` | `T4 OK` | Dopo T4, T5, T6 e T7 |
| `agent-browser`: stili, margini, albero di accessibilità a 1440 px | ok | T3 e T4 |
| `agent-browser`: entrate, ricarica, ancora, bfcache, al 10%, reduced motion, JS spento, release corta | ok | T5 |
| `agent-browser`: flottante a 1440, 375 e 280 px, ricarica in fondo, `/` e `/pricing` | ok | T6 |
| `agent-browser`: 6 release × 7 larghezze × 1× e 1,25× | 84/84 senza overflow o tagli | T7 |
| `rm -rf dist && npm run build` | passa | T7 |
| Console sulle 6 release | nessun errore | T7 |
| `grep` su `dist/rss.xml` e `dist/llms.txt` | nessuna frase dei banner | T7 |
| `npm run build` dopo la pulizia, `grep -rn "src/lab\|/lab/" src` | passa, nessun risultato | T8 |

## Acceptance Criteria Status

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC1 | met | Firma al posto di `.ar-cta` sulle 6 release, testi esatti; link secondario verso il caso studio su beautiful-ui, «Altri articoli» sulle altre |
| AC2 | met | `alt=""`, la foto non è nell'albero di accessibilità; il nome si legge una volta nella Firma; foto 192 px per un cerchio da 48 |
| AC3 | met | Un solo `aside` per release, con punto, testo e «Prenota →» verso Cal in una scheda nuova |
| AC4 | met | Testi esatti con 2.200 € e 5.000 € presi da `config.ts` |
| AC5 | met | P, T, P, T, P, T dalla più vecchia; slot finiti → tutte Team; una release a un titolo salta il turno; `assegnaPiani` provato anche con una release aggiunta in fondo |
| AC6 | met | `complementary "Piano Partner"` o `"Piano Team"`; `lang="it"` sul banner della release inglese |
| AC7 | met | Prima del titolo ⌊N/2⌋+1 (Jev: «Pulizia e sinonimi»), 36 px sopra e sotto, `h2` seguente a `margin-top` 0 |
| AC8 | met | Bottone bianco senza sottolineatura; i link del Markdown restano accent e sottolineati |
| AC9 | met | 84 misure da 224 a 1440 px CSS senza overflow né tagli; a capo fino a 600 px, rientro di 22 px |
| AC10 | met | Con JS spento non c'è `data-armed`, banner e Firma restano a `opacity` 1 e i link funzionano |
| AC11 | met | Valori del motion brief misurati; con reduced motion il banner fa solo la dissolvenza e la Firma resta identica. `.cta-go:active` senza scala con reduced motion: verificato solo nel CSS, perché `:active` non si simula |
| AC12 | met | Il flottante sparisce sulla Firma e ricompare sopra; non copre mai il bottone a 1440, 375 e 280 px; non compare ricaricando in fondo |

## Pre-existing Issues

- **`.float-cta` con reduced motion.** In `src/styles/global.css:131-140` non ha una regola per `prefers-reduced-motion`. Con reduced motion entra ed esce scorrendo di 90 px, contro la regola del repo («ogni animazione rispetta `prefers-reduced-motion`»).
  - Lo aveva segnalato `design-engineer` in create-plan.
  - AC12 riusa quella transizione, quindi sulle release il pulsante si muove più spesso.
  - Il problema c'era già prima di questa spec.
  - **Corretto il 2026-11-18, su richiesta di Omar.** Nuova regola in `global.css`: con reduced motion il pulsante resta al suo posto (`translateX(-50%)`) e compare o sparisce solo in dissolvenza, `opacity` `--dur-swap` `linear`, come `.reveal`. Verificato nel browser: con reduced motion il `transform` resta 0 sia nascosto sia visibile e la transizione riguarda solo `opacity` e `box-shadow`; senza reduced motion tutto come prima (90 px, 500 ms).

## Out of Scope Observations

- Nessuna.

## Remaining Work

- Nessuno. Da offrire: `docs-maintenance` per portare la spec nel dominio showcase, e `adversarial-review` (non parte da sola, `review.mode` è `plan`).
