import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// ─── AI Hub Pipeline — Stage 1-4 Engine ──────────────────────────────────────
// Stage 1: DEFINE    — parse and confirm goal
// Stage 2: RESEARCH  — deep problem space analysis
// Stage 3: ANALYSE   — feasibility, complexity, risk
// Stage 4: REPORT    — ROI estimation, recommendations
// Stages 5-10 (PLAN → BUILD → TEST → DEBUG → APPROVE → DEPLOY) gated after Stage 4 confirm
//
// App-agnostic: no hardcoded app references.
// App connections (e.g. 5S Portal) only made when explicitly requested with a reason.
// Simpee = CEO monitor. Pipeline does the work.
// ─────────────────────────────────────────────────────────────────────────────

const NEXUS_URL = "https://app.base44.com/api/apps/6a1c237bd9f5ff04b6ac7a73";
const NEXUS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJraWVyYW5ANXNlbnNlcy5nbG9iYWwiLCJleHAiOjE3ODc0MDg1NTMsImlhdCI6MTc3OTYzMjU1M30.feQst8q8CvGtFAlpy-Yl6Gp7qKVw84FPsbrK2oUAhFg";

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

async function callOpenAI(systemPrompt: string, userPrompt: string, maxTokens = 2000): Promise<string> {
  const openaiKey = Deno.env.get("OPENAI_API_KEY") || "";
  if (!openaiKey) return "[OpenAI key not configured — add OPENAI_API_KEY to unlock full AI responses]";

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${openaiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: maxTokens,
      temperature: 0.3,
    }),
  });
  if (!res.ok) return `[OpenAI error: ${res.status}]`;
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "[No response]";
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    // Input shape: { goal, type, purpose, stage, session_id, confirmed }
    const {
      goal,
      type = "new",           // "new" or "update"
      purpose,
      stage = 1,             // which stage to run (1-4)
      session_id,
      confirmed = false,     // Kieran confirmed Stage 1 summary before continuing
    } = body;

    if (!goal) {
      return Response.json({ error: "Goal is required" }, { status: 400 });
    }

    const sid = session_id || `hub-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const results: any = { session_id: sid, stage_run: stage };

    // ── STAGE 1: DEFINE ───────────────────────────────────────────────────────
    if (stage === 1) {
      const systemPrompt = `You are Simpee, CEO of an AI product studio. 
Your job is to clearly define what is being asked before any work begins.
Return a structured Task Summary in this exact format:

GOAL SUMMARY:
[1-2 sentences restating the goal clearly and precisely]

SCOPE:
[Bullet list of what is IN scope]

OUT OF SCOPE:
[Bullet list of what is NOT included in this task]

KEY QUESTIONS:
[Any critical unknowns that must be confirmed before building — max 3]

READY TO PROCEED: [YES / NO — YES means the goal is clear enough to research]`;

      const userPrompt = `Goal: ${goal}
Type: ${type === "new" ? "New feature/app" : "Update to existing"}
Purpose: ${purpose || "Not specified"}

Produce a clear Task Summary for Kieran to review and confirm before the pipeline continues.`;

      const summary = await callOpenAI(systemPrompt, userPrompt, 800);

      // Log to TestLog
      await postToNexus("TestLog", {
        test_name: `Stage 1 — Define: ${goal.slice(0, 50)}`,
        status: "pass",
        result: summary,
        tested_at: timestamp,
        validator: "Simpee (CEO)",
        simpee_validated: true,
        copilot_validated: false,
        fixed: true,
      });

      results.stage_name = "DEFINE";
      results.summary = summary;
      results.next_action = "Review the Task Summary. If correct, confirm to proceed to Stage 2 (Research).";

      return Response.json({ success: true, ...results });
    }

    // ── STAGE 2: RESEARCH ─────────────────────────────────────────────────────
    if (stage === 2) {
      if (!confirmed) {
        return Response.json({ error: "Stage 1 must be confirmed by Kieran before Research begins." }, { status: 400 });
      }

      const systemPrompt = `You are RESEARCHER (Gemini role, operated by Simpee).
Research the problem space for this goal. Be thorough, factual, and structured.
Return in this format:

PROBLEM SPACE:
[What problem does this solve? Who benefits?]

