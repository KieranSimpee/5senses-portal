import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json().catch(() => ({}));
    const { instruction, posted_by } = body;

    if (!instruction) {
      return Response.json({ error: "No instruction provided" }, { status: 400 });
    }

    // Step 1: Create a Notice in the SANDBOX app (69ddc914cfcf229762ac123d)
    // This triggers the entity automation "S-Chat → Simpee Code Translator"
    await base44.asServiceRole.entities.Notice.create({
      title: instruction.slice(0, 60),
      content: instruction,
      posted_by: posted_by || "Kieran",
      section: "backend",
      type: "info",
      pinned: false
    });

    // Step 2: Also mirror the notice to the REAL portal so Kieran sees it in the INBOX
    const REAL_PORTAL_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJraWVyYW5ANXNlbnNlcy5nbG9iYWwiLCJleHAiOjE3ODc0MDg1NTMsImlhdCI6MTc3OTYzMjU1M30.feQst8q8CvGtFAlpy-Yl6Gp7qKVw84FPsbrK2oUAhFg";
    
    await fetch("https://app.base44.com/api/apps/69edd16e877d6e4391ad74bd/entities/Notice", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${REAL_PORTAL_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: instruction.slice(0, 60),
        content: instruction,
        posted_by: posted_by || "Kieran",
        section: "backend",
        type: "info",
        pinned: false
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
