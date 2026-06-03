from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ACCENT = colors.HexColor('#5e50fb')
LIGHT = colors.HexColor('#e8e6fe')
DARK = colors.HexColor('#1a1a1f')

def make_styles():
    title_s   = ParagraphStyle('Title',   fontName='Helvetica-Bold', fontSize=20, textColor=ACCENT, spaceAfter=6,  leading=26)
    sub_s     = ParagraphStyle('Sub',     fontName='Helvetica',      fontSize=11, textColor=DARK,   spaceAfter=14, leading=16)
    sec_s     = ParagraphStyle('Section', fontName='Helvetica-Bold', fontSize=13, textColor=ACCENT, spaceBefore=16,spaceAfter=6, leading=18)
    body_s    = ParagraphStyle('Body',    fontName='Helvetica',      fontSize=10, textColor=DARK,   spaceAfter=8,  leading=15)
    label_s   = ParagraphStyle('Label',   fontName='Helvetica-Bold', fontSize=10, textColor=DARK,   spaceAfter=4,  leading=14)
    return title_s, sub_s, sec_s, body_s, label_s

def build_pdf(filename, title, subtitle, date, sections):
    doc = SimpleDocTemplate(filename, pagesize=A4,
        leftMargin=2.5*cm, rightMargin=2.5*cm,
        topMargin=2.5*cm, bottomMargin=2.5*cm)
    title_s, sub_s, sec_s, body_s, label_s = make_styles()
    story = []
    story.append(Paragraph(title, title_s))
    story.append(HRFlowable(width="100%", thickness=2, color=ACCENT, spaceAfter=8))
    story.append(Paragraph(subtitle, sub_s))
    story.append(Paragraph(f"Date: {date}", body_s))
    story.append(Spacer(1, 0.4*cm))
    for sec_title, items in sections:
        story.append(Paragraph(sec_title, sec_s))
        story.append(HRFlowable(width="100%", thickness=0.5, color=LIGHT, spaceAfter=6))
        for label, content in items:
            if label:
                story.append(Paragraph(label, label_s))
            story.append(Paragraph(content, body_s))
            story.append(Spacer(1, 0.2*cm))
    doc.build(story)
    print(f"Built: {filename}")

build_pdf('Part2_EN_SolidificationPlan.pdf',
    'SIMPLEX-ITY — Solidification Plan 2026',
    'A structured roadmap to build a tangible, investable platform',
    'June 3, 2026',
    [
        ('Key 1: Government Support — StartmeUp HK', [
            ('Action:', 'Reached out to StartmeUp HK to explore government-backed support, advice, and any leverage the company can gain through official channels.'),
            ('Goal:', 'Secure credibility, potential grants, and government endorsement to strengthen the foundation of SIMPLEX-ITY.'),
        ]),
        ('Key 2: Platform Ready — Wilson', [
            ('Owner:', 'Wilson is responsible for ensuring the overall platform is technically ready.'),
            ('Goal:', 'Ensure the platform is technically solid and prepared for all AI integrations and the eventual launch.'),
        ]),
        ('Key 3: AI Tint Try-On — Integrated by Kieran', [
            ('Status:', 'COMPLETE. Tint AI Try-On is already connected to the SIMPLEX-ITY platform, completed by Kieran.'),
            ('Significance:', 'A core AI function is live and demonstrable — this transforms the platform from an idea into a real product.'),
        ]),
        ('Key 4: AI Vybd — Finalise by Kieran (Next 2 Weeks)', [
            ('Action:', 'Engage Vybd to take on a defined portion of platform operations, via a fee or partnership structure. Vybd will also demonstrate the tangible value they bring before any long-term commitment.'),
            ('Timeline:', 'Kieran to finalise Vybd connection within the next 2 weeks.'),
            ('Goal:', 'Free up Kieran to focus on strategic priorities while Vybd handles operational execution. Evidence-based partnership — see the value first, then commit.'),
        ]),
        ('Key 5: Brand Strategy — Self-Execute (Recommended)', [
            ('Option A (ABW Partnership):', 'ABW provides brands; YesStyle (sister company) brings influencers. Large scale but creates dependency on a single partner.'),
            ('Option B — Recommended (Self-Execute):', "Leverage Kieran's sourcing background, Loreen and Ally's expertise, and existing Korean skincare brand connections."),
            ('3-Month Trial Launch Model:', ''),
            ('', '1. Brands and influencers invited to participate at ZERO cost'),
            ('', '2. Brands only responsible for shipping goods to consumers'),
            ('', '3. All platform products at 30% off market price during trial'),
            ('', '4. Consumers informed this is a trial — authentic, honest positioning'),
            ('', '5. Use 3 months to debug systems and improve platform experience'),
            ('Revenue:', 'Transaction commissions + market intelligence data (consumer behaviour insights)'),
            ('Capital Need for NEST VC:', 'AI Try-On click costs during trial period — to be clearly defined in investor presentation'),
            ('Long-Term on ABW:', 'ABW can become a future vendor on the platform — on our terms, not theirs'),
        ]),
        ('Key 6: Connect with NEST VC — Confirm Incubator Partnership', [
            ('Owner:', 'Kieran'),
            ('Action:', 'Once all AI partners are integrated and the platform ecosystem is solid, Kieran will personally reach out to NEST VC Incubator to establish the connection and confirm their role as investor.'),
            ('Goal:', 'Secure NEST VC as investor, establishing a solid financial and operational foundation before hiring and launch.'),
        ]),
        ('Key 7: Hire Loreen and Ally', [
            ('Action:', 'Once NEST VC partnership is confirmed, formally invite Loreen and Ally to join the company.'),
            ('Rationale:', 'Invite trusted people on a solid foundation — not before it is built.'),
        ]),
        ('Key 8: Launch Plan — Solidify Once All Parties Onboard', [
            ('Action:', 'Once all partners are officially onboard, finalise and lock the full platform launch plan.'),
            ('Goal:', 'Ensure every piece is in place for an ordered, prepared, and confident launch of SIMPLEX-ITY.'),
        ]),
        ('The Correct Sequence — Final Version', [
            ('', '1. Platform ready — Wilson'),
            ('', '2. AI Tint Try-On integrated — Kieran DONE'),
            ('', '3. AI Vybd finalised — Kieran, within 2 weeks'),
            ('', '4. Connect with NEST VC, confirm incubator partnership — Kieran'),
            ('', '5. Hire Loreen and Ally'),
            ('', '6. Launch plan solidified once all parties onboard'),
        ]),
    ]
)
print("Done!")
