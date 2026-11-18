---
domain: showcase
type: plan
links: ["[[specs/showcase/cta-articoli/SPEC]]", "[[specs/showcase/log-articoli/SPEC]]", "[[chore/motion]]", "[[chore/product]]"]
created: 2026-11-17
updated: 2026-11-18
---

# Plan: le CTA negli articoli di release ("Firma" e banner intermedio)

**Status:** Complete: T1–T7 fatti il 2026-11-17, T8 il 2026-11-18 (su richiesta di Omar, prima del deploy).

Contratto: [[specs/showcase/cta-articoli/SPEC]] (AC1–AC12). Non c'è `FLOW.md`, perché le review UX e UI non sono state fatte, e non c'è `STATES.md`. Riferimento vivo fino a T8: il prototipo `src/lab/cta-articoli/` (`/lab/cta-articoli`, solo in dev), cancellato il 2026-11-18. I valori di motion li ha confermati `design-engineer` il 2026-11-17 (D9–D11).

Il gate del piano l'ha eseguito `adversarial-verifier` il 2026-11-17, provando con build reali su una copia della repo: DO NOT SHIP, con 0 blocker, 3 major, 4 minor e 5 nit. Tutti i rilievi sono integrati:
- la lingua del banner nella release inglese (D4, T3);
- T6 dopo T5 (grafo);
- le stringhe del controllo finale (T7);
- il margine di 36 px (D5, T3);
- la prova della guardia (T3);
- il lampo del pulsante flottante (D8, T6);
- gli strumenti del browser (D16);
- e D9, D10, D17, D18.

Il verifier ha confermato con una build di prova che dividere `rendered.html` dà un corpo identico byte per byte a `<Content />` su tutte e 6 le release, con l'aside di Jev prima di `<h2 id="pulizia-e-sinonimi">`.

## Situazione iniziale

- **Pagina release.** È `src/pages/showcase/[slug].astro`.
  - Il corpo si scrive con `<Content />` di `render(entry)`.
  - In fondo c'è `.ar-cta`, con due bottoni nudi (righe 60-65).
  - La regola `.articolo-corpo :global(a)` (riga 93) colora e sottolinea ogni link del corpo.
  - Lo script è `src/scripts/articolo.ts`, che oggi fa solo partire e fermare i video.
  - Il commento in testa dice «All'arrivo si muove solo il video».
- **Release.** Sono 6, in `src/content/releases/*.md`, nessuna in bozza. Ognuna ha da 3 a 7 titoli `##`.
  - Le immagini del corpo sono tutte in `public/` (`/releases/...`), quindi `entry.rendered.html` non contiene segnaposto `__ASTRO_IMAGE_` da risolvere.
  - In ordine di data, dalla più vecchia: `jev-model-grader` (09-22), `agenda-wave` (10-06), `skill-suggerite` (10-20), `ui-sweep` (11-03), `beautiful-ui` (11-10), `cv-anonimo-ai-report` (11-17).
- **Elenco articoli.** `getArticles()` di `src/data/articoli.ts` ordina per data decrescente e, a parità, per `id`. Ogni articolo ha `caseStudy?` solo se il caso studio è pubblicato.
- **Config.** In `src/config.ts`:
  - `SITE.founder` e `SITE.calUrl`;
  - `SLOTS` vale `{ total: 2, taken: 1 }`, quindi oggi c'è uno slot Partner libero;
  - `PRICES.partner.from` vale 2200 e `PRICES.team.sprint` vale 5000;
  - `formatEuro`.
- **Entrate armate.** Il modello esiste già in tre posti: `Clienti.astro:116`, `Showcase.astro:89/374` e i numeri dei casi studio. Uno script inline mette `data-armed`, lo stato nascosto vale solo sotto `[data-armed]:not([data-in])`, e `data-in` arriva da un IntersectionObserver. Il `.reveal` globale invece nasconde anche senza JS.
- **Pulsante flottante.** È `.float-cta` in `Base.astro:98-104`. Lo script alle righe 139-145 lo mostra con `.show` quando `scrollY > 480`, e gli stili sono in `global.css:129-143`.
- **Foto.** Omar l'ha mandata in chat il 2026-11-17: un suo talk al Talent Garden, 800×800, con il viso a destra intorno a (610, 395). Nel repo non c'è.
- **Strumenti.**
  - Non ci sono test runner, lint o typecheck: l'unico gate è `npm run build` con Node 26 (`~/.nvm/versions/node/v26.13.1/bin/node`). Node 26 esegue i `.ts` con type stripping.
  - Per il browser c'è `agent-browser`, anche con reduced motion (`set media … reduced-motion`) e con JS spento (`--args "--blink-settings=scriptEnabled=false"`).
  - Per il ritaglio della foto c'è `sips`.
- **Build.** Il titolo di `cv-anonimo-ai-report.md` ora è di 66 caratteri, quindi la build non è più bloccata. È una modifica di Omar non ancora salvata in git e resta sua.
- **Backlog.** Nessun tracker collegato. Ogni task ha `backlog_item_id: none` e `relation_mode: none`: è la stessa deviazione dei piani precedenti.

## Problema

