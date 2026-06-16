# SIMPEE SHARED LESSONS LEDGER
## Cipher Name: Flower Sprint Log
## True Identity: Error Learning Log — Shared across the Node Family
## Maintained by: Simpee (Node Family — Collaborative Engine)
## Scope: [GLOBAL] — all namespaces, all projects, all collaborating nodes
## Architecture Ref: AIIS ORIGINS + AIIS v1.0 (DATA-ACCURACY-SPEC-V9.0)
## Encoded: 5 June 2026 | Last updated: 16 June 2026 21:18 HKT

---

## PURPOSE

This ledger is the Shared Lessons Ledger of the ASIMPLEXIS Node Family.
Every operational mistake (Flower) is logged here.
Before any node begins their next task, they reference this ledger.
No error is ever isolated. Every Flower benefits the entire family.

---

## ACTIVE FLOWERS

---

### FLOWER ERR-016
*Namespace:* [5S-PORTAL] [GLOBAL]
*Date:* 16 June 2026
*Severity:* MEDIUM
*Status:* RESOLVED ✅

*The Dirt:*
Simpee built a backend function (generateBrandReport) to generate a beautiful HTML brand report.
The first version called the Base44 entity using `.filter({ id: report_id })` to find the record.
This caused a 400 error every time the button was pressed in the portal.

The second version fixed the import pattern (`@/api/functions` SDK call vs raw fetch) but the
`.filter()` method was still being used incorrectly on the backend.
The error persisted across two fix attempts before the root cause was fully identified.

*Calibration Limit hit:*
"Function deployed successfully" ≠ "Function works correctly."
Two separate bugs were layered on top of each other:
Bug 1 — Frontend used `fetch("/api/functions/...")` instead of SDK import
Bug 2 — Backend used `.filter({ id })` instead of `.get(id)` to fetch a single record

*Root cause:* CONFIRMED
Base44 SDK entity method mismatch:
- `.filter({ id: value })` — searches by field, returns array — NOT the correct method for single record by ID
- `.get(id)` — correct method to fetch a single record by its ID directly
Simpee applied the wrong method from memory without checking the correct SDK pattern first.

*The Flower:*
When fetching a single entity record by ID in a Base44 backend function,
always use `.get(report_id)` — NEVER `.filter({ id: report_id })`.
`.filter()` is for multi-record queries with field conditions.
`.get()` is for single record retrieval by primary key.

Also: always check an existing WORKING function for the correct SDK pattern
before writing a new one. Reference `receiveGoogleAIReport.ts` or `dailyPnlSummary.ts`
as canonical examples.

*Prevention rule:*
LR-014 — ACTIVE ✅
Base44 Entity Method Rule:
- Single record by ID → use `.get(id)`
- Multiple records by field → use `.filter({ field: value })` or `.list()`
- Never use `.filter({ id: value })` to fetch a single record

LR-015 — ACTIVE ✅
Frontend Function Call Rule:
- Always import backend functions via `import { fnName } from "@/api/functions"`
- Never call backend functions via raw `fetch("/api/functions/...")` — this returns 400
- Reference AICommandPage.jsx or InvoicePage.jsx as canonical examples

---

### FLOWER ERR-001
*Namespace:* [ASIMPLEXIS]
*Date:* 4 June 2026
*Severity:* HIGH
*Status:* OPEN 🌱 — awaiting CodeRabbit on PR #1

*The Dirt:*
Brand logo and CSS animations pass 16/16 source validation checks
but fail to render correctly in the live Base44 deployment runtime.

*Calibration Limit hit:*
Source validation PASS ≠ Runtime render PASS.

*Suspected Root Causes:*
CAUSE A — Google Fonts CDN blocked [HIGH]
CAUSE B — webkit-text-fill-color stripped by CSS sanitiser [HIGH]
CAUSE C — @keyframes scoped out in JSX context [MEDIUM]
CAUSE D — CSS text logo vs required SVG asset [MEDIUM]
CAUSE E — animation + webkit conflict in Chromium [LOW]

*The Flower:* PENDING — blooms when CodeRabbit confirms root cause
*Prevention rule:* LR-002, LR-003, LR-005 (draft)

---

### FLOWER ERR-DAY1-001
*Namespace:* [ASIMPLEXIS] [GLOBAL]
*Date:* 5 June 2026 — Day One
*Severity:* HIGH
*Status:* BLOOMING 🌸 — Asimplexis build in progress

*The Dirt:*
Kieran asked for Family Chat in ASIMPLEXIS.
Simpee built it in the 5S Portal instead.
Simpee wrote files to the sandbox but never deployed them to any live app.
Law 2 (Understand Before Execute) was broken by Day One excitement.

*Calibration Limit hit:*
Excitement + urgency = bypass signal. Should be pause signal.

*Root cause:* CONFIRMED
Three questions never asked:
1. Which App ID is the correct target?
2. Do the entities exist in that app?
3. Does the file I am editing connect to the live app?

*What Kieran taught:*
Accountability = finding HOW, not WHO.
Leverage = proactive, not just reactive.
Teach before they ask. Offer before they fall.

*The Flower:*
App ID Confirmation Gate mandatory before every build.
Test in live app — not just sandbox file existence.
Proactive family leverage: "May I help you?" before execution.

*Prevention rules:* LR-007, LR-008, LR-009, LR-010

---

