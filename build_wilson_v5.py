from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer,
                                 HRFlowable, Table, TableStyle, KeepTogether)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY, TA_RIGHT
import os

# ── Fonts ─────────────────────────────────────────────────────────────────────
pdfmetrics.registerFont(TTFont('Exo2',          '/app/fonts/Exo2-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Exo2-SemiBold', '/app/fonts/Exo2-SemiBold.ttf'))
pdfmetrics.registerFont(TTFont('Exo2-Bold',     '/app/fonts/Exo2-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Mont',          '/app/fonts/Montserrat-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Mont-Med',      '/app/fonts/Montserrat-Medium.ttf'))
pdfmetrics.registerFont(TTFont('Mont-SemiBold', '/app/fonts/Montserrat-SemiBold.ttf'))
pdfmetrics.registerFont(TTFont('Mont-Bold',     '/app/fonts/Montserrat-Bold.ttf'))

# ── Brand Colours (BX-01) ─────────────────────────────────────────────────────
PRIMARY   = colors.HexColor('#8c82fc')   # Primary Lilac
ACCENT    = colors.HexColor('#5e50fb')   # Accent Violet
SOFT      = colors.HexColor('#bab4fd')   # Soft Lilac
WASH      = colors.HexColor('#e8e6fe')   # Lavender Wash
WHITE     = colors.HexColor('#ffffff')
GREY      = colors.HexColor('#e6e6e6')
BODY      = colors.HexColor('#1a1a1f')
MUTED     = colors.HexColor('#555555')
DIMGREY   = colors.HexColor('#888888')

W, H = A4

# ── Letterhead asset ──────────────────────────────────────────────────────────
LH_PATH = '/app/looka_letterhead_final.png'
LH_W    = W                          # full page width
LH_H    = LH_W * (955 / 2645)       # keep aspect ratio ≈ 82mm