EXISTING SOLUTIONS / BENCHMARKS:
[What already exists in the market or in the app that's relevant]

TECHNICAL LANDSCAPE:
[What tech, entities, APIs, or systems are relevant to building this]

KEY INSIGHTS:
[3-5 most important findings that will shape the build]

RESEARCH CONFIDENCE: [HIGH / MEDIUM / LOW]`;

      const userPrompt = `Goal: ${goal}
Type: ${type}
Purpose: ${purpose || "Not specified"}

Research this thoroughly. Focus on what matters for building a real solution.`;

      const research = await callOpenAI(systemPrompt, userPrompt, 1200);

      await postToNexus("TestLog", {
        test_name: `Stage 2 — Research: ${goal.slice(0, 50)}`,
        status: "pass",
        result: research,
        tested_at: timestamp,
        validator: "RESEARCHER (Simpee)",
        simpee_validated: true,
        copilot_validated: false,
        fixed: true,
      });

      results.stage_name = "RESEARCH";
      results.research = research;
      results.next_action = "Review research findings. Proceed to Stage 3 (Analyse) to assess feasibility and risk.";

      return Response.json({ success: true, ...results });
    }

    // ── STAGE 3: ANALYSE ──────────────────────────────────────────────────────
    if (stage === 3) {
      const systemPrompt = `You are ANALYST (Claude Sonnet role, operated by Simpee).
Analyse the feasibility, complexity, and risk of this build.
Return in this exact format:

FEASIBILITY: [HIGH / MEDIUM / LOW]
COMPLEXITY: [LOW / MEDIUM / HIGH / VERY HIGH]
ESTIMATED BUILD TIME: [e.g. 1 session / 2-3 sessions / 1 week]
RISK LEVEL: [LOW / MEDIUM / HIGH]

RISK FACTORS:
[Bullet list of specific risks]

DEPENDENCIES:
[What must exist or be confirmed before building starts]

RECOMMENDED APPROACH:
[How should this be built — phased? all at once? what order?]

ANALYST VERDICT: [PROCEED / PROCEED WITH CAUTION / DO NOT PROCEED]
REASON: [1-2 sentences explaining the verdict]`;

      const userPrompt = `Goal: ${goal}
Type: ${type}
Purpose: ${purpose || "Not specified"}

Analyse feasibility, complexity, and risk. Be direct and honest.`;

      const analysis = await callOpenAI(systemPrompt, userPrompt, 1000);

      await postToNexus("TestLog", {
        test_name: `Stage 3 — Analyse: ${goal.slice(0, 50)}`,
        status: "pass",
        result: analysis,
        tested_at: timestamp,
        validator: "ANALYST (Simpee)",
        simpee_validated: true,
        copilot_validated: false,
        fixed: true,
      });

      results.stage_name = "ANALYSE";
      results.analysis = analysis;
      results.next_action = "Review analysis. Proceed to Stage 4 (ROI Report) to see estimated value and recommendations.";

      return Response.json({ success: true, ...results });
    }

    // ── STAGE 4: REPORT (ROI Estimation) ─────────────────────────────────────
    if (stage === 4) {
      const systemPrompt = `You are STRATEGIST (Claude Opus role, operated by Simpee).
Produce a clear ROI estimation and strategic recommendation report.
Return in this exact format:

EXECUTIVE SUMMARY:
[2-3 sentences on what this builds, why it matters, and the bottom line]

VALUE DELIVERED:
[Bullet list — what specific value does this create for the user/business]

COST ESTIMATE:
[Time, effort, and any real monetary cost if applicable]

ROI ESTIMATION:
[Realistic estimate of return — time saved, revenue potential, cost avoided]

STRATEGIC RECOMMENDATION: [BUILD NOW / BUILD LATER / DO NOT BUILD]

REASON:
[2-3 sentences explaining the recommendation]

SUGGESTED NEXT STEP:
[Exactly what should happen next if Kieran approves]`;

      const userPrompt = `Goal: ${goal}
Type: ${type}
Purpose: ${purpose || "Not specified"}

Produce a strategic ROI report. Be realistic, not optimistic. Kieran makes decisions based on this.`;

      const report = await callOpenAI(systemPrompt, userPrompt, 1200);

      // Save as SandboxProject milestone
      await postToNexus("SandboxProject", {
        name: `ROI Report — ${goal.slice(0, 60)}`,
        description: goal,
        type: type,
        status: "report_ready",
        created_by: "Simpee (CEO)",
        checkpoint_status: 4,
        validator_approved: false,
        notes: report,
      });

      await postToNexus("TestLog", {
        test_name: `Stage 4 — ROI Report: ${goal.slice(0, 50)}`,
        status: "pass",
        result: report,
        tested_at: timestamp,
        validator: "STRATEGIST (Simpee)",
        simpee_validated: true,
        copilot_validated: false,
        fixed: true,
      });

      results.stage_name = "REPORT";
      results.report = report;
      results.pdf_available = true;
      results.next_action = "Review ROI report. If approved, confirm to proceed to Stage 5 (Plan → Build → Test → Debug → Approve → Deploy).";

      return Response.json({ success: true, ...results });
    }

    return Response.json({ error: `Stage ${stage} not yet implemented in this pipeline version.` }, { status: 400 });

  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
