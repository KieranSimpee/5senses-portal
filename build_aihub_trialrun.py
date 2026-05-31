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
LIGHT_BLUE  = HexColor("#eff6ff")
LIGHT_GREEN = HexColor("#f0fdf4")
LIGHT_RED   = HexColor("#fff0f0")
LIGHT_AMBER = HexColor("#fffbeb")

def s(name, **kw): return ParagraphStyle(name, **kw)
today = datetime.date.today().strftime("%d %B %Y")

doc = SimpleDocTemplate("Nexus_Command_TrialRun_Blueprint.pdf", pagesize=A4,
    leftMargin=18*mm, rightMargin=18*mm, topMargin=18*mm, bottomMargin=18*mm)
story = []

# ── COVER ──
cover = Table([[
    Paragraph("NEXUS COMMAND", s("T", fontSize=24, fontName="Helvetica-Bold", textColor=WHITE)), ""
],[
    Paragraph("TRIAL RUN BLUEPRINT — BACKEND + FRONTEND ALIGNMENT BRIEF", s("S", fontSize=8, fontName="Helvetica", textColor=SOFT)),
    Paragraph(f"{today}", s("R", fontSize=8, fontName="Helvetica", textColor=SOFT, alignment=TA_RIGHT))
],[
    Paragraph("For: Base44 Builder AI · From: Simpee · Parallel with backend changes already deployed", s("S2", fontSize=8, fontName="Helvetica", textColor=HexColor("#9896ad"))),
    Paragraph("Fix 4 issues · Test 5 checkpoints · Prove the core loop", s("N", fontSize=7.5, fontName="Helvetica", textColor=YELLOW_B, alignment=TA_RIGHT))
]], colWidths=[124*mm, 44*mm])
cover.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,-1),DARK),
    ("TOPPADDING",(0,0),(-1,-1),10),("BOTTOMPADDING",(0,0),(-1,-1),10),
    ("LEFTPADDING",(0,0),(-1,-1),16),("RIGHTPADDING",(0,0),(-1,-1),16),
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
]))
story.append(cover)
story.append(Spacer(1,8))

# ── CONTEXT ──
story.append(Paragraph(
    "<b>PURPOSE:</b> This brief tells the Base44 builder exactly what is already built on the backend "
    "so the frontend can be wired to match precisely. No guessing. No misalignment. "
    "Every function, every field name, every expected payload and response shape is documented here. "
    "The builder only needs to wire the frontend to what already exists.",
    s("P", fontSize=9, fontName="Helvetica", textColor=BODY_TEXT, leading=14,
      borderColor=VIOLET, borderWidth=1.5, borderPadding=10, backColor=LAVENDER, spaceAfter=10)))

# ── WHAT IS ALREADY BUILT ──
story.append(HRFlowable(width="100%", thickness=1, color=TEAL, spaceAfter=8))
story.append(Paragraph("WHAT IS ALREADY BUILT — Backend State as of Today",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=TEAL, spaceAfter=4)))
story.append(Paragraph(
    "The builder does NOT need to create any of these. They exist and are tested. "
    "The frontend just needs to call them correctly.",
    s("Sub", fontSize=8, fontName="Helvetica", textColor=MUTED, spaceAfter=6)))

