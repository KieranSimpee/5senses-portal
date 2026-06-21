with open('/app/simplex_ity_brand_report.html', 'r', encoding='utf-8') as f:
    content = f.read()

# ── STEP 1: Remove internal banner ──
content = content.replace('''<div class="internal-report-banner">
  <span class="internal-banner-dot"></span>
  INTERNAL REPORT — CONFIDENTIAL — NOT FOR EXTERNAL DISTRIBUTION
  <span class="internal-banner-dot"></span>
</div>
''', '')

# Remove padding-top added for banner
content = content.replace(
    'body {\n    margin: 0;\n    padding-top: 34px;',
    'body {\n    margin: 0;'
)

# Remove internal-report-banner CSS
import re
content = re.sub(r'/\* ── INTERNAL REPORT BANNER ── \*/.*?\.internal-banner-dot \{.*?\}', 
                 '', content, flags=re.DOTALL)

# ── STEP 2: Remove cover confidential line ──
content = content.replace(
    '''<div style="margin-top:30px; font-family:'Montserrat',sans-serif; font-size:8px; letter-spacing:3px; color:rgba(255,255,255,0.35); text-transform:uppercase; text-align:center;">
    Internal Use Only · Confidential · Not For Distribution
  </div>''', '')

# ── STEP 3: Remove Internal Use Only badge from Executive Summary ──
content = content.replace(
    '''      <div class="internal-badge">
        <div class="internal-badge-dot"></div>
        <span class="internal-badge-text">Internal Use Only</span>
      </div>
      ''', '')

# ── STEP 4: Replace cover subtitle ──
content = content.replace(
    '<div class="cover-sub en-only">Monthly Brand Performance Report</div>',
    '<div class="cover-sub en-only">Essential Member Report</div>'
)
content = content.replace(
    '<div class="cover-sub zh-only">月度品牌表現報告</div>',
    '<div class="cover-sub zh-only">基礎會員報告</div>'
)

# ── STEP 5: Add ESSENTIAL tier badge on cover ──
essential_badge = '''
  <div style="margin-top:24px; display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.3); border-radius:30px; padding:7px 20px;">
    <div style="width:8px;height:8px;border-radius:50%;background:#a8e6cf;flex-shrink:0;"></div>
    <span style="font-family:'Montserrat',sans-serif;font-size:9px;letter-spacing:3px;color:rgba(255,255,255,0.9);text-transform:uppercase;font-weight:600;">Essential Tier · Member Report</span>
  </div>
'''

# Insert after cover-meta block
content = content.replace(
    '''</div>

  
</div>

<!-- ══════════════════════════ EXECUTIVE SUMMARY''',
    essential_badge + '''</div>

  
</div>

<!-- ══════════════════════════ EXECUTIVE SUMMARY'''
)

# ── STEP 6: Replace Executive Summary heading to be brand-facing ──
content = content.replace(
    '<div class="exec-heading en-only">A strong month for Asian beauty. Skincare led, new brands emerged.</div>',
    '<div class="exec-heading en-only">Your brand performance this month — highlights and key insights.</div>'
)
content = content.replace(
    '<div class="exec-heading zh-only">亞洲美妝的強勁月份。護膚品領先，新品牌嶄露頭角。</div>',
    '<div class="exec-heading zh-only">您品牌本月表現 — 亮點與關鍵洞察。</div>'
)

# ── STEP 7: Update exec body copy to be brand-facing ──
content = content.replace(
    '<div class="exec-body en-only">June 2026 marks a breakthrough quarter for SIMPLEX-ITY. Total platform GMV reached $284,500 USD',
    '<div class="exec-body en-only">Welcome to your SIMPLEX-ITY Essential Member Report. This report covers your brand\'s performance'
)
content = content.replace(
    '<div class="exec-body zh-only">',
    '<div class="exec-body zh-only" style="display:none">'
)

# ── STEP 8: Remove sections that are NOT in Essential tier ──
# Essential = Cover + KPI Strip + Brand Performance + Best Sellers (top 3 only) + Simple Recommendations
# Remove: Price Point detail, Customer Insights detail, Trends detail (keep but simplified)
# For now keep structure but add "upgrade" teaser on restricted sections

