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

async function syncAccount(accessToken, accountBase, days) {
  const now = new Date().toISOString();
  const future = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
  const eventsData = await graphRequest(accessToken, `${accountBase}/calendarView?startDateTime=${now}&endDateTime=${future}&$select=id,subject,start,end,location,attendees,bodyPreview,onlineMeeting,webLink&$top=50&$orderby=start/dateTime`);
  return eventsData.value || [];
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { days = 30 } = await req.json().catch(() => ({}));

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('outlook');

    // Always sync both accounts
    let allEvents = [];
    try {
      const meEvents = await syncAccount(accessToken, '/me', days);
      allEvents = allEvents.concat(meEvents.map(e => ({ ...e, _account: 'me' })));
    } catch (_) { /* primary account may fail silently */ }

    try {
      const globalEvents = await syncAccount(accessToken, '/users/kieran@5senses.global', days);
      allEvents = allEvents.concat(globalEvents.map(e => ({ ...e, _account: 'kieran@5senses.global' })));
    } catch (_) { /* secondary account may not be accessible */ }

    let synced = 0;
    for (const evt of allEvents) {
      const existing = await base44.asServiceRole.entities.CalendarEvent.filter({ title: evt.subject });
      const startDate = evt.start?.dateTime ? new Date(evt.start.dateTime).toISOString() : null;
      const alreadySynced = existing.some(e => e.start_date && new Date(e.start_date).toISOString() === startDate);

      if (!alreadySynced && startDate) {
        await base44.asServiceRole.entities.CalendarEvent.create({
          title: evt.subject || 'Outlook Meeting',
          description: evt.bodyPreview || '',
          event_type: 'meeting',
          start_date: startDate,
          end_date: evt.end?.dateTime ? new Date(evt.end.dateTime).toISOString() : startDate,
          location: evt.location?.displayName || '',
          attendees: (evt.attendees || []).map(a => a.emailAddress?.address).filter(Boolean),
          color: evt._account === 'me' ? '#0078d4' : '#7c3aed',
        });
        synced++;
      }
    }

    return Response.json({ success: true, total: allEvents.length, synced });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});