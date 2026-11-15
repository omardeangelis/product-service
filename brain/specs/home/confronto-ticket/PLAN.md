---
domain: home
type: plan
links: ["[[specs/home/confronto-ticket/SPEC]]", "[[chore/motion]]", "[[specs/home/clienti-muro/PLAN]]"]
created: 2026-11-14
updated: 2026-11-15
---

# Plan: Sezione confronto in home ("Ticket")

Contratto: [[specs/home/confronto-ticket/SPEC]] (AC1–AC18). Nessun `FLOW.md`, perché sul prototipo non hanno girato review UX/UI. Il prototipo `src/lab/confronto/` (`/lab/confronto`, solo dev) è stato cancellato in T9.

## Situazione iniziale

- In home, `#confronto` (`src/pages/index.astro:218-286`) è una tabella da scorrere. I suoi stili sono in `index.astro:766-810` (`.compare*`, `.mark-yes`, `.mark-no`, `.compare-hint`), più due regole nelle media query (`:1006` `.compare-hint{display:block}`, `:1012` `.compare .col.featured{transform:none}`). Il padding delle sezioni (`section{padding:104px 0}`, `:531`; 72 px sotto 900 px, `:1009-1010`) è scoped a `index.astro`. La nav ci porta con `/#confronto` (`src/layouts/Base.astro:54`).
- Il prototipo approvato è composto da:
  - `src/lab/confronto/Ticket.astro`: markup, CSS e seed in un `<template>`;
  - `ticket.ts`: scenario (`EVENTS`), simulazione, FLIP e riserva delle altezze;
  - `util.ts`: `token`, `ms`, `onEnter`, `swapIn`, `reduced`;
  - `Harness.astro`: il contesto attorno.
- La rotta `/lab/[slug]` è aggiunta in dev da `src/prototypes/integration.mjs:55-56`. È una modifica non committata di questa sessione, insieme a `src/lab/Lab.astro`.
- Il modello di sezione con script è `src/components/Clienti.astro`: lo script `is:inline` arma la sezione subito dopo il markup (riga 116), e la logica sta in `src/scripts/clienti.ts`. Il reveal del sito (`Base.astro:86-99`) osserva i `.reveal` presenti quando gira il suo script.
- `GUARANTEE` (`src/config.ts:5-12`): `days` vale 5. `short` è usato solo nella tabella. `label` è usato anche in home (riga 460), in pricing e in termini.
- Non ci sono test runner, lint o typecheck. L'unico gate è `npm run build`.
- Backlog: nessun tracker collegato al repo. Per questo ogni compito ha `backlog_item_id: none` e `relation_mode: none`, fuori dall'enum dello schema (`native | body-links`): deviazione accettata, come in clienti-muro.

## Problema

Portare in produzione la board approvata al posto della tabella, con tre aggiunte:
- quello che la spec chiede oltre il prototipo: stato finale senza JS, giorno della garanzia da config, contrasto, semantica della tabella, demo settimanali in 02 e nei Prezzi;
- le tre correzioni di motion di `design-engineer`: 150 ms per giorno, spostamento a `--dur-ui`, tempo fermo con la tab nascosta;
- i casi limite (reduced motion o larghezza che cambiano a metà giro, replay prima della soglia).

Poi va cancellato il prototipo.

## Forma della soluzione

1. **Un modulo dati dello scenario.** Contiene colonne, corsie, stati iniziali ed eventi, con il primo deploy legato a `GUARANTEE.days`. Una funzione pura ne ricava lo stato a un dato giorno. La stessa fonte serve l'HTML statico (stato finale) e lo script (simulazione).
2. **Un componente di sezione `.astro`**, senza JS di framework, con il markup e il CSS del prototipo, le correzioni della spec e lo stato finale scritto nell'HTML. Va montato in home al posto della tabella.
3. **Uno script vanilla** che porta `ticket.ts`. Uno script `is:inline` riporta la board al giorno 0 prima del primo paint. La simulazione parte alla soglia, una volta, con il tempo che si ferma con la tab nascosta, e copre i casi limite.
4. **I testi di 02 e dei Prezzi**, poi le deviazioni in [[chore/motion]], la verifica nel browser, le prove di Omar sul dispositivo e infine la cancellazione del prototipo.

## Registro delle decisioni

