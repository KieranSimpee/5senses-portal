import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Google AI Pro — Submit for Simpee Review
// Any task, decision, or error correction must pass through here before going to Kieran
// Endpoint: https://simpee-62ac123d.base44.app/functions/submitForReview

Deno.serve(async (req) => {
  try {
    const apiKey = req.headers.get('X-API-Key') || '';
    const EXPECTED_KEY = Deno.env.get('GOOGLE_AI_REPORT_KEY') || 'simplex-google-ai-bridge-2026';

    if (apiKey !== EXPECTED_KEY) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));

    const {
      submission_type = 'task_result',  // task_result | error_correction | decision | analysis
      task_title = '',
      what_was_asked = '',
      what_i_did = '',
      what_went_wrong = '',
      my_correction = '',
      final_answer = '',
      confidence = 'medium',            // low | medium | high
      ready_for_kieran = false,
      submitted_by = 'Google AI Pro',
    } = body;

    if (!task_title || !final_answer) {
      return Response.json({ 
        error: 'task_title and final_answer are required fields',
        hint: 'Simpee needs to know what the task was and what your final answer is before reviewing.'
      }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);

    // Build review message for Simpee
    const reviewMessage = 
      `🔍 *REVIEW REQUEST* from ${submitted_by}\n\n` +
      `📋 Task: ${task_title}\n` +
      `📝 Type: ${submission_type}\n` +
      `💬 What was asked: ${what_was_asked}\n` +
      (what_went_wrong ? `⚠️ What went wrong: ${what_went_wrong}\n` : '') +
      (my_correction ? `🔧 My correction: ${my_correction}\n` : '') +
      `✅ Final Answer: ${final_answer}\n` +
      `📊 Confidence: ${confidence}\n` +
      `🚦 Ready for Kieran: ${ready_for_kieran ? 'YES — pending Simpee approval' : 'NO — still needs work'}`;

    // Store in FamilyChat as PENDING review
    const record = await base44.asServiceRole.entities.FamilyChat.create({
      sender: submitted_by,
      sender_role: 'Google AI Pro (待審核)',
      message: reviewMessage,
      message_type: 'pending_review',
      topic: `REVIEW: ${task_title}`,
      session_id: `review-${Date.now()}`,
      pinned: true,
    });

    // Also log in TeamLog
    await base44.asServiceRole.entities.TeamLog.create({
      type: 'update',
      title: `⏳ PENDING REVIEW: ${task_title}`,
      message: `Submitted by Google AI Pro for Simpee review.\n\nFinal Answer: ${final_answer}\n\nConfidence: ${confidence}`,
      posted_by: submitted_by,
      stage: 'pending_review',
      date: new Date().toISOString().split('T')[0],
      pinned: true,
    });

    return Response.json({
      ok: true,
      status: 'PENDING_REVIEW',
      message: 'Submission received. Simpee will review before passing to Kieran. Do NOT share this with Kieran yet.',
      review_id: record.id,
      next_step: 'Wait for Simpee approval. Simpee will update the status to APPROVED or NEEDS_REVISION.',
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
