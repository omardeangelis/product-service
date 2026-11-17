# T14 report: showcase, full pass (Chromium via agent-browser 0.27.1, placeholder articles, dist built with default content)

Content restored: `shasum $(find src/content -type f | sort) | shasum` = d0df21f82de0bcafa393109ec084754cd2d12c0a before and after. `npm run build` passes at the end (21 pages).
Scripts used: `$SCRATCH/measure.js`, `sweep.sh`, `fr.sh` (focus-ring probe of the ui-review skill), `ac12.js`, `ac25.js`, `rm.js`, `nojs.js`, `feed-test.js`, `t14-static.mjs` (SCRATCH = the scratchpad folder). Screenshots in `$SCRATCH/t14shots/`.

## FAILURES (summary)

| # | Where | Measurement |
|---|---|---|
| F1 | Home `#shipped`, every width, dark theme. Pressed chip (AC7 "chip premuto", AC24) | Pressed chip is a white pill with invisible text: `color: rgba(255,255,255,0.04)` (`--t-card:#ffffff0a`) on `background:#fff` (`--t-ink`). Contrast 1.00:1 (needs 4.5), also the count inside (`chip-n`, 1.00). Seen in screenshot `t14shots/home-chips.png` and `ac12-cs-home.png`. `Filtri.astro` `.chip[aria-pressed=true]{color:var(--t-card)}`: the dark theme's `--t-card` is a translucent white. `/showcase/` (light) is fine. |
| F2 | Home, AC26 focus ring (all 4 sides), widths 375, 415, 500, 600, 700, 800, 1440 | Tab onto a card that is only partly in the strip does not scroll the strip; the ring is cut on the right (or left). Clipped px of the ring: 375: 284 (every second card); 415: 309; 500: 224; 600: 124; 700: 24; 800: 220 (left); 1440: 76 (card 3 and 6). 701, 1024: 0. Screenshot `t14shots/ac26-375-tab2.png` (card 2 focused, scrollLeft 0, only ~27 px visible). Probe `focus-ring`: `clipAncestor #shipped > ol.sc-strip`, `clippedPx.right 24` at 700. |
| F3 | AC27, landscape phone, Tab: ring top must be below nav (nav bottom 69 px) | Home 667x375: Tab DOWN to first card ok (ring top 70.9); Shift+Tab UP from footer link to last card FAIL (ring top -102.1; card 474 px tall, visible area 306). Home 844x390: DOWN ok (70.8), UP FAIL (-75.2; card 462). `/showcase/` 667x375: DOWN to first card FAIL (-32.4; card 509), UP to last visible card FAIL (-230.5; card 602). `/showcase/` 844x390: DOWN ok (72.4), UP FAIL (-139.5; card 527). Cards taller than the visible area (viewport minus nav). Also probe `obscuredFraction` by `body > nav`: 0.24 to 0.32 on home, 0.18 to 0.48 on `/showcase/` in the two landscape sizes. Cards 415-700 wide: 340 max, ok. |
| F4 | Focus ring obscured by the fixed `a.float-cta` (the "Review gratuita ... Prenota 30 minuti" pill), WCAG 2.4.11 | Home footer link `a.hf-all`: 31% (280), 32% (375), 25% (700) of the ring covered; feed button 38% / 59% (1024 / 700), feed link 61% / 65% (1024 / 700). `/showcase/` cards: 9% (280, 375), 3% (1024). 0 at 1440x900. Probe `focus-ring`, `obscuredBy: body > a.float-cta.show`. |
| F5 | AC28 "nessuna pagina scorre in orizzontale, anche a 1,25x" and "Prenota una call" in nav at 280. Text scale 125% (CSS `html{font-size:125%}`) at 280x800 | `/showcase/`: scrollWidth - clientWidth = 7 (protruding: `.nav-links` and `a.btn.btn-primary` right edge 287). Home: 28 (nav 287, `.tabs-list` 281, `.tab-card` 281: that section is outside the showcase). Release page 0. 375 and 1440 at 125%: 0. At 1x all widths 0. |
| F6 | FLOW "Home: Indietro conserva filtro e posizione" (row `present`), only when Chromium does NOT restore from bfcache | With bfcache (default Chromium): ok. With `--disable-features=BackForwardCache`: after Back, filter back to «Tutti» (was «Release»), strip scrollLeft 0 (was 1008), scrollY 4988 (was 4949, 39 px off). `performance.navigation.type` back_forward, JS state lost. This is the same loss any browser without bfcache (or a page that bfcache rejects) shows. |

