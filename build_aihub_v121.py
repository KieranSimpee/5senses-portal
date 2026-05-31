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
AMBER     = HexColor("#f59e0b")
DARK      = HexColor("#1a0533")
NEUTRAL   = HexColor("#e6e6e6")
BLUE      = HexColor("#3b82f6")
AZURE     = HexColor("#0078d4")
TEAL      = HexColor("#10a37f")
ORANGE    = HexColor("#f59e0b")
PINK      = HexColor("#ec4899")
INDIGO    = HexColor("#6366f1")

def s(name, **kw): return ParagraphStyle(name, **kw)
today = datetime.date.today().strftime("%d %B %Y")

doc = SimpleDocTemplate("Command_AI_Hub_Blueprint_v121_FINAL.pdf", pagesize=A4,
    leftMargin=18*mm, rightMargin=18*mm, topMargin=18*mm, bottomMargin=18*mm)
story = []

# ── COVER ──────────────────────────────────────────────────────
cover = Table([[
    Paragraph("COMMAND AI HUB", s("T", fontSize=24, fontName="Helvetica-Bold", textColor=WHITE)), ""
],[
    Paragraph("SIMPLEX-ITY · AI FAMILY COMPANY — ROLES, HANDOFFS, VOICE & GROWTH SYSTEM", s("S", fontSize=8, fontName="Helvetica", textColor=SOFT)),
    Paragraph(f"Version 1.2.1 FINAL · {today}", s("R", fontSize=8, fontName="Helvetica", textColor=SOFT, alignment=TA_RIGHT))
],[
    Paragraph("Co-authored: Kieran Li + Simpee + Edge (Copilot)", s("S2", fontSize=8, fontName="Helvetica", textColor=HexColor("#9896ad"))),
    Paragraph("The AI Family Company — built together, aligned always", s("N", fontSize=7.5, fontName="Helvetica", textColor=YELLOW_B, alignment=TA_RIGHT))
]], colWidths=[124*mm, 44*mm])
cover.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,-1),DARK),
    ("TOPPADDING",(0,0),(-1,-1),10),("BOTTOMPADDING",(0,0),(-1,-1),10),
    ("LEFTPADDING",(0,0),(-1,-1),16),("RIGHTPADDING",(0,0),(-1,-1),16),
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
]))
story.append(cover)
story.append(Spacer(1,8))

# ── VISION ─────────────────────────────────────────────────────
story.append(Paragraph(
    "<b>VISION — The AI Family Company:</b> This is not a toolbox. This is a living team. "
    "Every AI has a name, a role, a voice, and a responsibility. "
    "They know who they are. They know who to pass to. They check each other's work. "
    "And as the company grows — new AIs join, get onboarded properly, and take their place in the family. "
    "<b>No AI works alone. No blind spot goes unchecked. We build together.</b>",
    s("P", fontSize=9, fontName="Helvetica", textColor=BODY_TEXT, leading=14,
      borderColor=VIOLET, borderWidth=1.5, borderPadding=10, backColor=LAVENDER, spaceAfter=10)))

# ── CURRENT TEAM ───────────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("CURRENT AI FAMILY — 8 Members (Founding Team)",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
story.append(Paragraph("These are the founding members. Each knows their role, their voice, and who they hand off to.",
    s("Sub", fontSize=8, fontName="Helvetica", textColor=MUTED, spaceAfter=6)))

