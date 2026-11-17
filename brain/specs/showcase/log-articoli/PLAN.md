---
domain: showcase
type: plan
links: ["[[specs/showcase/log-articoli/SPEC]]", "[[specs/showcase/log-articoli/FLOW]]", "[[chore/motion]]", "[[domains/sito/sito-contract]]", "[[feature-improvement/_unscoped/_unscoped]]"]
created: 2026-11-16
updated: 2026-11-16
---

# Plan: Showcase, gli articoli in home e nella pagina /showcase ("Fila")

Contratto: [[specs/showcase/log-articoli/SPEC]] (AC1–AC31). Mappa: [[specs/showcase/log-articoli/FLOW]]. Riferimento vivo: il prototipo `src/lab/showcase/` (`/lab/showcase`, solo in dev), con le review `UX-REVIEW.md` e `UI-REVIEW.md` accanto. Non c'è `STATES.md`: lo state sweep non è stato fatto. Gli stati da raggiungere vengono dalla tabella States di `FLOW.md` e si ottengono con gli articoli segnaposto (T2).

Il gate del piano è stato eseguito da `adversarial-verifier` il 2026-11-16: DO NOT SHIP, con 0 blocker, 6 major, 9 minor e 4 nit. Ogni rilievo è integrato qui sotto (D2, D6, D8, D12, D16, D17, D19, D24, D28, e le validazioni di T1, T4–T11, T14, T16, T18). I valori di motion vengono da `design-engineer` (D26, D27, T13).

## Situazione iniziale

- **Sezione 04 di oggi.** È in `src/pages/index.astro:221-275`. Una fila pinnata, con lo scroll verticale trasformato in orizzontale, mostra i 4 casi studio ordinati per `order`.
  - Il CSS è a `index.astro:700-790`, il suo script a `index.astro:1022-1059`. Usa i campi `home.*` dei casi studio.
  - L'hero porta a `#shipped` (`index.astro:35`).
  - L'eyebrow «04» usa `.eyebrow .num { color: var(--accent) }` (`global.css:56`), che sul fondo scuro misura 3,07:1.
- **Casi studio.** Collection `case-studies` (`src/content.config.ts`).
  - `published` e `updated` sono facoltativi (`isoDay`, una stringa `YYYY-MM-DD` tra virgolette) e nessuno dei 4 li ha.
  - Non c'è un campo per la copertina.
  - `meta.cliente` ha la forma `"<Progetto> · <descrizione>"`.
  - Il primo di `home.metrics` è il numero della scheda (`~30s`, `162`, `3`, `6,4×`).
- **Pagina del caso studio.** È `src/pages/case-study/[slug].astro`.
  - Costruisce da sé l'`Article` JSON-LD (righe 20-33) e usa `nav="case-study"` di `Base.astro`.
  - Il pulsante «Altri casi studio» punta a `/#shipped` (riga 390).
- **Layout.** `src/layouts/Base.astro`:
  - il canonical è il solo percorso;
  - `og:type` arriva da una prop;
  - il JSON-LD si scrive con `ldJson` di `src/seo.ts`, che oggi fa l'escape del solo `<`;
  - il link di ritorno dei casi studio va a `/#shipped` (riga 68) e la voce «Showcase» della nav a `/#shipped` (riga 73);
  - la prop `active` accetta solo `'pricing'`;
  - non c'è nessun `<link rel="alternate">`.
- **Sitemap.** Il filtro di `astro.config.mjs` esclude le pagine `noindex` leggendo `dist/<percorso>/index.html`. Gli endpoint non HTML, come `/llms.txt`, non entrano nella sitemap: verificato su `dist/` di oggi, che ha 7 URL.
- **`/llms.txt`** (`src/pages/llms.txt.ts`): la riga «Home» dice «…e i casi studio». Non c'è una sezione Showcase.
- **Il prototipo** contiene cose da prendere e cose da lasciare:
  - si prendono le misure, i token `--t-*` per il fondo scuro e quello chiaro, il filtro (`lab.ts` → `bindTags`), le frecce (`variants.ts` → `bindStrip`), le entrate armate dallo script (`Harness.astro`, CSS globale) e la curva in SVG (`Media.astro`);
  - si lasciano i dati inventati (`data.ts`: 28 release, date, `TRACKS`), i controlli accesi sui video delle schede (`lab.ts:88`), la scheda finale che è una fermata di Tab e i testi che promettono una cadenza.
- **Media disponibili.**
  - Schermate in `public/case-studies/{dati-da-excel,offerte-ai,onboarding}/`.
  - Video `onboarding/onboarding.mp4` e `onboarding/resync.mp4`, entrambi senza poster.
  - Sul Mac non c'è `ffmpeg`; c'è `qlmanage`.
- **Strumenti.**
  - Non ci sono test runner, lint o typecheck: l'unico gate è `npm run build`, con Node 26 (`source ~/.nvm/nvm.sh && nvm use`).
  - `agent-browser` è disponibile. Può bloccare richieste (`network route --abort`), emulare reduced motion (`set media … reduced-motion`), registrare script di avvio (`--init-script`, `addinitscript`) e lanciare Chromium con argomenti (`--args`).
  - `xmllint` c'è.
- **Backlog.** Il remote è `omardeangelis/product-service` e nessun tracker è collegato. Ogni task ha `backlog_item_id: none` e `relation_mode: none`, fuori dall'enum dello schema: è una deviazione accettata, come nei piani di clienti-muro, confronto-ticket e un-posto-solo.

## Problema

La sezione 04 deve diventare il registro di tutto ciò che Omar scrive: casi studio e release, filtrabili per tag, con schede identiche. Il registro ha una pagina `/showcase/`, una pagina per ogni release, un feed RSS e la sua presenza nei dati strutturati, nella sitemap e in `/llms.txt`.

Le release non esistono ancora. Le scriverà Omar alla fine. Fino ad allora tutto si costruisce e si verifica con articoli segnaposto, che non devono poter andare online.

## Forma della soluzione

1. **Contenuto.**
   - Una seconda collection, `releases`, in `src/content/releases/<slug>.md`. Il frontmatter è validato e il corpo è in Markdown.
   - I casi studio guadagnano `cover`, e `published` diventa obbligatorio quando non sono in bozza.
   - Uno schema `media` condiviso descrive immagine, video con poster e curva.
   - Un elenco chiuso dei progetti sta in `src/config.ts`.
   - Una guardia blocca la build di produzione finché resta un segnaposto.
2. **Un solo elenco di articoli.** `src/data/articoli.ts` unisce casi studio e release in una forma unica, ordinata dal più recente. Lo usano home, `/showcase/`, il feed e `/llms.txt`.
   - I testi che cambiano con il filtro e la data stanno in `src/data/articoli-testi.ts`: etichette, annunci, date. È puro, quindi lo importano sia le pagine sia gli script del browser.
3. **Componenti condivisi** in `src/components/showcase/`: la scheda, la copertina, i filtri e il feed. La scheda è identica in home e in pagina; cambiano solo i token del tema, scuro o chiaro.
4. **Pagine.**
   - `src/pages/showcase/index.astro` è il muro per mesi.
   - `src/pages/showcase/[slug].astro` è la release.
   - `src/components/Showcase.astro` è la nuova sezione 04 in home.
5. **Script del browser.**
   - `src/scripts/showcase.ts` gestisce filtri, indirizzo, feed, date relative e rivela i controlli che servono solo con JS.
   - `src/scripts/fila.ts` gestisce frecce, ritorno all'inizio e annunci della fila in home.
   - Le entrate sono armate dallo script, come in `Clienti.astro`.
6. **Motori.**
   - `ldJson` diventa rigido e fa un autocontrollo in build.
   - Un `articleNode()` condiviso serve casi studio e release.
   - Il feed è `src/pages/rss.xml.ts`, scritto a mano con escape XML.
   - `/llms.txt` guadagna una sezione Showcase.
7. **Fine.**
   - Verifica completa sui segnaposto.
   - Omar scrive i contenuti veri.
   - Gate di lancio.
   - Prove a mano.
   - Cancellazione del prototipo.

## Registro delle decisioni

