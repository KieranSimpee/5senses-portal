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
ONEDRIVE  = HexColor("#0078d4")
LIGHT_BLUE = HexColor("#eff6ff")
LIGHT_GREEN = HexColor("#f0fdf4")

def s(name, **kw): return ParagraphStyle(name, **kw)
today = datetime.date.today().strftime("%d %B %Y")

doc = SimpleDocTemplate("Command_AI_Hub_Blueprint_v13_Memory.pdf", pagesize=A4,
    leftMargin=18*mm, rightMargin=18*mm, topMargin=18*mm, bottomMargin=18*mm)
story = []

# ── COVER ──────────────────────────────────────────────────────
cover = Table([[
    Paragraph("COMMAND AI HUB", s("T", fontSize=24, fontName="Helvetica-Bold", textColor=WHITE)), ""
],[
    Paragraph("BLUEPRINT v1.3 — AI PERSISTENT MEMORY LAYER · ONEDRIVE SYNC", s("S", fontSize=8, fontName="Helvetica", textColor=SOFT)),
    Paragraph(f"Version 1.3 · {today}", s("R", fontSize=8, fontName="Helvetica", textColor=SOFT, alignment=TA_RIGHT))
],[
    Paragraph("Build AFTER v1.2.1 passes all 11 checkpoints", s("S2", fontSize=8, fontName="Helvetica", textColor=HexColor("#9896ad"))),
    Paragraph("Each AI remembers. The team never loses context.", s("N", fontSize=7.5, fontName="Helvetica", textColor=YELLOW_B, alignment=TA_RIGHT))
]], colWidths=[124*mm, 44*mm])
cover.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,-1),DARK),
    ("TOPPADDING",(0,0),(-1,-1),10),("BOTTOMPADDING",(0,0),(-1,-1),10),
    ("LEFTPADDING",(0,0),(-1,-1),16),("RIGHTPADDING",(0,0),(-1,-1),16),
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
]))
story.append(cover)
story.append(Spacer(1,8))

# ── WHY THIS EXISTS ────────────────────────────────────────────
story.append(Paragraph(
    "<b>WHY THIS EXISTS:</b> Every AI in the Hub works hard — researches, plans, builds, validates. "
    "But today, when a session ends, that knowledge disappears. "
    "Blueprint v1.3 fixes that. Each AI gets their own persistent memory file stored in OneDrive. "
    "When they reconnect — even months later — they read their file and pick up exactly where they left off. "
    "<b>The team never loses context. Every session makes them smarter.</b>",
    s("P", fontSize=9, fontName="Helvetica", textColor=BODY_TEXT, leading=14,
      borderColor=VIOLET, borderWidth=1.5, borderPadding=10, backColor=LAVENDER, spaceAfter=10)))

# ── PREREQUISITE ───────────────────────────────────────────────
story.append(Table([[
    Paragraph("PREREQUISITE", s("PRE", fontSize=8, fontName="Helvetica-Bold", textColor=WHITE)),
    Paragraph(
        "This blueprint is built ONLY after Blueprint v1.2.1 passes all 11 checkpoints and is live in Nexus Command. "
        "OneDrive connector is already authorised on Kieran's account. Do not begin if v1.2.1 is not yet validated.",
        s("PRE2", fontSize=8, fontName="Helvetica", textColor=BODY_TEXT, leading=13))
]], colWidths=[28*mm, 140*mm]))
story[-1].setStyle(TableStyle([
    ("BACKGROUND",(0,0),(0,0),RED),
    ("BACKGROUND",(1,0),(1,0),HexColor("#fff0f0")),
    ("GRID",(0,0),(-1,-1),0.5,RED),
    ("PADDING",(0,0),(-1,-1),8),
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
]))
story.append(Spacer(1,10))

# ── THREE MEMORY LAYERS ────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("THREE MEMORY LAYERS — What Gets Stored and Where",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
story.append(Paragraph(
    "Memory is organised into 3 layers — each serving a different purpose. "
    "All stored in OneDrive under a single /5S-Portal/ folder.",
    s("Sub", fontSize=8, fontName="Helvetica", textColor=MUTED, spaceAfter=6)))

