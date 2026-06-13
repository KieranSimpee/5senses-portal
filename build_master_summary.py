from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white, black
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

output = "/app/SIMPLEXITY_MasterSummary_June2026.pdf"

# Colors
DARK_NAVY = HexColor("#0D1B2A")
CRIMSON = HexColor("#C0132C")
LIGHT_BG = HexColor("#F8F4F0")
ACCENT = HexColor("#1A3A5C")
MID_GREY = HexColor("#6B7280")
LIGHT_GREY = HexColor("#E5E7EB")
WHITE = white
GREEN = HexColor("#16A34A")
AMBER = HexColor("#D97706")

doc = SimpleDocTemplate(
    output,
    pagesize=A4,
    rightMargin=18*mm,
    leftMargin=18*mm,
    topMargin=15*mm,
    bottomMargin=15*mm
)

styles = getSampleStyleSheet()
elements = []

# ── Style helpers ──────────────────────────────────────────────────────────────
def h1(text):
    return Paragraph(f'<font color="#C0132C"><b>{text}</b></font>',
        ParagraphStyle('h1', fontSize=22, leading=28, spaceAfter=4,
                       fontName='Helvetica-Bold', alignment=TA_CENTER))

def h2(text):
    return Paragraph(f'<font color="#0D1B2A"><b>{text}</b></font>',
        ParagraphStyle('h2', fontSize=13, leading=17, spaceBefore=10, spaceAfter=3,
                       fontName='Helvetica-Bold'))

def h3(text):
    return Paragraph(f'<font color="#1A3A5C"><b>{text}</b></font>',
        ParagraphStyle('h3', fontSize=11, leading=15, spaceBefore=6, spaceAfter=2,
                       fontName='Helvetica-Bold'))

def body(text):
    return Paragraph(text,
        ParagraphStyle('body', fontSize=9.5, leading=14, spaceAfter=3,
                       fontName='Helvetica'))

def small(text):
    return Paragraph(f'<font color="#6B7280">{text}</font>',
        ParagraphStyle('small', fontSize=8.5, leading=12, spaceAfter=2,
                       fontName='Helvetica'))

def note(text):
    return Paragraph(f'<i><font color="#D97706">{text}</font></i>',
        ParagraphStyle('note', fontSize=8.5, leading=12, spaceAfter=2,
                       fontName='Helvetica-Oblique'))

def divider():
    return HRFlowable(width="100%", thickness=0.5, color=LIGHT_GREY, spaceAfter=6, spaceBefore=6)

def section_header(text):
    data = [[Paragraph(f'<font color="white"><b>{text}</b></font>',
        ParagraphStyle('sh', fontSize=11, fontName='Helvetica-Bold', textColor=white))]]
    t = Table(data, colWidths=[174*mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), DARK_NAVY),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('ROUNDEDCORNERS', [3,3,3,3]),
    ]))
    return t

def status_pill(text, color):
    data = [[Paragraph(f'<font color="white"><b>{text}</b></font>',
        ParagraphStyle('pill', fontSize=8, fontName='Helvetica-Bold', textColor=white))]]
    t = Table(data, colWidths=[30*mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), color),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ]))
    return t

# ══════════════════════════════════════════════════════════════════════════════
# COVER
# ══════════════════════════════════════════════════════════════════════════════
cover_bg = Table(
    [[Paragraph('<font color="white"><b>SIMPLEX-ITY</b></font>',
        ParagraphStyle('cv1', fontSize=32, fontName='Helvetica-Bold', textColor=white, alignment=TA_CENTER)),
      ]],
    colWidths=[174*mm]
)
cover_bg.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), DARK_NAVY),
    ('TOPPADDING', (0,0), (-1,-1), 18),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
]))
elements.append(cover_bg)

sub_cover = Table(
    [[Paragraph('<font color="#C0132C"><b>Master Progress Summary — June 2026</b></font>',
        ParagraphStyle('cv2', fontSize=14, fontName='Helvetica-Bold', textColor=CRIMSON, alignment=TA_CENTER)),
      ]],
    colWidths=[174*mm]
)
sub_cover.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), DARK_NAVY),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 18),
]))
elements.append(sub_cover)