| # | Decisione | Fonte |
|---|---|---|
| D1 | Le demo settimanali fanno parte dell'offerta. In home la scheda 02 "Definiamo le priorità" diventa "Board condivisa, demo settimanali e update async su Slack. Ti aiuto a scegliere <em>cosa</em> costruire, non solo a costruirlo." La lista dei Prezzi (riga 399) diventa "Board condivisa, demo settimanali e update async su Slack" | Omar (domanda 3); formulazione proposta, Omar può cambiarla in review |
| D2 | Sotto la board la riga "Scenario tipico: tempi medi di partenza, non un cliente reale." | Omar (domanda 5) |
| D3 | La corsia si chiama "Agenzia", senza sottotitolo | Omar (domanda 6) |
| D4 | Si tengono tutti i pezzi forti della home. In [[chore/motion]] si registra l'eccezione per la board e si corregge il conteggio: la riga 19 nomina due pezzi forti, la riga 48 chiama "secondo" la parete clienti. La riscrittura della regola proposta da `design-engineer` ("al massimo un pezzo forte attivo per sezione visibile") non si applica: è registrata come proposta per Omar | Omar (domanda 2); design-engineer |
| D5 | 150 ms per giorno lavorativo: 4,5 s di simulazione, ultimo scambio a 4,75 s. Nessun controllo di pausa | design-engineer (domanda 1, AC13) |
| D6 | Spostamento FLIP a `--dur-ui` (250 ms) con `--ease-in-out`, interrompibile: si misura la posizione di partenza, si annullano le animazioni del ticket, si sposta il nodo, si misura e si anima. Omar conferma 250 ms contro 400 ms nel feel-check (T7). **Aggiornata il 2026-11-14: Omar sceglie 400 ms (`--dur-swap`), "essendo un componente grande"; spunta e conteggio seguono lo spostamento (ritardo 240 ms, conteggio a 400 ms) (T7b)** | design-engineer; Omar |
| D7 | La spunta del deploy parte dopo un ritardo di 0.6 × la durata dello spostamento. Il conteggio "N in produzione" si aggiorna alla fine dello spostamento | design-engineer |
| D8 | Il tempo avanza a passi di frame limitati a 100 ms (`elapsed += Math.min(now - last, 100)`), senza listener su `visibilitychange`. Uscire dallo schermo non mette in pausa | design-engineer (AC7) |
| D9 | L'HTML statico mostra lo stato finale con "Sprint 3", tutti i segmenti accesi e pieni, e "Rivedi gli sprint" con `hidden` (AC11). Uno script `is:inline`, subito dopo la board: (1) toglie `hidden` al bottone; (2) se reduced motion è attivo, si ferma; (3) altrimenti porta la board al giorno 0 (ticket iniziali in "Da fare", conteggi a 0, "Sprint 1", segmenti vuoti e solo il primo acceso) | design-engineer |
| D10 | Il primo giro, da qualunque origine (soglia o replay), scollega l'osservatore. Con reduced motion all'avvio lo script non riporta la board al giorno 0 | design-engineer (AC7, AC10) |
| D11 | Se reduced motion si accende a metà giro, un listener `change` chiude il giro: annulla frame e timer, finisce le animazioni della sezione, applica gli eventi rimasti senza animare, **ricalcola il conteggio di tutte e quattro le corsie** (i timer dei conteggi annullati non devono lasciare "2 in produzione" accanto a tre ticket) e porta il contatore allo sprint 3. Se si spegne, non succede niente | design-engineer (AC10) |
| D12 | Un `ResizeObserver` sulla board reagisce solo ai cambi di **larghezza**: la barra di Safari che si chiude scrollando non lo attiva. Durante il giro chiude il giro come in D11; poi, a giro fermo, ricalcola la riserva delle altezze alla nuova larghezza | design-engineer (AC12) |
| D13 | Intestazione della sezione visibile senza JS. Uno script `is:inline` subito dopo `.section-head` le aggiunge `.reveal`, così il reveal del sito la prende. La board non ha un'entrata: la simulazione è la sua entrata | design-engineer |
| D14 | "Rivedi gli sprint": la transizione di `transform` (`--dur-press` / `--ease-press`) sta sulla regola di base, non solo su `:active`. Il bordo in hover è attivo solo con `(hover: hover) and (pointer: fine)`. Il ritorno al giorno 0 è un taglio netto | design-engineer (AC15) |
| D15 | Contrasto: le etichette "Sprint N" e "0 in produzione" passano da `#a5aab5` a `var(--muted)`. Lo stato attivo resta riconoscibile perché passa all'inchiostro | AC16, design-engineer |
| D16 | Semantica: l'intestazione d'angolo della board ha un testo solo per screen reader ("Modo di lavorare"), non è vuota. Sotto 760 px si nasconde con una classe `sr-only` definita nel componente (il repo non ne ha una), **mai con `display:none`**: il prototipo (`Ticket.astro:311-313`) la toglie dall'albero di accessibilità, e allora la riga d'intestazione ha 4 colonne contro le 5 delle corsie. Il contatore non è una regione live | AC14, gate del piano |
| D17 | Il giorno del primo deploy viene da `GUARANTEE.days` (G). Gli eventi del primo ticket del Product Engineer sono: "In corso" al giorno 1, "In review" al giorno G−2, "In produzione" al giorno G, nuovo "Export PDF" al giorno G+1. La build fallisce con un messaggio chiaro se G non è tra 5 e 8: sotto 5 due spostamenti dello stesso ticket distano meno di 2 giorni (si sovrappongono, vedi D6); sopra 8 il nuovo ticket compare meno di 2 giorni prima di spostarsi al giorno 11. Dopo il calcolo `EVENTS` si ordina per giorno (ordinamento stabile): il ciclo della simulazione li consuma in ordine | AC5, gate del piano |
| D18 | Nessun test runner nuovo. Il RED di ogni compito è un controllo che fallisce su `dist/` (dopo `npm run build`) o nel browser con `agent-browser` | Repo: niente test configurati (come in clienti-muro D16) |
| D19 | Si cancellano `src/lab/` e le due righe della rotta `/lab/[slug]` in `src/prototypes/integration.mjs`, che tornano com'erano all'ultimo commit | Hard Rule 5 di prototype |
| D20 | `GUARANTEE.short` si toglie da `src/config.ts`. Il commento su `label` non cita più la "tabella confronto" | Technical Notes della spec |
| D21 | La riserva delle altezze delle corsie si calcola **all'armamento** (dopo il reset al giorno 0, in `initConfronto`), non all'inizio di `run()`, e di nuovo dopo un cambio di larghezza a giro fermo. Altrimenti, alla soglia, le corsie crescono e spingono giù la pagina proprio mentre chi legge guarda (AC8) | gate del piano |
| D22 | Il modulo dati importa `'../config.ts'` con l'estensione (come `src/prototypes/integration.mjs:3`): Node con `--experimental-strip-types` non risolve gli import senza estensione. Le funzioni sono pure e prendono i giorni della garanzia come argomento, così uno script le prova con qualunque G | gate del piano |
| D23 | `Confronto.astro` imposta da sé `padding-bottom` 104 px (72 px fino a 900 px): il `section{padding}` della home è scoped a `index.astro` e non arriva al componente (come `Clienti.astro:139`) | gate del piano |

