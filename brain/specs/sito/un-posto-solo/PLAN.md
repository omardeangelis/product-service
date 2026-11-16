---
domain: sito
type: plan
links: ["[[specs/sito/un-posto-solo/SPEC]]", "[[feature-improvement/_unscoped/_unscoped]]", "[[review/2026-11-15-seo-geo-basi/REPORT]]"]
created: 2026-11-15
updated: 2026-11-15
---

# Plan: Un posto solo — prezzi, sitemap e versione di Node

Il contratto è [[specs/sito/un-posto-solo/SPEC]], criteri AC1–AC16. Non c'è `FLOW.md` né `STATES.md`, e non ci sono motion né cambi visibili, quindi niente `design-engineer`. Non c'è nemmeno un advisor di schema, perché non c'è un data layer.

Il gate del piano è stato eseguito da `adversarial-verifier` il 2026-11-15: DO NOT SHIP, con 0 blocker, 3 major, 5 minor e 8 nit. Ogni rilievo è stato integrato qui sotto (D9, D13–D16 e le verifiche di T2–T6).

## Situazione iniziale

- **Prezzi.** Sono scritti a mano in tre file:
  - `src/pages/index.astro:297,301,324,325,340,364-366,378`;
  - `src/pages/pricing.astro:30,33,34,76,79,80,115`;
  - `src/pages/llms.txt.ts:35-37`.

  Le pagine scrivono "2.400€", `/llms.txt` scrive "2.400 €". Anche gli importi derivati (600€, 4.667€, 2.000€, "da 2.200€/mese", "da 5.000€/sprint") e i "6 sprint" del trimestre sono scritti a mano.
  - Il README documenta le tre copie (riga 64), e la sua riga 29 descrive `src/config.ts` senza i prezzi. Anche il commento in testa a `llms.txt.ts` documenta le tre copie.
  - `src/config.ts` contiene già `GUARANTEE`, `SITE`, `SLOTS` e `PROTOTYPES`. `GUARANTEE.claim` è un esempio di valore ricavato dentro la config.
  - **`src/config.ts` finisce anche nel JS del browser**: `src/data/confronto.ts:5` importa `GUARANTEE`, e `src/scripts/confronto.ts:8` importa quel modulo nello script client della home (D13).
- **Sitemap.**
  - `astro.config.mjs:7-8` esclude `/benvenuto` e `/p/*` con una regex (`fuoriDallaSitemap`) passata a `sitemap({ filter })`;
  - `/benvenuto` è `noindex` tramite la prop `noindex` di `src/layouts/Base.astro`;
  - `src/layouts/Prototype.astro:17` emette sempre `<meta name="robots" content="noindex, nofollow" />`;
  - i prototipi con `visible: false` non vengono costruiti in produzione (`src/prototypes/integration.mjs`);
  - la riga 28 del README descrive la sitemap "senza `/benvenuto` e `/p/*`".
- **Node.**
  - Il repo non ha `engines`, `.nvmrc` né `.npmrc`.
  - `sitemap@10.0.0` chiede Node ≥ 22.22.1 e Astro chiede ≥ 22.12.0.
  - Sul Mac di Omar il Node attivo è `/usr/local/bin/node` v22.17.1, dall'installer ufficiale.
  - nvm 0.39.7 è installato con 22.22.0, 24.11–24.14 e **26.13.1** (installata il 2026-11-14). Però `nvm current` restituisce `system` e l'alias `default` punta a 20.10.0, che non è installata.
  - **Nessuna checkout locale ha `@astrojs/sitemap` in `node_modules`**, quindi oggi la build in locale fallisce finché non si fa `npm install`.
- **Strumenti.** Non ci sono test runner, lint o typecheck: l'unico gate è `npm run build`. Il deploy è su Vercel, e ogni push su `main` fa un deploy.
- **Backlog.** Nessun tracker è collegato al repo. Ogni task ha `backlog_item_id: none` e `relation_mode: none`, fuori dall'enum dello schema: è una deviazione accettata, come in clienti-muro e confronto-ticket.

## Problema

Tre passaggi a mano vanno sostituiti da una sola fonte:
- i prezzi e i loro derivati, da tenere uguali in tre file;
- le pagine private, da elencare a mano nel filtro della sitemap;
- la versione di Node, che oggi non è dichiarata.

Il tutto senza cambiare niente di visibile sul sito. Si sistema anche il Node locale di Omar.

## Forma della soluzione

1. **Node 26 ovunque.** Sul Mac diventa il default di nvm. Il repo lo dichiara in `engines` e `.nvmrc`. npm blocca l'install con un'altra versione (`engine-strict`), e un controllo all'avvio della config di Astro blocca build, dev e preview. Vercel lo legge da `engines`.
2. **Una fotografia di partenza** delle pagine e della sitemap, presa con Node 26 prima di toccare prezzi e filtro: è il metro di "nessun cambiamento visibile".
3. **`PRICES` in `src/config.ts`.** Contiene i prezzi base, i derivati calcolati e un formattatore italiano. Home, pricing e `/llms.txt` lo leggono, e niente di tutto questo deve pesare sul JS del browser.
4. **Il filtro della sitemap legge l'HTML già costruito** e scarta le pagine con robots `noindex`. È l'unico segnale.
5. **Verifica del deploy Vercel** su Node 26.

