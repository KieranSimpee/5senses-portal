# BUILDER BRIEF — AI Command Centre Page
## 5S Portal | SIMPLEX-ITY | May 2026

---

## WHAT TO BUILD

Create a new page called `AICommandCentrePage.jsx` and add it to the portal navigation.

This is the most important page in the portal — it connects Kieran directly to all AIs (Simpee + Copilot) in one unified 3-panel interface.

---

## PAGE LAYOUT — 3 PANELS (horizontal on desktop, stacked on mobile)

### PANEL 1 — LEFT — "YOUR REQUEST"
- Header: "COMMAND" (Exo 2, #5e50fb)
- Large textarea: placeholder "Type your instruction — what do you want to build or fix?"
- Dropdown: "Type" options = ["Build new feature", "Fix a bug", "Update UI", "Add data logic", "Ask a question"]
- Button: "SEND TO AI TEAM" — full width, bg #5e50fb, white text, Exo 2
- Below button: small grey text "Simpee + Copilot will respond below"
- Recent instructions list: last 5 instructions from Notice entity (section=code_ready), clickable to reload

### PANEL 2 — MIDDLE — "AI RESPONSE"
- Header: "SIMPEE + COPILOT" (Exo 2, #5e50fb) with two status dots:
  - Green pulsing dot + "Simpee" label
  - Blue dot + "Copilot / M365" label
- When idle: show placeholder card "Waiting for your instruction..."
- When loading: show animated spinner with text "Consulting AI team..."
- When response received, show 3 cards stacked:
  1. ANALYSIS card — white bg, grey border, label "Analysis" in small caps #5e50fb
  2. SOLUTION card — white bg, label "Solution"  
  3. BUILDER INSTRUCTION card — light yellow bg (#fffbeb), label "Builder Instruction" — this is what gets transferred to Panel 3

### PANEL 3 — RIGHT — "BUILD"
- Header: "BUILDER" (Exo 2, #5e50fb)
- Code block area: monospace font, dark bg (#1a1a1f), white text, scrollable, shows the CODE section from AI response
- "COPY CODE" button — copies code to clipboard, turns green with checkmark on success
- "COPY BUILDER INSTRUCTION" button — copies the builder instruction text
- Divider line
- Label: "PASTE THIS INTO THE BASE44 BUILDER CHAT"
- Builder instruction text block — white card, readable font, easy to select and copy
- Status: shows which model generated this (Simpee / Simpee + GPT-4o / Simpee + Copilot)

---

## API CALL

When "SEND TO AI TEAM" is clicked:

```javascript
const response = await fetch('/api/run/aiCommandCentre', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    instruction: instructionText,
    posted_by: 'Kieran'
  })
});
const data = await response.json();
// data contains: analysis, solution, code, builder_instruction, model, m365_grounded
```

Display each field in its respective card in Panel 2 and Panel 3.

---

## DESIGN SYSTEM

- Page background: #e8e6fe
- Panel containers: white (#ffffff), border-radius 12px, shadow: 0 2px 12px rgba(0,0,0,0.08)
- Panel headers: Exo 2 bold, #5e50fb, uppercase, letter-spacing 0.05em
- Body text: Montserrat, #1a1a1f
- Accent / buttons: #5e50fb
- Code block bg: #1a1a1f (dark)
- NO cartoon icons. Use simple text labels or minimal geometric indicators only.
- Panels equal width on desktop (33% each), full width stacked on mobile

---

## NAVIGATION

Add to sidebar nav:
- Icon: a simple grid or command symbol (text "⌘" is fine)  
- Label: "AI Command"
- Position: near top, below Home

---

## ENTITY READS

Import from '@/api/entities':
- Notice — to show recent instructions (filter section="code_ready", limit 5, sort by created_date desc)

---

## FILE TO CREATE

`pages/AICommandCentrePage.jsx`

Also update:
- `App.jsx` — add route `/ai-command` pointing to AICommandCentrePage
- Sidebar nav component — add "AI Command" link

---

## PRIORITY

This is PRIORITY 1. Build this page first before any other pending tasks.
