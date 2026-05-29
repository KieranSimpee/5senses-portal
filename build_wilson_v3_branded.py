from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle, Image as RLImage
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY, TA_RIGHT
from reportlab.pdfgen import canvas as rl_canvas
import os

# ── Register Brand Fonts ──────────────────────────────────────────────────────
pdfmetrics.registerFont(TTFont('Exo2', '/app/fonts/Exo2-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Exo2-SemiBold', '/app/fonts/Exo2-SemiBold.ttf'))
pdfmetrics.registerFont(TTFont('Exo2-Bold', '/app/fonts/Exo2-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Montserrat', '/app/fonts/Montserrat-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Montserrat-Medium', '/app/fonts/Montserrat-Medium.ttf'))
pdfmetrics.registerFont(TTFont('Montserrat-SemiBold', '/app/fonts/Montserrat-SemiBold.ttf'))
pdfmetrics.registerFont(TTFont('Montserrat-Bold', '/app/fonts/Montserrat-Bold.ttf'))

# ── Brand Colors ──────────────────────────────────────────────────────────────
PRIMARY_LILAC  = colors.HexColor('#8c82fc')  # Headlines, logo on white
ACCENT_VIOLET  = colors.HexColor('#5e50fb')  # Emphasis, CTAs
SOFT_LILAC     = colors.HexColor('#bab4fd')  # Supporting backgrounds
LAVENDER_WASH  = colors.HexColor('#e8e6fe')  # Light section backgrounds
WHITE_CANVAS   = colors.HexColor('#ffffff')  # Primary background
NEUTRAL_GREY   = colors.HexColor('#e6e6e6')  # Borders, dividers
BODY_TEXT      = colors.HexColor('#1a1a1f')  # Near-black body text

W, H = A4
output_path = '/app/Wilson_Partnership_Agreement_V3_Branded.pdf'

# ── Header / Footer ───────────────────────────────────────────────────────────
def draw_header_footer(c, doc):
    c.saveState()
    # ── TOP HEADER BAR ──
    HEADER_H = 22 * mm
    c.setFillColor(ACCENT_VIOLET)
    c.rect(0, H - HEADER_H, W, HEADER_H, fill=1, stroke=0)

    # Logo image in header
    logo_path = '/app/simplex_logo_extracted.png'
    if os.path.exists(logo_path):
        logo_w = 48 * mm
        logo_h = 14 * mm
        c.drawImage(logo_path, 18*mm, H - HEADER_H + 4*mm,
                    width=logo_w, height=logo_h,
                    preserveAspectRatio=True, mask='auto')

    # Right side header text
    c.setFillColor(WHITE_CANVAS)
    c.setFont('Exo2-SemiBold', 8)
    c.drawRightString(W - 18*mm, H - 10*mm, 'PARTNERSHIP & EQUITY AGREEMENT')
    c.setFont('Montserrat', 7)
    c.drawRightString(W - 18*mm, H - 15*mm, '合作及股權參與協議  ·  V2  ·  May 2026')

    # ── ACCENT LINE under header ──
    c.setFillColor(SOFT_LILAC)
    c.rect(0, H - HEADER_H - 1.5*mm, W, 1.5*mm, fill=1, stroke=0)

    # ── BOTTOM FOOTER BAR ──
    FOOTER_H = 10 * mm
    c.setFillColor(ACCENT_VIOLET)
    c.rect(0, 0, W, FOOTER_H, fill=1, stroke=0)

    c.setFillColor(WHITE_CANVAS)
    c.setFont('Montserrat', 6.5)
    c.drawString(18*mm, 3.8*mm,
        'SIMPLEX-ITY (Branch of 5SENSESBEAUTY LIMITED)  ·  Rm 1608, 16/F APEC Plaza, 49 Hoi Yuen Rd, Kwun Tong  ·  BR: 78459506-001-07-25-A')
    c.setFont('Montserrat-SemiBold', 6.5)
    c.drawRightString(W - 18*mm, 3.8*mm, f'Page {doc.page}')

    c.restoreState()


