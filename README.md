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
| `src/config.ts` | Link Cal, email, LinkedIn, slot, garanzia e l'elenco dei prototipi per i clienti — un posto solo |
| `src/prototypes/<slug>/` | Un prototipo React per un cliente, servito su `/p/<slug>` |
| `src/prototypes/integration.mjs` | Genera una rotta per ogni prototipo ammesso: tutti in locale, solo i pubblicati in build |
| `src/prototypes/Elenco.astro` | Elenco di tutti i prototipi su `/p`, con stato e link da mandare: esiste solo in locale |
| `src/prototypes/Pagine.astro` | Le pagine interne di un prototipo nell'elenco su `/p`, una riga cliccabile per rotta |
| `src/prototypes/Shell.tsx` | Router con base `/p/<slug>` e ritorno in cima a ogni cambio pagina, condiviso dai prototipi |
| `src/layouts/Prototype.astro` | Layout dei prototipi: niente nav, footer e stili del sito, sempre `noindex` |
| `src/styles/global.css` | Design tokens e stili condivisi; gli stili di sezione vivono nei singoli `.astro` |
| `prototype/` | I prototipi HTML statici originali, tenuti come reference di design |

## Aggiungere un caso studio

1. Copia un file esistente in `src/content/case-studies/` e rinominalo (il nome file diventa lo slug dell'URL).
2. Compila il frontmatter — lo schema è validato in build, i campi mancanti fanno fallire `npm run build` con un errore chiaro.
3. La card in homepage (sezione "Real shipped code") si genera da sola dal blocco `home:`, ordinata per `order:`.

## Aggiungere un prototipo per un cliente

I prototipi sono app React (con Motion e wouter) montate solo lato client, su `/p/<slug>`.

1. Copia `src/prototypes/esempio-4k9x2/` in una cartella nuova. Il nome della cartella è lo slug dell'URL: aggiungi un suffisso casuale (`acme-7f3k2`) così il link non si indovina.
2. Aggiungi la voce in `PROTOTYPES` in `src/config.ts` con lo stesso slug e `visible: false`.
3. In `pages` elenca le pagine interne, una per ogni `<Route>` del prototipo: `''` è la prima pagina, `'dettaglio'` diventa `/p/<slug>/dettaglio`. Senza questa voce il refresh su quella pagina dà 404 in produzione.
4. Sviluppa con `npm run dev`: in locale tutti i prototipi sono raggiungibili, quelli non pubblicati hanno un'etichetta rossa in basso. Su `localhost:4321/p` c'è l'elenco di tutti.
5. Per mandarlo al cliente metti `visible: true` e pusha. Il link da mandare lo copi dall'elenco su `/p`. Per ritirarlo rimetti `false` e pusha.

Ogni prototipo ha una pagina sua che importa solo il proprio codice: chi riceve un link non vede né il codice né il CSS né gli slug degli altri. I prototipi non pubblicati non finiscono in `dist/`, e nemmeno l'elenco su `/p`.

Non è una protezione vera: chiunque abbia il link lo apre. Per qualcosa di riservato serve un login.

## Note

- Tutti i numeri, i casi studio, le metriche e le testimonianze sono **placeholder** da sostituire con dati reali.
- Le CTA "Prenota una call" puntano al link Cal definito in `src/config.ts`.
- Pagamenti (Stripe) volutamente non integrati: la conversione avviene in call, il payment link si manda dopo.
