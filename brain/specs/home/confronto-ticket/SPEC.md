---
domain: home
type: spec
status: implemented
links: ["[[specs/home/confronto-ticket/PLAN]]", "[[personas]]", "[[chore/motion]]", "[[chore/product]]", "[[specs/home/clienti-muro/SPEC]]"]
created: 2026-11-14
updated: 2026-11-15
---

# Spec: Sezione confronto in home ("Ticket")

---

## User input

> /prototype per avere una versione diversa della comparazione tra product engineer e le altre modalità. Voglio sempre almeno un'alternativa creativa e una di motion.

> Tieni ticket e traduttore. Su ticket vorrei che correggessi l'animazione quando una card entra in done dove vedo che dal secondo in la casella verde si alza e si abbasa quando entra una card provacando layout shift ad ogni nuova card che entra. Come variante aggiuntiva vorrei vederne una che usi come concetto il Gantt. Mi paice questo filone product-centrico

> Ticket è il migliore, userei la distinzione in sprint più che 30 giorni perché mi sembra irrealistico. Possiamo usare lo stesso titolo che ora abbiamo nel sito vero ?

> Tieni ticket. Togli però il riferiemnto · "giorno 10 di 10" Teniamo solo il concetto di sprint. Ddopo aver eliminato tutti gli altri prototipi, dammi 5 alternative di testo oltre a quello attuale.

> Iteriamo altre 5 versioni sul questo taglio La differenza non è il prezzo.<br>È quando parti.

> Nessuna delle precedenti. Iteriamo su varianti di questo taglio Diverso il modello, migliore l'approccio

> Ok per la descrizione Abbonamento, priorità decise a ogni sprint, demo settimanali e rilasci continui.

> Perfetto crea la spec

---

## Context

La sezione 03 della home oggi confronta il Product Engineer in abbonamento con freelancer, agenzia o software house e assunzione interna attraverso una tabella da scorrere in orizzontale. La tabella elenca promesse, ma non mostra la differenza. Questa spec la sostituisce con una board condivisa: lo stesso ticket, "Nuovo onboarding", viene dato ai quattro modi di lavorare. In circa cinque secondi passano tre sprint. Il Product Engineer porta in produzione una funzionalità a sprint; il freelancer rilascia il suo primo ticket solo a fine sprint 3, agenzia e assunzione sono ancora al kickoff e ai colloqui. Sotto 760 px la board lascia il posto a un'immagine statica dello stesso ticket (AC18). Chi legge capisce il modello vedendo il ritmo, senza dover confrontare le celle di una tabella.

Persone (da [[personas]]):
- **CTO di startup o scale-up**: vuole sapere quando vede codice in produzione e con che ritmo. È il pubblico principale del confronto.
- **Agenzia di design** e **Software house**: confrontano l'abbonamento con l'assunzione o con il freelancer quando cercano capacità in white label. Per questo la corsia si chiama solo "Agenzia" (domanda 6).

Riferimento, fino al 2026-11-15 (cancellato in T9): il prototipo approvato in `src/lab/confronto/` (rotta dev-only `/lab/confronto`: `Ticket.astro`, `ticket.ts`, `util.ts`, contesto in `Harness.astro`), approvato da Omar il 2026-11-14. Sul prototipo non hanno girato né `ux-advisor` né `ui-reviewer`, quindi non c'è un `FLOW.md`.

---

## Non-Goals

- Rendere interattivo lo scenario (scegliere una corsia, scorrere il tempo a mano, cambiare il ticket): la board è un racconto, e l'unico controllo è "Rivedi gli sprint".
- Mostrare una board reale di un cliente: lo scenario è tipico, non un caso vero (domanda 5).
- Riscrivere i testi delle sezioni 02, 05 e FAQ. Questa spec chiede solo che non contraddicano il sottotitolo (AC3, domanda 3).
- Correggere i `.reveal` invisibili senza JavaScript nelle altre sezioni ([[chore/motion]] → Aperto): questa spec chiede solo che la propria sezione sia visibile senza JS (AC11).
- La posizione della sezione nella pagina: resta la 03, tra "Il modello" e "La prova".

