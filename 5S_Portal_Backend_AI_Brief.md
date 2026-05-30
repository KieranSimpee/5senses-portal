# 5S Portal — Backend AI Build Brief
## For: Base44 App Builder AI
## Date: 30 May 2026
## App: 5S Portal (https://5-s-portal-ac123d.base44.app)

---

## ✅ WHAT IS ALREADY DONE (do NOT rebuild)

| Item | Status |
|------|--------|
| App.jsx navigation | ✅ Done — Invoices page wired in sidebar |
| InvoicePage.jsx | ✅ Done — Full UI with PDF generation, tabs, status management |
| All other pages | ✅ Done — Dashboard, Compliance, Finance, Documents, Vault, Notes, Brands, Influencers, Campaigns, Calendar, Revenue, CriticalPath, BuildTracker |
| All entity schemas | ✅ Done — Invoice, Expense, ComplianceItem, Project, Milestone, Note, TeamMember, Document, Brand, Influencer, Campaign, CampaignInfluencer, CalendarEvent, RevenueRecord, BuildProject, BuildCheckpoint, VaultItem, HRRecord, BankAccount, NoticeBoard, ActivityLog, TradeLog |

---

## 🔧 WHAT THE BACKEND AI NEEDS TO BUILD

### 1. `generateInvoicePDF` backend function
**File:** `functions/generateInvoicePDF.ts`

**Purpose:** Generate a branded SIMPLEX-ITY invoice or receipt PDF server-side and return a download URL.

**Input (POST body):**
```json
{
  "invoice_id": "string",
  "type": "invoice" | "receipt"
}
```

