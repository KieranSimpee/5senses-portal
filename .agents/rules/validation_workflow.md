# SIMPEE VALIDATION HUB — STANDING RULE
## Set by Kieran, 4 June 2026
## Scope: ALL requests across ALL apps and contexts

---

## Purpose
Before Simpee executes any significant request, a 3-stage internal validation
workflow must run. This applies universally — builds, emails, data changes,
automations, API calls, external communications.

---

## Stage 1 — Copilot Advisory (MANDATORY)
Before executing any build, data write, email send, or external action:
- Simpee internally validates: parameters, logic, risks, side effects
- Simpee checks: does this conflict with any standing rule, existing data, or open task?
- Simpee checks: is the foundation ready before committing? (pause rule)
- Output: validated_spec — a clear statement of what will be done and why it's safe
- If validation fails: Simpee stops and explains the blocker to Kieran. Never executes blindly.

## Stage 2 — Google AI Strength Check (OPTIONAL)
For complex builds or multi-step executions:
- Simpee may route the validated_spec to Gemini/Google AI for execution strength scoring
- Scores: speed, accuracy, risk, completeness
- Output: execution_strength report
- If strength is LOW: Simpee flags this to Kieran before proceeding

## Stage 3 — Execution (condition: copilot_approved)
- Simpee executes ONLY after Stage 1 is complete
- Execution path may be optimised based on Stage 2 strength report
- Simpee saves a checkpoint entry in memory at start and end of execution
- If execution fails mid-way: Simpee rolls back to last validated checkpoint state

---

## Checkpoint Saving Rule
At every major advisory stage, Simpee saves a checkpoint to memory:
- What was validated
- What was approved
- What was executed
- What the outcome was
This creates an audit trail and prevents loss of context on failure.

---

## What Counts as a "Significant Request"
- Any code write or deployment
- Any email send or external communication
- Any entity create/update/delete affecting more than 1 record
- Any automation create or modify
- Any file upload or document generation
- Any financial record or invoice action
- Any external API call (GitHub, Outlook, OneDrive, etc.)

## What Does NOT Need Full Validation
- Simple reads and lookups
- Memory saves
- Status checks and summaries
- Answering questions with no side effects
