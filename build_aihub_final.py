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

def s(name, **kw): return ParagraphStyle(name, **kw)
today = datetime.date.today().strftime("%d %B %Y")

doc = SimpleDocTemplate("Command_AI_Hub_Blueprint_v121_FINAL.pdf", pagesize=A4,
    leftMargin=18*mm, rightMargin=18*mm, topMargin=18*mm, bottomMargin=18*mm)
story = []

# ── COVER ──────────────────────────────────────────────────────
cover = Table([[
    Paragraph("COMMAND AI HUB", s("T", fontSize=24, fontName="Helvetica-Bold", textColor=WHITE)), ""
],[
    Paragraph("SIMPLEX-ITY · FUNCTIONAL AI TEAM — ROLES, HANDOFFS & PROBLEM-SOLVING FLOWS", s("S", fontSize=8, fontName="Helvetica", textColor=SOFT)),
    Paragraph(f"Version 1.2.1 FINAL · {today}", s("R", fontSize=8, fontName="Helvetica", textColor=SOFT, alignment=TA_RIGHT))
],[
    Paragraph("Co-authored: Kieran Li + Simpee + Edge (Copilot)", s("S2", fontSize=8, fontName="Helvetica", textColor=HexColor("#9896ad"))),
    Paragraph("Who does what. Who passes to who. How it flows.", s("N", fontSize=7.5, fontName="Helvetica", textColor=YELLOW_B, alignment=TA_RIGHT))
]], colWidths=[124*mm, 44*mm])
cover.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,-1),DARK),
    ("TOPPADDING",(0,0),(-1,-1),10),("BOTTOMPADDING",(0,0),(-1,-1),10),
    ("LEFTPADDING",(0,0),(-1,-1),16),("RIGHTPADDING",(0,0),(-1,-1),16),
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
]))
story.append(cover)
story.append(Spacer(1,8))

# ── THE TEAM AT A GLANCE ───────────────────────────────────────
story.append(Paragraph("THE TEAM AT A GLANCE",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))

team = [
    ["Duty Name","Model","What They Are BEST At","What They Are NOT For"],
    ["ORCHESTRATOR","Automatic","Routing tasks to the right AI. Fallback if a model is offline. Keeps sessions moving.","Deep analysis, code, writing"],
    ["RESEARCHER","Gemini 3.1 Pro","Market research, industry data, competitive analysis, web-grounded facts, long documents.","Writing final output, deploying code"],
    ["ANALYST","Claude Sonnet 4.6","Fast summaries, feasibility notes, drafting briefs, lightweight analysis, comms.","Deep system design, complex code"],
    ["STRATEGIST","Claude Opus 4.6","Complex logic, multi-step reasoning, evaluating options, planning architecture, trade-offs.","First-pass research, final code write"],
    ["THINK TANK","Claude Opus 4.8","Deep exploration, nuanced problem-solving, stress-testing plans, uncovering blind spots.","Routine tasks, quick drafts"],
    ["ENGINEER","GPT-5.4","Writing clean code, backend functions, API wiring, entity logic, structured output.","Strategy, research, deep analysis"],
    ["ARCHITECT","GPT-5.5","New app/feature design, creative builds, combining ideas into implementable systems.","Validation, security review"],
    ["VALIDATOR","Copilot (Edge)","Security review, syntax check, logic audit, Azure readiness. Final gate only.","Generating new code or ideas"],
]
tt = Table(team, colWidths=[24*mm, 28*mm, 72*mm, 44*mm])
tt.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7.5),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,8),(-1,8),HexColor("#eff6ff")),
    ("TEXTCOLOR",(0,8),(0,8),AZURE),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),5),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(tt)
story.append(Spacer(1,10))

# ── REAL SCENARIO FLOWS ────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("REAL SCENARIO FLOWS — Who Does What and Passes to Who",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
story.append(Paragraph(
    "These are practical examples of how the team flows through real tasks. "
    "Every handoff is a gate — receiver must agree before the next stage begins.",
    s("Sub", fontSize=8, fontName="Helvetica", textColor=MUTED, spaceAfter=6)))

# Scenario 1
story.append(Paragraph("SCENARIO 1 — Market Research: How to Build an App",
    s("SH", fontSize=9.5, fontName="Helvetica-Bold", textColor=DARK, spaceBefore=4, spaceAfter=3)))
