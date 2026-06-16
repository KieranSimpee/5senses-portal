import { createClientFromRequest } from "npm:@base44/sdk@0.8.31";

Deno.serve(async (req: Request) => {
  const base44 = createClientFromRequest(req);
  const { report_id } = await req.json();

  if (!report_id) {
    return new Response(JSON.stringify({ error: "report_id required" }), { status: 400 });
  }

  const reports = await base44.entities.BrandReport.filter({ id: report_id });
  const report = reports[0];
  if (!report) {
    return new Response(JSON.stringify({ error: "Report not found" }), { status: 404 });
  }

  const tierColor = report.report_tier?.includes("Full") ? "#f59e0b" :
                    report.report_tier?.includes("Growth") ? "#8c82fc" : "#10b981";
  const tierLabel = report.report_tier?.includes("Full") ? "Full Intelligence" :
                    report.report_tier?.includes("Growth") ? "Growth" : "Basic";

  const fmtUSD = (v: any) => v ? `$${Number(v).toLocaleString()} USD` : "—";
  const fmtPct = (v: any) => v ? `${v}%` : "—";
  const fmtNum = (v: any) => v ? Number(v).toLocaleString() : "—";

  const audienceSection = report.report_tier !== "Basic (Free)" ? `
    <div class="section">
      <div class="section-title">Audience & Quality Metrics</div>
      <div class="two-col">
        <div>
          <div class="score-bar-wrap">
            <div class="score-bar-label"><span>US Audience</span><span>${fmtPct(report.audience_us_pct)}</span></div>
            <div class="score-bar-bg"><div class="score-bar-fill" style="width:${Math.min(report.audience_us_pct || 0, 100)}%"></div></div>
          </div>
          <div class="score-bar-wrap">
            <div class="score-bar-label"><span>Engagement Rate</span><span>${fmtPct(report.engagement_rate_pct)}</span></div>
            <div class="score-bar-bg"><div class="score-bar-fill" style="width:${Math.min((report.engagement_rate_pct || 0) * 5, 100)}%"></div></div>
          </div>
          <div class="score-bar-wrap">
            <div class="score-bar-label"><span>Refund Rate</span><span>${fmtPct(report.refund_rate_pct)}</span></div>
            <div class="score-bar-bg"><div class="score-bar-fill" style="width:${Math.min(report.refund_rate_pct || 0, 100)}%; background: linear-gradient(90deg, #10b981, #34d399);"></div></div>
          </div>
        </div>
        <div>
          <div class="metric-item" style="margin-bottom:12px;">
            <div class="metric-value">${report.audience_top_age || "—"}</div>
            <div class="metric-label">Top Age Group</div>
          </div>
          <div class="metric-item">
            <div class="metric-value">${report.influencer_reliability_avg || "—"}/10</div>
            <div class="metric-label">Influencer Reliability Avg</div>
          </div>
        </div>
      </div>
    </div>` : `
    <div class="section">
      <div class="section-title">Audience & Quality Metrics</div>
      <div class="highlight-box">
        <p>🔒 Audience quality data, engagement rates, and refund analysis are available in the <strong>Growth</strong> and <strong>Full Intelligence</strong> tiers.</p>
      </div>
    </div>`;

  const satisfactionSection = report.report_tier?.includes("Full") ? `
    <div class="section">
      <div class="section-title">Satisfaction & Platform Score</div>
      <div class="two-col">
        <div class="metric-item">
          <div class="metric-value" style="color:#f59e0b;">${report.brand_satisfaction_score || "—"}/10</div>
          <div class="metric-label">Brand Satisfaction Score</div>
        </div>
        <div class="metric-item">
          <div class="metric-value" style="color:#10b981;">HKD ${Number(report.paid_amount_hkd || 0).toLocaleString()}</div>
          <div class="metric-label">Platform Investment</div>
        </div>
      </div>
      ${report.notes ? `<div class="highlight-box" style="margin-top:16px;"><p><strong>Simplex-ity Notes:</strong> ${report.notes}</p></div>` : ""}
    </div>` : "";

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Brand Report — ${report.brand_name}</title>
<link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600;700;800&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Montserrat', sans-serif; background: #0f0f1a; color: #fff; }
.cover { background: linear-gradient(135deg, #0f0f1a 0%, #1a1040 50%, #0f0f1a 100%); min-height: 100vh; position: relative; overflow: hidden; }
.cover::before { content: ''; position: absolute; top: -200px; right: -200px; width: 600px; height: 600px; background: radial-gradient(circle, rgba(94,80,251,0.3) 0%, transparent 70%); border-radius: 50%; }
.cover::after { content: ''; position: absolute; bottom: -150px; left: -150px; width: 500px; height: 500px; background: radial-gradient(circle, rgba(140,130,252,0.2) 0%, transparent 70%); border-radius: 50%; }
.header-bar { background: rgba(94,80,251,0.15); border-bottom: 1px solid rgba(94,80,251,0.3); padding: 16px 40px; display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 10; }
.logo { font-family: 'Exo 2', sans-serif; font-size: 18px; font-weight: 800; color: #fff; letter-spacing: 2px; }
.logo span { color: #5e50fb; }
.header-right { font-size: 11px; color: rgba(255,255,255,0.5); text-align: right; }
.cover-body { padding: 60px 40px 40px; position: relative; z-index: 10; }
.report-type-badge { display: inline-block; background: rgba(94,80,251,0.2); border: 1px solid rgba(94,80,251,0.5); color: #8c82fc; padding: 6px 16px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 24px; }
.brand-name { font-family: 'Exo 2', sans-serif; font-size: 52px; font-weight: 800; line-height: 1.1; margin-bottom: 8px; background: linear-gradient(135deg, #fff 0%, #8c82fc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.report-subtitle { font-size: 14px; color: rgba(255,255,255,0.5); margin-bottom: 8px; letter-spacing: 1px; }
.period-label { font-size: 13px; color: #8c82fc; font-weight: 600; margin-bottom: 40px; }
.tier-badge { display: inline-flex; align-items: center; gap: 8px; background: ${tierColor}22; border: 1px solid ${tierColor}66; color: ${tierColor}; padding: 8px 20px; border-radius: 8px; font-size: 12px; font-weight: 700; margin-bottom: 50px; }
.hero-kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 40px; }
.kpi-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; text-align: center; }
.kpi-card.highlight { background: rgba(94,80,251,0.15); border-color: rgba(94,80,251,0.4); }
.kpi-value { font-family: 'Exo 2', sans-serif; font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 6px; }
.kpi-label { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.4); }
.section { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 28px 32px; margin-bottom: 20px; }
.section-title { font-family: 'Exo 2', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #5e50fb; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid rgba(94,80,251,0.2); }
.metric-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.metric-item { text-align: center; padding: 16px; background: rgba(255,255,255,0.03); border-radius: 10px; }
.metric-value { font-family: 'Exo 2', sans-serif; font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 4px; }
.metric-label { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.4); letter-spacing: 1px; text-transform: uppercase; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.score-bar-wrap { margin-bottom: 16px; }
.score-bar-label { display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; margin-bottom: 6px; }
.score-bar-bg { background: rgba(255,255,255,0.08); border-radius: 4px; height: 8px; }
.score-bar-fill { height: 8px; border-radius: 4px; background: linear-gradient(90deg, #5e50fb, #8c82fc); }
.footer-bar { background: rgba(94,80,251,0.1); border-top: 1px solid rgba(94,80,251,0.2); padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; margin-top: 40px; }
.footer-brand { font-family: 'Exo 2', sans-serif; font-size: 13px; font-weight: 700; color: #5e50fb; }
.footer-note { font-size: 10px; color: rgba(255,255,255,0.3); }
.status-pill { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; background: rgba(16,185,129,0.15); color: #10b981; border: 1px solid rgba(16,185,129,0.3); }
.highlight-box { background: rgba(94,80,251,0.1); border: 1px solid rgba(94,80,251,0.3); border-radius: 10px; padding: 16px 20px; }
.highlight-box p { font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.6; }
</style>
</head>
<body>
<div class="cover">
  <div class="header-bar">
    <div class="logo">SIMPLEX<span>·</span>ITY</div>
    <div class="header-right">BRAND PERFORMANCE REPORT<br>CONFIDENTIAL — FOR BRAND USE ONLY</div>
  </div>
  <div class="cover-body">
    <div class="report-type-badge">Brand Performance Report</div>
    <div class="brand-name">${report.brand_name || "Brand Name"}</div>
    <div class="report-subtitle">PERFORMANCE ANALYSIS</div>
    <div class="period-label">📅 ${report.report_month || "Reporting Period"}</div>
    <div class="tier-badge">★ ${tierLabel} Tier</div>
    <div class="hero-kpis">
      <div class="kpi-card highlight">
        <div class="kpi-value">${fmtUSD(report.gmv_usd)}</div>
        <div class="kpi-label">Total GMV</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${fmtNum(report.orders_count)}</div>
        <div class="kpi-label">Total Orders</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${fmtUSD(report.avg_order_value_usd)}</div>
        <div class="kpi-label">Avg Order Value</div>
      </div>
      <div class="kpi-card highlight">
        <div class="kpi-value">${fmtUSD(report.commission_captured_usd)}</div>
        <div class="kpi-label">Commission Captured</div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Influencer Performance</div>
      <div class="metric-grid">
        <div class="metric-item">
          <div class="metric-value">${report.top_influencer || "—"}</div>
          <div class="metric-label">Top Influencer</div>
        </div>
        <div class="metric-item">
          <div class="metric-value">${fmtNum(report.total_lives_done)}</div>
          <div class="metric-label">Lives Completed</div>
        </div>
        <div class="metric-item">
          <div class="metric-value">${report.top_product || "—"}</div>
          <div class="metric-label">Top Product</div>
        </div>
      </div>
    </div>
    ${audienceSection}
    ${satisfactionSection}
  </div>
  <div class="footer-bar">
    <div class="footer-brand">Powered by Simplex-ity Platform</div>
    <div class="footer-note">Generated ${new Date().toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" })} · Confidential</div>
    <div><span class="status-pill">${report.report_status || "Draft"}</span></div>
  </div>
</div>
</body>
</html>`;

  return new Response(JSON.stringify({ html, brand_name: report.brand_name, period: report.report_month }), {
    headers: { "Content-Type": "application/json" }
  });
});