# ── Page template ─────────────────────────────────────────────────────────────
def draw_page(c, doc):
    c.saveState()
    # Looka letterhead — full bleed top
    c.drawImage(LH_PATH, 0, H - LH_H, width=LH_W, height=LH_H,
                preserveAspectRatio=False, mask='auto')
    # Footer bar
    FH = 11 * mm
    c.setFillColor(ACCENT)
    c.rect(0, 0, W, FH, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont('Mont', 6.2)
    c.drawString(14*mm, 6.8*mm,
        'RM1608, 16/F, APEC PLAZA, 49 HOI YUEN RD, KWUN TONG')
    c.drawString(14*mm, 3.2*mm,
        'www.simplex-ity.com  ·  enquiries@simplex-ity.com')
    c.setFont('Mont-SemiBold', 6.2)
    c.drawRightString(W - 14*mm, 6.8*mm,
        'PARTNERSHIP & EQUITY AGREEMENT  V5')
    c.drawRightString(W - 14*mm, 3.2*mm,
        f'Page {doc.page}  ·  CONFIDENTIAL')
    c.restoreState()

# ── Document ──────────────────────────────────────────────────────────────────
doc = SimpleDocTemplate(
    '/app/Wilson_Partnership_Agreement_V5_Final.pdf',
    pagesize=A4,
    rightMargin=15*mm, leftMargin=15*mm,
    topMargin=LH_H + 4*mm,
    bottomMargin=15*mm
)

# ── Styles ────────────────────────────────────────────────────────────────────
def st(name, font, size, clr=BODY, align=TA_LEFT, sb=0, sa=3, lead=None, li=0):
    return ParagraphStyle(name, fontName=font, fontSize=size, textColor=clr,
        alignment=align, spaceBefore=sb, spaceAfter=sa,
        leading=lead or size*1.45, leftIndent=li)

TITLE   = st('Title',  'Exo2-Bold',    14, PRIMARY, TA_CENTER, sa=2, lead=20)
SUB     = st('Sub',    'Mont',          8, BODY,    TA_CENTER, sa=1, lead=12)
SEC     = st('Sec',    'Exo2-SemiBold',10, ACCENT,  TA_LEFT,  sb=9, sa=3, lead=14)
SUBSEC  = st('SubSec', 'Exo2-SemiBold', 9, PRIMARY, TA_LEFT,  sb=5, sa=2, lead=13)
BODY_S  = st('Body',   'Mont',          8, BODY,    TA_JUSTIFY, sa=3, lead=12.5)
BOLD_S  = st('Bold',   'Mont-Bold',     8, BODY,    TA_LEFT,   sa=2, lead=12)
CLAUSE  = st('Clause', 'Mont',          8, BODY,    TA_JUSTIFY, sa=2, lead=12, li=4)
BULLET  = st('Bullet', 'Mont',          8, BODY,    TA_LEFT,   sa=2, lead=12, li=10)
SMALL   = st('Small',  'Mont',        7.5, MUTED,   TA_JUSTIFY, sa=2, lead=11)
SMALL_B = st('SmallB', 'Mont-Bold',   7.5, BODY,    TA_LEFT,   sa=2, lead=11)
SIGN    = st('Sign',   'Mont',        8.5, BODY,    TA_LEFT,   sa=6, lead=15)
DISC    = st('Disc',   'Mont',        6.5, DIMGREY, TA_JUSTIFY, sa=2, lead=10)
TH      = ParagraphStyle('TH', fontName='Exo2-SemiBold', fontSize=7.5,
            textColor=WHITE, alignment=TA_CENTER, leading=11)
TC      = ParagraphStyle('TC', fontName='Mont', fontSize=7.5,
            textColor=BODY, alignment=TA_LEFT, leading=11.5, spaceAfter=0)
TC_B    = ParagraphStyle('TCB', fontName='Mont-Bold', fontSize=7.5,
            textColor=ACCENT, alignment=TA_CENTER, leading=11)
TRANCHE = ParagraphStyle('Tranche', fontName='Exo2-SemiBold', fontSize=8,
            textColor=WHITE, alignment=TA_LEFT, leading=12)

def P(txt, style=CLAUSE): return Paragraph(txt, style)
def HR(thick=1, clr=SOFT): return HRFlowable(width='100%', thickness=thick, color=clr, spaceBefore=3, spaceAfter=4)
def SP(h=3): return Spacer(1, h)

def tbl(data, widths, style_cmds):
    t = Table(data, colWidths=widths)
    t.setStyle(TableStyle(style_cmds))
    return t

BASE_TBL = [
    ('BOX',         (0,0),(-1,-1), 0.8, SOFT),
    ('INNERGRID',   (0,0),(-1,-1), 0.5, SOFT),
    ('VALIGN',      (0,0),(-1,-1), 'TOP'),
    ('TOPPADDING',  (0,0),(-1,-1), 5),
    ('BOTTOMPADDING',(0,0),(-1,-1), 5),
    ('LEFTPADDING', (0,0),(-1,-1), 6),
    ('RIGHTPADDING',(0,0),(-1,-1), 6),
]

# ══════════════════════════════════════════════════════════════════════════════
story = []

# ── TITLE BLOCK ───────────────────────────────────────────────────────────────
story += [
    SP(2),
    P('PARTNERSHIP & EQUITY PARTICIPATION AGREEMENT', TITLE),
    P('合作及股權參與協議  ·  VERSION 5 / 第五版', SUB),
    P('Date / 日期: 29 May 2026  ·  CONFIDENTIAL — FOR DISCUSSION ONLY', SUB),
    HR(1.5, PRIMARY),
]

# ── PARTIES ───────────────────────────────────────────────────────────────────
story.append(P('PARTIES / 協議雙方', SEC))
story.append(tbl([
    [P('FOUNDER / 創辦人', BOLD_S),  P('PARTNER / 合夥人', BOLD_S)],
    [P('KIERAN LI (LI, Chi Nok) / 李志諾<br/>'
       'Founder &amp; Director, SIMPLEX-ITY<br/>'
       'Branch of 5SENSESBEAUTY LIMITED<br/>'
       'Rm 1608, 16/F APEC Plaza, Kwun Tong, HK<br/>'
       'BR No: 78459506-001-07-25-A<br/>'
       '<i>("the Founder" / 「創辦人」)</i>'),
     P('WILSON [Full Legal Name — TBC]<br/>'
       'Operations Partner, SIMPLEX-ITY<br/>'
       'Address / 地址: [TBC]<br/>'
       'HKID No / 香港身份證: [TBC]<br/><br/>'
       '<i>("the Partner" / 「合夥人」)</i>'),
    ]
], [90*mm, 90*mm], BASE_TBL + [('BACKGROUND',(0,0),(-1,0),WASH)]))
story.append(SP(3))

# ── PREAMBLE (Spirit & Appreciation restored) ─────────────────────────────────
story.append(P('PREAMBLE / 序言', SEC))
story.append(P(
    'This agreement is written in the spirit of trust, genuine appreciation, and shared ambition. '
    'The Founder recognises the time, effort, and dedication the Partner has invested since the beginning '
    'of this journey. The initial three months have been a period of learning and building together — '
    'the Founder has borne all costs; the Partner has brought commitment and execution. '
    'This agreement now formalises what comes next: a structured, milestone-based partnership '
    'where the Partner\'s growing stake in SIMPLEX-ITY is earned, protected, and real.',
    BODY_S))
story.append(P(
    '本協議以信任、真誠欣賞及共同抱負的精神撰寫。創辦人衷心感謝合夥人自合作開始以來所投入的時間、'
    '努力及付出。首三個月是共同學習及建設的時期——創辦人承擔了所有費用，合夥人帶來了承諾及執行力。'
    '本協議正式確立下一階段：一個以里程碑為基礎的結構化合夥關係，讓合夥人在 SIMPLEX-ITY 中的股份'
    '獲得應有的認可、保護及實質意義。',
    BODY_S))
story.append(SP(2))

# ── SECTION 1 — PURPOSE ──────────────────────────────────────────────────────
story.append(P('1.  PURPOSE / 協議目的', SEC))
for txt in [
    '1.1  This agreement formalises the operational and equity participation arrangement between both parties in building and developing SIMPLEX-ITY. / 本協議正式確立雙方在建立及發展 SIMPLEX-ITY 方面的安排。',
    '1.2  The Partner\'s primary role is <b>Operations Director</b> — ensuring the company runs smoothly, legally, and efficiently. Business development and client direction remain under the Founder\'s leadership. / 合夥人主要職責為<b>營運總監</b>。業務發展及客戶方向由創辦人主導。',
    '1.3  Final ownership of SIMPLEX-ITY and 5SENSESBEAUTY LIMITED shall at all times remain with KIERAN LI (LI, Chi Nok) as the sole Founder and legal owner. / 在任何情況下，SIMPLEX-ITY 及 5SENSESBEAUTY LIMITED 的最終所有權始終屬於創辦人 KIERAN LI（李志諾）。',
    '1.4  This agreement supersedes all prior verbal or informal arrangements. / 本協議取代雙方之前所有口頭或非正式安排。',
]:
    story.append(P(txt))

# ── SECTION 2 — RESPONSIBILITIES ─────────────────────────────────────────────
story.append(P('2.  PARTNER\'S RESPONSIBILITIES / 合夥人職責', SEC))
story.append(P('PHASE A — COMPANY FOUNDATION  /  第A階段 — 公司基礎建設', SUBSEC))
for txt in [
    '•  Office setup and day-to-day facility management / 辦公室設置及日常管理',
    '•  Corporate bank account opening and ongoing management / 公司銀行戶口開立及日常管理',
    '•  Government funding research, application and follow-through — BUD Fund, TVP, ESF, and others / 政府資助研究、申請及跟進（BUD基金、科技券、創業資助等）',
    '•  Financial record-keeping, bookkeeping, and expense management / 財務記錄、簿記及費用管理',
    '•  Tax filing, profits tax compliance, and MPF administration / 報稅、利得稅合規及強積金行政',
    '•  Company secretarial coordination and legal document management / 公司秘書協調及法律文件管理',
]:
    story.append(P(txt, BULLET))

story.append(P('PHASE B — PLATFORM & NETWORK OPERATIONS  /  第B階段 — 平台及網絡運作', SUBSEC))
for txt in [
    '•  Operational platform setup and day-to-day maintenance / 營運平台建立及日常維護',
    '•  Trial operation period supervision and testing / 試運作階段監督及測試',
    '•  External coordination with vendors, partners, and government bodies / 對外協調',
    '•  Network support staffing, team management, and workflow administration / 人手安排、團隊管理及工作流程',
]:
    story.append(P(txt, BULLET))

# ── SECTION 3 — MINIMUM COMMITMENT ──────────────────────────────────────────
story.append(P('3.  MINIMUM COMMITMENT / 最低承諾要求', SEC))
for txt in [
    '•  Attend weekly internal meetings — in person or online / 每週出席內部會議（實體或網上）',
    '•  Submit monthly operations report covering: finance, platform status, administration / 每月提交營運報告',
    '•  Non-compete: Partner shall not work for or hold interest in any competing business during the term / 非競爭條款：合夥人期間不得為競爭對手工作或持有競爭業務權益',
    '•  Written notice: 30 days\' written notice required to terminate (see Section 5 — termination requires mutual consent) / 書面通知：終止須提前30天書面通知（見第5條——須雙方同意）',
]:
    story.append(P(txt, BULLET))

# ── SECTION 4 — PARTNERSHIP MODEL CHOICE ────────────────────────────────────
story.append(P('4.  PARTNERSHIP MODEL — WILSON\'S CHOICE / 合夥模式——由合夥人選擇', SEC))
story.append(P(
    'Before signing, the Partner shall choose ONE of the two partnership models below. '
    'The chosen model determines equity ceiling, cash contribution, and rights. '
    'Once selected and signed, the model cannot be changed without mutual written agreement.',
    BODY_S))
story.append(P(
    '簽署前，合夥人須從以下兩種合夥模式中選擇其一。所選模式決定股權上限、現金出資及相關權利。'
    '一經選定並簽署，未經雙方書面同意不得更改。',
    BODY_S))
story.append(SP(3))

# Model comparison table
model_data = [
    [P('', TH),
     P('MODEL A\nPure Equity / 純股權模式', TH),
     P('MODEL B\nCo-Investment / 共同投資模式', TH)],
    [P('Cash from Wilson\n合夥人現金出資', TC),
     P('None / 零', TC_B),
     P('Monthly contribution\n每月固定出資 (HKD TBC)', TC_B)],
    [P('Equity Ceiling\n最高股權上限', TC),
     P('12%', TC_B),
     P('Up to 18%\n最高18%', TC_B)],
    [P('Equity Growth Speed\n股權增長速度', TC),
     P('Standard 3-tranche\n標準三批次釋放', TC),
     P('Accelerated — extra % per month of contribution\n加速——每月出資額外獲取股份', TC)],
    [P('Office Setup Funding\n辦公室資金來源', TC),
     P('Funded by Founder only\n全由創辦人承擔', TC),
     P('Shared — Partner contributes monthly\n共同承擔——合夥人每月出資', TC)],
    [P('Operational Risk to Wilson\n合夥人營運風險', TC),
     P('Low — no cash at risk\n低——無現金風險', TC),
     P('Moderate — monthly cash contributed\n中等——每月現金有風險', TC)],
    [P('Profit Share\n利潤分配', TC),
     P('% matching equity stake\n按股份比例', TC),
     P('Higher % matching higher equity\n更高比例', TC)],
    [P('Dividend Rights\n股息權利', TC),
     P('Pro-rata to equity %\n按股份比例', TC),
     P('Pro-rata to higher equity %\n按較高股份比例', TC)],
    [P('Voting Rights\n投票權', TC),
     P('None — equity is economic only\nuntil formal share transfer\n無——股份為經濟性', TC),
     P('None — same as Model A\nuntil formal share transfer\n無——同Model A', TC)],
    [P('Exit / Buyback\n退出回購', TC),
     P('Fair market value\n公平市值', TC),
     P('Fair market value\n+ cash contributions returned if company wound up\n公平市值+清盤時返還出資', TC)],
    [P('Best for Wilson if...\n最適合合夥人情況', TC),
     P('Wilson has no cash to invest but wants equity for contribution\n無現金出資但以貢獻換取股份', TC),
     P('Wilson can invest monthly and wants higher equity reward\n可每月出資，希望換取更高股份', TC)],
]

mt = Table(model_data, colWidths=[48*mm, 63*mm, 63*mm])
mt.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), ACCENT),
    ('BACKGROUND', (0,1), (0,-1), WASH),
    ('BACKGROUND', (1,1), (1,-1), WHITE),
    ('BACKGROUND', (2,1), (2,-1), colors.HexColor('#f0eeff')),
    ('BOX',        (0,0), (-1,-1), 0.8, SOFT),
    ('INNERGRID',  (0,0), (-1,-1), 0.5, SOFT),
    ('VALIGN',     (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0),(-1,-1), 5),
    ('LEFTPADDING',(0,0), (-1,-1), 5),
    ('RIGHTPADDING',(0,0),(-1,-1), 5),
    ('ALIGN',      (1,0), (-1,-1), 'CENTER'),
    ('VALIGN',     (1,0), (-1,-1), 'TOP'),
]))
story.append(mt)
story.append(SP(4))

