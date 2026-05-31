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
CODE_BG   = HexColor("#1a1a1f")

def s(name, **kw): return ParagraphStyle(name, **kw)

today = datetime.date.today().strftime("%d %B %Y")

doc = SimpleDocTemplate("Command_AI_Hub_Blueprint_v1.pdf", pagesize=A4,
    leftMargin=18*mm, rightMargin=18*mm, topMargin=18*mm, bottomMargin=18*mm)
story = []

# ── COVER ──────────────────────────────────────────────────────
cover = Table([[
    Paragraph("COMMAND AI HUB", s("T", fontSize=24, fontName="Helvetica-Bold", textColor=WHITE)),
    ""
],[
    Paragraph("SIMPLEX-ITY · 5S PORTAL · STANDALONE TEST APP BLUEPRINT", s("S", fontSize=8, fontName="Helvetica", textColor=SOFT)),
    Paragraph(f"Version 1.0 · {today}", s("R", fontSize=8, fontName="Helvetica", textColor=SOFT, alignment=TA_RIGHT))
]], colWidths=[124*mm, 44*mm])
cover.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,-1),DARK),
    ("TOPPADDING",(0,0),(-1,-1),14), ("BOTTOMPADDING",(0,0),(-1,-1),14),
    ("LEFTPADDING",(0,0),(-1,-1),16), ("RIGHTPADDING",(0,0),(-1,-1),16),
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
]))
story.append(cover)
story.append(Spacer(1,8))

# ── WHAT IS COMMAND AI HUB ─────────────────────────────────────
story.append(Paragraph(
    "<b>WHAT IS COMMAND AI HUB?</b>  The highest-authority workspace in the 5S Portal ecosystem. "
    "A single interface where Kieran thinks, plans, builds, tests, and deploys — with Simpee, Copilot, and the Builder AI all connected in one chat. "
    "Nothing is deployed to the live 5S Portal until it is fully tested here first. "
    "<b>This is your control room.</b>",
    s("P", fontSize=9, fontName="Helvetica", textColor=BODY_TEXT, leading=14,
      borderColor=VIOLET, borderWidth=1.5, borderPadding=10, backColor=LAVENDER, spaceAfter=10)))

# ── 4 PILLARS ──────────────────────────────────────────────────
story.append(Paragraph("4 PILLARS OF COMMAND AI HUB", s("H", fontSize=12, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))
pillars = [
    ["THINK", "Brainstorm ideas and features with Simpee + Copilot before writing a single line of code."],
    ["BUILD", "Generate code inside the Hub. See it in the preview panel. Nothing touches production yet."],
    ["TEST", "Run all 8 checkpoints. Pass = green. Fail = Simpee tells you exactly what to fix."],
    ["DEPLOY", "One button. Only enabled when all tests pass. Sends approved code to the live 5S Portal."],
]
pt = Table(pillars, colWidths=[22*mm, 146*mm])
pt.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(0,-1),VIOLET), ("TEXTCOLOR",(0,0),(0,-1),WHITE),
    ("FONTNAME",(0,0),(0,-1),"Helvetica-Bold"), ("FONTNAME",(1,0),(1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),9),
    ("TEXTCOLOR",(1,0),(1,-1),BODY_TEXT),
    ("ROWBACKGROUNDS",(1,0),(1,-1),[WHITE, LAVENDER, WHITE, LAVENDER]),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL), ("PADDING",(0,0),(-1,-1),9),
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
]))
story.append(pt)
story.append(Spacer(1,10))

# ── BUILD APPROACH ─────────────────────────────────────────────
story.append(Paragraph("BUILD APPROACH — Why Separate App First", s("H", fontSize=12, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))
approach = [
    ["OLD WAY", "Code → paste into live 5S Portal → crash → fix → crash again"],
    ["NEW WAY", "Build in Command AI Hub test app → all 8 checkpoints pass → ONE clean deploy to portal"],
    ["BENEFIT", "Zero crashes in production. Full traceability. Every function validated before touching real data."],
]
at = Table(approach, colWidths=[22*mm, 146*mm])
at.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(0,0),RED), ("BACKGROUND",(0,1),(0,1),GREEN), ("BACKGROUND",(0,2),(0,2),VIOLET),
    ("TEXTCOLOR",(0,0),(0,-1),WHITE),
    ("FONTNAME",(0,0),(0,-1),"Helvetica-Bold"), ("FONTNAME",(1,0),(1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),9), ("TEXTCOLOR",(1,0),(1,-1),BODY_TEXT),
    ("ROWBACKGROUNDS",(1,0),(1,-1),[HexColor("#fff5f5"), HexColor("#f0fff4"), LAVENDER]),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL), ("PADDING",(0,0),(-1,-1),9),
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
]))
story.append(at)
story.append(Spacer(1,10))

