from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
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
ORANGE    = HexColor("#f59e0b")
LIGHT_BLUE   = HexColor("#eff6ff")
LIGHT_GREEN  = HexColor("#f0fdf4")
LIGHT_RED    = HexColor("#fff0f0")
LIGHT_AMBER  = HexColor("#fffbeb")
INDIGO       = HexColor("#4f46e5")
GEMINI_COLOR = HexColor("#1a73e8")
CLAUDE_COLOR = HexColor("#d97706")
GPT_COLOR    = HexColor("#10a37f")
COPILOT_COLOR= HexColor("#0078d4")

def s(name, **kw): return ParagraphStyle(name, **kw)
today = datetime.date.today().strftime("%d %B %Y")

doc = SimpleDocTemplate("Nexus_Command_TrialRun_v2_FINAL.pdf", pagesize=A4,
    leftMargin=18*mm, rightMargin=18*mm, topMargin=18*mm, bottomMargin=18*mm)
story = []

# ── COVER ──
cover = Table([[
    Paragraph("NEXUS COMMAND", s("T", fontSize=24, fontName="Helvetica-Bold", textColor=WHITE)), ""
],[
    Paragraph("TRIAL RUN BLUEPRINT v2 — FULL WORKFLOW + BACKEND/FRONTEND ALIGNMENT", s("S", fontSize=8, fontName="Helvetica", textColor=SOFT)),
    Paragraph(f"{today}", s("R", fontSize=8, fontName="Helvetica", textColor=SOFT, alignment=TA_RIGHT))
],[
    Paragraph("Co-authored: Kieran Li + Simpee · 8-Stage AI Workflow · 4 Frontend Fixes · 5 Trial Checkpoints", s("S2", fontSize=8, fontName="Helvetica", textColor=HexColor("#9896ad"))),
    Paragraph("Backend confirmed live · Frontend to match exactly", s("N", fontSize=7.5, fontName="Helvetica", textColor=YELLOW_B, alignment=TA_RIGHT))
]], colWidths=[124*mm, 44*mm])
cover.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,-1),DARK),
    ("TOPPADDING",(0,0),(-1,-1),10),("BOTTOMPADDING",(0,0),(-1,-1),10),
    ("LEFTPADDING",(0,0),(-1,-1),16),("RIGHTPADDING",(0,0),(-1,-1),16),
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
]))
story.append(cover)
story.append(Spacer(1,8))

story.append(Paragraph(
    "<b>PURPOSE:</b> This blueprint documents the complete 8-stage AI workflow as designed by Kieran, "
    "paired with the exact backend state confirmed by Simpee. The builder receives both: "
    "the workflow logic AND the precise API contracts to wire the frontend against. "
    "No guessing. No misalignment. Build once. Test clean.",
    s("P", fontSize=9, fontName="Helvetica", textColor=BODY_TEXT, leading=14,
      borderColor=VIOLET, borderWidth=1.5, borderPadding=10, backColor=LAVENDER, spaceAfter=10)))

