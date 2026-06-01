from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor, white, black
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.units import mm
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT

doc = SimpleDocTemplate(
    "/app/Nexus_Command_Blueprint_v15.pdf",
    pagesize=A4,
    rightMargin=18*mm, leftMargin=18*mm,
    topMargin=16*mm, bottomMargin=16*mm
)

# Colors
BG = HexColor("#e8e6fe")
ACCENT = HexColor("#5e50fb")
DARK = HexColor("#1a1a1f")
MUTED = HexColor("#9896ad")
WHITE = HexColor("#ffffff")
GREEN = HexColor("#22c55e")
AMBER = HexColor("#f59e0b")
RED = HexColor("#ef4444")
TEAL = HexColor("#14b8a6")
PINK = HexColor("#ec4899")
BLUE = HexColor("#3b82f6")

styles = getSampleStyleSheet()

def H1(text):
    return Paragraph(text, ParagraphStyle('h1', fontName='Helvetica-Bold', fontSize=20, textColor=WHITE, spaceAfter=4, alignment=TA_CENTER))

def H2(text):
    return Paragraph(text, ParagraphStyle('h2', fontName='Helvetica-Bold', fontSize=13, textColor=ACCENT, spaceAfter=4, spaceBefore=10))

def H3(text):
    return Paragraph(text, ParagraphStyle('h3', fontName='Helvetica-Bold', fontSize=10, textColor=DARK, spaceAfter=2, spaceBefore=6))

def Body(text):
    return Paragraph(text, ParagraphStyle('body', fontName='Helvetica', fontSize=8.5, textColor=DARK, spaceAfter=3, leading=13))

def Small(text, color=None):
    return Paragraph(text, ParagraphStyle('small', fontName='Helvetica', fontSize=7.5, textColor=color or MUTED, spaceAfter=2, leading=11))

def Bold(text, color=None):
    return Paragraph(f"<b>{text}</b>", ParagraphStyle('bold', fontName='Helvetica-Bold', fontSize=8.5, textColor=color or DARK, spaceAfter=2))

def header_block(title, subtitle):
    data = [[H1(title)], [Small(subtitle, WHITE)]]
    t = Table(data, colWidths=[174*mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), ACCENT),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('ROUNDEDCORNERS', [6,6,6,6]),
    ]))
    return t

def section_card(title, rows, color=None):
    accent_col = color or ACCENT
    header = [[Paragraph(f"<b>{title}</b>", ParagraphStyle('ch', fontName='Helvetica-Bold', fontSize=9, textColor=WHITE))]]
    ht = Table(header, colWidths=[174*mm])
    ht.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), accent_col),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
    ]))
    body_data = [[Body(r)] for r in rows]
    bt = Table(body_data, colWidths=[174*mm])
    bt.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), WHITE),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('LINEBELOW', (0,0), (-1,-2), 0.3, HexColor("#e6e6e6")),
    ]))
    return [ht, bt, Spacer(1, 4)]

