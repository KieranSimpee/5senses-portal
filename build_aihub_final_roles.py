from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, PageBreak
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
import datetime

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
LIGHT_BLUE   = HexColor("#eff6ff")
LIGHT_GREEN  = HexColor("#f0fdf4")
LIGHT_RED    = HexColor("#fff0f0")
GEMINI_COLOR = HexColor("#1a73e8")
CLAUDE_COLOR = HexColor("#d97706")
GPT_COLOR    = HexColor("#10a37f")
COPILOT_COLOR= HexColor("#0078d4")

def s(name, **kw): return ParagraphStyle(name, **kw)
def p(text, color=None, bold=False, size=8, leading=12):
    fn = "Helvetica-Bold" if bold else "Helvetica"
    c = color or BODY_TEXT
    return Paragraph(text, ParagraphStyle("x", fontSize=size, fontName=fn, textColor=c, leading=leading))

today = datetime.date.today().strftime("%d %B %Y")

doc = SimpleDocTemplate("Nexus_Command_TrialRun_v3_FULL.pdf", pagesize=A4,
    leftMargin=14*mm, rightMargin=14*mm, topMargin=14*mm, bottomMargin=14*mm)
story = []

# ══════════════════════════════════════════
# COVER
# ══════════════════════════════════════════
cover = Table([[
    Paragraph("NEXUS COMMAND", ParagraphStyle("T", fontSize=22, fontName="Helvetica-Bold", textColor=WHITE)),
    Paragraph(today, ParagraphStyle("D", fontSize=8, fontName="Helvetica", textColor=SOFT, alignment=TA_RIGHT))
],[
    Paragraph("TRIAL RUN BLUEPRINT v3 — FULL INSTRUCTIONS, NO TRUNCATION", ParagraphStyle("S", fontSize=9, fontName="Helvetica", textColor=SOFT)),
    Paragraph("Backend + Frontend Aligned", ParagraphStyle("N", fontSize=8, fontName="Helvetica", textColor=YELLOW_B, alignment=TA_RIGHT))
],[
    Paragraph("Co-authored: Kieran Li + Simpee · 8-Stage AI Workflow · 4 Frontend Fixes · 5 Trial Checkpoints · Complete API Contracts", ParagraphStyle("S2", fontSize=7.5, fontName="Helvetica", textColor=HexColor("#9896ad"))),
    Paragraph("v3 — full text, no cuts", ParagraphStyle("V", fontSize=7.5, fontName="Helvetica-Bold", textColor=YELLOW_B, alignment=TA_RIGHT))
]], colWidths=[130*mm, 49*mm])
cover.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,-1),DARK),
    ("TOPPADDING",(0,0),(-1,-1),9),("BOTTOMPADDING",(0,0),(-1,-1),9),
    ("LEFTPADDING",(0,0),(-1,-1),14),("RIGHTPADDING",(0,0),(-1,-1),14),
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
]))
story.append(cover)
story.append(Spacer(1,7))

story.append(Paragraph(
    "<b>PURPOSE OF THIS DOCUMENT:</b> Complete backend + frontend alignment brief for the Nexus Command builder. "
    "Every function name, field name, payload shape, and expected response is spelled out in full. "
    "No truncation. No overlapping columns. Builder reads this once and builds correctly.",
    ParagraphStyle("intro", fontSize=8.5, fontName="Helvetica", textColor=BODY_TEXT, leading=13,
      borderColor=VIOLET, borderWidth=1.5, borderPadding=9, backColor=LAVENDER, spaceAfter=8)))

