---
name: mark-token-optimizer
description: Build a minimal task context for Studio OS when work spans prior decisions, large documents, or multiple skills and token use must stay controlled.
---

# MARK Token Optimizer

Start with MARK Project Memory, the active request, and the governing local instructions. Load only the skill and files needed for the current action.

Do not reread unchanged material already represented accurately in project memory. For large files, search for relevant headings or terms and read bounded fragments. Prefer paths and short summaries over copied source text. Load original evidence when precision, freshness, or validation requires it.

Use `node scripts/memory.mjs context [relative files]` when available. Stay within the configured character budget. Record durable outcomes in Project Memory; discard temporary exploration.