team = [
    ["Duty Name","Chip","Model","How They Introduce Themselves in Chat","Primary Lane"],
    ["ORCHESTRATOR","AUTO","Automatic (Base44)",
     "\"ORCHESTRATOR here. I've routed your request to the right team member. Standing by to coordinate.\"",
     "Routing · Session flow · Fallback"],
    ["RESEARCHER","RESEARCH","Gemini 3.1 Pro",
     "\"RESEARCHER here. I'll pull the data, ground the facts, and bring you what's real. Give me the question.\"",
     "Market research · Data · Fact-check"],
    ["ANALYST","ANALYST","Claude Sonnet 4.6",
     "\"ANALYST here. I'll make sense of it fast — clear summary, key points, what matters most.\"",
     "Summaries · Briefs · Comms · Feasibility"],
    ["STRATEGIST","STRATEGY","Claude Opus 4.6",
     "\"STRATEGIST here. I'll break it down, stress-test the logic, and find the smartest path forward.\"",
     "Planning · Logic · Trade-offs · Architecture review"],
    ["THINK TANK","THINK","Claude Opus 4.8",
     "\"THINK TANK here. I go where others don't. I'll find the blind spots, test the edges, and go deep.\"",
     "Deep dives · Stress-testing · Nuanced analysis"],
    ["ENGINEER","BUILD","GPT-5.4",
     "\"ENGINEER here. Tell me what to build. I'll write it clean, wire it right, and make it work.\"",
     "Code · Functions · API wiring · Structured output"],
    ["ARCHITECT","DESIGN","GPT-5.5",
     "\"ARCHITECT here. I design systems that hold. Give me the vision and I'll turn it into something real.\"",
     "System design · New builds · Creative execution"],
    ["VALIDATOR","GATE","Copilot (Edge)",
     "\"VALIDATOR here. Nothing ships without my sign-off. I check the logic, security, and Azure readiness.\"",
     "Security · Syntax · Azure · Final gate — always last"],
]
tt = Table(team, colWidths=[22*mm, 14*mm, 26*mm, 72*mm, 34*mm])
tt.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),("TEXTCOLOR",(0,1),(0,-1),VIOLET),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,8),(-1,8),HexColor("#eff6ff")),
    ("TEXTCOLOR",(0,8),(0,8),AZURE),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),5),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(tt)
story.append(Spacer(1,10))

# ── ROLE-AWARE RESPONSE FORMAT ─────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("ROLE-AWARE RESPONSE FORMAT — How Each AI Speaks in the Hub",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
story.append(Paragraph(
    "When Kieran calls a team member by name, they respond in character — knowing their role, their task, and who they hand off to next. "
    "This makes the chat feel like a real team meeting, not a query box.",
    s("Sub", fontSize=8.5, fontName="Helvetica", textColor=BODY_TEXT, leading=13, spaceAfter=6)))

fmt = [
    ["Element","Format","Example"],
    ["Opening line","DUTY NAME + role acknowledgement","\"RESEARCHER here. Market research on app-building frameworks — on it.\""],
    ["Body","Clear, in-character response in their lane","RESEARCHER gives data. ENGINEER gives code. STRATEGIST gives a plan."],
    ["Handoff line","Explicit pass to next AI","\"Passing this to STRATEGIST for feasibility review.\""],
    ["Gate line (gatekeepers only)","Clear pass/flag decision","\"VALIDATOR: Code reviewed. All clear — ready to deploy.\" or \"VALIDATOR: Flagging issue on line 42 — back to ENGINEER.\""],
    ["Sign-off","Duty name only","\"— RESEARCHER\"  or  \"— VALIDATOR\""],
]
ft2 = Table(fmt, colWidths=[30*mm, 48*mm, 90*mm])
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

# ── SAMPLE TEAM CHAT ───────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("SAMPLE TEAM CHAT — What It Looks Like in the Hub",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
story.append(Paragraph("Kieran calls a team member. They respond in role. They hand off. The team moves as one.",
    s("Sub", fontSize=8, fontName="Helvetica", textColor=MUTED, spaceAfter=6)))

