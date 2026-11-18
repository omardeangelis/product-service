---
domain: showcase
type: review
scope: spec
spec: cta-articoli
review_target: "spec implementation (main, pre-push)"
base_ref: ff67dee
head_ref: e36e3bc (fix round on top: see «Round 2026-11-18 — fixes»)
verdict: do-not-ship
review_impact: critical
human_in_loop: true
links:
  - "[[specs/showcase/cta-articoli/RUBRIC]]"
  - "[[specs/showcase/cta-articoli/SPEC]]"
  - "[[specs/showcase/cta-articoli/PLAN]]"
  - "[[specs/showcase/cta-articoli/IMPLEMENTATION-NOTES]]"
ingested: false
last_ingested: null
created: 2026-11-18
updated: 2026-11-18
---

# Review Report: CTA negli articoli di release (pre-push)

## Verdict

**DO NOT SHIP** · impact: critical

Strongest objection: under `prefers-reduced-motion: reduce` the rule at `src/styles/global.css:145` drops the `translateY(90px)` that parks the hidden floating CTA off-screen. The pill stays at `bottom:20px` with `opacity:0`, still clickable and focusable, and covers the Firma button (measured: `elementFromPoint` on the button returns `.float-cta` at 375 px). AC12 is unmet in that mode, and the invisible link sits over the bottom of every page under reduced motion. Two more items hold the push: the 1–100 vs 0–100 score contradiction in the CV/AI Report article, and the absolute local path in `.claude/launch.json`.

## Coverage

- Rubric passes run: 7/7 (v1 strongest/inherit; v2, v3, v6, v7 sonnet; v4, v5 haiku)
- Passes skipped or failed: none
- UI pass: ran on the release routes `/showcase/jev-model-grader/`, `/showcase/skill-suggerite/`, `/showcase/ui-sweep/`, `/showcase/beautiful-ui/` of the main checkout's dev server (reached at `127.0.0.1:4321`, headless Chromium). Mobile Safari not run; axe not available.
- v3 ran its browser checks on a static copy of `dist/` (dev server unreachable from its sandbox); v7 judged by code reading, confirmed by v6's measurement.

## Findings

| Severity | Concern (verifier) | Location | Problem | Required fix / evidence | Durable? |
|----------|--------------------|----------|---------|-------------------------|----------|
| MAJOR | v6 UI + v7 motion | `src/styles/global.css:145` | Reduced motion: hidden `.float-cta` stays on-screen at opacity 0, intercepts clicks and Tab over the Firma button (AC12 unmet), and over page bottoms site-wide | `.float-cta:not(.show){pointer-events:none;visibility:hidden}` with the visibility flip delayed by `--dur-swap` on hide, or keep `translateY(90px)` in the reduce rule. Re-measure with `elementFromPoint` at 375 px under reduce | no |
| BLOCKER | v5 release copy | `src/content/releases/cv-anonimo-ai-report.md:38` vs `:10` | Body says score «da 1 a 100», cover alt (and previous body) say «da 0 a 100» | Owner confirms the real range; align body and alt | no |
| MAJOR | v4 hygiene | `.claude/launch.json` (commit e36e3bc) | Hardcodes `/Users/omardeangelis/.nvm/versions/node/v26.13.1/bin/node`: publishes a local path and breaks on any other machine | Untrack and ignore it, or use a portable launcher (npm scripts / `sh -lc`) | no |
| MINOR | v5 release copy | `src/content/releases/jev-model-grader.md:12` | Cover metric «0,48 s» no longer has a sentence in the body with its conditions | Restore the conditions sentence or change the metric | no |
| MINOR | v7 motion | `src/styles/global.css:145` | Reduce rule swaps the pill's opacity transition to `--dur-swap linear` (existing tokens, same as `.reveal`), while the brief says no new curve/duration | Accept and record in `brain/chore/motion.md`, or keep the base opacity transition | yes |
| MINOR | v1 splitting | `src/data/cta-articoli.ts:17-31` | `/<h2(?=[\s>])/` also matches `<h2` inside an alt attribute: banner injected inside the attribute, markup corrupted silently (fixture-proven; no current release triggers it) | Anchor to block starts or parse with rehype; fail the build when raw and anchored counts differ | yes |
| MINOR | v1 splitting | `src/data/cta-articoli.ts` | Headings in a Markdown blockquote or `<details>` are counted and can host the banner (D17 accepts `<details>`, not blockquotes) | Same anchored match, or fail on nested `<h2` | yes |
| MINOR | v4 hygiene | commits ff67dee..e36e3bc | Author email is the gmail address (already public in 53 pushed commits), while ff67dee used the GitHub noreply | Owner decision | no |
| MINOR | v4 hygiene | `.gitignore` | `.claude/worktrees/` excluded only via `.git/info/exclude`; `.claude/settings.local.json` not ignored | Add both to `.gitignore` | yes |
| NIT | v1 splitting | `src/pages/showcase/[slug].astro:26-38` | `__ASTRO_IMAGE_` guard also fires on releases with <2 H2s (by design, D2) and on the bare substring in inline code | Match the real placeholder form | yes |
| NIT | v2 plans | `src/data/articoli.ts:83` | Same-day releases tie-break by id; a new same-day release could flip later same-day plans (all dates distinct today) | Append-stable tie-break or document | yes |
| NIT | v3 scripts | `src/layouts/Base.astro` | `new IntersectionObserver` unguarded (pre-existing: the `.reveal` observer above already throws without IO) | Optional guard | no |