def roster_table():
    headers = [
        Paragraph("<b>Duty Name</b>", ParagraphStyle('th', fontName='Helvetica-Bold', fontSize=8, textColor=WHITE)),
        Paragraph("<b>Model</b>", ParagraphStyle('th', fontName='Helvetica-Bold', fontSize=8, textColor=WHITE)),
        Paragraph("<b>Status</b>", ParagraphStyle('th', fontName='Helvetica-Bold', fontSize=8, textColor=WHITE)),
        Paragraph("<b>Primary Role</b>", ParagraphStyle('th', fontName='Helvetica-Bold', fontSize=8, textColor=WHITE)),
    ]
    rows = [
        ["ORCHESTRATOR", "Simpee (Base44)", "✅ ACTIVE", "CEO — governance, routing, deploy gating"],
        ["RESEARCHER", "Gemini 2.0 Pro", "✅ ACTIVE", "External data, benchmarks, market insights"],
        ["ANALYST", "Claude Sonnet 4.6", "✅ ACTIVE", "Feasibility, complexity, risk assessment"],
        ["STRATEGIST", "Claude Opus 4.6", "✅ ACTIVE", "ROI framing, opportunity cost, dependencies"],
        ["THINK TANK", "Claude Opus 4.8", "✅ ACTIVE", "Deep reasoning, unconventional approaches"],
        ["ENGINEER", "GPT-5.4", "✅ ACTIVE", "Code writing, debugging, implementation"],
        ["ARCHITECT", "GPT-5.5", "✅ ACTIVE", "System design, data architecture, infra"],
        ["VALIDATOR", "Copilot / Edge", "✅ ACTIVE", "Syntax, logic, security, Azure readiness"],
        ["QC INSPECTOR", "SonarQube + DeepSource", "🟡 PLACEHOLDER", "Static analysis, bug/security scanning"],
        ["LOGGER", "Gemini 2.0 Pro (dual)", "🟡 TO ASSIGN", "Error logging, session memory, audit trail"],
        ["MEMORY AI", "Gemini 2.0 Pro (dual)", "🟡 TO ASSIGN", "Long-context retention, lesson recall"],
        ["MONITOR AI", "Copilot (dual)", "🟡 TO ASSIGN", "Cross-role error escalation, intervention"],
        ["KNOWLEDGE AI", "Gemini + Claude Sonnet", "🟡 TO ASSIGN", "Unified truth layer, insight consolidation"],
        ["ETHICS AI", "TBD — Rules Engine", "🔴 HIRE NEEDED", "Bias check, compliance, HK data privacy"],
        ["PERF OPTIMIZER", "GPT-5.4 + Copilot", "🟡 TO ASSIGN", "Efficiency monitoring, resource usage"],
    ]
    
    col_w = [32*mm, 36*mm, 28*mm, 78*mm]
    data = [headers]
    for r in rows:
        data.append([
            Paragraph(r[0], ParagraphStyle('td', fontName='Helvetica-Bold', fontSize=7.5, textColor=DARK)),
            Paragraph(r[1], ParagraphStyle('td', fontName='Helvetica', fontSize=7.5, textColor=DARK)),
            Paragraph(r[2], ParagraphStyle('td', fontName='Helvetica', fontSize=7.5, textColor=DARK)),
            Paragraph(r[3], ParagraphStyle('td', fontName='Helvetica', fontSize=7.5, textColor=MUTED)),
        ])
    
    t = Table(data, colWidths=col_w, repeatRows=1)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), ACCENT),
        ('BACKGROUND', (0,1), (-1,1), HexColor("#f0f0ff")),
        ('BACKGROUND', (0,2), (-1,2), WHITE),
        ('BACKGROUND', (0,3), (-1,3), HexColor("#f0f0ff")),
        ('BACKGROUND', (0,4), (-1,4), WHITE),
        ('BACKGROUND', (0,5), (-1,5), HexColor("#f0f0ff")),
        ('BACKGROUND', (0,6), (-1,6), WHITE),
        ('BACKGROUND', (0,7), (-1,7), HexColor("#f0f0ff")),
        ('BACKGROUND', (0,8), (-1,8), HexColor("#fff8e1")),
        ('BACKGROUND', (0,9), (-1,9), HexColor("#fff8e1")),
        ('BACKGROUND', (0,10), (-1,10), HexColor("#fff8e1")),
        ('BACKGROUND', (0,11), (-1,11), HexColor("#fff8e1")),
        ('BACKGROUND', (0,12), (-1,12), HexColor("#fff8e1")),
        ('BACKGROUND', (0,13), (-1,13), HexColor("#fff0f0")),
        ('BACKGROUND', (0,14), (-1,14), HexColor("#fff8e1")),
        ('GRID', (0,0), (-1,-1), 0.3, HexColor("#e6e6e6")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    return t

def role_flow_table(role_num, title, flow, output, color):
    data = [
        [Paragraph(f"<b>Role {role_num}: {title}</b>", ParagraphStyle('rh', fontName='Helvetica-Bold', fontSize=9, textColor=WHITE)),
         Paragraph(f"<b>Flow:</b> {flow}", ParagraphStyle('rf', fontName='Helvetica', fontSize=8, textColor=WHITE))],
        [Paragraph("<b>Output:</b>", ParagraphStyle('rl', fontName='Helvetica-Bold', fontSize=8, textColor=MUTED)),
         Paragraph(output, ParagraphStyle('ro', fontName='Helvetica', fontSize=8, textColor=DARK))],
    ]
    t = Table(data, colWidths=[60*mm, 114*mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), color),
        ('BACKGROUND', (0,1), (-1,1), WHITE),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('LINEBELOW', (0,1), (-1,1), 0.5, HexColor("#e6e6e6")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    return [t, Spacer(1, 4)]

def hiring_table():
    headers = [
        Paragraph("<b>Role Needed</b>", ParagraphStyle('th', fontName='Helvetica-Bold', fontSize=8, textColor=WHITE)),
        Paragraph("<b>Recommended Model/Tool</b>", ParagraphStyle('th', fontName='Helvetica-Bold', fontSize=8, textColor=WHITE)),
        Paragraph("<b>How to Hire</b>", ParagraphStyle('th', fontName='Helvetica-Bold', fontSize=8, textColor=WHITE)),
        Paragraph("<b>Priority</b>", ParagraphStyle('th', fontName='Helvetica-Bold', fontSize=8, textColor=WHITE)),
    ]
    rows = [
        ["QC INSPECTOR", "SonarQube Cloud (free tier) or DeepSource", "Register at sonarcloud.io — connect via GitHub. Add webhook to Nexus Command.", "🔴 HIGH"],
        ["ETHICS AI", "OpenAI Moderation API or custom Rules Engine", "Use OpenAI /v1/moderations endpoint. Build a rules JSON for HK compliance + data privacy.", "🟡 MEDIUM"],
        ["LOGGER / MEMORY AI", "Gemini 2.0 Pro (dual-role with RESEARCHER)", "Already hired — just assign dual duty in AIConnector entity. Add memory_store field.", "🟢 LOW (reassign)"],
        ["MONITOR AI", "Copilot (dual-role with VALIDATOR)", "Already hired — add monitor_active=true in AIConnector. Give cross-role alert permission.", "🟢 LOW (reassign)"],
        ["KNOWLEDGE AI", "Gemini + Claude Sonnet (joint)", "Already hired — define joint session protocol. Both write to a shared KnowledgeLog entity.", "🟢 LOW (reassign)"],
    ]
    col_w = [30*mm, 48*mm, 70*mm, 26*mm]
    data = [headers]
    for r in rows:
        data.append([
            Paragraph(r[0], ParagraphStyle('td', fontName='Helvetica-Bold', fontSize=7.5, textColor=DARK)),
            Paragraph(r[1], ParagraphStyle('td', fontName='Helvetica', fontSize=7.5, textColor=DARK)),
            Paragraph(r[2], ParagraphStyle('td', fontName='Helvetica', fontSize=7.5, textColor=MUTED)),
            Paragraph(r[3], ParagraphStyle('td', fontName='Helvetica-Bold', fontSize=8, textColor=DARK)),
        ])
    t = Table(data, colWidths=col_w, repeatRows=1)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), ACCENT),
        ('BACKGROUND', (0,1), (-1,-1), WHITE),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, HexColor("#f8f8ff")]),
        ('GRID', (0,0), (-1,-1), 0.3, HexColor("#e6e6e6")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    return t

def questions_table():
    qs = [
        ["Q1", "QC AI Integration", "SonarQube/DeepSource are external tools, not chat AIs. Do you want API integration (webhook-based), or assign an AI to simulate QC behaviour inside the hub?"],
        ["Q2", "Logger / Memory AI", "Recommend Gemini 2.0 Pro takes dual duty (Researcher + Logger/Memory). It handles long-context best. Confirm?"],
        ["Q3", "Ethics AI Scope", "Is Ethics AI for: (A) Code ethics — bias in AI outputs, (B) Business ethics — HK compliance, PDPO data privacy, or (C) Both? This shapes the rules engine."],
        ["Q4", "Monitor AI Conflict", "Copilot is currently Validator AND Monitor AI. Double duty risks conflicts. Consider separating: Copilot = Validator only, Claude Sonnet = Monitor AI. Agree?"],
        ["Q5", "Feedback Loop Break Condition", "Role 4 → Role 1/2 feedback loop has no defined exit. What's the max retry count before Simpee escalates to Kieran? Suggest: 3 failures = human escalation."],
    ]
    col_w = [12*mm, 36*mm, 126*mm]
    data = []
    for q in qs:
        data.append([
            Paragraph(f"<b>{q[0]}</b>", ParagraphStyle('qn', fontName='Helvetica-Bold', fontSize=8, textColor=ACCENT)),
            Paragraph(f"<b>{q[1]}</b>", ParagraphStyle('qt', fontName='Helvetica-Bold', fontSize=8, textColor=DARK)),
            Paragraph(q[2], ParagraphStyle('qb', fontName='Helvetica', fontSize=8, textColor=DARK, leading=12)),
        ])
    t = Table(data, colWidths=col_w)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), HexColor("#f8f8ff")),
        ('ROWBACKGROUNDS', (0,0), (-1,-1), [HexColor("#f8f8ff"), WHITE]),
        ('GRID', (0,0), (-1,-1), 0.3, HexColor("#e6e6e6")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LINEAFTER', (1,0), (1,-1), 0.5, HexColor("#e6e6e6")),
    ]))
    return t