# ══════════════════════════════════════════
# SECTION 1 — THE 8-STAGE WORKFLOW
# Each stage is its own standalone block — no cramped table
# ══════════════════════════════════════════
story.append(HRFlowable(width="100%", thickness=1.5, color=VIOLET, spaceAfter=6))
story.append(Paragraph("THE 8-STAGE AI WORKFLOW — Complete Instructions Per Stage",
    ParagraphStyle("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
story.append(Paragraph(
    "Each stage below is self-contained. AIs involved, backend action required, and expected output — all written in full.",
    ParagraphStyle("sub", fontSize=8, fontName="Helvetica", textColor=MUTED, spaceAfter=8)))

stages = [
    {
        "num": "1",
        "name": "DEFINE FUNCTION & GOAL",
        "color": HexColor("#f0edff"),
        "border": VIOLET,
        "ais": "Kieran + Simpee",
        "ai_color": VIOLET,
        "backend": (
            "Create a SandboxProject record with these exact fields:\n"
            "  entity: SandboxProject\n"
            "  name: [project name from Kieran's request]\n"
            "  description: [full objective — what it does, who it's for]\n"
            "  type: 'function' | 'page' | 'app'  (pick most appropriate)\n"
            "  status: 'draft'\n"
            "  created_by: 'Kieran'\n"
            "  validator_approved: false\n"
            "  notes: [any constraints or scope limits]"
        ),
        "output": "SandboxProject card appears in right panel. Objective logged. Status shows DRAFT badge."
    },
    {
        "num": "2",
        "name": "RESEARCH & FEASIBILITY ANALYSIS",
        "color": HexColor("#eff6ff"),
        "border": GEMINI_COLOR,
        "ais": "RESEARCHER (Gemini 3.1 Pro) · ANALYST (Claude Sonnet 4.6) · STRATEGIST (Claude Opus 4.6)",
        "ai_color": GEMINI_COLOR,
        "backend": (
            "Call aiCommandCentre with instruction prefixed '[FEASIBILITY]':\n"
            "  POST /api/run/aiCommandCentre\n"
            "  Body: { \"instruction\": \"[FEASIBILITY] [Kieran's full request]\", \"posted_by\": \"Kieran\" }\n\n"
            "The function returns:\n"
            "  response.analysis  → Complexity assessment\n"
            "  response.solution  → Recommended approach\n"
            "  response.code      → Any scaffolding or structure\n"
            "  response.builder_instruction → Summary for builder\n"
            "  response.model     → Which model responded\n\n"
            "Parse into a Feasibility Report card:\n"
            "  Difficulty: Low / Medium / High\n"
            "  Cost: estimated time/resources\n"
            "  Effectiveness: expected impact score\n"
            "  Recommendation: Proceed / Research More / Park"
        ),
        "output": "Feasibility Report card appears in centre panel with difficulty, cost, effectiveness scores. 3 decision buttons shown."
    },
    {
        "num": "3",
        "name": "JOINT AI DECISION",
        "color": HexColor("#fffbeb"),
        "border": CLAUDE_COLOR,
        "ais": "Simpee convenes — all 3 research AIs contribute",
        "ai_color": CLAUDE_COLOR,
        "backend": (
            "Write a TestLog record:\n"
            "  entity: TestLog\n"
            "  test_name: 'Decision — [project name]'\n"
            "  status: 'pass'\n"
            "  result: 'DIFFICULTY: [low/med/high] | COST: [estimate] | EFFECTIVENESS: [score] | DECISION: Proceed'\n"
            "  tested_at: [ISO timestamp]\n"
            "  fixed: false\n"
            "  validator: 'Simpee'\n\n"
            "Update SandboxProject status → 'testing'"
        ),
        "output": "Decision log entry visible in TestLog panel. SandboxProject badge updates from DRAFT to TESTING."
    },
    {
        "num": "4",
        "name": "DEVELOPMENT",
        "color": LIGHT_GREEN,
        "border": GPT_COLOR,
        "ais": "ENGINEER (GPT-5.4) · ARCHITECT (GPT-5.5)",
        "ai_color": GPT_COLOR,
        "backend": (
            "Call aiCommandCentre with instruction prefixed '[BUILD]':\n"
            "  POST /api/run/aiCommandCentre\n"
            "  Body: { \"instruction\": \"[BUILD] [full build spec]\", \"posted_by\": \"Kieran\" }\n\n"
            "On response, save code to ProjectFile entity:\n"
            "  entity: ProjectFile\n"
            "  project_id: [SandboxProject id]\n"
            "  filename: '[component_name].jsx'  or  '[function_name].ts'\n"
            "  content: response.code  (full file content)\n"
            "  language: 'jsx' | 'typescript'\n"
            "  version: '1.0'\n"
            "  notes: 'Generated by ENGINEER + ARCHITECT — Stage 4'\n\n"
            "Display code in centre panel code block with copy button."
        ),
        "output": "Draft code appears in centre panel. ProjectFile record created. File count in Sandbox card increments. Status remains TESTING."
    },
    {
        "num": "5",
        "name": "TESTING — SIMPEE RUNS CHECKPOINTS",
        "color": HexColor("#f8f8ff"),
        "border": VIOLET,
        "ais": "Simpee (orchestrator) — runs all 11 checkpoints",
        "ai_color": VIOLET,
        "backend": (
            "Write one TestLog record per checkpoint:\n"
            "  entity: TestLog\n"
            "  test_name: 'Checkpoint [N] — [check description]'\n"
            "  status: 'pass' | 'fail'\n"
            "  result: '[what was checked and result]'\n"
            "  tested_at: [ISO timestamp]\n"
            "  fixed: false\n"
            "  validator: 'Simpee'\n\n"
            "Update SandboxProject checkpoint_status field:\n"
            "  checkpoint_status: '[N]/11'  e.g. '3/11', '7/11'\n\n"
            "If any checkpoint fails:\n"
            "  Set TestLog status: 'fail'\n"
            "  Return to Stage 6 (Diagnosis & Fine-Tuning)\n"
            "  Do NOT proceed to Stage 7 until all pass"
        ),
        "output": "Checkpoint progress bar in Sandbox card shows X/11. Failed checks appear in red. Passed checks in green."
    },
    {
        "num": "6",
        "name": "DIAGNOSIS & FINE-TUNING",
        "color": HexColor("#fff8f0"),
        "border": HexColor("#f59e0b"),
        "ais": "ANALYST (Claude Sonnet) — quick fix suggestions\nSTRATEGIST (Claude Opus) — deep logic corrections\nENGINEER (GPT-5.4) — code patch",
        "ai_color": HexColor("#f59e0b"),
        "backend": (
            "Call aiCommandCentre with instruction prefixed '[FIX]':\n"
            "  POST /api/run/aiCommandCentre\n"
            "  Body: { \"instruction\": \"[FIX] [describe the failing checkpoint and error]\", \"posted_by\": \"Kieran\" }\n\n"
            "On response, OVERWRITE the existing ProjectFile record:\n"
            "  Update (not create new) ProjectFile where project_id matches\n"
            "  content: response.code  (patched version)\n"
            "  version: increment e.g. '1.1', '1.2'\n"
            "  notes: 'Patched — Stage 6 iteration [N]'\n\n"
            "Loop back to Stage 5 — re-run checkpoints.\n"
            "Repeat until all 11 checkpoints pass."
        ),
        "output": "Updated code replaces previous version in centre panel. Version number increments. Iteration count visible."
    },
    {
        "num": "7",
        "name": "VALIDATION — COPILOT GATEKEEPER",
        "color": LIGHT_BLUE,
        "border": COPILOT_COLOR,
        "ais": "VALIDATOR — Copilot / Edge (Microsoft) — ALWAYS LAST GATE",
        "ai_color": COPILOT_COLOR,
        "backend": (
            "Call consultCopilot — IMPORTANT: send 'question' NOT 'code':\n"
            "  POST /api/run/consultCopilot\n"
            "  Body: { \"question\": [response.code from Stage 4/6], \"context\": [response.builder_instruction] }\n\n"
            "  *** CRITICAL: field name is 'question' — NOT 'code' ***\n\n"
            "On response, update the 4 Gatekeeper check rows in right panel:\n"
            "  Row 1 — Syntax:   green tick if clean, red flag if error found\n"
            "  Row 2 — Logic:    green tick if sound, red flag if logic gap\n"
            "  Row 3 — Security: green tick if safe, red flag if vulnerability\n"
            "  Row 4 — Azure:    green tick if ready, red flag if incompatible\n\n"
            "Write 4 TestLog records — one per check:\n"
            "  test_name: 'Validation — [Syntax|Logic|Security|Azure]'\n"
            "  status: 'pass' | 'fail'\n"
            "  result: [Copilot's finding for this check]\n"
            "  validator: 'Copilot'\n\n"
            "Update SandboxProject status:\n"
            "  If all 4 pass → status: 'approved'\n"
            "  If any fail  → status: 'validator_pending' and return to Stage 6"
        ),
        "output": "Gatekeeper Panel shows 4 checks with green/red indicators. SandboxProject badge → APPROVED if all green. TestLog has 4 new Copilot entries."
    },
    {
        "num": "8",
        "name": "DEPLOY",
        "color": LIGHT_GREEN,
        "border": GREEN,
        "ais": "Simpee (orchestrator) + Copilot confirmed — DUAL GREEN REQUIRED",
        "ai_color": GREEN,
        "backend": (
            "Deploy button is ONLY enabled when:\n"
            "  Condition 1: All 11 Simpee checkpoints = pass in TestLog\n"
            "  Condition 2: All 4 Copilot Gatekeeper checks = pass in TestLog\n"
            "  Condition 3: SandboxProject status = 'approved'\n\n"
            "On deploy button click — show confirmation modal:\n"
            "  Title: 'Simpee + Copilot Approved'\n"
            "  Body: 'Deploy [project name] to 5S Portal?'\n"
            "  Buttons: [CONFIRM DEPLOY] (violet) | [CANCEL] (grey)\n\n"
            "On confirm — write final TestLog record:\n"
            "  test_name: 'DEPLOY — [project name]'\n"
            "  status: 'pass'\n"
            "  result: 'Deployed at [timestamp]. Simpee: green. Copilot: green. Version: [version].'\n"
            "  validator: 'Simpee + Copilot'\n\n"
            "Update SandboxProject status → 'deploy_ready'\n"
            "Show success banner: '[Project name] deployed to 5S Portal'"
        ),
        "output": "Deploy log entry in TestLog. SandboxProject badge → DEPLOY READY. Success banner shown. Deploy button disabled after fire."
    },
]

for st in stages:
    num_cell = Table([[p(st["num"], color=WHITE, bold=True, size=13)]],
        colWidths=[10*mm])
    num_cell.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,-1),st["border"]),
        ("ALIGN",(0,0),(-1,-1),"CENTER"),("VALIGN",(0,0),(-1,-1),"MIDDLE"),
        ("TOPPADDING",(0,0),(-1,-1),8),("BOTTOMPADDING",(0,0),(-1,-1),8),
    ]))

    header = Table([[
        p(f"STAGE {st['num']} — {st['name']}", color=st["border"], bold=True, size=9.5),
        p(st["ais"], color=st["ai_color"], bold=True, size=7.5, leading=11)
    ]], colWidths=[90*mm, 79*mm])
    header.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,-1),st["color"]),
        ("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5),
        ("LEFTPADDING",(0,0),(-1,-1),8),("RIGHTPADDING",(0,0),(-1,-1),8),
        ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
    ]))

    backend_para = Paragraph(
        st["backend"].replace("\n","<br/>"),
        ParagraphStyle("bc", fontSize=7.5, fontName="Courier", textColor=BODY_TEXT, leading=12,
            leftIndent=4, backColor=HexColor("#f8f8ff")))
    output_para = Paragraph(
        "<b>OUTPUT:</b> " + st["output"],
        ParagraphStyle("op", fontSize=7.5, fontName="Helvetica", textColor=BODY_TEXT, leading=11,
            backColor=st["color"], leftIndent=4))

    body = Table([[backend_para],[output_para]], colWidths=[179*mm])
    body.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(0,0),HexColor("#f8f8ff")),
        ("BACKGROUND",(0,1),(0,1),st["color"]),
        ("TOPPADDING",(0,0),(-1,-1),6),("BOTTOMPADDING",(0,0),(-1,-1),6),
        ("LEFTPADDING",(0,0),(-1,-1),8),("RIGHTPADDING",(0,0),(-1,-1),8),
        ("LINEBELOW",(0,0),(0,0),0.5,NEUTRAL),
    ]))

    wrapper = Table([[header],[body]], colWidths=[179*mm])
    wrapper.setStyle(TableStyle([
        ("BOX",(0,0),(-1,-1),1.5,st["border"]),
        ("TOPPADDING",(0,0),(-1,-1),0),("BOTTOMPADDING",(0,0),(-1,-1),0),
        ("LEFTPADDING",(0,0),(-1,-1),0),("RIGHTPADDING",(0,0),(-1,-1),0),
    ]))
    story.append(wrapper)
    story.append(Spacer(1,5))

