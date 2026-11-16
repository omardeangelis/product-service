---
domain: sito
type: implementation-notes
spec: un-posto-solo
links:
  - "[[specs/sito/un-posto-solo/SPEC]]"
  - "[[specs/sito/un-posto-solo/PLAN]]"
  - "[[domains/sito/flows/cambio-di-un-prezzo]]"
  - "[[domains/sito/flows/esclusione-dalla-sitemap]]"
  - "[[domains/sito/flows/controllo-della-versione-di-node]]"
  - "[[domains/sito/concepts/prezzi]]"
  - "[[domains/sito/concepts/indicizzabilita-della-pagina]]"
  - "[[domains/sito/concepts/versione-di-node]]"
ingested: true
last_ingested: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# Implementation Notes

## Summary

- T1–T5 fatti e verificati. Node 26 è richiesto da install, build e dev. I prezzi stanno solo in `src/config.ts` e i derivati si calcolano da soli. La sitemap esclude da sé le pagine `noindex`.
- L'HTML di home e `/pricing`, `/llms.txt` e la sitemap sono identici alla fotografia di partenza (T3).
- Dopo l'audit, su richiesta di Omar: `/pricing` dichiara piani e prezzi nel JSON-LD, letti da `PRICES` (vedi Deviations).
- Resta T6 (AC14): il deploy su Vercel con Node 26.x si verifica quando Omar chiede push e PR (D16).

## Execution Mode

- Mode: `sequential` (D11 del piano: un solo `dist/` condiviso, nessuna ondata parallela utile).
- Delegation: `supervised` (`brain/brain.config.json`). T2, T4 e T5 sono di complessità `medium` e vanno a worker `sonnet`, rivisti dall'orchestratore. T1 e T3 li fa l'orchestratore inline perché non producono codice del repo: T1 tocca l'ambiente (alias di nvm), T3 è la fotografia di partenza che serve alle verifiche dell'orchestratore. T6 (deploy su Vercel) parte solo quando Omar chiede push e PR (D16).
- Escalations: nessuna.

## Deviations From the Plan

- Le prove con Node 24 usano il `PATH` con `~/.nvm/versions/node/v24.14.1/bin` in testa al posto di `nvm exec 24.14.1`: è lo stesso Node, e la shell dei tool non carica nvm.
- T4 ha controllato anche il "(6 sprint)" di `/llms.txt` e una mutazione in più (`mvp.monthly` → 4700), non elencati nel piano.
- Pass di `$simplify` (4 revisori: riuso, semplificazione, efficienza, altitudine):
  - corretto: in `astro.config.mjs` il `// @ts-check` era finito dopo il controllo di Node, quindi TypeScript lo ignorava, e gli import erano divisi in due blocchi. Ora `// @ts-check` è in riga 1, gli import sono tutti in testa, `package.json` si legge come `utf8`, e `.nvmrc` mancante si rileva con `existsSync` invece di un `try/catch` con `let`. Messaggi e comportamento uguali;
  - saltato, perché cambierebbe una decisione del piano: togliere il controllo `.nvmrc` ↔ `engines` (D4), togliere `outDir` esplicito (D9), una regex che dipende dall'ordine degli attributi del meta robots (D9), creare il formattatore a livello di modulo (D13), togliere i `from` di `PRICES` o le costanti locali (D6).
- Correzione dell'orchestratore alla riga 41 del README (parentesi annidate), vedi il log di T5.
- Fuori piano, dopo l'audit, su richiesta di Omar ("Implementa subito la miglioria"): prezzi nei dati strutturati, fatto dall'orchestratore.
  - `src/seo.ts`: `pricingGraph(site)` restituisce tre `Service` (Partner, Team, MVP in 6 settimane), con `@id` su `/pricing/#…` e `provider` che cita lo studio per `@id`.
  - Ogni `Service` ha le sue `Offer` in EUR. Ogni `Offer` ha una `UnitPriceSpecification` con `valueAddedTaxIncluded: false`, letta da `PRICES`.
  - Unità: `MON` per i prezzi al mese, `QAN` per il trimestre Team, `unitText` "sprint di 2 settimane" per lo sprint. Il Partner trimestrale ha `billingDuration` di 3 mesi.
  - `src/pages/pricing.astro` passa i nodi a `Base.astro` (`jsonLd`). Le altre pagine non cambiano.
  - Aggiornati il commento dei prezzi in `src/config.ts` e il README (righe 38 e 77).

