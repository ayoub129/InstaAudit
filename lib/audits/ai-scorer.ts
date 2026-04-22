type AiScoreResult = {
  score: number;
  findings: string[];
  rawData: Record<string, unknown>;
};

import { trackOpenAiApiCall } from "@/lib/analytics/usage-tracker";

const GPT_MODEL = process.env.OPENAI_AUDIT_MODEL || "gpt-4o-mini";

const MODULE_GUIDANCE: Record<string, string> = {
  hashtagStrategy: `
- 5-12 hashtags per post is optimal in 2026
- repetitionRate above 0.6 is a shadowban risk
- penalize heavily if no variety across posts
- banned/risky hashtags = immediate -30 points
`,
  engagementHealth: `
- Under 500k followers: 3-6% ER is healthy
- 500k-1M: 1.5-3% is healthy
- Over 1M: 1-2% is healthy
- recentAvgER vs olderAvgER shows trend — reward improving trends
- likeToCommentRatio under 10:1 = strong community
`,
  contentConsistency: `
- 3-5 posts/week is optimal for growth
- gaps over 10 days should heavily penalize
- consistency matters more than frequency
`,
  reelsPerformance: `
- viewRate = views/followers. 15-30% is healthy
- under 5% view rate = poor hook or wrong audience
- reward accounts with improving reel trends
`,
  profileStrength: `
- verified = +10 bonus
- missing profile category = -15
- bio under 80 chars = -20
- no external link = -25 for business accounts
`,
};

function unwrapJson(text: string): string {
  const clean = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "");
  return clean;
}

export async function scoreWithAI(
  moduleName: string,
  data: Record<string, unknown>,
  context: { username: string; followers: number; niche?: string },
): Promise<AiScoreResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set.");

  const guidance =
    MODULE_GUIDANCE[moduleName] ?? "Use Instagram best practices for 2025.";
  const prompt = `
You are an expert Instagram growth analyst. Score the following account data for the "${moduleName}" module.

Account: @${context.username} | ${context.followers.toLocaleString()} followers${context.niche ? ` | Niche: ${context.niche}` : ""}

Data to analyze:
${JSON.stringify(data, null, 2)}

Return ONLY a JSON object with this exact shape:
{
  "score": <integer 0-100>,
  "findings": [<2-4 specific, actionable strings based on the actual numbers>],
  "rawData": <the input data unchanged>
}

Scoring guidance for ${moduleName}:
${guidance}
`;

  await trackOpenAiApiCall(GPT_MODEL);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GPT_MODEL,
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI scoring failed (${response.status}): ${body}`);
  }

  const result = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = result.choices?.[0]?.message?.content?.trim() ?? "";
  const parsed = JSON.parse(unwrapJson(text)) as AiScoreResult;

  return {
    score: Math.max(0, Math.min(100, Math.round(Number(parsed.score) || 0))),
    findings: Array.isArray(parsed.findings) ? parsed.findings.slice(0, 4) : [],
    rawData: data,
  };
}
