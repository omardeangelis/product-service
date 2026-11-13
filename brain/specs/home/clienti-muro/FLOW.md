# Flow map: sezione clienti in home

> Map of [[specs/home/clienti-muro/SPEC]]. Every requirement cites an acceptance criterion there; `SPEC.md` is the contract.
> Source: `ux-advisor` review of the prototype at `src/lab/loghi/` (`/lab/loghi`), 2026-11-13 (round 2), verdict `proceed with decisions`.

## Goal
Chi scorre la home capisce con chi ha lavorato Omar e in che rapporto, e quando esiste apre il caso studio di quel cliente (AC1, AC4, AC6).

## Persona situations
- CTO di startup o scale-up × arriva dall'hero × desktop × prima visita — cerca la prova: ogni cliente con un caso studio deve portarci, incluso il cliente dei 3 casi studio (AC4, AC5).
- Agenzia di design × desktop o telefono — legge il rapporto white label come prova, ma un cliente white label nominato senza consenso le dice il contrario di "discrezione" (AC6, domanda 1).
- Software house × desktop — la riga di Devpunks è la sua prova più forte: deve essere vera e confermata (AC6, domanda 2).

## Entry points
- Scorrendo la home dall'hero ("Show me the code ↓" porta oltre; la sezione sta tra hero e "Per chi") (AC1).

## Happy path
1. La sezione entra nello schermo → la parete si alza, intestazione ed elenco compaiono in dissolvenza (AC12).
2. Legge etichetta e titolo → capisce che sono clienti, senza contraddizioni con le righe sotto (AC2).
3. Passa su un nome (o lo tocca) → si accendono solo le schermate di quel cliente, e sono lavoro di Omar (AC3, AC8, AC9).
4. Sceglie un cliente con caso studio → al primo click o tap si apre il caso studio (AC4, AC9, AC10).
→ Outcome: il caso studio aperto, che finisce con "Prenota una call di 30 min" (AC4).

## States
| Action or region | Outcome, state, or interruption | Criterion |
|---|---|---|
| Nome con link (touch) | primo tap apre il caso studio; dopo Back sezione a riposo | AC9 |
| Nome con link (mouse, tastiera) | apre il caso studio; dopo Back niente acceso | AC10 |
| Nome senza link (touch) | tap accende / di nuovo spegne / tap fuori spegne | AC9 |
| Parete o nomi (touch) | uno scorrimento che parte lì non accende niente | AC9 |
| Cliente acceso (touch) → link → Back | la scelta della persona resta finché non la cambia | present |
| Schermata (mouse) | click: non succede niente, la parete non è un link | AC11 |
| Schermate | caricamento fallito o lento: nomi e link funzionano comunque | present |
| Caso studio in bozza | il cliente compare senza link e senza "caso studio" | AC5 |
| Senza JavaScript | sezione visibile, nomi e link, niente acceso | AC13 |
| Cliente senza consenso o senza riga confermata | non compare | AC6, domande 1–2 |

## Accessibility
- Una sola fermata di Tab per link, dall'hero ai bottoni di "Per chi" e indietro; il focus visibile accende il cliente; Invio apre; dopo Back niente acceso (AC10).
- La parete è nascosta alle tecnologie assistive; tutto ciò che dice sta nei nomi (AC11).
- Attivazione al primo doppio tap con VoiceOver iOS / TalkBack; nome accessibile senza parole attaccate (AC15).
- Contrasto dei nomi in ogni stato acceso (AC7).
- Manual checks still needed: VoiceOver macOS (Landmarks, lettura del link), VoiceOver iOS e TalkBack (doppio tap), NVDA in modalità lettura (Constraints).

## Persona dependencies
- I casi studio pubblicati decidono quali clienti hanno un link (AC4, AC5).
- Consenso dei clienti e righe di rapporto vere vengono da Omar (domande 1–3).