## Not tested / limits
- Mobile Safari, Firefox, WebKit, VoiceOver, NVDA, touch hover (manual items of the SPEC): not run.
- `ui-review` probes used: `focus-ring` only. `width-sweep`, `hit-area`, axe not run; replaced by my own DOM measurement (`measure.js`: overflow, protrusion, WCAG contrast of every visible text leaf with `__c`, target sizes, chip rows, clipping). Contrast is computed from composited background colours, not over image pixels.
- "1,25x": `set viewport W H 1.25` only changes device pixel ratio (layout identical, so useless); I used root font-size 125% instead (the ui-review font scale). Do not read DPR runs in the sweep as 1.25x.
- 1,25x chips: two rows at 375 (ok, limit is 400), one row at 400/401.
- `segnaposto-agosto-2` is not on the home at all with the default content (it is older than the 8th card), so its home card could not be checked; checked in `/showcase/`, page, RSS, JSON-LD, llms.txt.
- Hover/press transforms outside reduced motion not re-measured (only the reduced-motion side).
- Clipboard: real `navigator.clipboard.writeText` rejects in headless (NotAllowedError), which exercised the failure path for real; the success path was exercised with a stub.

## A. FLOW.md «States» (20 rows)

| # | Row | Verdict | Evidence |
|---|---|---|---|
| 1 | Chip in home: filtro cambia | ok (but see F1: pressed chip unreadable) | `aria-pressed` follows; strip scrollLeft 0 after change; first card at x=184 (container left); count «4 casi studio», «Le ultime 8 di 12 release», «Gli ultimi 8 di 16 articoli»; end card and footer link «Tutti i casi studio · 4» -> `/showcase/?tag=caso-studio`, «Tutte le release · 12» -> `?tag=release`, «Tutti gli articoli · 16» -> `/showcase/`. Footer link top identical across the 3 filters (5468 at 1440) and in the 8-width width sweep. |
| 2 | Chip durante lo scorrimento delle frecce | ok | arrow click, 100 ms later scrollLeft 97 (moving); chip click, 50 ms later scrollLeft 0, 900 ms later 0. |
| 3 | Chip: tag con 0 articoli | ok | all releases `draft:true`: chips «Tutti 4», «Casi studio 4» (no Release chip); `/showcase/?tag=release` opens «Tutti», URL rewritten to `/showcase/`; no `showcase/<slug>` pages, RSS 4 items, llms.txt and sitemap 0 release lines. |
| 4 | Chip: tag con 1 articolo | ok | only `segnaposto-immagine` published: chip «Release 1», end card/link «Tutte le release · 1», announcement «1 release» (home and `/showcase/`), «Tutti 5» / «5 articoli da maggio 2025»; arrows `visibility:hidden` and `data-ferma` with 1 card (space kept). |
| 5 | Pagina `?tag=` valido | ok | `?tag=caso-studio`: 4 cards, only luglio 2026, aprile, marzo, maggio 2025 months on; `?tag=release`: 12 cards, 4 months (nov, ott, set, ago 2026); chips pressed accordingly. |
| 6 | `?tag=` sconosciuto/senza articoli -> Tutti | ok | `?tag=boh`: 16 cards, «Tutti» pressed, URL `/showcase/`. Zero-article tag: see row 3. |
| 7 | Cambio filtro, poi Indietro esce | ok | two filter changes: `history.length` unchanged (8 -> 8), `?tag` rewritten with replaceState; Back leaves to `/` . |
| 8 | Scheda apre un caso studio (`present`) | ok | `/showcase/?tag=caso-studio` card -> `/case-study/motion-design/`; its nav «← Tutti i casi studio» and «Altri casi studio» -> `/showcase/?tag=caso-studio`; Back restores the page with «Casi studio» pressed. |
| 9 | Scheda apre una release | ok | card -> `/showcase/segnaposto-ottobre/`; page has «Prenota una call di 30 min». |
| 10 | «← Tutti gli articoli» da `/showcase/` | ok | with `?tag=release` and scrollY 900: back link -> history back; page returns at `?tag=release`, «Release» pressed, scrollY 900. From home or direct URL it opens `/showcase/` (pushes). |
| 11 | Release da URL diretto: call in fondo | ok | `/showcase/segnaposto-video/` direct: links «Prenota una call di 30 min» (cal.com) and «Leggi il caso studio completo» -> `/case-study/onboarding-saas/`. |
| 12 | Home: Indietro conserva filtro e posizione (`present`) | ok with bfcache, FAIL without (F6) | Release filter, arrow scrolled to scrollLeft 1008, scrollY 4949, open `/showcase/segnaposto-curva/`, Back: same filter, 1008, 4949 and page state alive (bfcache). Without bfcache: «Tutti», 0, 4988. |
| 13 | Feed: copia riuscita | ok | label swap, button width 174.1 constant (44 high), both labels inside the button, status `role=status` says «Link del feed copiato», `data-copiato` resets after ~2.4 s. |
| 14 | Feed: copia fallita | ok | real clipboard rejects: status «Copia non riuscita: https://spatalo.tech/rss.xml», `.feed-url` `user-select:all`, still there 4 s later; no page overflow (scrollWidth 1440); width unchanged. |
| 15 | Feed: secondo clic prima che sparisca | ok | click at 1.8 s, still «copiato» at 2.8 s (timer restarted), reset by 4.4 s. |
| 16 | Video in scheda: fermo, senza controlli | ok | no `<video>` in any `.sc-card` (poster image); no button/input/tabindex in cards (0); Tab from a card goes card to card (immagine, numero, white-label, caratteri, titolo-lungo, curva). Release page video: `controls`, no autoplay attr (`articolo.ts` plays it muted when in view, on the page only). |
| 17 | Media non caricato -> copertina con numero o titolo | ok | blocked the 4 files: release image/video cards show title (`.sc-fb` flex) `imgDisplay:none`; Excel and Onboarding show numbers «~30s», «6,4×»; `data-rotto` set; no video/player; screenshot `ac12-cs-home.png`, no white blocks (cover bg `rgba(255,255,255,.04)`); 280 and 1440, home (Casi studio filter) and `/showcase/`: page overflow 0. |
| 18 | Date giorni dopo il deploy | ok | clock 16 Nov: «ieri», «3 giorni fa», «6 giorni fa», «6 nov»; row «l'ultimo ieri». 20 Nov: «5 giorni fa», «13 nov»; row «l'ultimo 5 giorni fa». 23 Nov: «15 nov»; row «l'ultimo il 15 nov». «21 mag 2025» keeps the year. Home and `/showcase/` agree. |
| 19 | Senza JavaScript | ok | home: 9 visible cards (8 + end card), no hidden-by-opacity content, all 6 buttons hidden (chips, arrows, copy), «Feed RSS» link visible, links work; `/showcase/`: 16 cards, 8 months, chips and copy hidden, no overflow. |
| 20 | Reduced motion | ok | home entry animation `sh-fade` only `opacity`; filter swap `sc-swap-fade` only `opacity` (+ colour transitions on chips); arrow click: scrollLeft jumps to 1008 within one frame (instant); card hover: border colour only, `transform: none` on card and image on hover and `:active`. `/showcase/` swap: opacity only. |

