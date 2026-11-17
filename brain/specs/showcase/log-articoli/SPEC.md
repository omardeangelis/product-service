---
domain: showcase
type: spec
status: approved
links: ["[[specs/showcase/log-articoli/FLOW]]", "[[personas]]", "[[chore/motion]]", "[[chore/product]]", "[[specs/home/home-specs]]", "[[domains/sito/sito-contract]]", "[[feature-improvement/_unscoped/_unscoped]]"]
created: 2026-11-16
updated: 2026-11-16
---

# Spec: Showcase: gli articoli in home e nella pagina /showcase ("Fila")

---

## User input

> Vorrei evolvere la sezione di "Talk is cheap, show me the code" L'idea è estenderlo e trasformarlo più che in una lista di di soli casi studio, in una blog delle release che settimanali. L'idea è che poi questo sia un feed rss che possa anche poi fetchare da altri prodotti e inizi ad aiutarmi a posizionarmi da un punto di vista GEO e SEO. Volevo esplorare con te delle soluzioni, se convenisse separare le due cose ed il valore di avere una sezione showcase con una pagina verticale.

> Sì, prototipo · (ambito) Showcase e sezione 04 in home

> Trovo tutte e 3 molto confusionarie che non permettono di distinguere quello che è il caso studio dalla release. Per quanto mi riguardano non hanno una forma più di tanto diversa. Sono sempre io che racconto di qualcosa che è stato rilasciato. Possiamo provare tre alternative più semplici ?

> Ancora non ci siamo però Schede come opzione la terrei perché nella visualizzazione della pagina mi piaceva come mostrava il muro. Però ho cambiato idea e non andrei a fare una distinzione a livello di card perché mi sembra molto difficile da comunicare visivamente. Vorrei vedere una soluzione in cui andiamo ad assegnare dei tag, tipo caso-studio e release con cui al massimo l'utente può filtrare, per poi arrivare sulla pagina verticale con il giusto elenco (che di default deve essere tutti). Tanto alla fine sono sempre articoli che scrivo io

> Tengo Fila

> Vai alla review

> Sono d'accordo con tutte le proposte. Le agenzie non approvano Non prendiamoci questo impegno, cercherò di essere costante senza essere Al rilascio vorrei avere 4-5 articoli almeno.

> (white label) Gestiamo entrambe, di solito parlano di features in modo generico, però supporterei entrambe le soluzioni · (lancio) 4-5 release + 4 casi studio · (pagina release) Come un caso studio, corta · (URL) Prima di decidere allineati con main che ha ricevuto un'implementazione GEO e SEO e credo sia utile tenerlo in considerazione → /showcase/<slug>/

---

## Context

Oggi la sezione 04 della home ("Talk is cheap. Show me the code.", `#shipped`) mostra solo i 4 casi studio. Omar vuole farne il registro di quello che mette in produzione: release brevi e casi studio. Il registro ha una pagina verticale `/showcase/` e un feed RSS. Serve a due cose: mostrare con continuità che consegna, che è quello che vende l'abbonamento ([[chore/product]]), e dare ai motori di ricerca e ai motori AI contenuto fresco e citabile.

Il modello, deciso in tre round di prototipo:
- ogni voce è un **articolo** scritto da Omar;
- "caso studio" e "release" sono **tag** che servono solo a filtrare;
- le schede sono identiche e il filtro di default è "Tutti";
- in home, una fila di schede con i filtri sopra; il link in fondo apre `/showcase/` con lo stesso filtro;
- ogni release ha la sua pagina `/showcase/<slug>/`, mentre i casi studio restano su `/case-study/<slug>/`.

Persone (da [[personas]]):
- **CTO di startup o scale-up**: arriva dall'hero ("Show me the code ↓") e cerca prove e casi studio.
- **Agenzia di design**: legge "Cliente in white label" come segnale, ma compra discrezione.
- **Software house**: arriva anche da ricerca o dal feed ed entra da un articolo, non dalla home.

Riferimento vivo: il prototipo in `src/lab/showcase/` (rotta dev-only `/lab/showcase`, variante Fila; le pagine provvisorie delle release su `/lab/showcase/r<n>`), scelto da Omar il 2026-11-16 senza modifiche successive. Lo state sweep non è stato fatto.

