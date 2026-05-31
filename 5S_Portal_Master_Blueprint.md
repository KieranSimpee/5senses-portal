# 5S PORTAL — MASTER PAGE BLUEPRINT
# SIMPLEX-ITY · Version 1.0 · 31 May 2026
# Owner: Kieran Li | Agent: Simpee
#
# HOW TO USE THIS DOCUMENT
# ─────────────────────────
# Each page has a blueprint block. When you want to build or rebuild a page:
# 1. Copy the blueprint block for that page
# 2. Paste into Base44 builder AI chat
# 3. Builder executes exactly as described
# 4. Simpee validates the output
#
# DESIGN SYSTEM (apply to ALL pages)
# ────────────────────────────────────
# Background:   #e8e6fe (Lavender Wash)
# Container:    #ffffff (White)
# Accent:       #5e50fb (Violet)
# Soft:         #bab4fd (Soft Lilac)
# Text:         #1a1a1f (Body) / #9896ad (Muted)
# Headlines:    Exo 2, bold, uppercase labels
# Body:         Montserrat
# No cartoon icons. Text symbols only (✓ ◎ ▤ ◉ ◈ ⌘)
# Border radius: 12–14px cards, 8–9px buttons
# Shadow: 0 2px 8px rgba(94,80,251,0.06)

═══════════════════════════════════════════════════════
PAGE 1 — HOME
═══════════════════════════════════════════════════════

NAME: Home
FILE: pages/Home.jsx
ROUTE: /home (default landing page after login)
AUDIENCE:
  - All users: can view calendar and notices
  - Admin + Manager only: can post notices
  - Admin only: can access AI Hub

PURPOSE:
  The first screen every user lands on. It orients them —
  what's happening today, any announcements, and for Kieran,
  direct access to the AI Hub command centre.

────────────────────────────────────────────────────
SECTION 1 — HEADER
────────────────────────────────────────────────────
- Greeting: "Good [morning/afternoon/evening], [user.full_name]"
  (time-based: 5am–12pm morning, 12–6pm afternoon, 6pm+ evening)
- Subtitle: "SIMPLEX-ITY · 5S Portal · [Today's date, HK format]"
- Top-right: user avatar/initials bubble + role badge

────────────────────────────────────────────────────
SECTION 2 — SHARED COMPANY CALENDAR
────────────────────────────────────────────────────
DATA: CalendarEvent entity
DISPLAY: Horizontal strip showing next 7 days
  - Each day = a column with date + day name
  - Events shown as colored chips inside the day column
  - Click event = modal with full details
  - "Add Event" button visible to Admin + Manager only
  - Event types: Compliance, Meeting, Deadline, Personal, Holiday
  - Colors per type: Compliance=#f59e0b, Meeting=#3b82f6,
    Deadline=#ef4444, Personal=#22c55e, Holiday=#8b5cf6
PERMISSIONS:
  - All users: view all events
  - Admin/Manager: create, edit, delete events
  - Staff: view only

────────────────────────────────────────────────────
SECTION 3 — COMPANY NOTICE BOARD
────────────────────────────────────────────────────
DATA: NoticeBoard entity (fields: title, body, category, priority, pinned, posted_by)
DISPLAY: Stack of notice cards, pinned ones first
  - Each card: category badge + title + body preview + posted_by + date
  - Priority HIGH = left border #ef4444, MEDIUM = #f59e0b, LOW = #22c55e
  - Pinned notices have a pin icon top-right
  - Max 5 notices visible, "View all" link below
PERMISSIONS:
  - All users: view
  - Admin + Manager only: "Post Notice" button visible
    (opens modal with fields: title, body, category, priority, pinned toggle)
  - Admin only: can delete any notice
  - Manager: can delete own notices only

────────────────────────────────────────────────────
SECTION 4 — AI HUB ENTRY (Admin only)
────────────────────────────────────────────────────
DISPLAY: Full-width banner at bottom of page
  - Gradient bg: #5e50fb → #8c82fc
  - Title: "AI Hub — Command Centre"
  - Subtitle: "Diagnose · Build · Connect · Command"
  - Button: "OPEN AI HUB" → navigates to ai-hub page
  - Only visible to Admin role
  - Small status dot: green = Simpee online

