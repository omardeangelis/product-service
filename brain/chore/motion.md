---
domain: _root
type: decision
links: ["[[index]]", "[[chore/motion-stack]]", "[[chore/product]]", "[[specs/home/confronto-ticket/SPEC]]"]
created: 2026-11-12
updated: 2026-11-18
---

# Motion — decisioni del progetto

Queste decisioni vincono sui riferimenti di `design-engineering` (vedi la sua Precedence). I valori vivono come token in `src/styles/global.css` (`:root`, blocco "motion tokens"): nel codice si usano sempre i token, mai curve o durate scritte a mano.

## Personalità

Il sito è una **marketing page** che deve convincere CTO, agenzie di design e software house (vedi [[personas]]) a prenotare una call. Lo visitano poche volte e lo leggono più che usarlo, quindi ha **licenza creativa**: il motion può essere scenico e sorprendere, purché ogni momento sia scelto e dica qualcosa ("questo studio cura i dettagli").

- **Tono:** sicuro e scattante, mai morbido o fluttuante. Curve ripide con una coda lunga (`--ease-out-expo`): l'elemento risponde subito e si assesta con calma.
- **Delight:** sì, ma dosato. L'overshoot (`--ease-pop`) è una firma di brand riservata ai momenti rari: gli elementi "pop" delle demo in hero e la spunta del primo deploy sulla board del confronto (una volta per giro). Mai su controlli che si usano spesso (tab, segmented, accordion, bottoni).
- **Pezzi forti:** uno o due per pagina al massimo. Il resto della pagina li lascia emergere restando sobrio. La home ne ha tre, per scelta (vedi Deviazioni): le demo animate del problema, l'entrata della parete clienti e la board del confronto.
- **I controlli restano rapidi** anche qui: tab, segmented control, FAQ e bottoni seguono i tempi da UI (`--dur-ui`, `--dur-press`).

## Token