sc1 = [
    ["Step","Who","What They Do","Passes To","Gate Check"],
    ["1","RESEARCHER","Pulls market data — competitor apps, user needs, industry trends, pricing benchmarks. Grounds everything in real data.","ANALYST","Is the research complete and relevant?"],
    ["2","ANALYST","Summarises the research into a readable brief. Highlights key opportunities and risks. Flags feasibility concerns.","STRATEGIST","Does the summary capture what matters?"],
    ["3","STRATEGIST","Evaluates feasibility. Defines scope, priorities, and build order. Proposes architecture approach.","THINK TANK","Any blind spots? Is the plan stress-tested?"],
    ["4","THINK TANK","Deep-dives on the hardest questions. What could go wrong? What's missing? What's the smartest path?","ARCHITECT","Is the strategic foundation solid enough to design on?"],
    ["5","ARCHITECT","Designs the app structure — pages, entities, functions, user flows. Produces build brief.","ENGINEER","Can this actually be built? Any implementation gaps?"],
    ["6","ENGINEER","Writes the code. Functions, entities, JSX, API wiring.","VALIDATOR","Syntax clean? Logic sound? Security issues?"],
    ["7","VALIDATOR","Reviews all code. Security, logic, Azure readiness. Returns green or flags issues.","DEPLOY","All green = deploy to 5S Portal."],
]
s1t = Table(sc1, colWidths=[8*mm, 22*mm, 56*mm, 22*mm, 60*mm])
s1t.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),VIOLET),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(1,1),(1,-1),"Helvetica-Bold"),("TEXTCOLOR",(1,1),(1,-1),VIOLET),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,7),(-1,7),HexColor("#f0fdf4")),
    ("TEXTCOLOR",(1,7),(1,7),GREEN),("FONTNAME",(1,7),(1,7),"Helvetica-Bold"),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),5),
    ("ALIGN",(0,0),(0,-1),"CENTER"),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(s1t)
story.append(Spacer(1,8))

# Scenario 2
story.append(Paragraph("SCENARIO 2 — New Function Development (e.g. pingAllAI, invoice generator)",
    s("SH", fontSize=9.5, fontName="Helvetica-Bold", textColor=DARK, spaceBefore=4, spaceAfter=3)))
sc2 = [
    ["Step","Who","What They Do","Passes To","Gate Check"],
    ["1","STRATEGIST","Defines what the function needs to do. Inputs, outputs, edge cases, dependencies. Writes the spec.","THINK TANK","Is the spec complete? Any missed cases?"],
    ["2","THINK TANK","Stress-tests the spec. What breaks it? What's the failure mode? Suggests improvements.","ARCHITECT","Is the design safe to build on?"],
    ["3","ARCHITECT","Designs the function structure — data flow, entity writes, error handling, return format.","ENGINEER","Confirms the design is implementable."],
    ["4","ENGINEER","Writes the function code. Clean, tested, documented.","STRATEGIST","Does the code match the spec exactly?"],
    ["5","STRATEGIST","Reviews code against original spec. Confirms logic is correct.","VALIDATOR","Final security + Azure readiness check."],
    ["6","VALIDATOR","Reviews code. Flags any issues. Returns green or sends back with notes.","DEPLOY","All green = function goes live."],
]
s2t = Table(sc2, colWidths=[8*mm, 22*mm, 60*mm, 22*mm, 56*mm])
s2t.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),HexColor("#3730a3")),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(1,1),(1,-1),"Helvetica-Bold"),("TEXTCOLOR",(1,1),(1,-1),VIOLET),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,6),(-1,6),HexColor("#f0fdf4")),
    ("TEXTCOLOR",(1,6),(1,6),GREEN),("FONTNAME",(1,6),(1,6),"Helvetica-Bold"),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),5),
    ("ALIGN",(0,0),(0,-1),"CENTER"),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(s2t)
story.append(Spacer(1,8))

# Scenario 3
story.append(Paragraph("SCENARIO 3 — Error Diagnosis & Problem Solving (e.g. something breaks in production)",
    s("SH", fontSize=9.5, fontName="Helvetica-Bold", textColor=DARK, spaceBefore=4, spaceAfter=3)))
