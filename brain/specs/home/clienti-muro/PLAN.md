---
domain: home
type: plan
links: ["[[specs/home/clienti-muro/SPEC]]", "[[specs/home/clienti-muro/FLOW]]", "[[chore/motion]]"]
created: 2026-11-13
updated: 2026-11-13
---

# Plan: Sezione clienti in home ("Muro")

Contratto: [[specs/home/clienti-muro/SPEC]] (AC1–AC15). Mappa: [[specs/home/clienti-muro/FLOW]]. Riferimento vivo: il prototipo `src/lab/loghi/` (`/lab/loghi`, solo dev).

## Situazione iniziale

- La home (`src/pages/index.astro`) va dall'hero (`<header class="hero">`, riga 22) a `#per-chi` (riga 45) e non ha una sezione clienti.
- Il prototipo approvato vive in `src/lab/loghi/`:
  - `V7Muro.astro` contiene markup e CSS;
  - `muro.ts` gestisce gli scatti e il cliente acceso;
  - `Harness.astro` arma l'entrata e definisce i keyframe;
  - `logos.ts` e `copy.ts` contengono i dati;
  - in `assets/screens/` ci sono 20 schermate 720×450.
- La rotta `/lab/[slug]` esiste solo in dev (`src/prototypes/integration.mjs:56`), e `src/lab/Lab.astro` importa direttamente `./loghi/Harness.astro`.
- I casi studio sono una content collection (`src/content.config.ts`):
  - `draft` vale `false` di default;
  - `meta.cliente` ha la forma `"<Nome> · <descrizione>"`;
  - SeVedemo ha 3 casi studio (`motion-design`, `offerte-ai`, `onboarding-saas`) e Valueize 1 (`dati-da-excel`);
  - `src/pages/case-study/[slug].astro:9` esclude le bozze.
- Il reveal del sito (`.reveal`, `global.css:64-70`, osservatore in `Base.astro:87-99`) nasconde i contenuti anche senza JS.
- Non ci sono test runner, lint o typecheck. L'unico gate è `npm run build`.
- Backlog: nessun tracker collegato al repo (remote GitHub `omardeangelis/product-service`, senza issue di riferimento).

## Problema

Portare in produzione la sezione approvata sul prototipo, con i dati veri: clienti confermati, righe di rapporto vere, link costruiti dai casi studio pubblicati. Bisogna anche correggere ciò che le review hanno trovato (AC7, AC13, AC14) e i rischi di performance della parete. Poi va cancellato il prototipo.

## Forma della soluzione

1. **Dati clienti in produzione**, in un modulo dati con i propri asset:
   - per ogni cliente: nome, colore, colore del bordo del nome, riga di rapporto con una conferma esplicita, e schermate, ciascuna con la nota del lavoro fatto;
   - una funzione ricava da ogni cliente il link e l'etichetta, a partire dai casi studio pubblicati;
   - la funzione esclude i clienti senza riga confermata e le schermate senza nota.
2. **Un componente di sezione** (`.astro`, senza JS di framework) con il markup e il CSS del prototipo e le correzioni della spec, montato in home tra hero e "Per chi".
3. **Uno script vanilla** che porta `muro.ts`:
   - gli scatti si fermano quando non servono;
   - l'accensione segue le regole approvate per mouse, touch e tastiera;
   - l'entrata è armata da uno script inline.
4. **Verifica nel browser** contro AC1–AC15, poi le prove a mano sul dispositivo, poi la cancellazione del prototipo.

## Registro delle decisioni

