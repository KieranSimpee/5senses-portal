from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
import os

# Register fonts
try:
    pdfmetrics.registerFont(TTFont('NotoSansTC', '/usr/share/fonts/truetype/noto/NotoSansTC-Regular.ttf'))
    pdfmetrics.registerFont(TTFont('NotoSansTC-Bold', '/usr/share/fonts/truetype/noto/NotoSansTC-Bold.ttf'))
    CHINESE_FONT = 'NotoSansTC'
    CHINESE_BOLD = 'NotoSansTC-Bold'
except:
    try:
        import subprocess
        subprocess.run(['apt-get', 'install', '-y', 'fonts-noto-cjk'], capture_output=True)
        pdfmetrics.registerFont(TTFont('NotoSansTC', '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'))
        CHINESE_FONT = 'NotoSansTC'
        CHINESE_BOLD = 'NotoSansTC'
    except:
        CHINESE_FONT = 'Helvetica'
        CHINESE_BOLD = 'Helvetica-Bold'

# Brand colors
LILAC = colors.HexColor('#8c82fc')
VIOLET = colors.HexColor('#5e50fb')
SOFT_LILAC = colors.HexColor('#bab4fd')
LAVENDER = colors.HexColor('#e8e6fe')
BODY_TEXT = colors.HexColor('#1a1a1f')
GREY = colors.HexColor('#e6e6e6')

output_path = '/app/Wilson_Partnership_Agreement_V2_SIMPLEX-ITY.pdf'

doc = SimpleDocTemplate(
    output_path,
    pagesize=A4,
    rightMargin=20*mm,
    leftMargin=20*mm,
    topMargin=15*mm,
    bottomMargin=20*mm
)

styles = getSampleStyleSheet()

# Custom styles
title_style = ParagraphStyle('Title', fontName=CHINESE_BOLD, fontSize=13, textColor=VIOLET,
    alignment=TA_CENTER, spaceAfter=4, leading=18)
subtitle_style = ParagraphStyle('Subtitle', fontName=CHINESE_FONT, fontSize=9, textColor=BODY_TEXT,
    alignment=TA_CENTER, spaceAfter=2, leading=13)
section_style = ParagraphStyle('Section', fontName=CHINESE_BOLD, fontSize=10, textColor=VIOLET,
    spaceBefore=10, spaceAfter=4, leading=14)
body_style = ParagraphStyle('Body', fontName=CHINESE_FONT, fontSize=8.5, textColor=BODY_TEXT,
    spaceAfter=4, leading=13, alignment=TA_JUSTIFY)
bold_body = ParagraphStyle('BoldBody', fontName=CHINESE_BOLD, fontSize=8.5, textColor=BODY_TEXT,
    spaceAfter=3, leading=13)
clause_style = ParagraphStyle('Clause', fontName=CHINESE_FONT, fontSize=8, textColor=BODY_TEXT,
    spaceAfter=3, leading=12, leftIndent=8, alignment=TA_JUSTIFY)
small_style = ParagraphStyle('Small', fontName=CHINESE_FONT, fontSize=7.5, textColor=colors.HexColor('#555555'),
    spaceAfter=2, leading=11, alignment=TA_JUSTIFY)
tranche_style = ParagraphStyle('Tranche', fontName=CHINESE_BOLD, fontSize=9, textColor=VIOLET,
    spaceBefore=6, spaceAfter=2, leading=13)
sign_style = ParagraphStyle('Sign', fontName=CHINESE_FONT, fontSize=8.5, textColor=BODY_TEXT,
    spaceAfter=8, leading=14)

