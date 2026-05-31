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
INDIGO    = HexColor("#4f46e5")

def s(name, **kw): return ParagraphStyle(name, **kw)
today = datetime.date.today().strftime("%d %B %Y")

doc = SimpleDocTemplate("Command_AI_Hub_Blueprint_v131.pdf", pagesize=A4,
    leftMargin=18*mm, rightMargin=18*mm, topMargin=18*mm, bottomMargin=18*mm)
story = []

# ── COVER ──────────────────────────────────────────────────────
cover = Table([[
    Paragraph("COMMAND AI HUB", s("T", fontSize=24, fontName="Helvetica-Bold", textColor=WHITE)), ""
],[
    Paragraph("BLUEPRINT v1.3.1 — AUTO ASSEMBLY · SANDBOX · FILE UPLOAD · PRE-SCREEN", s("S", fontSize=8, fontName="Helvetica", textColor=SOFT)),
    Paragraph(f"Version 1.3.1 · {today}", s("R", fontSize=8, fontName="Helvetica", textColor=SOFT, alignment=TA_RIGHT))
],[
    Paragraph("Build AFTER v1.3 (Memory Layer) passes all 11 checkpoints", s("S2", fontSize=8, fontName="Helvetica", textColor=HexColor("#9896ad"))),
    Paragraph("5 new features · Simpee stays Simpee", s("N", fontSize=7.5, fontName="Helvetica", textColor=YELLOW_B, alignment=TA_RIGHT))
]], colWidths=[124*mm, 44*mm])
cover.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,-1),DARK),
    ("TOPPADDING",(0,0),(-1,-1),10),("BOTTOMPADDING",(0,0),(-1,-1),10),
    ("LEFTPADDING",(0,0),(-1,-1),16),("RIGHTPADDING",(0,0),(-1,-1),16),
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
]))
story.append(cover)
story.append(Spacer(1,8))

# ── WHAT'S IN THIS BLUEPRINT ───────────────────────────────────
story.append(Paragraph(
    "<b>WHAT'S IN v1.3.1:</b> Five new features requested by Kieran — making the Hub smarter, safer, and more collaborative. "
    "Simpee pre-screens every question and auto-assembles the right team. A live indicator shows who is working. "
    "A Sandbox protects production from draft experiments. Files can be shared directly in chat. "
    "And before any deep dive, the team runs a Pre-Screen Feasibility check so everyone knows what they're getting into. "
    "<b>Build after v1.3 Memory Layer is live and validated.</b>",
    s("P", fontSize=9, fontName="Helvetica", textColor=BODY_TEXT, leading=14,
      borderColor=VIOLET, borderWidth=1.5, borderPadding=10, backColor=LAVENDER, spaceAfter=10)))

# ── PREREQUISITE ───────────────────────────────────────────────
story.append(Table([[
    Paragraph("PREREQUISITE", s("PRE", fontSize=8, fontName="Helvetica-Bold", textColor=WHITE)),
    Paragraph(
        "Build ONLY after Blueprint v1.3 (AI Persistent Memory + OneDrive Sync) passes all 11 checkpoints. "
        "All 8 AIConnector records must be live with intro_message, voice_style, and handoff_to fields populated.",
        s("PRE2", fontSize=8, fontName="Helvetica", textColor=BODY_TEXT, leading=13))
]], colWidths=[28*mm, 140*mm]))
story[-1].setStyle(TableStyle([
    ("BACKGROUND",(0,0),(0,0),RED),
    ("BACKGROUND",(1,0),(1,0),LIGHT_RED),
    ("GRID",(0,0),(-1,-1),0.5,RED),
    ("PADDING",(0,0),(-1,-1),8),
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
]))
story.append(Spacer(1,10))

# ── FEATURE 1 — AUTO TEAM ASSEMBLY ────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("FEATURE 1 — Auto Team Assembly",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
story.append(Paragraph(
    "Kieran submits a question. Simpee reads it, decides which 2 AIs are best suited, and assembles them automatically. "
    "No need to manually pick chips. The right people just show up.",
    s("Sub", fontSize=8.5, fontName="Helvetica", textColor=BODY_TEXT, leading=13, spaceAfter=6)))

