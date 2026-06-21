# 5S PORTAL — LIVING BLUEPRINT SYSTEM
# Version 1.0 | 31 May 2026 | Owner: Kieran Li | Agent: Simpee
#
# PURPOSE OF THIS SYSTEM
# ═══════════════════════════════════════════════════════════════
# 1. Every page has a blueprint stored in the portal backend
# 2. Before ANY build, run diagnostic first — fix issues, then build
# 3. After ANY build, update the blueprint record to reflect changes
# 4. Share blueprint to builder AI before asking it to build anything
# 5. Everyone (Simpee, Edge/Copilot, Builder AI) reads the SAME blueprint
#
# THE 3-STEP RULE (before every build session)
# ═══════════════════════════════════════════════════════════════
# STEP 1 — DIAGNOSE:  Ask Simpee "run diagnostic" → get health report
# STEP 2 — ALIGN:     Share relevant blueprint to builder AI
# STEP 3 — BUILD:     Builder executes, Simpee validates
#
# ═══════════════════════════════════════════════════════════════
# BLUEPRINT RECORD FORMAT (stored in BuildProject entity)
# ═══════════════════════════════════════════════════════════════
# Each page = one BuildProject record with these fields:
#
# name:        Page name (e.g. "Home", "AI Hub")
# category:    "page" | "function" | "connection" | "entity"
# audience:    Who can see it (Admin / Manager / Staff)
# status:      "live" | "in-progress" | "blank" | "broken" | "planned"
# priority:    1 (highest) → 5 (lowest)
# description: Full blueprint text (sections, data, permissions, purpose)
# notes:       Diagnostic notes, known issues, last updated
# progress:    0–100%

# ═══════════════════════════════════════════════════════════════
# DIAGNOSTIC CHECKS (Simpee runs these before every build)
# ═══════════════════════════════════════════════════════════════
# ✓ All required entities exist and have correct fields
# ✓ All backend functions respond with HTTP 200
# ✓ All nav routes map to a real page file
# ✓ Permission matrix matches TeamMember roles in DB
# ✓ No orphan records (e.g. CalendarEvent with missing fields)
# ✓ Blueprint version matches what builder last built
#
# IF DIAGNOSTIC FINDS AN ISSUE:
# → Simpee posts a BLOCKER notice to portal with exact fix
# → No building until blocker is resolved
# → Once resolved, Simpee marks it cleared and build proceeds

# ═══════════════════════════════════════════════════════════════
# CURRENT SYSTEM HEALTH (31 May 2026, 19:27 HKT)
# ═══════════════════════════════════════════════════════════════
# ✅ ComplianceItem:   6 records — HEALTHY
# ✅ Expense:          23 records — HEALTHY
# ✅ Invoice:          3 records — HEALTHY
# ✅ Project:          4 records — HEALTHY
# ✅ Brand:            2 records — HEALTHY
# ✅ TeamMember:       3 records — HEALTHY (Kieran, Loreen, Wilson)
# ✅ NoticeBoard:      10 records — HEALTHY
# ✅ CalendarEvent:    7 records — HEALTHY
# ✅ VaultItem:        22 records — HEALTHY
# ✅ BankAccount:      3 records — HEALTHY
# ✅ HRRecord:         4 records — HEALTHY
# ✅ Document:         23 records — HEALTHY
# ✅ Note:             6 records — HEALTHY
# ✅ SChatMessage:     0 records — HEALTHY (empty, ready)
# ✅ aiCommandCentre function:          LIVE & RESPONDING
# ✅ processSChatInstruction function:  LIVE & RESPONDING
#
# ⚠️  ISSUES FOUND:
# [ISSUE-001] Home page is BLANK — needs rebuild (Priority 1)
# [ISSUE-002] AIHubPage.jsx needs clean rebuild (Priority 2)
# [ISSUE-003] BuildProject entity not accessible via API — needs checking
# [ISSUE-004] SChatMessage feed not connected to any live UI
# [ISSUE-005] No OpenAI key — AI Hub responses are placeholder only