built = [
    ["Item","Name / ID","Status","Notes"],
    ["Function","aiCommandCentre","LIVE","Responds to instruction. Returns analysis, solution, code, builder_instruction. Currently in lite mode — needs OpenAI key for full AI. Structure is complete."],
    ["Function","consultCopilot","LIVE — field mismatch","Expects { question, context } NOT { code, context }. Frontend must send 'question' not 'code'. Fix is one word."],
    ["Function","checkConnections","LIVE","Pings all AI connectors. Returns status per connection."],
    ["Function","syncToOneDrive","LIVE","Saves session to OneDrive. Called after deploy."],
    ["Entity","SChatMessage","EXISTS · 1 record","Fields: sender, sender_type, role, message, timestamp, session_id, read"],
    ["Entity","TestLog","EXISTS · 1 record","Fields: test_name, status, result, tested_at, fixed, validator"],
    ["Entity","AIConnector","EXISTS · 8 records","All 8 READY. Fields: model_name, intro_message, voice_style, handoff_to, status, provider, model_id, copilot_validated"],
    ["Entity","azureConnectorStub","EXISTS · 1 record","Fields: service_name, status, last_tested, notes"],
    ["Entity","SandboxProject","EXISTS · 0 records","Fields: name, description, type, status, created_by, checkpoint_status, validator_approved, notes. Status enum: draft/testing/checkpoint_review/validator_pending/approved/deploy_ready"],
    ["Entity","ProjectFile","EXISTS · 1 record","Fields: project_id, filename, content, language, version, notes"],
]
bt = Table(built, colWidths=[18*mm, 32*mm, 26*mm, 92*mm])
bt.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7.5),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),("TEXTCOLOR",(0,1),(0,-1),TEAL),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,3),(-1,3),LIGHT_RED),("TEXTCOLOR",(2,3),(2,3),RED),("FONTNAME",(2,3),(2,3),"Helvetica-Bold"),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),6),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(bt)
story.append(Spacer(1,10))

# ── 4 FRONTEND FIXES ──
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("4 FRONTEND FIXES — Exact Changes Required",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
story.append(Paragraph(
    "These are the only changes needed. Do not rebuild the layout. Do not change entity schemas. "
    "Wire the existing UI to the existing backend correctly.",
    s("Sub", fontSize=8, fontName="Helvetica", textColor=MUTED, spaceAfter=6)))

# FIX 1
story.append(Table([[
    Paragraph("FIX 1", s("FL", fontSize=9, fontName="Helvetica-Bold", textColor=WHITE)),
    Paragraph("Wire chat input → aiCommandCentre correctly",
        s("FT", fontSize=9, fontName="Helvetica-Bold", textColor=DARK))
]], colWidths=[16*mm, 152*mm]))
story[-1].setStyle(TableStyle([
    ("BACKGROUND",(0,0),(0,0),VIOLET),("BACKGROUND",(1,0),(1,0),LAVENDER),
    ("PADDING",(0,0),(-1,-1),6),("VALIGN",(0,0),(-1,-1),"MIDDLE"),
]))
story.append(Table([[
    Paragraph(
        "Function URL:  POST /api/run/aiCommandCentre\n\n"
        "Send this exact payload:\n"
        "{\n"
        "  \"instruction\": \"[user's typed message]\",\n"
        "  \"posted_by\": \"Kieran\"\n"
        "}\n\n"
        "On success, display in centre panel:\n"
        "  Card header: model name from response.model\n"
        "  Section 1 — ANALYSIS: response.analysis\n"
        "  Section 2 — SOLUTION: response.solution\n"
        "  Section 3 — CODE: response.code (monospace block, copy button)\n"
        "  Section 4 — BUILDER INSTRUCTION: response.builder_instruction (amber bg)\n\n"
        "Show loading state: 'Simpee is working...' with animated dots while awaiting response.",
        s("CODE", fontSize=7.5, fontName="Courier", textColor=BODY_TEXT, leading=12))
]], colWidths=[168*mm]))
story[-1].setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),HexColor("#f8f8ff")),("GRID",(0,0),(-1,-1),0.5,NEUTRAL),("PADDING",(0,0),(-1,-1),8)]))
story.append(Spacer(1,6))

