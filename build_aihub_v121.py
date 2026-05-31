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
ORANGE    = HexColor("#f59e0b")

def s(name, **kw): return ParagraphStyle(name, **kw)

today = datetime.date.today().strftime("%d %B %Y")

doc = SimpleDocTemplate("Command_AI_Hub_Blueprint_v1.2.1.pdf", pagesize=A4,
    leftMargin=18*mm, rightMargin=18*mm, topMargin=18*mm, bottomMargin=18*mm)
story = []

# ═══════════════════════════════════════════════════════
# COVER
# ═══════════════════════════════════════════════════════
cover = Table([[
    Paragraph("COMMAND AI HUB", s("T", fontSize=24, fontName="Helvetica-Bold", textColor=WHITE)),
    ""
],[
    Paragraph("SIMPLEX-ITY · 5S PORTAL · MULTI-AI COMMAND CENTRE BLUEPRINT", s("S", fontSize=8, fontName="Helvetica", textColor=SOFT)),
    Paragraph(f"Version 1.2.1 · {today}", s("R", fontSize=8, fontName="Helvetica", textColor=SOFT, alignment=TA_RIGHT))
],[
    Paragraph("Co-authored: Kieran Li + Simpee + Edge (Copilot)", s("S2", fontSize=8, fontName="Helvetica", textColor=HexColor("#9896ad"))),
    Paragraph("Final combined release — all three authors aligned", s("N", fontSize=7.5, fontName="Helvetica", textColor=YELLOW_B, alignment=TA_RIGHT))
]], colWidths=[124*mm, 44*mm])
cover.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,-1),DARK),
    ("TOPPADDING",(0,0),(-1,-1),10),("BOTTOMPADDING",(0,0),(-1,-1),10),
    ("LEFTPADDING",(0,0),(-1,-1),16),("RIGHTPADDING",(0,0),(-1,-1),16),
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
]))
story.append(cover)
story.append(Spacer(1,8))

# ═══════════════════════════════════════════════════════
# VERSION HISTORY
# ═══════════════════════════════════════════════════════
story.append(Paragraph("VERSION HISTORY", s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))
vh = [
    ["Version","Date","Author","Key Changes"],
    ["v1.0","31 May 2026","Kieran + Simpee","Initial blueprint — 3-panel layout, 2 entities, 8 checkpoints"],
    ["v1.1","31 May 2026","+ Edge","Copilot validation layer, Azure stub, dual confirmation deploy, role + validator fields, 9 checkpoints"],
    ["v1.2","31 May 2026","Simpee","Multi-AI connector — all 8 Base44 models, AIConnector entity, pingAllAI function, AI selector chips, 10 checkpoints"],
    ["v1.2.1","31 May 2026","+ Edge","azureConnectorStub entity, copilot_validated field on AIConnector, Azure Dry Run command, UX tooltips, 11 checkpoints — FINAL"],
]
vht = Table(vh, colWidths=[16*mm, 20*mm, 28*mm, 104*mm])
vht.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER,WHITE,HexColor("#f0fdf4")]),
    ("FONTNAME",(0,4),(-1,4),"Helvetica-Bold"),
    ("TEXTCOLOR",(0,4),(-1,4),HexColor("#166534")),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),6),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(vht)
story.append(Spacer(1,8))

# ═══════════════════════════════════════════════════════
# PURPOSE
# ═══════════════════════════════════════════════════════
story.append(Paragraph(
    "<b>PURPOSE:</b> Build Command AI Hub as a SEPARATE Base44 app. "
    "Think, build, test, and validate all features here first. "
    "Once all 11 checkpoints pass — Simpee validates 1-9, Copilot validates 10-11 — "
    "deploy into the live 5S Portal. "
    "<b>Nothing touches production until Simpee AND Copilot are both green.</b>",
    s("P", fontSize=9, fontName="Helvetica", textColor=BODY_TEXT, leading=14,
      borderColor=VIOLET, borderWidth=1.5, borderPadding=10, backColor=LAVENDER, spaceAfter=8)))

