# Personal site

Sito personale di Omar De Angelis — **Freelance Product Engineer**. Servizio prodottizzato in abbonamento: landing statica, prenotazione call via Cal, casi studio come contenuto strutturato.

Costruito con [Astro](https://astro.build) — output statico puro, nessun backend.

## Comandi

```sh
npm install       # prima volta
npm run dev       # dev server su http://localhost:4321
npm run build     # build statica in dist/
npm run preview   # anteprima della build
```

## Struttura

| Percorso | Contenuto |
|---|---|
| `src/pages/index.astro` | Homepage: hero, problema, modello ad abbonamento, confronto, vetrina casi studio, prezzi, FAQ |
| `src/pages/pricing.astro` | Pagina prezzi dedicata: piani Solo/Team, MVP e a progetto, garanzia, FAQ |
| `src/pages/case-study/[slug].astro` | Template caso studio: problema → soluzione → risultati, con funnel chart animato, count-up e prima/dopo |
| `src/content/case-studies/*.md` | I casi studio: tutto il contenuto è nel frontmatter, validato dallo schema in `src/content.config.ts` |
| `src/layouts/Base.astro` | Layout condiviso: head/SEO, nav, footer, CTA flottante, scroll reveal |
| `src/config.ts` | Link Cal, email, LinkedIn — un posto solo |
| `src/styles/global.css` | Design tokens e stili condivisi; gli stili di sezione vivono nei singoli `.astro` |
| `prototype/` | I prototipi HTML statici originali, tenuti come reference di design |

## Aggiungere un caso studio

1. Copia un file esistente in `src/content/case-studies/` e rinominalo (il nome file diventa lo slug dell'URL).
2. Compila il frontmatter — lo schema è validato in build, i campi mancanti fanno fallire `npm run build` con un errore chiaro.
3. La card in homepage (sezione "Real shipped code") si genera da sola dal blocco `home:`, ordinata per `order:`.

## Note

- Tutti i numeri, i casi studio, le metriche e le testimonianze sono **placeholder** da sostituire con dati reali.
- Le CTA "Prenota una call" puntano al link Cal definito in `src/config.ts`.
- Pagamenti (Stripe) volutamente non integrati: la conversione avviene in call, il payment link si manda dopo.
