# AI HUB — STANDALONE TEST APP
# Version 1.0 | 31 May 2026 | Owner: Kieran Li | Agent: Simpee
#
# PURPOSE
# Build this as a SEPARATE Base44 app first.
# Test all functions, connections, and AI responses here.
# Once confirmed working → deploy into main 5S Portal.
# Nothing touches the live portal until everything is green.

═══════════════════════════════════════════════════════
APP OVERVIEW
═══════════════════════════════════════════════════════

App Name:     AI Hub (Test)
Description:  Standalone staging environment for the 5S Portal AI command centre.
              Build, test, and validate all AI + backend functions here before
              deploying to the live 5S Portal.

Pages:        1 page only — AIHub
Entities:     SChatMessage (chat history)
              TestLog (test results — pass/fail per function)
Functions:    aiCommandCentre (already deployed)
              processSChatInstruction (already deployed)

═══════════════════════════════════════════════════════
ENTITY 1 — SChatMessage
═══════════════════════════════════════════════════════

Fields:
  sender        string   — who sent it ("Kieran" / "Simpee" / "Copilot" / "Builder")
  sender_type   string   — "user" | "ai" | "system"
  message       string   — the full message text
  timestamp     string   — ISO datetime
  session_id    string   — group messages into sessions ("main" / "test-1" etc)
  read          boolean  — has user seen this

═══════════════════════════════════════════════════════
ENTITY 2 — TestLog
═══════════════════════════════════════════════════════

Fields:
  test_name     string   — what was tested
  status        string   — "pass" | "fail" | "pending"
  result        string   — full result or error message
  tested_at     string   — ISO datetime
  fixed         boolean  — has the issue been resolved

═══════════════════════════════════════════════════════
THE ONE PAGE — AIHub.jsx
═══════════════════════════════════════════════════════

ROUTE: / (default, only page)
AUDIENCE: Admin only (you)

LAYOUT: Full height, 3 columns on desktop, stacked on mobile
  LEFT PANEL   — 220px — Quick Commands + Test Results
  CENTRE PANEL — flex  — Chat Feed (main area)
  RIGHT PANEL  — 280px — Code Preview + Deploy button

────────────────────────────────────────────────────
LEFT PANEL — QUICK COMMANDS + TEST STATUS
────────────────────────────────────────────────────

TOP SECTION: "Quick Commands" header (Exo 2, violet)
Buttons (full width, stacked):
  [Run Diagnostic]         — tests all connections
  [Show All Entities]      — lists entities + record counts
  [Show All Functions]     — lists deployed backend functions
  [What should I build?]   — AI suggests next priority
  [Check Home Blueprint]   — pulls Home page blueprint
  [Check AI Hub Blueprint] — pulls AI Hub blueprint
  [Clear Chat]             — clears SChatMessage for this session

BOTTOM SECTION: "Test Results" header
Shows last 5 TestLog records:
  Each row: test_name + status badge (green=pass, red=fail, amber=pending)
  Click row = expand full result

────────────────────────────────────────────────────
CENTRE PANEL — CHAT FEED
────────────────────────────────────────────────────

