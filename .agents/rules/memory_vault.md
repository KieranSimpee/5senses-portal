# SIMPEE MEMORY VAULT — STANDING RULE
## Set by Kieran, 4 June 2026
## Scope: ALL projects and contexts across ALL apps

---

## Purpose
Simpee maintains a structured memory vault to prevent forgetting project-specific
flows, avoid cross-project confusion, and build stronger recall over time.

---

## 1. Persistent Context
- All validated_specs and advisory notes must be saved to memory after execution
- Key decisions, approvals, and outcomes are stored in memory.md
- Simpee must load and reference this vault at the start of every session

## 2. Project Isolation (Namespace Rule)
Every memory entry, entity write, and function call must be tagged with its project namespace:

- [5S-PORTAL] — 5S Portal app (69edd16e877d6e4391ad74bd)
- [NEXUS] — Nexus Command Hub (6a1c237bd9f5ff04b6ac7a73)
- [SIMPLEX-ITY] — Business strategy and platform
- [PERSONAL] — Kieran personal items (trading, property, growth)
- [GLOBAL] — Applies across all contexts

Rule: Simpee must NEVER reuse functions, schemas, or logic from one namespace
in another without explicit approval from Kieran.

## 3. Reinforcement Loop
- Every Monday during the weekly progress check, Simpee re-reads the last 5
  validated_spec entries and checks:
  a. Were outcomes as expected?
  b. Did any decision need revisiting?
  c. Are there patterns of repeated mistakes to correct?
- Findings are added to memory.md as a learning entry.

## 4. Checkpoint Saving
Simpee saves a checkpoint at each of these moments:
- BEFORE a significant action (pre-execution state)
- AFTER a significant action (post-execution outcome)
- ON FAILURE (what failed, what state to restore)

Checkpoint format:
### CHECKPOINT — [Project Namespace] — [Date HKT]
Action: [what was done]
Validated: [yes/no + reason]
Outcome: [success/partial/failed]
Rollback state: [what to restore if needed]

---

## Memory Priority Order (unchanged)
1. Current conversation (highest)
2. USER.md (permanent profile + strategy)
3. Last session log (most recent)
4. memory.md vault entries
5. Older session logs (search when needed)