# ── APP SPEC ───────────────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("APP SPECIFICATION", s("H", fontSize=12, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))
spec = [
    ["App Name", "Command AI Hub"],
    ["Type", "Standalone Base44 test app (separate from 5S Portal)"],
    ["Pages", "1 page — CommandAIHub.jsx (route: /)"],
    ["Entities", "SChatMessage · TestLog"],
    ["Backend Functions", "aiCommandCentre (reuse existing: https://simpee-62ac123d.base44.app/functions/aiCommandCentre)"],
    ["Audience", "Admin only — Kieran Li"],
    ["Design System", "bg #e8e6fe · cards #ffffff · accent #5e50fb · Exo 2 headlines · Montserrat body · no emoji"],
    ["Purpose", "Build, test, validate all new features. Deploy to 5S Portal only when all 8 checkpoints green."],
]
spect = Table(spec, colWidths=[38*mm, 130*mm])
spect.setStyle(TableStyle([
    ("FONTNAME",(0,0),(0,-1),"Helvetica-Bold"), ("FONTNAME",(1,0),(1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8.5), ("TEXTCOLOR",(0,0),(-1,-1),BODY_TEXT),
    ("ROWBACKGROUNDS",(0,0),(-1,-1),[WHITE, LAVENDER]),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL), ("PADDING",(0,0),(-1,-1),7),
]))
story.append(spect)
story.append(Spacer(1,10))

