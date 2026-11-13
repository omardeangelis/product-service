---
domain: home
type: implementation-notes
spec: clienti-muro
links:
  - "[[specs/home/clienti-muro/SPEC]]"
ingested: false
last_ingested: null
created: 2026-11-13
updated: 2026-11-13
---

# Implementation Notes

## Summary

- T1, T2, T3 e T4 fatti e verificati. T5 è fatto in parte e aspetta T0, cioè le righe vere di Omar: finché nessun cliente è confermato la sezione non compare in home. T6 è di Omar. T7 è fatto: screenshot in radice, prototipo `src/lab/` e rotta `/lab` cancellati (il prototipo su richiesta di Omar, prima di T6).

## Execution Mode

- Mode: sequential (le ondate del piano sono catene T1 → T2 → T3; T4 è minuscolo).
- Delegation: supervised (`execution.delegation`), un worker per compito sul tier della `complexity`.
- Escalations: nessuna. T1 sonnet, T2 sonnet, T3 sul tier high (modello del supervisore), T4 haiku; tutti passati alla prima review.

## Surprises and Decisions

- 2026-11-13: Omar ha dato l'OK a cancellare `loghi-01-top.png` e `loghi-02-section.png` in radice (D18): cancellati subito, sono screenshot di lavoro e non toccano il prototipo.
- RED di T1/T2: `dist/index.html` (build precedente) non contiene "Hanno scelto un Product Engineer" (0 occorrenze).

## Deviations From the Plan

- **AC14, sotto i 260 px l'elenco ha una colonna sola** (la spec dice 2 colonne fino a 760 px). A 280 px con zoom 1.25× (224 px CSS) "caso studio →", che non va a capo, spingeva la colonna di destra a 1 px dal bordo della sezione, e il contorno del focus veniva tagliato (AC10). Da 260 px in su restano 2 colonne. È una correzione banale del supervisore, in `src/components/Clienti.astro`.
- **Verifiche con dati di prova:** T2, T3 e parte di T5 sono state verificate con tutti i clienti confermati per prova. Il file `src/data/clienti.ts` è stato salvato in scratchpad e poi ripristinato byte per byte; la build finale non contiene la sezione.

## Sanity Checks

| Check | Result | Notes |
|------|--------|-------|
| `npm run build` (dati veri) | pass | 8 pagine; `dist/index.html` senza sezione clienti (nessuno confermato); `dist/` senza `lab` |
| Build con casi limite di T1 | pass | cliente mancante → build fallisce col nome; bozza → niente link |
| agent-browser: layout a 224–1440 px e 844×390 | pass | dopo la correzione sotto i 260 px |
| agent-browser: scatti, rAF fuori schermo, mouse, tastiera, Back, reduced motion | pass | vedi log di T3 in PLAN |
| Touch | pass solo con eventi sintetici | il touch vero resta a T6 (iPhone) |

## Acceptance Criteria Status

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC1 | met | regione col nome del titolo, tra hero e "Per chi" |
| AC2 | met in parte | etichetta "Clienti", nessuna riga a destra, "caso studio →"; le righe vere arrivano con T0 |
| AC3 | met | tutte le schermate sono lavoro di Omar (sua conferma); nota per schermata tolta |
| AC4 | met | 4 clienti; Valueize "caso studio →". SeVedemo tolto (prodotto di Omar, non cliente): il ramo "N casi studio ↓" resta nel codice ma oggi non si vede |
| AC5 | met | bozza → niente link (T1) |
| AC6 | met | nessun cliente non confermato compare; oggi la sezione è vuota e non si renderizza |
| AC7 | met | contrasto minimo 6.11:1 in ogni stato acceso |
| AC8 | met | |
| AC9 | met con eventi sintetici | prova su iPhone in T6 |
| AC10 | met | |
| AC11 | met | |
| AC12 | met | paint flashing e CPU 4× ancora da fare in T5 |
| AC13 | met | `data-armed` solo da script |
| AC14 | met | con la deviazione sotto i 260 px |
| AC15 | met in parte | parte automatica; screen reader in T6 |

- **T0 chiuso (2026-11-13):** righe date da Omar, tutti i clienti confermati, nota per schermata tolta su sua indicazione. La sezione ora compare in home.
- **D13 cambiato:** `widths` 400/720 e `sizes` 300px/450px, perché la 600w era sfocata sotto la prospettiva.
- **Bug di forma (trovato da Omar):** l'attributo `height="450"` di `<Image>` vinceva sull'`aspect-ratio: 16/10`, e le schermate uscivano 300×450 (verticali) invece di 300×188 come nel prototipo. Corretto con `height: auto` sull'`img`; verificato 300×188 a 1440 e 200×125 a 390, uguale a `/lab/loghi`.

## Out of Scope Observations

- `#problema` in home causa scorrimento orizzontale sotto i 280 px CSS (`.tabs-list` larga 256 px): è preesistente e non riguarda questa spec.
- Nel pannello browser dell'app nascosto, IntersectionObserver e rAF non girano: le verifiche di motion sono state fatte con agent-browser headless.

## Remaining Work

- **SeVedemo:** tolto dalla sezione il 2026-11-13 (è un prodotto di Omar, non un cliente). Resta in `CLIENTI` con `confirmed: false` solo per il controllo D19 sui suoi 3 casi studio. Il tema "prodotti" si apre più avanti con una spec sua.
- **T5:** verifica con i dati veri, più paint flashing, CPU 4×, rete lenta e il controllo della sincronia degli scatti.
- **T6:** fatto da Omar il 2026-11-13, prove passate.
- Spec ancora `draft`: va a `implemented` quando T5 è chiuso.

## Steering

| Date | Feedback | Changes |
|------|----------|---------|
| 2026-11-13 | "Implementa e sì ti do i permessi per cancellare i loghi" | avvio di implement-spec; screenshot in radice cancellati |
| 2026-11-13 | "Basta con le note… Metti in tutti Product Engineer tranne Valueize e SeVedemo: team" | righe confermate, campo `work` tolto, sezione visibile in home |
| 2026-11-13 | "le immagini avevano un'altra forma" | `height: auto` sull'img: schermate di nuovo 16:10 come nel prototipo |
| 2026-11-13 | "Togli SeVedemo, è un mio prodotto non un mio cliente" | SeVedemo `confirmed: false`: 4 clienti in home |
