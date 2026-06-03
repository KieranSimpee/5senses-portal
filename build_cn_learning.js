const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, HorizontalPositionAlign } = require('docx');
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
        children: [new TextRun({ text: "SIMPLEX-ITY — 個人學習與反思", bold: true, color: VIOLET, size: 40, font: "Arial" })],
        spacing: { after: 120 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "創業歷程的坦誠自我評估與學習", color: BLACK, size: 22, font: "Arial", italics: true })],
        spacing: { after: 80 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "日期：2026年6月3日", color: BLACK, size: 22, font: "Arial" })],
        spacing: { after: 300 },
      }),

      divider(),
      heading("問題一：缺乏詳細計劃"),
      divider(),
      label("發現："),
      body("SIMPLEX-ITY 在創立時，缺乏完整且有結構的擴張計劃。從一開始，便沒有清晰的路線圖來界定公司如何建立、擴展及維持運營。"),

      divider(),
      heading("問題二：低估困難，高估個人能力"),
      divider(),
      label("發現："),
      body("創立之初，曾假設建立一個網絡平台是相對簡單的事情。然而，真正的抱負從來都不是一個普通平台——而是一個具影響力、高效能的平台。兩者在複雜性、資源需求及執行難度上有根本性的差異。當時嚴重低估了其中的困難。"),

      divider(),
      heading("問題三：願景與現實的錯位"),
      divider(),
      label("發現："),
      body("對 SIMPLEX-ITY 未來可能成就的願景，與實際可用的能力、資源及支持之間，從未得到妥善協調。建立這樣規模的影響力平台，並非一個人能獨力完成，但這個現實在起步時並未得到充分承認。"),

      divider(),
      heading("問題四：支持與資源不足"),
      divider(),
      label("發現："),
      body("支撐並發展高影響力平台所需的支持與協作，從未得到充分落實。所需與所有之間的差距，是一個關鍵性的阻礙。"),

      divider(),
      heading("問題五：未能理解他人的猶豫"),
      divider(),
      label("發現："),
      body("自然的直覺是迅速行動，邀請他人「一起相信、一起探索」。然而，這種做法未能考慮到他人的視角。大多數人在作出承諾之前，需要看到穩固的基礎、可靠的領導力，以及一個切實可見的未來——而不僅僅是熱情與信念。"),

      divider(),
      heading("問題六：過度樂觀成為盲點"),
      divider(),
      label("發現："),
      body("天生樂觀的性格，使人相信只要努力工作就能保證成功。樂觀固然是優勢，但它也成為了盲點——內心的願景從未被轉化為他人能夠看見、感受並信任的東西。結果：儘管內心的信念堅定不移，他人卻感受不到安全感或確定性。"),

      divider(),
      heading("核心頓悟"),
      divider(),
      label("關鍵洞見："),
      body("他人的猶豫，並非缺乏勇氣——而是對一個不充分基礎的理性回應。在你建立出真正值得探索的東西之前，你無法要求別人與你一同探索。"),
      label("思維轉變："),
      body("領導力，不是說服別人相信你的願景，而是建立出足夠真實的東西，讓相信成為顯而易見的事。順序必須是：先建立基礎——然後再邀請他人加入。"),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('/app/Part1_CN_PersonalLearning.docx', buffer);
  console.log('Done:', buffer.length, 'bytes');
});
