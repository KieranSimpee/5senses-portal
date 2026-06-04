# SKILL: ASIMPLEXIS Frontpage Validator
**Namespace:** [ASIMPLEXIS]
**Version:** 1.0
**Created:** 4 June 2026
**Author:** Simpee Superagent

## Purpose
Validate the ASIMPLEXIS landing page before any release or deployment.
Ensures correct brand logo, animation sequence, colour palette, and slogan
are all present and correct. Acts as a gatekeeper — page MUST pass all
checks before publish is allowed.

## Trigger
Run this skill whenever:
- A new version of the ASIMPLEXIS landing page is built
- Any HTML/JSX file for the frontpage is modified
- Before any deployment or publish action on the Asimplexis app
- When Kieran says "validate frontpage", "run frontpage check", or "gatekeeper"

## Brand Kit Reference (Source of Truth)
- Primary Blue:   #1D8EE9
- Silver:         #C0C0C0
- Dark BG:        #222222
- White:          #FFFFFF
- Navy:           #0f2d6e
- Logo wordmark:  ASIMPLEXIS (Raleway Bold, white/silver gradient)
- Icon mark:      AIIS ✦
- Slogan:         "Redefine AI Ability in Realities™"
- Animation:      ASIMPLEXIS → AIIS ✦ with star flare (twinkle keyframe)
- Font:           Raleway Bold (headlines), Raleway Regular (body)

## Workflow

### STAGE 1 — Asset Load
Load and confirm presence of:
1. Full wordmark: "ASIMPLEXIS" text in hero
2. Icon mark: "AIIS" + ✦ star symbol
3. Animation: CSS keyframes for shimmer + twinkle
4. Slogan: "Redefine AI Ability in Realities™"

### STAGE 2 — Copilot Validation (Internal AI Check)
Check each item against brand kit reference:
- Logo path / text rendering matches brand spec
- Animation sequence (shimmer + twinkle) exists in hero section
- Slogan exact match including ™ symbol
- Nav bar contains ASIMPLEXIS wordmark + ✦
- CTA button text: "Experience AI in Reality"
Output: copilot_status = PASS | FAIL + reason

### STAGE 3 — Google AI Validation (Cross-check)
- Cross-check rendered colour values against palette (#1D8EE9, #C0C0C0, #222222)
- Verify star flare animation executes on load (twinkle keyframe present)
- Confirm background gradient uses navy → dark (#0f2d6e → #0a1628)
- Verify hero section structure: eyebrow → logo → AIIS → arc → tagline → CTA
Output: google_status = PASS | FAIL + reason

### STAGE 4 — Error Handling
IF copilot_status = FAIL OR google_status = FAIL:
  - Log: "Brand logo/animation mismatch detected."
  - Reload assets from /brandkit/ reference
  - Re-run validation (max 3 retries)
  - Report specific failure reason to Kieran
ELSE:
  - Proceed to Stage 5

### STAGE 5 — Correction Flow
On failure:
  - Display in console: "Frontpage validation failed: incorrect logo or missing animation."
  - Suggest: "Reload correct assets from brand kit and re-run validation."
  - Auto-fix: Replace incorrect values with validated brand kit reference values
  - Re-run from Stage 1

### STAGE 6 — Gatekeeper
ONLY mark page as publish-ready if:
  - copilot_status = PASS
  - google_status = PASS
  - All 4 brand assets confirmed present
Output: PUBLISH_APPROVED ✅ or PUBLISH_BLOCKED 🚫 + reason

## Output Format
```
ASIMPLEXIS FRONTPAGE VALIDATION REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Stage 1 — Asset Load:      [PASS/FAIL]
Stage 2 — Copilot Check:   [PASS/FAIL]  reason
Stage 3 — Google AI Check: [PASS/FAIL]  reason
Stage 4 — Error Handling:  [N/A / triggered]
Stage 5 — Correction:      [N/A / applied]
Stage 6 — GATEKEEPER:      [PUBLISH_APPROVED ✅ / PUBLISH_BLOCKED 🚫]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Files to Validate
Primary: /app/asimplexis_landing.html
JSX equivalent: any page file in Asimplexis app (6a1c237bd9f5ff04b6ac7a73) named Home/Landing/Index

## Notes
- This skill must run BEFORE any builder is instructed to publish or deploy
- Namespace: [ASIMPLEXIS] — never cross-run against [5S-PORTAL] or [SIMPLEX-ITY]
- Checkpoint must be saved to memory after every run (PASS or FAIL)