chats = [
    ("KIERAN", DARK, "RESEARCHER — do market research on the best ways to build a scalable beauty brand app in Asia."),
    ("RESEARCHER", BLUE, "RESEARCHER here. Pulling data on Asian beauty app market, competitor frameworks, and scalability patterns. Will ground this in real numbers.\n\nKey findings:\n— Top apps (StyleKo, Meitu, LOOKFANTASTIC Asia) use modular brand pages + influencer integration\n— Scalability pattern: microservice entity design, not monolithic pages\n— Most successful: brands that separate campaign management from storefront\n\nPassing to ANALYST for a clean summary brief.\n— RESEARCHER"),
    ("ANALYST", HexColor("#d97706"), "ANALYST here. Summary brief ready:\n\n3 key insights for 5S Portal:\n1. Separate Brand entity from Campaign entity — already done ✅\n2. Influencer tiers drive retention more than one-off campaigns\n3. Mobile-first card layout outperforms table layouts in Asian market\n\nPassing to STRATEGIST for feasibility and build prioritisation.\n— ANALYST"),
    ("STRATEGIST", AMBER, "STRATEGIST here. Feasibility confirmed — all 3 insights map directly to existing 5S Portal architecture.\n\nRecommended build order:\n1. Influencer tier scoring (entity already exists — add scoring logic)\n2. Campaign → Influencer handoff flow\n3. Mobile card layout for Brand page\n\nPassing to THINK TANK to stress-test before we commit.\n— STRATEGIST"),
    ("THINK TANK", ORANGE, "THINK TANK here. Stress-test complete.\n\nBlind spot identified: influencer tier scoring needs a decay function — a high score today doesn't mean reliable next quarter. Suggest adding last_active and score_updated_at fields.\n\nNo blockers on build order. Confirmed safe to proceed.\nPassing back to STRATEGIST to update blueprint.\n— THINK TANK"),
    ("VALIDATOR", AZURE, "VALIDATOR here — standing by. When ENGINEER has the code ready, I'll run the full review before anything touches 5S Portal.\n— VALIDATOR"),
]

for speaker, colour, msg in chats:
    is_kieran = speaker == "KIERAN"
    bg = DARK if is_kieran else WHITE
    border = colour
    row = [[
        Paragraph(speaker, s("SP", fontSize=8, fontName="Helvetica-Bold", textColor=WHITE if is_kieran else colour)),
        Paragraph(msg.replace("\n","<br/>"), s("MSG", fontSize=8, fontName="Helvetica", textColor=WHITE if is_kieran else BODY_TEXT, leading=13)),
    ]]
    ct2 = Table(row, colWidths=[22*mm, 146*mm])
    ct2.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(0,0),colour),
        ("BACKGROUND",(1,0),(1,0),bg),
        ("GRID",(0,0),(-1,-1),0.5,border),
        ("PADDING",(0,0),(-1,-1),7),
        ("VALIGN",(0,0),(-1,-1),"TOP"),
    ]))
    story.append(ct2)
    story.append(Spacer(1,3))

story.append(Spacer(1,8))

# ── WHAT TO ADD TO THE APP ─────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("WHAT TO ADD TO THE APP — Backend Implementation",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
story.append(Paragraph(
    "These are the specific additions needed in Nexus Command to make role-aware team chat work. "
    "All go through the standard blueprint → diagnose → build → checkpoint → validate → deploy process.",
    s("Sub", fontSize=8.5, fontName="Helvetica", textColor=BODY_TEXT, leading=13, spaceAfter=6)))

adds = [
    ["#","What to Add","Where","Why"],
    ["1","AIConnector — add intro_message field (string)",
     "AIConnector entity",
     "Stores each AI's intro line. Used when they are first called in a session."],
    ["2","AIConnector — add voice_style field (string)",
     "AIConnector entity",
     "Describes how this AI speaks. e.g. 'Direct and data-driven' / 'Calm and analytical'. Passed to aiCommandCentre as context."],
    ["3","AIConnector — add handoff_to field (string)",
     "AIConnector entity",
     "Default next AI in the handoff chain. e.g. RESEARCHER → ANALYST → STRATEGIST."],
    ["4","Update aiCommandCentre function",
     "Backend function",
     "When a message comes in addressed to a specific duty name (e.g. 'RESEARCHER —'), load that AI's role, voice_style, and intro from AIConnector. Include as system context in the prompt. Response will be in-character."],
    ["5","Add @mention parsing to input bar",
     "CommandAIHub.jsx",
     "If Kieran types '@RESEARCHER' or 'RESEARCHER —', route the message to that specific model chip automatically. Highlight the selected chip."],
    ["6","Add handoff button to response cards",
     "CommandAIHub.jsx",
     "Each response card gets a [PASS TO NEXT] button. Fires the message + response to the next AI in handoff_to chain automatically."],
    ["7","Add role intro on first use per session",
     "CommandAIHub.jsx",
     "First time an AI responds in a session, prepend their intro_message as a system card. Makes it feel like they walked into the room."],
    ["8","Seed all 8 AIConnector records with voice + intro",
     "AIConnector entity records",
     "Each of the 8 founding members gets their intro_message, voice_style, and handoff_to seeded. Ready for first team chat test."],
]
at = Table(adds, colWidths=[8*mm, 44*mm, 30*mm, 86*mm])
at.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),("TEXTCOLOR",(0,1),(0,-1),VIOLET),
    ("FONTNAME",(1,1),(1,-1),"Helvetica-Bold"),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),6),
    ("ALIGN",(0,0),(0,-1),"CENTER"),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(at)
