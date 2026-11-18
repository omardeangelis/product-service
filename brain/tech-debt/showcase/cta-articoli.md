---
domain: showcase
type: tech-debt
spec: cta-articoli
links: ["[[specs/showcase/cta-articoli/SPEC]]", "[[specs/showcase/cta-articoli/REPORT]]", "[[domains/showcase/flows/scelta-del-banner-in-build]]"]
created: 2026-11-18
updated: 2026-11-18
---

# Tech debt: CTA negli articoli di release

## [2026-11-18] From review [[specs/showcase/cta-articoli/REPORT]]

- **[NIT]** Release con la stessa data: il pareggio si risolve per id, quindi una nuova release pubblicata lo stesso giorno di altre può cambiare il piano (Partner/Team) di quelle dello stesso giorno. — `src/data/articoli.ts:83`
  - Why it persists: oggi le date sono tutte diverse; il limite è solo documentato nel commento in testa a `src/data/cta-articoli.ts`.
  - Fix-or-evidence needed: un pareggio che non dipenda dall'ordine alfabetico (es. ordine di pubblicazione), oppure accettare il limite.
