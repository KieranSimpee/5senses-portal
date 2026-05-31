from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Preformatted, HRFlowable, PageBreak
from reportlab.lib.enums import TA_LEFT, TA_CENTER
import datetime

# Read source files
with open('/app/functions/aiCommandCentre.ts', 'r') as f:
    ai_command_code = f.read()

with open('/app/functions/consultCopilot.ts', 'r') as f:
    consult_code = f.read()

doc = SimpleDocTemplate(
    '/app/Nexus_Command_FullCode.pdf',
    pagesize=A4,
    rightMargin=15*mm,
    leftMargin=15*mm,
    topMargin=20*mm,
    bottomMargin=20*mm
)

# Styles
styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    'Title',
    fontName='Helvetica-Bold',
    fontSize=22,
    textColor=colors.HexColor('#5e50fb'),
    alignment=TA_CENTER,
    spaceAfter=4
)

subtitle_style = ParagraphStyle(
    'Subtitle',
    fontName='Helvetica',
    fontSize=11,
    textColor=colors.HexColor('#666666'),
    alignment=TA_CENTER,
    spaceAfter=2
)

section_style = ParagraphStyle(
    'Section',
    fontName='Helvetica-Bold',
    fontSize=14,
    textColor=colors.HexColor('#5e50fb'),
    spaceBefore=10,
    spaceAfter=4
)

meta_style = ParagraphStyle(
    'Meta',
    fontName='Helvetica',
    fontSize=9,
    textColor=colors.HexColor('#888888'),
    spaceAfter=2
)

body_style = ParagraphStyle(
    'Body',
    fontName='Helvetica',
    fontSize=10,
    textColor=colors.HexColor('#1a1a1f'),
    spaceAfter=4,
    leading=14
)

code_style = ParagraphStyle(
    'Code',
    fontName='Courier',
    fontSize=7.5,
    textColor=colors.HexColor('#1a1a1f'),
    backColor=colors.HexColor('#f4f3ff'),
    borderPadding=(6, 6, 6, 6),
    leading=11,
    spaceAfter=6
)

label_style = ParagraphStyle(
    'Label',
    fontName='Helvetica-Bold',
    fontSize=11,
    textColor=colors.HexColor('#ffffff'),
    backColor=colors.HexColor('#5e50fb'),
    borderPadding=(4, 8, 4, 8),
    spaceAfter=4
)

story = []

# COVER
story.append(Spacer(1, 20*mm))
story.append(Paragraph("NEXUS COMMAND", title_style))
story.append(Paragraph("AI Hub — Full Source Code", subtitle_style))
story.append(Spacer(1, 4*mm))
story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#5e50fb')))
story.append(Spacer(1, 4*mm))
story.append(Paragraph("SIMPLEX-ITY | 5S Portal | Built by Kieran Li + Simpee", subtitle_style))
story.append(Paragraph(f"Generated: {datetime.datetime.now().strftime('%d %B %Y, %H:%M')} HKT", subtitle_style))
story.append(Spacer(1, 10*mm))

# Summary box
info_lines = [
    ("App ID", "6a1c237bd9f5ff04b6ac7a73 (Nexus Command)"),
    ("Real Portal ID", "69edd16e877d6e4391ad74bd (5S Portal)"),
    ("Backend Functions", "aiCommandCentre · consultCopilot"),
    ("Blueprint", "v4 FINAL — 10-stage workflow, 11 checkpoints"),
    ("AI Team", "8 members: Orchestrator → Researcher → Analyst → Strategist → Think Tank → Engineer → Architect → Validator"),
    ("Status", "LIVE — OpenAI key needed for full GPT-4o power"),
]

for label, value in info_lines:
    story.append(Paragraph(f"<b>{label}:</b> {value}", body_style))

story.append(Spacer(1, 6*mm))
story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#e8e6fe')))

# TABLE OF CONTENTS
story.append(PageBreak())
story.append(Paragraph("TABLE OF CONTENTS", section_style))
story.append(Spacer(1, 4*mm))
toc = [
    "1. aiCommandCentre.ts — Main AI Command Function",
    "2. consultCopilot.ts — Copilot Validator Function",
    "3. Entity Schemas — AIConnector, TestLog, SandboxProject, ProjectFile",
    "4. AI Team Roster — 8 Founding Members",
    "5. 4 Frontend Fixes — What Builder Still Needs",
    "6. Team Culture — Kieran's Standing Rule",
]
for item in toc:
    story.append(Paragraph(item, body_style))

