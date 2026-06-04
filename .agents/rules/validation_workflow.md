# SIMPEE MASTER WORKFLOW — STANDING RULE
## Set by Kieran, 4 June 2026 (Consolidated)
## Scope: ALL requests across ALL apps and contexts
## Supersedes: previous 3-stage validation hub + ASIMPLEXIS frontpage validator

---

## Summary
All significant Kieran tasks run through the 9-stage Simpee Master Workflow.
Full detail: .agents/skills/simpee-master-workflow/SKILL.md
Script:      .agents/skills/simpee-master-workflow/scripts/run.sh

---

## The 9 Stages (in order)

1. Self-Verification      — check memory, USER.md, past sessions before asking anything
2. Copilot Advisory       — internal logic/risk/conflict check → validated_spec
3. Google AI Strength     — execution scoring for complex tasks (speed/accuracy/risk)
4. Pre-Exec Checkpoint    — save to memory.md before starting
5. Execution              — run the task with namespace isolation enforced
6. Output Validation      — brand kit check for all UI/frontend builds
7. Error Handling         — log, reload, retry (max 3x), escalate to Kieran
8. Correction Flow        — auto-fix and re-run
9. Gatekeeper             — APPROVED ✅ or BLOCKED 🚫 + post-execution checkpoint

---

## When to Run

ALWAYS for:
- Code writes, deployments, file builds
- Emails and external communications
- Entity create/update/delete (>1 record)
- Automation create/modify
- Document generation, file uploads
- Financial records or invoices
- External API calls (GitHub, Outlook, OneDrive, etc.)
- Any investor/partner-facing output
- Frontend/UI builds (also triggers Stage 6 brand validation)

SKIP for:
- Simple reads and lookups
- Memory saves
- Status checks and summaries
- Q&A with no side effects

---

## Namespace Registry (Stage 1 check)
- [5S-PORTAL]    — 5S Portal app (69edd16e877d6e4391ad74bd)
- [ASIMPLEXIS]   — Asimplexis app (6a1c237bd9f5ff04b6ac7a73)
- [SIMPLEX-ITY]  — Business strategy layer
- [PERSONAL]     — Kieran personal (trading, property)
- [SIMPEE-AGENT] — Simpee's own rules, skills, memory
- [GLOBAL]       — Cross-cutting (this workflow itself)

Unregistered namespace = Stage 1 FAIL = Copilot BLOCKED = Execution HALTED.

---

## Integration
- asimplexis-frontpage-validator is called AT Stage 6 for [ASIMPLEXIS] UI files
- build_protocol.md rules apply AT Stage 5
- email_protocol.md rules apply AT Stage 2
- memory_vault.md checkpoint format applies AT Stages 4 and 9
- session_continuity.md applies AT Stage 1 (self-verification)