# ── Document Setup ─────────────────────────────────────────────────────────────
doc = SimpleDocTemplate(
    output_path, pagesize=A4,
    rightMargin=18*mm, leftMargin=18*mm,
    topMargin=28*mm, bottomMargin=16*mm
)

# ── Paragraph Styles ──────────────────────────────────────────────────────────
def S(name, font, size, color=BODY_TEXT, align=TA_LEFT,
      spaceBefore=0, spaceAfter=4, leading=None, leftIndent=0, bold=False):
    return ParagraphStyle(name,
        fontName=font, fontSize=size, textColor=color,
        alignment=align, spaceBefore=spaceBefore, spaceAfter=spaceAfter,
        leading=leading or size * 1.4, leftIndent=leftIndent)

# Headlines: Exo 2 in Primary Lilac
sDocTitle   = S('DocTitle',  'Exo2-Bold',     15, PRIMARY_LILAC, TA_CENTER, spaceAfter=2, leading=20)
sDocSub     = S('DocSub',    'Montserrat',     8, BODY_TEXT,      TA_CENTER, spaceAfter=2, leading=12)
sSection    = S('Section',   'Exo2-SemiBold', 10, ACCENT_VIOLET,  TA_LEFT,  spaceBefore=10, spaceAfter=4, leading=14)
sSubSection = S('SubSect',   'Exo2-SemiBold',  9, PRIMARY_LILAC,  TA_LEFT,  spaceBefore=5,  spaceAfter=3, leading=13)
# Body: Montserrat
sBody       = S('Body',      'Montserrat',     8, BODY_TEXT,      TA_JUSTIFY, spaceAfter=4, leading=12.5)
sBold       = S('Bold',      'Montserrat-Bold', 8, BODY_TEXT,     TA_LEFT,   spaceAfter=3, leading=12)
sClause     = S('Clause',    'Montserrat',      8, BODY_TEXT,     TA_JUSTIFY, spaceAfter=3, leading=12, leftIndent=6)
sSmall      = S('Small',     'Montserrat',    7.5, colors.HexColor('#555555'), TA_JUSTIFY, spaceAfter=2, leading=11)
sSmallBold  = S('SmallBold', 'Montserrat-Bold', 7.5, BODY_TEXT,  TA_LEFT,   spaceAfter=2, leading=11)
sSign       = S('Sign',      'Montserrat',    8.5, BODY_TEXT,     TA_LEFT,   spaceAfter=8, leading=15)
sDisclaim   = S('Disclaim',  'Montserrat',    6.8, colors.HexColor('#888888'), TA_JUSTIFY, spaceAfter=2, leading=10.5)

story = []

# ── TITLE BLOCK ───────────────────────────────────────────────────────────────
story.append(Spacer(1, 3*mm))
story.append(Paragraph('PARTNERSHIP & EQUITY PARTICIPATION AGREEMENT', sDocTitle))
story.append(Paragraph('合作及股權參與協議 — VERSION 2 / 第二版', sDocSub))
story.append(Paragraph('Date / 日期: 29 May 2026  ·  CONFIDENTIAL / 機密文件', sDocSub))
story.append(HRFlowable(width='100%', thickness=1.5, color=PRIMARY_LILAC, spaceBefore=4, spaceAfter=6))

# ── PARTIES TABLE ─────────────────────────────────────────────────────────────
story.append(Paragraph('BETWEEN / 協議雙方', sSection))

def cell(txt, style=sClause):
    return Paragraph(txt, style)