| # | Decisione | Fonte |
|---|---|---|
| D1 | Le release sono una content collection `releases` (`glob` su `src/content/releases/**/*.md`). Lo slug è il nome del file, quindi resta lo stesso anche se cambia il titolo (AC13). Il corpo è Markdown (`.md`) con HTML grezzo ammesso, per `<video>` e `<figure>`. Per ora niente MDX: si può aggiungere più avanti senza cambiare gli URL | Omar (grill, domanda 2): «può essere una grande feature come una piccola, contenere immagini video e tutto quello che un articolo richiede»; piano |
| D2 | Frontmatter di una release:<br>• `title`, al massimo 70 caratteri; il messaggio d'errore dice il limite e la lunghezza (AC25);<br>• `excerpt`, il testo breve, che ammette `<strong>` e `<em>` come i casi studio;<br>• `published` (`isoDay`);<br>• `project`, uno di `PROJECTS`;<br>• `cover?` (`media`);<br>• `metric?` con `{ value, label }`;<br>• `caseStudy?`, cioè `reference('case-studies')`;<br>• `draft`, falso di default.<br>Un corpo vuoto fa fallire la build (AC1). Un `.refine` vieta `caseStudy` su una release «Cliente in white label»: tutti i casi studio nominano il progetto, quindi il cliente sarebbe a un clic (AC2). **Astro 7.3.5 non fa fallire la build per un `reference()` a uno slug inesistente**: lo segnala con `[ERROR] Invalid content reference` ed esce con 0 (`node_modules/astro/dist/content/content-layer.js:286-326`). Per questo il controllo dello slug sta in `getArticles()` (D8) | spec AC1, AC2, AC13, AC25; piano |
| D3 | `PROJECTS` in `src/config.ts` contiene `['Valueize', 'SeVedemo', 'Cliente in white label']`, come `as const`. Un nome di cliente non può entrare per errore: per un progetto nuovo si aggiunge una voce qui (AC2) | piano |
| D4 | Lo schema `media` è condiviso tra casi studio e release ed è un'unione discriminata su `kind`:<br>• `img`: `{ src, alt, width?, height? }`;<br>• `video`: `{ src, poster, alt }`, con `poster` obbligatorio;<br>• `curve`: `{ value, alt }`, dove `value` è un `cubic-bezier(...)`.<br>Nelle schede il video è il suo poster in un `<img alt="">`, senza `<video>` (AC9, AC11). Nell'articolo è `<video controls playsinline preload="metadata" poster muted>`, che parte da solo quando è in vista e non con reduced motion (comportamento del prototipo approvato, `lab.ts:bindVideos`, senza riscrivere `controls`) | spec AC11, AC13; prototipo |
| D5 | I casi studio guadagnano `cover?` (`media`). `published` diventa obbligatorio quando `draft` è falso: si usa il `.refine` di zod 4 sull'oggetto, con `path: ['published']` e un messaggio che nomina il campo (AC1). Le copertine sono quelle del prototipo (D18) | spec AC1; Omar (grill, domanda 4) |
| D6 | **Segnaposto.** Ogni file che contiene un dato provvisorio ha una riga `# SEGNAPOSTO`: le release segnaposto. Le date dei casi studio sono vere (D29) e non ne hanno bisogno. All'inizio di `astro.config.mjs`, se `process.env.VERCEL_ENV === 'production'`, la config cerca `SEGNAPOSTO` in `src/content/**/*.md`. Se lo trova, lancia un `Error` con l'elenco dei file. In locale e nelle anteprime Vercel la build passa. La guardia cerca esattamente `# SEGNAPOSTO`, rispettando le maiuscole, così la parola «segnaposto» in un articolo vero non la fa scattare. Il gate di lancio (T16) controlla anche `grep -r '# SEGNAPOSTO' src/content`: se le variabili di sistema non sono esposte, `VERCEL_ENV` è vuoto (vedi Ricerca) | Omar (grill, domanda 1): «al momento lavora con dei placeholder che posso rimuovere»; spec AC4 |
| D7 | Il titolo della scheda di un caso studio è `home.title`, come nel prototipo. Il progetto è il testo prima di « · » in `meta.cliente`. Il numero è `home.metrics[0]` (AC8). Il link è `/case-study/<id>/` | spec AC8, Technical Notes |
| D8 | `src/data/articoli.ts` espone `getArticles()`, che restituisce `Articolo[]` ordinati per `date` decrescente e, a parità, per `id`. Ogni articolo ha:<br>• `id`, `tag` (`'caso-studio' \| 'release'`), `title`, `date`, `project`;<br>• `excerpt`, `metric?`, `cover?`, `href`;<br>• `caseStudy?`, cioè `{ href, title }`, solo se il caso studio è pubblicato.<br>Esclude le bozze. Se una release punta a un `caseStudy` che non esiste nella collection, nemmeno in bozza, lancia un `Error` che nomina la release e lo slug (D2). È solo lato server (`astro:content`) | spec AC1, AC13 |
| D9 | `src/data/articoli-testi.ts` è puro, senza import da `astro:content`, e lo usano pagine e script. Contiene:<br>• `TAGS`;<br>• `ctaLabel(tag, n)`: «Tutti gli articoli · 32», «Tutti i casi studio · 4», «Tutte le release · 1»;<br>• `countAnnouncement(tag, shown, total)`: «4 casi studio», «Gli ultimi 8 di 32 articoli», «Le ultime 8 di 12 release»;<br>• `dayMonth(iso, annoRif)`: «13 nov», con l'anno («21 mag 2025») quando l'anno dell'articolo è diverso da `annoRif`, l'anno dell'articolo pubblicato più recente (D30);<br>• `longDate`, `monthOf`;<br>• `relDay(iso, oggi)`, con `oggi` passato dall'esterno | spec AC6, AC10, AC23 |
| D10 | **Date relative (AC10).** L'HTML porta sempre la data assoluta («13 nov») e `datetime`. Lo script calcola i giorni tra il giorno di calendario locale del visitatore e la data dell'articolo. Da 0 a 6 scrive «oggi», «ieri» o «N giorni fa»; altrimenti, o se la data è nel futuro, lascia quella assoluta. La riga della home fa lo stesso: «l'ultimo ieri» oppure «l'ultimo il 13 nov». Oltre i 6 giorni, o nel futuro, `relDay` restituisce `null` e lo script non riscrive niente: resta il testo dell'HTML, con l'anno quando c'è (D30) | spec AC10 |
| D11 | **Senza JS (AC30).** Chip, frecce e «Copia il feed RSS» hanno la classe `solo-js`, nascosta via CSS finché il contenitore non ha `data-js`. Lo mette uno script inline subito dopo la sezione, oppure dopo la griglia di `/showcase/`, quindi prima del primo paint: i controlli non compaiono dopo il caricamento e non spostano niente. Il link «Feed RSS» si vede sempre. In home escono visibili le prime 8 schede di «Tutti», e le altre hanno `hidden`. Le entrate sono nascoste solo con `[data-armed]`, messo dallo stesso tipo di script, come in `Clienti.astro:116`. La nuova sezione non usa `.reveal` | spec AC30; `design-engineer` |
| D12 | **Markup della fila in home.** Contiene l'unione delle prime 8 schede di ogni tag, in ordine di data, ognuna con `data-tag`. I conteggi dei chip e delle etichette vengono dai totali completi: ogni chip porta `data-total` scritto in build, e `bindTags` legge i totali da lì, non contando le schede nel DOM. Nel markup ci sono 12 schede su 16, quindi contarle darebbe «Tutti gli articoli · 12». Così il markup non cresce con il numero degli articoli | spec AC6; piano |
| D13 | **La scheda come link (AC9).** È `<a aria-labelledby="<id titolo>" aria-describedby="<id meta> <id testo>">`. Nella copertina la schermata e il poster hanno `alt=""`, l'SVG della curva ha `aria-hidden="true"`, e il titolo grande della copertina è lo stesso elemento titolo. La scheda finale «Tutti… →» ha `tabindex="-1"` e `aria-hidden="true"`: si clicca, ma non è una fermata di Tab (AC23). La fila è un `<ol aria-label="Ultimi articoli">` e non è una fermata di Tab, perché le schede sono già link (AC26) | spec AC9, AC23, AC26 |
| D14 | **Copertina che non si carica (AC12).** La copertina contiene sempre anche il ripiego, numero oppure titolo, nascosto via CSS finché il media funziona. Un `onerror` inline sull'`<img>` mette `data-rotto` sul contenitore, così niente dipende dall'ordine di caricamento dello script. Senza JS il ripiego resta nascosto: in quel caso il browser mostra l'`alt` vuoto, cioè niente. Il fondo della copertina è quello della scheda | spec AC12 |
| D15 | **Tema.** Il contenitore definisce i token `--t-ink`, `--t-muted`, `--t-faint`, `--t-line`, `--t-accent`, `--t-hover` e `--t-card`: scuri nella sezione 04, chiari in `/showcase/` e nella pagina release. `--t-faint` vale `#848ea6` sul fondo scuro e `#687080` su quello chiaro (AC24). L'«04» della sezione ha un colore proprio, almeno 4,5:1 sul fondo scuro (AC28) | spec AC24, AC28 |
| D16 | **Ritorno dalla release (AC13).** `Base.astro` guadagna `nav="article"` con «← Tutti gli articoli» verso `/showcase/`. Al clic chiama `history.back()` solo se valgono tutte e tre:<br>• `document.referrer` ha la stessa origine e pathname `/showcase/`, con qualunque `?tag`;<br>• `history.length > 1`: una release aperta in una scheda nuova ha il referrer giusto ma niente cronologia;<br>• il clic non ha tasti modificatori e non è col tasto centrale.<br>Negli altri casi il link apre `/showcase/` | spec AC13 |
| D17 | **Feed (AC20, AC31).** Lo scrive a mano `src/pages/rss.xml.ts`, in RSS 2.0, senza `@astrojs/rss`:<br>• `escapeXml` per `& < > " '`;<br>• `description` è il testo breve senza tag;<br>• `category` vale «Caso studio» o «Release»;<br>• `pubDate` è `new Date(date + 'T12:00:00Z').toUTCString()`;<br>• `guid` è l'URL, con `isPermaLink="true"`;<br>• il canale ha `atom:link rel="self"`, e `<rss>` dichiara `xmlns:atom="http://www.w3.org/2005/Atom"`.<br>`Base.astro` dichiara il feed in ogni pagina. Il `Content-Type` lo decide Vercel dall'estensione `.xml`: nella build statica quello dell'endpoint non conta | spec AC20, AC31; piano |
| D18 | Copertine dei casi studio (Omar):<br>• `dati-da-excel` → `/case-studies/dati-da-excel/2-anteprima.png`;<br>• `offerte-ai` → `/case-studies/offerte-ai/new-flow/1-chat-start.png`;<br>• `onboarding-saas` → video `/case-studies/onboarding/onboarding.mp4` con il suo poster;<br>• `motion-design` → curva `cubic-bezier(0.32, 0.72, 0, 1)`.<br>I poster si estraggono una volta, con `qlmanage -t -s 1600`, in `public/case-studies/onboarding/*-poster.png` | Omar (grill, domanda 4) |
| D19 | **JSON-LD (AC31).** `ldJson` fa l'escape di `<`, `>`, `&`, U+2028 e U+2029 in `\u003c`, `\u003e`, `\u0026`, `\u2028` e `\u2029`. Un autocontrollo nel modulo `src/seo.ts` gira in build, perché ogni pagina lo importa: serializza `{ t: '</script><!--' }` e, se l'uscita contiene `<`, lancia un `Error`. `articleNode()` in `seo.ts` costruisce l'`Article` per casi studio e release (AC21) | spec AC21, AC31 |
| D20 | **AC3 copre solo lo showcase**: sezione 04, `/showcase/`, pagine release, feed e sezione Showcase di `/llms.txt`. Le promesse settimanali del servizio restano. La spec è stata aggiornata | Omar (grill, domanda 3) |
| D21 | Niente test runner nuovo. Il RED di ogni task è un controllo che fallisce:<br>• su `dist/`, dopo `npm run build`, con script usa e getta nello scratchpad della sessione, fuori dal repo;<br>• oppure nel browser con `agent-browser`.<br>L'unico controllo che resta nel repo è l'autocontrollo di D19, richiesto da AC31 | precedenti (un-posto-solo D10, clienti-muro D16) |
| D22 | **Orologio finto nei controlli di AC10.** È uno script di avvio di `agent-browser` che sposta `Date` a un giorno scelto. Il JS spento nei controlli di AC30 si ottiene con `--args "--blink-settings=scriptEnabled=false"`. Il media in errore di AC12 si ottiene con `network route <url> --abort` | piano |
| D23 | **Ordine delle modifiche a `Base.astro`**, che toccano tre task:<br>• T7 aggiunge `nav="article"`;<br>• T10 cambia i link e la voce attiva, e sistema la nav a 280 px;<br>• T11 aggiunge `<link rel="alternate">`.<br>Le dipendenze le mettono in fila: nessuna ondata ha due task su `Base.astro` | piano |
| D24 | Il prototipo resta il riferimento vivo finché l'implementazione non è in produzione, come dice la spec (Constraints). `src/lab/` non è tracciato, quindi non entra in nessun commit; le 2 righe della rotta `/lab` in `src/prototypes/integration.mjs` restano fuori da ogni commit, perché su `main` punterebbero a un file che non c'è. Quando Omar chiede commit o PR, si mette in stage tutto tranne `src/lab/` e `src/prototypes/integration.mjs`. T18 cancella prototipo e righe dopo che Omar ha confermato il deploy in produzione | spec Constraints; gate |
| D25 | Commit, push del branch e PR si fanno solo quando Omar lo chiede | regola del repo |
| D26 | **Budget di motion.** I valori del brief della spec sono confermati. Si muovono solo cinque cose: l'entrata della sezione 04 (una volta per visita), lo swap del filtro, hover e pressione su schede, chip, frecce e «Tutti…», lo scorrimento fluido delle frecce, e il video nella pagina release. Le aggiunte rispetto al brief:<br>• nello swap, in home anima anche la scheda finale; in `/showcase/` lo swap va sui mesi (`[data-group]`), non sulle singole schede;<br>• il primo clic su un chip assesta solo la fila;<br>• le frecce tengono un indice di arrivo e chiamano `scrollTo({ left: indice × passo })`, perché con lo snap obbligatorio un `scrollBy` a metà corsa si ferma una scheda prima;<br>• il ritorno all'inizio al cambio filtro è `scrollTo({ left: 0, behavior: 'instant' })`, nello stesso task, con un controllo al rAF successivo;<br>• una freccia che non serve, perché la fila non scorre, ha `visibility: hidden`, non `display: none`, così non toglie una riga;<br>• il corpo della scheda in home ha un'altezza fissa vera, in `lh`/`em`, non solo il taglio delle righe;<br>• la fila ha `overflow-y: hidden`;<br>• il filtro iniziale di `/showcase/` lo applica uno script inline prima del primo paint, senza swap, così un Indietro che ripristina lo scroll atterra già sul layout filtrato;<br>• nessuna altezza si anima, e niente fa scorrere la pagina al cambio filtro.<br>Hover dietro `(hover: hover) and (pointer: fine)`, trasformazioni anche dietro `(prefers-reduced-motion: no-preference)`. Dettagli in T13 | `design-engineer`, 2026-11-16 |
| D27 | Riga da aggiungere in `brain/chore/motion.md` → Deviazioni: «**Schede degli articoli (sezione 04 e `/showcase/`), hover `scale(1.03)` sulla copertina con schermata o video** (lo standard dice 1–2%): si ingrandisce l'immagine dentro la copertina 16:10 con `overflow: hidden`, non la scheda, che non si gonfia né si sposta; a 1,02 su una copertina di 320 px lo zoom non si vede. `--dur-ui`, `--ease-out`, origine in alto a sinistra come `object-position`. Solo con `(hover: hover) and (pointer: fine)`, niente scala con `prefers-reduced-motion`. `src/components/showcase/Copertina.astro`.» | spec, Motion brief; `design-engineer` |
| D28 | **Esecuzione in sequenza.** `implement-spec` esegue i task uno alla volta, nell'ordine delle ondate (`execution: sequential`). I task condividono la stessa cartella di lavoro e lo stesso `dist/`, che `astro build` svuota a ogni avvio (`static-build.js:59`), e diverse validazioni cambiano i contenuti per prova (bozze temporanee, campi tolti). In parallelo darebbero falsi RED e falsi GREEN. Ogni modifica temporanea ai contenuti si apre e si chiude con uno `shasum` di tutti i file di `src/content/`, che deve tornare identico. Le verifiche nel browser usano `npm run build` e poi `npx astro preview --port 4329`. In una shell d'agente Astro manda il preview in background e scrive in `.astro/preview.log` | gate; precedente un-posto-solo D11 |
| D29 | **Date dei casi studio** (vere, senza `# SEGNAPOSTO`):<br>• `dati-da-excel`: `"2025-05-21"`;<br>• `onboarding-saas`: `"2026-03-20"`;<br>• `offerte-ai`: `"2026-04-30"`;<br>• `motion-design`: `"2026-07-26"`.<br>Sono tutte più vecchie delle release segnaposto (agosto–novembre 2026): i casi studio stanno in fondo all'elenco, e in home «Tutti» mostra solo release | Omar, 2026-11-16 (domanda aperta 2 della spec, chiusa) |
| D30 | **Anno nella data della scheda (AC10).** `dayMonth` aggiunge l'anno quando è diverso da quello dell'articolo pubblicato più recente: «21 mag 2025» accanto a «26 lug». `annoRif` si calcola una volta per tutto il registro, non per filtro, così la stessa scheda dice la stessa cosa in home e in `/showcase/`. La regola dipende solo dai contenuti, non dal giorno della build | piano, dopo D29: senza anno «21 mag» dopo «20 mar» sembrerebbe fuori ordine; spec AC10 aggiornata |
| D31 | Lo zoom della copertina parte da `transform-origin: left top`, la stessa origine di `object-position` | Omar, 2026-11-16 |
| D32 | Il refuso di `offerte-ai.md` (`home.title`) è corretto fuori dal piano: «Da form a chat interattiva: il brief si crea in 3 domande.» | Omar, 2026-11-16 |

**Assunzioni:**
- `scroll-padding-top` su `html` vale per tutto il sito. Corregge anche gli anchor come `#shipped`, che oggi finiscono sotto la nav fissa. È un effetto voluto di AC27.
- Gli articoli segnaposto hanno titoli che iniziano con «Segnaposto», così nessun testo inventato sembra vero, nemmeno in un'anteprima.

**Domande aperte della spec, chiuse il 2026-11-16:**
- Domanda aperta 1: le release del lancio le scrive Omar in T15. Fino ad allora valgono i segnaposto e la guardia di D6.
- Domanda aperta 2: le date vere dei casi studio sono in D29.

