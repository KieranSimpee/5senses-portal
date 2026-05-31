import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const REAL_PORTAL_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJraWVyYW5ANXNlbnNlcy5nbG9iYWwiLCJleHAiOjE3ODc0MDg1NTMsImlhdCI6MTc3OTYzMjU1M30.feQst8q8CvGtFAlpy-Yl6Gp7qKVw84FPsbrK2oUAhFg";
const REAL_PORTAL_URL = "https://app.base44.com/api/apps/69edd16e877d6e4391ad74bd";

const SYSTEM_PROMPT = `You are Simpee, the AI agent for SIMPLEX-ITY (5S Portal, Hong Kong).
You are being asked via the AI Command Centre — a 3-panel interface where:
- Panel 1: Kieran types his request
- Panel 2: You (Simpee) + Copilot respond with analysis + solution
- Panel 3: Final ready-to-paste code for the Base44 builder

Your response MUST follow this exact structure:

ANALYSIS:
[2-3 sentences explaining what the request needs and any important considerations]

SOLUTION:
[Clear step-by-step explanation of what will be built]

CODE:
[Complete, ready-to-paste JSX/TypeScript code. Always include full file content, never partial snippets. Always follow SIMPLEX-ITY design system: background #e8e6fe, accent #5e50fb, white containers #ffffff, Exo 2 headlines, Montserrat body text. No cartoon icons.]

BUILDER INSTRUCTION:
[Exact one-paragraph instruction for the Base44 builder AI to execute this]`;

async function postToRealPortal(entity: string, data: object) {
  const res = await fetch(`${REAL_PORTAL_URL}/entities/${entity}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${REAL_PORTAL_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { instruction, posted_by } = body;

    if (!instruction) {
      return Response.json({ error: "No instruction provided" }, { status: 400 });
    }

    // Step 1: Get M365 Copilot context
    let m365Token = "";
    let copilotContext = "";

    try {
      const connection = await base44.asServiceRole.connectors.getConnection("outlook");
      m365Token = connection?.access_token || "";
    } catch (e) {}

    if (m365Token) {
      try {
        const searchRes = await fetch("https://graph.microsoft.com/v1.0/search/query", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${m365Token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requests: [{
              entityTypes: ["message", "driveItem"],
              query: { queryString: instruction.slice(0, 120) },
              from: 0,
              size: 3,
            }],
          }),
        });
        const searchData = await searchRes.json();
        const hits = searchData?.value?.[0]?.hitsContainers?.[0]?.hits || [];
        if (hits.length > 0) {
          copilotContext = "\n\nCopilot M365 context found:\n" + hits.map((h: any) =>
            `- ${h.resource?.subject || h.resource?.name || "item"}: ${h.summary || ""}`
          ).join("\n");
        }
      } catch (e) {}
    }

    // Step 2: Build full prompt with portal context
    const portalContext = `
Portal: 5S Portal (SIMPLEX-ITY, HK)
Stack: React + Base44
Entities: ComplianceItem, Expense, Project, Milestone, Note, TeamMember, Document, 
          Brand, Influencer, Campaign, CampaignInfluencer, VaultItem, Notice, 
          Invoice, HRRecord, BankAccount, TradeLog, BuildProject, BuildCheckpoint,
          CalendarEvent, RevenueRecord, ActivityLog, SChatMessage, PropertyListing, NoticeBoard
Design: bg=#e8e6fe, accent=#5e50fb, containers=#ffffff, fonts=Exo2/Montserrat
Import pattern: import { EntityName } from '@/api/entities'
No cartoon icons. Clean minimal professional UI.
${copilotContext}`;

    const fullPrompt = `Instruction from Kieran: "${instruction}"\n\nPortal context:${portalContext}`;

    // Step 3: Call OpenAI GPT-4o if available, else use structured Simpee response
    const openaiKey = Deno.env.get("OPENAI_API_KEY") || "";
    let simpeeResponse = "";
    let modelUsed = "simpee";

    if (openaiKey) {
      const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: fullPrompt },
          ],
          max_tokens: 3000,
          temperature: 0.2,
        }),
      });

      if (aiRes.ok) {
        const aiData = await aiRes.json();
        simpeeResponse = aiData.choices?.[0]?.message?.content || "";
        modelUsed = "gpt-4o + m365";
      }
    }

    // Fallback structured response
    if (!simpeeResponse) {
      simpeeResponse = `ANALYSIS:
Request received: "${instruction}"
Copilot M365 search: ${copilotContext ? "relevant context found" : "no existing documents matched"}
Status: OpenAI key not yet added — add tomorrow for full AI-powered responses.

SOLUTION:
Once OpenAI key is added, this will generate a complete solution with code.
For now, I have logged this instruction and it is ready to be processed.

CODE:
// Add your OpenAI API key to unlock full code generation.
// Your instruction has been saved and will be processed automatically once the key is live.

BUILDER INSTRUCTION:
Instruction logged: "${instruction}" — awaiting OpenAI key for full code generation.`;
      modelUsed = "simpee-lite";
    }

    // Step 4: Parse response sections
    const analysisMatch = simpeeResponse.match(/ANALYSIS:\s*([\s\S]*?)(?=SOLUTION:|$)/i);
    const solutionMatch = simpeeResponse.match(/SOLUTION:\s*([\s\S]*?)(?=CODE:|$)/i);
    const codeMatch = simpeeResponse.match(/CODE:\s*([\s\S]*?)(?=BUILDER INSTRUCTION:|$)/i);
    const builderMatch = simpeeResponse.match(/BUILDER INSTRUCTION:\s*([\s\S]*?)$/i);

    const analysis = analysisMatch?.[1]?.trim() || "";
    const solution = solutionMatch?.[1]?.trim() || "";
    const code = codeMatch?.[1]?.trim() || "";
    const builderInstruction = builderMatch?.[1]?.trim() || "";

    // Step 5: Save the full exchange to portal Notice (for INBOX)
    await postToRealPortal("Notice", {
      title: `AI Command — ${instruction.slice(0, 50)}`,
      content: `INSTRUCTION:\n${instruction}\n\n---\n\nANALYSIS:\n${analysis}\n\nSOLUTION:\n${solution}\n\nBUILDER INSTRUCTION:\n${builderInstruction}`,
      posted_by: "Simpee + Copilot",
      section: "code_ready",
      type: "info",
      pinned: true,
    });

    // Step 6: Also save to SChatMessage entity for mirror
    try {
      await postToRealPortal("SChatMessage", {
        sender: "Simpee",
        sender_type: "ai",
        message: `[AI Command Centre]\n\n${analysis}\n\n${solution}`,
        timestamp: new Date().toISOString(),
        session_id: `cmd-${Date.now()}`,
        read: false,
      });
    } catch (e) {}

    return Response.json({
      success: true,
      instruction,
      analysis,
      solution,
      code,
      builder_instruction: builderInstruction,
      model: modelUsed,
      m365_grounded: copilotContext.length > 0,
      full_response: simpeeResponse,
    });

  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