assembly = [
    ["Question Type","Primary AI","Support AI","Logic"],
    ["Research / market data","RESEARCHER","ANALYST","Need data first, then a clear summary"],
    ["Build / code / function","ENGINEER","ARCHITECT","Need design then implementation"],
    ["Strategy / planning","STRATEGIST","THINK TANK","Need logic then stress-test"],
    ["Error / bug / diagnosis","ENGINEER","STRATEGIST","Need fix then validation of root cause"],
    ["Business / market analysis","RESEARCHER","STRATEGIST","Need data then feasibility"],
    ["Brand / design / visual","ARCHITECT","ANALYST","Need structure then brief"],
    ["Any deploy / validation","Best 2 for task","+ VALIDATOR always added as 3rd","Validator never skipped on deploys"],
]
at = Table(assembly, colWidths=[42*mm, 26*mm, 26*mm, 74*mm])
at.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7.5),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,8),(-1,8),YELLOW),
    ("TEXTCOLOR",(1,8),(2,8),ORANGE),("FONTNAME",(1,8),(2,8),"Helvetica-Bold"),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),6),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(at)
story.append(Spacer(1,6))

story.append(Paragraph("UI Flow — What Kieran Sees",
    s("SH", fontSize=9, fontName="Helvetica-Bold", textColor=DARK, spaceAfter=3)))
flow1 = [
    ["Step","What Appears in Chat"],
    ["1 — Submit","Kieran types question and hits send"],
    ["2 — Simpee reads","Slim banner: 'Simpee is reading your request...' (0.5s)"],
    ["3 — Assembly","Banner updates: '[RESEARCHER] + [ANALYST] assembling...' — both chips pulse violet in left panel"],
    ["4 — Working","Per-AI typing indicator: 'RESEARCHER is working...' with animated dots"],
    ["5 — Response 1","RESEARCHER response card appears with their intro line (first time in session)"],
    ["6 — Handoff","Transition line: 'RESEARCHER passing to ANALYST...'"],
    ["7 — Response 2","ANALYST response card appears — summary of RESEARCHER's findings"],
    ["8 — Done","Banner clears. Both AI cards return to steady state in left panel."],
]
ft = Table(flow1, colWidths=[32*mm, 136*mm])
ft.setStyle(TableStyle([
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
story.append(ft)
story.append(Spacer(1,10))

# ── FEATURE 2 — LIVE WORKING INDICATOR ────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("FEATURE 2 — Live Working Indicator",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
story.append(Paragraph(
    "Always know exactly which AI is active, what they are doing, and how long it is taking. "
    "No more staring at a blank screen wondering if something is happening.",
    s("Sub", fontSize=8.5, fontName="Helvetica", textColor=BODY_TEXT, leading=13, spaceAfter=6)))

indicators = [
    ["Indicator","Location","Behaviour"],
    ["Pulsing violet ring","Left panel — active AI card","Glows violet while that AI is generating. Returns to normal when done."],
    ["Progress bar","Centre panel — top edge","Slim animated bar slides across while any AI is working. Disappears on completion."],
    ["Typing dots","Centre panel — in chat","'RESEARCHER is working...' with 3 animated dots. Per AI, per response."],
    ["Handoff transition","Centre panel — between cards","'RESEARCHER passing to ANALYST...' with a right-arrow animation between cards."],
    ["Response timer","Each response card — footer","'Responded in 3.2s' shown in muted text below each AI response."],
    ["Queue indicator","Left panel — bottom","If 3 AIs called: '2 in queue' shown below active AI. Updates as each finishes."],
]
it = Table(indicators, colWidths=[34*mm, 38*mm, 96*mm])
it.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7.5),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),6),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(it)
story.append(Spacer(1,10))

# ── FEATURE 3 — PROJECT SANDBOX ───────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("FEATURE 3 — Project Sandbox (Safe Build Zone)",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
story.append(Paragraph(
    "A completely safe space to build, test, and iterate. Nothing here touches the live 5S Portal or Nexus Command "
    "until Kieran explicitly approves and all 11 checkpoints pass. Build freely. Break things. Start over. Zero risk.",
    s("Sub", fontSize=8.5, fontName="Helvetica", textColor=BODY_TEXT, leading=13, spaceAfter=6)))