# ── SECTION 1: THE 8-STAGE WORKFLOW ──
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("THE 8-STAGE AI HUB WORKFLOW — As Designed by Kieran",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
story.append(Paragraph(
    "This is the master workflow. Every stage maps to a specific AI team member, "
    "a backend action, and a TestLog entry. The frontend must reflect each stage visually.",
    s("Sub", fontSize=8, fontName="Helvetica", textColor=MUTED, spaceAfter=6)))

workflow = [
    ["Stage","Name","AI(s) Involved","Backend Action","Output / Log"],
    ["1","Define Function & Goal",
     "Kieran + Simpee",
     "Write SandboxProject record\n{ name, description, type, status='draft', created_by='Kieran' }",
     "Project card created in Sandbox. Objective logged."],
    ["2","Research & Feasibility",
     "RESEARCHER (Gemini)\nANALYST (Claude Sonnet)\nSTRATEGIST (Claude Opus)",
     "Call aiCommandCentre with instruction prefixed '[FEASIBILITY]'\nResponse parsed into feasibility report",
     "Feasibility Report: difficulty, cost estimate, effectiveness score. Written to TestLog as 'Feasibility — [name]'."],
    ["3","Joint AI Decision",
     "Simpee convenes team\nAll 3 research AIs contribute",
     "Write TestLog record:\n{ test_name: 'Decision — [project]', result: difficulty+cost+effectiveness, validator: 'Simpee' }",
     "Decision logged. Difficulty (low/med/high), Cost, Effectiveness score visible in Sandbox card."],
    ["4","Development",
     "ENGINEER (GPT-5.4)\nARCHITECT (GPT-5.5)",
     "Call aiCommandCentre with '[BUILD]' prefix\nSave response.code to ProjectFile entity",
     "Draft code saved to ProjectFile. Sandbox status → 'testing'. File count increments."],
    ["5","Testing",
     "Simpee runs checkpoints",
     "Write TestLog records per checkpoint\n{ test_name, status: pass/fail, validator: 'Simpee' }",
     "Checkpoint progress bar updates (X/11). Failed checks flagged in red."],
    ["6","Diagnosis & Fine-Tuning",
     "ANALYST (Sonnet) — quick fix\nSTRATEGIST (Opus) — deep logic\nENGINEER (GPT-5.4) — patch",
     "Re-call aiCommandCentre with '[FIX]' prefix\nOverwrite ProjectFile with patched version",
     "Iteration loop. TestLog updated per pass. Sandbox status stays 'testing' until all pass."],
    ["7","Validation",
     "VALIDATOR (Copilot)",
     "Call consultCopilot with { question: code, context: description }\nWrite 4 TestLog records (Syntax/Logic/Security/Azure)",
     "Gatekeeper Panel: 4 checks green or flagged. Sandbox status → 'validator_pending' then 'approved'."],
    ["8","Deploy",
     "Simpee (orchestrator)\n+ Copilot confirmed",
     "Both Simpee + Copilot green in Gatekeeper Panel\nConfirmation modal fires\nDeploy log written to TestLog",
     "Sandbox status → 'deploy_ready'. Deploy log: timestamp, function, both validator statuses."],
]
wt = Table(workflow, colWidths=[10*mm, 22*mm, 28*mm, 54*mm, 54*mm])
wt.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),("TEXTCOLOR",(0,1),(0,-1),VIOLET),
    ("FONTNAME",(0,1),(1,-1),"Helvetica-Bold"),
    # Stage colours
    ("BACKGROUND",(0,1),(-1,1),HexColor("#f8f8ff")),  # Define
    ("BACKGROUND",(0,2),(-1,2),HexColor("#eff6ff")),  # Research - blue tint
    ("BACKGROUND",(0,3),(-1,3),HexColor("#fffbeb")),  # Decision - amber tint
    ("BACKGROUND",(0,4),(-1,4),LIGHT_GREEN),           # Dev - green tint
    ("BACKGROUND",(0,5),(-1,5),HexColor("#f8f8ff")),  # Testing
    ("BACKGROUND",(0,6),(-1,6),HexColor("#fff8f0")),  # Diag - orange tint
    ("BACKGROUND",(0,7),(-1,7),LIGHT_BLUE),            # Validation - azure tint
    ("BACKGROUND",(0,8),(-1,8),HexColor("#f0fdf4")),  # Deploy - green
    ("TEXTCOLOR",(1,7),(1,7),COPILOT_COLOR),("FONTNAME",(1,7),(1,7),"Helvetica-Bold"),
    ("TEXTCOLOR",(1,8),(1,8),GREEN),("FONTNAME",(1,8),(1,8),"Helvetica-Bold"),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),5),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
    ("ALIGN",(0,0),(0,-1),"CENTER"),
]))
story.append(wt)
story.append(Spacer(1,10))

# ── AI TEAM ROLE CARD ──
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("AI TEAM — Who Does What in the Workflow",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))