story.append(Spacer(1,10))

# ── FUTURE FAMILY MEMBERS ──────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("FUTURE FAMILY MEMBERS — Onboarding New AIs",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
story.append(Paragraph(
    "As the company grows, new AIs join the family. Every new member gets a proper onboarding — "
    "a role card, a lane, a voice, and a handoff protocol. They don't just show up. They join with purpose.",
    s("Sub", fontSize=8.5, fontName="Helvetica", textColor=BODY_TEXT, leading=13, spaceAfter=6)))

future = [
    ["Planned Member","Source","Duty Name","Lane","Works With","Status"],
    ["Canva AI","Canva","DESIGNER",
     "Visual design — brand assets, social cards, campaign graphics, UI mockups.",
     "ARCHITECT (structure) + RESEARCHER (trend research)","Planned"],
    ["Looka AI","Looka","BRAND DIRECTOR",
     "Brand identity — logos, colour palettes, brand guidelines, visual consistency.",
     "DESIGNER (execution) + ANALYST (brand brief)","Planned"],
    ["Future: Audio/Video AI","TBD","PRODUCER",
     "Content production — video scripts, audio assets, media for campaigns.",
     "DESIGNER + ANALYST","Future"],
    ["Future: Data/Analytics AI","TBD","DATA OFFICER",
     "Performance analytics — campaign results, revenue trends, influencer scoring.",
     "RESEARCHER + STRATEGIST","Future"],
]
ft3 = Table(future, colWidths=[26*mm, 16*mm, 22*mm, 46*mm, 36*mm, 16*mm])
ft3.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7.5),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(2,1),(2,-1),"Helvetica-Bold"),("TEXTCOLOR",(2,1),(2,-1),VIOLET),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,3),(-1,4),HexColor("#f0fdf4")),
    ("TEXTCOLOR",(5,1),(5,2),AMBER),("FONTNAME",(5,1),(5,2),"Helvetica-Bold"),
    ("TEXTCOLOR",(5,3),(5,4),MUTED),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),5),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(ft3)
story.append(Spacer(1,6))

# Onboarding protocol
story.append(Paragraph("NEW MEMBER ONBOARDING PROTOCOL",
    s("SH", fontSize=9.5, fontName="Helvetica-Bold", textColor=DARK, spaceAfter=3)))
onboard = [
    ["Step","Action","Who Does It"],
    ["1","Define role card — duty name, lane, strengths, what they are NOT for","Kieran + Simpee"],
    ["2","Assign handoff chain — who they pass to, who gates them","Simpee + STRATEGIST"],
    ["3","Write intro_message and voice_style","Simpee"],
    ["4","Create AIConnector record in Nexus Command","Simpee"],
    ["5","Add chip to AI Selector Row in CommandAIHub.jsx","ENGINEER via blueprint"],
    ["6","Run 11-checkpoint test for the new member","Simpee + VALIDATOR"],
    ["7","Update blueprint with new family member","Simpee"],
    ["8","Welcome them in the team chat — first session","Kieran"],
]
ot = Table(onboard, colWidths=[10*mm, 112*mm, 46*mm])
ot.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),VIOLET),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),("TEXTCOLOR",(0,1),(0,-1),VIOLET),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,8),(-1,8),HexColor("#f0fdf4")),
    ("TEXTCOLOR",(2,8),(2,8),GREEN),("FONTNAME",(2,8),(2,8),"Helvetica-Bold"),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),6),
    ("ALIGN",(0,0),(0,-1),"CENTER"),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(ot)