party_data = [
    [cell('FOUNDER / 創辦人', sBold), cell('PARTNER / 合夥人', sBold)],
    [
        cell('KIERAN LI (LI, Chi Nok) / 李志諾<br/>Founder &amp; Director, SIMPLEX-ITY<br/>Branch of 5SENSESBEAUTY LIMITED<br/>Rm 1608, 16/F APEC Plaza, Kwun Tong<br/>BR No: 78459506-001-07-25-A<br/><i>("the Founder" / 「創辦人」)</i>'),
        cell('WILSON [FULL LEGAL NAME TBC]<br/>Operations Partner, SIMPLEX-ITY<br/>Address / 地址: [TBC]<br/>HKID No / 香港身份證: [TBC]<br/><br/><i>("the Partner" / 「合夥人」)</i>'),
    ]
]
pt = Table(party_data, colWidths=[87*mm, 87*mm])
pt.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), LAVENDER_WASH),
    ('BACKGROUND', (0,1), (-1,1), WHITE_CANVAS),
    ('BOX',        (0,0), (-1,-1), 0.8, SOFT_LILAC),
    ('INNERGRID',  (0,0), (-1,-1), 0.5, SOFT_LILAC),
    ('VALIGN',     (0,0), (-1,-1), 'TOP'),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING',(0,0),(-1,-1), 5),
    ('LEFTPADDING',(0,0), (-1,-1), 7),
]))
story.append(pt)
story.append(Spacer(1, 3))

# ── PREAMBLE ──────────────────────────────────────────────────────────────────
story.append(Paragraph('PREAMBLE / 序言', sSection))
story.append(Paragraph(
    'This agreement upgrades the relationship from initial trial period (Months 1–3) into a formal structured partnership commencing Month 4 (June 2026). The Founder has borne all development and operational costs during the first three months. The Partner contributed time, skills, and execution capacity. Equity participation is now earned through defined operational milestones, government funding success, and sustained commitment.',
    sBody))
story.append(Paragraph(
    '本協議將關係由初始試驗期（第1至3個月）正式升級為結構化合夥關係，由第4個月（2026年6月）起生效。創辦人於首三個月承擔所有開發及營運費用。合夥人以時間、技能及執行能力作出貢獻。股權參與現須透過達成既定營運里程碑、政府資助申請成功及持續承諾來獲取。',
    sBody))

# ── SECTION 1 ─────────────────────────────────────────────────────────────────
story.append(Paragraph('1.  PURPOSE / 協議目的', sSection))
for txt in [
    '1.1  This agreement formalises the operational and equity participation arrangement between both parties in the building and development of SIMPLEX-ITY. / 本協議正式確立雙方在建立及發展 SIMPLEX-ITY 方面的營運及股權參與安排。',
    '1.2  The Partner\'s primary role is <b>Operations Director</b> — ensuring company operations, legal compliance, and platform efficiency. Business development and client direction remain under the Founder\'s leadership. / 合夥人主要職責為<b>營運總監</b>——確保公司運作順暢、合法及高效。業務發展及客戶方向仍由創辦人主導。',
    '1.3  This agreement supersedes all prior verbal or informal arrangements. / 本協議取代雙方之前所有口頭或非正式安排。',
]:
    story.append(Paragraph(txt, sClause))

# ── SECTION 2 ─────────────────────────────────────────────────────────────────
story.append(Paragraph('2.  PARTNER\'S CORE RESPONSIBILITIES / 合夥人核心職責', sSection))
story.append(Paragraph('PHASE A — FOUNDATION  /  第A階段 — 公司基礎建設（最基本要求）', sSubSection))
for txt in [
    '2.1  Office setup and day-to-day facility management / 辦公室設置及日常管理',
    '2.2  Corporate bank account opening and ongoing management / 公司銀行戶口開立及日常管理',
    '2.3  Government funding research, application and follow-through — BUD Fund, TVP, ESF / 政府資助計劃研究、申請及跟進（BUD基金、科技券、創業資助）',
    '2.4  Financial record-keeping, bookkeeping, and expense management / 財務記錄、簿記及費用管理',
    '2.5  Tax filing, profits tax compliance, and MPF administration / 報稅、利得稅合規及強積金行政',
    '2.6  Company secretarial coordination and legal document management / 公司秘書協調及法律文件管理',
]:
    story.append(Paragraph(txt, sClause))