# Add upgrade teaser CSS
upgrade_css = """
  /* ── UPGRADE TEASER ── */
  .upgrade-teaser {
    background: linear-gradient(135deg, rgba(174,156,220,0.08), rgba(94,80,251,0.05));
    border: 1px dashed rgba(174,156,220,0.3);
    border-radius: 12px;
    padding: 40px 30px;
    text-align: center;
    margin: 20px 0;
  }
  .upgrade-icon {
    margin-bottom: 12px;
  }
  .upgrade-title {
    font-family: 'Exo 2', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #ae9cdc;
    margin-bottom: 8px;
    letter-spacing: 1px;
  }
  .upgrade-body {
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    color: rgba(26,26,31,0.5);
    line-height: 1.7;
    margin-bottom: 16px;
  }
  .upgrade-btn {
    display: inline-block;
    background: #ae9cdc;
    color: white;
    font-family: 'Montserrat', sans-serif;
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: 600;
    padding: 9px 22px;
    border-radius: 20px;
    text-decoration: none;
  }

"""
content = content.replace('  /* ── INTERNAL ONLY BADGE ── */', upgrade_css + '  /* ── INTERNAL ONLY BADGE ── */')

# Lock the Customer Insights section for Essential tier
lock_svg = '''<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="10" width="12" height="9" rx="2" stroke="#ae9cdc" stroke-width="1.3"/><path d="M8 10V7a3 3 0 0 1 6 0v3" stroke="#ae9cdc" stroke-width="1.3" stroke-linecap="round"/></svg>'''

upgrade_block_en = f'''<div class="upgrade-teaser">
  <div class="upgrade-icon">{lock_svg}</div>
  <div class="upgrade-title en-only">Available on Professional & Enterprise</div>
  <div class="upgrade-title zh-only" style="display:none">專業版及企業版專屬</div>
  <div class="upgrade-body en-only">Detailed audience demographics, purchase behaviour patterns, and age/region breakdowns are available on Professional and Enterprise tiers.</div>
  <div class="upgrade-body zh-only" style="display:none">詳細受眾分析、購買行為模式及年齡/地區細分數據於專業版及企業版提供。</div>
  <a class="upgrade-btn" href="#">Upgrade Membership →</a>
</div>'''

upgrade_block_trends = f'''<div class="upgrade-teaser">
  <div class="upgrade-icon">{lock_svg}</div>
  <div class="upgrade-title en-only">Trend Analysis — Professional & Above</div>
  <div class="upgrade-title zh-only" style="display:none">趨勢分析 — 專業版及以上</div>
  <div class="upgrade-body en-only">Monthly trend tracking, competitor benchmarking, and category growth forecasts are included in Professional and Enterprise reports.</div>
  <div class="upgrade-body zh-only" style="display:none">月度趨勢追蹤、競品對比及品類增長預測於專業版及企業版報告提供。</div>
  <a class="upgrade-btn" href="#">Upgrade Membership →</a>
</div>'''

# Replace Customer Insights grid with upgrade teaser
insight_start = content.find('<div class="insight-grid">')
insight_end = content.find('</div>', content.find('</div>', insight_start) + 1)
# Find the full insight-grid block
insight_full_end = content.find('</div>\n\n\n</div>', insight_start)
if insight_full_end < 0:
    insight_full_end = content.find('\n\n<!-- ══', insight_start)

if insight_start > 0 and insight_full_end > 0:
    insight_block = content[insight_start:insight_full_end]
    content = content.replace(insight_block, upgrade_block_en + '\n')
    print("Customer Insights locked ✅")
else:
    print(f"Insight grid: start={insight_start}, end={insight_full_end}")

# Replace Trends grid with upgrade teaser
trends_start = content.find('<div class="trends-grid">')
trends_full_end = content.find('\n\n<!-- ══', trends_start)
if trends_start > 0 and trends_full_end > 0:
    trends_block = content[trends_start:trends_full_end]
    content = content.replace(trends_block, upgrade_block_trends + '\n')
    print("Trends locked ✅")
else:
    print(f"Trends grid: start={trends_start}, end={trends_full_end}")

# ── STEP 9: Update footer to say Essential ──
content = content.replace(
    'SIMPLEX-ITY Intelligence System is prepared for internal brand partner use',
    'This SIMPLEX-ITY Essential Member Report is prepared exclusively for your brand'
)
content = content.replace(
    'SIMPLEX-ITY智能系統為內部品牌合作夥伴使用而準備',
    '此SIMPLEX-ITY基礎會員報告為您的品牌專屬準備'
)

with open('/app/simplex_ity_brand_report_EXTERNAL_ESSENTIAL.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("\nExternal Essential report built!")
print("File size:", len(content))