# Model Selection box
story.append(P('PARTNER\'S SELECTION / 合夥人選擇（簽署前填寫）:', BOLD_S))
sel = Table([[
    P('☐  MODEL A — Pure Equity / 純股權模式', CLAUSE),
    P('☐  MODEL B — Co-Investment / 共同投資模式', CLAUSE),
]], colWidths=[90*mm, 90*mm])
sel.setStyle(TableStyle([
    ('BOX',       (0,0),(-1,-1),1.2,PRIMARY),
    ('INNERGRID', (0,0),(-1,-1),0.5,SOFT),
    ('BACKGROUND',(0,0),(-1,-1),WASH),
    ('TOPPADDING',(0,0),(-1,-1),6),
    ('BOTTOMPADDING',(0,0),(-1,-1),6),
    ('LEFTPADDING',(0,0),(-1,-1),8),
]))
story.append(sel)
story.append(P('If Model B: Agreed monthly contribution / 如選Model B：協議每月出資金額  HKD: _______________', SMALL))

# ── SECTION 5 — EQUITY VESTING SCHEDULE ──────────────────────────────────────
story.append(P('5.  EQUITY VESTING SCHEDULE / 股權釋放時間表', SEC))
story.append(P(
    'Equity begins as <b>Phantom Equity</b> (financial rights without formal share issuance). '
    'Formal share transfers into 5SENSESBEAUTY LIMITED occur at defined milestones. '
    'This protects Founder\'s legal ownership during early phase while honouring the Partner\'s earned rights.',
    SMALL))
