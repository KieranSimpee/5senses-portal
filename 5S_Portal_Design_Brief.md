# 5S Portal — UI Redesign Brief
## Based on SIMPLEX-ITY Official Design System (simplex-ity.fluentlab.co)
### Version: May 2026 | Prepared by: Simpee for Backend AI

---

## 1. DESIGN PHILOSOPHY

Clean, minimal, professional. White surfaces on a soft lavender background. Think modern SaaS dashboard — not dark mode, not neon. Light, airy, confident.

No emoji icons anywhere in the UI. Use clean text labels only.
No gradient backgrounds on page content areas. Gradients only on the logo mark.
No rounded "pill" navigation buttons with emoji. Nav items are simple text rows.

---

## 2. COLOR PALETTE (exact hex values)

| Token | Hex | Usage |
|-------|-----|-------|
| `accentViolet` | `#5e50fb` | Primary buttons, active nav, links, CTAs |
| `primaryLilac` | `#8c82fc` | Secondary accent, eyebrow labels, icons |
| `softLilac` | `#bab4fd` | Hover states, active backgrounds, borders on focus |
| `lavenderWash` | `#e8e6fe` | Page background, secondary button bg, tag bg |
| `white` | `#ffffff` | All card surfaces, sidebar, topbar |
| `neutralGrey` | `#e6e6e6` | Card borders, dividers, input borders |
| `bodyText` | `#1a1a1f` | All primary text |
| `textSecondary` | `#5a5870` | Subtext, metadata, descriptions |
| `textMuted` | `#9896ad` | Placeholder text, eyebrow labels, timestamps |

**Shadows (use these exactly — lilac-tinted, never grey):**
- xs: `0 1px 2px rgba(140,130,252,0.06)`
- sm: `0 2px 8px rgba(140,130,252,0.10)` ← default for all cards
- md: `0 4px 16px rgba(140,130,252,0.12)` ← hover state for cards
- lg: `0 8px 32px rgba(140,130,252,0.14)`

---

## 3. TYPOGRAPHY

**Font stack:**
- Headlines / Section titles: `'Exo 2', 'Exo', 'Montserrat', sans-serif`
- Body / Everything else: `'Montserrat', 'Calibri', system-ui, sans-serif`

**Type scale:**
| Use | Size | Weight | Family |
|-----|------|--------|--------|
| Page title (h1) | 26px | 800 | Exo 2 |
| Card title | 15px | 700 | Exo 2 |
| Eyebrow label | 9px | 700 | Exo 2 |
| Body text | 13px | 400 | Montserrat |
| Small label | 12px | 600 | Montserrat |
| Micro text | 10px | 400–500 | Montserrat |

**Eyebrow labels** (above every section/card title):
- ALL CAPS, letter-spacing: 1.8px, color: `#9896ad`, font-size: 9px, font-family: Exo 2
- Example: `COMPLIANCE · OVERDUE` or `DOCUMENTS · RECENT`

---

## 4. BORDER RADIUS

- Cards: `12px`
- Buttons (primary): `8px`
- Buttons (small/tag): `20px` (pill)
- Input fields: `8px`
- Logo mark: `9px`
- Sidebar avatar: `50%`

---

## 5. APP SHELL — SIDEBAR

**Style:** White background (`#ffffff`), right border `1px solid #e6e6e6`, shadow `2px 0 12px rgba(140,130,252,0.07)`

**Width:** 232px open, 0px collapsed (smooth transition `0.22s cubic-bezier(.22,1,.36,1)`)

**Logo area** (top of sidebar):
- Padding: 22px 20px 18px
- Bottom border: `1px solid #e6e6e6`
- Logo mark: 36x36px, border-radius 9px, gradient `135deg, #5e50fb → #8c82fc`, white text "5S", font-weight 800, box-shadow `0 4px 12px rgba(94,80,251,0.3)`
- Company name: "SIMPLEX-ITY" — Exo 2, 800, 13px, letter-spacing 1.8px, uppercase, color `#1a1a1f`
- Sub-label: "5S Portal" — 10px, color `#9896ad`, font-weight 500

**Section dividers** (between nav groups):
- Text: e.g. "OPERATIONS", "PLATFORM", "BUILD"
- Style: 9px, weight 700, color `#9896ad`, uppercase, letter-spacing 1.8px
- Padding: 16px 10px 5px

**Nav items:**
- Padding: 8px 12px
- Border-radius: 8px
- Font: Montserrat, 13px
- Inactive: color `#5a5870`, background transparent
- Active: color `#5e50fb`, background `#e8e6fe`, font-weight 600
- Active indicator: small 5px dot (border-radius 50%, color `#5e50fb`) aligned to the right
- NO left border accent. NO emoji icons. Text labels only.
- Hover: background `#e8e6fe` at 50% opacity

**Footer** (bottom of sidebar):
- Border-top: `1px solid #e6e6e6`, padding 14px 20px
- Avatar circle: 30px diameter, background `#e8e6fe`, border `2px solid #bab4fd`, letter "K", color `#5e50fb`, font-weight 700
- Name: "Kieran Li" — 12px, weight 600, color `#1a1a1f`
- Sub: "Admin · 5SENSESBEAUTY" — 10px, color `#9896ad`

---

## 6. APP SHELL — TOPBAR

**Style:** White background, border-bottom `1px solid #e6e6e6`, height 54px, shadow `0 1px 4px rgba(140,130,252,0.06)`

**Left:** Hamburger toggle button — border `1px solid #e6e6e6`, border-radius 7px, color `#5a5870`, 15px, padding 5px 9px

