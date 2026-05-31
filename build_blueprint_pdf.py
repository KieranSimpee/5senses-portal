from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white, black
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
import datetime

# Colors
VIOLET = HexColor("#5e50fb")
LAVENDER = HexColor("#e8e6fe")
SOFT_LILAC = HexColor("#bab4fd")
BODY_TEXT = HexColor("#1a1a1f")
MUTED = HexColor("#9896ad")
WHITE = white
YELLOW = HexColor("#fffbeb")
YELLOW_BORDER = HexColor("#fcd34d")
GREEN = HexColor("#22c55e")
RED = HexColor("#ef4444")
AMBER = HexColor("#f59e0b")
DARK = HexColor("#1a0533")
NEUTRAL = HexColor("#e6e6e6")

doc = SimpleDocTemplate(
    "5S_Portal_Blueprint_v1.pdf",
    pagesize=A4,
    leftMargin=20*mm, rightMargin=20*mm,
    topMargin=20*mm, bottomMargin=20*mm
)

story = []

# ─── STYLES ───────────────────────────────────────────────
def s(name, **kw):
    return ParagraphStyle(name, **kw)

title_style = s("Title", fontSize=22, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_LEFT, spaceAfter=2)
subtitle_style = s("Sub", fontSize=10, fontName="Helvetica", textColor=HexColor("#bab4fd"), alignment=TA_LEFT, spaceAfter=0)
section_header = s("SecH", fontSize=13, fontName="Helvetica-Bold", textColor=VIOLET, spaceBefore=14, spaceAfter=6)
page_title = s("PageT", fontSize=11, fontName="Helvetica-Bold", textColor=DARK, spaceAfter=4)
body = s("Body", fontSize=9, fontName="Helvetica", textColor=BODY_TEXT, leading=14, spaceAfter=4)
body_muted = s("BodyM", fontSize=8, fontName="Helvetica", textColor=MUTED, leading=13, spaceAfter=3)
label = s("Label", fontSize=7, fontName="Helvetica-Bold", textColor=MUTED, spaceAfter=2, leading=10)
code_style = s("Code", fontSize=8, fontName="Courier", textColor=HexColor("#e8e6fe"), leading=13)
bullet_style = s("Bullet", fontSize=9, fontName="Helvetica", textColor=BODY_TEXT, leading=14, spaceAfter=2, leftIndent=12)

today = datetime.date.today().strftime("%d %B %Y")

# ─── COVER HEADER ─────────────────────────────────────────
header_data = [[
    Paragraph("5S PORTAL", title_style),
    ""
],[
    Paragraph("MASTER PAGE BLUEPRINT SYSTEM", subtitle_style),
    Paragraph(f"Version 1.0 · {today}", s("R", fontSize=8, fontName="Helvetica", textColor=HexColor("#bab4fd"), alignment=TA_RIGHT))
]]
header_table = Table(header_data, colWidths=[120*mm, 50*mm])
header_table.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,-1), DARK),
    ("TOPPADDING", (0,0), (-1,-1), 10),
    ("BOTTOMPADDING", (0,0), (-1,-1), 10),
    ("LEFTPADDING", (0,0), (-1,-1), 14),
    ("RIGHTPADDING", (0,0), (-1,-1), 14),
    ("ROUNDEDCORNERS", (0,0), (-1,-1), [8,8,8,8]),
    ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
]))
story.append(header_table)
story.append(Spacer(1, 8))

# ─── DOCUMENT PURPOSE ─────────────────────────────────────
purpose_text = (
    "<b>PURPOSE OF THIS DOCUMENT:</b> This is the single source of truth for the 5S Portal build. "
    "Every page, function, entity, and connection is defined here. Before any build session, "
    "run a diagnostic. Before pasting code to the builder, share the relevant page blueprint. "
    "After every change, update this document and the backend record. "
    "<b>Simpee, Edge/Copilot, and the Base44 Builder AI must all read from this document.</b>"
)
story.append(Paragraph(purpose_text, s("P", fontSize=9, fontName="Helvetica", textColor=BODY_TEXT, leading=14,
    borderColor=VIOLET, borderWidth=1, borderPadding=10, backColor=LAVENDER, spaceAfter=10)))