- Review UX (`ux-advisor`, 2026-11-16): **proceed with decisions**. Testo integrale in `src/lab/showcase/UX-REVIEW.md`.
- Review UI (`ui-reviewer`, 2026-11-16): **proceed with decisions**. Misurata su Chromium 149, da 280 a 1440 px a 1× e 1,25×, più 667×375 e 844×390. Mobile Safari, axe e screen reader non erano disponibili. Testo integrale in `src/lab/showcase/UI-REVIEW.md`.

Domini toccati: **home** (la sezione 04 sostituisce quella di oggi) e **sito** (sitemap, `/llms.txt`, dati strutturati di `src/seo.ts`; vedi [[domains/sito/sito-contract]]).

---

## Non-Goals

- **Importare articoli dai changelog di altri prodotti** (SeVedemo o altri). Nel messaggio iniziale Omar lo colloca "poi". Al lancio ogni articolo è scritto da Omar nel sito, e dal testo della pagina sparisce la frase sul changelog.
- **Filtrare per progetto** (Valueize, SeVedemo, white label): tolto nel round 3. Se torna, sarà un secondo gruppo di filtri.
- **Distinguere a vista caso studio e release sulla scheda**: Omar l'ha esclusa nel round 2.
- **Spostare i casi studio sotto `/showcase/`**: restano su `/case-study/<slug>/`, già indicizzati e citati in `/llms.txt`.
- **Un design dedicato alla pagina release**: usa l'impaginazione del caso studio, accorciata (AC13). Un design proprio richiederebbe un altro `/prototype`.
- **Paginare `/showcase/`**: con gli articoli del lancio la pagina è una sola. Da rivedere quando gli articoli superano le cento voci.
- **Impegnarsi su una cadenza**: nessun testo promette una frequenza (AC3).

---

## Acceptance Criteria

**Articoli e contenuto**

- **AC1.** Ogni articolo ha tag "caso studio" o "release", titolo, data di pubblicazione, progetto e testo breve. Può avere una schermata o un video e un numero. Una release ha anche il corpo dell'articolo (AC13).
  - Una release che manca di uno dei campi obbligatori fa fallire la build.
  - Anche un caso studio pubblicato senza `published` fa fallire la build: la data serve per ordinarlo nel registro.
  - Gli articoli in bozza non compaiono da nessuna parte: home, `/showcase/`, feed, sitemap, `/llms.txt`.
- **AC2.** Il progetto di una release è un nome (es. "Valueize", "SeVedemo") oppure **"Cliente in white label"**.
  - Una release in white label non porta il nome del cliente da nessuna parte: scheda, pagina, feed, dati strutturati, `/llms.txt`.
  - Omar decide release per release se pubblicarla in forma anonima o non pubblicarla.
- **AC3.** Nessun testo dello showcase promette una cadenza: nella sezione 04, in `/showcase/`, nelle pagine release, nel feed e nella sezione «Showcase» di `/llms.txt` non compaiono "ogni settimana", "settimanale", "aggiornato ogni…". Le promesse del servizio ai clienti («demo settimanali», «shippo ogni settimana») restano dove sono.
  - Default per l'intestazione della home: «Quando metto in produzione qualcosa ne scrivo qui: release brevi e, quando serve più spazio, casi studio con problema, decisioni e numeri.»
  - Default per la pagina: eyebrow «Showcase»; lead «Tutto quello che scrivo, dal più recente: release brevi e casi studio completi. I clienti in white label restano anonimi.»
- **AC4.** Al lancio il registro contiene i 4 casi studio, con la loro data vera, e almeno 4 release vere. Ogni release ha data, testo e media confermati da Omar. Nessuna delle 28 release inventate del prototipo va online, e nessuno degli articoli segnaposto usati durante l'implementazione.

**Sezione 04 in home**

- **AC5.** La sezione 04 sostituisce quella di oggi, nella stessa posizione e con lo stesso anchor `#shipped`. Contiene, nell'ordine:
  1. eyebrow «04 La prova»;
  2. h2 «Talk is cheap. Show me the code.»;
  3. lead (AC3);
  4. la riga «<N> articoli da <mese anno> · l'ultimo <quando>» (AC10);
  5. i filtri «Tutti», «Casi studio», «Release», ciascuno con il suo conteggio, e accanto le frecce (AC17);
  6. la fila;
  7. il link «Tutti gli articoli · <N>» e il feed (AC18).

  Il link dell'hero «Show me the code ↓» porta ancora qui.
