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
BG = HexColor("#e8e6fe")

def style(name, font='Helvetica', size=9, color=None, bold=False, align=TA_LEFT, leading=13, before=0, after=3):
    return ParagraphStyle(name, fontName='Helvetica-Bold' if bold else font, fontSize=size,
                          textColor=color or DARK, alignment=align, leading=leading,
                          spaceBefore=before, spaceAfter=after)

def P(text, **kw): return Paragraph(text, style('p', **kw))
def B(text, **kw): return Paragraph(f"<b>{text}</b>", style('b', bold=True, **kw))
def Code(text): return Paragraph(f"<font name='Courier' size='7.5'>{text}</font>",
    ParagraphStyle('code', fontName='Courier', fontSize=7.5, textColor=DARK,
                   backColor=HexColor("#f4f4f8"), leading=12, spaceAfter=2,
                   leftIndent=6, rightIndent=6))

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
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),ACCENT),('ALIGN',(0,0),(-1,-1),'CENTER'),
                            ('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8)]))
    return t

def info_row(rows, col_w=None):
    w = col_w or [40*mm, 134*mm]
    data = [[Paragraph(f"<b>{r[0]}</b>", ParagraphStyle('lbl', fontName='Helvetica-Bold', fontSize=8,
                        textColor=MUTED)),
             Paragraph(r[1], ParagraphStyle('val', fontName='Helvetica', fontSize=8.5,
                        textColor=DARK, leading=13))] for r in rows]
    t = Table(data, colWidths=w)
    t.setStyle(TableStyle([('ROWBACKGROUNDS',(0,0),(-1,-1),[WHITE, HexColor("#f8f8ff")]),
                            ('GRID',(0,0),(-1,-1),0.3,HexColor("#e6e6e6")),
                            ('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),4),
                            ('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),6),
                            ('VALIGN',(0,0),(-1,-1),'TOP')]))
    return t

# ── DOC A — SHARED CALENDAR ────────────────────────────────────────────────
docA = SimpleDocTemplate("/app/Blueprint_A_SharedCalendar.pdf", pagesize=A4,
    rightMargin=18*mm, leftMargin=18*mm, topMargin=14*mm, bottomMargin=14*mm)
story = []

story += [cover("BLUEPRINT A — SHARED CALENDAR PAGE",
    "5S Portal · SIMPLEX-ITY · Phase 1 Build · 1 June 2026",
    "Paste this entire brief into the Base44 Builder AI"), Spacer(1,8)]

story += [section_header("STEP 0 — CLEAN PORTAL INBOX FIRST (do this before building)"), Spacer(1,3)]
story += [P("Before building the calendar, the builder must clear all stale pinned notices from the real 5S Portal.")]
story += [P("In the Base44 data panel for app 69edd16e877d6e4391ad74bd, find the Notice entity and:")]
step0 = [("Action", "Unpin ALL existing notices (set pinned=false). Do not delete — just unpin."),
         ("Why", "The portal inbox is full of stale 'CODE READY' notices from previous sessions. They clutter the view and confuse users."),
         ("Confirm", "After unpinning, post one new Notice: title='✅ Portal Reset — 1 June 2026', section='system', posted_by='Simpee', pinned=true, content='Portal inbox cleared. Ready for new builds.'")]
story += [info_row(step0), Spacer(1,8)]

story += [section_header("STEP 1 — PAGE IDENTITY"), Spacer(1,3)]
story += [info_row([
    ("File", "pages/CalendarPage.jsx"),
    ("Route", "/calendar"),
    ("Menu label", "Calendar"),
    ("Menu icon", "📅 or text symbol ◎"),
    ("Audience", "All users — view. Admin + Manager — create/edit/delete events."),
    ("Entity", "CalendarEvent (already exists in this app)"),
    ("Entity fields", "title, type, campaign_id, campaign_title, influencer_id, influencer_name, brand_name, due_date, status, notes"),
]), Spacer(1,8)]

story += [section_header("STEP 2 — DESIGN SYSTEM (apply to every element)"), Spacer(1,3)]
story += [info_row([
    ("Page background", "#e8e6fe (Lavender Wash)"),
    ("Card background", "#ffffff (White)"),
    ("Accent / buttons", "#5e50fb (Violet)"),
    ("Soft accent", "#bab4fd (Soft Lilac)"),
    ("Body text", "#1a1a1f"),
    ("Muted text", "#9896ad"),
    ("Headlines font", "Exo 2, bold, uppercase labels"),
    ("Body font", "Montserrat"),
    ("No icons", "Use text symbols only — ◎ ▤ ✓ ◉. NO cartoon pictograms."),
    ("Card radius", "14px cards, 9px buttons"),
    ("Shadow", "0 2px 8px rgba(94,80,251,0.06)"),
]), Spacer(1,8)]

story += [section_header("STEP 3 — PAGE LAYOUT (3 sections, single column)"), Spacer(1,3)]
story += [P("Section A — Page Header")]
story += [info_row([
    ("Title", '"SHARED CALENDAR" — Exo 2, bold, #5e50fb, 22px'),
    ("Subtitle", '"Team events, deadlines, and meetings" — Montserrat, #9896ad, 13px'),
    ("Top right", 'View toggle: [MONTH] [WEEK] — active tab bg=#5e50fb white text, inactive bg=white border=#bab4fd'),
    ("Add button", '"+ ADD EVENT" — bg=#5e50fb, white text, 9px radius. Visible to Admin + Manager only.'),
]), Spacer(1,6)]

story += [P("Section B — Calendar View (main area)")]
story += [info_row([
    ("MONTH view", "Standard 7-column grid. Each day is a cell. Events shown as colored chips inside the cell. Today's cell has bg=#e8e6fe border=#5e50fb."),
    ("WEEK view", "7 columns (Mon–Sun). Each column shows the day's events stacked vertically. Time not required — just event chips."),
    ("Event chip", "Rounded pill: bg = event color (see type colors below), white text, 11px font, truncated if too long."),
    ("Click event", "Opens a modal with full event details: title, type badge, due_date, status, notes, brand_name/influencer_name if set."),
    ("Empty day", "Light grey dashed border. Text: '—' centred in muted grey."),
]), Spacer(1,6)]

story += [P("Section C — Event Type Color Legend (shown as a small row below the calendar)")]
story += [info_row([
    ("Compliance", "#f59e0b — Amber"),
    ("Meeting", "#3b82f6 — Blue"),
    ("Deadline", "#ef4444 — Red"),
    ("Campaign", "#8b5cf6 — Purple"),
    ("Personal", "#22c55e — Green"),
    ("Holiday", "#14b8a6 — Teal"),
    ("Default", "#9896ad — Grey"),
]), Spacer(1,8)]

story += [section_header("STEP 4 — ADD EVENT MODAL"), Spacer(1,3)]
story += [info_row([
    ("Trigger", '"+ ADD EVENT" button click'),
    ("Modal title", '"New Event" — Exo 2, bold, #5e50fb'),
    ("Fields", "Title (text, required) · Type (dropdown: Compliance/Meeting/Deadline/Campaign/Personal/Holiday) · Due Date (date picker, required) · Status (dropdown: Upcoming/In Progress/Done/Cancelled) · Brand Name (text, optional) · Notes (textarea, optional)"),
    ("Save action", "CalendarEvent.create({ title, type, due_date, status, brand_name, notes })"),
    ("Cancel", "Closes modal, no save"),
    ("Validation", "Title and Due Date are required. Show inline error if empty on submit."),
    ("Permissions", "Only Admin and Manager roles see the + ADD EVENT button and can submit the modal."),
]), Spacer(1,8)]

story += [section_header("STEP 5 — EDIT & DELETE"), Spacer(1,3)]
story += [info_row([
    ("Edit", "Admin/Manager clicking an event chip → modal opens pre-filled. 'SAVE CHANGES' button calls CalendarEvent.update(id, data)."),
    ("Delete", "Inside edit modal, 'DELETE' button (red, right-aligned) calls CalendarEvent.delete(id). Confirm dialog first: 'Delete this event?'"),
    ("Staff users", "Click event → read-only modal. No edit/delete buttons shown."),
]), Spacer(1,8)]

story += [section_header("STEP 6 — DATA LOADING"), Spacer(1,3)]
story += [info_row([
    ("Load", "On page mount: CalendarEvent.list() — fetch all records."),
    ("Filter by month", "When user navigates to a different month, filter loaded events by due_date within that month range."),
    ("Loading state", "Show a pulsing lavender placeholder while fetching. Never show a blank screen."),
    ("Empty state", "If no events this month: centre card with text 'No events this month. Click + ADD EVENT to get started.' Only show add button if Admin/Manager."),
    ("Error state", "If fetch fails: 'Could not load calendar. Please refresh.' — no crash."),
]), Spacer(1,8)]

story += [section_header("STEP 7 — NAVIGATION"), Spacer(1,3)]
story += [info_row([
    ("Month nav", "← Previous Month | [Month Year] | Next Month →. Arrows are #5e50fb, bold."),
    ("Week nav", "← Previous Week | [Week range e.g. 1–7 Jun 2026] | Next Week →."),
    ("Today button", "Small 'TODAY' pill button — jumps back to current month/week. bg=#e8e6fe text=#5e50fb."),
]), Spacer(1,8)]

story += [section_header("STEP 8 — MENU REGISTRATION"), Spacer(1,3)]
story += [P("Add 'Calendar' to the sidebar navigation menu in App.jsx (or wherever the nav is defined).")]
story += [info_row([
    ("Label", "Calendar"),
    ("Route", "/calendar"),
    ("Position", "After Home, before Dashboard"),
    ("Visibility", "All roles"),
    ("Symbol", "◎ Calendar"),
]), Spacer(1,8)]

story += [section_header("STEP 9 — QUALITY CHECKS (builder must verify before done)"), Spacer(1,3)]
story += [info_row([
    ("Check 1", "Month view renders with correct days for June 2026"),
    ("Check 2", "Week view toggles correctly"),
    ("Check 3", "Add event modal opens, saves, and new event appears on calendar without page refresh"),
    ("Check 4", "Staff user sees calendar but no add/edit/delete buttons"),
    ("Check 5", "Event chips show correct colors per type"),
    ("Check 6", "Empty state shows when no events"),
    ("Check 7", "Page background is #e8e6fe, cards are white, accent is #5e50fb"),
    ("Check 8", "No cartoon icons — text symbols only"),
    ("Check 9", "Calendar added to sidebar navigation and is accessible"),
]), Spacer(1,8)]

story += [HRFlowable(width="100%", thickness=0.5, color=MUTED), Spacer(1,4)]
story += [P("Blueprint A — Shared Calendar · SIMPLEX-ITY · 1 June 2026 · Paste into Base44 Builder AI",
            color=MUTED, size=7.5)]

docA.build(story)
print("Blueprint A done ✅")
