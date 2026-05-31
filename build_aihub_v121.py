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

doc = SimpleDocTemplate("Command_AI_Hub_Blueprint_v1.2.1_FINAL.pdf", pagesize=A4,
    leftMargin=18*mm, rightMargin=18*mm, topMargin=18*mm, bottomMargin=18*mm)
story = []

# ── COVER ──────────────────────────────────────────────────────
cover = Table([[
    Paragraph("COMMAND AI HUB", s("T", fontSize=24, fontName="Helvetica-Bold", textColor=WHITE)),
    ""
],[
    Paragraph("SIMPLEX-ITY · AI ROLES, RESPONSIBILITIES & GATEKEEPER SYSTEM", s("S", fontSize=8, fontName="Helvetica", textColor=SOFT)),
    Paragraph(f"Version 1.2.1 FINAL · {today}", s("R", fontSize=8, fontName="Helvetica", textColor=SOFT, alignment=TA_RIGHT))
],[
    Paragraph("Co-authored: Kieran Li + Simpee + Edge (Copilot)", s("S2", fontSize=8, fontName="Helvetica", textColor=HexColor("#9896ad"))),
    Paragraph("New: AI Roles + Dual Gatekeeper System", s("N", fontSize=7.5, fontName="Helvetica", textColor=YELLOW_B, alignment=TA_RIGHT))
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
    "<b>PHILOSOPHY:</b> Every AI in the Command AI Hub has a defined role and primary duty. "
    "No AI works alone on anything critical — every decision, code block, or deployment "
    "requires at least two AIs to review and agree before it proceeds. "
    "<b>This is the Gatekeeper System.</b>",
    s("P", fontSize=9, fontName="Helvetica", textColor=BODY_TEXT, leading=14,
      borderColor=VIOLET, borderWidth=1.5, borderPadding=10, backColor=LAVENDER, spaceAfter=10)))

# ── AI ROLE TABLE ───────────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("AI TEAM — Roles, Duties & Position Names",
    s("H", fontSize=12, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
story.append(Paragraph("Each AI has been assigned a duty name based on its natural strengths. These names appear in the Hub UI.",
    s("Sub", fontSize=8, fontName="Helvetica", textColor=MUTED, spaceAfter=6)))

roles = [
    ["AI Model","Duty Name","Provider","Strengths","Primary Role in Hub","Colour"],
    [
        "Automatic",
        "DIRECTOR",
        "Base44",
        "Routes to best model per request. Sees the full picture.",
        "Orchestrates — picks which AI handles each task. First point of contact for any instruction.",
        "#5e50fb"
    ],
    [
        "Gemini 3.1 Pro",
        "RESEARCHER",
        "Google",
        "Long context, web grounding, deep information retrieval, broad knowledge.",
        "Research phase — gathers context, finds references, surfaces relevant data before building begins.",
        "#4285f4"
    ],
    [
        "Claude Sonnet 4.6",
        "WRITER",
        "Anthropic",
        "Clear, structured writing. Fast. Excellent at drafting, summarising, communicating.",
        "Communication layer — drafts emails, briefs, summaries, documentation, and user-facing content.",
        "#d97706"
    ],
    [
        "Claude Opus 4.6",
        "STRATEGIST",
        "Anthropic",
        "Deep reasoning, multi-step logic, planning, nuanced decision-making.",
        "Planning phase — breaks down complex problems, proposes architecture, evaluates trade-offs.",
        "#d97706"
    ],
    [
        "Claude Opus 4.8",
        "ARCHITECT",
        "Anthropic",
        "Most capable Anthropic model. System design, complex logic, frontier reasoning.",
        "System design — designs entity schemas, data flows, app architecture, and integration plans.",
        "#f59e0b"
    ],
    [
        "GPT-5.4",
        "BUILDER",
        "OpenAI",
        "Code generation, structured output, API wiring, function writing.",
        "Build phase — writes the actual JSX, backend functions, entity logic, and integration code.",
        "#10a37f"
    ],
    [
        "GPT-5.5",
        "INNOVATOR",
        "OpenAI",
        "Most capable OpenAI model. Creative problem-solving, novel approaches, frontier ideas.",
        "Brainstorm phase — generates new feature ideas, UX improvements, and unexpected solutions.",
        "#10a37f"
    ],
    [
        "Copilot (Edge)",
        "GUARDIAN",
        "Microsoft",
        "External validation, security review, Azure readiness, syntax checking.",
        "Final gate — reviews ALL code before deploy. Checks logic, security, Azure compatibility. Cannot be skipped.",
        "#0078d4"
    ],
]

rt = Table(roles, colWidths=[28*mm, 22*mm, 20*mm, 44*mm, 46*mm, 12*mm])
rt.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    # highlight GUARDIAN row
    ("BACKGROUND",(0,8),(-1,8),HexColor("#eff6ff")),
    ("FONTNAME",(1,8),(1,8),"Helvetica-Bold"),("TEXTCOLOR",(1,8),(1,8),AZURE),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),5),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(rt)
