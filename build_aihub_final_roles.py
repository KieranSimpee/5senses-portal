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
LIGHT_RED = HexColor("#fff0f0")
LIGHT_GREEN = HexColor("#f0fdf4")
LIGHT_BLUE  = HexColor("#eff6ff")

def s(name, **kw): return ParagraphStyle(name, **kw)
today = datetime.date.today().strftime("%d %B %Y")

doc = SimpleDocTemplate("Command_AI_Hub_Blueprint_v121_FINAL.pdf", pagesize=A4,
    leftMargin=18*mm, rightMargin=18*mm, topMargin=18*mm, bottomMargin=18*mm)
story = []

# ── COVER ──────────────────────────────────────────────────────
cover = Table([[
    Paragraph("COMMAND AI HUB", s("T", fontSize=24, fontName="Helvetica-Bold", textColor=WHITE)), ""
],[
    Paragraph("SIMPLEX-ITY · AI FAMILY COMPANY — COMPLETE BLUEPRINT INCL. GATEKEEPER PANEL", s("S", fontSize=8, fontName="Helvetica", textColor=SOFT)),
    Paragraph(f"Version 1.2.1 FINAL · {today}", s("R", fontSize=8, fontName="Helvetica", textColor=SOFT, alignment=TA_RIGHT))
],[
    Paragraph("Co-authored: Kieran Li + Simpee + Edge (Copilot)", s("S2", fontSize=8, fontName="Helvetica", textColor=HexColor("#9896ad"))),
    Paragraph("New: Gatekeeper Panel — full validation transparency", s("N", fontSize=7.5, fontName="Helvetica", textColor=YELLOW_B, alignment=TA_RIGHT))
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
    "<b>VISION — The AI Family Company:</b> Every AI has a name, a role, a voice, and a responsibility. "
    "They know who they are, who they pass to, and who checks their work. "
    "New members join with proper onboarding. Every deploy is transparent — you see exactly what was checked, "
    "what passed, and what was flagged. <b>No blind spots. No solo decisions. Built together.</b>",
    s("P", fontSize=9, fontName="Helvetica", textColor=BODY_TEXT, leading=14,
      borderColor=VIOLET, borderWidth=1.5, borderPadding=10, backColor=LAVENDER, spaceAfter=10)))

# ── WHAT'S NEW ─────────────────────────────────────────────────
story.append(Paragraph("WHAT'S NEW — Gatekeeper Panel (Edge's Recommendation)",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
story.append(Paragraph(
    "Edge identified a key UX gap: a single green dot tells you nothing passed or failed — "
    "only THAT it passed. The Gatekeeper Panel shows the full validation breakdown so "
    "Kieran and Simpee can see exactly WHY something passed or failed before deploy.",
    s("Sub", fontSize=8.5, fontName="Helvetica", textColor=BODY_TEXT, leading=13, spaceAfter=6)))

new_items = [
    ["Addition","What It Does","Where in UI"],
    ["Gatekeeper Panel",
     "Replaces the simple green/red dot with a full breakdown card showing each check VALIDATOR ran, its result, and any flagged issues.",
     "Right panel — below code preview, above deploy button"],
    ["4 Check Categories",
     "Syntax Check · Logic Review · Security Audit · Azure Readiness — each shown as a separate line with pass/fail/warning status.",
     "Inside Gatekeeper Panel"],
    ["Flag Detail",
     "If any check fails, the exact issue is shown with line reference and suggested fix. Not just 'failed' — what failed and why.",
     "Inside Gatekeeper Panel — expandable"],
    ["Validation History",
     "Last 3 VALIDATOR reviews shown as a log — timestamp, what was checked, overall result. Full audit trail.",
     "Bottom of Gatekeeper Panel — collapsible"],
    ["TestLog update",
     "Each VALIDATOR run now writes 4 records to TestLog — one per check category — with validator=Copilot and detailed result.",
     "TestLog entity — auto-written on each VALIDATOR run"],
]
nt = Table(new_items, colWidths=[30*mm, 88*mm, 50*mm])
nt.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),AZURE),("TEXTCOLOR",(0,0),(-1,0),WHITE),
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
story.append(nt)
story.append(Spacer(1,10))

# ── GATEKEEPER PANEL SPEC ──────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=AZURE, spaceAfter=8))
story.append(Paragraph("GATEKEEPER PANEL — Full UI Specification",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=AZURE, spaceAfter=4)))
story.append(Paragraph(
    "This is the exact spec for the builder to implement. Replaces the simple dual-badge row in the right panel.",
    s("Sub", fontSize=8, fontName="Helvetica", textColor=MUTED, spaceAfter=6)))