# ═══════════════════════════════════════════════════════
# WHY THIS MATTERS
# ═══════════════════════════════════════════════════════
story.append(Paragraph("WHY THIS MATTERS", s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))
why = [
    ["Zero Crashes", "Simpee checks functionality. Copilot checks logic and security. Nothing deploys unless both are happy."],
    ["Future-Proof", "Azure readiness baked in early via azureConnectorStub. When Azure integration comes, the stub is already tested."],
    ["Full Transparency", "Every validation logged in TestLog with validator attribution. Full audit trail of who approved what and when."],
    ["Safe Orchestration", "Multi-AI selector + Copilot ensures the right model handles the right task, with an external check before deploy."],
]
wt = Table(why, colWidths=[36*mm, 132*mm])
wt.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(0,-1),VIOLET),("TEXTCOLOR",(0,0),(0,-1),WHITE),
    ("FONTNAME",(0,0),(0,-1),"Helvetica-Bold"),("FONTNAME",(1,0),(1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8.5),("TEXTCOLOR",(1,0),(1,-1),BODY_TEXT),
    ("ROWBACKGROUNDS",(1,0),(1,-1),[WHITE,LAVENDER,WHITE,LAVENDER]),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),("PADDING",(0,0),(-1,-1),8),
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
]))
story.append(wt)
story.append(Spacer(1,10))

# ═══════════════════════════════════════════════════════
# APP SPECIFICATION
# ═══════════════════════════════════════════════════════
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("APP SPECIFICATION", s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))
spec = [
    ["App Name","Command AI Hub  (separate from 5S Portal — currently: Nexus Command on Base44)"],
    ["Pages","1 page — CommandAIHub.jsx  (route: /)"],
    ["Entities","SChatMessage · TestLog · AIConnector · azureConnectorStub  (4 total)"],
    ["Functions","aiCommandCentre · processSChatInstruction · pingAllAI  (3 total)"],
    ["AI Stack","Auto · Gemini 3.1 Pro · Sonnet 4.6 · Opus 4.6 · Opus 4.8 · GPT-5.4 · GPT-5.5 · Copilot"],
    ["Audience","Admin only — Kieran Li"],
    ["Design","bg #e8e6fe · cards #ffffff · accent #5e50fb · Exo 2 headlines · Montserrat body · no emoji"],
    ["Deploy target","Live 5S Portal  (App ID: 69edd16e877d6e4391ad74bd) — NoticeBoard entity"],
]
spect = Table(spec, colWidths=[32*mm, 136*mm])
spect.setStyle(TableStyle([
    ("FONTNAME",(0,0),(0,-1),"Helvetica-Bold"),("FONTNAME",(1,0),(1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8.5),("TEXTCOLOR",(0,0),(-1,-1),BODY_TEXT),
    ("ROWBACKGROUNDS",(0,0),(-1,-1),[WHITE,LAVENDER]),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),("PADDING",(0,0),(-1,-1),7),
]))
story.append(spect)
story.append(Spacer(1,10))