## Registro delle decisioni

| # | Decisione | Fonte |
|---|---|---|
| D1 | Il "da" del Team in home resta 5.000€/sprint, cioè lo sprint singolo. Il "da" del Partner è il minimo tra mensile e trimestrale al mese, oggi 2.200€ | Omar (grill, domanda 1) |
| D2 | Il controllo della versione sta all'inizio di `astro.config.mjs`, quindi blocca `build`, `dev` e `preview`. L'install lo blocca `engine-strict` | Omar (grill, domanda 2); AC12 aggiunto alla spec |
| D3 | Sul Mac: `nvm install 26` (26.13.1 è già installata, quindi probabilmente non scarica niente) e `nvm alias default 26`. Il Node di sistema in `/usr/local/bin` resta dov'è (non-goal). Un eventuale download da nodejs.org, circa 50 MB, è autorizzato da Omar | Omar (grill, domanda 3); gate |
| D4 | La fonte della versione richiesta è `engines.node` in `package.json` (`"26.x"`). Vercel e npm lo leggono da lì, e il controllo in `astro.config.mjs` ne ricava la major. `.nvmrc` (`26`) serve a nvm. Il controllo legge `.nvmrc` accettando anche la forma `v26`. Se la sua major è diversa da quella di `engines`, o se il file manca, fallisce con un messaggio che lo dice: così le due copie non possono divergere in silenzio | piano; gate |
| D5 | `.npmrc` contiene `engine-strict=true`. Provato: con `engines.node: "26.x"`, npm 10.9.2 (Node 22.17.1) e npm 11.11.0 (Node 24.14.1) escono con 1 e `Required: {"node":"26.x"}`, anche per il pacchetto del repo stesso. Un install fallito lascia lockfile e `node_modules` intatti. Con Node 26 esce con 0 | piano; gate |
| D6 | In `src/config.ts`, `PRICES` contiene i prezzi base come numeri interi: `partner.monthly` 2400, `partner.quarterlyMonthly` 2200, `team.sprint` 5000, `team.quarter` 28000, `team.sprintsPerQuarter` 6, `mvp.monthly` 4500. I derivati sono calcolati lì, come `GUARANTEE.claim`: `partner.quarterSaving` = (monthly − quarterlyMonthly) × 3, `partner.from` = il minimo dei due, `team.quarterPerSprint` = round(quarter / sprintsPerQuarter), `team.quarterSaving` = sprint × sprintsPerQuarter − quarter, `team.from` = sprint (D1). Arrotondamento all'euro con `Math.round` | spec (Decision Log), piano |
| D7 | `formatEuro(n)` sta in `src/config.ts` accanto a `PRICES` e restituisce solo il numero ("2.400"). Ogni pagina mantiene il simbolo come oggi: "€" attaccato nelle pagine, " €" in `/llms.txt`. Usa `Intl.NumberFormat('it-IT', { useGrouping: 'always', maximumFractionDigits: 0 })`: **senza `useGrouping: 'always'` l'italiano scrive "2400"**, perché raggruppa solo da 5 cifre. Provato su Node 22.17.1, 24.14.1 e 26.13.1 | piano; gate |
| D8 | Anche il "6" dei "6 sprint" del trimestre viene da `team.sprintsPerQuarter`, dovunque compare accanto ai prezzi: se cambia, cambiano anche prezzo a sprint e risparmio | piano |
| D9 | `astro.config.mjs` dichiara `const outDirUrl = new URL('./dist/', import.meta.url)` e passa ad Astro `outDir: fileURLToPath(outDirUrl)`, **una stringa**: Astro 7.3.5 rifiuta un URL con `outDir: Expected type "string"`. Il filtro di `sitemap()`, per ogni URL, legge `new URL('.' + pathname + 'index.html', outDirUrl)` (`build.format` è `directory`, il default) e restituisce **un booleano stretto**: `false` se l'HTML contiene un `<meta name="robots">` con `noindex` (attributi in qualunque ordine, senza distinguere maiuscole), altrimenti `true`. Se il file non esiste, lancia un `Error` che nomina l'URL e il file, e la build esce con 1 (provato anche con `build.format: 'file'`) | piano; gate (MAJOR, provato) |
| D10 | Niente test runner nuovo. Il RED di ogni task è un controllo che fallisce, su `dist/` o su un comando, eseguito con script usa e getta fuori dal repo | repo (come confronto-ticket D18) |
| D11 | I task sono in sequenza. T4 e T5 condividono `dist/`, `README.md` (righe diverse) e le prove con modifiche temporanee alla config: due build in parallelo si sovrascriverebbero | piano; gate |
| D12 | `AGENTS.md` (`CLAUDE.md` è un symlink) cambia in due punti. Nel Gate: "Node 26 (`engines` e `.nvmrc`): con un'altra versione install, build e dev si fermano". Nelle Convenzioni, l'elenco di ciò che sta in `src/config.ts` aggiunge i prezzi | piano |
| D13 | `PRICES` e `formatEuro` non devono pesare sul JS del browser, dove `src/config.ts` arriva tramite lo script di Confronto. Il formattatore si crea **dentro** `formatEuro`, non all'avvio del modulo, e `PRICES` non usa spread. Provato: il bundle passa da 6786 a 6829 B e non contiene `NumberFormat`. Con spread e un formattatore creato all'avvio diventava 7133 B, conteneva i prezzi ed eseguiva `Intl` a ogni visita | gate (MINOR, provato) |
| D14 | Il perimetro di AC1 ("nessun altro file") sono il codice e la documentazione del sito: `src/`, `public/`, `README.md` e `AGENTS.md`, con l'eccezione di `src/config.ts`. `brain/` è fuori: spec, piano e review citano i prezzi apposta | gate |
| D15 | Con npm 11.20 (Node 26.13.1), l'install stampa "install-scripts … not yet covered by allowScripts: esbuild, fsevents". È atteso: non è `EBADENGINE`, quindi AC13 tiene. **Non** si esegue `npm install-scripts approve`, che cambierebbe `package.json` | gate |
| D16 | Push del branch, PR e merge si fanno solo quando Omar lo chiede | gate |