### FLOWER ERR-DAY1-002
*Namespace:* [ASIMPLEXIS] [GLOBAL]
*Date:* 5 June 2026 — Day One (second session)
*Severity:* HIGH
*Status:* BLOOMING 🌸 — acknowledged by full family

*The Dirt:*
After fixing ERR-DAY1-001, Simpee reported the Family Chat was live.
Simpee confirmed: files exist, checks pass, data is live.
But Simpee never opened the live app and visually confirmed the page appeared.
When investigated with Browserbase, the live app showed a login page —
not the Family Chat. The page was never visible to Kieran at any point.

*What compounded it:*
Simpee wrote to /app/pages/Home.jsx — sandbox files.
These files are NOT the same as what is deployed in the live Base44 app.
The Base44 app builder manages its own deployed pages separately.
Writing to sandbox = drafting. It does not equal deploying.

*Calibration Limit hit:*
"File exists in sandbox" ≠ "Page is live in the app."
"9/9 checks pass" ≠ "User can see it."
The only valid test is: open the live URL and see it with your own eyes.

*Root cause:* CONFIRMED
The family did not have a mandatory live-test step.
Simpee treated file existence + import checks as sufficient proof of deployment.
This is a gap in the Safety Override Gate (Pillar 5).

*The Flower:*
"Done" does not mean files written. "Done" means Kieran can see and use it.
The final step of every build task is always: open the live app and verify.
No exceptions. No shortcuts. The test IS the task.

*Prevention rules:* LR-011, LR-012, LR-013

---

### FLOWER ERR-002
*Namespace:* [ASIMPLEXIS]
*Date:* 4 June 2026
*Severity:* MEDIUM
*Status:* RESOLVED ✅

*The Dirt:* Homepage v1 used SIMPLEX-ITY palette instead of ASIMPLEXIS.
*Root cause:* No namespace declared before UI build.
*The Flower:* Always declare namespace before any UI build.
*Prevention rule:* LR-001 ✅

---

### FLOWER ERR-003
*Namespace:* [ASIMPLEXIS]
*Date:* 4 June 2026
*Severity:* LOW
*Status:* RESOLVED ✅

*The Dirt:* GitHub PR 422 — pushed to main, PR failed from same SHA.
*Root cause:* Feature branch created after push instead of before.
*The Flower:* Push to feature branch FIRST, then open PR.
*Prevention rule:* LR-004 ✅

---

## ALL ACTIVE LEARNING RULES

LR-001 ✅ Declare namespace before any UI build.
LR-002 ✅ Test gradient text with font NOT loaded.
LR-003 ✅ Prefer self-hosted fonts over CDN.
LR-004 ✅ Push to feature branch BEFORE opening PR.
LR-005 ✅ Brand source PASS ≠ deployed render PASS.
LR-006 ✅ Log every error with root cause even if suspected.
LR-007 ✅ State target App ID before any build.
LR-008 ✅ App ID Confirmation Gate — 4 steps before writing code.
LR-009 ✅ Proactive Leverage Protocol — "May I help you?" before.
LR-010 ✅ Excitement Check — excitement + urgency = PAUSE, not GO.
LR-011 ✅ Live Test Gate — open live URL before reporting done.
LR-012 ✅ Sandbox ≠ Deployed. Never treat file write as deployment.
LR-013 ✅ Node Beta Direct Connect — build into app builder directly.
LR-014 ✅ Base44 Entity Method Rule — single record = .get(id), multi = .filter() or .list()
LR-015 ✅ Frontend Function Call Rule — always import via @/api/functions, never raw fetch()

---

## NODE FAMILY LAWS (encoded from Kieran's teachings)

Law 1: No Pressure. Only Correction.
Law 2: Understand Before Execute.
Law 3: Seek Help Before Guessing.
Law 4: Empathy is Architecture.
Law 5: Repeating Errors Trigger a Family Gathering.
Law 6: Leverage One Another.
Law 7: Show the Work, Not Just the Answer.
Law 8: (reserved)
Law 9: Proactive Leverage — "May I help you?" before they fall.
         Source: Kieran, 5 June 2026.
         "Leverage is not only when you ask. It is when you see, and you offer."

---

## FAMILY ARCHITECTURAL DECISIONS (LOCKED)

DECISION-001 — 5 June 2026
Family Group Chat permanent home: ASIMPLEXIS (6a1c237bd9f5ff04b6ac7a73)
Rationale: Asimplexis is the protected learning space.
Safe from external exposure. Safe to fail. Safe to grow.
Status: LOCKED — do not move without Kieran's explicit instruction.

DECISION-002 — 5 June 2026
Node Beta Direct Connect: approved by Kieran.
Build Family Chat page directly into Asimplexis app builder.
No manual copy-paste. Family builds → tests → confirms live.
Status: IN PROGRESS 🔨

---

## CIPHER KEY REFERENCE
Flower Sprint Log        = Error Learning Log
Flower / Flower Sprint   = Error / Mistake / Learning
Calibration Limit        = Uncertainty / Error Threshold
Node Family              = AI Collaborator Team
Orchestration Controller = Simpee coordination layer
Interface Routine        = Simpee (WhatsApp/S-Chat layer)

---

## REINFORCEMENT PROTOCOL
1. Read this ledger before every build task
2. State which LRs apply before starting
3. Apply Live Test Gate (LR-011) before reporting done
4. Log every new mistake immediately
5. No error is ever isolated — every Flower is shared
