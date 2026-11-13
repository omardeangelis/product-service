---
domain: home
type: spec
status: draft
links: ["[[specs/home/clienti-muro/FLOW]]", "[[specs/home/clienti-muro/PLAN]]", "[[personas]]", "[[chore/motion]]", "[[chore/product]]"]
created: 2026-11-13
updated: 2026-11-13
---

# Spec: Sezione clienti in home ("Muro")

---

## User input

> /prototype una sezione per il "hanno lavorato con me" Vorrei tre versioni di cui 1 creativa.

> Per ora mettiamolo sotto hero, poi iteriamo anche sulle posizioni nella pagina

> Tieni Browser e Muro. Su Muro fai altre modifiche per cui: 1. Ci siano più screen di ogni lavoro non solo lo stesso 2. Quando si fa hover sul nome del business, che il muro illumini gli screen relativi. Poi proponomi 1 altra variante di muro e una ancora diversa sempre in stile creativo

> Tieni Muro e vorrei vedere delle varianti solo dei testi.

> Perfetto, vorrei che il testo della sezione fosse "Hanno scelto un Product Engineer"

> (iterate loop) Link on first tap, Case study label on its own line — (approval gate) Approvo

---

## Context

La home non dice per chi Omar ha già lavorato. Questa sezione, subito sotto l'hero, mostra i clienti come prova sociale: una parete inclinata di schermate che avanza a scatti e, sotto, i nomi dei clienti con il tipo di rapporto. Passando su un cliente (o toccandolo) la parete accende solo le sue schermate. Serve a chi arriva sul sito per capire in pochi secondi che il lavoro è reale e con chi è stato fatto, e porta al caso studio quando esiste.

Persone (da [[personas]]): **CTO di startup o scale-up** (vuole prove concrete e il caso studio), **Agenzia di design** (cerca prova di lavoro sotto il marchio altrui, ma compra discrezione), **Software house** (la prova di lavoro in white label per una software house è la più forte per lei).

Riferimento vivo: il prototipo approvato in `src/lab/loghi/` (rotta dev-only `/lab/loghi`, variante Muro, testi in `copy.ts`), approvato con le modifiche il 2026-11-13.

- Review UX (`ux-advisor`, 2026-11-13, round 2): **proceed with decisions**.
- Review UI (`ui-reviewer`, 2026-11-13, round 2): **proceed with decisions**. Chromium 149, 280–1440 px a 1× e 1.25×, più 844×390. Mobile Safari, axe e screen reader non disponibili.

---

## Non-Goals

- La posizione definitiva della sezione nella pagina: per ora sta sotto l'hero, e si itera dopo (parole dell'utente).
- Una pagina 404 per il sito: AC5 evita il link rotto senza bisogno di una 404.
- I refusi nei casi studio (`dati-da-excel.md:26` "Poi perà", `:29` "utenti importavano", `offerte-ai.md:9` "Da form  chat interattiva"): sono contenuti di altre pagine, da correggere a parte.
- "Per chi" che non nomina le software house: è già tra i Gap aperti di [[personas]].
- Il problema dei `.reveal` invisibili senza JavaScript nelle altre sezioni della home ([[chore/motion]] → Aperto): questa spec lo risolve solo per la propria sezione (AC13).

---

## Acceptance Criteria

**Struttura e testi**