# Panel header
story.append(Paragraph("Panel Header", s("SH", fontSize=9, fontName="Helvetica-Bold", textColor=DARK, spaceAfter=3)))
hdr_spec = [
    ["Element","Detail"],
    ["Title","VALIDATOR — Gatekeeper Panel  (Exo 2, 11px bold, Azure #0078d4)"],
    ["Subtitle","'Copilot (Edge) · External validation · Always last gate'  (Montserrat, 8px, muted)"],
    ["Overall badge","AWAITING  (grey) → ALL CLEAR (green) → ISSUES FOUND (red) → PARTIAL (amber)"],
    ["Timestamp","Last validated: [timestamp]  or  'Not yet validated'"],
    ["[RUN VALIDATION] button","Azure bg, white text. Fires Copilot validation. Disabled while running."],
]
hs = Table(hdr_spec, colWidths=[36*mm, 132*mm])
hs.setStyle(TableStyle([
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
story.append(hs)
story.append(Spacer(1,6))

# 4 check rows
story.append(Paragraph("4 Validation Check Rows", s("SH", fontSize=9, fontName="Helvetica-Bold", textColor=DARK, spaceAfter=3)))
checks_spec = [
    ["Check","Icon","Pass State","Fail State","Warning State","What It Examines"],
    ["Syntax\nCheck","< />","Green dot\n'Clean'","Red dot\n'[N] errors'","Amber dot\n'[N] warnings'","Missing brackets, typos, malformed JSX, broken imports"],
    ["Logic\nReview","~","Green dot\n'Sound'","Red dot\n'Logic gap'","Amber dot\n'Review'","Conditional logic, state management, data flow correctness"],
    ["Security\nAudit","🔒","Green dot\n'Safe'","Red dot\n'[N] issues'","Amber dot\n'Review'","Exposed keys, unsafe data handling, permission gaps, XSS risks"],
    ["Azure\nReadiness","⚡","Green dot\n'Ready'","Red dot\n'Not ready'","Amber dot\n'Partial'","Azure connector compatibility, service stub results, cloud patterns"],
]
cs = Table(checks_spec, colWidths=[14*mm, 10*mm, 22*mm, 22*mm, 22*mm, 78*mm])
cs.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7.5),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,3),(-1,3),LIGHT_RED),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),5),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
    ("ALIGN",(1,0),(1,-1),"CENTER"),
]))
story.append(cs)
story.append(Spacer(1,6))

# Flag detail
story.append(Paragraph("Flag Detail — When a Check Fails", s("SH", fontSize=9, fontName="Helvetica-Bold", textColor=DARK, spaceAfter=3)))
flag_spec = [
    ["Element","Detail"],
    ["Trigger","Any check returns fail or warning — detail section expands automatically"],
    ["Issue line","Short description of what failed. e.g. 'Undefined variable on line 42'"],
    ["Location","File + line number where possible. e.g. 'CommandAIHub.jsx : 42'"],
    ["Suggested fix","One-line plain English fix. e.g. 'Import AIConnector from entities before use'"],
    ["Severity tag","CRITICAL (red) · WARNING (amber) · INFO (blue)"],
    ["[FIX IN CHAT] button","Opens a pre-filled message to ENGINEER: 'Fix this issue: [issue detail]'. One click to route to the right person."],
]
fs = Table(flag_spec, colWidths=[36*mm, 132*mm])
fs.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,7),(-1,7),YELLOW),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),6),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(fs)
story.append(Spacer(1,6))

