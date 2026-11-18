---
domain: showcase
type: review-rubric
scope: spec
spec: cta-articoli
links:
  - "[[specs/showcase/cta-articoli/REPORT]]"
  - "[[specs/showcase/cta-articoli/SPEC]]"
created: 2026-11-18
updated: 2026-11-18
---

# Review Rubric: CTA negli articoli di release

## Change set under review

- **Scope:** spec implementation (case B)
- **Target:** `main`, pre-push gate
- **Compared:** `ff67dee` (origin/main) → `e36e3bc` (HEAD)
- **Files touched:** 18 code/content files + brain docs, across domains: showcase, shared layout/config/styles, tooling (`.claude`)

## Routing rubric (review-classifier output)

```json
{
  "taskType": "feature",
  "secondaryType": "ui",
  "domainsTouched": ["showcase", "sito (shared layout/config/global styles)", "tooling (.claude)"],
  "adversarialVerifiers": {
    "count": 7,
    "passes": [
      { "id": "v1", "charter": "Build-time HTML splitting and injection: dividiAlCentro/contaTitoli in src/data/cta-articoli.ts and the set:html composition in src/pages/showcase/[slug].astro put the banner before H2 floor(N/2)+1 (Jev: before «Pulizia e sinonimi»), skip releases with <2 H2s, never split inside a tag or nested container, no whitespace artifacts (AC7), same body HTML as <Content /> apart from the banner; set:html takes only author-owned rendered Markdown; the __ASTRO_IMAGE_ guard fails the build where it should. Run npm run build and check dist of all 6 releases.", "complexity": "high" },
      { "id": "v2", "charter": "Pricing and plan assignment from config: assegnaPiani meets AC5 (Partner on the oldest, skipped turns, all Team without free slots, new releases don't reshuffle old ones); banner prices from src/config.ts render «2.200 €» / «5.000 €» (AC4); founder name and Cal link never hardcoded (AC1).", "complexity": "medium" },
      { "id": "v3", "charter": "Progressive enhancement and client scripts: inline arming script, IntersectionObserver entrances in src/scripts/articolo.ts and floating-CTA logic in src/layouts/Base.astro. Without JS / IO both banners visible and links work (AC10); data-in set once at 15%; floating CTA hides on Firma and reappears above, correct on reload at the bottom (AC12); pages outside releases unchanged; no framework JS in .astro pages.", "complexity": "medium" },
      { "id": "v4", "charter": "Repo hygiene, config and secrets: .claude/launch.json absolute local Node path, .claude/agent-memory notes, public/firma/omar.jpg size and EXIF/GPS metadata; decide whether each committed file belongs in a pushed repo.", "complexity": "low" },
      { "id": "v5", "charter": "Release Markdown copy edits (6 files): frontmatter validates, body links resolve and are well-formed, no relative-path images, H2 count changes don't move the banner or shift the alternation unexpectedly.", "complexity": "low" },
      { "id": "v6", "charter": "UI pass: ui-review skill on real release routes: AC1, AC2, AC3, AC6, AC8, AC9 (280–1440 px at 1x and 1.25x, wrap under 600 px), AC12 geometry (floating CTA never covers the Firma button); target size, contrast, focus visibility.", "complexity": "medium" },
      { "id": "v7", "charter": "Motion-craft pass: design-engineer review bar and brain/chore/motion.md on cta-rise/cta-fade/firma-fade keyframes, .cta-go press scale, reduced-motion rule for .float-cta, against the Motion brief and AC11.", "complexity": "medium" }
    ]
  },
  "taskComplexity": "medium",
  "reviewImpact": "critical",
  "humanInLoop": true,
  "nextStep": "Run v1–v7 in parallel (v1 strongest; v2, v3, v6, v7 balanced; v4, v5 fast). v6/v7 need the dev server on Node 26. REPORT.md must end with a human checklist before push."
}
```

Charters are abbreviated here; the classifier's full wording was passed verbatim to each verifier.

## Classifier rationale

Critical because the change touches three generic risk surfaces, each with its own pass: raw HTML spliced into the rendered article with `set:html` (author-owned Markdown, so low injection risk; the larger risk is a bad split on the shared page), customer-facing prices and the Partner/Team rotation read from config, and repo hygiene of the committed `.claude/launch.json` with an absolute local path. UI and motion-craft passes are required because the diff adds markup, ARIA, styles, keyframes and a press scale. No showcase domain contract, tech-debt page or `brain/chore/ui-review.md` exists, so v6 uses the skill's default bar.

## Overrides applied

None.

## Verification plan (derived)

| Pass | Charter | Complexity | Model tier |
|------|---------|------------|------------|
| v1 | HTML splitting and injection | high | strongest (inherit) |
| v2 | Pricing and plan assignment | medium | balanced (sonnet) |
| v3 | Progressive enhancement, client scripts | medium | balanced (sonnet) |
| v4 | Repo hygiene, config, secrets | low | fast (haiku) |
| v5 | Release Markdown copy edits | low | fast (haiku) |
| v6 | UI pass | medium | balanced (sonnet) |
| v7 | Motion-craft pass | medium | balanced (sonnet) |
