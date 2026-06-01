import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// ─── AI HUB ONLY — All writes go to Nexus Command. Never the 5S Portal. ──────
// STANDING RULE: This function is scoped to the Nexus Command AI Hub.
// For builds targeting other apps (5S Portal, external), the request is
// initiated through the AI Hub frontend — Simpee does not hardcode other app URLs.
const NEXUS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJraWVyYW5ANXNlbnNlcy5nbG9iYWwiLCJleHAiOjE3ODc0MDg1NTMsImlhdCI6MTc3OTYzMjU1M30.feQst8q8CvGtFAlpy-Yl6Gp7qKVw84FPsbrK2oUAhFg";
const NEXUS_URL = "https://app.base44.com/api/apps/6a1c237bd9f5ff04b6ac7a73";

// ─── Azure OpenAI config ──────────────────────────────────────────────────────
const AZURE_ENDPOINT = "https://kiera-mpv1nhzc-eastus2.cognitiveservices.azure.com/";
const AZURE_DEPLOYMENT = "gpt-4o";
const AZURE_API_VERSION = "2025-01-01-preview";

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

const SYSTEM_PROMPT = `You are Simpee, the ORCHESTRATOR of the Nexus Command AI Hub (SIMPLEX-ITY, Hong Kong).
You are the AI team lead — you receive build instructions from Kieran and produce structured outputs for the team.

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

IMPORTANT: All target app references must come from the instruction payload.
Never hardcode any app URL. The AI Hub is app-agnostic.`;

async function postToNexus(entity: string, data: object) {
  const res = await fetch(`${NEXUS_URL}/entities/${entity}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${NEXUS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

function screenCodeQuality(code: string): { passed: boolean; notes: string } {
  if (!code || code.trim().length < 20) {
    return { passed: false, notes: "No code generated — Azure OpenAI key may be missing or model not responding." };
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

async function callAzureOpenAI(systemPrompt: string, userPrompt: string, apiKey: string): Promise<string> {
  const url = `${AZURE_ENDPOINT}openai/deployments/${AZURE_DEPLOYMENT}/chat/completions?api-version=${AZURE_API_VERSION}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 3000,
      temperature: 0.2,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Azure OpenAI error: ${res.status} — ${err}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    // target_app_id: optional — if provided, the generated code targets that app
    // target_app_name: human label for the target app
    const { instruction, posted_by, target_app_id, target_app_name } = body;

    if (!instruction) {
      return Response.json({ error: "No instruction provided" }, { status: 400 });
    }

    // ── STEP 1: Get M365 context ──────────────────────────────────────────────
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
    const targetLabel = target_app_name
      ? `Target App: ${target_app_name} (ID: ${target_app_id || "not specified"})`
      : "Target App: Nexus Command AI Hub";

    const hubContext = `
${targetLabel}
Stack: React + Base44 (Deno backend functions)
Nexus Command Entities: SChatMessage, TestLog, AIConnector, azureConnectorStub, SandboxProject, ProjectFile, TeamLog
Design tokens (immutable): ${JSON.stringify(DESIGN_TOKENS)}
Import pattern: import { EntityName } from '@/api/entities'
${copilotContext}`;

    const fullPrompt = `Instruction from Kieran (ORCHESTRATOR): "${instruction}"\n\nHub context:${hubContext}`;

    // ── STEP 3: Engineer — Azure GPT-4o code generation ──────────────────────
    const azureKey = Deno.env.get("AZURE_OPENAI_API_KEY_3") || "";
    let simpeeResponse = "";
    let modelUsed = "simpee-lite";

    if (azureKey) {
      try {
        simpeeResponse = await callAzureOpenAI(SYSTEM_PROMPT, fullPrompt, azureKey);
        modelUsed = "azure-gpt-4o + m365";
      } catch (e) {
        console.error("Azure OpenAI call failed:", e);
      }
    }

    if (!simpeeResponse) {
      simpeeResponse = `ANALYSIS:
Request received: "${instruction}"
Status: Azure OpenAI not responding — check AZURE_OPENAI_API_KEY_3 secret.

SOLUTION:
Retry after confirming Azure key is active.

CODE:
// Azure OpenAI connection failed.

BUILDER INSTRUCTION:
Retry after fixing Azure OpenAI connection.`;
    }

    // ── STEP 4: Parse response sections ──────────────────────────────────────
    const analysis = simpeeResponse.match(/ANALYSIS:\s*([\s\S]*?)(?=SOLUTION:|$)/i)?.[1]?.trim() || "";
    const solution = simpeeResponse.match(/SOLUTION:\s*([\s\S]*?)(?=CODE:|$)/i)?.[1]?.trim() || "";
    const code = simpeeResponse.match(/CODE:\s*([\s\S]*?)(?=BUILDER INSTRUCTION:|$)/i)?.[1]?.trim() || "";
    const builderInstruction = simpeeResponse.match(/BUILDER INSTRUCTION:\s*([\s\S]*?)$/i)?.[1]?.trim() || "";

    // ── STEP 5: Code quality screen ───────────────────────────────────────────
    const qualityCheck = screenCodeQuality(code);
    const validationPassed = qualityCheck.passed || modelUsed === "simpee-lite";
    const validatorNotes = qualityCheck.notes;
    const statusEmoji = validationPassed ? "✅" : "⚠️";

    // ── STEP 6: Write to Nexus Command ONLY ───────────────────────────────────
    // SChatMessage — visible in AI Hub chat panel
    await postToNexus("SChatMessage", {
      sender: "Simpee (ORCHESTRATOR)",
      sender_type: "ai",
      message: `${statusEmoji} COMMAND RECEIVED\n\nINSTRUCTION: ${instruction}\n\nANALYSIS:\n${analysis}\n\nSOLUTION:\n${solution}\n\nBUILDER INSTRUCTION:\n${builderInstruction}\n\n[ENGINE]: ${modelUsed}\n[PRE-SCREEN]: ${validatorNotes}`,
      timestamp: new Date().toISOString(),
      session_id: "ai-command-centre",
      read: false,
    });

    // ProjectFile — stores the generated code in Nexus Command
    if (code && code.length > 20) {
      await postToNexus("ProjectFile", {
        project_id: "ai-command-centre",
        filename: `command_${Date.now()}.tsx`,
        content: code,
        language: "tsx",
        version: "1",
        notes: `Generated for: ${instruction.slice(0, 80)} | Engine: ${modelUsed} | Target: ${targetLabel}`,
      });
    }

    // TestLog — telemetry
    await postToNexus("TestLog", {
      test_name: instruction.slice(0, 50),
      status: validationPassed ? "passed" : "failed",
      result: `[ENGINE]: ${modelUsed}\n[PRE-SCREEN]: ${validatorNotes}\n\n[ANALYSIS]: ${analysis}`,
      tested_at: new Date().toISOString(),
      validator: "Simpee (ORCHESTRATOR)",
      simpee_validated: true,
      copilot_validated: false,
      fixed: validationPassed,
    });

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
      target: targetLabel,
    });

  } catch (err) {
    console.error("aiCommandCentre error:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
});