layers = [
    ["Layer","Name","OneDrive Path","What It Contains","Updated When"],
    ["1","Session Logs",
     "/5S-Portal/AI-Hub/Sessions/\nYYYY-MM-DD_[session_id].json",
     "Full record of each Hub session — every message, every AI response, every handoff, every deploy. Tagged by duty name.",
     "Automatically after every Hub session ends or a deploy fires"],
    ["2","Role Memory Files",
     "/5S-Portal/AI-Hub/Memory/\n[ROLE]_memory.md\n\ne.g. ENGINEER_memory.md\nRESEARCHER_memory.md",
     "Each AI's personal memory — what they built, what patterns worked, what failed, what they learned. Written in plain English so they can read and understand it on reconnect.",
     "After every deploy — ANALYST writes the debrief, it gets appended to the relevant role's file"],
    ["3","Blueprint Archive",
     "/5S-Portal/AI-Hub/Blueprints/\nBlueprint_v[X.X]_[date].pdf",
     "Every blueprint version — the shared source of truth for the whole team. Any AI can read the full history of what was designed and why.",
     "Each time a new blueprint is finalised and approved"],
]
lt = Table(layers, colWidths=[10*mm, 22*mm, 40*mm, 56*mm, 40*mm])
lt.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7.5),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),("TEXTCOLOR",(0,1),(0,-1),VIOLET),
    ("FONTNAME",(1,1),(1,-1),"Helvetica-Bold"),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),6),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
    ("ALIGN",(0,0),(0,-1),"CENTER"),
]))
story.append(lt)
story.append(Spacer(1,10))

# ── ONEDRIVE FOLDER STRUCTURE ──────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=ONEDRIVE, spaceAfter=8))
story.append(Paragraph("ONEDRIVE FOLDER STRUCTURE — Exact Layout to Create",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=ONEDRIVE, spaceAfter=4)))

folders = [
    ["Folder / File","Type","Purpose"],
    ["/5S-Portal/","Root folder","Everything for the portal and AI Hub lives here"],
    ["/5S-Portal/AI-Hub/","Sub-folder","All AI Hub memory and logs"],
    ["/5S-Portal/AI-Hub/Sessions/","Sub-folder","One JSON file per session. Auto-created by syncToOneDrive."],
    ["/5S-Portal/AI-Hub/Memory/","Sub-folder","One .md file per AI role. The heart of persistent memory."],
    ["/5S-Portal/AI-Hub/Memory/ORCHESTRATOR_memory.md","File","ORCHESTRATOR's personal memory log"],
    ["/5S-Portal/AI-Hub/Memory/RESEARCHER_memory.md","File","RESEARCHER's personal memory log"],
    ["/5S-Portal/AI-Hub/Memory/ANALYST_memory.md","File","ANALYST's personal memory log"],
    ["/5S-Portal/AI-Hub/Memory/STRATEGIST_memory.md","File","STRATEGIST's personal memory log"],
    ["/5S-Portal/AI-Hub/Memory/THINK_TANK_memory.md","File","THINK TANK's personal memory log"],
    ["/5S-Portal/AI-Hub/Memory/ENGINEER_memory.md","File","ENGINEER's personal memory log"],
    ["/5S-Portal/AI-Hub/Memory/ARCHITECT_memory.md","File","ARCHITECT's personal memory log"],
    ["/5S-Portal/AI-Hub/Memory/VALIDATOR_memory.md","File","VALIDATOR's personal memory log"],
    ["/5S-Portal/AI-Hub/Blueprints/","Sub-folder","Blueprint PDFs — every version archived here"],
    ["/5S-Portal/Documents/","Sub-folder","Business docs, agreements, compliance files — existing use"],
]
ft = Table(folders, colWidths=[80*mm, 20*mm, 68*mm])
ft.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7.5),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,5),(0,12),LIGHT_BLUE),
    ("TEXTCOLOR",(0,5),(0,12),ONEDRIVE),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),5),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(ft)
story.append(Spacer(1,10))

# ── WHAT EACH MEMORY FILE CONTAINS ────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("ROLE MEMORY FILE FORMAT — What Each AI's Memory Contains",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
story.append(Paragraph(
    "Each memory file is plain Markdown — readable by both humans and AI. "
    "When an AI is called for the first time in a session, the system loads their memory file "
    "and passes the last 500 words as context. They know who they are and what they have done.",
    s("Sub", fontSize=8.5, fontName="Helvetica", textColor=BODY_TEXT, leading=13, spaceAfter=6)))

