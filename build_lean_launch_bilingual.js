const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, LevelFormat, BorderStyle, WidthType, ShadingType,
        HeadingLevel, PageBreak } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" };
const borders = { top: border, bottom: border, left: border, right: border };
const purpleBorder = { style: BorderStyle.SINGLE, size: 1, color: "7C3AED" };
const purpleBorders = { top: purpleBorder, bottom: purpleBorder, left: purpleBorder, right: purpleBorder };

function h1(text) {
  return new Paragraph({
    spacing: { before: 440, after: 160 },
    children: [new TextRun({ text, font: "Arial", size: 34, bold: true, color: "1a0533" })]
  });
}
function h2(text, color = "7C3AED") {
  return new Paragraph({
    spacing: { before: 300, after: 120 },
    children: [new TextRun({ text, font: "Arial", size: 27, bold: true, color })]
  });
}
function body(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text, font: "Arial", size: 22, ...opts })]
  });
}
function gap(size = 160) {
  return new Paragraph({ spacing: { before: size }, children: [new TextRun("")] });
}
function divider() {
  return new Paragraph({
    spacing: { before: 240, after: 240 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" } },
    children: [new TextRun("")]
  });
}
function sectionBanner(en, zh, color = "EDE9FE", textColor = "4C1D95") {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({ children: [new TableCell({
      borders: purpleBorders,
      width: { size: 9360, type: WidthType.DXA },
      shading: { fill: color, type: ShadingType.CLEAR },
      margins: { top: 140, bottom: 140, left: 200, right: 200 },
      children: [
        new Paragraph({ children: [new TextRun({ text: en, font: "Arial", size: 28, bold: true, color: textColor })] }),
        new Paragraph({ children: [new TextRun({ text: zh, font: "Arial", size: 24, bold: true, color: textColor })] }),
      ]
    })]})],
  });
}
function twoColRow(en, zh, enW = 4680, zhW = 4680, shade = "FAFAFA") {
  return new TableRow({ children: [
    new TableCell({ borders, width: { size: enW, type: WidthType.DXA }, shading: { fill: shade, type: ShadingType.CLEAR }, margins: { top: 90, bottom: 90, left: 140, right: 80 },
      children: [new Paragraph({ children: [new TextRun({ text: en, font: "Arial", size: 20 })] })] }),
    new TableCell({ borders, width: { size: zhW, type: WidthType.DXA }, shading: { fill: shade, type: ShadingType.CLEAR }, margins: { top: 90, bottom: 90, left: 80, right: 140 },
      children: [new Paragraph({ children: [new TextRun({ text: zh, font: "Arial", size: 20 })] })] }),
  ]});
}
function twoColHeader(en, zh, enW = 4680, zhW = 4680) {
  return new TableRow({ tableHeader: true, children: [
    new TableCell({ borders: purpleBorders, width: { size: enW, type: WidthType.DXA }, shading: { fill: "EDE9FE", type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 140, right: 80 },
      children: [new Paragraph({ children: [new TextRun({ text: en, font: "Arial", size: 21, bold: true, color: "4C1D95" })] })] }),
    new TableCell({ borders: purpleBorders, width: { size: zhW, type: WidthType.DXA }, shading: { fill: "EDE9FE", type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 80, right: 140 },
      children: [new Paragraph({ children: [new TextRun({ text: zh, font: "Arial", size: 21, bold: true, color: "4C1D95" })] })] }),
  ]});
}

function biTable(rows) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [4680, 4680],
    rows
  });
}