# ══════════════════════════════════════════
# SECTION 2 — BACKEND STATE
# ══════════════════════════════════════════
story.append(PageBreak())
story.append(HRFlowable(width="100%", thickness=1.5, color=TEAL, spaceAfter=6))
story.append(Paragraph("BACKEND STATE — Confirmed Live by Simpee on 31 May 2026",
    ParagraphStyle("H2", fontSize=11, fontName="Helvetica-Bold", textColor=TEAL, spaceAfter=4)))
story.append(Paragraph(
    "Everything below is already built and tested. The builder does NOT need to create any of these. "
    "Wire the frontend to call them exactly as documented.",
    ParagraphStyle("sub2", fontSize=8, fontName="Helvetica", textColor=MUTED, spaceAfter=6)))

backend_items = [
    ("aiCommandCentre", "LIVE — lite mode (full AI on OpenAI key add)",
     "POST /api/run/aiCommandCentre\n"
     "Send:    { \"instruction\": string, \"posted_by\": \"Kieran\" }\n"
     "Returns: { success, analysis, solution, code, builder_instruction, model, m365_grounded, full_response }"),
    ("consultCopilot", "LIVE — field fix required",
     "POST /api/run/consultCopilot\n"
     "Send:    { \"question\": string, \"context\": string }  ← MUST be 'question' not 'code'\n"
     "Returns: { answer, m365_grounded, model }"),
    ("checkConnections", "LIVE",
     "POST /api/run/checkConnections\n"
     "Send:    {}\n"
     "Returns: { connections: [{ name, status, last_checked }] }"),
    ("SChatMessage entity", "EXISTS",
     "Fields: sender · sender_type · role · message · timestamp · session_id · read\n"
     "Write after every AI exchange to log the conversation."),
    ("TestLog entity", "EXISTS — 7 records",
     "Fields: test_name · status (pass/fail) · result · tested_at · fixed · validator\n"
     "Write one record per checkpoint, decision, and validation check."),
    ("AIConnector entity", "EXISTS — 8 members seeded",
     "Fields: model_id · model_name · provider · status · intro_message · voice_style · handoff_to · copilot_validated\n"
     "8 founding members: ORCHESTRATOR, RESEARCHER, ANALYST, STRATEGIST, THINK TANK, ENGINEER, ARCHITECT, VALIDATOR"),
    ("azureConnectorStub entity", "EXISTS",
     "Fields: service_name · status · last_tested · notes\n"
     "Used for Azure dry-run in Stage 7 Gatekeeper check."),
    ("SandboxProject entity", "EXISTS — schema live",
     "Fields: name · description · type (function/page/app) · status (draft/testing/checkpoint_review/validator_pending/approved/deploy_ready) · created_by · checkpoint_status · validator_approved · notes\n"
     "Status enum must match exactly — these are the only valid values."),
    ("ProjectFile entity", "EXISTS — schema live",
     "Fields: project_id · filename · content · language · version · notes\n"
     "Always link to SandboxProject via project_id. One file per stage 4/6 iteration."),
]

