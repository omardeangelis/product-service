---
domain: sito
type: concept
status: implemented
ingested: true
last_ingested: 2026-11-16
links: ["[[specs/sito/un-posto-solo/SPEC]]", "[[specs/sito/un-posto-solo/IMPLEMENTATION-NOTES]]", "[[domains/sito/flows/controllo-della-versione-di-node]]"]
created: 2026-11-16
updated: 2026-11-16
---

# Versione di Node

## Definition

La major di Node con cui il sito si installa, si costruisce e gira, in locale e su Vercel: oggi 26 (ultima LTS, scelta di Omar). Va bene qualunque 26.x.

## Attributes

| Attributo | Valore | Ruolo |
|---|---|---|
| `engines.node` in `package.json` | `"26.x"` | unica fonte di verità; Vercel la legge |
| `.nvmrc` | `26` | `nvm use` nella cartella; deve concordare con `engines` |
| `.npmrc` | `engine-strict=true` | `npm install` fallisce con un'altra major |
| controllo in `astro.config.mjs` | confronto di major | ferma build, dev e preview |
| alias `default` di nvm sul Mac di Omar | `26` | terminali nuovi già su Node 26 |

**Invarianti**

- Install, build, dev e preview non girano mai su una major diversa da quella di `engines.node`.
- `.nvmrc` mancante o discorde ferma la build.
- Locale e produzione usano la stessa major. Su Vercel confermato nel log di build da Omar (AC14, 2026-11-16).

## Related flows

- [[domains/sito/flows/controllo-della-versione-di-node]]

## [Source: [[specs/sito/un-posto-solo/IMPLEMENTATION-NOTES]]]

- Il Node di sistema `/usr/local/bin/node` (22.17.1) resta installato e non viene toccato.
- Il lockfile ha solo il campo `engines` della radice in più.
