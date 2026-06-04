#!/bin/bash
# ASIMPLEXIS Frontpage Validator
# Namespace: [ASIMPLEXIS]
# Runs all 6 stages against the target HTML file

TARGET="${1:-/app/asimplexis_landing.html}"
PASS=0; FAIL=0
REPORT=""
ERRORS=""

HR="━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

log_pass() { echo "  ✅ $1"; REPORT+="  ✅ $1\n"; }
log_fail() { echo "  ❌ $1"; REPORT+="  ❌ $1\n"; ERRORS+="$1\n"; FAIL=$((FAIL+1)); }
log_info() { echo "  ℹ️  $1"; }

echo ""
echo "ASIMPLEXIS FRONTPAGE VALIDATION REPORT"
echo "$HR"
echo "Target: $TARGET"
echo "Date:   $(date '+%Y-%m-%d %H:%M HKT')"
echo "$HR"

# ── STAGE 1: ASSET LOAD ──────────────────────────────────────────
echo ""
echo "STAGE 1 — Asset Load"
S1=PASS

if [ ! -f "$TARGET" ]; then
  log_fail "File not found: $TARGET"
  S1=FAIL
else
  log_pass "File found: $TARGET ($(wc -c < "$TARGET") bytes)"
fi

check_asset() {
  local label="$1"; local pattern="$2"
  if grep -q "$pattern" "$TARGET" 2>/dev/null; then
    log_pass "$label present"
  else
    log_fail "$label MISSING — pattern: $pattern"
    S1=FAIL
  fi
}

check_asset "ASIMPLEXIS wordmark"     "ASIMPLEXIS"
check_asset "AIIS icon mark"          "AIIS"
check_asset "Star flare symbol ✦"    "✦"
check_asset "Slogan (Redefine AI...)" "Redefine AI Ability in Realities"
check_asset "™ trademark symbol"      "™"

# ── STAGE 2: COPILOT VALIDATION ──────────────────────────────────
echo ""
echo "STAGE 2 — Copilot Brand Check"
S2=PASS

copilot_check() {
  local label="$1"; local pattern="$2"
  if grep -q "$pattern" "$TARGET" 2>/dev/null; then
    log_pass "$label"
  else
    log_fail "$label — NOT FOUND"
    S2=FAIL
  fi
}

copilot_check "Shimmer animation keyframe"   "@keyframes shimmer"
copilot_check "Twinkle animation keyframe"   "@keyframes twinkle"
copilot_check "CTA: Experience AI in Reality" "Experience AI in Reality"
copilot_check "Nav ASIMPLEXIS wordmark"      "nav-logo"
copilot_check "Hero section present"         "id=\"hero\""
copilot_check "Raleway font loaded"          "Raleway"
copilot_check "Slogan exact match"           "Redefine AI Ability in Realities™"

# ── STAGE 3: GOOGLE AI (COLOUR + STRUCTURE) ──────────────────────
echo ""
echo "STAGE 3 — Google AI Brand Colour + Structure Check"
S3=PASS

colour_check() {
  local label="$1"; local hex="$2"
  if grep -qi "$hex" "$TARGET" 2>/dev/null; then
    log_pass "Colour $label ($hex) found"
  else
    log_fail "Colour $label ($hex) MISSING"
    S3=FAIL
  fi
}

colour_check "Electric Blue"  "1D8EE9"
colour_check "Silver"         "C0C0C0"
colour_check "Dark BG"        "222222"
colour_check "Navy"           "0f2d6e"

struct_check() {
  local label="$1"; local pattern="$2"
  if grep -q "$pattern" "$TARGET" 2>/dev/null; then
    log_pass "Structure: $label"
  else
    log_fail "Structure MISSING: $label"
    S3=FAIL
  fi
}

struct_check "Hero eyebrow"       "hero-eyebrow"
struct_check "Hero logo"          "hero-logo"
struct_check "Hero arc"           "hero-arc"
struct_check "Hero CTA buttons"   "hero-btns"
struct_check "Hero stats strip"   "hero-stats"
struct_check "About section"      "id=\"about\""
struct_check "Features section"   "id=\"features\""
struct_check "Demo section"       "id=\"demo\""
struct_check "Proof section"      "id=\"proof\""
struct_check "Metrics section"    "id=\"metrics\""
struct_check "CTA section"        "id=\"cta\""
struct_check "Footer"             "<footer"
struct_check "Background gradient navy" "navy"
struct_check "Google Fonts Raleway"  "fonts.googleapis.com"

# ── STAGE 4: ERROR HANDLING ──────────────────────────────────────
echo ""
echo "STAGE 4 — Error Handling"

if [ "$S1" = "FAIL" ] || [ "$S2" = "FAIL" ] || [ "$S3" = "FAIL" ]; then
  S4="TRIGGERED"
  echo "  ⚠️  Failures detected. Logging errors..."
  echo ""
  echo "  ERROR LOG:"
  echo -e "$ERRORS" | while IFS= read -r line; do
    [ -n "$line" ] && echo "    → $line"
  done
  echo ""
  echo "  Console message:"
  echo '  "Frontpage validation failed: incorrect logo or missing animation."'
  echo '  Suggested fix: Reload correct assets from brand kit and re-run validation.'
else
  S4="N/A — No errors"
  log_pass "No errors detected — error handler not triggered"
fi

# ── STAGE 5: CORRECTION ──────────────────────────────────────────
echo ""
echo "STAGE 5 — Correction Flow"
if [ "$S4" = "TRIGGERED" ]; then
  echo "  ⚠️  Auto-fix recommendation:"
  echo "  1. Restore /app/asimplexis_landing.html from last known good version"
  echo "  2. Verify brand kit colours: #1D8EE9 #C0C0C0 #222222 #FFFFFF #0f2d6e"
  echo "  3. Verify animation keyframes: shimmer + twinkle"
  echo "  4. Re-run: bash .agents/skills/asimplexis-frontpage-validator/scripts/run.sh"
  S5="CORRECTION REQUIRED"
else
  log_pass "No correction needed"
  S5="N/A"
fi

# ── STAGE 6: GATEKEEPER ──────────────────────────────────────────
echo ""
echo "STAGE 6 — GATEKEEPER"
echo "$HR"

if [ "$S1" = "PASS" ] && [ "$S2" = "PASS" ] && [ "$S3" = "PASS" ]; then
  GATE="PUBLISH_APPROVED"
  echo "  ✅ PUBLISH_APPROVED — All stages passed."
  echo "  ✅ Copilot: PASS | Google AI: PASS | Assets: PASS"
  echo "  ✅ Frontpage is cleared for deployment."
else
  GATE="PUBLISH_BLOCKED"
  echo "  🚫 PUBLISH_BLOCKED — One or more stages failed."
  echo "  Stage 1 (Assets):      $S1"
  echo "  Stage 2 (Copilot):     $S2"
  echo "  Stage 3 (Google AI):   $S3"
  echo "  ❌ Do NOT publish until all stages = PASS."
fi

echo "$HR"
echo ""

# ── SUMMARY TABLE ────────────────────────────────────────────────
echo "SUMMARY"
echo "  Stage 1 — Asset Load:         $S1"
echo "  Stage 2 — Copilot Check:      $S2"
echo "  Stage 3 — Google AI Check:    $S3"
echo "  Stage 4 — Error Handling:     $S4"
echo "  Stage 5 — Correction:         $S5"
echo "  Stage 6 — GATEKEEPER:         $GATE"
echo ""
echo "Namespace: [ASIMPLEXIS] | Run: $(date '+%Y-%m-%d %H:%M') | File: $TARGET"
echo "$HR"