story.append(Paragraph('PHASE B — PLATFORM & NETWORK OPERATIONS  /  第B階段 — 平台及網絡運作', sSubSection))
for txt in [
    '2.7  Operational platform setup and day-to-day maintenance / 營運平台建立及日常維護',
    '2.8  Trial operation period supervision and testing / 試運作階段監督及測試',
    '2.9  External coordination with vendors, partners, and government bodies / 對外協調工作',
    '2.10  Network support staffing, team management, and workflow administration / 網絡支援人手安排及管理',
]:
    story.append(Paragraph(txt, sClause))

# ── SECTION 3 ─────────────────────────────────────────────────────────────────
story.append(Paragraph('3.  MINIMUM COMMITMENT / 最低承諾要求', sSection))
for txt in [
    '(a)  Attend weekly internal meetings (in person or online) / 每週出席內部會議（實體或網上）',
    '(b)  Submit monthly operations report covering: finance, platform status, administration / 每月提交營運報告，涵蓋：財務、平台狀況及行政',
    '(c)  Non-compete: Partner shall not work for or hold interest in a competing business during the term / 非競爭條款：合夥人期間不得為競爭對手工作或持有任何競爭業務權益',
    '(d)  Provide 14 calendar days\' written notice to discontinue / 如選擇終止，須提前14個日曆天書面通知',
]:
    story.append(Paragraph(txt, sClause))

# ── SECTION 4 — EQUITY TABLE ──────────────────────────────────────────────────
story.append(Paragraph('4.  EQUITY PARTICIPATION STRUCTURE / 股權參與架構', sSection))
story.append(Paragraph(
    '<b>Structure:</b> Equity begins as Phantom Equity — financial rights equivalent to shareholding, without formal share issuance. Formal share transfers occur at defined milestones. This protects the Founder\'s legal ownership while fully honouring the Partner\'s earned participation.',
    sSmall))
story.append(Paragraph(
    '<b>架構說明：</b>股權初期以虛擬股權形式架構，不正式發行股份。正式股份轉讓於雙方確認達成里程碑後進行。',
    sSmall))
story.append(Spacer(1, 4))

hdr_style = ParagraphStyle('TblHdr', fontName='Exo2-SemiBold', fontSize=7.5,
    textColor=WHITE_CANVAS, alignment=TA_CENTER, leading=11)
cell_s = ParagraphStyle('TblCell', fontName='Montserrat', fontSize=7.5,
    textColor=BODY_TEXT, alignment=TA_LEFT, leading=11, spaceAfter=0)
cell_b = ParagraphStyle('TblBold', fontName='Montserrat-Bold', fontSize=7.5,
    textColor=ACCENT_VIOLET, alignment=TA_CENTER, leading=11)

