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
GREEN     = HexColor("#22c55e")
RED       = HexColor("#ef4444")
AMBER     = HexColor("#f59e0b")
DARK      = HexColor("#1a0533")
NEUTRAL   = HexColor("#e6e6e6")
BLUE      = HexColor("#3b82f6")
AZURE     = HexColor("#0078d4")
GOOGLE    = HexColor("#4285f4")
ANTHROPIC = HexColor("#d97706")
OPENAI    = HexColor("#10a37f")
ORANGE    = HexColor("#f59e0b")
YELLOW    = HexColor("#fffbeb")

def s(name, **kw): return ParagraphStyle(name, **kw)
today = datetime.date.today().strftime("%d %B %Y")

doc = SimpleDocTemplate("Command_AI_Hub_Blueprint_v1.2.1_FINAL.pdf", pagesize=A4,
    leftMargin=18*mm, rightMargin=18*mm, topMargin=18*mm, bottomMargin=18*mm)
story = []

# ── COVER ──────────────────────────────────────────────────────
cover = Table([[
    Paragraph("COMMAND AI HUB", s("T", fontSize=24, fontName="Helvetica-Bold", textColor=WHITE)), ""
],[
    Paragraph("SIMPLEX-ITY · AI TEAM ROLES, RESPONSIBILITIES & GATEKEEPER SYSTEM", s("S", fontSize=8, fontName="Helvetica", textColor=SOFT)),
    Paragraph(f"Version 1.2.1 FINAL · {today}", s("R", fontSize=8, fontName="Helvetica", textColor=SOFT, alignment=TA_RIGHT))
],[
    Paragraph("Co-authored: Kieran Li + Simpee + Edge (Copilot)", s("S2", fontSize=8, fontName="Helvetica", textColor=HexColor("#9896ad"))),
    Paragraph("Final: Roles + Gatekeeper System aligned", s("N", fontSize=7.5, fontName="Helvetica", textColor=YELLOW_B, alignment=TA_RIGHT))
]], colWidths=[124*mm, 44*mm])
cover.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,-1),DARK),
    ("TOPPADDING",(0,0),(-1,-1),10),("BOTTOMPADDING",(0,0),(-1,-1),10),
    ("LEFTPADDING",(0,0),(-1,-1),16),("RIGHTPADDING",(0,0),(-1,-1),16),
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
]))
story.append(cover)
story.append(Spacer(1,8))

# ── PHILOSOPHY ─────────────────────────────────────────────────
story.append(Paragraph(
    "<b>PHILOSOPHY:</b> Each AI has a defined role and duty name — no technical model names in the UI. "
    "No AI works alone on anything critical. Every stage has at least two AIs reviewing before output moves forward. "
    "The VALIDATOR (Copilot) is always the final gate. Nothing deploys without it.",
    s("P", fontSize=9, fontName="Helvetica", textColor=BODY_TEXT, leading=14,
      borderColor=VIOLET, borderWidth=1.5, borderPadding=10, backColor=LAVENDER, spaceAfter=10)))

# ── THE 8-PERSON AI TEAM ───────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("THE AI TEAM — 8 Roles, 8 Duties",
    s("H", fontSize=12, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
story.append(Paragraph(
    "Duty names are used everywhere in the Hub UI. Model name shown in tooltip only. "
    "Some roles cover multiple departments. Some are single-focus.",
    s("Sub", fontSize=8, fontName="Helvetica", textColor=MUTED, spaceAfter=6)))

team = [
    ["Duty Name","Chip","Model","Provider","Colour","Core Strengths","Primary Departments"],
    ["ORCHESTRATOR","AUTO","Automatic","Base44","#5e50fb",
     "Auto-routes to best model per task. Handles fallback if a model is offline.",
     "Routing · Fallback · Session management"],
    ["RESEARCHER","RESEARCH","Gemini 3.1 Pro","Google","#4285f4",
     "Long context, web grounding, deep information retrieval, fact-checking.",
     "Research · Fact-check · Context gathering"],
    ["ANALYST","ANALYST","Claude Sonnet 4.6","Anthropic","#d97706",
     "Fast writing, balanced reasoning, quick drafts, summaries, lightweight analysis.",
     "Drafting · Summarising · Quick analysis · Comms"],
    ["STRATEGIST","STRATEGY","Claude Opus 4.6","Anthropic","#d97706",
     "Advanced reasoning, complex logic, multi-step problem solving, trade-off evaluation.",
     "Strategy · Logic · Planning · Problem-solving"],
    ["THINK TANK","THINK","Claude Opus 4.8","Anthropic","#f59e0b",
     "Frontier Anthropic — deep exploration, nuanced analysis, most capable reasoning.",
     "Deep dives · Nuanced analysis · Frontier reasoning"],
    ["ENGINEER","BUILD","GPT-5.4","OpenAI","#10a37f",
     "Code generation, structured output, API wiring, function writing, clean implementation.",
     "Coding · Structured workflows · Backend functions"],
    ["ARCHITECT","DESIGN","GPT-5.5","OpenAI","#10a37f",
     "Creative builds, combines design + execution, brainstorming + frontier implementation.",
     "System design · New builds · Creative execution"],
    ["VALIDATOR","GATE","Copilot (Edge)","Microsoft","#0078d4",
     "Quality review, security check, Azure readiness, syntax + logic validation. External only.",
     "Validation · Security · Azure · Final gate"],
]

tt = Table(team, colWidths=[22*mm, 14*mm, 28*mm, 18*mm, 12*mm, 42*mm, 32*mm])
tt.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,8),(-1,8),HexColor("#eff6ff")),
    ("FONTNAME",(0,8),(0,8),"Helvetica-Bold"),("TEXTCOLOR",(0,8),(0,8),AZURE),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),5),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(tt)