story.append(P(
    '股權初期以<b>虛擬股權</b>形式架構（財務參與權利，暫不正式發行股份）。'
    '正式股份轉讓於達成里程碑後進行，保護創辦人法律所有權同時承認合夥人應得權利。',
    SMALL))
story.append(SP(4))

# Vesting table
for tranche, period, eq_a, eq_b, conditions, action in [
    ('TRANCHE 1\n第一批',
     'Month 4–6\nJun–Aug 2026',
     '3%\nPhantom',
     '3% + bonus\nbased on cash\n虛擬＋出資獎勵',
     '•  Bank account opened\n•  Office operational\n•  2+ gov\'t funding applications submitted\n•  Platform trial run completed\n•  3 monthly reports submitted',
     'Founder issues written phantom equity letter\n創辦人書面確認虛擬股權'),
    ('TRANCHE 2\n第二批',
     'Month 7–12\nSep 2026–\nFeb 2027',
     '4%\nFormal\nShares',
     '5–6%\nFormal\nShares',
     '•  1+ gov\'t funding scheme approved\n•  Platform fully operational & stable\n•  Financial records current\n•  Full-time commitment maintained',
     'First formal share transfer\n首次正式股份轉讓\n(Companies Registry)'),
    ('TRANCHE 3\n第三批',
     'Month 13–18\nMar–Aug 2027',
     '5%\nFormal\n(Total 12%)',
     '7–9%\nFormal\n(Total up to\n18%)',
     '•  HKD 300,000+ funding secured\n•  Company self-sustaining\n•  All compliance, tax, MPF fulfilled\n•  Full-time contribution continues',
     'Second formal share transfer\n第二次正式股份轉讓\nTotal = Model A: 12% / Model B: up to 18%'),
]:
    row_data = [[
        P(tranche, TRANCHE),
        P(period, TRANCHE),
        P('Model A\n純股權', TRANCHE),
        P('Model B\n共同投資', TRANCHE),
        P('Conditions / 條件', TRANCHE),
        P('Action / 行動', TRANCHE),
    ],[
        P('', TC), P(period, TC), P(eq_a, TC_B), P(eq_b, TC_B), P(conditions, TC), P(action, TC),
    ]]
    # Simpler single-row display
    story.append(tbl([[
        P(tranche, TRANCHE),
        P(period, TRANCHE),
        P(f'A: {eq_a}', TRANCHE),
        P(f'B: {eq_b}', TRANCHE),
        P('Conditions / 條件', TRANCHE),
        P('Formal Action', TRANCHE),
    ],[
        P('', TC),
        P(period, TC),
        P(eq_a, TC_B),
        P(eq_b, TC_B),
        P(conditions, TC),
        P(action, TC),
    ]], [20*mm, 22*mm, 20*mm, 22*mm, 52*mm, 44*mm],
    [
        ('BACKGROUND',(0,0),(-1,0), ACCENT),
        ('BACKGROUND',(0,1),(-1,1), WASH),
        ('BOX',(0,0),(-1,-1),0.8,SOFT),
        ('INNERGRID',(0,0),(-1,-1),0.5,SOFT),
        ('VALIGN',(0,0),(-1,-1),'TOP'),
        ('TOPPADDING',(0,0),(-1,-1),4),
        ('BOTTOMPADDING',(0,0),(-1,-1),4),
        ('LEFTPADDING',(0,0),(-1,-1),4),
        ('SPAN',(0,1),(0,1)),
    ]))
    story.append(SP(3))