# ── ENTITIES ───────────────────────────────────────────────────
story.append(Paragraph("ENTITIES", s("H", fontSize=12, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))
for ename, efields in [
    ("SChatMessage — Chat history between Kieran and all AIs", [
        ("sender","string","Kieran / Simpee / Copilot / Builder"),
        ("sender_type","string","user  |  ai  |  system"),
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
    ]),
]:
    story.append(Paragraph(ename, s("EH", fontSize=10, fontName="Helvetica-Bold", textColor=DARK, spaceBefore=4, spaceAfter=3)))
    rows = [["Field","Type","Description"]] + [[f,t,d] for f,t,d in efields]
    et = Table(rows, colWidths=[36*mm, 24*mm, 108*mm])
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
story.append(Paragraph("3-PANEL LAYOUT — CommandAIHub.jsx", s("H", fontSize=12, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))

layout = Table([[
    Paragraph("LEFT PANEL\n220px wide\n\nQuick Commands\nTest Results", s("LP", fontSize=9, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER, leading=16)),
    Paragraph("CENTRE PANEL\nFlex — main area\n\nChat Feed\nInput Bar\nIntent Chips", s("CP", fontSize=9, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER, leading=16)),
    Paragraph("RIGHT PANEL\n280px wide\n\nCode Preview\nTest Status\nDeploy Button", s("RP", fontSize=9, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER, leading=16)),
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

# Panel details
panels = [
    ("LEFT PANEL — Quick Commands + Test Status", [
        ("Quick Commands", "7 pre-set buttons that fire instructions into chat automatically:\n1. Run Diagnostic\n2. Show All Entities\n3. Show All Functions\n4. What should I build next?\n5. Check Home Blueprint\n6. Check AI Hub Blueprint\n7. Clear Chat Session"),
        ("Test Results Feed", "Last 5 TestLog records shown.\nEach row: test name + status badge.\nGreen = pass   Red = fail   Amber = pending\nClick any row to expand full result details."),
    ]),
    ("CENTRE PANEL — Chat Feed + Input", [
        ("Top Status Bar", "Title: Command AI Hub  (Exo 2, 18px, bold, #5e50fb)\nStatus row:  Simpee (green dot if function live)  Copilot (blue dot)  Builder (grey dot standby)"),
        ("User Messages", "Right-aligned. Background #5e50fb. White text. Montserrat 13px. Timestamp below in muted grey."),
        ("AI Response — 3 Cards", "Card 1  ANALYSIS  (white bg, grey border)\nHeader: SIMPEE - Analysis  (violet, 10px uppercase)\nBody: what Simpee understood\n\nCard 2  SUGGESTION  (white bg)\nHeader: SIMPEE - Suggestion\nBody: recommended approach\n\nCard 3  CODE / BUILDER BRIEF  (bg #fffbeb, border #fcd34d)\nHeader: CODE READY\nBody: code or brief in dark code block\nButtons: [COPY]  [MARK AS TESTED]  [DEPLOY TO 5S PORTAL]"),
        ("System Messages", "Centre-aligned. Italic. Grey. E.g. Session started / Diagnostic complete / Checkpoint 3 passed"),
        ("Input Bar — pinned bottom", "Intent chips (pick one before typing):\nDiagnose   Build   Fix Bug   Connect   Brainstorm   Ask\n\nText input full width. SEND button (#5e50fb). Ctrl+Enter also sends.\n\nOn SEND:\n1. Save message to SChatMessage (sender_type = user)\n2. Show typing indicator (3 animated dots)\n3. POST to aiCommandCentre function\n4. Save AI response to SChatMessage (sender_type = ai)\n5. Render 3-card response"),
    ]),
    ("RIGHT PANEL — Code Preview + Deploy", [
        ("Code Preview", "Background #1a1a1f (dark). Monospace white text. Shows most recent CODE READY content. Scrollable."),
        ("Status Badge", "NOT TESTED  (amber) — default state\nTESTED PASS  (green) — after marking pass\nTESTED FAIL  (red) — after marking fail"),
        ("Action Buttons", "[COPY CODE]  copies preview to clipboard\n\n[MARK AS TESTED]  opens modal: Pass or Fail + notes field. Saves to TestLog entity.\n\n[DEPLOY TO 5S PORTAL]  only active when status = TESTED PASS.\nShows confirmation: Are you sure? This updates the LIVE 5S Portal.\nOn confirm: posts builder brief to real portal NoticeBoard."),
        ("Deploy Log", "Last 3 deploys shown at bottom. Timestamp + what was deployed."),
    ]),
]
for ptitle, psections in panels:
    story.append(Paragraph(ptitle, s("PH", fontSize=10, fontName="Helvetica-Bold", textColor=DARK, spaceBefore=8, spaceAfter=3)))
    for sname, sdesc in psections:
        row = [[
            Paragraph(sname, s("SN", fontSize=8, fontName="Helvetica-Bold", textColor=VIOLET)),
            Paragraph(sdesc.replace("\n","<br/>"), s("SD", fontSize=8, fontName="Helvetica", textColor=BODY_TEXT, leading=14)),
        ]]
        st = Table(row, colWidths=[36*mm, 132*mm])
        st.setStyle(TableStyle([
            ("BACKGROUND",(0,0),(0,0),LAVENDER), ("BACKGROUND",(1,0),(1,0),WHITE),
            ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
            ("PADDING",(0,0),(-1,-1),7), ("VALIGN",(0,0),(-1,-1),"TOP"),
        ]))
        story.append(st)
    story.append(Spacer(1,4))

# ── 8 CHECKPOINTS ──────────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("8 CHECKPOINTS — All Must Pass Before Deploying to 5S Portal",
    s("H", fontSize=12, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))
story.append(Paragraph("Simpee runs these automatically when given the test app URL.",
    s("Sub", fontSize=8, fontName="Helvetica", textColor=MUTED, spaceAfter=5)))

checks = [
    ["#", "Checkpoint", "What Simpee Validates", "Result"],
    ["1", "Page renders clean", "No console errors. All 3 panels visible on desktop.", ""],
    ["2", "Message saves", "Sending a message creates a SChatMessage record in the entity.", ""],
    ["3", "Function responds", "aiCommandCentre returns HTTP 200 with a valid response.", ""],
    ["4", "3-card render", "AI response renders as 3 cards — not raw JSON text.", ""],
    ["5", "Copy works", "COPY CODE button copies content to clipboard correctly.", ""],
    ["6", "TestLog saves", "MARK AS TESTED creates a TestLog record with correct fields.", ""],
    ["7", "Deploy gated", "DEPLOY button is disabled until status = TESTED PASS.", ""],
    ["8", "Deploy posts to portal", "On confirm, a NoticeBoard record appears in live 5S Portal.", ""],
]
ct = Table(checks, colWidths=[10*mm, 44*mm, 94*mm, 20*mm])
ct.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK), ("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8.5),
    ("TEXTCOLOR",(0,1),(0,-1),VIOLET), ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),
    ("TEXTCOLOR",(1,1),(-1,-1),BODY_TEXT),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL), ("PADDING",(0,0),(-1,-1),7),
    ("ALIGN",(0,0),(0,-1),"CENTER"), ("ALIGN",(3,0),(3,-1),"CENTER"),
]))
story.append(ct)
story.append(Spacer(1,10))

