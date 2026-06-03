const { Document, Packer, Paragraph, TextRun, BorderStyle } = require('docx');
const fs = require('fs');

const VIOLET = "5e50fb";
const BLACK = "1a1a1f";

function heading(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, color: VIOLET, size: 28, font: "Arial" })],
    spacing: { before: 360, after: 120 },
  });
}
function label(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, color: BLACK, size: 24, font: "Arial" })],
    spacing: { before: 160, after: 60 },
  });
}
function body(text) {
  return new Paragraph({
    children: [new TextRun({ text, color: BLACK, size: 22, font: "Arial" })],
    spacing: { before: 60, after: 120 },
  });
}
function numbered(n, text) {
  return new Paragraph({
    children: [new TextRun({ text: `${n}. ${text}`, color: BLACK, size: 22, font: "Arial" })],
    spacing: { before: 40, after: 40 },
    indent: { left: 360 },
  });
}
function divider() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } },
    spacing: { before: 80, after: 80 },
    children: [],
  });
}

const doc = new Document({
  sections: [{
    properties: {},
    children: [
      new Paragraph({
        children: [new TextRun({ text: "SIMPLEX-ITY — 2026 年鞏固計劃", bold: true, color: VIOLET, size: 40, font: "Arial" })],
        spacing: { after: 120 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "建立真實、具投資價值平台的結構性路線圖", color: BLACK, size: 22, font: "Arial", italics: true })],
        spacing: { after: 80 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "日期：2026年6月3日", color: BLACK, size: 22, font: "Arial" })],
        spacing: { after: 300 },
      }),

      divider(),
      heading("關鍵一：政府支持 — StartmeUp HK"),
      divider(),
      label("行動："),
      body("已聯繫 StartmeUp HK，探索政府支持、諮詢服務，以及公司可透過官方渠道獲取的各類資源。"),
      label("目標："),
      body("爭取公信力、潛在資助及政府背書，以鞏固 SIMPLEX-ITY 的基礎。"),

      divider(),
      heading("關鍵二：運營合作夥伴 — Vybd AI Commerce"),
      divider(),
      label("行動："),
      body("計劃與 Vybd 合作，以收費安排或合作架構，讓其承擔平台運營的特定部分。"),
      label("目標："),
      body("讓 Kieran 專注於戰略重點，同時由 Vybd 負責運營執行，降低單點失敗風險。"),

      divider(),
      heading("關鍵三：Vybd 價值驗證"),
      divider(),
      label("行動："),
      body("一旦建立聯繫，將要求 Vybd 在作出長期承諾之前，先展示其能為平台帶來的實際價值。"),
      label("目標："),
      body("以證據為基礎的合作關係——先看到價值，再作決定。"),

      divider(),
      heading("關鍵四：Tint AI — 核心功能已整合"),
      divider(),
      label("現狀："),
      body("Tint AI 試妝功能已連接至 SIMPLEX-ITY 平台。"),
      label("重要性："),
      body("這是核心概念驗證（Proof of Concept）。一項關鍵的 AI 功能已上線並可示範——這正是將平台從構想轉變為真實產品的關鍵。"),

      divider(),
      heading("關鍵五：品牌策略 — 自主執行（推薦方案）"),
      divider(),
      label("方案 A（ABW 合作）："),
      body("ABW 提供品牌；YesStyle（旗下公司）帶來網紅。規模龐大，但造成對單一合作夥伴的依賴。"),
      label("方案 B — 推薦（自主執行）："),
      body("善用 Kieran 的採購背景、Loreen 與 Ally 的專業知識，以及現有的韓國護膚品牌人脈。"),
      label("三個月試行啟動模式："),
      numbered(1, "品牌與網紅受邀以零成本參與"),
      numbered(2, "品牌只需負責向消費者發貨"),
      numbered(3, "試行期間平台所有產品以市場價七折出售"),
      numbered(4, "向消費者說明這是試行期——真實、誠實的市場定位"),
      numbered(5, "利用3個月調試系統、優化平台體驗"),
      label("收入來源："),
      body("交易佣金 + 市場情報數據（消費者行為洞察）"),
      label("NEST VC 所需資金："),
      body("試行期間 AI 試妝點擊成本——須在投資者報告中清晰界定"),
      label("ABW 的長遠定位："),
      body("ABW 日後可成為平台上的供應商——以我方條款為準，而非他方。"),

      divider(),
      heading("關鍵六：NEST VC — 最終鞏固行動"),
      divider(),
      label("策略："),
      body("當所有 AI 合作夥伴整合完畢、平台生態系統穩固後，以一個裝備完善、具合作夥伴支持的平台形象，向 NEST VC 孵化器提出投資申請。"),
      label("目標："),
      body("爭取 NEST VC 成為投資者，建立穩固的財務及運營基礎。"),
      label("成果："),
      body("投資確認、平台驗證後，Kieran 便能自信地邀請信任的人加入公司——建立在真實的基礎之上，而非單純的願景。"),

      divider(),
      heading("總結：正確的順序"),
      divider(),
      numbered(1, "建立 AI 合作夥伴生態系統（Tint AI 已完成，Vybd 為下一步）"),
      numbered(2, "爭取政府支持（StartmeUp HK）"),
      numbered(3, "執行三個月品牌/網紅試行"),
      numbered(4, "以真實數據及上線平台向 NEST VC 進行展示"),
      numbered(5, "在穩固基礎上邀請信任之人加入"),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('/app/Part2_CN_SolidificationPlan.docx', buffer);
  console.log('Done:', buffer.length, 'bytes');
});