# ─── THE 3-STEP RULE ──────────────────────────────────────
story.append(Paragraph("THE 3-STEP RULE — Every Build Session", section_header))

rules = [
    ["STEP 1", "DIAGNOSE", "Ask Simpee 'run diagnostic' → get health report of all entities, functions, connections. Fix any issues before proceeding."],
    ["STEP 2", "ALIGN", "Share the relevant page blueprint to the builder AI. Everyone reads the same spec."],
    ["STEP 3", "BUILD", "Builder executes. Simpee validates output. Blueprint record updated in backend."],
]
rule_table = Table(rules, colWidths=[18*mm, 28*mm, 120*mm])
rule_table.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (0,-1), VIOLET),
    ("BACKGROUND", (1,0), (1,-1), LAVENDER),
    ("BACKGROUND", (2,0), (2,-1), WHITE),
    ("TEXTCOLOR", (0,0), (0,-1), WHITE),
    ("TEXTCOLOR", (1,0), (1,-1), DARK),
    ("TEXTCOLOR", (2,0), (2,-1), BODY_TEXT),
    ("FONTNAME", (0,0), (-1,-1), "Helvetica"),
    ("FONTNAME", (0,0), (0,-1), "Helvetica-Bold"),
    ("FONTNAME", (1,0), (1,-1), "Helvetica-Bold"),
    ("FONTSIZE", (0,0), (-1,-1), 9),
    ("PADDING", (0,0), (-1,-1), 8),
    ("GRID", (0,0), (-1,-1), 0.5, NEUTRAL),
    ("ROWBACKGROUNDS", (2,0), (2,-1), [WHITE]),
    ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
]))
story.append(rule_table)
story.append(Spacer(1, 12))

# ─── DESIGN SYSTEM ────────────────────────────────────────
story.append(Paragraph("DESIGN SYSTEM — Apply to All Pages", section_header))
design_data = [
    ["Token", "Value", "Usage"],
    ["Background", "#e8e6fe", "Page background (Lavender Wash)"],
    ["Container", "#ffffff", "All cards and panels"],
    ["Accent Violet", "#5e50fb", "Buttons, active states, highlights"],
    ["Soft Lilac", "#bab4fd", "Borders, secondary accents"],
    ["Body Text", "#1a1a1f", "All main text"],
    ["Muted Text", "#9896ad", "Labels, secondary info"],
    ["Headline Font", "Exo 2 / Exo", "All headings, uppercase labels"],
    ["Body Font", "Montserrat", "All body text, inputs"],
    ["Border Radius", "12–14px (cards), 8–9px (buttons)", "Consistent rounding"],
    ["Shadow", "0 2px 8px rgba(94,80,251,0.06)", "Subtle depth on cards"],
    ["Icons", "Text symbols only: ✓ ◎ ▤ ◉ ◈ ⌘", "No emoji, no cartoon icons"],
]
dt = Table(design_data, colWidths=[35*mm, 45*mm, 86*mm])
dt.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), DARK),
    ("TEXTCOLOR", (0,0), (-1,0), WHITE),
    ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
    ("FONTSIZE", (0,0), (-1,-1), 8),
    ("FONTNAME", (0,1), (-1,-1), "Helvetica"),
    ("TEXTCOLOR", (0,1), (-1,-1), BODY_TEXT),
    ("ROWBACKGROUNDS", (0,1), (-1,-1), [WHITE, LAVENDER]),
    ("GRID", (0,0), (-1,-1), 0.3, NEUTRAL),
    ("PADDING", (0,0), (-1,-1), 6),
    ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
]))
story.append(dt)
story.append(Spacer(1, 12))

# ─── SYSTEM DIAGNOSTIC ────────────────────────────────────
story.append(Paragraph(f"SYSTEM DIAGNOSTIC — Run: {today} 19:27 HKT", section_header))