sc3 = [
    ["Step","Who","What They Do","Passes To","Gate Check"],
    ["1","ORCHESTRATOR","Receives the error. Routes to best team for diagnosis based on error type.","ENGINEER","Is routing correct for this error type?"],
    ["2","ENGINEER","Reads the error, traces the code, isolates the root cause. Proposes fix.","STRATEGIST","Is the root cause correctly identified? Is the fix right?"],
    ["3","STRATEGIST","Validates the diagnosis. Checks if fix solves root cause or just the symptom.","THINK TANK","Could this fix break anything else?"],
    ["4","THINK TANK","Checks for downstream impact. Are there related issues? Is this a systemic problem?","ENGINEER","Safe to implement the fix?"],
    ["5","ENGINEER","Applies the fix. Updates code and/or entities.","VALIDATOR","Final check before re-deploying."],
    ["6","VALIDATOR","Reviews the fix. Confirms it's clean and safe.","DEPLOY","Re-deploy to 5S Portal."],
]
s3t = Table(sc3, colWidths=[8*mm, 22*mm, 60*mm, 22*mm, 56*mm])
s3t.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),HexColor("#7c3aed")),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(1,1),(1,-1),"Helvetica-Bold"),("TEXTCOLOR",(1,1),(1,-1),VIOLET),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,6),(-1,6),HexColor("#f0fdf4")),
    ("TEXTCOLOR",(1,6),(1,6),GREEN),("FONTNAME",(1,6),(1,6),"Helvetica-Bold"),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),5),
    ("ALIGN",(0,0),(0,-1),"CENTER"),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(s3t)
story.append(Spacer(1,8))

# Scenario 4
story.append(Paragraph("SCENARIO 4 — Learning & Memory: How Connections Were Built, How to Simplify Going Forward",
    s("SH", fontSize=9.5, fontName="Helvetica-Bold", textColor=DARK, spaceBefore=4, spaceAfter=3)))
sc4 = [
    ["Step","Who","What They Do","Passes To","Gate Check"],
    ["1","ANALYST","After every deploy, writes a plain-English summary of what was built, how it was connected, what worked, what didn't.","STRATEGIST","Is the summary accurate and useful for future reference?"],
    ["2","STRATEGIST","Extracts reusable patterns — if this connection worked, it can be templated for next time. Updates blueprint.","ARCHITECT","Can this pattern be standardised?"],
    ["3","ARCHITECT","Turns proven patterns into reusable templates — entity schemas, function structures, deploy checklists.","ENGINEER","Are the templates correct and clean?"],
    ["4","ENGINEER","Validates templates work in practice. Flags any edge cases.","ORCHESTRATOR","Ready to store in memory/blueprint?"],
    ["5","ORCHESTRATOR","Routes the pattern to Simpee's memory + blueprint store. Available for all future sessions.","ALL","Team awareness — pattern is now part of the system."],
]
s4t = Table(sc4, colWidths=[8*mm, 22*mm, 62*mm, 22*mm, 54*mm])
s4t.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),TEAL),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(1,1),(1,-1),"Helvetica-Bold"),("TEXTCOLOR",(1,1),(1,-1),VIOLET),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,5),(-1,5),HexColor("#f0fdf4")),
    ("TEXTCOLOR",(1,5),(1,5),GREEN),("FONTNAME",(1,5),(1,5),"Helvetica-Bold"),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),5),
    ("ALIGN",(0,0),(0,-1),"CENTER"),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(s4t)
story.append(Spacer(1,8))

# Scenario 5
story.append(Paragraph("SCENARIO 5 — Smooth Deploy with Testing & Simplification Going Forward",
    s("SH", fontSize=9.5, fontName="Helvetica-Bold", textColor=DARK, spaceBefore=4, spaceAfter=3)))