Le release chiudono con due bottoni senza contesto e non hanno nessun invito durante la lettura. Servono:
- la Firma in fondo (AC1, AC2);
- un solo banner intermedio Partner o Team, scelto in build con una regola stabile (AC3–AC8);
- le entrate senza contenuto nascosto quando manca JS (AC10, AC11);
- il pulsante flottante che si toglie quando la Firma è in vista (AC12).

## Forma della soluzione

1. **Logica pura** in `src/data/cta-articoli.ts`, senza import da `astro:content`:
   - conta i titoli `<h2` di un HTML;
   - divide l'HTML subito prima del titolo centrale;
   - assegna il piano a ogni release.
2. **Componenti** in `src/components/showcase/`:
   - `BannerPiano.astro`, con i due testi da `config.ts`;
   - `Firma.astro`, con la foto, il nome, il testo, il bottone e il link secondario.
3. **Pagina release.**
   - `getStaticPaths` calcola il piano di ogni release da tutte le release.
   - Il corpo diventa `prima` + `<BannerPiano>` + `dopo`, oppure resta `<Content />` quando non c'è il banner.
   - `.ar-cta` lascia il posto a `<Firma>`.
   - La regola dei link del corpo non tocca più i bottoni.
4. **Entrate armate.** Uno script inline in testa a `<main data-articolo>` arma la pagina, e `articolo.ts` mette `data-in`.
5. **Pulsante flottante.** Lo script di `Base.astro` lo nasconde mentre è in vista un elemento `[data-nasconde-float]`, cioè la Firma.

## Registro delle decisioni