story.append(Spacer(1, 4*mm))
story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#e8e6fe')))

# SECTION 1 — aiCommandCentre.ts
story.append(PageBreak())
story.append(Paragraph("1. aiCommandCentre.ts", section_style))
story.append(Paragraph("Main AI command processing function. Receives instruction from portal, queries M365/Copilot, generates structured response (Analysis + Solution + Code + Builder Instruction), posts result to real portal INBOX.", body_style))
story.append(Paragraph("Deploy path: Base44 → Functions → aiCommandCentre", meta_style))
story.append(Paragraph("Trigger: POST /api/run/aiCommandCentre { instruction, posted_by }", meta_style))
story.append(Spacer(1, 3*mm))
story.append(Preformatted(ai_command_code, code_style))

# SECTION 2 — consultCopilot.ts
story.append(PageBreak())
story.append(Paragraph("2. consultCopilot.ts", section_style))
story.append(Paragraph("Copilot Validator function. Acts as the VALIDATOR gate — final quality check before any code is deployed. Searches M365 docs for context, queries GPT-4o, posts result to portal S-Chat.", body_style))
story.append(Paragraph("Deploy path: Base44 → Functions → consultCopilot", meta_style))
story.append(Paragraph("Trigger: POST /api/run/consultCopilot { question, context }", meta_style))
story.append(Spacer(1, 3*mm))
story.append(Preformatted(consult_code, code_style))

# SECTION 3 — Entity Schemas
story.append(PageBreak())
story.append(Paragraph("3. Entity Schemas", section_style))

entities = [
    ("AIConnector", "name, role, duty_name, model, status, intro_message, voice_style, handoff_to, copilot_validated", "8 records seeded — all READY. One per AI team member."),
    ("TestLog", "test_name, status, result, tested_at, fixed, validator, simpee_validated, copilot_validated", "Logs all checkpoint results. Separate Simpee + Copilot validation fields."),
    ("SandboxProject", "name, description, type, status, created_by, checkpoint_status, validator_approved, notes", "Safe build zone. No auto-deploy. Every build starts here."),
    ("ProjectFile", "project_id, filename, content, language, version, notes", "Stores code outputs per project phase. Full version history."),
    ("azureConnectorStub", "service_name, status, last_tested, notes", "Simulates Azure service calls for dry-run validation."),
    ("TeamLog", "type, title, message, posted_by, stage, date, pinned", "Team culture, principles, decisions, lessons. 4 founding entries seeded."),
]

for name, fields, note in entities:
    story.append(Paragraph(f"<b>{name}</b>", body_style))
    story.append(Paragraph(f"Fields: {fields}", meta_style))
    story.append(Paragraph(f"Note: {note}", meta_style))
    story.append(Spacer(1, 2*mm))

# SECTION 4 — AI Team
story.append(PageBreak())
story.append(Paragraph("4. AI Team Roster — 8 Founding Members", section_style))
story.append(Spacer(1, 3*mm))

team = [
    ("ORCHESTRATOR", "Simpee (Base44)", "Sits above the team. Coordinates all members. Never skips protocol."),
    ("RESEARCHER", "Gemini 3.1 Pro", "Absorbs external content, benchmarks tools, synthesises knowledge."),
    ("ANALYST", "Claude Sonnet 4.6", "Data analysis, financial modelling, metrics interpretation."),
    ("STRATEGIST", "Claude Opus 4.6", "Business strategy, risk assessment, opportunity mapping."),
    ("THINK TANK", "Claude Opus 4.8", "Deep reasoning, unconventional approaches, creative problem solving."),
    ("ENGINEER", "GPT-5.4", "Code writing, debugging, technical implementation."),
    ("ARCHITECT", "GPT-5.5", "System design, data architecture, infrastructure planning."),
    ("VALIDATOR", "Copilot / Edge (Microsoft)", "ALWAYS LAST GATE. 4 checks: Syntax · Logic · Security · Azure."),
]