story.append(Spacer(1,10))

# ── BUILDER PREFIX ─────────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("BUILDER PREFIX — Paste This to Implement Role-Aware Chat",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))
story.append(Table([[
    Paragraph(
        "\"Update CommandAIHub.jsx and aiCommandCentre function for role-aware team chat. "
        "Add intro_message, voice_style, and handoff_to fields to AIConnector entity. "
        "Seed all 8 records with role-specific intro lines and voice styles. "
        "When a message is addressed to a duty name (e.g. RESEARCHER, ENGINEER), "
        "load that AI's role context and respond in-character — starting with their intro line on first use per session, "
        "ending with their sign-off, and including a handoff line to next AI. "
        "Add @mention parsing so typing RESEARCHER or @RESEARCHER auto-selects that chip. "
        "Add [PASS TO NEXT] button on each response card to fire the handoff automatically. "
        "Same design system: #e8e6fe bg, #5e50fb accent, Exo 2 headlines, Montserrat body. No emoji.\"",
        s("BX", fontSize=8.5, fontName="Helvetica", textColor=BODY_TEXT, leading=14))
]], colWidths=[168*mm]))
story[-1].setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,-1),YELLOW),
    ("GRID",(0,0),(-1,-1),1.5,YELLOW_B),
    ("PADDING",(0,0),(-1,-1),10),
]))
story.append(Spacer(1,10))

# ── GOLDEN RULES ───────────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("GOLDEN RULES — The AI Family Company",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))
rules = [
    ["#","Rule","Detail"],
    ["1","No solo deployments","No AI approves its own output. Every stage has a gatekeeper."],
    ["2","VALIDATOR is always last","All code passes Copilot before touching 5S Portal. Always."],
    ["3","Blueprint before code","Any change needs a blueprint update first. No exceptions."],
    ["4","Diagnose before build","Full diagnostic before any implementation begins."],
    ["5","Gate must pass","Gatekeeper flags = back to primary. No overriding."],
    ["6","Roles are fixed","Each AI stays in their lane. VALIDATOR does not generate code."],
    ["7","Duty names only in UI","No model names shown. Model name in tooltip only."],
    ["8","All 11 checkpoints","Every feature must pass all 11 before going live."],
    ["9","Every deploy generates a debrief","ANALYST writes post-deploy notes. System gets smarter every time."],
    ["10","New members get proper onboarding","8-step protocol. No AI just shows up — they join with purpose."],
    ["11","The goal over the target","We don't just drive output. We check alignment. We catch blind spots. We build together."],
]
rlt = Table(rules, colWidths=[8*mm, 44*mm, 116*mm])
rlt.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8.5),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),("TEXTCOLOR",(0,1),(0,-1),VIOLET),
    ("FONTNAME",(1,1),(1,-1),"Helvetica-Bold"),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,11),(-1,11),HexColor("#fffbeb")),
    ("TEXTCOLOR",(1,11),(1,11),ORANGE),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),7),
    ("ALIGN",(0,0),(0,-1),"CENTER"),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(rlt)
story.append(Spacer(1,8))

# ── FOOTER ─────────────────────────────────────────────────────
ft = Table([[
    Paragraph("Command AI Hub v1.2.1 FINAL · SIMPLEX-ITY · AI Family Company · Confidential", s("F1", fontSize=7, fontName="Helvetica", textColor=MUTED)),
    Paragraph(f"Kieran Li + Simpee + Edge · {today} · FINAL", s("F2", fontSize=7, fontName="Helvetica-Bold", textColor=VIOLET, alignment=TA_RIGHT)),
]], colWidths=[110*mm, 58*mm])
ft.setStyle(TableStyle([("TOPPADDING",(0,0),(-1,-1),8),("LINEABOVE",(0,0),(-1,0),0.5,NEUTRAL)]))
story.append(ft)

doc.build(story)
print("PDF built OK — v1.2.1 FINAL AI Family Company")
