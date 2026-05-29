from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
import os

# ── Register Brand Fonts ──────────────────────────────────────────────────────
pdfmetrics.registerFont(TTFont('Exo2',          '/app/fonts/Exo2-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Exo2-SemiBold', '/app/fonts/Exo2-SemiBold.ttf'))
pdfmetrics.registerFont(TTFont('Exo2-Bold',     '/app/fonts/Exo2-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Mont',          '/app/fonts/Montserrat-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Mont-Med',      '/app/fonts/Montserrat-Medium.ttf'))
pdfmetrics.registerFont(TTFont('Mont-SemiBold', '/app/fonts/Montserrat-SemiBold.ttf'))
pdfmetrics.registerFont(TTFont('Mont-Bold',     '/app/fonts/Montserrat-Bold.ttf'))

# ── Brand Colors (BX-01) ─────────────────────────────────────────────────────
PRIMARY_LILAC = colors.HexColor('#8c82fc')
ACCENT_VIOLET = colors.HexColor('#5e50fb')
SOFT_LILAC    = colors.HexColor('#bab4fd')
LAVENDER_WASH = colors.HexColor('#e8e6fe')
WHITE_CANVAS  = colors.HexColor('#ffffff')
NEUTRAL_GREY  = colors.HexColor('#e6e6e6')
BODY_TEXT     = colors.HexColor('#1a1a1f')

W, H = A4

# ── Assets ───────────────────────────────────────────────────────────────────
LETTERHEAD_IMG  = '/app/letterhead_header.png'
DIVIDER_IMG     = '/app/letterhead_divider.png'
FOOTER_DIV_IMG  = '/app/letterhead_divider_footer.png'

# ── Letterhead dimensions
# Original image: 2645 x 955 px → scale to full A4 width
LH_W = W - 0   # full bleed width
LH_H = LH_W * (955 / 2645)   # maintain aspect ratio → ~79mm

# ── Header / Footer on every page ────────────────────────────────────────────
def draw_page(c, doc):
    c.saveState()

    # ── HEADER: actual letterhead image (full width, top of page) ──
    c.drawImage(LETTERHEAD_IMG,
                x=0, y=H - LH_H,
                width=LH_W, height=LH_H,
                preserveAspectRatio=False,
                mask='auto')

    # ── FOOTER ────────────────────────────────────────────────────────────────
    FOOTER_H = 12 * mm
    # Violet bar
    c.setFillColor(ACCENT_VIOLET)
    c.rect(0, 0, W, FOOTER_H, fill=1, stroke=0)

    # Footer text
    c.setFillColor(WHITE_CANVAS)
    c.setFont('Mont', 6.5)
    c.drawString(14*mm, 7*mm, 'RM1608, 16/F, APEC PLAZA, 49 HOI YUEN RD, KWUN TONG')
    c.drawString(14*mm, 3.5*mm, 'www.simplex-ity.com  ·  enquiries@simplex-ity.com')

    c.setFont('Mont-SemiBold', 6.5)
    c.drawRightString(W - 14*mm, 7*mm, 'Partnership & Equity Agreement  V3')
    c.drawRightString(W - 14*mm, 3.5*mm, f'Page {doc.page}  ·  CONFIDENTIAL')

    c.restoreState()


# ── Doc Setup ─────────────────────────────────────────────────────────────────
# Top margin must clear the letterhead image height
TOP_MARGIN = LH_H + 5*mm

doc = SimpleDocTemplate(
    '/app/Wilson_Partnership_Agreement_V4_Letterhead.pdf',
    pagesize=A4,
    rightMargin=16*mm, leftMargin=16*mm,
    topMargin=TOP_MARGIN,
    bottomMargin=16*mm
)

# ── Paragraph Styles ──────────────────────────────────────────────────────────
def S(name, font, size, color=BODY_TEXT, align=TA_LEFT,
      sb=0, sa=4, leading=None, li=0):
    return ParagraphStyle(name, fontName=font, fontSize=size, textColor=color,
        alignment=align, spaceBefore=sb, spaceAfter=sa,
        leading=leading or size*1.4, leftIndent=li)

