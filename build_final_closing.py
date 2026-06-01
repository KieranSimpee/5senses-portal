from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.units import mm
from reportlab.lib.enums import TA_CENTER, TA_LEFT

ACCENT = HexColor("#5e50fb")
DARK = HexColor("#1a1a1f")
MUTED = HexColor("#9896ad")
WHITE = HexColor("#ffffff")
GREEN = HexColor("#22c55e")
AMBER = HexColor("#f59e0b")
RED = HexColor("#ef4444")

def P(text, size=8.5, color=None, bold=False, after=3):
    return Paragraph(f"<b>{text}</b>" if bold else text,
        ParagraphStyle('p', fontName='Helvetica-Bold' if bold else 'Helvetica',
            fontSize=size, textColor=color or DARK, spaceAfter=after, leading=13))

def section_header(title, color=None):
    t = Table([[Paragraph(f"<b>{title}</b>", ParagraphStyle('sh', fontName='Helvetica-Bold',
                fontSize=9, textColor=WHITE))]], colWidths=[174*mm])
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),color or ACCENT),
                            ('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6),
                            ('LEFTPADDING',(0,0),(-1,-1),8)]))
    return t

def info_row(rows, col_w=None):
    w = col_w or [44*mm, 130*mm]
    data = [[Paragraph(f"<b>{r[0]}</b>", ParagraphStyle('lbl', fontName='Helvetica-Bold', fontSize=8, textColor=MUTED)),
             Paragraph(r[1], ParagraphStyle('val', fontName='Helvetica', fontSize=8.5, textColor=DARK, leading=13))] for r in rows]
    t = Table(data, colWidths=w)
    t.setStyle(TableStyle([('ROWBACKGROUNDS',(0,0),(-1,-1),[WHITE, HexColor("#f8f8ff")]),
                            ('GRID',(0,0),(-1,-1),0.3,HexColor("#e6e6e6")),
                            ('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),4),
                            ('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),6),
                            ('VALIGN',(0,0),(-1,-1),'TOP')]))
    return t

def status_table(rows):
    col_w = [60*mm, 24*mm, 90*mm]
    hdr = [Paragraph(f"<b>{h}</b>", ParagraphStyle('th', fontName='Helvetica-Bold', fontSize=8, textColor=WHITE))
           for h in ["Item", "Status", "Detail"]]
    data = [hdr]
    for r in rows:
        color = GREEN if "✅" in r[1] else (AMBER if "🟡" in r[1] else RED)
        data.append([
            Paragraph(r[0], ParagraphStyle('n', fontName='Helvetica-Bold', fontSize=8, textColor=DARK)),
            Paragraph(r[1], ParagraphStyle('s', fontName='Helvetica-Bold', fontSize=8, textColor=color)),
            Paragraph(r[2], ParagraphStyle('d', fontName='Helvetica', fontSize=8, textColor=DARK, leading=12)),
        ])
    t = Table(data, colWidths=col_w, repeatRows=1)
    t.setStyle(TableStyle([
        ('BACKGROUND',(0,0),(-1,0),DARK),
        ('ROWBACKGROUNDS',(0,1),(-1,-1),[WHITE, HexColor("#f8f8ff")]),
        ('GRID',(0,0),(-1,-1),0.3,HexColor("#e6e6e6")),
        ('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),4),
        ('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),6),
        ('VALIGN',(0,0),(-1,-1),'TOP'),
    ]))
    return t

doc = SimpleDocTemplate("/app/Blueprint_FINAL_Closing_v15.pdf", pagesize=A4,
    rightMargin=18*mm, leftMargin=18*mm, topMargin=14*mm, bottomMargin=14*mm)
story = []

# Cover
cover_data = [
    [Paragraph("<b>5S PORTAL — CLOSING BLUEPRINT</b>", ParagraphStyle('cv', fontName='Helvetica-Bold', fontSize=17, textColor=WHITE, alignment=TA_CENTER))],
    [Paragraph("Blueprint v1.5 LOCKED · Session Close · 1 June 2026", ParagraphStyle('cs', fontName='Helvetica', fontSize=9, textColor=WHITE, alignment=TA_CENTER))],
    [Paragraph("SIMPLEX-ITY · Prepared by Simpee · All decisions confirmed by Kieran Li", ParagraphStyle('cb', fontName='Helvetica', fontSize=8, textColor=HexColor("#bab4fd"), alignment=TA_CENTER))],
]
ct = Table(cover_data, colWidths=[174*mm])
ct.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),ACCENT),('TOPPADDING',(0,0),(-1,-1),10),('BOTTOMPADDING',(0,0),(-1,-1),10)]))
story += [ct, Spacer(1, 8)]