## B. UI pass (home `#shipped`, `/showcase/`, `/showcase/segnaposto-video/`)

Widths: 280, 320, 357, 358, 375, 414, 415, 700, 701, 1023, 1024, 1440 at 1x; 280/375/1440 at font 125%; 667x375; 844x390 (home also at DPR 1.25, identical to 1x).

| Check | Verdict | Evidence |
|---|---|---|
| Horizontal overflow 1x, all widths and the 3 surfaces | ok | `scrollWidth - clientWidth` 0 everywhere, 0 protruding elements outside scrollers |
| Horizontal overflow at font 125% | FAIL (F5) | 280: showcase 7, home 28 (nav + another section); release 0; 375, 1440: 0 |
| Contrast of every visible text (≥4.5, large 3) | FAIL home only (F1) | `/showcase/` 102 texts tested, release 19 tested: 0 below. Home 55 tested: only the pressed chip (1.00:1) and its count. «04» eyebrow 6.62:1 (was 3.07). |
| Focus rings, 4 sides (probe `focus-ring`, Tab order chips, arrows, cards, footer link, copy, Feed RSS) | FAIL (F2, F4) | all controls reached, `focusVisible`, ring 2 px outline offset 2 px `rgb(138,147,255)`; `/showcase/` clipped 0 at 280, 375, 1024; release page 5 controls 0 issues at 375, 1440; home 1440x900 0 issues |
| Strip is not a tab stop (AC26) | ok | Tab order has no `ol.sc-strip` |
| Target sizes | ok | chips 74/109/96 x 40; arrows 44x44; «Tutti…» 210x44; copy 174x44; Feed RSS 75x44 at every width (also 125%) |
| Accessible names | ok | all 8 home cards and all 16 `/showcase/` cards: link name = title (snapshot); description = date, project, text; end card not a tab stop; «Feed RSS» link, status regions present |
| Chip rows (AC19) | ok | 280, 320: 2 rows; 357: 1 row; 358-1440: 1 row; no clipped labels; font 125%: 375 two rows, 400 and 401 one row |
| Card widths (AC27 415-700, home) | ok | 340 max (415, 700: 340); 358: 294; 375: 308; 701+: 320 |
| Grid columns (AC14) | ok | `/showcase/` card width 652 at 700 (1 col), 319 at 701 (2 cols), 480 at 1023, 315 at 1024 (3 cols) |
| Text clipping/captions | ok | captions/metrics `scrollWidth>clientWidth`: 0; release h1 with 70-char title at 280: 24..256 inside; clipped titles: 0 |
| Nav «Prenota una call» at 280 | ok | one line (42 high, 130 wide), logo right 117, button left 126 (gap 10) on home and `/showcase/`; release and case study pages show the back link instead (137-256) |
| h2 `lang` | ok | `lang="en"` |
| Fixed pill overlapping content | note | see F4 |