sDocTitle = S('DocTitle', 'Exo2-Bold',    14, PRIMARY_LILAC, TA_CENTER, sa=2, leading=20)
sDocSub   = S('DocSub',   'Mont',          8, BODY_TEXT,     TA_CENTER, sa=2, leading=12)
sSection  = S('Section',  'Exo2-SemiBold',10, ACCENT_VIOLET, TA_LEFT,   sb=10, sa=4, leading=14)
sSubSect  = S('SubSect',  'Exo2-SemiBold', 9, PRIMARY_LILAC, TA_LEFT,   sb=5,  sa=3, leading=13)
sBody     = S('Body',     'Mont',           8, BODY_TEXT,     TA_JUSTIFY, sa=4, leading=12.5)
sBold     = S('Bold',     'Mont-Bold',      8, BODY_TEXT,     TA_LEFT,    sa=3, leading=12)
sClause   = S('Clause',   'Mont',           8, BODY_TEXT,     TA_JUSTIFY, sa=3, leading=12, li=6)
sSmall    = S('Small',    'Mont',         7.5, colors.HexColor('#555555'), TA_JUSTIFY, sa=2, leading=11)
sSign     = S('Sign',     'Mont',         8.5, BODY_TEXT,     TA_LEFT,    sa=8, leading=15)
sDisclaim = S('Disc',     'Mont',         6.8, colors.HexColor('#888888'), TA_JUSTIFY, sa=2, leading=10.5)

# Table header style
hdr_s = ParagraphStyle('TH', fontName='Exo2-SemiBold', fontSize=7.5,
    textColor=WHITE_CANVAS, alignment=TA_CENTER, leading=11)
cell_s = ParagraphStyle('TC', fontName='Mont', fontSize=7.5,
    textColor=BODY_TEXT, alignment=TA_LEFT, leading=11, spaceAfter=0)
cell_b = ParagraphStyle('TB', fontName='Mont-Bold', fontSize=7.5,
    textColor=ACCENT_VIOLET, alignment=TA_CENTER, leading=11)
tranche_s = ParagraphStyle('TR', fontName='Exo2-SemiBold', fontSize=8,
    textColor=WHITE_CANVAS, alignment=TA_LEFT, leading=12)

def c(txt, style=sClause):
    return Paragraph(txt, style)

# ── Story ─────────────────────────────────────────────────────────────────────
story = []

# TITLE
story.append(Paragraph('PARTNERSHIP & EQUITY PARTICIPATION AGREEMENT', sDocTitle))
story.append(Paragraph('合作及股權參與協議 — VERSION 3 / 第三版', sDocSub))
story.append(Paragraph('Date / 日期: 29 May 2026  ·  CONFIDENTIAL / 機密文件', sDocSub))
story.append(HRFlowable(width='100%', thickness=1.5, color=PRIMARY_LILAC, spaceBefore=4, spaceAfter=6))

