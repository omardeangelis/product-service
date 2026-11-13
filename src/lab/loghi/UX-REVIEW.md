## Moment: prototype review (re-review, round 2 of 2) — http://localhost:4321/lab/loghi (`#lab-stage > section.v7`)
## Verdict: proceed with decisions — D1 is fixed and confirmed in the browser, and the regression pass found no new problem. The four decisions still open need Omar's facts, not prototype changes.

**D1 re-check (real touch through CDP at 390×844):**
- One tap on the Valueize link opens /case-study/dati-da-excel (events `pointerdown:touch, click:touch`).
- After Back, `data-hot` is absent and all four names are at opacity 1 (loghi-r2-02).
- Code: `muro.ts:105-111` (the link returns before any lighting; keyboard is caught by `detail === 0`).
- Screenshots: `/private/var/folders/41/wv53bfqd10s85v7lw9kd517c0000gn/T/ux-review/loghi-r2-*.png`.

## Decisions
| # | P | Decision needed | Recommended default | Acceptance criterion | Evidence |
|---|---|---|---|---|---|
| 2 | P1 | The wall presents client pages as proof of Omar's work and contradicts its own copy: "In white label, per i loro clienti" sits under five devpunks.com marketing pages. Every visitor sees it, and it costs credibility with a technical audience | The wall shows only screens of work Omar did (the 4 Valueize app screens are the model). A client with nothing showable appears in the names only | Every screen in `logos.ts` notes what Omar did on it, and a screen without that note does not render. No devpunks.com page shows unless he built it | `logos.ts:121-131` vs `copy.ts:15`; devpunks.com frames in loghi-02; brief: screens taken from the public sites |
| 3 | P1 | SeVedemo, the client of 3 of the 4 published case studies, is missing from the list. A CTO who scrolls on to "04 La prova" finds the main proof belongs to an unlisted client | Add SeVedemo with the line "Product Engineer · 3 casi studio ↓" → `/#shipped`, unless Q3 says the omission is on purpose | Every `meta.cliente` of a published case study appears among the names, and a client with case studies links to them | `motion-design.md:20`, `offerte-ai.md:19`, `onboarding-saas.md:19` vs `logos.ts:74-152` |
| 4 | P2 | The head still repeats itself and contradicts the lines. With the new h2, the eyebrow and the title both open with "Hanno…" and say the same thing. The aside "Nel loro team o in white label" is false for Valueize ("Team" = his own Team plan) and Start Franchising ("a progetto"). "team" means two things across three lines. "↗" signals an external link, but the case study opens in the same tab, and the home uses "→" ("Apri il caso studio →") | Keep the user's h2. Eyebrow: **"Clienti"**. Aside: **removed** until the four lines are confirmed (if kept, it names only the modes shown below). Valueize: **"Con il mio team · 9 settimane"**, then **"caso studio →"** on its own line | Reading the head and the 4 lines: nothing in the head is contradicted below, "team" has one meaning, and the internal link ends in "→" | Region e10 snapshot (round 2); `copy.ts:10-17`; no "↗" in `src/` outside `src/lab` |
| 5 | P2 | The only link is hardcoded. If the case study is unpublished (`draft: true`) or renamed, it returns a 404, and the site has no 404 page | Build the link from the published case studies. With none, the name shows as plain text without "caso studio" | Set `draft: true` on dati-da-excel and build: Valueize shows with no link and no "caso studio" | `logos.ts:101`; `[slug].astro:9` filters drafts; no `src/pages/404.astro`; today the link answers 200 (curl) |

## Task accessibility fixes
- Keyboard is unchanged and passes. One Tab stop moves from "Show me the code ↓" to Valueize, and visible focus lights it. Tab/Shift+Tab move cleanly to the Per chi buttons and back. Enter opens the case study; after Back, nothing is lit (loghi-r2-01, trace).
- Touch-based assistive tech should now open the link on the first activation, because the code no longer blocks it (`muro.ts:108`). This still needs a check on a real device (Manual check 2).

