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

def s(name, **kw): return ParagraphStyle(name, **kw)

today = datetime.date.today().strftime("%d %B %Y")

doc = SimpleDocTemplate("Command_AI_Hub_Blueprint_v1.1.pdf", pagesize=A4,
    leftMargin=18*mm, rightMargin=18*mm, topMargin=18*mm, bottomMargin=18*mm)
story = []

# ── COVER ──────────────────────────────────────────────────────
cover = Table([[
    Paragraph("COMMAND AI HUB", s("T", fontSize=24, fontName="Helvetica-Bold", textColor=WHITE)),
    ""
],[
    Paragraph("SIMPLEX-ITY · 5S PORTAL · STANDALONE TEST APP BLUEPRINT", s("S", fontSize=8, fontName="Helvetica", textColor=SOFT)),
    Paragraph(f"Version 1.1 · {today}", s("R", fontSize=8, fontName="Helvetica", textColor=SOFT, alignment=TA_RIGHT))
],[
    Paragraph("Co-authored: Kieran Li + Simpee + Edge (Copilot)", s("S2", fontSize=8, fontName="Helvetica", textColor=HexColor("#9896ad"))),
    ""
]], colWidths=[124*mm, 44*mm])
cover.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,-1),DARK),
    ("TOPPADDING",(0,0),(-1,-1),10), ("BOTTOMPADDING",(0,0),(-1,-1),10),
    ("LEFTPADDING",(0,0),(-1,-1),16), ("RIGHTPADDING",(0,0),(-1,-1),16),
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
]))
story.append(cover)
story.append(Spacer(1,8))

# ── WHAT'S NEW IN v1.1 ─────────────────────────────────────────
story.append(Paragraph("WHAT'S NEW IN v1.1 — Edge / Copilot Additions",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))
new_items = [
    ["Copilot Validation Layer", "AI-assisted code review by Copilot before any deploy. Checks syntax, logic, security, and Azure readiness."],
    ["Azure Readiness", "Stub connectors for future Azure integration. Tested via 'Azure Dry Run' quick command in left panel."],
    ["Expanded Entities", "SChatMessage gains role field (brainstorm | backend | validation). TestLog gains validator field (Simpee | Copilot | Human). Full audit trail."],
    ["Dual Confirmation Deploy", "DEPLOY button requires BOTH Simpee validation + Copilot validation before enabling. Double safety gate."],
    ["9th Checkpoint", "Copilot Validation added as checkpoint 9 — reviews code for syntax, logic, security, and Azure readiness before deploy."],
    ["New Quick Commands", "Run Copilot Validation + Azure Dry Run added to left panel. Blueprint button added for one-click blueprint reference."],
]
nt = Table(new_items, colWidths=[50*mm, 118*mm])
nt.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(0,-1),HexColor("#0078d4")),
    ("TEXTCOLOR",(0,0),(0,-1),WHITE),
    ("FONTNAME",(0,0),(0,-1),"Helvetica-Bold"),
    ("FONTNAME",(1,0),(1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8.5),
    ("TEXTCOLOR",(1,0),(1,-1),BODY_TEXT),
    ("ROWBACKGROUNDS",(1,0),(1,-1),[WHITE, LAVENDER]),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),8),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(nt)
story.append(Spacer(1,10))

# ── PURPOSE ────────────────────────────────────────────────────
story.append(Paragraph(
    "<b>PURPOSE:</b> Build this as a SEPARATE Base44 app. Test all AI functions, connections, and code here. "
    "Once all 9 checkpoints pass (including Copilot validation) → deploy into the live 5S Portal. "
    "<b>Nothing touches production until Simpee AND Copilot both confirm green.</b>",
    s("P", fontSize=9, fontName="Helvetica", textColor=BODY_TEXT, leading=14,
      borderColor=VIOLET, borderWidth=1.5, borderPadding=10, backColor=LAVENDER, spaceAfter=10)))