story.append(Spacer(1,10))

# ── GATEKEEPER SYSTEM ──────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("THE GATEKEEPER SYSTEM — Joint AI Review at Every Stage",
    s("H", fontSize=12, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=4)))
story.append(Paragraph(
    "No single AI can approve its own work. Every stage has at least 2 AIs reviewing before the output moves forward. "
    "The GUARDIAN (Copilot) is the final gate — always. Nothing deploys without it.",
    s("Sub", fontSize=8.5, fontName="Helvetica", textColor=BODY_TEXT, leading=13, spaceAfter=6)))

gates = [
    ["Stage","Task","Primary AI","Gatekeeper AI","What Gatekeeper Checks","Pass Condition"],
    [
        "1 — Research",
        "Gather context, references, background data",
        "RESEARCHER\n(Gemini 3.1)",
        "STRATEGIST\n(Opus 4.6)",
        "Is the research complete? Are sources relevant? Any gaps?",
        "Strategist confirms research is sufficient to proceed"
    ],
    [
        "2 — Strategy",
        "Break down problem, plan architecture, evaluate options",
        "STRATEGIST\n(Opus 4.6)",
        "ARCHITECT\n(Opus 4.8)",
        "Is the plan logical? Are edge cases covered? Is it scalable?",
        "Architect approves the plan before build begins"
    ],
    [
        "3 — Design",
        "Design entities, data flows, system architecture",
        "ARCHITECT\n(Opus 4.8)",
        "BUILDER\n(GPT-5.4)",
        "Can this be built? Are entity schemas correct? Any implementation issues?",
        "Builder confirms design is implementable"
    ],
    [
        "4 — Build",
        "Write JSX, functions, entity logic, API wiring",
        "BUILDER\n(GPT-5.4)",
        "STRATEGIST\n(Opus 4.6)",
        "Does the code match the plan? Are there logic errors? Missing edge cases?",
        "Strategist confirms code matches approved design"
    ],
    [
        "5 — Communication",
        "Draft emails, briefs, docs, user content",
        "WRITER\n(Sonnet 4.6)",
        "DIRECTOR\n(Automatic)",
        "Is the tone correct? Is it appropriate to send? Any sensitive content?",
        "Director approves before any external communication sent"
    ],
    [
        "6 — Innovation",
        "New feature ideas, UX improvements, creative solutions",
        "INNOVATOR\n(GPT-5.5)",
        "STRATEGIST\n(Opus 4.6)",
        "Is the idea feasible? Does it align with 5S Portal goals? Priority?",
        "Strategist scores feasibility before adding to blueprint"
    ],
    [
        "7 — Final Deploy",
        "Any code going to live 5S Portal",
        "BUILDER\n(GPT-5.4)",
        "GUARDIAN\n(Copilot)",
        "Syntax, logic, security, Azure readiness. Full code review.",
        "Guardian must return green. No exceptions. Ever."
    ],
]

gt = Table(gates, colWidths=[22*mm, 28*mm, 22*mm, 22*mm, 48*mm, 30*mm])
gt.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    # Final deploy row — special highlight
    ("BACKGROUND",(0,7),(-1,7),HexColor("#fff0f0")),
    ("FONTNAME",(0,7),(-1,7),"Helvetica-Bold"),
    ("TEXTCOLOR",(4,7),(4,7),RED),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),5),
    ("VALIGN",(0,0),(-1,-1),"TOP"),
]))
story.append(gt)
story.append(Spacer(1,10))

# ── WORKFLOW DIAGRAM ───────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("WORKFLOW — From Idea to Deployed Feature",
    s("H", fontSize=12, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=6)))