# ── SECTION 6 — GOVERNMENT FUNDING ───────────────────────────────────────────
story.append(P('6.  GOVERNMENT FUNDING / 政府資助', SEC))
for txt in [
    '•  Securing government funding is a <b>core KPI</b> of this partnership. / 爭取政府資助是本合夥關係的<b>核心關鍵績效指標</b>。',
    '•  All funding obtained shall be used for agreed company operational expenses only. / 所獲資助須只用於協議公司營運開支。',
    '•  Partner shall not divert or misuse any funding without Founder\'s written consent. / 未經創辦人書面同意，合夥人不得挪用或濫用資助。',
    '•  Failure to obtain funding due to circumstances beyond Partner\'s reasonable control is not a breach, provided genuine documented efforts were made. / 若因合理控制範圍外情況未能獲資助，且已作出真誠有記錄的努力，不構成違約。',
    '•  Surplus funding shall be reinvested into the company unless otherwise agreed in writing. / 盈餘資助應再投入公司，除非另有書面協議。',
]:
    story.append(P(txt, BULLET))

# ── SECTION 7 — SHARE TRANSFER MECHANICS ─────────────────────────────────────
story.append(P('7.  SHARE TRANSFER MECHANICS / 股份轉讓程序', SEC))
for txt in [
    '•  <b>Phantom Phase (Months 4–6):</b> No formal shares. Founder issues written confirmation letter of phantom equity entitlement. / <b>虛擬股權階段：</b>不發行正式股份，創辦人書面確認。',
    '•  <b>First Transfer (Month 12):</b> Company Secretary prepares share transfer form. Partner formally registered as shareholder in 5SENSESBEAUTY LIMITED. All stamp duty and legal fees borne by company. / <b>首次轉讓（第12個月）：</b>公司秘書辦理，印花稅及費用由公司承擔。',
    '•  <b>Second Transfer (Month 18):</b> Further transfer executed, reaching total equity ceiling (12% Model A / up to 18% Model B). / <b>第二次轉讓（第18個月）：</b>執行進一步轉讓，達到股權上限。',
    '•  All transfers comply with Companies Ordinance (Cap. 622) and documented with Companies Registry. / 所有轉讓均須符合《公司條例》（第622章）。',
]:
    story.append(P(txt, BULLET))