def header_block(canvas, doc):
    canvas.saveState()
    w, h = A4
    # Top bar
    canvas.setFillColor(VIOLET)
    canvas.rect(0, h - 18*mm, w, 18*mm, fill=1, stroke=0)
    # Logo text
    canvas.setFillColor(colors.white)
    canvas.setFont(CHINESE_BOLD, 16)
    canvas.drawString(20*mm, h - 11*mm, 'SIMPLEX-ITY')
    canvas.setFont(CHINESE_FONT, 7.5)
    canvas.drawString(20*mm, h - 15*mm, 'A branch of 5SENSESBEAUTY LIMITED')
    # Right side tagline
    canvas.setFont(CHINESE_FONT, 7)
    canvas.drawRightString(w - 20*mm, h - 11*mm, 'Partnership & Equity Agreement')
    canvas.drawRightString(w - 20*mm, h - 15*mm, '合作及股權參與協議')
    # Bottom bar
    canvas.setFillColor(LILAC)
    canvas.rect(0, 0, w, 10*mm, fill=1, stroke=0)
    canvas.setFillColor(colors.white)
    canvas.setFont(CHINESE_FONT, 7)
    canvas.drawString(20*mm, 3.5*mm, 'Room 1608, 16/F APEC Plaza, 49 Hoi Yuen Road, Kwun Tong, KL  |  BR No: 78459506-001-07-25-A')
    canvas.drawRightString(w - 20*mm, 3.5*mm, f'Page {doc.page}')
    canvas.restoreState()

story = []

# === TITLE ===
story.append(Spacer(1, 5*mm))
story.append(Paragraph('PARTNERSHIP & EQUITY PARTICIPATION AGREEMENT', title_style))
story.append(Paragraph('合作及股權參與協議 — VERSION 2 / 第二版', subtitle_style))
story.append(Paragraph('Date / 日期: 29 May 2026', subtitle_style))
story.append(HRFlowable(width='100%', thickness=1.5, color=LILAC, spaceAfter=6))

# === PARTIES ===
story.append(Paragraph('BETWEEN / 協議雙方', section_style))

party_data = [
    [Paragraph('<b>FOUNDER / 創辦人</b>', bold_body), Paragraph('<b>PARTNER / 合夥人</b>', bold_body)],
    [
        Paragraph('KIERAN LI (LI, Chi Nok) / 李志諾<br/>Founder &amp; Director, SIMPLEX-ITY<br/>Branch of 5SENSESBEAUTY LIMITED<br/>Room 1608, 16/F APEC Plaza, Kwun Tong<br/>BR No: 78459506-001-07-25-A<br/><i>("the Founder" / 「創辦人」)</i>', clause_style),
        Paragraph('WILSON [FULL LEGAL NAME TBC]<br/>Operations Partner, SIMPLEX-ITY<br/>Address: [TBC]<br/>HKID No: [TBC]<br/><br/><i>("the Partner" / 「合夥人」)</i>', clause_style)
    ]
]
pt = Table(party_data, colWidths=[85*mm, 85*mm])
pt.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), LAVENDER),
    ('GRID', (0,0), (-1,-1), 0.5, SOFT_LILAC),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
]))
story.append(pt)
story.append(Spacer(1, 4))

# === PREAMBLE ===
story.append(Paragraph('PREAMBLE / 序言', section_style))
story.append(Paragraph(
    'This agreement upgrades the relationship from initial trial period (Months 1-3) into a formal structured partnership commencing Month 4 (June 2026). The Founder has borne all development and operational costs during the first three months. The Partner contributed time, skills, and execution capacity. Equity participation is earned through defined milestones, government funding success, and sustained commitment.',
    body_style))
story.append(Paragraph(
    '本協議將關係由初始試驗期（第1至3個月）正式升級為結構化合夥關係，由第4個月（2026年6月）起生效。創辦人於首三個月承擔所有開發及營運費用。合夥人以時間、技能及執行能力作出貢獻。股權參與須透過達成既定里程碑、政府資助成功及持續承諾來獲取。',
    body_style))

# === SECTION 1 PURPOSE ===
story.append(Paragraph('1. PURPOSE / 協議目的', section_style))
for txt in [
    '1.1 This agreement formalises the operational and equity participation arrangement in the building and development of SIMPLEX-ITY. / 本協議正式確立雙方在建立及發展 SIMPLEX-ITY 方面的營運及股權參與安排。',
    '1.2 The Partner\'s primary role is Operations Director — company operations, legal compliance, and efficiency. Business development remains under the Founder\'s leadership. / 合夥人主要職責為營運總監。業務發展及客戶方向仍由創辦人主導。',
    '1.3 This agreement supersedes all prior verbal or informal arrangements. / 本協議取代雙方之前所有口頭或非正式安排。',
]:
    story.append(Paragraph(txt, clause_style))