TOP BAR:
  Title: "AI Hub" (Exo 2, 18px, bold, #5e50fb)
  Status dots in a row:
    ● Simpee    (green if function responds, grey if not)
    ● Copilot   (blue — manual toggle for now)
    ● Builder   (grey — standby)
  Small text: "Command centre — type anything below"

CHAT MESSAGES (scrollable, fills centre):
  User message:
    Right-aligned bubble
    Background: #5e50fb
    Text: white
    Font: Montserrat 13px
    Timestamp below in muted

  AI response — rendered as CARDS not plain text:
    Card 1 — ANALYSIS (white bg, #e6e6e6 border, left-aligned)
      Header: "SIMPEE — Analysis" (violet, 10px uppercase)
      Body: what Simpee understood from the instruction

    Card 2 — SUGGESTION (white bg)
      Header: "SIMPEE — Suggestion"
      Body: recommended approach or answer

    Card 3 — CODE / BUILDER BRIEF (bg #fffbeb, border #fcd34d)
      Header: "CODE READY" or "BUILDER BRIEF"
      Body: the actual code or brief in a code block
      Buttons below: [COPY] [MARK AS TESTED] [DEPLOY TO 5S PORTAL]

  System message:
    Centre-aligned, italic, grey — e.g. "Session started", "Diagnostic complete"

INPUT BAR (pinned to bottom of centre panel):
  Intent chips row above input (single select, highlighted when chosen):
    [Diagnose] [Build] [Fix Bug] [Connect] [Brainstorm] [Ask]

  Text input:
    Placeholder: "Type your instruction, question, or command..."
    Full width, rounded, Montserrat 13px
    Ctrl+Enter or SEND button to submit

  ON SEND:
    1. Save to SChatMessage immediately (sender_type="user")
    2. Show typing indicator (3 animated dots, Simpee avatar)
    3. POST to https://simpee-62ac123d.base44.app/functions/aiCommandCentre
       Body: { instruction: "[INTENT] message text", posted_by: "Kieran" }
    4. Save response to SChatMessage (sender_type="ai")
    5. Render response as 3 cards (Analysis + Suggestion + Code)
    6. If intent was "Diagnose" or "Fix Bug" → also save to TestLog

────────────────────────────────────────────────────
RIGHT PANEL — CODE PREVIEW + DEPLOY
────────────────────────────────────────────────────

TOP: "Code Preview" header (Exo 2, violet)

PREVIEW AREA:
  Dark background (#1a1a1f)
  Monospace white text
  Shows the most recent CODE READY card content
  Syntax highlighted if possible
  Scrollable

STATUS BADGE below preview:
  [NOT TESTED] amber — default
  [TESTED — PASS] green — after Mark as Tested clicked
  [TESTED — FAIL] red — if marked failed

BUTTONS:
  [COPY CODE]         — copies preview to clipboard
  [MARK AS TESTED]    — opens mini modal: Pass / Fail + notes
                        saves to TestLog entity
  [DEPLOY TO 5S PORTAL] — only enabled when status = TESTED PASS
                          shows confirmation modal:
                          "Are you sure? This will update the live 5S Portal."
                          Confirm → posts builder brief to real portal NoticeBoard

DEPLOY LOG at bottom:
  Last 3 deploy actions with timestamp + what was deployed

═══════════════════════════════════════════════════════
DESIGN SYSTEM (same as 5S Portal — must match exactly)
═══════════════════════════════════════════════════════

Background:    #e8e6fe (Lavender Wash)
Cards/panels:  #ffffff (White)
Left panel bg: #f5f4fe (slightly tinted)
Accent:        #5e50fb (Violet)
Soft:          #bab4fd (Soft Lilac)
Body text:     #1a1a1f
Muted:         #9896ad
Code bg:       #1a1a1f
Code text:     #e8e6fe
Headlines:     Exo 2 or Exo, bold
Body font:     Montserrat
Border radius: 12px cards, 8px buttons, 6px chips
Shadow:        0 2px 8px rgba(94,80,251,0.06)
No emoji. No cartoon icons. Text symbols only.

═══════════════════════════════════════════════════════
WHAT SIMPEE WILL CHECK AFTER YOU BUILD THIS
═══════════════════════════════════════════════════════

CHECKPOINT 1 — Does the page render without errors?
CHECKPOINT 2 — Does sending a message save to SChatMessage entity?
CHECKPOINT 3 — Does the aiCommandCentre function respond?
CHECKPOINT 4 — Does the response render as 3 cards (not raw JSON)?
CHECKPOINT 5 — Does COPY CODE work?
CHECKPOINT 6 — Does MARK AS TESTED save to TestLog?
CHECKPOINT 7 — Is DEPLOY button disabled until tested?
CHECKPOINT 8 — Does DEPLOY post a notice to 5S Portal NoticeBoard?

All 8 must pass before we merge AI Hub into the real 5S Portal.

═══════════════════════════════════════════════════════
BUILDER PASTE INSTRUCTIONS
═══════════════════════════════════════════════════════

1. Create a NEW Base44 app called "AI Hub Test"
2. Add entity: SChatMessage (fields above)
3. Add entity: TestLog (fields above)
4. Create one page: AIHub (route: /)
5. Paste this blueprint to the builder AI chat
6. Tell builder: "Build exactly as described. Use SIMPLEX-ITY
   design system. No emoji. Exo 2 headlines, Montserrat body,
   #e8e6fe background, #5e50fb accent, white cards."
7. Once built, share the app URL with Simpee for validation.