## Surprises and Decisions

- La shell dei tool dell'agente non carica l'alias `default` di nvm e resta su `/usr/local/bin/node` v22.17.1. Ogni comando di verifica mette `~/.nvm/versions/node/v26.13.1/bin` (o `v24.14.1` per le prove negative) in testa al `PATH`, al posto di `nvm exec`. Un terminale nuovo di Omar invece parte su Node 26.13.1.
- `astro preview` con Node 24, in una shell d'agente, scrive il messaggio su Node 26 solo in `.astro/preview.log`. Il terminale stampa "Preview server process exited before becoming ready". `astro dev` invece lo stampa direttamente.
- `/llms.txt` scrive anche "(6 sprint)" accanto al trimestre Team. Non era tra le righe del piano: per D8 segue `team.sprintsPerQuarter` anche lì.

## Sanity Checks

| Check | Result | Notes |
|------|--------|-------|
| T1: `zsh -lic 'cd <repo> && node -v'` | `v26.13.1` | alias `default -> 26` |
| T2: RED con Node 24 | PASS dopo, FAIL prima | `npm run build` esce con 1 e nomina Node 26 |
| T2: install con Node 24 | exit 1, `EBADENGINE`, `Required: {"node":"26.x"}` | lockfile intatto |
| T2: `astro dev` con Node 24 | exit 1, messaggio su Node 26 | |
| T2: install e build con Node 26 | exit 0, nessun `EBADENGINE` | warning `allowScripts` atteso (D15) |
| T2: `git diff --stat package-lock.json` | 3 righe aggiunte | solo `engines` della radice |
| T2: `.nvmrc` a `24`, poi `v26` | fallisce, poi passa | dal worker; `.nvmrc` di nuovo `26` |
| T3: URL della sitemap | 7, quelli attesi | fotografia in `$S/baseline/` (percorso nel log di T3) |
| T3: `sitemap-urls.mjs` senza `dist/` | exit 1 | |
| T4: grep di AC1 | 19 righe prima, 0 dopo | perimetro D14 |
| T4: `diff -r` con la fotografia di T3 | vuoto | anche dopo le mutazioni e il ripristino |
| T4: bundle client | nessun `NumberFormat`, nessun prezzo | D13 |
| T4: mutazioni (7) | stringhe attese in home, pricing e `/llms.txt` | `partnerMonthly` → 2500 rifatta dall'orchestratore |
| T5: RED con la vecchia regex | `/benvenuto/prova/` in sitemap | |
| T5: pagine `noindex` nuove | fuori dalla sitemap | `/benvenuto/prova/` (worker), `/riservato/verifica/` (orchestratore) |
| T5: pagina nuova senza `noindex` | in sitemap | `/prova-indice/` |
| T5: prototipo con `visible: true` | nessun URL `/p/` | |
| T5: `build.format: 'file'` | exit 1, errore che nomina l'URL | |
| T5: sitemap con le pagine di oggi | 7 URL, uguali alla fotografia; AC6 OK | nessun warning di `@astrojs/sitemap` |
| Dopo `$simplify` | RED di T2 PASS; senza `.nvmrc` e con `.nvmrc` a `24` la build si ferma col messaggio giusto; build Node 26 exit 0; fotografia = T3; AC6 OK; grep di AC1 vuoto | |
| Prezzi nel JSON-LD: `offer-check.mjs` sulla fotografia di T3 | FAIL ("offerte: 0") | RED |
| Prezzi nel JSON-LD: build Node 26 | exit 0; `offer-check.mjs` OK | 5 `Offer` con i prezzi di `PRICES`, grafo condiviso invariato, `/pricing` uguale alla fotografia fuori dal JSON-LD; home, testi, `/llms.txt` e sitemap uguali alla fotografia |
| Prezzi nel JSON-LD: `partnerMonthly` → 2500 | `Offer` "Partner mensile" a 2500 | ripristinato, poi rebuild uguale alla prima build con le offerte |
| Prezzi nel JSON-LD: altre pagine e bundle client | nessun `Service` in home né nei file `_astro/*.js` | |

