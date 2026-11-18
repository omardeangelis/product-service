---
domain: showcase
type: contract
ingested: true
last_ingested: 2026-11-18
links: ["[[domains/showcase/showcase]]", "[[specs/showcase/cta-articoli/SPEC]]", "[[domains/sito/sito-contract]]"]
created: 2026-11-18
updated: 2026-11-18
---

# Showcase — contract

## Owns

- Le pagine delle release (`/showcase/<slug>/`, `src/pages/showcase/[slug].astro`) e quello che sta nel loro corpo.
- Gli inviti alla call nelle release: la Firma in fondo e il banner intermedio Partner/Team (`src/components/showcase/`, `src/data/cta-articoli.ts`).
- Il comportamento del pulsante flottante sulle pagine delle release (si nasconde sulla Firma).

## Does Not Own

- Prezzi, slot, nome e foto del founder, link Cal: li legge da `src/config.ts`, che appartiene al dominio [[domains/sito/sito]].
- Il pulsante flottante e la nav fuori dalle release, i banner finali dei casi studio.
- Le misure delle conversioni: il sito non ha analytics.
- Il testo degli articoli: lo scrive Omar nel Markdown di `src/content/releases/`.

## Invariants

- Al massimo un banner intermedio per release; nessun banner nei casi studio, nel feed RSS o in `/llms.txt`.
- Banner e punto d'inserimento si decidono in build, nell'HTML: senza JavaScript entrambi gli inviti sono visibili e i link funzionano.
- Pubblicare una release più recente non cambia il piano delle release già online (a slot invariati).
- Un `<h2` annidato o dentro un attributo fa fallire la build; un'immagine relativa nel corpo di una release anche.
- Il pulsante flottante nascosto non è cliccabile né raggiungibile con Tab, con o senza reduced motion.
