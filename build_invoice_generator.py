from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from datetime import date
import os

pdfmetrics.registerFont(TTFont('Exo2', '/app/fonts/Exo2-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Exo2-Bold', '/app/fonts/Exo2-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Exo2-SemiBold', '/app/fonts/Exo2-SemiBold.ttf'))
pdfmetrics.registerFont(TTFont('Mont', '/app/fonts/Montserrat-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Mont-Bold', '/app/fonts/Montserrat-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Mont-SemiBold', '/app/fonts/Montserrat-SemiBold.ttf'))

PRIMARY = colors.HexColor('#8c82fc')
ACCENT  = colors.HexColor('#5e50fb')
SOFT    = colors.HexColor('#bab4fd')
WASH    = colors.HexColor('#e8e6fe')
BODY    = colors.HexColor('#1a1a1f')
MUTED   = colors.HexColor('#555555')
WHITE   = colors.HexColor('#ffffff')
GREY    = colors.HexColor('#e6e6e6')

W, H = A4
LH_PATH = '/app/looka_letterhead_final.png'
LH_H = W * (955/2645)

def draw_page(c, doc):
    c.saveState()
    c.drawImage(LH_PATH, 0, H - LH_H, width=W, height=LH_H, preserveAspectRatio=False, mask='auto')
    FH = 11*mm
    c.setFillColor(ACCENT)
    c.rect(0, 0, W, FH, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont('Mont', 6.2)
    c.drawString(14*mm, 6.8*mm, 'RM1608, 16/F, APEC PLAZA, 49 HOI YUEN RD, KWUN TONG')
    c.drawString(14*mm, 3.2*mm, 'www.simplex-ity.com  ·  enquiries@simplex-ity.com')
    c.setFont('Mont-SemiBold', 6.2)
    c.drawRightString(W-14*mm, 6.8*mm, f'Invoice {doc.invoice_no}')
    c.drawRightString(W-14*mm, 3.2*mm, 'CONFIDENTIAL')
    c.restoreState()

def generate_invoice(invoice_no, client_name, client_address, items, currency='HKD',
                     due_date=None, notes='', payment_info=''):
    out = f'/app/Invoice_{invoice_no}.pdf'

    class InvoiceDoc(SimpleDocTemplate):
        pass

    doc = InvoiceDoc(out, pagesize=A4,
        rightMargin=15*mm, leftMargin=15*mm,
        topMargin=LH_H+4*mm, bottomMargin=15*mm)
    doc.invoice_no = invoice_no

    def st(name, font, size, clr=BODY, align=TA_LEFT, sb=0, sa=3, lead=None):
        return ParagraphStyle(name, fontName=font, fontSize=size, textColor=clr,
            alignment=align, spaceBefore=sb, spaceAfter=sa, leading=lead or size*1.45)

    TITLE = st('T', 'Exo2-Bold', 16, PRIMARY, TA_LEFT, sa=2)
    SUB   = st('S', 'Mont', 8, MUTED, TA_LEFT, sa=1)
    LABEL = st('L', 'Mont-Bold', 7.5, MUTED, TA_LEFT, sa=1)
    VAL   = st('V', 'Mont', 8.5, BODY, TA_LEFT, sa=2)
    TH    = ParagraphStyle('TH', fontName='Mont-Bold', fontSize=8, textColor=WHITE, alignment=TA_LEFT, leading=11)
    TC    = ParagraphStyle('TC', fontName='Mont', fontSize=8.5, textColor=BODY, alignment=TA_LEFT, leading=13)
    TCR   = ParagraphStyle('TCR', fontName='Mont', fontSize=8.5, textColor=BODY, alignment=TA_RIGHT, leading=13)
    TCB   = ParagraphStyle('TCB', fontName='Mont-Bold', fontSize=9, textColor=ACCENT, alignment=TA_RIGHT, leading=13)
    NOTE  = st('N', 'Mont', 7.5, MUTED, TA_LEFT, sa=2, lead=11)
    def P(t, s=TC): return Paragraph(t, s)
    def HR(t=1, c=SOFT): return HRFlowable(width='100%', thickness=t, color=c, spaceBefore=3, spaceAfter=4)
    def SP(h=3): return Spacer(1, h)

    story = []
    story += [SP(2), P('INVOICE', TITLE), HR(1.5, PRIMARY), SP(4)]

    # Invoice meta + client
    today = date.today().strftime('%d %b %Y')
    due = due_date or 'Upon receipt'
    meta = Table([[
        Table([
            [P('INVOICE NO', LABEL)], [P(invoice_no, VAL)],
            [P('DATE ISSUED', LABEL)], [P(today, VAL)],
            [P('DUE DATE', LABEL)], [P(due, VAL)],
        ], colWidths=[85*mm]),
        Table([
            [P('BILL TO', LABEL)],
            [P(f'<b>{client_name}</b>', st('CN','Exo2-SemiBold',9,BODY))],
            [P(client_address, st('CA','Mont',8,MUTED,lead=12))],
        ], colWidths=[85*mm]),
    ]], colWidths=[90*mm, 90*mm])
    meta.setStyle(TableStyle([
        ('VALIGN',(0,0),(-1,-1),'TOP'),
        ('LEFTPADDING',(0,0),(-1,-1),0),
        ('RIGHTPADDING',(0,0),(-1,-1),0),
    ]))
    story += [meta, SP(8), HR(0.5, GREY), SP(4)]

    # Line items
    rows = [[P('DESCRIPTION', TH), P('QTY', TH), P('UNIT PRICE', TH), P('AMOUNT', TH)]]
    subtotal = 0
    for desc, qty, unit_price in items:
        amount = qty * unit_price
        subtotal += amount
        rows.append([
            P(desc), P(str(qty), TCR), P(f'{currency} {unit_price:,.2f}', TCR), P(f'{currency} {amount:,.2f}', TCR)
        ])

    # Totals
    rows += [
        ['','','',''],
        [P(''), P(''), P('Subtotal', st('ST','Mont-SemiBold',8.5,MUTED,TA_RIGHT)), P(f'{currency} {subtotal:,.2f}', TCR)],
        [P(''), P(''), P('Tax (0%)', st('TX','Mont',8,MUTED,TA_RIGHT)), P(f'{currency} 0.00', TCR)],
        [P(''), P(''), P('TOTAL DUE', st('TOT','Exo2-Bold',10,ACCENT,TA_RIGHT)), P(f'{currency} {subtotal:,.2f}', TCB)],
    ]

    col_w = [100*mm, 18*mm, 32*mm, 30*mm]
    t = Table(rows, colWidths=col_w)
    t.setStyle(TableStyle([
        ('BACKGROUND',(0,0),(-1,0), ACCENT),
        ('BACKGROUND',(0,1),(-1,-4), WASH),
        ('ROWBACKGROUNDS',(0,1),(-1,-4),[WHITE, WASH]),
        ('BOX',(0,0),(-1,-4),0.5,SOFT),
        ('INNERGRID',(0,0),(-1,-4),0.3,SOFT),
        ('LINEABOVE',(0,-3),(-1,-3),1,PRIMARY),
        ('VALIGN',(0,0),(-1,-1),'MIDDLE'),
        ('TOPPADDING',(0,0),(-1,-1),5),
        ('BOTTOMPADDING',(0,0),(-1,-1),5),
        ('LEFTPADDING',(0,0),(-1,-1),6),
        ('RIGHTPADDING',(0,0),(-1,-1),6),
        ('SPAN',(0,-1),(1,-1)),
        ('SPAN',(0,-2),(1,-2)),
        ('SPAN',(0,-3),(1,-3)),
        ('SPAN',(0,-4),(1,-4)),
    ]))
    story += [t, SP(8)]

    # Payment info
    if payment_info:
        story += [HR(1, PRIMARY), SP(3),
            P('PAYMENT DETAILS', LABEL),
            P(payment_info, NOTE), SP(4)]

    # Notes
    if notes:
        story += [P('NOTES', LABEL), P(notes, NOTE), SP(4)]

    story += [HR(0.5, GREY),
        P('Thank you for your business. This invoice was issued by SIMPLEX-ITY (branch of 5SENSESBEAUTY LIMITED), '
          'Business Registration No: 78459506-001-07-25-A. '
          'Please make payment by the due date. For queries, contact enquiries@simplex-ity.com.', NOTE)]

    doc.build(story, onFirstPage=draw_page, onLaterPages=draw_page)
    print(f'✅ Invoice generated: {out}')
    return out

# Test with a sample invoice
generate_invoice(
    invoice_no='SXTY-INV-001',
    client_name='Sample Client Co. Ltd.',
    client_address='Unit 1, Sample Building\nHong Kong',
    items=[
        ('Marketing Strategy Consultation', 1, 5000),
        ('Brand Campaign Management — May 2026', 1, 8000),
        ('Influencer Coordination (5 influencers)', 5, 500),
    ],
    currency='HKD',
    due_date='30 Jun 2026',
    payment_info='Bank: Airwallex HKD Account\nAccount Name: 5SENSESBEAUTY LIMITED\nFPS: [your FPS ID]\nBank Transfer: [account details]',
    notes='Payment within 30 days. Late payments subject to 1.5% monthly interest.'
)