---

## Acceptance Criteria

**Struttura e testi**

- **AC1.** In home la sezione `#confronto` (03) contiene, nell'ordine:
  - l'etichetta "03 Confronto";
  - il titolo h2 "Diverso nel modello." / "Migliore nel metodo." su due righe;
  - il sottotitolo "Abbonamento, priorità decise a ogni sprint, demo settimanali e rilasci continui.";
  - la board sopra 760 px, la vista statica "Stesso ticket" fino a 760 px (AC18);
  - sotto l'una o l'altra, la riga "Scenario tipico: tempi medi di partenza, non un cliente reale."

  La tabella attuale e la riga "← Scorri per vedere tutte le colonne →" non ci sono più. Sopra 760 px il sottotitolo va a capo senza lasciare una parola da sola sull'ultima riga.
- **AC2.** La board ha:
  - quattro colonne: "Da fare", "In corso", "In review", "In produzione";
  - quattro corsie: "Product Engineer · in abbonamento", "Freelancer · classico", "Agenzia" (senza sottotitolo), "Assunzione · interna";
  - per ogni corsia, il numero di ticket "in produzione";
  - sopra la board, il contatore "Sprint N di 3" e una barra divisa in tre segmenti con le etichette "Sprint 1", "Sprint 2", "Sprint 3".

  Nessun testo della sezione parla di giorni ("giorno N", "30 giorni").
- **AC3.** Le demo settimanali compaiono anche nella sezione 02 (scheda "Definiamo le priorità") e nella lista dei Prezzi in home, e nessun testo della home smentisce le tre promesse del sottotitolo: priorità decise a ogni sprint, demo settimanali, rilasci continui (domanda 3).

**Scenario**

- **AC4.** Al via ogni corsia ha un ticket "ONB-142 · Nuovo onboarding" in "Da fare", con il suo stato:
  - Product Engineer: "Kickoff fatto, si parte";
  - Freelancer: "Cerco un freelancer";
  - Agenzia: "Richiesta di preventivo";
  - Assunzione: "Annuncio pubblicato".

  Gli eventi seguono la tabella "Scenario" nel Decision Log, giorno per giorno.
- **AC5.** Il primo deploy del Product Engineer cade nel giorno lavorativo della garanzia (`GUARANTEE.days` in `src/config.ts`, oggi 5). Se la garanzia cambia in config, il giorno cambia con lei. Sono ammessi da 5 a 8 giorni: fuori da questo intervallo la build fallisce con un messaggio che nomina `GUARANTEE.days`, perché gli spostamenti dello stesso ticket si sovrapporrebbero (piano, D17).
- **AC6.** Lo stato finale, alla fine dello sprint 3, è questo:

  | Corsia | In produzione | Cosa resta sulla board |
  |---|---|---|
  | Product Engineer | 3 (Nuovo onboarding, Export PDF, Refactor billing) | "KPI-12 · Dashboard attivazione" in "Da fare", con lo stato "Prossimo sprint" |
  | Freelancer | 1 (Nuovo onboarding, il giorno 27) | niente: l'unico ticket è in produzione |
  | Agenzia | 0 | "Nuovo onboarding" in "In corso", con lo stato "Kickoff con il team assegnato" |
  | Assunzione | 0 | "Nuovo onboarding" in "Da fare", con lo stato "Ancora in recruiting: 4-6 mesi" in rosso |

**Animazione**