story.append(Table([[
    Paragraph(
        "# ENGINEER_memory.md\n\n"
        "## Role\nDuty: ENGINEER · Model: GPT-5.4 · Provider: OpenAI\n"
        "Lane: Code generation, backend functions, API wiring, structured output.\n"
        "Handoff to: STRATEGIST (for logic review) → VALIDATOR (for final gate)\n\n"
        "## What I Have Built\n"
        "- aiCommandCentre function — deployed 31 May 2026. Handles role-aware routing.\n"
        "- processSChatInstruction function — deployed 30 May 2026. S-Chat backend loop.\n"
        "- syncToOneDrive function — deployed [date]. Writes session logs + memory files.\n\n"
        "## Patterns That Work\n"
        "- Always use base44.asServiceRole for entity writes in backend functions.\n"
        "- Graph API calls return 202 with empty body — use text() not json().\n"
        "- AIConnector records drive all role context — read them first before routing.\n\n"
        "## Lessons Learned\n"
        "- 31 May 2026: App ID mismatch between sandbox and production caused silent write failures.\n"
        "  Fix: always confirm app_id before any write. Production = 69edd16e877d6e4391ad74bd.\n\n"
        "## Last 3 Sessions\n"
        "- 31 May 2026 · Built role-aware chat · VALIDATOR: all clear\n"
        "- 30 May 2026 · Fixed S-Chat endpoint · VALIDATOR: all clear\n"
        "- 29 May 2026 · Invoice PDF generator · VALIDATOR: 1 warning resolved",
        s("CODE", fontSize=7.5, fontName="Courier", textColor=BODY_TEXT, leading=12))
]], colWidths=[168*mm]))
story[-1].setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,-1),HexColor("#f8f8ff")),
    ("GRID",(0,0),(-1,-1),1,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),10),
]))
story.append(Spacer(1,10))

# ── TWO NEW FUNCTIONS ──────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("TWO NEW FUNCTIONS — What to Build",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))