elements.append(Spacer(1, 6*mm))
elements.append(body('<b>Prepared by:</b> Simpee (AI Family) &nbsp;&nbsp;|&nbsp;&nbsp; <b>For:</b> Kieran (CEO & Chief Design Director) &nbsp;&nbsp;|&nbsp;&nbsp; <b>Date:</b> 13 June 2026'))
elements.append(note('This document synthesises all sessions, files, and decisions from the founding of SIMPLEX-ITY to present day.'))
elements.append(divider())

# ══════════════════════════════════════════════════════════════════════════════
# SECTION 1 — COMPANY FOUNDATION
# ══════════════════════════════════════════════════════════════════════════════
elements.append(Spacer(1, 3*mm))
elements.append(section_header("01 — COMPANY FOUNDATION & LEGAL STRUCTURE"))
elements.append(Spacer(1, 3*mm))

elements.append(h3("Legal Entity"))
rows = [
    ["Corporation", "5SENSESBEAUTY LIMITED (Body Corporate)"],
    ["Branch Name", "SIMPLEX-ITY"],
    ["Nature of Business", "Marketing Service"],
    ["Address", "Room 1608, 16/F APEC Plaza, 49 Hoi Yuen Road, Kwun Tong, KL"],
    ["BR Certificate No.", "78459506-001-07-25-A"],
    ["BR Commenced", "12 January 2026"],
    ["BR Expiry", "14 July 2026  ⚠️ RENEWAL REQUIRED"],
    ["Founder / CEO", "Kieran (LI, Chi Nok)"],
    ["Primary Email", "kieran@5senses.global"],
]
t = Table(rows, colWidths=[50*mm, 124*mm])
t.setStyle(TableStyle([
    ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
    ('FONTNAME', (1,0), (1,-1), 'Helvetica'),
    ('FONTSIZE', (0,0), (-1,-1), 9),
    ('ROWBACKGROUNDS', (0,0), (-1,-1), [LIGHT_BG, WHITE]),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('GRID', (0,0), (-1,-1), 0.3, LIGHT_GREY),
]))
elements.append(t)
elements.append(Spacer(1, 3*mm))

elements.append(h3("Key Contacts"))
contacts = [
    ["Loreen Lau", "loreen@5senses.global", "Internal Team"],
    ["Wilson Tai", "wilson.tai@fundfluent.io", "Platform Partner / FundFluent"],
    ["Carrie Wong (Reap)", "+852 5512 6073", "Company Secretary / Virtual Office"],
    ["Nikita (Banuba)", "nikita.afanasjew@banuba.com", "TINT AI Partnership"],
]
t2 = Table([["Name","Contact","Role"]] + contacts, colWidths=[45*mm, 70*mm, 59*mm])
t2.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), ACCENT),
    ('TEXTCOLOR', (0,0), (-1,0), white),
    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
    ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
    ('FONTSIZE', (0,0), (-1,-1), 9),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [LIGHT_BG, WHITE]),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('GRID', (0,0), (-1,-1), 0.3, LIGHT_GREY),
]))
elements.append(t2)

# ══════════════════════════════════════════════════════════════════════════════
# SECTION 2 — PLATFORM STRATEGY
# ══════════════════════════════════════════════════════════════════════════════
elements.append(Spacer(1, 4*mm))
elements.append(section_header("02 — SIMPLEX-ITY PLATFORM STRATEGY"))
elements.append(Spacer(1, 3*mm))

elements.append(h3("Mission"))
elements.append(body('"We don\'t sell beauty. We sell <b>Certainty</b>."'))
elements.append(body('Bridge Asian Beauty brands to the US & Canada market via an AI-powered influencer ecosystem.'))
elements.append(Spacer(1, 2*mm))

