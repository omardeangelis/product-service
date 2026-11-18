---
domain: showcase
type: concept
status: implemented
ingested: true
last_ingested: 2026-11-18
links: ["[[specs/showcase/cta-articoli/SPEC]]", "[[specs/showcase/cta-articoli/IMPLEMENTATION-NOTES]]", "[[domains/showcase/flows/inviti-alla-call-in-una-release]]"]
created: 2026-11-18
updated: 2026-11-18
---

# Firma

## Definition

Il banner finale di ogni release (`src/components/showcase/Firma.astro`): Omar firma l'articolo in prima persona e propone una call di 30 minuti. Sostituisce i due bottoni che chiudevano le release in [[specs/showcase/log-articoli/SPEC]] AC13.

## Attributes

| Attributo | Valore | Fonte |
|---|---|---|
| Foto | `SITE.founderPhoto` (`/firma/omar.jpg`, 192×192) in un cerchio da 48 px, `alt=""` | `src/config.ts` |
| Nome | `SITE.founder` («Omar De Angelis») | `src/config.ts` |
| Sottotitolo | «Product Engineer · 10 anni di release in produzione» | componente |
| Paragrafo | «In questi articoli e su LinkedIn racconto le release dei prodotti dei miei clienti. Vuoi lo stesso ritmo di rilasci per i tuoi prodotti? Prenota una chiamata di 30 minuti: guardiamo insieme il prodotto e ti dico se posso aiutarti.» | componente |
| Bottone | «Prenota una call di 30 min», `.btn-primary`, link Cal in una scheda nuova | `src/config.ts` |
| Link secondario | «Leggi il caso studio completo» se la release ha un caso studio pubblicato, altrimenti «Altri articoli» → `/showcase/` | dati della release |
| Entrata | solo `opacity`, `--ease-out`, `--dur-swap`, al 15% in vista, una volta (keyframe `firma-fade`) | `[[chore/motion]]` |

**Invarianti**

- La foto è decorativa: il nome si legge una volta sola con lo screen reader.
- Visibile e cliccabile anche senza JavaScript.
- Il pulsante flottante non la copre mai: sparisce quando la Firma è in vista.

## Related flows

- [[domains/showcase/flows/inviti-alla-call-in-una-release]]

## [Source: [[specs/showcase/cta-articoli/IMPLEMENTATION-NOTES]]]

- La foto viene da un talk di Omar al Talent Garden: ritaglio di 160 px sul viso dall'originale 800×800, portato a 192×192. L'originale non è nel repo.
- La keyframe si chiama `firma-fade` (non `cta-fade`) per non avere due keyframe globali con lo stesso nome.
