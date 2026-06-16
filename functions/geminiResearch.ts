const GEMINI_KEY = Deno.env.get("GEMINI_API_KEY") || "AQ.Ab8RN6IQPye9pC-S4YgRmqwBbITfUiDcspAVhQN5Fa_9sBtb2Q";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

Deno.serve(async (req: Request) => {
  const { problem, objective, goal, stage, difficulty, roi_score, lead_time, extra_notes } = await req.json();

  if (!problem || !objective) {
    return new Response(JSON.stringify({ error: "problem and objective required" }), { status: 400 });
  }

  const prompt = `You are a senior AI research analyst for ASIMPLEXIS — a premium AI build engine platform. 
Your job is to produce a deep, professional research summary for an internal report.

INPUT:
- Stage: ${stage}
- Problem: ${problem}
- Objective: ${objective}
- Goal: ${goal || "Not specified"}
- ROI Score: ${roi_score || "Not scored"}/100
- Lead Time: ${lead_time || "Not specified"}
- Difficulty: ${difficulty}
- Extra Notes: ${extra_notes || "None"}

YOUR TASK:
Write a 4-paragraph professional research summary covering:

1. PROBLEM ANALYSIS — What is the real root cause? What breaks if this is left unsolved? What is the business risk?
2. MARKET CONTEXT — What do industry benchmarks say about this type of problem? Include relevant data points (cost of inaction, industry averages, competitor approaches).
3. ROI JUSTIFICATION — Based on the ROI score of ${roi_score || "N/A"}/100 and lead time of ${lead_time || "TBD"}, is this investment justified? What is the payback logic?
4. RECOMMENDATIONS — What are the 3 most important actions to take? What should be prioritised first and why?

TONE: Professional, data-driven, investor-ready. Write as if this will be seen by a VC or senior stakeholder.
FORMAT: Plain paragraphs only. No bullet points. No headers. No markdown. Just 4 clean paragraphs.`;

  try {
    const res = await fetch(`${GEMINI_URL}?key=${GEMINI_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      })
    });

    const data = await res.json();
    
    if (data.error) {
      return new Response(JSON.stringify({ error: data.error.message }), { status: 500 });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    return new Response(JSON.stringify({ 
      success: true, 
      summary: text,
      model: "gemini-2.5-flash",
      stage,
      difficulty 
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
