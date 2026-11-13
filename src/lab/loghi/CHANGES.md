# Changes applied to the winner (prototype Phase 6, iterate loop)

Winner: Muro, `src/lab/loghi/` (`http://localhost:4321/lab/loghi`). Round 1 of the iterate loop; both reviewers' round-2 verdict: `proceed with decisions`.

## 1. Touch tap — ux-advisor D1 (+ ui-reviewer "not verified on device" hypothesis on the same code)

- **Finding:** on touch the only link (Valueize → case study) needed two taps; the first only lit the wall, and after Back the section stayed lit. Lighting on `pointerdown` also meant a scroll starting on the wall could light a client.
- **Before:** `muro.ts` lit the client on `pointerdown` (touch); on a link the first tap lit it and the `click` was prevented, the second tap opened the page.
- **After:** on touch, lighting happens on `click` (a tap that did not move); a scroll starting on the wall lights nothing. A name that is a link opens on the first tap and lights nothing. Names without a link and wall screenshots: tap lights, same tap again turns off, tap outside the section turns off. Mouse hover and keyboard unchanged (`click` with `detail === 0` ignored).
- **Check on screen:** at 390 px with touch, one tap on Valueize opens `/case-study/dati-da-excel`; Back shows every name at opacity 1 and the wall unlit; a vertical swipe starting on the wall lights nothing.

## 2. "caso studio ↗" on its own line — ui-reviewer P2 + mechanical fix (+ round-2 regression fix)

- **Finding:** at 761–965 px (1×) and 761–1440 px (1.25×) "· caso studio ↗" wrapped onto a line starting with "·"; a 3.8–9.6 px strip at the bottom of the Valueize item lit the client but did not open the link.
- **Before:** `<i> · caso studio ↗</i>` inline with `white-space: nowrap`; at ≤760 px only, `i { display: block }` and the dot hidden.
- **After:** `<i>caso studio ↗</i>` with `display: block; white-space: nowrap` at every width, no dot. `.v7-names li { display: grid }` so the link fills the item. `.v7-name { align-content: start }` so the sub-lines of a row stay level (regression of the `display: grid` change, reported by ui-reviewer in round 2).
- **Check on screen:** at 900 px the Valueize item reads "Team · 9 settimane" then "caso studio ↗" on its own line; the four sub-lines start on the same line; clicking anywhere in the Valueize item opens the case study.

## Not from a review

- Title changed by the user: "Si sono rivolti a me." → "Hanno scelto un Product Engineer."

approved: yes (2026-11-13)