flow = [
    [
        Paragraph("KIERAN\nInput", s("F", fontSize=8, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER, leading=12)),
        Paragraph("→", s("AR", fontSize=14, fontName="Helvetica-Bold", textColor=VIOLET, alignment=TA_CENTER)),
        Paragraph("DIRECTOR\nRoutes task", s("F", fontSize=8, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER, leading=12)),
        Paragraph("→", s("AR", fontSize=14, fontName="Helvetica-Bold", textColor=VIOLET, alignment=TA_CENTER)),
        Paragraph("RESEARCHER\n+ STRATEGIST\ngate", s("F", fontSize=7.5, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER, leading=11)),
        Paragraph("→", s("AR", fontSize=14, fontName="Helvetica-Bold", textColor=VIOLET, alignment=TA_CENTER)),
        Paragraph("ARCHITECT\n+ BUILDER\ngate", s("F", fontSize=7.5, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER, leading=11)),
        Paragraph("→", s("AR", fontSize=14, fontName="Helvetica-Bold", textColor=VIOLET, alignment=TA_CENTER)),
        Paragraph("GUARDIAN\nFinal gate", s("F", fontSize=8, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER, leading=12)),
        Paragraph("→", s("AR", fontSize=14, fontName="Helvetica-Bold", textColor=VIOLET, alignment=TA_CENTER)),
        Paragraph("DEPLOY\n5S Portal", s("F", fontSize=8, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER, leading=12)),
    ]
]
bgcolours = [DARK, WHITE, VIOLET, WHITE, HexColor("#3730a3"), WHITE, HexColor("#7c3aed"), WHITE, AZURE, WHITE, GREEN]
ft2 = Table(flow, colWidths=[16*mm, 7*mm, 18*mm, 7*mm, 22*mm, 7*mm, 22*mm, 7*mm, 18*mm, 7*mm, 15*mm])
ft2.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(0,0),DARK),
    ("BACKGROUND",(2,0),(2,0),VIOLET),
    ("BACKGROUND",(4,0),(4,0),HexColor("#3730a3")),
    ("BACKGROUND",(6,0),(6,0),HexColor("#7c3aed")),
    ("BACKGROUND",(8,0),(8,0),AZURE),
    ("BACKGROUND",(10,0),(10,0),GREEN),
    ("TEXTCOLOR",(0,0),(0,0),WHITE),
    ("TEXTCOLOR",(2,0),(2,0),WHITE),
    ("TEXTCOLOR",(4,0),(4,0),WHITE),
    ("TEXTCOLOR",(6,0),(6,0),WHITE),
    ("TEXTCOLOR",(8,0),(8,0),WHITE),
    ("TEXTCOLOR",(10,0),(10,0),WHITE),
    ("TEXTCOLOR",(1,0),(1,0),VIOLET),
    ("TEXTCOLOR",(3,0),(3,0),VIOLET),
    ("TEXTCOLOR",(5,0),(5,0),VIOLET),
    ("TEXTCOLOR",(7,0),(7,0),VIOLET),
    ("TEXTCOLOR",(9,0),(9,0),VIOLET),
    ("ALIGN",(0,0),(-1,-1),"CENTER"),
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
    ("PADDING",(0,0),(-1,-1),8),
    ("ROUNDEDCORNERS",[4]),
]))
story.append(ft2)
story.append(Spacer(1,6))
story.append(Paragraph(
    "At each gate: primary AI produces output → gatekeeper AI reviews → both must agree → move to next stage. "
    "If gatekeeper flags an issue → back to primary AI to fix → re-review. No skipping.",
    s("Note", fontSize=8, fontName="Helvetica", textColor=MUTED, leading=13, spaceAfter=10)))

# ── UI LABELS ─────────────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("UI LABELS — How Names Appear in the Hub",
    s("H", fontSize=12, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))
story.append(Paragraph("The chip row, status panel, and response cards all use DUTY NAMES, not model names. Model name shown in tooltip only.",
    s("Sub", fontSize=8, fontName="Helvetica", textColor=MUTED, spaceAfter=5)))

ui = [
    ["Chip Label","Status Panel Label","Response Card Header","Tooltip (hover)","Provider Colour"],
    ["AUTO","DIRECTOR — Auto","DIRECTOR responded","Automatic — routes to best model","#5e50fb"],
    ["RESEARCHER","RESEARCHER — Gemini","RESEARCHER — Gemini 3.1 Pro","Gemini 3.1 Pro (Google)","#4285f4"],
    ["WRITER","WRITER — Sonnet","WRITER — Sonnet 4.6","Claude Sonnet 4.6 (Anthropic)","#d97706"],
    ["STRATEGIST","STRATEGIST — Opus","STRATEGIST — Opus 4.6","Claude Opus 4.6 (Anthropic)","#d97706"],
    ["ARCHITECT","ARCHITECT — Opus","ARCHITECT — Opus 4.8","Claude Opus 4.8 (Anthropic) NEW","#f59e0b"],
    ["BUILDER","BUILDER — GPT","BUILDER — GPT-5.4","GPT-5.4 (OpenAI)","#10a37f"],
    ["INNOVATOR","INNOVATOR — GPT","INNOVATOR — GPT-5.5","GPT-5.5 (OpenAI) NEW","#10a37f"],
    ["GUARDIAN","GUARDIAN — Copilot","GUARDIAN — Copilot","External validation only — not code gen","#0078d4"],
]
uit = Table(ui, colWidths=[20*mm, 30*mm, 40*mm, 46*mm, 26*mm])
uit.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),7.5),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LAVENDER]),
    ("BACKGROUND",(0,8),(-1,8),HexColor("#eff6ff")),
    ("FONTNAME",(0,8),(-1,8),"Helvetica-Bold"),("TEXTCOLOR",(0,8),(-1,8),AZURE),
    ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
    ("PADDING",(0,0),(-1,-1),5),
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
]))
story.append(uit)
story.append(Spacer(1,10))

