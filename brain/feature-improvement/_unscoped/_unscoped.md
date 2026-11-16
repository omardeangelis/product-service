---
domain: _unscoped
type: feature-improvement
spec: null
links: ["[[index]]", "[[review/2026-11-15-seo-geo-basi/REPORT]]", "[[personas]]", "[[specs/sito/un-posto-solo/SPEC]]"]
created: 2026-11-15
updated: 2026-11-16
---

# Feature improvements — fuori da una spec

Migliorie a parti del sito che nessuna spec copre ancora: SEO/GEO, metadati, build.

## Prezzi in un posto solo
- **Status:** done
- **Proposed:** 2026-11-15, by adversarial-review during la review delle basi SEO/GEO e del count-up (verifier v5); accepted by the user
- **Observed:** i prezzi dei piani sono scritti a mano in tre file: `src/pages/pricing.astro`, `src/pages/index.astro` e `src/pages/llms.txt.ts` (righe 35-38). Il README avvisa che vanno cambiati in tutti e tre.
- **Improvement:** una costante dei prezzi in `src/config.ts`, letta da home, pricing e `/llms.txt`, come già succede per garanzia e slot.
- **Why it matters:** Omar cambia un prezzo in un punto solo; CTO di startup o scale-up, Agenzia di design e Software house non trovano mai prezzi diversi tra sito e risposte dei motori AI.
- **Size:** small
- **Spec:** [[specs/sito/un-posto-solo/SPEC]]

## og:image per caso studio
- **Status:** open
- **Proposed:** 2026-11-15, by adversarial-review during la review delle basi SEO/GEO e del count-up (verifier v4); accepted by the user
- **Observed:** tutte le pagine usano la stessa anteprima generica `public/og.png` (`src/layouts/Base.astro:51`), e l'`Article` JSON-LD dei casi studio non ha `image`.
- **Improvement:** un'anteprima social per ogni caso studio con solo il titolo e una descrizione breve, senza numeri, così l'immagine non va rifatta quando cambiano i risultati; usata anche come `image` dell'`Article`.
- **Why it matters:** chi riceve il link di un caso studio (CTO di startup o scale-up, Agenzia di design, Software house) capisce già dall'anteprima di cosa parla, prima di cliccare.
- **Size:** medium
- **Spec:** none

## Esclusioni della sitemap dai flag di pagina
- **Status:** done
- **Proposed:** 2026-11-15, by adversarial-review during la review delle basi SEO/GEO e del count-up (verifier v2); accepted by the user
- **Observed:** `/benvenuto` e `/p/*` sono esclusi dalla sitemap con una regex scritta a mano (`astro.config.mjs:8`); una nuova pagina `noindex` va aggiunta lì a mano.
- **Improvement:** derivare le esclusioni dai flag che le pagine hanno già (`noindex` di `Base.astro`, `visible` dei prototipi in `src/config.ts`), così nessuna pagina privata finisce nella sitemap per dimenticanza.
- **Why it matters:** i prototipi dei clienti e le pagine post-vendita restano fuori dagli indici pubblici anche quando se ne aggiungono di nuovi.
- **Size:** small
- **Spec:** [[specs/sito/un-posto-solo/SPEC]]

## Versione di Node fissata
- **Status:** done
- **Proposed:** 2026-11-15, by adversarial-review during la review delle basi SEO/GEO e del count-up (verifier v3); accepted by the user
- **Observed:** `sitemap@10.0.0` (dipendenza di `@astrojs/sitemap`) dichiara `engines: node >=22.22.1`; il repo non ha `engines` né `.nvmrc`, e il Node locale (22.17.1) è sotto la soglia.
- **Improvement:** fissare Node 26, l'ultima LTS (scelta di Omar), con `engines` in `package.json` e un `.nvmrc`, e allineare la versione dell'host di deploy.
- **Why it matters:** build uguali in locale e in produzione, senza warning EBADENGINE né sorprese al prossimo aggiornamento di dipendenze.
- **Size:** small
- **Spec:** [[specs/sito/un-posto-solo/SPEC]]

## Serializer JSON-LD più rigido
- **Status:** open
- **Proposed:** 2026-11-15, by adversarial-review during la review delle basi SEO/GEO e del count-up (verifier v1); accepted by the user
- **Observed:** `ldJson` in `src/seo.ts:47-48` escapa solo `<`: basta per `application/ld+json` in HTML, ma non se il serializer venisse riusato in uno `<script>` JavaScript o in XHTML. Il progetto non ha test che proteggano l'escape.
- **Improvement:** escapare anche `>`, `&`, U+2028 e U+2029, e aggiungere un autocontrollo in build (es. che `ldJson([{ x: '</script><!--' }])` non contenga `<`).
- **Why it matters:** l'escape resta sicuro anche dopo modifiche future al serializer o riusi in altri contesti.
- **Size:** small
- **Spec:** none
