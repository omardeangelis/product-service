---
domain: _root
type: index
links: []
created: 2026-11-12
updated: 2026-11-12
---

# Brain — Log

Append-only ingest/spec log. Newest first. Cap at 50 entries; drop the oldest when over.

<!-- Entries are appended by create-spec (spec creation) and docs-maintenance (ingest). Format:

## [YYYY-MM-DD] ingest | <spec title>
- Source: [[specs/<domain>/<spec>/SPEC]]
- Flows written: <count>
- Concepts written: <count>
-->

## [2026-11-12] init | brain bootstrap
- brain-manager 0.10.0, fresh init, provider: claude, review.mode: plan
- Stack profile: [[chore/motion-stack]] (Astro 7.3 + React islands, motion 14)
