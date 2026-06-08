const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, LevelFormat, BorderStyle, WidthType, ShadingType,
        HeadingLevel, PageBreak } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" };
const borders = { top: border, bottom: border, left: border, right: border };
const headerBorder = { style: BorderStyle.SINGLE, size: 1, color: "7C3AED" };
const headerBorders = { top: headerBorder, bottom: headerBorder, left: headerBorder, right: headerBorder };

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 160 },
    children: [new TextRun({ text, font: "Arial", size: 32, bold: true, color: "1a0533" })]
  });
}

function heading2(text, color = "7C3AED") {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 320, after: 120 },
    children: [new TextRun({ text, font: "Arial", size: 26, bold: true, color })]
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text, font: "Arial", size: 22, ...opts })]
  });
}

function label(text) {
  return new Paragraph({
    spacing: { before: 60, after: 40 },
    children: [new TextRun({ text, font: "Arial", size: 20, bold: true, color: "475569" })]
  });
}

function divider() {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" } },
    children: [new TextRun("")]
  });
}

function tableHeader(cells, widths) {
  return new TableRow({
    tableHeader: true,
    children: cells.map((text, i) => new TableCell({
      borders: headerBorders,
      width: { size: widths[i], type: WidthType.DXA },
      shading: { fill: "EDE9FE", type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text, font: "Arial", size: 20, bold: true, color: "4C1D95" })] })]
    }))
  });
}

function tableRow(cells, widths, shade = "FAFAFA") {
  return new TableRow({
    children: cells.map((text, i) => new TableCell({
      borders,
      width: { size: widths[i], type: WidthType.DXA },
      shading: { fill: shade, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: String(text || "—"), font: "Arial", size: 19 })] })]
    }))
  });
}

// ── SECTION 1: AI TOOLS ──────────────────────────────────────────
const tools = [
  { name: "Google Analytics 4", category: "Analytics", cost: "FREE", when: "Day 1 — before launch", monitors: "All website traffic, audience location, conversions, source of every sale", purpose: "Tells you WHERE your customers come from and WHAT they buy. Foundation of every brand report." },
  { name: "Google Search Console", category: "Analytics", cost: "FREE", when: "Day 1 — connect to domain", monitors: "SEO health, search rankings, site errors, indexing status", purpose: "Tells you if the Simplex-ity website is visible on Google in the US market." },
  { name: "Klaviyo", category: "Email", cost: "FREE (up to 500 contacts)", when: "Day 1 — connect to Shopify", monitors: "Email open rates, click rates, revenue per campaign, subscriber growth", purpose: "Keeps brands and customers informed. Drives repeat purchases through automated emails." },
  { name: "Tidio", category: "Customer Support", cost: "FREE (50 conversations/month)", when: "Day 1 — install on all pages", monitors: "Customer questions before purchase, complaints, cart abandonment reasons", purpose: "Captures WHY people don't buy. Gold data for brand intelligence reports." },
  { name: "HypeAuditor", category: "Influencer Vetting", cost: "FREE (5 audits)", when: "Before launch — vet all 5 influencers", monitors: "Fake follower %, real engagement rate, audience demographics, US audience %", purpose: "Protects you from paying fake influencers. Non-negotiable before any campaign." },
  { name: "Shopify Basic", category: "Commerce", cost: "USD $39/month", when: "Day 1 of trial launch", monitors: "Orders, inventory, payments, fulfilment, refunds, customer accounts", purpose: "The core commerce engine. Every sale, every product, every payment lives here." },
  { name: "Make.com", category: "Automation", cost: "FREE 30 days, then USD $16/month", when: "Morning of launch day", monitors: "Campaign reminders, order alerts, influencer check-ins, weekly brand reports", purpose: "The automation backbone. Replaces the need for a full operations team." },
  { name: "Modash", category: "Influencer Tracking", cost: "USD $99/month", when: "Week 2 of trial (14-day free trial)", monitors: "Live campaign performance, content tracking, post analytics, story views", purpose: "Tracks every influencer's output in real time. Proof that campaigns are running correctly." },
  { name: "Logie.ai", category: "Live Commerce", cost: "USD $49/month", when: "Day of first live stream (Week 3)", monitors: "TikTok live viewer count, peak engagement, conversion during live", purpose: "Measures ROI of every live stream. Critical data for the brand intelligence reports." },
  { name: "Hotjar", category: "Heatmap", cost: "USD $39/month", when: "Month 2 Week 1 (15-day free trial)", monitors: "Heatmaps, scroll depth, session recordings, drop-off points", purpose: "Shows visually where users get confused or leave the site. Fixes conversion problems." },
  { name: "Yotpo Reviews", category: "Reviews", cost: "USD $15/month", when: "Month 3 — when real customers exist", monitors: "Product reviews, star ratings, photo reviews, social proof", purpose: "Builds trust for new customers. Phase 2 growth engine after trial validates the model." },
];