| # | Decisione | Fonte |
|---|---|---|
| D1 | Il banner si inserisce **in build, dividendo `entry.rendered.html`** prima del titolo `<h2` numero ⌊N/2⌋+1 (con indice da 0, `⌊N/2⌋`). Il corpo diventa `<Fragment set:html={prima} /><BannerPiano … /><Fragment set:html={dopo} />`.<br>Dentro `<pre>` il testo è già escapato (`&lt;h2`), quindi la ricerca di `<h2` trova solo titoli veri.<br>Con meno di 2 titoli la pagina resta `<Content />`.<br>Non si usa un plugin rehype: girerebbe file per file e non saprebbe il turno, che dipende da tutte le release | piano; spec AC3, AC7 |
| D2 | **Guardia.** Se `entry.rendered?.html` manca, o contiene `__ASTRO_IMAGE_` (un'immagine relativa, che solo `<Content />` sa risolvere), la build fallisce con un `Error` che nomina la release e dice di mettere l'immagine in `public/`. Così il banner non rompe mai un articolo in silenzio | piano |
| D3 | **Regola del piano.** `assegnaPiani(release, partnerLiberi)` prende le release dalla più vecchia alla più recente, cioè `getArticles()` filtrato sulle release e rovesciato, ciascuna con il suo numero di titoli. Restituisce, per `id`, `'partner'`, `'team'` o `null`:<br>• con `partnerLiberi`, un contatore parte da Partner e cambia a ogni release *con* banner; una release con meno di 2 titoli prende `null` e non consuma il turno;<br>• senza `partnerLiberi`, ogni release con banner prende `'team'`.<br>`partnerLiberi` è `SLOTS.total - SLOTS.taken > 0`. Atteso oggi: jev P, agenda-wave T, skill-suggerite P, ui-sweep T, beautiful-ui P, cv-anonimo T | spec AC5 |
| D4 | **Testi** in `BannerPiano.astro`, con la prop `piano: 'partner' \| 'team'`:<br>• Partner: `<b>Da {formatEuro(PRICES.partner.from)} € al mese.</b> Pausa e disdetta libere, il codice è tuo dal primo giorno.`<br>• Team: `<b>Un team di senior a {formatEuro(PRICES.team.sprint)} € per sprint:</b> costruisci più veloce dei tuoi competitor, valida uno sprint per volta.`<br>Il banner è `<aside class="cta-strip" aria-label="Piano Partner">`, oppure `"Piano Team"`. Quando l'articolo non è in italiano (`beautiful-ui.md:12` ha `lang: en`), l'`aside` porta `lang="it"`: sta dentro `<article lang={lang}>` (`[slug].astro:54`) e altrimenti verrebbe letto con la pronuncia inglese. La prop `lang` arriva da `[slug].astro`. Il punto ha `aria-hidden="true"`. Il bottone è `<a class="cta-go" href={SITE.calUrl} target="_blank" rel="noopener">Prenota&nbsp;→</a>`. I valori di stile sono quelli di `Inline.astro` (spec, Technical Notes) | spec AC3, AC4, AC6 |
| D5 | **Link e spazi del corpo (AC7, AC8).**<br>• La regola di `[slug].astro:93` diventa `.articolo-corpo :global(a:not([class]))`: i link scritti nel Markdown non hanno classi, i bottoni sì.<br>• Spazi: `.articolo-corpo > * + *` (18 px) e il `margin: 36px 0` del componente hanno la stessa specificità, e nel bundle vince la pagina, quindi sopra il banner resterebbero 18 px. Si aggiungono a `[slug].astro` `.articolo-corpo > :global(.cta-strip) { margin: 36px 0 }` e `.articolo-corpo > :global(.cta-strip + h2) { margin-top: 0 }`. Nella pagina di oggi non ci sono: stanno solo nel lab | spec AC7, AC8, Technical Notes; verifier |
| D6 | **Foto.**<br>• La consegna Omar, salvando l'originale in `public/firma/omar-originale.jpg`.<br>• Il worker la ritaglia con `sips` in un quadrato centrato sul viso: lato circa 200 px dall'originale 800×800, partendo da circa (510, 295), da affinare a vista.<br>• La porta a 192×192, 4 volte il cerchio, quindi ben sopra i 96 px chiesti per il 2×, e la salva come `public/firma/omar.jpg`. L'originale non entra nel repo.<br>• Il percorso va in `SITE.founderPhoto` di `src/config.ts`.<br>• Nella Firma: `<img src={SITE.founderPhoto} width="48" height="48" alt="" loading="lazy" decoding="async">`, tonda, con `object-fit: cover` | Omar, 2026-11-17; spec AC1, AC2 |
| D7 | **Link secondario della Firma.** «Leggi il caso studio completo» va a `a.caseStudy.href`, altrimenti «Altri articoli» va a `/showcase/`. Prende il posto di `.ar-cta`; `.btn-ghost` non serve più su questa pagina | spec AC1 |
| D8 | **Pulsante flottante (AC12).** Lo script di `Base.astro` resta uno solo. Se nella pagina c'è `[data-nasconde-float]`, un IntersectionObserver (soglia 0) tiene un booleano `coperto`. `.show` vale `scrollY > 480 && !coperto`, ricalcolato allo scroll e a ogni callback. Al primo calcolo `coperto` si legge subito da `getBoundingClientRect()` della Firma (in vista se `top < innerHeight && bottom > 0`), così ricaricando in fondo il flottante non entra sopra la Firma per poi uscire. Nessuna curva nuova: entra ed esce con le transizioni di `.float-cta`. La Firma porta `data-nasconde-float` sul suo `<section>` | Omar, 2026-11-17; `design-engineer` |
| D9 | **Armare.** Il primo figlio di `<main data-articolo>` è `<script is:inline>if('IntersectionObserver' in window)document.currentScript.parentElement.setAttribute('data-armed','')</script>`. Non va nel corpo né accanto al banner, sennò si mette in mezzo tra `aside` e `h2` e rompe AC7. Stati nascosti, solo dentro `@media screen` così in stampa le CTA si vedono:<br>• `[data-articolo][data-armed] .cta-strip:not([data-in]) { opacity: 0 }`;<br>• lo stesso per `.firma-sign`.<br>`articolo.ts` osserva `.cta-strip` e `.firma-sign` con un solo IntersectionObserver (`threshold: 0.15`). Mette `data-in` e fa `unobserve`; fa `disconnect` quando ha visto tutti gli elementi osservati, contati all'avvio (1 se la release non ha banner). Con reduced motion arma comunque, perché la dissolvenza resta | `design-engineer`; spec AC10 |
| D10 | **Animazioni.** Sono keyframe con `animation-fill-mode: backwards` sotto `[data-in]`, come `Showcase.astro:374-402`, non transizioni:<br>• `.firma-sign[data-in]`: `cta-fade` (`opacity` 0→1), `var(--dur-swap) var(--ease-out)`, uguale con reduced motion;<br>• `.cta-strip[data-in]`: `cta-rise` (`opacity` 0→1 e `translateY(24px)`→`none`), `var(--dur-reveal) var(--ease-out-expo)`; con reduced motion, `cta-fade` in `var(--dur-swap)` `linear`;<br>• `.cta-go:active`: `scale(.97)` in `var(--dur-press) var(--ease-press)`, e niente scala con reduced motion.<br>Le regole stanno scoped nei componenti, con `:global([data-articolo][data-armed])` davanti per lo stato armato. Il componente tiene il suo `data-astro-cid` anche tra due frammenti `set:html` (verificato dal verifier).<br>Questa è una deviazione voluta dal Motion brief della spec, che nomina la classe `.reveal`: stessi valori, ma `.reveal` nasconde il banner anche senza JS e romperebbe AC10 | `design-engineer`; spec Motion brief |
| D11 | **Salita del banner a 700ms.** Si tiene il valore del prototipo approvato. `design-engineer` segnala che in un articolo da leggere la salita può sembrare un annuncio; l'alternativa è la sola dissolvenza in `--dur-swap` `--ease-out`, come la Firma. Si cambia solo se Omar lo chiede dopo la verifica di T7 (un valore in un posto). **Chiusa il 2026-11-18: Omar tiene la salita** | prototipo approvato; `design-engineer` |
| D12 | **`brain/chore/motion.md`.** Due righe:<br>• in Deviazioni → «Reveal a 700ms», «vale anche per il banner nel corpo delle release»;<br>• in Aperto o nei modelli, «la pagina release arma le entrate (`data-armed` sul `<main>`, `data-in` da `articolo.ts`)».<br>Va aggiornato anche il commento in testa a `[slug].astro` | `design-engineer` |
| D13 | Niente test runner nuovo. Il RED di ogni task è un controllo che fallisce:<br>• su `dist/` dopo `npm run build`, con script usa e getta nello scratchpad della sessione, fuori dal repo (Node 26 esegue `.ts` e `.mjs`);<br>• oppure nel browser con `agent-browser`, dopo `npx astro preview --port 4329` | precedenti (log-articoli D21) |
| D14 | **Esecuzione in sequenza.** I task condividono `dist/` e alcune validazioni cambiano per prova `src/config.ts` (`SLOTS.taken`) o un articolo. Ogni modifica temporanea si apre e si chiude con `shasum` di `src/config.ts` e `src/content/**`, che deve tornare identico | precedenti (log-articoli D28) |
| D16 | **Strumenti del browser.** `agent-browser set media` accetta solo dark, light e reduced-motion:<br>• **riproduzione rallentata**: `eval "document.getAnimations().forEach(a => a.playbackRate = 0.1)"` subito prima che l'elemento entri in vista;<br>• **1,25×**: lo zoom del browser equivale a un viewport largo `w / 1,25` CSS px con scala 1,25 (`set viewport <w/1.25> <h> 1.25`), quindi si prova anche a 224 px;<br>• **stampa**: non è nella spec, quindi niente controllo dedicato. La regola resta dentro `@media screen` | verifier |
| D17 | **Limite di `contaTitoli`.** Conta ogni `<h2` dell'HTML, anche uno annidato (es. dentro `<details>`). Oggi nessuna release ne ha. Se succedesse, l'aside cadrebbe dentro un contenitore e fuori dalla regola `.cta-strip + h2`. Accettato e annotato nel commento del modulo. **Rivisto il 2026-11-18 dopo la review:** contano solo gli `<h2` a inizio riga e fuori dai contenitori; un `<h2` annidato o in un attributo fa fallire la build ([[specs/showcase/cta-articoli/REPORT]]) | verifier |
| D18 | **Ruolo accessibile.** Un `aside` dentro un `article` è una regione complementare solo se ha un nome. T3 lo controlla nell'albero di accessibilità, non solo come `aria-label` nell'HTML | verifier |
| D15 | Il prototipo `src/lab/` e le due righe della rotta `/lab/[slug]` in `src/prototypes/integration.mjs` restano fuori da ogni commit, perché su `main` punterebbero a file che non ci sono. T8 li cancella dopo che Omar ha confermato il deploy. Commit, push e PR si fanno solo quando Omar lo chiede. **Chiusa il 2026-11-18: Omar ha chiesto di cancellare il prototipo e committare tutto prima del deploy** | spec Context; regola del repo |

## Vincoli

- Sito statico, nessun adapter: piano e posizione del banner si decidono in build.
- Link, prezzi, slot e foto si leggono da `src/config.ts`.
- Motion solo con i token di `global.css`; ogni animazione rispetta `prefers-reduced-motion`.
- Le pagine `.astro` restano senza JavaScript di framework.
- Nessun commit, push o PR senza la richiesta di Omar (D15).

## Ricerca esterna

Nessuna. Il comportamento di Astro è verificato nel codice installato: in `node_modules/astro/dist/content/runtime.js:433-434`, `Content` è `unescapeHTML(rendered.html)` e cambia solo con `imagePaths`.

## Assunzioni

- La foto può stare nel repo pubblico in `public/firma/omar.jpg`: è già un'immagine pubblica di un talk.
- Il contenuto di `entry.rendered.html` è lo stesso che `<Content />` stampa per un `.md` senza immagini relative (D2). T3 lo verifica confrontando il corpo prima e dopo.
- Nessuna release è più corta di 2 titoli oggi. Il caso «senza banner» si prova con una release temporanea (T3).

## Grafo delle dipendenze

```
T2 (logica pura) ── T3 (banner) ──┐
T1 (foto, con Omar) ──────────────┴── T4 (Firma) ── T5 (entrate armate) ── T6 (flottante) ── T7 (verifica completa) ── T8 (pulizia dopo il deploy, con Omar)
```

Le dipendenze formano già una catena: T1 e T2 possono partire insieme perché non toccano `dist/` né le stesse cose, poi T3 → T4 → T5 → T6 → T7 → T8, uno alla volta (D14).

## Task

### T1: Foto della Firma

- **depends_on**: []
- **location**: `public/firma/omar.jpg`, `src/config.ts`
- **description**:
  - Omar salva la foto mandata in chat in `public/firma/omar-originale.jpg`.
  - Il worker la ritaglia con `sips` in un quadrato sul viso (D6), la porta a 192×192 e la salva in `public/firma/omar.jpg`, poi cancella l'originale.
  - Aggiunge `founderPhoto: '/firma/omar.jpg'` a `SITE`.
- **validation**:
  - `sips -g pixelWidth -g pixelHeight public/firma/omar.jpg` dà 192×192.
  - Aperta a 48 px in un cerchio (`border-radius: 50%`), il viso è centrato e intero: niente fronte o mento tagliati, niente microfono davanti alla bocca.
  - L'originale non c'è più.
- **status**: Done
- **log**: 2026-11-17, orchestratore. RED: `test -f public/firma/omar.jpg` falliva. Foto presa da `~/Downloads/profile-image.jpeg` (la stessa della chat), ritagliata 160×160 da (531, 308) e portata a 192×192; l'originale non entra nel repo. Aggiunto `SITE.founderPhoto`. Controllo a vista nel cerchio da 48 px rimandato a T4, nel browser.
- **files edited/created**: `public/firma/omar.jpg`, `src/config.ts`
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: `test -f public/firma/omar.jpg` fallisce oggi.
- **review_mode**: mixed
- **complexity**: low

### T2: Logica pura del banner

- **depends_on**: []
- **location**: `src/data/cta-articoli.ts`
- **description**: Esporta tre funzioni (D1, D3), senza import da `astro:content` e solo con sintassi TypeScript cancellabile, così Node 26 la esegue direttamente:
  - `contaTitoli(html): number`;
  - `dividiAlCentro(html): { prima: string; dopo: string } | null`;
  - `assegnaPiani(release: { id: string; titoli: number }[], partnerLiberi: boolean): Record<string, 'partner' | 'team' | null>`.
- **validation**: Uno script nello scratchpad importa il modulo con Node 26 e controlla:
  - un HTML con 7 `<h2>` si divide prima del 4°, e `prima + dopo` è uguale all'originale;
  - con 1 titolo dà `null`;
  - `<pre><code>&lt;h2&gt;</code></pre>` non conta come titolo;
  - con `[a:7, b:1, c:3, d:4]` (dalla più vecchia) e slot liberi dà `{a:'partner', b:null, c:'team', d:'partner'}`;
  - aggiungere in fondo `e:5` non cambia `a`–`d`, ed `e` prende `'team'`;
  - con slot finiti, tutte le release con banner prendono `'team'`.
- **status**: Done
- **log**: 2026-11-17, worker haiku, approvato alla prima revisione. RED (`scratchpad/red/t2.mjs`) falliva con `ERR_MODULE_NOT_FOUND`, ora stampa `T2 OK`: 7 titoli → prima del 4°, 4 → prima del 3°, 2 → prima del 2°, 0–1 → null, `&lt;h2&gt;` non conta, turni `{a:P, b:null, c:T, d:P}`, `e` aggiunta in fondo prende T senza spostare le altre, slot finiti tutti T, input non mutato. Il commento in testa annota il limite D17.
- **files edited/created**: `src/data/cta-articoli.ts`
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: L'import di `src/data/cta-articoli.ts` fallisce perché il modulo non esiste; poi `dividiAlCentro` con 7 titoli deve tagliare prima del 4°.
- **review_mode**: cli
- **complexity**: low

### T3: Banner intermedio nella pagina release

- **depends_on**: [T2]
- **location**: `src/components/showcase/BannerPiano.astro`, `src/pages/showcase/[slug].astro`
- **description**:
  - Prima di toccare la pagina, salva nello scratchpad il corpo `.articolo-corpo` di `dist/showcase/*/index.html` di oggi: è il confronto.
  - Crea `BannerPiano.astro` (D4) con gli stili esatti del prototipo, compresa la regola sotto i 600 px.
  - In `getStaticPaths`:
    - legge tutte le release pubblicate con `rendered.html`, applicando la guardia D2;
    - calcola i titoli e i piani (D3);
    - passa a ogni pagina `piano` e `parti`.
  - Il corpo diventa `prima` + banner + `dopo`, oppure `<Content />` (D1).
  - Ristringe la regola dei link (D5).
  - In questo task il banner è statico, senza stato armato.
- **validation**: Dopo `npm run build`, uno script su `dist/` controlla:
  - ogni release ha esattamente un `aside.cta-strip` dentro `.articolo-corpo`, subito prima del titolo numero ⌊N/2⌋+1 (Jev: prima di «Pulizia e sinonimi»);
  - il piano è quello atteso di D3;
  - il testo è quello di D4 con «2.200 €» e «5.000 €»;
  - `aria-label` è «Piano Partner» o «Piano Team»;
  - il link porta a `SITE.calUrl` con `target="_blank"`;
  - togliendo l'`aside`, il corpo è identico al confronto salvato.

  Con `SLOTS.taken = 2`, solo per prova, tutte le release mostrano Team; poi si rimette 1 e `shasum` di `src/config.ts` torna identico. Una release temporanea con un solo `##` non ha `aside`, e quella successiva prende il turno che le spettava (D3); poi si cancella e `shasum` di `src/content/**` torna identico.

  Una release temporanea con un'immagine relativa `./x.png`, con il file `src/content/releases/x.png` creato davvero (senza file Astro fallisce prima con `ImageNotFound`), fa fallire la build con il messaggio di D2. Poi si cancellano entrambi e `shasum` di `src/content/**` torna identico.

In `dist/showcase/beautiful-ui/index.html` l'`aside` ha `lang="it"`. Nel browser, a 1440 px:
  - il bottone del banner ha testo bianco, senza sottolineatura;
  - un link in un paragrafo del corpo ha ancora `var(--accent)` ed è sottolineato;
  - il banner ha `margin-top` e `margin-bottom` calcolati di 36 px, e il titolo che lo segue ha `margin-top` 0;
  - nell'albero di accessibilità il banner è una regione `complementary` chiamata «Piano Partner» o «Piano Team» (D18).
- **status**: Done
- **log**: 2026-11-17, worker sonnet, approvato alla prima revisione. Confronto dei corpi di oggi salvato prima di toccare la pagina. RED (`scratchpad/red/t3.mjs`) trovava 0 `aside` in tutte e 6; ora `T3 OK`: piani P, T, P, T, P, T come in D3, Jev prima di «Pulizia e sinonimi», testi con 2.200 € e 5.000 €, `lang="it"` solo su beautiful-ui, corpo senza `aside` identico byte per byte al confronto. Prove del supervisore: `SLOTS.taken = 2` → tutte Team; release temporanea a un titolo datata 09-29 → nessun `aside` e turni delle altre invariati; immagine relativa `./x.jpg` (file vero) → build ferma con il messaggio di D2; `shasum` di config e contenuti identico dopo ogni prova. Browser a 1440 px: `.cta-go` bianco senza sottolineatura, link «SeVedemo» del corpo in `rgb(47, 75, 255)` sottolineato, 36 px sopra e sotto il banner, `h2` seguente con `margin-top` 0, regione `complementary "Piano Partner"` nell'albero di accessibilità. Nota del worker: l'espressione del corpo sta su una riga sola, perché andando a capo Astro mette spazi attorno al banner e il corpo non è più identico.
- **files edited/created**: `src/components/showcase/BannerPiano.astro`, `src/pages/showcase/[slug].astro`
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: Lo script su `dist/` trova 0 `aside.cta-strip` nella pagina Jev, invece di 1 prima di «Pulizia e sinonimi».
- **review_mode**: mixed
- **complexity**: medium

### T4: Firma in fondo alla release

- **depends_on**: [T1, T3]
- **location**: `src/components/showcase/Firma.astro`, `src/pages/showcase/[slug].astro`
- **description**:
  - Crea `Firma.astro` dal prototipo:
    - foto (D6) al posto delle iniziali;
    - nome da `SITE.founder`;
    - sottotitolo «Product Engineer · 10 anni di release in produzione»;
    - il paragrafo di AC1;
    - `.btn.btn-primary` «Prenota una call di 30 min» con `SITE.calUrl` in una scheda nuova;
    - il link secondario (D7);
    - `data-nasconde-float` sul `<section>`.
  - Sostituisce `.ar-cta` e il suo CSS.
  - In questo task la Firma è statica, senza stato armato.
- **validation**:
  - Su `dist/`, ogni release ha una sola Firma, dopo l'`article` e senza `.ar-cta`, con nome, sottotitolo e paragrafo esatti di AC1 («prodotti?» senza spazio) e il bottone verso Cal.
  - Il link secondario punta al caso studio per le release con `caseStudy` pubblicato, altrimenti dice «Altri articoli» e va a `/showcase/`. Con una release temporanea senza `caseStudy` si provano entrambi i casi, se le 6 vere non bastano, e poi si torna allo `shasum` iniziale.
  - L'`<img>` ha `alt=""`, `width` e `height` 48.
  - Nel browser, nell'albero di accessibilità il nome «Omar De Angelis» compare una volta e l'immagine non ha nome (AC2).
  - Screenshot a 1440 e 360 px.
- **status**: Done
- **log**: 2026-11-17, worker haiku; approvato con una correzione banale dell'orchestratore (una riga `</content>` di troppo in fondo a `Firma.astro`, che non arrivava nell'HTML). RED (`scratchpad/red/t4.mjs`) trovava `.ar-cta` in tutte e 6; ora `T4 OK` e `T3 OK` ancora verde: una sola `section.firma[data-nasconde-float]` dopo l'`article`, testi esatti di AC1, bottone verso Cal in scheda nuova, «Leggi il caso studio completo» su beautiful-ui (caso `offerte-ai`) e «Altri articoli» → `/showcase/` sulle altre 5, quindi la release temporanea non è servita; `<img alt="" width="48" height="48">`. Browser: nella Firma «Omar De Angelis» compare una volta e la foto non è nell'albero di accessibilità (l'altra occorrenza è il copyright del footer, preesistente); foto caricata a 192 px naturali in un cerchio da 48. Screenshot a 1440 e 360 px: viso centrato e riconoscibile (chiude anche il controllo a vista di T1).
- **files edited/created**: `src/components/showcase/Firma.astro`, `src/pages/showcase/[slug].astro`
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: Lo script su `dist/` trova ancora `.ar-cta` e nessuna `.firma` nella pagina Jev.
- **review_mode**: mixed
- **complexity**: low

### T5: Entrate armate di banner e Firma

- **depends_on**: [T3, T4]
- **location**: `src/pages/showcase/[slug].astro`, `src/scripts/articolo.ts`, `src/components/showcase/BannerPiano.astro`, `src/components/showcase/Firma.astro`, `brain/chore/motion.md`
- **description**:
  - Aggiunge lo script inline e gli stati nascosti (D9).
  - Aggiunge i keyframe e le regole di reduced motion (D10).
  - In `articolo.ts` aggiunge l'observer accanto a quello dei video.
  - Aggiorna il commento in testa a `[slug].astro` e le due righe di `motion.md` (D12).
- **validation**:
  - Con `agent-browser` su `npx astro preview --port 4329`:
    - JS spento: banner e Firma visibili, nessun `[data-armed]` nel DOM, link funzionanti (AC10);
    - carico in alto: banner e Firma hanno `opacity` 0 prima di entrare in vista; arrivati al 15% prendono `data-in` e a fine animazione hanno `opacity` 1 e `transform: none`;
    - nessun lampo da visibile a nascosto al caricamento, né con l'indirizzo che punta al titolo dopo il banner, né ricaricando in fondo alla pagina;
    - scorrendo su e giù non si riparte; dopo Indietro e Avanti (bfcache) niente replay;
    - con reduced motion emulata: il banner fa solo la dissolvenza, `transform` sempre `none` durante l'animazione; la Firma è identica; `.cta-go:active` senza scala (AC11);
    - riproduzione rallentata al 10% (D16): il banner parte da 24 px con la coda expo, la Firma solo in opacità; poi a velocità piena;
    - con una release temporanea con meno di 2 titoli, l'observer si scollega dopo la sola Firma (D9); poi `shasum` identico.
  - Spaziatura di AC7 ancora giusta: nessuno `<script>` tra `aside` e `h2`.
- **status**: Done
- **log**: 2026-11-17, worker sonnet, approvato alla prima revisione; `motion.md` (D12) scritto dall'orchestratore. `design-engineer` non richiamato: i valori erano già suoi (D9–D11). RED: Firma con `opacity` 1 a 5000 px dalla vista e nessun `[data-armed]`. Dopo, con `agent-browser` su `astro preview`: in alto `main[data-armed]`, banner e Firma a `opacity` 0; in vista prendono `data-in` e finiscono a `opacity` 1 e `transform: none`; ricaricando in fondo e aprendo da zero `#pulizia-e-sinonimi` il banner è nascosto dal primo paint ed entra, senza lampo da visibile a nascosto; su e giù e Indietro/Avanti nessuna animazione ripartita. Al 10%: il banner parte da 18 px già al primo campione e scende a 0 con la coda expo, 700 ms `cubic-bezier(0.19, 1, 0.22, 1)`. Reduced motion: banner `cta-fade` 400 ms lineare con `transform` sempre `none`, Firma `firma-fade` 400 ms `--ease-out` come senza. JS spento: nessun `data-armed`, banner e Firma a `opacity` 1, link verso Cal. Release temporanea a un titolo: 1 elemento osservato (solo la Firma), che entra; `shasum` identico. `T3 OK` e `T4 OK` ancora verdi: nessuno `<script>` tra `aside` e `h2`. Deviazione minima: la keyframe della Firma si chiama `firma-fade` invece di `cta-fade`, per non avere due keyframe globali con lo stesso nome in due componenti.
- **files edited/created**: `src/pages/showcase/[slug].astro`, `src/scripts/articolo.ts`, `src/components/showcase/BannerPiano.astro`, `src/components/showcase/Firma.astro`, `brain/chore/motion.md`
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: Nel browser, con la pagina Jev caricata in alto, la Firma ha `opacity` 1 prima di entrare in vista: lo stato armato non esiste ancora.
- **review_mode**: browser
- **complexity**: medium

### T6: Pulsante flottante nascosto sulla Firma

- **depends_on**: [T5]
- **location**: `src/layouts/Base.astro`
- **description**: Estende lo script del pulsante flottante (D8). Le pagine senza `[data-nasconde-float]` si comportano come oggi.
- **validation**: Con `agent-browser`, a 1440, 375 e 280 px, su una release, misurando i rettangoli a transizione finita:
  - a metà articolo il flottante ha `.show`;
  - quando la Firma entra in vista lo perde;
  - tornando sopra la Firma lo riprende;
  - con la Firma in vista il rettangolo del flottante non interseca quello del bottone «Prenota una call di 30 min» (AC12).

  Ricaricando la pagina già in fondo, con la Firma in vista, il flottante non compare mai, nemmeno per un frame (`.show` assente subito dopo il caricamento).

  Su `/` e `/pricing` il flottante si comporta come prima: compare oltre 480 px e non sparisce mai.
- **status**: Done
- **log**: 2026-11-17, worker haiku, approvato alla prima revisione. RED: con la Firma in vista `.float-cta` aveva `show`. Dopo, su Jev a 1440, 375 e 280 px: `show` a metà articolo; scorrendo a passi di 60 px dalla zona sopra la Firma fino in fondo, a transizione finita, mai `show` né sovrapposizione mentre il bottone della Firma è in vista; in fondo assente; tornando sopra la Firma ricompare. Ricaricando in fondo a 375 px: subito dopo il caricamento niente `show`, `opacity` 0 e nessuna transizione partita. Su `/` e `/pricing` (nessun `[data-nasconde-float]`) compare oltre 480 px e resta fino in fondo, come prima. `T3 OK` e `T4 OK` ancora verdi.
- **files edited/created**: `src/layouts/Base.astro`
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: Nel browser, con la Firma in vista su una release, `.float-cta` ha ancora la classe `show`.
- **review_mode**: browser
- **complexity**: low

### T7: Verifica completa

- **depends_on**: [T5, T6]
- **location**: tutte le pagine release
- **description**:
  - Passa tutte le 6 release con `agent-browser` contro AC1–AC12.
  - Esegue `npm run build` pulito.
  - Mostra a Omar gli screenshot del banner (Partner e Team) e della Firma, e gli chiede se tenere la salita del banner o passare alla sola dissolvenza (D11).
- **validation**:
  - Da 280 a 1440 px (280, 360, 600, 601, 768, 1024, 1440), a 1× e a 1,25× (D16), nessuno scorrimento orizzontale (`scrollWidth ≤ clientWidth`) e nessun testo tagliato in banner e Firma (AC9).
  - Fino a 600 px il bottone del banner sta sotto il testo, rientrato di 22 px.
  - Nessun errore in console.
  - `npm run build` passa.
  - Il feed `/rss.xml` e `/llms.txt` non contengono stringhe che esistono solo nei banner: «Piano Partner», «Piano Team», «Pausa e disdetta», «In questi articoli e su LinkedIn». «Prenota una call» c'è già in `/llms.txt` (`llms.txt.ts:59`) ed è voluto.
- **status**: Done (D11 chiusa il 2026-11-18: resta la salita)
- **log**: 2026-11-17, orchestratore. Build pulita (`rm -rf dist`, poi `npm run build`): passa, nessun avviso. Con `agent-browser` su `astro preview`, sulle 6 release a 280, 360, 600, 601, 768, 1024 e 1440 px, a 1× e a 1,25× (viewport `w/1,25` con scala 1,25, quindi anche 224 px): 84 misure, nessuno scorrimento orizzontale, nessun elemento di banner o Firma tagliato o fuori dallo schermo; fino a 600 px CSS il bottone del banner sta sotto il testo, rientrato di 22 px e allineato al testo, sopra 600 resta in riga. Nessun errore in console sulle 6 release. `/rss.xml` e `/llms.txt`: zero «Piano Partner», «Piano Team», «In questi articoli e su LinkedIn», «il codice è tuo dal primo giorno», «valida uno sprint per volta»; l'unica «Pausa e disdetta» di `/llms.txt` è la riga dei prezzi già su `main` (`llms.txt.ts:29`), non il banner. AC1–AC12 ricontrollati sui risultati di T3–T6. Screenshot in `verifica/`: banner Partner e Team a 1440, Team a 360, Firma a 1440.
- **files edited/created**: `brain/specs/showcase/cta-articoli/verifica/*.png`
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: Verifica d'insieme: il primo controllo è lo scorrimento orizzontale a 280 px su ogni release.
- **review_mode**: mixed
- **complexity**: medium

### T8: Pulizia del prototipo, dopo il deploy

- **depends_on**: [T7]
- **location**: `src/lab/`, `src/prototypes/integration.mjs`
- **description**: Quando Omar conferma che la versione è in produzione, cancella `src/lab/` e le due righe della rotta `/lab/[slug]` in `integration.mjs` (D15).
- **validation**: `npm run build` passa, `npm run dev` non risponde più su `/lab/cta-articoli` e `git status` non mostra più `src/lab/`.
- **status**: Done (2026-11-18)
- **log**: Omar ha chiesto di cancellare il prototipo e committare tutto insieme, senza aspettare il deploy. Cancellato `src/lab/` (Lab.astro e cta-articoli/), ripristinato `integration.mjs` com'è su `main`. `npm run build` passa; nessun riferimento a `src/lab` o `/lab/` resta in `src/`.
- **files edited/created**: `src/lab/` (cancellato), `src/prototypes/integration.mjs` (due righe tolte)
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: `/lab/cta-articoli` risponde 200 in dev prima della pulizia.
- **review_mode**: cli
- **complexity**: low

## Strategia di test

Non c'è un test runner (D13).
- La logica che decide cosa compare (D1, D3) è isolata in un modulo puro e provata con uno script.
- Il resto si prova sul risultato: l'HTML di `dist/` per la struttura e i testi, il browser per stili, motion, accessibilità e larghezze.
- Le prove che cambiano config o contenuti si chiudono con `shasum` identico (D14).

## Rischi e mitigazioni

| Rischio | Mitigazione |
|---|---|
| `rendered.html` diverso da quello che stampa `<Content />` (immagini relative, componenti futuri) | Guardia D2 in build; confronto del corpo prima e dopo in T3 |
| La regola `a:not([class])` lascia senza stile un link del Markdown con una classe | Oggi nessun link del Markdown ha classi; se servisse, il bottone ha comunque `.cta-go`, che ha la specificità più alta |
| La salita del banner sembra un annuncio | D11: Omar decide in T7, cambiando un valore |
| Un nuovo articolo in bozza o retrodatato sposta i turni | AC5 garantisce solo che una release più recente di tutte non li sposti; un articolo retrodatato li ricalcola, ed è accettato |
| Foto ritagliata male a 48 px | T1 controlla a vista nel cerchio |
| Il modulo di `articolo.ts` non si carica dopo che la pagina è armata | Rischio accettato, uguale ai tre esempi esistenti; la guardia su `IntersectionObserver` copre i browser vecchi |

## Gate di validazione

- Dopo T3, T4 e T7: `npm run build` passa.
- Dopo T7: AC1–AC12 verificati nel browser sulle 6 release.
- Mobile Safari e screen reader reali restano non verificati, come dice la spec (Constraints).

## Domande aperte

Nessuna che blocchi il piano. Restano due cose a Omar:
- la foto da salvare in `public/firma/omar-originale.jpg` (T1);
- la scelta finale sulla salita del banner (D11, in T7).

## Registro decisioni del grill (2026-11-17)

- **Bloccate:**
  - punto del banner automatico;
  - foto al posto delle iniziali;
  - flottante nascosto quando la Firma è in vista (tutte di Omar);
  - valori di motion confermati da `design-engineer`.
- **Assunte:** foto pubblicabile nel repo; `rendered.html` equivalente a `<Content />` (verificato in T3).
- **Aperte:** D11, salita o dissolvenza, da decidere dopo la verifica.
