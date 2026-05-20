import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use service role to write directly
    const db = base44.asServiceRole;

    const documents = [
      {
        title: 'BR Certificate — SIMPLEX-ITY Branch (78459506-001-07-25-A)',
        category: 'Company Registration',
        file_url: 'https://media.base44.com/files/public/whatsapp/69ddc914cfcf229762ac123d/your_agent/69ddc914cfcf229762ac123f/073b46d17_BR001SIMPLEX-ITY.pdf',
        file_name: 'BR001SIMPLEX-ITY.pdf',
        file_type: 'PDF',
        tags: ['Company Registration', 'SIMPLEX-ITY', 'Branch'],
        notes: 'FORM 2 Branch Registration. Entity: 5SENSESBEAUTY LIMITED. Branch: SIMPLEX-ITY. Commenced: 12/01/2026. Expires: 14/07/2026. Cert No: 78459506-001-07-25-A. Fee: HKD $80.',
        version: '1',
        access_level: 'admin',
        is_template: false,
      },
      {
        title: 'BR Certificate — 5SENSESBEAUTY LIMITED Main (78459506-000-07-25-9)',
        category: 'Company Registration',
        file_url: 'https://media.base44.com/files/public/whatsapp/69ddc914cfcf229762ac123d/your_agent/69ddc914cfcf229762ac123f/ad7d873f2_BRC_148077315.pdf',
        file_name: 'BRC_148077315.pdf',
        file_type: 'PDF',
        tags: ['Company Registration', '5SENSESBEAUTY', 'Main Entity'],
        notes: 'FORM 2 Main BR. Entity: 5SENSESBEAUTY LIMITED (parent). Commenced: 15/07/2025. Expires: 14/07/2026. Cert No: 78459506-000-07-25-9. Fee: HKD $2,200.',
        version: '1',
        access_level: 'admin',
        is_template: false,
      },
      {
        title: 'Invoice #214386 — Company Setup HKD $7,850 (Reap Business)',
        category: 'Financial',
        file_url: 'https://media.base44.com/files/public/whatsapp/69ddc914cfcf229762ac123d/your_agent/69ddc914cfcf229762ac123f/1f23c1094_7850-5SENSESBEAUTYLIMITED.pdf',
        file_name: '7850-5SENSESBEAUTYLIMITED.pdf',
        file_type: 'PDF',
        tags: ['Financial', 'Invoice', 'Company Registration', 'Reap Business'],
        notes: 'Invoice No: 214386. Issue: 2025-07-09. Total: HKD $7,850. Items: Registration Plan B $4,970 + Company Secretary $900 + Virtual Office $1,980 + Directory $0.',
        version: '1',
        access_level: 'admin',
        is_template: false,
      },
      {
        title: 'Invoice #229460 — Branch Registration HKD $1,200 (Reap Business)',
        category: 'Company Registration',
        file_url: 'https://media.base44.com/files/public/whatsapp/69ddc914cfcf229762ac123d/your_agent/69ddc914cfcf229762ac123f/8425b666b_1200-5SENSESBEAUTYLIMITED.pdf',
        file_name: '1200-5SENSESBEAUTYLIMITED.pdf',
        file_type: 'PDF',
        tags: ['Company Registration', 'Invoice', 'SIMPLEX-ITY', 'Reap Business'],
        notes: 'Invoice No: 229460. Issue: 2026-01-06. Branch 001 service: 2025-07-15 to 2026-07-14. Total: HKD $1,200.',
        version: '1',
        access_level: 'admin',
        is_template: false,
      },
      {
        title: 'Receipt #229460 — Branch Registration HKD $1,200 Paid (Reap Business)',
        category: 'Financial',
        file_url: 'https://media.base44.com/files/public/whatsapp/69ddc914cfcf229762ac123d/your_agent/69ddc914cfcf229762ac123f/b68eacde1_1200receipt-5SENSESBEAUTYLIMITED.pdf',
        file_name: '1200receipt-5SENSESBEAUTYLIMITED.pdf',
        file_type: 'PDF',
        tags: ['Financial', 'Receipt', 'SIMPLEX-ITY', 'Reap Business'],
        notes: 'Official Receipt. A/C: RB42993. Invoice: 229460. Paid: 2026-01-14 via bank transfer. Total paid: HKD $1,200. Balance: $0.',
        version: '1',
        access_level: 'admin',
        is_template: false,
      },
    ];

    const expenses = [
      {
        title: 'Company Registration Service — Plan B (5SENSESBEAUTY LIMITED)',
        amount: 4970,
        currency: 'HKD',
        category: 'Company Registration',
        vendor: 'Reap Business Limited',
        date: '2025-07-09',
        recurring: false,
        approved: true,
        notes: 'Invoice #214386. Incorporation service Plan B, 7 working days. One-time setup fee.',
      },
      {
        title: 'Company Secretary Service — Annual (5SENSESBEAUTY LIMITED)',
        amount: 900,
        currency: 'HKD',
        category: 'Company Registration',
        vendor: 'Reap Business Limited',
        date: '2025-07-09',
        recurring: true,
        recurring_cycle: 'yearly',
        approved: true,
        notes: 'Invoice #214386. Service period: 2025-07-09 to 2026-07-08. Renewal due July 2026.',
      },
      {
        title: 'Kwun Tong Virtual Office — Plan A (18 months)',
        amount: 1980,
        currency: 'HKD',
        category: 'Company Registration',
        vendor: 'Reap Business Limited',
        date: '2025-07-09',
        recurring: true,
        recurring_cycle: 'yearly',
        approved: true,
        notes: 'Invoice #214386. RM 1608 16/F APEC Plaza. Service: 2025-07-09 to 2027-01-08.',
      },
      {
        title: 'Main BR Registration Fee — 5SENSESBEAUTY LIMITED',
        amount: 2200,
        currency: 'HKD',
        category: 'Company Registration',
        vendor: 'IRD / Reap Business Limited',
        date: '2025-07-15',
        recurring: true,
        recurring_cycle: 'yearly',
        approved: true,
        notes: 'Cert No: 78459506-000-07-25-9. Period: 15/07/2025 to 14/07/2026. Annual renewal.',
      },
      {
        title: 'Branch Registration — SIMPLEX-ITY (Branch 001)',
        amount: 1200,
        currency: 'HKD',
        category: 'Company Registration',
        vendor: 'Reap Business Limited',
        date: '2026-01-14',
        recurring: true,
        recurring_cycle: 'yearly',
        approved: true,
        notes: 'Invoice #229460. Branch 001 period: 2025-07-15 to 2026-07-14. Paid via bank 14 Jan 2026.',
      },
    ];

    const calendarEvents = [
      {
        title: '⚠️ BR Renewal Deadline — SIMPLEX-ITY Branch',
        description: 'Renew SIMPLEX-ITY branch registration (Cert 78459506-001-07-25-A). Contact Reap Business Carrie at 3166 1298. Fee ~HKD $1,200. FPS: 65438388.',
        event_type: 'deadline',
        start_date: '2026-07-14T00:00:00',
        all_day: true,
        color: '#e53e3e',
        reminder_minutes: 43200,
        whatsapp_reminder: true,
      },
      {
        title: '⚠️ BR Renewal Deadline — 5SENSESBEAUTY LIMITED Main',
        description: 'Renew main BR (Cert 78459506-000-07-25-9). Fee ~HKD $2,200. Renew via GovHK eBR or Reap Business.',
        event_type: 'deadline',
        start_date: '2026-07-14T00:00:00',
        all_day: true,
        color: '#e53e3e',
        reminder_minutes: 43200,
        whatsapp_reminder: true,
      },
      {
        title: '🔔 BR Renewal Reminder — 30 Days Before',
        description: 'Both BRs expire 14 Jul 2026. Start renewal now. Contact Carrie at Reap Business: (852) 3166 1298.',
        event_type: 'reminder',
        start_date: '2026-06-14T09:00:00',
        all_day: false,
        color: '#f6ad55',
        reminder_minutes: 1440,
        whatsapp_reminder: true,
      },
      {
        title: '⚠️ Company Secretary Renewal Deadline — Reap Business',
        description: 'Company Secretary service expires 2026-07-08. Annual fee HKD $900. Contact Carrie at (852) 3166 1298.',
        event_type: 'deadline',
        start_date: '2026-07-08T00:00:00',
        all_day: true,
        color: '#e53e3e',
        reminder_minutes: 43200,
        whatsapp_reminder: true,
      },
      {
        title: '🔔 Company Secretary Renewal Reminder — 30 Days',
        description: 'Company Secretary expires 8 Jul 2026. Contact Reap Business (Carrie, 3166 1298). Fee: HKD $900/year.',
        event_type: 'reminder',
        start_date: '2026-06-08T09:00:00',
        all_day: false,
        color: '#f6ad55',
        reminder_minutes: 1440,
        whatsapp_reminder: true,
      },
      {
        title: '🏢 Virtual Office Renewal — Kwun Tong Plan A',
        description: 'Virtual office at APEC Plaza expires 8 Jan 2027. Fee: HKD $1,980. Contact Reap Business (Carrie, 3166 1298).',
        event_type: 'renewal',
        start_date: '2027-01-08T00:00:00',
        all_day: true,
        color: '#8c82fc',
        reminder_minutes: 43200,
        whatsapp_reminder: false,
      },
    ];

    const docResults = await Promise.all(
      documents.map(d => db.entities.Document.create(d))
    );
    const expResults = await Promise.all(
      expenses.map(e => db.entities.Expense.create(e))
    );
    const calResults = await Promise.all(
      calendarEvents.map(c => db.entities.CalendarEvent.create(c))
    );

    return Response.json({
      ok: true,
      documents_created: docResults.length,
      expenses_created: expResults.length,
      calendar_events_created: calResults.length,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
