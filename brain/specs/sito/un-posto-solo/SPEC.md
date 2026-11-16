---
domain: sito
type: spec
status: implemented
links: ["[[feature-improvement/_unscoped/_unscoped]]", "[[review/2026-11-15-seo-geo-basi/REPORT]]", "[[personas]]", "[[specs/sito/sito-specs]]"]
created: 2026-11-15
updated: 2026-11-16
---

# Spec: Un posto solo — prezzi, sitemap e versione di Node

---

## User input

> 1, 3, 4.

Risposte alle domande di chiarimento:

> Una spec unica
>
> Calcolati dai prezzi
>
> Errore ma vorrei aggiornare anche la mia versione locale

Le tre evolutive prese in carico, da [[feature-improvement/_unscoped/_unscoped]]: **Prezzi in un posto solo**, **Esclusioni della sitemap dai flag di pagina**, **Versione di Node fissata**.

---

## Context

Tre parti del sito dipendono oggi da un passaggio fatto a mano che è facile dimenticare:

- **Prezzi.** Sono scritti a mano in tre posti (home, `/pricing`, `/llms.txt`), insieme agli importi che se ne ricavano (risparmi, prezzo a sprint, "da …"). Se Omar dimentica una delle copie, il sito e le risposte dei motori AI mostrano prezzi diversi.
- **Sitemap.** Le pagine da escludere sono elencate a mano. Una nuova pagina privata (post-vendita o prototipo di un cliente) finisce nella sitemap se nessuno si ricorda di aggiungerla all'elenco.
- **Node.** La versione non è fissata. Il Node locale (22.17.1) è sotto la soglia richiesta da una dipendenza, e locale e Vercel possono usare versioni diverse senza che nessuno se ne accorga.

Chi ci guadagna direttamente è Omar, che mantiene il sito da solo. Indirettamente ne beneficiano le persone a cui il sito si rivolge (`brain/personas.md`): **CTO di startup o scale-up**, **Agenzia di design** e **Software house**. Trovano sempre gli stessi prezzi tra pagine e motori AI, e i prototipi dei clienti non finiscono mai negli indici pubblici.

---

## Non-Goals

- Nessun cambiamento visibile: prezzi, testi, layout e formattazione degli importi restano quelli di oggi.
- Le evolutive **og:image per caso studio** e **Serializer JSON-LD più rigido** restano `open` per una spec futura.
- Niente prezzi nei dati strutturati (JSON-LD `Offer`). Aggiunti dopo l'implementazione su richiesta di Omar: vedi il Decision Log.
- La lista delle pagine in `/llms.txt` resta scritta a mano.
- Nessuna protezione reale dei prototipi: restano raggiungibili da chi ha il link. Questa spec riguarda solo la sitemap.
- Nessun aggiornamento delle dipendenze oltre a quanto serve per girare su Node 26.
- Non si disinstalla il Node di sistema in `/usr/local/bin`.

---

## Acceptance Criteria

### Prezzi

1. I prezzi base (Partner mensile, Partner trimestrale al mese, Team a sprint, Team a trimestre, MVP al mese) sono scritti in un solo punto del repo. Nessun altro file contiene uno di questi importi scritto a mano.
2. Con i prezzi di oggi, home, `/pricing` e `/llms.txt` mostrano gli stessi importi con la stessa formattazione di prima ("2.400€" nelle pagine, "2.400 €" in `/llms.txt`).
3. Gli importi derivati sono calcolati dai prezzi base e arrotondati all'euro: il risparmio del Partner trimestrale (oggi 600€), il prezzo a sprint del trimestre Team (oggi 4.667€), il risparmio del trimestre Team (oggi 2.000€) e i "da …" della home (oggi 2.200€/mese e 5.000€/sprint).
4. Se si cambia un solo prezzo base in quel punto (es. Partner mensile da 2.400 a 2.500) e si rilancia la build, home, `/pricing` e `/llms.txt` mostrano il nuovo prezzo e i derivati ricalcolati (risparmio trimestrale 900€), senza toccare altri file.
5. README e commenti nel codice non chiedono più di aggiornare i prezzi in più file e indicano dove stanno.

### Sitemap

6. Nessun URL della sitemap porta a una pagina che dichiara robots `noindex`.
7. Con le pagine di oggi, la sitemap contiene esattamente gli stessi URL di prima: home, `/pricing/`, `/termini/` e i casi studio pubblicati.
8. Una nuova pagina `noindex` (es. una sotto-pagina di `/benvenuto`) resta fuori dalla sitemap senza modificare nessun altro file. Una nuova pagina senza `noindex` ci entra.
9. Un prototipo pubblicato (`visible: true` in `src/config.ts`) non compare nella sitemap.

### Node

10. `npm install` lanciato con una versione di Node diversa dalla 26 si ferma con un errore che indica la versione richiesta.
11. `npm run build` lanciato con una versione di Node diversa dalla 26 si ferma con un errore che indica la versione richiesta.
12. `npm run dev` lanciato con una versione di Node diversa dalla 26 si ferma con un errore che indica la versione richiesta.
13. Con Node 26, `npm install` e `npm run build` finiscono senza errori e senza warning `EBADENGINE`.
14. Il deploy di `main` su Vercel usa Node 26.x, come si vede dal log di build.
15. Sul computer di Omar, un nuovo terminale aperto nel repo usa Node 26.x (`node -v`).
16. Il README indica la versione di Node richiesta e come attivarla.

---

## Constraints