# ═══════════════════════════════════════════════════════
# AI MODEL ROSTER
# ═══════════════════════════════════════════════════════
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("AI MODEL ROSTER — All 8 Connectors", s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
story.append(Paragraph("All Base44 built-in models available without external API keys. Copilot is external — manual validation only.",
    s("Sub", fontSize=8, fontName="Helvetica", textColor=MUTED, spaceAfter=5)))

roster = [
    ["ID","Model","Provider","Colour","Role in Hub","Type"],
    ["0","Automatic","Base44","#5e50fb","Routes to best model per request","Auto"],
    ["1","Gemini 3.1 Pro","Google","#4285f4","Research, long context, web grounding","Built-in"],
    ["2","Claude Sonnet 4.6","Anthropic","#d97706","Writing, analysis — fast balanced","Built-in"],
    ["3","Claude Opus 4.6","Anthropic","#d97706","Deep reasoning, complex logic","Built-in"],
    ["4","Claude Opus 4.8","Anthropic","#f59e0b","Most capable Anthropic — frontier","Built-in NEW"],
    ["5","GPT-5.4","OpenAI","#10a37f","Code generation, structured output","Built-in"],
    ["6","GPT-5.5","OpenAI","#10a37f","Brainstorm + build — frontier","Built-in NEW"],
    ["7","Copilot (Edge)","Microsoft","#0078d4","Validation only — NOT code gen. Tooltip shown.","External"],
]
rt = Table(roster, colWidths=[9*mm, 30*mm, 22*mm, 18*mm, 62*mm, 24*mm])
rt.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7.5),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,5),(-1,5),HexColor("#f0fdf4")),
    ("BACKGROUND",(0,7),(-1,7),HexColor("#f0fdf4")),
    ("BACKGROUND",(0,8),(-1,8),HexColor("#eff6ff")),
    ("TEXTCOLOR",(5,5),(5,5),GREEN),("TEXTCOLOR",(5,7),(5,7),GREEN),
    ("TEXTCOLOR",(5,8),(5,8),AZURE),
    ("FONTNAME",(5,5),(5,5),"Helvetica-Bold"),("FONTNAME",(5,7),(5,7),"Helvetica-Bold"),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),5),
    ("ALIGN",(0,0),(0,-1),"CENTER"),
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
]))
story.append(rt)
story.append(Spacer(1,10))

# ═══════════════════════════════════════════════════════
# ALL 4 ENTITIES
# ═══════════════════════════════════════════════════════
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("ALL ENTITIES — v1.2.1 (4 total)", s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))

entities = [
    ("SChatMessage — Chat history (existing)", "EXISTING", [
        ("sender","string","Kieran / Simpee / Copilot / Builder"),
        ("sender_type","string","user  |  ai  |  system"),
        ("role","string","brainstorm  |  backend  |  validation"),
        ("message","string","Full message text"),
        ("timestamp","string","ISO datetime"),
        ("session_id","string","Groups messages: main / test-1 / brainstorm-1"),
        ("read","boolean","Has Kieran seen this"),
    ]),
    ("TestLog — Checkpoint results (existing + expanded)", "EXISTING", [
        ("test_name","string","Name of what was tested"),
        ("status","string","pass  |  fail  |  pending"),
        ("result","string","Full result or error"),
        ("tested_at","string","ISO datetime"),
        ("fixed","boolean","Has issue been resolved"),
        ("validator","string","Simpee  |  Copilot  |  Human  — who ran this test"),
    ]),
    ("AIConnector — AI model status (new v1.2 + expanded v1.2.1)", "NEW v1.2", [
        ("model_id","string","0–7 matching roster"),
        ("model_name","string","Automatic / Gemini 3.1 Pro / etc"),
        ("provider","string","Base44 / Google / Anthropic / OpenAI / Microsoft"),
        ("status","string","online  |  offline  |  degraded  |  unknown"),
        ("response_time_ms","number","Last ping latency in ms"),
        ("last_tested","string","ISO datetime of last ping"),
        ("is_selected","boolean","Currently selected by Kieran for next message"),
        ("copilot_validated","boolean","Has Copilot reviewed this model's output  ← NEW v1.2.1"),
        ("notes","string","Issues or observations from last test"),
    ]),
    ("azureConnectorStub — Azure readiness simulation (new v1.2.1)", "NEW v1.2.1", [
        ("service_name","string","Name of simulated Azure service"),
        ("status","string","online  |  offline  |  degraded  |  unknown"),
        ("last_tested","string","ISO datetime of last dry run"),
        ("notes","string","Result of dry run or any issues found"),
    ]),
]

