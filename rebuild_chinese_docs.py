from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

pdfmetrics.registerFont(TTFont('WQY', '/app/wqy.ttf'))

ACCENT = colors.HexColor('#5e50fb')
LIGHT = colors.HexColor('#e8e6fe')
DARK = colors.HexColor('#1a1a1f')

def make_styles():
    title_style  = ParagraphStyle('Title',   fontName='WQY', fontSize=18, textColor=ACCENT, spaceAfter=6,  leading=26)
    subtitle_style=ParagraphStyle('Sub',     fontName='WQY', fontSize=11, textColor=DARK,   spaceAfter=14, leading=16)
    section_style= ParagraphStyle('Section', fontName='WQY', fontSize=13, textColor=ACCENT, spaceBefore=16,spaceAfter=6, leading=18)
    body_style   = ParagraphStyle('Body',    fontName='WQY', fontSize=10, textColor=DARK,   spaceAfter=8,  leading=15)
    label_style  = ParagraphStyle('Label',   fontName='WQY', fontSize=10, textColor=DARK,   spaceAfter=4,  leading=14)
    return title_style, subtitle_style, section_style, body_style, label_style

def build_pdf(filename, title, subtitle, date, sections):
    doc = SimpleDocTemplate(filename, pagesize=A4,
        leftMargin=2.5*cm, rightMargin=2.5*cm,
        topMargin=2.5*cm, bottomMargin=2.5*cm)
    title_s, sub_s, sec_s, body_s, label_s = make_styles()
    story = []
    story.append(Paragraph(title, title_s))
    story.append(HRFlowable(width="100%", thickness=2, color=ACCENT, spaceAfter=8))
    story.append(Paragraph(subtitle, sub_s))
    story.append(Paragraph(f"日期 Date: {date}", body_s))
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

# ============================================================
# PART 1 CHINESE — Personal Learning & Reflection
# ============================================================
build_pdf('Part1_ZH_PersonalLearning.pdf',
    'SIMPLEX-ITY — 個人學習與自我反思',
    '創業歷程的坦誠自我評估及從中得到的教訓',
    '2026年6月3日',
    [
        ('問題一：缺乏詳細計劃', [
            ('發現：', '成立 SIMPLEX-ITY 時沒有建立一個完善的開拓計劃，欠缺明確的路線定義公司如何建立、擴展和持續發展。'),
        ]),
        ('問題二：低估難度、高估個人能力', [
            ('發現：', '初期以為建立一個網上平台不難，但真正追求的並不是一個普通平台，而是一個有影響力的平台。兩者在複雜性、資源和執行難度上根本不在同一層次，難度被嚴重低估。'),
        ]),
        ('問題三：目標與現實不符', [
            ('發現：', 'SIMPLEX-ITY 的遠大願景與實際可用的能力、資源和支持從未被正確評估。靠個人獨力無法建立這視角規模的平台，但這個現實在初期並沒有被充分承認。'),
        ]),
        ('問題四：支持與配合不足', [
            ('發現：', '支撐和經營一個有影響力平台所需要的合作和支持從不充分。需求與實際可用資源之間的差距是一個關鍵障礙。'),
        ]),
        ('問題五：未能理解其他人的猶豫和顧慮', [
            ('發現：', '自然本能是快速行動，要別人「相信一起探索」。但這個方式沒有考慮到別人的角度。大多數人在承諾之前，需要看到穩固的基礎、可靠的領導和切實的將來——而不只是熱情和信念。'),
        ]),
        ('問題六：過度樂觀成為盲點', [
            ('發現：', '天生樂觀的性格使自己相信努力就一定成功。但樂觀成為了盲點——內心的願景從未被轉化成別人可以看見、感受和信賴的東西。結果：別人感受不到安全感和確定性。'),
        ]),
        ('核心覺悟', [
            ('關鍵洞見：', '別人的猶豫不是沒有勇氣，而是對一個不夠紮實的基礎的合理回應。不能要求別人在你尚未建好任何實在的東西之前，先跟你一起探索。'),
            ('轉變：', '領導力不是說服別人相信你的願景，而是建立夠實在的東西使得信念變得很自然。正確的步驟應該是：先建好基礎——再邀請別人進來。'),
        ]),
    ]
)