- **AC6.** La fila mostra al massimo 8 schede del filtro attivo, dalla più recente, e in fondo una scheda «<etichetta del filtro> · <N> →» che apre `/showcase/` con lo stesso filtro.
  - All'apertura il filtro è «Tutti».
  - Un filtro senza articoli non compare tra i chip.
  - Le etichette mettono il numero in fondo, così non serve accordarlo: «Tutti gli articoli · 32», «Tutti i casi studio · 4», «Tutte le release · 1».
- **AC7.** (UX interrompere + UI D6) Cambio filtro in home:
  - Il chip scelto risulta premuto.
  - La fila riparte dall'inizio, con la prima scheda intera a sinistra, anche se il cambio arriva mentre le frecce stanno scorrendo.
  - Scheda finale e link del piede seguono il filtro.
  - A 280–1440 px la posizione verticale del link «Tutti…» non cambia tra i tre filtri. Il corpo delle schede in home ha altezza fissa: titolo al massimo 3 righe, testo 3 righe, riga del numero sempre riservata.

**Scheda (uguale in home e in pagina)**

- **AC8.** Tutta la scheda è un solo link verso il suo articolo.
  - Copertina: la schermata o il video se c'è, altrimenti il numero in grande, altrimenti il titolo in grande.
  - Corpo: data · progetto, titolo, testo (3 righe in home), e la riga del numero quando la copertina è un media.
  - Nessun segno distingue un caso studio da una release.
  - Il numero di un caso studio è il primo dei suoi `home.metrics`.
- **AC9.** (UI D9 + UX annuncio delle schede) Il nome accessibile del link di una scheda è il suo titolo. Data, progetto e testo sono la sua descrizione e l'immagine di copertina non ha testo alternativo proprio. Nell'albero di accessibilità ogni link-scheda si chiama come il suo titolo.
- **AC10.** (UX D1, P1) Le date restano vere tra un deploy e l'altro.
  - Il browser calcola le date relative della home («oggi», «ieri», «3 giorni fa») dal giorno vero e dalla data dell'articolo.
  - Dopo 6 giorni la data diventa assoluta («13 nov»), e senza JavaScript si vede sempre quella.
  - La data assoluta porta l'anno quando è diverso da quello dell'articolo più recente: «21 mag 2025» accanto a «26 lug».
  - La riga della home dice «l'ultimo ieri» solo quando è vero, e oltre 6 giorni «l'ultimo il 13 nov».
  - Prova: con la build del giorno X e la home aperta il giorno X+5, la scheda del giorno X−1 dice «6 giorni fa» e la riga non dice «ieri».
- **AC11.** (UI D2 P1 + UX D4) Nelle schede il video è un fotogramma fermo, senza controlli e senza partenza automatica, in home e in pagina. Si muove solo dentro l'articolo.
  - In `/showcase/`, a 280–1440 px, nessun pulsante o cursore sta dentro il link di una scheda.
  - Un clic in qualunque punto della scheda apre l'articolo.
  - Tab passa da una scheda alla successiva senza fermarsi sul video.
- **AC12.** (UI D7 + UX D4) Se un'immagine o un video della copertina non si carica, la scheda mostra la copertina successiva: il numero, poi il titolo. Lo sfondo della copertina è quello della scheda. Con il media in errore, a 280–1440 px in home e in pagina, non compaiono blocchi bianchi, icone del browser o un player a «0:00».

**Pagine**

- **AC13.** La pagina di una release sta su `/showcase/<slug>/`. Lo slug si fissa alla pubblicazione e non cambia se cambia il titolo.
  - Usa l'impaginazione dei casi studio, accorciata: data lunga («13 novembre 2026»), progetto, titolo h1, testo breve, numero, schermata o video con i controlli.
  - Sotto c'è il corpo dell'articolo, di lunghezza libera: da un paragrafo a un articolo lungo, con titoli, liste, immagini, video e codice.
  - (UX D3) In fondo c'è «Prenota una call di 30 min». Se la release appartiene a un lavoro con un caso studio pubblicato, c'è anche «Leggi il caso studio completo» verso quel caso studio.
  - «← Tutti gli articoli» torna indietro nella cronologia, ritrovando filtro e posizione, solo se si arriva da `/showcase/` (con qualunque `?tag`). Negli altri casi apre `/showcase/`.