diag_data = [
    ["Entity / Function", "Records", "Status", "Notes"],
    ["ComplianceItem", "6", "HEALTHY", ""],
    ["Expense", "23", "HEALTHY", ""],
    ["Invoice", "3", "HEALTHY", ""],
    ["Project", "4", "HEALTHY", ""],
    ["Brand", "2", "HEALTHY", ""],
    ["TeamMember", "3", "HEALTHY", "Kieran, Loreen, Wilson"],
    ["NoticeBoard", "10", "HEALTHY", "Blueprints stored here"],
    ["CalendarEvent", "7", "HEALTHY", ""],
    ["VaultItem", "22", "HEALTHY", ""],
    ["BankAccount", "3", "HEALTHY", ""],
    ["HRRecord", "4", "HEALTHY", ""],
    ["Document", "23", "HEALTHY", ""],
    ["Note", "6", "HEALTHY", ""],
    ["SChatMessage", "0", "HEALTHY", "Empty, ready for AI Hub"],
    ["aiCommandCentre (fn)", "—", "LIVE", "Responding OK"],
    ["processSChatInstruction (fn)", "—", "LIVE", "Responding OK"],
]
issues_data = [
    ["ID", "Issue", "Priority", "Fix Required"],
    ["ISSUE-001", "Home page is BLANK", "CRITICAL", "Rebuild pages/Home.jsx — 4 sections"],
    ["ISSUE-002", "AI Hub page is BLANK", "HIGH", "Build pages/AIHubPage.jsx clean"],
    ["ISSUE-003", "BuildProject entity API inaccessible", "MEDIUM", "Check entity schema in builder"],
    ["ISSUE-004", "SChatMessage not connected to any UI", "HIGH", "Wire to AI Hub chat feed"],
    ["ISSUE-005", "No OpenAI key configured", "MEDIUM", "Add key to enable full AI responses"],
]

dt2 = Table(diag_data, colWidths=[55*mm, 18*mm, 22*mm, 71*mm])
dt2.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), DARK),
    ("TEXTCOLOR", (0,0), (-1,0), WHITE),
    ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
    ("FONTSIZE", (0,0), (-1,-1), 8),
    ("FONTNAME", (0,1), (-1,-1), "Helvetica"),
    ("TEXTCOLOR", (0,1), (-1,-1), BODY_TEXT),
    ("TEXTCOLOR", (2,1), (2,-1), GREEN),
    ("FONTNAME", (2,1), (2,-1), "Helvetica-Bold"),
    ("ROWBACKGROUNDS", (0,1), (-1,-1), [WHITE, LAVENDER]),
    ("GRID", (0,0), (-1,-1), 0.3, NEUTRAL),
    ("PADDING", (0,0), (-1,-1), 5),
    ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
]))
story.append(dt2)
story.append(Spacer(1, 8))

story.append(Paragraph("ISSUES TO RESOLVE", s("IH", fontSize=10, fontName="Helvetica-Bold", textColor=RED, spaceAfter=5)))
dt3 = Table(issues_data, colWidths=[22*mm, 60*mm, 20*mm, 64*mm])
dt3.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), RED),
    ("TEXTCOLOR", (0,0), (-1,0), WHITE),
    ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
    ("FONTSIZE", (0,0), (-1,-1), 8),
    ("FONTNAME", (0,1), (-1,-1), "Helvetica"),
    ("TEXTCOLOR", (0,1), (-1,-1), BODY_TEXT),
    ("TEXTCOLOR", (2,1), (2,1), RED),
    ("TEXTCOLOR", (2,2), (2,2), AMBER),
    ("TEXTCOLOR", (2,3), (2,-1), AMBER),
    ("FONTNAME", (2,1), (2,-1), "Helvetica-Bold"),
    ("ROWBACKGROUNDS", (0,1), (-1,-1), [HexColor("#fff5f5"), WHITE]),
    ("GRID", (0,0), (-1,-1), 0.3, NEUTRAL),
    ("PADDING", (0,0), (-1,-1), 5),
    ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
]))
story.append(dt3)
story.append(Spacer(1, 12))