| # | Decisione | Fonte |
|---|---|---|
| D1 | Omar ha il consenso di tutti i clienti (YP, Valueize, Devpunks, Start Franchising, SeVedemo): la domanda 1 della spec è chiusa | Omar, 2026-11-13 |
| D2 | SeVedemo entra tra i nomi (domanda 3 chiusa, AC4) | Omar, 2026-11-13 |
| D3 | Le schermate attuali del prototipo sono lavoro di Omar e restano (AC3 soddisfatto); la nota per schermata la scrive T0 | Omar, 2026-11-13 |
| D4 | Le righe di rapporto di YP, Devpunks, Start Franchising e SeVedemo le scrive Omar (T0). Finché una riga non è confermata, quel cliente non compare (AC6). Anche la riga di Valueize la conferma T0. **Nessun rilascio della sezione prima di T0**: senza T0 mancherebbe SeVedemo (AC4) | Omar, 2026-11-13; gate del piano |
| D5 | Testi di AC2 ai default della spec: etichetta "Clienti", nessuna riga a destra, "caso studio →" | Default spec (UX D4) |
| D6 | AC7: nessuna attenuazione degli altri nomi. Il cliente acceso ha il bordo superiore nel suo colore e la riga sotto il nome in `#fff` | Default spec (UI P1), confermato da design-engineer |
| D7 | Bordo del nome Devpunks `#5543ff` (3.12:1); il blu di marca `#2b14ff` resta sull'anello delle schermate | Default spec, domanda 4 |
| D8 | Parete sopra 760 px alta `min(440px, 60svh)` | Default spec, domanda 5 |
| D9 | Link per un cliente: 1 caso studio pubblicato → la sua pagina, con "caso studio →"; 2 o più → `/#shipped`, con "N casi studio ↓"; nessuno → nessun link e nessuna etichetta | AC4, AC5 |
| D10 | Entrata: approccio armato (`data-armed` / `data-in`) limitato alla sezione, non `.reveal`. `data-armed` lo mette uno script `is:inline` subito dopo la `<section>` | design-engineer, AC13 |
| D11 | Con reduced motion l'entrata è una dissolvenza `--dur-swap` `linear` (non `--dur-reveal`), come `.reveal`. Il Motion brief della spec è già corretto di conseguenza | design-engineer (correzione del brief) |
| D12 | Anello e ombra profonda della schermata accesa su un `::after`: si anima solo la sua `opacity`, mai `box-shadow` | design-engineer |
| D13 | Immagini con `<Image>` di `astro:assets`: webp 600w/400w, `sizes` 300px/200px, `width=720 height=450`, `decoding="async"`, `loading="lazy"` | design-engineer |
| D14 | Nessun `will-change` di base. Il ciclo `requestAnimationFrame` si ferma fuori schermo, con la tab nascosta e con reduced motion, e riparte dagli eventi | design-engineer |
| D15 | Hover `scale(1.06)` sulle schermate: deviazione voluta dallo standard dell'1–2%, da registrare in `brain/chore/motion.md` | design-engineer |
| D16 | Nessun test runner nuovo. Il RED di ogni compito è un controllo fallito su `dist/` (dopo `npm run build`) o nel browser con `agent-browser` | Repo: niente test configurati |
| D19 | Ogni cliente di un caso studio pubblicato deve avere una voce nei dati: se manca, la build fallisce (AC4) | Gate del piano |
| D20 | Le schermate sono importate come `ImageMetadata` (`import.meta.glob` su `src/assets/clienti/`), non come stringhe, perché `<Image>` le richiede | Gate del piano |
| D21 | Su touch il cliente si spegne con un `click` fermo fuori dalla sezione, non con il `pointerdown`: uno scroll fuori non spegne niente (AC9: "tap fuori") | Gate del piano |
| D17 | Sulla sezione `overflow: hidden` prima di `overflow: clip` (fallback per Safari < 16, costo nullo) | UI review, Constraints |
| D18 | Cancellare il prototipo vuol dire, come dice la spec: `src/lab/loghi/`, `src/lab/Lab.astro` e la rotta `/lab/[slug]` (`src/prototypes/integration.mjs:56`). Un lab futuro la ricrea. Gli screenshot `loghi-01-top.png` e `loghi-02-section.png` in radice si cancellano solo con l'OK di Omar | Hard Rule 5 di prototype |

**Assunzioni:**
- Il nome del cliente si confronta con la parte di `meta.cliente` prima di " · ".
- SeVedemo non ha schermate nel prototipo: compare solo tra i nomi, salvo che T0 ne fornisca (AC3 lo consente).
- Il resize oltre i 760 px avviene senza transizione sugli scatti.

**Ancora aperta:** domanda 6 (chi aggiorna le schermate). Non blocca: per D3 le schermate sono lavoro di Omar.

## Cosa ho trovato nel codice

- `V7Muro.astro:287-289` (attenuazione `.4`) va tolto, e dalla transizione di `.v7-name` va tolta `opacity` (D6).
- `muro.ts` lascia girare `requestAnimationFrame` anche fuori schermo e con reduced motion: va fermato (D14).
- `Harness.astro:65-76` arma l'entrata dal modulo differito: con la sezione già a schermo al caricamento, il contenuto lampeggia (D10).
- I nastri sono larghi 3 copie × (7 × 324 px), circa 6780 px: è il rischio principale su iOS (T6).
- `logos.ts` contiene `mask`, `color`, `home`, `page`, `site`, `sector`, `w/h/cw/ch`, che la sezione non usa: non si portano in produzione.

