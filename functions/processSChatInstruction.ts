import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json().catch(() => ({}));
    const { instruction, posted_by } = body;

    if (!instruction) {
      return Response.json({ error: "No instruction provided" }, { status: 400 });
    }

    // Save the instruction as a Notice so Simpee's entity automation picks it up
    await base44.asServiceRole.entities.Notice.create({
      title: `S-Chat → Backend: ${instruction.slice(0, 60)}`,
      content: `FROM: ${posted_by || "Kieran"}\n\nINSTRUCTION:\n${instruction}\n\n[Simpee will post CODE READY shortly]`,
      posted_by: posted_by || "Kieran",
      section: "backend",
      type: "info",
      pinned: false
    });

    return Response.json({
      success: true,
      message: "Got it. Simpee is processing your instruction and will post the code shortly."
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
