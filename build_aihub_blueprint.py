from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT

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
CODE_BG   = HexColor("#1a1a1f")
CODE_TEXT = HexColor("#e8e6fe")
TINT      = HexColor("#f5f4fe")

def s(name, **kw): return ParagraphStyle(name, **kw)

doc = SimpleDocTemplate("AIHub_Standalone_Blueprint.pdf", pagesize=A4,
    leftMargin=18*mm, rightMargin=18*mm, topMargin=18*mm, bottomMargin=18*mm)
story = []

import datetime
today = datetime.date.today().strftime("%d %B %Y")

# ── COVER ──────────────────────────────────────────────────────
cover = Table([[
    Paragraph("AI HUB", s("T", fontSize=26, fontName="Helvetica-Bold", textColor=WHITE)),
    ""
],[
    Paragraph("STANDALONE TEST APP — BLUEPRINT", s("S", fontSize=10, fontName="Helvetica", textColor=SOFT)),
    Paragraph(f"v1.0 · {today}", s("R", fontSize=8, fontName="Helvetica", textColor=SOFT, alignment=TA_RIGHT))
]], colWidths=[120*mm, 48*mm])
cover.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,-1),DARK),
    ("TOPPADDING",(0,0),(-1,-1),12), ("BOTTOMPADDING",(0,0),(-1,-1),12),
    ("LEFTPADDING",(0,0),(-1,-1),16), ("RIGHTPADDING",(0,0),(-1,-1),16),
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
]))
story.append(cover)
story.append(Spacer(1,8))

# ── PURPOSE BOX ────────────────────────────────────────────────
story.append(Paragraph(
    "<b>PURPOSE:</b> Build this as a SEPARATE Base44 app. Test all AI functions, connections, and code here first. "
    "Once all 8 checkpoints pass → deploy into the live 5S Portal. Nothing touches production until everything is green.",
    s("P", fontSize=9, fontName="Helvetica", textColor=BODY_TEXT, leading=14,
      borderColor=VIOLET, borderWidth=1.5, borderPadding=10, backColor=LAVENDER, spaceAfter=10)))

# ── WHY SEPARATE APP ───────────────────────────────────────────
story.append(Paragraph("WHY BUILD SEPARATE FIRST", s("H", fontSize=12, fontName="Helvetica-Bold", textColor=VIOLET, spaceBefore=6, spaceAfter=5)))
why = [
    ["OLD WAY", "Write code → paste into live app → hope it works → crash → fix → repeat"],
    ["NEW WAY", "Think in Hub → build in Hub → test in Hub → deploy only when all 8 checkpoints green"],
    ["RESULT", "Zero crashes in production. Full control. Every function validated before it touches your real data."],
]
wt = Table(why, colWidths=[28*mm, 140*mm])
wt.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(0,-1),VIOLET), ("TEXTCOLOR",(0,0),(0,-1),WHITE),
    ("BACKGROUND",(1,0),(1,0),HexColor("#fff5f5")),
    ("BACKGROUND",(1,1),(1,1),HexColor("#f0fff4")),
    ("BACKGROUND",(1,2),(1,2),LAVENDER),
    ("FONTNAME",(0,0),(-1,-1),"Helvetica"), ("FONTNAME",(0,0),(0,-1),"Helvetica-Bold"),
    ("FONTSIZE",(0,0),(-1,-1),8.5),
    ("TEXTCOLOR",(1,0),(-1,-1),BODY_TEXT),
    ("PADDING",(0,0),(-1,-1),8),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL), ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
]))
story.append(wt)
story.append(Spacer(1,10))