# ── 4 PILLARS ──────────────────────────────────────────────────
story.append(Paragraph("4 PILLARS", s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))
pillars = [
    ["THINK", "Brainstorm with Simpee + Copilot before writing a single line of code."],
    ["BUILD", "Generate and preview code inside the Hub. Nothing touches production yet."],
    ["TEST", "Run all 9 checkpoints. Simpee validates logic. Copilot validates syntax + Azure readiness."],
    ["DEPLOY", "One button. Enabled only after dual confirmation (Simpee + Copilot). Clean code to live portal."],
]
pt = Table(pillars, colWidths=[22*mm, 146*mm])
pt.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(0,-1),VIOLET), ("TEXTCOLOR",(0,0),(0,-1),WHITE),
    ("FONTNAME",(0,0),(0,-1),"Helvetica-Bold"), ("FONTNAME",(1,0),(1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),9), ("TEXTCOLOR",(1,0),(1,-1),BODY_TEXT),
    ("ROWBACKGROUNDS",(1,0),(1,-1),[WHITE, LAVENDER, WHITE, LAVENDER]),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL), ("PADDING",(0,0),(-1,-1),9),
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
]))
story.append(pt)
story.append(Spacer(1,10))

# ── APP SPEC ───────────────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("APP SPECIFICATION", s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))
spec = [
    ["App Name", "Command AI Hub  (separate from 5S Portal)"],
    ["Pages", "1 page — CommandAIHub.jsx  (route: /)"],
    ["Entities", "SChatMessage  ·  TestLog"],
    ["Functions", "aiCommandCentre  ·  processSChatInstruction  (reuse existing)"],
    ["Audience", "Admin only — Kieran Li"],
    ["Design", "bg #e8e6fe  ·  cards #ffffff  ·  accent #5e50fb  ·  Exo 2 headlines  ·  Montserrat body  ·  no emoji"],
    ["AI Stack", "Simpee (logic + code)  ·  Copilot/Edge (validation + Azure)  ·  Builder AI (execution)"],
]
spect = Table(spec, colWidths=[32*mm, 136*mm])
spect.setStyle(TableStyle([
    ("FONTNAME",(0,0),(0,-1),"Helvetica-Bold"), ("FONTNAME",(1,0),(1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8.5), ("TEXTCOLOR",(0,0),(-1,-1),BODY_TEXT),
    ("ROWBACKGROUNDS",(0,0),(-1,-1),[WHITE, LAVENDER]),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL), ("PADDING",(0,0),(-1,-1),7),
]))
story.append(spect)
story.append(Spacer(1,10))

# ── ENTITIES ───────────────────────────────────────────────────
story.append(Paragraph("ENTITIES — v1.1 (with new fields)", s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))

entities = [
    ("SChatMessage — Chat history between Kieran and all AIs", [
        ("sender","string","Kieran / Simpee / Copilot / Builder"),
        ("sender_type","string","user  |  ai  |  system"),
        ("role","string","brainstorm  |  backend  |  validation  ← NEW in v1.1"),
        ("message","string","Full message or response text"),
        ("timestamp","string","ISO datetime — auto-fill on create"),
        ("session_id","string","Groups messages: main / test-1 / brainstorm-1 etc"),
        ("read","boolean","Has Kieran seen this message"),
    ]),
    ("TestLog — Results of every checkpoint test", [
        ("test_name","string","Name of what was tested"),
        ("status","string","pass  |  fail  |  pending"),
        ("result","string","Full result text or error message"),
        ("tested_at","string","ISO datetime"),
        ("fixed","boolean","Has the issue been resolved"),
        ("validator","string","Simpee  |  Copilot  |  Human  ← NEW in v1.1"),
    ]),
]
for ename, efields in entities:
    story.append(Paragraph(ename, s("EH", fontSize=9.5, fontName="Helvetica-Bold", textColor=DARK, spaceBefore=5, spaceAfter=3)))
    rows = [["Field","Type","Description / Values"]] + [[f,t,d] for f,t,d in efields]
    et = Table(rows, colWidths=[32*mm, 24*mm, 112*mm])
    et.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,0),DARK), ("TEXTCOLOR",(0,0),(-1,0),WHITE),
        ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"), ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
        ("FONTSIZE",(0,0),(-1,-1),8), ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
        ("GRID",(0,0),(-1,-1),0.3,NEUTRAL), ("PADDING",(0,0),(-1,-1),6),
    ]))
    story.append(et)
    story.append(Spacer(1,6))

