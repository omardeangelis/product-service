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
- In zsh, `echo "$(cmd) exit=$?"` reports cmd's status, not the previous command's; capture `rc=$?` first. `echo ======` fails in zsh (EQUALS expansion): quote it.

**Why:** each of these produced or nearly produced a false PASS/FAIL during a review.
**How to apply:** any review of a plan or diff whose validations are shell one-liners or dev-server checks.