## Outcomes and states
| Action or region | Outcome or state | In the prototype | What the person sees → can do next | Evidence |
|---|---|---|---|---|
| Valueize link (touch) | First tap | present | The case study opens. Back shows the section unlit | loghi-r2-02 |
| Valueize link (mouse, keyboard) | Opens the case study | present | The case study, ending in "Prenota una call di 30 min". After Back the mouse highlight clears on the next move; keyboard leaves nothing lit | Trace (round 2) |
| Names without a link (touch) | Tap / tap again / tap outside | present | Lights / turns off / turns off. Opacity goes 1,.4,.4,.4 → 1,1,1,1 | Trace |
| Wall or names (touch) | A swipe that starts there | present | The page scrolls and nothing lights | CDP swipe from the wall and from a name: `data-hot` null |
| Lit client (touch) → Valueize → Back | The person's own tap is kept | present | Young Platform stays lit and Valueize is at .4 until they tap it again or tap outside. This is acceptable: it is their own selection, not a stuck state | loghi-r2-03 |
| Wall screenshot (mouse) | Click | present | Nothing happens, though the frames show URLs → misread row 4 | Trace: URL unchanged |
| Wall screenshots | Load failed or slow | forced | White frames with broken-image icons. Names and link still work (the visual side is ui-reviewer's) | loghi-r2-04 |
| Valueize link | Case study unpublished | not reachable | 404 → D5 | `[slug].astro:9` |
| Section | No JS | by code | Visible, with names and link, and no highlight | `Harness.astro:64-65` |

## Persona situations + hand-offs
- **CTO, desktop:** only Valueize leads to proof. The client with 3 case studies is missing (D3). The names give no sector; that only shows in the moving, masked, aria-hidden wall (`logos.ts` `sector` is unused and unconfirmed).
- **Design agency:** reads the Devpunks line as proof he can work behind someone else's brand, but also sees him publicly naming a white-label client. That is the opposite of the "discrezione" they buy (personas.md, Agenzia) → Q1.
- **Software house:** Devpunks is a software house, so its line is their strongest proof, and it is an invented placeholder (`copy.ts:5-7`) → Q2. The next section's chips (Scale-up/Agency/Startup) don't speak to software houses.

## Already broken around the surface
- The page the only link opens has a typo in its first H2, "Poi perà bisogna riempirle." (`dati-da-excel.md:26`), and a broken sentence: "lo scenario più frequente erano utenti importavano…" (`:29`).
- A home card title on the same page is missing a word: "Da form  chat interattiva" (`offerte-ai.md:9`).
- "Per chi" doesn't name software houses (`index.astro:52-54`; listed under "Gap aperti" in personas.md).

## Where the spec will be misread
| Phrase | Misread as | Fix |
|---|---|---|
| "Only Valueize is a link" | Hardcode the href | Build it from published case studies (D5) |
| "Screenshots from the clients' public sites" | Any page of a client's site counts as proof | Only screens of work done (D2) |
| "The lab is the living reference" (`Harness.astro:3-4`) | Ship `copy.ts` as it is, invented relationship lines included | The lines come from Q2's confirmed data. A client with no confirmed line is not listed |
| "Hovering a screenshot scales it and lights its client" | Screenshots are links | The wall is not a control: no link, no click handler, no pointer cursor |
| "Entrance like the other sections" | Reuse `.reveal`, which hides content without JS (motion.md, "Aperto") | Visible by default, with the script arming the hidden state, as in the lab |

## Manual checks still needed
1. VoiceOver on macOS Safari: VO+U → Landmarks. Does the region "Hanno scelto un Product Engineer." tell a listener it is the client list? Tab to the link, now named "Valueize Team · 9 settimane caso studio ↗": are "9 settimane" and "caso studio" run together, and how is "↗" spoken?
2. VoiceOver on iOS and TalkBack on Android: swipe to the Valueize link and double-tap once. It should open the case study.
3. NVDA browse mode on the list: are the name and its line read as two parts or run together?

## Open questions
1. May Young Platform, Devpunks, Start Franchising (and SeVedemo) be named, and shown through screenshots of their sites? May Devpunks be named as a buyer of white-label work? **Default:** list only clients who agreed in writing.
2. What are the real relationship lines (mode, duration) and sectors for YP, Devpunks and SF, and which wall screens are Omar's work? **Default:** no invented line ships, and a client whose line is not confirmed is left out.
3. Is SeVedemo left out on purpose (an NDA, or an employment rather than a client relationship)? **Default:** include it (D3).