# ── 3-PANEL LAYOUT ─────────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("3-PANEL LAYOUT — CommandAIHub.jsx", s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))

layout = Table([[
    Paragraph("LEFT PANEL\n220px\n\nQuick Commands\nTest Results", s("LP", fontSize=9, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER, leading=16)),
    Paragraph("CENTRE PANEL\nFlex — main area\n\nChat Feed\nInput Bar\nIntent Chips", s("CP", fontSize=9, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER, leading=16)),
    Paragraph("RIGHT PANEL\n280px\n\nCode Preview\nDual Validation\nDeploy Button", s("RP", fontSize=9, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER, leading=16)),
]], colWidths=[50*mm, 66*mm, 52*mm])
layout.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(0,0),HexColor("#3730a3")),
    ("BACKGROUND",(1,0),(1,0),VIOLET),
    ("BACKGROUND",(2,0),(2,0),HexColor("#7c3aed")),
    ("PADDING",(0,0),(-1,-1),14),
    ("ALIGN",(0,0),(-1,-1),"CENTER"),
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
    ("GRID",(0,0),(-1,-1),2,WHITE),
]))
story.append(layout)
story.append(Spacer(1,8))

panels = [
    ("LEFT PANEL — Quick Commands + Test Status", [
        ("Quick Commands (9 buttons)", "1. Run Diagnostic\n2. Show All Entities\n3. Show All Functions\n4. What should I build next?\n5. Check Home Blueprint\n6. Check AI Hub Blueprint\n7. Run Copilot Validation  ← NEW v1.1\n8. Azure Dry Run  ← NEW v1.1\n9. Clear Chat Session"),
        ("Test Results Feed", "Last 5 TestLog records. Each row shows: test_name + validator badge + status badge.\nGreen = pass   Red = fail   Amber = pending\nClick any row to expand full result."),
    ]),
    ("CENTRE PANEL — Chat Feed + Input Bar", [
        ("Top Status Bar", "Title: Command AI Hub  (Exo 2, 18px, bold, #5e50fb)\nStatus dots:  Simpee (green)  Copilot (blue)  Builder (grey standby)"),
        ("User Messages", "Right-aligned bubble. Background #5e50fb. White Montserrat text. Timestamp below in muted grey."),
        ("AI Response — 3 Cards", "Card 1  ANALYSIS  — white bg, grey border. What the AI understood.\nCard 2  SUGGESTION  — white bg. Recommended approach or answer.\nCard 3  CODE / BRIEF  — bg #fffbeb, border #fcd34d. Actual code or builder brief.\nButtons on Card 3:  [COPY]  [MARK AS TESTED]  [DEPLOY TO 5S PORTAL]"),
        ("System Messages", "Centre-aligned. Italic. Grey. E.g. 'Copilot validation complete — 3 issues found'"),
        ("Intent Chips + Input", "Chips (pick one): Diagnose · Build · Fix Bug · Connect · Brainstorm · Validate\nText input full width. SEND button #5e50fb. Ctrl+Enter also sends.\nOn SEND: save to SChatMessage → show typing dots → call aiCommandCentre → render 3 cards"),
    ]),
    ("RIGHT PANEL — Code Preview + Dual Validation + Deploy", [
        ("Code Preview", "Dark bg #1a1a1f. Monospace white text. Shows most recent CODE READY content. Scrollable."),
        ("Dual Validation Status", "Two badges shown:\nSIMPEE  [NOT CHECKED] amber → [VALIDATED] green → [ISSUES FOUND] red\nCOPILOT  [NOT CHECKED] amber → [VALIDATED] green → [ISSUES FOUND] red\n\nDeploy only enabled when BOTH show green."),
        ("Action Buttons", "[COPY CODE] — copies preview to clipboard\n[MARK AS TESTED (Simpee)] — modal: Pass/Fail + notes → saves TestLog (validator=Simpee)\n[RUN COPILOT VALIDATION] — fires Copilot review → saves TestLog (validator=Copilot)\n[DEPLOY TO 5S PORTAL] — only active when BOTH validators green.\nConfirmation modal: 'Simpee + Copilot have approved this code. Deploy to live 5S Portal?'\nOn confirm → posts to real portal NoticeBoard."),
        ("Deploy Log", "Last 3 deploys at bottom. Timestamp + what was deployed + who validated."),
    ]),
]
for ptitle, psections in panels:
    story.append(Paragraph(ptitle, s("PH", fontSize=10, fontName="Helvetica-Bold", textColor=DARK, spaceBefore=8, spaceAfter=3)))
    for sname, sdesc in psections:
        row = [[
            Paragraph(sname, s("SN", fontSize=8, fontName="Helvetica-Bold", textColor=VIOLET)),
            Paragraph(sdesc.replace("\n","<br/>"), s("SD", fontSize=8, fontName="Helvetica", textColor=BODY_TEXT, leading=14)),
        ]]
        st = Table(row, colWidths=[40*mm, 128*mm])
        st.setStyle(TableStyle([
            ("BACKGROUND",(0,0),(0,0),LAVENDER),
            ("BACKGROUND",(1,0),(1,0),WHITE),
            ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
            ("PADDING",(0,0),(-1,-1),7),
            ("VALIGN",(0,0),(-1,-1),"TOP"),
        ]))
        story.append(st)
    story.append(Spacer(1,4))