- **AC14.** `/showcase/` contiene, nell'ordine:
  1. eyebrow e h1 «Cosa ho messo in produzione.»;
  2. lead (AC3);
  3. filtri e feed;
  4. un gruppo per mese, dal più recente, ciascuno con il titolo del mese e la griglia delle schede.

  La griglia ha 1 colonna fino a 700 px, 2 da 701 a 1023 px e 3 da 1024 px. Un mese senza articoli nel filtro attivo non compare. In fondo alla pagina c'è «Prenota una call di 30 min» (UX D3).
- **AC15.** Il filtro della pagina si legge e si scrive nell'indirizzo:
  - `?tag=caso-studio` e `?tag=release` aprono la pagina con quel filtro;
  - senza parametro, o con un tag sconosciuto o senza articoli, si apre «Tutti»;
  - cambiare filtro aggiorna l'indirizzo senza aggiungere voci alla cronologia, quindi Indietro esce dalla pagina.

  Il link della home apre `/showcase/?tag=<filtro>`; con «Tutti», `/showcase/` senza parametro.
- **AC16.** (UX D2, P1) I link verso i casi studio puntano a `/showcase/`:
  - «← Tutti i casi studio» (nav dei casi studio) e «Altri casi studio» (fondo del caso studio) aprono `/showcase/?tag=caso-studio`, con «Casi studio» premuto;
  - la voce «Showcase» della nav apre `/showcase/` e su quella pagina risulta attiva.

**Controlli**

- **AC17.** (UX accessibilità + UI domande 1–2) Frecce della fila: «Articoli più recenti» e «Articoli meno recenti».
  - Ci sono a ogni larghezza con un puntatore fine (mouse o trackpad). Non ci sono su touch, né quando la fila non scorre (es. un filtro con 1–2 schede).
  - Alle estremità la freccia smette di agire ma resta raggiungibile con Tab, e il focus non cade sulla pagina.
  - Ogni clic fa avanzare la fila di tante schede quante ne stanno intere.
- **AC18.** (UX D5 + UI D5 + UI domanda 3) Feed RSS:
  - Accanto a «Copia il feed RSS» c'è un link vero «Feed RSS» a `/rss.xml`.
  - L'esito della copia viene annunciato dagli screen reader. Se riesce: «Link del feed copiato». Se fallisce: «Copia non riuscita: https://spatalo.tech/rss.xml», con l'indirizzo completo e selezionabile, visibile fino al clic successivo.
  - Ogni clic fa ripartire il tempo del messaggio.
  - A 280–1440 px il cambio di testo non sposta niente fuori dal bottone, né alla copia né al ritorno.
  - In `/showcase/` il feed è allineato al bordo destro della griglia.
- **AC19.** (UI D4) Filtri: da 358 a 1440 px stanno su una riga; da 280 a 357 px su due righe al massimo, senza etichette tagliate. A 1,25× stanno su due righe fino a 400 px.

**Feed, motori di ricerca e motori AI**

- **AC20.** `/rss.xml` contiene tutti gli articoli pubblicati, casi studio e release, dal più recente. Per ogni articolo riporta titolo, link, data, testo breve e tag come categoria. Ogni pagina del sito dichiara il feed nel `<head>` (`<link rel="alternate" type="application/rss+xml">`).
- **AC21.** Ogni release ha gli stessi dati strutturati dei casi studio: un `Article` con titolo, descrizione, URL, `datePublished`, lingua, autore (Omar) ed editore (lo studio), citati per `@id` dal grafo condiviso.
  - Le release hanno `og:type` article.
  - `/showcase/` e ogni release sono indicizzabili e compaiono nella sitemap.
  - Le viste `?tag=` hanno come canonical `/showcase/`.
- **AC22.** `/llms.txt` ha una sezione «Showcase» con `/showcase/`, il feed e ogni release pubblicata, ciascuna con il suo testo breve.
  - La sezione «Casi studio» resta com'è.
  - La riga «Home» non dice più che la home elenca solo casi studio.

**Accessibilità e correzioni**