# ── APP OVERVIEW ───────────────────────────────────────────────
story.append(Paragraph("APP OVERVIEW", s("H", fontSize=12, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))
ov = [
    ["App Name", "AI Hub Test"],
    ["Pages", "1 page only — AIHub (route: /)"],
    ["Entities", "SChatMessage, TestLog"],
    ["Functions", "aiCommandCentre, processSChatInstruction (already deployed — reuse)"],
    ["Audience", "Admin only (Kieran)"],
    ["Design", "#e8e6fe bg · #5e50fb accent · Exo 2 headlines · Montserrat body · no emoji"],
]
ot = Table(ov, colWidths=[35*mm, 133*mm])
ot.setStyle(TableStyle([
    ("FONTNAME",(0,0),(0,-1),"Helvetica-Bold"), ("FONTNAME",(1,0),(1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8.5), ("TEXTCOLOR",(0,0),(-1,-1),BODY_TEXT),
    ("ROWBACKGROUNDS",(0,0),(-1,-1),[WHITE, LAVENDER]),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL), ("PADDING",(0,0),(-1,-1),7),
]))
story.append(ot)
story.append(Spacer(1,10))

# ── ENTITIES ───────────────────────────────────────────────────
story.append(Paragraph("ENTITIES", s("H", fontSize=12, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))

for ent_name, fields in [
    ("SChatMessage", [
        ("sender","string","Who sent it — Kieran / Simpee / Copilot / Builder"),
        ("sender_type","string","user | ai | system"),
        ("message","string","Full message text"),
        ("timestamp","string","ISO datetime"),
        ("session_id","string","Groups messages — main / test-1 / etc"),
        ("read","boolean","Has user seen this message"),
    ]),
    ("TestLog", [
        ("test_name","string","What was tested"),
        ("status","string","pass | fail | pending"),
        ("result","string","Full result text or error message"),
        ("tested_at","string","ISO datetime"),
        ("fixed","boolean","Has the issue been resolved"),
    ]),
]:
    story.append(Paragraph(f"Entity: {ent_name}", s("EH", fontSize=10, fontName="Helvetica-Bold", textColor=DARK, spaceBefore=4, spaceAfter=3)))
    rows = [["Field", "Type", "Description"]] + [[f, t, d] for f,t,d in fields]
    et = Table(rows, colWidths=[35*mm, 22*mm, 111*mm])
    et.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,0),DARK), ("TEXTCOLOR",(0,0),(-1,0),WHITE),
        ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
        ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
        ("FONTSIZE",(0,0),(-1,-1),8),
        ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
        ("GRID",(0,0),(-1,-1),0.3,NEUTRAL), ("PADDING",(0,0),(-1,-1),6),
    ]))
    story.append(et)
    story.append(Spacer(1,6))

# ── PAGE LAYOUT ────────────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("PAGE LAYOUT — AIHub.jsx (3 Panels)", s("H", fontSize=12, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))

layout = Table([[
    Paragraph("LEFT PANEL\n220px\nQuick Commands\n+ Test Results", s("LP", fontSize=8, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER, leading=14)),
    Paragraph("CENTRE PANEL\nflex (main area)\nChat Feed\n+ Input Bar", s("CP", fontSize=8, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER, leading=14)),
    Paragraph("RIGHT PANEL\n280px\nCode Preview\n+ Deploy Button", s("RP", fontSize=8, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER, leading=14)),
]], colWidths=[48*mm, 68*mm, 52*mm])
layout.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(0,0),HexColor("#3730a3")),
    ("BACKGROUND",(1,0),(1,0),VIOLET),
    ("BACKGROUND",(2,0),(2,0),HexColor("#7c3aed")),
    ("PADDING",(0,0),(-1,-1),12),
    ("ALIGN",(0,0),(-1,-1),"CENTER"),
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
    ("GRID",(0,0),(-1,-1),1,WHITE),
]))
story.append(layout)
story.append(Spacer(1,8))