# PARTIES
story.append(Paragraph('BETWEEN / 協議雙方', sSection))
party = Table([
    [c('FOUNDER / 創辦人', sBold), c('PARTNER / 合夥人', sBold)],
    [
        c('KIERAN LI (LI, Chi Nok) / 李志諾<br/>Founder &amp; Director, SIMPLEX-ITY<br/>Branch of 5SENSESBEAUTY LIMITED<br/>Rm 1608, 16/F APEC Plaza, Kwun Tong<br/>BR No: 78459506-001-07-25-A<br/><i>("the Founder" / 「創辦人」)</i>'),
        c('WILSON [FULL LEGAL NAME TBC]<br/>Operations Partner, SIMPLEX-ITY<br/>Address / 地址: [TBC]<br/>HKID No / 香港身份證: [TBC]<br/><br/><i>("the Partner" / 「合夥人」)</i>'),
    ]
], colWidths=[88*mm, 88*mm])
party.setStyle(TableStyle([
    ('BACKGROUND',(0,0),(-1,0), LAVENDER_WASH),
    ('BOX',(0,0),(-1,-1),0.8,SOFT_LILAC),
    ('INNERGRID',(0,0),(-1,-1),0.5,SOFT_LILAC),
    ('VALIGN',(0,0),(-1,-1),'TOP'),
    ('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5),
    ('LEFTPADDING',(0,0),(-1,-1),7),
]))
story.append(party)
story.append(Spacer(1, 3))

# PREAMBLE
story.append(Paragraph('PREAMBLE / 序言', sSection))
story.append(Paragraph(
    'This agreement upgrades the relationship from initial trial period (Months 1–3) into a formal structured partnership commencing Month 4 (June 2026). The Founder has borne all development and operational costs during the first three months. Equity participation is earned through defined operational milestones, government funding success, and sustained commitment.',
    sBody))
story.append(Paragraph(
    '本協議將關係由初始試驗期（第1至3個月）正式升級為結構化合夥關係，由第4個月（2026年6月）起生效。創辦人於首三個月承擔所有開發及營運費用。股權參與須透過達成既定里程碑、政府資助成功及持續承諾獲取。',
    sBody))

# SECTION 1
story.append(Paragraph('1.  PURPOSE / 協議目的', sSection))
for txt in [
    '1.1  This agreement formalises the operational and equity participation arrangement in the building and development of SIMPLEX-ITY. / 本協議正式確立雙方在建立及發展 SIMPLEX-ITY 方面的安排。',
    '1.2  The Partner\'s primary role is <b>Operations Director</b> — company operations, legal compliance, and platform efficiency. Business development remains under the Founder\'s leadership. / 合夥人主要職責為<b>營運總監</b>。業務發展及客戶方向仍由創辦人主導。',
    '1.3  This agreement supersedes all prior verbal or informal arrangements. / 本協議取代雙方之前所有口頭或非正式安排。',
]:
    story.append(Paragraph(txt, sClause))

# SECTION 2
story.append(Paragraph('2.  PARTNER\'S CORE RESPONSIBILITIES / 合夥人核心職責', sSection))
story.append(Paragraph('PHASE A — FOUNDATION  /  第A階段 — 公司基礎建設（最基本要求）', sSubSect))
for txt in [
    '2.1  Office setup and day-to-day facility management / 辦公室設置及日常管理',
    '2.2  Corporate bank account opening and ongoing management / 公司銀行戶口開立及日常管理',
    '2.3  Government funding research, application and follow-through — BUD Fund, TVP, ESF / 政府資助計劃研究、申請及跟進',
    '2.4  Financial record-keeping, bookkeeping, and expense management / 財務記錄、簿記及費用管理',
    '2.5  Tax filing, profits tax compliance, and MPF administration / 報稅、利得稅合規及強積金行政',
    '2.6  Company secretarial coordination and legal document management / 公司秘書協調及法律文件管理',
]:
    story.append(Paragraph(txt, sClause))

story.append(Paragraph('PHASE B — PLATFORM & NETWORK OPERATIONS  /  第B階段 — 平台及網絡運作', sSubSect))
for txt in [
    '2.7  Operational platform setup and day-to-day maintenance / 營運平台建立及日常維護',
    '2.8  Trial operation period supervision and testing / 試運作階段監督及測試',
    '2.9  External coordination with vendors, partners, and government bodies / 對外協調工作',
    '2.10  Network support staffing, team management, and workflow administration / 網絡支援人手安排及管理',
]:
    story.append(Paragraph(txt, sClause))

# SECTION 3
story.append(Paragraph('3.  MINIMUM COMMITMENT / 最低承諾要求', sSection))
for txt in [
    '(a)  Attend weekly internal meetings (in person or online) / 每週出席內部會議',
    '(b)  Submit monthly operations report: finance, platform status, administration / 每月提交營運報告',
    '(c)  Non-compete: Partner shall not work for or hold interest in a competing business during the term / 非競爭條款：合夥人期間不得為競爭對手工作',
    '(d)  Provide 14 calendar days\' written notice to discontinue / 如選擇終止，提前14天書面通知',
]:
    story.append(Paragraph(txt, sClause))

# SECTION 4 — EQUITY TABLE
story.append(Paragraph('4.  EQUITY PARTICIPATION STRUCTURE / 股權參與架構', sSection))
story.append(Paragraph(
    '<b>Structure:</b> Equity begins as Phantom Equity — financial rights without formal share issuance. Formal share transfers occur at defined milestones, protecting the Founder\'s legal ownership while honouring the Partner\'s earned rights.  /  <b>架構：</b>股權初期以虛擬股權形式架構，正式股份轉讓於達成里程碑後進行。',
    sSmall))
story.append(Spacer(1, 4))

eq = Table([
    [Paragraph('Tranche\n批次', hdr_s), Paragraph('Period\n期間', hdr_s),
     Paragraph('Equity\n股份', hdr_s), Paragraph('Key Conditions / 主要條件', hdr_s),
     Paragraph('Formal Action / 正式行動', hdr_s)],
    [Paragraph('1', cell_b), Paragraph('Month 4–6\nJun–Aug 2026', cell_s),
     Paragraph('3%\nPhantom\n虛擬股權', cell_b),
     Paragraph('• Bank a/c + office complete\n• 2+ funding applications submitted\n• Platform trial run live\n• 3 monthly reports delivered', cell_s),
     Paragraph('Founder issues written phantom equity confirmation letter\n創辦人書面確認虛擬股權', cell_s)],
    [Paragraph('2', cell_b), Paragraph('Month 7–12\nSep 2026–Feb 2027', cell_s),
     Paragraph('4%\nFormal\nShares\n正式股份', cell_b),
     Paragraph('• 1+ funding scheme approved\n• Platform fully operational\n• Financial records current\n• Full-time commitment', cell_s),
     Paragraph('Share transfer — Partner registered at 4% in 5SENSESBEAUTY LIMITED\n正式股份轉讓，登記4%', cell_s)],
    [Paragraph('3', cell_b), Paragraph('Month 13–18\nMar–Aug 2027', cell_s),
     Paragraph('5%\nFormal\nShares\n正式股份\n(Total 12%)', cell_b),
     Paragraph('• HKD 300,000+ funding secured\n• Company self-sustaining\n• All compliance/tax/MPF fulfilled\n• Full-time continues', cell_s),
     Paragraph('Second share transfer — total 12%\n第二次股份轉讓，總持股12%', cell_s)],
], colWidths=[12*mm, 23*mm, 18*mm, 63*mm, 60*mm])
eq.setStyle(TableStyle([
    ('BACKGROUND',(0,0),(-1,0),ACCENT_VIOLET),
    ('BACKGROUND',(0,1),(-1,1),LAVENDER_WASH),
    ('BACKGROUND',(0,2),(-1,2),WHITE_CANVAS),
    ('BACKGROUND',(0,3),(-1,3),LAVENDER_WASH),
    ('BOX',(0,0),(-1,-1),0.8,SOFT_LILAC),
    ('INNERGRID',(0,0),(-1,-1),0.5,SOFT_LILAC),
    ('VALIGN',(0,0),(-1,-1),'TOP'),
    ('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5),
    ('LEFTPADDING',(0,0),(-1,-1),4),
    ('ALIGN',(0,0),(0,-1),'CENTER'),('ALIGN',(2,0),(2,-1),'CENTER'),
]))
story.append(eq)

# SECTION 5
story.append(Paragraph('5.  GOVERNMENT FUNDING — SPECIAL PROVISIONS / 政府資助特別條款', sSection))
for txt in [
    '5.1  Securing government funding is a <b>core KPI</b> of this partnership. / 爭取政府資助是本合夥關係的<b>核心KPI</b>。',
    '5.2  Funding shall be used for company operational expenses as agreed. Partner shall not divert funds without Founder\'s written consent. / 資助須按協議用於公司營運開支，未經書面同意不得挪用。',
    '5.3  Failure to obtain funding due to circumstances beyond Partner\'s reasonable control shall not constitute breach, provided genuine efforts were documented. / 若因合理控制範圍以外情況未能獲批，且已作出真誠及有記錄的努力，不構成違約。',
    '5.4  Surplus funding shall be reinvested into the company unless otherwise agreed in writing. / 除非另有書面協議，盈餘資助資金應再投入公司。',
]:
    story.append(Paragraph(txt, sClause))

# SECTION 6
story.append(Paragraph('6.  SHARE TRANSFER MECHANICS / 股份轉讓程序', sSection))
for txt in [
    '6.1  <b>Phantom Equity Phase (Months 4–6):</b> No formal shares issued. Founder issues written letter confirming 3% phantom equity entitlement, converting to formal shares upon Tranche 2 conditions being met. / <b>虛擬股權階段：</b>不發行正式股份。創辦人發出書面確認，第二批條件達成後轉換。',
    '6.2  <b>First Formal Transfer (Month 12):</b> Company Secretary prepares share transfer form. Partner registered as 4% shareholder. Stamp duty and legal fees borne by company. / <b>首次正式轉讓（第12個月）：</b>公司秘書辦理，印花稅及費用由公司承擔。',
    '6.3  <b>Second Formal Transfer (Month 18):</b> Total registered shareholding increased to 12%. / <b>第二次正式轉讓（第18個月）：</b>總持股增至12%。',
    '6.4  All transfers comply with Companies Ordinance (Cap. 622) and are documented with the Companies Registry. / 所有轉讓均須符合《公司條例》（第622章）。',
]:
    story.append(Paragraph(txt, sClause))

# SECTION 7
story.append(Paragraph('7.  TERMINATION & EXIT / 終止及退出', sSection))
for txt in [
    '7.1  Either party may terminate by providing 30 calendar days\' written notice. / 任何一方可提供30天書面通知終止本協議。',
    '7.2  Upon Partner termination: (a) Unvested equity immediately cancelled. (b) Formally transferred shares retained, subject to Founder\'s Right of First Refusal at fair market value. / 合夥人終止時：未歸屬股權即時取消；已歸屬股份保留，創辦人享優先購買權。',
    '7.3  Termination for cause (misconduct, breach, misuse of funds): All equity may be clawed back at Founder\'s discretion. / 因故終止：創辦人可酌情追回所有股權。',
    '7.4  Partner returns all company property and confidential materials within 7 calendar days. / 合夥人須於終止後7天內歸還所有公司財產。',
]:
    story.append(Paragraph(txt, sClause))

# SECTION 8
story.append(Paragraph('8.  CONFIDENTIALITY & NON-COMPETE / 保密及競業禁止', sSection))
for txt in [
    '8.1  Both parties maintain strict confidentiality during and for 2 years after the term. / 雙方在協議期間及終止後2年內嚴格保密。',
    '8.2  Partner shall not engage in competing business in HK or Greater Bay Area during the term and 12 months after termination. / 合夥人於協議期間及終止後12個月內不得從事直接競爭業務。',
]:
    story.append(Paragraph(txt, sClause))

# SECTION 9
story.append(Paragraph('9.  INTERNATIONAL REFERENCE PROVISIONS / 國際參考條款', sSection))
story.append(Paragraph('Based on UK / US / EU startup partnership best practices / 參考英美歐初創合夥協議標準', sSmall))
for txt in [
    '9.1  <b>Good/Bad Leaver (UK/US):</b> Good Leaver retains vested shares at full value. Bad Leaver forfeits unvested equity; vested shares subject to buyback at par. / 好／壞離職者：好離職者保留全額歸屬股份；壞離職者喪失未歸屬股權。',
    '9.2  <b>Drag-Along Right (US/EU):</b> If Founder receives bona fide 100% acquisition offer, Partner agrees to sell on same terms. / 強制隨售權：收購要約時合夥人同意按相同條款出售。',
    '9.3  <b>Tag-Along Right (US/EU):</b> If Founder sells majority holding, Partner may sell shares under same terms. / 隨售權：創辦人出售多數股權時，合夥人有權跟隨出售。',
    '9.4  <b>Anti-Dilution (US):</b> Partner\'s stake not diluted below 5% without written consent, once all vesting conditions are met. / 防稀釋：所有條件達成後，未經書面同意不得稀釋至5%以下。',
    '9.5  <b>IP Assignment:</b> All IP, technology, tools, and systems created by Partner in course of role belong solely to 5SENSESBEAUTY LIMITED. / 所有知識產權歸5SENSESBEAUTY LIMITED單獨所有。',
]:
    story.append(Paragraph(txt, sClause))

# SECTION 10
story.append(Paragraph('10.  DISPUTE RESOLUTION / 爭議解決', sSection))
for txt in [
    '10.1  Good faith negotiation within 14 days of written notice of dispute. / 書面通知爭議後14天內透過真誠談判解決。',
    '10.2  If unresolved, submit to mediation in Hong Kong before legal action. / 如未能解決，在提起法律行動前提交香港調解。',
    '10.3  Governed by the laws of Hong Kong SAR. / 受香港特別行政區法律管轄。',
]:
    story.append(Paragraph(txt, sClause))

# SIGNATURES
story.append(Spacer(1, 5))
story.append(HRFlowable(width='100%', thickness=1, color=SOFT_LILAC, spaceAfter=5))
story.append(Paragraph('SIGNATURES / 簽署', sSection))
sig = Table([
    [c('FOUNDER / 創辦人', sBold), c('PARTNER / 合夥人', sBold)],
    [
        c('Name / 姓名:  KIERAN LI (LI, Chi Nok)<br/><br/>Signature / 簽署:<br/><br/>______________________________<br/><br/>Date / 日期:  ____________________', sSign),
        c('Chosen Name / 常用名稱:  __________________<br/>Legal Name / 法定姓名:  ____________________<br/>HKID:  __________________________________<br/><br/>Signature / 簽署:<br/><br/>______________________________<br/><br/>Date / 日期:  ____________________', sSign),
    ],
    [c('WITNESS / 見證人  (Recommended / 建議)', sBold), c('', sSign)],
    [
        c('Name / 姓名:  ______________________________<br/><br/>Signature / 簽署:<br/><br/>______________________________<br/><br/>Date / 日期:  ____________________', sSign),
        c('', sSign),
    ],
], colWidths=[88*mm, 88*mm])
sig.setStyle(TableStyle([
    ('BACKGROUND',(0,0),(-1,0),LAVENDER_WASH),
    ('BACKGROUND',(0,2),(-1,2),LAVENDER_WASH),
    ('BOX',(0,0),(-1,-1),0.8,SOFT_LILAC),
    ('INNERGRID',(0,0),(-1,-1),0.5,SOFT_LILAC),
    ('VALIGN',(0,0),(-1,-1),'TOP'),
    ('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5),
    ('LEFTPADDING',(0,0),(-1,-1),7),
    ('SPAN',(0,2),(1,2)),('SPAN',(1,3),(1,3)),
]))
story.append(sig)

# ADDENDUM A
story.append(Spacer(1,5))
story.append(HRFlowable(width='100%', thickness=1.5, color=PRIMARY_LILAC, spaceAfter=4))
story.append(Paragraph('ADDENDUM A — MILESTONE VERIFICATION CHECKLIST / 附件A — 里程碑核實清單', sSection))
story.append(Paragraph('To be completed and signed by both parties at end of each Tranche. / 於每批次結束時填寫並由雙方簽署。', sSmall))

for label, period, items in [
    ('TRANCHE 1 / 第一批  —  3%  Phantom Equity / 虛擬股權', 'Month 6  ·  August 2026', [
        '☐  Bank account opened / 銀行戶口已開立',
        '☐  Office operational / 辦公室已運作',
        '☐  2+ government funding applications formally submitted / 已提交2份或以上資助申請',
        '☐  Platform trial run completed / 平台試運作已完成',
        '☐  3 monthly operations reports submitted / 已提交3份月度報告',
    ]),
    ('TRANCHE 2 / 第二批  —  4%  Formal Shares / 正式股份', 'Month 12  ·  February 2027', [
        '☐  1+ government funding scheme successfully approved / 1項或以上資助計劃已批核',
        '☐  Platform fully operational and stable / 平台全面運作及穩定',
        '☐  Financial records up to date / 財務記錄已更新',
        '☐  Partner actively committed full-time / 合夥人積極全職投入',
    ]),
    ('TRANCHE 3 / 第三批  —  5%  Formal Shares  —  TOTAL 12% / 共12%', 'Month 18  ·  August 2027', [
        '☐  HKD 300,000+ in government funding secured / 累積資助達港幣30萬或以上',
        '☐  Company self-sustaining / 公司能自行運作',
        '☐  All compliance, tax, MPF fulfilled / 所有合規稅務強積金責任履行',
        '☐  Partner continues full-time / 合夥人繼續全職投入',
    ]),
]:
    at = Table([[Paragraph(label, tranche_s), Paragraph(period, tranche_s)]],
               colWidths=[120*mm, 56*mm])
    at.setStyle(TableStyle([
        ('BACKGROUND',(0,0),(-1,-1),ACCENT_VIOLET),
        ('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),4),
        ('LEFTPADDING',(0,0),(-1,-1),6),
    ]))
    story.append(at)
    for item in items:
        story.append(Paragraph(item, sClause))
    so = Table([[
        Paragraph('Founder / 創辦人: _________________  Date / 日期: _____________', sSmall),
        Paragraph('Partner / 合夥人: _________________  Date / 日期: _____________', sSmall),
    ]], colWidths=[88*mm, 88*mm])
    so.setStyle(TableStyle([
        ('BOX',(0,0),(-1,-1),0.5,NEUTRAL_GREY),
        ('INNERGRID',(0,0),(-1,-1),0.5,NEUTRAL_GREY),
        ('BACKGROUND',(0,0),(-1,-1),colors.HexColor('#f9f9ff')),
        ('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),4),
        ('LEFTPADDING',(0,0),(-1,-1),6),
    ]))
    story.append(so)
    story.append(Spacer(1,3))

# DISCLAIMER
story.append(HRFlowable(width='100%', thickness=0.5, color=NEUTRAL_GREY, spaceBefore=6, spaceAfter=3))
story.append(Paragraph(
    '<b>LEGAL DISCLAIMER / 法律免責聲明:</b>  This document is a draft for discussion purposes only. Both parties are strongly advised to seek independent legal advice from a qualified Hong Kong solicitor before signing. Share transfers must comply with Companies Ordinance (Cap. 622) and may require Companies Registry approval and payment of stamp duty.  /  本文件僅為討論草稿。強烈建議雙方在簽署前向具資格的香港律師尋求獨立法律意見。<br/><br/><i>Produced using SIMPLEX-ITY official letterhead template · Exo 2 (headlines) · Montserrat (body) · BX-01 Brand Guidelines v1.0 April 2026</i>',
    sDisclaim))

# BUILD
doc.build(story, onFirstPage=draw_page, onLaterPages=draw_page)
print("✅ Done: Wilson_Partnership_Agreement_V4_Letterhead.pdf")