# FIX 2
story.append(Table([[
    Paragraph("FIX 2", s("FL", fontSize=9, fontName="Helvetica-Bold", textColor=WHITE)),
    Paragraph("Fix consultCopilot payload — change 'code' to 'question'",
        s("FT", fontSize=9, fontName="Helvetica-Bold", textColor=DARK))
]], colWidths=[16*mm, 152*mm]))
story[-1].setStyle(TableStyle([
    ("BACKGROUND",(0,0),(0,0),RED),("BACKGROUND",(1,0),(1,0),LIGHT_RED),
    ("PADDING",(0,0),(-1,-1),6),("VALIGN",(0,0),(-1,-1),"MIDDLE"),
]))
story.append(Table([[
    Paragraph(
        "Function URL:  POST /api/run/consultCopilot\n\n"
        "WRONG (current):   { \"code\": \"...\", \"context\": \"...\" }\n"
        "CORRECT (fix to):  { \"question\": \"...\", \"context\": \"...\" }\n\n"
        "Where to get the values:\n"
        "  question = response.code from the last aiCommandCentre response\n"
        "  context  = response.builder_instruction from the same response\n\n"
        "The [RUN VALIDATION] button in the Gatekeeper Panel fires this call.\n"
        "On response, update the 4 Gatekeeper check rows:\n"
        "  Syntax · Logic · Security · Azure\n"
        "Each row: show green tick if passed, red flag if issue found.\n"
        "Write 1 TestLog record per check with validator='Copilot'.",
        s("CODE", fontSize=7.5, fontName="Courier", textColor=BODY_TEXT, leading=12))
]], colWidths=[168*mm]))
story[-1].setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),HexColor("#fff8f8")),("GRID",(0,0),(-1,-1),0.5,RED),("PADDING",(0,0),(-1,-1),8)]))
story.append(Spacer(1,6))

# FIX 3
story.append(Table([[
    Paragraph("FIX 3", s("FL", fontSize=9, fontName="Helvetica-Bold", textColor=WHITE)),
    Paragraph("Auto-write TestLog after every aiCommandCentre response",
        s("FT", fontSize=9, fontName="Helvetica-Bold", textColor=DARK))
]], colWidths=[16*mm, 152*mm]))
story[-1].setStyle(TableStyle([
    ("BACKGROUND",(0,0),(0,0),TEAL),("BACKGROUND",(1,0),(1,0),LIGHT_GREEN),
    ("PADDING",(0,0),(-1,-1),6),("VALIGN",(0,0),(-1,-1),"MIDDLE"),
]))
story.append(Table([[
    Paragraph(
        "After every successful aiCommandCentre response, write to TestLog entity:\n\n"
        "POST /api/entities/TestLog\n"
        "{\n"
        "  \"test_name\": \"Trial Run — \" + instruction.slice(0,40),\n"
        "  \"status\": \"pass\",\n"
        "  \"result\": \"aiCommandCentre responded. Model: \" + response.model,\n"
        "  \"tested_at\": new Date().toISOString(),\n"
        "  \"fixed\": false,\n"
        "  \"validator\": \"Simpee\"\n"
        "}\n\n"
        "This auto-logs checkpoint 3 (aiCommandCentre responds) for every session.",
        s("CODE", fontSize=7.5, fontName="Courier", textColor=BODY_TEXT, leading=12))
]], colWidths=[168*mm]))
story[-1].setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),LIGHT_GREEN),("GRID",(0,0),(-1,-1),0.5,TEAL),("PADDING",(0,0),(-1,-1),8)]))
story.append(Spacer(1,6))