**Assunzioni:**
- Vercel fa i deploy di anteprima dei branch, con l'integrazione GitHub. Se non li fa, AC14 si verifica solo dopo il merge, sul deploy di `main`.
- Con un Node sotto la 22.12, `node_modules/astro/bin/astro.mjs` si ferma prima di leggere la config, con il suo messaggio `>=22.12.0`, che non nomina la 26. Nessuna versione così è installata. Lo documenta il README (T2).

**Ancora aperto:** niente.

## Cosa ho trovato nel codice

- `Intl.NumberFormat('it-IT')` formatta 2400 come "2400" e 28000 come "28.000". Con `useGrouping: 'always'` dà "2.400", "4.667" e "28.000" (D7).
- Tutte le dipendenze del lockfile accettano Node 26: le soglie sono aperte verso l'alto. L'unica eccezione è `@img/sharp-win32-ia32` (`^20.9.0`), opzionale, che con Node 26 viene saltata. Provato: install senza `EBADENGINE`, e il diff del lockfile tocca solo `engines` della radice.
- Astro 7.3.5 vuole `outDir` come stringa (`node_modules/astro/dist/core/config/schemas/base.js:40`) (D9).
- Astro 7.3.5 manda in background `dev` e `preview` quando rileva un agente (`node_modules/astro/dist/cli/dev/index.js:85`, libreria `am-i-vibing`). Nella shell di un agente l'errore della config finisce in `.astro/dev.log`, mentre l'output dice solo "Dev server process exited before becoming ready" (T2).
- Due build di fila danno HTML identico byte per byte: le fotografie sono un metro affidabile.
- `src/pages/benvenuto.astro` e una cartella `src/pages/benvenuto/` possono convivere, quindi la prova di AC8 con una sotto-pagina è possibile.
- La sitemap di oggi, costruita dal gate su una copia del sito con Node 26.13.1, contiene 7 URL:
  ```
  https://spatalo.tech/
  https://spatalo.tech/case-study/dati-da-excel/
  https://spatalo.tech/case-study/motion-design/
  https://spatalo.tech/case-study/offerte-ai/
  https://spatalo.tech/case-study/onboarding-saas/
  https://spatalo.tech/pricing/
  https://spatalo.tech/termini/
  ```

## Ricerca esterna