- **AC23.** (UX, correzioni di accessibilità del compito)
  - Il conteggio annunciato al cambio filtro nomina il tipo: «4 casi studio», «28 release». In home, quando il totale supera 8, annuncia «Le ultime 8 di 28 release» (il genere segue il nome: «Gli ultimi 8 di 32 articoli»).
  - La scheda finale della fila non è una fermata di Tab. Il link del piede con lo stesso testo basta, e la scheda resta cliccabile.
  - La fila si chiama «Ultimi articoli».
- **AC24.** (UI D1, P1) A 280–1440 px, in home, `/showcase/` e pagina release, ogni testo secondario misura almeno 4,5:1 contro il suo sfondo reale. Il caso limite è sulla scheda scura. Default: `#848ea6` sul fondo scuro, `#687080` sul fondo chiaro.
- **AC25.** (UI D3 + UX D6) Titoli lunghi:
  - Il titolo di una release ha al massimo 70 caratteri; la build fallisce dal 71° carattere.
  - Il titolo in copertina si ferma a 4 righe con i puntini.
  - Una parola lunga va a capo, sia nel titolo sia in copertina.
  - Con un titolo di 100 caratteri e una parola di 32 caratteri, a 280–1440 px in home e in pagina, nessun titolo è tagliato se non dai puntini voluti, e le schede della fila hanno tutte la stessa larghezza.
- **AC26.** (UI D8) Se la fila è una fermata di Tab, il suo anello di focus si vede su tutti e 4 i lati a 280–1440 px. Altrimenti la fila non è una fermata, perché le schede sono già link.
- **AC27.** (UI D10) Telefono orizzontale, a 667×375 e 844×390: una scheda raggiunta con Tab ha il bordo superiore dell'anello sotto la nav fissa. Da 415 a 700 px le schede della fila sono larghe al massimo 340 px.
- **AC28.** (UI, correzioni meccaniche)
  - Il «04» dell'eyebrow sul fondo scuro misura almeno 4,5:1. Oggi è `#2f4bff` a 3,07, anche in produzione (`src/styles/global.css:56`).
  - L'h2 «Talk is cheap. Show me the code.» è marcato come inglese.
  - Le didascalie dei media vanno a capo: a 280 px nessuna scheda è più larga delle altre, nessuna didascalia è tagliata, nessuna pagina scorre in orizzontale. Vale anche a 1,25×.
  - L'h1 di una pagina release va a capo dentro i margini a 280 px.
  - A 280 px «Prenota una call» nella nav sta su una riga e non tocca il logo (`src/styles/global.css:86`).

**Motion e assenza di JavaScript**

- **AC29.** La sezione e la pagina si muovono come descritto nel brief qui sotto. Con `prefers-reduced-motion: reduce` resta solo l'opacità e lo scorrimento delle frecce è istantaneo.
- **AC30.** Senza JavaScript:
  - la sezione 04 è visibile con le prime 8 schede di «Tutti» e i link funzionano;
  - `/showcase/` mostra tutti gli articoli;
  - nessun contenuto parte nascosto: lo stato nascosto dell'entrata lo applica lo script;
  - non si vedono controlli che non fanno niente.

**Caratteri speciali nei dati strutturati e nel feed** (miglioria [[feature-improvement/_unscoped/_unscoped]] → «Serializer JSON-LD più rigido»)

- **AC31.** Con le release, i testi di Omar finiscono nei dati strutturati e nel feed. Il JSON-LD di ogni pagina non contiene in chiaro `<`, `>`, `&`, U+2028 e U+2029: sono scritti come sequenze di escape.
  - Un controllo in build fallisce se il serializer, con l'input `</script><!--`, produce un `<`.
  - Un articolo con `&`, `<` o `>` nel titolo e nel testo lascia valido il feed XML.
  - Lo stesso articolo lascia intatto lo `<script>` dei dati strutturati della sua pagina.

---

## Motion brief: sezione 04 e /showcase

**Entrata della sezione 04 (una volta per visita)**
- **Verdict:** anima.
- **Trigger:** la sezione entra nello schermo.
- **Frequency:** una volta per visita.
- **Purpose:** la sezione arriva come le altre della home, dall'alto in basso.
- **Enter:**
  - intestazione e schede da `opacity 0` e `translateY(24px)` a riposo;
  - filtri, frecce e piede solo in dissolvenza.