# ─── PAGE BLUEPRINTS ──────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("PAGE BLUEPRINTS", s("PBH", fontSize=14, fontName="Helvetica-Bold", textColor=VIOLET, spaceAfter=6)))

pages = [
    {
        "name": "HOME",
        "file": "pages/Home.jsx",
        "route": "/home",
        "status": "BLANK — Priority 1 Rebuild",
        "status_color": RED,
        "audience": "All users (view) | Admin + Manager (post notices) | Admin (AI Hub entry)",
        "purpose": "First screen every user lands on. Shows what's happening today — calendar events, company announcements, and for Kieran (Admin), direct access to the AI Hub command centre.",
        "sections": [
            ("1 — HEADER", "Greeting with user name (time-based: morning/afternoon/evening) + HK date + role badge top-right"),
            ("2 — SHARED CALENDAR", "CalendarEvent entity. 7-day horizontal strip. Color by type: Compliance=#f59e0b, Meeting=#3b82f6, Deadline=#ef4444. Admin+Manager can add events. All users view."),
            ("3 — COMPANY NOTICE BOARD", "NoticeBoard entity. Pinned notices first. Priority color: HIGH=red left border, MEDIUM=amber, LOW=green. Admin+Manager can post. Max 5 shown + View All link."),
            ("4 — AI HUB BANNER", "Admin only. Full-width gradient banner (#5e50fb → #8c82fc). Title: AI Hub — Command Centre. Button: OPEN AI HUB → navigates to /ai-hub."),
        ],
        "data": "CalendarEvent, NoticeBoard, User",
        "permissions": "All=view | Admin+Manager=post notices, add events | Admin=see AI Hub banner",
        "issues": ["ISSUE-001: Page is blank — needs full rebuild"]
    },
    {
        "name": "AI HUB",
        "file": "pages/AIHubPage.jsx",
        "route": "/ai-hub",
        "status": "BLANK — Priority 2 Rebuild",
        "status_color": RED,
        "audience": "Admin only (Kieran)",
        "purpose": "Highest authority command centre. Single chat interface where Kieran types one message, Simpee + Copilot analyse and respond, code is generated ready to paste or auto-send to builder. Diagnose issues, request features, build connections — all from one place.",
        "sections": [
            ("A — STATUS BAR", "Simpee online (green pulsing dot) | Copilot ready (blue dot) | Builder standby (grey dot). Live connection status visible at all times."),
            ("B — CHAT FEED", "SChatMessage entity. User messages right-aligned (#5e50fb bg, white text). AI messages left-aligned (white card, #e6e6e6 border). AI responses render as 3 cards: Analysis (white) + Suggestion (white) + Code/Builder Brief (yellow #fffbeb). Each AI response has [COPY CODE] and [SEND TO BUILDER] buttons."),
            ("C — INPUT BAR", "Pinned to bottom. Intent chips above input: Diagnose / Build / Fix / Connect / Ask. SEND saves to SChatMessage first, then calls aiCommandCentre. Ctrl+Enter to send."),
            ("D — QUICK COMMANDS", "Pre-set buttons: Run Diagnostic | Show All Pages | Show Functions | What to build next | Check entity health"),
        ],
        "data": "SChatMessage entity. API: POST https://simpee-62ac123d.base44.app/functions/aiCommandCentre",
        "permissions": "Admin only",
        "issues": ["ISSUE-002: Needs clean rebuild", "ISSUE-004: SChatMessage not connected to UI yet", "ISSUE-005: No OpenAI key — responses are placeholder"]
    },
    {
        "name": "DASHBOARD",
        "file": "pages/Dashboard.jsx",
        "route": "/dashboard",
        "status": "LIVE — Do not rebuild",
        "status_color": GREEN,
        "audience": "Admin + Manager",
        "purpose": "Executive view. Live KPIs, top risks, email summary, cost reduction suggestions.",
        "sections": [
            ("Stats Row", "Total Expenses (HKD), Pending Approvals, Renewals Due (30d), Compliance Items"),
            ("Risk Panel", "Expired renewals, overdue items"),
            ("Email Summary", "Recent emails from connected Outlook"),
            ("Cost Reduction", "AI-generated cost saving suggestions"),
        ],
        "data": "Expense, ComplianceItem, RenewalItem, Outlook connector",
        "permissions": "Admin + Manager",
        "issues": []
    },
    {
        "name": "FINANCE",
        "file": "pages/FinancePage.jsx",
        "route": "/finance",
        "status": "LIVE — Stable",
        "status_color": GREEN,
        "audience": "Admin + Finance role",
        "purpose": "Expense ledger (23 records), subscriptions tracker, bank account overview.",
        "sections": [
            ("Expense Tab", "Full expense table with receipt links, status toggle, category filter"),
            ("Subscriptions Tab", "Recurring services with costs, renewal dates, toggle active/inactive"),
            ("Bank Accounts", "3 accounts: balance overview, entity, currency"),
        ],
        "data": "Expense (23), BankAccount (3)",
        "permissions": "Admin=full | Finance=read+add expenses",
        "issues": []
    },
    {
        "name": "INVOICES",
        "file": "pages/InvoicePage.jsx",
        "route": "/invoices",
        "status": "LIVE — Stable",
        "status_color": GREEN,
        "audience": "Admin + Finance",
        "purpose": "Create, view, and manage client invoices. PDF generation. Airwallex sync.",
        "sections": [
            ("Invoice List", "Table of all invoices with status, amount, client, due date"),
            ("Create Invoice", "Modal form: client, line items, tax, currency, payment method"),
            ("PDF Export", "Generate branded PDF invoice"),
        ],
        "data": "Invoice (3)",
        "permissions": "Admin=full | Finance=view+create",
        "issues": []
    },
]