- [Vercel: Node.js 26 LTS GA](https://vercel.com/changelog/node-js-26-lts-is-now-generally-available-on-vercel) e [build image](https://vercel.com/docs/builds/build-image): 26.x, 24.x e 22.x sono supportate in build, e `engines.node: "26.x"` attiva la 26. Le patch arrivano da sole.
- `@astrojs/sitemap@3.7.5`:
  - nel hook `astro:build:done` (`{ dir, pages }`), dopo la scrittura delle pagine, applica `pageUrls.filter((value) => filter(value))`, con `value` uguale all'URL completo;
  - `dist/schema.js` valida il filtro come funzione che restituisce un booleano. Un ritorno asincrono o non booleano lancia uno `ZodError`, che `index.js:177-180` cattura come warning: **niente sitemap, e la build esce con 0**. Un `Error` normale lanciato dal filtro invece si propaga, e la build esce con 1;
  - da qui il booleano stretto di D9, e lo script di T3 che fallisce se la sitemap manca.

## Grafo delle dipendenze

```
T1 ── T2 ── T3 ── T4 ── T5 ── T6
```

## Compiti

### T1: Node 26 sul Mac di Omar

- **depends_on**: []
- **location**: ambiente locale (`~/.nvm`). Nessun file del repo.
- **description**:
  - `nvm install 26` (26.13.1 c'è già, quindi probabilmente non scarica niente; D3) e `nvm alias default 26`.
  - Non toccare `/usr/local/bin/node` né `~/.zshrc`.
  - nvm 0.39.7 usa l'alias `default` all'avvio della shell e mette la 26 davanti a `/usr/local/bin`. Va verificato anche nelle shell dei tool dell'agente: se ricadono sul Node di sistema, i task successivi usano `nvm exec 26` o `zsh -lic` in modo esplicito.
- **validation**:
  - `zsh -lic 'node -v'` stampa `v26.x`;
  - `zsh -lic 'which node'` punta sotto `~/.nvm/versions/node/v26`;
  - `nvm alias default` risponde `26`;
  - dentro il repo `zsh -lic 'cd <repo> && node -v'` stampa `v26.x` (AC15).
- **status**: Planned
- **log**:
- **files edited/created**:
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: `zsh -lic 'node -v'` stampa `v26.x`. Oggi fallisce: una shell di login pulita usa `/usr/local/bin/node` v22.17.1 e `nvm current` restituisce `system`.
- **review_mode**: cli
- **complexity**: low
- **status (esecuzione)**: Done
- **log (esecuzione)**: 2026-11-16, eseguito inline dall'orchestratore (nessun codice del repo).
  - RED: `zsh -lic 'node -v'` stampava `v22.17.1` con `/usr/local/bin/node` e `nvm current` = `system`.
  - `nvm install 26` ha risposto "v26.13.1 is already installed", quindi nessun download. Poi `nvm alias default 26` ha dato `default -> 26 (-> v26.13.1)`.
  - GREEN: `zsh -lic` stampa `v26.13.1` da `~/.nvm/versions/node/v26.13.1/bin/node`, anche con `cd` nel repo (AC15).
  - La shell dei tool dell'agente resta su `/usr/local/bin/node`, come previsto tra i rischi. I task successivi mettono esplicitamente `~/.nvm/versions/node/v26.13.1/bin` in testa al `PATH`.
- **files edited/created (esecuzione)**: nessuno nel repo (`~/.nvm/alias/default`).

### T2: Il repo richiede Node 26

- **depends_on**: [T1]
- **location**: `package.json`, `package-lock.json`, `.nvmrc` (nuovo), `.npmrc` (nuovo), `astro.config.mjs` (solo l'inizio), `README.md`, `AGENTS.md`
- **description**:
  - `package.json`: `"engines": { "node": "26.x" }`.
  - `.nvmrc` contiene `26`. `.npmrc` contiene `engine-strict=true` (D5).
  - All'inizio di `astro.config.mjs`, prima di `defineConfig`:
    - legge `engines.node` da `package.json` con `readFileSync` + `JSON.parse` e ne ricava la major;
    - confronta la major con `process.versions.node`. Se è diversa, lancia un `Error` che nomina la versione richiesta e quella in uso e suggerisce `nvm use`;
    - legge `.nvmrc`, accettando `26` o `v26`. Se la sua major è diversa da quella di `engines`, o se il file manca, lancia un `Error` che lo dice (D4).

    Così blocca `build`, `dev` e `preview` (D2).
  - Con Node 26: `npm install`, che installa anche `@astrojs/sitemap`, oggi assente in locale. Il warning `allowScripts` è atteso (D15).
  - Controllare che `git diff package-lock.json` tocchi solo `engines` della radice e i metadati, e non la versione di nessuna dipendenza.
  - README: una sezione "Requisiti" che dice:
    - Node 26;
    - come attivarlo: `nvm install 26`, `nvm use`;
    - che con un'altra versione install, build e dev si fermano;
    - che sotto la 22.12 l'errore è quello di Astro.

    Copre AC16.
  - `AGENTS.md`: la riga del Gate di D12.
- **validation**:
  - con Node 26: `npm install` esce con 0 e senza `EBADENGINE`; `npm run build` passa senza `EBADENGINE` e stampa `sitemap-index.xml created` (AC13);
  - `nvm exec 24.14.1 npm install` esce con un codice diverso da 0 e il messaggio contiene `26.x`. Dopo, `git status` non mostra modifiche al lockfile (AC10);
  - `nvm exec 24.14.1 npm run build` esce con un codice diverso da 0 e il messaggio nomina Node 26 (AC11);
  - `nvm exec 24.14.1 perl -e 'alarm 30; exec @ARGV' npx astro dev --ignore-lock` esce con un codice diverso da 0. L'output, oppure `.astro/dev.log` se Astro ha mandato il dev in background perché rileva un agente, contiene il messaggio che nomina Node 26. Su macOS non ci sono `timeout` né `gtimeout`, per questo si usa `perl` (AC12);
  - lo stesso con `astro preview`, per D2;
  - su Node 26, con `.nvmrc` temporaneamente a `24`, `npm run build` fallisce con il messaggio di disallineamento. Con `.nvmrc` a `v26` passa. Poi va ripristinato `26` (D4);
  - il README contiene la sezione Requisiti con "Node 26" (AC16).
- **status**: Planned
- **log**:
- **files edited/created**:
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: `nvm exec 24.14.1 npm run build` esce con un codice diverso da 0 e un messaggio che nomina Node 26. Oggi fallisce: con Node 24 nessun messaggio nomina la 26, perché la build parte o si ferma per `@astrojs/sitemap` mancante.
- **review_mode**: cli
- **complexity**: medium
- **status (esecuzione)**: Done
- **log (esecuzione)**: 2026-11-16, worker `sonnet`, rivisto dall'orchestratore al primo giro.
  - RED (script nello scratchpad, `PATH` con Node 24.14.1 in testa al posto di `nvm exec`): prima falliva, dopo `T2 RED-CHECK: PASS (exit 1, nomina Node 26)`.
  - Il controllo in testa a `astro.config.mjs` ricava la major da `engines.node` e da `.nvmrc` con la stessa funzione, quindi `26` e `v26` valgono uguale.
  - Verifiche rifatte dall'orchestratore:
    - Node 24: `npm install` esce con 1, `EBADENGINE` e `Required: {"node":"26.x"}`;
    - Node 24: `npm run build` e `astro dev --ignore-lock` escono con 1 e stampano "Questo sito richiede Node 26 … stai usando Node 24.14.1";
    - Node 26: `npm install` e `npm run build` escono con 0, nessun `EBADENGINE`, `sitemap-index.xml created`;
    - `git diff --stat package-lock.json`: 3 righe aggiunte, solo `engines` della radice;
    - `zsh -lic 'cd <repo> && node -v'` stampa `v26.13.1` (AC15).
  - Verifiche del worker: con Node 24 anche `astro preview` esce con 1, ma in una shell d'agente il messaggio finisce in `.astro/preview.log`; con `.nvmrc` a `24` la build si ferma col messaggio di disallineamento, con `v26` passa, poi `.nvmrc` è tornato a `26`.
- **files edited/created (esecuzione)**: `package.json`, `package-lock.json`, `.nvmrc` (nuovo), `.npmrc` (nuovo), `astro.config.mjs`, `README.md` (sezione Requisiti), `AGENTS.md` (Gate).

### T3: Fotografia di partenza

- **depends_on**: [T2]
- **location**: una cartella usa e getta fuori dal repo. Il percorso assoluto va scritto nel log di questo task, perché lo usano T4 e T5 (eventualmente da worker diversi). Nessun file del repo.
- **description**:
  - Con Node 26 e le pagine non ancora toccate, `npm run build`.
  - Due script usa e getta nella stessa cartella:
    - `testo.mjs` estrae il testo visibile di un HTML: toglie `<script>`, `<style>` e tag, decodifica le entità e normalizza gli spazi;
    - `sitemap-urls.mjs` stampa gli URL di `dist/sitemap-*.xml`, ordinati, ed **esce con 1 se i file della sitemap mancano** (vedi Ricerca esterna).
  - Nella cartella vanno salvati:
    - l'HTML grezzo di `dist/index.html` e `dist/pricing/index.html`, con gli hash degli script normalizzati: `sed -E 's#/_astro/[^"]+\.js#/_astro/H.js#g'`;
    - il loro testo;
    - `dist/llms.txt` così com'è;
    - la lista degli URL della sitemap.
- **validation**:
  - `sitemap-urls.mjs` stampa esattamente i 7 URL elencati in "Cosa ho trovato nel codice". Se il numero è diverso, va annotato e si confronta con quello reale;
  - nel testo della home ci sono "2.200€", "4.667€" e "risparmi 600€";
  - nel testo di `/llms.txt` c'è "2.400 €";
  - con `dist/` cancellato, `sitemap-urls.mjs` esce con 1.
- **status**: Planned
- **log**:
- **files edited/created**:
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: `sitemap-urls.mjs` stampa i 7 URL attesi. Oggi fallisce: lo script non esiste e `dist/` non è stato costruito con Node 26.
- **review_mode**: cli
- **complexity**: low
- **status (esecuzione)**: Done
- **log (esecuzione)**: 2026-11-16, eseguito inline dall'orchestratore.
  - Cartella degli script e delle fotografie: `/private/tmp/claude-501/-Users-omardeangelis-Desktop-imparare-cose-personal-site--claude-worktrees-brain-manager-dependency-update-ceb33a/6c5fbebe-a099-4c23-a162-8d538a977abe/scratchpad/un-posto-solo/` (sotto: `$S`). Fotografia di partenza in `$S/baseline/`.
  - Script: `testo.mjs`, `html-norm.mjs`, `sitemap-urls.mjs`, `noindex-check.mjs` (per T5) e `snapshot.sh <etichetta>`, che scrive `index.html`, `pricing.html`, `index.txt`, `pricing.txt`, `llms.txt` e `sitemap.txt` in `$S/<etichetta>/` usando il Node 26.
  - Build con Node 26 su `src/` non toccato: exit 0.
  - `sitemap-urls.mjs` stampa i 7 URL attesi, uguali a "Cosa ho trovato nel codice".
  - Testo della home: "2.200€" (2 volte: "da 2.200€/mese" e il prezzo del trimestrale), "4.667€ a sprint", "risparmi 600€ rispetto al mensile". `/llms.txt`: "2.400 €".
  - Con `dist/` spostato altrove, `sitemap-urls.mjs` esce con 1 ("sitemap mancante").
  - In più rispetto al piano: anche `/llms.txt` scrive "28.000 € a trimestre (6 sprint)". Per D8 quel "6" segue `team.sprintsPerQuarter`, quindi T4 lo controlla anche nella mutazione a 7.
- **files edited/created (esecuzione)**: nessuno nel repo.

### T4: Prezzi in un posto solo

- **depends_on**: [T3]
- **location**: `src/config.ts`, `src/pages/index.astro`, `src/pages/pricing.astro`, `src/pages/llms.txt.ts`, `README.md` (righe 29 e 64), `AGENTS.md`
- **description**:
  - In `src/config.ts`:
    - `PRICES` con i prezzi base e i derivati di D6, senza spread (D13);
    - `formatEuro` di D7, con il formattatore creato dentro la funzione (D13);
    - un commento come quello di `SLOTS`: "cambia qui, home, pricing e /llms.txt si aggiornano da soli".
  - Sostituire ogni importo scritto a mano con `PRICES` + `formatEuro`, compreso il "6" dei "6 sprint" (D8):
    - `index.astro`, righe 297, 301, 324, 325, 340, 364, 365, 366, 378;
    - `pricing.astro`, righe 30, 33, 34, 76, 79, 80, 115;
    - `llms.txt.ts`, righe 35-37.

    I simboli restano come sono oggi: "€" attaccato nelle pagine, " €" in `/llms.txt`.
  - Togliere il commento sui prezzi scritti a mano in testa a `llms.txt.ts`.
  - README:
    - riga 64: "I prezzi stanno in `src/config.ts` (`PRICES`): home, `/pricing` e `/llms.txt` li leggono da lì";
    - riga 29: aggiungere i prezzi alla descrizione di `src/config.ts` (AC5).
  - `AGENTS.md`: aggiungere "prezzi" all'elenco di `src/config.ts` (D12).
- **validation**:
  - `npm run build` passa;
  - confronto con le fotografie di T3, `diff` vuoto (AC2, AC3):
    - HTML grezzo di `dist/index.html` e `dist/pricing/index.html` con gli hash `/_astro/*.js` normalizzati;
    - il loro testo;
    - `dist/llms.txt`;
  - AC1 (D14): il comando qui sotto esce con 1, cioè nessuna riga trovata. Oggi trova 19 righe ed esce con 0:
    ```
    /usr/bin/grep -rInE '(^|[^0-9.])(2\.?400|2\.?200|5\.?000|28\.?000|4\.?500|4\.?667)([^0-9]|$)|(^|[^0-9.])(600|2\.?000) ?€' src public README.md AGENTS.md --exclude=config.ts; test $? -eq 1
    ```
  - D13: `! /usr/bin/grep -l NumberFormat dist/_astro/*.js`, cioè nessun bundle client contiene `NumberFormat`;
  - mutazioni temporanee, una alla volta. Dopo ognuna: `npm run build`, controllo del testo, ripristino e nuova build:

    | Mutazione | Cosa deve comparire |
    |---|---|
    | `partner.monthly` → 2500 (AC4) | `/llms.txt` "2.500 €"; pricing "2.500€" e "risparmi 900€"; home "risparmi 900€ rispetto al mensile" |
    | `partner.quarterlyMonthly` → 2100 (AC3: `partner.from`, `partner.quarterSaving`) | home "da 2.100€/mese" e "risparmi 900€ rispetto al mensile"; pricing "2.100€"; `/llms.txt` "2.100 €" |
    | `team.quarter` → 27000 (AC3: `team.quarterPerSprint`, `team.quarterSaving`) | home "27.000€", "4.500€ a sprint" e "Risparmi 3.000€"; pricing "27.000€" e "risparmi 3.000€"; `/llms.txt` "27.000 €" |
    | `team.sprint` → 5200 (AC3: `team.from`) | home "da 5.200€/sprint" e "Risparmi 3.200€"; pricing "5.200€" e "risparmi 3.200€"; `/llms.txt` "5.200 €" |
    | `team.sprintsPerQuarter` → 7 (D8) | home "7 sprint", "4.000€ a sprint" e "Risparmi 7.000€"; pricing "7 sprint" e "risparmi 7.000€" |

  - alla fine, il `diff` con le fotografie di T3 è di nuovo vuoto e `git status` non mostra la config modificata;
  - README e il commento di `llms.txt.ts` non parlano più di tre copie (AC5).
- **status**: Planned
- **log**:
- **files edited/created**:
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: con `PRICES.partner.monthly = 2500` in `src/config.ts`, dopo `npm run build`, `dist/llms.txt` contiene "2.500 €" e non "2.400 €". Oggi fallisce: `PRICES` non esiste e il prezzo è scritto nel testo.
- **review_mode**: cli
- **complexity**: medium
- **status (esecuzione)**: Done
- **log (esecuzione)**: 2026-11-16, worker `sonnet`, rivisto dall'orchestratore al primo giro.
  - RED: il grep di AC1 trovava 19 righe, tutte prezzi veri. Dopo, nessuna riga e `test $? -eq 1` passa.
  - I prezzi base sono costanti locali in `src/config.ts` (`partnerMonthly`, `teamSprint`…), come `guaranteeDays`. `PRICES` li espone con i derivati, senza spread. `mvp.monthly` è scritto direttamente nell'oggetto, perché non ha derivati.
  - Verifiche rifatte dall'orchestratore:
    - build con Node 26 exit 0, `diff -r` con la fotografia di T3 vuoto (HTML grezzo, testo, `llms.txt`, sitemap: AC2, AC3);
    - nessun bundle in `dist/_astro/*.js` contiene `NumberFormat` o i prezzi (D13);
    - mutazione `partnerMonthly` → 2500 (AC4): `/llms.txt` "2.500 €", nessun "2.400" in home, pricing e `/llms.txt`, "risparmi 900€" in home e pricing. Dopo il ripristino, `src/config.ts` è identico alla copia e il `diff` con la fotografia è di nuovo vuoto.
  - Verifiche del worker, tutte con l'esito atteso: le sei mutazioni della tabella più `mvp.monthly` → 4700 (pricing "4.700€", `/llms.txt` "4.700 €"), e "(7 sprint)" in `/llms.txt` con `sprintsPerQuarter` a 7.
  - README (righe 42 e 77) e il commento di `llms.txt.ts` non parlano più di copie (AC5).
- **files edited/created (esecuzione)**: `src/config.ts`, `src/pages/index.astro`, `src/pages/pricing.astro`, `src/pages/llms.txt.ts`, `README.md` (righe 42 e 77), `AGENTS.md` (Convenzioni).

### T5: La sitemap esclude da sé le pagine noindex

- **depends_on**: [T4]
- **location**: `astro.config.mjs`, `README.md` (riga 28)
- **description**:
  - Togliere `fuoriDallaSitemap` e la sua regex.
  - Dichiarare `outDirUrl` e passare `outDir: fileURLToPath(outDirUrl)`, una stringa. Il filtro di `sitemap()` legge l'HTML costruito e restituisce un booleano stretto, come in D9. Se il file di un URL non c'è, la build fallisce.
  - Commento: l'unico segnale è il robots `noindex` della pagina, cioè la prop `noindex` di `Base.astro` e `Prototype.astro`, che lo emette sempre.
  - README riga 28: "senza le pagine `noindex` (`/benvenuto`, i prototipi su `/p/*`)".
- **validation**:
  - `npm run build` passa, e `sitemap-urls.mjs` (che fallisce se la sitemap manca) stampa una lista identica alla fotografia di T3. Il log della build non contiene warning di `@astrojs/sitemap` (AC7);
  - uno script usa e getta controlla che, per ogni URL di `dist/sitemap-*.xml`, l'HTML corrispondente non contenga robots `noindex` (AC6);
  - con una pagina temporanea `src/pages/benvenuto/prova.astro` (`Base` con `noindex`), la sitemap non contiene `/benvenuto/prova/`. Con una pagina temporanea `src/pages/prova-indice.astro` senza `noindex`, la sitemap contiene `/prova-indice/`. Poi si cancellano entrambe e si rifà la build (AC8);
  - con `visible: true` temporaneo sul prototipo `esempio-4k9x2` esistono `dist/p/esempio-4k9x2/` e `/dettaglio/`, ma la sitemap non contiene nessun URL `/p/`. Poi si ripristina `false` e si rifà la build (AC9);
  - con `build: { format: 'file' }` temporaneo la build fallisce e il messaggio nomina un URL. Poi si ripristina (D9);
  - `astro.config.mjs` non contiene più percorsi scritti a mano (`benvenuto`, `/p`);
  - alla fine `git status` non mostra pagine di prova né la config modificata.
- **status**: Planned
- **log**:
- **files edited/created**:
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: con la pagina temporanea `src/pages/benvenuto/prova.astro` (`noindex`), `dist/sitemap-0.xml` non contiene `/benvenuto/prova/`. Oggi fallisce: la regex copre solo `benvenuto/?$` (nit v2 della review del 2026-11-15).
- **review_mode**: cli
- **complexity**: medium
- **status (esecuzione)**: Done
- **log (esecuzione)**: 2026-11-16, worker `sonnet`, rivisto dall'orchestratore al primo giro.
  - RED: con la vecchia regex, la sitemap conteneva `/benvenuto/prova/`.
  - Il filtro `indicizzabile` legge `dist/<pathname>index.html` e restituisce `!metaRobots.some(…)`, quindi sempre un booleano. Se il file manca lancia un `Error` che nomina URL e file.
  - Verifiche del worker:
    - AC8: con il filtro nuovo `/benvenuto/prova/` resta fuori, mentre `/prova-indice/` (senza `noindex`) entra;
    - AC9: con `visible: true`, `dist/p/esempio-4k9x2/` e `/dettaglio/` esistono con `noindex, nofollow`, e la sitemap non ha URL `/p/`. `dist/p/index.html` non esiste;
    - D9: con `build.format: 'file'` la build esce con 1 e "Sitemap: non trovo l'HTML di https://spatalo.tech/benvenuto in …". Il percorso stampato (`benvenutoindex.html`) è quello calcolato dal filtro, non un file vero, ma l'URL c'è;
    - `astro.config.mjs` non contiene più `benvenuto` né `/p`.
  - Verifiche rifatte dall'orchestratore:
    - una pagina `noindex` temporanea in una cartella nuova (`src/pages/riservato/verifica.astro`) viene costruita ma resta fuori dalla sitemap. Poi è stata cancellata;
    - con le pagine di oggi: build exit 0, nessun warning di `@astrojs/sitemap`, URL uguali alla fotografia di T3 (AC7), `noindex-check.mjs` dà "AC6 OK (7 URL, nessuno noindex)", fotografia completa uguale a quella di T3.
  - Correzione dell'orchestratore: la riga 41 del README aveva parentesi annidate. Ora dice "senza le pagine `noindex`: `/benvenuto` e i prototipi su `/p/*`".
- **files edited/created (esecuzione)**: `astro.config.mjs` (sitemap e `outDir`), `README.md` (riga 41).

### T6: Deploy su Vercel con Node 26

- **depends_on**: [T5]
- **location**: Vercel (anteprima del branch, poi `main`). Nessun file del repo.
- **description**:
  - Push del branch, PR e merge si fanno solo su richiesta di Omar (D16).
  - Il deploy di anteprima deve passare. Lo stato si legge da `gh pr checks`, mentre il log di build è nella dashboard di Vercel, che vede solo Omar: è lui a confermare che mostra Node 26.x.
  - Omar controlla in Vercel → Settings che la versione di Node del progetto non sia in conflitto. `engines` ha la precedenza, e allinearla a 26.x evita l'avviso.
  - Dopo il merge, Omar conferma il deploy di `main`.
  - `review_mode` resta `cli`, perché l'enum non ha un valore "manuale". La parte nel browser è solo la lettura del log da parte di Omar, non una verifica con `agent-browser`.
- **validation**:
  - deploy di anteprima "Ready" (`gh pr checks`), e Omar conferma Node 26.x nel log (AC14, sull'anteprima);
  - dopo il merge: deploy di `main` "Ready", e Omar conferma Node 26.x nel log (AC14);
  - `curl -s https://spatalo.tech/sitemap-0.xml` elenca gli stessi 7 URL di "Cosa ho trovato nel codice";
  - `curl -s https://spatalo.tech/llms.txt` contiene "2.400 €".
- **status**: Planned
- **log**:
- **files edited/created**:
- **backlog_item_id**: none
- **backlog_item_url**: none
- **relation_mode**: none
- **tdd_target**: il log di build dell'anteprima Vercel del branch mostra Node 26.x. Oggi fallisce: senza `engines`, Vercel usa la versione delle impostazioni del progetto.
- **review_mode**: cli
- **complexity**: low

## Ondate di esecuzione

| Ondata | Task | Può partire quando |
|---|---|---|
| 1 | T1 | Subito |
| 2 | T2 | T1 completato (serve Node 26 in locale) |
| 3 | T3 | T2 completato (fotografia con Node 26 e dipendenze installate) |
| 4 | T4 | T3 completato |
| 5 | T5 | T4 completato (`dist/` e `README.md` condivisi, D11) |
| 6 | T6 | Branch pushato con T2–T5, su richiesta di Omar (D16) |

L'esecuzione è `sequential`: non ci sono ondate parallele utili (D11).

## Strategia di test

- Il gate di ogni task è `npm run build` con Node 26.
- "Nessun cambiamento visibile" si prova confrontando con le fotografie di T3 sia l'HTML grezzo (con gli hash degli script normalizzati) sia il testo. Le build sono deterministiche, quindi un `diff` non vuoto è un cambiamento reale.
- "Calcolati dai prezzi" si prova con una mutazione per ogni derivato (T4), non solo col `diff` dei valori di oggi.
- Le prove con modifiche temporanee (prezzi, pagine di prova, `visible: true`, `build.format`, `.nvmrc`) si annullano subito, e dopo ognuna si rifà la build. Prima di chiudere ogni task, `git status` non deve mostrare file di prova.
- Le versioni diverse di Node si provano con `nvm exec 24.14.1`, già installata. `dev` e `preview` si provano con `perl -e 'alarm 30; exec @ARGV'`, leggendo `.astro/dev.log` se Astro li manda in background.
- I `grep` delle verifiche usano `/usr/bin/grep -r`, così si comportano allo stesso modo in ogni shell.
- Chiusura: `review.mode: plan`, quindi l'`adversarial-review` del codice non parte da sola. `implement-spec` la propone in una riga.

## Rischi e mitigazioni

- **`engine-strict` blocca una dipendenza opzionale su Node 26.** Provato dal gate: `@img/sharp-win32-ia32` viene saltata, nessun `EBADENGINE`. Se una dipendenza futura lo facesse, si toglie `engine-strict` e lo stesso controllo si fa in uno script `preinstall` che legge `engines` (D4).
- **Le shell dei tool non prendono il default di nvm.** Mitigazione: T1 lo verifica, e in caso si usano `nvm exec 26` o `zsh -lic` in modo esplicito.
- **Il lockfile cambia con l'npm di Node 26.** Provato dal gate: cambia solo `engines` della radice, e T2 lo ricontrolla.
- **Un worker "sistema" il warning `allowScripts`.** Mitigazione: D15 lo dichiara atteso e vieta `npm install-scripts approve`.
- **Il formato italiano senza raggruppamento delle migliaia** ("2400"). Mitigazione: `useGrouping: 'always'` (D7), e il `diff` con la fotografia lo prova (T4).
- **I prezzi arrivano nel JS del browser** tramite `src/config.ts`. Mitigazione: D13 e il `grep` di `NumberFormat` sul bundle (T4).
- **Il filtro della sitemap restituisce un valore non booleano e la sitemap sparisce con exit 0.** Mitigazione: booleano stretto (D9), `sitemap-urls.mjs` che fallisce se la sitemap manca, e controllo che il log non contenga warning della sitemap (T5).
- **Il filtro della sitemap legato a `build.format` e `outDir`.** Mitigazione: se un file manca, la build fallisce (D9, provato con `format: 'file'`).
- **Il deploy di anteprima non esiste.** Mitigazione: AC14 si verifica sul deploy di `main` subito dopo il merge, con i `curl` di T6.

## Domande non risolte

Nessuna.