# SECTION 1 — Current status
story += [section_header("SECTION 1 — WHAT WAS COMPLETED TODAY (1 June 2026)"), Spacer(1,4)]
story += [status_table([
    ["Blueprint v1.5 LOCKED", "✅ DONE", "All 5 decisions confirmed. PDF generated and saved."],
    ["AIConnector — Gemini", "✅ DONE", "Duty updated to RESEARCHER + LOGGER. Free tier confirmed."],
    ["AIConnector — Claude Sonnet", "✅ DONE", "Duty updated to ANALYST + MONITOR AI."],
    ["AIConnector — Copilot", "✅ DONE", "Validator ONLY. Monitor duty removed."],
    ["CodeRabbit AI", "✅ HIRED", "Added to AIConnector as QC INSPECTOR (pending_hire). Account registered at coderabbit.ai. Awaiting GitHub repo connection."],
    ["Ethics AI", "✅ DEFERRED", "Moved to v1.7. Research team handles compliance ad-hoc."],
    ["Canva MCP", "✅ CONFIGURED", "MCP config added to agent workspace. OAuth deferred — Canva app review takes weeks. ReportLab handles documents in the interim."],
    ["aiCommandCentre function", "✅ DEPLOYED", "SChatMessage mirror removed. All responses now go to Notice entity (section=code_ready) only — the AI Hub inbox."],
    ["consultCopilot function", "✅ DEPLOYED", "Changed from section=schat to section=code_ready. Copilot responses now appear in AI Hub inbox."],
    ["SChatMirrorPage.jsx", "🟡 PENDING", "File still exists in /app/pages/. Builder must remove this page and its route from App.jsx in Blueprint B."],
    ["processSChatInstruction", "🟡 LEGACY", "Still deployed. Will be superseded by aiCommandCentre when Blueprint B is built. Leave until B is confirmed."],
    ["Blueprint A — Calendar", "🟡 IN PROGRESS", "PDF generated. Kieran uploading to builder now."],
    ["Blueprint B — AI Hub", "⏳ QUEUED", "Build after Blueprint A is confirmed working."],
])]
story += [Spacer(1, 8)]

# SECTION 2 — What Blueprint B must clean up
story += [section_header("SECTION 2 — WHAT BLUEPRINT B MUST CLEAN UP (Builder instructions)"), Spacer(1,4)]
story += [P("When Kieran pastes Blueprint B into the builder, the builder must also remove all S-Chat legacy:", after=4)]
story += [info_row([
    ("Remove file", "pages/SChatMirrorPage.jsx — delete this file completely"),
    ("Remove route", "Any route pointing to /schat or /s-chat in App.jsx — remove the import and route entry"),
    ("Remove entity", "SChatMessage entity — do NOT delete it (it has old log data). Just stop referencing it in any new page code."),
    ("Remove function link", "processSChatInstruction — leave the function deployed (don't delete). Just don't wire any new UI button to it. It becomes a legacy dormant function."),
    ("AI Hub only", "All AI responses go to Notice entity (section=code_ready). The AI Hub page reads from Notice entity for its inbox. SChatMessage is no longer the live log."),
])]
story += [Spacer(1, 8)]

# SECTION 3 — AI Team final roster
story += [section_header("SECTION 3 — FINAL AI TEAM ROSTER v1.5 (for builder reference)"), Spacer(1,4)]
roster = [
    ["ORCHESTRATOR", "Simpee (Base44)", "✅ ACTIVE", "CEO — governance, routing, deploy gating"],
    ["RESEARCHER + LOGGER", "Gemini 2.0 Flash", "✅ ACTIVE", "Research + session memory. Free tier."],
    ["ANALYST + MONITOR", "Claude Sonnet 4.6", "✅ ACTIVE", "Feasibility + cross-role monitoring"],
    ["STRATEGIST", "Claude Opus 4.6", "✅ ACTIVE", "ROI framing, solution ranking"],
    ["THINK TANK", "Claude Opus 4.8", "✅ ACTIVE", "Deep reasoning, alternatives"],
    ["ENGINEER", "GPT-5.4", "✅ ACTIVE", "Code writing and debugging"],
    ["ARCHITECT", "GPT-5.5", "✅ ACTIVE", "System design, infrastructure"],
    ["VALIDATOR", "Copilot / Edge", "✅ ACTIVE", "Final gate — syntax, security, Azure"],
    ["QC INSPECTOR", "CodeRabbit AI", "🟡 PENDING REPO", "AI code review. Hire: coderabbit.ai. $24/mo."],
    ["ETHICS AI", "Research Team", "✅ DEFERRED v1.7", "Ad-hoc compliance when required"],
]
hdr = [Paragraph(f"<b>{h}</b>", ParagraphStyle('th', fontName='Helvetica-Bold', fontSize=8, textColor=WHITE))
       for h in ["Duty", "Model", "Status", "Role"]]
