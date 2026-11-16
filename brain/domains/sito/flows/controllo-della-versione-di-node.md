---
domain: sito
type: flow
status: implemented
ingested: true
last_ingested: 2026-11-16
links:
  - "[[specs/sito/un-posto-solo/SPEC]]"
  - "[[specs/sito/un-posto-solo/IMPLEMENTATION-NOTES]]"
  - "[[domains/sito/concepts/versione-di-node]]"
created: 2026-11-16
updated: 2026-11-16
---

# Controllo della versione di Node

Ogni comando che installa o fa girare il sito si ferma se Node non è della major 26.

```mermaid
flowchart TD
  A[1. Terminale nel repo: nvm porta Node 26] --> B{2. npm install}
  B -- major diversa --> X1[EBADENGINE: install fermato]
  B -- 26 --> C[3. build, dev o preview caricano astro.config.mjs]
  C --> D{4. Node in uso = engines.node?}
  D -- no --> X2[Errore: richiede Node 26, esegui nvm use]
  D -- sì --> E{5. .nvmrc presente e concorde?}
  E -- no --> X3[Errore: .nvmrc mancante o da allineare]
  E -- sì --> F[6. Il comando prosegue]
  F --> G[7. Vercel: build con Node 26.x da engines]
```

1. Un terminale nuovo sul Mac di Omar parte già su Node 26 (alias `default` di nvm, AC15); in un altro progetto basta `nvm use`.
2. `npm install` con `engine-strict=true` (`.npmrc`) si ferma con `EBADENGINE` e `Required: {"node":"26.x"}` su una major diversa (AC10).
3. `npm run build`, `dev` e `preview` caricano tutti `astro.config.mjs`.
4. La config confronta la major di `process.versions.node` con `engines.node` di `package.json`, unica fonte; se non coincidono la build si ferma col messaggio che chiede Node 26 (AC11, AC12).
5. Controlla poi che `.nvmrc` esista e chieda la stessa major.
6. Con Node 26 install e build finiscono senza errori né `EBADENGINE` (AC13).
7. Vercel legge `engines.node: "26.x"`. Omar ha confermato Node 26.x nel log di build (AC14, 2026-11-16).

## [Source: [[specs/sito/un-posto-solo/IMPLEMENTATION-NOTES]]]

- La shell dei tool degli agenti non carica nvm e resta sul Node di sistema (22.17.1): i comandi di verifica mettono `~/.nvm/versions/node/v26.13.1/bin` in testa al `PATH`.
- Con Node < 22.12 si vede prima l'errore di Astro sulla sua soglia minima, non quello del sito.
- `astro preview` lanciato da una shell d'agente scrive il messaggio solo in `.astro/preview.log`.