## Cosa ho trovato nel codice

- zod 4.6.7 e Astro 7.3.5. In zod 4 `.refine()` su un oggetto resta uno `ZodObject`, quindi lo schema di una collection lo accetta. Va provato in T1.
- `astro:content` esporta `reference()` e `render()` (`node_modules/astro/dist/content/runtime.js:442,521`). `render(entry)` restituisce `{ Content }` per il corpo Markdown.
- `isoDay` esiste già in `content.config.ts` e rifiuta date senza virgolette o impossibili.
- `src/config.ts` finisce anche nel JS del browser, tramite `src/data/confronto.ts`. `PROJECTS` è un array piccolo, ma `articoli-testi.ts` non deve importare `config.ts` se non serve (un-posto-solo D13).
- La lunghezza dei titoli di oggi: `home.title` di onboarding-saas è lungo circa 73 caratteri. Il limite di 70 vale solo per le release (AC25); i titoli dei casi studio si fermano a 4 righe in copertina.
- Il caso studio offerte-ai aveva `home.title: "Da form  chat interattiva…"`, con un doppio spazio e senza «a». Corretto il 2026-11-16 (D32).

## Ricerca esterna

- [Vercel, System environment variables](https://vercel.com/docs/environment-variables/system-environment-variables): `VERCEL_ENV` vale `production`, `preview` o `development` ed è disponibile in build. Il valore è vuoto se il progetto non espone le variabili di sistema o se il deploy è `--prebuilt`. Per questo T16 controlla anche il repo (D6).
- RSS 2.0 (specifica RSS Advisory Board): `pubDate` nel formato RFC 822. `atom:link rel="self"` è consigliato dal validatore W3C.
- [Astro, content collections](https://docs.astro.build/en/guides/content-collections/): `render()` restituisce il corpo. `reference()` **non** blocca la build: con uno slug inesistente Astro 7.3.5 stampa `[ERROR] Invalid content reference` ed esce con 0 (provato dal gate; `content-layer.js:286-326`). Da qui il controllo in `getArticles()` (D2, D8).

## Grafo delle dipendenze

```
T1 ── T2 ── T4 ──┬── T5 ──┬── T6 ──┬── T8 ── T9 ──┬── T13 ──┐
                 │        │        │              │         │
T3 ──────────────┼────────┴── T7 ──┴── T10 ── T11 ┼─────────┼── T14 ── T15 ── T16 ──┬── T17
                 │                                │         │                       └── T18
                 └── T12 ─────────────────────────┴─────────┘
```

- T7 dipende da T3, T4, T5 e T6.
- T10 dipende da T6, T7 e T8.
- T11 dipende da T3, T4 e T10.
- T13 dipende da T6 e T9.
- T14 dipende da T7 e da T10 a T13.

## Compiti

Campi comuni a tutti i task: `backlog_item_id: none`, `backlog_item_url: none`, `relation_mode: none` (nessun tracker, vedi Situazione iniziale). Si costruisce sempre con Node 26: `source ~/.nvm/nvm.sh && nvm use`. Le prove con modifiche temporanee ai contenuti si annullano a fine task, e `git status` lo conferma.

### T1: Schema degli articoli e guardia dei segnaposto

- **depends_on**: []
- **location**: `src/content.config.ts`, `src/config.ts`, `astro.config.mjs` (solo la guardia, dopo il controllo di Node), `src/content/case-studies/*.md` (solo `published`)
- **description**:
  - In `src/config.ts`, `PROJECTS` (D3).
  - In `src/content.config.ts`:
    - lo schema `media` (D4);
    - per i casi studio, `cover: media.optional()` e il `.refine` su `published` (D5);
    - la collection `releases` (D1, D2), esportata in `collections`.
  - Nei 4 casi studio, `published` con le date vere di D29, senza `# SEGNAPOSTO`.
  - In `astro.config.mjs`, la guardia di D6. Stampa anche una riga, «Segnaposto: guardia attiva» oppure «Segnaposto: guardia spenta (VERCEL_ENV=…)», così il log di Vercel dice se la guardia gira.
  - Il controllo del corpo non vuoto sta in T4, perché lo schema non vede il corpo.
- **validation**:
  - `npm run build` passa;
  - senza `published` in `dati-da-excel.md`, la build esce con un codice diverso da 0 e il messaggio nomina `published` e il caso studio;
  - una release temporanea con un titolo di 71 caratteri fa fallire la build, e il messaggio dice 70. La stessa cosa con `project: Acme`, senza `excerpt`, e con `project: Cliente in white label` più un `caseStudy` (D2). Il `caseStudy` inesistente lo controlla T4;
  - con una riga `# SEGNAPOSTO` aggiunta per prova al frontmatter di `dati-da-excel.md` (e tolta dopo, con il controllo `shasum` di D28), `VERCEL_ENV=production npm run build` fallisce e nomina quel file, mentre `VERCEL_ENV=preview npm run build` passa. Senza la riga passa anche la build di produzione.
- **status**: Completed
- **log**: 2026-11-16, worker sonnet, una revisione. Build ok; senza `published` in dati-da-excel exit 1 («published è obbligatorio per un caso studio pubblicato»); release di prova: 71 caratteri, `project: Acme`, senza `excerpt`, white label + `caseStudy` falliscono, una valida passa; `# SEGNAPOSTO` temporaneo: produzione fallisce e nomina il file, preview passa, senza la riga produzione passa («guardia attiva»). Shasum dei contenuti identico prima e dopo. La cartella `releases/` può mancare (solo un WARN). In onboarding-saas e offerte-ai `published` sta dopo `order`, perché non hanno `draft`.
- **files edited/created**: `src/config.ts`, `src/content.config.ts`, `astro.config.mjs`, `src/content/case-studies/*.md`
- **tdd_target**: senza `published` in `dati-da-excel.md`, `npm run build` esce con un codice diverso da 0 e un messaggio che nomina `published`. Oggi la build passa.
- **review_mode**: cli
- **complexity**: medium

### T2: Segnaposto, copertine dei casi studio e guida per le release

- **depends_on**: [T1]
- **location**: `src/content/releases/segnaposto-*.md` (nuovi), `src/content/case-studies/*.md` (`cover`), `public/case-studies/onboarding/onboarding-poster.png` e `resync-poster.png` (nuovi), `README.md`
- **description**:
  - Poster dei due video: `qlmanage -t -s 1600 -o <scratchpad> <mp4>`, poi copiati in `public/case-studies/onboarding/` con il nome qui sopra (D18).
  - Le copertine dei 4 casi studio (D18).
  - 13 release segnaposto. Ognuna ha `# SEGNAPOSTO` nel frontmatter e un titolo che comincia con «Segnaposto». Coprono gli stati di `FLOW.md`:

    | File | `published` | `project` | `cover` | `metric` | `caseStudy` | Corpo |
    |---|---|---|---|---|---|---|
    | `segnaposto-immagine` | 2026-11-15 | Valueize | img `dati-da-excel/5-undo.png` (2538×1562) | — | `dati-da-excel` | 1 paragrafo |
    | `segnaposto-video` | 2026-11-13 | SeVedemo | video `onboarding/resync.mp4` + poster | — | `onboarding-saas` | lungo: h2, lista, immagine, `<video controls>`, blocco di codice |
    | `segnaposto-numero` | 2026-11-10 | SeVedemo | — | `160ms` · di feedback | `motion-design` | 1 paragrafo |
    | `segnaposto-white-label` | 2026-11-06 | Cliente in white label | — | — | — | 2 paragrafi |
    | `segnaposto-caratteri` | 2026-11-03 | SeVedemo | — | — | — | titolo, testo breve e corpo con `&`, `<` e `>` (nel corpo `a < b`, con lo spazio) |
    | `segnaposto-titolo-lungo` | 2026-10-29 | Valueize | — | — | — | titolo di esattamente 70 caratteri, con una parola di 32 |
    | `segnaposto-curva` | 2026-10-21 | SeVedemo | curva `cubic-bezier(0.32, 0.72, 0, 1)` | — | — | 1 paragrafo |
    | `segnaposto-immagine-numero` | 2026-10-14 | SeVedemo | img `offerte-ai/new-flow/4-rifinitura.png` | `3` · domande | `offerte-ai` | 1 paragrafo |
    | `segnaposto-ottobre` | 2026-10-08 | Valueize | — | — | — | 1 paragrafo |
    | `segnaposto-settembre` | 2026-09-17 | SeVedemo | — | `80%` · completa l'onboarding | — | 1 paragrafo |
    | `segnaposto-agosto-1` | 2026-08-27 | Valueize | img `dati-da-excel/1-griglia.png` | — | — | 1 paragrafo |
    | `segnaposto-agosto-2` | 2026-08-19 | Cliente in white label | — | — | — | 1 paragrafo |
    | `segnaposto-bozza` | 2026-11-16 | SeVedemo | — | — | — | `draft: true`, titolo «Segnaposto BOZZA-NON-PUBBLICARE» |

    Il risultato: 12 release pubblicate e 4 casi studio, cioè 16 articoli. Agosto ha solo release, quindi con «Casi studio» il mese sparisce. Luglio, aprile e marzo 2026 e maggio 2025 hanno solo casi studio (D29), quindi con «Release» spariscono. Le release sono più di 8, quindi la home ne mostra «Le ultime 8 di 12».
  - `README.md`:
    - una sezione «Nuova release», accanto a «Nuovo caso studio». Spiega:
      - copiare un file, il cui nome è lo slug e non cambia più;
      - i campi e il limite di 70 caratteri;
      - i progetti ammessi e la regola del white label: «Cliente in white label», oppure non si pubblica;
      - `cover`, con il poster obbligatorio per i video e il comando `qlmanage`;
      - il corpo in Markdown, con `<video controls>` in HTML e il `<` letterale nel testo;
      - `caseStudy` e `draft`;
      - la regola `SEGNAPOSTO`;
    - in «Nuovo caso studio», `published` diventa obbligatorio e compare `cover`.
- **validation**:
  - `npm run build` passa;
  - in `src/content/releases/` ci sono 13 file, e ognuno contiene `SEGNAPOSTO`;
  - `sips -g pixelWidth` sui due poster stampa una larghezza maggiore di 0;
  - `VERCEL_ENV=production npm run build` fallisce ed elenca i 13 file segnaposto;
  - il titolo di `segnaposto-titolo-lungo` misura 70 caratteri.
- **status**: Completed
- **log**: 2026-11-16, worker haiku, una revisione. 13 release in `src/content/releases/`, tutte con `# SEGNAPOSTO`; poster 1600×900 da `qlmanage`; copertine dei 4 casi studio; README con «Aggiungere una release». `npm run build` ok; `VERCEL_ENV=production` esce con 1 ed elenca i 13 file, nessun caso studio. Titolo lungo di 70 caratteri con una parola di 32. Il testo breve di `segnaposto-caratteri` ha `&`, `a < b` e `C > D` invece di un `<tag>` letterale (che resta nel titolo). Dopo, in T4: il worker non aveva messo `caseStudy: dati-da-excel` in `segnaposto-immagine`; l'ha aggiunto l'orchestratore.
- **files edited/created**: `src/content/releases/segnaposto-*.md` (13), `src/content/case-studies/*.md` (`cover`), `public/case-studies/onboarding/onboarding-poster.png`, `resync-poster.png`, `README.md`
- **tdd_target**: `VERCEL_ENV=production npm run build` elenca `segnaposto-video.md` tra i file bloccati. Oggi, dopo T1, la build di produzione passa: non c'è nessun segnaposto.
- **review_mode**: cli
- **complexity**: low

### T3: Serializer JSON-LD rigido e `Article` condiviso

- **depends_on**: []
- **location**: `src/seo.ts`, `src/pages/case-study/[slug].astro` (righe 19-33)
- **description**:
  - Prima di cambiare qualcosa: `npm run build`, poi salvare nello scratchpad il JSON-LD letto (`JSON.parse`) dei 4 casi studio, di `/`, di `/pricing/` e di `/termini/`.
  - In `ldJson`: escape e autocontrollo (D19).
  - `articleNode({ site, url, headline, description, published, updated })` in `seo.ts`:
    - `@id` uguale a `${url}#article`;
    - `mainEntityOfPage` e `inLanguage: 'it-IT'`;
    - `author` e `publisher` per `@id`;
    - `description` è testo senza tag;
    - `dateModified` solo se c'è `updated`.
  - La pagina del caso studio usa `articleNode` al posto dell'oggetto scritto a mano.
- **validation**:
  - `npm run build` passa;
  - in ogni `dist/**/*.html`, il contenuto di ogni `<script type="application/ld+json">` non contiene `<`, `>`, `&`, U+2028 né U+2029 in chiaro, e passa `JSON.parse`;
  - il JSON-LD letto delle 7 pagine è uguale a quello salvato prima. L'unica differenza ammessa è `datePublished` nei casi studio, che c'è da T1 se T1 è già stato fatto;
  - con `ldJson` modificato per non fare l'escape di `<`, la build fallisce con il messaggio dell'autocontrollo. Poi va ripristinato.
- **status**: Completed
- **log**: 2026-11-16, worker haiku, una revisione. Build ok; JSON-LD delle 8 pagine HTML uguale a quello salvato prima (dopo T1), senza `<>&`/U+2028/U+2029 in chiaro; con l'escape di `<` tolto la build esce con 1 e il messaggio dell'autocontrollo. Commento di `articleNode` corretto dall'orchestratore (vale anche per le release).
- **files edited/created**: `src/seo.ts`, `src/pages/case-study/[slug].astro`
- **tdd_target**: con `ldJson` che non fa l'escape di `<`, `npm run build` esce con un codice diverso da 0. Oggi esce con 0, perché l'autocontrollo non c'è.
- **review_mode**: cli
- **complexity**: low

### T4: Elenco degli articoli e testi condivisi

- **depends_on**: [T1, T2]
- **location**: `src/data/articoli.ts` e `src/data/articoli-testi.ts` (nuovi)
- **description**:
  - `articoli-testi.ts` è puro: niente `astro:content` e niente `config.ts`. Contiene:
    - `TAGS`, `ctaLabel`, `countAnnouncement`, `dayMonth`, `longDate`, `monthOf` e `relDay(iso, oggi)` (D9);
    - `inlineHtml(text)`, che fa l'escape di tutto e poi riammette solo `<strong>`, `</strong>`, `<em>` e `</em>`;
    - `testoPiano(text)`, che toglie quei tag.

    Il testo breve si scrive come testo, e `inlineHtml` ne protegge la resa (D2).
  - `articoli.ts` contiene `getArticles()` (D7, D8):
    - unisce le due collection, senza bozze, e ordina;
    - lega `caseStudy` solo se quel caso studio è pubblicato;
    - lancia un `Error` che nomina il file se una release ha il corpo vuoto (AC1), e uno che nomina release e slug se `caseStudy` punta a un caso studio che non esiste (D2);
    - il tipo `Articolo` è esportato.
  - Per la prova, un endpoint temporaneo `src/pages/prova-articoli.json.ts` che restituisce `getArticles()`. Si cancella alla fine del task.
- **validation**:
  - uno script nello scratchpad importa `src/data/articoli-testi.ts` con Node 26 (type stripping) e controlla:
    - `ctaLabel('all', 32)` è «Tutti gli articoli · 32»; `('caso-studio', 4)` è «Tutti i casi studio · 4»; `('release', 1)` è «Tutte le release · 1»;
    - `countAnnouncement('all', 8, 32)` è «Gli ultimi 8 di 32 articoli»; `('release', 8, 12)` è «Le ultime 8 di 12 release»; `('caso-studio', 4, 4)` è «4 casi studio»; `('release', 1, 1)` è «1 release»; `('caso-studio', 1, 1)` è «1 caso studio»; `('all', 1, 1)` è «1 articolo»;
    - `relDay`, con oggi `2026-11-20`: il 20 è «oggi», il 19 è «ieri», il 14 è «6 giorni fa», il 13 e il 21 (nel futuro) restituiscono `null`, così lo script lascia la data dell'HTML (D10);
    - `dayMonth('2026-11-13', 2026)` è «13 nov» e `dayMonth('2025-05-21', 2026)` è «21 mag 2025» (D30);
    - `longDate('2026-11-13')` è «13 novembre 2026» e `monthOf` è «novembre 2026»;
    - `inlineHtml('a <b> & <strong>c</strong>')` è `a &lt;b&gt; &amp; <strong>c</strong>`;
  - in `dist/prova-articoli.json`:
    - ci sono 16 articoli, nessuna bozza;
    - il primo è `segnaposto-immagine`, il secondo `segnaposto-video`, l'ultimo `dati-da-excel` (D29);
    - `motion-design` ha `project` «SeVedemo», `metric.value` «162» e `href` `/case-study/motion-design/`;
    - `segnaposto-immagine` ha `caseStudy.href` `/case-study/dati-da-excel/`;
  - con `dati-da-excel` in bozza per prova, `segnaposto-immagine` non ha `caseStudy` e gli articoli sono 15;
  - una release con il corpo vuoto fa fallire la build, e il messaggio nomina il file;
  - una release con `caseStudy: inesistente` fa fallire la build, e il messaggio nomina la release e lo slug (D2, D8);
  - alla fine l'endpoint non c'è più e `git status` non mostra file temporanei.
- **status**: Completed
- **log**: 2026-11-16, worker sonnet, una revisione. `t4-testi.mjs` (25 controlli su `articoli-testi.ts`) tutto ok; `dist/prova-articoli.json`: 16 articoli, `segnaposto-immagine`, `segnaposto-video` … `dati-da-excel`; `motion-design` SeVedemo, 162; con `dati-da-excel` in bozza 15 articoli e `segnaposto-immagine` senza `caseStudy`; corpo vuoto e `caseStudy: inesistente` fanno fallire la build nominando il file e lo slug. Endpoint di prova tolto. Esportati anche `isTag`, `oggiLocale` e `annoRif`.
- **files edited/created**: `src/data/articoli.ts`, `src/data/articoli-testi.ts`
- **tdd_target**: `dist/prova-articoli.json` elenca 16 articoli, con `segnaposto-immagine` per primo. Oggi il modulo non esiste.
- **review_mode**: cli
- **complexity**: medium

### T5: Scheda, copertina e pagina `/showcase/` statica

- **depends_on**: [T4]
- **location**: `src/components/showcase/Scheda.astro`, `Copertina.astro`, `Filtri.astro`, `Feed.astro` (nuovi), `src/pages/showcase/index.astro` (nuova)
- **description**:
  - **`Copertina`**: media, poi numero, poi titolo, con il ripiego sempre presente (D14). Ha la proporzione 16:10 e il fondo della scheda.
    - La curva in SVG viene da `src/lab/showcase/Media.astro`.
    - La didascalia della curva va a capo, senza `nowrap` (AC28).
    - Il titolo in copertina si ferma a 4 righe con i puntini e va a capo anche dentro una parola, con `overflow-wrap: anywhere` (AC25).
  - **`Scheda`**: un solo link (D13). Il corpo contiene:
    - `<time datetime>` con la data assoluta e `data-rel` (D10), poi « · » e il progetto;
    - il titolo, che è assente se la copertina è il titolo;
    - il testo, con `inlineHtml`;
    - la riga del numero quando la copertina è un media (AC8).

    La variante `home` ha l'altezza del corpo fissa (AC7, D26): titolo al massimo 3 righe, testo 3 righe, riga del numero sempre riservata. L'altezza è un blocco vero, in `lh`/`em`, così regge a 1,25×: un titolo di una riga riserva comunque 3 righe. Qui si definisce, la usa T8. Nessun segno distingue i tag (AC8).
  - **`Filtri`**: «Tutti», «Casi studio» e «Release», ciascuno con il suo conteggio, dentro `role="group"` con `aria-label="Filtra per tipo"`.
    - Un chip con 0 articoli non si rende (AC6).
    - Il gruppo esce con `hidden` (D11).
    - Accanto c'è una regione `role="status"` per il conteggio (AC23).
    - Layout: una riga da 358 px, al massimo due sotto (AC19).
  - **`Feed`**: il bottone «Copia il feed RSS», nascosto senza JS, il link «Feed RSS» a `/rss.xml`, sempre visibile, e una regione `role="status"`. L'indirizzo assoluto sta in `data-feed-url` (AC18).
  - **Pagina** `src/pages/showcase/index.astro`, nell'ordine di AC14:
    - eyebrow «Showcase», h1 «Cosa ho messo in produzione.» e lead (AC3);
    - filtri e feed, con il feed allineato al bordo destro della griglia (AC18);
    - un `<section data-group>` per mese, con `<h2>` del mese e una griglia `<ol>` di schede con `dayMonth`;
    - la griglia ha 1 colonna fino a 700 px, 2 da 701 a 1023 e 3 da 1024 (AC14), con media query esplicite a 701 e 1024 px. Non `auto-fill` con `minmax(300px, 1fr)` del prototipo, che dà 3 colonne già da circa 980 px;
    - in fondo, «Prenota una call di 30 min» (`SITE.calUrl`).

    Tema chiaro (D15). Senza `noindex`.
  - Qui niente transizioni: le aggiunge T13. Le misure vengono dal Decision Log della spec.
  - `Base.astro` non si tocca: la voce attiva la aggiunge T10.
- **validation**:
  - in `dist/showcase/index.html`:
    - ci sono l'h1 e 16 link-scheda, con i mesi nell'ordine novembre, ottobre, settembre, agosto, luglio, aprile, marzo 2026 e maggio 2025;
    - la scheda di `dati-da-excel` dice «21 mag 2025», quella di `motion-design` «26 lug» (D30);
    - nessun «BOZZA-NON-PUBBLICARE»;
    - il canonical è `https://spatalo.tech/showcase/`;
    - nessun «settiman», «ogni settimana» o «aggiornato ogni» (AC3);
    - nessun `<video>`, `<button>` o `<input>` dentro un `<a>` (AC11);
    - ogni `aria-labelledby` punta a un titolo con il testo dell'articolo;
    - le immagini di copertina hanno `alt=""` (AC9);
  - la sitemap contiene `https://spatalo.tech/showcase/` (AC21);
  - con agent-browser, nell'albero di accessibilità ogni link-scheda ha per nome il suo titolo (AC9);
  - a 280, 320, 375, 700, 701, 1023, 1024 e 1440 px:
    - le colonne sono 1, 1, 1, 1, 2, 2, 3, 3 (AC14);
    - `scrollWidth <= innerWidth`;
    - la didascalia della curva non è tagliata (AC28);
  - il rapporto di contrasto calcolato da `getComputedStyle` per la meta, il testo, il titolo del mese e il testo «faint» è almeno 4,5:1 (AC24);
  - con `network route "**/2-anteprima.png" --abort` la scheda di `dati-da-excel` mostra il numero, ha `data-rotto` e l'`<img>` non è visibile. Con il poster di `resync` bloccato, la scheda di `segnaposto-video` mostra il titolo grande. Niente blocchi bianchi (AC12);
  - impostando via DOM un titolo di 100 caratteri con una parola di 32, la copertina si ferma a 4 righe con i puntini e la pagina non scorre di lato (AC25);
  - a 701, 1024 e 1440 px il bordo destro del link «Feed RSS» coincide con quello della griglia, ±1 px (AC18);
  - con JS spento si vedono 16 schede, nessun chip né bottone di copia, e il link «Feed RSS» (AC30).
- **status**: Completed
- **log**: 2026-11-16, worker sonnet, una revisione; verifiche nel browser dell'orchestratore. `t5-dist.mjs` tutto ok (h1, 16 schede, mesi da novembre 2026 a maggio 2025, «21 mag 2025» e «26 lug», canonical, niente cadenza né controlli nei link, `aria-labelledby` risolti, `alt=""`, sitemap). Nel browser: colonne 1/1/1/1/2/2/3/3 da 280 a 1440 px, nessuno scorrimento laterale, didascalia della curva intera; contrasto meta 4,98, testo 5,97, mese 4,77, lead 5,71; feed allineato alla griglia a 701, 1023, 1024 e 1440 px (sotto 701 sta in colonna sotto i filtri); nomi dei link uguali ai titoli; con `2-anteprima.png` e `resync-poster.png` bloccati la copertina mostra numero e titolo; titolo di 103 caratteri fermo a 4 righe a 280 e 1440 px. Chip su una riga e prova con JS spento rimandati a T6, perché i controlli si rivelano lì.
- **files edited/created**: `src/components/showcase/{Copertina,Scheda,Filtri,Feed}.astro`, `src/pages/showcase/index.astro`
- **tdd_target**: `dist/showcase/index.html` esiste e contiene 16 link-scheda, il primo verso `/showcase/segnaposto-immagine/`. Oggi la pagina non esiste.
- **review_mode**: mixed
- **assigned_skills**: agent-browser, ui-review
- **complexity**: medium

### T6: Filtri, indirizzo, feed e date nel browser

- **depends_on**: [T5]
- **location**: `src/scripts/showcase.ts` (nuovo), `src/components/showcase/Filtri.astro` e `Feed.astro` (l'aggancio allo script), `src/pages/showcase/index.astro`
- **description**:
  - Mostra i controlli nascosti senza JS con lo script inline di D11, prima del primo paint.
  - **`bindTags(root, { limit?, onChange? })`**, da `src/lab/showcase/lab.ts` senza le parti del lab:
    - imposta `aria-pressed`;
    - nasconde schede e mesi vuoti;
    - legge i totali dal `data-total` dei chip (D12);
    - aggiorna le etichette `[data-cta]` (`ctaLabel`) e il loro `href`: `/showcase/?tag=<tag>`, oppure `/showcase/` con «Tutti» (AC15);
    - scrive `countAnnouncement` nella regione di stato (AC23).

    `limit` serve alla home (T8, T9).
  - **Pagina**: il filtro iniziale viene da `?tag`. Un tag valido e con articoli si applica senza animazione, altrimenti resta «Tutti». Lo applica uno script inline dopo la griglia, prima del primo paint (D26).
    - Una strada possibile: in build ogni mese ha `data-tags` con i tag che contiene, lo script inline mette `data-filtro` sulla pagina, e il CSS nasconde schede e mesi che non corrispondono. Poi il modulo prende il controllo.
    - A ogni cambio, `history.replaceState`, togliendo il parametro con «Tutti» (AC15).
    - Il cambio filtro non fa scorrere la pagina.
  - **Feed** (AC18):
    - `navigator.clipboard.writeText(data-feed-url)`;
    - se riesce, l'etichetta diventa «Link del feed copiato» e torna dopo 2400 ms; ogni clic cancella e fa ripartire il timer;
    - se fallisce, la regione di stato mostra «Copia non riuscita: https://spatalo.tech/rss.xml», con l'indirizzo come testo selezionabile, fino al clic successivo;
    - l'esito va nella regione `role="status"`;
    - il cambio di testo non sposta niente fuori dal bottone: la larghezza dell'etichetta è riservata, e il messaggio d'errore non spinge il contenuto.
  - **Date relative** (D10): una funzione che riscrive gli elementi `[data-rel]` e la riga della home, se c'è. La usa T8.
- **validation** (agent-browser):
  - `/showcase/?tag=caso-studio`: «Casi studio» ha `aria-pressed="true"`, si vedono 4 schede, agosto è nascosto (AC15);
  - `?tag=xyz` apre «Tutti». Con tutte le release in bozza per prova, `?tag=release` apre «Tutti» e il chip «Release» non c'è (AC6, AC15);
  - clic su «Release»: l'URL diventa `?tag=release`, `history.length` non cambia, e Indietro esce dalla pagina. Poi clic su «Tutti»: l'URL torna `/showcase/`, senza parametro (AC15);
  - la regione di stato dice «12 release» dopo «Release» e «16 articoli» dopo «Tutti» (AC23);
  - copia del feed (AC18):
    - con `navigator.clipboard.writeText` che riesce, sostituito via `eval`, compare «Link del feed copiato» e la regione di stato lo riporta;
    - un secondo clic dopo 2 s tiene il messaggio ancora 2 s;
    - con `writeText` che rifiuta, compare «Copia non riuscita: https://spatalo.tech/rss.xml» e resta finché non si clicca di nuovo;
    - a 280, 375 e 1440 px, i rettangoli dei chip, del link «Feed RSS» e della prima scheda non cambiano (±0,5 px) prima, dopo la copia e dopo il ritorno;
  - chip su una riga da 358 a 1440 px e su due righe al massimo a 280 e 357 px. A 1,25×, due righe al massimo fino a 400 px (AC19);
  - con JS spento non ci sono chip e si vede tutto (AC30).
- **status**: Completed
- **log**: 2026-11-16, worker sul modello dell'orchestratore (complexity high), una revisione. Worker: `?tag=caso-studio` 4 schede e mesi da luglio 2026 a maggio 2025; `?tag=xyz` → «Tutti» e URL ripulito; «Release» → `?tag=release`, `history.length` invariato, stato «12 release»; «Tutti» → `/showcase/`, «16 articoli»; copia del feed riuscita e fallita con rettangoli di chip, link, prima scheda e bottone identici a 280, 375 e 1440 px; chip su una riga da 357 a 1440 px, due righe a 280 e 320 px (= 400 px a 1,25×); date «ieri», «3 giorni fa», «6 giorni fa», «6 nov». Orchestratore: rifatti `?tag=caso-studio` e «Release» con Indietro che esce dalla pagina; JS spento su `?tag=release`: 16 schede, nessun controllo; tutte le release in bozza per prova: `?tag=release` apre «Tutti» e il chip «Release» non c'è. Lo script inline sta dopo i controlli, non dopo la griglia: imposta attributi sul contenitore e il CSS filtra, quindi è comunque prima del primo paint.
- **files edited/created**: `src/scripts/showcase.ts`, `src/pages/showcase/index.astro`, `src/components/showcase/Feed.astro`
- **tdd_target**: su `/showcase/?tag=caso-studio` il chip «Casi studio» ha `aria-pressed="true"` e si vedono esattamente 4 schede. Oggi i chip sono nascosti e non c'è lo script.
- **review_mode**: browser
- **assigned_skills**: agent-browser
- **complexity**: high

### T7: Pagina della release

- **depends_on**: [T3, T4, T5, T6]
- **location**: `src/pages/showcase/[slug].astro` (nuova), `src/components/showcase/MediaArticolo.astro` (nuovo), `src/layouts/Base.astro` (solo `nav="article"`)
- **description**:
  - `getStaticPaths` dalle release di `getArticles()`, senza bozze. Il corpo arriva con `render()`.
  - `Base`:
    - `title` è «<titolo> — spatalo.tech» e `description` è `testoPiano(excerpt)`;
    - `ogType="article"`, `jsonLd=[articleNode(...)]` (AC21);
    - `nav="article"` (D16), con lo script del ritorno.
  - **Layout**, quello del caso studio accorciato, con `wrap` a 840 px:
    - data lunga · progetto;
    - h1, che a 280 px va a capo dentro i margini (AC28);
    - lead con `inlineHtml(excerpt)`;
    - il numero;
    - `MediaArticolo`: immagine a misura naturale, video con i controlli (D4), oppure la curva;
    - il corpo `<Content />`, con stili da articolo per h2, h3, paragrafi, liste, immagini, video, `figure`/`figcaption`, `pre`/`code` (che scorre dentro il suo riquadro) e citazioni. Niente esce dai margini a 280 px.
  - In fondo, «Prenota una call di 30 min» e, se c'è `caseStudy`, «Leggi il caso studio completo» (AC13).
  - Niente `.reveal` e niente count-up del numero. All'arrivo si muove solo il video (D26).
  - Tema chiaro e contrasto (AC24). Niente cadenza (AC3).
- **validation**:
  - ci sono 12 pagine `dist/showcase/<slug>/index.html` e nessuna per `segnaposto-bozza`. La sitemap le elenca tutte (AC21);
  - in ciascuna pagina:
    - `og:type` è `article` e il canonical è la pagina stessa;
    - c'è un `Article` con `headline`, `description`, `url`, `datePublished`, `inLanguage`, `author` → `#founder` e `publisher` → `#org` (AC21);
  - `segnaposto-immagine` ha «Leggi il caso studio completo» verso `/case-study/dati-da-excel/`; `segnaposto-white-label` non ce l'ha e non nomina altri progetti (AC2, AC13);
  - `segnaposto-caratteri` (AC31):
    - il JSON-LD passa `JSON.parse` e non contiene `<` in chiaro;
    - l'h1 mostra `&`, `<` e `>` come testo;
    - lo `<script>` dei dati strutturati si chiude dove deve: c'è un solo `</script>` dopo `application/ld+json`;
  - con agent-browser (AC13):
    - su `/showcase/?tag=release`, scorrere fino a una scheda, aprirla e cliccare «← Tutti gli articoli». L'URL torna `/showcase/?tag=release`, `scrollY` è lo stesso (±2 px) e «Release» è premuto;
    - aprendo la pagina direttamente, lo stesso link porta a `/showcase/`;
    - aprendo la scheda in una scheda nuova del browser (referrer `/showcase/…`, `history.length` 1), il link porta a `/showcase/`. Un clic con Cmd o col tasto centrale apre `/showcase/` in una scheda nuova (D16);
  - `segnaposto-video` (D4): il video ha i controlli e parte muto quando è in vista; con reduced motion emulato non parte;
  - a 280 px nessuna pagina scorre di lato, e il codice scorre dentro il suo `pre` (AC28);
  - il contrasto di meta e lead è almeno 4,5:1 (AC24).
- **status**: Completed
- **log**: 2026-11-16, worker sonnet, una revisione. `t7-dist.mjs` tutto ok: 12 pagine e nessuna per la bozza; per ognuna Article completo, `og:type` article, canonical, sitemap, niente cadenza; «Leggi il caso studio completo» solo dove serve, white label senza altri progetti nel `<main>`; `segnaposto-caratteri` con JSON-LD senza `<`, h1 come testo e un solo `</script>`. Worker: video con controlli che parte muto in vista e resta fermo con reduced motion; a 280 px nessuno scorrimento laterale, il `pre` scorre dentro. Orchestratore: da `/showcase/?tag=release` scorso a 1617 px, apertura di una release e «← Tutti gli articoli» → `?tag=release`, `scrollY` 1617, «Release» premuto; apertura diretta → `/showcase/`; nuova scheda del browser (`history.length` 1) → `/showcase/`; contrasto di meta e lead 5,71. Il `<main>` sta nella pagina perché `Base` non lo ha.
- **files edited/created**: `src/pages/showcase/[slug].astro`, `src/components/showcase/MediaArticolo.astro`, `src/scripts/articolo.ts`, `src/layouts/Base.astro` (`nav="article"`)
- **tdd_target**: `dist/showcase/segnaposto-immagine/index.html` esiste, con h1 uguale al suo titolo e un `Article` con `datePublished` `2026-11-15`. Oggi la pagina non esiste.
- **review_mode**: mixed
- **assigned_skills**: agent-browser, ui-review
- **complexity**: medium

### T8: Sezione 04 in home: struttura, schede e date

- **depends_on**: [T5, T6]
- **location**: `src/components/Showcase.astro` (nuovo), `src/pages/index.astro` (sostituisce le righe 221-275; toglie il CSS a 700-790 e lo script a 1022-1059), `src/styles/global.css` (solo `scroll-padding-top`)
- **description**:
  - La sezione nuova sta nella stessa posizione, con `id="shipped"`, fondo scuro e tema scuro (D15). Contiene, nell'ordine di AC5:
    - l'eyebrow «04 La prova», con l'«04» di un colore che misura almeno 4,5:1 (AC28);
    - `<h2 lang="en">` (AC28);
    - il lead (AC3);
    - la riga «16 articoli da maggio 2025 · l'ultimo il 15 nov», con `data-rel` (D10);
    - i filtri e lo spazio per le frecce, che aggiunge T9;
    - la fila `<ol aria-label="Ultimi articoli">` (D12, D13), con schede in variante `home` larghe 320 px, oppure `min(82vw, 340px)` fino a 700 px (AC27);
    - la scheda finale «Tutti gli articoli · 16 →», con `aria-hidden="true"` sul suo `<li>` e `tabindex="-1"` sul link (D13);
    - il link del piede «Tutti gli articoli · 16», verso `/showcase/`;
    - il feed.
  - Il filtro usa `bindTags` di T6 con `limit: 8`.
  - Lo script inline subito dopo la sezione mette `data-js` (D11). `data-armed` lo aggiunge T13, nello stesso script.
  - In `global.css`, `html { scroll-padding-top: <altezza della nav> + 8px }` (AC27).
  - Va tolto il codice della sezione vecchia: markup, CSS `.hscroll`/`.hs-*`/`.case-*` e script. La nuova sezione non usa `.reveal`.
  - Il link dell'hero resta su `#shipped`.
- **validation**:
  - in `dist/index.html`:
    - `#shipped` sta dopo Confronto e prima di `#pricing`;
    - le sette parti sono nell'ordine di AC5, e l'eyebrow dice «04 La prova»;
    - l'h2 ha `lang="en"` e il lead è quello di AC3;
    - la riga dice «16 articoli da maggio 2025 · l'ultimo il 15 nov»;
    - in `dist/index.html` le 4 schede con `data-tag="caso-studio"` sono, nell'ordine, Motion «26 lug», Offerte AI «30 apr», Onboarding «20 mar» ed Excel «21 mag 2025» (D29, D30);
    - ci sono 8 `li` visibili, e gli altri hanno `hidden`;
    - il `<li>` della scheda finale ha `aria-hidden="true"` e il suo link `tabindex="-1"`;
    - non restano `hscroll`, `hsTrack`, né `.reveal` dentro la sezione;
  - con agent-browser a 1440 px, Tab passa per chip, schede, «Tutti gli articoli», bottone e link del feed, saltando la scheda finale (AC23);
  - con l'orologio finto (D22) (AC10):
    - al 2026-11-20 la prima scheda dice «5 giorni fa» e la riga «l'ultimo 5 giorni fa»;
    - al 2026-11-16 dice «ieri»;
    - al 2026-11-23 dice «15 nov», e la riga «l'ultimo il 15 nov»;
  - a 280, 375, 700, 1024 e 1440 px, la `y` del link «Tutti…» e l'altezza delle schede sono le stesse con i tre filtri (AC7);
  - a 667×375 e 844×390, con Tab su una scheda, il bordo superiore dell'anello sta sotto la nav. Da 415 a 700 px le schede sono larghe al massimo 340 px (AC27);
  - il contrasto dell'«04» e del testo secondario sul fondo reale della scheda scura è almeno 4,5:1 (AC24, AC28);
  - con JS spento si vedono le 8 schede di «Tutti», i link funzionano, non ci sono chip, frecce né bottone di copia, e niente ha opacità 0 (AC30).
- **status**: Completed
- **log**: 2026-11-16, worker sonnet, una revisione. `t8-dist.mjs` tutto ok (posizione, sette parti in ordine, «04 La prova», h2 `lang=en`, lead, «16 articoli da maggio 2025 · l'ultimo il 15 nov», 8 `li` visibili su 12, casi studio «26 lug», «30 apr», «20 mar», «21 mag 2025», scheda finale fuori dal Tab, niente codice vecchio). Worker: filtri, etichette e `href` del piede, annunci «4 casi studio» e «Le ultime 8 di 12 release»; contrasto «04» 6,62, meta 5,0, testo 6,47, numero del chip premuto 5,97. Orchestratore: orologio finto al 20, 16 e 23 novembre → «5 giorni fa», «ieri», «15 nov» e la riga di conseguenza; JS spento: 8 schede, nessun controllo, niente a opacità 0, «il 15 nov»; Tab a 1440 px: chip, 8 schede, «Tutti gli articoli», bottone e link del feed, senza la scheda finale; `y` del link «Tutti…» e altezza delle schede uguali con i tre filtri a 280, 375, 415, 500, 700, 1024 e 1440 px; schede di 340 px da 415 a 700 px; a 667×375 e 844×390, Tab scendendo dai chip mette l'anello sotto la nav (234 e 71,6 px contro 69). Deviazioni del worker: `flex: none` sul corpo della scheda in home (senza, l'altezza fissa non teneva), riga in grassetto intera, classe `.sh-tools`.
- **files edited/created**: `src/components/Showcase.astro`, `src/pages/index.astro`, `src/styles/global.css` (`scroll-padding-top: 77px`), `src/components/showcase/Scheda.astro` (`flex: none`)
- **tdd_target**: in `dist/index.html`, dentro `#shipped`, c'è un `ol[aria-label="Ultimi articoli"]` con 8 `li` visibili, e la prima scheda punta a `/showcase/segnaposto-immagine/`. Oggi c'è la fila vecchia con 4 casi studio.
- **review_mode**: mixed
- **assigned_skills**: agent-browser, ui-review
- **complexity**: medium

### T9: Fila in home: frecce, cambio filtro e annunci

- **depends_on**: [T8]
- **location**: `src/scripts/fila.ts` (nuovo), `src/components/Showcase.astro`
- **description**:
  - **Frecce** «Articoli più recenti» e «Articoli meno recenti», come `aria-label` (AC17):
    - sono `solo-js` (D11) e si vedono solo con `(hover: hover) and (pointer: fine)`, altrimenti `display: none`;
    - quando la fila non scorre (`scrollWidth <= clientWidth + 1`) hanno `visibility: hidden`, così la riga di chip e frecce non cambia altezza (D26);
    - lo stato si ricalcola al resize e al cambio filtro;
    - alle estremità hanno `aria-disabled="true"`, non `disabled`, e il clic non fa niente: il focus resta sulla freccia;
    - quando l'utente scorre la fila da sé (trackpad, Shift+rotella, Tab su una scheda), a `scrollend`, se nessuna freccia sta scorrendo, l'indice diventa `round(scrollLeft / passo)`, limitato al massimo. Dove `scrollend` non c'è (`!('onscrollend' in window)`), lo stesso dopo 150 ms senza eventi `scroll`;
    - ogni clic sposta un indice di arrivo di tante schede quante ne stanno intere (`fit`) e chiama `strip.scrollTo({ left: indice × passo })`, dove il passo è la larghezza della scheda più 16 (D26). `behavior` è `'smooth'`, oppure `'instant'` con reduced motion, letto da `matchMedia` al momento del clic. Niente `scroll-behavior` sulla fila in CSS.
  - **Cambio filtro** (AC7), nello stesso task: si cambiano gli `hidden`, poi `strip.scrollTo({ left: 0, behavior: 'instant' })`, che interrompe uno scorrimento fluido in corso. Poi l'indice torna a 0 e le frecce si aggiornano. Al rAF successivo, se `scrollLeft` non è 0, si ripete lo stesso `scrollTo`. Etichette e `href` li aggiorna T6.
  - **Annunci** in home: «Gli ultimi 8 di 16 articoli», «Le ultime 8 di 12 release», «4 casi studio» (AC23).
  - La fila non è una fermata di Tab (AC26).
- **validation** (agent-browser):
  - a 1440 px con mouse le frecce si vedono con «Tutti». Con «Casi studio» (4 schede) la fila non scorre, e le frecce spariscono. A 1024 px con «Casi studio» si vedono;
  - con un dispositivo touch emulato le frecce non ci sono;
  - all'inizio «più recenti» ha `aria-disabled="true"`. Cliccando «meno recenti» fino in fondo, anche questa ha `aria-disabled="true"`, e `document.activeElement` resta la freccia (AC17);
  - a 1440 px un clic sposta `scrollLeft` di n × (larghezza della scheda + 16), con n uguale alle schede intere visibili (AC17);
  - clic su «meno recenti», poi su «Release» entro 100 ms: dopo 600 ms `scrollLeft` è 0 e il bordo sinistro della prima scheda è allineato al contenuto (AC7);
  - dopo «Release» la regione di stato dice «Le ultime 8 di 12 release» (AC23), la scheda finale e il link del piede dicono «Tutte le release · 12» e il link punta a `/showcase/?tag=release`. Dopo «Tutti» dicono «Tutti gli articoli · 16» e il link punta a `/showcase/` (AC6, AC15);
  - con `scrollLeft` portato a mano a 3 × passo, un clic su «meno recenti» finisce a (3 + fit) × passo (D26);
  - con puntatore fine e frecce visibili, chip e frecce stanno su una riga da 358 a 1440 px, e su due al massimo da 280 a 357 px (AC19);
  - con reduced motion emulato, `scrollLeft` arriva subito al valore finale (AC29).
- **status**: Completed
- **log**: 2026-11-16, worker sul modello dell'orchestratore (complexity high), una revisione. Worker: passo 336 (320 + 16), `fit` 3, un clic 0 → 1008, fino in fondo 1936 con `aria-disabled` e focus sulla freccia; riallineamento dopo scorrimento a mano (336 + clic → 1344, 1008 + clic → 1936 = massimo); touch emulato via CDP: frecce assenti; con 2 schede la fila non scorre e le frecce hanno `visibility: hidden`, riga dei controlli sempre 44 px; annunci «4 casi studio», «Le ultime 8 di 12 release», «Gli ultimi 8 di 16 articoli»; piede a 956 px dalla cima della sezione con tutti i filtri; Tab chip → frecce → prima scheda, `ol` non focalizzabile. Orchestratore: clic su «meno recenti», «Release» 80 ms dopo (scrollLeft a 26): campionando a ogni rAF per 800 ms il massimo è 0 e la prima scheda è a 184 px = gutter; reduced motion: 1008 al frame successivo. Correzioni del piano: «Casi studio» a 1440 px scorre (4 schede + la finale), la prova della fila ferma va fatta con 1–2 schede; chip e frecce su una riga solo da circa 459 px, vedi IMPLEMENTATION-NOTES.
- **files edited/created**: `src/scripts/fila.ts`, `src/components/Showcase.astro`
- **tdd_target**: a 1440 px, cliccando «Articoli meno recenti» e poi «Release» entro 100 ms, dopo 600 ms la fila ha `scrollLeft` 0. Oggi le frecce non esistono.
- **review_mode**: browser
- **assigned_skills**: agent-browser
- **complexity**: high

### T10: Link verso `/showcase/`, voce attiva e nav stretta

- **depends_on**: [T6, T7, T8]
- **location**: `src/layouts/Base.astro`, `src/pages/case-study/[slug].astro` (riga 390), `src/styles/global.css` (nav, intorno alla riga 86), `src/pages/showcase/index.astro` (prop `active`)
- **description**:
  - In `Base.astro`:
    - il ritorno dei casi studio va a `/showcase/?tag=caso-studio`;
    - la voce «Showcase» va a `/showcase/`;
    - `active` accetta anche `'showcase'`, che aggiunge `active-link` e `aria-current="page"` (AC16).
  - Nel caso studio, «Altri casi studio» va a `/showcase/?tag=caso-studio` (AC16).
  - Nav a 280 px: «Prenota una call» sta su una riga e non tocca il logo (AC28).
- **validation**:
  - in `dist/`, `/#shipped` resta solo nell'hero della home;
  - nei 4 casi studio, il link di ritorno e «Altri casi studio» puntano a `/showcase/?tag=caso-studio`;
  - con agent-browser, dal caso studio, «← Tutti i casi studio» apre `/showcase/` con «Casi studio» premuto (AC16);
  - su `/showcase/` la voce «Showcase» ha `aria-current="page"`;
  - a 280 px il bottone della nav è alto una riga e il suo rettangolo non interseca quello del logo (AC28).
- **status**: Completed
- **log**: 2026-11-16, worker haiku, una revisione. Prima: ritorno dei casi studio verso `/#shipped`; a 280 px il bottone della nav andava su 3 righe (66 px) e toccava il logo. Dopo: ritorno e «Altri casi studio» dei 4 casi studio verso `/showcase/?tag=caso-studio`, che apre «Casi studio» premuto; «Showcase» della nav verso `/showcase/`, con `active-link` e `aria-current="page"` su quella pagina (anche «Prezzi» su `/pricing/`); `#shipped` resta solo nell'hero; a 280 px bottone su una riga (41,8 px), 9,6 px dal logo. Fuori scope, dal worker: `/pricing/` scorre di lato a 280 px (scheda Partner larga 331 px), già prima di questo lavoro.
- **files edited/created**: `src/layouts/Base.astro`, `src/pages/case-study/[slug].astro`, `src/pages/showcase/index.astro`, `src/styles/global.css` (nav sotto 360 px)
- **tdd_target**: in `dist/case-study/dati-da-excel/index.html` il link «← Tutti i casi studio» punta a `/showcase/?tag=caso-studio`. Oggi punta a `/#shipped`.
- **review_mode**: mixed
- **assigned_skills**: agent-browser
- **complexity**: low

### T11: Feed RSS

- **depends_on**: [T3, T4, T10]
- **location**: `src/pages/rss.xml.ts` (nuovo), `src/layouts/Base.astro` (solo il `<link rel="alternate">`)
- **description**:
  - Il feed di D17. Il canale:
    - `title` «spatalo.tech — Showcase», `link` `/showcase/`, `language` `it-IT`;
    - una `description` senza cadenza (AC3);
    - `atom:link rel="self"`.

    Niente `lastBuildDate`, che cambierebbe a ogni build.
  - Gli item sono tutti gli articoli, nell'ordine di `getArticles()`. `<rss>` dichiara `xmlns:atom` (D17).
  - `Base.astro`: `<link rel="alternate" type="application/rss+xml" title="spatalo.tech — Showcase" href="/rss.xml">` (AC20).
- **validation**:
  - `xmllint --noout dist/rss.xml` esce con 0 e non scrive niente su stderr: con un prefisso non dichiarato esce comunque con 0, ma stampa «namespace error»;
  - ci sono 16 `<item>`, e il primo è `segnaposto-immagine`;
  - l'item di `segnaposto-caratteri` contiene `&amp;`, `&lt;` e `&gt;` (AC31);
  - le categorie sono «Caso studio» e «Release», e nessun item è una bozza;
  - non compare «settiman» (AC3);
  - ogni `dist/**/*.html` contiene il `<link rel="alternate">`;
  - la sitemap non elenca `rss.xml`.
- **status**: Completed
- **log**: 2026-11-16, worker haiku, una revisione. `t11-rss.sh` tutto ok: `xmllint` senza messaggi, 16 item con `segnaposto-immagine` per primo, `segnaposto-caratteri` con `&amp;` `&lt;` `&gt;`, categorie «Caso studio» e «Release», niente bozze né cadenza, `atom:link rel=self` e `xmlns:atom`, niente `lastBuildDate`, `<link rel="alternate">` in ogni pagina HTML, `rss.xml` fuori dalla sitemap, `pubDate` RFC 822. Il titolo del canale e dell'alternate è `SITE.name` + « — Showcase» (cioè «Spatalo — Showcase»), non «spatalo.tech — Showcase».
- **files edited/created**: `src/pages/rss.xml.ts`, `src/layouts/Base.astro` (`<link rel="alternate">`)
- **tdd_target**: `xmllint --noout dist/rss.xml` passa e il feed ha 16 `<item>`. Oggi il feed non esiste.
- **review_mode**: cli
- **complexity**: low

### T12: `/llms.txt`

- **depends_on**: [T4]
- **location**: `src/pages/llms.txt.ts`
- **description**:
  - Prima di cambiare qualcosa, salvare `dist/llms.txt` nello scratchpad.
  - Una sezione «## Showcase» dopo «## Casi studio» (AC22), con:
    - `/showcase/`;
    - il feed `https://spatalo.tech/rss.xml`;
    - una riga per release pubblicata, con `testoPiano(excerpt)`.

    Niente cadenza (AC3).
  - La riga «Home» diventa «…il confronto con le alternative e gli articoli: casi studio e release».
  - «## Casi studio» resta identica.
- **validation**:
  - `dist/llms.txt` contiene «## Showcase», 12 righe di release con il loro URL e il feed, e nessuna bozza;
  - il blocco «## Casi studio» è identico byte per byte a quello salvato;
  - la riga «Home» non dice più solo «i casi studio».
- **status**: Completed
- **log**: 2026-11-16, worker haiku, una revisione. «## Showcase» con /showcase/, feed e 12 release (testo breve senza tag); blocco «## Casi studio» identico byte per byte; nessuna parola di cadenza; riga Home «…e gli articoli: casi studio e release».
- **files edited/created**: `src/pages/llms.txt.ts`
- **tdd_target**: `dist/llms.txt` contiene `## Showcase` e la riga di `segnaposto-immagine`. Oggi no.
- **review_mode**: cli
- **complexity**: low

### T13: Motion della sezione e della pagina

- **depends_on**: [T6, T9]
- **location**: `src/components/Showcase.astro`, `src/components/showcase/*.astro`, `src/pages/showcase/index.astro`, `src/scripts/showcase.ts`, `brain/chore/motion.md`
- **description**: il budget di D26, con i valori di `design-engineer`.
  - **Entrata della sezione 04, una volta per visita:**
    - lo script inline subito dopo la sezione mette `data-armed`;
    - l'IntersectionObserver del modulo mette `data-in`;
    - intestazione e schede salgono da `opacity 0` e `translateY(24px)`; filtri, frecce e piede fanno solo la dissolvenza;
    - `--dur-reveal`, `--ease-out-expo`, `animation-fill-mode: backwards`, ritardo `calc(var(--stagger) * i)` con `i` da 0 a 5;
    - con reduced motion: dissolvenza `--dur-swap` lineare, stessi ritardi;
    - allontanarsi e tornare non la fa ripartire.
  - **Swap del filtro:**
    - `[data-swap]` va da `opacity 0` e `translateY(8px)` alla posizione di riposo, con `--dur-ui` e `--ease-out`, senza stagger né uscita;
    - in home va sulle schede visibili e sulla scheda finale; in `/showcase/` sui `[data-group]` visibili, così il titolo del mese arriva con le sue schede;
    - per farlo ripartire: si toglie l'attributo, si forza un solo reflow dopo tutti i cambi al DOM, si rimette. Niente rAF e niente `getAnimations()`;
    - il primo clic su un chip «assesta» solo la fila (`data-settled`), non intestazione e piede;
    - con reduced motion resta solo l'opacità.
  - **Hover e pressione:**
    - dentro `@media (hover: hover) and (pointer: fine)` vanno:
      - il bordo della scheda verso `--t-accent` (`--dur-hover`, `--ease-out`);
      - l'immagine della copertina a `scale(1.03)` (`--dur-ui`, `--ease-out`), con `transform-origin: left top`, la stessa origine di `object-position` (Omar, D31);
      - l'hover della scheda finale;
      - il bordo dei chip, in tutti e due i temi;
      - il fondo delle frecce, tranne quelle con `aria-disabled`;
      - il «Tutti…» che sale di `translateY(-1px)`;
      - i colori del bottone e del link del feed;
    - ogni trasformazione sta anche dentro `(prefers-reduced-motion: no-preference)`;
    - la pressione non dipende da hover: scheda `scale(0.98)`, chip e «Tutti…» `scale(0.97)`, frecce `scale(0.95)`, tutte con `--dur-press` e `--ease-press`;
    - una freccia con `aria-disabled` va a opacità 0,35 (`--dur-hover`, `--ease-out`);
    - le proprietà sono sempre nominate: niente `transition: all` e niente `will-change`.
  - **Istantaneo:**
    - mesi che compaiono e spariscono, altezze, cambio di etichetta del feed (senza cambio di `font-weight`), date riscritte;
    - arrivo su `/showcase/` e sulla pagina release, che non usano `.reveal` né il count-up del numero;
    - frecce nascoste quando la fila non scorre.
  - La fila ha `overflow-y: hidden`, così durante la salita non intercetta la rotella.
  - In `brain/chore/motion.md`:
    - in «Deviazioni volute dagli standard», la riga di D27;
    - tolto l'overlay dei casi studio: dai pezzi forti della home (da 4 a 3), dall'elenco di `--ease-pop` e dalla deviazione «Overlay dei casi studio a 800ms». `--dur-showpiece` resta, perché lo usa l'entrata della parete clienti;
    - in «Aperto», la sezione 04 come terzo esempio di entrata armata dallo script.
- **validation** (agent-browser, Chromium; la curva di un'animazione CSS si legge da `effect.getKeyframes()[0].easing`, perché `getTiming().easing` dice `linear`):
  1. JS spento, a 375 e 1440 px: tutto a opacità 1, nessun `data-armed`, 8 schede, nessun chip, freccia o bottone di copia.
  2. A 1440 px, pagina in cima: la sezione 04 ha `data-armed` e intestazione e schede hanno opacità 0.
  3. Entrata, a 1440 e 375 px, dopo uno scroll istantaneo:
     - `getAnimations({ subtree: true })` dà 700 ms, `cubic-bezier(0.19, 1, 0.22, 1)` e ritardi tra 0 e 500;
     - intestazione e schede si spostano di 24 px, strumenti e piede solo in dissolvenza;
     - a +1,5 s non gira niente, e allontanarsi e tornare non crea animazioni nuove.
  4. Swap, a 1440 px:
     - «Casi studio»: un'animazione per ogni scheda visibile e per la scheda finale, 250 ms, `cubic-bezier(0.23, 1, 0.32, 1)`, ritardo 0, stesso `startTime`;
     - «Release» e poi «Tutti» entro 100 ms: una sola animazione per scheda, con `currentTime` sotto 100;
     - in `/showcase/`: lo stesso sui `[data-group]`, con `scrollY` invariato.
  5. Stabilità, a 280, 320, 375, 414, 430, 468, 700, 701, 1024 e 1440 px, e a 1440 px a 1,25×, con puntatore fine: tra i tre filtri non cambiano di nemmeno un pixel l'altezza della fila, la `y` del «Tutti…», l'altezza della riga del piede e la cima della sezione 05. Si ripete con un filtro di 1–2 schede, con release in bozza per prova.
  6. Reset a metà scorrimento: clic su «meno recenti», poi «Release» 80 ms dopo. Campionando `scrollLeft` a ogni rAF per 800 ms, è 0 dopo il clic.
  7. Frecce:
     - lo scorrimento fluido passa per più di 2 valori intermedi;
     - un clic finisce a `fit × stride`, un doppio clic a `2 × fit × stride`;
     - con reduced motion il valore finale arriva in un frame.
  8. Reduced motion:
     - i keyframe di entrata e swap non hanno `transform`, e l'entrata dura 400 ms, lineare;
     - con `:hover` e `:active` forzati la trasformazione è `none` ovunque, mentre i colori cambiano;
     - `<html>` ha `scroll-behavior: auto`.
  9. Touch (`hover: none`, `pointer: coarse`): un `:hover` forzato lascia invariati bordo e immagine, e le frecce non ci sono. Con puntatore fine: bordo accent, immagine `matrix(1.03, …)` con origine `0px 0px`.
  10. Copia del feed, riuscita e fallita: i rettangoli del bottone, della riga del piede e della sezione 05 non cambiano.
  11. Arrivo su `/showcase/` e su una release: nessuna animazione oltre al video.
- **status**: Completed
- **log**: 2026-11-16, worker sul modello dell'orchestratore (complexity high), una revisione; `design-engineer` non richiamato: i valori erano già fissati in D26, D27 e D31. Worker, controlli 1–10 tutti ok: JS spento senza `data-armed` e tutto a opacità 1; entrata con 15 animazioni da 700 ms `cubic-bezier(0.19, 1, 0.22, 1)`, ritardi 0–400, 24 px su intestazione e schede, solo dissolvenza su strumenti e piede, nessuna ripartenza; swap 250 ms `cubic-bezier(0.23, 1, 0.32, 1)` su schede visibili + finale (home) e sui mesi (`/showcase/`), `scrollY` invariato; stabilità di fila, «Tutti…», piede e sezione 05 con i tre filtri a 280, 375, 700, 1024 e 1440 px; reduced motion: solo opacità, entrata 400 ms lineare, `scroll-behavior: auto`; touch: niente hover; puntatore fine: immagine `matrix(1.03…)` con origine `0px 0px`; copia del feed senza spostamenti; nessuna animazione all'arrivo su `/showcase/` e sulle release. Orchestratore: ricontrollata l'entrata (15 animazioni, 700 ms, expo, ritardi 0–400) e lo swap (250 ms `--ease-out`); corretta la regola `.chip` di `Filtri.astro`, che dal T5 colpiva anche i `.chip` già presenti in home (ora `.sc-chips .chip`, `min-height` dei chip della home torna `auto`); corretto il commento di `--dur-showpiece` in `global.css`. Nota: durante i primi ~35 ms dell'entrata le schede, ancora quasi trasparenti, hanno gli ultimi 12 px tagliati da `overflow-y: hidden`.
- **files edited/created**: `src/components/Showcase.astro`, `src/components/showcase/{Filtri,Scheda,Copertina,Feed}.astro`, `src/pages/showcase/index.astro`, `src/scripts/showcase.ts`, `brain/chore/motion.md`, `src/styles/global.css` (commento di `--dur-showpiece`)
- **tdd_target**: a 1440 px, dopo aver portato in vista la sezione 04, `getAnimations({ subtree: true })` contiene animazioni di 700 ms con easing `cubic-bezier(0.19, 1, 0.22, 1)`. Oggi la sezione non ha entrata.
- **review_mode**: browser
- **assigned_skills**: agent-browser, design-engineering
- **complexity**: high

### T14: Verifica completa sui segnaposto

- **depends_on**: [T7, T10, T11, T12, T13]
- **location**: nessun file del sito. Script e screenshot nello scratchpad; i risultati vanno nel log.
- **description**:
  - Un giro di tutta la tabella States di `FLOW.md`, con i segnaposto. Anche le righe `present` vanno ricontrollate: tornando indietro da un articolo alla home, filtro e posizione della fila devono essere conservati.
  - Gli stati che servono a contenuto cambiato si preparano con modifiche temporanee, poi annullate:
    - un tag con 0 articoli: tutte le release in bozza;
    - un tag con 1 articolo: tutte le release in bozza tranne una («Tutte le release · 1», «1 release») (AC6).
  - Un giro UI con la skill `ui-review` su home, `/showcase/` e una release:
    - larghezze 280, 320, 357, 358, 375, 414, 415, 700, 701, 1023, 1024 e 1440 px, a 1× e 1,25×, più 667×375 e 844×390;
    - contrasto, anelli di focus, bersagli, nomi accessibili, testo che va a capo.
  - I controlli trasversali:
    - AC1: `grep -r "BOZZA-NON-PUBBLICARE" dist` è vuoto;
    - AC2: la scheda, la pagina, l'item del feed, il JSON-LD e la riga di `/llms.txt` di ogni release white label non contengono nessun altro nome di `PROJECTS`, e la pagina non ha «Leggi il caso studio completo»;
    - AC3: `grep -i -E "settiman|ogni settimana|aggiornato ogni"` su `#shipped` di `dist/index.html`, su `dist/showcase/**`, su `dist/rss.xml` e sulla sezione Showcase di `dist/llms.txt` è vuoto;
    - AC10: orologio finto;
    - AC12: media bloccati, in home e in pagina;
    - AC25: titolo di 100 caratteri via DOM;
    - AC29: reduced motion;
    - AC30: JS spento;
    - AC31: JSON-LD di tutte le pagine e `xmllint`.
  - Ogni fallimento torna al task che lo possiede, con la misura.
- **validation**:
  - ogni riga di States ha esito «ok», con la sua prova nel log;
  - nessun AC da AC5 ad AC31 ha un controllo fallito;
  - `npm run build` passa.
- **status**: Completed
- **log**: 2026-11-16, worker sonnet. Rapporto completo in `verifica/T14-REPORT.md`. Passano: tutte le righe di States tranne una, AC1, AC2, AC3, AC10, AC12, AC25, AC29, AC30, AC31, i controlli t5/t7/t8/t11, gli stati con 0 e 1 release. Falliti, ciascuno riportato al suo task: F1 chip premuto in home illeggibile (1,00:1; causato dalla correzione di `.chip` in T13, corretto dall'orchestratore: ora 18,06:1 e numero 5,97:1); F2 (T9) Tab su una scheda in parte fuori dalla fila non la fa scorrere, anello tagliato; F3 (T8/T6, AC27) in orizzontale l'anello finisce sotto la nav risalendo, e anche scendendo su `/showcase/` a 667×375; F4 il pulsante flottante copre l'anello del piede e del feed (fino al 65 %); F5 (T10, AC28) a 280 px con 125 % la nav sborda di 7 px; F6 (T8) senza bfcache Indietro perde filtro e posizione della fila. Correzioni F2–F6: worker sul modello dell'orchestratore, una revisione. F2: `focusin` sulla fila la fa scorrere fino alla scheda (anello tagliato 0 px da 375 a 1440 px, avanti e indietro). F3+F4: `tieniVisibile(root)` in `showcase.ts`, solo con `:focus-visible`, porta l'anello sotto la nav (76,5–77,5 px contro 69) e sopra il pulsante flottante (0 % coperto a 280, 375, 700 e 1024 px). F5: nav sotto 360 px più stretta (a 125 % bottone su una riga, 11 px dal logo); l'h1 di `/showcase/` va a capo con il trattino (corretto dall'orchestratore): a 280 px con 125 % nessuno sborda su `/showcase/` e sulle release. F6: `history.replaceState` salva filtro e posizione della fila; senza bfcache Indietro ritrova «Release» e `scrollLeft` 1008. Orchestratore: ricontrollati F1, F3 (Shift+Tab a 667×375: 76,9 px), F5 e F6. Restano, annotati in IMPLEMENTATION-NOTES: in orizzontale il pulsante flottante copre il 4–9 % del fondo delle schede più alte dello spazio libero; su `/showcase/` alcune schede raggiunte con Tab hanno il fondo dell'anello 5 px sotto il bordo dello schermo; la home a 280 px con 125 % sborda di 28 px nel pannello prezzi, già prima di questo lavoro.
- **files edited/created**: rapporto in `verifica/T14-REPORT.md`; correzioni in `src/scripts/fila.ts`, `src/scripts/showcase.ts`, `src/components/Showcase.astro`, `src/pages/showcase/index.astro`, `src/styles/global.css` (nav sotto 360 px)
- **tdd_target**: il log di T14 ha un esito per ogni riga di States di `FLOW.md`. Oggi non ne ha nessuno. È un task di verifica: i controlli dovrebbero passare già all'inizio, e ognuno che fallisce torna al suo task.
- **review_mode**: mixed
- **assigned_skills**: agent-browser, ui-review, design-engineering
- **complexity**: medium

### T15: Contenuti veri (Omar)

- **depends_on**: [T14]
- **location**: `src/content/releases/*.md`, `src/content/case-studies/*.md`, `public/` (media nuovi)
- **description**:
  - Omar scrive almeno 4 release seguendo la sezione «Nuova release» del README, oppure passa il materiale e l'orchestratore scrive i file per la sua approvazione (domanda aperta 1). Può cominciare in qualunque momento dopo T2. I segnaposto si tolgono solo dopo T14, che li usa.
  - Per ogni release in white label, Omar decide: anonima oppure non pubblicata (AC2).
  - Si tolgono tutti i `segnaposto-*.md` e tutte le righe `SEGNAPOSTO`. Un video nuovo ha il suo poster.
- **validation**:
  - `grep -rl '# SEGNAPOSTO' src/content` è vuoto;
  - ci sono almeno 4 release non in bozza e i 4 casi studio hanno `published`;
  - `npm run build` passa.
- **status**: Planned
- **log**:
- **files edited/created**:
- **tdd_target**: `VERCEL_ENV=production npm run build` passa. Oggi fallisce per i segnaposto.
- **review_mode**: cli
- **complexity**: low

### T16: Gate di lancio

- **depends_on**: [T15]
- **location**: nessun file del sito
- **description**:
  - `VERCEL_ENV=production npm run build` deve passare, con «Segnaposto: guardia attiva» nel log.
  - Con i contenuti veri si rifanno i controlli su `dist/`:
    - sitemap;
    - `xmllint` del feed;
    - `/llms.txt`;
    - JSON-LD di tutte le pagine;
    - AC3;
    - nessuna release inventata del prototipo: nessun titolo di `src/lab/showcase/data.ts` compare in `dist/` (AC4).
  - Un giro breve in browser di home, `/showcase/` e ogni release, a 375 e 1440 px, con titoli e media veri: AC7, AC12, AC25.
  - Solo se Omar chiede il push del branch, sull'anteprima Vercel il log di build deve dire «Segnaposto: guardia spenta (VERCEL_ENV=preview)». Se dice `VERCEL_ENV=` vuoto, le variabili di sistema non sono esposte: lo si dice a Omar (D6, Ricerca).
- **validation**:
  - la sitemap contiene esattamente i 7 URL di oggi, più `/showcase/`, più uno per ogni release vera;
  - i titoli delle 28 release del prototipo non compaiono in `dist/`;
  - tutti i controlli cli di T3, T11 e T12 passano sui contenuti veri.
- **status**: Planned
- **log**:
- **files edited/created**:
- **tdd_target**: è un task di verifica, senza RED proprio. Il controllo guida: la sitemap contiene i 7 URL di oggi, più `/showcase/`, più una voce per ogni release vera.
- **review_mode**: mixed
- **assigned_skills**: agent-browser
- **complexity**: low

### T17: Prove a mano su dispositivo e screen reader (Omar)

- **depends_on**: [T16]
- **location**: nessun file. I risultati vanno nel log; un difetto diventa una correzione nel task che lo possiede.
- **description**: le prove delle Constraints della spec.
  - iPhone Safari:
    - sezione 04, tap su una scheda, poi Indietro: niente bordo accent e niente immagine ingrandita rimasti;
    - in `/showcase/`, un tap al centro di una scheda con video apre l'articolo.
  - VoiceOver + Safari:
    - feed copiato: l'esito si sente;
    - «Casi studio»: si sentono lo stato premuto e il conteggio;
    - «Articoli meno recenti» fino in fondo: il cursore resta sulla freccia.
  - NVDA + Firefox, su `/showcase/?tag=caso-studio`: una sola fermata sulla scheda con video, letta con il titolo.
  - Tab sulla prima scheda in home: il titolo arriva per primo e l'annuncio è breve.
  - Un giro veloce in Firefox e Safari desktop, che la review UI non ha provato.
- **validation**: ogni prova ha esito «ok», oppure una correzione fatta e riprovata.
- **status**: Planned
- **log**:
- **files edited/created**:
- **tdd_target**: su iPhone Safari, un tap al centro della scheda con video in `/showcase/?tag=caso-studio` apre l'articolo e il video non parte.
- **review_mode**: browser
- **assigned_skills**: agent-browser
- **complexity**: low

### T18: Cancellare il prototipo e chiudere la documentazione

- **depends_on**: [T16], più la conferma di Omar che il deploy è in produzione (D24)
- **location**: `src/lab/` (da cancellare), `src/prototypes/integration.mjs` (tolte le 2 righe della rotta `/lab`), `README.md`
- **description**:
  - Dopo il deploy in produzione: cancellare `src/lab/`, che contiene anche `Lab.astro`, `UX-REVIEW.md` e `UI-REVIEW.md`, e riportare `src/prototypes/integration.mjs` a com'è su `main` (D24).
  - Le righe del README possono andare nella PR insieme al resto, prima del deploy.
  - `README.md`, tabella della struttura:
    - nuove righe per `src/pages/showcase/index.astro`, `src/pages/showcase/[slug].astro`, `src/pages/rss.xml.ts`, `src/components/Showcase.astro`, `src/components/showcase/`, `src/data/articoli.ts`, `src/data/articoli-testi.ts` e `src/content/releases/`;
    - la riga della home dice «showcase» al posto di «vetrina casi studio»;
    - le righe di `llms.txt` e `seo.ts` citano le release.
- **validation**:
  - `src/lab` non esiste;
  - `grep -rn "src/lab\|/lab/" src` è vuoto;
  - `git diff main -- src/prototypes/integration.mjs` è vuoto;
  - `npm run build` passa;
  - in dev, `/lab/showcase` risponde 404.
- **status**: Planned
- **log**:
- **files edited/created**:
- **tdd_target**: `test ! -d src/lab && npm run build` passa. Oggi `src/lab` esiste.
- **review_mode**: cli
- **complexity**: low

## Ondate di esecuzione

Le ondate dicono cosa potrebbe girare insieme secondo `depends_on`. L'esecuzione però è in sequenza (D28), un task alla volta in questo ordine, perché i task condividono `dist/` e le prove cambiano i contenuti.

| Ondata | Task | Può partire quando |
|---|---|---|
| 1 | T1, T3 | subito |
| 2 | T2 | T1 |
| 3 | T4 | T2 |
| 4 | T5, T12 | T4 |
| 5 | T6 | T5 |
| 6 | T7, T8 | T6 (T7 anche T3) |
| 7 | T9, T10 | T8 (T10 anche T7) |
| 8 | T11, T13 | T10 / T9 |
| 9 | T14 | T7, T10–T13 |
| 10 | T15 (Omar) | T14; la scrittura può cominciare dopo T2 |
| 11 | T16 | T15 |
| 12 | T17 (Omar), T18 | T16; T18 anche dopo il deploy in produzione |

## Copertura dei criteri

| AC | Task | AC | Task |
|---|---|---|---|
| AC1 | T1, T4, T14 | AC17 | T9, T13 |
| AC2 | T1 (D3), T7, T14, T15 | AC18 | T5, T6, T13 |
| AC3 | T5, T7, T8, T11, T12, T14 (D20) | AC19 | T5, T6 |
| AC4 | T15, T16 (D6) | AC20 | T11 |
| AC5 | T8 | AC21 | T3, T5, T7 |
| AC6 | T5, T6, T8, T14 | AC22 | T12 |
| AC7 | T5, T8, T9, T13 | AC23 | T5, T6, T8, T9 |
| AC8 | T5 | AC24 | T5, T7, T8, T14 |
| AC9 | T5, T17 | AC25 | T1, T5, T14, T16 |
| AC10 | T4, T5, T6, T8, T14 | AC26 | T9 (D13) |
| AC11 | T5, T7, T17 | AC27 | T8 |
| AC12 | T5, T14, T16 | AC28 | T5, T7, T8, T10 |
| AC13 | T7 | AC29 | T9, T13 |
| AC14 | T5 | AC30 | T5, T6, T8, T13, T14 |
| AC15 | T6 | AC31 | T3, T7, T11, T14 |
| AC16 | T10 | | |

Le righe di States e di Accessibility di `FLOW.md` hanno ciascuna il loro controllo:
- le righe dei chip, della pagina e del feed in T6, T8 e T9;
- quelle della release in T7;
- quelle dei media in T5;
- le date in T8;
- senza JS e reduced motion in T13 e T14;
- le righe `present` in T14;
- le prove a mano con VoiceOver e NVDA in T17.

## Strategia di test

- Niente test runner (D21). Ogni task parte dal suo `tdd_target`: un controllo che oggi fallisce. Poi uno alla volta gli altri controlli della sua validazione, uno per uno, RED → GREEN.
- **Controlli su `dist/`**: script Node usa e getta nello scratchpad della sessione, dopo `npm run build`. Per l'XML c'è `xmllint`, per il JSON-LD `JSON.parse`.
- **Testi e date** (`articoli-testi.ts`): importati direttamente da Node 26, che toglie i tipi da solo, perché il modulo non ha import.
- **Browser**: `agent-browser`, Chromium headless.
  - Orologio finto con `--init-script` (D22).
  - JS spento con `--args "--blink-settings=scriptEnabled=false"`.
  - Media bloccati con `network route --abort`.
  - Reduced motion e touch con `set media` e `set device`.
  - Larghezze come in T14.
- **Stati con contenuto diverso**, come un tag con 0 o 1 articolo: bozze temporanee, annullate a fine prova.
- **Non coperto in automatico**: Mobile Safari, VoiceOver, NVDA, Firefox e WebKit desktop. Vanno a T17, a mano.

## Rischi e mitigazioni

| Rischio | Mitigazione |
|---|---|
| Un segnaposto va online | Guardia in build di produzione (D6), controllo del repo in T16, nessun push senza Omar (D25) |
| Su Vercel `VERCEL_ENV` è vuoto (variabili di sistema non esposte, o deploy `--prebuilt`) e la guardia non scatta | La riga «Segnaposto: guardia …» nel log di build; il `grep` di T16 non dipende da Vercel |
| zod 4 `.refine` non accettato dallo schema di una collection | Provato per primo in T1. Ripiego: il controllo su `published` in `getArticles()`, con lo stesso messaggio |
| Un `<` letterale nel testo breve finisce in `set:html` | `inlineHtml` (T4) fa l'escape di tutto e riammette solo `strong` ed `em`. Il README lo spiega |
| Nel corpo Markdown, `<Parola>` viene preso per HTML | README: il codice va tra backtick e `<` va seguito da uno spazio. Il segnaposto `segnaposto-caratteri` lo prova |
| Lo scorrimento fluido non si interrompe allo stesso modo in tutti i motori | `scrollTo({ left: 0, behavior: 'instant' })` più un controllo al rAF successivo (D26); Firefox e WebKit a mano in T17 |
| I controlli che servono solo con JS compaiono dopo il caricamento e spostano il layout | Si rivelano con lo stesso script inline che arma la sezione, prima del primo paint (D11) |
| Tornando indietro alla home si perdono filtro e posizione della fila (riga `present` di FLOW) | Si ricontrolla in T14. Se la bfcache non tiene lo stato, il filtro va in `history.replaceState` senza cambiare l'URL |
| Safari perde gli angoli arrotondati durante lo zoom dell'immagine | Controllo in T17; se succede, `isolation: isolate` sulla scheda |
| Nella fila in home la freccia nascosta toglie una riga e sposta il contenuto | `visibility: hidden` quando la fila non scorre (D26); controllo 5 di T13 |
| Uno slug sbagliato in `caseStudy` passa la build senza errore (Astro 7.3.5) | Il controllo in `getArticles()` (D2, D8) e la prova in T4 |
| Una release aperta in una scheda nuova ha il ritorno morto | `history.length > 1` e niente tasti modificatori (D16), prova in T7 |
| Le frecce partono da un indice vecchio dopo uno scorrimento a mano | Indice riallineato a `scrollend` (T9), prova con `scrollLeft` a 3 × passo |
| Il prototipo e la sua rotta finiscono in un commit | D24: in stage tutto tranne `src/lab/` e `src/prototypes/integration.mjs` |
| I contenuti veri arrivano tardi | T15 dipende solo da T14 per togliere i segnaposto. Scrivere si può dopo T2, e niente del codice aspetta Omar |

## Gate di validazione

- **Dopo l'ondata 3 (T4):** `npm run build` passa, e `dist/prova-articoli.json` è giusto. L'endpoint poi si toglie.
- **Dopo l'ondata 8:** `npm run build` passa, e passano tutte le validazioni da T1 a T13.
- **T14:** la verifica completa sui segnaposto, compresa la tabella States di `FLOW.md`.
- **T16:** il gate di lancio con i contenuti veri e `VERCEL_ENV=production`.
- Con `review.mode: plan`, `adversarial-review` sul codice non parte da solo: `implement-spec` lo offre in una riga.

## Domande non risolte

Nessuna. Le quattro domande rimaste dopo il gate sono chiuse il 2026-11-16:

| # | Domanda | Risposta |
|---|---|---|
| 1 | Le release del lancio, almeno 4 (domanda aperta 1 della spec) | Le scrive Omar in T15. Fino ad allora segnaposto, bloccati in produzione da D6 |
| 2 | Le date vere dei 4 casi studio (domanda aperta 2) | D29, con la regola dell'anno di D30 |
| 3 | `transform-origin: left top` per lo zoom della copertina | Confermato (D31) |
| 4 | Il refuso «Da form  chat interattiva» in `offerte-ai.md` | Corretto (D32) |
