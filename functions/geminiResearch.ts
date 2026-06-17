// CASCADE RESEARCH ARCHITECTURE v2 — Azure OpenAI GPT-4o
// Spotter Agent + Deep-Diver Agent with SVRS Framework
// Uses same Azure key as consultCopilot — no new secrets needed

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const AZURE_ENDPOINT = Deno.env.get("AZURE_OPENAI_ENDPOINT") || "https://kiera-mpv1nhzc-eastus2.cognitiveservices.azure.com/";
const AZURE_DEPLOYMENT = "gpt-4o";
const AZURE_API_VERSION = "2025-01-01-preview";

async function callAzure(prompt: string, azureKey: string, maxTokens: number = 800): Promise<string> {
  const url = `${AZURE_ENDPOINT}openai/deployments/${AZURE_DEPLOYMENT}/chat/completions?api-version=${AZURE_API_VERSION}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "api-key": azureKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Azure error ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { problem, objective, goal, stage, difficulty, roi_score, lead_time, extra_notes } = body;

    if (!problem || !objective) {
      return Response.json({ error: "problem and objective required" }, { status: 400 });
    }

    const azureKey = Deno.env.get("AZURE_OPENAI_API_KEY_3") || "";
    if (!azureKey) {
      return Response.json({ error: "Azure API key not configured. Add AZURE_OPENAI_API_KEY_3 to app secrets." }, { status: 500 });
    }

    // ─── LAYER 1: SPOTTER AGENT ─────────────────────────────────────────
    const spotterPrompt = `You are the SPOTTER AGENT for ASIMPLEXIS CASCADE RESEARCH ARCHITECTURE.
Your role: Broad reconnaissance scan to identify the TOP 3 high-impact anomalies and flag technical debt or strategic risk.

PROJECT INPUT:
- Stage: ${stage || "Build"}
- Problem: ${problem}
- Objective: ${objective}
- Goal: ${goal || "Not specified"}
- Difficulty: ${difficulty || "Medium"}
- ROI Score: ${roi_score || "N/A"}/100
- Lead Time: ${lead_time || "Not specified"}
- Notes: ${extra_notes || "None"}

YOUR OUTPUT — write exactly 3 findings in this format:
FINDING 1: [One sentence — the anomaly or risk]
IMPACT: [One sentence — what breaks if ignored]
FINDING 2: [One sentence — the anomaly or risk]
IMPACT: [One sentence — what breaks if ignored]
FINDING 3: [One sentence — the anomaly or risk]
IMPACT: [One sentence — what breaks if ignored]

Be specific, data-aware, and investor-sharp. No padding. No markdown symbols.`;

    // ─── LAYER 2: DEEP-DIVER AGENT (SVRS FRAMEWORK) ─────────────────────
    const deepDiverPrompt = `You are the DEEP-DIVER AGENT for ASIMPLEXIS CASCADE RESEARCH ARCHITECTURE.
You apply the STORY-VERIFY-RESEARCH-SOLUTION (SVRS) framework to produce a professional, investor-ready analysis.

PROJECT INPUT:
- Stage: ${stage || "Build"}
- Problem: ${problem}
- Objective: ${objective}
- Goal: ${goal || "Not specified"}
- Difficulty: ${difficulty || "Medium"}
- ROI Score: ${roi_score || "N/A"}/100
- Lead Time: ${lead_time || "Not specified"}
- Notes: ${extra_notes || "None"}

SVRS FRAMEWORK — write exactly 4 labelled sections:

STORY — The Pain Narrative:
[2-3 sentences. What is the real human and business story behind this problem? What does failure look like for the people involved? Make it vivid and real.]

VERIFY — Cultural & Psychological Context:
[2-3 sentences. What cultural factors, behavioural patterns, or psychological dynamics are at play? Why does this problem persist despite awareness? What human bias or systemic inertia keeps it alive?]

RESEARCH — Evidence & Benchmarks:
[2-3 sentences. What do industry benchmarks say? Include data points on cost of inaction, competitor approaches, market standards, or time-to-resolution norms for this type of problem. Be specific — cite realistic figures.]

SOLUTION — Execution Plan & ROI:
[3-4 sentences. What is the concrete execution plan? What are the 3 priority actions in order? Given ROI score of ${roi_score || "N/A"}/100 and lead time of ${lead_time || "TBD"}, what is the payback logic and confidence level?]

TONE: Professional, data-driven, investor-ready. No bullet points. No markdown symbols. No headers beyond the 4 labels above.`;

    // Run both agents in parallel
    const [spotter, deepDiver] = await Promise.all([
      callAzure(spotterPrompt, azureKey, 512),
      callAzure(deepDiverPrompt, azureKey, 1024)
    ]);

    const summary = `━━ LAYER 1: SPOTTER RECONNAISSANCE ━━\n\n${spotter}\n\n━━ LAYER 2: DEEP-DIVER ANALYSIS (SVRS) ━━\n\n${deepDiver}`;

    return Response.json({
      success: true,
      summary,
      spotter,
      deep_diver: deepDiver,
      model: "azure-gpt-4o",
      architecture: "CASCADE_SVRS_v2",
      stage,
      difficulty
    });

  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
});
