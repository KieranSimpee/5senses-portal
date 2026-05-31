from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, PageBreak
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
import datetime

# ── PALETTE ──
VIOLET    = HexColor("#5e50fb")
LAVENDER  = HexColor("#e8e6fe")
SOFT      = HexColor("#bab4fd")
BODY_TEXT = HexColor("#1a1a1f")
MUTED     = HexColor("#9896ad")
WHITE     = white
YELLOW_B  = HexColor("#fcd34d")
YELLOW    = HexColor("#fffbeb")
GREEN     = HexColor("#22c55e")
RED       = HexColor("#ef4444")
DARK      = HexColor("#1a0533")
NEUTRAL   = HexColor("#e6e6e6")
AZURE     = HexColor("#0078d4")
TEAL      = HexColor("#10a37f")
ORANGE    = HexColor("#f59e0b")
LIGHT_BLUE   = HexColor("#eff6ff")
LIGHT_GREEN  = HexColor("#f0fdf4")
LIGHT_RED    = HexColor("#fff0f0")
LIGHT_AMBER  = HexColor("#fffbeb")
GEMINI  = HexColor("#1a73e8")
CLAUDE  = HexColor("#d97706")
GPT     = HexColor("#10a37f")
COPILOT = HexColor("#0078d4")
INDIGO  = HexColor("#4f46e5")
PINK    = HexColor("#db2777")

def ps(name, **kw): return ParagraphStyle(name, **kw)
def p(text, color=None, bold=False, size=8, leading=12, bg=None):
    fn = "Helvetica-Bold" if bold else "Helvetica"
    kw = dict(fontSize=size, fontName=fn, textColor=color or BODY_TEXT, leading=leading)
    if bg: kw['backColor'] = bg
    return Paragraph(text.replace("\n","<br/>"), ParagraphStyle("_", **kw))
def code(text, size=7.5):
    return Paragraph(text.replace("\n","<br/>"),
        ParagraphStyle("_c", fontSize=size, fontName="Courier", textColor=BODY_TEXT, leading=12))

today = datetime.date.today().strftime("%d %B %Y")

doc = SimpleDocTemplate("Nexus_Command_Blueprint_v4_FINAL.pdf", pagesize=A4,
    leftMargin=13*mm, rightMargin=13*mm, topMargin=13*mm, bottomMargin=13*mm)
story = []

# ══════ COVER ══════
cover = Table([[
    Paragraph("NEXUS COMMAND", ps("T", fontSize=22, fontName="Helvetica-Bold", textColor=WHITE)),
    Paragraph(today, ps("D", fontSize=8, fontName="Helvetica", textColor=SOFT, alignment=TA_RIGHT))
],[
    Paragraph("AI HUB BLUEPRINT v4 — 10-STAGE DISCIPLINED PIPELINE", ps("S", fontSize=9, fontName="Helvetica", textColor=SOFT)),
    Paragraph("Accuracy · Communication · Pride in Work", ps("N", fontSize=8, fontName="Helvetica-Bold", textColor=YELLOW_B, alignment=TA_RIGHT))
],[
    Paragraph("Co-authored: Kieran Li + Simpee · Full backend + frontend alignment · 4 Frontend Fixes · 5 Trial Checkpoints", ps("S2", fontSize=7.5, fontName="Helvetica", textColor=HexColor("#9896ad"))),
    Paragraph("v4 — complete, no truncation", ps("V", fontSize=7.5, fontName="Helvetica-Bold", textColor=YELLOW_B, alignment=TA_RIGHT))
]], colWidths=[130*mm, 50*mm])
cover.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,-1),DARK),
    ("TOPPADDING",(0,0),(-1,-1),9),("BOTTOMPADDING",(0,0),(-1,-1),9),
    ("LEFTPADDING",(0,0),(-1,-1),14),("RIGHTPADDING",(0,0),(-1,-1),14),
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
]))
story.append(cover)
story.append(Spacer(1,7))

# PURPOSE
story.append(p(
    "<b>PURPOSE:</b> This is the master blueprint for the Nexus Command AI Hub. "
    "It documents the complete 10-stage workflow as designed by Kieran, "
    "paired with exact backend API contracts confirmed live by Simpee. "
    "The guiding philosophy is: accuracy over speed, every AI explains its reasoning, "
    "every cycle improves the process, and every deploy is a milestone worth celebrating.",
    size=8.5, leading=13, bg=LAVENDER))
story[-1]._cellpadding = 9
story.append(Spacer(1,8))