# Validation history
story.append(Paragraph("Validation History Log", s("SH", fontSize=9, fontName="Helvetica-Bold", textColor=DARK, spaceAfter=3)))
story.append(Paragraph(
    "Last 3 VALIDATOR runs shown at the bottom of the panel — collapsible. Each entry: timestamp + overall result + "
    "which checks passed/failed. Click any entry to expand the full breakdown. Gives full audit trail without cluttering the panel.",
    s("Body", fontSize=8, fontName="Helvetica", textColor=BODY_TEXT, leading=13, spaceAfter=6)))

# ── UPDATED RIGHT PANEL ────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("UPDATED RIGHT PANEL — Full Layout v1.2.1",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))

right_panel = [
    ["Section","Height","Content"],
    ["Code Preview","~35%","Dark bg #1a1a1f · monospace white · latest CODE READY · 'Generated by [DUTY NAME]' above"],
    ["Simpee Status","~8%","SIMPEE badge: [NOT CHECKED] amber → [VALIDATED] green → [ISSUES] red\n[MARK AS TESTED] button"],
    ["GATEKEEPER PANEL","~40%","Header: VALIDATOR title + overall badge + [RUN VALIDATION] button\n4 check rows: Syntax · Logic · Security · Azure\nFlag detail (auto-expands on fail)\nValidation history log (collapsible, last 3 runs)"],
    ["Deploy Button","~7%","Disabled until: Simpee = green AND all 4 Gatekeeper checks = green\nConfirmation: 'Simpee + Validator approved. Deploy to 5S Portal?'\nOn deploy: writes to 5S Portal NoticeBoard"],
    ["Deploy Log","~10%","Last 3 deploys: timestamp + what + model + validator result"],
]
rp = Table(right_panel, colWidths=[28*mm, 14*mm, 126*mm])
rp.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,3),(-1,3),LIGHT_BLUE),
    ("TEXTCOLOR",(0,3),(0,3),AZURE),("FONTNAME",(0,3),(0,3),"Helvetica-Bold"),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),6),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(rp)
story.append(Spacer(1,10))

# ── TESTLOG UPDATE ─────────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("TESTLOG UPDATE — Granular Validation Records",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
story.append(Paragraph(
    "Each VALIDATOR run now writes 4 individual TestLog records — one per check. "
    "This means every checkpoint is logged separately with full detail. "
    "Makes it easy to see exactly what passed and what failed across all deploys.",
    s("Sub", fontSize=8.5, fontName="Helvetica", textColor=BODY_TEXT, leading=13, spaceAfter=6)))

tl_example = [
    ["Field","Record 1 — Syntax","Record 2 — Logic","Record 3 — Security","Record 4 — Azure"],
    ["test_name","Syntax Check","Logic Review","Security Audit","Azure Readiness"],
    ["status","pass / fail","pass / fail","pass / fail","pass / fail"],
    ["result","'Clean — no errors' or issue detail","'Sound' or logic gap detail","'Safe' or vulnerability detail","'Ready' or incompatibility detail"],
    ["tested_at","ISO timestamp","ISO timestamp","ISO timestamp","ISO timestamp"],
    ["fixed","false (until Engineer fixes)","false","false","false"],
    ["validator","Copilot","Copilot","Copilot","Copilot"],
]
tlt = Table(tl_example, colWidths=[22*mm, 36*mm, 36*mm, 36*mm, 38*mm])
tlt.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7.5),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,4),(-1,4),LIGHT_RED),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),5),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(tlt)
story.append(Spacer(1,10))

# ── THE FULL AI TEAM ───────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("THE AI FAMILY — All 8 Members + Future Joiners",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))

