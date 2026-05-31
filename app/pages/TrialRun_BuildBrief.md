# NEXUS COMMAND — TRIAL RUN BUILD BRIEF
## What to build for the frontend to test the full workflow
## Paste this into the Nexus Command builder AI

---

### GOAL
Allow Kieran to test the complete workflow end to end:
Submit a question → AI responds → Validation fires → Log written → Sandbox project saved

This is a SCOPED trial run — only 4 things need to work. No new pages. No big changes.

---

### WHAT TO BUILD — 4 items only

---

#### 1. CHAT INPUT → aiCommandCentre (fix the wiring)

The aiCommandCentre function exists but returns 400 because the frontend
is not sending the right payload shape.

The function expects:
```json
{
  "instruction": "user's message text",
  "posted_by": "Kieran",
  "model": "ORCHESTRATOR"
}
```

Fix the fetch call in CommandAIHub.jsx so it sends exactly this shape.
The function URL is: /api/run/aiCommandCentre

On success the function returns:
```json
{
  "success": true,
  "analysis": "...",
  "solution": "...",
  "code": "...",
  "builder_instruction": "...",
  "model": "ORCHESTRATOR"
}
```

Display the response in the centre panel as a response card.
Show: analysis first, then solution, then code block (if code exists).
Label the card with the duty name from response.model.

---

#### 2. TESTLOG — auto-write after every response

After every successful aiCommandCentre response, write one TestLog record:
```json
{
  "test_name": "Trial Run — [first 40 chars of instruction]",
  "status": "pass",
  "result": "aiCommandCentre responded. Model: [model]. Analysis received.",
  "tested_at": "[ISO timestamp]",
  "fixed": false,
  "validator": "Simpee"
}
```

This confirms checkpoint 3 (aiCommandCentre responds) is logged automatically.

---

#### 3. SANDBOX PROJECT CARD — show in right panel

SandboxProject entity already has 1 record seeded (Trial Run project).
In the right panel, below the code preview, add a slim card:

SANDBOX PROJECT
Name: [project name]
Status badge: DRAFT (grey) / TESTING (amber) / APPROVED (green)
[SAVE CODE TO SANDBOX] button — saves the latest code response
as a ProjectFile record linked to this project.

ProjectFile fields to write:
```json
{
  "project_id": "[sandbox project id]",
  "filename": "response_[timestamp].ts",
  "content": "[code from aiCommandCentre response]",
  "language": "typescript",
  "version": "1.0",
  "notes": "Saved from trial run"
}
```

---

#### 4. CONSULTCOPILOT — wire the validate button

consultCopilot function exists. It also returns 400 because of wrong payload.

It expects:
```json
{
  "code": "the code string to validate",
  "context": "brief description of what the code does"
}
```

Fix the [RUN VALIDATION] button in the Gatekeeper Panel to send this shape.
On response — update the 4 check rows (Syntax / Logic / Security / Azure)
based on the returned result.
Write 4 TestLog records — one per check — with validator: "Copilot".

---

### WHAT NOT TO CHANGE
- Do not touch the left panel AI selector
- Do not rebuild the layout
- Do not add new pages
- Do not change the entity schemas

---

### DESIGN SYSTEM
- Background: #e8e6fe
- Accent: #5e50fb
- Azure (Gatekeeper): #0078d4
- Headlines: Exo 2
- Body: Montserrat
- No emoji

---

### TEST CHECKLIST (what Kieran will test after build)
1. Type a message → aiCommandCentre responds with analysis + solution
2. TestLog has a new record after the response
3. [SAVE CODE TO SANDBOX] saves a ProjectFile record
4. [RUN VALIDATION] fires consultCopilot and updates the 4 check rows
5. All 4 Gatekeeper checks write to TestLog with validator=Copilot

That's the full trial run. If all 5 pass — the core workflow is proven. ✅