story.append(Spacer(1,10))

# ── TWO-MODEL COMPARISON TABLE ─────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("NAMING COMPARISON — Edge vs Simpee vs Final Agreed",
    s("H", fontSize=12, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
story.append(Paragraph("All three aligned. Final column is what gets implemented in the Hub.",
    s("Sub", fontSize=8, fontName="Helvetica", textColor=MUTED, spaceAfter=6)))

compare = [
    ["Model","Edge Suggested","Simpee Suggested","FINAL AGREED","Why"],
    ["Automatic","Orchestrator","Director","ORCHESTRATOR","Edge — more neutral, describes routing function"],
    ["Gemini 3.1 Pro","Researcher","Researcher","RESEARCHER","Both agreed — perfect fit"],
    ["Claude Sonnet 4.6","Analyst","Writer","ANALYST","Edge — captures both writing + analysis speed"],
    ["Claude Opus 4.6","Strategist","Strategist","STRATEGIST","Both agreed — perfect fit"],
    ["Claude Opus 4.8","Think Tank","Architect","THINK TANK","Edge — Opus 4.8 is exploration, not just design"],
    ["GPT-5.4","Engineer","Builder","ENGINEER","Edge — cleaner for code-focused role"],
    ["GPT-5.5","Architect","Innovator","ARCHITECT","Edge — GPT-5.5 combines design + execution"],
    ["Copilot (Edge)","Validator","Guardian","VALIDATOR","Edge — Guardian sounds blocking; Validator is collaborative"],
]
ct = Table(compare, colWidths=[28*mm, 26*mm, 26*mm, 26*mm, 62*mm])
ct.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7.5),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("FONTNAME",(3,1),(3,-1),"Helvetica-Bold"),("TEXTCOLOR",(3,1),(3,-1),VIOLET),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),6),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(ct)
story.append(Spacer(1,10))

# ── GATEKEEPER SYSTEM ──────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("THE GATEKEEPER SYSTEM — Joint AI Review at Every Stage",
    s("H", fontSize=12, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
story.append(Paragraph(
    "No AI approves its own work. Every stage: primary AI produces → gatekeeper reviews → both agree → proceed. "
    "If gatekeeper flags → back to primary → re-review. VALIDATOR is always the final gate. No exceptions.",
    s("Sub", fontSize=8.5, fontName="Helvetica", textColor=BODY_TEXT, leading=13, spaceAfter=6)))

gates = [
    ["Stage","Task","Primary AI","Gatekeeper","Gatekeeper Checks","Pass Condition"],
    ["1 — Research","Gather context, data, references","RESEARCHER","STRATEGIST","Complete? Relevant? Any gaps?","Strategist confirms sufficient to proceed"],
    ["2 — Strategy","Plan, architecture, options","STRATEGIST","THINK TANK","Logical? Edge cases? Scalable?","Think Tank approves before build"],
    ["3 — Design","Entity schemas, data flows","ARCHITECT","ENGINEER","Buildable? Schemas correct? Gaps?","Engineer confirms implementable"],
    ["4 — Build","JSX, functions, API wiring","ENGINEER","STRATEGIST","Matches plan? Logic errors? Missing cases?","Strategist confirms matches design"],
    ["5 — Analysis","Quick drafts, summaries, comms","ANALYST","ORCHESTRATOR","Tone? Appropriate to send? Sensitive content?","Orchestrator approves before external send"],
    ["6 — Deep Exploration","Complex problems, new ideas","THINK TANK","ARCHITECT","Feasible? Aligns with 5S goals? Priority?","Architect scores feasibility before blueprint"],
    ["7 — Final Deploy","ANY code to live 5S Portal","ENGINEER","VALIDATOR","Syntax, logic, security, Azure readiness","VALIDATOR must return green. Always."],
]
gt = Table(gates, colWidths=[22*mm, 28*mm, 22*mm, 22*mm, 46*mm, 28*mm])
gt.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,7),(-1,7),HexColor("#fff0f0")),
    ("FONTNAME",(0,7),(-1,7),"Helvetica-Bold"),
    ("TEXTCOLOR",(4,7),(5,7),RED),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),5),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(gt)