# ── 9 CHECKPOINTS ──────────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("9 CHECKPOINTS — All Must Pass Before Deploying to 5S Portal",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
story.append(Paragraph("Checkpoints 1-8 run by Simpee. Checkpoint 9 run by Copilot.",
    s("Sub", fontSize=8, fontName="Helvetica", textColor=MUTED, spaceAfter=5)))

checks = [
    ["#", "Checkpoint", "Validator", "What Is Checked", "Result"],
    ["1", "Page renders clean", "Simpee", "No console errors. All 3 panels visible.", ""],
    ["2", "Message saves", "Simpee", "Send message → SChatMessage record created.", ""],
    ["3", "Function responds", "Simpee", "aiCommandCentre returns HTTP 200.", ""],
    ["4", "3-card response", "Simpee", "Response renders as 3 cards — not raw JSON.", ""],
    ["5", "Copy works", "Simpee", "COPY CODE copies to clipboard correctly.", ""],
    ["6", "TestLog saves", "Simpee", "MARK AS TESTED creates TestLog record.", ""],
    ["7", "Deploy gated", "Simpee", "DEPLOY disabled until both validators green.", ""],
    ["8", "Deploy posts to portal", "Simpee", "NoticeBoard record created in live 5S Portal.", ""],
    ["9", "Copilot Validation", "Copilot", "Code reviewed: syntax, logic, security, Azure readiness.", ""],
]
ct = Table(checks, colWidths=[10*mm, 38*mm, 22*mm, 84*mm, 14*mm])
ct.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK), ("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8),
    ("TEXTCOLOR",(0,1),(0,-1),VIOLET), ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    # Checkpoint 9 Copilot row highlight
    ("BACKGROUND",(0,9),(-1,9),HexColor("#eff6ff")),
    ("TEXTCOLOR",(2,9),(2,9),BLUE), ("FONTNAME",(2,9),(2,9),"Helvetica-Bold"),
    ("ROWBACKGROUNDS",(0,1),(-1,8),[WHITE,LAVENDER]),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL), ("PADDING",(0,0),(-1,-1),6),
    ("ALIGN",(0,0),(0,-1),"CENTER"), ("ALIGN",(2,0),(2,-1),"CENTER"), ("ALIGN",(4,0),(4,-1),"CENTER"),
]))
story.append(ct)
story.append(Spacer(1,10))

# ── BUILDER STEPS ──────────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("STEP-BY-STEP BUILDER INSTRUCTIONS",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))