- **Exit:** nessuna.
- **Origin:** dal basso.
- **Easing:** `--ease-out-expo`.
- **Duration:** `--dur-reveal` (700ms), sfalsata di `--stagger` (100ms) fino a 5 passi. Supera i 300ms per la deviazione già scritta in [[chore/motion]] sui reveal.
- **Interrupt:** non si ripete. Un cambio filtro non la fa ripartire.
- **Reduced motion:** sola dissolvenza, `--dur-swap` lineare, stessi ritardi.
- **Stack:** keyframes CSS armati da uno script (AC30), come la sezione clienti.

**Cambio filtro (home e /showcase)**
- **Verdict:** anima.
- **Trigger:** clic su un chip.
- **Frequency:** poche volte per visita.
- **Purpose:** fa vedere che l'elenco è cambiato.
- **Enter:** le schede visibili da `opacity 0` e `translateY(8px)`, tutte insieme.
- **Exit:** nessuna. Le schede escluse spariscono subito.
- **Origin:** dal basso.
- **Easing:** `--ease-out`.
- **Duration:** `--dur-ui` (250ms).
- **Interrupt:** un nuovo clic fa ripartire l'animazione delle schede del nuovo filtro. La fila salta all'inizio senza scorrimento animato (AC7).
- **Reduced motion:** sola dissolvenza.
- **Stack:** animazione CSS riattivata con un attributo.

**Scheda, chip, frecce, link**
- **Verdict:** anima.
- **Trigger:** hover, pressione.
- **Frequency:** decine di volte per visita, quindi tempi da UI.
- **Enter:**
  - hover sulla scheda: il bordo diventa del colore accent in `--dur-hover`, e l'immagine sale a `scale(1.03)` in `--dur-ui` `--ease-out`;
  - pressione sulla scheda: `scale(0.98)` in `--dur-press` `--ease-press`;
  - pressione su chip e link «Tutti…»: `scale(0.97)`; sulle frecce: `scale(0.95)`;
  - hover sul link «Tutti…»: `translateY(-1px)`.
- **Exit:** il contrario dell'entrata.
- **Interrupt:** sono transizioni, quindi partono dallo stato corrente.
- **Reduced motion:** niente scala né spostamento; restano i cambi di colore.
- **Stack:** transizioni CSS.
- **Note:** gli stili di hover valgono solo con `(hover: hover)` (Constraints). Lo `scale(1.03)` supera l'1–2% dello standard: va registrato come deviazione in [[chore/motion]], come lo `scale(1.06)` della parete clienti.

**Frecce della fila**
- **Verdict:** anima.
- **Trigger:** clic.
- **Enter:** scorrimento orizzontale fluido del browser, di tante schede quante ne stanno intere.
- **Interrupt:** un nuovo clic sposta la destinazione di altre schede intere e lo scorrimento prosegue fin lì. Non riparte dalla posizione corrente: con lo snap obbligatorio, partire da metà corsa farebbe fermare la fila una scheda prima (`design-engineer`, create-plan).
- **Reduced motion:** salto istantaneo.

**Arrivo su /showcase/ dalla home:** nessuna animazione, perché è un cambio di pagina.

**Assumed:** nessuno; tutti i valori sono quelli del prototipo approvato.
**Open risk, chiuso in create-plan con `design-engineer`:** lo scambio delle schede e il cambio di altezza della fila partivano nello stesso frame (UI D6). Con il corpo della scheda ad altezza fissa (AC7) l'altezza della fila non cambia, quindi non c'è niente da animare. Restano tre regole:
- nessuna altezza si anima;
- le frecce di una fila che non scorre si nascondono senza togliere spazio;
- i controlli che servono solo con JavaScript compaiono prima del primo paint.

In `/showcase/` l'altezza della pagina cambia senza animazione e senza far scorrere la pagina ([[specs/showcase/log-articoli/PLAN]], D26).

---

## Constraints

- Motion solo con i token `--ease-*`, `--dur-*` e `--stagger` di `src/styles/global.css`.
- Pagine `.astro` senza JS di framework, output statico. Gate: `npm run build` con Node 26.
- Invarianti di [[domains/sito/sito-contract]]:
  - nessuna pagina `noindex` nella sitemap;
  - i dati strutturati partono dal grafo condiviso di `src/seo.ts`;
  - in `/llms.txt` la lista delle pagine si scrive a mano.