# ============================================================
# PART 2 CHINESE — Simplex-ity Solidification Plan (CORRECTED SEQUENCE)
# ============================================================
build_pdf('Part2_ZH_SolidificationPlan.pdf',
    'SIMPLEX-ITY — 實在化計劃 2026',
    '建立一個實在、具投資價值平台的結構性路線圖',
    '2026年6月3日',
    [
        ('關鍵一：政府支持 — StartmeUp HK', [
            ('行動：', '已主動聯繫 StartmeUp HK，探索政府支持、建議及任何可透過官方渠道獲得的槓桿資源。'),
            ('目標：', '建立公信力、獲取潛在津貼及政府認可，加強 SIMPLEX-ITY 的實在基礎。'),
        ]),
        ('關鍵二：運營合作夥伴 — Vybd AI Commerce', [
            ('行動：', '計劃與 Vybd 合作，將平台一定比例的運營工作交託給他們執行，以費用安排或合作形式進行。'),
            ('目標：', '釋放 Kieran 的策略資源，專注於關鍵優先事項，同時減少單一依賴的風險。'),
            ('時間表：', 'Kieran 於未來兩週內完成 Vybd 的最終確認。'),
        ]),
        ('關鍵三：Tint AI — 核心功能已整合', [
            ('現況：', 'Tint AI 虛擬試用功能已成功連接至 SIMPLEX-ITY 平台，由 Kieran 完成。'),
            ('重要性：', '這是一個關鍵的概念驗證。一個核心 AI 功能已經實際運行——這是將平台從構想轉化為真實產品的關鍵步驟。'),
        ]),
        ('關鍵四：平台就緒 — Wilson 負責', [
            ('行動：', '平台整體技術就緒工作由 Wilson 負責完成。'),
            ('目標：', '確保平台在技術層面穩固，為所有 AI 功能整合及最終推出做好準備。'),
        ]),
        ('關鍵五：品牌策略 — 自主執行（推薦）', [
            ('方向A（ABW 合作）：', 'ABW 提供品牌；姐妹公司 YesStyle 引入 influencer 網絡。規模大但對單一夥伴依賴性高。'),
            ('方向B — 推薦（自主執行）：', '利用 Kieran 的擇貨背景、Loreen 和 Ally 的專業能力，以及現有的韓國護膚品牌人脈。'),
            ('3個月試行期模式：', ''),
            ('', '1. 邀請品牌和 influencer 免費參與'),
            ('', '2. 品牌僅負責將貨品寄出給消費者，零其他費用'),
            ('', '3. 試行期間平台所有產品市價打七折'),
            ('', '4. 消費者明確知道這是試行期，真實和清晰地傳達訊息'),
            ('', '5. 利用3個月 debug 系統和改善平台體驗'),
            ('收益來源：', '交易佣金 + 市場情報數據（消費者行為洞察）'),
            ('向 NEST VC 說明的資金需求：', 'AI 虛擬試用每次點擊費用——需在投資者呈現中清晰說明'),
            ('長遠與 ABW 合作：', 'ABW 可成為平台將來的供應商——按我們的條件，而不是由他們主導。'),
        ]),
        ('關鍵六：NEST VC — 確認孵化器夥伴關係', [
            ('策略：', '待所有 AI 夥伴整合穩固後，由 Kieran 親自與 NEST VC 孵化器建立聯繫，目標是確認其作為投資者的夥伴關係。'),
            ('目標：', '確保 NEST VC 作為投資者，建立穩固的財務和運營基礎。'),
        ]),
        ('關鍵七：聘請 Loreen 和 Ally', [
            ('行動：', 'NEST VC 夥伴關係確認後，正式邀請 Loreen 和 Ally 加入公司。'),
            ('理由：', '在有實在基礎的情況下邀請信任的人——而不是要求他們在基礎建立之前先跟隨。'),
        ]),
        ('關鍵八：推出計劃最終確定', [
            ('行動：', '所有夥伴正式加入後，最終確定平台推出計劃。'),
            ('目標：', '確保每一個環節都到位，以有序和有準備的方式正式推出 SIMPLEX-ITY。'),
        ]),
        ('正確步驟次序（最終版）', [
            ('', '1. 平台就緒 — Wilson 負責'),
            ('', '2. AI Tint Try-On 整合 — Kieran 完成 ✅'),
            ('', '3. AI Vybd 最終確認 — Kieran，未來兩週內完成'),
            ('', '4. 與 NEST VC 建立聯繫，確認孵化器夥伴關係 — Kieran 負責'),
            ('', '5. 聘請 Loreen 和 Ally'),
            ('', '6. 所有夥伴到位後，最終確定推出計劃'),
        ]),
    ]
)

print("Both Chinese PDFs rebuilt successfully!")