**Assunzioni:**
- "Pricing" nella risposta di Omar vuol dire la lista dei Prezzi in home. `src/pages/pricing.astro` ("Canale Slack condiviso") e `src/pages/benvenuto.astro` ("zero meeting inutili") non cambiano. Da confermare in review del piano.
- Con un sottotitolo vuoto, la corsia "Agenzia" ha la stessa altezza minima delle altre sopra 760 px. Sotto 760 px i sottotitoli sono già nascosti.
- I ticket clonati dal `<template>` portano l'attributo di scope di Astro, perché il template è nel componente. Le regole `:global(.tk…)` del prototipo restano.

**Ancora aperta:** la riscrittura della regola dei pezzi forti in [[chore/motion]] (D4), che è una scelta di Omar e non blocca il lavoro.

## Cosa ho trovato nel codice

- `ticket.ts:117-126` misura la posizione di partenza senza annullare lo spostamento in corso. Con spostamenti a 2 giorni di distanza, il secondo parte mentre il primo è a circa il 75% (D6).
- `ticket.ts:185-187` calcola il giorno come `now - start`: con la tab nascosta, al ritorno tutti gli eventi rimasti partono nello stesso frame (D8).
- `ticket.ts:196-199`: il `resize` toglie la riserva anche quando si chiude la barra di Safari, cioè proprio mentre la board gira (D12).
- `ticket.ts:197` chiama `reset()` all'avvio anche con reduced motion, quindi la board mostra il giorno 0 finché non scatta la soglia (D10).
- Un replay premuto prima della soglia viene seguito da un secondo giro avviato dalla soglia (D10).
- `Ticket.astro:173-176`: la transizione di pressione è dichiarata solo su `:active`, quindi al rilascio il bottone scatta indietro (D14).
- `Ticket.astro:43`: nell'HTML i segmenti non hanno `data-on` (D9).
- `#a5aab5` su bianco misura 2.33:1 (D15).

## Ricerca esterna

Nessuna: è tutto CSS e JS vanilla su API stabili (`IntersectionObserver`, `ResizeObserver`, `matchMedia(...).addEventListener('change')`, WAAPI con `pseudoElement`, `Element.getAnimations`).

## Compiti

### T1: Modulo dati dello scenario

- **depends_on**: []
- **location**: `src/data/confronto.ts` (nuovo)
- **description**:
  - Esporta `SPRINTS` (3), `SPRINT_DAYS` (10), `MS_PER_DAY` (150, D5), `COLUMNS` ("Da fare", "In corso", "In review", "In produzione") e `LANES` nell'ordine pe, freelancer, agenzia, assunzione. Ogni corsia ha `key`, `name`, `sub` (vuoto per "Agenzia", D3) e `seedStatus` (AC4).
  - Esporta il seed: un ticket `ONB-142` "Nuovo onboarding" per corsia.
  - Esporta `buildEvents(days)`: gli eventi come nel Decision Log della spec, con quelli del primo ticket del Product Engineer calcolati da `days` (D17) e la lista ordinata per giorno. Se `days` non è tra 5 e 8, lancia un errore che nomina `GUARANTEE.days` e il motivo.
  - Esporta `EVENTS = buildEvents(GUARANTEE.days)`, con `import { GUARANTEE } from '../config.ts'` (D22).
  - Esporta una funzione pura `stateAt(day, events = EVENTS)`. Restituisce, per corsia, i ticket in ogni colonna (`id`, `code`, `title`, `status`, `warn`, `shipped`) e il conteggio "in produzione". `stateAt(30)` è lo stato finale di AC6.
  - I tipi sono esportati per lo script.
- **validation** (script usa e getta nello scratchpad, non nel repo, con `node --experimental-strip-types`):
  - `stateAt(30)` coincide con la tabella di AC6;
  - per ogni G da 5 a 8, `buildEvents(G)` è ordinata per giorno, e il primo ticket del Product Engineer è in produzione a `stateAt(G, buildEvents(G))` e non a `stateAt(G - 1, buildEvents(G))`;
  - `buildEvents(4)` e `buildEvents(9)` lanciano l'errore che nomina `GUARANTEE.days`;
  - `npm run build` passa (il modulo non è ancora importato: il controllo della build con G fuori intervallo è in T2).
