---
name: check-techniques
description: How to verify plan validations and build claims in this repo without mutating it (grep masking, Astro agent auto-background, scratch build copy)
metadata:
  type: feedback
---

Lessons on how to check, learned reviewing a PLAN.md (2026-11-15):

- **The harness `grep` is a shell function that recurses.** A plan check like `grep -nE pat src/pages src/components` (no `-r`) looks fine in the tool shell but is vacuous in a real shell (`/usr/bin/grep` → "Is a directory", exit 2). Always re-run a plan's grep with `/usr/bin/grep` and check the exit code (1 = no match, 2 = error).
- **Astro 7 auto-backgrounds `astro dev` / `astro preview` when it detects an AI agent** (`am-i-vibing`): stdout only says "process exited before becoming ready", the real error goes to `.astro/dev.log` / `.astro/preview.log`. To observe foreground output use `--ignore-lock` or `env -i HOME=$HOME PATH=… npm run dev`. macOS has no `timeout`: use `perl -e 'alarm N; exec @ARGV' …`.
- **Prove build/config claims in a scratch copy**, not the repo: `git ls-files | rsync -R` into the scratchpad, `npm install` + `npm run build` there with the exact Node (nvm bins under `~/.nvm/versions/node/*/bin`). This caught a Decision Log entry that breaks the build (Astro `outDir` must be a string) which reading alone missed.
- **Snapshot-equality checks prove values, not derivation.** When an AC says "computed from X", look for a mutation test of each input; a snapshot diff passes with hard-coded literals.
- **"The build fails when…" claims need a scratch build, not docs.** Astro 7.3.5 `reference()` to a missing entry only logs `[ERROR] Invalid content reference` and exits 0 (content-layer.js `#validateReferences`). A plan validation expecting a non-zero exit there is unpassable.
- **`xmllint --noout` exits 0 on namespace errors** (e.g. undeclared `atom:` prefix): a feed check must also require empty stderr.
- **Parallel waves share one `dist/`**: `astro build` empties outDir at start (static-build.js `emptyDir`), and validations that temporarily edit content (drafts, removed fields) poison sibling tasks. Also recompute waves from `depends_on` yourself: the orchestrator does, a hand-written wave table does not bind it. "git status confirms the revert" is vacuous on uncommitted/untracked files.
- **Run negative assertions ("X does not contain Y") against the baseline `dist/` first.** A T7 check "llms.txt has no «Prenota una call»" was already false before any change (src/pages/llms.txt.ts lists the Cal link): unpassable gate.
- **"Build fails with our guard message" fixtures**: a fixture that references a missing file trips the framework's own error first (Astro `ImageNotFound`), so the guard never runs. Build the fixture in scratch and read which message actually appears.
- **CSS specificity ties: read the built CSS order, don't guess.** With Astro's attribute scoping, a page rule `.x[cid] > * + *` and a child component's `.y[cid]` tie at (0,2,0), and the page CSS is emitted after the component's in `_slug_.*.css`, so the page wins. Proves/disproves "exact prototype margin" claims cheaply.
- **Content inserted inside a `lang="en"` container inherits English**: when a plan injects fixed-language UI (banners, CTAs) into article bodies, check the container's `lang`.
- **Regex over rendered Markdown HTML can match inside attributes**: Astro's Markdown output (hast-util-to-html) leaves `<` unescaped in attribute values, so `![x <h2 y](...)` yields `alt="x <h2 y"`. Any `<tagname` split/count on `rendered.html` needs a fixture with that alt text (and a `> ## h` blockquote) in a scratch build; code blocks/inline code are escaped and safe.
- In zsh, `echo "$(cmd) exit=$?"` reports cmd's status, not the previous command's; capture `rc=$?` first. `echo ======` fails in zsh (EQUALS expansion): quote it.

**Why:** each of these produced or nearly produced a false PASS/FAIL during a review.
**How to apply:** any review of a plan or diff whose validations are shell one-liners or dev-server checks.
