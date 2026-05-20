import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = base44.asServiceRole;

    // Map expense IDs to their correct receipt/invoice URLs
    const updates = [
      {
        id: '6a0d5f803000b000fcf4cc7d', // Company Registration Service (Reap Business) $4,970
        receipt_url: 'https://media.base44.com/files/public/whatsapp/69ddc914cfcf229762ac123d/your_agent/69ddc914cfcf229762ac123f/1f23c1094_7850-5SENSESBEAUTYLIMITED.pdf',
      },
      {
        id: '6a0d5f803000b000fcf4cc7e', // Company Secretary Service $900
        receipt_url: 'https://media.base44.com/files/public/whatsapp/69ddc914cfcf229762ac123d/your_agent/69ddc914cfcf229762ac123f/1f23c1094_7850-5SENSESBEAUTYLIMITED.pdf',
      },
      {
        id: '6a0d5f803000b000fcf4cc7f', // Kwun Tong Virtual Office Plan A $1,980
        receipt_url: 'https://media.base44.com/files/public/whatsapp/69ddc914cfcf229762ac123d/your_agent/69ddc914cfcf229762ac123f/1f23c1094_7850-5SENSESBEAUTYLIMITED.pdf',
      },
      {
        id: '6a0d5f803000b000fcf4cc80', // Virtual Office Branch 001 Renewal $1,200
        receipt_url: 'https://media.base44.com/files/public/whatsapp/69ddc914cfcf229762ac123d/your_agent/69ddc914cfcf229762ac123f/b68eacde1_1200receipt-5SENSESBEAUTYLIMITED.pdf',
      },
      {
        id: '6a0d5f803000b000fcf4cc81', // Business Registration Fee $2,200
        receipt_url: 'https://media.base44.com/files/public/whatsapp/69ddc914cfcf229762ac123d/your_agent/69ddc914cfcf229762ac123f/ad7d873f2_BRC_148077315.pdf',
      },
      {
        id: '6a0d5f803000b000fcf4cc82', // Trade Mark Application Fee $5,000
        receipt_url: 'https://media.base44.com/files/public/whatsapp/69ddc914cfcf229762ac123d/your_agent/69ddc914cfcf229762ac123f/5b9554cec_FormReceipt-11858136.pdf',
      },
    ];

    const results = await Promise.all(
      updates.map(u => db.entities.Expense.update(u.id, { receipt_url: u.receipt_url }))
    );

    return Response.json({
      ok: true,
      updated: results.length,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