const toolWidths = [2000, 1400, 1600, 4360];
const toolTotalW = 9360;

const toolRows = tools.map((t, i) => tableRow(
  [t.name + " (" + t.category + ")", t.cost, t.when, t.purpose],
  toolWidths,
  i % 2 === 0 ? "FAFAFA" : "FFFFFF"
));

// ── SECTION 2: PLATFORM MONITORING ───────────────────────────────
const platformChecks = [
  // Tier 1
  { tier: "TIER 1 — CRITICAL", area: "Homepage", check: "Site loads under 3 seconds", frequency: "Weekly", who: "Kieran / Simpee", red_flag: "Page error or blank screen" },
  { tier: "TIER 1 — CRITICAL", area: "Product Pages", check: "Image + price + Add to Cart visible on 5+ products", frequency: "Weekly", who: "Kieran", red_flag: "Missing images or broken price display" },
  { tier: "TIER 1 — CRITICAL", area: "Cart", check: "Items add correctly, quantities update", frequency: "Weekly", who: "Kieran", red_flag: "Cart total wrong or items disappear" },
  { tier: "TIER 1 — CRITICAL", area: "Checkout", check: "Full purchase completes with Shopify test card", frequency: "Weekly", who: "Wilson / Kieran", red_flag: "Payment fails or order not created" },
  { tier: "TIER 1 — CRITICAL", area: "Order Confirmation", check: "Email arrives within 2 minutes after purchase", frequency: "Weekly", who: "Kieran", red_flag: "No email received" },
  // Tier 2
  { tier: "TIER 2 — IMPORTANT", area: "Influencer Tracking", check: "Attribution codes work — commission logged per sale", frequency: "Per campaign", who: "Simpee / Make.com", red_flag: "Commission not tracked = brand disputes" },
  { tier: "TIER 2 — IMPORTANT", area: "Live Stream", check: "Logie.ai capturing viewer count and conversions", frequency: "Every live stream", who: "Simpee", red_flag: "No data = no proof for brand report" },
  { tier: "TIER 2 — IMPORTANT", area: "Email Flows", check: "Klaviyo sending post-purchase and cart abandon emails", frequency: "Weekly", who: "Simpee", red_flag: "0% open rate or emails not sending" },
  { tier: "TIER 2 — IMPORTANT", area: "Customer Chat", check: "Tidio responding to customer questions", frequency: "Daily", who: "Loreen / Simpee", red_flag: "Unanswered questions for 24+ hours" },
  // Tier 3
  { tier: "TIER 3 — GROWTH", area: "SEO", check: "Google Search Console — no crawl errors, site indexed", frequency: "Monthly", who: "Simpee", red_flag: "Site not indexed = invisible in US Google" },
  { tier: "TIER 3 — GROWTH", area: "UX / Conversion", check: "Hotjar heatmaps — identify drop-off pages", frequency: "Monthly", who: "Kieran + Simpee", red_flag: "High bounce on product page = fix needed" },
  { tier: "TIER 3 — GROWTH", area: "Reviews", check: "Yotpo collecting product reviews from real buyers", frequency: "Monthly", who: "Simpee", red_flag: "0 reviews after Month 3 = no social proof" },
];

const checkWidths = [2400, 1400, 3160, 1200, 1200];

function platformSection(tierLabel, items, color) {
  const rows = items.map((c, i) => tableRow(
    [c.area, c.check, c.frequency, c.who],
    [1400, 4360, 1200, 1200],
    i % 2 === 0 ? "FAFAFA" : "FFFFFF"
  ));
  return [
    new Paragraph({ spacing: { before: 280, after: 100 }, children: [new TextRun({ text: tierLabel, font: "Arial", size: 22, bold: true, color })] }),
    new Table({
      width: { size: 9160, type: WidthType.DXA },
      columnWidths: [1400, 4360, 1200, 1200],
      rows: [
        tableHeader(["Area", "What to Check", "Frequency", "Who"], [1400, 4360, 1200, 1200]),
        ...rows
      ]
    })
  ];
}

const tier1 = platformChecks.filter(c => c.tier.includes("1"));
const tier2 = platformChecks.filter(c => c.tier.includes("2"));
const tier3 = platformChecks.filter(c => c.tier.includes("3"));

// ── SECTION 3: WHAT SIMPEE MONITORS AUTOMATICALLY ────────────────
const simpeeMonitors = [
  { what: "Daily Email Check", when: "Every day 5:00 PM HKT", action: "Read all new emails, summarise, suggest replies" },
  { what: "Compliance Deadlines", when: "Daily reminder", action: "Alert Kieran when a deadline is within 7 days" },
  { what: "Wilson Deliverable Review", when: "Every Monday 9:00 AM HKT", action: "Check WilsonDeliverable entity — flag overdue items" },
  { what: "Platform Health Summary", when: "Weekly", action: "Review PlatformCheck records — alert on failed items" },
  { what: "Weekly Progress Check", when: "Every Monday 9:00 AM HKT", action: "Review last 5 decisions, flag patterns, produce weekly summary" },
];