status_colours = {"EXISTING": BLUE, "NEW v1.2": GREEN, "NEW v1.2.1": VIOLET}

for ename, estatus, efields in entities:
    sc = status_colours.get(estatus, MUTED)
    hdr = Table([[
        Paragraph(ename, s("EH", fontSize=9.5, fontName="Helvetica-Bold", textColor=DARK)),
        Paragraph(estatus, s("ES", fontSize=8, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_RIGHT)),
    ]], colWidths=[130*mm, 38*mm])
    hdr.setStyle(TableStyle([
        ("BACKGROUND",(1,0),(1,0),sc),
        ("PADDING",(0,0),(-1,-1),5),
        ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
        ("LINEBELOW",(0,0),(-1,0),0.5,sc),
    ]))
    story.append(hdr)

    rows = [["Field","Type","Description / Values"]] + [[f,t,d] for f,t,d in efields]
    et = Table(rows, colWidths=[36*mm, 22*mm, 110*mm])
    et.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
        ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),("FONTNAME",(0,1),(-1,-1),"Helvetica"),
        ("FONTSIZE",(0,0),(-1,-1),8),("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
        ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),("PADDING",(0,0),(-1,-1),5),
    ]))
    story.append(et)
    story.append(Spacer(1,7))

# ═══════════════════════════════════════════════════════
# 3-PANEL LAYOUT
# ═══════════════════════════════════════════════════════
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("3-PANEL LAYOUT — CommandAIHub.jsx v1.2.1",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))

