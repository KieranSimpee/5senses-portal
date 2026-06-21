import re

with open('/app/simplex_ity_brand_report_EXTERNAL_ESSENTIAL.html', 'r', encoding='utf-8') as f:
    content = f.read()

# ══════════════════════════════════════════════
# FIX 1: Cover — remove CONFIDENTIAL, replace with ESSENTIAL MEMBER REPORT
# ══════════════════════════════════════════════
content = content.replace('CONFIDENTIAL BRAND PERFORMANCE REPORT', 'ESSENTIAL MEMBER REPORT')
content = content.replace('機密品牌表現報告', '基礎會員報告')

# ══════════════════════════════════════════════
# FIX 2: Executive Summary body — remove platform-wide numbers
# ══════════════════════════════════════════════
# Replace exec-body EN with brand-facing version
old_exec_en = re.search(r'<div class="exec-body en-only">.*?</div>', content, re.DOTALL)
if old_exec_en:
    new_exec_en = '''<div class="exec-body en-only">Welcome to your SIMPLEX-ITY Essential Member Report for June 2026. This report summarises your brand\'s performance on the platform — covering your sales results, top products, and recommended next steps. All figures are in USD.</div>'''
    content = content[:old_exec_en.start()] + new_exec_en + content[old_exec_en.end():]
    print("Exec body EN fixed ✅")

# Replace exec-body ZH
old_exec_zh = re.search(r'<div class="exec-body zh-only"[^>]*>.*?</div>', content, re.DOTALL)
if old_exec_zh:
    new_exec_zh = '''<div class="exec-body zh-only" style="display:none">歡迎查閱您的SIMPLEX-ITY 2026年6月基礎會員報告。本報告摘要您品牌在平台上的表現，涵蓋銷售業績、熱賣產品及建議下一步行動。所有數字以美元計算。</div>'''
    content = content[:old_exec_zh.start()] + new_exec_zh + content[old_exec_zh.end():]
    print("Exec body ZH fixed ✅")

# ══════════════════════════════════════════════
# FIX 3: KPI Strip — replace platform metrics with brand-specific metrics
# ══════════════════════════════════════════════
svg_money = '''<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="7" width="22" height="14" rx="2" stroke="#ae9cdc" stroke-width="1.4"/><circle cx="14" cy="14" r="3.5" stroke="#ae9cdc" stroke-width="1.4"/><line x1="7" y1="7" x2="7" y2="21" stroke="#ae9cdc" stroke-width="1.4"/><line x1="21" y1="7" x2="21" y2="21" stroke="#ae9cdc" stroke-width="1.4"/></svg>'''
svg_bag = '''<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 11V8a5 5 0 0 1 10 0v3" stroke="#ae9cdc" stroke-width="1.4" stroke-linecap="round"/><rect x="4" y="11" width="20" height="13" rx="2" stroke="#ae9cdc" stroke-width="1.4"/></svg>'''
svg_diamond = '''<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="14,4 24,11 20,24 8,24 4,11" stroke="#ae9cdc" stroke-width="1.4" stroke-linejoin="round"/><line x1="4" y1="11" x2="24" y2="11" stroke="#ae9cdc" stroke-width="1.4"/></svg>'''
svg_satisfaction = '''<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="14" r="10" stroke="#ae9cdc" stroke-width="1.4"/><path d="M9 16 C9 16 11 20 14 20 C17 20 19 16 19 16" stroke="#ae9cdc" stroke-width="1.4" stroke-linecap="round"/><circle cx="10.5" cy="11.5" r="1.2" fill="#ae9cdc"/><circle cx="17.5" cy="11.5" r="1.2" fill="#ae9cdc"/></svg>'''

# Find and replace the entire KPI grid
old_kpi_grid = re.search(r'<div class="kpi-grid">.*?</div>\s*</div>\s*</div>\s*\n\n<!-- ══', content, re.DOTALL)
if old_kpi_grid:
    new_kpi = f'''<div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-icon">{svg_money}</div>
      <span class="kpi-label en-only">Your Brand GMV</span>
      <span class="kpi-label zh-only">品牌銷售總額</span>
      <span class="kpi-value">$[GMV]</span>
      <span class="kpi-change up">▲ vs Last Month</span>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon">{svg_bag}</div>
      <span class="kpi-label en-only">Your Orders</span>
      <span class="kpi-label zh-only">訂單數量</span>
      <span class="kpi-value">[ORDERS]</span>
      <span class="kpi-change up">▲ vs Last Month</span>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon">{svg_diamond}</div>
      <span class="kpi-label en-only">Avg Order Value</span>
      <span class="kpi-label zh-only">平均客單價</span>
      <span class="kpi-value">$[AOV]</span>
      <span class="kpi-change up">▲ vs Last Month</span>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon">{svg_satisfaction}</div>
      <span class="kpi-label en-only">Satisfaction Score</span>
      <span class="kpi-label zh-only">品牌滿意度</span>
      <span class="kpi-value">[SCORE]</span>
      <span class="kpi-change up">▲ vs Last Month</span>
    </div>
  </div>\n</div>\n</div>\n\n<!-- ══'''
    content = content[:old_kpi_grid.start()] + new_kpi + content[old_kpi_grid.end()-4:]
    print("KPI grid replaced with brand-specific metrics ✅")
else:
    print("⚠️ KPI grid not found via regex — trying manual")