for pg in pages:
    # Page header bar
    status_data = [[
        Paragraph(f"PAGE — {pg['name']}", s("PH", fontSize=11, fontName="Helvetica-Bold", textColor=WHITE)),
        Paragraph(pg["status"], s("PS", fontSize=8, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_RIGHT)),
    ]]
    hdr_color = VIOLET if "BLANK" in pg["status"] else (GREEN if "LIVE" in pg["status"] else AMBER)
    st = Table(status_data, colWidths=[110*mm, 56*mm])
    st.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), hdr_color),
        ("PADDING", (0,0), (-1,-1), 8),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
    ]))
    story.append(st)

    # Page meta row
    meta_data = [
        [Paragraph(f"<b>File:</b> {pg['file']}", body_muted),
         Paragraph(f"<b>Route:</b> {pg['route']}", body_muted),
         Paragraph(f"<b>Data:</b> {pg['data']}", body_muted)],
    ]
    mt = Table(meta_data, colWidths=[55*mm, 35*mm, 76*mm])
    mt.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), LAVENDER),
        ("PADDING", (0,0), (-1,-1), 6),
        ("GRID", (0,0), (-1,-1), 0.3, NEUTRAL),
    ]))
    story.append(mt)

    # Audience + purpose
    story.append(Spacer(1, 4))
    story.append(Paragraph(f"<b>AUDIENCE:</b> {pg['audience']}", body))
    story.append(Paragraph(f"<b>PERMISSIONS:</b> {pg['permissions']}", body))
    story.append(Paragraph(f"<b>PURPOSE:</b> {pg['purpose']}", body))
    story.append(Spacer(1, 4))

    # Sections
    story.append(Paragraph("SECTIONS:", label))
    for sec_name, sec_desc in pg["sections"]:
        sec_data = [[
            Paragraph(sec_name, s("SN", fontSize=8, fontName="Helvetica-Bold", textColor=VIOLET)),
            Paragraph(sec_desc, s("SD", fontSize=8, fontName="Helvetica", textColor=BODY_TEXT, leading=13)),
        ]]
        sec_t = Table(sec_data, colWidths=[35*mm, 131*mm])
        sec_t.setStyle(TableStyle([
            ("BACKGROUND", (0,0), (0,0), LAVENDER),
            ("BACKGROUND", (1,0), (1,0), WHITE),
            ("GRID", (0,0), (-1,-1), 0.3, NEUTRAL),
            ("PADDING", (0,0), (-1,-1), 6),
            ("VALIGN", (0,0), (-1,-1), "TOP"),
        ]))
        story.append(sec_t)

    # Issues
    if pg["issues"]:
        story.append(Spacer(1, 3))
        for issue in pg["issues"]:
            story.append(Paragraph(f"⚠ {issue}", s("IS", fontSize=8, fontName="Helvetica", textColor=RED, leading=12)))

    story.append(Spacer(1, 10))

