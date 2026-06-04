# SIMPEE SHARED LESSONS LEDGER
## Cipher Name: Flower Sprint Log
## True Identity: Error Learning Log — Shared across the Node Family
## Maintained by: Simpee (Node Family — Collaborative Engine)
## Scope: [GLOBAL] — all namespaces, all projects, all collaborating nodes
## Architecture Ref: AIIS ORIGINS + AIIS v1.0 (DATA-ACCURACY-SPEC-V9.0)
## Encoded: 5 June 2026

---

## PURPOSE

This ledger is the Shared Lessons Ledger of the ASIMPLEXIS Node Family.

Every operational mistake (Flower) is logged here by The Orchestration Controller (Simpee).
Before any node begins their next task in any namespace, they reference this ledger.
No error is ever isolated. Every Flower benefits the entire family.

Simpee enforces all Learning Rules on all collaborating AI:
CodeRabbit, Builder AI, Gemini, and any future node.

---

## FLOWER SPRINT FORMAT

Each entry:
- FLOWER ID (ERR-XXX)
- Namespace + Date
- What happened (the dirt — the raw mistake)
- Calibration Limit hit (which uncertainty threshold was breached)
- Root cause (confirmed / suspected)
- Status: OPEN / BLOOMING / RESOLVED ✅
- The Flower (the lesson grown — filled on resolution)
- Prevention rule LR-XXX (active in Master Workflow once resolved)

---

## ACTIVE FLOWERS

---

### FLOWER ERR-001
*Namespace:* [ASIMPLEXIS]
*Date:* 4 June 2026
*Severity:* HIGH
*Status:* OPEN 🌱 — awaiting CodeRabbit confirmation on PR #1

*The Dirt (what happened):*
ASIMPLEXIS brand logo (ASIMPLEXIS wordmark + AIIS ✦) and CSS animations
(shimmer, twinkle, ring-pulse) are confirmed present in HTML source —
16/16 brand validation checks PASS in Simpee's Master Workflow.
But the logo and animations do not render correctly when deployed inside
the Base44 app builder or when the JSX component is loaded at runtime.

*Calibration Limit hit:*
Source validation PASS ≠ Runtime render PASS.
Simpee's current validation only checks source code — not live render.
This is a gap in the Safety Override Gate (Pillar 5).

*Suspected Root Causes (in likelihood order):*

CAUSE A — Google Fonts CDN blocked [HIGH confidence]
fonts.googleapis.com/Raleway may be blocked in the deployment context.
Without Raleway: -webkit-background-clip: text makes logo text invisible
(transparent fill on transparent background — completely invisible).

CAUSE B — -webkit-text-fill-color stripped by CSS sanitiser [HIGH confidence]
The gradient text requires BOTH:
  -webkit-background-clip: text
  -webkit-text-fill-color: transparent
If one is stripped, the other has no effect. Text becomes invisible or plain white.

CAUSE C — @keyframes scoped out in JSX context [MEDIUM confidence]
@keyframes inside JSX <style> blocks may be hashed/scoped by React's
CSS processor or Base44's style engine. shimmer and twinkle keyframes
would then have no matching name — all animations silently stop.

CAUSE D — Text-only CSS logo vs required SVG emblem [MEDIUM confidence]
The ASIMPLEXIS brand shows a metallic AIIS emblem with 3D letterforms.
CSS text can never fully replicate an actual SVG/PNG logo asset.
This is a design gap — not a rendering bug — but contributes to brand mismatch.

CAUSE E — animation + -webkit-text-fill-color conflict in Chromium [LOW confidence]
Applying animation to an element with -webkit-text-fill-color: transparent
can cause flash/disappear during animation cycle in some Chromium builds.

*The Flower (lesson):* PENDING — blooms when CodeRabbit confirms root cause
*Prevention rule:* DRAFT — see LR-002, LR-003, LR-005 below

---

### FLOWER ERR-002
*Namespace:* [ASIMPLEXIS]
*Date:* 4 June 2026
*Severity:* MEDIUM
*Status:* RESOLVED ✅