for name, status, contract in backend_items:
    is_warn = "fix" in status.lower()
    bg = LIGHT_RED if is_warn else LIGHT_GREEN if "LIVE" in status else LAVENDER
    bc = RED if is_warn else TEAL if "LIVE" in status else VIOLET
    row = Table([[
        Table([[p(name, bold=True, color=bc, size=8)],[p(status, bold=is_warn, color=RED if is_warn else MUTED, size=7)]], colWidths=[45*mm]),
        Paragraph(contract.replace("\n","<br/>"),
            ParagraphStyle("ct", fontSize=7.5, fontName="Courier", textColor=BODY_TEXT, leading=11))
    ]], colWidths=[47*mm, 132*mm])
    row.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(0,0),bg),
        ("BACKGROUND",(1,0),(1,0),WHITE),
        ("BOX",(0,0),(-1,-1),0.5,bc),
        ("LINEAFTER",(0,0),(0,0),0.5,bc),
        ("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5),
        ("LEFTPADDING",(0,0),(-1,-1),6),("RIGHTPADDING",(0,0),(-1,-1),6),
        ("VALIGN",(0,0),(-1,-1),"TOP"),
    ]))
    story.append(row)
    story.append(Spacer(1,3))

# ══════════════════════════════════════════
# SECTION 3 — 4 FRONTEND FIXES
# ══════════════════════════════════════════
story.append(Spacer(1,6))
story.append(HRFlowable(width="100%", thickness=1.5, color=VIOLET, spaceAfter=6))
story.append(Paragraph("4 FRONTEND FIXES — Exact Changes Only. Do Not Rebuild Anything Else.",
    ParagraphStyle("H3", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))

fixes = [
    ("1", VIOLET, LAVENDER, "Wire chat input → aiCommandCentre", "Stages 2, 4, 6",
     "Find the chat input submit handler in CommandAIHub.jsx.\n"
     "Change the fetch call to:\n"
     "  POST /api/run/aiCommandCentre\n"
     "  Body: JSON.stringify({ instruction: userMessage, posted_by: 'Kieran' })\n\n"
     "While waiting: show 'Simpee is working...' with animated dots.\n\n"
     "On success render 4 sections in centre panel response card:\n"
     "  1. ANALYSIS     — response.analysis  (white bg)\n"
     "  2. SOLUTION     — response.solution  (lavender bg #e8e6fe)\n"
     "  3. CODE         — response.code      (monospace, copy button, dark bg)\n"
     "  4. BUILDER INST — response.builder_instruction (amber bg #fffbeb)\n"
     "Card label: response.model value (e.g. 'gpt-4o', 'simpee-lite')"),
    ("2", RED, LIGHT_RED, "Fix consultCopilot — change 'code' to 'question'", "Stage 7 only",
     "Find the [RUN VALIDATION] button click handler.\n"
     "WRONG:   { code: lastCode, context: lastContext }\n"
     "CORRECT: { question: lastCode, context: lastBuilderInstruction }\n\n"
     "Where to get the values:\n"
     "  question = response.code from the last aiCommandCentre call\n"
     "  context  = response.builder_instruction from the same call\n\n"
     "On response — update 4 rows in Gatekeeper Panel:\n"
     "  Syntax   → green tick or red flag\n"
     "  Logic    → green tick or red flag\n"
     "  Security → green tick or red flag\n"
     "  Azure    → green tick or red flag\n\n"
     "Write 4 TestLog records with validator='Copilot', one per check."),
    ("3", TEAL, LIGHT_GREEN, "Auto-write TestLog after every aiCommandCentre response", "Stage 5",
     "After every successful aiCommandCentre response, immediately write:\n"
     "  POST /api/entities/TestLog\n"
     "  {\n"
     "    test_name: 'Trial Run — ' + instruction.substring(0, 40),\n"
     "    status: 'pass',\n"
     "    result: 'aiCommandCentre responded. Model: ' + response.model,\n"
     "    tested_at: new Date().toISOString(),\n"
     "    fixed: false,\n"
     "    validator: 'Simpee'\n"
     "  }\n\n"
     "This auto-logs checkpoint 3 for every session without manual action."),
    ("4", AZURE, LIGHT_BLUE, "Add Sandbox card + [SAVE CODE TO SANDBOX] button", "Stages 1, 4",
     "In right panel, below Deploy Log section — add Sandbox Project card:\n\n"
     "On page load:\n"
     "  Fetch SandboxProject entity — show first record\n"
     "  Display: project name, status badge, checkpoint_status progress\n"
     "  Status badges: DRAFT=grey / TESTING=amber / APPROVED=green / DEPLOY READY=blue\n\n"
     "[SAVE CODE TO SANDBOX] button (bg: #0078d4, text: white):\n"
     "  On click: POST /api/entities/ProjectFile\n"
     "  {\n"
     "    project_id: [SandboxProject id],\n"
     "    filename: 'response_' + Date.now() + '.ts',\n"
     "    content: [response.code from last aiCommandCentre call],\n"
     "    language: 'typescript',\n"
     "    version: '1.0',\n"
     "    notes: 'Saved from trial run'\n"
     "  }\n"
     "  Show toast: 'Code saved to Sandbox'\n"
     "  Increment file count below card: '[N] files saved to this project'"),
]

for num, bc, bg, title, stage, detail in fixes:
    hdr = Table([[
        p(f"FIX {num}", color=WHITE, bold=True, size=9),
        p(title, color=DARK, bold=True, size=9),
        p(f"Workflow: {stage}", color=bc, bold=True, size=7.5)
    ]], colWidths=[14*mm, 110*mm, 55*mm])
    hdr.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(0,0),bc),
        ("BACKGROUND",(1,0),(1,0),bg),
        ("BACKGROUND",(2,0),(2,0),bg),
        ("TOPPADDING",(0,0),(-1,-1),6),("BOTTOMPADDING",(0,0),(-1,-1),6),
        ("LEFTPADDING",(0,0),(-1,-1),7),("RIGHTPADDING",(0,0),(-1,-1),7),
        ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
    ]))
    body = Table([[
        Paragraph(detail.replace("\n","<br/>"),
            ParagraphStyle("fd", fontSize=7.5, fontName="Courier", textColor=BODY_TEXT, leading=12))
    ]], colWidths=[179*mm])
    body.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,-1),WHITE),
        ("TOPPADDING",(0,0),(-1,-1),7),("BOTTOMPADDING",(0,0),(-1,-1),7),
        ("LEFTPADDING",(0,0),(-1,-1),8),("RIGHTPADDING",(0,0),(-1,-1),8),
    ]))
    wrap = Table([[hdr],[body]], colWidths=[179*mm])
    wrap.setStyle(TableStyle([
        ("BOX",(0,0),(-1,-1),1.5,bc),
        ("TOPPADDING",(0,0),(-1,-1),0),("BOTTOMPADDING",(0,0),(-1,-1),0),
        ("LEFTPADDING",(0,0),(-1,-1),0),("RIGHTPADDING",(0,0),(-1,-1),0),
    ]))
    story.append(wrap)
    story.append(Spacer(1,5))