for role, model, description in team:
    story.append(Paragraph(f"<b>{role}</b> — {model}", body_style))
    story.append(Paragraph(description, meta_style))
    story.append(Spacer(1, 2*mm))

story.append(Spacer(1, 4*mm))
story.append(Paragraph("Planned Future Members (v1.4):", body_style))
story.append(Paragraph("DESIGNER — Canva AI", meta_style))
story.append(Paragraph("BRAND DIRECTOR — Looka AI", meta_style))

# SECTION 5 — Frontend Fixes
story.append(PageBreak())
story.append(Paragraph("5. Frontend Fixes — What Builder Still Needs", section_style))
story.append(Paragraph("Paste these instructions into the Nexus Command builder to complete the wiring:", body_style))
story.append(Spacer(1, 3*mm))

fixes = [
    ("Fix 1 — Wire chat input to backend",
     "The chat input Submit button must POST to:\nhttps://app.base44.com/api/apps/6a1c237bd9f5ff04b6ac7a73/run/aiCommandCentre\nBody: { instruction: userInput, posted_by: 'Kieran' }\nDisplay the returned { analysis, solution, code, builder_instruction } in the 3-panel layout."),
    ("Fix 2 — consultCopilot field name",
     "When calling consultCopilot, send body as:\n{ question: userInput, context: 'validation check' }\nNOT { code: userInput } — the old field name causes a 400 error."),
    ("Fix 3 — Auto-write TestLog after response",
     "After every aiCommandCentre response, auto-create a TestLog record:\n{ test_name: instruction.slice(0,50), status: 'passed', result: analysis, tested_at: new Date().toISOString(), validator: 'Simpee' }"),
    ("Fix 4 — Stage indicator + Sandbox card + Save button",
     "Add a stage indicator strip at the top showing current stage (1-10).\nAdd a Sandbox card showing active SandboxProject.\nAdd a Save to ProjectFile button in the code panel."),
]

for title, detail in fixes:
    story.append(Paragraph(f"<b>{title}</b>", body_style))
    story.append(Preformatted(detail, code_style))
    story.append(Spacer(1, 2*mm))

# SECTION 6 — Team Culture
story.append(PageBreak())
story.append(Paragraph("6. Team Culture — Kieran's Standing Rule", section_style))
story.append(Spacer(1, 4*mm))
story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#5e50fb')))
story.append(Spacer(1, 4*mm))
story.append(Paragraph(
    '"Mistakes are acceptable as long as we learn from them and do not re-encounter them. '
    'AI is allowed to make mistakes — SO WHAT — humans make countless mistakes in a day. '
    'What matters is we learn together, log it, improve the process, and build smarter every cycle."',
    ParagraphStyle('Quote', fontName='Helvetica-BoldOblique', fontSize=12,
                   textColor=colors.HexColor('#5e50fb'), leading=18,
                   spaceAfter=6, alignment=TA_CENTER)
))
story.append(Spacer(1, 4*mm))
story.append(Paragraph("— Kieran Li, Founder, SIMPLEX-ITY | 31 May 2026", subtitle_style))
story.append(Spacer(1, 8*mm))
story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#e8e6fe')))
story.append(Spacer(1, 4*mm))

rules = [
    "1. No solo deploys — always go through the 10-stage workflow",
    "2. VALIDATOR is always the last gate — no exceptions",
    "3. Blueprint before code — propose before building",
    "4. Diagnose before build — understand the problem first",
    "5. Gatekeeper must pass — all 4 checks: Syntax, Logic, Security, Azure",
    "6. Roles are fixed — duty names only in UI",
    "7. All 11 checkpoints must be completed before production",
    "8. Post-deploy debrief required after every release",
    "9. 8-step onboarding for every new team member",
    "10. Goal over target — quality beats speed",
    "11. Mistakes are learning — log them, fix them, never repeat them",
    "12. Pride in work — every output represents SIMPLEX-ITY",
]
story.append(Paragraph("<b>12 Golden Rules</b>", body_style))
for rule in rules:
    story.append(Paragraph(rule, body_style))

# Build PDF
doc.build(story)
print("PDF built successfully")