eq_data = [
    [Paragraph('Tranche\n批次', hdr_style),
     Paragraph('Period\n期間', hdr_style),
     Paragraph('Equity\n股份', hdr_style),
     Paragraph('Key Conditions / 主要條件', hdr_style),
     Paragraph('Formal Action / 正式行動', hdr_style)],
    [
        Paragraph('1', cell_b),
        Paragraph('Month 4–6\nJun–Aug 2026', cell_s),
        Paragraph('3%\nPhantom\n虛擬股權', cell_b),
        Paragraph('• Bank a/c + office complete\n• 2+ funding applications submitted\n• Platform trial run live\n• 3 monthly reports delivered\n• 銀行+辦公室+2份資助申請+平台試運', cell_s),
        Paragraph('Founder issues written phantom equity confirmation letter\n創辦人書面確認虛擬股權', cell_s),
    ],
    [
        Paragraph('2', cell_b),
        Paragraph('Month 7–12\nSep 2026–\nFeb 2027', cell_s),
        Paragraph('4%\nFormal\nShares\n正式股份', cell_b),
        Paragraph('• 1+ funding scheme approved\n• Platform fully operational & stable\n• Financial records current\n• Full-time commitment maintained\n• 1項資助批核+平台全面運作', cell_s),
        Paragraph('Share transfer — Partner formally registered at 4% in 5SENSESBEAUTY LIMITED\n正式股份轉讓，登記持股4%', cell_s),
    ],
    [
        Paragraph('3', cell_b),
        Paragraph('Month 13–18\nMar–Aug 2027', cell_s),
        Paragraph('5%\nFormal\nShares\n正式股份\n(Total 12%\n共12%)', cell_b),
        Paragraph('• HKD 300,000+ funding secured\n• Company self-sustaining\n• All compliance/tax/MPF fulfilled\n• Full-time contribution continues\n• 資助累計30萬+全合規', cell_s),
        Paragraph('Second share transfer — total shareholding increased to 12%\n第二次股份轉讓，總持股增至12%', cell_s),
    ],
]
et = Table(eq_data, colWidths=[12*mm, 22*mm, 18*mm, 62*mm, 60*mm])
et.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), ACCENT_VIOLET),
    ('BACKGROUND', (0,1), (-1,1), LAVENDER_WASH),
    ('BACKGROUND', (0,2), (-1,2), WHITE_CANVAS),
    ('BACKGROUND', (0,3), (-1,3), LAVENDER_WASH),
    ('BOX',        (0,0), (-1,-1), 0.8, SOFT_LILAC),
    ('INNERGRID',  (0,0), (-1,-1), 0.5, SOFT_LILAC),
    ('VALIGN',     (0,0), (-1,-1), 'TOP'),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING',(0,0),(-1,-1), 5),
    ('LEFTPADDING', (0,0), (-1,-1), 4),
    ('ALIGN',      (0,0), (0,-1), 'CENTER'),
    ('ALIGN',      (2,0), (2,-1), 'CENTER'),
]))
story.append(et)

# ── SECTION 5 — GOVT FUNDING ──────────────────────────────────────────────────
story.append(Paragraph('5.  GOVERNMENT FUNDING — SPECIAL PROVISIONS / 政府資助特別條款', sSection))
for txt in [
    '5.1  Securing government funding is a <b>core KPI</b> of this partnership. / 爭取政府資助是本合夥關係的<b>核心關鍵績效指標</b>。',
    '5.2  All funding secured shall be used for company operational expenses as mutually agreed. Partner shall not divert or misuse any funding without Founder\'s written consent. / 所獲資助須按雙方協議用於公司營運開支，未經書面同意不得挪用。',
    '5.3  Failure to obtain funding due to circumstances beyond the Partner\'s reasonable control shall not constitute a breach, provided genuine and documented efforts were made. / 若因合理控制範圍以外的情況未能獲批，且已作出真誠及有記錄的努力，則不構成違約。',
    '5.4  Surplus funding shall be reinvested into the company unless otherwise agreed in writing. / 除非另有書面協議，盈餘資助資金應再投入公司。',
]:
    story.append(Paragraph(txt, sClause))

# ── SECTION 6 — SHARE TRANSFER ────────────────────────────────────────────────
story.append(Paragraph('6.  SHARE TRANSFER MECHANICS / 股份轉讓程序', sSection))
for txt in [
    '6.1  <b>Phantom Equity Phase (Months 4–6):</b> No formal shares issued. Founder issues a written letter confirming 3% phantom equity entitlement, which converts to formal shares upon Tranche 2 conditions being met. / <b>虛擬股權階段：</b>不發行正式股份。創辦人發出書面確認信函，於第二批條件達成後轉換為正式股份。',
    '6.2  <b>First Formal Transfer (Month 12):</b> Founder instructs Company Secretary to prepare a share transfer form. Partner formally registered as 4% shareholder in 5SENSESBEAUTY LIMITED. All stamp duty and legal fees borne by the company. / <b>首次正式轉讓（第12個月）：</b>公司秘書辦理，印花稅及法律費用由公司承擔。',
    '6.3  <b>Second Formal Transfer (Month 18):</b> Further share transfer executed, increasing Partner\'s total registered shareholding to 12%. / <b>第二次正式轉讓（第18個月）：</b>總持股增至12%。',
    '6.4  All transfers conducted in accordance with the Companies Ordinance (Cap. 622) and properly documented with the Companies Registry. / 所有轉讓均須符合《公司條例》（第622章）並在公司註冊處妥善記錄。',
]:
    story.append(Paragraph(txt, sClause))

