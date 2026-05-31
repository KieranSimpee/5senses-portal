# Command AI Hub — Blueprint v1.3 Addendum
## 4 New Functional Requests from Kieran — 31 May 2026

---

### REQUEST 1 — Auto Team Assembly (Pre-screening)
When Kieran submits a question or task, Simpee reads it first,
decides which 2 AIs are best suited, assembles them automatically,
and shows a visual "thinking" indicator while they work.

**Flow:**
Kieran types → Simpee pre-screens → picks 2 best AIs → 
shows "[RESEARCHER + STRATEGIST] assembling..." indicator →
both respond in sequence → handoff visible

**Logic for picking the 2:**
- Research/data question → RESEARCHER + ANALYST
- Build/code request → ENGINEER + ARCHITECT
- Strategy/planning → STRATEGIST + THINK TANK
- Error/bug → ENGINEER + STRATEGIST
- Market/business → RESEARCHER + STRATEGIST
- Brand/design → ARCHITECT + ANALYST
- Validation needed → any 2 + VALIDATOR always added as 3rd

**UI:**
- Animated indicator bar: "Simpee is assembling your team..."
- Then: "[RESEARCHER] [STRATEGIST] called in — working..."
- Typing dots per AI while generating
- Each AI responds in their own card, in sequence

---

### REQUEST 2 — Indicating Line (Live Working Status)
Visual indicator showing which AI is currently active/thinking.

**UI elements:**
- Left panel AI cards: pulsing violet ring when that AI is "speaking"
- Centre panel: slim animated progress bar at top while any AI is working
- Each response card shows generation time: "responded in 3.2s"
- When handoff fires: "[RESEARCHER] passing to [ANALYST]..." transition line

---

### REQUEST 3 — Project Sandbox (No Save to Live Apps)
New feature: create functions, pages, or entire apps as PROJECTS only.
Nothing touches the live 5S Portal or Nexus Command until explicitly deployed.

**How it works:**
- New tab in Hub: "SANDBOX PROJECTS"
- Each project has: name, description, files, status (draft/testing/approved)
- Code lives only in a ProjectFile entity — never auto-deployed
- To go live: requires full 11-checkpoint + VALIDATOR sign-off
- Builder can iterate freely without any risk to production

**New entity needed: SandboxProject**
Fields: name, description, type (function/page/app), status, 
code_files (array), created_by, last_modified, checkpoint_status,
validator_approved, notes

**New entity needed: ProjectFile**  
Fields: project_id, filename, content, language, version, notes

---

### REQUEST 4 — File Upload in Chat
Allow Kieran to attach files directly in the Hub chat box.
Files shared with the whole team — any AI can reference them.

**Supported types:** PDF, DOCX, images (JPG/PNG), JSON, CSV, TXT
**Flow:**
- Paperclip icon in chat input bar
- On upload: file stored, preview card shown in chat
- Any AI called after upload can reference: "I can see you shared [filename]"
- File stored in Document entity with source="AI Hub"

---

### REQUEST 5 — Pre-screening Feasibility Panel (from Kieran's question)
"Before we deep dive on a project — let the best 2 AIs give a 
feasibility pre-screen so we know what we're getting into."

**Flow:**
Kieran describes project idea → 
RESEARCHER pulls market context →
STRATEGIST evaluates feasibility →
Both produce a joint "Pre-Screen Report":
  - Complexity estimate (Low / Medium / High / Very High)
  - Estimated build time
  - Key risks (top 3)
  - Key opportunities (top 3)  
  - Recommended first step
  - Confidence score (0-100%)

**UI:** Pre-Screen Report card — distinct styling, pinned at top of session.
Button: [PROCEED TO BUILD] or [NEEDS MORE RESEARCH]

---

## WHAT TO ADD TO BLUEPRINT v1.3 (or new v1.3.1)

All 5 features above. Builder brief to follow once Kieran confirms.