# ══════════════════════════════════════════════
# FIX 4: Remove Price Point section entirely — replace with upgrade teaser
# ══════════════════════════════════════════════
lock_svg = '''<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="10" width="12" height="9" rx="2" stroke="#ae9cdc" stroke-width="1.3"/><path d="M8 10V7a3 3 0 0 1 6 0v3" stroke="#ae9cdc" stroke-width="1.3" stroke-linecap="round"/></svg>'''

upgrade_price = f'''<div class="upgrade-teaser">
  <div class="upgrade-icon">{lock_svg}</div>
  <div class="upgrade-title en-only">Price Point Analysis — Professional & Above</div>
  <div class="upgrade-title zh-only" style="display:none">價格帶分析 — 專業版及以上</div>
  <div class="upgrade-body en-only">Detailed breakdown of sales by price tier ($0–50, $50–100, $100+), conversion rates by price point, and premium positioning insights are available on Professional and Enterprise tiers.</div>
  <div class="upgrade-body zh-only" style="display:none">按價格層級（$0-50、$50-100、$100+）的銷售細分、各價格點轉化率及高端定位洞察於專業版及企業版提供。</div>
  <a class="upgrade-btn" href="#">Upgrade Membership →</a>
</div>'''

price_grid = re.search(r'<div class="price-grid">.*?</div>\s*</div>\s*\n\n<!-- ══', content, re.DOTALL)
if price_grid:
    content = content[:price_grid.start()] + upgrade_price + '\n\n<!-- ══' + content[price_grid.end()-4:]
    print("Price Point locked ✅")
else:
    print("⚠️ Price grid not found")

# ══════════════════════════════════════════════
# FIX 5: Remove "Fermented Beauty" specific platform strategy from Recommendations
# Keep recommendations section but make it generic / brand-facing
# ══════════════════════════════════════════════
# Replace internal platform recommendations with brand-facing ones
old_rec_cards = re.search(r'<div class="rec-grid">.*?</div>\s*</div>\s*\n\n<!-- ══', content, re.DOTALL)
if old_rec_cards:
    svg_rocket = '''<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 4 C14 4 20 8 20 15 L14 22 L8 15 C8 8 14 4 14 4Z" stroke="#ae9cdc" stroke-width="1.4" stroke-linejoin="round"/><circle cx="14" cy="13" r="2.5" stroke="#ae9cdc" stroke-width="1.4"/><path d="M8 15 L5 20 L10 18" stroke="#ae9cdc" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 15 L23 20 L18 18" stroke="#ae9cdc" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'''
    svg_leaf = '''<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 22 C8 22 6 12 14 8 C20 5 24 8 22 16 C20 22 12 24 8 22Z" stroke="#ae9cdc" stroke-width="1.4" stroke-linejoin="round"/><line x1="8" y1="22" x2="16" y2="13" stroke="#ae9cdc" stroke-width="1.4" stroke-linecap="round"/></svg>'''
    svg_person = '''<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="9" r="4" stroke="#ae9cdc" stroke-width="1.4"/><path d="M6 24c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#ae9cdc" stroke-width="1.4" stroke-linecap="round"/></svg>'''

    new_rec = f'''<div class="rec-grid">
      <div class="rec-card">
        <div class="rec-icon">{svg_rocket}</div>
        <div class="rec-title en-only">Scale Your Top Campaign</div>
        <div class="rec-title zh-only">擴大您的頂尖推廣活動</div>
        <div class="rec-body en-only">Your best-performing campaign this month showed strong ROI. We recommend increasing influencer count by 2–3 certified creators next month to sustain momentum.</div>
        <div class="rec-body zh-only">本月表現最佳的推廣活動顯示強勁回報。建議下月增加2至3位認證創作者以維持增長勢頭。</div>
      </div>
      <div class="rec-card">
        <div class="rec-icon">{svg_leaf}</div>
        <div class="rec-title en-only">Expand Your Hero SKU</div>
        <div class="rec-title zh-only">擴大您的明星產品</div>
        <div class="rec-body en-only">Your top-selling SKU continues to outperform. Consider introducing a complementary bundle or limited edition variant to increase average order value.</div>
        <div class="rec-body zh-only">您的最暢銷SKU持續表現突出。考慮推出配套套裝或限量版本以提升平均客單價。</div>
      </div>
      <div class="rec-card">
        <div class="rec-icon">{svg_person}</div>
        <div class="rec-title en-only">Grow Your Creator Network</div>
        <div class="rec-title zh-only">擴大您的創作者網絡</div>
        <div class="rec-body en-only">Brands with 5+ active certified creators on SIMPLEX-ITY see 2.4x higher GMV. Your account manager can help identify the right creators for your category.</div>
        <div class="rec-body zh-only">在SIMPLEX-ITY擁有5位以上活躍認證創作者的品牌GMV高出2.4倍。您的客戶經理可協助找到適合您品類的創作者。</div>
      </div>
    </div>\n</div>\n</div>\n\n<!-- ══'''
    content = content[:old_rec_cards.start()] + new_rec + content[old_rec_cards.end()-4:]
    print("Recommendations updated to brand-facing ✅")
else:
    print("⚠️ Rec grid not found")

with open('/app/simplex_ity_brand_report_EXTERNAL_ESSENTIAL.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("\nAll fixes applied!")
print("File size:", len(content))
