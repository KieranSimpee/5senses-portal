# 5S Portal — Tools Hub Page Brief
## For Backend AI | May 2026 (Updated)

---

## OVERVIEW

Build a **Tools Hub** page (`ToolsPage.jsx`) in the 5S Portal. This is a central launchpad for every tool, platform, and service that SIMPLEX-ITY / 5SENSESBEAUTY uses.

Each tool tile shows:
- Service name
- Category badge
- Saved username (from VaultItem entity)
- Two buttons: **Open** (external link, new tab) + **Credentials** (links to vault record)

No iframe embedding — most tools block it. Use redirect links only.
Exception: SIMPLEX-ITY website preview tile — show a thumbnail screenshot + "Open Site" button.

---

## NAVIGATION

In `App.jsx`, add/confirm:
```jsx
{page === "tools" && <ToolsPage />}
import ToolsPage from "./pages/ToolsPage";
```

---

## COMPLETE TOOLS LIST (all confirmed in Vault DB)

### WEBSITE & OUR BRAND
| Tool | URL | Notes |
|------|-----|-------|
| SIMPLEX-ITY Website | https://simplex-ity.fluentlab.co | Current live preview. Password: simplexity2026. Moving to simplex-ity.com |
| simplex-ity.com | https://simplex-ity.com | Primary domain (going forward) |
| GoDaddy | https://account.godaddy.com | Domain management. Keep: simplex-ity.com, simplex-ity.net |
| SiteGround | https://my.siteground.com | Web hosting for simplex-ity.com |
| Squarespace | https://account.squarespace.com | Website builder |

### DESIGN & BRAND
| Tool | URL | Notes |
|------|-----|-------|
| Looka Brand Kit | https://looka.com/dashboard | Logo files, colour palette, brand assets, letterhead |
| Canva | https://www.canva.com | Marketing materials, social media content |
| GlowFinder AI | https://glowfinder.ai | AI beauty/skin analysis. Used for brand campaigns & product recommendations |

### FINANCE & BANKING
| Tool | URL | Notes |
|------|-----|-------|
| Airwallex | https://app.airwallex.com | Main business banking. Account: 5SENSESBEAUTY LIMITED |
| Futu 富途 | https://www.futuhk.com | Investment & trading platform |
| Shopify | https://admin.shopify.com | E-commerce store |

### EMAIL & PRODUCTIVITY
| Tool | URL | Notes |
|------|-----|-------|
| Outlook (kieran@5senses.global) | https://outlook.office.com | Primary business email |
| Outlook (kieran.li@5sensesbeauty.com) | https://outlook.office.com | Secondary M365 account |
| Microsoft 365 Admin | https://admin.microsoft.com | Office/email admin panel |
| Microsoft OneDrive | https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ | SIMPLEX-ITY HQ file storage |

### GOVERNMENT & CORPORATE
| Tool | URL | Notes |
|------|-----|-------|
| IRD | https://www.ird.gov.hk/eng/ese/eservices.htm | HK Inland Revenue |
| Companies Registry | https://www.cr.gov.hk | Annual returns, filings |
| IPD | https://www.ipd.gov.hk | IP / trademark filings |
| Reap Business | https://www.reapbusiness.com | Virtual office, company secretary. Contact: Carrie (852) 3166 1298 |

### PLATFORM & DEV
| Tool | URL | Notes |
|------|-----|-------|
| Base44 | https://app.base44.com | 5S Portal builder |

### PARTNERSHIPS
| Tool | URL | Notes |
|------|-----|-------|
| Banuba | https://www.banuba.com | AR beauty tech. Contact: Nikita Afanasjew |
| FundFluent | https://fundfluent.io | Wilson Tai partnership |

---

## SPECIAL TILE — SIMPLEX-ITY WEBSITE

The SIMPLEX-ITY Website tile should be **featured / pinned at the top** of the page, larger than other tiles.

```
Featured card (full width or 2-column span):
  Left side:
    - Eyebrow: "OUR WEBSITE · LIVE PREVIEW"
    - Title: "SIMPLEX-ITY" (Exo 2, 800, 20px)
    - URL label: simplex-ity.fluentlab.co → simplex-ity.com
    - Status pill: "Live" (green)
    - Button: "Open Website →" (primary, opens https://simplex-ity.fluentlab.co in new tab)
    - Small note: "Going live at simplex-ity.com"
  Right side:
    - Favicon / brand logo thumbnail
```

---

## PAGE LAYOUT

```
Eyebrow: SIMPLEX-ITY HQ
H1: Tools & Platforms
Subtitle: All tools, services and platforms used by SIMPLEX-ITY and 5SENSESBEAUTY.

[Featured Website tile — full width at top]

[Search bar — filter by name or category]

[Category sections — each with eyebrow header + 3-col grid of tool cards]
```

### Tool Card:
```
background: #ffffff
border-radius: 12px
border: 1px solid #e6e6e6
box-shadow: 0 2px 8px rgba(140,130,252,0.10)
padding: 16px 18px

Top: Service name (Exo 2, 14px, 700) + category pill (#e8e6fe, #5e50fb)
Middle: username in #9896ad, 12px
Bottom: "Open" (primary sm) + "Credentials" (outline sm)
```

---

## VAULT INTEGRATION

"Credentials" button on each tool card:
1. Calls `setPage("vault")`
2. Passes `service_name` so VaultPage filters to that record

Add `filterService` prop to `VaultPage.jsx` — auto-filter list when passed.

---

## BRANDS PAGE — TWO TABS

`BrandsPage.jsx` should show **two tabs**:
- Tab 1: **SIMPLEX-ITY** — logo + brand profile
- Tab 2: **5SENSESBEAUTY** — logo + brand profile

Logo URLs (already in DB notes field):
- SIMPLEX-ITY: `https://media.base44.com/images/public/69edd16e877d6e4391ad74bd/5b19c5b2c_Simplex-ityTradeMarkHKCN.png`
- 5SENSESBEAUTY: `https://media.base44.com/images/public/69edd16e877d6e4391ad74bd/f2471911b_BrandLogo1.png`

Brand DB IDs:
- SIMPLEX-ITY: `6a1aceb7cf0ee4755d5941a7`
- 5SENSESBEAUTY LIMITED: `6a1aceb7aefea133f5993c9c`

Each tab displays:
```
Logo (120px wide, object-contain)
Brand name (Exo 2, 22px, 800)
Category badge
Status badge
Contact name + email (mailto link)
Country
Notes (expandable, max 3 lines collapsed)
"Edit" button (admin only)
"Open Website →" button (for SIMPLEX-ITY → simplex-ity.fluentlab.co)
```

---

## DESIGN RULES

- No emoji anywhere
- Fonts: Exo 2 headlines, Montserrat body
- Colors: #5e50fb accent, #e8e6fe background, #ffffff cards
- All external links: `target="_blank" rel="noreferrer"`
- Card hover: `translateY(-1px)` + stronger lilac shadow

---

*End of brief. Vault has 22 confirmed entries. Brand records seeded. Website URL: simplex-ity.fluentlab.co (current) → simplex-ity.com (going forward).*