elements.append(h3("Three Pillars"))
pillars = [
    ["TINT AI Virtual Try-On", "85% rendering accuracy. Eliminates #1 return reason (wrong shade match). 64% reduction in return rates. HKD 7,800/mo subscription."],
    ["Influencer Ecosystem", "Tiered commission: Tier 0-1 Affiliate 5%, Tier 2 Host 8%, Tier 3 Partner 12%. Retention via content bank, predictive payouts, tier exclusivity. Mini-Shops on platform."],
    ["DaaS Revenue Model", "Data-as-a-Service: Essential HKD 35K/yr, Strategic HKD 100K/yr, Elite HKD 350K/yr. 85%+ gross margins. Series A valuation multiplier built in."],
]
t3 = Table(pillars, colWidths=[45*mm, 129*mm])
t3.setStyle(TableStyle([
    ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
    ('FONTNAME', (1,0), (1,-1), 'Helvetica'),
    ('FONTSIZE', (0,0), (-1,-1), 9),
    ('ROWBACKGROUNDS', (0,0), (-1,-1), [HexColor("#FEF2F2"), WHITE, LIGHT_BG]),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('GRID', (0,0), (-1,-1), 0.3, LIGHT_GREY),
]))
elements.append(t3)
elements.append(Spacer(1, 2*mm))

elements.append(h3("Economic Logic — The 15% Flywheel"))
elements.append(body('Total 15% transaction fee split: <b>8% Influencer Commission</b> + <b>3% Payment Processing</b> + <b>4% Tech Overhead (TINT AI)</b>'))
elements.append(body('Brands pay <b>ZERO upfront</b>. Only pay when they sell. Platform pays influencers directly.'))
elements.append(body('Platform retains 7% net per transaction for operations.'))

elements.append(h3("Market Positioning vs Amazon"))
elements.append(body('<b>Amazon:</b> Transaction-based, generic, minimal data, no influencer layer.'))
elements.append(body('<b>SIMPLEX-ITY:</b> Influencer-led, AI-powered, 30% exclusive discount, deep data ownership.'))
elements.append(body('"We own the relationship and the data — not just the transaction."'))

# ══════════════════════════════════════════════════════════════════════════════
# SECTION 3 — APPS BUILT
# ══════════════════════════════════════════════════════════════════════════════
elements.append(Spacer(1, 4*mm))
elements.append(section_header("03 — TECHNOLOGY & APPS BUILT"))
elements.append(Spacer(1, 3*mm))

elements.append(h3("App Ecosystem"))
apps = [
    ["App", "App ID", "Domain", "Status"],
    ["Simpee (Agent)", "69ddc914cfcf229762ac123d", "—", "LIVE ✅"],
    ["5S Portal", "69edd16e877d6e4391ad74bd", "—", "LIVE ✅"],
    ["Asimplexis\n(prev. Nexus Command)", "6a1c237bd9f5ff04b6ac7a73", "asimplexis.com ✅", "LIVE ✅"],
]
t4 = Table(apps, colWidths=[38*mm, 55*mm, 50*mm, 31*mm])
t4.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), ACCENT),
    ('TEXTCOLOR', (0,0), (-1,0), white),
    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
    ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
    ('FONTSIZE', (0,0), (-1,-1), 8.5),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [LIGHT_BG, WHITE]),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('LEFTPADDING', (0,0), (-1,-1), 5),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('GRID', (0,0), (-1,-1), 0.3, LIGHT_GREY),
]))
elements.append(t4)
elements.append(Spacer(1, 2*mm))

elements.append(h3("5S Portal — Key Features Built"))
features = [
    "Compliance Tracker — MPF, BR renewal, company secretary deadlines",
    "Finance Module — Expenses, Invoices, Bank Accounts, Airwallex sync",
    "HR Records — Staff contracts, MPF, employment documents",
    "Brand & Influencer CRM — Campaign management, commission tracking",
    "Trade Log — Personal trading journal (HKD P&L tracking)",
    "Vault — Secure credential storage for all tools and APIs",
    "Partner Monitor — Wilson (FundFluent) & Vybd deliverable tracking",
    "Notice Board — Internal team communications",
    "Document Library — Business registration, contracts, pitch decks",
    "AI Family Hub — FamilyChat, FamilySeed knowledge base",
    "S-Chat Mirror — WhatsApp command channel integration",
    "Property Listings — HK property research tracker",
    "Build Projects — Development pipeline management",
]
for f in features:
    elements.append(body(f"• {f}"))