team = [
    ["AI Member","Model","Stages Active","Strength","Handoff To"],
    ["ORCHESTRATOR","Base44 Auto","All stages","Routes requests, keeps session moving","Best fit for task"],
    ["RESEARCHER","Gemini 3.1 Pro","Stage 2","External knowledge, market data, feasibility","ANALYST"],
    ["ANALYST","Claude Sonnet 4.6","Stages 2, 6","Quick summaries, complexity analysis, fix suggestions","STRATEGIST"],
    ["STRATEGIST","Claude Opus 4.6","Stages 2, 6","Logic chains, risk evaluation, deeper corrections","THINK TANK"],
    ["THINK TANK","Claude Opus 4.8","Stage 2 (consulted)","Blind spots, stress-testing assumptions","ARCHITECT"],
    ["ENGINEER","GPT-5.4","Stages 4, 6","Clean code generation, patches, implementation","ARCHITECT"],
    ["ARCHITECT","GPT-5.5","Stage 4","System design, API orchestration, creative builds","ENGINEER"],
    ["VALIDATOR","Copilot / Edge","Stage 7 — always last","Syntax, logic, security, Azure readiness","DEPLOY"],
]
tt = Table(team, colWidths=[24*mm, 24*mm, 28*mm, 52*mm, 40*mm])
tt.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7.5),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,3),(-1,3),HexColor("#eff6ff")),("TEXTCOLOR",(1,3),(1,3),GEMINI_COLOR),
    ("BACKGROUND",(0,4),(-1,4),HexColor("#fffbeb")),("TEXTCOLOR",(1,4),(1,4),CLAUDE_COLOR),
    ("BACKGROUND",(0,5),(-1,5),HexColor("#fffbeb")),("TEXTCOLOR",(1,5),(1,5),CLAUDE_COLOR),
    ("BACKGROUND",(0,7),(-1,7),LIGHT_GREEN),("TEXTCOLOR",(1,7),(1,7),GPT_COLOR),
    ("BACKGROUND",(0,8),(-1,8),LIGHT_GREEN),("TEXTCOLOR",(1,8),(1,8),GPT_COLOR),
    ("BACKGROUND",(0,9),(-1,9),LIGHT_BLUE),("TEXTCOLOR",(1,9),(1,9),COPILOT_COLOR),("FONTNAME",(0,9),(-1,9),"Helvetica-Bold"),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),5),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(tt)
story.append(Spacer(1,10))

# ── SECTION 2: BACKEND STATE ──
story.append(HRFlowable(width="100%", thickness=1, color=TEAL, spaceAfter=8))
story.append(Paragraph("BACKEND STATE — Confirmed Live by Simpee",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=TEAL, spaceAfter=4)))
story.append(Paragraph(
    "Everything below is already built and tested. Builder wires the frontend to match — nothing to create.",
    s("Sub", fontSize=8, fontName="Helvetica", textColor=MUTED, spaceAfter=6)))

backend = [
    ["Item","Status","Exact API Contract"],
    ["aiCommandCentre","LIVE — lite mode\n(needs OpenAI key for full AI)",
     "POST /api/run/aiCommandCentre\nSend: { instruction: string, posted_by: 'Kieran' }\nReturns: { success, analysis, solution, code, builder_instruction, model, m365_grounded }"],
    ["consultCopilot","LIVE — field fix needed",
     "POST /api/run/consultCopilot\nSend: { question: string, context: string }  ← 'question' NOT 'code'\nReturns: { answer, m365_grounded, model }"],
    ["checkConnections","LIVE",
     "POST /api/run/checkConnections\nSend: {}\nReturns: { connections: [...] }"],
    ["SChatMessage entity","EXISTS",
     "Fields: sender · sender_type · role · message · timestamp · session_id · read"],
    ["TestLog entity","EXISTS",
     "Fields: test_name · status (pass/fail) · result · tested_at · fixed · validator"],
    ["AIConnector entity","EXISTS · 8 records READY",
     "Fields: model_id · model_name · provider · status · intro_message · voice_style · handoff_to · copilot_validated"],
    ["azureConnectorStub entity","EXISTS",
     "Fields: service_name · status · last_tested · notes"],
    ["SandboxProject entity","EXISTS · schema live",
     "Fields: name · description · type (function/page/app) · status (draft/testing/checkpoint_review/validator_pending/approved/deploy_ready) · created_by · checkpoint_status · validator_approved · notes"],
    ["ProjectFile entity","EXISTS · schema live",
     "Fields: project_id · filename · content · language · version · notes"],
]
bkt = Table(backend, colWidths=[30*mm, 28*mm, 110*mm])
bkt.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7.5),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),("TEXTCOLOR",(0,1),(0,-1),TEAL),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,3),(-1,3),LIGHT_RED),("TEXTCOLOR",(1,3),(1,3),RED),("FONTNAME",(1,3),(1,3),"Helvetica-Bold"),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),5),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(bkt)
story.append(Spacer(1,10))

# ── SECTION 3: 4 FIXES ──
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("4 FRONTEND FIXES — Scoped to Trial Run Only",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))