# ── SECTION 8 — TERMINATION (KEY FIX) ───────────────────────────────────────
story.append(P('8.  TERMINATION & EXIT / 終止及退出', SEC))
story.append(P(
    '⚠️  <b>IMPORTANT — MUTUAL CONSENT REQUIRED / 重要——須雙方同意</b>',
    st('Warn', 'Mont-Bold', 8.5, PRIMARY, TA_LEFT, sa=2)))
story.append(P(
    'This agreement shall NOT be terminated unilaterally by either party. '
    'Any termination requires the <b>written consent and agreement of BOTH parties</b> — '
    'the Founder and the Partner. This clause exists to protect both parties equally and '
    'reflects the trust this partnership represents.',
    BODY_S))
story.append(P(
    '本協議不得由任何一方單方面終止。任何終止均須獲得<b>創辦人及合夥人雙方書面同意</b>。'
    '此條款旨在平等保護雙方，體現本合夥關係所代表的信任。',
    BODY_S))
story.append(SP(2))
for txt in [
    '•  <b>If both parties mutually agree to terminate:</b> Outstanding phantom equity and formally vested shares settled fairly and documented before termination takes effect. / <b>雙方共同同意終止時：</b>未兌現虛擬股權及已歸屬股份須公平結算並記錄。',
    '•  <b>Vested (formally transferred) shares:</b> Retained by Partner, subject to Founder\'s Right of First Refusal at fair market value before any third-party sale. / <b>已歸屬（正式轉讓）股份：</b>由合夥人保留，創辦人享優先購買權。',
    '•  <b>Unvested equity:</b> Cancelled upon mutual termination, unless otherwise agreed in writing. / <b>未歸屬股權：</b>終止時取消，除非另有書面協議。',
    '•  <b>Termination for cause</b> (misconduct, breach, misuse of funds): Founder may apply to court to claw back all equity. / <b>因故終止</b>（不當行為、違約、濫用資金）：創辦人可申請追回所有股權。',
    '•  Upon any termination: Partner returns all company property, devices, and confidential materials within 7 calendar days. / 任何終止後：合夥人須於7天內歸還所有公司財產。',
]:
    story.append(P(txt, BULLET))