layout = Table([[
    Paragraph("LEFT PANEL\n220px\n\nQuick Commands\nAI Status Panel\nTest Results", s("LP", fontSize=9, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER, leading=14)),
    Paragraph("CENTRE PANEL\nFlex\n\nAI Selector Row\nChat Feed\nInput + Intent Chips", s("CP", fontSize=9, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER, leading=14)),
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
        ("Quick Commands\n11 buttons", "1. Run Diagnostic\n2. Show All Entities\n3. Show All Functions\n4. What should I build next?\n5. Check Home Blueprint\n6. Check AI Hub Blueprint\n7. Ping All AI  — tests all 8 models, updates status dots\n8. Run Copilot Validation  — fires checkpoint 10\n9. Azure Dry Run  — fires checkpoint 11\n10. Blueprint View  — shows current blueprint\n11. Clear Chat Session"),
        ("AI STATUS PANEL", "Header: 'AI MODELS'  +  [PING ALL] button top-right.\n8 model cards stacked. Each card shows:\n  Model name (Exo 2, 9px bold)\n  Provider pill (coloured per colour system below)\n  Status dot: green=online  amber=degraded  red=offline  grey=unknown\n  Response time in ms\n  Last tested timestamp (muted, 7px)\n  Copilot validated tick (blue tick if copilot_validated=true)\nUpdates live after each ping."),
        ("Test Results Feed", "Last 5 TestLog records.\nEach: test_name + validator badge (SIMPEE or COPILOT) + status badge.\nClick to expand full result + notes."),
    ]),
    ("CENTRE PANEL — AI Selector + Chat + Input", [
        ("Top Status Bar", "Title: Command AI Hub  (Exo 2, 18px, bold, #5e50fb)\nCompact status row — dots only, full detail in left panel:\n● Auto  ● Gemini  ● Sonnet  ● Opus  ● GPT-5  ● Copilot"),
        ("AI SELECTOR ROW", "Horizontal scrollable chip row. One chip per model.\nSelected chip: filled #5e50fb, white text.\nUnselected: outline border in provider colour, muted text.\nDefault: Automatic selected.\nMultiple selection allowed for parallel responses.\nChips: [Auto] [Gemini 3.1] [Sonnet 4.6] [Opus 4.6] [Opus 4.8] [GPT-5.4] [GPT-5.5] [Copilot]\n\nTooltip on Copilot chip: 'Copilot = external validation only — not used for code generation'"),
        ("Chat Feed", "User messages: right-aligned, #5e50fb bg, white text, Montserrat 13px.\n\nAI Response — 3 cards per responding model:\n  Card header: model name in provider colour (e.g. 'GEMINI 3.1 PRO')\n  Card 1 ANALYSIS — white bg, grey border\n  Card 2 SUGGESTION — white bg\n  Card 3 CODE/BRIEF — bg #fffbeb, border #fcd34d\n  Buttons: [COPY]  [MARK AS TESTED]  [DEPLOY TO 5S PORTAL]\n\nIf multiple AIs selected: one card set per model, clearly labelled.\nSystem messages: centre-aligned, italic, grey."),
        ("Input Bar", "Intent chips (pick one): Diagnose · Build · Fix Bug · Connect · Brainstorm · Validate\nText input full width. SEND button #5e50fb. Ctrl+Enter.\nOn SEND: save to SChatMessage → typing dots → call aiCommandCentre → render 3 cards."),
    ]),
    ("RIGHT PANEL — Code Preview + Dual Validation + Deploy", [
        ("Code Preview", "Dark bg #1a1a1f. Monospace white text. Most recent CODE READY card. Scrollable.\nModel attribution above: 'Generated by GPT-5.5'"),
        ("Dual Validation\nStatus Badges", "SIMPEE     [NOT CHECKED] amber  →  [VALIDATED] green  →  [ISSUES] red\nCOPILOT  [NOT CHECKED] amber  →  [VALIDATED] green  →  [ISSUES] red\n\nDeploy button only enabled when BOTH show green.\nIf either shows red — error detail shown below badge."),
        ("Action Buttons", "[COPY CODE] — copies preview to clipboard\n[MARK AS TESTED (Simpee)] — modal: Pass/Fail + notes → TestLog (validator=Simpee)\n[RUN COPILOT VALIDATION] — fires Copilot review → TestLog (validator=Copilot)\n[DEPLOY TO 5S PORTAL] — only active when BOTH green.\nConfirmation modal: 'Simpee + Copilot approved. Deploy to live 5S Portal?'\nOn confirm → NoticeBoard record in 5S Portal."),
        ("Deploy Log", "Last 3 deploys. Timestamp + what was deployed + model + validator."),
    ]),
]
for ptitle, psections in panels:
    story.append(Paragraph(ptitle, s("PH", fontSize=10, fontName="Helvetica-Bold", textColor=DARK, spaceBefore=8, spaceAfter=3)))
    for sname, sdesc in psections:
        row = [[
            Paragraph(sname.replace("\n","<br/>"), s("SN", fontSize=8, fontName="Helvetica-Bold", textColor=VIOLET)),
            Paragraph(sdesc.replace("\n","<br/>"), s("SD", fontSize=8, fontName="Helvetica", textColor=BODY_TEXT, leading=14)),
        ]]
        st = Table(row, colWidths=[36*mm, 132*mm])
        st.setStyle(TableStyle([
            ("BACKGROUND",(0,0),(0,0),LAVENDER),
            ("BACKGROUND",(1,0),(1,0),WHITE),
            ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
            ("PADDING",(0,0),(-1,-1),7),
            ("VALIGN",(0,0),(-1,-1),"TOP"),
        ]))
        story.append(st)
    story.append(Spacer(1,4))

