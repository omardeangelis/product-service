# AGENTS.md

Guida per gli agenti AI che lavorano in questo repo: sito personale statico in Astro (vedi `README.md` per struttura e comandi).

## Knowledge base e flusso di lavoro

La knowledge base e la suite di skill spec-driven vivono in `brain/`: leggi `brain/AGENTS.md` prima di toccarla. Il lavoro sulle feature segue `create-spec` → `create-plan` → `implement-spec` → `docs-maintenance`; l'esplorazione UI passa da `prototype` (solo su invocazione esplicita). La policy di review e i percorsi del progetto stanno in `brain/brain.config.json`.

## Linee guida del progetto

### Gate

- **Build:** `npm run build` deve passare. Valida anche lo schema dei casi studio (`src/content.config.ts`): un campo mancante nel frontmatter fa fallire la build.
- Non ci sono test, lint o typecheck configurati.

### Convenzioni

- Output statico puro, nessun adapter né backend.
- React serve solo ai prototipi in `src/prototypes/` (rotte `/p/<slug>`): le pagine `.astro` restano senza JS di framework.
- Link (Cal, email, LinkedIn), slot, garanzia ed elenco dei prototipi stanno in un posto solo: `src/config.ts`.
- Design token e stili condivisi in `src/styles/global.css`; gli stili di sezione vivono nei singoli `.astro`.
- Motion: usa sempre i token `--ease-*` / `--dur-*` / `--stagger` di `src/styles/global.css`, mai curve o durate scritte a mano. Personalità e deviazioni in `brain/chore/motion.md`, stack in `brain/chore/motion-stack.md`. Ogni animazione rispetta `prefers-reduced-motion`.
- Chi deve convincere il sito: `brain/personas.md`; cosa vende e con che tono: `brain/chore/product.md`.