sandbox = [
    ["Element","Detail"],
    ["New tab in Hub","'SANDBOX' tab in main nav. Separate from the live chat and deploy flow."],
    ["Project card","Each project shows: name, type (Function / Page / App), status badge, last modified, checkpoint progress bar (0/11)."],
    ["Status flow","DRAFT → TESTING → CHECKPOINT REVIEW → VALIDATOR PENDING → APPROVED → DEPLOY READY"],
    ["Code editor","Inline code preview per file. Syntax highlighted. Read-only until ENGINEER is assigned."],
    ["No auto-deploy","Code in Sandbox NEVER touches production automatically. Deploy requires manual [SEND TO PRODUCTION] after all 11 pass."],
    ["VALIDATOR gate","Even in Sandbox, VALIDATOR must review before status moves to APPROVED."],
    ["Project notes","Each project has a notes field — Kieran or any AI can add context at any stage."],
]
sbt = Table(sandbox, colWidths=[36*mm, 132*mm])
sbt.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,5),(-1,5),LIGHT_RED),
    ("TEXTCOLOR",(0,5),(0,5),RED),("FONTNAME",(0,5),(0,5),"Helvetica-Bold"),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),6),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(sbt)
story.append(Spacer(1,6))

story.append(Paragraph("New Entities Required",
    s("SH", fontSize=9, fontName="Helvetica-Bold", textColor=DARK, spaceAfter=3)))
entities = [
    ["Entity","Fields","Purpose"],
    ["SandboxProject",
     "name · description · type (function/page/app) · status · created_by · last_modified · checkpoint_status · validator_approved · notes",
     "One record per sandbox project. Tracks lifecycle from draft to deploy-ready."],
    ["ProjectFile",
     "project_id · filename · content · language · version · notes",
     "One record per file within a project. Stores the actual code. Versioned so ENGINEER can iterate safely."],
]
et = Table(entities, colWidths=[28*mm, 76*mm, 64*mm])
et.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7.5),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),("TEXTCOLOR",(0,1),(0,-1),VIOLET),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),6),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(et)
story.append(Spacer(1,10))

# ── FEATURE 4 — FILE UPLOAD IN CHAT ───────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("FEATURE 4 — File Upload in Chat",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
story.append(Paragraph(
    "Share files directly in the Hub chat. Any AI called after the upload can reference the file — "
    "read it, analyse it, act on it. The team sees what Kieran sees.",
    s("Sub", fontSize=8.5, fontName="Helvetica", textColor=BODY_TEXT, leading=13, spaceAfter=6)))

upload = [
    ["Element","Detail"],
    ["Upload button","Paperclip icon at left of chat input bar. Opens file picker on click."],
    ["Supported types","PDF · DOCX · JPG · PNG · JSON · CSV · TXT · XLSX · max 10MB per file"],
    ["Preview card","After upload: file card appears in chat — filename, type icon, size, thumbnail (images). 'Shared with team' label."],
    ["AI awareness","Any AI called after upload receives: 'Kieran has shared [filename]. Contents: [extracted text / description]' in their context."],
    ["Storage","File stored in Document entity with source='AI Hub', project_id if a Sandbox project is active, tags=['hub-upload']."],
    ["Multiple files","Up to 3 files per message. Shown as a card row above the typed message."],
    ["Image analysis","If image uploaded — ARCHITECT or ANALYST can describe and analyse the visual content on request."],
]
upt = Table(upload, colWidths=[30*mm, 138*mm])
upt.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),6),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(upt)
story.append(Spacer(1,10))

# ── FEATURE 5 — PRE-SCREEN FEASIBILITY ────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=TEAL, spaceAfter=8))
story.append(Paragraph("FEATURE 5 — Pre-Screen Feasibility Panel",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=TEAL, spaceAfter=4)))
story.append(Paragraph(
    "Before any deep dive or build — Simpee calls RESEARCHER + STRATEGIST for a joint feasibility check. "
    "They give you the honest picture upfront: complexity, time, risks, opportunities. "
    "You decide whether to proceed. No wasted effort. No surprises mid-build.",
    s("Sub", fontSize=8.5, fontName="Helvetica", textColor=BODY_TEXT, leading=13, spaceAfter=6)))

story.append(Paragraph("How It Triggers",
    s("SH", fontSize=9, fontName="Helvetica-Bold", textColor=DARK, spaceAfter=3)))
story.append(Paragraph(
    "Auto-triggered when: Kieran describes a new project idea, uses words like 'build', 'create', 'develop', 'launch', 'new app'. "
    "Also manually triggered via [RUN PRE-SCREEN] button at top of Sandbox.",
    s("Body", fontSize=8, fontName="Helvetica", textColor=BODY_TEXT, leading=13, spaceAfter=6)))

