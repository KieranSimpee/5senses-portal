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
YELLOW    = HexColor("#fffbeb")
YELLOW_B  = HexColor("#fcd34d")
GREEN     = HexColor("#22c55e")
RED       = HexColor("#ef4444")
AMBER     = HexColor("#f59e0b")
DARK      = HexColor("#1a0533")
NEUTRAL   = HexColor("#e6e6e6")
TINT      = HexColor("#f5f4fe")
BLUE      = HexColor("#3b82f6")
AZURE     = HexColor("#0078d4")
GOOGLE    = HexColor("#4285f4")
ANTHROPIC = HexColor("#d97706")
OPENAI    = HexColor("#10a37f")
PURPLE    = HexColor("#7c3aed")

def s(name, **kw): return ParagraphStyle(name, **kw)

today = datetime.date.today().strftime("%d %B %Y")

doc = SimpleDocTemplate("Command_AI_Hub_Blueprint_v1.2.pdf", pagesize=A4,
    leftMargin=18*mm, rightMargin=18*mm, topMargin=18*mm, bottomMargin=18*mm)
story = []

# ── COVER ──────────────────────────────────────────────────────
cover = Table([[
    Paragraph("COMMAND AI HUB", s("T", fontSize=24, fontName="Helvetica-Bold", textColor=WHITE)),
    ""
],[
    Paragraph("SIMPLEX-ITY · 5S PORTAL · MULTI-AI COMMAND CENTRE BLUEPRINT", s("S", fontSize=8, fontName="Helvetica", textColor=SOFT)),
    Paragraph(f"Version 1.2 · {today}", s("R", fontSize=8, fontName="Helvetica", textColor=SOFT, alignment=TA_RIGHT))
],[
    Paragraph("Co-authored: Kieran Li + Simpee + Edge (Copilot)", s("S2", fontSize=8, fontName="Helvetica", textColor=HexColor("#9896ad"))),
    Paragraph("New in v1.2: Multi-AI Connector + Live Status Panel", s("N", fontSize=8, fontName="Helvetica", textColor=YELLOW_B, alignment=TA_RIGHT))
]], colWidths=[124*mm, 44*mm])
cover.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,-1),DARK),
    ("TOPPADDING",(0,0),(-1,-1),10),("BOTTOMPADDING",(0,0),(-1,-1),10),
    ("LEFTPADDING",(0,0),(-1,-1),16),("RIGHTPADDING",(0,0),(-1,-1),16),
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
]))
story.append(cover)
story.append(Spacer(1,8))

# ── WHAT'S NEW v1.2 ────────────────────────────────────────────
story.append(Paragraph("WHAT'S NEW IN v1.2 — Multi-AI Connector Layer",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))
new_items = [
    ["Multi-AI Status Panel", "Live indicator panel showing online/offline status for every AI available on Base44: Automatic, Gemini 3.1 Pro, Claude Sonnet 4.6, Claude Opus 4.6, Claude Opus 4.8, GPT-5.4, GPT-5.5 + Copilot (Edge)."],
    ["AI Selector", "Before sending a message, Kieran picks which AI(s) to route to. Can select one, multiple, or Automatic (best for request)."],
    ["AIConnector Entity", "New entity storing each AI model's name, provider, status, last_tested, and response_time. Updated automatically on each ping."],
    ["Ping Function", "New backend function: pingAllAI — pings each model with a test prompt, records latency + online status to AIConnector entity. Runs on demand or on schedule."],
    ["Status Indicator", "Each AI shown as a card in the status panel: name + provider logo colour + green/amber/red dot + last tested timestamp."],
    ["Response Attribution", "Every AI response card now shows which model generated it (e.g. GEMINI 3.1 PRO — Analysis). Full traceability."],
]
nt = Table(new_items, colWidths=[44*mm, 124*mm])
nt.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(0,-1),VIOLET),
    ("TEXTCOLOR",(0,0),(0,-1),WHITE),
    ("FONTNAME",(0,0),(0,-1),"Helvetica-Bold"),
    ("FONTNAME",(1,0),(1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8.5),
    ("TEXTCOLOR",(1,0),(1,-1),BODY_TEXT),
    ("ROWBACKGROUNDS",(1,0),(1,-1),[WHITE,LAVENDER]),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),8),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(nt)