| Token | Valore | Quando |
| --- | --- | --- |
| `--ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | default per entrate, uscite, hover lift |
| `--ease-out-expo` | `cubic-bezier(0.19, 1, 0.22, 1)` | reveal allo scroll, barre dati, overlay, floating CTA |
| `--ease-press` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | `:active` |
| `--ease-in-out` | `cubic-bezier(0.645, 0.045, 0.355, 1)` | morph sullo schermo (espansione tab), rotazioni, loop ambient |
| `--ease-pop` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | overshoot di brand, solo delight |
| `--dur-press` / `--dur-hover` | 150ms | pressione; colore e piccoli lift |
| `--dur-ui` | 250ms | stati dei controlli |
| `--dur-swap` | 400ms | cambio contenuto in un pannello, CTA che entra |
| `--dur-reveal` | 700ms | reveal allo scroll |
| `--dur-showpiece` | 800ms | pezzi forti: entrata della parete clienti |
| `--dur-data` | 1000ms | grafici e barre che si riempiono |
| `--stagger` | 100ms | ritardo tra fratelli nei reveal |

## Deviazioni volute dagli standard

- **Reveal a 700ms con 24px di spostamento** (lo standard dice 400–600ms e 10–16px): su questa pagina il reveal è parte dello spettacolo, e la curva expo copre quasi tutta la distanza nei primi frame, quindi non sembra lento. Vale anche per il banner Partner/Team nel corpo delle release (`BannerPiano.astro`).
- **Floating CTA a 500ms:** viaggia per 90px dal fondo dello schermo.
- **Demo in hero a loop infinito** (`switch-on`, `task-up`, `merged-pop`, `pop`): ambient decorativo con durate diverse (3s, 4s) per non sincronizzarsi. Si fermano con `prefers-reduced-motion`.
- **`MotionDemos.astro`** usa i suoi token `--m-ease-*`: sono i valori reali del caso studio sul motion, mostrati come contenuto. Non vanno allineati ai token del sito.
- **Prototipi su `/p`** (`src/prototypes/`): non caricano `global.css` e definiscono il motion per conto loro (`MotionConfig` in ogni prototipo), perché imitano il prodotto del cliente e non questo sito.
- **Sezione clienti in home, hover `scale(1.06)` sulle schermate della parete** (lo standard dice 1–2%): le schermate sono decorative, piccole e inclinate in prospettiva, e un ingrandimento minore non si vede. Solo con `(hover: hover) and (pointer: fine)`, niente scala con `prefers-reduced-motion`. `src/components/Clienti.astro`.
- **Schede degli articoli (sezione 04 e `/showcase/`), hover `scale(1.03)` sulla copertina con schermata o video** (lo standard dice 1–2%): si ingrandisce l'immagine dentro la copertina 16:10 con `overflow: hidden`, non la scheda, che non si gonfia né si sposta; a 1,02 su una copertina di 320 px lo zoom non si vede. `--dur-ui`, `--ease-out`, origine in alto a sinistra come `object-position`. Solo con `(hover: hover) and (pointer: fine)`, niente scala con `prefers-reduced-motion`. `src/components/showcase/Copertina.astro`.
- **Entrata della parete clienti a `--dur-showpiece` (800ms, `--ease-out-expo`, ritardo `--stagger`)**: la parete si alza da `translateY(80px) rotateX(64deg)` alla sua inclinazione; è uno dei pezzi forti della home, una volta per visita. Con reduced motion diventa una dissolvenza `--dur-swap` lineare.
- **Scatti ambient delle file della parete a `--dur-reveal` (700ms, `--ease-out-expo`)**: ogni scatto viaggia oltre 300px; periodi 2600/3200/2900 ms per non sincronizzarsi. Si fermano fuori schermo, con la tab nascosta, con il mouse sulla parete e con reduced motion.
- **Board del confronto in home** (`src/components/Confronto.astro`, `src/scripts/confronto.ts`): tre sprint raccontati una volta per visita, a 150 ms per giorno lavorativo lineari (4,5 s; l'ultimo movimento finisce entro 5 s, WCAG 2.2.2, senza controllo di pausa). Spostamenti FLIP a `--dur-swap` (400ms) con `--ease-in-out`: la board è grande e Omar ha scelto il movimento più lento (2026-11-14). Due spostamenti dello stesso ticket a 2 giorni di distanza (300ms) si sovrappongono; il FLIP è interrompibile e il secondo riparte dalla posizione visibile del primo. Stati che cambiano con lo scambio piccolo (8px + blur, `--dur-ui`). È un pezzo forte oltre il limite della personalità: eccezione scelta da Omar il 2026-11-14 ([[specs/home/confronto-ticket/SPEC]]). Con reduced motion la board mostra subito lo stato finale.
- **Spunta del primo deploy a `--ease-pop` / `--dur-swap`**, una volta per giro, con un ritardo di 0.6 × lo spostamento (240ms: arriva quando il ticket atterra). Le altre spunte usano `--dur-ui` / `--ease-out`.
- **Spunta della board da `scale(0.5)`** (lo standard chiede di partire da 0.9 o più): è un glifo di 18 px (14 px sotto 760 px), e da 0.9 la crescita non si vedrebbe.

## Accessibilità

- Con `prefers-reduced-motion: reduce` i reveal mantengono la dissolvenza ma perdono lo spostamento, i loop decorativi si fermano e lo smooth scroll è disattivato (è attivo solo sotto `no-preference`).

## Aperto

- I reveal partono con il contenuto nascosto anche senza JavaScript (`.reveal{opacity:0}` in CSS): se lo script non gira, le sezioni restano invisibili. Lo standard chiede "visibile di default" (lo script dovrebbe applicare lo stato nascosto).
- La home usa `.reveal` su molte sezioni: lo standard ne consiglia 2–4 per pagina. Da rivedere con un audit di `design-engineer` quando si lavora al copy.
- **La sezione clienti non usa `.reveal`:** arma l'entrata con uno script inline (`data-armed` / `data-in`), così senza JavaScript resta visibile. È il modello da estendere alle altre sezioni quando si risolve il punto sopra sui reveal invisibili senza JS.
- **Sezione confronto:** l'intestazione è visibile senza JavaScript e uno script inline le aggiunge `.reveal`; la board è nello stato finale nell'HTML e uno script inline la riporta al giorno 0 prima del primo paint (`data-armed`). È il secondo esempio del modello, dopo la parete clienti.
- **Sezione 04 («La prova», `src/components/Showcase.astro`):** lo script inline subito dopo la sezione rivela i controlli e mette `data-armed`; l'IntersectionObserver del modulo mette `data-in` una volta sola (15%). Intestazione e schede salgono di 24px, controlli e piede solo in dissolvenza (`--dur-reveal`, `--ease-out-expo`, ritardi `--stagger` × 0–4); con reduced motion dissolvenza `--dur-swap` lineare. Senza JavaScript resta tutto visibile. È il terzo esempio del modello. Il primo filtro scelto «assesta» la fila (`data-settled`): le schede che ricompaiono fanno solo lo swap (`[data-swap]`, 8px, `--dur-ui`, `--ease-out`), che in `/showcase/` va sui mesi.
- **Pagina release (`src/pages/showcase/[slug].astro`):** uno script inline, primo figlio di `<main data-articolo>`, mette `data-armed`; `src/scripts/articolo.ts` mette `data-in` al 15% (un observer, scollegato dopo l'ultimo elemento). Il banner Partner/Team sale di 24px (`--dur-reveal`, `--ease-out-expo`; reduced motion: dissolvenza `--dur-swap` lineare), la Firma fa solo la dissolvenza (`--dur-swap`, `--ease-out`, uguale con reduced motion). Gli stati nascosti stanno in `@media screen`. Senza JavaScript resta tutto visibile: è il quarto esempio del modello. Sulle release il pulsante flottante si toglie mentre la Firma (`[data-nasconde-float]`) è in vista, con le sue transizioni di sempre. Nascosto, il pulsante flottante ha `visibility:hidden` e `pointer-events:none` (non si clicca né si raggiunge con Tab), con `visibility` che scatta a dissolvenza finita; con reduced motion resta al suo posto e fa solo la dissolvenza `--dur-swap` lineare, come `.reveal` (review 2026-11-18).
- **Count-up dei risultati nei casi studio** (`src/pages/case-study/[slug].astro`): l'HTML porta il numero finale (`data-to`), così crawler e motori AI leggono il dato giusto; uno script inline subito dopo la griglia lo riporta a `data-from` e lo arma (`data-armed`), con reduced motion resta finale. Armando, il testo finale passa a una copia `.sr-only` e quello che conta diventa `aria-hidden`: gli screen reader leggono sempre il valore vero. Il conteggio parte quando il reveal aggiunge `.in` alla card, dopo il suo `transition-delay` (stagger d1/d2), e usa `--dur-data` e `--ease-out-expo` (un'animazione WAAPI senza keyframe fa da orologio con la curva del token). Rete di sicurezza: se al `load` il count-up non si è registrato (`data-cu-ready`), prima di stampare, o se `animate()` lancia, i numeri tornano al valore finale. Tra il parsing della griglia e lo script inline può passare un frame col numero finale: oggi non si vede perché le card sono `.reveal` (opacità 0). Se i reveal diventano visibili senza JS (punto sopra), il count-up va armato in un altro modo.
- **Proposta di `design-engineer`, da decidere (Omar):** riscrivere la regola dei pezzi forti come "al massimo un pezzo forte attivo per sezione visibile", al posto del conteggio per pagina.