## Ricerca esterna

Nessuna: tutto è CSS e JS vanilla su API stabili (`IntersectionObserver`, `visibilitychange`, `matchMedia(...).addEventListener('change')`, `astro:assets` `<Image>`).

## Compiti

### T0: Righe di rapporto vere e note sulle schermate (Omar)

- **depends_on**: [T1]
- **location**: `src/data/clienti.ts` (campi `line`, `confirmed`, nota `work` per schermata), creato da T1. Omar può anche dare i testi all'agente, che li inserisce
- **description**: Omar scrive, per Young Platform, Devpunks, Start Franchising e SeVedemo, la riga di rapporto (modalità · durata) e conferma quella di Valueize ("Con il mio team · 9 settimane"). Per ognuna delle 20 schermate scrive una nota breve sul lavoro fatto. Per SeVedemo indica se ci sono schermate da usare e qual è il colore di marca.
- **validation**: ogni cliente in `src/data/clienti.ts` ha `confirmed: true` e una `line` non vuota; ogni schermata ha `work`; nessuna riga di `copy.ts` del prototipo è riusata senza conferma (AC6).
- **status**: Done
- **log**: 2026-11-13, righe date da Omar ("Product Engineer" per YP, Devpunks, Start Franchising; "Con il mio team · 9 settimane" Valueize; "Con il mio team" SeVedemo), tutti confermati. Niente nota per schermata: Omar conferma che sono tutte lavoro suo, quindi il campo `work` e il suo filtro sono tolti da `src/data/clienti.ts`. SeVedemo senza schermate e con colore provvisorio `#9aa3b5`. Immagini: `widths` 400/720 e `sizes` 300px/450px invece di 600w/300px (D13), perché la prospettiva ingrandisce le schermate davanti e la 600w risultava sfocata.
- **files edited/created**: `src/data/clienti.ts`, `src/components/Clienti.astro` (widths/sizes)
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: prima di T0 la home in `dist/` non mostra nessun cliente, perché nessuno è confermato; dopo T0 ne mostra 5.
- **review_mode**: cli
- **complexity**: low

### T1: Dati clienti e link dai casi studio pubblicati

- **depends_on**: []
- **location**: `src/data/clienti.ts` (nuovo), `src/assets/clienti/` (schermate spostate da `src/lab/loghi/assets/screens/`, copiate e non mosse finché T7 non cancella il prototipo)
- **description**:
  - Elenco dei 5 clienti nell'ordine di visualizzazione: YP, Valueize, Devpunks, Start Franchising, SeVedemo. Per ognuno: `name`, `tint`, `nameTint` (Devpunks `#5543ff`, D7), `line`, `confirmed`, `screens[]` (`src`, `label`, `work`).
  - Una funzione pubblica che, dati i clienti e i casi studio pubblicati (`getCollection` filtrato su `!draft`), restituisce i clienti da mostrare:
    - esclude i clienti con `confirmed: false` o senza `line`, e le schermate senza `work` (AC3, AC6);
    - aggiunge `href` e `caseLabel` secondo D9 (AC4, AC5).
  - Tutti i clienti partono con `confirmed: false`, Valueize compreso (riga proposta "Con il mio team · 9 settimane"): li conferma T0 (AC6).
  - La build fallisce con un messaggio chiaro se un cliente di un caso studio pubblicato (la parte di `meta.cliente` prima di " · ") non ha una voce nei dati (D19).
  - Le schermate si importano come `ImageMetadata` con `import.meta.glob` da `src/assets/clienti/` (D20).
- **validation**:
  - `npm run build` passa;
  - con `confirmed: true` temporaneo su Valueize, un controllo su `dist/index.html` trova Valueize con il link a `/case-study/dati-da-excel` e "caso studio →";
  - cambiando per prova il nome di SeVedemo nei dati, la build fallisce e il messaggio nomina il cliente mancante (D19). Ripristinare dopo;
  - con `draft: true` temporaneo su `dati-da-excel.md`, la build passa e Valueize compare senza link e senza "caso studio" (AC5). Ripristinare il file dopo.