- Il gate resta `npm run build`, che valida anche lo schema dei casi studio.
- Output statico puro, nessun adapter né backend. Le pagine `.astro` restano senza JS di framework.
- I dati del sito che servono in più pagine stanno in un posto solo, `src/config.ts`, come oggi link, slot, garanzia e prototipi (convenzione del repo in `AGENTS.md`).
- Deploy su Vercel: ogni push su `main` fa un deploy.
- Node 26 è l'ultima LTS, scelta di Omar. È richiesta la major 26 e va bene qualunque 26.x.

---

## Technical Notes

- **Prezzi oggi:**
  - `src/pages/index.astro:297,301,324,325,340,364-366,378`;
  - `src/pages/pricing.astro:30,33,34,76,79,80,115`;
  - `src/pages/llms.txt.ts:35-37`.
  - Le pagine scrivono "2.400€", `/llms.txt` scrive "2.400 €".
  - Il README (riga 64) e il commento in testa a `llms.txt.ts` documentano le tre copie.
- **Derivati oggi:**
  - 600€ = (2.400 − 2.200) × 3;
  - 4.667€ = 28.000 / 6, arrotondato;
  - 2.000€ = 5.000 × 6 − 28.000;
  - "da 2.200€/mese" è il Partner trimestrale;
  - "da 5.000€/sprint" è il Team a sprint.
- **Sitemap oggi:**
  - l'elenco delle esclusioni è una regex in `astro.config.mjs:7-8`;
  - `/benvenuto` è `noindex` tramite la prop `noindex` di `src/layouts/Base.astro`;
  - `src/layouts/Prototype.astro:17` emette sempre `noindex, nofollow`;
  - i prototipi con `visible: false` non vengono costruiti in produzione;
  - secondo la review del 2026-11-15, `dist/sitemap-0.xml` contiene home, 4 casi studio, `/pricing/` e `/termini/`.
- **Node oggi:**
  - `sitemap@10.0.0` (dipendenza di `@astrojs/sitemap`) richiede Node ≥ 22.22.1 e Astro ≥ 22.12.0;
  - il repo non ha `engines` né `.nvmrc`.
- **Node sul Mac di Omar:**
  - quello attivo è `/usr/local/bin/node` v22.17.1, dall'installer ufficiale;
  - nvm è installato, con le versioni 22.22.0, 24.11–24.14 e 26.13.1 (installata il 2026-11-14);
  - `nvm current` restituisce `system` e l'alias `default` punta a 20.10.0, che non è installata. Oggi quindi nvm ricade sul Node di sistema.

---

## Open Questions

| # | Question | Affects | Owner | Status |
|---|----------|---------|-------|--------|
| 1 | Vercel offre già Node 26.x tra le versioni del progetto? | AC 10–15 | Omar | Closed (2026-11-15): sì. Node 26 LTS è GA sulle build di Vercel e `engines.node: "26.x"` lo attiva ([changelog](https://vercel.com/changelog/node-js-26-lts-is-now-generally-available-on-vercel)) |
| 2 | In home il Team è "da 5.000€/sprint", ma col trimestre costa 4.667€ a sprint. Per il Partner invece il "da" usa il prezzo più basso (2.200€). Il "da" del Team deve diventare 4.667€? | AC 2–3 | Omar | Closed (2026-11-15): resta 5.000€, il prezzo dello sprint singolo |

---

## Decision Log

| Decision | Rationale |
|----------|-----------|
| Una spec unica per le evolutive 1, 3 e 4 | Scelta di Omar: sono tre lavori piccoli con lo stesso scopo, togliere un passaggio fatto a mano. |
| Gli importi derivati sono calcolati dai prezzi base, arrotondati all'euro | Scelta di Omar: non possono andare in contrasto con i prezzi. L'arrotondamento all'euro riproduce i 4.667€ di oggi. |
| Con Node diverso dalla 26, install e build si fermano con un errore | Scelta di Omar: l'ambiente sbagliato si scopre subito e locale e Vercel non possono divergere. |
| Anche il Node locale di Omar passa alla 26 | Richiesta di Omar in risposta alla domanda sulla versione di Node. |
| L'unico segnale per l'esclusione dalla sitemap è il robots `noindex` della pagina | Copre sia `/benvenuto` sia i prototipi pubblicati, che sono sempre `noindex`. Chi aggiunge una pagina privata deve ricordarsi un solo flag, che serve comunque. |
| Il blocco con Node diverso dalla 26 vale anche per `npm run dev` (AC 12) | Scelta di Omar in fase di piano: in locale il sito non gira mai su un Node diverso da quello di produzione. |
| Node 26 diventa la versione predefinita di nvm per tutti i terminali del Mac di Omar | Scelta di Omar in fase di piano: è il modo più semplice e sistema l'alias `default` rotto. Per altri progetti basta `nvm use`. |
| Il "da" del Team in home resta 5.000€/sprint | Scelta di Omar in fase di piano: la spec non cambia il copy, e il "da" del Team è il prezzo dello sprint singolo. |
| Dopo l'implementazione, `/pricing` dichiara piani e prezzi nel JSON-LD (`Service` con `Offer`, da `PRICES`) | Richiesta di Omar alla chiusura (2026-11-16), che toglie il non-goal sui prezzi nei dati strutturati. Testo delle pagine invariato; dettagli in [[specs/sito/un-posto-solo/IMPLEMENTATION-NOTES]]. |
| L'og:image per caso studio resta fuori | Omar ha scelto le evolutive 1, 3 e 4. L'og:image è stata riformulata (titolo e descrizione breve, niente numeri) e resta `open`. |
