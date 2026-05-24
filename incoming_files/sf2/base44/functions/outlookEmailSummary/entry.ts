import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

async function graphRequest(accessToken, path) {
  const res = await fetch(`https://graph.microsoft.com/v1.0${path}`, {
    headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
  });
  if (!res.ok) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function getAccountSummary(accessToken, accountBase, label) {
  try {
    // Fetch recent unread inbox messages
    const data = await graphRequest(accessToken, `${accountBase}/mailFolders/inbox/messages?$top=5&$orderby=receivedDateTime desc&$filter=isRead eq false&$select=id,subject,from,receivedDateTime,importance,bodyPreview`);
    const recent = await graphRequest(accessToken, `${accountBase}/mailFolders/inbox/messages?$top=5&$orderby=receivedDateTime desc&$select=id,subject,from,receivedDateTime,isRead,importance,bodyPreview`);
    const unreadCount = await graphRequest(accessToken, `${accountBase}/mailFolders/inbox?$select=unreadItemCount,totalItemCount`);

    return {
      account: label,
      unread: unreadCount?.unreadItemCount || 0,
      total: unreadCount?.totalItemCount || 0,
      latestUnread: (data?.value || []).slice(0, 3).map(m => ({
        subject: m.subject,
        from: m.from?.emailAddress?.name || m.from?.emailAddress?.address || 'Unknown',
        receivedAt: m.receivedDateTime,
        importance: m.importance,
        preview: m.bodyPreview?.slice(0, 100),
      })),
      recentMessages: (recent?.value || []).slice(0, 3).map(m => ({
        subject: m.subject,
        from: m.from?.emailAddress?.name || m.from?.emailAddress?.address || 'Unknown',
        receivedAt: m.receivedDateTime,
        isRead: m.isRead,
        importance: m.importance,
      })),
    };
  } catch (_) {
    return { account: label, unread: 0, total: 0, latestUnread: [], recentMessages: [], error: true };
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('outlook');

    const [primary, secondary] = await Promise.all([
      getAccountSummary(accessToken, '/me', 'kieran.li@5sensesbeauty.com'),
      getAccountSummary(accessToken, '/users/kieran@5senses.global', 'kieran@5senses.global'),
    ]);

    return Response.json({ accounts: [primary, secondary] });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});