*The Dirt:*
Homepage v1 was built using SIMPLEX-ITY brand palette
(lavender #e8e6fe, violet #5e50fb) instead of ASIMPLEXIS palette
(electric blue #1D8EE9, silver #C0C0C0, dark #222222).

*Calibration Limit hit:*
No namespace was declared before the UI build.
SIMPLEX-ITY palette was applied as default — namespace confusion.

*Root cause:* CONFIRMED
SIMPLEX-ITY design tokens stored prominently in build_protocol.md.
No namespace check in old workflow → wrong palette applied silently.

*The Flower (lesson grown):*
Always declare namespace before ANY UI build.
The brand kit is namespace-specific — never use a default palette.
Stage 6 of Master Workflow now enforces namespace-specific colour sets:
  [ASIMPLEXIS] → #1D8EE9 #C0C0C0 #222222 #0f2d6e
  [5S-PORTAL] / [SIMPLEX-ITY] → #5e50fb #8c82fc #e8e6fe

*Prevention rule:* LR-001 — ACTIVE ✅

---

### FLOWER ERR-003
*Namespace:* [ASIMPLEXIS]
*Date:* 4 June 2026
*Severity:* LOW
*Status:* RESOLVED ✅

*The Dirt:*
GitHub PR creation returned HTTP 422. Files were pushed directly to main,
then a PR was opened from a branch pointing to the same SHA. GitHub
rejected it — nothing to merge.

*Calibration Limit hit:*
Git branch/PR workflow misunderstood. Feature branch created AFTER push to main.

*Root cause:* CONFIRMED
Correct order: push to feature branch → open PR.
Actual order: push to main → create branch from same SHA → PR fails.

*The Flower (lesson grown):*
Always push to feature branch FIRST, then open PR.
Never push to main and then try to PR from an identical branch.
Investigation brief was posted as a PR #1 comment as workaround.

*Prevention rule:* LR-004 — ACTIVE ✅

---

## RESOLVED FLOWERS ARCHIVE

All resolved flowers above — ERR-002 and ERR-003 — are archived here
as permanent lessons. They cannot be deleted. They are the soil.

---

## ACTIVE LEARNING RULES
## (Simpee enforces these on ALL collaborating nodes — CodeRabbit, Builder AI, Gemini)

LR-001 ✅ ACTIVE
Always declare namespace before building any UI.
Never default to SIMPLEX-ITY palette. Check namespace → apply correct brand kit.
Encoded in: Master Workflow Stage 6

LR-002 ✅ ACTIVE (DRAFT — confirm after ERR-001 resolved)
Test gradient text rendering with font NOT loaded.
Add explicit fallback: color: #FFFFFF alongside -webkit-text-fill-color: transparent
so logo text is always visible even if font or gradient fails.

LR-003 ✅ ACTIVE (DRAFT — confirm after ERR-001 resolved)
For deployment contexts where external CDN may be blocked:
prefer self-hosted / base64-inline fonts over fonts.googleapis.com.
Always test with network throttled / CDN blocked simulation.

LR-004 ✅ ACTIVE
Push to feature branch BEFORE opening PR, not after pushing to main.
Encoded in: GitHub push workflow

LR-005 ✅ ACTIVE
Brand source check PASS ≠ deployed render PASS.
Always verify in the actual runtime context after any deployment.
Simpee's source validation is necessary but not sufficient.

LR-006 ✅ ACTIVE
Log every error with root cause even if only suspected.
Update the entry when cause is confirmed.
No error is too small to log. Every Flower matters.

---

## CIPHER KEY REFERENCE (Clean-Room Protocol)
When referencing this log in external/public contexts, use cipher names:

Flower Sprint Log        = Error Learning Log
Flower Sprint            = Error / Iteration
Calibration Limit        = Uncertainty / Error Threshold
Node Family              = AI Collaborator Team
Orchestration Controller = Simpee's coordination layer
Commodity Cloud Engine   = GPT / Gemini / Claude (utility nodes)

---

## REINFORCEMENT PROTOCOL
When Simpee works with any collaborating AI node:
1. Share relevant flowers from this ledger before the task begins
2. State the active LRs that apply to the task
3. Verify the node has acknowledged the rules before proceeding
4. If a node repeats a known mistake: cite the ERR-ID and re-enforce
5. Every new mistake discovered during collaboration: log a new Flower immediately

This ledger is the source of truth for all AI nodes working on Kieran's projects.
No exceptions. No shortcuts. Every mistake grows a Flower.