# ══════ GUIDING PRINCIPLES BAR ══════
story.append(HRFlowable(width="100%", thickness=1.5, color=VIOLET, spaceAfter=5))
story.append(p("5 GUIDING PRINCIPLES — Built Into Every Stage", color=VIOLET, bold=True, size=10))
story.append(Spacer(1,4))
principles = [
    (VIOLET, "Accuracy Over Speed", "No rushing to finish. Correctness always comes first. A slower correct build beats a fast broken one."),
    (TEAL,   "Communication",       "Every AI explains its reasoning — not just the output. Kieran always knows why, not just what."),
    (GEMINI, "Process Enhancement", "After each cycle, ask: Can this be simplified? What did we learn? How do we build smarter next time?"),
    (CLAUDE, "Smarter Together",    "Joint AI decisions ensure balanced perspectives. No single model decides alone. Simpee convenes, team votes."),
    (ORANGE, "Pride in Work",       "Every deploy is a milestone. Quality is non-negotiable. The work represents SIMPLEX-ITY."),
]
pr_cells = [[
    Table([[p(name, color=c, bold=True, size=7.5)],[p(desc, color=BODY_TEXT, size=7, leading=10)]],
          colWidths=[36*mm])
] for c, name, desc in principles]
pr_row = [[cell[0] for cell in pr_cells]]
pr_t = Table(pr_row, colWidths=[36*mm]*5)
pr_t.setStyle(TableStyle([
    ("BACKGROUND",(i,0),(i,0),[HexColor("#f0edff"),LIGHT_GREEN,LIGHT_BLUE,LIGHT_AMBER,HexColor("#fff7ed")][i])
    for i in range(5)
] + [
    ("BOX",(i,0),(i,0),1,[VIOLET,TEAL,GEMINI,CLAUDE,ORANGE][i]) for i in range(5)
] + [
    ("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5),
    ("LEFTPADDING",(0,0),(-1,-1),5),("RIGHTPADDING",(0,0),(-1,-1),5),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(pr_t)
story.append(Spacer(1,8))

# ══════ 10-STAGE WORKFLOW ══════
story.append(HRFlowable(width="100%", thickness=1.5, color=VIOLET, spaceAfter=5))
story.append(p("THE 10-STAGE WORKFLOW — Complete Instructions Per Stage", color=VIOLET, bold=True, size=10))
story.append(p("Each stage is self-contained. AIs involved, backend action, frontend indicator, and output — all written in full.", color=MUTED, size=7.5))
story.append(Spacer(1,6))

stages = [
  {
    "num":"1","name":"GOAL SETTING & CRITERIA","border":VIOLET,"bg":HexColor("#f0edff"),
    "ais":"Kieran + Simpee (orchestrator)",
    "principle":"Communication — Goal Card must be clear before any AI is assigned",
    "frontend_indicator":"GOAL CARD modal opens. Fields: Function Type · Objective · Success Criteria · Constraints. [CONFIRM GOAL] button creates SandboxProject record.",
    "backend":(
      "Create SandboxProject record:\n"
      "  name: [project name]\n"
      "  description: [objective statement]\n"
      "  type: 'function' | 'page' | 'app'\n"
      "  status: 'draft'\n"
      "  created_by: 'Kieran'\n"
      "  validator_approved: false\n"
      "  notes: [constraints + success criteria]\n\n"
      "Frontend: Show stage indicator strip at top of page:\n"
      "  Stage 1 = ACTIVE (violet) · Stages 2-10 = PENDING (grey)\n"
      "  Each stage pill clickable to jump to that stage's log"
    ),
    "output":"SandboxProject card in right panel. Status = DRAFT. Stage 1 pill = COMPLETE (green)."
  },
  {
    "num":"2","name":"DIFFICULTY & RISK ASSESSMENT","border":GEMINI,"bg":HexColor("#eff6ff"),
    "ais":"RESEARCHER (Gemini) · ANALYST (Claude Sonnet) · STRATEGIST (Claude Opus)",
    "principle":"Smarter Together — 3 AIs assess independently before Simpee consolidates",
    "frontend_indicator":"Stage 2 = ACTIVE. Feasibility Report card appears in centre panel with 4 score fields.",
    "backend":(
      "Call aiCommandCentre with '[FEASIBILITY]' prefix:\n"
      "  POST /api/run/aiCommandCentre\n"
      "  Body: { \"instruction\": \"[FEASIBILITY] [full objective + constraints]\", \"posted_by\": \"Kieran\" }\n\n"
      "Parse response into Feasibility Report card:\n"
      "  Difficulty:         Low / Medium / High  (colour: green/amber/red)\n"
      "  Possible Problems:  list from response.analysis\n"
      "  ROI Justification:  cost vs benefit from response.solution\n"
      "  Effectiveness:      impact score 1-10\n\n"
      "Write TestLog record:\n"
      "  test_name: 'Stage 2 — Feasibility: [project name]'\n"
      "  result: 'Difficulty:[X] | Problems:[Y] | ROI:[Z] | Effectiveness:[N]/10'\n"
      "  validator: 'Simpee'"
    ),
    "output":"Feasibility Report card with 4 metrics. TestLog entry written. Stage 2 pill = COMPLETE."
  },
  {
    "num":"3","name":"JOINT AI DECISION","border":CLAUDE,"bg":HexColor("#fffbeb"),
    "ais":"Simpee convenes — all 3 research AIs vote on feasibility",
    "principle":"Smarter Together · Accuracy Over Speed — no proceed until consensus",
    "frontend_indicator":"Stage 3 = ACTIVE. Decision card shows: Proceed / Research More / Park. If HIGH difficulty → escalate banner appears: 'Architect consultation required before development.'",
    "backend":(
      "Write TestLog decision record:\n"
      "  test_name: 'Stage 3 — Decision: [project name]'\n"
      "  result: 'DIFFICULTY:[X] | COST:[Y] | ROI:[Z] | EFFECTIVENESS:[N]/10 | DECISION:[Proceed/Escalate/Park]'\n"
      "  validator: 'Simpee'\n\n"
      "If HIGH difficulty:\n"
      "  Show escalation banner: amber bg, text: 'High difficulty detected — Architect review required before Stage 4'\n"
      "  Update SandboxProject notes: 'Escalated to Architect — awaiting design review'\n\n"
      "If PROCEED:\n"
      "  Update SandboxProject status → 'testing'\n"
      "  Advance stage indicator to Stage 4"
    ),
    "output":"Decision logged. Status badge → TESTING. Stage 3 pill = COMPLETE. Escalation banner if high difficulty."
  },
  {
    "num":"4","name":"DEVELOPMENT PLANNING","border":GPT,"bg":LIGHT_GREEN,
    "ais":"ENGINEER (GPT-5.4) · ARCHITECT (GPT-5.5)",
    "principle":"Accuracy Over Speed — phase-based planning before any code is written",
    "frontend_indicator":"Stage 4 = ACTIVE. Phase Plan card appears: Phase 1 · Phase 2 · Phase 3... Each phase is a milestone. [APPROVE PLAN] button before Stage 5 starts.",
    "backend":(
      "Call aiCommandCentre with '[PLAN]' prefix:\n"
      "  POST /api/run/aiCommandCentre\n"
      "  Body: { \"instruction\": \"[PLAN] Break this into development phases. Each phase must have a clear milestone and deliverable: [objective]\", \"posted_by\": \"Kieran\" }\n\n"
      "Parse response into phase milestones:\n"
      "  Display as numbered phase list: Phase 1 · Phase 2 · Phase 3...\n"
      "  Each phase: title + what gets built + what gets saved\n\n"
      "Write TestLog:\n"
      "  test_name: 'Stage 4 — Plan: [project name]'\n"
      "  result: 'Phases defined: [N]. Step-by-step approach confirmed.'\n"
      "  validator: 'Simpee'\n\n"
      "Save phase plan to ProjectFile:\n"
      "  filename: 'plan_[project].md'\n"
      "  content: response.solution (full phase breakdown)\n"
      "  language: 'markdown'\n"
      "  notes: 'Development plan — Stage 4'"
    ),
    "output":"Phase plan card visible. Plan saved to ProjectFile. [APPROVE PLAN] button active. Stage 4 = COMPLETE on approval."
  },
  {
    "num":"5","name":"DEVELOPMENT EXECUTION","border":GPT,"bg":HexColor("#f0fdf4"),
    "ais":"ENGINEER (GPT-5.4) codes · ARCHITECT (GPT-5.5) oversees structure",
    "principle":"Pride in Work — clean modules, one phase at a time, nothing rushed",
    "frontend_indicator":"Stage 5 = ACTIVE. Phase progress tracker: Phase [N] of [Total] in progress. Each phase completion saves a checkpoint.",
    "backend":(
      "For each phase, call aiCommandCentre with '[BUILD Phase N]' prefix:\n"
      "  POST /api/run/aiCommandCentre\n"
      "  Body: { \"instruction\": \"[BUILD Phase N] [phase description and deliverable]\", \"posted_by\": \"Kieran\" }\n\n"
      "Save each phase output to ProjectFile:\n"
      "  filename: 'phase[N]_[component].jsx' or '[function].ts'\n"
      "  content: response.code\n"
      "  version: '1.[N]'\n"
      "  notes: 'Phase [N] complete — [deliverable description]'\n\n"
      "Write TestLog per phase:\n"
      "  test_name: 'Stage 5 — Phase [N]: [project name]'\n"
      "  result: 'Phase [N] complete. Files saved. Ready for next phase.'\n"
      "  validator: 'Simpee'"
    ),
    "output":"Code appears in centre panel. Each phase saved to ProjectFile. Phase tracker increments. All phases = Stage 5 COMPLETE."
  },
  {
    "num":"6","name":"TESTING","border":VIOLET,"bg":HexColor("#f8f8ff"),
    "ais":"Simpee runs all checkpoints (11 total)",
    "principle":"Accuracy Over Speed — no shortcuts, every checkpoint must pass",
    "frontend_indicator":"Stage 6 = ACTIVE. Checkpoint progress bar: X/11. Each check shows green tick or red flag inline.",
    "backend":(
      "Write one TestLog record per checkpoint:\n"
      "  test_name: 'Checkpoint [N] — [description]'\n"
      "  status: 'pass' | 'fail'\n"
      "  result: '[what was checked and outcome]'\n"
      "  validator: 'Simpee'\n\n"
      "Update SandboxProject checkpoint_status: '[N]/11'\n\n"
      "If any checkpoint fails:\n"
      "  Mark TestLog status: 'fail'\n"
      "  Show red flag inline on that checkpoint row\n"
      "  Block progression to Stage 9 (Validation)\n"
      "  Route automatically to Stage 7 (Diagnosis)\n\n"
      "If all 11 pass → advance to Stage 9"
    ),
    "output":"Checkpoint bar shows X/11. Failed checks in red. All green = Stage 6 COMPLETE, auto-advance to Stage 9."
  },
  {
    "num":"7","name":"DIAGNOSIS & ITERATION","border":ORANGE,"bg":HexColor("#fff8f0"),
    "ais":"ANALYST (Claude Sonnet) — quick fixes · STRATEGIST (Claude Opus) — deep logic · ENGINEER (GPT-5.4) — patch",
    "principle":"Accuracy Over Speed · Communication — always return to Goal Card before diagnosing",
    "frontend_indicator":"Stage 7 = ACTIVE (red/amber). Error summary card shows: failing checkpoint + error description. [RETURN TO GOAL] button visible. If same error repeats 3x → PAUSE banner: 'Recurring error detected — pausing for AI team suggestion.'",
    "backend":(
      "IMPORTANT — Always return to Step 1 Goal Card first:\n"
      "  Re-display Goal Card with original objective and success criteria\n"
      "  Confirm the fix attempt aligns with the original goal\n\n"
      "Call aiCommandCentre with '[FIX]' prefix:\n"
      "  POST /api/run/aiCommandCentre\n"
      "  Body: { \"instruction\": \"[FIX] Checkpoint [N] failed with error: [error]. Original goal: [objective]. Suggest fix.\", \"posted_by\": \"Kieran\" }\n\n"
      "OVERWRITE existing ProjectFile (do not create new):\n"
      "  Update content: response.code (patched version)\n"
      "  Update version: increment (1.1 → 1.2 → 1.3)\n"
      "  Update notes: 'Patch iteration [N] — fixing checkpoint [X]'\n\n"
      "Write TestLog:\n"
      "  test_name: 'Stage 7 — Iteration [N]: [project name]'\n"
      "  result: 'Fix applied for checkpoint [X]. Re-testing.'\n\n"
      "RECURRING ERROR RULE:\n"
      "  Track how many times same checkpoint fails\n"
      "  If same checkpoint fails 3 times → show PAUSE banner\n"
      "  Pause banner text: 'Same error repeated 3 times. Pausing. Requesting AI team suggestion.'\n"
      "  Trigger aiCommandCentre with '[ESCALATE]' prefix for fresh perspective"
    ),
    "output":"Patched code replaces previous version. Version increments. Loop back to Stage 6. Pause banner if recurring error."
  },
  {
    "num":"8","name":"PROCESS ENHANCEMENT","border":INDIGO,"bg":HexColor("#f5f3ff"),
    "ais":"Simpee (orchestrator) — asks 3 reflection questions after every cycle",
    "principle":"Process Enhancement — this stage runs after every completed test cycle",
    "frontend_indicator":"Stage 8 = ACTIVE. Reflection card appears with 3 questions and a text input for notes. [LOG LESSONS] button saves to TestLog.",
    "backend":(
      "After each completed test cycle (Stages 5-7), show Reflection card:\n"
      "  Question 1: 'Can this be simplified?'\n"
      "  Question 2: 'What did we learn?'\n"
      "  Question 3: 'How can future builds be faster without sacrificing accuracy?'\n\n"
      "Call aiCommandCentre with '[REFLECT]' prefix:\n"
      "  Body: { \"instruction\": \"[REFLECT] Review this build cycle: [summary]. Answer: Can it be simplified? What did we learn? How do we build smarter next time?\", \"posted_by\": \"Kieran\" }\n\n"
      "Write TestLog:\n"
      "  test_name: 'Stage 8 — Process Enhancement: [project name]'\n"
      "  result: response.analysis (lessons learned)\n"
      "  validator: 'Simpee'\n"
      "  notes: 'Cycle [N] reflection — saved for future reference'"
    ),
    "output":"Lessons saved to TestLog. Reflection card collapses. Stage 8 = COMPLETE. Advance to Stage 9."
  },
  {
    "num":"9","name":"VALIDATION — COPILOT GATEKEEPER","border":COPILOT,"bg":LIGHT_BLUE,
    "ais":"VALIDATOR — Copilot / Edge (Microsoft) — ALWAYS THE LAST GATE",
    "principle":"Accuracy Over Speed — no deploy without Copilot sign-off",
    "frontend_indicator":"Stage 9 = ACTIVE. Gatekeeper Panel shows 4 check rows: Syntax · Logic · Security · Azure. Each row pending until [RUN VALIDATION] is clicked.",
    "backend":(
      "Call consultCopilot — CRITICAL: use 'question' not 'code':\n"
      "  POST /api/run/consultCopilot\n"
      "  Body: { \"question\": [response.code from Stage 5], \"context\": [response.builder_instruction] }\n"
      "  *** FIELD NAME MUST BE 'question' — NOT 'code' ***\n\n"
      "On response update 4 Gatekeeper rows:\n"
      "  Row 1 Syntax:   green tick = clean | red flag = error found\n"
      "  Row 2 Logic:    green tick = sound | red flag = logic gap\n"
      "  Row 3 Security: green tick = safe  | red flag = vulnerability\n"
      "  Row 4 Azure:    green tick = ready | red flag = incompatible\n\n"
      "Write 4 TestLog records (one per check):\n"
      "  test_name: 'Validation — [Syntax|Logic|Security|Azure]'\n"
      "  status: 'pass' | 'fail'\n"
      "  validator: 'Copilot'\n\n"
      "Update SandboxProject:\n"
      "  All 4 pass → status: 'approved'\n"
      "  Any fail   → status: 'validator_pending' → return to Stage 7"
    ),
    "output":"Gatekeeper Panel: 4 checks green/red. SandboxProject → APPROVED if all green. Stage 9 = COMPLETE."
  },
  {
    "num":"10","name":"DEPLOY","border":GREEN,"bg":LIGHT_GREEN,
    "ais":"Simpee (orchestrator) + Copilot confirmed — DUAL GREEN REQUIRED",
    "principle":"Pride in Work — every deploy is a milestone worth celebrating",
    "frontend_indicator":"Stage 10 = ACTIVE. Deploy button ENABLED only when: all 11 Simpee checks pass + all 4 Copilot checks pass + SandboxProject status = approved. Dual validation badges shown: [Simpee: GREEN] [Copilot: GREEN].",
    "backend":(
      "Deploy button enabled conditions (ALL must be true):\n"
      "  1. TestLog has 11+ pass records with validator='Simpee'\n"
      "  2. TestLog has 4 pass records with validator='Copilot'\n"
      "  3. SandboxProject status = 'approved'\n\n"
      "On deploy click → show confirmation modal:\n"
      "  Title: 'Simpee + Copilot Approved'\n"
      "  Body: 'Deploy [project name] to 5S Portal? This cannot be undone.'\n"
      "  [CONFIRM DEPLOY] button (violet #5e50fb) | [CANCEL] (grey)\n\n"
      "On confirm:\n"
      "  Write final TestLog:\n"
      "    test_name: 'DEPLOY — [project name]'\n"
      "    status: 'pass'\n"
      "    result: 'Deployed [timestamp]. Simpee: green. Copilot: green. Version: [N].'\n"
      "    validator: 'Simpee + Copilot'\n\n"
      "  Update SandboxProject status → 'deploy_ready'\n"
      "  Show celebration banner: '[Project name] deployed to 5S Portal'\n"
      "  Banner style: violet bg, white text, confetti animation if possible"
    ),
    "output":"Deploy log in TestLog. SandboxProject → DEPLOY READY. Celebration banner. Deploy button disabled after fire."
  },
]

for st in stages:
    # Stage header
    hdr = Table([[
        p(f"  {st['num']}", color=WHITE, bold=True, size=12),
        Table([[
            p(f"STAGE {st['num']} — {st['name']}", color=st['border'], bold=True, size=9),
            p(st['ais'], color=st['border'], size=7.5, leading=11)
        ],[
            p(f"Principle: {st['principle']}", color=MUTED, size=7, leading=10),
            p("")
        ]], colWidths=[90*mm, 73*mm])
    ]], colWidths=[12*mm, 170*mm])
    hdr.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(0,0),st["border"]),
        ("BACKGROUND",(1,0),(1,0),st["bg"]),
        ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
        ("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5),
        ("LEFTPADDING",(0,0),(0,0),0),("LEFTPADDING",(1,0),(1,0),6),
        ("RIGHTPADDING",(0,0),(-1,-1),6),
    ]))

    # Frontend indicator row
    fi = Table([[
        p("FRONTEND INDICATOR:", color=INDIGO, bold=True, size=7),
        p(st["frontend_indicator"], color=INDIGO, size=7.5, leading=11)
    ]], colWidths=[35*mm, 147*mm])
    fi.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,-1),HexColor("#f5f3ff")),
        ("TOPPADDING",(0,0),(-1,-1),4),("BOTTOMPADDING",(0,0),(-1,-1),4),
        ("LEFTPADDING",(0,0),(-1,-1),7),("RIGHTPADDING",(0,0),(-1,-1),7),
        ("LINEBELOW",(0,0),(-1,0),0.5,NEUTRAL),
        ("VALIGN",(0,0),(-1,-1),"TOP"),
    ]))

    # Backend action row
    ba = Table([[
        p("BACKEND ACTION:", color=DARK, bold=True, size=7),
        code(st["backend"])
    ]], colWidths=[35*mm, 147*mm])
    ba.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,-1),WHITE),
        ("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5),
        ("LEFTPADDING",(0,0),(-1,-1),7),("RIGHTPADDING",(0,0),(-1,-1),7),
        ("LINEBELOW",(0,0),(-1,0),0.5,NEUTRAL),
        ("VALIGN",(0,0),(-1,-1),"TOP"),
    ]))

    # Output row
    op = Table([[
        p("OUTPUT:", color=GREEN, bold=True, size=7),
        p(st["output"], color=BODY_TEXT, size=7.5, leading=11)
    ]], colWidths=[35*mm, 147*mm])
    op.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,-1),st["bg"]),
        ("TOPPADDING",(0,0),(-1,-1),4),("BOTTOMPADDING",(0,0),(-1,-1),4),
        ("LEFTPADDING",(0,0),(-1,-1),7),("RIGHTPADDING",(0,0),(-1,-1),7),
        ("VALIGN",(0,0),(-1,-1),"TOP"),
    ]))

    wrapper = Table([[hdr],[fi],[ba],[op]], colWidths=[182*mm])
    wrapper.setStyle(TableStyle([
        ("BOX",(0,0),(-1,-1),1.5,st["border"]),
        ("TOPPADDING",(0,0),(-1,-1),0),("BOTTOMPADDING",(0,0),(-1,-1),0),
        ("LEFTPADDING",(0,0),(-1,-1),0),("RIGHTPADDING",(0,0),(-1,-1),0),
    ]))
    story.append(wrapper)
    story.append(Spacer(1,5))