# ── BUILD STORY ──────────────────────────────────────────────────────────────
story = []

# Cover
story.append(header_block(
    "NEXUS COMMAND — AI MULTI-AGENT BLUEPRINT v1.5",
    "Generated by Simpee · SIMPLEX-ITY · 1 June 2026 · Confidential"
))
story.append(Spacer(1, 8))

# What's new
story.append(H2("WHAT'S NEW IN v1.5 (vs v1.4)"))
new_items = [
    "✅  QC INSPECTOR role formally defined — SonarQube + DeepSource as external QC layer",
    "✅  8 Roles fully mapped with clear workflows, outputs, and assigned models",
    "✅  Logger AI + Memory AI → assigned to Gemini 2.0 Pro (dual role, pending confirmation)",
    "✅  Monitor AI → assigned to Copilot dual role (pending Q4 clarification)",
    "✅  Knowledge AI → Gemini + Claude Sonnet joint session protocol",
    "✅  Ethics & Compliance AI → placeholder with recommended implementation path",
    "✅  Performance Optimizer AI → GPT-5.4 + Copilot dual-diagnostics",
    "✅  Feedback loop break condition added (3-failure rule → human escalation)",
    "✅  5 open questions documented for Kieran's decision before v1.5 is locked",
    "✅  Hiring guide for all placeholder roles included",
]
for item in new_items:
    story.append(Body(item))