# ── SECTION 7 — TERMINATION ───────────────────────────────────────────────────
story.append(Paragraph('7.  TERMINATION & EXIT / 終止及退出', sSection))
for txt in [
    '7.1  Either party may terminate by providing 30 calendar days\' written notice. / 任何一方可提供30個日曆天書面通知終止本協議。',
    '7.2  Upon Partner termination: (a) All unvested phantom equity immediately cancelled. (b) Formally transferred shares retained by Partner, subject to Founder\'s Right of First Refusal at fair market value before any third-party sale. / 合夥人終止時：未歸屬虛擬股權即時取消；已歸屬股份保留，但創辦人享優先購買權。',
    '7.3  Termination for cause (misconduct, breach, misuse of funds): All equity may be clawed back at Founder\'s discretion. / 因故終止（不當行為、違約、濫用資金）：創辦人可酌情追回所有股權。',
    '7.4  Partner shall return all company property, devices, and confidential materials within 7 calendar days of termination. / 合夥人須於終止後7天內歸還所有公司財產及機密資料。',
]:
    story.append(Paragraph(txt, sClause))

# ── SECTION 8 — CONFIDENTIALITY ───────────────────────────────────────────────
story.append(Paragraph('8.  CONFIDENTIALITY & NON-COMPETE / 保密及競業禁止', sSection))
for txt in [
    '8.1  Both parties maintain strict confidentiality regarding all business operations, client relationships, financial information, platform data, and strategies during and for 2 years after the term. / 雙方在協議期間及終止後2年內嚴格保密。',
    '8.2  Partner shall not, during the term and 12 months after termination, engage in any business directly competing with SIMPLEX-ITY in Hong Kong or the Greater Bay Area. / 合夥人於協議期間及終止後12個月內不得在港或大灣區從事直接競爭業務。',
]:
    story.append(Paragraph(txt, sClause))

# ── SECTION 9 — INTERNATIONAL PROVISIONS ─────────────────────────────────────
story.append(Paragraph('9.  INTERNATIONAL REFERENCE PROVISIONS / 國際參考條款', sSection))
story.append(Paragraph('Drawn from UK / US / EU startup partnership best practices / 參考英美歐初創合夥協議標準條款', sSmall))
for txt in [
    '9.1  <b>Good / Bad Leaver (UK/US):</b> Good Leaver (health, family, mutual agreement) retains vested shares at full value. Bad Leaver (cause, breach, competing) forfeits unvested equity; vested shares subject to buyback at par. / 好／壞離職者：好離職者保留已歸屬股份；壞離職者喪失未歸屬股權，已歸屬股份以面值回購。',
    '9.2  <b>Drag-Along Right (US/EU):</b> If Founder receives a bona fide 100% acquisition offer, Partner agrees to sell shares on same terms. / 強制隨售權：若創辦人獲100%收購要約，合夥人同意按相同條款出售股份。',
    '9.3  <b>Tag-Along Right (US/EU):</b> If Founder sells majority shareholding, Partner has right to sell shares under same terms. / 隨售權：若創辦人出售多數股權，合夥人有權在相同條款下出售股份。',
    '9.4  <b>Anti-Dilution (US):</b> Partner\'s percentage shall not be diluted below 5% without written consent, provided all vesting conditions are met. / 防稀釋保護：在所有歸屬條件達成前提下，未經書面同意不得稀釋至5%以下。',
    '9.5  <b>IP Assignment:</b> All IP, technology, tools, processes, and systems created by Partner in course of role belong solely to 5SENSESBEAUTY LIMITED. / 知識產權轉讓：合夥人在職責範圍內創造的所有知識產權歸5SENSESBEAUTY LIMITED單獨所有。',
]:
    story.append(Paragraph(txt, sClause))