- **status**: Done
- **log**: 2026-11-13, worker sonnet, review passata al primo giro. Build verde; nome SeVedemo cambiato per prova → build fallisce con "Cliente senza scheda in CLIENTI: SeVedemo"; tutti non confermati → []; Valueize confermato → `/case-study/dati-da-excel` + "caso studio →"; SeVedemo → `/#shipped` + "3 casi studio ↓"; `dati-da-excel` in bozza → Valueize senza link. Modifiche di prova ripristinate.
- **files edited/created**: `src/data/clienti.ts`, `src/assets/clienti/` (20 jpg copiati)
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: con Valueize confermato per prova e `dati-da-excel` in bozza, la voce Valueize della home non ha un `<a>` (oggi fallisce: la sezione non esiste).
- **review_mode**: cli
- **complexity**: medium

### T2: Sezione statica in home (markup, CSS, immagini)

- **depends_on**: [T1]
- **location**: `src/components/Clienti.astro` (nuovo), `src/pages/index.astro` (montaggio tra `</header>` e `<section id="per-chi">`)
- **description**:
  - **Struttura e testi:** porta markup e CSS di `src/lab/loghi/V7Muro.astro` con i valori del Decision Log della spec. `<section aria-labelledby>` sull'h2 "Hanno scelto un Product Engineer.", con l'etichetta "Clienti" e senza riga a destra (AC1, AC2).
  - **Parete:** le file si compongono dalle schermate filtrate da T1, mescolando i clienti come nel prototipo. Parete `aria-hidden`, schermate senza link, senza handler e senza `cursor: pointer` (AC11).
  - **Elenco:** 4 colonne sopra 760 px e 2 fino a 760. `li` con `display: grid`, `.v7-name` con `align-content: start`, etichetta del caso studio `display: block; white-space: nowrap` (AC14).
  - **Contenitore e altezza:** `overflow: hidden` e poi `overflow: clip` sulla sezione (D17). Parete sopra 760 px alta `min(440px, 60svh)` (D8).
  - **Stili dello stato acceso** (pilotati da un attributo sulla sezione, senza JS in questo compito):
    - schermate degli altri clienti a `.18`;
    - anello e ombra della schermata accesa su `::after`, con transizione della sola `opacity` (D12);
    - nome acceso con bordo superiore `nameTint` e riga sotto il nome in `#fff`;
    - nessuna attenuazione degli altri nomi (AC7, D6);
    - transizioni `--dur-ui` `--ease-out`.
  - **Immagini e motion:** `<Image>` come da D13. Hover `scale(1.06)` solo con `(hover: hover) and (pointer: fine)`. Nessun motion d'ingresso in questo compito.
- **validation**:
  - con agent-browser a 280, 375, 760, 761, 914, 1440 px, a 1× e 1.25×, e a 844×390:
    - nessuno scorrimento orizzontale causato dalla sezione;
    - righe sotto i nomi allineate per riga della griglia;
    - "caso studio →" su una riga sua;
    - la voce di Valueize è coperta tutta dal link (AC14);
  - forzando l'attributo di stato acceso per ogni cliente, ogni testo dell'elenco misura almeno 4.5:1 su #0f1626 (AC7);
  - l'albero di accessibilità mostra la regione col nome del titolo e la parete nascosta (AC1, AC11);
  - stato acceso forzato: il `::after` della schermata accesa ha `opacity` 1 e un anello di 2 px nel colore del cliente (AC8); su ogni schermata il `cursor` calcolato non è `pointer` (AC11);
  - a 280 e 1440 px, con il focus su ogni link dell'elenco: il riquadro del contorno bianco di 2 px sta tutto dentro il riquadro di ritaglio della sezione, e il punto al centro di ciascun lato del contorno colpisce il link o il suo contorno, non un altro elemento (AC10);
  - `npm run build` passa.
- **status**: Done
- **log**: 2026-11-13, worker sonnet, review passata al primo giro. Build verde; senza clienti confermati la sezione non è nel markup. Con tutti i clienti confermati per prova (backup del file dati in scratchpad), Chromium 1× a 280, 375, 760, 761, 914, 1440 e 844×390: overflow orizzontale 0; 2 colonne ≤760 e 4 sopra; "caso studio →" su una riga sua; link pari alla voce; righe allineate (a 280 tranne dove il nome va su due righe, eccezione di AC14); contrasto minimo 6.11:1 in ogni stato acceso; `::after` a opacità 1 con anello 2px nel colore del cliente, altre schermate .18; `cursor` auto sulla parete; contorno del focus dentro la sezione; parete 234px a 844×390. Stato acceso per N clienti con selettori generati in un `<style is:global>`. 1.25× non provato (la emulazione non lo offre): resta a T5.
- **files edited/created**: `src/components/Clienti.astro`, `src/pages/index.astro` (import + `<Clienti />`)
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: in `dist/index.html` esiste una `section` con `aria-labelledby` che punta a un h2 col testo "Hanno scelto un Product Engineer.", posta dopo l'hero e prima di `#per-chi`.
- **review_mode**: browser
- **assigned_skills**: agent-browser, ui-review
- **complexity**: medium

