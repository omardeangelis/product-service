---
domain: sito
type: concept
status: implemented
ingested: true
last_ingested: 2026-11-16
links: ["[[specs/sito/un-posto-solo/SPEC]]", "[[specs/sito/un-posto-solo/IMPLEMENTATION-NOTES]]", "[[domains/sito/flows/cambio-di-un-prezzo]]"]
created: 2026-11-16
updated: 2026-11-16
---

# Prezzi

## Definition

I prezzi dei piani di Spatalo, scritti una volta sola in `PRICES` (`src/config.ts`), in euro interi e IVA esclusa. Tutto ciò che il sito mostra o dichiara sui prezzi si legge da lì.

## Attributes

| Attributo | Oggi | Tipo |
|---|---|---|
| `partner.monthly` | 2.400 €/mese | base |
| `partner.quarterlyMonthly` | 2.200 €/mese, impegno di 3 mesi | base |
| `partner.quarterSaving` | 600 € = (mensile − trimestrale) × 3 | derivato |
| `partner.from` | 2.200 € ("da …" in home) = il minore dei due | derivato |
| `team.sprint` | 5.000 € a sprint di 2 settimane | base |
| `team.quarter` | 28.000 € a trimestre | base |
| `team.sprintsPerQuarter` | 6 | base |
| `team.quarterPerSprint` | 4.667 € = trimestre / 6, arrotondato | derivato |
| `team.quarterSaving` | 2.000 € = sprint × 6 − trimestre | derivato |
| `team.from` | 5.000 € ("da …" in home) = lo sprint singolo | derivato |
| `mvp.monthly` | 4.500 €/mese | base |

**Invarianti**

- Nessun altro file del repo contiene uno di questi importi scritto a mano.
- I derivati non si scrivono: si calcolano dai prezzi base.
- Formato: `formatEuro` dà "2.400" (separatore delle migliaia anche sotto 10.000); le pagine attaccano "€", `/llms.txt` mette uno spazio.
- Chi legge `PRICES`: home, `/pricing` (testo e JSON-LD: `Service` Partner, Team, MVP con `Offer` in EUR e `valueAddedTaxIncluded: false`) e `/llms.txt`. "A progetto" non ha prezzo e non ha `Offer`.

## Related flows

- [[domains/sito/flows/cambio-di-un-prezzo]]

## [Source: [[specs/sito/un-posto-solo/IMPLEMENTATION-NOTES]]]

- `src/config.ts` finisce anche nel bundle del client (tramite `src/data/confronto.ts`): `formatEuro` crea il formattatore dentro la funzione e `PRICES` viene scartato dal tree-shaking; nessun prezzo né `NumberFormat` nel JS.
- Unità nel JSON-LD: `MON` per i prezzi al mese, `QAN` per il trimestre Team, `unitText` "sprint di 2 settimane" per lo sprint, `billingDuration` di 3 mesi sul Partner trimestrale.
