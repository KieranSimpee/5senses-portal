import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json().catch(() => ({}));
    const { instruction, posted_by } = body;

    if (!instruction) {
      return Response.json({ error: "No instruction provided" }, { status: 400 });
    }

    // Step 1: Save the notice to the portal DB
    await base44.asServiceRole.entities.Notice.create({
      title: instruction.slice(0, 60),
      content: instruction,
      posted_by: posted_by || "Kieran",
      section: "backend",
      type: "info",
      pinned: false
    });

    // Step 2: Ping Simpee agent directly via Base44 agent message API
    const AGENT_APP_ID = "69ddc914cfcf229762ac123d";
    const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJraWVyYW5ANXNlbnNlcy5nbG9iYWwiLCJleHAiOjE3ODc0MDg1NTMsImlhdCI6MTc3OTYzMjU1M30.feQst8q8CvGtFAlpy-Yl6Gp7qKVw84FPsbrK2oUAhFg";

    await fetch(`https://app.base44.com/api/apps/${AGENT_APP_ID}/agent/message`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: `S-CHAT BACKEND INSTRUCTION from ${posted_by || "Kieran"}:\n\n${instruction}\n\nPlease write the JSX code needed and post it back as a Notice (section=code_ready, posted_by=Simpee, pinned=true) to the real 5S Portal (app_id: 69edd16e877d6e4391ad74bd) so Kieran can copy and paste it into the builder.`
      })
    });

    return Response.json({
      success: true,
      message: "Simpee is on it ✓"
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
