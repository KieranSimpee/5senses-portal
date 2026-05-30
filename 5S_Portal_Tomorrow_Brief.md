# 5S Portal — Tomorrow's Fix Brief (31 May 2026)

## PRIORITY 1 — Command Chat Fix (paste to builder AI)

In pages/Home.jsx (or HomeDashboard.jsx), find the Command Chat / S-Chat section.

The SEND TO SIMPEE button onClick must be updated to:

```js
const res = await fetch('/api/run/processSChatInstruction', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phase: 1,
    instruction: inputText,
    posted_by: currentUser?.email
  })
});
const data = await res.json();
// data.options = array of chips to display
// data.message = confirmation text
```

Remove any call to BuildWithAI or external LLM APIs from the SEND TO SIMPEE button.

Chip onClick (phase 2):
```js
const res2 = await fetch('/api/run/processSChatInstruction', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phase: 2,
    selected_option: chipText,
    posted_by: currentUser?.email
  })
});
// On success: show "Simpee is on it" and refresh notices
```

---

## PRIORITY 2 — Create Missing Entities (builder AI)

Ask builder AI to create these entities in the app:

1. **Milestone** — fields: project_id, title, description, due_date, status, assigned_to, order
2. **CampaignInfluencer** — fields: campaign_id, campaign_title, influencer_id, influencer_name, live_count_required, live_count_done, blog_count_required, blog_count_done, commission_earned, status, notes
3. **BuildProject** — fields: name, category, audience, status, priority, due_date, description, notes, progress
4. **BuildCheckpoint** — fields: project_id, project_name, title, description, status, order, due_date, notes
5. **PropertyListing** — fields: listing_id, name, price_hkd, district, address, beds, baths, size_sf, floor, image_url, source_url, source, agent, carpark, fetched_date, tags

---

## PRIORITY 3 — Dual AI Status Bar (paste to builder AI)

In Home.jsx, add a status bar at the top of the Command Chat card:

Two status indicators side by side:
- SIMPEE dot — always green (#22c55e), pulsing animation, label "SIMPEE" + "connected"
- BUILDER AI dot — always green (#22c55e), pulsing animation, label "BUILDER AI" + "ready"

CSS pulse animation:
```css
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
animation: pulse 2s infinite
```

Style: background #f4f3ff, border-radius 8px, padding 6px 14px, display flex, gap 20px, marginBottom 12px.
Font: Exo 2, 10px, fontWeight 800, color #1a0533. Sub-text: Montserrat, 9px, #9896ad.

---

## PRIORITY 4 — Bank Balances (Kieran to update manually)

Go to Finance > Bank Accounts and update:
- Airwallex USD — current balance
- Hang Seng Bank HKD — current balance  
- HSBC Hong Kong HKD — current balance

---

## WHAT SIMPEE FIXED OVERNIGHT
- Cleared 36 stale notices from inbox ✅
- Seeded 3 TeamMember records (Kieran, Loreen, Wilson) ✅
- Flagged bank accounts for manual balance update ✅
- Identified 5 missing entities ✅
- Confirmed processSChatInstruction function is working ✅
