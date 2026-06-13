import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Google AI Pro Daily Report Receiver
// Receives structured reports from Google AI Pro and stores them in FamilyChat + TeamLog
// Endpoint: https://simpee-62ac123d.base44.app/functions/receiveGoogleAIReport

Deno.serve(async (req) => {
  try {
    // Accept both authenticated and API-key-based requests
    const authHeader = req.headers.get('Authorization') || '';
    const apiKey = req.headers.get('X-API-Key') || '';

    // Simple API key check for Google AI Pro
    const EXPECTED_KEY = Deno.env.get('GOOGLE_AI_REPORT_KEY') || 'simplex-google-ai-bridge-2026';
    
    if (apiKey !== EXPECTED_KEY && !authHeader.startsWith('Bearer simplex-')) {
      return Response.json({ error: 'Unauthorized — invalid API key' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));

    const {
      report_type = 'Daily Summary',
      content = '',
      priority = 'normal',
      action_items = [],
      submitted_by = 'Google AI Pro',
      timestamp = new Date().toISOString(),
    } = body;

    if (!content) {
      return Response.json({ error: 'content field is required' }, { status: 400 });
    }

    // Format the message for FamilyChat
    const familyMessage = `📊 *${report_type}* from ${submitted_by}\n\n${content}${action_items.length > 0 ? '\n\n🎯 Action Items:\n' + action_items.map((a: string, i: number) => `${i+1}. ${a}`).join('\n') : ''}`;

    // Use service role to write to entities
    const base44 = createClientFromRequest(req);

    // Store in FamilyChat so all family members can see
    await base44.asServiceRole.entities.FamilyChat.create({
      sender: submitted_by,
      sender_role: 'Google AI Pro (统籌工具)',
      message: familyMessage,
      message_type: 'report',
      topic: report_type,
      session_id: `google-ai-${new Date().toISOString().split('T')[0]}`,
      pinned: priority === 'high',
    });

    // Also store in TeamLog for tracking
    await base44.asServiceRole.entities.TeamLog.create({
      type: 'update',
      title: `Google AI Report: ${report_type}`,
      message: content,
      posted_by: submitted_by,
      stage: priority,
      date: new Date().toISOString().split('T')[0],
      pinned: priority === 'high',
    });

    return Response.json({
      ok: true,
      message: 'Report received and stored successfully. Simpee will review shortly.',
      stored_in: ['FamilyChat', 'TeamLog'],
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