rdata = [hdr] + [[Paragraph(r[i], ParagraphStyle('td', fontName='Helvetica-Bold' if i==0 else 'Helvetica',
    fontSize=7.5, textColor=DARK)) for i in range(4)] for r in roster]
rt = Table(rdata, colWidths=[36*mm, 36*mm, 36*mm, 66*mm], repeatRows=1)
rt.setStyle(TableStyle([
    ('BACKGROUND',(0,0),(-1,0),ACCENT),
    ('ROWBACKGROUNDS',(0,1),(-1,-1),[WHITE, HexColor("#f8f8ff")]),
    ('GRID',(0,0),(-1,-1),0.3,HexColor("#e6e6e6")),
    ('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),4),
    ('LEFTPADDING',(0,0),(-1,-1),5),('RIGHTPADDING',(0,0),(-1,-1),5),
    ('VALIGN',(0,0),(-1,-1),'TOP'),
]))
story += [rt, Spacer(1, 8)]

# SECTION 4 — Governance rules
story += [section_header("SECTION 4 — GOVERNANCE GOLDEN RULES v1.5 (permanent standing orders)"), Spacer(1,4)]
rules = [
    ("Rule 1", "No deploy without QC Inspector (CodeRabbit) + Validator (Copilot) + Orchestrator (Simpee) all approving"),
    ("Rule 2", "3 failures → Full 9-step all-AI review → WhatsApp Kieran with ranked solutions A/B/C. He decides."),
    ("Rule 3", "Copilot = Validator ONLY. Claude Sonnet = Analyst + Monitor. No role conflicts."),
    ("Rule 4", "Gemini = Researcher + Logger/Memory. Free tier. No extra cost."),
    ("Rule 5", "Ethics AI deferred to v1.7. Research team handles compliance ad-hoc when required."),
    ("Rule 6", "Kieran never troubleshoots. He receives a ranked briefing and makes one decision."),
    ("Rule 7", "No AI approves its own work. Reviewer must always be a different role."),
    ("Rule 8", "Blueprint-first. All changes need a blueprint before any code is written."),
    ("Rule 9", "AI Hub is the single command centre. No S-Chat. No mirror pages. One inbox: Notice entity."),
    ("Rule 10", "DESIGNER role (Canva) is roadmapped for v1.6. Not to be built before v1.6 blueprint is written."),
]
story += [info_row(rules)]
story += [Spacer(1, 8)]

# SECTION 5 — Next steps
story += [section_header("SECTION 5 — WHAT HAPPENS NEXT"), Spacer(1,4)]
next_steps = [
    ("NOW", "Kieran pastes Blueprint A (Calendar page) into Base44 builder. Builder executes."),
    ("AFTER A CONFIRMED", "Kieran reports back. Simpee validates. If all 9 checks pass → proceed to Blueprint B."),
    ("BLUEPRINT B", "Builder rebuilds AI Hub page. Removes SChatMirrorPage. Cleans S-Chat routes from App.jsx."),
    ("AFTER B CONFIRMED", "Full portal tested end-to-end. Both pages stable. Session closes cleanly."),
    ("NEXT SESSION", "Begin v1.6 planning: CodeRabbit GitHub repo connection, DESIGNER role spec, dry-run 8-stage workflow."),
    ("CODERABBIT", "Kieran connects GitHub account. Creates repo. Links to CodeRabbit dashboard. Simpee helps."),
]
story += [info_row(next_steps, col_w=[30*mm, 144*mm])]
story += [Spacer(1, 8)]

story += [HRFlowable(width="100%", thickness=0.5, color=MUTED), Spacer(1,4)]
story += [P("Closing Blueprint v1.5 · SIMPLEX-ITY · 1 June 2026 · Prepared by Simpee", size=7.5, color=MUTED)]
story += [P("Blueprint A (Calendar): uploaded ✅ · Blueprint B (AI Hub): queued ⏳ · v1.5 LOCKED ✅", size=7.5, color=MUTED)]

doc.build(story)
print("Closing blueprint done ✅")
