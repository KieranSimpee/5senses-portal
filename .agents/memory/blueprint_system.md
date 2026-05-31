# BLUEPRINT MANAGEMENT SYSTEM
# 5S Portal — Diagnostic + Build Framework
# Deployed: 31 May 2026, 19:28 HKT

## WORKFLOW

When Kieran requests a build:
1. Post Notice with section="backend" + instruction in content
2. Automation triggers → Simpee reads notice
3. Simpee runs DIAGNOSTIC CHECK (extract dependencies, validate entities)
4. If diagnostics pass → write complete code
5. If diagnostics fail → post ERROR REPORT with fixes needed
6. Post "CODE READY" notice with ready-to-paste code
7. Kieran pastes code into builder
8. Record every blueprint in BuildProject entity for history/alignment

---

## DIAGNOSTIC FRAMEWORK

### Entity Dependency Map
Each page has required entities. Before building, check:

**Home Page:**
- CalendarEvent (must have 1+ records)
- NoticeBoard (must have 1+ records)  
- TeamMember (must have role field)
STATUS: ✅ All present

**AI Hub Page:**
- SChatMessage (can be empty, will auto-populate)
- FunctionRequest (can be empty, diagnostic storage)
STATUS: ✅ All present

**Dashboard:**
- ComplianceItem (6 records) ✅
- Expense (23 records) ✅
- Invoice (3 records) ✅
- BankAccount (3 records) ✅

**Finance:**
- Expense (23 records) ✅
- BankAccount (3 records) ✅
- VaultItem (22 records) ✅

**Compliance:**
- ComplianceItem (6 records) ✅

**HR:**
- HRRecord (4 records) ✅
- TeamMember (3 records) ✅

**Vault:**
- VaultItem (22 records) ✅

**Invoices:**
- Invoice (3 records) ✅

---

## DIAGNOSTIC CHECKS

Before EVERY build, Simpee runs:

```
CHECK 1: Do all required entities exist?
  → If NO entity: STOP, post error
  
CHECK 2: Do they have data (or is empty OK)?
  → Some entities can be empty (SChatMessage, BuildProject)
  → Others must have records (ComplianceItem, Expense, etc.)
  → If critical entity empty: WARN
  
CHECK 3: Are the backend functions responsive?
  → POST to aiCommandCentre
  → POST to processSChatInstruction
  → If not 200: STOP, post error
  
CHECK 4: Can we write to Notice entity?
  → Test write, test read, clean up
  → If write fails: STOP
```

If ALL CHECKS PASS → write code
If ANY CHECK FAILS → post diagnostic report with fixes

---

## ERROR HANDLING

### When Diagnostic Fails

Post a Notice with:
- title: "⚠️ BUILD BLOCKED — [issue]"
- section: "error"
- posted_by: "Simpee"
- content: detailed error + steps to fix

Example:
```
⚠️ BUILD BLOCKED — Missing CalendarEvent Data

Issue: CalendarEvent entity exists but has 0 records.
Home page needs at least 1 event to display calendar section.

Fix:
1. Go to portal → Calendar tab
2. Click "Add Event"
3. Create a test event (any title, any date)
4. Try the build again

Once fixed, reply: @Simpee rebuild home
```

---

## BLUEPRINT RECORD SYSTEM

Every successful build is logged to BuildProject:

```json
{
  "name": "Home Page",
  "category": "page",
  "audience": "all_users",
  "status": "deployed",
  "priority": "high",
  "due_date": "2026-05-31",
  "description": "Landing page with calendar, notices, AI Hub entry",
  "notes": "v1.0 — 4 sections, all SIMPLEX-ITY design system",
  "progress": 100
}
```

This creates a versioned, searchable record of every page built.

---

## ALIGNMENT PROTOCOL

When Kieran wants to update a page:

1. Copy the Blueprint Brief (from Master Blueprint document)
2. Paste into AI Hub chat
3. Add changes: "Change X to Y"
4. Simpee runs diagnostic
5. If pass → generates code with change applied
6. Kieran pastes into builder
7. Old blueprint is archived, new blueprint recorded

This ensures:
- ✅ Everyone (Kieran, Simpee, Builder AI) has the same blueprint
- ✅ All versions are recorded
- ✅ No misalignment
- ✅ Easy rollback if needed

---

## CURRENT SYSTEM STATUS

All systems operational:
- ✅ Notice entity (read/write)
- ✅ BuildProject entity (ready for blueprint storage)
- ✅ FunctionRequest entity (diagnostic storage)
- ✅ Backend functions (aiCommandCentre, processSChatInstruction)
- ✅ Diagnostic framework deployed

Ready for blueprint-driven builds.