# === SECTION 2 RESPONSIBILITIES ===
story.append(Paragraph('2. PARTNER\'S CORE RESPONSIBILITIES / 合夥人核心職責', section_style))
story.append(Paragraph('<b>PHASE A — FOUNDATION (Priority) / 第A階段 — 公司基礎建設（最基本要求）</b>', bold_body))
phase_a = [
    '2.1 Office setup and day-to-day facility management / 辦公室設置及日常管理',
    '2.2 Corporate bank account opening and ongoing management / 公司銀行戶口開立及日常管理',
    '2.3 Government funding research, application and follow-through (BUD, TVP, ESF) / 政府資助計劃研究、申請及跟進（BUD、TVP、ESF）',
    '2.4 Financial record-keeping, bookkeeping, and expense management / 財務記錄、簿記及費用管理',
    '2.5 Tax filing, profits tax compliance, and MPF administration / 報稅、利得稅合規及強積金行政',
    '2.6 Company secretarial coordination and legal document management / 公司秘書協調及法律文件管理',
]
for t in phase_a:
    story.append(Paragraph(t, clause_style))

story.append(Paragraph('<b>PHASE B — PLATFORM & NETWORK OPERATIONS / 第B階段 — 平台及網絡運作</b>', bold_body))
phase_b = [
    '2.7 Operational platform setup and day-to-day maintenance / 營運平台建立及日常維護',
    '2.8 Trial operation period supervision and testing / 試運作階段監督及測試',
    '2.9 External coordination with vendors, partners, and government bodies / 對外協調工作',
    '2.10 Network support staffing, team management, and workflow administration / 網絡支援人手安排及管理',
]
for t in phase_b:
    story.append(Paragraph(t, clause_style))

# === SECTION 3 COMMITMENT ===
story.append(Paragraph('3. MINIMUM COMMITMENT / 最低承諾要求', section_style))
commits = [
    '(a) Attend weekly internal meetings (in person or online) / 每週出席內部會議',
    '(b) Submit monthly operations report: finance, platform, administration / 每月提交營運報告',
    '(c) Non-compete: No work for competing business during term / 非競爭條款：期間不得為競爭對手工作',
    '(d) 14 calendar days written notice to discontinue / 如選擇終止，提前14天書面通知',
]
for c in commits:
    story.append(Paragraph(c, clause_style))

# === SECTION 4 EQUITY ===
story.append(Paragraph('4. EQUITY PARTICIPATION STRUCTURE / 股權參與架構', section_style))
story.append(Paragraph(
    '<b>Structure Note:</b> Equity participation begins as Phantom Equity (financial rights without formal share issuance). Formal share transfers occur at defined milestones below. This protects Founder\'s legal ownership while honouring Partner\'s earned rights.',
    small_style))
story.append(Paragraph(
    '<b>架構說明：</b>股權參與初期以虛擬股權形式架構。正式股份轉讓於達成以下特定里程碑後進行。',
    small_style))
story.append(Spacer(1, 3))

