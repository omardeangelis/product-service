---
domain: sito
type: concept
status: implemented
ingested: true
last_ingested: 2026-11-16
links: ["[[specs/sito/un-posto-solo/SPEC]]", "[[specs/sito/un-posto-solo/IMPLEMENTATION-NOTES]]", "[[domains/sito/flows/esclusione-dalla-sitemap]]"]
created: 2026-11-16
updated: 2026-11-16
---

# Indicizzabilità della pagina

## Definition

Se una pagina del sito può finire negli indici pubblici. L'unico segnale è il meta robots `noindex` che la pagina emette: decide sia il comportamento dei motori di ricerca sia la presenza nella sitemap.

## Attributes

| Attributo | Valori | Dove |
|---|---|---|
| prop `noindex` di `Base.astro` | `false` (default) / `true` | pagine operative, es. `/benvenuto` |
| robots dei prototipi | sempre `noindex, nofollow` | `src/layouts/Prototype.astro` |
| `visible` di un prototipo | `false`: non costruito in produzione; `true`: costruito, ma `noindex` | `src/config.ts` |
| presenza in sitemap | derivata dal robots dell'HTML scritto | filtro in `astro.config.mjs` |

**Invarianti**

- Nessun URL della sitemap porta a una pagina `noindex`.
- Una pagina privata nuova resta fuori dalla sitemap con il solo flag `noindex`, senza toccare la config.
- Il filtro presume `build.format: 'directory'`; con un altro formato la build si ferma.
- `noindex` non protegge la pagina: chi ha il link la apre comunque.

## Related flows

- [[domains/sito/flows/esclusione-dalla-sitemap]]

## [Source: [[specs/sito/un-posto-solo/SPEC]]]

- Sostituisce la regex di esclusioni scritta a mano. Con le pagine di oggi la sitemap ha gli stessi 7 URL di prima.