### Dismissed with owner evidence

v5 also raised as MAJOR: Jev's redefined centrality criteria, «in parallelo, senza generare testo», the replaced «17–27 skill su 30» measurement, and «Ora il flusso è in produzione»; as MINOR the removed «Ci tengo a dirlo: non è un'applicazione ufficiale» in Agenda Wave. These are copy the owner rewrote and confirmed in the 2026-11-18 revision session (production status confirmed explicitly; the Agenda sentence removed at the owner's request, and the title still says «non ufficiale»). Not defects of the implementation; the owner may still want to re-read the Jev criteria against the grader code.

## What passed

| Concern (verifier) | Evidence |
|--------------------|----------|
| v1 — HTML splitting | Build exits 0 (15 pages). Banner at ⌊N/2⌋+1 in all 6 releases (Jev before «Pulizia e sinonimi»); one `aside.cta-strip` per page; body minus banner byte-identical to `rendered.html`; `set:html` only gets author-owned Markdown; guard stops the build on a relative image |
| v2 — pricing and plans | Partner/Team alternate oldest-first (P,T,P,T,P,T); skipped turns don't consume; all Team without free slots; prices «2.200 €» / «5.000 €» from `src/config.ts`; no hardcoded name or Cal link |
| v3 — progressive enhancement | `data-armed` set only with IO; `data-in` once at 15%; float hides on Firma, returns above, correct on reload at bottom; non-release pages unchanged; no console errors, no framework JS |
| v4 — hygiene | `omar.jpg` 192×192, no GPS/EXIF beyond colour space; verification PNGs carry no metadata; no secrets, tokens or emails in added lines; agent-memory has no private data |
| v5 — release copy | Frontmatter validates; `lang` default `it` makes beautiful-ui consistent (html lang, og:locale, RSS); all internal and external links resolve; no relative images |
| v6 — UI | AC1, AC2 (alt="", 4×), AC3, AC6, AC8, AC9 (280–1440 at 1× and 1.25×, no overflow, wrap ≤600 px aligned at 65 px) pass on measurement; contrast ≥ 5.3; targets ≥ 26 px; visible focus rings; AC12 holds without reduced motion |
| v7 — motion | Tokens only; Firma opacity-only `--ease-out`/`--dur-swap`; banner 24 px rise `--ease-out-expo`/`--dur-reveal`; reduce → fade only, press scale neutralised |

## Per-concern verdicts

| Pass | Charter | Verdict | Rationale |
|------|---------|---------|-----------|
| v1 | HTML splitting and injection | SHIP | Correct on all 6 releases; latent attribute/blockquote split flaw is MINOR |
| v2 | Pricing and plan assignment | SHIP | AC4, AC5, AC1 single-source verified in dist |
| v3 | Progressive enhancement | SHIP | AC10 and AC12 (normal motion) verified in browser |
| v4 | Repo hygiene and secrets | DO NOT SHIP | `.claude/launch.json` absolute local path |
| v5 | Release Markdown copy | DO NOT SHIP | 1–100 vs 0–100 contradiction (other items dismissed with owner evidence) |
| v6 | UI pass | DO NOT SHIP | AC12 unmet under reduced motion (measured) |
| v7 | Motion craft | DO NOT SHIP | Same AC12 regression, from code |

## Human Review Checklist

1. Fix the reduced-motion float: hidden `.float-cta` must not intercept pointer or focus. Verify in a browser with reduced motion emulated at 375 px: `document.elementFromPoint` on the Firma button centre returns the button, and Tab does not land on the invisible pill.
2. Confirm the real score range of the AI Report (0–100 or 1–100) and make `cv-anonimo-ai-report.md` body (line 38) and cover alt (line 10) agree.
3. Decide on `.claude/launch.json`: untrack and ignore it, or make it portable. After the fix, `git grep -n '/Users/' HEAD` returns nothing.
4. Optional: restore the conditions of the «0,48 s» metric in Jev, or change the metric; re-read Jev's four criteria against the grader.
5. Run `npm run build` on Node 26 and check it passes.
6. Only then push `main`.

## Acceptance criteria check (case B)

| Criterion | Met / Unmet / Blocked | Notes |
|-----------|-----------------------|-------|
| AC1 Firma content and order | Met | v2, v6 |
| AC2 decorative photo, ≥2× | Met | v4, v6 (192 px for 48 px circle) |
| AC3 single banner, dot, «Prenota →» new tab | Met | v1, v6 |
| AC4 two texts with config prices | Met | v2 |
| AC5 alternation | Met | v2, v5 (same-day tie NIT) |
| AC6 complementary region named | Met | v6 |
| AC7 position ⌊N/2⌋+1 | Met | v1, v5 |
| AC8 link styles don't leak | Met | v6 |
| AC9 280–1440, wrap ≤600 | Met | v6 |
| AC10 visible without JS | Met | v1, v3 (by construction; no real JS-off browser) |
| AC11 motion brief, reduced motion | Met | v7 (MINOR on float transition) |
| AC12 float never covers Firma button | **Unmet** | Fails under reduced motion (v6 measured, v7 code); met otherwise |

## Feature-improvement candidates

| Candidate (verifier) | Evidence | Who gains | Size | Outcome |
|----------------------|----------|-----------|------|---------|
| v1 — Count only top-level H2s and fail the build on nested or attribute `<h2` | `src/data/cta-articoli.ts:17-31` | Omar as author: a silent markup break becomes a loud build error | small | pending |

## Notes for docs-maintenance

- Durable findings to fold into `brain/tech-debt/showcase/cta-articoli.md`: the MINORs/NITs marked durable above (splitter attribute and blockquote cases, guard false positives, same-day tie-break, `.gitignore` coverage, float reduce transition token choice) — only those not fixed before push.
- Domain pages that should backlink this review: the showcase release-page flow, once `docs-maintenance` ingests cta-articoli.

## [Round: 2026-11-18] Fixes applied before push

Owner asked to fix everything. Each item re-verified by the orchestrator (not a fresh verifier pass).

| Finding | Fix | Evidence |
|---------|-----|----------|
| MAJOR AC12 under reduced motion | `.float-cta` hidden = `visibility:hidden; pointer-events:none`; `.show` restores both with `transition-delay:0s`; visibility flips after `--dur-ui` (normal) / `--dur-swap` (reduce) so the fade still plays (`src/styles/global.css`) | Chromium via agent-browser on built `dist/`, 375/280/1440 px, both motion modes: `elementFromPoint` on the Firma button returns the button; hidden pill `visibility:hidden`, `pointer-events:none`; fade-out samples 0.92→0.67→0.29→hidden (reduce) |
| BLOCKER score 1–100 vs 0–100 | Body aligned to «da 0 a 100», like the cover alt and the previous text | `cv-anonimo-ai-report.md:38` |
| MAJOR `.claude/launch.json` local path | Untracked and ignored; the unpushed tooling commit was amended so no reachable commit carries the path | `git grep -n '/Users/' HEAD` empty |
| MINOR orphaned «0,48 s» | Conditions sentence restored in «Jev come grader» | `jev-model-grader.md:34` |
| MINOR float reduce transition | Accepted: `--dur-swap` linear, same as `.reveal`; recorded in `brain/chore/motion.md` | — |
| MINOR splitter attribute / blockquote | Only `<h2` at line start and outside containers count; any other `<h2` (`titoliAnnidati`) fails the build with a message | Node fixtures: 7→4th, 4→3rd, 2→2nd, 0–1→null, code escaped, alt `<h2` and blockquote `<h2` not counted and flagged; dist placement unchanged on all 6 releases |
| MINOR `.gitignore` | Added `.claude/launch.json`, `.claude/settings.local.json`, `.claude/worktrees/` | — |
| NIT guard substring | Guard matches the real placeholder `__ASTRO_IMAGE_="` | `[slug].astro` |
| NIT same-day tie-break | Documented as a limit in the module header | `src/data/cta-articoli.ts` |
| NIT unguarded IO in Base | `if (firma && 'IntersectionObserver' in window)` | `src/layouts/Base.astro` |
| MINOR author email | Not changed: owner decision (already public in pushed history) | — |

Gate: `npm run build` on Node 26 passes (15 pages). After this round no BLOCKER or MAJOR stays open; the verdict above remains the record of the first round.