## Acceptance Criteria Status

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC1 prezzi base in un solo punto | met | `PRICES` in `src/config.ts`; il grep di D14 su `src`, `public`, `README.md`, `AGENTS.md` non trova importi |
| AC2 stessi importi e formattazione | met | `diff -r` con la fotografia di T3 vuoto ("2.400€" nelle pagine, "2.400 €" in `/llms.txt`) |
| AC3 derivati calcolati e arrotondati | met | 600€, 4.667€, 2.000€, "da 2.200€/mese", "da 5.000€/sprint" uguali a prima; mutazioni su ogni prezzo base ricalcolano i derivati |
| AC4 un prezzo cambiato in un posto solo | met | `partnerMonthly` → 2500: "2.500" ovunque e "risparmi 900€", senza toccare altri file |
| AC5 README e commenti | met | README righe 42 e 77, commento di `llms.txt.ts`; niente più "tre posti" né "a mano" |
| AC6 nessun URL `noindex` in sitemap | met | `noindex-check.mjs`: "AC6 OK (7 URL, nessuno noindex)" |
| AC7 stessi URL di prima | met | 7 URL, `diff` con la fotografia vuoto, nessun warning di `@astrojs/sitemap` |
| AC8 pagina `noindex` nuova fuori, senza `noindex` dentro | met | `/benvenuto/prova/` e `/riservato/verifica/` fuori, `/prova-indice/` dentro, senza toccare la config |
| AC9 prototipo pubblicato fuori | met | `visible: true`: pagine costruite con `noindex, nofollow`, nessun URL `/p/` |
| AC10 install con Node ≠ 26 si ferma | met | Node 24: `EBADENGINE`, `Required: {"node":"26.x"}`; con Node 22 lo stesso per D5 (provato in fase di piano) |
| AC11 build con Node ≠ 26 si ferma | met | Node 24: exit 1, "Questo sito richiede Node 26" |
| AC12 dev con Node ≠ 26 si ferma | met | Node 24: `astro dev` exit 1 con lo stesso messaggio |
| AC13 Node 26 pulito | met | install e build exit 0, nessun `EBADENGINE`; il warning `allowScripts` è atteso (D15) |
| AC14 Vercel su Node 26.x | blocked | T6: serve push e PR, che Omar fa partire (D16); il log di build di Vercel lo vede solo lui |
| AC15 terminale nuovo su 26.x | met | `zsh -lic 'cd <repo> && node -v'` → `v26.13.1` |
| AC16 README con versione e attivazione | met | sezione "Requisiti": Node 26, `nvm install 26`, `nvm use` |

## Out of Scope Observations

- `improvement candidate`: ora che i prezzi stanno in `PRICES`, il JSON-LD potrebbe dichiarare i piani come `Offer` con prezzo e valuta. La spec li esclude (non-goal), quindi va proposto, non fatto. Evidenza: `src/seo.ts` dichiara solo `Organization`, `Person` e `WebSite`. → recorded in [[feature-improvement/sito/un-posto-solo]] e implementata su richiesta di Omar (vedi Deviations).

## Remaining Work

- T6 / AC14: quando Omar chiede push e PR, deploy di anteprima "Ready" e, nel log di build di Vercel, Node 26.x (lo conferma Omar). Dopo il merge, lo stesso sul deploy di `main`, più `curl` di `/sitemap-0.xml` (7 URL) e `/llms.txt` ("2.400 €").