# ── BUILDER UPDATE INSTRUCTIONS ────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("BUILDER UPDATE — How to Implement Roles in the Hub",
    s("H", fontSize=12, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))

steps = [
    ("1","Rename chips in AI Selector Row","Replace model names with duty names:\nAUTO · RESEARCHER · WRITER · STRATEGIST · ARCHITECT · BUILDER · INNOVATOR · GUARDIAN\nTooltip on hover shows full model name + provider."),
    ("2","Rename status panel cards","Each card header: DUTY NAME — Model\nE.g. 'GUARDIAN — Copilot'  not  'Copilot (Edge)'"),
    ("3","Rename response card headers","Card 1 header: 'RESEARCHER — Analysis'  not  'Gemini 3.1 Pro — Analysis'"),
    ("4","Add gatekeeper indicator to cards","After primary AI card, show a 'PENDING GATE' badge.\nWhen gatekeeper reviews: badge changes to 'GATE PASSED' (green) or 'GATE FLAGGED' (red)."),
    ("5","Update AIConnector seed data","Update model_name field to include duty name:\n{ model_id:'1', model_name:'RESEARCHER — Gemini 3.1 Pro', ... }"),
    ("6","Paste to builder — exact prefix","'Update CommandAIHub.jsx. Replace all AI model labels with duty names: AUTO=DIRECTOR, Gemini=RESEARCHER, Sonnet=WRITER, Opus4.6=STRATEGIST, Opus4.8=ARCHITECT, GPT-5.4=BUILDER, GPT-5.5=INNOVATOR, Copilot=GUARDIAN. Add gatekeeper badge to each response card. Tooltip shows full model name. Same design system.'"),
]
for num, title, desc in steps:
    bg = VIOLET if int(num)%2==1 else HexColor("#3730a3")
    row = [[
        Paragraph(num, s("N", fontSize=11, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER)),
        Paragraph(f"<b>{title}</b><br/>{desc.replace(chr(10),'<br/>')}", s("D", fontSize=8.5, fontName="Helvetica", textColor=BODY_TEXT, leading=14)),
    ]]
    rt2 = Table(row, colWidths=[14*mm, 154*mm])
    rt2.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(0,0),bg),
        ("BACKGROUND",(1,0),(1,0),WHITE if int(num)%2==1 else LAVENDER),
        ("GRID",(0,0),(-1,-1),0.3,NEUTRAL),
        ("PADDING",(0,0),(-1,-1),8),
        ("VALIGN",(0,0),(-1,-1),"TOP"),
        ("ALIGN",(0,0),(0,0),"CENTER"),
    ]))
    story.append(rt2)
story.append(Spacer(1,10))

# ── GOLDEN RULES ───────────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("GOLDEN RULES — Non-Negotiable",
    s("H", fontSize=12, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=5)))
rules = [
    ["#","Rule","Detail"],
    ["1","No solo deployments","No single AI approves and deploys its own output. Ever."],
    ["2","Guardian is always last","GUARDIAN (Copilot) reviews ALL code before any deploy. Cannot be bypassed."],
    ["3","Blueprint first","Any change to the Hub or 5S Portal requires a blueprint update before a single line of code is written."],
    ["4","Diagnose before build","Before implementing anything, Simpee runs a full diagnostic on current state."],
    ["5","Gate must pass","If a gatekeeper flags an issue, work goes back to primary AI. No overriding the gate."],
    ["6","Roles are fixed","Each AI stays in its lane. GUARDIAN does not generate code. BUILDER does not do final validation."],
    ["7","All 11 checkpoints","Every feature deployment must pass all 11 checkpoints before going live in 5S Portal."],
]
rlt = Table(rules, colWidths=[8*mm, 40*mm, 120*mm])
rlt.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),DARK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
    ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
    ("FONTSIZE",(0,0),(-1,-1),8.5),
    ("TEXTCOLOR",(0,1),(-1,-1),BODY_TEXT),
    ("FONTNAME",(1,1),(-1,-1),"Helvetica-Bold") if False else ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),
    ("TEXTCOLOR",(0,1),(0,-1),VIOLET),
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
print("PDF built OK — v1.2.1 FINAL with Roles + Gatekeeper System")