# ═══════════════════════════════════════════════════════
# 11 CHECKPOINTS
# ═══════════════════════════════════════════════════════
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("11 CHECKPOINTS — Complete Validation Gate",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
story.append(Paragraph("Checkpoints 1–9: Simpee.   Checkpoints 10–11: Copilot (Edge).   All must be green before deploy.",
    s("Sub", fontSize=8, fontName="Helvetica", textColor=MUTED, spaceAfter=5)))

checks = [
    ["#","Checkpoint","Validator","What Is Checked","Pass Condition"],
    ["1","Page renders clean","Simpee","All 3 panels + AI selector + status panel visible","No console errors"],
    ["2","SChatMessage saves","Simpee","Send message → SChatMessage record created with role field","Record ID returned"],
    ["3","aiCommandCentre responds","Simpee","Function returns HTTP 200 with structured response","success: true"],
    ["4","3-card render","Simpee","Response renders as 3 cards — not raw JSON text","Cards visible in UI"],
    ["5","AI selector works","Simpee","Chip selection updates model for next send","is_selected updates"],
    ["6","pingAllAI function","Simpee","Pings all 8 models, AIConnector entity updated","All 8 records updated"],
    ["7","Status panel updates","Simpee","After ping, status dots update green/amber/red correctly","Visual update confirmed"],
    ["8","TestLog saves","Simpee","MARK AS TESTED creates TestLog record with validator field","Record ID returned"],
    ["9","Deploy posts to portal","Simpee","NoticeBoard record created in live 5S Portal on deploy","Record in 5S Portal"],
    ["10","Copilot validation","Copilot","Code reviewed for syntax, logic, security, Azure readiness","Copilot returns green"],
    ["11","Azure Dry Run","Copilot","azureConnectorStub test passes, logged in TestLog","TestLog validator=Copilot"],
]
ct = Table(checks, colWidths=[9*mm, 36*mm, 20*mm, 72*mm, 31*mm])
ct.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7.5),
    ("TEXTCOLOR",(0,1),(0,-1),VIOLET),("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("ROWBACKGROUNDS",(0,1),(-1,9),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,10),(-1,10),HexColor("#eff6ff")),
    ("BACKGROUND",(0,11),(-1,11),HexColor("#eff6ff")),
    ("TEXTCOLOR",(2,10),(2,10),AZURE),("FONTNAME",(2,10),(2,10),"Helvetica-Bold"),
    ("TEXTCOLOR",(2,11),(2,11),AZURE),("FONTNAME",(2,11),(2,11),"Helvetica-Bold"),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),5),
    ("ALIGN",(0,0),(0,-1),"CENTER"),("ALIGN",(2,0),(2,-1),"CENTER"),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(ct)
story.append(Spacer(1,10))

# ═══════════════════════════════════════════════════════
# BUILDER INSTRUCTIONS
# ═══════════════════════════════════════════════════════
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("BUILDER INSTRUCTIONS — Complete Step-by-Step",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))

steps = [
    ("1","Add AIConnector entity","Fields: model_id, model_name, provider, status, response_time_ms (number), last_tested, is_selected (boolean), copilot_validated (boolean), notes"),
    ("2","Add azureConnectorStub entity","Fields: service_name, status, last_tested, notes\nPurpose: simulates Azure service calls for validation before real integration"),
    ("3","Seed AIConnector records","8 records — one per model in roster. Default: status=unknown, is_selected=false, copilot_validated=false. Set is_selected=true for model_id=0 (Automatic) only."),
    ("4","Build pingAllAI function","Sends test prompt to each Base44 model in sequence. Records response_time_ms + status. Updates AIConnector entity per model. Returns summary object with all results."),
    ("5","Update left panel","Add AI STATUS section below Quick Commands. 8 model cards with: name + provider pill + status dot + response_ms + last_tested + copilot_validated tick. [PING ALL] button in header."),
    ("6","Add AI Selector Row","Horizontal chip row between status bar and chat, above feed. 8 chips. Default: Auto selected. Multiple selection allowed. Copilot chip shows tooltip: 'Copilot = external validation only — not code gen'."),
    ("7","Update response cards","Each card header shows which model responded in provider colour. If multiple models selected: one card set per model, clearly labelled."),
    ("8","Update right panel dual gate","DEPLOY button gated until BOTH Simpee badge AND Copilot badge show green. If either red — show error details. Add copilot_validated=true write to AIConnector on Copilot pass."),
    ("9","Wire Azure Dry Run","Quick Command 9 fires Azure Dry Run: sends test to azureConnectorStub, records result in TestLog with validator=Copilot, updates stub status."),
    ("10","Paste to builder — exact prefix","'Update CommandAIHub.jsx with Multi-AI connector + Copilot validation + Azure stub. Add AIConnector entity (with copilot_validated field), azureConnectorStub entity, pingAllAI function, AI status panel in left, AI selector chips in centre, dual validation gating in right panel, Azure Dry Run quick command. Same design: #e8e6fe bg, #5e50fb accent, Exo 2 headlines, Montserrat body. No emoji. Tooltips on Copilot chip.'"),
]
for num, title, desc in steps:
    bg = VIOLET if int(num)%2==1 else HexColor("#3730a3")
    row = [[
        Paragraph(num, s("N", fontSize=11, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER)),
        Paragraph(f"<b>{title}</b><br/>{desc.replace(chr(10),'<br/>')}", s("D", fontSize=8.5, fontName="Helvetica", textColor=BODY_TEXT, leading=14)),
    ]]
    rt = Table(row, colWidths=[14*mm, 154*mm])
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