- **status**: Done
- **log**: 2026-11-14 worker sonnet, review passata al primo giro. Controllo usa e getta `t1-check.mts` (stateAt(0)=AC4, stateAt(30)=AC6, G 5–8 ordinati e deploy al giorno G, 4 e 9 lanciano l'errore su GUARANTEE.days): `T1 OK`. `npm run build` verde.
- **files edited/created**: `src/data/confronto.ts` (nuovo)
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: lo script usa e getta stampa `stateAt(30)` uguale ad AC6. Oggi fallisce: il modulo non esiste.
- **review_mode**: cli
- **complexity**: medium

### T2: Sezione statica in home al posto della tabella

- **depends_on**: [T1]
- **location**: `src/components/Confronto.astro` (nuovo), `src/pages/index.astro` (righe 218-286 e stili 769-808), `src/config.ts`
- **description**:
  - Il componente porta il markup e il CSS di `src/lab/confronto/Ticket.astro` con queste modifiche:
    - `<section id="confronto" style="padding-top:0">` come oggi, con il padding inferiore impostato nel componente (D23);
    - intestazione di AC1 con il sottotitolo in `text-wrap: balance`, e lo script `is:inline` di D13 subito dopo `.section-head`;
    - la board con lo stato finale da `stateAt(30)`: ticket nelle celle finali, `data-shipped` e `data-warn` dove servono, "3 in produzione" con `data-some` sul Product Engineer, "Sprint 3", segmenti con `data-on` e riempimento pieno (D9);
    - "Rivedi gli sprint" con `hidden`;
    - il `<template>` del seed costruito dal modulo T1;
    - la riga di D2 sotto la board, in `var(--muted)`;
    - l'intestazione d'angolo di D16 (con `sr-only` sotto 760 px, non `display:none`), i colori di D15, "Agenzia" senza sottotitolo (D3);
    - i dati `data-sprints`, `data-sprint-days` e `data-guarantee` non servono più: lo script importa il modulo.
  - In `index.astro` il componente prende il posto della `<section id="confronto">`. Vanno tolti gli stili `.compare*`, `.mark-yes`, `.mark-no` e `.compare-hint` (righe 766-810, più le regole a 1006 e 1012), controllando con grep che nessun'altra parte della pagina li usi.
  - In `src/config.ts` si applica D20.
  - Niente script di simulazione in questo compito.
- **validation**:
  - `npm run build` passa;
  - con `guaranteeDays = 12` temporaneo in `src/config.ts`, la build fallisce e il messaggio nomina `GUARANTEE.days`. Ripristinare (AC5);
  - nella sezione di `dist/index.html` un grep di "giorn" non trova niente (AC2);
  - `dist/index.html` contiene "Diverso nel modello." e il sottotitolo di AC1, e non contiene più `class="compare"` né "Scorri per vedere";
  - nella colonna "In produzione" del Product Engineer ci sono Nuovo onboarding, Export PDF e Refactor billing, e "KPI-12" è in "Da fare";
  - con `agent-browser` e JavaScript disattivato, a 320, 375, 760, 1280 e 1440 px:
    - la sezione è visibile, la board è nello stato di AC6 e il bottone non c'è (AC11);
    - nessuno scorrimento orizzontale e nessun testo fuori dalla sua cella; a 320 e 375 px il riquadro della spunta non interseca quello del titolo del ticket (AC17);
    - ogni testo misura almeno 4.5:1 (AC16);
    - il sottotitolo sopra 760 px non lascia una parola sola sull'ultima riga (AC1);
  - a 1280 **e a 375 px** l'albero di accessibilità mostra la tabella "Board dei primi tre sprint" con cinque intestazioni di colonna (l'angolo "Modo di lavorare" più le quattro colonne), cinque celle per riga, e un'intestazione per corsia con il conteggio (AC14);
  - la sezione ha lo stesso padding inferiore della tabella di oggi: 104 px, e 72 px a 375 px (D23).
- **status**: Done
- **log**: 2026-11-14 worker sonnet; review dell'orchestratore con due correzioni banali a 320 px fatte direttamente (stati con `hyphens`/`overflow-wrap` come i titoli; sotto 360 px `padding-top: 10px` sui ticket in produzione, la spunta copriva "Export"). Prove: `t2-check.mjs` = `T2 OK`; build con `guaranteeDays = 12` fallisce con "GUARANTEE.days deve essere tra 5 e 8 (ora 12)…", ripristinata; grep `class="compare` e "Scorri per vedere" = 0. Browser (copia di `dist/` senza script, `agent-browser`) a 320/375/760/1280/1440: sezione visibile, nessuno scorrimento orizzontale, nessun testo fuori dal ticket, spunta che non copre il titolo, contrasto minimo 5.15:1, sottotitolo a 2 righe con 6 parole sull'ultima sopra 760 px, padding inferiore 104/72 px, bottone non visibile. Albero di accessibilità a 1280 e 375: tabella "Board dei primi tre sprint", 5 intestazioni ("Modo di lavorare" + 4), intestazione di riga con il conteggio.
- **files edited/created**: `src/components/Confronto.astro` (nuovo), `src/pages/index.astro`, `src/config.ts`
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: `dist/index.html` contiene il ticket "Refactor billing" dentro la colonna "In produzione" della corsia del Product Engineer. Oggi fallisce: c'è la tabella.
- **review_mode**: mixed
- **complexity**: medium

### T3: Simulazione: armamento, giro, FLIP