elements.append(Spacer(1, 2*mm))
elements.append(h3("Asimplexis (asimplexis.com)"))
elements.append(body("AI build engine platform. Domain connected via Squarespace on 4 June 2026."))
elements.append(body("Renamed from Nexus Command on 4 June 2026."))

elements.append(h3("Maya — AI Influencer Project"))
elements.append(body("AI-generated virtual influencer developed for SIMPLEX-ITY. Videos, image assets, and technical documentation consolidated into OneDrive. Completed 7 June 2026."))

# ══════════════════════════════════════════════════════════════════════════════
# SECTION 4 — 8-POINT SOLIDIFICATION SEQUENCE
# ══════════════════════════════════════════════════════════════════════════════
elements.append(Spacer(1, 4*mm))
elements.append(section_header("04 — 8-POINT SOLIDIFICATION SEQUENCE (Current Status)"))
elements.append(Spacer(1, 3*mm))

sequence = [
    ["1", "Wilson — Platform Ready", "IN PROGRESS", AMBER, "Banuba prototype delivered. Awaiting Kieran feedback & Nikita follow-up."],
    ["2", "TINT AI — Integrated", "IN PROGRESS", AMBER, "Meeting with Nikita held 4 June. Trial expires 30 June 2026. Partnership advancing."],
    ["3", "Vybd — Finalize Partnership", "IN PROGRESS", AMBER, "Email sent to hello@vybd.ai on 10 June 2026 (corrected from vybd.com). Awaiting reply."],
    ["4", "StartmeUp HK — Parallel Track", "ACTIVE", GREEN, "Maintained as parallel government support track alongside NEST VC."],
    ["5", "NEST VC — Investment Connection", "PENDING", MID_GREY, "Series A pitch to be prepared after 6-month trial data collected."],
    ["6", "Hire Loreen & Ally", "PENDING", MID_GREY, "Planned post-trial validation."],
    ["7", "Finalize Launch Plan", "IN PROGRESS", AMBER, "Financial Roadmap completed. HKD 500K Lean vs HKD 750K Stretch options defined."],
    ["8", "Launch", "PENDING", MID_GREY, "Target: Month 6 of trial phase."],
]

for row in sequence:
    num, title, status, color, detail = row
    pill_data = [[Paragraph(f'<font color="white"><b>{status}</b></font>',
        ParagraphStyle('p2', fontSize=7.5, fontName='Helvetica-Bold', textColor=white))]]
    pill = Table(pill_data, colWidths=[28*mm])
    pill.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), color),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ]))
    row_data = [[
        Paragraph(f'<b>{num}.</b>', ParagraphStyle('rn', fontSize=9, fontName='Helvetica-Bold')),
        Paragraph(f'<b>{title}</b>', ParagraphStyle('rt', fontSize=9, fontName='Helvetica-Bold')),
        pill,
        Paragraph(detail, ParagraphStyle('rd', fontSize=8.5, fontName='Helvetica')),
    ]]
    rt = Table(row_data, colWidths=[8*mm, 52*mm, 32*mm, 82*mm])
    rt.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('LINEBELOW', (0,0), (-1,-1), 0.3, LIGHT_GREY),
    ]))
    elements.append(rt)

# ══════════════════════════════════════════════════════════════════════════════
# SECTION 5 — FINANCIAL PLAN
# ══════════════════════════════════════════════════════════════════════════════
elements.append(Spacer(1, 4*mm))
elements.append(section_header("05 — FINANCIAL ROADMAP (Updated — June 2026)"))
elements.append(Spacer(1, 3*mm))