# FIX 4
story.append(Table([[
    Paragraph("FIX 4", s("FL", fontSize=9, fontName="Helvetica-Bold", textColor=WHITE)),
    Paragraph("Add Sandbox Project card + [SAVE CODE TO SANDBOX] button",
        s("FT", fontSize=9, fontName="Helvetica-Bold", textColor=DARK))
]], colWidths=[16*mm, 152*mm]))
story[-1].setStyle(TableStyle([
    ("BACKGROUND",(0,0),(0,0),AZURE),("BACKGROUND",(1,0),(1,0),LIGHT_BLUE),
    ("PADDING",(0,0),(-1,-1),6),("VALIGN",(0,0),(-1,-1),"MIDDLE"),
]))
story.append(Table([[
    Paragraph(
        "In the right panel, below the Deploy Log section, add a slim Sandbox card:\n\n"
        "1. On load: fetch SandboxProject entity — show the first record (trial project).\n"
        "   Display: name, status badge (DRAFT=grey / TESTING=amber / APPROVED=green), checkpoint_status\n\n"
        "2. Add [SAVE CODE TO SANDBOX] button (Azure #0078d4 bg).\n"
        "   On click: write to ProjectFile entity:\n"
        "   {\n"
        "     \"project_id\": [sandbox project id],\n"
        "     \"filename\": \"response_\" + Date.now() + \".ts\",\n"
        "     \"content\": [response.code from last aiCommandCentre response],\n"
        "     \"language\": \"typescript\",\n"
        "     \"version\": \"1.0\",\n"
        "     \"notes\": \"Saved from trial run\"\n"
        "   }\n"
        "   Show success toast: 'Code saved to Sandbox'\n\n"
        "3. Show file count below: 'X files saved to this project'",
        s("CODE", fontSize=7.5, fontName="Courier", textColor=BODY_TEXT, leading=12))
]], colWidths=[168*mm]))
story[-1].setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),LIGHT_BLUE),("GRID",(0,0),(-1,-1),0.5,AZURE),("PADDING",(0,0),(-1,-1),8)]))
story.append(Spacer(1,10))

# ── TEST CHECKLIST ──
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("TRIAL RUN TEST CHECKLIST — 5 Checkpoints to Pass",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
story.append(Paragraph(
    "Kieran will run these tests after the builder delivers. Simpee will verify each one against the entity records.",
    s("Sub", fontSize=8, fontName="Helvetica", textColor=MUTED, spaceAfter=6)))

checks = [
    ["#","Test","Action","Expected Result","Simpee Verifies By"],
    ["1","Chat → AI response",
     "Type any message in chat input. Hit send.",
     "Response card appears with ANALYSIS, SOLUTION, CODE sections. Loading dots shown while working.",
     "Check SChatMessage entity for new record"],
    ["2","TestLog auto-write",
     "Same as test 1 — no extra action needed.",
     "TestLog has a new record with validator=Simpee after the response appears.",
     "Read TestLog entity — count records"],
    ["3","Gatekeeper validation",
     "After a response, click [RUN VALIDATION] in right panel.",
     "4 check rows update: Syntax / Logic / Security / Azure. Each shows green or flagged. 4 TestLog records written with validator=Copilot.",
     "Read TestLog — filter validator=Copilot"],
    ["4","Save to Sandbox",
     "Click [SAVE CODE TO SANDBOX] button.",
     "Success toast appears. ProjectFile entity has new record linked to SandboxProject.",
     "Read ProjectFile entity — check project_id matches"],
    ["5","Full loop confirmed",
     "Run tests 1-4 in sequence.",
     "All 4 entity writes confirmed: SChatMessage + TestLog (Simpee) + TestLog x4 (Copilot) + ProjectFile",
     "All 4 entities checked — core loop proven"],
]
ct = Table(checks, colWidths=[8*mm, 24*mm, 32*mm, 52*mm, 52*mm])
ct.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7.5),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),("TEXTCOLOR",(0,1),(0,-1),VIOLET),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,5),(-1,5),LIGHT_GREEN),
    ("FONTNAME",(0,5),(-1,5),"Helvetica-Bold"),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),5),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
    ("ALIGN",(0,0),(0,-1),"CENTER"),
]))
story.append(ct)
story.append(Spacer(1,10))

