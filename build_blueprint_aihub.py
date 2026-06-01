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
BLUE = HexColor("#3b82f6")

def style(name, font='Helvetica', size=9, color=None, bold=False, align=TA_LEFT, leading=13, after=3):
    return ParagraphStyle(name, fontName='Helvetica-Bold' if bold else font, fontSize=size,
                          textColor=color or DARK, alignment=align, leading=leading, spaceAfter=after)

def P(text, **kw): return Paragraph(text, style('p', **kw))
def Code(text):
    return Paragraph(f"<font name='Courier' size='7'>{text}</font>",
        ParagraphStyle('code', fontName='Courier', fontSize=7, textColor=DARK,
                       backColor=HexColor("#f4f4f8"), leading=11, spaceAfter=2,
                       leftIndent=6, rightIndent=6, borderPadding=4))

def section_header(title, color=None):
    c = color or ACCENT
    t = Table([[Paragraph(f"<b>{title}</b>", ParagraphStyle('sh', fontName='Helvetica-Bold',
                fontSize=9, textColor=WHITE))]], colWidths=[174*mm])
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),c),
                            ('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6),
                            ('LEFTPADDING',(0,0),(-1,-1),8)]))
    return t

def cover(title, sub, badge):
    d = [[Paragraph(f"<b>{title}</b>", ParagraphStyle('cv', fontName='Helvetica-Bold', fontSize=16,
                    textColor=WHITE, alignment=TA_CENTER))],
         [Paragraph(sub, ParagraphStyle('cs', fontName='Helvetica', fontSize=8,
                    textColor=WHITE, alignment=TA_CENTER))],
         [Paragraph(badge, ParagraphStyle('cb', fontName='Helvetica-Bold', fontSize=8,
                    textColor=WHITE, alignment=TA_CENTER))]]
    t = Table(d, colWidths=[174*mm])
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),DARK),('ALIGN',(0,0),(-1,-1),'CENTER'),
                            ('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8)]))
    return t

def info_row(rows, col_w=None):
    w = col_w or [40*mm, 134*mm]
    data = [[Paragraph(f"<b>{r[0]}</b>", ParagraphStyle('lbl', fontName='Helvetica-Bold', fontSize=8, textColor=MUTED)),
             Paragraph(r[1], ParagraphStyle('val', fontName='Helvetica', fontSize=8.5, textColor=DARK, leading=13))] for r in rows]
    t = Table(data, colWidths=w)
    t.setStyle(TableStyle([('ROWBACKGROUNDS',(0,0),(-1,-1),[WHITE, HexColor("#f8f8ff")]),
                            ('GRID',(0,0),(-1,-1),0.3,HexColor("#e6e6e6")),
                            ('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),4),
                            ('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),6),
                            ('VALIGN',(0,0),(-1,-1),'TOP')]))
    return t

docB = SimpleDocTemplate("/app/Blueprint_B_AIHub.pdf", pagesize=A4,
    rightMargin=18*mm, leftMargin=18*mm, topMargin=14*mm, bottomMargin=14*mm)
story = []

story += [cover("BLUEPRINT B — AI HUB PAGE (S-CHAT COMMAND CENTRE)",
    "5S Portal · SIMPLEX-ITY · Phase 2 Build · 1 June 2026",
    "Build this AFTER Blueprint A (Calendar) is confirmed working"), Spacer(1,8)]

story += [P("⚠️  PREREQUISITE: Blueprint A (Shared Calendar) must be built and confirmed by Kieran first. Do NOT build this page until Kieran gives the go-ahead.", color=RED, bold=True), Spacer(1,6)]

story += [section_header("STEP 1 — PAGE IDENTITY"), Spacer(1,3)]
story += [info_row([
    ("File", "pages/AIHubPage.jsx (rebuild from scratch — replace any existing version)"),
    ("Route", "/ai-hub"),
    ("Menu label", "AI Hub"),
    ("Audience", "Admin only (Kieran). All other roles see a 'Access Restricted' message."),
    ("Purpose", "Kieran's command centre. He types instructions here. Simpee responds. Code is generated and ready to paste into the builder."),
    ("Entity — messages", "SChatMessage (fields: sender, sender_type, message, timestamp, session_id, read)"),
    ("Entity — notices", "Notice (fields: title, content, type, posted_by, section, pinned, expires_date)"),
]), Spacer(1,8)]

story += [section_header("STEP 2 — DESIGN SYSTEM"), Spacer(1,3)]
story += [info_row([
    ("Page background", "#e8e6fe (Lavender Wash)"),
    ("Card / chat area bg", "#ffffff"),
    ("Accent", "#5e50fb (Violet)"),
    ("User message bg", "#5e50fb — white text, right-aligned"),
    ("AI message bg", "#ffffff — #1a1a1f text, left-aligned, border #e6e6e6"),
    ("Code block bg", "#1a1a1f — white monospace text, COPY button top-right"),
    ("Builder card bg", "#fffbeb — amber border #fcd34d"),
    ("System notice", "Centre-aligned, italic, #9896ad"),
    ("Fonts", "Exo 2 headlines · Montserrat body · Courier for code"),
    ("No icons", "Text symbols only ◎ ▤ ✓ ◉. No cartoon pictograms."),
]), Spacer(1,8)]

story += [section_header("STEP 3 — LAYOUT (full height, single column, 3 zones)"), Spacer(1,3)]
story += [P("ZONE A — Top Status Bar (fixed, does not scroll)")]
story += [info_row([
    ("Title", '"AI HUB" — Exo 2, bold, #5e50fb, 20px. Left-aligned.'),
    ("Status row", "3 status dots: [● Simpee online]  [● Copilot ready]  [○ Builder standby]. Green dot = active (#22c55e), grey = standby (#9896ad). Small Montserrat 11px text."),
    ("Subtitle", '"Your command centre — type anything" — Montserrat, italic, #9896ad, 12px'),
]), Spacer(1,6)]

story += [P("ZONE B — Chat Feed (scrollable, fills remaining height between A and C)")]
story += [info_row([
    ("Load messages", "On mount: SChatMessage.filter({ session_id: 'main' }) — sorted by timestamp ASC. Show last 50 messages."),
    ("Auto-scroll", "Always scroll to bottom when new message arrives."),
    ("User bubble", "Right-aligned. bg=#5e50fb, white text, 14px radius, max-width 70%, Montserrat 14px."),
    ("AI bubble", "Left-aligned. bg=#ffffff, #1a1a1f text, border 1px #e6e6e6, 14px radius, max-width 80%."),
    ("AI structured response", "When sender_type='ai', parse the message JSON and render as 3 cards stacked inside the bubble: Card 1 ANALYSIS (white), Card 2 SUGGESTION (white), Card 3 CODE/BRIEF (bg=#fffbeb border=#fcd34d). Each card has a label in Exo 2 bold #5e50fb."),
    ("Code card", "Inside Card 3: dark bg #1a1a1f, white Courier text, COPY button (top-right, small, bg=#5e50fb white text). SEND TO BUILDER button below: bg=#f59e0b, #1a1a1f text."),
    ("Timestamp", "Shown below each bubble in #9896ad 10px Montserrat."),
    ("Empty state", 'Show centred: "No messages yet. Type your first instruction below." — muted italic.'),
]), Spacer(1,6)]

story += [P("ZONE C — Input Bar (fixed to bottom, does not scroll)")]
story += [info_row([
    ("Intent chips", "Shown above the input. 5 chips: [Diagnose issue] [Build feature] [Fix bug] [Add connection] [Ask question]. One selectable at a time. Selected chip: bg=#5e50fb white text. Unselected: bg=#e8e6fe #5e50fb text. Clicking a chip pre-selects intent."),
    ("Text input", 'Full-width. Placeholder: "Type your instruction, question, or command…" Montserrat 14px. Border #bab4fd, focus border #5e50fb. Radius 9px.'),
    ("Send button", '"SEND" — bg=#5e50fb, white, Exo 2 bold, 9px radius. Right of input. Ctrl+Enter also sends.'),
    ("On SEND action", "See Step 4 below for full flow."),
    ("Disabled state", "While AI is responding, dim the input and show 'Simpee is thinking…' placeholder. Re-enable when response arrives."),
]), Spacer(1,8)]

story += [section_header("STEP 4 — SEND ACTION FLOW (exact sequence)"), Spacer(1,3)]
story += [info_row([
    ("1. Save user msg", "SChatMessage.create({ sender: currentUser.full_name, sender_type: 'user', message: inputText, timestamp: new Date().toISOString(), session_id: 'main', read: true })"),
    ("2. Show typing", "Append a temporary typing indicator bubble (left-aligned, 3 animated dots, bg=#f4f4f8). Auto-scroll to bottom."),
    ("3. Call function", "POST to: https://simpee-62ac123d.base44.app/functions/processSChatInstruction\nBody: { instruction: `[${selectedIntent}] ${inputText}`, posted_by: currentUser.full_name }"),
    ("4. Handle response", "Remove typing indicator. Parse response JSON."),
    ("5. Save AI msg", "SChatMessage.create({ sender: 'Simpee', sender_type: 'ai', message: JSON.stringify(response), timestamp: new Date().toISOString(), session_id: 'main', read: false })"),
    ("6. Render", "Display as 3-card structured response (Analysis + Suggestion + Code) inside an AI bubble."),
    ("7. Error handling", "If fetch fails: show error bubble 'Simpee is temporarily unavailable. Please try again.' in red-bordered card. Do not crash."),
    ("8. Clear input", "After successful send, clear the input field and reset selected intent chip."),
]), Spacer(1,8)]

story += [section_header("STEP 5 — QUICK COMMAND PANEL (collapsible right sidebar or bottom drawer)"), Spacer(1,3)]
story += [info_row([
    ("Toggle", "Small '⌘ QUICK COMMANDS' button — top right of Zone B. Click to expand/collapse."),
    ("Commands list", "5 pre-set one-click commands:\n1. 'What pages exist in this app?'\n2. 'Show me all deployed functions'\n3. 'What entities have data?'\n4. 'Check for errors or broken connections'\n5. 'What should I build next?'"),
    ("Click action", "Clicking a command fills the input box with that text + auto-selects 'Diagnose issue' intent. User still clicks SEND."),
    ("Style", "Each command is a white card, #5e50fb left border, Montserrat 13px, hover bg=#e8e6fe."),
]), Spacer(1,8)]

story += [section_header("STEP 6 — INBOX PANEL (below chat feed, collapsible)"), Spacer(1,3)]
story += [P("Show the latest CODE READY and system notices from the Notice entity directly inside the AI Hub, so Kieran never has to leave this page.")]
story += [info_row([
    ("Load", "Notice.filter({ section: 'code_ready' }) — sorted by created_date DESC — limit 5."),
    ("Card style", "bg=#fffbeb, amber left border, title in Exo 2 bold, content preview in Montserrat 12px, posted_by + date in muted 10px."),
    ("Actions", "Each card has: [COPY CODE] button (copies content to clipboard) + [DISMISS] button (unpins the notice)."),
    ("Empty state", '"No pending code ready. All clear ✓" — green text, centred.'),
    ("Section label", '"INBOX — CODE READY" — Exo 2, uppercase, #5e50fb, 11px.'),
]), Spacer(1,8)]

story += [section_header("STEP 7 — ACCESS CONTROL"), Spacer(1,3)]
story += [info_row([
    ("Admin (Kieran)", "Full access — all zones, all actions."),
    ("All other roles", "Show a centred card: title 'AI Hub — Restricted Access', body 'This area is for administrators only. Contact Kieran for access.', bg white, accent border #5e50fb. No other content visible."),
]), Spacer(1,8)]

story += [section_header("STEP 8 — QUALITY CHECKS (builder must verify before done)"), Spacer(1,3)]
story += [info_row([
    ("Check 1", "Status bar shows 3 dots with correct colours"),
    ("Check 2", "Chat feed loads SChatMessage records and displays correctly (user right, AI left)"),
    ("Check 3", "AI message with JSON renders as 3 cards — not raw JSON text"),
    ("Check 4", "Code block inside Card 3 has COPY button that works"),
    ("Check 5", "Intent chips are selectable, only one active at a time"),
    ("Check 6", "SEND saves message, calls function, shows typing indicator, renders response"),
    ("Check 7", "Input disabled while AI responds, re-enabled after"),
    ("Check 8", "Error state shown cleanly if function call fails"),
    ("Check 9", "Inbox panel loads Notice records with CODE READY section"),
    ("Check 10", "Non-admin user sees restricted access message only"),
    ("Check 11", "Full SIMPLEX-ITY design system — bg=#e8e6fe, accent=#5e50fb, Exo 2 + Montserrat, no cartoon icons"),
]), Spacer(1,8)]

story += [HRFlowable(width="100%", thickness=0.5, color=MUTED), Spacer(1,4)]
story += [P("Blueprint B — AI Hub Page · SIMPLEX-ITY · 1 June 2026 · Build AFTER Blueprint A is confirmed", color=MUTED, size=7.5)]

docB.build(story)
print("Blueprint B done ✅")