# ══════ PAGE 2: BACKEND STATE + FIXES + CHECKLIST + PASTE ══════
story.append(PageBreak())

# BACKEND STATE
story.append(HRFlowable(width="100%", thickness=1.5, color=TEAL, spaceAfter=5))
story.append(p("BACKEND STATE — Confirmed Live by Simpee · 31 May 2026", color=TEAL, bold=True, size=10))
story.append(p("All items below are already built. Builder wires frontend to call them — nothing to create.", color=MUTED, size=7.5))
story.append(Spacer(1,5))

be_items = [
    ("aiCommandCentre","LIVE — lite mode (full AI on OpenAI key)",TEAL,LIGHT_GREEN,
     "POST /api/run/aiCommandCentre\n"
     "Send:    { \"instruction\": string, \"posted_by\": \"Kieran\" }\n"
     "Returns: { success, analysis, solution, code, builder_instruction, model, m365_grounded }"),
    ("consultCopilot","LIVE — FIELD FIX REQUIRED",RED,LIGHT_RED,
     "POST /api/run/consultCopilot\n"
     "Send:    { \"question\": string, \"context\": string }  ← 'question' NOT 'code'\n"
     "Returns: { answer, m365_grounded, model }"),
    ("SChatMessage","EXISTS — entity",VIOLET,LAVENDER,
     "Fields: sender · sender_type · role · message · timestamp · session_id · read"),
    ("TestLog","EXISTS — 7 records",VIOLET,LAVENDER,
     "Fields: test_name · status (pass/fail) · result · tested_at · fixed · validator"),
    ("AIConnector","EXISTS — 8 members READY",TEAL,LIGHT_GREEN,
     "Fields: model_id · model_name · provider · status · intro_message · voice_style · handoff_to · copilot_validated"),
    ("SandboxProject","EXISTS — schema live",AZURE,LIGHT_BLUE,
     "Fields: name · description · type (function/page/app)\n"
     "status enum: draft | testing | checkpoint_review | validator_pending | approved | deploy_ready\n"
     "Also: created_by · validator_approved · notes"),
    ("ProjectFile","EXISTS — schema live",AZURE,LIGHT_BLUE,
     "Fields: project_id · filename · content · language · version · notes\n"
     "Always link to SandboxProject via project_id. One file per phase/iteration."),
]
for name, status, bc, bg, contract in be_items:
    is_warn = "FIX" in status
    row = Table([[
        Table([[p(name, bold=True, color=bc, size=8)],[p(status, bold=is_warn, color=RED if is_warn else MUTED, size=7)]],
              colWidths=[45*mm]),
        code(contract)
    ]], colWidths=[47*mm, 135*mm])
    row.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(0,0),bg),("BACKGROUND",(1,0),(1,0),WHITE),
        ("BOX",(0,0),(-1,-1),0.5,bc),("LINEAFTER",(0,0),(0,0),0.5,bc),
        ("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5),
        ("LEFTPADDING",(0,0),(-1,-1),6),("RIGHTPADDING",(0,0),(-1,-1),6),
        ("VALIGN",(0,0),(-1,-1),"TOP"),
    ]))
    story.append(row)
    story.append(Spacer(1,3))