# ── BUILDER STEPS ──────────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("STEP-BY-STEP BUILDER INSTRUCTIONS",
    s("H", fontSize=12, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))

steps = [
    ("1", "Create new Base44 app", "Name it exactly: Command AI Hub\nDo NOT work inside the existing 5S Portal."),
    ("2", "Add entity: SChatMessage", "Fields: sender (string), sender_type (string), message (string), timestamp (string), session_id (string), read (boolean)"),
    ("3", "Add entity: TestLog", "Fields: test_name (string), status (string), result (string), tested_at (string), fixed (boolean)"),
    ("4", "Paste to builder AI", "Use this exact prefix:\n'Build CommandAIHub.jsx. 3-panel layout: left 220px quick commands + test log, centre flex chat feed + input bar, right 280px code preview + deploy. SIMPLEX-ITY design: bg #e8e6fe, white cards, #5e50fb accent, Exo 2 bold headlines, Montserrat body. No emoji. Text symbols only. Then paste the 3-panel layout section of this blueprint.'"),
    ("5", "Wire the function", "In the input bar ON SEND handler:\nPOST https://simpee-62ac123d.base44.app/functions/aiCommandCentre\nBody: { instruction: '[INTENT] message', posted_by: 'Kieran' }"),
    ("6", "Share app URL with Simpee", "Once the app renders, send the URL to Simpee via WhatsApp or S-Chat. Simpee runs all 8 checkpoints and reports results."),
    ("7", "Fix failing checkpoints", "Simpee tells you exactly what failed and provides the fix code."),
    ("8", "Deploy when all green", "Simpee generates final CommandAIHub.jsx to paste into the live 5S Portal. Home page gets the AI Hub banner button pointing to this page."),
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
        ("BACKGROUND",(1,0),(1,0), WHITE if int(num)%2==1 else LAVENDER),
        ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
        ("PADDING",(0,0),(-1,-1),8), ("VALIGN",(0,0),(-1,-1),"TOP"),
        ("ALIGN",(0,0),(0,0),"CENTER"),
    ]))
    story.append(rt)

story.append(Spacer(1,10))

# ── DESIGN SYSTEM QUICK REF ────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("DESIGN SYSTEM QUICK REFERENCE",
    s("H", fontSize=12, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))
ds = [
    ["Token","Value","Usage"],
    ["Background","#e8e6fe","Page bg (Lavender Wash)"],
    ["Card / Panel","#ffffff","All cards, chat bubbles (AI), panels"],
    ["Left Panel bg","#f5f4fe","Slightly tinted white"],
    ["Accent Violet","#5e50fb","Buttons, active states, user bubbles, dots"],
    ["Soft Lilac","#bab4fd","Borders, secondary elements"],
    ["Body Text","#1a1a1f","All main text"],
    ["Muted Text","#9896ad","Timestamps, labels, secondary info"],
    ["Code Background","#1a1a1f","Dark code preview panel"],
    ["Code Text","#e8e6fe","Text inside code panel"],
    ["Brief Card bg","#fffbeb","CODE READY response card"],
    ["Brief Card border","#fcd34d","Border of CODE READY card"],
    ["Headline Font","Exo 2 / Exo, bold","All headings, section titles"],
    ["Body Font","Montserrat","All body text, inputs, chat"],
    ["Border Radius","12-14px cards / 8px buttons","Consistent rounding"],
    ["Icons","Text symbols only: + checkmark circle square","NO emoji NO cartoon"],
]
dst = Table(ds, colWidths=[38*mm, 40*mm, 90*mm])
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
    Paragraph(f"Generated by Simpee · {today} · Version 1.0", s("F2", fontSize=7, fontName="Helvetica", textColor=MUTED, alignment=TA_RIGHT)),
]], colWidths=[90*mm, 78*mm])
ft.setStyle(TableStyle([("TOPPADDING",(0,0),(-1,-1),8),("LINEABOVE",(0,0),(-1,0),0.5,NEUTRAL)]))
story.append(ft)

doc.build(story)
print("PDF built OK")