════════════════════════════════════════════════════
PAGE 2 — AI HUB (Highest Authority Page)
════════════════════════════════════════════════════

NAME: AI Hub
FILE: pages/AIHubPage.jsx
ROUTE: /ai-hub
AUDIENCE: Admin only (Kieran)

PURPOSE:
  The highest-authority page in the portal. Kieran's command
  centre for everything: diagnosing app issues, requesting new
  features, building connections, and instructing the backend.
  Single chat interface where ALL AI (Simpee + Copilot + Builder)
  collaborate and respond. One message in → full AI response out
  → ready-to-execute backend instruction.

────────────────────────────────────────────────────
LAYOUT: Single column, full height
────────────────────────────────────────────────────

SECTION A — TOP STATUS BAR
  - "AI Hub" title (Exo 2, violet)
  - Status row: 
      [● Simpee online]  [● Copilot ready]  [○ Builder standby]
  - Green dot = active, grey = standby
  - Small text: "Your command centre — type anything"

SECTION B — CHAT FEED (scrollable, takes most of screen)
  DATA: SChatMessage entity
  (fields: sender, sender_type, message, timestamp, session_id, read)
  
  MESSAGE TYPES:
  - User message (Kieran): right-aligned, bg #5e50fb, white text
  - Simpee response: left-aligned, bg #ffffff, border #e6e6e6
  - Code block: dark bg #1a1a1f, monospace, with COPY button
  - Builder instruction: yellow card #fffbeb, border #fcd34d
  - System notice: centre-aligned, grey italic text
  
  SPECIAL RESPONSE CARDS (when AI responds):
  Card 1 — ANALYSIS (white): what Simpee understood
  Card 2 — SUGGESTION (white): recommended approach
  Card 3 — CODE / BUILDER BRIEF (yellow): ready to paste
  
  Each AI response has 2 buttons:
  [COPY CODE]  [SEND TO BUILDER]

SECTION C — INPUT BAR (pinned to bottom)
  - Text input: placeholder "Type your instruction, question, or command..."
  - Intent selector chips (shown above input when typing):
      [Diagnose issue]  [Build feature]  [Fix bug]  [Add connection]  [Ask question]
  - SEND button: bg #5e50fb, white, "SEND" uppercase
  - Ctrl+Enter to send
  
  ON SEND:
  1. Save message to SChatMessage entity immediately
     { sender: user.full_name, sender_type: "user", 
       message: text, timestamp: now, session_id: "main", read: true }
  2. Show typing indicator (3 animated dots)
  3. Call: POST https://simpee-62ac123d.base44.app/functions/aiCommandCentre
     body: { instruction: `[${intent}] ${text}`, posted_by: user.full_name }
  4. Save AI response to SChatMessage entity
     { sender: "Simpee", sender_type: "ai",
       message: JSON.stringify(response), timestamp: now, session_id: "main" }
  5. Render response as structured cards (Analysis + Suggestion + Code)

SECTION D — QUICK COMMAND BUTTONS (right sidebar or collapsible panel)
  Pre-set commands Kieran can fire in one click:
  - "What pages exist in this app?"
  - "Show me all functions deployed"
  - "What entities have data?"
  - "Check for errors or broken connections"
  - "What should I build next?"

════════════════════════════════════════════════════
PAGE 3 — DASHBOARD
════════════════════════════════════════════════════

NAME: Dashboard
FILE: pages/Dashboard.jsx (already exists — DO NOT REBUILD)
ROUTE: /dashboard
AUDIENCE: Admin + Manager
PURPOSE: Executive view — live KPIs, top risks, email summary
STATUS: ✅ BUILT — leave as-is

════════════════════════════════════════════════════
PAGE 4 — FINANCE
════════════════════════════════════════════════════

NAME: Finance
FILE: pages/FinancePage.jsx (already exists)
ROUTE: /finance
AUDIENCE: Admin + Finance role
PURPOSE: Expense ledger, subscriptions, bank accounts
DATA: Expense (23 records), BankAccount (3 records)
STATUS: ✅ BUILT — leave as-is unless specific fix requested