story.append(Spacer(1,10))

# ── WORKFLOW ───────────────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("WORKFLOW — Idea to Deployed Feature",
    s("H", fontSize=12, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=6)))

flow_rows = [[
    Paragraph("KIERAN\nInput", s("F", fontSize=7.5, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER, leading=11)),
    Paragraph(">", s("AR", fontSize=12, fontName="Helvetica-Bold", textColor=VIOLET, alignment=TA_CENTER)),
    Paragraph("ORCHESTRATOR\nRoutes", s("F", fontSize=7.5, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER, leading=11)),
    Paragraph(">", s("AR", fontSize=12, fontName="Helvetica-Bold", textColor=VIOLET, alignment=TA_CENTER)),
    Paragraph("RESEARCHER\n+ STRATEGIST\ngate", s("F", fontSize=7, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER, leading=10)),
    Paragraph(">", s("AR", fontSize=12, fontName="Helvetica-Bold", textColor=VIOLET, alignment=TA_CENTER)),
    Paragraph("ARCHITECT\n+ ENGINEER\ngate", s("F", fontSize=7, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER, leading=10)),
    Paragraph(">", s("AR", fontSize=12, fontName="Helvetica-Bold", textColor=VIOLET, alignment=TA_CENTER)),
    Paragraph("VALIDATOR\nFinal gate", s("F", fontSize=7.5, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER, leading=11)),
    Paragraph(">", s("AR", fontSize=12, fontName="Helvetica-Bold", textColor=VIOLET, alignment=TA_CENTER)),
    Paragraph("LIVE\n5S Portal", s("F", fontSize=7.5, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER, leading=11)),
]]
flow_t = Table(flow_rows, colWidths=[16*mm, 6*mm, 22*mm, 6*mm, 24*mm, 6*mm, 24*mm, 6*mm, 20*mm, 6*mm, 16*mm])
flow_t.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(0,0),DARK),
    ("BACKGROUND",(2,0),(2,0),VIOLET),
    ("BACKGROUND",(4,0),(4,0),HexColor("#3730a3")),
    ("BACKGROUND",(6,0),(6,0),HexColor("#7c3aed")),
    ("BACKGROUND",(8,0),(8,0),AZURE),
    ("BACKGROUND",(10,0),(10,0),GREEN),
    ("TEXTCOLOR",(0,0),(0,0),WHITE),("TEXTCOLOR",(2,0),(2,0),WHITE),
    ("TEXTCOLOR",(4,0),(4,0),WHITE),("TEXTCOLOR",(6,0),(6,0),WHITE),
    ("TEXTCOLOR",(8,0),(8,0),WHITE),("TEXTCOLOR",(10,0),(10,0),WHITE),
    ("TEXTCOLOR",(1,0),(1,0),VIOLET),("TEXTCOLOR",(3,0),(3,0),VIOLET),
    ("TEXTCOLOR",(5,0),(5,0),VIOLET),("TEXTCOLOR",(7,0),(7,0),VIOLET),
    ("TEXTCOLOR",(9,0),(9,0),VIOLET),
    ("ALIGN",(0,0),(-1,-1),"CENTER"),("VALIGN",(0,0),(-1,-1),"MIDDLE"),
    ("PADDING",(0,0),(-1,-1),8),
]))
story.append(flow_t)
story.append(Spacer(1,5))
story.append(Paragraph(
    "At each gate: primary AI produces output → gatekeeper reviews → both agree → proceed. "
    "Disagreement = back to primary. No skipping any gate.",
    s("Note", fontSize=8, fontName="Helvetica", textColor=MUTED, leading=13, spaceAfter=10)))

