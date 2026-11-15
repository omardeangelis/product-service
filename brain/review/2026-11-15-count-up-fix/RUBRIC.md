---
domain: _unscoped
type: review-rubric
scope: standalone
spec: null
links:
  - "[[review/2026-11-15-count-up-fix/REPORT]]"
  - "[[review/2026-11-15-seo-geo-basi/REPORT]]"
created: 2026-11-15
updated: 2026-11-15
---

# Review Rubric: correzioni del count-up dei casi studio

## Change set under review

- **Scope:** standalone
- **Target:** working tree non committato sul branch `claude/unruffled-curran-5a2b8d`, limitato ai file toccati dalle correzioni della review [[review/2026-11-15-seo-geo-basi/REPORT|2026-11-15-seo-geo-basi]]
- **Compared:** `8b28ed1` (HEAD) → working tree
- **Files touched:** 2, dominio `_unscoped`
  - `src/pages/case-study/[slug].astro`
  - `src/content.config.ts`

## Routing rubric (review-classifier output)

```json
{
  "taskType": "bugfix",
  "secondaryType": "feature",
  "domainsTouched": ["_unscoped"],
  "adversarialVerifiers": {
    "count": 4,
    "passes": [
      {
        "id": "v1",
        "charter": "Count-up state machine correctness in src/pages/case-study/[slug].astro: the inline script (it runs before first paint and uses document.currentScript.previousElementSibling to find the grid, wraps content in aria-hidden/.sr-only spans, resets to data-from, sets data-armed) and the bundled module script that must hand off to it (data-cu-ready, MutationObserver on the .reveal card's .in class, setTimeout with the card's computed transition-delay, WAAPI keyframe-less clock and its progress read, try/catch and settle). Check every path that could leave a number stuck on its start value or showing a wrong final value: JS disabled, reduced motion, the bundled script failing or loading late compared with the load event, a card already .in at registration, a card that never gets .in, beforeprint during a count, a NaN or unparseable --dur-data or --ease-out-expo, a progress of null or 1 at the end, the inline script being moved or hoisted by Astro's build, and repeated .cu inside one <b>. Do not judge motion feel or visual layout.",
        "complexity": "high"
      },
      {
        "id": "v2",
        "charter": "Motion-craft pass: review the results-grid count-up against the design-engineer bar (.agents/skills/design-engineering/references/review.md, fallback .agents/agents/design-engineer.md) and the project motion decisions in brain/chore/motion.md and brain/chore/motion-stack.md. Scope: the count uses --dur-data and --ease-out-expo tokens with no hand-written curves or durations; the count lines up with the d1/d2 reveal stagger (count start vs. card entrance); behavior and visual result under prefers-reduced-motion; whether the count reads well with tabular-nums. Leave target size, wrapping, and accessible names to the UI pass.",
        "complexity": "medium"
      },
      {
        "id": "v3",
        "charter": "UI pass: run the ui-review skill (.agents/skills/ui-review/SKILL.md: seven classes, evidence gate, falsification pass; brain/chore/ui-review.md if present) on the case-study results grid. Check: the container-query font clamp(1.5rem,15cqi,2.6rem) with white-space:nowrap and container-type:inline-size on .metric-card, including overflow or clipping of the longest metric (e.g. '12,5% → 80%') at 280–375 px and 804–1060 px and across the three-column breakpoint; tabular-nums rendering on the site font; the accessible name and reading order after the aria-hidden + .sr-only split (one spoken copy only, final value, no duplicate or start value in the accessibility tree); the :global(.sr-only) rule scoped under .metric-card; no layout shift when the script arms the numbers. Measure in the browser; do not judge animation timing.",
        "complexity": "medium"
      },
      {
        "id": "v4",
        "charter": "Content schema and structured data: verify the isoDay z.preprocess in src/content.config.ts (a midnight-UTC YAML Date is converted back to YYYY-MM-DD; a non-midnight Date, a quoted non-ISO string, or an invalid calendar date fails the build instead of shifting the day; behavior with the installed zod version's z.iso.date(); published/updated stay optional and existing case studies still build). Verify the Article JSON-LD node in [slug].astro: headline strips only one trailing period; datePublished/dateModified are emitted only when set and as plain date strings; url, mainEntityOfPage and @id resolve against Astro.site; author/publisher @id match the nodes ldId emits elsewhere; Base receives ogType/jsonLd as expected and serializes the node safely (escaping of frontmatter text inside the script tag). Confirm npm run build passes.",
        "complexity": "medium"
      }
    ]
  },
  "taskComplexity": "medium",
  "reviewImpact": "critical",
  "humanInLoop": true,
  "nextStep": "Run 4 independent adversarial-verifier passes in parallel: v1 on the strongest model (Opus), v2–v4 on a balanced model. v2 runs under the design-engineering review bar and v3 under the ui-review skill with live browser measurement. Write RUBRIC.md and REPORT.md to brain/review/<slug>/ (case A, standalone). Because the schema change triggers escalation, the REPORT must end with a human checklist: run npm run build, open a case study with JS on, JS off, and reduced motion, check widths 280/375/804/1060, use a screen reader on the metrics, and validate the JSON-LD with a rich-results tester."
}
```

## Classifier rationale

Quattro concern separati, un passaggio ciascuno. v1 controlla la logica del count-up: il passaggio di mano tra lo script inline e quello in bundle e le sue vie di ripiego, dove stavano quasi tutti i problemi della review precedente; un errore lì lascia numeri sbagliati, quindi prende il modello più forte. v2 è il passaggio motion-craft, perché il count-up anima e il `CLAUDE.md` impone token e reduced motion. v3 è il passaggio UI: misura font a container query, `nowrap`, `tabular-nums` e la divisione `aria-hidden` / `.sr-only`. v4 copre lo schema dei casi studio e il JSON-LD costruito dal frontmatter. Impatto `critical` perché `src/content.config.ts` è lo schema validato dall'unico gate del progetto (`npm run build`); i campi nuovi sono facoltativi e additivi, quindi il rischio reale è moderato, ma senza test automatici serve una checklist umana.

## Overrides applied

None. Controlli sul rubric: charter singoli e senza sovrapposizioni; `critical` ⇒ `humanInLoop: true`; passaggi UI e motion-craft presenti per markup, CSS e codice di motion modificati; skill `ui-review` installata.

## Verification plan (derived)

| Pass | Charter | Complexity | Model tier |
|------|---------|------------|------------|
| v1 | Logica del count-up (stati e ripieghi) | high | strongest (Opus-class) |
| v2 | Motion-craft del count-up | medium | balanced (Sonnet-class) |
| v3 | UI statica della griglia risultati | medium | balanced (Sonnet-class) |
| v4 | Schema delle date e JSON-LD Article | medium | balanced (Sonnet-class) |

Rotte servite per i passaggi nel browser: build di produzione (`dist/`) su `http://localhost:4322` (`npm run preview`).