# 4 FIXES
story.append(Spacer(1,6))
story.append(HRFlowable(width="100%", thickness=1.5, color=VIOLET, spaceAfter=5))
story.append(p("4 FRONTEND FIXES — Scoped Changes Only. Do Not Touch Anything Else.", color=VIOLET, bold=True, size=10))
story.append(Spacer(1,4))

fixes = [
    ("1",VIOLET,LAVENDER,"Wire chat input → aiCommandCentre","Stages 2, 4, 5, 7, 8",
     "POST /api/run/aiCommandCentre with body: { instruction: userMessage, posted_by: 'Kieran' }\n"
     "Show loading: 'Simpee is working...' with animated dots.\n"
     "On success render 4 response sections:\n"
     "  ANALYSIS     — white bg\n"
     "  SOLUTION     — lavender #e8e6fe bg\n"
     "  CODE         — dark monospace bg, copy button\n"
     "  BUILDER INST — amber #fffbeb bg\n"
     "Label card: response.model"),
    ("2",RED,LIGHT_RED,"Fix consultCopilot — 'question' not 'code'","Stage 9 only",
     "WRONG:   { code: lastCode, context: lastContext }\n"
     "CORRECT: { question: lastCode, context: lastBuilderInstruction }\n\n"
     "On response update 4 Gatekeeper rows: Syntax / Logic / Security / Azure\n"
     "Each row: green tick (pass) or red flag (fail)\n"
     "Write 4 TestLog records with validator='Copilot'"),
    ("3",TEAL,LIGHT_GREEN,"Auto-write TestLog after every aiCommandCentre response","Stage 6",
     "After every successful response write to TestLog:\n"
     "{ test_name: 'Trial Run — '+instruction.substring(0,40),\n"
     "  status: 'pass', result: 'Model: '+response.model,\n"
     "  tested_at: new Date().toISOString(), fixed: false, validator: 'Simpee' }"),
    ("4",AZURE,LIGHT_BLUE,"Sandbox card + stage indicator strip + Save button","Stages 1, 5, 10",
     "Stage indicator strip at top of page:\n"
     "  10 stage pills (1-10). Active = violet. Complete = green. Pending = grey. Error = red.\n\n"
     "Sandbox card in right panel:\n"
     "  Fetch SandboxProject on load. Show: name, status badge, checkpoint_status\n"
     "  Status badges: DRAFT=grey | TESTING=amber | APPROVED=green | DEPLOY READY=blue\n\n"
     "[SAVE CODE TO SANDBOX] button (Azure #0078d4):\n"
     "  Write ProjectFile: { project_id, filename: 'response_'+Date.now()+'.ts',\n"
     "  content: lastCode, language: 'typescript', version: '1.0' }\n"
     "  Toast: 'Code saved to Sandbox'"),
]
for num, bc, bg, title, stage, detail in fixes:
    hdr = Table([[
        p(f"FIX {num}", color=WHITE, bold=True, size=9),
        p(title, color=DARK, bold=True, size=9),
        p(f"Workflow: {stage}", color=bc, bold=True, size=7.5)
    ]], colWidths=[14*mm, 115*mm, 53*mm])
    hdr.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(0,0),bc),("BACKGROUND",(1,0),(-1,0),bg),
        ("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5),
        ("LEFTPADDING",(0,0),(-1,-1),7),("RIGHTPADDING",(0,0),(-1,-1),7),
        ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
    ]))
    body = Table([[code(detail)]], colWidths=[182*mm])
    body.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,-1),WHITE),
        ("TOPPADDING",(0,0),(-1,-1),6),("BOTTOMPADDING",(0,0),(-1,-1),6),
        ("LEFTPADDING",(0,0),(-1,-1),8),("RIGHTPADDING",(0,0),(-1,-1),8),
    ]))
    wrap = Table([[hdr],[body]], colWidths=[182*mm])
    wrap.setStyle(TableStyle([
        ("BOX",(0,0),(-1,-1),1.5,bc),
        ("TOPPADDING",(0,0),(-1,-1),0),("BOTTOMPADDING",(0,0),(-1,-1),0),
        ("LEFTPADDING",(0,0),(-1,-1),0),("RIGHTPADDING",(0,0),(-1,-1),0),
    ]))
    story.append(wrap)
    story.append(Spacer(1,4))