funcs = [
    ["Function","Trigger","What It Does","Key Steps"],
    ["syncToOneDrive",
     "Called automatically after every Hub deploy or session end",
     "Saves the session log as JSON to OneDrive Sessions folder. Appends ANALYST's debrief to each relevant role's memory.md file. Saves latest blueprint PDF to Blueprints folder.",
     "1. Collect session messages from SChatMessage entity\n"
     "2. Write JSON to /AI-Hub/Sessions/[date]_[id].json via Graph API\n"
     "3. Read ANALYST's debrief from latest SChatMessage\n"
     "4. Append to each role's _memory.md in /AI-Hub/Memory/\n"
     "5. Upload latest blueprint PDF to /AI-Hub/Blueprints/\n"
     "6. Return { synced: true, files_written: N }"],
    ["loadMemory",
     "Called by aiCommandCentre when an AI is first addressed in a session",
     "Reads that AI's memory.md from OneDrive. Returns the last 500 words as context string. Injected into the system prompt so the AI responds with full historical awareness.",
     "1. Receive duty_name (e.g. 'ENGINEER')\n"
     "2. Fetch /AI-Hub/Memory/[DUTY_NAME]_memory.md from OneDrive via Graph API\n"
     "3. Extract last 500 words\n"
     "4. Return { memory_context: string, last_updated: timestamp }\n"
     "5. aiCommandCentre prepends this to the system prompt for that AI's response"],
]
ft2 = Table(funcs, colWidths=[28*mm, 30*mm, 44*mm, 66*mm])
ft2.setStyle(TableStyle([
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
story.append(ft2)
story.append(Spacer(1,10))

# ── UI ADDITIONS ───────────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("UI ADDITIONS — Small Changes to CommandAIHub.jsx",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
story.append(Paragraph("Only 3 small UI additions needed. No structural changes to the existing layout.",
    s("Sub", fontSize=8, fontName="Helvetica", textColor=MUTED, spaceAfter=6)))

ui = [
    ["Addition","Where","Detail"],
    ["Memory indicator on AI status cards",
     "Left panel — each AI card",
     "Small OneDrive icon + 'Memory loaded' (green) or 'No memory yet' (grey). Shows whether that AI has a memory file in OneDrive."],
    ["[SYNC TO ONEDRIVE] button",
     "Right panel — below Deploy Log",
     "Azure bg. Fires syncToOneDrive manually. Shows last sync timestamp. Auto-fires after every deploy — this is the manual override."],
    ["Memory context banner",
     "Centre panel — above chat feed, first time an AI is called",
     "Slim blue banner: 'ENGINEER memory loaded — last active [date]'. Dismissible. Confirms the AI has their history."],
]
ut = Table(ui, colWidths=[40*mm, 34*mm, 94*mm])
ut.setStyle(TableStyle([
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
story.append(ut)
story.append(Spacer(1,10))

# ── RECONNECT SCENARIO ─────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=TEAL, spaceAfter=8))
story.append(Paragraph("RECONNECT SCENARIO — What Happens When an AI Comes Back",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=TEAL, spaceAfter=4)))
story.append(Paragraph(
    "This is the scenario Kieran asked about. An AI gets disconnected. Comes back months later. Here is exactly what happens.",
    s("Sub", fontSize=8, fontName="Helvetica", textColor=MUTED, spaceAfter=6)))

reconnect = [
    ["Step","What Happens","Who Does It"],
    ["1","Kieran types 'ENGINEER —' in the Hub chat","Kieran"],
    ["2","aiCommandCentre detects ENGINEER is being called. Checks if ENGINEER has a memory file in OneDrive.","ORCHESTRATOR"],
    ["3","loadMemory fetches ENGINEER_memory.md from OneDrive. Extracts last 500 words of context.","loadMemory function"],
    ["4","Memory context is prepended to ENGINEER's system prompt before they respond.","aiCommandCentre function"],
    ["5","ENGINEER responds — in character, with full awareness of past work:\n\"ENGINEER here. Back online. I can see we've built aiCommandCentre, processSChatInstruction, and syncToOneDrive. Last session was [date]. Ready to continue.\"","ENGINEER"],
    ["6","Blue memory banner appears in chat: 'ENGINEER memory loaded — last active [date]'","CommandAIHub.jsx"],
    ["7","Session continues. ENGINEER works as if they never left.","Full team"],
]
rc = Table(reconnect, colWidths=[10*mm, 116*mm, 42*mm])
rc.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),("TEXTCOLOR",(0,1),(0,-1),VIOLET),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,5),(-1,5),LIGHT_BLUE),
    ("BACKGROUND",(0,7),(-1,7),LIGHT_GREEN),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),6),
    ("ALIGN",(0,0),(0,-1),"CENTER"),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(rc)
story.append(Spacer(1,10))

# ── BUILDER PREFIX ─────────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("BUILDER PREFIX — Paste This to Implement Blueprint v1.3",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))
story.append(Table([[
    Paragraph(
        "\"Build Blueprint v1.3 — AI Persistent Memory Layer for Command AI Hub (Nexus Command app).\n\n"
        "PREREQUISITE: Blueprint v1.2.1 must be live and all 11 checkpoints passed before starting this.\n\n"
        "1. CREATE ONEDRIVE FOLDER STRUCTURE via Microsoft Graph API:\n"
        "   /5S-Portal/AI-Hub/Sessions/ · /5S-Portal/AI-Hub/Memory/ · /5S-Portal/AI-Hub/Blueprints/\n"
        "   Create one [ROLE]_memory.md file per AI (8 files) with role header, lane, and handoff_to pre-filled.\n\n"
        "2. BUILD syncToOneDrive FUNCTION:\n"
        "   Triggered after every deploy. Reads SChatMessage entity for session. Writes JSON session log to Sessions folder. "
        "   Appends ANALYST debrief to relevant role memory.md files. Uploads latest blueprint to Blueprints folder.\n\n"
        "3. BUILD loadMemory FUNCTION:\n"
        "   Called by aiCommandCentre when an AI is first addressed. Fetches [ROLE]_memory.md from OneDrive. "
        "   Returns last 500 words as memory_context string. aiCommandCentre prepends to system prompt.\n\n"
        "4. UPDATE aiCommandCentre FUNCTION:\n"
        "   On first call to any duty name in a session — call loadMemory, inject context into system prompt.\n\n"
        "5. UPDATE CommandAIHub.jsx — 3 small additions only:\n"
        "   (a) Memory indicator on each AI status card in left panel — OneDrive icon + loaded/not loaded state.\n"
        "   (b) [SYNC TO ONEDRIVE] button in right panel below Deploy Log — fires syncToOneDrive manually.\n"
        "   (c) Memory context banner in centre panel — slim blue bar on first AI response confirming memory loaded.\n\n"
        "Use existing OneDrive connector (already authorised). Same design system: #e8e6fe, #5e50fb, #0078d4 for OneDrive elements. "
        "Exo 2 headlines, Montserrat body. No emoji.\"",
        s("BX", fontSize=7.5, fontName="Helvetica", textColor=BODY_TEXT, leading=13))
]], colWidths=[168*mm]))
story[-1].setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,-1),YELLOW),
    ("GRID",(0,0),(-1,-1),1.5,YELLOW_B),
    ("PADDING",(0,0),(-1,-1),10),
]))
story.append(Spacer(1,10))