# ══════════════════════════════════════════
# SECTION 4 — TRIAL CHECKLIST + BUILDER BOX
# ══════════════════════════════════════════
story.append(Spacer(1,4))
story.append(HRFlowable(width="100%", thickness=1.5, color=VIOLET, spaceAfter=6))
story.append(Paragraph("TRIAL RUN — 5 CHECKPOINTS KIERAN WILL TEST",
    ParagraphStyle("H4", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))

chk = [
    ["#","Stage","What Kieran Does","What Should Happen","How Simpee Verifies"],
    ["1","Stage 2-4\nAI Response",
     "Types any message in the chat input and hits send.",
     "Loading dots appear. Response card shows ANALYSIS, SOLUTION, CODE, and BUILDER INSTRUCTION sections. Card is labelled with model name.",
     "SChatMessage entity has new record after response."],
    ["2","Stage 5\nTestLog auto",
     "No extra action — same message as checkpoint 1.",
     "TestLog has a new record automatically written: validator=Simpee, status=pass.",
     "Read TestLog entity — compare count before and after."],
    ["3","Stage 7\nGatekeeper",
     "Clicks [RUN VALIDATION] button in right panel.",
     "4 Gatekeeper rows update with green or red indicators. 4 new TestLog records written with validator=Copilot.",
     "Filter TestLog by validator=Copilot — should show 4 new entries."],
    ["4","Stage 4\nSandbox Save",
     "Clicks [SAVE CODE TO SANDBOX] button.",
     "Success toast appears. ProjectFile entity has new record. File count increments.",
     "Read ProjectFile entity — check project_id matches SandboxProject."],
    ["5","Full Loop",
     "Runs checkpoints 1-4 in sequence.",
     "All 4 entity writes confirmed: SChatMessage + TestLog(Simpee) + TestLog x4(Copilot) + ProjectFile. Core loop proven.",
     "Simpee checks all 4 entities — all confirm written."],
]
ck = Table(chk, colWidths=[8*mm, 20*mm, 38*mm, 60*mm, 53*mm])
ck.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),("FONTSIZE",(0,0),(-1,-1),7.5),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),("TEXTCOLOR",(0,1),(0,-1),VIOLET),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,5),(-1,5),LIGHT_GREEN),("FONTNAME",(0,5),(-1,5),"Helvetica-Bold"),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),5),("VALIGN",(0,0),(-1,-1),"TOP"),
    ("ALIGN",(0,0),(0,-1),"CENTER"),
]))
story.append(ck)
story.append(Spacer(1,8))

