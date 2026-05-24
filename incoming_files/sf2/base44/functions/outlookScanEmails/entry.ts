import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

async function graphRequest(accessToken, path) {
  const res = await fetch(`https://graph.microsoft.com/v1.0${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) throw new Error(`Graph API error: ${res.status} ${await res.text()}`);
  return res.json();
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('outlook');

    // Fetch unread + flagged (awaiting reply) emails
    const unreadData = await graphRequest(accessToken, `/me/mailFolders/inbox/messages?$filter=isRead eq false&$top=30&$select=id,subject,from,receivedDateTime,bodyPreview,body,flag`);
    const flaggedData = await graphRequest(accessToken, `/me/mailFolders/inbox/messages?$filter=flag/flagStatus eq 'flagged'&$top=30&$select=id,subject,from,receivedDateTime,bodyPreview,body,flag`);
    
    // Merge and deduplicate by id
    const emailMap = new Map();
    [...(unreadData.value || []), ...(flaggedData.value || [])].forEach(e => emailMap.set(e.id, e));
    const emails = Array.from(emailMap.values()).slice(0, 30);

    if (emails.length === 0) {
      return Response.json({ scanned: 0, needs_reply: [], invoices: [] });
    }

    // Build prompt with email summaries
    const emailSummaries = emails.map((e, i) =>
      `[${i}] Subject: ${e.subject}\nFrom: ${e.from?.emailAddress?.name} <${e.from?.emailAddress?.address}>\nDate: ${e.receivedDateTime}\nPreview: ${e.bodyPreview?.slice(0, 300)}`
    ).join('\n\n---\n\n');

    const aiResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are an email assistant for a Hong Kong business. Analyse these unread emails and categorise them.

Emails:
${emailSummaries}

Return JSON with:
- needs_reply: array of emails that require a reply (exclude newsletters, automated notifications, marketing). For each: { index, priority: "high"|"medium"|"low", reason }
- invoices: array of emails that contain an invoice, bill, or payment request. For each: { index, suggested_title, suggested_vendor, suggested_amount, suggested_currency }

Only include emails that clearly need action. Be conservative.`,
      response_json_schema: {
        type: "object",
        properties: {
          needs_reply: {
            type: "array",
            items: {
              type: "object",
              properties: {
                index: { type: "number" },
                priority: { type: "string" },
                reason: { type: "string" }
              }
            }
          },
          invoices: {
            type: "array",
            items: {
              type: "object",
              properties: {
                index: { type: "number" },
                suggested_title: { type: "string" },
                suggested_vendor: { type: "string" },
                suggested_amount: { type: "string" },
                suggested_currency: { type: "string" }
              }
            }
          }
        }
      }
    });

    const needs_reply = (aiResult.needs_reply || []).map(item => ({
      ...item,
      email: emails[item.index]
    })).filter(item => item.email);

    const invoices = (aiResult.invoices || []).map(item => ({
      ...item,
      email: emails[item.index]
    })).filter(item => item.email);

    return Response.json({ scanned: emails.length, needs_reply, invoices });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});