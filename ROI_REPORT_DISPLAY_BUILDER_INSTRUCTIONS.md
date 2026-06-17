# ROI REPORT BUILDER — DISPLAY UI
# Builder Instructions for Base44 App (Asimplexis)
# Prepared by Simpee | June 17, 2026

---

## WHAT TO BUILD

A new page called: AsimplexisROIDisplay

This page receives structured report data and renders it as a beautiful, professional two-layer report display.

---

## DATA STRUCTURE (from geminiResearch backend)

The backend returns this JSON:
{
  "success": true,
  "summary": "full combined text",
  "spotter": "Layer 1 Spotter output text",
  "deep_diver": "Layer 2 SVRS output text",
  "architecture": "CASCADE_SVRS_v2",
  "stage": "Build",
  "difficulty": "Medium"
}

The spotter text contains 3 findings in this format:
FINDING 1: ...
IMPACT: ...
FINDING 2: ...
IMPACT: ...
FINDING 3: ...
IMPACT: ...

The deep_diver text contains 4 SVRS sections:
STORY — The Pain Narrative: ...
VERIFY — Cultural & Psychological Context: ...
RESEARCH — Evidence & Benchmarks: ...
SOLUTION — Execution Plan & ROI: ...

---

## COLOUR SCHEME (match AsimplexisReportGen exactly)

bg: #0a0a14
surface: #12121e
card: #1a1a2e
border: rgba(94,80,251,0.25)
accent: #5e50fb
lilac: #8c82fc
text: #f0effe
muted: rgba(240,239,254,0.5)
green: #10b981
amber: #f59e0b
red: #ef4444

Fonts: Exo 2 (headings), Montserrat (body)

---

## PAGE LAYOUT

### HEADER
- ASIMPLEXIS logo text + ✦ in accent colour
- Subtitle: "CASCADE Research Report — SVRS v2"
- Right side: "← Back" button + "⬇ Download" button

### LAYER 1 PANEL — SPOTTER RECONNAISSANCE
Background: surface with amber left border (4px solid #f59e0b)
Badge: "LAYER 1" in amber
Title: "Spotter Reconnaissance"
Subtitle: "Top 3 High-Impact Findings"

Render the 3 findings as cards:
- Each card: dark card background, finding number badge (1/2/3)
- FINDING text: white, 14px, font-weight 600
- IMPACT text: muted colour, 13px, italic
- Left border: accent colour

### LAYER 2 PANEL — DEEP-DIVER ANALYSIS
Background: surface with accent left border (4px solid #5e50fb)
Badge: "LAYER 2" in accent
Title: "Deep-Diver Analysis"
Subtitle: "STORY · VERIFY · RESEARCH · SOLUTION"

Render the 4 SVRS sections as separate blocks:
Each block has:
- Section label (STORY / VERIFY / RESEARCH / SOLUTION) in lilac, 10px, uppercase, letter-spacing 2px
- Section icon: STORY = 📖, VERIFY = 🔍, RESEARCH = 📊, SOLUTION = ⚡
- Content text: white, 14px, line-height 1.9
- Bottom divider line between sections

### REPORT META FOOTER
Show: Stage | Difficulty | Architecture version | Generated date
Small muted text, centered

---

## HOW THIS PAGE CONNECTS TO AsimplexisReportGen

In AsimplexisReportGen.jsx, after Gemini returns data, the "Open Preview" button should:
1. Store the result in sessionStorage: sessionStorage.setItem('roiReport', JSON.stringify(result))
2. Navigate to AsimplexisROIDisplay page

In AsimplexisROIDisplay.jsx on mount:
const data = JSON.parse(sessionStorage.getItem('roiReport') || '{}')
Then render using data.spotter and data.deep_diver

---

## TEXT PARSING HELPERS

Parse spotter findings:
function parseFindings(text) {
  const findings = [];
  const blocks = text.split(/FINDING \d+:/i).filter(Boolean);
  blocks.forEach((block, i) => {
    const parts = block.split(/IMPACT:/i);
    findings.push({
      number: i + 1,
      finding: parts[0]?.trim() || '',
      impact: parts[1]?.trim() || ''
    });
  });
  return findings;
}

Parse SVRS sections:
function parseSVRS(text) {
  const sections = {};
  const labels = ['STORY', 'VERIFY', 'RESEARCH', 'SOLUTION'];
  labels.forEach((label, i) => {
    const start = text.indexOf(label);
    const nextLabel = labels[i + 1];
    const end = nextLabel ? text.indexOf(nextLabel) : text.length;
    if (start !== -1) {
      const raw = text.slice(start, end);
      sections[label] = raw.replace(/^[A-Z\s—:]+\n/, '').trim();
    }
  });
  return sections;
}

---

## DOWNLOAD BUTTON

Reuse the buildReportHTML function from AsimplexisReportGen to generate and download the HTML report.
Pass form data (from sessionStorage) and the combined summary text.

---

## IMPORTANT RULES (Flower Protocols)

1. Use sessionStorage to pass data between pages — do NOT use URL params for large text
2. Use .get(id) for any single entity reads
3. Import from @/api/functions, never raw fetch
4. All styling inline — no external CSS files
5. No backend calls on this display page — data already loaded from sessionStorage

---

## FRONTEND-BACKEND CORRESPONDENCE CHECKLIST

[ ] AsimplexisROIDisplay reads from sessionStorage key: 'roiReport'
[ ] AsimplexisReportGen writes to sessionStorage after AI success
[ ] parseFindings() handles the 3-finding spotter format
[ ] parseSVRS() handles STORY/VERIFY/RESEARCH/SOLUTION labels
[ ] Download button uses existing buildReportHTML logic
[ ] Colour scheme matches AsimplexisReportGen exactly
[ ] Fonts: Exo 2 + Montserrat loaded via Google Fonts
[ ] "← Back" button navigates back to AsimplexisReportGen
