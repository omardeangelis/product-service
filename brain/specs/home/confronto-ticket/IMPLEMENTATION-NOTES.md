---
domain: home
type: implementation-notes
spec: confronto-ticket
links:
  - "[[specs/home/confronto-ticket/SPEC]]"
  - "[[specs/home/confronto-ticket/PLAN]]"
ingested: false
last_ingested: null
created: 2026-11-14
updated: 2026-11-15
---

# Implementation Notes

## Summary

- Sezione 03 in produzione: sopra 760 px la board animata dei tre sprint (3/1/0/0 ticket in produzione), fino a 760 px la vista statica "Stesso ticket". Prototipo e rotta del lab cancellati. Restano le prove di Omar sul dispositivo (T8).

## Execution Mode

- Mode: sequential (i compiti sono quasi tutti in catena; T3 e T5 sono gli unici paralleli e T5 è una modifica di due righe).
- Delegation: supervised (`brain.config.json`). Worker per `complexity`: medium → sonnet, high → modello dell'orchestratore, low → haiku.
- Escalations: nessuna finora.

## Deviations From the Plan

- T9 fatto prima di T8, su richiesta di Omar: il lab non serve più come riferimento, perché le prove di T8 si fanno sulla home. Se T8 trova un problema, si corregge su `Confronto.astro`.
- T7c e T7d aggiunti dopo il piano, su scelte di Omar (freelancer con un ticket in produzione; vista statica sotto 760 px). La domanda 4 della spec (board densa sotto 760 px) è chiusa dalla vista statica, quindi le soglie di T8 sulla board a 375 px non si applicano più.

- D6 cambiata da Omar: lo spostamento è a `--dur-swap` (400 ms), non `--dur-ui`. Compito T7b aggiunto al piano; gli spostamenti dello stesso ticket a 2 giorni ora si sovrappongono, e il FLIP interrompibile li gestisce.

- T2: due regole CSS in più rispetto al prototipo, solo per le celle strette. Sotto 760 px gli stati dei ticket vanno a capo con `hyphens: auto` e `overflow-wrap: anywhere` come i titoli (a 320 px "Prossimo" e "assegnato" uscivano di 1 px dal ticket). Sotto 360 px i ticket in produzione hanno `padding-top: 10px`, perché la spunta nell'angolo copriva la fine di "Export". A 375 px non cambia niente.
- T3: `ms()` legge l'unità del token. Il CSS minificato scrive `--dur-ui: 250ms` come `.25s`, e il `parseFloat` del prototipo dava 0,25 ms: nel lab ogni animazione WAAPI durava meno di un millisecondo. Ogni durata ora è quella dei token.
- T3: `reserve()` misura con `getBoundingClientRect().height` e non con `offsetHeight`: l'arrotondamento lasciava crescere le corsie di 0,1–0,4 px a 375 px.

## Surprises and Decisions

- Attributi di presenza: Astro scrive `data-shipped={true}` come `data-shipped="true"`. Il componente usa `? '' : undefined` e lo script `hasAttribute`/`toggleAttribute`.
- Il bug di `ms()` vale anche per il prototipo in `src/lab/confronto/util.ts`: quello che Omar ha visto nel lab aveva spostamenti e spunte quasi istantanei. Il feel-check di T7 è la prima volta che si vedono le durate vere (250 ms per lo spostamento, 400 ms per la prima spunta).
- La FAQ "E se ho un'urgenza mentre stai lavorando ad altro?" in home dice che la priorità "puoi cambiarla in qualsiasi momento sulla board". È in tensione con "priorità decise a ogni sprint" (AC3). Le FAQ sono fuori scope (Non-Goals): la scelta va a Omar.
- Pre-task `design-engineer` per T3/T4 non rilanciato: tutti i valori di motion erano già decisi nel piano (D5–D14) dallo stesso advisor, e i compiti non aprivano decisioni nuove.

## Sanity Checks

