---
domain: sito
type: feature-improvement
spec: un-posto-solo
links: ["[[specs/sito/un-posto-solo/SPEC]]", "[[index]]", "[[personas]]"]
created: 2026-11-16
updated: 2026-11-16
---

# Feature improvements — Un posto solo

Migliorie a quello che la spec [[specs/sito/un-posto-solo/SPEC]] ha consegnato: prezzi in `src/config.ts`, sitemap e versione di Node.

## Prezzi nei dati strutturati
- **Status:** planned
- **Proposed:** 2026-11-16, by implement-spec during la chiusura di un-posto-solo; accepted by the user, che ha chiesto di implementarla subito
- **Observed:** `src/seo.ts` dichiarava solo `Organization`, `Person` e `WebSite`; i piani e i prezzi erano soltanto nel testo di home, `/pricing` e `/llms.txt`.
- **Improvement:** `/pricing` dichiara nel JSON-LD i piani Partner, Team e MVP come `Service` dello studio, ognuno con le sue `Offer` in euro IVA esclusa, lette da `PRICES` come il resto del sito.
- **Why it matters:** CTO di startup o scale-up, Agenzia di design e Software house che chiedono ai motori AI quanto costa Spatalo ricevono prezzi letti da dati strutturati, sempre uguali a quelli della pagina.
- **Size:** small
- **Spec:** [[specs/sito/un-posto-solo/SPEC]]