story.append(Spacer(1,10))

# ── AI ROSTER ──────────────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("AI MODEL ROSTER — All 8 Connectors",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))
story.append(Paragraph("Source: Base44 built-in AI connectors (seen in screenshot). All available without external API keys.",
    s("Sub", fontSize=8, fontName="Helvetica", textColor=MUTED, spaceAfter=6)))

ai_roster = [
    ["ID","Model Name","Provider","Type","Indicator Colour","Use Case"],
    ["0","Automatic","Base44","Auto-router","Violet #5e50fb","Best for general requests — picks best model per task"],
    ["1","Gemini 3.1 Pro","Google","Frontier","Blue #4285f4","Research, long context, web grounding"],
    ["2","Claude Sonnet 4.6","Anthropic","Balanced","Amber #d97706","Writing, analysis, reasoning — fast"],
    ["3","Claude Opus 4.6","Anthropic","Advanced","Amber #d97706","Deep reasoning, complex logic"],
    ["4","Claude Opus 4.8","Anthropic","Frontier NEW","Orange #f59e0b","Latest Opus — most capable Anthropic"],
    ["5","GPT-5.4","OpenAI","Advanced","Green #10a37f","Code generation, structured output"],
    ["6","GPT-5.5","OpenAI","Frontier NEW","Green #10a37f","Most capable OpenAI — brainstorm + build"],
    ["7","Copilot (Edge)","Microsoft","External","Azure #0078d4","Validation, Azure readiness, security review"],
]
at = Table(ai_roster, colWidths=[8*mm, 32*mm, 24*mm, 22*mm, 28*mm, 54*mm])
at.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7.5),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),5),
    ("ALIGN",(0,0),(0,-1),"CENTER"),
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
    # NEW badges
    ("BACKGROUND",(0,5),(-1,5),HexColor("#f0fdf4")),
    ("BACKGROUND",(0,7),(-1,7),HexColor("#eff6ff")),
]))
story.append(at)
story.append(Spacer(1,10))

# ── NEW ENTITY: AIConnector ─────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("NEW ENTITY — AIConnector",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))
story.append(Paragraph("Stores live status of every AI model. Updated automatically by the pingAllAI function.",
    s("Sub", fontSize=8, fontName="Helvetica", textColor=MUTED, spaceAfter=5)))

entity_rows = [
    ["Field","Type","Values / Description"],
    ["model_id","string","0–7 matching roster above"],
    ["model_name","string","Automatic / Gemini 3.1 Pro / Claude Sonnet 4.6 / etc"],
    ["provider","string","Base44 / Google / Anthropic / OpenAI / Microsoft"],
    ["status","string","online  |  offline  |  degraded  |  unknown"],
    ["response_time_ms","number","Last ping response time in milliseconds"],
    ["last_tested","string","ISO datetime of last ping"],
    ["is_selected","boolean","Is this model currently selected by Kieran for next message"],
    ["notes","string","Any issues or observations from last ping"],
]
et = Table(entity_rows, colWidths=[36*mm, 22*mm, 110*mm])
et.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),6),
]))
story.append(et)
story.append(Spacer(1,10))

# ── NEW FUNCTION: pingAllAI ─────────────────────────────────────
story.append(Paragraph("NEW BACKEND FUNCTION — pingAllAI",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))