**Center (breadcrumb):**
- "5S Portal" in `#9896ad`, 12px
- "›" separator in `#e6e6e6`, 12px  
- Current page name in `#1a1a1f`, 13px, weight 600, Exo 2 font

**Right:** Status pill — "SIMPLEX-ITY HQ", 11px, color `#5e50fb`, background `#e8e6fe`, border `1px solid #bab4fd`, padding 4px 12px, border-radius 20px, font-weight 600

---

## 7. CARDS

**Default card style:**
```
background: #ffffff
border-radius: 12px
border: 1px solid #e6e6e6
box-shadow: 0 2px 8px rgba(140,130,252,0.10)
padding: 20px 22px
```

**Hover state (clickable cards):**
```
box-shadow: 0 4px 16px rgba(140,130,252,0.12)
transform: translateY(-1px)
transition: all 0.15s ease
```

**Stat cards** (dashboard top row):
- Icon container: 36x36px, border-radius 9px, background = accentColor at 10% opacity, contains emoji-free icon or letter
- Value: Exo 2, 24px, weight 800, color = accentColor
- Sub-label: 11px, color `#9896ad`
- Main label: 12px, weight 600, color `#1a1a1f`, margin-top 12px
- Progress bar: 2px height, full width, background = accentColor at 18% opacity; filled portion (40%) = accentColor solid

---

## 8. TAGS / STATUS PILLS

```
display: inline-flex
padding: 2px 8px
border-radius: 20px
font-size: 10px
font-weight: 600
background: {color}15   (15% opacity of the status color)
color: {color}
border: 1px solid {color}30
```

**Status colors:**
- Overdue / Error: `#ef4444`
- Warning / Due soon: `#f59e0b`
- Active / Good: `#16a34a`
- In Progress: `#8c82fc`
- Pending: `#f59e0b`
- Paid / Done: `#16a34a`

---

## 9. BUTTONS

**Primary button:**
```
background: #5e50fb
color: #ffffff
border: none
border-radius: 8px
padding: 10px 20px
font-family: Montserrat
font-size: 13px
font-weight: 600
cursor: pointer
```

**Secondary / "View All" button:**
```
background: #e8e6fe
color: #5e50fb
border: 1px solid #bab4fd
border-radius: 8px
padding: 9px
width: 100%
font-size: 12px
font-weight: 600
margin-top: 14px
```
Hover: background `#bab4fd` at 60% opacity

**Outline / tag button:**
```
background: #e8e6fe
border: 1px solid #bab4fd
border-radius: 8px
color: #5e50fb
font-size: 12px
font-weight: 600
padding: 9px 10px
```
Hover: background `#bab4fd` at 50%, border-color `#8c82fc`

---

## 10. PAGE LAYOUT

**Page wrapper:**
```
padding: 28px 32px
max-width: 1200px
font-family: 'Montserrat', sans-serif
color: #1a1a1f
background: transparent (inherits #e8e6fe from shell)
```

**Page header pattern:**
1. Eyebrow: e.g. "SIMPLEX-ITY HQ" — 10px, Exo 2, 700, uppercase, letter-spacing 1.8, color `#9896ad`
2. H1 title: 26px, Exo 2, 800, color `#1a1a1f`
3. Subtitle: 13px, Montserrat, color `#9896ad`

**Grid layouts:**
- 4-column stat row: `grid-template-columns: repeat(4, 1fr)`, gap 14px
- 2-column content: `grid-template-columns: 1fr 1fr`, gap 18px

---

## 11. WHAT TO REMOVE / CHANGE

| Remove | Replace with |
|--------|-------------|
| All emoji icons in sidebar nav | Text-only labels |
| All emoji in card headers | Text eyebrow labels (e.g. "COMPLIANCE · OVERDUE") |
| Dark sidebar (`#13102a`) | White sidebar (`#ffffff`) |
| Neon/gradient nav active state | Soft lavender bg (`#e8e6fe`) with violet text |
| Left border accent on active nav | Small 5px dot on the right side |
| `sidebarBg: "#13102a"` | `#ffffff` |
| `navText: "#8885a0"` | `#5a5870` |
| `navActiveText: "#bab4fd"` | `#5e50fb` |
| `navActive: "rgba(140,130,252,0.18)"` | `#e8e6fe` |

---

## 12. SAMPLE — HOW A SECTION SHOULD LOOK

```jsx
// Eyebrow + content block pattern
<div>
  <div style={{
    fontFamily: "'Exo 2', sans-serif",
    fontSize: 9, fontWeight: 700,
    color: "#9896ad",
    textTransform: "uppercase",
    letterSpacing: "1.8px",
    marginBottom: 10,
  }}>
    COMPLIANCE · OVERDUE
  </div>
  
  <div style={{
    background: "#ffffff",
    borderRadius: 12,
    border: "1px solid #e6e6e6",
    boxShadow: "0 2px 8px rgba(140,130,252,0.10)",
    padding: "20px 22px",
  }}>
    {/* content */}
  </div>
</div>
```

---

## 13. FONTS TO IMPORT

Add this to index.html or global CSS:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600;700;800&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Or in CSS:
```css
@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600;700;800&family=Montserrat:wght@400;500;600;700&display=swap');
```

---

*End of brief. Apply these rules consistently across ALL pages: Dashboard, Compliance, Finance, Invoices, Documents, Vault, Notes, Brands, Influencers, Campaigns, Calendar, Revenue, Build Tracker, Critical Path.*