### T3: Script: scatti, cliente acceso, entrata

- **depends_on**: [T2]
- **location**: `src/components/Clienti.astro` (`<script>` del modulo + `<script is:inline>` dopo la `<section>`), oppure `src/scripts/clienti.ts` importato dal componente
- **description**: porta `src/lab/loghi/muro.ts` e l'armatura di `Harness.astro`, con queste regole.
  - **Scatti (AC12):**
    - periodi 2600 / 3200 / 2900 ms, primo scatto sfalsato di 400 ms per fila, direzioni alternate;
    - translateX di una finestra, `--dur-reveal` `--ease-out-expo`;
    - ritorno al centro senza transizione;
    - fermi con la sezione sotto il 25% di visibilità, con la tab nascosta, con il mouse sulla parete e con reduced motion. Lo scatto in corso finisce.
    - Il ciclo `requestAnimationFrame` si ferma davvero in quei casi e riparte da `IntersectionObserver`, `visibilitychange` e dal `change` di `matchMedia` (D14).
    - Il cambio di larghezza oltre i 760 px si applica senza transizione.
  - **Cliente acceso, mouse (AC8):**
    - hover su un nome o una schermata accende;
    - sulla parete le file si fermano e tra due schermate resta acceso l'ultimo cliente;
    - sui nomi le file continuano.
  - **Cliente acceso, touch (AC9):**
    - accensione al `click` (tap fermo), non al `pointerdown`;
    - lo stesso tap di nuovo spegne; un `click` fermo fuori dalla sezione spegne, uno scroll fuori no (D21);
    - un nome con link non accende e apre al primo tap.
  - **Cliente acceso, tastiera (AC10):**
    - accende solo il `:focus-visible` e spegne al `focusout`;
    - un `click` con `detail === 0` viene ignorato;
    - dopo Back niente è acceso (gestire `pageshow` con `persisted`, così la bfcache non conserva lo stato).
  - **Entrata (AC12, AC13, D10, D11):**
    - uno script inline mette `data-armed` prima del primo paint; l'`IntersectionObserver` a 0.15 mette `data-in`, una sola volta;
    - parete con `--dur-showpiece`, `--ease-out-expo`, ritardo `--stagger`, da `translateY(80px) rotateX(64deg) rotateZ(-14deg)` e `opacity 0`;
    - intestazione in dissolvenza `--dur-reveal` con ritardo `--stagger`; elenco con ritardo `calc(var(--stagger) * 4)`;
    - con reduced motion: dissolvenza `--dur-swap` `linear` con gli stessi ritardi, senza sollevamento e senza scatti.
- **validation**: con agent-browser:
  - **mouse (AC8):** hover su ciascun nome → `data-hot` giusto e schermate degli altri a .18; uscita → nessun `data-hot`; hover sulla parete → `--k` fermo.
  - **touch (AC9),** emulazione a 390×844 con `Input.dispatchTouchEvent`:
    - tap su un nome senza link → acceso; di nuovo → spento;
    - swipe dalla parete → niente; swipe che parte dai nomi → niente;
    - con un cliente acceso: tap fuori dalla sezione → spento; swipe fuori dalla sezione → resta acceso;
    - tap su Valueize → si apre `/case-study/dati-da-excel`; Back → nessun `data-hot`.
  - **tastiera (AC10):** Tab dall'hero arriva al primo link della sezione, che si accende; ogni Tab successivo passa al link seguente dell'elenco, senza fermate intermedie dentro una voce, e dall'ultimo esce verso "Per chi"; Invio apre; Back → niente acceso.
  - **click col mouse su una schermata (AC11):** l'URL non cambia.
  - **senza JS (AC13):** sezione visibile, niente acceso.
  - **reload con la sezione già a schermo:** `data-armed` è sulla sezione già a `DOMContentLoaded`, e nella traccia Performance non c'è un paint della sezione prima che `data-armed` sia applicato.
  - **reduced motion emulato (AC12):** la parete non si muove e l'accensione funziona.
  - **fuori schermo (D14):** nessuna callback di `requestAnimationFrame` per 2 s.
