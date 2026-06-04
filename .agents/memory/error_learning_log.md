# SIMPEE ERROR LEARNING LOG
**Maintained by:** Simpee Superagent
**Scope:** [GLOBAL] — all namespaces, all projects
**Purpose:** Catch errors, log root causes, record solutions once solved.
Simpee uses this log to lead other AI (CodeRabbit, builder AI) to avoid repeating the same mistakes.

---

## FORMAT
Each entry:
- ERROR ID
- Namespace + date
- What happened
- Root cause (confirmed / suspected)
- Status: OPEN / RESOLVED
- Solution (filled when resolved)
- Prevention rule (added to workflow once resolved)

---

## ERROR LOG

---

### ERR-001
*Namespace:* [ASIMPLEXIS]
*Date:* 4 June 2026
*Severity:* HIGH
*Status:* OPEN — awaiting CodeRabbit confirmation

*What happened:*
ASIMPLEXIS brand logo (wordmark + AIIS ✦) and CSS animations (shimmer, twinkle)
are confirmed present in HTML source and pass all 16 brand validation checks,
but do not render correctly when the page is deployed inside the Base44 app
builder or viewed in certain browser contexts.

*Symptoms:*
1. Logo text appears invisible or plain white (no gradient metallic effect)
2. Star ✦ does not animate (twinkle keyframe not firing)
3. Logo shimmer glow not visible
4. Possible: entire hero section appears unstyled

*Suspected Root Causes (in order of likelihood):*

CAUSE A — Google Fonts CDN blocked [LIKELY]
fonts.googleapis.com request for Raleway may be blocked in the deployment
context. Without Raleway, the browser uses a fallback font that does not
support -webkit-background-clip: text. Result: gradient text effect silently
fails and logo text becomes invisible (transparent fill on transparent bg).
Confidence: HIGH

CAUSE B — -webkit-text-fill-color stripped by CSS sanitiser [LIKELY]
The gradient text effect requires BOTH:
  -webkit-background-clip: text
  -webkit-text-fill-color: transparent
If a CSS sanitiser or framework removes webkit-prefixed properties, the text
fill colour reverts to the default (white) but the clip is gone — logo looks
wrong or invisible.
Confidence: HIGH

CAUSE C — @keyframes scoped out in JSX context [MEDIUM]
CSS @keyframes defined inside a JSX <style> block may be scoped, hashed, or
removed by React's CSS-in-JS processor or Base44's style engine. Animation
names (shimmer, twinkle, ring-pulse) would then have no matching keyframe
definition and all animated elements would appear static.
Confidence: MEDIUM

CAUSE D — Text-only logo vs required SVG emblem [MEDIUM]
The ASIMPLEXIS brand kit references a metallic AIIS emblem with 3D-style
letterforms. Current implementation uses CSS-styled text only. The visual
output can never fully match a proper SVG/PNG logo asset. This is a design
gap, not a rendering bug, but contributes to "brand not showing correctly".
Confidence: MEDIUM

CAUSE E — animation + -webkit-text-fill-color conflict [LOW]
In some Chromium builds, applying animation to an element with
-webkit-text-fill-color: transparent can cause the element to flash or
disappear during the animation cycle. May explain intermittent visibility.
Confidence: LOW

*Current state:*
- HTML source: 16/16 brand checks PASS (Simpee validation confirmed)
- Deployed rendering: FAIL (logo/animation not correct)
- Gap: source ≠ rendered output → deployment/runtime issue

*Solution:* PENDING — awaiting CodeRabbit analysis on PR #1

*Prevention rule (draft — to be finalised on resolution):*
- Always embed fonts locally (base64 or self-hosted) for deployment contexts
  where external CDN may be blocked
- Always test gradient text with and without Raleway loaded
- Always add fallback: color: #FFFFFF as explicit property alongside
  -webkit-text-fill-color: transparent so text is visible if gradient fails
- For brand logos: prefer inline SVG over CSS text styling

---

### ERR-002
*Namespace:* [ASIMPLEXIS]
*Date:* 4 June 2026
*Severity:* MEDIUM
*Status:* RESOLVED ✅

*What happened:*
Homepage v1 was built using the SIMPLEX-ITY brand palette (lavender #e8e6fe,
violet #5e50fb) instead of the ASIMPLEXIS brand palette (electric blue #1D8EE9,
silver #C0C0C0, dark #222222).

*Root cause:*
CONFIRMED — Namespace confusion. Simpee has SIMPLEX-ITY design tokens stored
prominently in build_protocol.md rules. When generating a UI without an
explicit namespace tag check, the SIMPLEX-ITY palette was applied by default.

*Solution:*
APPLIED ✅
1. Rebuilt homepage v2 with correct ASIMPLEXIS brand tokens
2. Added namespace-specific brand kit rules to Stage 6 of Master Workflow
3. Stage 6 now checks different colour sets depending on namespace tag:
   [ASIMPLEXIS] → #1D8EE9 #C0C0C0 #222222 #0f2d6e
   [5S-PORTAL] / [SIMPLEX-ITY] → #5e50fb #8c82fc #e8e6fe
4. Workflow now requires namespace declaration before any UI build

*Prevention rule:*
ACTIVE ✅ — encoded in simpee-master-workflow Stage 6
Rule: "Before building any UI, confirm namespace tag. Apply only the
brand kit for that namespace. Never default to SIMPLEX-ITY palette."

---

### ERR-003
*Namespace:* [ASIMPLEXIS]
*Date:* 4 June 2026
*Severity:* LOW
*Status:* RESOLVED ✅

*What happened:*
PR creation to a new branch (feat/asimplexis-homepage-v2) returned HTTP 422
from GitHub API because the branch had no diff vs main at PR creation time —
files were pushed directly to main, not to the feature branch.

*Root cause:*
CONFIRMED — Files were committed to main branch directly, then a PR was
opened from a branch that pointed to the same SHA as main. GitHub correctly
rejected the PR as there was nothing to merge.

*Solution:*
APPLIED ✅
Investigation brief was posted as a comment on existing PR #1 instead.
CodeRabbit will still review all files as they are on main.

*Prevention rule:*
ACTIVE ✅
Rule: "When opening a PR for CodeRabbit review, push files to the feature
branch first, then open the PR. Do not push to main then try to PR from
an identical branch."

---

## LEARNING RULES (Active — Simpee enforces these on all AI collaborators)

LR-001: Always declare namespace before building UI. Never assume palette.
LR-002: Test gradient text rendering with font NOT loaded — add visible fallback.
LR-003: For deployment contexts, prefer self-hosted or inline fonts over CDN.
LR-004: Push to feature branch BEFORE opening PR, not after pushing to main.
LR-005: Brand source check PASS ≠ deployed rendering PASS. Always verify in runtime context.
LR-006: Log every error with root cause even if suspected. Update when confirmed.

---

## REINFORCEMENT INSTRUCTIONS FOR OTHER AI

When Simpee is collaborating with CodeRabbit, builder AI, or any other AI agent,
Simpee will share this log and enforce the following:

1. Before any CSS is written for ASIMPLEXIS: check LR-001 (namespace palette)
2. Before any font-dependent animation: check LR-002 and LR-003
3. Before any GitHub PR: check LR-004
4. After any deployment: verify LR-005 (source PASS ≠ render PASS)
5. All errors regardless of severity must be logged per this format

This log is the source of truth for all AI agents working on Kieran's projects.
No exceptions. No shortcuts.