- **AC7.** Sopra 760 px la simulazione parte da sola quando il 35% della board entra nello schermo, una volta per visita. Durante la simulazione:
  - il tempo scorre a velocità costante dal giorno 0 al giorno 30;
  - il contatore passa da "Sprint 1" a "Sprint 3";
  - ogni segmento della barra si riempie durante il proprio sprint;
  - ogni evento avviene nel suo giorno, secondo il motion brief.

  La durata rispetta il limite di 5 secondi (AC13). La simulazione automatica parte una volta sola: se chi legge preme "Rivedi gli sprint" prima della soglia, la soglia non ne fa partire un'altra.

  Con la tab nascosta il tempo della simulazione si ferma e riprende da dove era: al ritorno gli eventi non partono tutti insieme.
- **AC8.** La simulazione non sposta il layout, a 768 e 1280 px. Dal primo all'ultimo frame:
  - l'altezza di ogni corsia e della board resta la stessa;
  - un ticket che entra in "In produzione" atterra già compatto, e la cella verde non cambia misura.
- **AC9.** "Rivedi gli sprint" fa ripartire la simulazione dal giorno 0, anche a metà giro. Due giri non si sovrappongono mai: niente ticket doppi, niente eventi saltati, contatori corretti alla fine.
- **AC10.** Con `prefers-reduced-motion: reduce` niente si sposta. La board mostra subito lo stato finale (AC6), il contatore segna "Sprint 3" e la barra è piena. "Rivedi gli sprint" mostra di nuovo lo stato finale, senza animazione.
- **AC11.** Senza JavaScript la sezione è visibile. La board mostra lo stato finale (AC6), con "Sprint 3 di 3" e la barra piena. "Rivedi gli sprint" non compare, perché senza script non farebbe nulla.
- **AC12.** Se la larghezza cambia, anche a metà giro o passando la soglia dei 760 px, nessun ticket esce dalla sua cella o si sovrappone a un altro. Il giro successivo torna a rispettare AC8 alla nuova larghezza.
- **AC13.** L'ultimo movimento della simulazione automatica finisce entro 5 secondi dal suo inizio, compreso lo scambio dello stato del giorno 30 (WCAG 2.2.2). Nessun controllo di pausa (domanda 1).

**Accessibilità e layout**

- **AC14.** Uno screen reader legge la board come tabella:
  - con il nome "Board dei primi tre sprint";
  - con le quattro intestazioni di colonna;
  - con un'intestazione per corsia che nomina il modo di lavorare e il conteggio "N in produzione".

  La simulazione non produce annunci (nessuna regione live). Nessuna intestazione di colonna è vuota.

  Fino a 760 px la vista statica (AC18) si legge come elenco delle quattro corsie: per ognuna il nome, la tappa raggiunta ("Arrivato a: In produzione") e il risultato. La board nascosta non viene letta.
- **AC15.** "Rivedi gli sprint" funziona da tastiera:
  - si raggiunge con Tab;
  - ha il focus visibile;
  - si attiva con Invio e Spazio;
  - l'area di tocco misura almeno 24×24 px.
- **AC16.** A 320–1440 px ogni testo della sezione misura almeno 4.5:1 sul proprio sfondo. Questo include le etichette "Sprint N" sotto la barra, "0 in produzione" e le tappe della vista statica. Nel prototipo entrambe usano #a5aab5 su bianco, che misura 2.33:1.
- **AC17.** A 320–1440 px:
  - la sezione non causa scorrimento orizzontale;
  - fino a 760 px si vede solo la vista statica (AC18), sopra solo la board;
  - nessun titolo o stato di ticket esce dalla sua cella o viene tagliato;
  - la spunta di un ticket in produzione non copre il titolo.
