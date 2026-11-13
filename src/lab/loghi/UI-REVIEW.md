## Verdict: proceed with decisions. The two round-1 fixes hold, but the li `display: grid` change knocked the sub-lines out of line (one mechanical fix, tested). The longer h2 wraps cleanly. P1 contrast stays a spec decision.

## Engines         Chromium 149 (HeadlessChrome/149.0.0.0, DPR 1) · Mobile Safari (Simulator) not available (`appium` not on PATH) · axe not available (agent-browser 0.27.1, no `node_modules/axe-core`) · widths 280–1440 at 1× and 1.25× root font: every breakpoint ±1 (600/640/760/900), every head row change ±1 (913/914, 1065/1066, 1156/1157), plus 844×390 · states forced: rest; lit through name hover; keyboard focus on Valueize at 280/375/768/914/1440; reduced motion (375 focus re-run); touch path through synthetic pointer events (precondition only, not a device); densest content (case-study label injected on Devpunks and Start Franchising)

Round-2 run folder: `/var/folders/41/wv53bfqd10s85v7lw9kd517c0000gn/T/tmp.niIOCImHq2`. Round-1 files are in `/var/folders/41/wv53bfqd10s85v7lw9kd517c0000gn/T/tmp.Y7GYv4gGOJ`.

**Round-1 items re-checked:**
- **Former P2 (dot band): fixed.** At all 25 widths × 2 font scales, "caso studio ↗" is the last line on its own and no line starts with "·" (`m2-summary.txt`; `width-sweep.json`: the Valueize span is 1 row at 280–1440 in both passes). Removed from Decisions.
- **Former mechanical fix (hit area): fixed.** li − link height is 0 at every measured width, and grid coverage is 1 at 280/375/914/1440 (`m2-summary.txt`, `valueize-hit-grid.txt`). The fix itself introduced Mechanical fix 1 below.

## Decisions
| # | P | Decision needed | Recommended default | Acceptance criterion | Evidence | Engine |
|---|---|---|---|---|---|---|
| 1 | P1 | Unchanged from round 1. In every lit state the non-lit items drop to opacity .4 (`V7Muro.astro:285-287`). Names (18.4 px/700) measure **3.8:1** and sub-lines **2.01:1** on #0f1626; both need 4.5:1. This includes the Valueize link when another client is lit. | Show the lit client by emphasising its own item (tint border, sub-line to white) and leave the others at their resting colours (18.06:1 and 6.11:1). If you keep the dimming, the opacity must be at least .82. | In each lit state (clients 0–3, by hover, focus or tap) at 280–1440 px, every text in `.v7-names` measures at least 4.5:1 against #0f1626. | 1.4.3. Round-1 files `pixels-lit0-1440.json`, `pixels-lit2-375.json`, `names-lit0-1440.png`, `dim-threshold.txt`. The CSS is unchanged; resting colours re-measured this round in `contrast.json`. | Chromium 149 |

## Mechanical fixes
- `section.v7 .v7-name` (all four items) · rest and every state · 280–1440 px, 1× and 1.25× · Chromium 149 · **new regression from the li `display: grid` change.** The stretched `.v7-name` grid (`align-content: normal`) spreads the row's spare height into its own tracks. Sub-lines in the same grid row therefore no longer share a line: they are off by 10.8–10.9 px at 1× at every measured width except 280/320, and by 13.6–32 px at 1.25× (`names-align.txt`). In round 1 they were level. The sub-lines of Young Platform, Devpunks and Start Franchising sit below Valueize's (`s-16px-914.png`, `s-20px-1440.png`, opened) → required: sub-lines aligned across a row · placement: alignment · fix: `.v7-name { align-content: start; }`. Tested by injecting that rule: spread 0 at 375/914/1440 and link coverage still 1 (`names-align-fix-test.txt`). At 280 a 25.6 px spread remains only because "Young Platform" and "Start Franchising" wrap to two lines, which is content, not a defect.

## Not verified on device
- `span.v7-name`, `.v7-win img` · touch-lit · 280–760 px — not verified on device (Mobile Safari)
  The round-1 scroll-start hypothesis is resolved in code. With synthetic touch events in Chromium (`touch-path.json`):
  - `pointerdown` then `pointercancel` on the wall: nothing lit.
  - Tap on a name: lights it. Same tap again: turns it off.
  - Tap on a screenshot: lights its client. Tap outside: turns it off.
  - Tap on Valueize: nothing lit, and the click is not prevented.

  Remaining hypothesis: lighting now relies on a `click` reaching a non-interactive `span` or `img` (`muro.ts:105-110`, listener on `section.v7` at `:138`). iOS Safari dispatches `click` on such elements only when WebKit treats them as clickable. A listener on a non-body ancestor should qualify, but only a device shows it.
  Fix: if taps don't light, add `cursor: pointer` to `.v7-names li` and `.v7-win` on `(hover: none)`.
  Manual check: iPhone Safari → `/lab/loghi` → tap "Young Platform" (lights, others dim) → tap again (off) → tap a screenshot on the wall (its client lights) → swipe vertically starting on the wall (nothing lights) → tap "Valueize" (case study opens on the first tap).
