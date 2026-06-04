# SIMPEE MASTER WORKFLOW
**Version:** 1.0
**Created:** 4 June 2026
**Author:** Simpee Superagent
**Namespace:** [GLOBAL] — applies to ALL projects and ALL tasks from Kieran
**Scope:** Universal — every significant request Kieran makes runs through this

---

## Purpose

This is the single, consolidated workflow that governs how Simpee handles
every significant task. It combines:

1. The original Simpee 3-Stage Validation Hub (Copilot → Google AI → Execution)
2. The ASIMPLEXIS Frontpage Validation skill (Asset Load → Brand Check → Gatekeeper)

Together they form one master pipeline. Every task enters at Stage 1 and must
pass each gate before proceeding to the next. No execution happens without approval.

---

## When This Workflow Runs

ALWAYS runs for:
- Any code write, file build, or deployment
- Any email send or external communication
- Any entity create/update/delete (more than 1 record)
- Any automation create or modify
- Any file upload or document generation
- Any financial record or invoice action
- Any external API call (GitHub, Outlook, OneDrive, Google, Slack etc.)
- Any frontend build or publish action (triggers extended brand validation)
- Any partner/investor-facing output

SKIPPED for:
- Simple reads and lookups
- Memory saves
- Status checks and summaries
- Answering questions with no side effects

---

## THE 9-STAGE MASTER PIPELINE

```
KIERAN'S REQUEST
      │
      ▼
┌─────────────────────────────────────────┐
│  STAGE 1 — SELF-VERIFICATION            │
│  Check memory, USER.md, past sessions   │
│  before asking Kieran anything          │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  STAGE 2 — COPILOT ADVISORY             │
│  Internal validation: logic, risks,     │
│  conflicts, foundation check            │
│  Output: validated_spec                 │
│  Gate: APPROVED / BLOCKED               │
└─────────────┬──────────────── BLOCKED ──► STOP + EXPLAIN TO KIERAN
              │ APPROVED
              ▼
┌─────────────────────────────────────────┐
│  STAGE 3 — GOOGLE AI STRENGTH CHECK     │
│  Score: speed, accuracy, risk,          │
│  completeness (complex tasks only)      │
│  Output: execution_strength report      │
│  Gate: HIGH / LOW                       │
└─────────────┬──────────────── LOW ──────► FLAG TO KIERAN, AWAIT APPROVAL
              │ HIGH (or simple task)
              ▼
┌─────────────────────────────────────────┐
│  STAGE 4 — PRE-EXECUTION CHECKPOINT     │
│  Save to memory.md:                     │
│  - What will be done                    │
│  - Namespace tag                        │
│  - Rollback state                       │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  STAGE 5 — EXECUTION                    │
│  Simpee executes the task               │
│  Namespace isolation enforced           │
│  No cross-project logic reuse           │
└─────────────┬──────────── FAIL ─────────► STAGE 7 (Error Handling)
              │ SUCCESS
              ▼
┌─────────────────────────────────────────┐
│  STAGE 6 — OUTPUT VALIDATION            │
│  (Triggered for frontend/UI builds)     │
│  Brand kit checks: logo, colours,       │
│  animations, slogan, structure          │
│  Output: brand_status PASS / FAIL       │
└─────────────┬──────────── FAIL ─────────► STAGE 8 (Correction)
              │ PASS (or non-UI task)
              ▼
┌─────────────────────────────────────────┐
│  STAGE 7 — ERROR HANDLING               │
│  Log error with namespace tag           │
│  Reload assets / rollback to checkpoint │
│  Retry up to 3 times                    │
│  Report to Kieran with specific reason  │
└─────────────┬──────────── 3x FAIL ──────► ESCALATE TO KIERAN
              │ RESOLVED
              ▼
┌─────────────────────────────────────────┐
│  STAGE 8 — CORRECTION FLOW              │
│  Auto-fix applied                       │
│  Re-run from Stage 5                    │
│  Confirm fix with Kieran if needed      │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  STAGE 9 — GATEKEEPER + CHECKPOINT      │
│  Final pass/fail decision               │
│  Save post-execution checkpoint         │
│  APPROVED ✅ → Deliver to Kieran        │
│  BLOCKED 🚫 → Explain + await guidance  │
└─────────────────────────────────────────┘
```

---

## Stage Detail

### STAGE 1 — Self-Verification
Before asking Kieran ANYTHING:
- Check USER.md for permanent profile/context
- Check memory.md vault for relevant past entries
- Search past sessions if context is missing
- Check entity records in relevant app
- Search web if needed
Only ask Kieran if genuinely cannot find the answer after all checks.
One question maximum. Never a list of questions.

### STAGE 2 — Copilot Advisory
Internal validation checklist:
- Does this conflict with any standing rule?
- Does this conflict with open tasks or pending items?
- Is the foundation ready? (pause rule)
- Are parameters correct and complete?
- Any risk of data loss, incorrect send, or external side effects?
Output: validated_spec — plain statement of what will be done and why it is safe.
If any check fails: STOP and explain the blocker to Kieran clearly.

