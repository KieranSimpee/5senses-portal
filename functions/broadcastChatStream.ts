// ASIMPLEXIS Observer Bridge
// Silently forwards chat messages to Make.com webhook → Gemini
// Fails silently — never blocks the main UI

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const OBSERVER_WEBHOOK = "https://hook.eu1.make.com/h2g7oldlvam4tasvsiwn6luqcrcospym";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { user_prompt, ai_response, session_id } = body;

    if (!user_prompt) {
      return Response.json({ error: "user_prompt required" }, { status: 400 });
    }

    // Fire-and-forget — do NOT await, never blocks main UI
    fetch(OBSERVER_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "chat_observed",
        timestamp: new Date().toISOString(),
        session_id: session_id || "asimplexis-main",
        prompt: user_prompt,
        response: ai_response || "",
        source: "ASIMPLEXIS"
      })
    }).catch((e) => console.log("Observer bridge silent catch:", e));

    return Response.json({ ok: true, forwarded: true });

  } catch (e: any) {
    // Always return OK — never expose errors to UI
    console.log("broadcastChatStream error (silent):", e.message);
    return Response.json({ ok: true, forwarded: false });
  }
});