# TRIAL CHECKLIST
story.append(Spacer(1,4))
story.append(HRFlowable(width="100%", thickness=1.5, color=VIOLET, spaceAfter=5))
story.append(p("TRIAL RUN — 5 CHECKPOINTS", color=VIOLET, bold=True, size=10))
story.append(Spacer(1,4))
chk = [
    ["#","Stage","Kieran Does","Expected","Simpee Verifies"],
    ["1","Stage 2-5\nAI Response","Type any message. Hit send.","Loading dots → response card with 4 sections. Model label shown.","SChatMessage entity: new record written"],
    ["2","Stage 6\nTestLog auto","Same message — no extra action.","TestLog: new record with validator=Simpee, status=pass.","Read TestLog — compare record count"],
    ["3","Stage 9\nGatekeeper","Click [RUN VALIDATION].","4 Gatekeeper rows update. 4 TestLog records with validator=Copilot.","Filter TestLog by validator=Copilot"],
    ["4","Stage 5\nSandbox Save","Click [SAVE CODE TO SANDBOX].","Toast shown. ProjectFile: new record. File count increments.","Read ProjectFile — check project_id"],
    ["5","Full Loop\nAll stages","Run 1-4 in sequence.","All 4 entity writes confirmed. Core loop proven.","All 4 entities confirmed by Simpee"],
]
ct = Table(chk, colWidths=[8*mm, 20*mm, 38*mm, 65*mm, 51*mm])
ct.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),("FONTSIZE",(0,0),(-1,-1),7.5),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),("TEXTCOLOR",(0,1),(0,-1),VIOLET),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,5),(-1,5),LIGHT_GREEN),("FONTNAME",(0,5),(-1,5),"Helvetica-Bold"),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),5),("VALIGN",(0,0),(-1,-1),"TOP"),("ALIGN",(0,0),(0,-1),"CENTER"),
]))
story.append(ct)
story.append(Spacer(1,8))