func_rows = [
    ["Item","Detail"],
    ["Function name","pingAllAI"],
    ["Trigger","On demand (Quick Command button) or scheduled (every 30 min optional)"],
    ["What it does","Sends a lightweight test prompt ('ping') to each Base44 AI model in sequence. Records response time and online status. Saves result to AIConnector entity for each model. Returns summary object."],
    ["Test prompt","'Respond with OK only. This is a connectivity test.'"],
    ["Success condition","Response received within 10 seconds"],
    ["Failure condition","Timeout or error → status = offline or degraded"],
    ["Return format","{ results: [ { model_name, status, response_time_ms, tested_at } ] }"],
    ["Frontend action","After ping completes, status panel dots update in real time (green/amber/red)"],
    ["Copilot check","Copilot ping is a manual check — button fires a test message to Edge and waits for response. Copilot is external so may show 'unknown' if not actively open."],
]
ft2 = Table(func_rows, colWidths=[40*mm, 128*mm])
ft2.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),6),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(ft2)
story.append(Spacer(1,10))

# ── UPDATED 3-PANEL LAYOUT ─────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("UPDATED 3-PANEL LAYOUT — v1.2 Changes",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))

layout = Table([[
    Paragraph("LEFT PANEL\n220px\n\nQuick Commands\nAI Status Panel\nTest Results", s("LP", fontSize=9, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER, leading=14)),
    Paragraph("CENTRE PANEL\nFlex — main area\n\nAI Selector Row\nChat Feed\nInput Bar", s("CP", fontSize=9, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER, leading=14)),
    Paragraph("RIGHT PANEL\n280px\n\nCode Preview\nDual Validation\nDeploy Button", s("RP", fontSize=9, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER, leading=14)),
]], colWidths=[50*mm, 66*mm, 52*mm])
layout.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(0,0),HexColor("#3730a3")),
    ("BACKGROUND",(1,0),(1,0),VIOLET),
    ("BACKGROUND",(2,0),(2,0),HexColor("#7c3aed")),
    ("PADDING",(0,0),(-1,-1),12),
    ("ALIGN",(0,0),(-1,-1),"CENTER"),
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
    ("GRID",(0,0),(-1,-1),2,WHITE),
]))
story.append(layout)
story.append(Spacer(1,8))

