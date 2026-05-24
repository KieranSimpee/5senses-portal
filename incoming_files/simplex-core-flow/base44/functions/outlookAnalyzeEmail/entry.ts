import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { subject, body, from, bodyPreview } = await req.json();

    const content = `
Email Subject: ${subject}
From: ${from}
Body Preview: ${bodyPreview || ''}
Full Body (truncated): ${(body || '').substring(0, 2000)}
    `.trim();

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Analyze this email for the Simplex-ity / 5 Senses business hub. Classify and extract key info.

${content}

Return JSON with:
- type: "agreement" | "invoice" | "meeting_request" | "contact" | "general" | "marketing"
- priority: "high" | "medium" | "low"
- summary: one sentence summary (max 100 chars)
- action_required: boolean
- action: what action to take (if any, else null)
- company_name: extracted company name (if any)
- amount: extracted monetary amount (if any, else null)
- due_date: extracted date (ISO format if any, else null)
- tags: array of relevant tags (max 4)
`,
      response_json_schema: {
        type: "object",
        properties: {
          type: { type: "string" },
          priority: { type: "string" },
          summary: { type: "string" },
          action_required: { type: "boolean" },
          action: { type: "string" },
          company_name: { type: "string" },
          amount: { type: "string" },
          due_date: { type: "string" },
          tags: { type: "array", items: { type: "string" } }
        }
      }
    });

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});