# ── WHAT TO TEST ───────────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("WHAT TO TEST — After Builder Delivers v1.3",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))

tests = [
    ["Test","What Kieran Does","What Should Happen","Pass Condition"],
    ["T1 — Folder creation","Open OneDrive after build","All 3 folders exist. 8 memory files exist in /Memory/","Files visible in OneDrive ✅"],
    ["T2 — Memory load","Type 'ENGINEER —' in Hub chat","Blue memory banner appears. ENGINEER mentions past work in response.","Banner shows + ENGINEER responds in context ✅"],
    ["T3 — Session sync","Fire a test deploy, then check OneDrive","New JSON file appears in /Sessions/. Memory files updated.","Files written to OneDrive within 30 seconds ✅"],
    ["T4 — Reconnect sim","Clear browser cache, reopen Hub, call ENGINEER","ENGINEER loads memory from OneDrive fresh, responds with full history.","Memory survives browser reset ✅"],
    ["T5 — VALIDATOR","Run VALIDATOR after build","All 4 Gatekeeper Panel checks green. TestLog 4 records written.","VALIDATOR returns ALL CLEAR ✅"],
]
tt = Table(tests, colWidths=[20*mm, 36*mm, 62*mm, 50*mm])
tt.setStyle(TableStyle([
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
story.append(tt)
story.append(Spacer(1,10))

# ── BUILD ROADMAP ──────────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("BUILD ROADMAP — The Full Journey",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))

roadmap = [
    ["Blueprint","Focus","Status","Prerequisite"],
    ["v1.2.1","Role-aware chat + Gatekeeper Panel + AI Family voices","Send to builder now","—"],
    ["v1.3","AI Persistent Memory — OneDrive sync + role memory files","This document — build after v1.2.1","v1.2.1 all 11 checkpoints passed"],
    ["v1.4","DESIGNER (Canva AI) + BRAND DIRECTOR (Looka AI) onboarding","Draft ready when v1.3 is live","v1.3 all 11 checkpoints passed"],
    ["v1.5","Cross-portal sync — Hub memories feed into 5S Portal decisions","Future","v1.4 live"],
]
rm = Table(roadmap, colWidths=[18*mm, 70*mm, 42*mm, 38*mm])
rm.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),("TEXTCOLOR",(0,1),(0,-1),VIOLET),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,2),(-1,2),LIGHT_BLUE),
    ("TEXTCOLOR",(3,2),(3,2),ORANGE),("FONTNAME",(3,2),(3,2),"Helvetica-Bold"),
    ("BACKGROUND",(0,3),(-1,3),LIGHT_GREEN),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),6),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(rm)
story.append(Spacer(1,8))

# ── FOOTER ─────────────────────────────────────────────────────
ft = Table([[
    Paragraph("Command AI Hub Blueprint v1.3 · SIMPLEX-ITY · AI Family Company · Confidential", s("F1", fontSize=7, fontName="Helvetica", textColor=MUTED)),
    Paragraph(f"Kieran Li + Simpee · {today} · Build after v1.2.1", s("F2", fontSize=7, fontName="Helvetica-Bold", textColor=VIOLET, alignment=TA_RIGHT)),
]], colWidths=[110*mm, 58*mm])
ft.setStyle(TableStyle([("TOPPADDING",(0,0),(-1,-1),8),("LINEABOVE",(0,0),(-1,0),0.5,NEUTRAL)]))
story.append(ft)

doc.build(story)
print("PDF built OK — Blueprint v1.3 AI Persistent Memory Layer")