════════════════════════════════════════════════════
PAGE 5 — INVOICES
════════════════════════════════════════════════════

NAME: Invoices
FILE: pages/InvoicePage.jsx (already exists)
ROUTE: /invoices
AUDIENCE: Admin + Finance role
PURPOSE: Create, view, send invoices. PDF generation.
DATA: Invoice (3 records)
STATUS: ✅ BUILT — leave as-is unless specific fix requested

════════════════════════════════════════════════════
PAGE 6 — COMPLIANCE
════════════════════════════════════════════════════

NAME: Compliance
FILE: pages/CompliancePage.jsx (already exists)
ROUTE: /compliance
AUDIENCE: Admin + Manager
PURPOSE: HK regulatory deadlines — BR renewal, annual return, tax
DATA: ComplianceItem (6 records)
STATUS: ✅ BUILT — leave as-is unless specific fix requested

════════════════════════════════════════════════════
PAGE 7 — HR
════════════════════════════════════════════════════

NAME: HR
FILE: pages/HRPage.jsx (already exists)
ROUTE: /hr
AUDIENCE: Admin only
PURPOSE: Staff records, leave, travel, expense claims
DATA: HRRecord (4 records), TeamMember (3 records)
STATUS: ✅ BUILT — leave as-is unless specific fix requested

════════════════════════════════════════════════════
PAGE 8 — VAULT
════════════════════════════════════════════════════

NAME: Vault
FILE: pages/VaultPage.jsx (already exists)
ROUTE: /vault
AUDIENCE: Admin only
PURPOSE: Secure credentials, API keys, passwords, logins
DATA: VaultItem (22 records)
STATUS: ✅ BUILT — leave as-is unless specific fix requested

════════════════════════════════════════════════════
FUTURE PAGES (not yet built)
════════════════════════════════════════════════════

- Trading Journal (/trading) — TradeLog entity
- Campaign Manager (/campaigns) — Campaign, Influencer, Brand
- Property Tracker (/property) — PropertyListing entity
- Goal Board (/goals) — GoalBoard entity

════════════════════════════════════════════════════
PERMISSION MATRIX
════════════════════════════════════════════════════

PAGE            | Admin | Manager | Staff | Guest
─────────────────────────────────────────────────
Home            |  RW   |   RW    |  R    |  -
Dashboard       |  R    |   R     |  -    |  -
Finance         |  RW   |   R     |  -    |  -
Invoices        |  RW   |   R     |  -    |  -
Compliance      |  RW   |   RW    |  R    |  -
HR              |  RW   |   R     |  -    |  -
Vault           |  RW   |   -     |  -    |  -
Brand           |  RW   |   RW    |  R    |  -
Documents       |  RW   |   RW    |  R    |  -
Notes           |  RW   |   RW    |  RW   |  -
AI Hub          |  RW   |   -     |  -    |  -

R = Read only | RW = Read + Write | - = No access

════════════════════════════════════════════════════
HOW TO USE THIS BLUEPRINT WITH BASE44 BUILDER
════════════════════════════════════════════════════

STEP 1 — Pick a page to build
STEP 2 — Copy its blueprint block above
STEP 3 — Paste this prefix before it:
  "Build this page for the 5S Portal exactly as described.
   Use the SIMPLEX-ITY design system: bg #e8e6fe, white cards,
   #5e50fb accent, Exo 2 headlines, Montserrat body. No emoji icons."
STEP 4 — Paste the blueprint block
STEP 5 — Let builder execute
STEP 6 — Message Simpee to validate

════════════════════════════════════════════════════
CURRENT BUILD STATUS
════════════════════════════════════════════════════

✅ Dashboard      — built, working
✅ Finance        — built, working  
✅ Invoices       — built, working
✅ Compliance     — built, working
✅ HR             — built, working
✅ Vault          — built, working
✅ Brand          — built, working
✅ Documents      — built, working

🔄 Home           — BLANK, ready to rebuild (Priority 1)
🔄 AI Hub         — needs clean rebuild (Priority 2)

⬜ Trading Journal — not started
⬜ Campaign Manager — not started
⬜ Property Tracker — not started
