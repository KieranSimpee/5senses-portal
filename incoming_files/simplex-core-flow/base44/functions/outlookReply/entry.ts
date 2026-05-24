import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

async function graphRequest(accessToken, path, options = {}) {
  const res = await fetch(`https://graph.microsoft.com/v1.0${path}`, {
    ...options,
    headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  if (!res.ok) throw new Error(`Graph API error: ${res.status} ${await res.text()}`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { messageId, comment, replyAll = false, account = 'me' } = await req.json();
    if (!messageId || !comment) return Response.json({ error: 'messageId and comment required' }, { status: 400 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('outlook');

    const base = account === 'me' ? '/me' : `/users/${account}`;
    const endpoint = replyAll ? `${base}/messages/${messageId}/replyAll` : `${base}/messages/${messageId}/reply`;
    await graphRequest(accessToken, endpoint, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});