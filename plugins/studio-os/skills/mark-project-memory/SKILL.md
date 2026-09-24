---
name: mark-project-memory
description: Maintain the concise durable project state for Studio OS when decisions, completed work, constraints, artifacts, or next actions change.
---

# MARK Project Memory

Read `local/project-state.json` first when it exists. Treat it as a concise index, then verify any fact that matters against the named artifact or current system state.

Update the memory after a meaningful project change. Keep only objective, current stage, accepted decisions, completed outcomes, constraints, artifact paths, open questions, and next actions. Replace stale entries instead of appending a transcript. Never store secrets, credentials, personal data, hidden reasoning, or large source text.

Use `node scripts/memory.mjs` when available. Keep the state valid JSON and preserve fields from `templates/project-state.json`.
