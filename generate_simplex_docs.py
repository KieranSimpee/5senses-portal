from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

# Register fonts
try:
    pdfmetrics.registerFont(TTFont('Exo2', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
    pdfmetrics.registerFont(TTFont('Montserrat', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
except:
    pass

ACCENT = colors.HexColor('#5e50fb')
LIGHT = colors.HexColor('#e8e6fe')
DARK = colors.HexColor('#1a1a1f')

def make_styles():
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle('Title', fontName='Helvetica-Bold', fontSize=20, textColor=ACCENT, spaceAfter=6, leading=26)
    subtitle_style = ParagraphStyle('Subtitle', fontName='Helvetica', fontSize=11, textColor=DARK, spaceAfter=16, leading=16)
    section_style = ParagraphStyle('Section', fontName='Helvetica-Bold', fontSize=13, textColor=ACCENT, spaceBefore=18, spaceAfter=6, leading=18)
    body_style = ParagraphStyle('Body', fontName='Helvetica', fontSize=10, textColor=DARK, spaceAfter=8, leading=15)
    label_style = ParagraphStyle('Label', fontName='Helvetica-Bold', fontSize=10, textColor=DARK, spaceAfter=4, leading=14)
    return title_style, subtitle_style, section_style, body_style, label_style

def build_pdf(filename, title, subtitle, date, sections):
    doc = SimpleDocTemplate(filename, pagesize=A4,
        leftMargin=2.5*cm, rightMargin=2.5*cm,
        topMargin=2.5*cm, bottomMargin=2.5*cm)
    title_style, subtitle_style, section_style, body_style, label_style = make_styles()
    story = []

    story.append(Paragraph(title, title_style))
    story.append(HRFlowable(width="100%", thickness=2, color=ACCENT, spaceAfter=8))
    story.append(Paragraph(subtitle, subtitle_style))
    story.append(Paragraph(f"Date: {date}", body_style))
    story.append(Spacer(1, 0.4*cm))

    for section_title, items in sections:
        story.append(Paragraph(section_title, section_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=LIGHT, spaceAfter=6))
        for label, content in items:
            if label:
                story.append(Paragraph(label, label_style))
            story.append(Paragraph(content, body_style))
            story.append(Spacer(1, 0.2*cm))

    doc.build(story)
    print(f"Built: {filename}")

# ============================================================
# PART 1 ENGLISH - Personal Learning & Reflection
# ============================================================
build_pdf('/app/Part1_EN_PersonalLearning.pdf',
    'SIMPLEX-ITY — Personal Learning & Reflection',
    'A candid self-assessment of the founding journey and lessons learned',
    'June 3, 2026',
    [
        ('Problem 1: Lack of a Detailed Plan', [
            ('Finding:', 'SIMPLEX-ITY was founded without a thorough and structured expansion plan. There was no clear roadmap defining how the company would be built, scaled, and sustained from the outset.'),
        ]),
        ('Problem 2: Underestimating Difficulty & Overestimating Personal Capacity', [
            ('Finding:', 'At inception, the assumption was that building an online platform would be straightforward. However, the true ambition was never a simple platform — it was an influential, high-impact platform. These two are fundamentally different in complexity, resources, and execution. The difficulty was grossly underestimated.'),
        ]),
        ('Problem 3: Misalignment Between Vision and Reality', [
            ('Finding:', 'The vision of what SIMPLEX-ITY could become and the actual capacity, resources, and support available were never properly reconciled. Building an influential platform of this scale is not achievable by one person alone, yet this reality was not fully acknowledged at the start.'),
        ]),
        ('Problem 4: Insufficient Support & Resources', [
            ('Finding:', 'The level of support and collaboration needed to sustain and grow a high-impact platform was never sufficiently in place. The gap between what was required and what was available was a critical blocker.'),
        ]),
        ('Problem 5: Failure to Understand Others\' Hesitation', [
            ('Finding:', 'The natural instinct was to move fast and invite others to "believe and explore together." However, this approach failed to account for the perspective of others. Most people need to see a solid foundation, reliable leadership, and a tangible future before they commit — not just enthusiasm and belief.'),
        ]),
        ('Problem 6: Over-Optimism as a Blind Spot', [
            ('Finding:', 'A naturally optimistic personality led to the belief that hard work alone would guarantee success. While optimism is a strength, it became a blind spot — the internal vision was never translated into something others could see, feel, and trust. The result: others felt no safety or certainty, even though the belief internally was absolute.'),
        ]),
        ('Core Realisation', [
            ('Key Insight:', 'Others\' hesitation was not a lack of courage. It was a rational response to an insufficient foundation. You cannot ask people to explore with you before you have built something real to explore.'),
            ('The Shift:', 'Leadership is not about convincing people to believe in your vision. It is about building something tangible enough that belief becomes obvious. The order must be: Build the foundation first — then invite people in.'),
        ]),
    ]
)

# ============================================================
# PART 1 CHINESE - Personal Learning & Reflection
# ============================================================
build_pdf('/app/Part1_ZH_PersonalLearning.pdf',
    'SIMPLEX-ITY — Personal Learning & Reflection (Chinese)',
    u'\u500b\u4eba\u5b78\u7fd2\u8207\u81ea\u6211\u53cd\u601d\u8a18\u9304',
    'June 3, 2026',
    [
        (u'\u554f\u984c\u4e00\uff1a\u7f3a\u4e4f\u8a73\u7d30\u8a08\u5212', [
            (u'\u767c\u73fe\uff1a', u'\u6210\u7acb SIMPLEX-ITY \u6642\u6c92\u6709\u5efa\u7acb\u4e00\u500b\u5b8c\u5584\u7684\u958b\u62d3\u8a08\u5283\uff0c\u6b20\u7f3a\u660e\u78ba\u7684\u8def\u7dda\u5b9a\u7fa9\u516c\u53f8\u5982\u4f55\u5efa\u7acb\u3001\u64f4\u5c55\u548c\u6301\u7e8c\u767c\u5c55\u3002'),
        ]),
        (u'\u554f\u984c\u4e8c\uff1a\u4f4e\u4f30\u96e3\u5ea6\u3001\u9ad8\u4f30\u500b\u4eba\u80fd\u529b', [
            (u'\u767c\u73fe\uff1a', u'\u521d\u671f\u4ee5\u70ba\u5efa\u7acb\u7db2\u4e0a\u5e73\u53f0\u4e0d\u96e3\uff0c\u4f46\u771f\u6b63\u8ffd\u6c42\u7684\u4e26\u4e0d\u662f\u4e00\u500b\u666e\u901a\u5e73\u53f0\uff0c\u800c\u662f\u4e00\u500b\u5177\u5f71\u97ff\u529b\u7684\u5e73\u53f0\u3002\u5169\u8005\u5728\u8907\u96dc\u6027\u3001\u8cc7\u6e90\u548c\u57f7\u884c\u96e3\u5ea6\u4e0a\u6839\u672c\u4e0d\u5728\u540c\u4e00\u500b\u5c64\u6b21\uff0c\u96e3\u5ea6\u88ab\u56b4\u91cd\u4f4e\u4f30\u3002'),
        ]),
        (u'\u554f\u984c\u4e09\uff1a\u76ee\u6a19\u8207\u73fe\u5be6\u4e0d\u7b26', [
            (u'\u767c\u73fe\uff1a', u'SIMPLEX-ITY \u7684\u9060\u5927\u9858\u666f\u8207\u5be6\u969b\u53ef\u7528\u7684\u80fd\u529b\u3001\u8cc7\u6e90\u548c\u652f\u6301\u5f9e\u672a\u88ab\u6b63\u78ba\u8a55\u4f30\u3002\u9760\u500b\u4eba\u7368\u529b\u7121\u6cd5\u5efa\u7acb\u4e00\u500b\u5177\u9019\u8996\u89d2\u898f\u6a21\u7684\u5e73\u53f0\uff0c\u4f46\u9019\u500b\u73fe\u5be6\u5728\u521d\u671f\u4e26\u6c92\u6709\u88ab\u5145\u5206\u627f\u8a8d\u3002'),
        ]),
        (u'\u554f\u984c\u56db\uff1a\u652f\u6301\u8207\u914d\u5408\u4e0d\u8db3', [
            (u'\u767c\u73fe\uff1a', u'\u652f\u64d0\u548c\u7d93\u71df\u4e00\u500b\u5177\u5f71\u97ff\u529b\u5e73\u53f0\u6240\u9700\u8981\u7684\u5408\u4f5c\u548c\u652f\u6301\u5f9e\u4e0d\u5145\u5206\u3002\u9700\u6c42\u8207\u5be6\u969b\u53ef\u7528\u8cc7\u6e90\u4e4b\u9593\u7684\u5dee\u8ddd\u662f\u4e00\u500b\u95dc\u9375\u969c\u7887\u3002'),
        ]),
        (u'\u554f\u984c\u4e94\uff1a\u672a\u80fd\u7406\u89e3\u5176\u4ed6\u4eba\u7684\u731c\u9812\u548c\u9060\u615f', [
            (u'\u767c\u73fe\uff1a', u'\u5169\u624b\u5c31\u662f\u5feb\u901f\u884c\u52d5\uff0c\u8981\u5225\u4eba\u300c\u76f8\u4fe1\u4e00\u8d77\u63a2\u7d22\u300d\u3002\u4f46\u9019\u500b\u65b9\u5f0f\u6c92\u6709\u8003\u616e\u5230\u5225\u4eba\u7684\u89d2\u5ea6\u3002\u5927\u591a\u6578\u4eba\u5728\u627f\u8afe\u4e4b\u524d\uff0c\u9700\u8981\u770b\u5230\u7a69\u56fa\u7684\u57fa\u790e\u3001\u53ef\u9760\u7684\u9818\u5c0e\u548c\u5207\u5be6\u7684\u5c07\u4f86\u2014\u2014\u800c\u4e0d\u53ea\u662f\u71b1\u60c5\u548c\u4fe1\u5ff5\u3002'),
        ]),
        (u'\u554f\u984c\u516d\uff1a\u904e\u5ea6\u6a02\u89c0\u6210\u70ba\u76f2\u9ede', [
            (u'\u767c\u73fe\uff1a', u'\u5929\u751f\u6a02\u89c0\u7684\u6027\u683c\u4f7f\u81ea\u5df1\u76f8\u4fe1\u52aa\u529b\u5c31\u4e00\u5b9a\u6703\u6210\u529f\u3002\u4f46\u6a02\u89c0\u6210\u70ba\u4e86\u76f2\u9ede\u2014\u2014\u5167\u5fc3\u7684\u9060\u666f\u5f9e\u672a\u88ab\u8f49\u5316\u6210\u5225\u4eba\u53ef\u4ee5\u770b\u898b\u3001\u611f\u53d7\u548c\u4fe1\u8cf4\u7684\u6771\u897f\u3002\u7d50\u679c\uff1a\u5225\u4eba\u611f\u53d7\u4e0d\u5230\u5b89\u5168\u611f\u548c\u78ba\u5b9a\u6027\u3002'),
        ]),
        (u'\u6838\u5fc3\u8998\u609f', [
            (u'\u95dc\u9375\u6d1e\u898b\uff1a', u'\u5225\u4eba\u7684\u731c\u9812\u4e0d\u662f\u6c92\u6709\u52c7\u6c23\uff0c\u800c\u662f\u5c0d\u4e00\u500b\u4e0d\u5920\u7d2e\u5be6\u7684\u57fa\u790e\u7684\u5408\u7406\u56de\u61c9\u3002\u4e0d\u80fd\u8981\u6c42\u5225\u4eba\u5728\u4f60\u5c1a\u672a\u5efa\u597d\u4efb\u4f55\u5be6\u5728\u7684\u6771\u897f\u4e4b\u524d\uff0c\u5148\u8ddf\u4f60\u4e00\u8d77\u63a2\u7d22\u3002'),
            (u'\u8f49\u8b8a\uff1a', u'\u9818\u5c0e\u529b\u4e0d\u662f\u8aaa\u670d\u5225\u4eba\u76f8\u4fe1\u4f60\u7684\u9060\u666f\uff0c\u800c\u662f\u5efa\u7acb\u5920\u5be6\u5728\u7684\u6771\u897f\u4f7f\u5f97\u4fe1\u5ff5\u8b8a\u5f97\u5f88\u81ea\u7136\u3002\u6b63\u78ba\u7684\u6b65\u9a5f\u5e94\u8a72\u662f\uff1a\u5148\u5efa\u597d\u57fa\u790e\uff0c\u518d\u9080\u8acb\u5225\u4eba\u9032\u4f86\u3002'),
        ]),
    ]
)

# ============================================================
# PART 2 ENGLISH - Simplex-ity Solidification Plan
# ============================================================
build_pdf('/app/Part2_EN_SolidificationPlan.pdf',
    'SIMPLEX-ITY — Solidification Plan 2026',
    'A structured roadmap to build a tangible, investable platform',
    'June 3, 2026',
    [
        ('Key 1: Government Support — StartmeUp HK', [
            ('Action:', 'Reached out to StartmeUp HK to explore government-backed support, advice, and any leverage the company can gain through official channels.'),
            ('Goal:', 'Secure credibility, potential grants, and government endorsement to strengthen the foundation of SIMPLEX-ITY.'),
        ]),
        ('Key 2: Operational Partner — Vybd AI Commerce', [
            ('Action:', 'Plan to engage Vybd to take on a defined portion of platform operations, either through a fee arrangement or a partnership structure.'),
            ('Goal:', 'Free up Kieran to focus on strategic priorities while Vybd handles operational execution. Reduce single-point-of-failure risk.'),
        ]),
        ('Key 3: Vybd Value Demonstration', [
            ('Action:', 'Once connected, Vybd will be asked to demonstrate the tangible value they can bring to the platform before any long-term commitment is made.'),
            ('Goal:', 'Evidence-based partnership — see the value first, then decide.'),
        ]),
        ('Key 4: Tint AI — Core Function Already Integrated', [
            ('Status:', 'Tint AI Try-On is already connected to the SIMPLEX-ITY platform.'),
            ('Significance:', 'This is a core proof-of-concept. A key AI function is live and demonstrable — this is what transforms the platform from an idea into a real product.'),
        ]),
        ('Key 5: Brand Strategy — Self-Execute (Recommended)', [
            ('Option A (ABW Partnership):', 'ABW provides brands; YesStyle (sister company) brings influencers. Large scale but creates dependency on a single partner.'),
            ('Option B — Recommended (Self-Execute):', 'Leverage Kieran\'s sourcing background, Loreen and Ally\'s expertise, and existing Korean skincare brand connections.'),
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
        ('Key 6: NEST VC — The Final Solidification Move', [
            ('Strategy:', 'Once all AI partners are integrated and the platform ecosystem is solid, present SIMPLEX-ITY to NEST VC Incubator as a fully-equipped, partner-backed platform ready for investment.'),
            ('Goal:', 'Secure NEST VC as investor, establishing a solid financial and operational foundation.'),
            ('Outcome:', 'With investment confirmed and platform proven, Kieran can confidently invite trusted people to join the company — on a foundation that is real, not just visionary.'),
        ]),
        ('Summary: The Correct Order', [
            ('', '1. Build AI partner ecosystem (Tint AI done, Vybd next)'),
            ('', '2. Secure government support (StartmeUp HK)'),
            ('', '3. Execute 3-month brand/influencer trial'),
            ('', '4. Present to NEST VC with real data and a live platform'),
            ('', '5. Invite trusted people to join — on solid ground'),
        ]),
    ]
)

# ============================================================
# PART 2 CHINESE - Simplex-ity Solidification Plan
# ============================================================
build_pdf('/app/Part2_ZH_SolidificationPlan.pdf',
    'SIMPLEX-ITY — Solidification Plan 2026 (Chinese)',
    u'SIMPLEX-ITY \u5be6\u5728\u5316\u8a08\u5283 2026',
    'June 3, 2026',
    [
        (u'\u95dc\u9375\u4e00\uff1a\u653f\u5e9c\u652f\u6301 \u2014 StartmeUp HK', [
            (u'\u884c\u52d5\uff1a', u'\u5df2\u4e3b\u52d5\u806f\u7e6b StartmeUp HK\uff0c\u63a2\u7d22\u653f\u5e9c\u652f\u6301\u3001\u5efa\u8b70\u53ca\u4efb\u4f55\u53ef\u4ee5\u900f\u904e\u5b98\u65b9\u6e20\u9053\u7372\u5f97\u7684\u6291\u683c\u8cc7\u6e90\u3002'),
            (u'\u76ee\u6a19\uff1a', u'\u5efa\u7acb\u516c\u4fe1\u529b\u3001\u7372\u53d6\u6f5b\u5728\u6d25\u8cbc\u53ca\u653f\u5e9c\u8a8d\u53ef\uff0c\u52a0\u5f37 SIMPLEX-ITY \u7684\u5be6\u5728\u57fa\u790e\u3002'),
        ]),
        (u'\u95dc\u9375\u4e8c\uff1a\u904b\u7db2\u5408\u4f5c\u5ece\u4f34 \u2014 Vybd AI Commerce', [
            (u'\u884c\u52d5\uff1a', u'\u8a08\u5283\u8207 Vybd \u5408\u4f5c\uff0c\u5c07\u5e73\u53f0\u4e00\u5b9a\u6bd4\u4f8b\u7684\u904b\u7db2\u5de5\u4f5c\u4ea4\u6258\u7d66\u4ed6\u5011\u57f7\u884c\uff0c\u4ee5\u8cbb\u7528\u5b89\u6392\u6216\u5408\u4f5c\u5f62\u5f0f\u9032\u884c\u3002'),
            (u'\u76ee\u6a19\uff1a', u'\u91cb\u653e Kieran \u7684\u7b56\u7565\u8cc7\u6e90\uff0c\u5c08\u6ce8\u65bc\u95dc\u9375\u512a\u5148\u4e8b\u9805\uff0c\u540c\u6642\u6e1b\u5c11\u55ae\u4e00\u4f9d\u8cf4\u7684\u98a8\u96aa\u3002'),
        ]),
        (u'\u95dc\u9375\u4e09\uff1a Vybd \u50f9\u5024\u9a57\u8b49', [
            (u'\u884c\u52d5\uff1a', u'\u9023\u63a5\u5f8c\uff0c\u8981\u6c42 Vybd \u5c55\u793a\u4ed6\u5011\u80fd\u70ba\u5e73\u53f0\u5e36\u4f86\u7684\u5be6\u969b\u50f9\u5024\uff0c\u518d\u51b3\u5b9a\u9577\u671f\u627f\u8afe\u3002'),
            (u'\u76ee\u6a19\uff1a', u'\u4ee5\u8b49\u64da\u70ba\u57fa\u790e\u7684\u5408\u4f5c\u2014\u2014\u5148\u770b\u5230\u50f9\u5024\uff0c\u518d\u505a\u51b3\u5b9a\u3002'),
        ]),
        (u'\u95dc\u9375\u56db\uff1a Tint AI \u2014 \u6838\u5fc3\u529f\u80fd\u5df2\u6574\u5408', [
            (u'\u73fe\u6cc1\uff1a', u'Tint AI \u865b\u64ec\u8a66\u7528\u529f\u80fd\u5df2\u6210\u529f\u9023\u63a5\u81f3 SIMPLEX-ITY \u5e73\u53f0\u3002'),
            (u'\u91cd\u8981\u6027\uff1a', u'\u9019\u662f\u4e00\u500b\u95dc\u9375\u7684\u6982\u5ff5\u9a57\u8b49\u3002\u4e00\u500b\u6838\u5fc3 AI \u529f\u80fd\u5df2\u7d93\u5be6\u969b\u904b\u884c\u2014\u2014\u9019\u662f\u5c07\u5e73\u53f0\u5f9e\u69cb\u60f3\u8f49\u5316\u70ba\u771f\u5be6\u7522\u54c1\u7684\u95dc\u9375\u6b65\u9a5f\u3002'),
        ]),
        (u'\u95dc\u9375\u4e94\uff1a\u54c1\u724c\u7b56\u7565 \u2014 \u81ea\u4e3b\u57f7\u884c\uff08\u63a8\u85a6\uff09', [
            (u'\u65b9\u5411A\uff08ABW \u5408\u4f5c\uff09\uff1a', u'ABW \u63d0\u4f9b\u54c1\u724c\uff1b\u59d0\u59b9\u516c\u53f8 YesStyle \u5f15\u5165 influencer \u7db2\u7d61\u3002\u898f\u6a21\u5927\u4f46\u5c0d\u55ae\u4e00\u5ece\u4f34\u4f9d\u8cf4\u6027\u9ad8\u3002'),
            (u'\u65b9\u5411B \u2014 \u63a8\u85a6\uff08\u81ea\u4e3b\u57f7\u884c\uff09\uff1a', u'\u5229\u7528 Kieran \u7684\u64c7\u8ca8\u80cc\u666f\u3001Loreen \u548c Ally \u7684\u5c08\u696d\u80fd\u529b\uff0c\u4ee5\u53ca\u73fe\u6709\u7684\u97d3\u570b\u8b77\u819a\u54c1\u724c\u4eba\u8108\u3002'),
            (u'3 \u500b\u6708\u8a66\u884c\u671f\u6a21\u5f0f\uff1a', u'1. \u9080\u8acb\u54c1\u724c\u548c influencer \u514d\u8cbb\u53c3\u8207\n2. \u54c1\u724c\u50c5\u8ca0\u8cac\u5c07\u8ca8\u54c1\u5bc4\u51fa\u7d66\u6d88\u8cbb\u8005\uff0c\u96f6\u5176\u4ed6\u8cbb\u7528\n3. \u8a66\u884c\u671f\u9593\u5e73\u53f0\u6240\u6709\u7522\u54c1\u5e02\u50f9\u6253 7 \u6298\n4. \u6d88\u8cbb\u8005\u660e\u78ba\u77e5\u6682\u70ba\u8a66\u884c\u671f\uff0c\u771f\u5be6\u548c\u6e05\u6670\u5730\u50b3\u9054\u8a0a\u606f\n5. \u5229\u7528 3 \u500b\u6708 debug \u7cfb\u7d71\u548c\u6539\u5584\u5e73\u53f0\u9ad4\u9a57'),
            (u'\u6536\u76ca\u4f86\u6e90\uff1a', u'\u4ea4\u6613\u4f63\u91d1 + \u5e02\u5834\u60c5\u5831\u6578\u636e\uff08\u6d88\u8cbb\u8005\u884c\u70ba\u6d1e\u5bdf\uff09'),
            (u'\u5411 NEST VC \u8aaa\u660e\u7684\u8cc7\u91d1\u9700\u6c42\uff1a', u'\u8a66\u884c\u671f\u9593\u7684 AI \u865b\u64ec\u8a66\u7528\u6bcf\u6b21\u9ede\u64ca\u8cbb\u7528\u2014\u2014\u9700\u5728\u6295\u8cc7\u8005\u5448\u73fe\u4e2d\u6e05\u6670\u8aaa\u660e'),
            (u'\u9577\u671f\u8207 ABW \u5408\u4f5c\uff1a', u'ABW \u53ef\u6210\u70ba\u5e73\u53f0\u5c07\u4f86\u7684\u4f9b\u61c9\u5546\u2014\u2014\u6309\u6211\u5011\u7684\u689d\u4ef6\uff0c\u800c\u4e0d\u662f\u7531\u4ed6\u5011\u4e3b\u5c0e\u3002'),
        ]),
        (u'\u95dc\u9375\u516d\uff1a NEST VC \u2014 \u6700\u7d42\u5be6\u5728\u5316\u884c\u52d5', [
            (u'\u7b56\u7565\uff1a', u'\u5f85\u6240\u6709 AI \u5ece\u4f34\u6574\u5408\u7a69\u56fa\u5f8c\uff0c\u5c07 SIMPLEX-ITY \u4ee5\u5b8c\u6574\u7684\u5ece\u4f34\u751f\u614b\u7cfb\u7d71\u5411 NEST VC \u5b78\u8209\u795e\u5448\u73fe\uff0c\u76ee\u6a19\u662f\u78ba\u8a8d\u5176\u6295\u8cc7\u610f\u5411\u3002'),
            (u'\u76ee\u6a19\uff1a', u'\u78ba\u4fdd NEST VC \u4f5c\u70ba\u6295\u8cc7\u8005\uff0c\u5efa\u7acb\u7a69\u56fa\u7684\u8ca1\u52d9\u548c\u904b\u7db2\u57fa\u790e\u3002'),
            (u'\u6210\u679c\uff1a', u'\u6295\u8cc7\u78ba\u8a8d\u3001\u5e73\u53f0\u5eba\u9a57\u8b49\u5f8c\uff0c Kieran \u53ef\u4ee5\u6709\u4fe1\u5fc3\u5730\u9080\u8acb\u4fe1\u4efb\u7684\u4eba\u52a0\u5165\u516c\u53f8\u2014\u2014\u5efa\u7acb\u5728\u771f\u5be6\u800c\u975e\u53ea\u662f\u9060\u666f\u7684\u5be6\u5728\u57fa\u790e\u4e0a\u3002'),
        ]),
        (u'\u7e3d\u7d50\uff1a\u6b63\u78ba\u7684\u6b65\u9a5f', [
            ('', u'1. \u5efa\u7acb AI \u5ece\u4f34\u751f\u614b\uff08Tint AI \u5df2\u5b8c\u6210\uff0cVybd \u662f\u4e0b\u4e00\u6b65\uff09'),
            ('', u'2. \u7372\u53d6\u653f\u5e9c\u652f\u6301\uff08StartmeUp HK\uff09'),
            ('', u'3. \u57f7\u884c 3 \u500b\u6708\u54c1\u724c / influencer \u8a66\u884c'),
            ('', u'4. \u5e36\u8457\u771f\u5be6\u6578\u636e\u548c\u5be6\u969b\u904b\u884c\u7684\u5e73\u53f0\u5411 NEST VC \u5448\u73fe'),
            ('', u'5. \u5728\u7a69\u56fa\u57fa\u790e\u4e0a\u9080\u8acb\u4fe1\u4efb\u7684\u4eba\u52a0\u5165'),
        ]),
    ]
)

print("All 4 PDFs generated successfully!")