# ── DEPARTMENTS PER ROLE ───────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("DEPARTMENTS — Who Covers What",
    s("H", fontSize=12, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
story.append(Paragraph(
    "Some AIs cover multiple departments. This is intentional — the strongest model handles each area. "
    "Overlap is a feature, not a bug — it enables cross-checking.",
    s("Sub", fontSize=8, fontName="Helvetica", textColor=MUTED, spaceAfter=6)))

depts = [
    ["Department","Primary AI","Support AI","Notes"],
    ["Research & Fact-Check","RESEARCHER","THINK TANK","Researcher gathers, Think Tank validates depth"],
    ["Strategy & Planning","STRATEGIST","THINK TANK","Strategist plans, Think Tank stress-tests"],
    ["System Design","ARCHITECT","STRATEGIST","Architect designs schema, Strategist checks logic"],
    ["Code & Engineering","ENGINEER","ARCHITECT","Engineer builds, Architect reviews structure"],
    ["Writing & Comms","ANALYST","ORCHESTRATOR","Analyst drafts, Orchestrator approves before send"],
    ["Deep Analysis","THINK TANK","STRATEGIST","Think Tank explores, Strategist grounds the output"],
    ["New Feature Ideas","ARCHITECT","THINK TANK","Architect designs, Think Tank stress-tests ideas"],
    ["Routing & Fallback","ORCHESTRATOR","—","Solo role — manages flow, no gatekeeper needed"],
    ["Security & Validation","VALIDATOR","—","Solo final gate — always last, always required"],
]
dt = Table(depts, colWidths=[36*mm, 28*mm, 28*mm, 76*mm])
dt.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(1,1),(2,-1),"Helvetica-Bold"),
    ("TEXTCOLOR",(1,1),(1,-1),VIOLET),
    ("TEXTCOLOR",(2,1),(2,-1),MUTED),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,9),(-1,9),HexColor("#eff6ff")),
    ("TEXTCOLOR",(1,9),(1,9),AZURE),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),6),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(dt)
story.append(Spacer(1,10))

# ── GOLDEN RULES ───────────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("GOLDEN RULES — Non-Negotiable",
    s("H", fontSize=12, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))
rules = [
    ["#","Rule","Detail"],
    ["1","No solo deployments","No single AI approves and deploys its own output. Every critical output has a gatekeeper."],
    ["2","VALIDATOR is always last","Copilot reviews ALL code before any deploy to 5S Portal. Cannot be bypassed. Ever."],
    ["3","Blueprint before code","Any change to Hub or 5S Portal needs a blueprint update before a single line is written."],
    ["4","Diagnose before build","Simpee runs a full diagnostic on current state before any implementation begins."],
    ["5","Gate must pass","If gatekeeper flags an issue, output goes back to primary AI. No overriding the gate."],
    ["6","Roles are fixed","Each AI stays in its lane. VALIDATOR does not generate code. ENGINEER does not do final validation."],
    ["7","Duty names only in UI","No technical model names shown in the Hub. Duty names only. Model name in tooltip."],
    ["8","All 11 checkpoints","Every feature must pass all 11 checkpoints before going live in 5S Portal."],
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
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),7),
    ("ALIGN",(0,0),(0,-1),"CENTER"),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(rlt)
story.append(Spacer(1,8))

# ── FOOTER ─────────────────────────────────────────────────────
ft = Table([[
    Paragraph("Command AI Hub v1.2.1 FINAL · SIMPLEX-ITY · Confidential", s("F1", fontSize=7, fontName="Helvetica", textColor=MUTED)),
    Paragraph(f"Kieran Li + Simpee + Edge · {today} · FINAL", s("F2", fontSize=7, fontName="Helvetica-Bold", textColor=VIOLET, alignment=TA_RIGHT)),
]], colWidths=[100*mm, 68*mm])
ft.setStyle(TableStyle([("TOPPADDING",(0,0),(-1,-1),8),("LINEABOVE",(0,0),(-1,0),0.5,NEUTRAL)]))
story.append(ft)

doc.build(story)
print("PDF built OK — v1.2.1 FINAL with aligned roles")
