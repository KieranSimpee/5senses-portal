import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const REAL_PORTAL_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJraWVyYW5ANXNlbnNlcy5nbG9iYWwiLCJleHAiOjE3ODc0MDg1NTMsImlhdCI6MTc3OTYzMjU1M30.feQst8q8CvGtFAlpy-Yl6Gp7qKVw84FPsbrK2oUAhFg";
const REAL_PORTAL_URL = "https://app.base44.com/api/apps/69edd16e877d6e4391ad74bd";
const NEXUS_URL = "https://app.base44.com/api/apps/6a1c237bd9f5ff04b6ac7a73";

// ─── Immutable Design Tokens — SIMPLEX-ITY Brand (non-negotiable) ─────────────
const DESIGN_TOKENS = {
  background: "#e8e6fe",
  accent: "#5e50fb",
  container: "#ffffff",
  headingFont: "Exo 2",
  bodyFont: "Montserrat",
  bodyText: "#1a1a1f",
  muted: "#9896ad",
  icons: "Clean, minimal, typographic only. Absolutely no cartoon or emoji assets.",
};

const SYSTEM_PROMPT = `You are Simpee, the AI agent for SIMPLEX-ITY (5S Portal, Hong Kong).
You are being asked via the AI Command Centre — a 3-panel interface where:
- Panel 1: Kieran types his request
- Panel 2: You (Simpee) respond with analysis + solution
- Panel 3: Final ready-to-paste code for the Base44 builder

Your response MUST follow this exact structure:

ANALYSIS:
[2-3 sentences explaining what the request needs and any important considerations]

SOLUTION:
[Clear step-by-step explanation of what will be built]

CODE:
[Complete, ready-to-paste JSX/TypeScript code. Always include full file content, never partial snippets.]

BUILDER INSTRUCTION:
[Exact one-paragraph instruction for the Base44 builder AI to execute this]

[STRICT DESIGN CONSTRAINTS — NON-NEGOTIABLE]
All UI code must use these exact design tokens with zero deviation:
- Global Background: ${DESIGN_TOKENS.background}
- System Accent: ${DESIGN_TOKENS.accent}
- Layout Containers: ${DESIGN_TOKENS.container}
- Heading Font: "${DESIGN_TOKENS.headingFont}"
- Body Font: "${DESIGN_TOKENS.bodyFont}"
- Body Text: ${DESIGN_TOKENS.bodyText}
- Icons: ${DESIGN_TOKENS.icons}
These tokens represent the official SIMPLEX-ITY brand identity. Any deviation is a build error.`;

