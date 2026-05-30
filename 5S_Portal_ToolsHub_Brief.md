# 5S Portal — Tools Hub Page Brief
## For Backend AI | May 2026

---

## OVERVIEW

Build a **Tools Hub** page (`ToolsPage.jsx`) in the 5S Portal. This is a central launchpad for every tool, platform, and service that SIMPLEX-ITY / 5SENSESBEAUTY uses. 

Each tool tile shows:
- Service name
- Category badge
- Saved username (from VaultItem entity)
- Two buttons: **Open App** (external link, new tab) + **View Credentials** (opens vault record)

No iframe embedding — most tools block it (X-Frame-Options). Use redirect links only.

---

## NAVIGATION

In `App.jsx`, the existing `{ id: "tools", label: "Tools", icon: "..." }` nav item should point to this page. It's already in the NAV array — just make sure the router includes:
```jsx
{page === "tools" && <ToolsPage />}
```
And import:
```jsx
import ToolsPage from "./pages/ToolsPage";
```

---

## TOOLS DATA (hardcoded — all confirmed live)

Group tools into these categories:

### FINANCE & BANKING
| Tool | URL | Notes |
|------|-----|-------|
| Airwallex | https://app.airwallex.com | Main business banking, HKD + multi-currency |
| Microsoft 365 Admin | https://admin.microsoft.com | Office/email admin |

### DESIGN & BRAND
| Tool | URL | Notes |
|------|-----|-------|
| Looka Brand Kit | https://looka.com/dashboard | Logo, brand assets |
| Canva | https://www.canva.com | Design |

### WEBSITE & DOMAINS
| Tool | URL | Notes |
|------|-----|-------|
| GoDaddy | https://account.godaddy.com | Domain management |
| SiteGround | https://my.siteground.com | Web hosting |
| Squarespace | https://account.squarespace.com | Website builder |
| Shopify | https://admin.shopify.com | E-commerce |

### GOVERNMENT & CORPORATE
| Tool | URL | Notes |
|------|-----|-------|
| IRD (Tax) | https://www.ird.gov.hk/eng/ese/eservices.htm | HK Inland Revenue |
| CR (Companies Registry) | https://www.cr.gov.hk | Annual returns, filings |
| Reap Business | https://www.reapbusiness.com | Virtual office, company secretary |

### PLATFORM & DEV
| Tool | URL | Notes |
|------|-----|-------|
| Base44 | https://app.base44.com | 5S Portal builder |
| OneDrive | https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ | File storage |
| Outlook (kieran@5senses.global) | https://outlook.office.com | Primary email |
| Outlook (kieran.li@5sensesbeauty.com) | https://outlook.office.com | Secondary email |

### PARTNERSHIPS
| Tool | URL | Notes |
|------|-----|-------|
| FundFluent | https://fundfluent.com | Wilson Tai partnership |
| Banuba | https://www.banuba.com | AR beauty tech integration |

---

## PAGE LAYOUT

```
Eyebrow: SIMPLEX-ITY HQ
H1: Tools & Platforms
Subtitle: All tools, services and platforms used by SIMPLEX-ITY and 5SENSESBEAUTY.

Search bar (filter by name or category)

Section groups (one per category above):
  Category header (eyebrow style)
  Grid of tool cards (3 columns on desktop, 1 on mobile)
```

### Tool Card design:
```
White card, border-radius 12px, border 1px solid #e6e6e6
box-shadow: 0 2px 8px rgba(140,130,252,0.10)

Top row:
  - Left: Service name (Exo 2, 14px, 700, #1a1a1f)
  - Right: Category badge (pill, #e8e6fe bg, #5e50fb text, 10px)

Middle:
  - Username if available: "kieran@5senses.global" (12px, #9896ad)
  - Short description (11px, #9896ad)

Bottom (two buttons side by side):
  - "Open" → primary button (small), opens URL in new tab
  - "Credentials" → outline button (small), navigates to vault page filtered to this tool
    (pass the service_name as a prop/query so vault page can highlight/scroll to it)
```

---

## VAULT INTEGRATION

Each tool card's "Credentials" button should:
1. Call `setPage("vault")` 
2. Pass the `service_name` so VaultPage can pre-filter or highlight the matching record

In the VaultPage, add a prop `filterService` — if passed, auto-filter the list to show that service.

---

## ALSO: Split Brands section in the portal

The `BrandsPage.jsx` currently shows all brands in one list. Update it to show **two tabs** at the top:
- Tab 1: "SIMPLEX-ITY" — filter Brand records where `name === "SIMPLEX-ITY"`
- Tab 2: "5SENSESBEAUTY" — filter Brand records where `name === "5SENSESBEAUTY LIMITED"`

Each tab shows brand details: name, category, contact, status, notes.
Add an "Edit" button per record (admin only).

The two brand records are already created in the database with these IDs:
- SIMPLEX-ITY: `6a1aceb7cf0ee4755d5941a7`
- 5SENSESBEAUTY LIMITED: `6a1aceb7aefea133f5993c9c`

---

## BRAND RECORD FIELDS (for Brands page display)

```
name          → Brand name (large, Exo 2)
category      → e.g. "Marketing Services" / "Beauty & Retail"
status        → "Active" (green pill)
contact_name  → Person name
contact_email → Email (clickable mailto link)
country       → "Hong Kong"
notes         → Full notes text (expandable)
```

---

## DESIGN RULES (consistent with design brief)

- No emoji in UI
- Fonts: Exo 2 for titles, Montserrat for body
- Colors: #5e50fb accent, #e8e6fe background, #ffffff cards
- All external links: `target="_blank" rel="noreferrer"`
- Hover on cards: `translateY(-1px)` + stronger shadow

---

*End of brief. All tool URLs confirmed live. Brand records already seeded in production DB.*