sc5 = [
    ["Step","Who","What They Do","Passes To","Gate Check"],
    ["1","ENGINEER","Writes the full test suite for the new feature. Runs it in Nexus Command staging app.","STRATEGIST","Are all 11 checkpoints covered?"],
    ["2","STRATEGIST","Reviews test results. Identifies any checkpoint gaps. Confirms logic is tested end-to-end.","THINK TANK","Any failure scenarios we haven't tested?"],
    ["3","THINK TANK","Stress-tests edge cases. Simulates failure modes. Confirms the system degrades gracefully.","VALIDATOR","Safe to deploy?"],
    ["4","VALIDATOR","Final code review. Syntax, security, Azure readiness. Either returns green or sends back with notes.","DEPLOY","All 11 green = deploy to 5S Portal."],
    ["5","ANALYST","Post-deploy: writes debrief. What was simplified vs previous version? What can be templated?","STRATEGIST","Update blueprint with learnings."],
    ["6","STRATEGIST","Updates blueprint with simplified patterns. Every deploy makes the next one faster.","ORCHESTRATOR","Store in system memory."],
]
s5t = Table(sc5, colWidths=[8*mm, 22*mm, 62*mm, 22*mm, 54*mm])
s5t.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),AZURE),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(1,1),(1,-1),"Helvetica-Bold"),("TEXTCOLOR",(1,1),(1,-1),VIOLET),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,5),(-1,5),HexColor("#eff6ff")),
    ("BACKGROUND",(0,6),(-1,6),HexColor("#f0fdf4")),
    ("TEXTCOLOR",(1,6),(1,6),GREEN),("FONTNAME",(1,6),(1,6),"Helvetica-Bold"),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),5),
    ("ALIGN",(0,0),(0,-1),"CENTER"),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(s5t)
story.append(Spacer(1,10))

# ── ROLE LOAD SUMMARY ─────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("ROLE LOAD SUMMARY — Who Appears Most in Real Scenarios",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
story.append(Paragraph(
    "Some roles carry more weight across multiple scenarios. This is by design — the best tool for the job gets used most.",
    s("Sub", fontSize=8, fontName="Helvetica", textColor=MUTED, spaceAfter=6)))

load = [
    ["Role","Scenarios Active In","Primary Responsibility Load","Notes"],
    ["ORCHESTRATOR","1, 3, 4, 5","Routing + memory storage","Lighter load — coordinates, doesn't produce"],
    ["RESEARCHER","1","Market research + data gathering","Scenario 1 only — but deep and critical"],
    ["ANALYST","1, 4, 5","Summaries, briefs, post-deploy debriefs","Cross-cutting comms role — appears in learning loops"],
    ["STRATEGIST","1, 2, 3, 4, 5","Spec validation, logic review, blueprint updates","Heaviest load — involved in almost everything"],
    ["THINK TANK","1, 2, 3, 5","Deep dives, stress-testing, failure modes","Critical quality layer — never skipped on complex builds"],
    ["ENGINEER","1, 2, 3, 5","Code writing, test suites, fix implementation","Core builder — all code flows through here"],
    ["ARCHITECT","1, 2, 4","App/function design, template creation","Design-focused — builds the blueprints others implement"],
    ["VALIDATOR","1, 2, 3, 5","Final gate on all deployments","Always last — every scenario ends here before deploy"],
]
lt = Table(load, colWidths=[24*mm, 28*mm, 50*mm, 66*mm])
lt.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,4),(-1,4),HexColor("#fff7ed")),
    ("BACKGROUND",(0,8),(-1,8),HexColor("#eff6ff")),
    ("TEXTCOLOR",(0,4),(0,4),ORANGE),
    ("TEXTCOLOR",(0,8),(0,8),AZURE),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),6),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(lt)
story.append(Spacer(1,10))

# ── GOLDEN RULES ───────────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("GOLDEN RULES — Non-Negotiable",
    s("H", fontSize=11, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))
rules = [
    ["#","Rule","Detail"],
    ["1","No solo deployments","No AI approves its own output. Every critical stage has a gatekeeper."],
    ["2","VALIDATOR is always last","Copilot reviews all code before any deploy. Cannot be skipped."],
    ["3","Blueprint before code","Any change — Hub or 5S Portal — needs blueprint update first."],
    ["4","Diagnose before build","Simpee runs full diagnostic before any implementation begins."],
    ["5","Gate must pass","Gatekeeper flags = back to primary. No overriding."],
    ["6","Roles are fixed","VALIDATOR does not generate code. ENGINEER does not validate security."],
    ["7","Duty names only in UI","No model names shown. Duty names only. Model name in tooltip."],
    ["8","All 11 checkpoints","Every feature must pass all 11 before going live."],
    ["9","Every deploy generates a debrief","ANALYST writes post-deploy notes. STRATEGIST updates blueprint. System gets smarter every time."],
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
    ("BACKGROUND",(0,9),(-1,9),HexColor("#fffbeb")),
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
print("PDF built OK — v1.2.1 FINAL functional flows")