prescreen = [
    ["Report Section","Who Produces","What It Contains"],
    ["Complexity Rating","STRATEGIST",
     "LOW / MEDIUM / HIGH / VERY HIGH\nWith one-line explanation of why."],
    ["Estimated Build Time","ENGINEER (consulted)","Realistic estimate: days / weeks. Broken into phases if HIGH complexity."],
    ["Key Risks — Top 3","THINK TANK (consulted)","What could go wrong. Ranked by impact. Plain English."],
    ["Key Opportunities — Top 3","RESEARCHER","What makes this worth building. Market context. Competitive edge."],
    ["Recommended First Step","STRATEGIST","Single most important action before any code is written."],
    ["Confidence Score","Simpee (synthesised)","0-100%. How confident the team is in the assessment based on available data."],
    ["Decision buttons","Kieran",
     "[PROCEED TO BUILD] — creates Sandbox project and begins blueprint\n[NEEDS MORE RESEARCH] — routes back to RESEARCHER with specific questions\n[PARK FOR NOW] — saves pre-screen to Notes for later"],
]
pst = Table(prescreen, colWidths=[38*mm, 30*mm, 100*mm])
pst.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,7),(-1,7),LIGHT_GREEN),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),6),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(pst)
story.append(Spacer(1,6))

# Sample pre-screen output
story.append(Paragraph("Sample Pre-Screen Output — What Kieran Sees",
    s("SH", fontSize=9, fontName="Helvetica-Bold", textColor=DARK, spaceAfter=3)))
story.append(Table([[
    Paragraph(
        "PRE-SCREEN REPORT — Beauty Brand App for Asian Market\n"
        "Assembled by Simpee · RESEARCHER + STRATEGIST · THINK TANK consulted\n\n"
        "Complexity:          HIGH\n"
        "Estimated Build:     6-8 weeks across 4 phases\n"
        "Confidence Score:    78%\n\n"
        "Top 3 Risks:\n"
        "  1. Influencer reliability scoring needs historical data — not available at launch [HIGH]\n"
        "  2. Multi-platform campaign tracking requires API integrations — 2-3 week dependency [MEDIUM]\n"
        "  3. Mobile-first layout requires separate QA pass — easy to miss on desktop builds [LOW]\n\n"
        "Top 3 Opportunities:\n"
        "  1. No direct competitor has brand + influencer + campaign in one portal in HK market\n"
        "  2. Tint integration already planned — unique differentiator from day one\n"
        "  3. 5S Portal entities already exist — 60% of the data layer is built\n\n"
        "Recommended First Step:\n"
        "  Define the influencer scoring model BEFORE building — everything else depends on it.\n\n"
        "[PROCEED TO BUILD]     [NEEDS MORE RESEARCH]     [PARK FOR NOW]",
        s("CODE", fontSize=7.5, fontName="Courier", textColor=BODY_TEXT, leading=12))
]], colWidths=[168*mm]))
story[-1].setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,-1),HexColor("#f0fdf4")),
    ("GRID",(0,0),(-1,-1),1,TEAL),
    ("PADDING",(0,0),(-1,-1),10),
]))
story.append(Spacer(1,10))