// ─── DATA ────────────────────────────────────────────────────────
const costRows = [
  ["Wilson (Fractional CPO)", "Wilson（兼職CPO）", "HKD $35,000 / month", "HKD $35,000 / 月", "HKD $105,000"],
  ["Loreen (Ground Operations)", "Loreen（地面運營）", "HKD $12,000 / month", "HKD $12,000 / 月", "HKD $36,000"],
  ["AI Tools (all 11)", "AI工具（共11個）", "HKD ~$2,000 / month", "HKD ~$2,000 / 月", "HKD ~$6,000"],
  ["Shopify Basic", "Shopify 基本計劃", "HKD ~$300 / month", "HKD ~$300 / 月", "HKD ~$900"],
  ["Simpee + 5S Portal", "Simpee + 5S Portal", "Already paid", "已付費", "Included"],
];
const onetimeRows = [
  ["Tint AI Setup (Phase 2 — defer)", "Tint AI 設置（Phase 2 推遲）", "USD $10,000", "HKD ~$78,000", "Defer to save cash"],
  ["Legal / BR / Documents", "法律/商業登記/文件", "HKD ~$5,000", "HKD ~$5,000", "Pay upfront"],
  ["Emergency Reserve", "緊急備用金", "HKD ~$30,000", "HKD ~$30,000", "Keep in reserve"],
];
const scenarioRows = [
  ["Month 1 — Soft Launch", "第一個月 — 軟啟動", "3 brands, 5 influencers", "3個品牌，5個網紅", "USD ~$1,350\n(HKD ~$10,500)"],
  ["Month 2 — Build", "第二個月 — 建立期", "10 brands, 20 influencers", "10個品牌，20個網紅", "USD ~$4,500\n(HKD ~$35,100)"],
  ["Month 3 — Break Even Target", "第三個月 — 收支目標", "14 brands, 30 influencers", "14個品牌，30個網紅", "USD ~$6,300\n(HKD ~$49,100)"],
];
const breakEvenRows = [
  ["Monthly fixed costs", "每月固定成本", "HKD $49,300", "HKD $49,300"],
  ["= USD equivalent", "= 美元等值", "USD ~$6,300", "USD ~$6,300"],
  ["Avg brand GMV per month", "每個品牌每月平均GMV", "USD $3,000", "USD $3,000"],
  ["Platform commission rate", "平台佣金比率", "15%", "15%"],
  ["Revenue per brand per month", "每品牌每月收入", "USD $450", "USD $450"],
  ["Brands needed to break even", "收支平衡所需品牌數", "14 brands", "14個品牌"],
  ["Influencers needed (2-3 per brand)", "所需網紅數（每品牌2-3個）", "~30 influencers", "約30個網紅"],
];
const capitalRows = [
  ["Total 3-month outlay", "3個月總支出", "HKD ~$261,000", "HKD ~$261,000"],
  ["Your available capital", "你的可用資金", "HKD $700,000", "HKD $700,000"],
  ["Remaining buffer", "剩餘緩衝資金", "HKD ~$439,000", "HKD ~$439,000"],
  ["Months of runway (zero revenue)", "零收入情況下可運作月數", "~14 months", "約14個月"],
];
const riskRows = [
  ["Wilson monthly fee is largest cost", "Wilson月費是最大成本", "Ensure deliverables are on time every month", "確保每月deliverables準時交付"],
  ["Tint AI USD $10,000 upfront", "Tint AI USD $10,000 前期費用", "Defer to Phase 2 — saves HKD $78,000 in Month 1", "推遲到Phase 2 — 節省HKD $78,000"],
  ["Month 1 will not break even", "第一個月不會收支平衡", "Budget for 2-3 months of losses — this is the investment", "預算2-3個月虧損 — 這就是投資成本"],
  ["Brand recruitment takes time", "品牌招募需要時間", "Loreen to focus 100% on brand outreach from Day 1", "Loreen從第一天起全力投入品牌拓展"],
];
const successRows = [
  ["StartmeUp HK → Success HK", "StartmeUp HK → Success HK（本地支援）", "Apply at Success HK for local startup support", "向 Success HK 申請本地初創支援"],
  ["Government Grant (non-dilutive)", "政府資助（不稀釋股權）", "Up to HKD $100,000 non-repayable grant available", "最高可獲HKD $100,000不還款資助"],
  ["NEST VC (data-driven)", "NEST VC（數據驅動）", "Approach after 3-month trial data is collected", "收集3個月試運行數據後再洽談"],
  ["Self-fund first", "先自資", "Validate with your HKD $700k — no dilution, full control", "用HKD $700k驗證模式 — 不稀釋，全控制"],
];