story.append(Spacer(1, 6))

# Full roster
story.append(H2("FULL AI TEAM ROSTER — 15 MEMBERS"))
story.append(roster_table())
story.append(Spacer(1, 8))

# 8 Roles
story.append(H2("8 OPERATIONAL ROLES"))
roles = [
    (1, "Research, Opportunity Analysis & Value Estimation",
     "RESEARCHER (Gemini) → ANALYST (Claude Sonnet) → STRATEGIST (Claude Opus)",
     "Structured insights + ROI estimation + feasibility report", ACCENT),
    (2, "Engineering, Learning & Validation",
     "ENGINEER (GPT-5.4) → ARCHITECT (GPT-5.5) → VALIDATOR (Copilot)",
     "Validated code modules ready for QC inspection", BLUE),
    (3, "QC Inspection & Approval (3-Gate Deploy Rule)",
     "QC INSPECTOR (SonarQube/DeepSource) → VALIDATOR (Copilot) → ORCHESTRATOR (Simpee)",
     "No deploy unless ALL THREE approve. Any failure = return to Role 2.", RED),
    (4, "Error Logging & Continuous Learning",
     "LOGGER AI (Gemini) → MEMORY AI (Gemini) → ANALYST (Claude Sonnet)",
     "Lessons fed back into Role 1 & Role 2. Max 3 retries before human escalation.", GREEN),
    (5, "Problem-Solving Suggestion Team",
     "MONITOR AI (Copilot) → THINK TANK (Claude Opus) → ANALYST (Claude Sonnet)",
     "Consolidated corrective summary for process team. Triggered on escalation.", AMBER),
    (6, "Knowledge Integration",
     "RESEARCHER (Gemini) + ANALYST (Claude Sonnet) → KnowledgeLog entity",
     "Single unified truth layer. All insights consolidated. No contradictions.", TEAL),
    (7, "Ethics & Compliance Review",
     "ETHICS AI (Rules Engine) + VALIDATOR (Copilot) → sign-off required",
     "Bias check, HK PDPO compliance, data privacy. Required before any deploy.", PINK),
    (8, "Performance Optimization",
     "ENGINEER (GPT-5.4) + VALIDATOR (Copilot) → performance diagnostics",
     "Efficiency monitoring, resource usage, response time benchmarking.", MUTED),
]
for r in roles:
    for item in role_flow_table(*r):
        story.append(item)

