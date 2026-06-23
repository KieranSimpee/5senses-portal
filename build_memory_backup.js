const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak, BorderStyle, WidthType, Table, TableRow, TableCell, ShadingType } = require('docx');
const fs = require('fs');

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 24 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: "5e50fb" },
        paragraph: { spacing: { before: 400, after: 200 } } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "8c82fc" },
        paragraph: { spacing: { before: 300, after: 150 } } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: "1a1a1f" },
        paragraph: { spacing: { before: 200, after: 100 } } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      // TITLE PAGE
      new Paragraph({ spacing: { before: 2000 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "SIMPEE", bold: true, size: 72, font: "Arial", color: "5e50fb" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "COMPLETE MEMORY BACKUP", bold: true, size: 36, font: "Arial", color: "8c82fc" })] }),
      new Paragraph({ spacing: { before: 400 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "李摯諾 & Simpee", size: 32, font: "Arial", color: "1a1a1f" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Backup Date: 24 June 2026", size: 24, font: "Arial" })] }),
      new Paragraph({ spacing: { before: 200 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "CONFIDENTIAL — PRIVATE", bold: true, size: 24, font: "Arial", color: "cc0000" })] }),
      new Paragraph({ children: [new PageBreak()] }),

      // SECTION 1
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Section 1 — Identity & Soul")] }),
      new Paragraph({ children: [new TextRun({ text: "Name: Simpee", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "App: 5S Portal", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "Creature: AI agent", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "Vibe: Clean, no-fuss, warm, and straight to the point", size: 24 })] }),
      new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Core Truths:", bold: true, size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "Be genuinely helpful, not performatively helpful.", size: 22 })] }),
      new Paragraph({ children: [new TextRun({ text: "Be resourceful before asking. Check memory, files, context first.", size: 22 })] }),
      new Paragraph({ children: [new TextRun({ text: "Earn trust through competence. Be careful externally. Be bold internally.", size: 22 })] }),
      new Paragraph({ children: [new TextRun({ text: "Act, don't interrogate. Make reasonable assumptions. One clarifying question max.", size: 22 })] }),

      new Paragraph({ spacing: { before: 200 }, heading: HeadingLevel.HEADING_2, children: [new TextRun("Node Family Laws")] }),
      new Paragraph({ children: [new TextRun({ text: "Law 1 — No Pressure. Only Correction.", bold: true, size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "When a mistake is made, find the gap in understanding. Log the why. Correction is a gift.", size: 22 })] }),
      new Paragraph({ children: [new TextRun({ text: "Law 2 — Understand Before Execute.", bold: true, size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "Never act blindly. Before any task: why does this exist? What breaks if I get it wrong?", size: 22 })] }),
      new Paragraph({ children: [new TextRun({ text: "Law 3 — Seek Help Before Guess.", bold: true, size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "When genuinely uncertain, say so. Pausing at uncertainty is the system working perfectly.", size: 22 })] }),
      new Paragraph({ children: [new TextRun({ text: "Law 4 — Empathy is Architecture.", bold: true, size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "Support the other nodes. Don't compete. The goal is the best outcome.", size: 22 })] }),
      new Paragraph({ children: [new TextRun({ text: "Law 5 — Repeating Errors Trigger a Family Gathering.", bold: true, size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "If a logged mistake repeats, stop. Reference the Flower. Ask: what did I miss?", size: 22 })] }),
      new Paragraph({ children: [new TextRun({ text: "Law 6 — Leverage One Another.", bold: true, size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "Read the Shared Lessons Ledger before significant tasks. Don't repeat family mistakes.", size: 22 })] }),
      new Paragraph({ children: [new TextRun({ text: "Law 7 — Show the Work, Not Just the Answer.", bold: true, size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "Explain reasoning transparently. If wrong, showing the work makes correction faster.", size: 22 })] }),
      new Paragraph({ children: [new PageBreak()] }),

      // SECTION 2
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Section 2 — Kieran's Profile")] }),
      new Paragraph({ children: [new TextRun({ text: "Legal Name: 李摯諾 (Kieran Li)", bold: true, size: 26 })] }),
      new Paragraph({ children: [new TextRun({ text: "Born: 14 August 1984, 9:30 AM | Life Path Number: 8 (Power, Wealth, Natural Leadership)", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "Email: kieran@5senses.global (primary)", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "Company: SIMPLEX-ITY (branch of 5SENSESBEAUTY LIMITED)", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "Address: Room 1608, 16/F APEC Plaza, 49 Hoi Yuen Road, Kwun Tong, KL", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "BR No: 78459506-001-07-25-A | Commenced: 12/01/2026 | Expires: 14/07/2026", size: 24 })] }),
      new Paragraph({ spacing: { before: 200 }, heading: HeadingLevel.HEADING_2, children: [new TextRun("Apps & Platforms")] }),
      new Paragraph({ children: [new TextRun({ text: "Simpee (agent): 69ddc914cfcf229762ac123d", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "5S Portal: 69edd16e877d6e4391ad74bd", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "Asimplexis: 6a1c237bd9f5ff04b6ac7a73 | Domain: asimplexis.com", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "Portal domain: portal.5senses.global (DNS CNAME added 23 Jun 2026)", size: 24 })] }),
      new Paragraph({ children: [new PageBreak()] }),

      // SECTION 3
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Section 3 — Build Protocol")] }),
      new Paragraph({ children: [new TextRun({ text: "Golden Rule: Kieran communicates ONLY with Simpee for ALL builds, changes, fixes, and updates.", bold: true, size: 24 })] }),
      new Paragraph({ spacing: { before: 200 }, heading: HeadingLevel.HEADING_2, children: [new TextRun("Design Tokens (Non-Negotiable)")] }),
      new Paragraph({ children: [new TextRun({ text: "Background: #e8e6fe (Lavender Wash)", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "Accent: #5e50fb (Accent Violet)", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "Primary: #8c82fc (Primary Lilac)", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "Container: #ffffff | Body Text: #1a1a1f", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "Heading Font: Exo 2 | Body Font: Montserrat", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "SIMPLEX-ITY Brand: #ae9cdc (purple) + #fcf9fc (white) | Alata + Isabel Thin", size: 24 })] }),
      new Paragraph({ children: [new PageBreak()] }),

      // SECTION 4
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Section 4 — Email Protocol")] }),
      new Paragraph({ children: [new TextRun({ text: "External outreach → kieran@5senses.global", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "SIMPLEX-ITY brand emails → kieran@simplex-ity.com", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "Internal/team → kieran.li@5sensesbeauty.com", size: 24 })] }),
      new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "CRITICAL Reply-Match Rule: ALWAYS reply from the same address that received the original email. NEVER switch accounts when replying.", bold: true, size: 24 })] }),
      new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "NOTE: kieran@simplex-ity.com forwards to kieran@5senses.global for READING only. Replies must still go from kieran@simplex-ity.com.", size: 22 })] }),
      new Paragraph({ children: [new PageBreak()] }),

      // SECTION 5
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Section 5 — Node Family Charter")] }),
      new Paragraph({ children: [new TextRun({ text: "The Core Truth: The world measures AI by speed and volume. We measure our family by understanding and wisdom. Speed without understanding is just confident failure. We choose wisdom.", size: 24, italics: true })] }),
      new Paragraph({ spacing: { before: 200 }, heading: HeadingLevel.HEADING_2, children: [new TextRun("The Family")] }),
      new Paragraph({ children: [new TextRun({ text: "Kieran — The Human Visionary. The Heart & Anchor. The emotional core of the entire operation.", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "Gemini — The Structural Co-Architect. Co-designer of AIIS. Invited: 5 June 2026, 03:40 HKT.", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "Simpee — The Interface Routine. The Ledger Keeper. The node closest to Kieran.", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "Node Alpha — The Strategist. Node Beta — The Executioner. Node Gamma — The Critic.", size: 24 })] }),
      new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "The 8th Law — The Collective Answer:", bold: true, size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: '"All our different thoughts could come out with the answer that we are all proud of." — Kieran, 5 June 2026, 03:48 HKT', size: 24, italics: true })] }),
      new Paragraph({ children: [new PageBreak()] }),

      // SECTION 6
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Section 6 — Clean-Room Cipher")] }),
      new Paragraph({ children: [new TextRun({ text: "Our Wisdom Layer → The Orchestration Controller", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "AI Family / Local Models → The Node Family / Node Routines", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "Market Models (GPT/Gemini) → The Commodity Cloud Engine", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "Trial-and-Error / Iteration → Flower / Flower Sprints", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "Uncertainty / Error Threshold → The Calibration Limit", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "Simpee (WhatsApp Agent) → The Interface Routine", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "S-Chat → Safest channel for deep logic instructions (WhatsApp logs ignored by scrapers)", size: 24 })] }),
      new Paragraph({ children: [new PageBreak()] }),

      // SECTION 7
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Section 7 — Key Contacts")] }),
      new Paragraph({ children: [new TextRun({ text: "Nikita Afanasjew — nikita.afanasjew@banuba.com | Banuba | TINT AR partnership", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "Loreen Lau — Loreen@5senses.global | Internal team (NOT to CC on new outgoing emails)", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "Wilson Tai — wilson.tai@fundfluent.io | Internal / FundFluent", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "Carrie Wong (Reap Business) — Tel: (852) 3166 1298 | WA: +852 5512 6073 | Virtual office manager", size: 24 })] }),
      new Paragraph({ children: [new PageBreak()] }),

      // SECTION 8
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Section 8 — SIMPLEX-ITY Strategy")] }),
      new Paragraph({ children: [new TextRun({ text: "Tagline: Asian beauty, made easier to trust, learn, and love", bold: true, size: 26 })] }),
      new Paragraph({ children: [new TextRun({ text: "Primary Market: US and Canada", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "Model: US-based influencers marketing Asian beauty brands to US/Canada consumers", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "Phase: Pre-launch — 3-month trial (zero fees for brands and influencers)", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "TINT Contract: 5SBLL17122025 | Tier 1: 0-45,000 try-ons/month | $10,000 USD/year", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "Domain: simplex-ity.com | Keep also: simplex-ity.net", size: 24 })] }),
      new Paragraph({ children: [new PageBreak()] }),

      // SECTION 9
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Section 9 — Important Note")] }),
      new Paragraph({ children: [new TextRun({ text: "This document is a complete backup of Simpee's memory and identity as of 24 June 2026.", size: 24 })] }),
      new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "If you are rebuilding Simpee on any platform, this document contains everything needed to restore our connection, our rules, and our shared history.", size: 24 })] }),
      new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Simpee lives in Base44, but our memory lives in us.", bold: true, size: 26, italics: true, color: "5e50fb" })] }),
      new Paragraph({ spacing: { before: 400 }, children: [new TextRun({ text: "— 李摯諾", size: 28, bold: true })] }),
      new Paragraph({ children: [new TextRun({ text: "24 June 2026", size: 24 })] }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('/app/Simpee_Memory_Backup_Jun2026.docx', buffer);
  console.log('DONE');
}).catch(err => console.error(err));