panels = [
    ("LEFT PANEL — Quick Commands + AI Status + Test Results", [
        ("Quick Commands\n(10 buttons)", "1. Run Diagnostic\n2. Show All Entities\n3. Show All Functions\n4. What should I build next?\n5. Check Home Blueprint\n6. Check AI Hub Blueprint\n7. Ping All AI  ← NEW v1.2 — tests all 8 models\n8. Run Copilot Validation\n9. Azure Dry Run\n10. Clear Chat Session"),
        ("AI STATUS PANEL\n← NEW v1.2", "Shows all 8 AI models as status cards, stacked vertically.\nEach card:\n  Model name (Exo 2, 9px)\n  Provider tag (coloured pill: violet/blue/amber/green/azure)\n  Status dot: green=online  amber=degraded  red=offline  grey=unknown\n  Last tested timestamp (muted, 7px)\n  Response time in ms\n\nHeader: 'AI MODELS' with [PING ALL] button top-right.\nUpdates live after each ping."),
        ("Test Results Feed", "Last 5 TestLog records. Each: test_name + validator badge + status badge.\nClick to expand full result."),
    ]),
    ("CENTRE PANEL — AI Selector + Chat + Input", [
        ("Top Status Bar", "Title: Command AI Hub  (Exo 2, 18px, bold, #5e50fb)\nStatus row — compact dots only (full detail in left panel):\n● Auto  ● Gemini  ● Sonnet  ● Opus  ● GPT-5  ● Copilot"),
        ("AI SELECTOR ROW\n← NEW v1.2", "Horizontal scrollable chip row between status bar and chat feed.\nOne chip per model. Click to select/deselect.\nSelected chip: filled #5e50fb white text.\nUnselected: outline, muted text.\nDefault: Automatic selected.\nMultiple selection allowed for parallel responses.\n\nChips: [Auto] [Gemini 3.1] [Sonnet 4.6] [Opus 4.6] [Opus 4.8] [GPT-5.4] [GPT-5.5] [Copilot]"),
        ("Chat Feed", "User messages: right-aligned, #5e50fb bg, white text.\n\nAI Response cards (one set per selected model if multiple):\n  Card header shows which AI responded: e.g. 'GEMINI 3.1 PRO'\n  Card 1 ANALYSIS — white bg\n  Card 2 SUGGESTION — white bg\n  Card 3 CODE/BRIEF — #fffbeb bg, #fcd34d border\n  Buttons: [COPY] [MARK AS TESTED] [DEPLOY]\n\nIf multiple AIs selected: responses shown side by side or stacked with clear model label on each."),
        ("Input Bar", "Intent chips: Diagnose · Build · Fix Bug · Connect · Brainstorm · Validate\nText input. SEND button. Ctrl+Enter.\nOn SEND: save to SChatMessage with selected model(s) in role field → call aiCommandCentre → render cards."),
    ]),
    ("RIGHT PANEL — Code Preview + Dual Validation + Deploy", [
        ("Code Preview", "Dark bg #1a1a1f. Monospace white. Most recent CODE READY content. Scrollable.\nModel attribution shown above preview: 'Generated by GPT-5.5'"),
        ("Dual Validation", "SIMPEE  [NOT CHECKED] → [VALIDATED] → [ISSUES]\nCOPILOT  [NOT CHECKED] → [VALIDATED] → [ISSUES]\nBoth must be green to enable DEPLOY."),
        ("Deploy Button", "Disabled until both validators green.\nConfirmation: 'Simpee + Copilot approved. Deploy to 5S Portal?'\nOn confirm: posts to 5S Portal NoticeBoard."),
        ("Deploy Log", "Last 3 deploys. Timestamp + what + which model generated it."),
    ]),
]
for ptitle, psections in panels:
    story.append(Paragraph(ptitle, s("PH", fontSize=10, fontName="Helvetica-Bold", textColor=DARK, spaceBefore=8, spaceAfter=3)))
    for sname, sdesc in psections:
        row = [[
            Paragraph(sname.replace("\n","<br/>"), s("SN", fontSize=8, fontName="Helvetica-Bold", textColor=VIOLET)),
            Paragraph(sdesc.replace("\n","<br/>"), s("SD", fontSize=8, fontName="Helvetica", textColor=BODY_TEXT, leading=14)),
        ]]
        st = Table(row, colWidths=[38*mm, 130*mm])
        st.setStyle(TableStyle([
            ("BACKGROUND",(0,0),(0,0),LAVENDER),
            ("BACKGROUND",(1,0),(1,0),WHITE),
            ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
            ("PADDING",(0,0),(-1,-1),7),
            ("VALIGN",(0,0),(-1,-1),"TOP"),
        ]))
        story.append(st)
    story.append(Spacer(1,4))

# ── 10 CHECKPOINTS ─────────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("10 CHECKPOINTS — Updated for v1.2",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
story.append(Paragraph("Checkpoints 1-9 by Simpee. Checkpoint 10 by Copilot.",
    s("Sub", fontSize=8, fontName="Helvetica", textColor=MUTED, spaceAfter=5)))