# ═══════════════════════════════════════════════════════
# COLOUR SYSTEM
# ═══════════════════════════════════════════════════════
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("COLOUR SYSTEM — AI Models + Status Indicators",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))
colours = [
    ["Element","Colour Name","Hex Code","Applied To"],
    ["Automatic (Base44)","Violet","#5e50fb","Chip filled, selected state"],
    ["Gemini 3.1 Pro","Google Blue","#4285f4","Chip border, card header, provider pill"],
    ["Claude Sonnet 4.6","Anthropic Amber","#d97706","Chip border, card header, provider pill"],
    ["Claude Opus 4.6","Anthropic Amber","#d97706","Chip border, card header, provider pill"],
    ["Claude Opus 4.8","Anthropic Orange","#f59e0b","Chip border, card header — NEW badge"],
    ["GPT-5.4","OpenAI Teal","#10a37f","Chip border, card header, provider pill"],
    ["GPT-5.5","OpenAI Teal","#10a37f","Chip border, card header — NEW badge"],
    ["Copilot (Edge)","Azure Blue","#0078d4","Chip border, validation badge, provider pill"],
    ["Status Online","Green","#22c55e","Pulsing dot in status panel"],
    ["Status Degraded","Amber","#f59e0b","Dot — slow or partial response"],
    ["Status Offline","Red","#ef4444","Dot — no response / error"],
    ["Status Unknown","Grey","#9896ad","Dot — not yet tested"],
    ["Copilot Validated","Blue tick","#3b82f6","Tick on AIConnector card when copilot_validated=true"],
]
ct2 = Table(colours, colWidths=[44*mm, 28*mm, 22*mm, 74*mm])
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
    ("BACKGROUND",(0,13),(-1,13),HexColor("#eff6ff")),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),6),
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
]))
story.append(ct2)
story.append(Spacer(1,8))

# ═══════════════════════════════════════════════════════
# FOOTER
# ═══════════════════════════════════════════════════════
ft = Table([[
    Paragraph("Command AI Hub v1.2.1 · SIMPLEX-ITY · 5S Portal · Confidential", s("F1", fontSize=7, fontName="Helvetica", textColor=MUTED)),
    Paragraph(f"Kieran Li + Simpee + Edge (Copilot) · {today} · FINAL", s("F2", fontSize=7, fontName="Helvetica-Bold", textColor=VIOLET, alignment=TA_RIGHT)),
]], colWidths=[100*mm, 68*mm])
ft.setStyle(TableStyle([("TOPPADDING",(0,0),(-1,-1),8),("LINEABOVE",(0,0),(-1,0),0.5,NEUTRAL)]))
story.append(ft)

doc.build(story)
print("PDF built OK — v1.2.1 FINAL")