- **AC1.** In home c'è una sezione tra l'hero e "Per chi" con, nell'ordine: un'etichetta, il titolo h2 "Hanno scelto un Product Engineer.", la parete di schermate e l'elenco dei clienti. La regione è annunciata con il nome del titolo.
- **AC2.** (UX D4, P2) Leggendo l'intestazione e le righe sotto i nomi, niente nell'intestazione è smentito dalle righe, "team" ha un solo significato, e il link interno finisce con "→". Default: etichetta **"Clienti"**; nessuna riga a destra del titolo (se torna, nomina solo i tipi di rapporto mostrati sotto); Valueize: **"Con il mio team · 9 settimane"**, poi **"caso studio →"** su una riga sua.
- **AC3.** (UX D2, P1) La parete mostra solo schermate di lavoro fatto da Omar. Per ogni schermata è annotato cosa ha fatto Omar; una schermata senza quella nota non compare. Un cliente senza niente di mostrabile compare solo tra i nomi. Nessuna pagina marketing di un cliente compare se Omar non l'ha costruita.
- **AC4.** (UX D3, P1) Ogni cliente (`meta.cliente`) di un caso studio pubblicato compare tra i nomi, e un cliente con casi studio porta a quei casi studio. Default per SeVedemo: riga "Product Engineer · 3 casi studio ↓" con link alla sezione dei casi studio in home (`/#shipped`), salvo che la domanda 3 dica che l'esclusione è voluta.
- **AC5.** (UX D5, P2) Il link al caso studio di un cliente esiste solo se quel caso studio è pubblicato. Prova: con `draft: true` su `dati-da-excel` la build passa e Valueize compare senza link e senza "caso studio".
- **AC6.** Ogni cliente elencato ha il consenso a essere nominato (domanda 1) e una riga di rapporto confermata da Omar (domanda 2). Un cliente senza una delle due non compare, né tra i nomi né nella parete. Nessuna riga del prototipo è riusata senza conferma.

**Cliente acceso**

- **AC7.** (UI P1) In ogni stato acceso (ciascun cliente, da hover, focus o tap), a 280–1440 px, ogni testo dell'elenco dei clienti misura almeno 4.5:1 sullo sfondo #0f1626. Default: il cliente acceso si distingue per il proprio bordo nel suo colore e la riga sotto il nome in bianco; gli altri restano ai colori di riposo (18.06:1 e 6.11:1). Se si tiene l'attenuazione, l'opacità degli altri è almeno .82.
- **AC8.** Mouse: passando su un nome o su una schermata, le schermate di quel cliente restano piene con un bordo di 2 px nel suo colore e le altre scendono a opacità .18; uscendo, tutto torna a riposo. Con il mouse sulla parete le file si fermano, e tra una schermata e l'altra resta acceso l'ultimo cliente; con il mouse sui nomi le file continuano.
- **AC9.** Touch: un tap fermo su un nome senza link o su una schermata accende quel cliente; lo stesso tap di nuovo lo spegne; un tap fuori dalla sezione lo spegne. Uno scorrimento che parte dalla parete o dai nomi non accende niente. Un nome con link apre il caso studio al primo tap e non accende niente; tornando indietro la sezione è a riposo.
- **AC10.** Tastiera: ogni link dell'elenco è una sola fermata di Tab; il focus visibile accende il suo cliente e lo spegne uscendo; Invio apre il caso studio; tornando indietro niente è acceso. Il focus mostra un contorno bianco di 2 px non coperto né tagliato a 280–1440 px.
- **AC11.** La parete non è un controllo: nessuna schermata è un link, nessuna ha il cursore a mano, un click col mouse su una schermata non cambia pagina, e la parete è nascosta alle tecnologie assistive. Le informazioni stanno tutte nell'elenco dei nomi.

**Motion**