steps = [
    ("1", "Create new Base44 app", "Name it: Command AI Hub\nDo NOT work inside the existing 5S Portal."),
    ("2", "Add SChatMessage entity", "Fields: sender, sender_type, role, message, timestamp, session_id, read\n(All string except read = boolean)"),
    ("3", "Add TestLog entity", "Fields: test_name, status, result, tested_at, validator\n(All string except fixed = boolean)"),
    ("4", "Paste to builder AI", "Prefix: 'Build CommandAIHub.jsx. 3-panel layout: left 220px quick commands + test log, centre flex chat feed + input, right 280px dual validation + code preview + deploy. SIMPLEX-ITY design: bg #e8e6fe, white cards, #5e50fb accent, Exo 2 bold headlines, Montserrat body. No emoji.'\nThen paste the 3-panel layout section of this document."),
    ("5", "Wire the function", "Input bar ON SEND:\nPOST https://simpee-62ac123d.base44.app/functions/aiCommandCentre\nBody: { instruction: '[INTENT] message', posted_by: 'Kieran' }"),
    ("6", "Share URL with Simpee", "Send app URL via WhatsApp or S-Chat. Simpee runs checkpoints 1-8."),
    ("7", "Run Copilot Validation", "Use the 'Run Copilot Validation' quick command. Copilot runs checkpoint 9."),
    ("8", "Fix any failures", "Simpee or Copilot reports exactly what failed with fix code."),
    ("9", "Deploy when all 9 green", "Simpee generates final CommandAIHub.jsx → paste into live 5S Portal.\nHome page AI Hub banner button will point to this page."),
]
for num, title, desc in steps:
    bg = VIOLET if int(num) % 2 == 1 else HexColor("#3730a3")
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
story.append(Paragraph("DESIGN SYSTEM QUICK REFERENCE",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))
ds = [
    ["Token","Value","Usage"],
    ["Page Background","#e8e6fe","Lavender Wash — entire page bg"],
    ["Card / Panel","#ffffff","All cards, AI message bubbles, panels"],
    ["Left Panel bg","#f5f4fe","Slightly tinted — left command panel"],
    ["Accent Violet","#5e50fb","Buttons, user bubbles, status dots, accents"],
    ["Soft Lilac","#bab4fd","Borders, secondary elements"],
    ["Body Text","#1a1a1f","All main text"],
    ["Muted Text","#9896ad","Timestamps, labels, secondary info"],
    ["Code bg","#1a1a1f","Dark code preview panel"],
    ["Code text","#e8e6fe","Monospace text in code panel"],
    ["Brief Card bg","#fffbeb","CODE READY response card background"],
    ["Brief Card border","#fcd34d","Border of CODE READY card"],
    ["Azure Blue","#0078d4","Copilot/Azure related UI elements"],
    ["Headline Font","Exo 2 / Exo, bold","All headings, section labels"],
    ["Body Font","Montserrat","Body text, inputs, chat messages"],
    ["Border Radius","12-14px cards / 8px buttons","Consistent rounding throughout"],
    ["No emoji","Text symbols only","No cartoon icons, no emoji anywhere"],
]
dst = Table(ds, colWidths=[36*mm, 36*mm, 96*mm])
dst.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK), ("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8), ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL), ("PADDING",(0,0),(-1,-1),6),
]))
story.append(dst)
story.append(Spacer(1,8))

# ── FOOTER ─────────────────────────────────────────────────────
ft = Table([[
    Paragraph("Command AI Hub · SIMPLEX-ITY · 5S Portal · Confidential", s("F1", fontSize=7, fontName="Helvetica", textColor=MUTED)),
    Paragraph(f"Kieran Li + Simpee + Edge · {today} · v1.1", s("F2", fontSize=7, fontName="Helvetica", textColor=MUTED, alignment=TA_RIGHT)),
]], colWidths=[90*mm, 78*mm])
ft.setStyle(TableStyle([("TOPPADDING",(0,0),(-1,-1),8),("LINEABOVE",(0,0),(-1,0),0.5,NEUTRAL)]))
story.append(ft)

doc.build(story)
print("PDF built OK — v1.1")