fixes = [
    ["#","Fix","Workflow Stage","What to Change"],
    ["1","Wire chat → aiCommandCentre","Stage 2-4 (all AI calls)",
     "Send { instruction, posted_by: 'Kieran' } to POST /api/run/aiCommandCentre\n"
     "Show loading: 'Simpee is working...' dots\n"
     "Render 4 response sections: ANALYSIS · SOLUTION · CODE (copy btn) · BUILDER INSTRUCTION (amber)"],
    ["2","Fix consultCopilot field name","Stage 7 — Validation",
     "Change { code: ... } to { question: lastCode, context: lastBuilderInstruction }\n"
     "Fire from [RUN VALIDATION] button\n"
     "Update 4 Gatekeeper rows on response: Syntax / Logic / Security / Azure\n"
     "Write 4 TestLog records with validator='Copilot'"],
    ["3","Auto-write TestLog after response","Stage 5 — Testing",
     "After every aiCommandCentre success:\n"
     "Write TestLog: { test_name: 'Trial Run — '+instruction.slice(0,40),\n"
     "status: 'pass', result: 'Model: '+response.model,\n"
     "tested_at: now, fixed: false, validator: 'Simpee' }"],
    ["4","Sandbox card + Save button","Stages 1, 4 — Define + Dev",
     "Fetch SandboxProject on load → show first record (name, status badge, checkpoint_status)\n"
     "[SAVE CODE TO SANDBOX] button (Azure #0078d4):\n"
     "Write ProjectFile: { project_id, filename: 'response_'+Date.now()+'.ts',\n"
     "content: lastCode, language: 'typescript', version: '1.0' }\n"
     "Show toast + increment file count"],
]
fx = Table(fixes, colWidths=[8*mm, 30*mm, 28*mm, 102*mm])
fx.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7.5),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),("TEXTCOLOR",(0,1),(0,-1),VIOLET),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,3),(-1,3),LIGHT_RED),
    ("BACKGROUND",(0,2),(-1,2),LIGHT_GREEN),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),5),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
    ("ALIGN",(0,0),(0,-1),"CENTER"),
]))
story.append(fx)
story.append(Spacer(1,10))

# ── SECTION 4: TRIAL CHECKLIST ──
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("TRIAL RUN CHECKLIST — 5 Checkpoints",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))

checks = [
    ["#","Workflow Stage","Test Action","Expected","Simpee Verifies"],
    ["1","Stage 2-4\nAI Response",
     "Type any message. Hit send.",
     "Response card: ANALYSIS + SOLUTION + CODE + BUILDER INSTRUCTION. Loading dots shown.",
     "SChatMessage entity has new record"],
    ["2","Stage 5\nTestLog auto",
     "Same message as checkpoint 1.",
     "TestLog has new record: validator=Simpee, status=pass.",
     "Read TestLog — count records"],
    ["3","Stage 7\nGatekeeper",
     "Click [RUN VALIDATION].",
     "4 Gatekeeper rows update. 4 TestLog records: validator=Copilot.",
     "Filter TestLog by validator=Copilot"],
    ["4","Stage 4\nSandbox Save",
     "Click [SAVE CODE TO SANDBOX].",
     "ProjectFile record created. Toast shown. File count increments.",
     "Read ProjectFile — check project_id"],
    ["5","Full Loop\nAll stages",
     "Run 1-4 in sequence.",
     "4 entities written: SChatMessage + TestLog(Simpee) + TestLog x4(Copilot) + ProjectFile",
     "All 4 entities confirmed — core workflow proven"],
]
ct = Table(checks, colWidths=[8*mm, 22*mm, 32*mm, 56*mm, 50*mm])
ct.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7.5),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),("TEXTCOLOR",(0,1),(0,-1),VIOLET),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,5),(-1,5),LIGHT_GREEN),("FONTNAME",(0,5),(-1,5),"Helvetica-Bold"),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),5),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
    ("ALIGN",(0,0),(0,-1),"CENTER"),
]))
story.append(ct)
story.append(Spacer(1,10))