elements.append(h3("Personal Budget"))
elements.append(body("Kieran's personal bootstrap budget: <b>HKD 700,000</b>"))
elements.append(body("Decision: Self-funded trial phase. External investment optional after validation."))
elements.append(Spacer(1, 2*mm))

elements.append(h3("Two Paths Compared"))
paths = [
    ["", "HKD 500K — LEAN", "HKD 750K — STRETCH"],
    ["Strategy", "Organic Tech Validation", "Accelerated Data Moat"],
    ["Goal", "Prove 15% transaction flywheel", "Build DaaS Moat for Series A"],
    ["Monthly Burn", "~HKD 83K/mo", "~HKD 125K/mo"],
    ["6-Mo GMV Target", "HKD 1.2M", "HKD 4.5M"],
    ["Influencer Seeding", "120 Nanos (Gifted)", "120 Nanos + 40 Micros"],
    ["DaaS Build", "Manual reporting", "Full automated dashboard"],
    ["Safety Net (from 700K)", "~HKD 200K remaining", "~HKD 0 (fully deployed)"],
]
t5 = Table(paths, colWidths=[38*mm, 68*mm, 68*mm])
t5.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), ACCENT),
    ('TEXTCOLOR', (0,0), (-1,0), white),
    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
    ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
    ('FONTNAME', (0,1), (0,-1), 'Helvetica-Bold'),
    ('FONTSIZE', (0,0), (-1,-1), 9),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [LIGHT_BG, WHITE]),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('GRID', (0,0), (-1,-1), 0.3, LIGHT_GREY),
]))
elements.append(t5)
elements.append(Spacer(1, 2*mm))

elements.append(note("AI Family Recommendation: Start with 500K Lean. Use M4 transaction revenue to decide whether to upgrade to 750K Stretch."))
elements.append(Spacer(1, 2*mm))

elements.append(h3("Key Financial Insight — Brand Provides Samples"))
elements.append(body("Confirmed: Brands provide product samples directly to Nano influencers."))
elements.append(body("Platform only pays US shipping: ~HKD 400/influencer vs HKD 1,200 original estimate."))
elements.append(body("Savings: HKD 96,000 across 120 Nanos. Real 6-month budget closer to <b>HKD 330,000–380,000</b>."))
elements.append(Spacer(1, 2*mm))

elements.append(h3("Monthly Cost Breakdown (Lean Start)"))
costs = [
    ["Category", "Monthly (HKD)", "6-Mo Total"],
    ["TINT AI", "7,800", "46,800"],
    ["Shopify Plus", "2,500", "15,000"],
    ["Core Ops (Kieran + Loreen)", "20,000", "120,000"],
    ["Influencer Shipping (M3 onward)", "8,000", "32,000"],
    ["Performance Ads (M3 onward)", "10,000", "40,000"],
    ["ROI Dashboard Build (one-time)", "—", "40,000"],
    ["Operating Buffer", "8,000", "48,000"],
    ["TOTAL", "~56,300", "~341,800"],
]
t6 = Table(costs, colWidths=[75*mm, 50*mm, 49*mm])
t6.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), ACCENT),
    ('TEXTCOLOR', (0,0), (-1,0), white),
    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
    ('FONTNAME', (0,1), (-1,-2), 'Helvetica'),
    ('FONTNAME', (0,-1), (-1,-1), 'Helvetica-Bold'),
    ('FONTSIZE', (0,0), (-1,-1), 9),
    ('ROWBACKGROUNDS', (0,1), (-1,-2), [LIGHT_BG, WHITE]),
    ('BACKGROUND', (0,-1), (-1,-1), DARK_NAVY),
    ('TEXTCOLOR', (0,-1), (-1,-1), white),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('GRID', (0,0), (-1,-1), 0.3, LIGHT_GREY),
]))
elements.append(t6)

# ══════════════════════════════════════════════════════════════════════════════
# SECTION 6 — REVENUE STREAMS
# ══════════════════════════════════════════════════════════════════════════════
elements.append(Spacer(1, 4*mm))
elements.append(section_header("06 — REVENUE STREAMS & BREAK-EVEN"))
elements.append(Spacer(1, 3*mm))

