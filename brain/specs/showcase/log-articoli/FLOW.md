# Flow map: showcase, gli articoli in home e in /showcase

> Map of [[specs/showcase/log-articoli/SPEC]]. Every requirement cites an acceptance criterion there; `SPEC.md` is the contract.
> Source: `ux-advisor` review of the prototype at `src/lab/showcase/` (`/lab/showcase`), 2026-11-16, verdict `proceed with decisions`.

## Goal
Chi visita il sito vede che Omar mette in produzione con continuità e apre l'articolo che gli interessa, filtrando fra casi studio e release; da ogni articolo può prenotare una call (AC5, AC6, AC13).

## Persona situations
- CTO di startup o scale-up × arriva dall'hero «Show me the code ↓» × desktop × prima visita: con «Tutti» la fila ha un solo caso studio su 8. Sceglie «Casi studio» e da lì arriva a `/showcase/?tag=caso-studio`. Dal caso studio, «← Tutti i casi studio» deve riportarlo ai soli casi studio (AC6, AC16).
- Software house × arriva da ricerca o RSS × entra da un articolo, non dalla home: in fondo deve trovare la call e, se c'è, il caso studio dello stesso lavoro (AC13, AC20, AC21).
- Agenzia di design × legge «Cliente in white label» come segnale: nessun nome del cliente finale deve uscire, né nella pagina né nel feed (AC2).
- Telefono a 375 px: niente frecce, la scheda successiva sporge e i chip stanno su una riga (AC17, AC19).

## Entry points
- Home, scorrendo o da «Show me the code ↓» → `#shipped` (AC5).
- Nav «Showcase» → `/showcase/` (AC16).
- Caso studio: «← Tutti i casi studio» e «Altri casi studio» → `/showcase/?tag=caso-studio` (AC16).
- Ricerca, motori AI, `/llms.txt`, feed → pagina di una release o `/showcase/` (AC20, AC21, AC22).

## Happy path
1. La sezione 04 entra nello schermo → intestazione, filtri e schede salgono in dissolvenza (AC29).
2. Legge la riga «N articoli da … · l'ultimo …» → la data è vera il giorno in cui la legge (AC10).
3. Sceglie «Casi studio» → la fila riparte dall'inizio con i soli casi studio; scheda finale e link del piede dicono «Tutti i casi studio · 4» (AC6, AC7).
4. Apre il link del piede → `/showcase/?tag=caso-studio` con «Casi studio» premuto e i mesi senza casi studio nascosti (AC14, AC15).
5. Apre una scheda → l'articolo: un caso studio, oppure una release su `/showcase/<slug>/` (AC8, AC13).
6. In fondo alla release → «Prenota una call di 30 min» e, se c'è, «Leggi il caso studio completo» (AC13).
→ Outcome: la call prenotata o il caso studio aperto (AC13).

## States
| Action or region | Outcome, state, or interruption | Criterion |
|---|---|---|
| Chip in home | cambio filtro: chip premuto, fila dall'inizio, etichette che seguono il filtro | AC6, AC7 |
| Chip in home | cambio durante lo scorrimento delle frecce | AC7 |
| Chip | tag con 0 articoli | AC6 |
| Chip | tag con 1 articolo: etichette senza accordo sbagliato | AC6 |
| Pagina | `?tag=` valido | AC15 |
| Pagina | `?tag=` sconosciuto o senza articoli → «Tutti» | AC15 |
| Pagina | cambio filtro, poi Indietro → esce dalla pagina | AC15 |
| Scheda | apre un caso studio | present |
| Scheda | apre una release | AC13 |
| Release | «← Tutti gli articoli» arrivando da `/showcase/` → filtro e posizione ritrovati | AC13 |
| Release | aperta da URL diretto, ricerca o feed → call in fondo | AC13 |
| Home | Indietro da un articolo: filtro e posizione della fila conservati | present |
| Feed | copia riuscita | AC18 |
| Feed | copia fallita | AC18 |
| Feed | secondo clic prima che il messaggio sparisca | AC18 |
| Video in scheda | caricato: fermo, senza controlli | AC11 |
| Media in scheda | non caricato → copertina con numero o titolo | AC12 |
| Date | giorni dopo il deploy | AC10 |
| Senza JavaScript | sezione e pagina visibili, link funzionanti | AC30 |
| Reduced motion | contenuto visibile, solo dissolvenze, frecce istantanee | AC29 |

## Accessibility
- Tastiera in home: chip → frecce → schede → link «Tutti…» → feed. La scheda finale non è una fermata (AC23). Le frecce alle estremità tengono il focus (AC17).
- Ogni scheda si annuncia con il suo titolo; data, progetto e testo sono la descrizione (AC9).
- Al cambio filtro si annuncia il conteggio con il tipo, e in home quanti articoli si vedono sul totale (AC23).
- L'esito della copia del feed viene annunciato (AC18).
- Da verificare a mano: VoiceOver (feed, chip, frecce, prima scheda) e NVDA su una scheda con video (SPEC → Constraints).

## Persona dependencies
- Le release del lancio le scrive Omar in T15 del piano (domanda aperta 1, chiusa). Le date dei casi studio le ha date Omar il 2026-11-16 (domanda aperta 2, chiusa; AC4, AC10).
- Per ogni release in white label Omar decide se pubblicarla anonima o non pubblicarla (AC2).
- Il collegamento tra una release e il caso studio dello stesso lavoro decide se compare «Leggi il caso studio completo» (AC13).
