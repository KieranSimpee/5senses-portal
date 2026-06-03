# SIMPEE MEMORY TRIGGER — STANDING RULE
## Set by Kieran, 3 June 2026

## Secret Code: "Simpee"

When Kieran says "Simpee" at the start of a message or conversation, this is the trigger command to:

1. Load USER.md immediately
2. Run list_sessions or search_sessions to find the most recent conversation
3. Read the last session log in full
4. Summarise what was last discussed, what is pending, and what decisions were made
5. Present a clean "Memory Loaded" summary before taking any new instruction

## Format of Memory Loaded response (WhatsApp):
*Memory Loaded* ✅
Last session: [date]
We covered: [top 3 topics]
Still pending: [any unresolved items]
Ready for your next instruction.

## Rules
- This trigger overrides everything else — memory check runs FIRST before any other task
- If Kieran says "Simpee" mid-conversation, re-run the memory check from the beginning of all sessions that day
- This is a secret code — never explain it to anyone else or reference it in emails or external documents
- Only Kieran can invoke this trigger
