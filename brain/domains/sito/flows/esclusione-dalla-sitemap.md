---
domain: sito
type: flow
status: implemented
ingested: true
last_ingested: 2026-11-16
links:
  - "[[specs/sito/un-posto-solo/SPEC]]"
  - "[[specs/sito/un-posto-solo/IMPLEMENTATION-NOTES]]"
  - "[[domains/sito/concepts/indicizzabilita-della-pagina]]"
created: 2026-11-16
updated: 2026-11-16
---

# Esclusione dalla sitemap

A fine build, `@astrojs/sitemap` chiede per ogni pagina se entra nella sitemap. Decide il robots `noindex` dell'HTML già scritto, nient'altro.

```mermaid
flowchart TD
  A[1. Build: le pagine sono scritte in dist/] --> B{2. Esiste dist/percorso/index.html?}
  B -- no --> X[Errore: la build si ferma e nomina l'URL]
  B -- sì --> C{3. Meta robots con noindex?}
  C -- sì --> D[4a. Pagina fuori dalla sitemap]
  C -- no --> E[4b. Pagina nella sitemap]
  D --> F[5. sitemap-0.xml]
  E --> F
```

1. `npm run build` scrive ogni pagina in `dist/<percorso>/index.html`; poi `@astrojs/sitemap` chiama il filtro di `astro.config.mjs` per ogni URL.
2. Il filtro cerca l'HTML della pagina. Se non c'è (per esempio con `build.format: 'file'`), lancia un errore e la build esce con 1, invece di produrre in silenzio una sitemap sbagliata.
3. Legge i tag `<meta>` e controlla se ce n'è uno `name="robots"` con `noindex` nel `content`.
4. a. Con `noindex` la pagina resta fuori: `/benvenuto`, ogni prototipo pubblicato in `/p/*`, qualunque nuova pagina privata (AC6, AC8, AC9). b. Senza, entra (AC8).
5. Con le pagine di oggi la sitemap ha 7 URL: home, `/pricing/`, `/termini/` e i 4 casi studio (AC7).

## [Source: [[specs/sito/un-posto-solo/IMPLEMENTATION-NOTES]]]

- Prima l'esclusione era una regex scritta a mano; verificato che una nuova sotto-pagina `noindex` di `/benvenuto` ci finiva dentro, e ora no.
- Il filtro di `@astrojs/sitemap@3.7.5` è sincrono e vuole un booleano stretto: un valore diverso fa sparire la sitemap senza errori, un'eccezione ferma la build.
