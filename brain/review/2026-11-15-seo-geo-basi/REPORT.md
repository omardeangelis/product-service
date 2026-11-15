---
domain: _unscoped
type: review
scope: standalone
spec: null
review_target: working tree non committato sul branch claude/unruffled-curran-5a2b8d
base_ref: 8b28ed1
head_ref: working tree (non committato)
verdict: do-not-ship
review_impact: critical
human_in_loop: true
links:
  - "[[review/2026-11-15-seo-geo-basi/RUBRIC]]"
ingested: false
last_ingested: null
created: 2026-11-15
updated: 2026-11-15
---

# Review Report: basi SEO/GEO e count-up dei casi studio

## Verdict

**DO NOT SHIP** · impact: critical

Obiezione bloccante più forte (v8, UI pass): con JavaScript attivo, i numeri armati del count-up espongono all'albero di accessibilità il valore di partenza invece del risultato, finché la card non entra in vista. Sull'onboarding si legge "12,5% → 12%", "−0%", "+0%" al posto di "12,5% → 80%", "−84%", "+38%"; lo stesso succede su tutti e quattro i casi studio. Due MAJOR sulla stessa zona: un numero armato non ha una strada sicura per tornare al valore finale se lo script non gira (v6), e il conteggio non segue l'entrata scaglionata delle card (v7).

Le parti SEO/GEO (JSON-LD, sitemap, robots, Open Graph, `/llms.txt`, build e dipendenza) passano tutte: i tre verdetti negativi riguardano solo il count-up.

## Coverage

- Rubric passes run: 8/8 (v1 strongest, Opus-class ereditato; v2–v7 balanced, Sonnet-class; v8 fast, Haiku-class)
- Passes skipped or failed: nessuno. v7 dichiara di non aver aperto i file della skill `design-engineering` e di aver giudicato sul charter, su `brain/chore/motion.md` e sui token: la copertura della barra di review del motion è quindi parziale.
- UI pass: ran on http://localhost:4322/case-study/{onboarding-saas,offerte-ai,dati-da-excel,motion-design}/ (build di produzione servita da `astro preview`), Chromium 149, da 280 a 1440 px. Nessun test con uno screen reader reale (dichiarato da v8).

## Findings