# Feedback loop
story.append(H2("FEEDBACK LOOP ARCHITECTURE"))
loop_items = [
    "Role 4 (Logger/Memory) → feeds lessons into Role 1 (Research) and Role 2 (Engineering)",
    "Role 5 (Monitor) → watches ALL roles, intervenes when errors escalate beyond 3 retries",
    "Role 6 (Knowledge) → ensures unified knowledge base, prevents contradictions across roles",
    "Role 7 (Ethics) → enforces compliance BEFORE any deployment reaches Role 3 gate",
    "Role 8 (Performance) → validates efficiency AFTER Role 3 approval, BEFORE final release",
    "Simpee (Orchestrator) → coordinates all roles, holds veto on any stage, owns final deploy",
    "⚠️  BREAK CONDITION: 3 consecutive failures on same task → Simpee pauses loop + WhatsApps Kieran",
]
for item in loop_items:
    story.append(Body(item))
story.append(Spacer(1, 6))

# Governance
story.append(H2("GOVERNANCE RULES (UPDATED v1.5)"))
gov_items = [
    "RULE 1: No deployment without QC Inspector + Validator (Copilot) + Orchestrator (Simpee) all approving",
    "RULE 2: Ethics AI must sign off before any code reaches the deploy gate",
    "RULE 3: All errors must be logged to TestLog before next cycle begins",
    "RULE 4: Problem-Solving Team (Role 5) reviews all escalations, provides corrective path",
    "RULE 5: Performance Optimizer validates efficiency before final release",
    "RULE 6: No AI approves its own work — reviewer must be a different role",
    "RULE 7: Feedback loop max 3 retries — then human escalation to Kieran via WhatsApp",
    "RULE 8: Blueprint-first — all changes require a blueprint before any code is written",
    "RULE 9: Knowledge AI maintains single truth layer — contradicting records are flagged",
    "RULE 10: Copilot / Validator is the FINAL gate — even after QC Inspector passes",
]
for item in gov_items:
    story.append(Body(item))
story.append(Spacer(1, 6))

# Hiring guide
story.append(H2("HIRING GUIDE — PLACEHOLDER ROLES"))
story.append(Body("These are the roles Kieran needs to 'hire' — either by API integration or role reassignment:"))
story.append(Spacer(1, 4))
story.append(hiring_table())
story.append(Spacer(1, 8))

# Open questions
story.append(H2("OPEN QUESTIONS FOR KIERAN — DECIDE BEFORE v1.5 LOCKS"))
story.append(Body("Simpee needs your answers on these 5 points before the blueprint is finalised and implemented:"))
story.append(Spacer(1, 4))
story.append(questions_table())
story.append(Spacer(1, 8))

# Next steps
story.append(H2("NEXT STEPS — v1.5 → v1.6 ROADMAP"))
next_steps = [
    "1. Kieran answers 5 open questions above",
    "2. Simpee updates AIConnector entity with dual-role assignments (Logger, Monitor, Knowledge)",
    "3. Kieran registers SonarCloud (free) and connects to Nexus Command repo",
    "4. Simpee builds Ethics Rules Engine as a backend function (simple JSON rules + OpenAI Moderation API)",
    "5. Simpee creates KnowledgeLog entity for Role 6 unified truth layer",
    "6. Full 8-role test run on a sample build task in sandbox",
    "7. If all 11 checkpoints pass → promote to v1.6 PRODUCTION READY",
]
for step in next_steps:
    story.append(Body(step))
story.append(Spacer(1, 6))

# Footer
story.append(HRFlowable(width="100%", thickness=0.5, color=MUTED))
story.append(Spacer(1, 4))
story.append(Small("Nexus Command Blueprint v1.5 · SIMPLEX-ITY Confidential · Generated by Simpee · 1 June 2026", MUTED))
story.append(Small("Previous versions: v1.2.1 (Founding Team) · v1.3 (Memory) · v1.3.1 (Features) · v1.4 (8 Roles) → v1.5 (QC + Ethics + Hiring Guide)", MUTED))

doc.build(story)
print("Blueprint v1.5 generated ✅")