- **status**: Done
- **log**: 2026-11-13, worker sul tier high (modello del supervisore), review passata al primo giro. design-engineer non richiamato: i valori sono quelli già fissati con lui in create-plan (D10–D15). Verifica in agent-browser 0.27.1 (Chromium headless; il pannello del browser dell'app era nascosto e lì IntersectionObserver e rAF non girano), con tutti i clienti confermati per prova: `data-armed` presente prima dello scroll con parete a opacità 0, `data-in` dopo; scatti in 15 s con periodi misurati 2620/3217/2900 ms, primi scatti a 2.7/3.7/3.8 s, direzioni alternate; ritorno al centro dopo il giro; fuori schermo 0 callback rAF in 2 s e `--k` fermo; hover su un nome → `data-hot` e `data-on` giusti, uscita → spento; mouse sulla parete → acceso il cliente della schermata e `--k` fermo per 4 s; click col mouse su una schermata → URL invariato; Tab dall'hero → Valueize (acceso, contorno 2px) → SeVedemo → "Scale-up" (spento); Invio apre il caso studio, Back → niente acceso; touch con eventi sintetici a 390×844: tap accende, di nuovo spegne, tap su schermata accende, tap fuori spegne, swipe da parete/nomi non accende, swipe fuori non spegne, tap su Valueize apre al primo tap senza accendere, Back → a riposo; reduced motion emulato: entrata `clienti-fade` 400ms linear con ritardi 100/100/400 ms, `--k` mai impostato in 6 s, accensione funzionante; senza reduced motion: parete `clienti-rise` 800ms expo ritardo 100ms, intestazione ed elenco 700ms expo ritardi 100/400 ms. Senza JS: nel markup di `dist/` la sezione non ha `data-armed` (lo mette solo lo script inline subito dopo `</section>`). Touch reale e traccia Performance del primo paint non provati: restano a T5/T6.
- **files edited/created**: `src/scripts/clienti.ts` (nuovo), `src/components/Clienti.astro` (script inline di armatura, `<script>` del modulo, CSS d'entrata)
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: su touch emulato, un solo tap sul link di Valueize porta a `/case-study/dati-da-excel` e, tornando indietro, la sezione non ha `data-hot`.
- **review_mode**: browser
- **assigned_skills**: agent-browser, design-engineering
- **complexity**: high

### T4: Registrare le deviazioni di motion

- **depends_on**: [T3]
- **location**: `brain/chore/motion.md`
- **description**:
  - In "Deviazioni volute" aggiunge:
    - l'hover `scale(1.06)` sulle schermate della parete (decorative, inclinate in prospettiva);
    - l'entrata della parete a `--dur-showpiece`, che diventa il secondo pezzo forte della home;
    - gli scatti ambient a `--dur-reveal`.
  - In "Aperto" annota che la sezione clienti usa l'armatura via script e non `.reveal`.
- **validation**: le tre righe sono presenti con valori e motivo; nessun altro file cambia.
- **status**: Done
- **log**: 2026-11-13, worker haiku, review passata. Tre deviazioni (scale 1.06, entrata a `--dur-showpiece`, scatti a `--dur-reveal`) e la nota in "Aperto" presenti con valori e motivo; cambia solo `brain/chore/motion.md`.
- **files edited/created**: `brain/chore/motion.md`
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: `brain/chore/motion.md` cita `scale(1.06)` e la sezione clienti (oggi no).
- **review_mode**: cli
- **complexity**: low

### T5: Verifica completa nel browser e build

- **depends_on**: [T0, T3]
- **location**: home (`/`) in dev e in `npm run preview`. È il gate di merge: la sezione non va in produzione prima che T5 sia chiuso
- **description**: un passaggio di verifica su tutta la spec, con i dati veri di T0.
  - **Tutti i clienti:** compaiono 5 clienti. SeVedemo ha "3 casi studio ↓" verso `/#shipped`, e solo Valueize ha "caso studio →" (AC4, AC6).
  - **Testi:** nessuna contraddizione tra intestazione e righe, e "team" ha un solo significato (AC2).
  - **Controlli di T2 e T3:** ripetuti a 280–1440 px, a 1× e 1.25×, e a 844×390, con il contrasto in ogni stato acceso (AC7, AC14).
  - **Nomi accessibili:** il nome accessibile dei link contiene il testo visibile senza parole attaccate (AC15, parte automatica).
  - **Motion:**
    - riproduzione al 10% nel pannello Animations: inizio veloce e coda lunga; ritardi 100/100/400 ms;
    - 15 s a velocità piena, registrando gli istanti di cambio di `--k` per fila: nessuno scatto di due file cade nello stesso intervallo di 100 ms per più di 2 volte di fila; al ritorno al centro lo screenshot prima e dopo è identico;
    - Paint flashing: la parete non ridipinge durante uno scatto. Se ridipinge, si sostituisce `mask-image` con quattro sfumature `--ink` sovrapposte;
    - con CPU rallentata 4×: nessun frame lungo durante gli scatti;
    - con rete lenta: nessuna finestra bianca al primo scatto.
  - **Build:** `npm run build` passa e `dist/` non contiene nulla di `src/lab/`.
- **validation**: ogni AC da AC1 ad AC14 ha un esito annotato nel `log` del compito; AC15 ha la parte automatica e rimanda a T6 per gli screen reader.
- **status**: In progress (sbloccato da T0)
- **log**: 2026-11-13, parte anticipata con dati di prova (tutti confermati per prova, poi ripristinati dal backup): AC1 regione col nome del titolo, parete assente dall'albero di accessibilità; AC15 parte automatica: nomi accessibili "Valueize Con il mio team · 9 settimane caso studio →" e "SeVedemo … 3 casi studio ↓", senza parole attaccate; AC14 a 1.25× simulato con le larghezze CSS equivalenti (1152, 731, 609, 608, 300, 224): a 224 la colonna di destra spingeva il link a 1 px dal bordo e tagliava il contorno del focus → correzione del supervisore: elenco su una colonna sotto i 260 px (deviazione da "2 colonne fino a 760", vedi IMPLEMENTATION-NOTES); dopo la correzione tutto passa. Lo scorrimento orizzontale sotto i 280 px resta, ma lo causa `#problema` (tab-list a 256 px), non questa sezione. Da fare con i dati veri di T0: 5 clienti, testi (AC2), paint flashing, CPU 4×, rete lenta, 15 s di scatti sincronizzati.
- **files edited/created**: `src/components/Clienti.astro` (media query sotto i 260 px)
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: in `dist/index.html` la sezione elenca 5 clienti, e solo SeVedemo e Valueize hanno un link.
- **review_mode**: mixed
- **assigned_skills**: agent-browser, ui-review, design-engineering
- **complexity**: medium

### T6: Prove a mano su dispositivo e screen reader (Omar)

- **depends_on**: [T5]
- **location**: home in preview sulla rete locale, o in un deploy di anteprima
- **description**: le verifiche della sezione Constraints della spec.
  - **iPhone Safari:**
    - tap su "Young Platform": si accende; di nuovo: si spegne;
    - tap su una schermata: si accende il suo cliente;
    - swipe verticale dalla parete: niente si accende;
    - tap su Valueize: si apre al primo tap.
  - **Nitidezza:** parete nitida mentre scatta, a 375 px e su iPad orizzontale.
  - **Screen reader:**
    - VoiceOver su macOS: Landmarks e lettura del link;
    - VoiceOver iOS e TalkBack: un solo doppio tap apre (AC15);
    - NVDA in modalità lettura.
  - **Rimedi già decisi, se una prova fallisce:**
    - tap che non accendono → `cursor: pointer` su voci e schermate solo con `(hover: none)`;
    - parete sfocata → 2 copie per nastro, con ogni fila che parte dalla copia rivolta nella sua direzione (circa 4536 px).
- **validation**: ogni prova ha un esito nel `log`; ogni rimedio applicato è ripassato nel browser secondo T5.
- **status**: Done
- **log**: 2026-11-13: Omar ha fatto le prove sui dispositivi e vanno bene; nessun rimedio necessario.
- **files edited/created**:
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: su iPhone Safari un solo tap su Valueize apre il caso studio.
- **review_mode**: browser
- **assigned_skills**: agent-browser
- **complexity**: low

### T7: Cancellare il prototipo

- **depends_on**: [T6]
- **location**: `src/lab/`, `src/prototypes/integration.mjs`
- **description**:
  - Cancella `src/lab/loghi/`, review e `CHANGES.md` compresi.
  - Cancella `src/lab/Lab.astro` (e la cartella `src/lab/`, se resta vuota) e la riga `injectRoute({ pattern: '/lab/[slug]', ... })` in `src/prototypes/integration.mjs` con il suo commento (D18).
  - Chiede a Omar se cancellare `loghi-01-top.png` e `loghi-02-section.png` in radice (D18).
- **validation**:
  - `npm run build` passa;
  - `npm run dev` parte senza errori;
  - `grep -rn "src/lab\|lab/loghi\|/lab/" src` non trova niente;
  - `dist/` non contiene `lab`;
  - `/lab/loghi` in dev risponde 404;
  - screenshot della home in dev a 1440 e 375 px identici a quelli presi prima della cancellazione.
- **status**: Done
- **log**: 2026-11-13: con l'OK di Omar cancellati `loghi-01-top.png` e `loghi-02-section.png` in radice. Poi, su richiesta di Omar dopo il merge della PR #1 e prima di T6, cancellati `src/lab/` e la rotta `/lab/[slug]`. Verificato: build passa, `grep` su `src` vuoto, `dist/` senza `lab`, home in dev invariata. Non verificato: il 404 di `/lab/loghi` in dev, perché il server già avviato tiene la rotta finché non riparte (oggi risponde 500).
- **files edited/created**: `src/lab/` (cancellata), `src/prototypes/integration.mjs`
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: `src/lab/loghi/` non esiste e la build passa.
- **review_mode**: cli
- **complexity**: low

## Grafo delle dipendenze e ondate

```
T0 (Omar) ─────────────┐
T1 ─→ T2 ─→ T3 ─┬─→ T5 ─→ T6 (Omar) ─→ T7
                └─→ T4
```

| Ondata | Compiti | Note |
|---|---|---|
| 1 | T0, T1 | T0 è di Omar e va in parallelo con lo sviluppo |
| 2 | T2 | |
| 3 | T3 | |
| 4 | T4, T5 | T5 aspetta anche T0 |
| 5 | T6 | Omar, su dispositivo |
| 6 | T7 | Solo quando l'implementazione è in produzione |

## Strategia di test

- Non c'è un test runner e il piano non ne aggiunge uno (D16). Ogni compito parte da un controllo che oggi fallisce:
  - un'asserzione su `dist/index.html` dopo `npm run build`, per dati e markup;
  - un percorso in agent-browser, per interazioni, layout e motion.
- I controlli nel browser coprono 280, 375, 760, 761, 914 e 1440 px, a 1× e 1.25×, più 844×390. Gli stati accesi si forzano per ogni cliente.
- Le prove che il browser headless non copre (Safari iOS, screen reader) sono in T6 e le fa Omar.

## Rischi e mitigazioni

| Rischio | Mitigazione |
|---|---|
| Nastri larghi circa 6780 px sfocati o con tessere mancanti su iOS | T6 lo verifica; il rimedio già deciso è passare a 2 copie per nastro |
| `box-shadow` animato su 60 finestre | Anello e ombra su `::after`, si anima solo l'opacità (D12) |
| La maschera ridipinge a ogni scatto | Paint flashing in T5; in quel caso, sfumature sovrapposte al posto di `mask-image` |
| La sezione lampeggia al caricamento | `data-armed` messo da uno script inline (D10), verificato in T3 |
| T0 arriva tardi | Nessun rilascio prima di T0 (D4): lo sviluppo va avanti, la sezione esce solo dopo T5. Senza T0 mancherebbero SeVedemo (AC4) e la conferma delle righe (AC6) |
| Un caso studio torna in bozza | I link sono ricavati dai casi studio pubblicati (D9), verificato in T1 |
| La bfcache conserva lo stato acceso dopo Back | Gestione di `pageshow` in T3, verificata dal percorso Back |

## Gate di validazione

- Dopo T1, T2 e T3: `npm run build` passa.
- Dopo T5: ogni AC ha un esito annotato. T5 chiuso, e quindi T0 fatto, è la condizione per il merge.
- Prima di T7: T6 è chiuso e Omar ha dato l'OK.
- Review del codice: con `review.mode: plan` non parte da sola. Si può chiedere `/adversarial-review` alla fine di `implement-spec`.

## Domande non risolte

- Domanda 6 della spec: chi aggiorna le schermate quando i siti dei clienti cambiano. Non blocca.
- SeVedemo: schermate e colore di marca, in T0. Senza schermate compare solo tra i nomi.