// ─── DOCUMENT ────────────────────────────────────────────────────
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }
      }
    },
    children: [
      // ── COVER ──
      new Paragraph({ spacing: { before: 320, after: 80 }, children: [new TextRun({ text: "SIMPLEX-ITY", font: "Arial", size: 52, bold: true, color: "7C3AED" })] }),
      new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: "Lean Launch Plan — Self-Funded 3-Month Analysis", font: "Arial", size: 32, bold: true, color: "1a0533" })] }),
      new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: "精益啟動計劃 — 自資3個月分析報告", font: "Arial", size: 28, bold: true, color: "1a0533" })] }),
      new Paragraph({ spacing: { before: 40, after: 60 }, children: [new TextRun({ text: "Prepared by Simpee  |  June 2026  |  For Kieran's Review Tonight  |  CONFIDENTIAL", font: "Arial", size: 20, italics: true, color: "94a3b8" })] }),
      new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: "由 Simpee 整理  |  2026年6月  |  供 Kieran 今晚閱覽  |  機密文件", font: "Arial", size: 20, italics: true, color: "94a3b8" })] }),
      divider(),

      // ── PREMISE ──
      sectionBanner("THE PREMISE", "核心前提"),
      gap(120),
      biTable([
        twoColHeader("English", "中文"),
        twoColRow(
          "You are exploring launching SIMPLEX-ITY using your own HKD $700,000 — without external investors — relying on AI tools for platform operations and the family (Simpee) for monitoring, with Loreen and Wilson as your only ground team.",
          "你正在考慮用自己的HKD $700,000啟動SIMPLEX-ITY，不依賴外部投資者，利用AI工具運營平台，家人（Simpee）負責監測，Loreen和Wilson作為唯一的地面團隊。",
          4680, 4680, "F8F5FF"
        ),
        twoColRow(
          "This is a validation-first approach. The goal of the 3-month trial is not profit. It is proof — proof that the model works, that brands get value, that influencers deliver, and that GMV is real.",
          "這是一個驗證優先的方法。3個月試運行的目標不是盈利，而是證明 — 證明模式有效、品牌獲得價值、網紅能夠交付、GMV是真實的。",
          4680, 4680, "FFFFFF"
        ),
        twoColRow(
          "That proof is what you then take to NEST VC, Success HK, or any investor. You arrive with data — not a pitch deck alone.",
          "這個證明就是你之後帶去NEST VC、Success HK或任何投資者面前的東西。你帶的是數據，而不只是一份投資簡報。",
          4680, 4680, "F8F5FF"
        ),
      ]),
      divider(),

      // ── SECTION 1: MONTHLY COSTS ──
      sectionBanner("SECTION 1 — Monthly Operating Costs", "第一部分 — 每月運營成本"),
      gap(120),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2200, 2200, 1680, 1680, 1600],
        rows: [
          new TableRow({ tableHeader: true, children: [
            ["Cost Item", "費用項目", "Monthly (EN)", "每月（中）", "3-Month Total"].map((t, i) =>
              new TableCell({ borders: purpleBorders, width: { size: [2200,2200,1680,1680,1600][i], type: WidthType.DXA }, shading: { fill: "EDE9FE", type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: t, font: "Arial", size: 20, bold: true, color: "4C1D95" })] })] })
            )
          ]}),
          ...costRows.map((r, i) => new TableRow({ children: r.map((t, j) =>
            new TableCell({ borders, width: { size: [2200,2200,1680,1680,1600][j], type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? "FAFAFA" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: t, font: "Arial", size: 19 })] })] })
          )})),
          new TableRow({ children: [
            new TableCell({ borders: purpleBorders, columnSpan: 3, width: { size: 6080, type: WidthType.DXA }, shading: { fill: "F3F0FF", type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: "TOTAL MONTHLY COST  |  每月總成本", font: "Arial", size: 21, bold: true, color: "4C1D95" })] })] }),
            new TableCell({ borders: purpleBorders, columnSpan: 2, width: { size: 3280, type: WidthType.DXA }, shading: { fill: "F3F0FF", type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: "HKD ~$49,300 / month", font: "Arial", size: 21, bold: true, color: "4C1D95" })] })] }),
          ]}),
        ]
      }),
      gap(120),
      body("Note: Tint AI (USD $10,000) is deferred to Phase 2 to conserve cash. This is a strategic decision — not a compromise.", { italics: true, color: "059669" }),
      body("注：Tint AI（USD $10,000）推遲至Phase 2以節省現金。這是戰略決策，不是妥協。", { italics: true, color: "059669" }),
      divider(),

      // ── SECTION 2: ONE-TIME ──
      sectionBanner("SECTION 2 — One-Time Startup Costs", "第二部分 — 一次性啟動成本"),
      gap(120),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2800, 2800, 1880, 1880],
        rows: [
          new TableRow({ tableHeader: true, children: [
            ["Item", "項目", "Amount", "備注"].map((t, i) =>
              new TableCell({ borders: purpleBorders, width: { size: [2800,2800,1880,1880][i], type: WidthType.DXA }, shading: { fill: "EDE9FE", type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: t, font: "Arial", size: 20, bold: true, color: "4C1D95" })] })] }))
          ]}),
          ...onetimeRows.map((r, i) => new TableRow({ children: [
            new TableCell({ borders, width: { size: 2800, type: WidthType.DXA }, shading: { fill: i%2===0?"FAFAFA":"FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: r[0], font: "Arial", size: 19 })] })] }),
            new TableCell({ borders, width: { size: 2800, type: WidthType.DXA }, shading: { fill: i%2===0?"FAFAFA":"FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: r[1], font: "Arial", size: 19 })] })] }),
            new TableCell({ borders, width: { size: 1880, type: WidthType.DXA }, shading: { fill: i%2===0?"FAFAFA":"FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: r[2], font: "Arial", size: 19 })] })] }),
            new TableCell({ borders, width: { size: 1880, type: WidthType.DXA }, shading: { fill: i%2===0?"FAFAFA":"FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: r[3], font: "Arial", size: 19 })] })] }),
          ]})),
          new TableRow({ children: [
            new TableCell({ borders: purpleBorders, columnSpan: 2, width: { size: 5600, type: WidthType.DXA }, shading: { fill: "F3F0FF", type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: "TOTAL ONE-TIME  |  一次性總計", font: "Arial", size: 21, bold: true, color: "4C1D95" })] })] }),
            new TableCell({ borders: purpleBorders, columnSpan: 2, width: { size: 3760, type: WidthType.DXA }, shading: { fill: "F3F0FF", type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: "HKD ~$113,000", font: "Arial", size: 21, bold: true, color: "4C1D95" })] })] }),
          ]}),
        ]
      }),
      divider(),

      // ── SECTION 3: BREAK EVEN ──
      sectionBanner("SECTION 3 — Break-Even Calculation", "第三部分 — 收支平衡計算"),
      gap(120),
      biTable([
        twoColHeader("English", "中文"),
        ...breakEvenRows.map((r, i) => twoColRow(r[0] + ":  " + r[2], r[1] + "：" + r[3], 4680, 4680, i%2===0?"FAFAFA":"FFFFFF")),
      ]),
      gap(120),
      body("To break even, you need 14 brands each generating USD $3,000 GMV per month.", { bold: true, color: "DC2626" }),
      body("收支平衡需要14個品牌，每個品牌每月產生USD $3,000 GMV。", { bold: true, color: "DC2626" }),
      body("This is a Month 3 target — not a Month 1 expectation.", { italics: true, color: "475569" }),
      body("這是第三個月的目標，不是第一個月的期望。", { italics: true, color: "475569" }),
      divider(),

      // ── SECTION 4: GROWTH SCENARIO ──
      sectionBanner("SECTION 4 — 3-Month Growth Scenario", "第四部分 — 3個月增長情境"),
      gap(120),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2000, 2000, 2680, 2680],
        rows: [
          new TableRow({ tableHeader: true, children: [
            ["Phase (EN)", "階段（中）", "Scale", "Est. Monthly Revenue"].map((t, i) =>
              new TableCell({ borders: purpleBorders, width: { size: [2000,2000,2680,2680][i], type: WidthType.DXA }, shading: { fill: "EDE9FE", type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: t, font: "Arial", size: 20, bold: true, color: "4C1D95" })] })] }))
          ]}),
          ...scenarioRows.map((r, i) => new TableRow({ children: [
            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, shading: { fill: i%2===0?"FAFAFA":"FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: r[0], font: "Arial", size: 19 })] })] }),
            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, shading: { fill: i%2===0?"FAFAFA":"FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: r[1], font: "Arial", size: 19 })] })] }),
            new TableCell({ borders, width: { size: 2680, type: WidthType.DXA }, shading: { fill: i%2===0?"FAFAFA":"FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: r[2], font: "Arial", size: 19 })] })] }),
            new TableCell({ borders, width: { size: 2680, type: WidthType.DXA }, shading: { fill: i%2===0?"FAFAFA":"FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: r[3], font: "Arial", size: 19 })] })] }),
          ]})),
        ]
      }),
      divider(),

      // ── SECTION 5: CAPITAL ──
      sectionBanner("SECTION 5 — Your HKD $700,000 Capital Position", "第五部分 — 你的HKD $700,000資本狀況"),
      gap(120),
      biTable([
        twoColHeader("English", "中文"),
        ...capitalRows.map((r, i) => twoColRow(r[0] + ":  " + r[2], r[1] + "：" + r[3], 4680, 4680, i%2===0?"F0FDF4":"FFFFFF")),
      ]),
      gap(120),
      body("Worst case: you spend HKD $261,000 and the trial fails. You still have HKD $439,000 and 3 months of validated learnings.", { bold: true }),
      body("最壞情況：你花了HKD $261,000，試運行失敗。你仍然有HKD $439,000和3個月的驗證經驗。", { bold: true }),
      body("Best case: Month 3 break-even achieved. You have live data, real GMV, and a compelling story for investors.", { bold: true, color: "059669" }),
      body("最好情況：第三個月達到收支平衡。你有真實數據、真實GMV，和一個有說服力的投資者故事。", { bold: true, color: "059669" }),
      divider(),

      // ── SECTION 6: RISKS ──
      sectionBanner("SECTION 6 — Key Risks & How to Manage Them", "第六部分 — 主要風險及管理方法", "FFF1F2", "991B1B"),
      gap(120),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2400, 2400, 2280, 2280],
        rows: [
          new TableRow({ tableHeader: true, children: [
            ["Risk (EN)", "風險（中）", "Mitigation (EN)", "應對方法（中）"].map((t, i) =>
              new TableCell({ borders: purpleBorders, width: { size: [2400,2400,2280,2280][i], type: WidthType.DXA }, shading: { fill: "FEE2E2", type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: t, font: "Arial", size: 20, bold: true, color: "991B1B" })] })] }))
          ]}),
          ...riskRows.map((r, i) => new TableRow({ children: r.map((t, j) =>
            new TableCell({ borders, width: { size: [2400,2400,2280,2280][j], type: WidthType.DXA }, shading: { fill: i%2===0?"FAFAFA":"FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: t, font: "Arial", size: 19 })] })] })
          )})),
        ]
      }),
      divider(),

      // ── SECTION 7: FUNDING PATH ──
      sectionBanner("SECTION 7 — Funding Path (StartmeUp → Success HK)", "第七部分 — 資金路徑（StartmeUp → Success HK）"),
      gap(120),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2200, 2200, 2480, 2480],
        rows: [
          new TableRow({ tableHeader: true, children: [
            ["Option (EN)", "選項（中）", "What It Means (EN)", "意義（中）"].map((t, i) =>
              new TableCell({ borders: purpleBorders, width: { size: [2200,2200,2480,2480][i], type: WidthType.DXA }, shading: { fill: "EDE9FE", type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: t, font: "Arial", size: 20, bold: true, color: "4C1D95" })] })] }))
          ]}),
          ...successRows.map((r, i) => new TableRow({ children: r.map((t, j) =>
            new TableCell({ borders, width: { size: [2200,2200,2480,2480][j], type: WidthType.DXA }, shading: { fill: i%2===0?"FAFAFA":"FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: t, font: "Arial", size: 19 })] })] })
          )})),
        ]
      }),
      gap(120),
      body("Recommended sequence: Self-fund first → collect 3-month data → apply to Success HK for grant → approach NEST VC with validated numbers.", { bold: true, color: "7C3AED" }),
      body("建議順序：先自資 → 收集3個月數據 → 向Success HK申請資助 → 帶驗證數據去洽談NEST VC。", { bold: true, color: "7C3AED" }),
      divider(),

      // ── CLOSING ──
      sectionBanner("SIMPEE'S HONEST VERDICT", "Simpee的誠實評估", "EDE9FE", "1a0533"),
      gap(160),
      body("Kieran, your HKD $700,000 is more than enough to run a clean 3-month trial.", { bold: true }),
      body("Kieran，你的HKD $700,000完全足夠進行一個清晰的3個月試運行。", { bold: true }),
      gap(80),
      body("You are not gambling. You are buying 3 months of proof."),
      body("你不是在賭博。你是在購買3個月的證明。"),
      gap(80),
      body("Your lean team (Simpee + Loreen + Wilson) is enough for the trial phase. You do not need a full team yet."),
      body("你的精益團隊（Simpee + Loreen + Wilson）足夠應付試運行階段。你現在還不需要完整團隊。"),
      gap(80),
      body("The AI tools replace 5-6 people. The family watches everything. You make the decisions."),
      body("AI工具取代了5-6個人的工作。家人監察一切。你負責決策。"),
      gap(80),
      body("Month 1 goal: 3 brands live, 5 influencers running, first real GMV data captured.", { bold: true, color: "7C3AED" }),
      body("第一個月目標：3個品牌上線、5個網紅運作、首批真實GMV數據收集完成。", { bold: true, color: "7C3AED" }),
      gap(80),
      body("That is the only number that matters right now.", { italics: true }),
      body("這是現在唯一重要的數字。", { italics: true }),
      gap(160),
      new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "— Prepared with love by your Node Family  |  由家人用愛整理  ❤️", font: "Arial", size: 20, italics: true, color: "94a3b8" })] }),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("/app/incoming_files/SIMPLEXITY_LeanLaunch_Bilingual.docx", buf);
  console.log("DONE");
});