# ─── PERMISSION MATRIX ────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("PERMISSION MATRIX", section_header))

perm_data = [
    ["Page", "Admin", "Manager", "Staff", "Guest"],
    ["Home", "Read+Write", "Read+Write", "Read", "—"],
    ["Dashboard", "Read", "Read", "—", "—"],
    ["Finance", "Read+Write", "Read", "—", "—"],
    ["Invoices", "Read+Write", "Read", "—", "—"],
    ["Compliance", "Read+Write", "Read+Write", "Read", "—"],
    ["HR", "Read+Write", "Read", "—", "—"],
    ["Vault", "Read+Write", "—", "—", "—"],
    ["Brand", "Read+Write", "Read+Write", "Read", "—"],
    ["Documents", "Read+Write", "Read+Write", "Read", "—"],
    ["Notes", "Read+Write", "Read+Write", "Read+Write", "—"],
    ["AI Hub", "Read+Write", "—", "—", "—"],
]
pm = Table(perm_data, colWidths=[40*mm, 32*mm, 32*mm, 28*mm, 24*mm])
pm.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), DARK),
    ("TEXTCOLOR", (0,0), (-1,0), WHITE),
    ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
    ("FONTSIZE", (0,0), (-1,-1), 8),
    ("FONTNAME", (0,1), (-1,-1), "Helvetica"),
    ("TEXTCOLOR", (0,1), (-1,-1), BODY_TEXT),
    ("ROWBACKGROUNDS", (0,1), (-1,-1), [WHITE, LAVENDER]),
    ("GRID", (0,0), (-1,-1), 0.3, NEUTRAL),
    ("PADDING", (0,0), (-1,-1), 6),
    ("ALIGN", (1,0), (-1,-1), "CENTER"),
    ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
]))
story.append(pm)
story.append(Spacer(1, 12))

# ─── HOW TO USE ───────────────────────────────────────────
story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceAfter=8))
story.append(Paragraph("HOW TO USE THIS BLUEPRINT WITH THE BUILDER AI", section_header))

how_text = [
    "1. Pick the page you want to build from this document.",
    "2. Copy its blueprint section (sections, data, permissions, purpose).",
    "3. Paste this prefix first: 'Build this page for the 5S Portal exactly as described. Use the SIMPLEX-ITY design system: bg #e8e6fe, white cards, #5e50fb accent, Exo 2 headlines, Montserrat body. No emoji icons.'",
    "4. Paste the blueprint section after it.",
    "5. Ask Simpee to validate the output once builder is done.",
    "6. Simpee updates the blueprint record in the portal backend with the new status.",
]
for h in how_text:
    story.append(Paragraph(h, bullet_style))

story.append(Spacer(1, 10))

# ─── FOOTER ───────────────────────────────────────────────
footer_data = [[
    Paragraph("5S Portal · SIMPLEX-ITY · Confidential", s("F1", fontSize=7, fontName="Helvetica", textColor=MUTED)),
    Paragraph(f"Generated by Simpee · {today} · Version 1.0", s("F2", fontSize=7, fontName="Helvetica", textColor=MUTED, alignment=TA_RIGHT)),
]]
ft = Table(footer_data, colWidths=[83*mm, 83*mm])
ft.setStyle(TableStyle([
    ("TOPPADDING", (0,0), (-1,-1), 8),
    ("LINEABOVE", (0,0), (-1,0), 0.5, NEUTRAL),
]))
story.append(ft)

doc.build(story)
print("PDF built successfully")