# ── WHAT NOT TO TOUCH ──
story.append(HRFlowable(width="100%", thickness=1, color=RED, spaceAfter=8))
story.append(Paragraph("DO NOT TOUCH — Protected Items",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=RED, spaceAfter=4)))
dnt = [
    ["Do NOT change","Reason"],
    ["aiCommandCentre.ts backend code","Already tested and working. Only frontend payload needs fixing."],
    ["consultCopilot.ts backend code","Field mismatch is a frontend issue only — the function expects 'question' and that is correct."],
    ["Entity schemas","All schemas are correct and aligned. Do not modify."],
    ["Left panel AI selector layout","Not part of this trial run scope."],
    ["Any other pages or components","Scoped fix only — centre panel + right panel + chat input only."],
]
dt = Table(dnt, colWidths=[50*mm, 118*mm])
dt.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),("TEXTCOLOR",(0,1),(0,-1),RED),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LIGHT_RED]),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),6),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(dt)
story.append(Spacer(1,10))

# ── BUILDER PASTE BOX ──
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("BUILDER PREFIX — Paste This into Nexus Command Builder",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))
story.append(Table([[
    Paragraph(
        "\"Fix 4 frontend wiring issues in the Nexus Command app (CommandAIHub.jsx). "
        "Do NOT change any backend functions or entity schemas — they are already correct.\n\n"
        "FIX 1 — Chat input to aiCommandCentre:\n"
        "Send POST /api/run/aiCommandCentre with { instruction: userMessage, posted_by: 'Kieran' }. "
        "Show loading dots while waiting. On response, render 4 sections in centre panel: "
        "ANALYSIS · SOLUTION · CODE (monospace + copy button) · BUILDER INSTRUCTION (amber bg). "
        "Label card with response.model.\n\n"
        "FIX 2 — consultCopilot field name:\n"
        "The [RUN VALIDATION] button must send { question: lastCode, context: lastBuilderInstruction } "
        "NOT { code: ... }. One word change. On response update 4 Gatekeeper check rows "
        "(Syntax / Logic / Security / Azure) with green tick or red flag. Write 4 TestLog records with validator='Copilot'.\n\n"
        "FIX 3 — Auto TestLog write:\n"
        "After every successful aiCommandCentre response, write to TestLog: "
        "{ test_name: 'Trial Run — '+instruction.slice(0,40), status: 'pass', "
        "result: 'Model: '+response.model, tested_at: new Date().toISOString(), fixed: false, validator: 'Simpee' }.\n\n"
        "FIX 4 — Sandbox card in right panel:\n"
        "Below Deploy Log, add a slim card. Fetch SandboxProject entity on load, show first record "
        "(name, status badge, checkpoint_status). Add [SAVE CODE TO SANDBOX] button (Azure #0078d4). "
        "On click: write to ProjectFile entity with project_id, filename=response_[timestamp].ts, "
        "content=lastCode, language=typescript, version=1.0. Show success toast.\n\n"
        "Design system: bg=#e8e6fe, accent=#5e50fb, Azure=#0078d4, Exo 2 headlines, Montserrat body. No emoji.\"",
        s("BX", fontSize=7.5, fontName="Helvetica", textColor=BODY_TEXT, leading=13))
]], colWidths=[168*mm]))
story[-1].setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,-1),YELLOW),
    ("GRID",(0,0),(-1,-1),1.5,YELLOW_B),
    ("PADDING",(0,0),(-1,-1),10),
]))
story.append(Spacer(1,8))

# ── FOOTER ──
ft = Table([[
    Paragraph("Nexus Command Trial Run Blueprint · SIMPLEX-ITY · Confidential", s("F1", fontSize=7, fontName="Helvetica", textColor=MUTED)),
    Paragraph(f"Simpee · {today} · Backend aligned · Frontend fix scoped", s("F2", fontSize=7, fontName="Helvetica-Bold", textColor=VIOLET, alignment=TA_RIGHT)),
]], colWidths=[110*mm, 58*mm])
ft.setStyle(TableStyle([("TOPPADDING",(0,0),(-1,-1),8),("LINEABOVE",(0,0),(-1,0),0.5,NEUTRAL)]))
story.append(ft)

doc.build(story)
print("PDF built OK")