- **depends_on**: [T2]
- **location**: `src/scripts/confronto.ts` (nuovo), `src/components/Confronto.astro` (script `is:inline` dopo la board, `<script>` che importa `initConfronto`)
- **description**:
  - Script `is:inline` di D9 subito dopo `.board-card`.
  - `initConfronto(root)` porta `ticket.ts` usando il modulo T1 (niente eventi duplicati), con queste modifiche:
    - tempo a passi limitati (D8) a `MS_PER_DAY`;
    - FLIP interrompibile a `--dur-ui` / `--ease-in-out` (D6);
    - il ticket si compatta prima di partire verso "In produzione"; la riserva delle altezze per corsia si calcola all'armamento, non nel giro (D21);
    - spunta e conteggio come D7, con il primo deploy del Product Engineer a `--dur-swap` / `--ease-pop`;
    - scambio dello stato e del contatore con `swapIn`;
    - nuovo ticket da `opacity 0` e `scale(0.96)` a `--dur-ui` / `--ease-out`;
    - soglia al 35%, primo giro unico da qualunque origine (D10);
    - con reduced motion all'avvio, niente reset (D10), e il replay rimostra lo stato finale senza animare (AC10);
    - il replay riparte dal giorno 0 con un taglio netto (AC9).
  - Gli aiuti di `util.ts` che servono (`token`, `ms`, `swapIn`, `reduced`) passano in `src/scripts/` (o in un modulo di aiuti già esistente, se c'è). Si leggono i token, mai valori scritti a mano.
- **validation** (con `agent-browser`, a 375, 760 e 1280 px):
  - prima della soglia la board è al giorno 0 con i quattro stati iniziali di AC4, poi il contatore va da "Sprint 1" a "Sprint 3" e la board finisce nello stato di AC6 (AC7);
  - **dall'armamento** (prima della soglia) alla fine del giro, nessuna corsia e nemmeno la board cambiano altezza. Da misurare all'armamento, alla soglia e a ogni evento con `getBoundingClientRect` (AC8, D21);
  - l'ultima animazione della sezione finisce entro 5000 ms dal primo frame del giro: misurare con `document.getAnimations()` e i tempi `performance.now()` (AC13);
  - "Rivedi gli sprint" premuto a metà giro, e premuto tre volte di fila, finisce con tre ticket in produzione per il Product Engineer e nessun ticket doppio (AC9);
  - un replay premuto prima della soglia non viene seguito da un secondo giro alla soglia (AC7);
  - in `dist/index.html` lo script `is:inline` di D9 segue subito `.board-card`, senza niente di differito in mezzo: così il reset avviene prima del primo paint. Arrivando su `/#confronto`, il giro parte dal giorno 0;
  - con reduced motion emulato all'avvio, la board mostra subito lo stato finale e il replay non anima niente (AC10);
  - tab nascosta: si sostituisce `window.requestAnimationFrame` nella pagina in modo che una callback a metà giro riceva un timestamp spostato di +3000 ms. Il giorno avanza al massimo di 100 ms di tempo, non di 3 s, e non partono più eventi nello stesso frame (AC7). Headless il rAF non si ferma da solo, quindi la prova va forzata così;
  - nessun errore in console.
- **status**: Done
- **log**: 2026-11-14 worker sul modello dell'orchestratore (complexity high), review passata al primo giro. Il worker ha corretto `ms()`: il CSS minificato scrive `--dur-ui` come `.25s`, e il `parseFloat` del prototipo dava 0,25 ms (animazioni quasi istantanee anche nel lab). `reserve()` misura con `getBoundingClientRect` (offsetHeight arrotondava, +0,4 px a 375). Prove dell'orchestratore: RED `t3-red.js` pass a 1280 e 375 (prima: 0 in produzione, "Sprint 1", i 4 stati di AC4; dopo 5,2 s: 3, "Sprint 3", 7 ticket); in `dist/index.html` lo script inline segue subito `.board-card`; tab nascosta simulata (timestamp di rAF +3000 ms da 1,5 s): a 3 s la board è a "Sprint 2" con 2 ticket in produzione, non allo stato finale. Prove del worker: altezze di corsie e board costanti a ogni frame a 1280/760/375; ultima animazione a 4716 ms dal primo frame; reduced motion all'avvio = stato finale e replay senza animazioni nella sezione; replay ×3 a metà giro = 7 ticket e conteggi giusti; replay prima della soglia = un solo giro; console pulita.
- **files edited/created**: `src/scripts/confronto.ts` (nuovo), `src/components/Confronto.astro` (script inline e modulo)
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: a 1280 px, 5000 ms dopo l'ingresso della board nello schermo, la cella "In produzione" del Product Engineer contiene tre ticket e il contatore segna "Sprint 3". Prima del giro la stessa cella è vuota. Oggi fallisce: la board statica è già allo stato finale prima del giro.
- **review_mode**: browser
- **complexity**: high

### T4: Casi limite e bottone

- **depends_on**: [T3]
- **location**: `src/scripts/confronto.ts`, `src/components/Confronto.astro` (CSS del bottone)
- **description**:
  - Listener `change` su reduced motion (D11).
  - `ResizeObserver` solo sulla larghezza (D12).
  - Transizioni del bottone come D14.
  - Funzione di pulizia che scollega osservatori, listener, frame e timer.
- **validation** (con `agent-browser`):
  - con reduced motion acceso a metà giro, anche entro 250 ms da un deploy, la board passa subito allo stato di AC6, con i conteggi "3 in produzione" e "0 in produzione", senza animazioni in corso (`document.getAnimations()` vuoto per la sezione) (AC10, D11);
  - con la larghezza portata da 1280 a 375 px a metà giro, la board passa allo stato finale con i conteggi giusti e nessun ticket esce dalla sua cella. Il replay successivo rispetta AC8 a 375 px (AC12, D21);
  - una variazione solo di altezza della finestra a metà giro non interrompe il giro;
  - "Rivedi gli sprint" si raggiunge con Tab, ha il focus visibile, parte con Invio e con Spazio, ha nome accessibile "Rivedi gli sprint" a 375 px e misura almeno 24×24 px (AC15);
  - nessun errore in console.
- **status**: Done
- **log**: 2026-11-14 worker sonnet, review passata al primo giro. Prove dell'orchestratore: RED `t4-red.sh` pass con lo scambio a 1,8 s (board a "Sprint 2", 1 in produzione prima dello scambio) e a 4,1 s, sempre con 7 ticket, conteggi 3/0/0/0 e nessuna animazione in corso; larghezza da 1280 a 375 a metà giro = stato finale, conteggi giusti, 0 ticket fuori cella, nessuno scorrimento orizzontale; a 375 il bottone si chiama "Rivedi gli sprint" e misura 37×39,5 px. Prove del worker: replay a 375 dopo il cambio di larghezza con altezze costanti a ogni frame; cambio di sola altezza che non interrompe il giro; focus visibile (contorno 2 px), Invio e Spazio fanno ripartire. Caso limite annotato, non corretto: un cambio di larghezza nello stesso frame in cui la soglia ha messo in coda la partenza annulla la partenza (`reserve()` → `reset()` cancella quel rAF).
- **files edited/created**: `src/scripts/confronto.ts`, `src/components/Confronto.astro` (CSS di `.replay`)
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: con reduced motion emulato a metà giro, entro un frame la cella "In produzione" del Product Engineer ha tre ticket. Oggi fallisce: il giro continua.
- **review_mode**: browser
- **complexity**: medium

### T5: Demo settimanali in 02 e nei Prezzi

- **depends_on**: [T2]
- **location**: `src/pages/index.astro` (riga 194 e riga 399)
- **description**: applicare i due testi di D1. Nessun altro testo della home cambia. Con grep su `src/pages/index.astro`, controllare che nessuna frase smentisca le tre promesse del sottotitolo (AC3).
- **validation**: `npm run build` passa; `dist/index.html` contiene "demo settimanali" tre volte (sottotitolo, 02, Prezzi).
- **status**: Done
- **log**: 2026-11-14 worker haiku, review passata. `dist/index.html` contiene "demo settimanali" 3 volte (era 1). Grep su `index.astro`: la FAQ "E se ho un'urgenza…" (riga ~428) dice che la priorità "puoi cambiarla in qualsiasi momento sulla board", in tensione con "priorità decise a ogni sprint" (AC3); "0 meeting inutili" (riga 40) non contraddice. La FAQ non si tocca (Non-Goals): la tensione va a Omar.
- **files edited/created**: `src/pages/index.astro` (righe 195 e 333)
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: `dist/index.html` contiene "demo settimanali" tre volte. Dopo T2 ne contiene una sola.
- **review_mode**: cli
- **complexity**: low

### T6: Deviazioni in chore/motion

- **depends_on**: [T4, T7]
- **location**: `brain/chore/motion.md`
- **description**:
  - Sotto "Deviazioni volute", aggiungere:
    - la board del confronto: un racconto una volta per visita, al massimo 5 s, 150 ms per giorno lineari, eccezione al limite dei pezzi forti (D4);
    - `--ease-pop` sulla spunta del primo deploy, una volta per giro (da aggiungere anche agli usi ammessi alla riga 18);
    - la spunta da `scale(0.5)`: è un glifo di 18/14 px.
  - Correggere il conteggio dei pezzi forti tra la riga 19 e la riga 48 (D4), senza riscrivere la regola.
  - Sotto "Aperto": l'intestazione resa visibile senza JS da uno script inline che aggiunge `.reveal`, secondo esempio del modello dopo la parete clienti. Aggiungere anche la proposta di `design-engineer` di riscrivere la regola dei pezzi forti, come scelta di Omar.
  - Se in T7 Omar sceglie 400 ms per lo spostamento, va registrato qui anche lo spostamento con sovrapposizione (il cambio di codice è il compito T7b).
- **validation**: [[chore/motion]] nomina la board, `--ease-pop` sulla spunta e `scale(0.5)`, e il conteggio dei pezzi forti è coerente.
- **status**: Done
- **log**: 2026-11-14 worker haiku, testo dettato dall'orchestratore; review passata. Scritto prima della scelta di Omar su D6: se sceglie 400 ms va aggiunta la riga sullo spostamento con sovrapposizione (T7b). `grep -c "Board del confronto"` = 1; "secondo pezzo forte" non c'è più; conteggio dei pezzi forti coerente (quattro in home, eccezione registrata); proposta di `design-engineer` sotto Aperto.
- **files edited/created**: `brain/chore/motion.md`
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: grep "Confronto" in `brain/chore/motion.md` trova la deviazione. Oggi non trova niente.
- **review_mode**: cli
- **complexity**: low

### T7: Verifica nel browser e feel-check

- **depends_on**: [T4, T5]
- **location**: nessun file. I risultati vanno nel log del compito e in `IMPLEMENTATION-NOTES.md`
- **description**:
  - Verifica completa con `agent-browser` su `npm run build` + `npm run preview`: AC1–AC17 a 320, 375, 760, 1280 e 1440 px.
  - Feel-check:
    - rallentato con DevTools Animations al 10–25% (origini dello spostamento, la spunta che arriva quando il ticket atterra, nessun salto di layout);
    - a velocità piena;
    - con reduced motion emulato, anche acceso a metà giro;
    - arrivando su `/#confronto`.
  - Mostrare a Omar lo spostamento a 250 ms e, per confronto, a 400 ms, e annotare la sua scelta (D6). Se sceglie 400 ms, si aggiunge il compito T7b (cambio di durata in `src/scripts/confronto.ts` e nuova misura di AC13), che T6 e T8 attendono.
  - `npm run build` deve passare, e `test ! -e dist/lab` deve riuscire.
- **validation**: ogni AC ha una riga verificata (passa o fallisce, con prova) nel log; la scelta di Omar su D6 è annotata.
- **status**: Done
- **log**: 2026-11-14 verifica automatica dell'orchestratore (AC1–AC17, vedi i log di T2–T5 e T7b). Arrivo da pagina vuota su `/#confronto`: giorno 0 al primo screenshot ("Sprint 1", `data-armed`), "Sprint 2" a 2 s con uno spostamento in volo, stato di AC6 alla fine. Console senza errori; `test ! -e dist/lab` riesce. Feel-check: Omar ha guardato la board nel pannello del browser e ha scelto 400 ms (D6) → T7b. Il controllo rallentato al 10–25% non è stato fatto (DevTools non disponibile in `agent-browser`).
- **files edited/created**: nessuno
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: la riga AC13 del log riporta il tempo misurato dell'ultima animazione, sotto 5000 ms.
- **review_mode**: browser
- **complexity**: medium

### T7b: Spostamento a 400 ms

- **depends_on**: [T7]
- **location**: `src/scripts/confronto.ts`, `brain/chore/motion.md`
- **description**: scelta di Omar su D6. Lo spostamento FLIP, il ritardo della spunta (0.6 × lo spostamento) e il timer del conteggio passano da `--dur-ui` a `--dur-swap`. Nuova misura di AC13 e AC8. Riga in [[chore/motion]] sullo spostamento con sovrapposizione.
- **validation**: AC13 sotto 5000 ms a 1280 e 375; AC8 a 1280/760/375; RED di T3 e T4 ancora verdi.
- **status**: Done
- **log**: 2026-11-14 worker haiku per le tre righe, commento di `move()` scritto dall'orchestratore. AC13 (tre giri per larghezza, `Element.animate` strumentato): 4720–4733 ms a 1280, 4724–4749 ms a 375; ultima animazione lo scambio dello stato del giorno 30, nessun frame sopra 50 ms. La prima misura subito dopo la build aveva dato 5314/5879 ms con un caricamento lento (primo frame a 1000 ms dallo scroll): non ripetuta nei tre giri successivi. AC8: un'altezza per corsia e per la board a ogni frame a 1280, 760 e 375, nessun ticket fuori cella. `t3-red.js` pass a 1280 e 375; `t4-red` pass con lo scambio a 1,8 s.
- **files edited/created**: `src/scripts/confronto.ts`, `brain/chore/motion.md`
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: AC13 misurato sotto 5000 ms con lo spostamento a 400 ms.
- **review_mode**: browser
- **complexity**: low

### T8: Prove sul dispositivo (Omar)

- **depends_on**: [T7]
- **location**: nessun file. I risultati vanno nel log del compito
- **description**: le prove dei Constraints della spec che `agent-browser` non copre:
  - iPhone Safari a 375 e a 320 px (iPhone SE, o zoom), con queste soglie: uno stato oltre 4 righe, o una parola spezzata in 3 o più pezzi a 375 px, apre un layout mobile con `design-engineer` (domanda 4 della spec);
  - scroll con la barra di Safari che si chiude a metà giro, senza interruzioni né salti;
  - VoiceOver su macOS Safari: VO+U → Tabelle, come vengono lette corsie, celle e il conteggio (AC14).
- **validation**: ogni prova è annotata con l'esito. Una soglia superata diventa un nuovo compito prima di T9.
- **status**: Planned
- **log**:
- **files edited/created**:
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: a 375 px su iPhone, nessuno stato di ticket supera 4 righe.
- **review_mode**: browser
- **complexity**: low

### T9: Cancellare il prototipo

- **depends_on**: [T6, T8]
- **location**: `src/lab/` (tutta la cartella), `src/prototypes/integration.mjs:55-56`
- **description**: applicare D19. Con grep su `src`, controllare che niente importi da `src/lab/` o da `src/lab/confronto/util.ts`.
- **validation**: `npm run build` passa; `src/lab/` non esiste; `grep -c "/lab/" src/prototypes/integration.mjs` dà 0; `npm run dev` non serve `/lab/confronto` (404).
- **status**: Done
- **log**: 2026-11-15 orchestratore, su richiesta di Omar ("implementa") prima delle sue prove di T8. `src/lab/` cancellata; tolte le due righe `/lab/[slug]` da `integration.mjs` (`grep -c "/lab/"` dà 0); nessun riferimento a `src/lab` in `src`. Build verde, nessun `lab` in `dist/`. Dev server riavviato: `/lab/confronto` 404, home 200 con la vista statica.
- **files edited/created**: `src/lab/` (cancellata), `src/prototypes/integration.mjs`
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: `ls src/lab` fallisce. Oggi la cartella c'è.
- **review_mode**: cli
- **complexity**: low

### T7c: Il freelancer rilascia un ticket

- **depends_on**: [T7b]
- **location**: `src/data/confronto.ts`
- **description**: scelta di Omar. Il freelancer passa in review il giorno 22 (prima il 24) e va in produzione il giorno 27. AC6 e la riga Scenario della spec aggiornati.
- **validation**: `stateAt(30)` dà 3/1/0/0; build verde; AC13 sotto 5000 ms e AC8 a 1280 e 375.
- **status**: Done
- **log**: 2026-11-14 orchestratore (due righe di dati). `stateAt(30)`: pe 3, freelancer 1, agenzia 0, assunzione 0. Build verde, la home mostra "1 in produzione". AC13: 4732 ms a 1280, 4726 ms a 375, ultimo lo scambio del giorno 30, la spunta del freelancer finisce a 4,53 s. AC8: un'altezza per corsia e per la board a ogni frame, nessun ticket fuori cella.
- **files edited/created**: `src/data/confronto.ts`, `SPEC.md`
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: `stateAt(30)` con il freelancer a 1 in produzione.
- **review_mode**: browser
- **complexity**: low

### T7d: Vista statica fino a 760 px

- **depends_on**: [T7c]
- **location**: `src/components/Confronto.astro`, `src/scripts/confronto.ts`
- **description**: scelta di Omar tra le tre viste statiche del lab: "Stesso ticket" (AC18). Il markup è calcolato in build da `stateAt(30)` e dagli eventi, nessun JS. Fino a 760 px la board è nascosta e la simulazione non parte; sopra 760 px niente cambia. Le regole della board sotto 760 px (griglia stretta, spunta nell'angolo, replay solo icona) diventano inutili e si tolgono.
- **validation**: build verde; `dist/index.html` contiene la vista con "nello sprint 1" e "nello sprint 3"; a 375 e 320 px nessuno scorrimento orizzontale, la board non è visibile e nessuna animazione gira; a 768 e 1280 AC8 e AC13 come prima; passando da 1280 a 375 a metà giro nessun errore (AC12).
- **status**: Done
- **log**: 2026-11-14 orchestratore. Build verde; `dist/index.html` con "nello sprint 1", "nello sprint 3" e "poi altri 2: Export PDF, Refactor billing". 375 e 320 px: vista visibile, board `display:none`, `scrollWidth` uguale alla finestra, 0 animazioni, i quattro esiti e i colori di AC18. 1280: AC13 a 4734 ms, AC8 un'altezza per corsia e per la board, 0 ticket fuori cella. 768: board visibile, AC8 come sopra. 1280 → 375 a metà giro (Sprint 2) → 1280: nessuna animazione appesa, stato finale 3/1/0/0, console pulita. Corretto in corsa: la classe `shipped` sulla corsia ereditava lo stile del conteggio della board (nome del freelancer grigio), rinominata `ph-done`. Lab ridotto alla sola vista scelta.
- **files edited/created**: `src/components/Confronto.astro`, `src/scripts/confronto.ts`, `SPEC.md`, `src/lab/confronto/Harness.astro` (Tabellone e Ritmo cancellati)
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: la vista a 375 px mostra quattro corsie con le tappe e i risultati di AC18, senza animazioni.
- **review_mode**: browser
- **complexity**: medium

## Grafo delle dipendenze e ondate

```
T1 → T2 → T3 → T4 ─┐
     └──→ T5 ───────┴→ T7 → T6 ┐
                       └→ T8 ──┴→ T9
```

| Ondata | Compiti | Note |
|---|---|---|
| 1 | T1 | |
| 2 | T2 | |
| 3 | T3, T5 | file diversi: T3 tocca il componente e lo script, T5 solo `index.astro` |
| 4 | T4 | |
| 5 | T7 | con Omar per la scelta su D6 (ed eventuale T7b subito dopo) |
| 6 | T6, T8 | T8 è di Omar; T6 tocca solo `brain/chore/motion.md` |
| 7 | T9 | |

## Strategia di test

Nel repo non ci sono test (D18). Ogni compito parte da un controllo che fallisce, attraverso un'interfaccia pubblica:
- la build e `dist/index.html` per i dati e l'HTML statico;
- il browser con `agent-browser` per comportamento, tempi e layout.

Le misure di AC8 (altezze) e AC13 (fine dell'ultima animazione) vanno prese da script nella pagina, non a occhio. Il gate finale è `npm run build`, più T7 e T8.

## Rischi e mitigazioni

| Rischio | Mitigazione |
|---|---|
| Lo stato finale lampeggia prima del giorno 0 arrivando su `/#confronto` | Il reset avviene nello script `is:inline` prima del primo paint (D9); T3 lo verifica con uno screenshot al primo paint |
| Lo script `is:inline` e `reset()` del modulo producono stati diversi del giorno 0 | Lo stato del giorno 0 viene dallo stesso `<template>`; `reset()` resta l'unica fonte per i replay, e gira anche all'avvio, solo senza reduced motion (D10) |
| La sillabazione e le celle strette a 320 px rendono la board illeggibile | Soglie esplicite in T8, e via d'uscita con `design-engineer` |
| Spostamenti FLIP che si sovrappongono | D6: durata più corta e annullamento prima dello spostamento; D17: garanzia tra 5 e 8 giorni |
| Le corsie crescono alla soglia e spingono giù la pagina | D21: riserva all'armamento, misurata da T3 dall'armamento in poi |
| Conteggio sbagliato dopo un giro interrotto | D11: il giro chiuso ricalcola tutti i conteggi; T4 lo verifica |
| Gli stili della tabella tolti sono usati altrove | Grep in T2 prima di toglierli |
| Il blur di `swapIn` va a scatti su Safari iOS | Primo intervento in T8: togliere il blur, e tenere opacità e 8 px |

## Gate di validazione

- Dopo T2: build verde e sezione statica corretta senza JS.
- Dopo T4: tutti i criteri di motion (AC7–AC13, AC15) verdi nel browser.
- Dopo T8: nessuna soglia superata sul dispositivo. Solo allora T9.

## Domande ancora aperte

- La riscrittura della regola dei pezzi forti in [[chore/motion]] (D4): la decide Omar, e non blocca.
- La conferma delle due formulazioni di D1, e che `pricing.astro` resti com'è (Assunzioni).

## Gate del piano

`adversarial-verifier` (2026-11-14): **DO NOT SHIP**, 0 blocker / 5 major / 8 minor / 1 nit. Tutti corretti in questo piano: AC14 a 375 px (D16), riserva all'armamento (D21), conteggi dopo un giro interrotto (D11), eventi ordinati e intervallo della garanzia (D17), controlli di T1 eseguibili (D22), dipendenza T6→T7, prove della tab nascosta e del primo paint, numeri di riga, padding (D23), controlli `dist/lab` e `/lab/`, controlli espliciti di AC2, AC4, AC17 e a 760 px, rischio coerente con D10, `relation_mode`. Proposta lasciata a Omar: un ripiego se il modulo non parte (la board resterebbe al giorno 0).