# ── PANEL DETAILS ──────────────────────────────────────────────
panels = [
    ("LEFT PANEL — Quick Commands + Test Status", TINT, [
        ("Quick Command Buttons", "Run Diagnostic · Show All Entities · Show All Functions · What should I build? · Check Home Blueprint · Check AI Hub Blueprint · Clear Chat\nEach button fires a pre-set instruction into the chat feed automatically."),
        ("Test Results Feed", "Shows last 5 TestLog records. Each row: test name + status badge (green=pass, red=fail, amber=pending). Click to expand full result."),
    ]),
    ("CENTRE PANEL — Chat Feed + Input", WHITE, [
        ("Top Status Bar", "Title: AI Hub (Exo 2, 18px, violet). Status dots: ● Simpee (green if function live) ● Copilot (blue) ● Builder (grey standby)"),
        ("User Message", "Right-aligned bubble. Background #5e50fb. White text. Montserrat 13px. Timestamp below in muted grey."),
        ("AI Response — 3 Cards", "Card 1 ANALYSIS (white, grey border): what Simpee understood.\nCard 2 SUGGESTION (white): recommended approach.\nCard 3 CODE / BRIEF (bg #fffbeb, border #fcd34d): actual code or brief in code block. Buttons: [COPY] [MARK AS TESTED] [DEPLOY TO 5S PORTAL]"),
        ("System Message", "Centre-aligned, italic, grey. E.g. 'Session started', 'Diagnostic complete'."),
        ("Input Bar — pinned bottom", "Intent chips (single select): Diagnose · Build · Fix Bug · Connect · Brainstorm · Ask\nText input full width. SEND button (#5e50fb). Ctrl+Enter also sends.\nOn send: (1) save to SChatMessage (2) show typing indicator (3) POST to aiCommandCentre (4) render 3-card response"),
    ]),
    ("RIGHT PANEL — Code Preview + Deploy", TINT, [
        ("Code Preview Area", "Dark bg #1a1a1f. Monospace white text. Shows most recent CODE READY card. Scrollable."),
        ("Status Badge", "[NOT TESTED] amber (default) → [TESTED PASS] green → [TESTED FAIL] red"),
        ("Action Buttons", "[COPY CODE] — copies to clipboard\n[MARK AS TESTED] — modal: Pass/Fail + notes → saves TestLog\n[DEPLOY TO 5S PORTAL] — only enabled when TESTED PASS. Confirmation modal shown. On confirm → posts to real portal NoticeBoard."),
        ("Deploy Log", "Last 3 deploys shown at bottom with timestamp and what was deployed."),
    ]),
]

for panel_title, panel_bg, sections in panels:
    story.append(Paragraph(panel_title, s("PH", fontSize=10, fontName="Helvetica-Bold", textColor=DARK, spaceBefore=8, spaceAfter=4)))
    for sec_name, sec_desc in sections:
        rows = [[
            Paragraph(sec_name, s("SN", fontSize=8, fontName="Helvetica-Bold", textColor=VIOLET)),
            Paragraph(sec_desc.replace("\n","<br/>"), s("SD", fontSize=8, fontName="Helvetica", textColor=BODY_TEXT, leading=13)),
        ]]
        st = Table(rows, colWidths=[38*mm, 130*mm])
        st.setStyle(TableStyle([
            ("BACKGROUND",(0,0),(0,0),LAVENDER),
            ("BACKGROUND",(1,0),(1,0),panel_bg),
            ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
            ("PADDING",(0,0),(-1,-1),7),
            ("VALIGN",(0,0),(-1,-1),"TOP"),
        ]))
        story.append(st)
    story.append(Spacer(1,4))

# ── 8 CHECKPOINTS ──────────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("8 CHECKPOINTS — All Must Pass Before Deploying to 5S Portal",
    s("H", fontSize=12, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))