- **AC12.** La parete si comporta come nel brief motion sotto: entrata, scatti delle file, accensione. Le file si fermano quando la sezione è fuori schermo, con la tab nascosta e con il mouse sulla parete. Con `prefers-reduced-motion: reduce` la parete resta ferma, l'entrata è solo una dissolvenza e l'accensione resta (cambia solo l'opacità).
- **AC13.** Senza JavaScript la sezione è visibile, con nomi e link, senza scatti e senza cliente acceso: lo stato nascosto dell'entrata lo applica lo script.

**Layout e accessibilità**

- **AC14.** (Correzioni meccaniche UI) A 280–1440 px, a 1× e 1.25×:
  - l'elenco è su 4 colonne sopra 760 px e su 2 colonne fino a 760 px;
  - l'etichetta del caso studio sta su una riga sua a ogni larghezza, e nessuna riga comincia con un separatore;
  - le righe sotto i nomi della stessa riga della griglia partono alla stessa altezza (salvo dove un nome va su due righe);
  - tutta la voce di un cliente con link apre il link (nessuna striscia che accende senza aprire);
  - la sezione non causa scorrimento orizzontale, nemmeno a 844×390.
- **AC15.** (Correzioni di accessibilità UX) Un link dell'elenco si attiva con un solo doppio tap di VoiceOver iOS / TalkBack; il nome accessibile del link contiene il testo visibile senza parole attaccate.

---

## Motion brief — sezione clienti

**Entrata (una volta per visita)**
- **Verdict:** animate · **Trigger:** la sezione entra per il 15% nello schermo · **Frequency:** una volta per visita → pezzo d'atmosfera ammesso su una marketing page ([[chore/motion]]).
- **Purpose:** la parete "si alza" e annuncia che sotto c'è lavoro vero.
- **Enter:** parete da `opacity 0`, `translateY(80px) rotateX(64deg) rotateZ(-14deg)` alla sua inclinazione `rotateX(32deg) rotateZ(-14deg)`; intestazione ed elenco solo in dissolvenza.
- **Exit:** nessuna (l'entrata non si ripete).
- **Origin:** dal basso verso l'inclinazione di riposo.
- **Easing:** `--ease-out-expo` · **Duration:** parete `--dur-showpiece` (800ms, ritardo `--stagger`); intestazione `--dur-reveal` con ritardo `--stagger`; elenco `--dur-reveal` con ritardo 4 × `--stagger`. Oltre 300ms perché è il pezzo d'atmosfera della sezione e la curva expo copre quasi tutta la distanza nei primi frame.
- **Interrupt:** non si ripete; parte una volta sola.
- **Reduced motion:** parete, intestazione ed elenco in sola dissolvenza (`--dur-swap`, lineare, stessi ritardi), niente sollevamento. Come `.reveal` del sito (corretto da design-engineer in create-plan, 2026-11-13).
- **Stack:** CSS keyframes, armati da uno script (AC13).

**Scatto delle file (ambient)**
- **Verdict:** animate · **Trigger:** tempo, solo con la sezione visibile (25%), la tab visibile e il mouse fuori dalla parete.
- **Frequency:** ambient continuo finché la sezione è a schermo → decorativo, si ferma fuori schermo.
- **Purpose:** la parete "lavora": avanza a scatti decisi, mai fluttuando.
- **Enter:** ogni fila avanza di una finestra (`translateX` di larghezza + spazio: 324px sopra 760 px, 216px sotto), direzioni alternate per fila, periodi 2600 / 3200 / 2900 ms, primo scatto sfalsato di 400ms per fila. Finito il giro della sua sequenza la fila torna al centro senza animare, senza stacco visibile.
- **Exit:** —.
- **Origin:** orizzontale, sinistra per la 1ª e 3ª fila, destra per la 2ª.
- **Easing:** `--ease-out-expo` · **Duration:** `--dur-reveal` (700ms: lo scatto viaggia oltre 300px).
- **Interrupt:** si ferma e riprende dal punto in cui era; uno scatto in corso finisce.
- **Reduced motion:** nessuno scatto: la parete è un'immagine ferma.
- **Stack:** CSS transition su `transform`, tempo da `requestAnimationFrame`.

**Cliente acceso**
- **Verdict:** animate · **Trigger:** hover, focus visibile o tap (AC8–AC10).
- **Frequency:** decine di volte per visita al massimo → tempi da UI.
- **Purpose:** collega un nome alle sue schermate.
- **Enter:** schermate degli altri clienti `opacity` 1 → .18; schermate del cliente: bordo 2 px nel suo colore e ombra più profonda; voce del nome: bordo superiore nel suo colore (resto per AC7). Hover su una schermata con puntatore fine: `scale(1.06)`.
- **Exit:** reverse of enter.
- **Origin:** centro della schermata per lo `scale`.
- **Easing:** `--ease-out` · **Duration:** `--dur-ui` (250ms).
- **Interrupt:** transizioni, quindi passare da un cliente all'altro parte dallo stato corrente.
- **Reduced motion:** niente `scale`; resta il cambio di opacità e di bordo.
- **Stack:** CSS transitions guidate da un attributo sulla sezione.

**Assumed:** nessuno; tutti i valori sono quelli del prototipo approvato.
**Open risk:** la nitidezza della parete su Safari iOS mentre scatta (nastri larghi fino a 6780 px): verificare sul dispositivo (Constraints).

---

## Constraints

- Motion solo con i token `--ease-*` / `--dur-*` / `--stagger` di `src/styles/global.css`; le pagine `.astro` restano senza JS di framework; output statico.
- Il prototipo `src/lab/loghi/` resta il riferimento vivo finché l'implementazione non arriva in produzione; poi `implement-spec` lo cancella insieme alla sua rotta (`src/prototypes/integration.mjs`).
- **Verificato a mano sul dispositivo (Mobile Safari), dalla review UI:**
  - tap sui nomi senza link e sulle schermate (AC9): su iPhone Safari `/` → tap "Young Platform" (si accende) → di nuovo (si spegne) → tap su una schermata (si accende il suo cliente) → swipe verticale dalla parete (niente si accende) → tap sul cliente con caso studio (si apre al primo tap). Se i tap non accendono: `cursor: pointer` su voci e schermate solo con `(hover: none)`;
  - nitidezza della parete mentre scatta, a 375 px e su iPad orizzontale: schermate sfocate o mancanti → accorciare il nastro con `design-engineer`;
  - solo se il progetto supporta Safari < 16: a 375 px su iOS 15, nessuno scorrimento orizzontale (aggiungere `overflow: hidden` prima di `overflow: clip`).
- **Verificato a mano con screen reader, dalla review UX:**
  - VoiceOver su macOS Safari: VO+U → Landmarks, la regione si capisce come elenco clienti; Tab sul link, come vengono letti la riga e "caso studio";
  - VoiceOver iOS e TalkBack: un solo doppio tap apre il caso studio (AC15);
  - NVDA in modalità lettura: nome e riga letti come due parti, non attaccati.

---

## Technical Notes

- `src/pages/case-study/[slug].astro:9` esclude i casi studio in bozza, e il sito non ha `src/pages/404.astro`: un link scritto a mano a un caso studio tornato in bozza porta a una pagina che non esiste (AC5).
- Il campo `sector` di `src/lab/loghi/logos.ts` non è usato né confermato; i settori oggi si vedono solo nella parete, che è nascosta alle tecnologie assistive.
- I nastri della parete misurano fino a 6780 px sopra 760 px (4520 / 3872 px a 280 px): oggi solo `overflow: clip` sulla sezione li contiene.
- Asset del prototipo in `src/lab/loghi/assets/` (cinque schermate 720×450 per cliente in `screens/`); molte non passano AC3.

---

## Open Questions

| # | Question | Affects | Owner | Status |
|---|----------|---------|-------|--------|
| 1 | Young Platform, Devpunks, Start Franchising (e SeVedemo) possono essere nominati e mostrati con schermate? Devpunks può essere nominato come acquirente di lavoro white label? **Default:** solo i clienti che hanno dato l'OK per iscritto | AC6, AC3 | Omar | Closed: OK di tutti (Omar, 2026-11-13) |
| 2 | Quali sono le righe di rapporto vere (modalità, durata) e i settori di YP, Devpunks e SF, e quali schermate sono lavoro di Omar? **Default:** nessuna riga inventata va online; un cliente senza riga confermata non compare | AC3, AC6 | Omar | Closed: righe nel Decision Log; schermate tutte lavoro di Omar (2026-11-13) |
| 3 | SeVedemo è escluso di proposito (NDA, rapporto da dipendente)? **Default:** incluso (AC4). Oggi mancano il suo logo e le sue schermate | AC4 | Omar | Closed: SeVedemo entra (Omar, 2026-11-13) |
| 4 | Colore del bordo di Devpunks acceso: #2b14ff misura 2.28:1 sullo sfondo. **Default:** #5543ff (3.12:1) per il bordo del nome, il blu di marca resta sull'anello della schermata | AC7 | Omar | Closed: default adottato nel piano (D7) |
| 5 | Telefono orizzontale (844×390): la parete alta 440 px lascia poco spazio sotto la nav. **Default:** altezza della parete `min(440px, 60svh)` | AC14 | Omar | Closed: default adottato nel piano (D8) |
| 6 | Le schermate invecchiano quando i siti cambiano: chi le aggiorna e quando? **Default:** solo schermate di lavoro di Omar (AC3), che non cambiano con i siti dei clienti | AC3 | Omar | Open |

---

## Decision Log

| Decision | Rationale |
|----------|-----------|
| **Righe e schermate (Omar, 2026-11-13):** "Product Engineer" per Young Platform, Devpunks e Start Franchising; "Con il mio team · 9 settimane" per Valueize; "Con il mio team" per SeVedemo. Tutte le schermate sono lavoro di Omar: niente nota per schermata (supera la nota di AC3) | Omar ha lavorato per tutti; chiude le domande 2 e 3 |
| Variante **Muro** del prototipo, testi stile "Chiavi" | Scelta di Omar tra Browser, Muro, Corsie, Provini e le varianti di testo |
| Titolo "Hanno scelto un Product Engineer." | Scelto da Omar; punto finale come gli altri h2 della home |
| Posizione: sotto l'hero, prima di "Per chi" | Provvisoria, da iterare (Omar) |
| Parete: altezza 440 px (300 px fino a 760 px), finestre larghe 300 px con spazio 24 px (200 / 16 px fino a 760 px), prospettiva 1600 px con origine 50% 30%, piano `rotateX(32deg) rotateZ(-14deg)`, seconda fila spostata di mezza finestra, maschera sfumata 14% ai lati (10% fino a 760 px) e 20% sopra e sotto | Valori del prototipo approvato |
| Tre file di 7 / 7 / 6 schermate, ogni fila mescola i clienti, tre copie per nastro | Valori del prototipo; il numero e la scelta delle schermate cambiano con AC3 |
| Elenco: bordo superiore 2 px `rgba(255,255,255,.14)`, nome 1.15rem/700 (1rem fino a 760 px), riga sotto 0.85rem `rgba(255,255,255,.55)` | Valori del prototipo; i colori degli stati accesi li decide AC7 |
| **Modifica approvata 1 (UX D1):** su touch il cliente si accende al `click` (tap fermo) e non al `pointerdown`; un nome con link apre al primo tap e non accende; tap di nuovo spegne; tap fuori spegne; mouse e tastiera invariati (click con `detail === 0` ignorato) | Prima il link chiedeva due tap e dopo Back la sezione restava accesa; uno scroll dalla parete accendeva un cliente. Approvata il 2026-11-13 |
| **Modifica approvata 2 (UI P2 + correzione meccanica):** "caso studio" su una riga sua a ogni larghezza (`display: block; white-space: nowrap`), senza il "·"; la voce dell'elenco è una griglia così il link la riempie; le tracce del nome restano in alto (`align-content: start`) così le righe si allineano | Prima tra 761 e 965 px la riga andava a capo cominciando con "·" e una striscia di 3.8–9.6 px accendeva senza aprire; il primo fix aveva sfalsato le righe di ~11 px. Approvata il 2026-11-13 |