# Equity table
eq_data = [
    [Paragraph('<b>Tranche / 批次</b>', bold_body), 
     Paragraph('<b>Period / 期間</b>', bold_body),
     Paragraph('<b>Equity / 股份</b>', bold_body),
     Paragraph('<b>Key Conditions / 主要條件</b>', bold_body),
     Paragraph('<b>Formal Action / 正式行動</b>', bold_body)],
    [
        Paragraph('1', body_style),
        Paragraph('Month 4-6\nJun-Aug 2026', small_style),
        Paragraph('3%\nPhantom\n虛擬股權', bold_body),
        Paragraph('Bank a/c + office setup\n2+ funding applications submitted\nPlatform trial run complete\n3 monthly reports submitted\n銀行+辦公室+2份資助申請+平台試運', small_style),
        Paragraph('Written phantom equity letter from Founder\n創辦人書面確認虛擬股權', small_style),
    ],
    [
        Paragraph('2', body_style),
        Paragraph('Month 7-12\nSep 2026-Feb 2027', small_style),
        Paragraph('4%\nFormal Shares\n正式股份', bold_body),
        Paragraph('1+ funding approved\nPlatform fully operational\nFinancial records up to date\nFull-time commitment\n1項資助批核+平台全面運作', small_style),
        Paragraph('Share transfer — Partner formally registered at 4% in 5SENSESBEAUTY LIMITED\n正式股份轉讓，登記4%', small_style),
    ],
    [
        Paragraph('3', body_style),
        Paragraph('Month 13-18\nMar-Aug 2027', small_style),
        Paragraph('5%\nFormal Shares\n正式股份\n(Total 12%)', bold_body),
        Paragraph('HKD 300,000+ funding secured\nCompany self-sustaining\nAll compliance fulfilled\nFull-time continued\n資助累計30萬+公司自運+合規完整', small_style),
        Paragraph('Second share transfer — total shareholding 12%\n第二次股份轉讓，總持股12%', small_style),
    ],
]
et = Table(eq_data, colWidths=[12*mm, 22*mm, 18*mm, 60*mm, 58*mm])
et.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), VIOLET),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('BACKGROUND', (0,1), (-1,1), LAVENDER),
    ('BACKGROUND', (0,2), (-1,2), colors.white),
    ('BACKGROUND', (0,3), (-1,3), LAVENDER),
    ('GRID', (0,0), (-1,-1), 0.5, SOFT_LILAC),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('LEFTPADDING', (0,0), (-1,-1), 4),
    ('ALIGN', (2,0), (2,-1), 'CENTER'),
]))
story.append(et)

# === SECTION 5 GOVT FUNDING ===
story.append(Paragraph('5. GOVERNMENT FUNDING — SPECIAL PROVISIONS / 政府資助特別條款', section_style))
funding_clauses = [
    '5.1 Securing government funding is a core KPI of this partnership. / 爭取政府資助是本合夥關係的核心KPI。',
    '5.2 Funding secured shall be used for company operational expenses as mutually agreed. The Partner shall not divert or misuse funding without Founder\'s written consent. / 資助須按雙方協議用於公司營運開支，不得挪用。',
    '5.3 Failure to obtain funding due to circumstances beyond the Partner\'s reasonable control shall not constitute a breach, provided genuine and documented efforts were made. / 若因合理控制範圍以外情況未能獲批，且已作出真誠及有記錄的努力，則不構成違約。',
    '5.4 Any surplus funding shall be reinvested into the company unless otherwise agreed in writing. / 除非另有書面協議，盈餘資助資金應再投入公司。',
]
for c in funding_clauses:
    story.append(Paragraph(c, clause_style))

# === SECTION 6 SHARE TRANSFER ===
story.append(Paragraph('6. SHARE TRANSFER MECHANICS / 股份轉讓程序', section_style))
transfer_clauses = [
    '6.1 Phantom Equity Phase (Months 4-6): No formal shares issued. Founder issues a written letter confirming 3% phantom equity entitlement. / 虛擬股權階段：不發行正式股份，創辦人發出書面確認信函。',
    '6.2 First Formal Transfer (Month 12): Founder instructs Company Secretary to prepare share transfer form. Partner formally registered as 4% shareholder. Stamp duty and legal fees borne by company. / 首次正式轉讓（第12個月）：公司秘書辦理，印花稅及法律費用由公司承擔。',
    '6.3 Second Formal Transfer (Month 18): Further transfer executed, increasing Partner\'s total shareholding to 12%. / 第二次正式轉讓（第18個月）：總持股增至12%。',
    '6.4 All transfers conducted in accordance with Companies Ordinance (Cap. 622) and properly documented with the Companies Registry. / 所有轉讓均須符合《公司條例》（第622章）並在公司註冊處妥善記錄。',
]
for c in transfer_clauses:
    story.append(Paragraph(c, clause_style))

