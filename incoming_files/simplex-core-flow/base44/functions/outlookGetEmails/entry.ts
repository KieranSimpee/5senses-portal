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

    const { folder = 'inbox', top = 25, skip = 0, search = '', account = 'me' } = await req.json().catch(() => ({}));

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('outlook');

    const base = account === 'me' ? '/me' : `/users/${account}`;
    let url = `${base}/mailFolders/${folder}/messages?$top=${top}&$skip=${skip}&$orderby=receivedDateTime desc&$select=id,subject,from,toRecipients,receivedDateTime,isRead,hasAttachments,bodyPreview,importance,conversationId`;
    if (search) url += `&$search="${search}"`;

    const data = await graphRequest(accessToken, url);
    return Response.json({ messages: data.value || [], total: data['@odata.count'] || 0 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});