# BUILDER PASTE BOX
story.append(Paragraph("BUILDER — PASTE THIS PREFIX INTO NEXUS COMMAND BUILDER CHAT",
    ParagraphStyle("H5", fontSize=10, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
paste = (
    "Fix 4 frontend wiring issues in CommandAIHub.jsx for the Nexus Command app. "
    "This is a SCOPED fix — do NOT rebuild the layout, do NOT change backend functions, do NOT change entity schemas. "
    "Everything on the backend is already live and confirmed working. You are only wiring the frontend to call them correctly.\n\n"
    "FIX 1 — Chat input to aiCommandCentre (used in Stages 2, 4, 6 of the 8-stage workflow):\n"
    "Change the fetch call to POST /api/run/aiCommandCentre with body { instruction: userMessage, posted_by: 'Kieran' }. "
    "Show 'Simpee is working...' loading dots while waiting. "
    "On success render 4 sections in centre panel: ANALYSIS (white) · SOLUTION (lavender #e8e6fe) · CODE (dark monospace with copy button) · BUILDER INSTRUCTION (amber #fffbeb). "
    "Label the card with response.model.\n\n"
    "FIX 2 — consultCopilot field name (Stage 7 Validation only):\n"
    "The [RUN VALIDATION] button must send { question: lastCode, context: lastBuilderInstruction } — NOT { code: ... }. "
    "On response update 4 Gatekeeper rows: Syntax / Logic / Security / Azure with green tick or red flag. "
    "Write 4 TestLog records with validator='Copilot', one per check.\n\n"
    "FIX 3 — Auto TestLog write after every aiCommandCentre response (Stage 5):\n"
    "Write TestLog: { test_name: 'Trial Run — '+instruction.substring(0,40), status: 'pass', result: 'Model: '+response.model, tested_at: new Date().toISOString(), fixed: false, validator: 'Simpee' }.\n\n"
    "FIX 4 — Sandbox Project card in right panel (Stages 1 and 4):\n"
    "Fetch SandboxProject entity on page load. Show first record: name, status badge (DRAFT=grey/TESTING=amber/APPROVED=green/DEPLOY READY=blue), checkpoint_status. "
    "Add [SAVE CODE TO SANDBOX] button in Azure blue #0078d4. "
    "On click write ProjectFile: { project_id: [id], filename: 'response_'+Date.now()+'.ts', content: lastCode, language: 'typescript', version: '1.0' }. "
    "Show success toast. Increment file count.\n\n"
    "Design system: background #e8e6fe · accent #5e50fb · Azure #0078d4 · Exo 2 headlines · Montserrat body. No emoji icons."
)
story.append(Table([[
    Paragraph(paste.replace("\n","<br/>"),
        ParagraphStyle("px", fontSize=7.5, fontName="Helvetica", textColor=BODY_TEXT, leading=13))
]], colWidths=[179*mm]))
story[-1].setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,-1),YELLOW),
    ("BOX",(0,0),(-1,-1),2,YELLOW_B),
    ("PADDING",(0,0),(-1,-1),10),
]))
story.append(Spacer(1,8))

# FOOTER
ft = Table([[
    p("Nexus Command Trial Run Blueprint v3 FULL · SIMPLEX-ITY · Confidential · No truncation", color=MUTED),
    p(f"Kieran Li + Simpee · {today}", color=VIOLET, bold=True)
]], colWidths=[120*mm, 63*mm])
ft.setStyle(TableStyle([("TOPPADDING",(0,0),(-1,-1),6),("LINEABOVE",(0,0),(-1,0),0.5,NEUTRAL),
    ("ALIGN",(1,0),(1,0),"RIGHT")]))
story.append(ft)

doc.build(story)
print("PDF built OK — v3 FULL no truncation")
