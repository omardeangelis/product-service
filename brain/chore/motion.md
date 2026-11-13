---
domain: _root
type: decision
links: ["[[index]]", "[[chore/motion-stack]]", "[[chore/product]]"]
created: 2026-11-12
updated: 2026-11-13
---

# Motion — decisioni del progetto

Queste decisioni vincono sui riferimenti di `design-engineering` (vedi la sua Precedence). I valori vivono come token in `src/styles/global.css` (`:root`, blocco "motion tokens"): nel codice si usano sempre i token, mai curve o durate scritte a mano.

## Personalità

Il sito è una **marketing page** che deve convincere CTO, agenzie di design e software house (vedi [[personas]]) a prenotare una call. Lo visitano poche volte e lo leggono più che usarlo, quindi ha **licenza creativa**: il motion può essere scenico e sorprendere, purché ogni momento sia scelto e dica qualcosa ("questo studio cura i dettagli").

- **Tono:** sicuro e scattante, mai morbido o fluttuante. Curve ripide con una coda lunga (`--ease-out-expo`): l'elemento risponde subito e si assesta con calma.
- **Delight:** sì, ma dosato. L'overshoot (`--ease-pop`) è una firma di brand riservata ai momenti rari: la CTA che compare sull'overlay dei casi studio e gli elementi "pop" delle demo in hero. Mai su controlli che si usano spesso (tab, segmented, accordion, bottoni).
- **Pezzi forti:** uno o due per pagina al massimo (in home: l'overlay circolare delle card dei casi studio e le demo animate del problema). Il resto della pagina li lascia emergere restando sobrio.
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
| `--dur-showpiece` | 800ms | overlay delle card caso studio |
| `--dur-data` | 1000ms | grafici e barre che si riempiono |
| `--stagger` | 100ms | ritardo tra fratelli nei reveal |

## Deviazioni volute dagli standard

- **Reveal a 700ms con 24px di spostamento** (lo standard dice 400–600ms e 10–16px): su questa pagina il reveal è parte dello spettacolo, e la curva expo copre quasi tutta la distanza nei primi frame, quindi non sembra lento.
- **Overlay dei casi studio a 800ms su hover:** è il pezzo forte della home; expo lo fa esplodere sotto il cursore e assestare con calma.
- **Floating CTA a 500ms:** viaggia per 90px dal fondo dello schermo.
- **Demo in hero a loop infinito** (`switch-on`, `task-up`, `merged-pop`, `pop`): ambient decorativo con durate diverse (3s, 4s) per non sincronizzarsi. Si fermano con `prefers-reduced-motion`.
- **`MotionDemos.astro`** usa i suoi token `--m-ease-*`: sono i valori reali del caso studio sul motion, mostrati come contenuto. Non vanno allineati ai token del sito.
- **Prototipi su `/p`** (`src/prototypes/`): non caricano `global.css` e definiscono il motion per conto loro (`MotionConfig` in ogni prototipo), perché imitano il prodotto del cliente e non questo sito.
- **Sezione clienti in home, hover `scale(1.06)` sulle schermate della parete** (lo standard dice 1–2%): le schermate sono decorative, piccole e inclinate in prospettiva, e un ingrandimento minore non si vede. Solo con `(hover: hover) and (pointer: fine)`, niente scala con `prefers-reduced-motion`. `src/components/Clienti.astro`.
- **Entrata della parete clienti a `--dur-showpiece` (800ms, `--ease-out-expo`, ritardo `--stagger`)**: la parete si alza da `translateY(80px) rotateX(64deg)` alla sua inclinazione; è il secondo pezzo forte della home, una volta per visita. Con reduced motion diventa una dissolvenza `--dur-swap` lineare.
- **Scatti ambient delle file della parete a `--dur-reveal` (700ms, `--ease-out-expo`)**: ogni scatto viaggia oltre 300px; periodi 2600/3200/2900 ms per non sincronizzarsi. Si fermano fuori schermo, con la tab nascosta, con il mouse sulla parete e con reduced motion.

## Accessibilità

- Con `prefers-reduced-motion: reduce` i reveal mantengono la dissolvenza ma perdono lo spostamento, i loop decorativi si fermano e lo smooth scroll è disattivato (è attivo solo sotto `no-preference`).

## Aperto

- I reveal partono con il contenuto nascosto anche senza JavaScript (`.reveal{opacity:0}` in CSS): se lo script non gira, le sezioni restano invisibili. Lo standard chiede "visibile di default" (lo script dovrebbe applicare lo stato nascosto).
- La home usa `.reveal` su molte sezioni: lo standard ne consiglia 2–4 per pagina. Da rivedere con un audit di `design-engineer` quando si lavora al copy.
- **La sezione clienti non usa `.reveal`:** arma l'entrata con uno script inline (`data-armed` / `data-in`), così senza JavaScript resta visibile. È il modello da estendere alle altre sezioni quando si risolve il punto sopra sui reveal invisibili senza JS.
