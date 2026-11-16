---
domain: sito
type: contract
ingested: true
last_ingested: 2026-11-16
links: ["[[domains/sito/sito]]", "[[specs/sito/un-posto-solo/SPEC]]"]
created: 2026-11-16
updated: 2026-11-16
---

# Sito — contract

## Owns

- I dati usati da più pagine, in `src/config.ts`: prezzi (`PRICES`, `formatEuro`), link, slot, garanzia, elenco dei prototipi.
- I dati strutturati condivisi e dei prezzi (`src/seo.ts`) e `/llms.txt`.
- La sitemap e la regola di esclusione.
- La versione di Node e i controlli che la impongono.

## Does Not Own

- Copy, layout e motion delle sezioni delle pagine (domini delle pagine, es. `home`).
- La protezione reale dei prototipi: `noindex` li tiene fuori dagli indici, non li nasconde.
- La lista delle pagine in `/llms.txt`, scritta a mano.

## Invariants

- Un prezzo è scritto in un posto solo; i derivati si calcolano.
- Nessuna pagina `noindex` nella sitemap.
- Nessun comando del sito gira con una major di Node diversa da `engines.node`.
- Output statico puro, nessun adapter né backend; il gate è `npm run build`.