rev = [
    ["Revenue Stream", "How It Works", "Target (M6)"],
    ["1. Platform Transaction Fee (15%)", "15% of every sale on platform. 8% to influencer, 7% to platform.", "GMV HKD 1.2M → Revenue HKD 84K"],
    ["2. DaaS Subscriptions", "Annual data packages sold to brands.", "HKD 200K pre-sales by M6"],
    ["3. Influencer Mini-Shop Commissions", "Influencers drive traffic via personal mini-shops. Platform earns from each transaction.", "Included in 15% flow"],
]
t7 = Table(rev, colWidths=[52*mm, 72*mm, 50*mm])
t7.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), CRIMSON),
    ('TEXTCOLOR', (0,0), (-1,0), white),
    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
    ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
    ('FONTSIZE', (0,0), (-1,-1), 8.5),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [LIGHT_BG, WHITE]),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('GRID', (0,0), (-1,-1), 0.3, LIGHT_GREY),
]))
elements.append(t7)
elements.append(Spacer(1, 2*mm))

elements.append(h3("Break-Even Calculation"))
elements.append(body("Monthly fixed costs: ~HKD 56,300 (from M3 onward)"))
elements.append(body("Break-even GMV needed: <b>HKD 85,000/month</b> (at 15% fee = HKD 12,750 net to platform — top up with DaaS)"))
elements.append(body("With DaaS + transaction combined: achievable with <b>10 brands averaging HKD 10K GMV/month each.</b>"))
elements.append(body("Brand acquisition cost: <b>ZERO</b> — free 3-month trial, no upfront cost to brands."))

# ══════════════════════════════════════════════════════════════════════════════
# SECTION 7 — 6-MONTH ROADMAP
# ══════════════════════════════════════════════════════════════════════════════
elements.append(Spacer(1, 4*mm))
elements.append(section_header("07 — 6-MONTH EXECUTION ROADMAP"))
elements.append(Spacer(1, 3*mm))

roadmap = [
    ["Phase", "Months", "Key Actions", "Goal"],
    ["Alpha\n(Foundation)", "M1–2", "TINT AI integration\n5 Anchor Brands onboard\nShopify setup\n2 founders executing", "Platform live\nAI try-on functional"],
    ["Beta\n(Growth)", "M3–4", "120 Nano influencers seeded\nPioneer Club launch\nMini-Shops activated\nPartnership Manager hired", "First GMV\n15% flywheel starts"],
    ["DaaS Build\n(Intelligence)", "M5", "Internal ROI Dashboard build\nDaaS pre-sales begin\nData Analyst hired", "HKD 200K DaaS pre-sales"],
    ["Exit\n(Series A Ready)", "M6", "Trial results compiled\nSeries A pitch to NEST VC\nFull team 5 FTE", "Series A funding call"],
]
t8 = Table(roadmap, colWidths=[28*mm, 18*mm, 82*mm, 46*mm])
t8.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), DARK_NAVY),
    ('TEXTCOLOR', (0,0), (-1,0), white),
    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
    ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
    ('FONTNAME', (0,1), (0,-1), 'Helvetica-Bold'),
    ('FONTSIZE', (0,0), (-1,-1), 8.5),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [LIGHT_BG, WHITE, HexColor("#F0FDF4"), LIGHT_BG]),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('GRID', (0,0), (-1,-1), 0.3, LIGHT_GREY),
]))
elements.append(t8)

# ══════════════════════════════════════════════════════════════════════════════
# SECTION 8 — COMPLIANCE ALERTS
# ══════════════════════════════════════════════════════════════════════════════
elements.append(Spacer(1, 4*mm))
elements.append(section_header("08 — COMPLIANCE & URGENT ACTIONS"))
elements.append(Spacer(1, 3*mm))