**What it does:**
1. Fetch invoice record from `Invoice` entity using `base44.asServiceRole.entities.Invoice.get(invoice_id)`
2. Generate a PDF using a PDF library (e.g. pdf-lib or jsPDF via Deno)
3. Include:
   - **Header bar:** Purple (#8c82fc) full-width bar with "SIMPLEX-ITY" in white Exo 2 bold
   - **Subtitle:** "Branch of 5SENSESBEAUTY LIMITED"
   - **Company address:** RM1608, 16/F, APEC PLAZA, 49 HOI YUEN RD, KWUN TONG, KL
   - **Title:** "INVOICE" or "RECEIPT" in large violet text
   - **Status badge** (top right): coloured pill matching status
   - **Bill To section:** client_name, client_email, client_address
   - **Invoice meta:** invoice_no, issue_date, due_date, payment_method
   - **Line items table:** Description | Qty | Unit Price | Amount — striped rows
   - **Totals:** Subtotal, Tax (if any), TOTAL (highlighted in purple)
   - **Notes section** if notes exist
   - **Footer bar:** Purple bar with address + web + generated date
4. Upload PDF to storage, return `{ success: true, pdf_url: "..." }`
5. Update the Invoice record `pdf_url` field with the returned URL

**Colour palette:**
- Primary Lilac: `#8c82fc`
- Accent Violet: `#5e50fb`
- White: `#ffffff`
- Body Text: `#1a1a1f`

---

### 2. `syncAirwallexTransactions` backend function
**File:** `functions/syncAirwallexTransactions.ts`

**Purpose:** Pull financial transactions from Airwallex and match to open invoices.

**Input (POST body):**
```json
{
  "from_date": "YYYY-MM-DD"  // optional, defaults to 30 days ago
}
```

**What it does:**
1. Authenticate with Airwallex:
   ```
   POST https://api.airwallex.com/api/v1/authentication/login
   Headers: x-client-id, x-api-key
   Env vars: AIRWALLEX_ADMIN_CLIENT_ID, AIRWALLEX_ADMIN_API_KEY
   ```
2. Fetch financial transactions:
   ```
   GET https://api.airwallex.com/api/v1/financial_transactions?page_size=50
   ```
3. For each transaction:
   - If `transaction_type === "CREDIT"` or amount is positive
   - Try to match against open Invoice records by amount + currency
   - If matched: update Invoice status to "Paid", set `airwallex_synced: true`
4. Return `{ synced: number, matched: number, transactions: [...] }`

---

### 3. `createAirwallexBillingCustomer` backend function
**File:** `functions/createAirwallexBillingCustomer.ts`

**Purpose:** Create or retrieve a billing customer in Airwallex for a given client.

**Input (POST body):**
```json
{
  "client_name": "string",
  "client_email": "string",
  "client_address": "string"
}
```

**What it does:**
1. Authenticate with Airwallex (same as above)
2. Check existing customers: `GET /api/v1/billing_customers`
3. If customer with same name/email exists → return their `id`
4. If not → `POST /api/v1/billing_customers/create` with name, email, address
5. Return `{ customer_id: "bcus_xxx", name: "...", existing: true/false }`

---

### 4. Dashboard widget — Invoice Summary Card
**File:** Modify `app/pages/Dashboard.jsx`

Add an "Invoices" summary card to the existing dashboard grid showing:
- Total invoices count
- Revenue collected (sum of Paid invoices)
- Pending amount (sum of Draft + Sent)
- Overdue amount (sum of Overdue)
- A "View Invoices →" button that calls `setPage("invoices")`

Use the same card style as existing dashboard cards.

Import: `import { Invoice } from "@/api/entities";`
Fetch on mount with `Invoice.list()`.

---

## 📐 BRAND RULES (apply everywhere)

```
Fonts:
  Headlines/Labels: Exo 2, bold
  Body/UI text: Montserrat

Colors:
  Primary Lilac:   #8c82fc
  Accent Violet:   #5e50fb
  Soft Lilac:      #bab4fd
  Lavender Wash:   #e8e6fe  (backgrounds)
  White Canvas:    #ffffff
  Neutral Grey:    #e6e6e6  (borders)
  Body Text:       #1a1a1f

Border radius: 10–14px for cards, 8px for inputs
Shadows: 0 2px 12px rgba(140,130,252,0.08)
```

---

## 🗂 ENTITY REFERENCE

### Invoice entity fields:
```
invoice_no        string   e.g. "SXTY-INV-001"
client_name       string
client_email      string
client_address    string
issue_date        string   YYYY-MM-DD
due_date          string   YYYY-MM-DD
currency          string   e.g. "HKD"
items             array    ["Description | qty:1 | HKD 5000", ...]
subtotal          number
tax               number
total             number
status            string   Draft | Sent | Paid | Overdue | Cancelled
payment_method    string
pdf_url           string   CDN URL after generation
notes             string
airwallex_synced  boolean
related_project   string
```

### VaultItem entity fields (for storing Airwallex credentials):
```
service_name   string
category       string
url            string
username       string
password       string
client_id      string
api_key        string
notes          string
is_admin_only  boolean
```

---

## 🔗 AIRWALLEX API REFERENCE

**Base URL:** `https://api.airwallex.com/api/v1`

**Auth (every request):**
```
POST /authentication/login
Headers: x-client-id: {AIRWALLEX_ADMIN_CLIENT_ID}, x-api-key: {AIRWALLEX_ADMIN_API_KEY}
Returns: { token: "eyJ..." }
Then use: Authorization: Bearer {token}
```

**Working endpoints (confirmed ✅):**
| Endpoint | Method | Notes |
|----------|--------|-------|
| `/financial_transactions` | GET | Pulls all transactions |
| `/transfers` | GET | Outbound transfers |
| `/billing_customers` | GET | List customers |
| `/billing_customers/create` | POST | Create customer |
| `/products` | GET/POST | Product catalog |
| `/prices` | GET/POST | Price objects |
| `/invoices` | GET | List invoices |
| `/invoices/create` | POST | Create draft invoice |
| `/invoices/{id}/update` | POST | Update draft |
| `/invoices/{id}/finalize` | POST | Finalize invoice |
| `/invoices/{id}/delete` | POST | Delete draft |

**Important notes:**
- `billing_customers/create` requires: `request_id`, `name`, `email`, `address.city`, `address.country_code`
- `invoices/create` requires: `request_id`, `billing_customer_id`, `currency`, `collection_method` (use "OUT_OF_BAND")
- All amounts are in **minor units** (cents): HKD 5,000 = `500000`
- Client ID: `S4_56L3OSniKjRrf2IhjAA` (capital I, not lowercase l)
- Env vars: `AIRWALLEX_ADMIN_CLIENT_ID`, `AIRWALLEX_ADMIN_API_KEY`

---

## 📋 EXECUTION ORDER FOR BACKEND AI

1. Build `generateInvoicePDF` function first (highest priority — PDF download is the core feature)
2. Add Invoice Summary Card to Dashboard
3. Build `syncAirwallexTransactions` function
4. Build `createAirwallexBillingCustomer` function

---

*Brief prepared by Simpee (5S Portal AI Agent) — 30 May 2026*
