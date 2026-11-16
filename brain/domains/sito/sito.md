---
domain: sito
type: index
links: ["[[index]]", "[[specs/sito/sito-specs]]", "[[domains/sito/sito-contract]]"]
created: 2026-11-16
updated: 2026-11-16
---

# Sito — domain map

Parti trasversali del sito: dati condivisi tra pagine, indicizzazione e ambiente di build. Confini in [[domains/sito/sito-contract]].

## Flows

- [[domains/sito/flows/cambio-di-un-prezzo]] — un prezzo cambiato in `PRICES` arriva a home, `/pricing` (anche JSON-LD) e `/llms.txt`
- [[domains/sito/flows/esclusione-dalla-sitemap]] — la sitemap tiene fuori ogni pagina `noindex`
- [[domains/sito/flows/controllo-della-versione-di-node]] — install, build, dev e preview si fermano fuori da Node 26

## Concepts

- [[domains/sito/concepts/prezzi]] — prezzi base, derivati e formato
- [[domains/sito/concepts/indicizzabilita-della-pagina]] — il flag `noindex` come unico segnale
- [[domains/sito/concepts/versione-di-node]] — `engines`, `.nvmrc`, `engine-strict`, Vercel

## Decisions

_empty_

## Sources

- [[specs/sito/un-posto-solo/SPEC]] (ingested 2026-11-16)