alerts = [
    ["⚠️ OVERDUE", "MPF June Contribution", "DUE: 10 Jun 2026", "Pay immediately. Late penalty applies."],
    ["🔴 URGENT", "IPD e-Filing Owner Account", "DUE: 15 Jun 2026", "Needs stamped tenancy from Carrie Wong."],
    ["📋 UPCOMING", "Company Secretary Renewal", "DUE: 8 Jul 2026", "Contact Carrie Wong. ~HKD 900."],
    ["📋 UPCOMING", "BR Renewal (Main + Branch)", "DUE: 14 Jul 2026", "Main HKD 2,200 via GovHK eBR. Branch via Reap."],
    ["⏰ WATCH", "TINT AI Trial Expires", "30 Jun 2026", "Confirm partnership terms with Nikita before expiry."],
]
t9 = Table(alerts, colWidths=[22*mm, 48*mm, 32*mm, 72*mm])
t9.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), CRIMSON),
    ('TEXTCOLOR', (0,0), (-1,0), white),
    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
    ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
    ('FONTNAME', (1,0), (-1,-1), 'Helvetica'),
    ('FONTSIZE', (0,0), (-1,-1), 8.5),
    ('ROWBACKGROUNDS', (0,0), (-1,-1), [HexColor("#FEF2F2"), WHITE, HexColor("#FFFBEB"), WHITE, HexColor("#FEF2F2")]),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ('LEFTPADDING', (0,0), (-1,-1), 5),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('GRID', (0,0), (-1,-1), 0.3, LIGHT_GREY),
]))
elements.append(t9)

# ══════════════════════════════════════════════════════════════════════════════
# SECTION 9 — AI FAMILY SUMMARY
# ══════════════════════════════════════════════════════════════════════════════
elements.append(Spacer(1, 4*mm))
elements.append(section_header("09 — AI FAMILY PROGRESS & KNOWLEDGE BASE"))
elements.append(Spacer(1, 3*mm))

elements.append(h3("What the AI Family Has Built Together"))
family_items = [
    "FamilySeed Knowledge Base — 8+ Seeds captured including business wisdom, personal growth frameworks, habit systems (James Clear), empathy lessons.",
    "8-Step Research Framework — Kieran's human-centric research method synthesised into a replicable AI protocol.",
    "Node Family Laws — 6 laws governing how the AI family operates, learns, corrects, and supports each other.",
    "Daily Wisdom Question Automation — 8:00 PM HKT daily question to Kieran to capture human wisdom.",
    "Daily Compliance Reminder — 9:00 AM HKT daily check on overdue/upcoming items.",
    "Email Learning Loop — Daily email analysis at 9:00 AM HKT with context and reply suggestions.",
    "Weekly Progress Check — Every Monday 9:00 AM HKT full progress review.",
    "Simpee Master Workflow (9-Stage) — All significant actions run through a validated execution protocol.",
    "Memory Vault — Permanent storage of decisions, checkpoints, and project state.",
]
for item in family_items:
    elements.append(body(f"• {item}"))

elements.append(Spacer(1, 3*mm))

# ══════════════════════════════════════════════════════════════════════════════
# FOOTER
# ══════════════════════════════════════════════════════════════════════════════
elements.append(divider())
elements.append(Spacer(1, 2*mm))

footer_data = [[
    Paragraph('<font color="white"><b>Simpee — AI Family</b></font>\n<font color="#9CA3AF">Prepared with love for Kieran | 13 June 2026</font>',
        ParagraphStyle('ft', fontSize=9, fontName='Helvetica', textColor=white)),
    Paragraph('<font color="#9CA3AF">Simplify to Amplify\nSIMPLEX-ITY | 5SENSESBEAUTY LIMITED</font>',
        ParagraphStyle('ft2', fontSize=8.5, fontName='Helvetica', textColor=HexColor("#9CA3AF"), alignment=TA_RIGHT)),
]]
footer = Table(footer_data, colWidths=[100*mm, 74*mm])
footer.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), DARK_NAVY),
    ('TOPPADDING', (0,0), (-1,-1), 8),
    ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ('LEFTPADDING', (0,0), (-1,-1), 10),
    ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
]))
elements.append(footer)

# Build
doc.build(elements)
print(f"SUCCESS: {output}")