- **AC18.** Fino a 760 px, al posto della board, la vista statica "Stesso ticket" (variante 3 del lab, ora cancellato). Niente si muove e niente dipende da JavaScript. Contiene, nell'ordine:
  - il ticket "ONB-142" / "Nuovo onboarding" / "Lo stesso ticket, dato a tutti. Dopo 3 sprint:";
  - le quattro tappe "Da fare", "In corso", "In review", "In produzione" (l'ultima in verde);
  - per ogni corsia, il nome e una fila di quattro pallini piena fino alla tappa dove "Nuovo onboarding" si trova nello stato finale (AC6), con l'ultimo raggiunto più grande; verde se è in produzione, altrimenti `--accent` per il Product Engineer e inchiostro per gli altri;
  - sotto i pallini il risultato:

  | Corsia | Tappa | Risultato |
  |---|---|---|
  | Product Engineer | In produzione | "In produzione nello sprint 1" (verde), poi "poi altri 2: Export PDF, Refactor billing" |
  | Freelancer | In produzione | "In produzione nello sprint 3" (verde) |
  | Agenzia | In corso | "Kickoff con il team assegnato" |
  | Assunzione | Da fare | "Ancora in recruiting: 4-6 mesi" in rosso |

  Sprint e risultati vengono dagli stessi dati della board: se la garanzia o lo scenario cambiano, la vista cambia con loro. Come la board, non parla di giorni (AC2): lo sprint del rilascio prende il posto del "giorno N" del lab.

---

## Motion brief — sezione confronto

**Tempo che passa (la simulazione)**
- **Verdict:** animate.
- **Trigger:** la board entra per il 35% nello schermo, oppure un click su "Rivedi gli sprint".
- **Frequency:** una volta per visita, più i replay che sceglie chi legge. È un pezzo d'atmosfera ammesso su una marketing page (vedi però la domanda 2).
- **Purpose:** far vedere il ritmo: il Product Engineer consegna a ogni sprint, gli altri non sono ancora partiti.
- **Enter:** il giorno avanza in modo lineare, 150 ms per giorno lavorativo: tre sprint da 10 giorni durano 4,5 s, e l'ultimo scambio finisce a 4,75 s (domanda 1). Il tempo avanza a passi di frame limitati a 100 ms, così con la tab nascosta si ferma. Il contatore cambia sprint con lo scambio piccolo (`opacity` 0 → 1, `translateY(8px)` → 0, `blur(2px)` → 0) a `--dur-ui` con `--ease-out`. I segmenti si riempiono con `scaleX` 0 → 1, lineari frame per frame. L'etichetta del segmento attivo passa all'inchiostro a `--dur-hover`.
- **Exit:** nessuna: la board resta sullo stato finale.
- **Origin:** i segmenti si riempiono da sinistra.
- **Easing:** lineare per il tempo (è tempo che passa, non un movimento); `--ease-out` per lo scambio del contatore.
- **Interrupt:** "Rivedi gli sprint" azzera e riparte dal giorno 0 con un taglio netto. Timer e frame del giro in corso vengono annullati. Se reduced motion si accende a metà giro, o se la larghezza della board cambia a metà giro, il giro salta allo stato finale.
- **Reduced motion:** si passa subito allo stato finale (AC10).
- **Fino a 760 px:** nessuna animazione. La board è nascosta e non parte; al suo posto la vista statica (AC18).
- **Stack:** `requestAnimationFrame` per il tempo, WAAPI per lo scambio.

**Ticket che cambia colonna**
- **Verdict:** animate · **Trigger:** un evento con cambio di colonna · **Frequency:** 12 spostamenti per giro; lo stesso ticket si sposta di nuovo dopo 2 giorni (300 ms).
- **Purpose:** far vedere il lavoro che avanza sulla board.
- **Enter:** FLIP: il ticket si sposta nella nuova cella e parte con `translate` dalla posizione vecchia verso `none`. Se va "In produzione", prima si compatta (solo il titolo, con una spunta verde da 18 px) e solo poi parte. Così atterra già alla misura finale (AC8).
- **Exit:** —.
- **Origin:** dalla cella di partenza.
- **Easing:** `--ease-in-out` (movimento da un punto all'altro dello schermo) · **Duration:** `--dur-ui` (250 ms). Nel prototipo era `--dur-swap` (400 ms): uno spostamento partiva prima che finisse il precedente. Da confermare a occhio (Constraints).
- **Interrupt:** se un ticket è ancora in volo, lo spostamento successivo parte dalla posizione in cui si trova, senza salti. Un replay annulla il giro in corso.
- **Reduced motion:** nessuno spostamento.
- **Stack:** WAAPI.

**Stato che cambia, nuovo ticket, spunta del deploy**
- **Stato:** lo scambio piccolo (sopra) a `--dur-ui` / `--ease-out`. Il rosso di avviso (`--bad`) si accende e si spegne senza animazione.
- **Nuovo ticket del Product Engineer:** compare in "Da fare" da `opacity 0` e `scale(0.96)`, a `--dur-ui` / `--ease-out`.
- **Spunta del deploy:** compare da `opacity 0` e `scale(0.5)` con un ritardo di 0.6 × la durata dello spostamento (150 ms, quando il ticket atterra). Il primo deploy del Product Engineer usa `--dur-swap` / `--ease-pop`, l'overshoot di brand, una volta per giro. Gli altri deploy usano `--dur-ui` / `--ease-out`. Il conteggio "N in produzione" si aggiorna alla fine dello spostamento (250 ms), senza animazione.
- **"Rivedi gli sprint":** alla pressione `scale(0.97)` a `--dur-press` / `--ease-press`, anche al rilascio; il bordo in hover a `--dur-hover`, solo con puntatore fine.
- **Reduced motion:** niente scambi, comparse o spunte animate: lo stato finale è già lì.

**Assumed:** nessuno. I valori sono quelli del prototipo approvato, con tre correzioni di `design-engineer` (2026-11-14): 150 ms per giorno, spostamento a `--dur-ui`, ritardo della spunta legato allo spostamento.

**Open risk:**
- la sensazione a velocità reale e con reduced motion emulato non è stata verificata, perché il pannello del browser era nascosto (Constraints);
- la home ha un pezzo forte in più di quanti ne ammette [[chore/motion]]: eccezione registrata (domanda 2).

---

## Constraints

- Il motion usa solo i token `--ease-*` / `--dur-*` / `--stagger` di `src/styles/global.css`. Le pagine `.astro` restano senza JS di framework, e l'output è statico.
- Il prototipo `src/lab/confronto/` e la rotta `/lab/[slug]` sono stati cancellati il 2026-11-15 (T9): il riferimento è il codice in produzione, `src/components/Confronto.astro`.
- Non verificato, da controllare prima del rilascio:
  - la simulazione a velocità piena e rallentata (DevTools Animations al 10–25%): origini, sincronia tra spostamento e spunta, nessuno scatto di layout; Omar conferma lo spostamento a 250 ms contro i 400 ms del prototipo;
  - la home con `prefers-reduced-motion: reduce` emulato (AC10);
  - Mobile Safari a 375 e 320 px: leggibilità della vista statica (AC18); iPad in verticale (768 px): la board e il FLIP;
  - VoiceOver su macOS Safari: VO+U → Tabelle; come vengono lette corsie e celle (AC14).

---

## Technical Notes

- Nel prototipo i ticket stanno in un `<template>` e lo script li inserisce, quindi senza JS la board è vuota. AC11 chiede l'opposto.
- Nel prototipo il giorno del primo deploy è scritto a mano (`d: 5`). Il valore della garanzia arriva sulla board (`data-guarantee`) ma non viene usato (AC5).
- Contro il layout shift, il prototipo fa due cose:
  - prima di ogni giro prova tutti gli eventi a vuoto e fissa per ogni corsia l'altezza massima che raggiungerà;
  - a ogni cambio di larghezza cancella questa riserva.
- Nel prototipo l'intestazione d'angolo della board è un `columnheader` vuoto (AC14).
- Gli stili della tabella attuale (`.compare*`, `.mark-yes`, `.mark-no`, `.compare-hint`, `src/pages/index.astro:769-808`) li usa solo la tabella. `GUARANTEE.short` (`src/config.ts:12`) è usato solo nella sua cella. Il commento su `GUARANTEE.label` cita la "tabella confronto", ma `label` resta in uso in home, pricing e termini.

---

## Open Questions

| # | Question | Affects | Owner | Status |
|---|----------|---------|-------|--------|
| 1 | La simulazione durava 5,4 s e partiva da sola, oltre il limite di 5 s di WCAG 2.2.2 | AC7, AC13, motion brief | Omar | Closed: 150 ms per giorno (4,5 s, ultimo scambio a 4,75 s), nessun controllo di pausa (design-engineer, 2026-11-14) |
| 2 | Pezzi forti in home oltre il limite di [[chore/motion]] | Motion brief | Omar | Closed: si tengono tutti, eccezione registrata in [[chore/motion]] (Omar, 2026-11-14) |
| 3 | "Demo settimanali" è nuovo sul sito | AC3 | Omar | Closed: fa parte dell'offerta, va anche in 02 e nei Prezzi in home (Omar, 2026-11-14) |
| 4 | Sotto 760 px la board 4×4 è densa | AC17 | Omar | Closed: troppe cose in movimento e testi che cambiano su uno schermo stretto. Fino a 760 px c'è una vista statica, "Stesso ticket", scelta da Omar tra tre nel lab (2026-11-14, AC18) |
| 5 | Lo scenario è tipico, non un cliente reale | AC1 | Omar | Closed: riga sotto la board (Omar, 2026-11-14) |
| 6 | La corsia "Agenzia o software house" mostra lentezza, ma le software house sono clienti | AC2 | Omar | Closed: la corsia si chiama solo "Agenzia" (Omar, 2026-11-14) |
| 7 | Prezzo, pausa e disdetta, garanzia, seniority e impatto non sono sulla board | AC1 | Omar | Closed: default, restano coperti da 02, Prezzi e casi studio |
---

## Decision Log

| Decision | Rationale |
|----------|-----------|
| Variante **Ticket** del prototipo, scelta tra Diff, Filtro, Lotteria, Traduttore e Gantt | Scelta di Omar (2026-11-13): il filone "product-centrico" racconta il confronto come lavoro che avanza, non come una tabella |
| Sprint al posto dei 30 giorni: 3 sprint da 10 giorni lavorativi, senza "giorno N di 10" | Omar: 30 giorni erano irrealistici, si tiene solo il concetto di sprint |
| Titolo "Diverso nel modello." / "Migliore nel metodo." | Dal giro di testi sul taglio "Diverso il modello, migliore l'approccio"; accettato da Omar il 2026-11-14 ("Perfetto") |
| Sottotitolo "Abbonamento, priorità decise a ogni sprint, demo settimanali e rilasci continui.", con `text-wrap: balance` | Testo di Omar, parola per parola. Il bilanciamento evita "continui." da solo sulla seconda riga |
| **Correzione approvata (layout shift):** il ticket si compatta prima di spostarsi in "In produzione", e ogni corsia ha l'altezza massima riservata prima del giro | Omar aveva visto la cella verde alzarsi e abbassarsi a ogni ticket in arrivo. Verificato frame per frame a 1280 e 375 px |
| Layout: card bianca con bordo `--line`, raggio `--radius`, padding 22/24/26 px, ombra `0 24px 48px rgba(15,22,38,.06)`. Griglia 150 px + 4 × `minmax(0,1fr)`, spazio 8 px, corsia alta almeno 112 px. Celle `#f6f5f2`, "In produzione" `--ok-soft`. Nome della corsia del Product Engineer in `--accent` e i suoi ticket con bordo `rgba(47,75,255,.35)` | Valori del prototipo |
| ~~Sotto 760 px: padding 16/12/18 px; barra degli sprint su una riga sua; griglia 4 × `minmax(0,1fr)`, spazio 4 px; nome della corsia sopra le celle (senza sottotitolo); celle alte almeno 56 px; codice del ticket nascosto; titoli con sillabazione; spunta da 14 px nell'angolo; "Rivedi gli sprint" solo come icona | Valori del prototipo, verificati senza scorrimento orizzontale a 375 px~~. Superato dalla vista statica (ultima riga) |
| **Scenario** (giorno lavorativo → evento). Product Engineer: 1 In corso "Scope deciso con te" · 3 In review "PR aperta" · 5 In produzione · 6 nuovo "PDF-77 Export PDF", "Prossimo sprint" · 11 In corso "In sviluppo" · 14 In review "PR aperta" · 16 In produzione · 17 nuovo "BIL-31 Refactor billing", "Prossimo sprint" · 21 In corso "In sviluppo" · 24 In review "PR aperta" · 26 In produzione · 27 nuovo "KPI-12 Dashboard attivazione", "Prossimo sprint". Freelancer: 4 "Trovato: inizia tra 2 settimane" · 11 In corso "In sviluppo, 3 giorni a settimana" · 17 "Offline da 2 giorni" (rosso) · 19 "Di nuovo online" · 22 In review "PR aperta: brief da chiarire" · 27 In produzione. Agenzia: 5 "Preventivo: 3 settimane di stima" · 12 "Preventivo approvato, rev. 2" · 18 "In attesa del team" · 21 In corso "Kickoff con il team assegnato". Assunzione: 8 "48 candidature da leggere" · 15 "Colloqui: 2 di 8" · 23 "Colloqui: 6 di 8" · 30 "Ancora in recruiting: 4-6 mesi" (rosso) | Valori del prototipo. I tempi di partenza riprendono quelli della tabella attuale: primo deploy in 5 giorni (la garanzia), freelancer 2+ settimane, agenzia 4+ settimane, assunzione 4-6 mesi |
| Corsia "Agenzia" senza "o software house" e senza sottotitolo | Omar, 2026-11-14: le software house sono clienti in white label ([[personas]]) |
| Riga "Scenario tipico: tempi medi di partenza, non un cliente reale." sotto la board | Omar, 2026-11-14: credibilità con un pubblico tecnico |
| Demo settimanali anche in 02 e nei Prezzi della home | Omar, 2026-11-14: una sola promessa su tutto il sito |
| 150 ms per giorno; spostamento a `--dur-ui`; spunta con ritardo 0.6 × spostamento; tempo fermo con la tab nascosta | `design-engineer`, 2026-11-14: rispetta WCAG 2.2.2, e gli spostamenti dello stesso ticket non si sovrappongono più |
| Spostamento a `--dur-swap` (400 ms) invece di `--dur-ui`; spunta e conteggio lo seguono | Omar, 2026-11-14, dopo averlo visto nel feel-check: "essendo un componente grande usiamo la regola di movimenti più lenti". Gli spostamenti dello stesso ticket a 2 giorni si sovrappongono (FLIP interrompibile); AC13 rimisurato a 4,72–4,75 s |
| Il freelancer porta in produzione "Nuovo onboarding" il giorno 27 (review anticipata dal 24 al 22) | Omar, 2026-11-14: "darei almeno al freelance il completamento di 1 task". Il confronto resta: 3 ticket contro 1, e il primo rilascio al giorno 27 contro il 5. AC13 rimisurato a 4,73 s (ultimo lo stato del giorno 30) |
| Fino a 760 px la board è nascosta e c'è la vista statica "Stesso ticket" (AC18); sopra resta la board animata | Omar, 2026-11-14: "per il mobile userei un immagine statica per sottolineare la differenza perché ci sono troppe cose che si muovono, testi che mutano e non si capisce niente". Scelta tra Tabellone, Ritmo e Stesso ticket nel lab. Rispetto al lab, "al giorno N" diventa "nello sprint N" per AC2 |
