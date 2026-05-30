# 5S Portal — OneDrive Filing System Integration Brief
## For Backend AI | May 2026

---

## TASK SUMMARY

Add a **"OneDrive Files"** page (or section) to the 5S Portal that shows the complete SIMPLEX-ITY filing structure with direct clickable links to each OneDrive folder. All links open in a new tab. No file upload logic needed — just navigation links.

---

## ONEDRIVE STRUCTURE (live, confirmed)

Root: `SIMPLEX-ITY HQ` on OneDrive (kieran.li@5sensesbeauty.com)

### FINANCE
Parent: https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Finance
| Subfolder | URL |
|-----------|-----|
| Invoices | https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Finance/Invoices |
| Expenses | https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Finance/Expenses |
| Receipts | https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Finance/Receipts |
| Bank Statements | https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Finance/Bank%20Statements |
| Tax | https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Finance/Tax |

### COMPLIANCE
Parent: https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Compliance
| Subfolder | URL |
|-----------|-----|
| Business Registration | https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Compliance/Business%20Registration |
| Licences | https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Compliance/Licences |
| Annual Returns | https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Compliance/Annual%20Returns |
| Contracts | https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Compliance/Contracts |
| Insurance | https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Compliance/Insurance |

### ADMIN
Parent: https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Admin
| Subfolder | URL |
|-----------|-----|
| Office | https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Admin/Office |
| Company Secretary | https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Admin/Company%20Secretary |
| Meeting Notes | https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Admin/Meeting%20Notes |
| Agreements | https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Admin/Agreements |

### HR
Parent: https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/HR
| Subfolder | URL |
|-----------|-----|
| Employment Contracts | https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/HR/Employment%20Contracts |
| MPF | https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/HR/MPF |
| Payroll | https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/HR/Payroll |
| Onboarding | https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/HR/Onboarding |

### BRAND — SIMPLEX-ITY
Parent: https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Brand%20-%20SIMPLEX-ITY
| Subfolder | URL |
|-----------|-----|
| Logos | https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Brand%20-%20SIMPLEX-ITY/Logos |
| Pitch Decks | https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Brand%20-%20SIMPLEX-ITY/Pitch%20Decks |
| Marketing | https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Brand%20-%20SIMPLEX-ITY/Marketing |
| Product | https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Brand%20-%20SIMPLEX-ITY/Product |

### BRAND — 5SENSESBEAUTY
Parent: https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Brand%20-%205SENSESBEAUTY

---

## WHAT TO BUILD

### Option A — New "OneDrive" page in the portal nav
Create a new page called `OneDrivePage.jsx` and add it to the sidebar nav under "OPERATIONS" section as "OneDrive Files".

### Option B — Add OneDrive panel to Documents page
Add a collapsible "OneDrive Filing Cabinet" section at the top of the existing `DocumentsPage.jsx`.

**Recommended: Option A** (cleaner, dedicated space)

---

## PAGE LAYOUT SPEC

```
Page title (eyebrow): SIMPLEX-ITY HQ
H1: OneDrive Filing System
Subtitle: All company files are stored in Microsoft OneDrive. Click any folder to open directly.

Top banner:
  - "Open Root Folder" button → links to SIMPLEX-ITY HQ root
  - Small text: "Hosted on Microsoft OneDrive · kieran.li@5sensesbeauty.com"

Then 5 section cards, one per category: Finance, Compliance, Admin, HR, Brand
```

### Each section card:
```
- Card header: Section name (e.g. "Finance") + "Open folder →" link (parent URL)
- Grid of subfolder chips (2 columns):
  Each chip: folder name as text + clicking opens the URL in new tab
  Chip style: outlined pill, border #e6e6e6, hover → lavender wash bg
```

---

## COMPONENT STRUCTURE (paste-ready)

```jsx
// OneDrivePage.jsx

const ONEDRIVE_STRUCTURE = [
  {
    section: "Finance",
    parentUrl: "https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Finance",
    folders: [
      { name: "Invoices", url: "https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Finance/Invoices" },
      { name: "Expenses", url: "https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Finance/Expenses" },
      { name: "Receipts", url: "https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Finance/Receipts" },
      { name: "Bank Statements", url: "https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Finance/Bank%20Statements" },
      { name: "Tax", url: "https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Finance/Tax" },
    ],
  },
  {
    section: "Compliance",
    parentUrl: "https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Compliance",
    folders: [
      { name: "Business Registration", url: "https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Compliance/Business%20Registration" },
      { name: "Licences", url: "https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Compliance/Licences" },
      { name: "Annual Returns", url: "https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Compliance/Annual%20Returns" },
      { name: "Contracts", url: "https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Compliance/Contracts" },
      { name: "Insurance", url: "https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Compliance/Insurance" },
    ],
  },
  {
    section: "Admin",
    parentUrl: "https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Admin",
    folders: [
      { name: "Office", url: "https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Admin/Office" },
      { name: "Company Secretary", url: "https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Admin/Company%20Secretary" },
      { name: "Meeting Notes", url: "https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Admin/Meeting%20Notes" },
      { name: "Agreements", url: "https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Admin/Agreements" },
    ],
  },
  {
    section: "HR",
    parentUrl: "https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/HR",
    folders: [
      { name: "Employment Contracts", url: "https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/HR/Employment%20Contracts" },
      { name: "MPF", url: "https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/HR/MPF" },
      { name: "Payroll", url: "https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/HR/Payroll" },
      { name: "Onboarding", url: "https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/HR/Onboarding" },
    ],
  },
  {
    section: "Brand — SIMPLEX-ITY",
    parentUrl: "https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Brand%20-%20SIMPLEX-ITY",
    folders: [
      { name: "Logos", url: "https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Brand%20-%20SIMPLEX-ITY/Logos" },
      { name: "Pitch Decks", url: "https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Brand%20-%20SIMPLEX-ITY/Pitch%20Decks" },
      { name: "Marketing", url: "https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Brand%20-%20SIMPLEX-ITY/Marketing" },
      { name: "Product", url: "https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ/Brand%20-%20SIMPLEX-ITY/Product" },
    ],
  },
];
```

---

## ALSO UPDATE — App.jsx Nav

In `App.jsx`, add this nav item under "OPERATIONS":
```jsx
{ id: "onedrive", label: "OneDrive Files", icon: "..." },
```

And add this to the page router:
```jsx
{page === "onedrive" && <OneDrivePage />}
```

And import at top:
```jsx
import OneDrivePage from "./pages/OneDrivePage";
```

---

## ALSO UPDATE — Documents page

On the existing `DocumentsPage.jsx`, add a small banner at the top:
```
"Files are also backed up to OneDrive →  [Open SIMPLEX-ITY HQ]"
Link: https://5sensesbeautylimited-my.sharepoint.com/personal/kieran_li_5sensesbeauty_com/Documents/SIMPLEX-ITY%20HQ
```

---

*End of brief. All URLs are live and confirmed working as of 30 May 2026.*