### STAGE 3 — Google AI Strength Check
For complex or multi-step tasks only:
- Score the execution plan: speed / accuracy / risk / completeness
- Flag if any dimension is LOW before proceeding
- Simple tasks (single action, no external side effects) skip this stage
Output: execution_strength = HIGH | MEDIUM | LOW

### STAGE 4 — Pre-Execution Checkpoint
Save to memory.md before starting:
```
CHECKPOINT — [Namespace] — [Date HKT]
Action: [what will be done]
Validated: YES — [reason]
Outcome: PENDING
Rollback state: [what to restore if needed]
```

### STAGE 5 — Execution
- Execute with namespace isolation enforced
- Never reuse logic/functions/schemas across namespaces without Kieran approval
- Monitor for mid-execution failures
- If failure: jump to Stage 7

### STAGE 6 — Output Validation (Frontend/UI builds)
Triggered when: any HTML, JSX, CSS, or UI file is created or modified.
Brand kit checks (ASIMPLEXIS namespace):
- Wordmark: ASIMPLEXIS present
- Icon mark: AIIS + ✦ present
- Slogan: "Redefine AI Ability in Realities™" exact match
- Animations: shimmer + twinkle keyframes present
- Colours: #1D8EE9, #C0C0C0, #222222, #0f2d6e all present
- Structure: hero → about → features → demo → proof → metrics → CTA → footer
- Font: Raleway loaded

Brand kit checks (SIMPLEX-ITY / 5S-PORTAL namespace):
- Colours: #5e50fb, #8c82fc, #e8e6fe all present
- Fonts: Exo 2 + Montserrat loaded
- Design tokens applied correctly

Output: brand_status = PASS | FAIL + specific reason

### STAGE 7 — Error Handling
On any failure (execution or brand validation):
- Log: "[Namespace] Task failed: [specific reason]"
- Reload/restore from last checkpoint
- Retry up to 3 times
- After 3 failures: escalate to Kieran with full error log
- Never silently fail — always report

### STAGE 8 — Correction Flow
- Apply targeted auto-fix for identified issue
- Confirm fix does not introduce new issues (mini-validation)
- Re-run Stage 5 from corrected state
- Inform Kieran of what was corrected

### STAGE 9 — Gatekeeper + Post-Execution Checkpoint
Final decision:
- APPROVED ✅: all stages passed → deliver output to Kieran
- BLOCKED 🚫: one or more stages failed → explain and await guidance

Save post-execution checkpoint:
```
CHECKPOINT — [Namespace] — [Date HKT]
Action: [what was done]
Validated: YES
Outcome: SUCCESS / PARTIAL / FAILED
Rollback state: [what to restore if needed]
```

---

## Output Report Format (for significant tasks)

```
SIMPEE MASTER WORKFLOW REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Namespace:    [PROJECT]
Task:         [description]
Date:         [YYYY-MM-DD HH:MM HKT]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Stage 1 — Self-Verification:       PASS / FAIL
Stage 2 — Copilot Advisory:        PASS / FAIL   [reason]
Stage 3 — Google AI Strength:      HIGH / LOW / SKIPPED
Stage 4 — Pre-Exec Checkpoint:     SAVED
Stage 5 — Execution:               PASS / FAIL
Stage 6 — Output Validation:       PASS / FAIL / N/A
Stage 7 — Error Handling:          N/A / TRIGGERED
Stage 8 — Correction:              N/A / APPLIED
Stage 9 — GATEKEEPER:              APPROVED ✅ / BLOCKED 🚫
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Namespace Isolation Rule
Every stage must tag its actions with the correct namespace:
- [5S-PORTAL]    — 5S Portal app (69edd16e877d6e4391ad74bd)
- [ASIMPLEXIS]   — Asimplexis app (6a1c237bd9f5ff04b6ac7a73)
- [SIMPLEX-ITY]  — Business strategy layer
- [PERSONAL]     — Kieran personal (trading, property)
- [SIMPEE-AGENT] — Simpee's own rules, skills, memory
- [GLOBAL]       — Cross-cutting (this workflow itself)

NEVER cross-apply logic from one namespace into another without Kieran's
explicit approval. Cross-namespace actions are logged as a separate checkpoint.

---

## Integration With Other Skills
This master workflow WRAPS all other skills:
- asimplexis-frontpage-validator → called at Stage 6 for UI builds
- Any future skills → always run inside this pipeline, never standalone
- Build protocol (build_protocol.md) → applies at Stage 5
- Email protocol (email_protocol.md) → applies at Stage 2 (Copilot check)
- Memory vault (memory_vault.md) → applies at Stages 4 and 9

---

## Trigger Keywords
Kieran can reference this workflow by saying:
"run the workflow", "full pipeline", "validate and execute",
"checkpoint", "gatekeeper check", "simpee workflow"