# ── SECTION 10 — DISPUTE ──────────────────────────────────────────────────────
story.append(Paragraph('10.  DISPUTE RESOLUTION / 爭議解決', sSection))
for txt in [
    '10.1  Both parties attempt good faith negotiation within 14 days of written notice of dispute. / 雙方在書面通知爭議後14天內透過真誠談判嘗試解決。',
    '10.2  If unresolved, submit to mediation in Hong Kong before commencing any legal action. / 如未能解決，在提起法律行動前提交香港調解。',
    '10.3  This agreement is governed by the laws of Hong Kong SAR. / 本協議受香港特別行政區法律管轄。',
]:
    story.append(Paragraph(txt, sClause))

# ── SIGNATURE BLOCK ───────────────────────────────────────────────────────────
story.append(Spacer(1, 5))
story.append(HRFlowable(width='100%', thickness=1, color=SOFT_LILAC, spaceAfter=5))
story.append(Paragraph('SIGNATURES / 簽署', sSection))

sig_data = [
    [Paragraph('FOUNDER / 創辦人', sBold), Paragraph('PARTNER / 合夥人', sBold)],
    [
        Paragraph(
            'Name / 姓名:  KIERAN LI (LI, Chi Nok)<br/><br/>'
            'Signature / 簽署:<br/><br/>'
            '______________________________<br/><br/>'
            'Date / 日期:  ____________________', sSign),
        Paragraph(
            'Chosen Name / 常用名稱:  __________________<br/>'
            'Legal Name / 法定姓名:  ____________________<br/>'
            'HKID:  __________________________________<br/><br/>'
            'Signature / 簽署:<br/><br/>'
            '______________________________<br/><br/>'
            'Date / 日期:  ____________________', sSign),
    ],
    [Paragraph('WITNESS / 見證人  (Recommended / 建議)', sBold), Paragraph('', sSign)],
    [
        Paragraph(
            'Name / 姓名:  ______________________________<br/><br/>'
            'Signature / 簽署:<br/><br/>'
            '______________________________<br/><br/>'
            'Date / 日期:  ____________________', sSign),
        Paragraph('', sSign),
    ],
]
st = Table(sig_data, colWidths=[87*mm, 87*mm])
st.setStyle(TableStyle([
    ('BACKGROUND',    (0,0), (-1,0), LAVENDER_WASH),
    ('BACKGROUND',    (0,2), (-1,2), LAVENDER_WASH),
    ('BOX',           (0,0), (-1,-1), 0.8, SOFT_LILAC),
    ('INNERGRID',     (0,0), (-1,-1), 0.5, SOFT_LILAC),
    ('VALIGN',        (0,0), (-1,-1), 'TOP'),
    ('TOPPADDING',    (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ('LEFTPADDING',   (0,0), (-1,-1), 7),
    ('SPAN',          (0,2), (1,2)),
    ('SPAN',          (1,3), (1,3)),
]))
story.append(st)

# ── ADDENDUM A ────────────────────────────────────────────────────────────────
story.append(Spacer(1, 5))
story.append(HRFlowable(width='100%', thickness=1.5, color=PRIMARY_LILAC, spaceAfter=4))
story.append(Paragraph('ADDENDUM A — MILESTONE VERIFICATION CHECKLIST / 附件A — 里程碑核實清單', sSection))
story.append(Paragraph(
    'To be completed and signed by both parties at the end of each Tranche period. / 於每批次期間結束時填寫並由雙方簽署確認。', sSmall))

tranche_hdr = ParagraphStyle('TH', fontName='Exo2-SemiBold', fontSize=8.5,
    textColor=WHITE_CANVAS, alignment=TA_LEFT, leading=12)

for label, period, items in [
    ('TRANCHE 1 / 第一批  —  3%  (Phantom Equity / 虛擬股權)',
     'Month 6  —  August 2026 / 2026年8月', [
        '☐  Bank account opened / 銀行戶口已開立',
        '☐  Office operational / 辦公室已運作',
        '☐  2+ government funding applications formally submitted / 已正式提交2份或以上資助申請',
        '☐  Platform trial run completed / 平台試運作已完成',
        '☐  3 monthly operations reports submitted / 已提交3份月度營運報告',
    ]),
    ('TRANCHE 2 / 第二批  —  4%  (Formal Shares / 正式股份)',
     'Month 12  —  February 2027 / 2027年2月', [
        '☐  1+ government funding scheme successfully approved / 1項或以上資助計劃已成功批核',
        '☐  Platform fully operational and stable / 平台全面運作及穩定',
        '☐  Financial records up to date and auditable / 財務記錄已更新及可審計',
        '☐  Partner actively committed full-time / 合夥人積極全職投入',
    ]),
    ('TRANCHE 3 / 第三批  —  5%  (Formal Shares / 正式股份)  —  TOTAL 12% / 共12%',
     'Month 18  —  August 2027 / 2027年8月', [
        '☐  HKD 300,000+ in government funding secured / 已累積獲得港幣30萬元或以上政府資助',
        '☐  Company self-sustaining and fully operational / 公司能自行運作，系統完整建立',
        '☐  All compliance, tax, and MPF obligations fulfilled / 所有合規、稅務及強積金責任均已履行',
        '☐  Partner continues full-time active contribution / 合夥人繼續全職積極貢獻',
    ]),
]:
    ad_data = [
        [Paragraph(label, tranche_hdr), Paragraph(period, tranche_hdr)],
    ]
    at = Table(ad_data, colWidths=[112*mm, 62*mm])
    at.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), ACCENT_VIOLET),
        ('BOX', (0,0), (-1,-1), 0, WHITE_CANVAS),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(at)
    for item in items:
        story.append(Paragraph(item, sClause))
    signoff_data = [[
        Paragraph('Founder sign-off / 創辦人確認: _________________ &nbsp;&nbsp; Date / 日期: _____________', sSmall),
        Paragraph('Partner sign-off / 合夥人確認: _________________ &nbsp;&nbsp; Date / 日期: _____________', sSmall),
    ]]
    sot = Table(signoff_data, colWidths=[87*mm, 87*mm])
    sot.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 0.5, NEUTRAL_GREY),
        ('INNERGRID', (0,0), (-1,-1), 0.5, NEUTRAL_GREY),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f9f9ff')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(sot)
    story.append(Spacer(1, 3))

# ── LEGAL DISCLAIMER ──────────────────────────────────────────────────────────
story.append(HRFlowable(width='100%', thickness=0.5, color=NEUTRAL_GREY, spaceBefore=6, spaceAfter=3))
story.append(Paragraph(
    '<b>LEGAL DISCLAIMER / 法律免責聲明:</b>  This document is a draft for discussion purposes only. It is strongly recommended that both parties seek independent legal advice from a qualified Hong Kong solicitor before signing. Share transfers must comply with the Companies Ordinance (Cap. 622) and may require Companies Registry approval and payment of stamp duty.  /  本文件僅為討論草稿。強烈建議雙方在簽署前向具資格的香港律師尋求獨立法律意見。股份轉讓必須符合《公司條例》（第622章），可能需要公司註冊處批准及繳付印花稅。<br/><br/>Fallback note: Document produced using Exo 2 (headlines) and Montserrat (body) per SIMPLEX-ITY Brand Guidelines BX-01 v1.0 April 2026.',
    sDisclaim))

# ── BUILD PDF ─────────────────────────────────────────────────────────────────
doc.build(story, onFirstPage=draw_header_footer, onLaterPages=draw_header_footer)
print(f"✅ PDF built: {output_path}")
