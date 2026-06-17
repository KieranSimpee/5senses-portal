const GEMINI_KEY = Deno.env.get("GEMINI_API_KEY") || "AQ.Ab8RN6IQPye9pC-S4YgRmqwBbITfUiDcspAVhQN5Fa_9sBtb2Q";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

async function callGemini(prompt: string, maxTokens: number = 1024): Promise<string> {
  const res = await fetch(`${GEMINI_URL}?key=${GEMINI_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: maxTokens }
    })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

Deno.serve(async (req: Request) => {
  const { problem, objective, goal, stage, difficulty, roi_score, lead_time, extra_notes } = await req.json();

  if (!problem || !objective) {
    return new Response(JSON.stringify({ error: "problem and objective required" }), { status: 400 });
  }

  // ─── LAYER 1: SPOTTER AGENT ─────────────────────────────────────────────
  // Broad reconnaissance — flag top anomalies and surface the real pain
  const spotterPrompt = `You are the SPOTTER AGENT for ASIMPLEXIS CASCADE RESEARCH ARCHITECTURE.
Your role: Broad reconnaissance scan to identify the TOP 3 high-impact anomalies and flag technical debt or strategic risk.

PROJECT INPUT:
- Stage: ${stage}
- Problem: ${problem}
- Objective: ${objective}
- Goal: ${goal || "Not specified"}
- Difficulty: ${difficulty}
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

  // ─── LAYER 2: DEEP-DIVER AGENT (SVRS FRAMEWORK) ─────────────────────────
  // Story → Verify → Research → Solution with ROI estimation
  const deepDiverPrompt = `You are the DEEP-DIVER AGENT for ASIMPLEXIS CASCADE RESEARCH ARCHITECTURE.
You apply the STORY-VERIFY-RESEARCH-SOLUTION (SVRS) framework to produce a professional, investor-ready analysis.

PROJECT INPUT:
- Stage: ${stage}
- Problem: ${problem}
- Objective: ${objective}
- Goal: ${goal || "Not specified"}
- Difficulty: ${difficulty}
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

  try {
    // Run both agents
    const [spotterOutput, deepDiverOutput] = await Promise.all([
      callGemini(spotterPrompt, 512),
      callGemini(deepDiverPrompt, 1024)
    ]);

    // Combine into structured summary for frontend
    const summary = `━━ LAYER 1: SPOTTER RECONNAISSANCE ━━\n\n${spotterOutput}\n\n━━ LAYER 2: DEEP-DIVER ANALYSIS (SVRS) ━━\n\n${deepDiverOutput}`;

    return new Response(JSON.stringify({
      success: true,
      summary,
      spotter: spotterOutput,
      deep_diver: deepDiverOutput,
      model: "gemini-2.5-flash",
      architecture: "CASCADE_SVRS_v2",
      stage,
      difficulty
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
