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

    const { messageId, account = 'me' } = await req.json();
    if (!messageId) return Response.json({ error: 'messageId required' }, { status: 400 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('outlook');

    const base = account === 'me' ? '/me' : `/users/${account}`;
    const message = await graphRequest(accessToken, `${base}/messages/${messageId}?$select=id,subject,from,toRecipients,ccRecipients,receivedDateTime,isRead,hasAttachments,body,importance,conversationId`);

    // Mark as read
    await graphRequest(accessToken, `${base}/messages/${messageId}`, {
      method: 'PATCH',
      body: JSON.stringify({ isRead: true }),
    });

    // Get attachments if any
    let attachments = [];
    if (message.hasAttachments) {
      const attData = await graphRequest(accessToken, `${base}/messages/${messageId}/attachments?$select=id,name,contentType,size`);
      attachments = attData.value || [];
    }

    return Response.json({ message, attachments });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});