# === SECTION 7 TERMINATION ===
story.append(Paragraph('7. TERMINATION & EXIT / 終止及退出', section_style))
term_clauses = [
    '7.1 Either party may terminate by providing 30 calendar days\' written notice. / 任何一方可提供30個日曆天書面通知終止本協議。',
    '7.2 Upon Partner termination: (a) All unvested phantom equity immediately cancelled. (b) Formally transferred shares retained, subject to Right of First Refusal by Founder at fair market value. / 合夥人終止時：未歸屬虛擬股權即時取消；已歸屬股份保留但創辦人享優先購買權。',
    '7.3 Termination for cause (misconduct, breach, misuse of funds): All equity may be clawed back at Founder\'s discretion. / 因故終止（不當行為、違約、濫用資金）：創辦人可酌情追回所有股權。',
    '7.4 Partner shall return all company property, devices, and confidential materials within 7 calendar days of termination. / 合夥人須於終止後7天內歸還所有公司財產及機密資料。',
]
for c in term_clauses:
    story.append(Paragraph(c, clause_style))

# === SECTION 8 CONFIDENTIALITY ===
story.append(Paragraph('8. CONFIDENTIALITY & NON-COMPETE / 保密及競業禁止', section_style))
conf_clauses = [
    '8.1 Both parties maintain strict confidentiality regarding all business operations, client relationships, financial information, and strategies during and for 2 years after the term. / 雙方在協議期間及終止後2年內嚴格保密。',
    '8.2 Partner shall not, during the term and 12 months after termination, engage in any business directly competing with SIMPLEX-ITY in Hong Kong or the Greater Bay Area. / 合夥人於協議期間及終止後12個月內不得在港或大灣區從事競爭業務。',
]
for c in conf_clauses:
    story.append(Paragraph(c, clause_style))

# === SECTION 9 INTERNATIONAL PROVISIONS ===
story.append(Paragraph('9. INTERNATIONAL REFERENCE PROVISIONS / 國際參考條款', section_style))
story.append(Paragraph('(Drawn from UK/US/EU startup partnership best practices / 參考英美歐初創合夥協議最佳實踐)', small_style))
intl_clauses = [
    '9.1 Good/Bad Leaver (UK/US): Good Leaver (health, family, mutual agreement) retains vested shares at full value. Bad Leaver (cause, breach, joining competitor) forfeits unvested equity; vested shares subject to buyback at par value. / 好離職者保留已歸屬股份；壞離職者喪失未歸屬股權，已歸屬股份以面值回購。',
    '9.2 Drag-Along Right (US/EU): If Founder receives bona fide 100% acquisition offer, Partner agrees to sell shares on same terms. / 強制隨售權：若創辦人獲收購100%要約，合夥人同意按相同條款出售股份。',
    '9.3 Tag-Along Right (US/EU): If Founder sells majority shareholding, Partner has right to sell shares under same terms. / 隨售權：若創辦人出售多數股權，合夥人有權在相同條款下出售其股份。',
    '9.4 Anti-Dilution (US): Partner\'s percentage shall not be diluted below 5% without written consent, provided all vesting conditions are met. / 防稀釋保護：在所有條件達成前提下，未經書面同意不得稀釋至5%以下。',
    '9.5 IP Assignment: All IP, technology, tools, and systems created by Partner in course of role belong solely to 5SENSESBEAUTY LIMITED. / 知識產權轉讓：合夥人在職責範圍內創造的所有知識產權歸5SENSESBEAUTY LIMITED所有。',
]
for c in intl_clauses:
    story.append(Paragraph(c, clause_style))

# === SECTION 10 DISPUTE ===
story.append(Paragraph('10. DISPUTE RESOLUTION / 爭議解決', section_style))
dispute_clauses = [
    '10.1 Both parties attempt good faith negotiation within 14 days of written notice of dispute. / 雙方在書面通知爭議後14天內透過真誠談判嘗試解決。',
    '10.2 If unresolved, submit to mediation in Hong Kong before legal action. / 如未能解決，在提起法律行動前提交香港調解。',
    '10.3 This agreement governed by the laws of Hong Kong SAR. / 本協議受香港特別行政區法律管轄。',
]
for c in dispute_clauses:
    story.append(Paragraph(c, clause_style))

# === SIGNATURES ===
story.append(Spacer(1, 5))
story.append(HRFlowable(width='100%', thickness=1, color=SOFT_LILAC, spaceAfter=6))
story.append(Paragraph('SIGNATURES / 簽署', section_style))