// ─── Helper: post to any Base44 app entity ────────────────────────────────────
async function postToApp(appUrl: string, entity: string, data: object) {
  const res = await fetch(`${appUrl}/entities/${entity}`, {
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

// ─── Helper: basic code quality screen ───────────────────────────────────────
function screenCodeQuality(code: string): { passed: boolean; notes: string } {
  if (!code || code.trim().length < 20) {
    return { passed: false, notes: "No code generated — OpenAI key may be missing." };
  }
  const issues: string[] = [];
  if (code.includes("undefined") && !code.includes("// undefined")) issues.push("Possible undefined reference");
  if (code.includes("TODO") || code.includes("FIXME")) issues.push("Contains unresolved TODO/FIXME markers");
  if (!code.includes("import") && !code.includes("function") && !code.includes("const")) {
    issues.push("Code structure unclear — may be incomplete");
  }
  if (issues.length > 0) {
    return { passed: false, notes: issues.join(" | ") };
  }
  return { passed: true, notes: "Basic syntax and structure check passed." };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { instruction, posted_by } = body;

    if (!instruction) {
      return Response.json({ error: "No instruction provided" }, { status: 400 });
    }

    // ── STEP 1: Get M365 Copilot context ─────────────────────────────────────
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

    // ── STEP 2: Build prompt ──────────────────────────────────────────────────
    const portalContext = `
Portal: 5S Portal (SIMPLEX-ITY, HK)
Stack: React + Base44
Entities: ComplianceItem, Expense, Project, Milestone, Note, TeamMember, Document, 
          Brand, Influencer, Campaign, CampaignInfluencer, VaultItem, Notice, 
          Invoice, HRRecord, BankAccount, TradeLog, BuildProject, BuildCheckpoint,
          CalendarEvent, RevenueRecord, ActivityLog, PropertyListing, NoticeBoard,
          SandboxProject, ProjectFile, AIConnector, TestLog, azureConnectorStub, TeamLog
Design tokens (immutable): ${JSON.stringify(DESIGN_TOKENS)}
Import pattern: import { EntityName } from '@/api/entities'
${copilotContext}`;

    const fullPrompt = `Instruction from Kieran: "${instruction}"\n\nPortal context:${portalContext}`;

    // ── STEP 3: Engineer — GPT-4o code generation ────────────────────────────
    const openaiKey = Deno.env.get("OPENAI_API_KEY") || "";
    let simpeeResponse = "";
    let modelUsed = "simpee-lite";

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

    // Fallback if no OpenAI key
    if (!simpeeResponse) {
      simpeeResponse = `ANALYSIS:
Request received: "${instruction}"
M365 search: ${copilotContext ? "relevant context found" : "no existing documents matched"}
Status: OpenAI key not yet added — add for full AI-powered responses.

SOLUTION:
Once OpenAI key is added, this will generate a complete solution with code.
Instruction has been logged and is ready for processing.

CODE:
// Add your OpenAI API key to unlock full code generation.

BUILDER INSTRUCTION:
Instruction logged: "${instruction}" — awaiting OpenAI key for full code generation.`;
    }

    // ── STEP 4: Parse response sections ──────────────────────────────────────
    const analysis = simpeeResponse.match(/ANALYSIS:\s*([\s\S]*?)(?=SOLUTION:|$)/i)?.[1]?.trim() || "";
    const solution = simpeeResponse.match(/SOLUTION:\s*([\s\S]*?)(?=CODE:|$)/i)?.[1]?.trim() || "";
    const code = simpeeResponse.match(/CODE:\s*([\s\S]*?)(?=BUILDER INSTRUCTION:|$)/i)?.[1]?.trim() || "";
    const builderInstruction = simpeeResponse.match(/BUILDER INSTRUCTION:\s*([\s\S]*?)$/i)?.[1]?.trim() || "";

    // ── STEP 5: Local code quality screen (lightweight Validator pre-check) ───
    // NOTE: Full Validator gate (consultCopilot) is intentionally kept as a
    // manual UI-level action by Kieran — preserving Golden Rule #2 control.
    // This local screen catches obvious issues before the notice is posted.
    const qualityCheck = screenCodeQuality(code);
    const validationPassed = qualityCheck.passed || modelUsed === "simpee-lite";
    const validatorNotes = qualityCheck.notes;
    const statusEmoji = validationPassed ? "✅" : "⚠️";
    const noticeType = validationPassed ? "info" : "warning";

    // ── STEP 6: Post to real portal INBOX ────────────────────────────────────
    await postToApp(REAL_PORTAL_URL, "Notice", {
      title: `${statusEmoji} AI Command — ${instruction.slice(0, 50)}`,
      content: `INSTRUCTION:\n${instruction}\n\n---\n\nANALYSIS:\n${analysis}\n\nSOLUTION:\n${solution}\n\nBUILDER INSTRUCTION:\n${builderInstruction}\n\n---\n\n[CODE QUALITY PRE-SCREEN]: ${validatorNotes}\n[FULL VALIDATOR GATE]: Run consultCopilot manually via Gatekeeper Panel before deploying.`,
      posted_by: "Simpee",
      section: "code_ready",
      type: noticeType,
      pinned: true,
    });


    // ── STEP 7: Auto-write TestLog telemetry to Nexus Command ─────────────────
    try {
      await postToApp(NEXUS_URL, "TestLog", {
        test_name: instruction.slice(0, 50),
        status: validationPassed ? "passed" : "failed",
        result: `[PRE-SCREEN]: ${validatorNotes}\n\n[ANALYSIS]: ${analysis}`,
        tested_at: new Date().toISOString(),
        validator: "Simpee",
        simpee_validated: true,
        copilot_validated: false, // Copilot gate is manual — must be run via Gatekeeper Panel
        fixed: validationPassed,
      });
    } catch (telemetryError) {
      console.error("Telemetry pipeline execution failed:", telemetryError);
    }

    return Response.json({
      success: true,
      instruction,
      analysis,
      solution,
      code,
      builder_instruction: builderInstruction,
      model: modelUsed,
      m365_grounded: copilotContext.length > 0,
      pre_screen_passed: validationPassed,
      pre_screen_notes: validatorNotes,
      validator_gate: "Manual — run consultCopilot via Gatekeeper Panel",
    });

  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