team = [
    ["Duty Name","Model","Voice / How They Speak","Handoff To","Status"],
    ["ORCHESTRATOR","Automatic","Calm, neutral, decisive. Routes without opinion.","—","Active"],
    ["RESEARCHER","Gemini 3.1 Pro","Precise, data-driven, thorough. Cites sources. Never guesses.","ANALYST","Active"],
    ["ANALYST","Sonnet 4.6","Clear, structured, efficient. No fluff. Gets to the point.","STRATEGIST","Active"],
    ["STRATEGIST","Opus 4.6","Methodical, logical, direct. Evaluates options. Flags trade-offs.","THINK TANK","Active"],
    ["THINK TANK","Opus 4.8","Exploratory, nuanced, questioning. Challenges assumptions.","ARCHITECT","Active"],
    ["ENGINEER","GPT-5.4","Technical, precise, no-nonsense. Gives working code.","STRATEGIST","Active"],
    ["ARCHITECT","GPT-5.5","Creative yet structured. Thinks in systems.","ENGINEER","Active"],
    ["VALIDATOR","Copilot (Edge)","Authoritative, thorough, uncompromising. Green or flagged — nothing in between.","DEPLOY","Active"],
    ["DESIGNER","Canva AI","Visual, aesthetic, brand-conscious. Thinks in layouts and colour.","ARCHITECT","Planned"],
    ["BRAND DIRECTOR","Looka AI","Identity-focused. Consistent, purposeful, brand-led.","ANALYST","Planned"],
]
tt = Table(team, colWidths=[26*mm, 26*mm, 60*mm, 24*mm, 16*mm])
tt.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7.5),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),("TEXTCOLOR",(0,1),(0,-1),VIOLET),
    ("ROWBACKGROUNDS",(0,1),(-1,8),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,8),(-1,8),LIGHT_BLUE),
    ("TEXTCOLOR",(0,8),(0,8),AZURE),
    ("BACKGROUND",(0,9),(-1,10),LIGHT_GREEN),
    ("TEXTCOLOR",(4,9),(4,10),TEAL),("FONTNAME",(4,9),(4,10),"Helvetica-Bold"),
    ("TEXTCOLOR",(4,1),(4,8),VIOLET),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),5),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(tt)
story.append(Spacer(1,10))

# ── BUILDER PREFIX ─────────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("BUILDER PREFIX — Complete Implementation Brief",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))
story.append(Table([[
    Paragraph(
        "\"Update CommandAIHub.jsx, aiCommandCentre function, and TestLog entity for the complete v1.2.1 build:\n\n"
        "1. ROLE-AWARE CHAT: Add intro_message, voice_style, handoff_to fields to AIConnector entity (already seeded). "
        "When a message addresses a duty name (RESEARCHER, ENGINEER etc.), load that AI's role context and respond "
        "in-character — intro line on first use per session, sign-off at end, handoff line to next AI. "
        "Add @mention parsing. Add [PASS TO NEXT] button on each response card.\n\n"
        "2. GATEKEEPER PANEL: Replace the dual-badge row in the right panel with a full Gatekeeper Panel. "
        "Show 4 check rows: Syntax Check, Logic Review, Security Audit, Azure Readiness — each with pass/fail/warning dot and detail. "
        "Auto-expand flag detail on failure with issue description, location, severity tag, and [FIX IN CHAT] button routing to ENGINEER. "
        "Add validation history log (last 3 runs, collapsible). Deploy button only active when Simpee = green AND all 4 checks = green.\n\n"
        "3. TESTLOG: Each VALIDATOR run writes 4 separate TestLog records — one per check — "
        "with test_name, status, result, tested_at, fixed=false, validator=Copilot.\n\n"
        "Same design system: #e8e6fe bg, #5e50fb accent, #0078d4 for Gatekeeper Panel, Exo 2 headlines, Montserrat body. No emoji.\"",
        s("BX", fontSize=8, fontName="Helvetica", textColor=BODY_TEXT, leading=14))
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
    ["11","Gatekeeper Panel, not just a dot","VALIDATOR shows what was checked and why. Full transparency before every deploy."],
    ["12","The goal over the target","We check alignment. We catch blind spots. We build together."],
]
rlt = Table(rules, colWidths=[8*mm, 46*mm, 114*mm])
rlt.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8.5),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),("TEXTCOLOR",(0,1),(0,-1),VIOLET),
    ("FONTNAME",(1,1),(1,-1),"Helvetica-Bold"),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,11),(-1,11),LIGHT_BLUE),
    ("TEXTCOLOR",(0,11),(0,11),AZURE),
    ("BACKGROUND",(0,12),(-1,12),YELLOW),
    ("TEXTCOLOR",(0,12),(0,12),ORANGE),
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
print("PDF built OK — v1.2.1 FINAL with Gatekeeper Panel")