# ── BUILDER PREFIX ─────────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("BUILDER PREFIX — Paste This to Implement Blueprint v1.3.1",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))
story.append(Table([[
    Paragraph(
        "\"Build Blueprint v1.3.1 — 5 new features for Command AI Hub (Nexus Command).\n\n"
        "PREREQUISITE: v1.3 Memory Layer must be live. All 8 AIConnector records must have intro_message, voice_style, handoff_to populated.\n\n"
        "FEATURE 1 — AUTO TEAM ASSEMBLY:\n"
        "When Kieran submits a message, Simpee reads it and auto-selects 2 best AIs based on question type "
        "(see routing table in blueprint). Show assembly banner: 'Simpee is assembling your team...'. "
        "Both AI chips pulse violet. Each AI responds in sequence with handoff line between them. "
        "For any deploy request, always add VALIDATOR as 3rd.\n\n"
        "FEATURE 2 — LIVE WORKING INDICATORS:\n"
        "Pulsing violet ring on active AI card in left panel. Slim animated progress bar at top of centre panel. "
        "Per-AI typing dots: 'RESEARCHER is working...' Handoff transition animation between response cards. "
        "Response timer in muted text below each card. Queue indicator if multiple AIs waiting.\n\n"
        "FEATURE 3 — PROJECT SANDBOX TAB:\n"
        "New 'SANDBOX' tab in main nav. Create SandboxProject and ProjectFile entities (schemas in blueprint). "
        "Project cards with status flow: DRAFT → TESTING → CHECKPOINT REVIEW → VALIDATOR PENDING → APPROVED → DEPLOY READY. "
        "Inline code preview per file. No auto-deploy — manual [SEND TO PRODUCTION] only after all 11 checkpoints pass.\n\n"
        "FEATURE 4 — FILE UPLOAD IN CHAT:\n"
        "Paperclip icon left of chat input. Supports PDF, DOCX, JPG, PNG, JSON, CSV, TXT, XLSX (max 10MB). "
        "Preview card in chat after upload. File stored in Document entity (source='AI Hub'). "
        "Any AI called after upload receives file context automatically.\n\n"
        "FEATURE 5 — PRE-SCREEN FEASIBILITY PANEL:\n"
        "Auto-trigger when Kieran uses build/create/launch keywords. Manually triggerable via [RUN PRE-SCREEN] button. "
        "Simpee assembles RESEARCHER + STRATEGIST. Report shows: Complexity, Build Time, Top 3 Risks, Top 3 Opportunities, "
        "First Step, Confidence Score. Three decision buttons: [PROCEED TO BUILD] [NEEDS MORE RESEARCH] [PARK FOR NOW].\n\n"
        "Same design system: #e8e6fe bg, #5e50fb accent, Exo 2 headlines, Montserrat body. No emoji.\"",
        s("BX", fontSize=7.5, fontName="Helvetica", textColor=BODY_TEXT, leading=13))
]], colWidths=[168*mm]))
story[-1].setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,-1),YELLOW),
    ("GRID",(0,0),(-1,-1),1.5,YELLOW_B),
    ("PADDING",(0,0),(-1,-1),10),
]))
story.append(Spacer(1,10))

# ── BUILD ROADMAP ──────────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("FULL BUILD ROADMAP — Where We Are",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))

roadmap = [
    ["Blueprint","Focus","Status"],
    ["v1.2.1","Role-aware chat · Gatekeeper Panel · AI Family voices · 8 member team","Send to builder — ready now"],
    ["v1.3","AI Persistent Memory · OneDrive sync · Role memory files","Build after v1.2.1 passes"],
    ["v1.3.1","Auto Assembly · Live Indicators · Sandbox · File Upload · Pre-Screen","This document — build after v1.3"],
    ["v1.4","DESIGNER (Canva) + BRAND DIRECTOR (Looka) onboarding","Draft ready — build after v1.3.1"],
    ["v1.5","Cross-portal sync — Hub memories feed into 5S Portal decisions","Future"],
]
rm = Table(roadmap, colWidths=[18*mm, 100*mm, 50*mm])
rm.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),("TEXTCOLOR",(0,1),(0,-1),VIOLET),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,1),(-1,1),LIGHT_GREEN),
    ("TEXTCOLOR",(2,1),(2,1),TEAL),("FONTNAME",(2,1),(2,1),"Helvetica-Bold"),
    ("BACKGROUND",(0,3),(-1,3),LIGHT_BLUE),
    ("TEXTCOLOR",(0,3),(0,3),AZURE),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),6),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(rm)
story.append(Spacer(1,8))

# ── FOOTER ─────────────────────────────────────────────────────
ft = Table([[
    Paragraph("Command AI Hub Blueprint v1.3.1 · SIMPLEX-ITY · AI Family Company · Confidential", s("F1", fontSize=7, fontName="Helvetica", textColor=MUTED)),
    Paragraph(f"Kieran Li + Simpee · {today} · Build after v1.3", s("F2", fontSize=7, fontName="Helvetica-Bold", textColor=VIOLET, alignment=TA_RIGHT)),
]], colWidths=[110*mm, 58*mm])
ft.setStyle(TableStyle([("TOPPADDING",(0,0),(-1,-1),8),("LINEABOVE",(0,0),(-1,0),0.5,NEUTRAL)]))
story.append(ft)

doc.build(story)
print("PDF built OK — Blueprint v1.3.1")