| Check | Result | Notes |
|------|--------|-------|
| `node --experimental-strip-types t1-check.mts` (scratchpad) | pass | AC4, AC5, AC6 sul modulo dati |
| `npm run build` + `t2-check.mjs` (scratchpad, su `dist/index.html`) | pass | struttura, testi, stato finale, bottone `hidden` |
| build con `guaranteeDays = 12` | fallisce come previsto | messaggio con `GUARANTEE.days`; valore ripristinato |
| `agent-browser`, `dist/` senza script, 320/375/760/1280/1440 | pass dopo le correzioni a 320 | overflow, contrasto (min 5.15:1), sottotitolo, padding, albero di accessibilità |
| `agent-browser` `t3-red.js` a 1280 e 375 | pass | giro dal giorno 0 allo stato finale |
| `agent-browser` tab nascosta simulata (+3000 ms al rAF) | pass | il giorno avanza al massimo di 100 ms |
| `grep -o "demo settimanali" dist/index.html` | 3 | AC3 |

## Acceptance Criteria Status

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC1 | met | `t2-check.mjs`; sottotitolo a 2 righe con 6 parole sull'ultima sopra 760 px |
| AC2 | met | colonne, corsie, conteggi, contatore e barra; nessun "giorn" nella sezione |
| AC3 | met, con una tensione da decidere | "demo settimanali" 3 volte; la FAQ sull'urgenza dice che la priorità si cambia "in qualsiasi momento" |
| AC4 | met | `t1-check.mts` e `t3-red.js` (stati del giorno 0 nel browser) |
| AC5 | met | build fallita con `guaranteeDays = 12`, messaggio su `GUARANTEE.days`; G 5–8 provati sul modulo |
| AC6 | met | `t1-check.mts`, `t2-check.mjs`, fine del giro nel browser |
| AC7 | met | soglia, contatore, giro unico con replay prima della soglia, tab nascosta simulata |
| AC8 | met | altezze costanti a ogni frame a 1280/760/375 (worker T3) e a 375 dopo un cambio di larghezza (worker T4) |
| AC9 | met | replay ×3 a metà giro: 7 ticket, conteggi giusti |
| AC10 | met | all'avvio e acceso a metà giro (1,8 s e 4,1 s): stato finale, nessuna animazione |
| AC11 | met | copia di `dist/` senza script a 5 larghezze |
| AC12 | met | 1280 → 375 a metà giro: stato finale, 0 ticket fuori cella |
| AC13 | met | con lo spostamento a 400 ms: 4720–4733 ms (1280), 4724–4749 ms (375), tre giri ciascuno |
| AC14 | met in Chromium | albero di accessibilità a 1280 e 375; VoiceOver è in T8 (Omar) |
| AC15 | met | Tab, focus visibile, Invio e Spazio, nome a 375, 37×39,5 px |
| AC16 | met | contrasto minimo 5.15:1 a 5 larghezze |
| AC17 | met in Chromium | fino a 760 px solo la vista statica, sopra solo la board; nessuno scorrimento a 320/375/768/1280; iPhone Safari è in T8 (Omar) |
| AC18 | met in Chromium | T7d: i quattro esiti, tappe e colori a 375 e 320 px, 0 animazioni; "nello sprint N" al posto di "al giorno N" del lab (AC2) |

## Out of Scope Observations

## Remaining Work

- T7: feel-check rallentato al 10–25% non fatto (strumento non disponibile); Omar ha scelto 400 ms guardando la board a velocità piena.
- T8: prove di Omar su iPhone Safari a 375/320 (vista statica), iPad in verticale (board), VoiceOver.
- Review indipendente (`adversarial-review`): con `review.mode: plan` non parte da sola, si offre.

## Steering

| Date | Feedback | Changes |
|------|----------|---------|
| 2026-11-14 | "400ms essendo un componente grande usiamo la regola di movimenti più lenti" | T7b: spostamento, ritardo della spunta e conteggio a `--dur-swap`; motion.md, SPEC e PLAN aggiornati |
| 2026-11-14 | "darei almeno al freelance il completamento di 1 task" | T7c: il freelancer va in produzione il giorno 27; AC6 e Scenario della spec aggiornati; AC13 e AC8 rimisurati |
| 2026-11-14 | Mobile: "userei un'immagine statica… troppe cose che si muovono" | Tre versioni statiche nel lab (`/lab/confronto`): Tabellone, Ritmo, Stesso ticket. Scelta: Stesso ticket (riga sotto) |
| 2026-11-14 | "stesso ticket" (scelta tra le tre viste statiche del lab) | T7d: fino a 760 px la vista statica "Stesso ticket" al posto della board (AC18); AC1, AC7, AC8, AC12, AC14–AC17 e motion brief aggiornati nella spec; lab ridotto alla vista scelta |
