---
domain: _unscoped
type: review-rubric
scope: standalone
spec: null
links:
  - "[[review/2026-11-15-seo-geo-basi/REPORT]]"
created: 2026-11-15
updated: 2026-11-15
---

# Review Rubric: basi SEO/GEO e count-up dei casi studio

## Change set under review

- **Scope:** standalone
- **Target:** working tree non committato sul branch `claude/unruffled-curran-5a2b8d`
- **Compared:** `8b28ed1` (HEAD) → working tree
- **Files touched:** 12 (8 modificati, 4 nuovi) across domains: `_unscoped` (layout condiviso, template caso studio, config di build)
  - `package.json`, `package-lock.json`, `astro.config.mjs`, `public/robots.txt`, `public/og.png`
  - `src/seo.ts`, `src/layouts/Base.astro`, `src/pages/case-study/[slug].astro`, `src/content.config.ts`, `src/pages/llms.txt.ts`
  - `README.md`, `brain/chore/motion.md`

## Routing rubric (review-classifier output)

```json
{
  "taskType": "feature",
  "secondaryType": "config",
  "domainsTouched": ["_unscoped"],
  "adversarialVerifiers": {
    "count": 8,
    "passes": [
      {
        "id": "v1",
        "charter": "Raw-HTML injection sink: verify the new `<script is:inline type=\"application/ld+json\" set:html={structuredData}>` in src/layouts/Base.astro and the `ldJson` serializer in src/seo.ts — confirm no value reaching the graph (SITE fields from src/config.ts, case-study frontmatter title/excerpt, constructed URLs) can terminate the script element early, open an HTML comment/script-data-escaped state, or produce invalid JSON after the `<` escaping, and that this is the only raw-HTML sink the change introduces. Serialization/sink safety only, not schema.org semantics.",
        "complexity": "high"
      },
      {
        "id": "v2",
        "charter": "Crawler exposure of non-public routes: verify `/benvenuto`, every `/p` route (the `/p` index and `/p/<slug>/[...path]` injected by src/prototypes/integration.mjs, published or not) and draft case studies stay out of the generated sitemap (the `fuoriDallaSitemap` filter in astro.config.mjs, incl. trailing-slash and prefix edge cases like `/pricing`), out of `/llms.txt` and out of JSON-LD; that public/robots.txt neither leaks them nor blocks crawlers from reading their noindex meta; and that the sitemap URL in robots.txt and `<link rel=\"sitemap\">` matches the file actually emitted to dist/. Discoverability only, not content accuracy.",
        "complexity": "medium"
      },
      {
        "id": "v3",
        "charter": "Build gate and dependency: verify `npm run build` passes and output stays pure static with no adapter; that `@astrojs/sitemap` ^3.7.5 is compatible with astro ^7.3.5 (peer range, integration hooks, ordering after `react()` and `prototipi()`); that the lockfile's transitive additions (`sitemap`, `@types/node`, `@types/sax`, `undici-types`) are expected and add nothing to client bundles; and that the new optional `published`/`updated` (`z.coerce.date()`) fields in src/content.config.ts keep every existing case-study frontmatter valid. Build/dependency/schema mechanics only, not what is emitted.",
        "complexity": "medium"
      },
      {
        "id": "v4",
        "charter": "Structured-data and social-metadata correctness: verify the JSON-LD graph is valid schema.org — shared Organization/Person/WebSite nodes and the case-study Article, every `@id` reference resolving within the page graph, headline/description/url/mainEntityOfPage consistent with the canonical URL, datePublished/dateModified emitted as correct YYYY-MM-DD with no timezone shift and omitted when absent — and that Open Graph/Twitter tags are well-formed: absolute og:image, og:type `article` only on case studies and `website` elsewhere, og:url equal to canonical, og:site_name, og:locale, twitter:card; and that public/og.png is actually 1200x630 as declared with an accurate alt. Metadata semantics only, not escaping or exposure.",
        "complexity": "medium"
      },
      {
        "id": "v5",
        "charter": "Commercial accuracy of `/llms.txt`: verify every hardcoded price, plan name, billing cadence, slot count, guarantee wording and offer claim in src/pages/llms.txt.ts matches its live source (src/pages/pricing.astro, src/pages/index.astro, src/config.ts, the terms page, brain/chore/product.md); that internal links (`/`, `/pricing/`, `/termini/`, `/case-study/<id>/`) point to pages that are built and in the site's trailing-slash form; that contact links come from src/config.ts (single-source-of-truth convention); and that the endpoint is emitted as a static dist/llms.txt. Content accuracy only, not route exposure.",
        "complexity": "medium"
      },
      {
        "id": "v6",
        "charter": "Count-up progressive-enhancement logic (functional) in src/pages/case-study/[slug].astro: verify the static HTML carries the final `to` value for no-JS readers and crawlers; that the inline arming script targets exactly the metrics grid via `document.currentScript.previousElementSibling` in the built, compressHTML output (including pages with zero or multiple `.cu`); that an armed number can never remain stuck on `from` (bundled script failing or late, IntersectionObserver never firing at threshold 0.6, WAAPI unavailable, `ms('--dur-data')` parse yielding NaN/0, the null-progress branch); and that the count always lands exactly on `to`. Correctness of displayed numbers only, not motion feel.",
        "complexity": "medium"
      },
      {
        "id": "v7",
        "charter": "Motion-craft pass: review the case-study count-up against the design-engineer review bar (.agents/skills/design-engineering/references/review.md, fallback .agents/agents/design-engineer.md), with brain/chore/motion.md and its tokens taking precedence — duration/easing sourced only from `--dur-data` / `--ease-out-expo` through the WAAPI clock (no hand-written values), reduced motion showing the final number with no counting, the pre-first-paint reset producing no visible flash of the final value (motion.md records this depends on `.reveal`), timing of the count against the `.reveal` card entrance and its d1/d2 stagger, digit-width jitter while counting, and per-frame textContent update cost. Motion only.",
        "complexity": "medium"
      },
      {
        "id": "v8",
        "charter": "UI pass: verify the case-study results grid (`.metric-card` markup in src/pages/case-study/[slug].astro) against the `ui-review` skill's bar and probes (.agents/skills/ui-review/SKILL.md, its seven classes, evidence gate and falsification pass) — now that the final number renders statically (and under reduced motion / before arming), measure width and wrapping of the `<b>` metric (pre + number + post) down to the project minimum width, and what assistive tech reads for an armed metric before it animates. Static rendering only; count animation belongs to the motion-craft pass. Case A, no spec criteria.",
        "complexity": "low"
      }
    ]
  },
  "taskComplexity": "medium",
  "reviewImpact": "critical",
  "humanInLoop": true,
  "nextStep": "Spawn 8 adversarial-verifier passes in parallel with clean contexts: v1 on the strongest model (Opus-class), v2–v7 on a balanced model, v8 on a fast model; v7 loads the design-engineering review bar, v8 loads the ui-review skill. Write RUBRIC.md and REPORT.md under brain/review/<slug>/ (standalone, case A). Because impact is critical, REPORT.md must end with an ordered human checklist before commit: run `npm run build`, grep dist/sitemap-*.xml for `/p` and `/benvenuto`, view-source the JSON-LD and run it through a rich-results validator, check every price in dist/llms.txt against the pricing page, open og.png, and load a case study with JS off, JS on and reduced motion on."
}
```

## Classifier rationale

Impatto `critical` perché il cambiamento tocca tre superfici sempre sensibili: un sink di HTML grezzo (`set:html`) nel layout condiviso da tutte le pagine, la config di build con una dipendenza nuova (la build è l'unico gate del progetto e valida anche lo schema dei casi studio), e prezzi scritti a mano pubblicati ai motori AI in una terza copia. L'input del JSON-LD è scritto nel repo, quindi il rischio reale di injection è basso, ma il sink è su ogni pagina e prende un passaggio dedicato al modello più forte. `/p/*` sono prototipi per i clienti protetti solo da un link non indovinabile, quindi il filtro della sitemap decide se il lavoro dei clienti finisce negli indici pubblici. Il count-up riceve tre passaggi distinti (logica, motion, UI statica) perché la riga di markup cambia sia il contenuto statico sia il punto di partenza dell'animazione, e `brain/chore/motion.md` registra già una fragilità nota.

## Overrides applied

None. Controlli sul rubric: charter singoli e senza sovrapposizioni; `critical` ⇒ `humanInLoop: true`; superfici sensibili già escalate dal classificatore; UI pass e motion-craft pass presenti per markup e codice di motion modificati; skill `ui-review` installata.

## Verification plan (derived)

| Pass | Charter | Complexity | Model tier |
|------|---------|------------|------------|
| v1 | Sink HTML grezzo del JSON-LD | high | strongest (Opus-class) |
| v2 | Esposizione ai crawler delle rotte non pubbliche | medium | balanced (Sonnet-class) |
| v3 | Gate di build, dipendenza e schema | medium | balanced (Sonnet-class) |
| v4 | Correttezza di JSON-LD e metadati social | medium | balanced (Sonnet-class) |
| v5 | Accuratezza commerciale di `/llms.txt` | medium | balanced (Sonnet-class) |
| v6 | Logica del count-up (numeri mostrati) | medium | balanced (Sonnet-class) |
| v7 | Motion-craft del count-up | medium | balanced (Sonnet-class) |
| v8 | UI statica della griglia risultati | low | fast (Haiku-class) |

Rotte servite per i passaggi nel browser: build di produzione (`dist/`) su `http://localhost:4322` (`npm run preview`).