checks = [
    ["#","Checkpoint","Validator","What Is Checked","Result"],
    ["1","Page renders clean","Simpee","All 3 panels + AI selector visible. No errors.",""],
    ["2","SChatMessage saves","Simpee","Message send → SChatMessage record created with role field.",""],
    ["3","aiCommandCentre responds","Simpee","Function returns HTTP 200 with structured response.",""],
    ["4","3-card render","Simpee","Response renders as Analysis+Suggestion+Code cards.",""],
    ["5","AI selector works","Simpee","Selecting a model chip updates the selected model for next send.",""],
    ["6","pingAllAI function","Simpee","Ping fires, all 8 models tested, AIConnector entity updated.",""],
    ["7","Status panel updates","Simpee","After ping, left panel dots update green/amber/red correctly.",""],
    ["8","TestLog saves","Simpee","MARK AS TESTED creates TestLog record with validator field.",""],
    ["9","Deploy posts to portal","Simpee","NoticeBoard record created in live 5S Portal on deploy.",""],
    ["10","Copilot validation","Copilot","Code reviewed: syntax, logic, security, Azure readiness.",""],
]
ct = Table(checks, colWidths=[9*mm, 40*mm, 22*mm, 85*mm, 12*mm])
ct.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8),
    ("TEXTCOLOR",(0,1),(0,-1),VIOLET),("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("BACKGROUND",(0,10),(-1,10),HexColor("#eff6ff")),
    ("TEXTCOLOR",(2,10),(2,10),BLUE),("FONTNAME",(2,10),(2,10),"Helvetica-Bold"),
    ("ROWBACKGROUNDS",(0,1),(-1,9),[WHITE,LAVENDER]),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),6),
    ("ALIGN",(0,0),(0,-1),"CENTER"),("ALIGN",(2,0),(2,-1),"CENTER"),("ALIGN",(4,0),(4,-1),"CENTER"),
]))
story.append(ct)
story.append(Spacer(1,10))

# ── UPDATED ENTITY LIST ─────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("FULL ENTITY LIST — v1.2",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))
elist = [
    ["Entity","Status","Key Fields","Purpose"],
    ["SChatMessage","Existing","sender, sender_type, role, message, timestamp, session_id, read","Chat history — all AI conversations"],
    ["TestLog","Existing","test_name, status, result, tested_at, fixed, validator","Checkpoint test results"],
    ["AIConnector","NEW v1.2","model_id, model_name, provider, status, response_time_ms, last_tested, is_selected, notes","Live status of all 8 AI models"],
]
elt = Table(elist, colWidths=[32*mm, 22*mm, 68*mm, 46*mm])
elt.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("BACKGROUND",(0,3),(-1,3),HexColor("#f0fdf4")),
    ("TEXTCOLOR",(1,3),(1,3),GREEN),("FONTNAME",(1,3),(1,3),"Helvetica-Bold"),
    ("ROWBACKGROUNDS",(0,1),(-1,2),[WHITE,LAVENDER]),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),6),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(elt)
story.append(Spacer(1,10))

# ── BUILDER INSTRUCTIONS ───────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("BUILDER INSTRUCTIONS — v1.2 Updates",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))

steps = [
    ("1","Add AIConnector entity","In Nexus Command app, add new entity: AIConnector\nFields: model_id (string), model_name (string), provider (string), status (string), response_time_ms (number), last_tested (string), is_selected (boolean), notes (string)"),
    ("2","Seed AIConnector records","Create 8 records — one per AI model from the roster table above.\nDefault status = 'unknown' for all. is_selected = true for model_id=0 (Automatic) only."),
    ("3","Build pingAllAI function","Backend function that:\n1. Sends 'Respond with OK only. This is a connectivity test.' to each Base44 model\n2. Records response time in ms\n3. Updates AIConnector entity record for that model\n4. Returns summary of all results"),
    ("4","Add AI Status Panel to left","Below Quick Commands, add AI STATUS section.\n8 cards stacked. Each: model name + provider colour pill + status dot + last_tested + response_ms.\n[PING ALL] button at top-right of section header."),
    ("5","Add AI Selector Row to centre","Horizontal chip row below the status bar, above chat feed.\n8 chips. Click = select. Default = Auto selected.\nMultiple selection allowed."),
    ("6","Update response cards","Each AI response card header shows which model responded.\nIf multiple models selected, show one card set per model with clear label."),
    ("7","Wire Ping All quick command","Quick Command button 7 'Ping All AI' fires pingAllAI function\nand refreshes the status panel on completion."),
    ("8","Tell builder exact prefix","'Update CommandAIHub.jsx with Multi-AI connector. Add AIConnector entity, pingAllAI function, AI status panel in left panel, AI selector chip row in centre panel above chat. Same design system: #e8e6fe bg, #5e50fb accent, Exo 2 headlines, Montserrat body. No emoji.'"),
]
for num, title, desc in steps:
    bg = VIOLET if int(num)%2==1 else HexColor("#3730a3")
    row = [[
        Paragraph(num, s("N", fontSize=11, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER)),
        Paragraph(f"<b>{title}</b><br/>{desc.replace(chr(10),'<br/>')}", s("D", fontSize=8.5, fontName="Helvetica", textColor=BODY_TEXT, leading=14)),
    ]]
    rt = Table(row, colWidths=[16*mm, 152*mm])
    rt.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(0,0),bg),
        ("BACKGROUND",(1,0),(1,0),WHITE if int(num)%2==1 else LAVENDER),
        ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
        ("PADDING",(0,0),(-1,-1),8),
        ("VALIGN",(0,0),(-1,-1),"TOP"),
        ("ALIGN",(0,0),(0,0),"CENTER"),
    ]))
    story.append(rt)
