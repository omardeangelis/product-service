---
domain: showcase
type: concept
status: implemented
ingested: true
last_ingested: 2026-11-18
links: ["[[specs/showcase/cta-articoli/SPEC]]", "[[specs/showcase/cta-articoli/IMPLEMENTATION-NOTES]]", "[[specs/showcase/cta-articoli/REPORT]]", "[[domains/showcase/flows/scelta-del-banner-in-build]]", "[[domains/showcase/flows/inviti-alla-call-in-una-release]]", "[[domains/sito/concepts/prezzi]]"]
created: 2026-11-18
updated: 2026-11-18
---

# Banner intermedio

## Definition

L'unico banner a metà del corpo di una release (`src/components/showcase/BannerPiano.astro`, `aside.cta-strip`): un'offerta concreta, Partner o Team, con il bottone «Prenota →» verso Cal. Piano e posizione si decidono in build (`src/data/cta-articoli.ts`).

## Attributes

| Attributo | Valore |
|---|---|
| Piano | `partner` o `team`, assegnato da `assegnaPiani` |
| Testo Partner | «**Da 2.200 € al mese.** Pausa e disdetta libere, il codice è tuo dal primo giorno.» (prezzo: `partner.from`) |
| Testo Team | «**Un team di senior a 5.000 € per sprint:** costruisci più veloce dei tuoi competitor, valida uno sprint per volta.» (prezzo: `team.sprint`) |
| Regione | `complementary` con nome «Piano Partner» o «Piano Team» |
| Posizione | prima del titolo di sezione ⌊N/2⌋+1; nessun banner con N < 2 |
| Titolo di sezione | `<h2` a inizio riga, fuori da ogni contenitore |
| Bottone | «Prenota →», link Cal in una scheda nuova; alla pressione `scale(0.97)` in `--dur-press` `--ease-press`, senza scala con reduced motion |
| Entrata | `.reveal`: 24 px di salita e opacità, `--ease-out-expo`, `--dur-reveal`; con reduced motion solo dissolvenza |

**Invarianti**

- Al massimo uno per release; mai nei casi studio, nel feed RSS o in `/llms.txt`.
- Con slot Partner liberi, turni Partner/Team dalla release più vecchia; senza slot, sempre Team. Una release nuova non cambia i turni delle vecchie.
- I prezzi vengono da `PRICES`: cambiano col prezzo, al deploy.
- Gli stili dei link del corpo (accent, sottolineato) valgono solo per paragrafi ed elenchi, mai per il bottone.

## Related flows

- [[domains/showcase/flows/scelta-del-banner-in-build]]
- [[domains/showcase/flows/inviti-alla-call-in-una-release]]

## [Source: [[specs/showcase/cta-articoli/IMPLEMENTATION-NOTES]]]

- Oggi le 6 release prendono P, T, P, T, P, T dalla più vecchia; tutte hanno almeno 3 titoli di sezione.
- Il prototipo contava i turni dalla release più recente e inseriva il banner con JavaScript; in produzione si conta dalla più vecchia e il banner è nell'HTML della build.

## [Source: [[specs/showcase/cta-articoli/REPORT]]]

- La definizione di titolo di sezione (fuori dai contenitori, mai in un attributo) e l'errore di build sugli `<h2` annidati vengono dalla review del 2026-11-18.
- Resta aperto il pareggio tra release con la stessa data: [[tech-debt/showcase/cta-articoli]].