# BUILDER PASTE BOX
story.append(p("BUILDER — PASTE THIS INTO NEXUS COMMAND BUILDER", color=VIOLET, bold=True, size=10))
story.append(Spacer(1,4))
paste = (
    "Implement 4 frontend wiring fixes in CommandAIHub.jsx for Nexus Command. "
    "Do NOT rebuild the layout. Do NOT change backend functions or entity schemas. Backend is confirmed live.\n\n"
    "CONTEXT — This app runs a 10-stage AI workflow. The stage indicator strip at the top shows all 10 stages "
    "(1=Goal Setting, 2=Feasibility, 3=Decision, 4=Planning, 5=Execution, 6=Testing, 7=Diagnosis, 8=Process Enhancement, 9=Validation, 10=Deploy). "
    "Active stage = violet, complete = green, pending = grey, error = red.\n\n"
    "FIX 1 — Chat input → aiCommandCentre (Stages 2,4,5,7,8):\n"
    "POST /api/run/aiCommandCentre with { instruction: userMessage, posted_by: 'Kieran' }. "
    "Loading: 'Simpee is working...' dots. "
    "Response: 4 sections — ANALYSIS (white) · SOLUTION (lavender #e8e6fe) · CODE (dark monospace + copy btn) · BUILDER INSTRUCTION (amber #fffbeb). Label: response.model.\n\n"
    "FIX 2 — consultCopilot field name (Stage 9):\n"
    "Send { question: lastCode, context: lastBuilderInstruction } NOT { code: ... }. "
    "Update 4 Gatekeeper rows on response: Syntax/Logic/Security/Azure with green tick or red flag. "
    "Write 4 TestLog records with validator='Copilot'.\n\n"
    "FIX 3 — Auto TestLog write after every aiCommandCentre response (Stage 6):\n"
    "{ test_name: 'Trial Run — '+instruction.substring(0,40), status: 'pass', result: 'Model: '+response.model, "
    "tested_at: new Date().toISOString(), fixed: false, validator: 'Simpee' }.\n\n"
    "FIX 4 — Stage indicator strip + Sandbox card + Save button (Stages 1,5,10):\n"
    "Stage strip: 10 pills at top. Active=violet, complete=green, pending=grey, error=red. "
    "Sandbox card in right panel: fetch SandboxProject on load, show name + status badge + checkpoint_status. "
    "Status badges: DRAFT=grey / TESTING=amber / APPROVED=green / DEPLOY READY=blue. "
    "[SAVE CODE TO SANDBOX] button (Azure #0078d4): write ProjectFile record. Toast on save.\n\n"
    "RECURRING ERROR RULE: If same checkpoint fails 3 times, show PAUSE banner: "
    "'Same error repeated 3 times — pausing for AI team suggestion.'\n\n"
    "Design: bg=#e8e6fe · accent=#5e50fb · Azure=#0078d4 · Exo 2 headlines · Montserrat body. No emoji."
)
story.append(Table([[
    Paragraph(paste.replace("\n","<br/>"),
        ps("px", fontSize=7.5, fontName="Helvetica", textColor=BODY_TEXT, leading=13))
]], colWidths=[182*mm]))
story[-1].setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,-1),YELLOW),
    ("BOX",(0,0),(-1,-1),2,YELLOW_B),
    ("PADDING",(0,0),(-1,-1),10),
]))
story.append(Spacer(1,7))

# FOOTER
ft = Table([[
    p("Nexus Command Blueprint v4 FINAL · SIMPLEX-ITY · Confidential · 10-Stage Disciplined Pipeline", color=MUTED, size=7),
    p(f"Kieran Li + Simpee · {today}", color=VIOLET, bold=True, size=7)
]], colWidths=[130*mm, 52*mm])
ft.setStyle(TableStyle([
    ("TOPPADDING",(0,0),(-1,-1),5),("LINEABOVE",(0,0),(-1,0),0.5,NEUTRAL),
    ("ALIGN",(1,0),(1,0),"RIGHT")
]))
story.append(ft)

doc.build(story)
print("PDF built OK — Blueprint v4 FINAL")