- Il prototipo `src/lab/showcase/` resta il riferimento vivo finché l'implementazione non arriva in produzione. Poi `implement-spec` cancella la cartella, `src/lab/Lab.astro` e la rotta `/lab/[...slug]` in `src/prototypes/integration.mjs`. Le review salvate accanto al prototipo vanno via con lui.
- **Da verificare a mano sul dispositivo (Mobile Safari), dalla review UI:**
  - hover su touch: su iPhone, sezione 04 → tap su una scheda → Indietro. La scheda non deve restare con il bordo accent né con l'immagine ingrandita. Se resta, gli stili di hover vanno solo sotto `(hover: hover)`;
  - video nelle schede: in `/showcase/`, un tap al centro di una scheda con video apre l'articolo e non fa partire il video (AC11).
- **Da verificare a mano con screen reader, dalla review UX:**
  - VoiceOver + Safari: Tab su «Copia il feed RSS», VO+Spazio. Deve sentirsi l'esito (AC18);
  - VoiceOver: Tab su «Casi studio», Spazio. Devono sentirsi lo stato premuto e poi il conteggio (AC23);
  - VoiceOver: Spazio su «Articoli meno recenti» fino alla fine della fila. Il cursore deve restare sulla freccia (AC17);
  - NVDA + Firefox su `/showcase/?tag=caso-studio`: Tab su una scheda con video. Ci deve essere una sola fermata, letta col titolo (AC9, AC11);
  - Tab sulla prima scheda in home: il titolo arriva per primo e l'annuncio è breve (AC9).
- Non provati dalla review UI: Firefox e WebKit desktop, axe, 1.4.4 e 1.4.12 oltre il controllo a 1,25×.

---

## Technical Notes

- I casi studio hanno `published` e `updated` facoltativi (`src/content.config.ts`, aggiunti con le basi SEO/GEO). Oggi nessuno dei 4 li ha. AC1 rende `published` obbligatorio per i casi studio pubblicati.
- Il canonical di `Base.astro` si calcola dal solo percorso, quindi le viste `?tag=` puntano già a `/showcase/` (AC21).
- La sitemap esclude le pagine dal loro `noindex` e presume `build.format: 'directory'`, quindi gli URL finiscono con `/`.
- I link da cambiare per AC16 sono in `src/layouts/Base.astro:68`, `src/layouts/Base.astro:73` e `src/pages/case-study/[slug].astro:390`. L'hero (`src/pages/index.astro:35`) resta su `#shipped`.
- La sezione 04 di oggi è in `src/pages/index.astro:222` e usa i campi `home` dei casi studio. Il prototipo costruisce la scheda di un caso studio da `home.title`, `excerpt` e `home.metrics[0]`.
- Nel prototipo, `src/lab/showcase/data.ts` lega ogni release al lavoro del suo caso studio (`TRACKS`): è il modello per «Leggi il caso studio completo» di AC13. Sono inventati date, release, release white label e l'abbinamento tra schermate e articoli.
- I controlli dei video nelle schede li accende `src/lab/showcase/lab.ts:88`. La partenza automatica c'è solo in pagina (`src/lab/showcase/variants.ts:29`).

---

## Open Questions

| # | Question | Affects | Owner | Status |
|---|----------|---------|-------|--------|
| 1 | Quali sono le release del lancio (almeno 4), con data, testo, progetto e schermata o video? **Default:** nessuna release inventata va online (AC4) | AC4, AC1 | Omar | Closed: le scrive Omar, in T15 del piano; fino ad allora segnaposto che la build di produzione blocca (Omar, 2026-11-16) |
| 2 | Quali sono le date di pubblicazione vere dei 4 casi studio? **Default:** la data in cui ciascuno è andato online la prima volta | AC1, AC4 | Omar | Closed: Excel 2025-05-21, Onboarding 2026-03-20, Offerte AI 2026-04-30, Motion 2026-07-26 (Omar, 2026-11-16) |
| 3 | Quale numero va sulla scheda di un caso studio quando ne ha due? **Default:** il primo di `home.metrics`, come nel prototipo | AC8 | Omar | Closed: il primo (Omar, 2026-11-16) |

---

## Decision Log