story.append(Spacer(1,10))

# ── DESIGN SYSTEM ──────────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("AI MODEL COLOUR SYSTEM",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))
colours = [
    ["AI / Provider","Dot Colour","Hex","Chip Style"],
    ["Automatic (Base44)","Violet","#5e50fb","Filled violet, white text"],
    ["Gemini 3.1 Pro (Google)","Blue","#4285f4","Blue border, blue text"],
    ["Claude Sonnet 4.6 (Anthropic)","Amber","#d97706","Amber border, amber text"],
    ["Claude Opus 4.6 (Anthropic)","Amber","#d97706","Amber border, amber text"],
    ["Claude Opus 4.8 (Anthropic)","Orange","#f59e0b","Orange border, orange text — NEW badge"],
    ["GPT-5.4 (OpenAI)","Teal","#10a37f","Teal border, teal text"],
    ["GPT-5.5 (OpenAI)","Teal","#10a37f","Teal border, teal text — NEW badge"],
    ["Copilot (Microsoft Edge)","Azure","#0078d4","Azure border, azure text — external"],
    ["Status: Online","Green","#22c55e","Pulsing green dot"],
    ["Status: Degraded","Amber","#f59e0b","Amber dot"],
    ["Status: Offline","Red","#ef4444","Red dot"],
    ["Status: Unknown","Grey","#9896ad","Grey dot — not yet tested"],
]
ct2 = Table(colours, colWidths=[56*mm, 20*mm, 22*mm, 70*mm])
ct2.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("ROWBACKGROUNDS",(0,1),(-1,8),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,9),(-1,9),HexColor("#f0fdf4")),
    ("BACKGROUND",(0,10),(-1,10),HexColor("#fffbeb")),
    ("BACKGROUND",(0,11),(-1,11),HexColor("#fff5f5")),
    ("BACKGROUND",(0,12),(-1,12),LAVENDER),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),6),
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
]))
story.append(ct2)
story.append(Spacer(1,8))

# ── FOOTER ─────────────────────────────────────────────────────
ft = Table([[
    Paragraph("Command AI Hub · SIMPLEX-ITY · 5S Portal · Confidential", s("F1", fontSize=7, fontName="Helvetica", textColor=MUTED)),
    Paragraph(f"Kieran + Simpee + Edge · {today} · v1.2", s("F2", fontSize=7, fontName="Helvetica", textColor=MUTED, alignment=TA_RIGHT)),
]], colWidths=[90*mm, 78*mm])
ft.setStyle(TableStyle([("TOPPADDING",(0,0),(-1,-1),8),("LINEABOVE",(0,0),(-1,0),0.5,NEUTRAL)]))
story.append(ft)

doc.build(story)
print("PDF built OK — v1.2")