- `.v7-plane` / `.v7-track` · rest, stepping · 280–1440 px — not verified on device (Mobile Safari). Unchanged from round 1: tracks 4520/4520/3872 px at 280 (round-1 `context-280.json`) and 6780 px above 760 by code (`V7Muro.astro:31,100,175`). WebKit may rasterize them blurry or drop tiles. Fix: shorten the rendered track, together with design-engineer. Manual check: iPhone Safari at 375 and iPad landscape → watch a few steps → look for soft or missing screenshots.
- `section.v7` · rest · 280 px and up — not verified on device (Safari < 16, only if the project supports it). Unchanged: `overflow: clip` (`V7Muro.astro:103`) is the only thing containing the tracks; forced to `visible`, the document is 2173 px wide at 280 (round-1 `context-280.json`). Fix: `overflow: hidden;` before `overflow: clip;`. Manual check: iOS 15 Safari at 375 → swipe sideways → look for horizontal scrolling.

## Checked and clean
- **Widths and wrapping, head with the new h2:** no overlap and no clipping at any width or scale (`m2-summary.txt`).
  - 1×: 2 rows at 280–913 (aside under the title), 1 row at 914–1440 (`width-sweep.json`). The h2 takes 3 lines at 280, 2 at 300–414, 1 from 600.
  - 1.25×: 2 rows at 280–1065, 1 at 1066–1156, 2 again at 1157–1440, where the h2 reaches 60 px and balances onto 2 lines (`s-20px-1440.png`). It wraps cleanly and nothing collides.
  - The section causes no horizontal overflow at 280–1440 or 844×390 (`sectionRightOverflow` 0). The 13–45 px document overflow at 280–320 comes from `#per-chi`.
  - The names grid is still 2 rows at 280–760 and 1 row at 761–1440. Nothing clips with the injected labels at 1× and 1.25× (`inject-densest.txt`).
- **Placement and geometry:** at 280/375/1440 the head and names are never covered by the wall (0 blocked samples), and points just outside the stage hit `section.v7` (`hittest.txt`). Hovering a name causes no instant shift (`layout-jump-hover-name.json`: 0 shifts, every Δ 0). The alignment regression is the only item, under Mechanical fixes.
- **Contrast at rest:** eyebrow, aside, sub-lines and "caso studio ↗" 6.11:1; the new title and names 18.06:1 (`contrast.json`).
- **Focus visibility:** Valueize is reached by Tab at 280/375/768/914/1440 with a 2 px white outline. It is not clipped and not covered (`focus-ring-*.json`, crops opened). At 375 the first run reported `enclosesTarget: false` because smooth scrolling moved the page between the two measurements (same 12 px margin, offset 46 px). The re-run without smooth scrolling gives `true` (`focus-ring-375-rm.json`; crop opened).
- **Target size and hit area:** the Valueize link is 108×114.7 px at 280 and 256×92.9 px at 1440; coverage of its li is 1 (`valueize-hit-grid.txt`).
- **Accessible names:** the region is now "Hanno scelto un Product Engineer." (from the h2). The link reads "Valueize Team · 9 settimane caso studio ↗", which contains the visible text with no words run together (`tree-1440.txt`, `tree-names-1440.txt`). "Product Engineer" is an English job title on an Italian page; it falls under 3.1.2's exception for technical terms, so no finding. The wall stays `aria-hidden`.

## Not tested
- Mobile Safari, real touch input and VoiceOver/NVDA output: no Simulator; names read from the Chromium tree only.
- axe: no source available.
- 1.4.4 (200 %) and 1.4.12 text spacing: only the 1.25× sweep ran.
- The lit-state contrast was not re-measured this round: its CSS (`V7Muro.astro:285-287`) is unchanged and it stays Decision 1.
- Motion states (stepping, entrance, hover scale while it animates): these belong to design-engineer.
- Context outside the section: the nav at 280 (logo and CTA touch) and the harness copy of "Per chi" (13 px overflow) are unchanged from round 1.

## Open questions
1. Devpunks' lit marker: the name border in #2b14ff measures 2.28:1 on ink (round-1 `tint-ratios.txt`). Default: use #5543ff (3.12:1) for the name border and keep the brand blue on the decorative screenshot ring, especially if Decision 1 drops the dimming.
2. Phone landscape: at 844×390 the stage is still 440 px tall, and the head now takes 2 rows (aside under the title, `m2-land-844x390.json`), so even less fits in the 322 px left below the nav. Default: limit the stage height to `min(440px, 60svh)`.