| Decision | Rationale |
|----------|-----------|
| Variante **Fila** (Omar, 2026-11-16), scelta tra Fila, Muro e Porte | I filtri stanno già in home e il link porta alla pagina con lo stesso filtro; il "muro" delle schede resta in `/showcase/` |
| Ogni voce è un articolo; caso studio e release sono tag solo per filtrare; schede identiche; filtro di default "Tutti" | Omar, round 2: «Tanto alla fine sono sempre articoli che scrivo io» |
| Release su `/showcase/<slug>/`; casi studio su `/case-study/<slug>/` | Omar, dopo l'allineamento al SEO/GEO di main: la release sta sotto la pagina che la elenca, i casi studio tengono l'URL già indicizzato |
| La pagina release è quella del caso studio, accorciata | Omar |
| Nessuna promessa di cadenza nei testi | Omar: «Non prendiamoci questo impegno, cercherò di essere costante» |
| White label: la release esce anonima («Cliente in white label») oppure non esce, a scelta di Omar | Omar: «di solito parlano di features in modo generico, però supporterei entrambe le soluzioni» |
| Lancio: 4 casi studio e almeno 4 release | Omar: «4-5 release + 4 casi studio» |
| Accettate tutte le proposte delle due review, compresi i default delle domande aperte della review UI (frecce con puntatore fine a ogni larghezza e nascoste se la fila non scorre; feed allineato alla griglia) | Omar, 2026-11-16: «Sono d'accordo con tutte le proposte» |
| Tolto il filtro per progetto | Round 3: il tag è l'unico filtro |
| Numero sulla scheda di un caso studio: il primo di `home.metrics` | Omar, 2026-11-16. Per Offerte AI il secondo numero (+64%) è inventato, il primo (3 domande) è reale |
| Dentro questa spec la miglioria «Serializer JSON-LD più rigido» (AC31); fuori «og:image per caso studio» | Omar, 2026-11-16: affine, perché le release portano nuovi testi nei dati strutturati. L'anteprima per articolo non c'è ancora: oggi tutte le pagine usano `public/og.png` |
| AC3 vale solo per i testi dello showcase; le promesse settimanali del servizio restano | Omar, 2026-11-16 (create-plan): «Solo per lo showcase» |
| Una release ha sempre testo breve e corpo; il corpo può essere corto o lungo e contenere immagini, video e quello che serve a un articolo | Omar, 2026-11-16 (create-plan): «può essere una grande feature come una piccola, contenere immagini video e tutto quello che un articolo richiede» |
| Le release del lancio le scrive Omar. Fino ad allora l'implementazione lavora con articoli segnaposto, che si tolgono prima di andare online | Omar, 2026-11-16 (create-plan): «al momento lavora con dei placeholder che posso rimuovere» |
| Copertine dei casi studio: quelle del prototipo (Excel → anteprima del paste, Offerte AI → chat iniziale, Onboarding → video fermo, Motion → curva di easing) | Omar, 2026-11-16 (create-plan) |
| Date dei casi studio: Excel 2025-05-21, Onboarding 2026-03-20, Offerte AI 2026-04-30, Motion 2026-07-26 | Omar, 2026-11-16 (domanda aperta 2) |
| La data assoluta di una scheda porta l'anno quando è diverso da quello dell'articolo più recente (AC10) | Con Excel del 2025, «21 mag» dopo «20 mar» sembrerebbe fuori ordine. La regola dipende solo dai contenuti, non dal giorno della build |
| Lo zoom della copertina al passaggio del mouse parte dall'angolo in alto a sinistra | Omar, 2026-11-16: è l'angolo a cui è ancorata la copertina, dove le schermate cominciano |
| Misure del prototipo approvato | Fila: al massimo 8 schede per filtro, spazio 16 px, margine sinistro allineato al contenuto, fino al bordo dello schermo a destra. Scheda: 320 px (`min(82vw, 340px)` fino a 700 px, AC27), angoli 20 px, copertina 16:10, bordo 1 px. Griglia: `minmax(300px, 1fr)` con spazio 16 px. Chip alti 40 px; frecce, link «Tutti…» e feed alti 44 px. Sezione: padding 112/104 px (80/72 fino a 700 px), fondo scuro come oggi. Pagina: chiara, padding 88/120 px (64/96 fino a 700 px) |