| Severity | Concern (verifier) | Location | Problem | Required fix / evidence | Durable? |
|----------|--------------------|----------|---------|-------------------------|----------|
| BLOCKER | v8 — UI statica della griglia risultati | `src/pages/case-study/[slug].astro:130`, `:138-145` | Lo script inline scrive `data-from` nel testo dello `<span class="cu">` prima del paint; l'opacità 0 di `.reveal` non lo toglie dall'albero di accessibilità. Prima che la card entri in vista l'albero legge valori falsi su tutti i casi studio ("−0%", "+0%", "22% → 22%", "~0s", "0ms"). Il problema c'era anche prima (il valore di partenza era nell'HTML); il cambiamento lo restringe a chi ha JS e non usa reduced motion, ma non lo chiude. | Tenere il valore finale come testo accessibile della card (nodo visivamente nascosto) e marcare `aria-hidden="true"` lo span animato; ripetere lo snapshot dell'albero con JS attivo prima dello scroll. | no |
| MAJOR | v6 — logica del count-up | `src/pages/case-study/[slug].astro:138-145`, `:561-602` | Il design fallisce sul valore sbagliato: lo script inline sovrascrive il numero vero con `from` (0, 12, 22) e solo lo script in bundle, dietro un IntersectionObserver a soglia 0.6, lo riporta a `to`. Se il bundle non si carica, se `run()` lancia (es. `el.animate` assente o durata NaN), se l'observer non scatta o se la pagina viene stampata, resta il numero di partenza. | Rete di sicurezza: timeout nello script inline che riporta a `data-to` i numeri armati non partiti, `try/catch` in `run()` con fallback a `data-to`, gestione `beforeprint`/stampa. In alternativa armare dal bundle stesso. | no |
| MAJOR | v7 — motion-craft del count-up | `src/pages/case-study/[slug].astro:574-602` | Il conteggio parte quando lo `<span>` supera la soglia 0.6, senza legame con il `.reveal` della card e il suo stagger d1/d2. I tre conteggi partono insieme; `--ease-out-expo` brucia circa l'80% del percorso nei primi ~200 ms, quindi le card 2 e 3 sono quasi finite prima di vedersi (misurato: card 3 a 34/38 con opacità 0.83). Lo schema c'era già prima; la curva expo, imposta dai token, lo rende più visibile della vecchia ease-out cubica. | Far partire ogni conteggio con l'entrata della sua card più `i × --stagger` (o sulla classe `.in` / `transitionend` della card). | no |
| MINOR | v7 — motion-craft (v8 concorda) | `src/pages/case-study/[slug].astro:404` | Senza `font-variant-numeric: tabular-nums` la larghezza delle cifre cambia durante il conteggio (misurato 42,5–51,6 px), il suffisso si sposta, e tra 1036 e 1060 px la card va a capo solo a fine conteggio. Preesistente. | `font-variant-numeric: tabular-nums` su `.cu` o sul `<b>`. | no |
| MINOR | v8 — UI statica | `src/pages/case-study/[slug].astro:404` (`.metric-card b`) | "12,5% → 80%" va a capo dopo la freccia tra 280–375 px e 804–1060 px ("22% → 96%" a 280, 320, 801, 900). Preesistente: lo stato finale era lo stesso anche prima. Screenshot grid-280.png e grid-900.png di v8. | `white-space: nowrap` sul numero con una dimensione fluida (`clamp`) che entri nel box a 280 px; ripetere lo sweep. | yes |
| MINOR | v6 — logica del count-up | `src/pages/case-study/[slug].astro:569-578` | `ms()` e `run()` non si difendono da durata NaN o 0: WAAPI lancia con una durata NaN. Oggi `--dur-data` vale `1s` e si legge bene. | Fallback (`\|\| 1000`) e `try/catch`, da unire alla correzione del MAJOR di v6. | no |
| MINOR | v7 — motion-craft | `src/pages/case-study/[slug].astro:138-145` | Il reset prima del paint resta invisibile solo grazie all'opacità 0 di `.reveal`: dipendenza già registrata in `brain/chore/motion.md`, oggi valida (opacità 0 per 484 ms nel campione). | Nessuna correzione richiesta ora; da rivedere quando i reveal diventeranno visibili senza JS. | yes |
| MINOR | v4 — dati strutturati | `src/content.config.ts:70-71`, `src/pages/case-study/[slug].astro:21` | `z.coerce.date()` accetta qualunque formato; `toISOString().slice(0,10)` sposta il giorno con un orario con fuso (`2026-03-05T00:30:00+02:00` → `2026-03-04`) o con `05/03/2026` letto in ora locale. Nessun caso studio imposta date oggi. | Validare solo `YYYY-MM-DD` (`z.iso.date()` o regex) ed emettere la stringa così com'è. | no |
| MINOR | v4 — dati strutturati | `src/pages/case-study/[slug].astro:25` | L'`headline` dell'Article tiene il punto finale in tre casi studio, mentre `<title>` e og:title lo tolgono con `.replace(/\.$/, '')`. | Applicare lo stesso strip all'`headline`. | no |
| MINOR | v3 — build e dipendenza | `package.json`, `package-lock.json` (`node_modules/sitemap`) | `sitemap@10.0.0` dichiara `engines: node >=22.22.1`; Astro chiede `>=22.12.0` e il repo non fissa la versione di Node (Node locale 22.17.1, sotto la soglia). La build passa; un host con Node tra 22.12 e 22.21 mostra al massimo un warning EBADENGINE, salvo `engine-strict`. | Fissare Node (`engines` o `.nvmrc`) e controllare la versione dell'host di deploy. | yes |
| NIT | v2 — esposizione ai crawler | `astro.config.mjs:8` | `/benvenuto/x` non verrebbe escluso (oggi la rotta non esiste); la regex è una lista di esclusioni tenuta a mano. | Allargare a `benvenuto(\/\|$)` se arrivano sotto-pagine. | no |
| NIT | v4 — dati strutturati | `src/layouts/Base.astro:51-55` | Mancano `twitter:image:alt` e i `twitter:*` espliciti (X ripiega su og:*). | Opzionale. | no |
| NIT | v5 — `/llms.txt` | `src/pages/llms.txt.ts:35-38`, `README.md` | I prezzi sono una terza copia scritta a mano, oggi allineata; il README lo documenta. | Nessuna correzione richiesta. | yes |
| NIT | v7 — motion-craft | `src/pages/case-study/[slug].astro:579-586` | `textContent` scritto a ogni frame anche quando il valore arrotondato non cambia; reduced motion deciso una volta al caricamento. Costo trascurabile. | Opzionale: scrivere solo se il valore cambia. | no |

_"Durable?" = yes quando il finding non verrà corretto prima del ship e va portato in `brain/tech-debt/` durante l'ingest._

## What passed

| Concern (verifier) | Evidence |
|--------------------|----------|
| v1 — sink HTML grezzo del JSON-LD | `JSON.stringify` emette `<` solo dentro stringhe e `<` è sempre un escape valido; ogni uscita dallo stato script-data comincia con `<`. Serializer reale bundlato e testato con un tokenizer WHATWG: 22.255 casi, 0 errori; il controfattuale senza escape fallisce su `</script>` e `<!--<script>`. Build end-to-end con titolo, excerpt, SITE e slug ostili: un solo tag ld+json per pagina, `JSON.parse` restituisce i valori byte per byte; confermato con il parser di Chrome. Unico nuovo sink `set:html` (`Base.astro:60`); `data-from`/`data-to` sono numeri escapati da Astro; `/llms.txt` è `text/plain`. |
| v2 — esposizione ai crawler | Regex testata: esclude `/benvenuto`, `/benvenuto/`, `/p`, `/p/`, `/p/a/b/`; tiene `/pricing`, `/p-x/`, `/case-study/p/`. `dist/sitemap-0.xml` contiene solo home, 4 casi studio, `/pricing/`, `/termini/`. I prototipi non escono in build finché `visible: false`; pubblicati restano fuori dalla sitemap e hanno `noindex, nofollow`. Bozze filtrate in pagine, sitemap e llms.txt. robots.txt senza Disallow, quindi i noindex restano leggibili; URL della sitemap coerente fra robots.txt, `<link rel="sitemap">` e file emesso. |
| v3 — build e dipendenza | `astro build` in una cartella temporanea: 8 pagine, nessun errore di schema, `sitemap-index.xml` creato. Nessun adapter, output statico. `@astrojs/sitemap@3.7.5` senza peer dependency, hook standard; un solo `astro@7.3.5`. Aggiunte al lockfile solo di build o di tipi; i bundle client non contengono sitemap né undici. I quattro casi studio restano validi senza le date. |
| v4 — dati strutturati e meta social | JSON-LD valido, un blocco per pagina, ogni `@id` risolto nel grafo. Article: `url` = `mainEntityOfPage` = canonical, headline sotto i 110 caratteri, date assenti quando mancano. `og:type` `article` solo sui casi studio; `og:url` = canonical; `og:image` assoluta; site_name, locale, dimensioni e `twitter:card` presenti. `public/og.png` misura 1200×630 e l'alt ne riporta il testo. |
| v5 — accuratezza di `/llms.txt` | Ogni prezzo, piano, cadenza, garanzia e condizione VERIFIED su `pricing.astro`, `index.astro`, `termini.astro`, `config.ts` o `product.md`; nessun claim CONTRADICTED. Garanzia, slot, fondatore e contatti importati da `src/config.ts`. Link interni costruiti e con lo slash finale; `dist/llms.txt` emesso come file statico. |
| v6 — logica del count-up | HTML statico con il valore finale su tutti i casi studio. Nell'output compresso lo script inline segue direttamente la griglia; `previousElementSibling` la raggiunge, con zero o più `.cu`. Il conteggio atterra sempre su `to` (ramo `progress == null`), anche dopo una pausa della tab; la curva expo non supera il valore finale. `1s` minificato letto come 1000 ms. |
| v7 — motion-craft del count-up | Durata e curva solo da `--dur-data` e `--ease-out-expo` tramite l'orologio WAAPI. Con reduced motion i numeri sono subito finali e non armati (80/84/38). Nessun flash del valore finale nel campione (opacità 0 nei primi 484 ms); dipendenza da `.reveal` documentata in `motion.md`. |
| v8 — UI statica della griglia risultati | Nessun overflow da 280 a 1440 px a passi di 4 px; griglia a una colonna fino a 800 px e a tre da 801. Valori finali corretti nell'HTML servito e con reduced motion su tutte e quattro le rotte; card statica "0" senza `.cu` corretta. |

## Per-concern verdicts

| Pass | Charter | Verdict | Rationale |
|------|---------|---------|-----------|
| v1 | Sink HTML grezzo del JSON-LD | SHIP | L'escape di `<` chiude ogni uscita dallo stato script-data; confermato da fuzzing, controfattuale, build ostile e parser di Chrome. |
| v2 | Esposizione ai crawler delle rotte non pubbliche | SHIP | Nessuna fuga trovata; solo la lista di esclusioni tenuta a mano è un punto debole minore. |
| v3 | Gate di build, dipendenza e schema | SHIP | Build verde, output statico, integrazione compatibile; solo la soglia di Node non fissata. |
| v4 | Correttezza di JSON-LD e metadati social | SHIP | Grafo valido e coerente con il canonical, meta completi; date e punto finale dell'headline sono problemi latenti. |
| v5 | Accuratezza commerciale di `/llms.txt` | SHIP | Tutti i claim verificati sulle fonti; la terza copia dei prezzi è documentata e oggi allineata. |
| v6 | Logica del count-up | DO NOT SHIP | Percorso felice e senza JS corretti, ma un numero armato non ha una via di ritorno sicura al valore vero. |
| v7 | Motion-craft del count-up | DO NOT SHIP | Token e reduced motion corretti, ma i conteggi non seguono l'entrata scaglionata delle card e le cifre tremano. |
| v8 | UI statica della griglia risultati | DO NOT SHIP | Con JS l'albero di accessibilità legge i valori di partenza; il primo numero va a capo a metà espressione in due fasce di larghezza. |

## Human Review Checklist

Da seguire prima di committare, dopo aver corretto i finding del count-up.

1. Dalla radice del repo esegui `npm run build`: deve finire con "Complete!" e la riga `[@astrojs/sitemap] sitemap-index.xml created`.
2. Controlla la sitemap: `grep -c 'benvenuto\|/p/' dist/sitemap-0.xml` deve stampare `0`, e il file deve elencare solo home, `/pricing/`, `/termini/` e i casi studio pubblicati.
3. Apri `dist/case-study/onboarding-saas/index.html` e cerca `application/ld+json`: copia il contenuto nel Rich Results Test di Google (o nel validatore di schema.org) e verifica che Organization, Person, WebSite e Article siano riconosciuti senza errori.
4. Apri `dist/llms.txt` e confronta ogni prezzo con `/pricing` (2.400 €, 2.200 €, 5.000 €, 28.000 €, 4.500 €) e la garanzia con `src/config.ts`.
5. Apri `public/og.png` e decidi se ti rappresenta; dopo il deploy prova un link a `https://spatalo.tech/` nello strumento di anteprima di LinkedIn (Post Inspector) e in un post di prova su X.
6. Avvia `npm run preview` e apri `/case-study/onboarding-saas/` in tre modi:
   - **JS disattivato:** i risultati mostrano "12,5% → 80%", "−84%", "+38%" (la card resta invisibile per il problema noto dei `.reveal`, ma il testo è nel sorgente);
   - **JS attivo:** prima di scrollare, con VoiceOver (Cmd+F5) o l'albero di accessibilità di Chrome DevTools, i risultati devono leggersi già finali; scrollando, ogni numero conta mentre la sua card entra, una card dopo l'altra, senza flash del valore finale e senza saltare di larghezza;
   - **reduced motion attivo** (Impostazioni di sistema → Accessibilità → Schermo → Riduci movimento): numeri finali subito, nessun conteggio.
7. Riduci la finestra a 320 px e a circa 900 px: "12,5% → 80%" deve stare su una riga sola.
8. Rilancia l'adversarial review sul diff corretto prima del commit.

## Feature-improvement candidates

| Candidate (verifier) | Evidence | Who gains | Size | Outcome |
|----------------------|----------|-----------|------|---------|
| Prezzi in un posto solo (v5) | `src/pages/llms.txt.ts:35-38`, `src/pages/pricing.astro`, `src/pages/index.astro`: tre copie scritte a mano | Omar, che cambia i prezzi in un punto; chi legge `/llms.txt` non trova prezzi vecchi | small | recorded |
| og:image per caso studio, più `Article.image` (v4) | `src/layouts/Base.astro:51`: una sola immagine generica per tutte le pagine | CTO e agenzie che ricevono il link di un caso studio vedono il risultato in anteprima | medium | recorded |
| Esclusioni della sitemap derivate dai flag di pagina (v2) | `astro.config.mjs:8`: regex tenuta a mano | Una nuova pagina noindex non finisce nella sitemap per dimenticanza | small | recorded |
| Versione di Node fissata (v3) | `node_modules/sitemap/package.json` chiede Node ≥ 22.22.1; nessun `engines` né `.nvmrc` | Build riproducibili tra locale e host di deploy | small | recorded (Node 26, ultima LTS, scelta di Omar) |
| Serializer JSON-LD più rigido con un autocontrollo (v1) | `src/seo.ts:47-48`: escape solo di `<`, sufficiente oggi | Sicurezza se il serializer viene riusato in un contesto JS o XHTML | small | recorded |

## Notes for docs-maintenance

- Durable findings to fold into `brain/tech-debt/_unscoped/2026-11-15-seo-geo-basi.md`: a capo di "12,5% → 80%" tra 280–375 e 804–1060 px (v8, preesistente, se non corretto prima del ship); dipendenza del reset prima del paint da `.reveal` (v7, già in `brain/chore/motion.md`); soglia di Node non fissata (v3); terza copia dei prezzi in `/llms.txt` (v5).
- Domain pages that should backlink this review: n/a (standalone).