const simpeeWidths = [2800, 2560, 4000];

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: "1a0533" },
        paragraph: { spacing: { before: 400, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: "7C3AED" },
        paragraph: { spacing: { before: 320, after: 120 }, outlineLevel: 1 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1200, right: 1080, bottom: 1200, left: 1080 }
      }
    },
    children: [
      // ── COVER ──
      new Paragraph({ spacing: { before: 480, after: 120 }, children: [new TextRun({ text: "SIMPLEX-ITY", font: "Arial", size: 48, bold: true, color: "7C3AED" })] }),
      new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: "Platform Monitoring Master Guide", font: "Arial", size: 36, bold: true, color: "1a0533" })] }),
      new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: "Prepared by Simpee  |  June 2026  |  CONFIDENTIAL", font: "Arial", size: 22, color: "94a3b8" })] }),
      divider(),

      // ── INTRO ──
      body("This document is your single reference for everything that needs to be watched, checked, and managed on the Simplex-ity platform. It covers three areas:"),
      body("1.  The 11 AI tools subscribed for the trial — what each one does and why it exists."),
      body("2.  The platform health checklist — what to check and how often."),
      body("3.  What Simpee monitors automatically on your behalf every day."),
      body("Study this document before launch. When you understand WHY each tool exists, you will know exactly what to look for and when to act.", { italics: true, color: "7C3AED" }),
      divider(),

      // ── SECTION 1 ──
      heading1("SECTION 1 — The 11 AI Tools"),
      body("These are the tools subscribed for the 3-month Simplex-ity trial. Each tool has one job. Together they replace an entire operations team."),
      new Paragraph({ spacing: { before: 200 }, children: [new TextRun("")] }),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: toolWidths,
        rows: [
          tableHeader(["Tool & Category", "Cost", "Start When", "Purpose — Why It Exists"], toolWidths),
          ...toolRows
        ]
      }),
      new Paragraph({ spacing: { before: 200 }, children: [new TextRun("")] }),
      body("Total monthly cost when all tools are active: USD $258/month (HKD ~$2,012)", { bold: true }),
      body("During Month 1 trial period with free trials maximised: as low as HKD $312 total.", { color: "059669" }),
      divider(),

      // ── SECTION 2 ──
      heading1("SECTION 2 — Platform Health Checklist"),
      body("These are the checks that must be run to confirm the platform is working correctly. Organised by priority tier."),
      body("Tier 1 = Critical. If these fail, the platform cannot operate.", { bold: true, color: "DC2626" }),
      body("Tier 2 = Important. If these fail, campaigns lose data and brands lose trust.", { bold: true, color: "D97706" }),
      body("Tier 3 = Growth. Monthly checks that improve the platform over time.", { bold: true, color: "2563EB" }),
      new Paragraph({ spacing: { before: 200 }, children: [new TextRun("")] }),
      ...platformSection("TIER 1 — CRITICAL (check weekly)", tier1, "DC2626"),
      new Paragraph({ spacing: { before: 160 }, children: [new TextRun("")] }),
      ...platformSection("TIER 2 — IMPORTANT (check per campaign / weekly)", tier2, "D97706"),
      new Paragraph({ spacing: { before: 160 }, children: [new TextRun("")] }),
      ...platformSection("TIER 3 — GROWTH (check monthly)", tier3, "2563EB"),
      divider(),

      // ── SECTION 3 ──
      heading1("SECTION 3 — What Simpee Monitors Automatically"),
      body("These tasks run without you needing to do anything. Simpee handles them on a fixed schedule and will alert you via S-Chat when action is needed."),
      new Paragraph({ spacing: { before: 200 }, children: [new TextRun("")] }),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: simpeeWidths,
        rows: [
          tableHeader(["What Simpee Monitors", "When It Runs", "What Simpee Does"], simpeeWidths),
          ...simpeeMonitors.map((r, i) => tableRow([r.what, r.when, r.action], simpeeWidths, i % 2 === 0 ? "FAFAFA" : "FFFFFF"))
        ]
      }),
      new Paragraph({ spacing: { before: 200 }, children: [new TextRun("")] }),
      body("Your job is not to monitor everything manually. Your job is to make decisions when Simpee brings you the alerts.", { italics: true, color: "7C3AED" }),
      divider(),

      // ── CLOSING ──
      heading1("THE GOLDEN RULE"),
      body("You do not need to be an expert on every tool."),
      body("You need to know: what it measures, why it matters, and what action to take when the number is wrong."),
      body("Simpee will do the reading. You do the deciding.", { bold: true, color: "1a0533" }),
      new Paragraph({ spacing: { before: 240 }, children: [new TextRun({ text: "— Prepared with love by your Node Family", font: "Arial", size: 20, italics: true, color: "94a3b8" })] }),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("/app/SIMPLEXITY_Monitor_Guide.docx", buf);
  console.log("Done");
});