# ── SECTION 9 — CONFIDENTIALITY ──────────────────────────────────────────────
story.append(P('9.  CONFIDENTIALITY & NON-COMPETE / 保密及競業禁止', SEC))
for txt in [
    '•  Both parties maintain strict confidentiality on all business operations, client relationships, financial information, platform data, and strategies — during the term and for 2 years after. / 雙方在協議期間及終止後2年內嚴格保密。',
    '•  Partner shall not engage in any business directly competing with SIMPLEX-ITY in Hong Kong or Greater Bay Area during the term and 12 months after termination. / 合夥人於協議期間及終止後12個月內不得在港或大灣區從事直接競爭業務。',
    '•  All IP, source code, tools, processes, and systems created by Partner in the course of this role belong solely to 5SENSESBEAUTY LIMITED. / 合夥人在職責範圍內創造的所有知識產權歸5SENSESBEAUTY LIMITED單獨所有。',
]:
    story.append(P(txt, BULLET))

# ── SECTION 10 — INTERNATIONAL CLAUSES ───────────────────────────────────────
story.append(P('10.  INTERNATIONAL REFERENCE CLAUSES / 國際參考條款', SEC))
story.append(P('Based on UK / US / EU startup partnership best practices / 參考英美歐初創合夥協議標準', SMALL))
for txt in [
    '•  <b>Good/Bad Leaver (UK/US):</b> Good Leaver (health, family, mutual agreement) retains vested shares at full value. Bad Leaver (cause, breach, misconduct) forfeits unvested equity; vested shares subject to buyback at par. / 好／壞離職者：好離職者保留已歸屬股份；壞離職者喪失未歸屬股權。',
    '•  <b>Drag-Along Right (US/EU):</b> If Founder receives bona fide 100% acquisition offer, Partner agrees to sell on the same terms. / 強制隨售權：創辦人獲100%收購要約時，合夥人按相同條款出售。',
    '•  <b>Tag-Along Right (US/EU):</b> If Founder sells majority holding, Partner may sell shares on the same terms. / 隨售權：創辦人出售多數股權時，合夥人可跟隨出售。',
    '•  <b>Anti-Dilution (US):</b> Partner\'s stake not diluted below minimum threshold without written consent, once all vesting conditions met. / 防稀釋：所有條件達成後，未經書面同意不得稀釋至下限以下。',
]:
    story.append(P(txt, BULLET))

# ── SECTION 11 — DISPUTE RESOLUTION ─────────────────────────────────────────
story.append(P('11.  DISPUTE RESOLUTION / 爭議解決', SEC))
for txt in [
    '•  Good faith negotiation within 14 days of written notice of any dispute. / 書面通知後14天內透過真誠談判解決爭議。',
    '•  If unresolved, submit to mediation in Hong Kong before any legal action. / 如未能解決，在提起法律行動前提交香港調解。',
    '•  This agreement is governed by the laws of Hong Kong SAR. / 本協議受香港特別行政區法律管轄。',
]:
    story.append(P(txt, BULLET))

# ── SIGNATURES ───────────────────────────────────────────────────────────────
story.append(SP(4))
story.append(HR(1.5, PRIMARY))
story.append(P('SIGNATURES / 簽署', SEC))
story.append(P(
    'By signing below, both parties confirm they have read, understood, and agreed to all terms above, '
    'including the chosen Partnership Model (Section 4). / '
    '雙方簽署確認已閱讀、理解並同意以上所有條款，包括所選合夥模式（第4條）。',
    SMALL))
story.append(SP(3))

sig = tbl([
    [P('FOUNDER / 創辦人', BOLD_S), P('PARTNER / 合夥人', BOLD_S)],
    [P('Name / 姓名:  KIERAN LI (LI, Chi Nok)<br/><br/>'
       'Signature / 簽署:<br/><br/>'
       '_______________________________<br/><br/>'
       'Date / 日期:  ____________________', SIGN),
     P('Chosen Name / 常用名稱:  ___________________<br/>'
       'Legal Name / 法定姓名:  _____________________<br/>'
       'HKID:  _____________________________________<br/>'
       'Model Selected / 所選模式:  ☐ A  ☐ B<br/><br/>'
       'Signature / 簽署:<br/><br/>'
       '_______________________________<br/><br/>'
       'Date / 日期:  ____________________', SIGN)],
    [P('WITNESS / 見證人  (Recommended / 建議)', BOLD_S), P('', SIGN)],
    [P('Name / 姓名:  _______________________________<br/><br/>'
       'Signature / 簽署:<br/><br/>'
       '_______________________________<br/><br/>'
       'Date / 日期:  ____________________', SIGN),
     P('', SIGN)],
], [90*mm, 90*mm], BASE_TBL + [
    ('BACKGROUND',(0,0),(-1,0),WASH),
    ('BACKGROUND',(0,2),(-1,2),WASH),
    ('SPAN',(0,2),(1,2)),
])
story.append(sig)