# ── BUILDER PASTE BOX ──
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("BUILDER PREFIX — Paste This into Nexus Command Builder",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))
story.append(Table([[
    Paragraph(
        "\"Fix 4 frontend wiring issues in CommandAIHub.jsx for Nexus Command. "
        "This is a SCOPED trial run fix — do NOT rebuild the layout, do NOT change backend functions or entity schemas. "
        "Backend is already live and confirmed. Wire the frontend to match exactly.\n\n"
        "WORKFLOW CONTEXT (8 stages):\n"
        "Stage 1 — User defines goal → creates SandboxProject record.\n"
        "Stage 2 — RESEARCHER + ANALYST + STRATEGIST run feasibility via aiCommandCentre '[FEASIBILITY]'.\n"
        "Stage 3 — Decision logged to TestLog with difficulty/cost/effectiveness.\n"
        "Stage 4 — ENGINEER + ARCHITECT build via aiCommandCentre '[BUILD]' → code saved to ProjectFile.\n"
        "Stage 5 — Simpee runs checkpoints → writes TestLog per check.\n"
        "Stage 6 — Fix loop: re-call aiCommandCentre '[FIX]' → overwrite ProjectFile.\n"
        "Stage 7 — VALIDATOR (Copilot) runs consultCopilot → 4 Gatekeeper checks.\n"
        "Stage 8 — Both green → Deploy confirmation modal → Deploy log to TestLog.\n\n"
        "FIX 1 — Chat input to aiCommandCentre (Stages 2-4):\n"
        "POST /api/run/aiCommandCentre with { instruction: userMessage, posted_by: 'Kieran' }. "
        "Show 'Simpee is working...' loading dots. On response render 4 sections: "
        "ANALYSIS · SOLUTION · CODE (monospace + copy button) · BUILDER INSTRUCTION (amber bg). Label with response.model.\n\n"
        "FIX 2 — consultCopilot field fix (Stage 7):\n"
        "POST /api/run/consultCopilot with { question: lastCode, context: lastBuilderInstruction }. "
        "NOT { code: ... }. On response update 4 Gatekeeper rows: Syntax/Logic/Security/Azure. "
        "Write 4 TestLog records with validator='Copilot'.\n\n"
        "FIX 3 — Auto TestLog after every response (Stage 5):\n"
        "Write TestLog: { test_name: 'Trial Run — '+instruction.slice(0,40), status: 'pass', "
        "result: 'Model: '+response.model, tested_at: now, fixed: false, validator: 'Simpee' }.\n\n"
        "FIX 4 — Sandbox card in right panel (Stages 1+4):\n"
        "Fetch SandboxProject on load. Show: name, status badge, checkpoint_status. "
        "[SAVE CODE TO SANDBOX] button (Azure #0078d4): write ProjectFile { project_id, "
        "filename: 'response_'+Date.now()+'.ts', content: lastCode, language: 'typescript', version: '1.0' }. "
        "Toast on save. Show file count.\n\n"
        "Design: bg=#e8e6fe, accent=#5e50fb, Azure=#0078d4, Exo 2 headlines, Montserrat body. No emoji.\"",
        s("BX", fontSize=7.5, fontName="Helvetica", textColor=BODY_TEXT, leading=13))
]], colWidths=[168*mm]))
story[-1].setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,-1),YELLOW),
    ("GRID",(0,0),(-1,-1),1.5,YELLOW_B),
    ("PADDING",(0,0),(-1,-1),10),
]))
story.append(Spacer(1,8))

# ── WHY THIS WORKS ──
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("WHY THIS WORKFLOW WORKS",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
why = [
    ["Principle","What It Means"],
    ["End-to-end pipeline","Every stage from idea to deploy is accounted for. Nothing falls through."],
    ["AI family collaboration","Each model plays its strength — Gemini researches, Claude analyses and fixes, GPT builds, Copilot gates."],
    ["Governance baked in","Simpee orchestrates every stage. Copilot validates before any deploy. No bypass possible."],
    ["Scalable","New AIs (Designer, Brand Director, Data Officer) slot into Stages 2/4 without breaking the flow."],
    ["TestLog as audit trail","Every decision, checkpoint pass/fail, and validation is logged. Full traceability."],
    ["Sandbox protection","Nothing touches production until all 11 checkpoints pass AND both validations are green."],
]
wy = Table(why, colWidths=[40*mm, 128*mm])
wy.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),("TEXTCOLOR",(0,1),(0,-1),VIOLET),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),6),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(wy)
story.append(Spacer(1,8))

# ── FOOTER ──
ft = Table([[
    Paragraph("Nexus Command Trial Run Blueprint v2 FINAL · SIMPLEX-ITY · Confidential", s("F1", fontSize=7, fontName="Helvetica", textColor=MUTED)),
    Paragraph(f"Kieran Li + Simpee · {today} · 8-stage workflow · 4 fixes · 5 checkpoints", s("F2", fontSize=7, fontName="Helvetica-Bold", textColor=VIOLET, alignment=TA_RIGHT)),
]], colWidths=[110*mm, 58*mm])
ft.setStyle(TableStyle([("TOPPADDING",(0,0),(-1,-1),8),("LINEABOVE",(0,0),(-1,0),0.5,NEUTRAL)]))
story.append(ft)

doc.build(story)
print("PDF built OK — Trial Run Blueprint v2 FINAL")