sig_data = [
    [Paragraph('<b>FOUNDER / 創辦人</b>', bold_body), Paragraph('<b>PARTNER / 合夥人</b>', bold_body)],
    [
        Paragraph('Name / 姓名: KIERAN LI (LI, Chi Nok)\n\nSignature / 簽署: _______________________\n\nDate / 日期: ___________________________', sign_style),
        Paragraph('Chosen Name / 常用名稱: ________________\n\nLegal Name / 法定姓名: __________________\n\nHKID: __________________________________\n\nSignature / 簽署: _______________________\n\nDate / 日期: ___________________________', sign_style),
    ],
    [Paragraph('<b>WITNESS / 見證人</b> (Recommended / 建議)', bold_body), ''],
    [
        Paragraph('Name / 姓名: ___________________________\n\nSignature / 簽署: _______________________\n\nDate / 日期: ___________________________', sign_style),
        ''
    ],
]
st = Table(sig_data, colWidths=[85*mm, 85*mm])
st.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), LAVENDER),
    ('GRID', (0,0), (-1,-1), 0.5, SOFT_LILAC),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('SPAN', (0,2), (1,2)),
    ('SPAN', (1,3), (1,3)),
]))
story.append(st)

# === ADDENDUM A ===
story.append(Spacer(1, 4))
story.append(HRFlowable(width='100%', thickness=1.5, color=LILAC, spaceAfter=4))
story.append(Paragraph('ADDENDUM A — MILESTONE VERIFICATION CHECKLIST / 附件A — 里程碑核實清單', section_style))
story.append(Paragraph('To be completed and signed by both parties at the end of each Tranche period. / 於每批次期間結束時填寫並由雙方簽署。', small_style))

for tranche, period, items in [
    ('TRANCHE 1 / 第一批 (3%)', 'Month 6 — August 2026 / 第6個月', [
        '[ ] Bank account opened / 銀行戶口已開立',
        '[ ] Office operational / 辦公室已運作',
        '[ ] 2+ funding applications submitted / 已提交2份或以上資助申請',
        '[ ] Platform trial run completed / 平台試運作已完成',
        '[ ] 3 monthly reports submitted / 已提交3份月度報告',
    ]),
    ('TRANCHE 2 / 第二批 (4%)', 'Month 12 — February 2027 / 第12個月', [
        '[ ] 1+ funding scheme approved / 1項或以上資助計劃已批核',
        '[ ] Platform fully operational / 平台全面運作',
        '[ ] Financial records up to date / 財務記錄已更新',
        '[ ] Partner actively committed full-time / 合夥人積極全職投入',
    ]),
    ('TRANCHE 3 / 第三批 (5%)', 'Month 18 — August 2027 / 第18個月', [
        '[ ] HKD 300,000+ in funding secured / 已獲得港幣30萬元或以上資助',
        '[ ] Company self-sustaining / 公司能自行運作',
        '[ ] All compliance, tax, MPF fulfilled / 所有合規稅務強積金責任已履行',
        '[ ] Partner continues full-time / 合夥人繼續全職投入',
    ]),
]:
    story.append(Paragraph(f'<b>{tranche}</b> — {period}', tranche_style))
    for item in items:
        story.append(Paragraph(item, clause_style))
    story.append(Paragraph('Founder sign-off / 創辦人確認: _________________ Date / 日期: _____________', small_style))
    story.append(Paragraph('Partner sign-off / 合夥人確認: _________________ Date / 日期: _____________', small_style))
    story.append(Spacer(1, 3))

# === DISCLAIMER ===
story.append(HRFlowable(width='100%', thickness=0.5, color=GREY, spaceAfter=3))
story.append(Paragraph(
    '<b>LEGAL DISCLAIMER:</b> This document is a draft for discussion purposes only. It is strongly recommended that both parties seek independent legal advice from a qualified Hong Kong solicitor before signing. Share transfers must comply with the Companies Ordinance (Cap. 622) and may require Companies Registry approval and payment of stamp duty. / <b>法律免責聲明：</b>本文件僅為討論草稿。強烈建議雙方在簽署前向具資格的香港律師尋求獨立法律意見。股份轉讓必須符合《公司條例》（第622章）。',
    small_style))

doc.build(story, onFirstPage=header_block, onLaterPages=header_block)
print(f"PDF generated: {output_path}")