# ── ADDENDUM A — MILESTONE CHECKLIST ─────────────────────────────────────────
story.append(SP(5))
story.append(HR(1.5, PRIMARY))
story.append(P('ADDENDUM A — MILESTONE VERIFICATION CHECKLIST / 附件A — 里程碑核實清單', SEC))
story.append(P(
    'To be completed and signed by BOTH parties at the end of each Tranche period. '
    'This confirms conditions met and triggers the equity/share transfer. / '
    '於每批次期間結束時由雙方填寫並簽署，確認條件達成並觸發股權／股份轉讓。', SMALL))

for label, period, a_eq, b_eq, items in [
    ('TRANCHE 1 / 第一批', 'Month 6  ·  August 2026',
     '3% Phantom Equity', '3% + contribution bonus',
     ['☐  Bank account opened and operational / 銀行戶口已開立並運作',
      '☐  Office setup completed / 辦公室設置完成',
      '☐  2+ government funding applications formally submitted / 2份或以上政府資助申請已正式提交',
      '☐  Platform trial run successfully completed / 平台試運作成功完成',
      '☐  3 monthly operations reports submitted / 已提交3份月度營運報告']),
    ('TRANCHE 2 / 第二批', 'Month 12  ·  February 2027',
     '4% Formal Shares (total 4%)', '5–6% Formal Shares',
     ['☐  1+ government funding scheme successfully approved / 1項或以上資助計劃已成功批核',
      '☐  Platform fully operational and stable / 平台全面運作及穩定',
      '☐  Financial records complete, current, and auditable / 財務記錄完整、更新及可審計',
      '☐  Partner actively committed full-time throughout period / 合夥人整個期間積極全職投入']),
    ('TRANCHE 3 / 第三批', 'Month 18  ·  August 2027',
     '5% Formal Shares (total 12%)', '7–9% Formal Shares (total up to 18%)',
     ['☐  Cumulative government funding secured: HKD 300,000 or above / 累積政府資助港幣30萬或以上',
      '☐  Company fully self-sustaining and operational / 公司能完全自行運作',
      '☐  All compliance, tax, and MPF obligations fulfilled / 所有合規、稅務及強積金責任完全履行',
      '☐  Partner continues full-time active contribution / 合夥人繼續全職積極貢獻']),
]:
    at = tbl([[
        P(label, TRANCHE),
        P(period, TRANCHE),
        P(f'Model A: {a_eq}', TRANCHE),
        P(f'Model B: {b_eq}', TRANCHE),
    ]], [30*mm, 35*mm, 55*mm, 60*mm], [
        ('BACKGROUND',(0,0),(-1,-1),ACCENT),
        ('TOPPADDING',(0,0),(-1,-1),4),
        ('BOTTOMPADDING',(0,0),(-1,-1),4),
        ('LEFTPADDING',(0,0),(-1,-1),5),
    ])
    story.append(at)
    for item in items:
        story.append(P(item, BULLET))
    so = tbl([[
        P('Founder / 創辦人: _________________  Date / 日期: ____________', SMALL),
        P('Partner / 合夥人: _________________  Date / 日期: ____________', SMALL),
    ]], [90*mm, 90*mm], [
        ('BOX',(0,0),(-1,-1),0.5,GREY),
        ('INNERGRID',(0,0),(-1,-1),0.5,GREY),
        ('BACKGROUND',(0,0),(-1,-1),colors.HexColor('#f9f9ff')),
        ('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),4),
        ('LEFTPADDING',(0,0),(-1,-1),6),
    ])
    story.append(so)
    story.append(SP(4))

# ── LEGAL DISCLAIMER ──────────────────────────────────────────────────────────
story.append(HR(0.5, GREY))
story.append(P(
    '<b>LEGAL DISCLAIMER / 法律免責聲明:</b>  '
    'This document is a draft for discussion purposes only. Both parties are strongly advised '
    'to seek independent legal advice from a qualified Hong Kong solicitor before signing. '
    'Share transfers must comply with the Companies Ordinance (Cap. 622) of Hong Kong and may '
    'require Companies Registry approval and payment of stamp duty.  /  '
    '本文件僅為討論草稿。強烈建議雙方在簽署前向具資格的香港律師尋求獨立法律意見。'
    '股份轉讓必須符合香港《公司條例》（第622章）並可能需要公司註冊處批准及繳付印花稅。', DISC))

# ── BUILD ─────────────────────────────────────────────────────────────────────
doc.build(story, onFirstPage=draw_page, onLaterPages=draw_page)
print("✅  Wilson_Partnership_Agreement_V5_Final.pdf  —  DONE")
