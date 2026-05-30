import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const REAL_PORTAL_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJraWVyYW5ANXNlbnNlcy5nbG9iYWwiLCJleHAiOjE3ODc0MDg1NTMsImlhdCI6MTc3OTYzMjU1M30.feQst8q8CvGtFAlpy-Yl6Gp7qKVw84FPsbrK2oUAhFg";
const REAL_PORTAL_URL = "https://app.base44.com/api/apps/69edd16e877d6e4391ad74bd";

async function postToRealPortal(notice: object) {
  return fetch(`${REAL_PORTAL_URL}/entities/Notice`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${REAL_PORTAL_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(notice),
  });
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { question, context } = body;

    if (!question) {
      return Response.json({ error: "No question provided" }, { status: 400 });
    }

    // Step 1: Get M365 token and search for relevant context
    let m365Token = "";
    let searchContext = "";

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
              query: { queryString: question.slice(0, 120) },
              from: 0,
              size: 3,
            }],
          }),
        });
        const searchData = await searchRes.json();
        const hits = searchData?.value?.[0]?.hitsContainers?.[0]?.hits || [];
        if (hits.length > 0) {
          searchContext = "\n\nRelevant M365 docs:\n" + hits.map((h: any) =>
            `- ${h.resource?.subject || h.resource?.name || "item"}: ${h.summary || ""}`
          ).join("\n");
        }
      } catch (e) {}
    }

    // Step 2: Call OpenAI GPT-4o if key is available
    const openaiKey = Deno.env.get("OPENAI_API_KEY") || "";
    let answer = "";
    let modelUsed = "none";

    if (openaiKey) {
      const systemPrompt = `You are Simpee, the AI agent for SIMPLEX-ITY (5S Portal, Hong Kong).
You assist with React/JSX coding, TypeScript, Deno backend functions, and business decisions.
Portal stack: React + Base44. Design: #e8e6fe bg, #5e50fb accent, Exo 2/Montserrat fonts.
Give concise, actionable answers. For code: complete ready-to-paste solutions only.`;

      const userPrompt = question
        + (context ? `\n\nContext: ${context}` : "")
        + searchContext;

      const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          max_tokens: 1500,
          temperature: 0.3,
        }),
      });

      if (aiRes.ok) {
        const aiData = await aiRes.json();
        answer = aiData.choices?.[0]?.message?.content || "";
        modelUsed = "gpt-4o";
      }
    }

    // Step 3: Fallback if no key
    if (!answer) {
      answer = `Copilot is standing by.\n\nYour question: "${question}"\nM365 search: ${searchContext ? "context found ✅" : "no results"}\n\nReady to answer with full GPT-4o power once you add your OpenAI key tomorrow.`;
      modelUsed = "pending";
    }

    // Step 4: Post the response to real portal S-Chat
    await postToRealPortal({
      title: `Copilot — ${new Date().toLocaleTimeString("en-HK", { timeZone: "Asia/Hong_Kong" })}`,
      content: `Q: ${question}\n\nA: ${answer.slice(0, 800)}`,
      posted_by: "Simpee + Copilot",
      section: "schat",
      type: "info",
      pinned: false,
    });

    return Response.json({
      success: true,
      answer,
      m365_grounded: searchContext.length > 0,
      model: modelUsed,
    });

  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