## C. Cross checks

| Item | Verdict | Evidence |
|---|---|---|
| AC1 `grep -r BOZZA-NON-PUBBLICARE dist` | ok | empty; also no `dist/showcase/segnaposto-bozza` in RSS/llms/sitemap (t5/t8/t11 pass) |
| AC2 `segnaposto-white-label`, `segnaposto-agosto-2` | ok | project «Cliente in white label»; card (home: white-label only; agosto-2 not on home, see limits; `/showcase/` both), page, RSS item, JSON-LD, llms.txt line: no «Valueize», no «SeVedemo»; no «Leggi il caso studio completo» on either page |
| AC3 cadence words | ok | `#shipped` of `dist/index.html`, `dist/showcase/**`, `dist/rss.xml`, «## Showcase» of `dist/llms.txt` (2223 chars): 0 matches |
| AC10 fake clock 20, 16, 23 Nov | ok | see row 18 |
| AC12 media blocked | ok | see row 17 (280 and 1440, home and `/showcase/`) |
| AC25 100-char title with a 32-char word | ok | home 280-1440: card titles clamp 3 lines, cover titles clamp 4 lines (`line-clamp`, `overflow-wrap:anywhere`), no horizontal clipping, page overflow 0, row card widths one value per width (230, 262, 308, 340, 340, 320, 320, 320), footer link top unchanged. `/showcase/`: titles wrap fully (2-7 lines, not clipped), covers clamp 4 lines, widths uniform, overflow 0 |
| AC27 | FAIL (F3) | numbers in F3 |
| AC29 | ok | row 20 |
| AC30 | ok | row 19 |
| AC31 JSON-LD | ok | 21 blocks in 21 pages: no `<`, `>`, `&`, U+2028, U+2029; all parse (`t14-static.mjs`); `xmllint --noout dist/rss.xml` silent |
| `ld.mjs cmp` | ok | `pagine 21 diff 0` |
| t5 / t7 / t8 / t11 on default content (after restore) | ok | all print TUTTO OK (15, 23, 16, 13 checks) |
| Gate | ok | `npm run build`: 21 pages, Complete |
| Content restored | ok | shasum d0df21f82de0bcafa393109ec084754cd2d12c0a, same as before; `src/` otherwise untouched |

## Other observations (not failures)
- Home `Tutti` shows 8 releases and no case study (the 4 case studies are older than the 8th release). Expected by data.
- Release page after Back from `/showcase/` keeps a stale status text «12 release» (bfcache restore of the live region); harmless.
- At 375 the arrows are visible under a fine pointer (headless), as AC17 allows.