checks = [
    ["#", "Checkpoint", "What Simpee Checks", "Status"],
    ["1", "Page renders", "No console errors, all 3 panels visible", ""],
    ["2", "Message saves", "Sending a message creates SChatMessage record", ""],
    ["3", "Function responds", "aiCommandCentre returns HTTP 200", ""],
    ["4", "3-card response", "Response renders as Analysis+Suggestion+Code cards (not raw JSON)", ""],
    ["5", "Copy code works", "COPY button copies code to clipboard", ""],
    ["6", "TestLog saves", "MARK AS TESTED creates TestLog record", ""],
    ["7", "Deploy gated", "DEPLOY button disabled until status = TESTED PASS", ""],
    ["8", "Deploy posts to portal", "Confirm deploy → NoticeBoard record created in 5S Portal", ""],
]
ct = Table(checks, colWidths=[10*mm, 42*mm, 90*mm, 26*mm])
ct.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK), ("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),7),
    ("ALIGN",(0,0),(0,-1),"CENTER"),
    ("ALIGN",(3,0),(3,-1),"CENTER"),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),
    ("TEXTCOLOR",(0,1),(0,-1),VIOLET),
]))
story.append(ct)
story.append(Spacer(1,10))

# ── BUILDER PASTE INSTRUCTIONS ─────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("BUILDER PASTE INSTRUCTIONS — STEP BY STEP",
    s("H", fontSize=12, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))

steps = [
    ("STEP 1", "Create a NEW Base44 app", "Name it 'AI Hub Test'. Do NOT work inside the existing 5S Portal."),
    ("STEP 2", "Add SChatMessage entity", "Fields: sender (string), sender_type (string), message (string), timestamp (string), session_id (string), read (boolean)"),
    ("STEP 3", "Add TestLog entity", "Fields: test_name (string), status (string), result (string), tested_at (string), fixed (boolean)"),
    ("STEP 4", "Paste to builder AI", "Copy the layout section of this blueprint and paste to builder with this prefix:\n'Build AIHub.jsx for a test app. 3-panel layout. SIMPLEX-ITY design: bg #e8e6fe, white cards, #5e50fb accent, Exo 2 bold headlines, Montserrat body. No emoji. Text symbols only.'"),
    ("STEP 5", "Wire the function", "In the input bar ON SEND handler, call: POST https://simpee-62ac123d.base44.app/functions/aiCommandCentre with body { instruction, posted_by }"),
    ("STEP 6", "Share app URL with Simpee", "Once built, send Kieran the app URL. Kieran tells Simpee. Simpee runs all 8 checkpoints."),
    ("STEP 7", "Fix any failing checkpoints", "Simpee reports exactly what failed and what code to fix."),
    ("STEP 8", "Deploy when all 8 pass", "Simpee generates the final AIHubPage.jsx to paste into the real 5S Portal."),
]
for step, title, desc in steps:
    row = [[
        Paragraph(step, s("SN", fontSize=8, fontName="Helvetica-Bold", textColor=WHITE)),
        Paragraph(f"<b>{title}</b><br/>{desc.replace(chr(10),'<br/>')}", s("SD", fontSize=8, fontName="Helvetica", textColor=BODY_TEXT, leading=13)),
    ]]
    rt = Table(row, colWidths=[22*mm, 146*mm])
    rt.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(0,0),VIOLET),
        ("BACKGROUND",(1,0),(1,0),WHITE if steps.index((step,title,desc))%2==0 else LAVENDER),
        ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
        ("PADDING",(0,0),(-1,-1),8),
        ("VALIGN",(0,0),(-1,-1),"TOP"),
    ]))
    story.append(rt)

story.append(Spacer(1,10))

# ── FOOTER ─────────────────────────────────────────────────────
ft = Table([[
    Paragraph("AI Hub Test App · SIMPLEX-ITY · Confidential", s("F1", fontSize=7, fontName="Helvetica", textColor=MUTED)),
    Paragraph(f"Generated by Simpee · {today} · v1.0", s("F2", fontSize=7, fontName="Helvetica", textColor=MUTED, alignment=TA_RIGHT)),
]], colWidths=[83*mm, 83*mm])
ft.setStyle(TableStyle([("TOPPADDING",(0,0),(-1,-1),8),("LINEABOVE",(0,0),(-1,0),0.5,NEUTRAL)]))
story.append(ft)

doc.build(story)
print("PDF built OK")
