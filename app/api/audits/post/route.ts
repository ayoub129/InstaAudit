import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserPlan } from "@/lib/plans/get-user-plan";
import { fetchProfile } from "@/lib/instagram/fetch-profile";
import {
  RapidApiClientError,
  getPostComments,
  getPostDetail,
  normalizeMediaShortcode,
} from "@/lib/instagram/rapidapi-client";

const POSITIVE_WORDS = [
  "great",
  "love",
  "amazing",
  "fire",
  "awesome",
  "nice",
  "best",
  "perfect",
  "helpful",
];
const NEGATIVE_WORDS = [
  "bad",
  "hate",
  "boring",
  "worst",
  "poor",
  "spam",
  "annoying",
  "confusing",
  "fake",
];
const CTA_REGEX =
  /(dm|book|buy|shop|join|click|link in bio|comment|save|share|follow|subscribe)/i;
const STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "you",
  "your",
  "that",
  "this",
  "with",
  "from",
  "have",
  "just",
  "are",
  "was",
  "but",
  "not",
  "out",
  "all",
  "can",
  "our",
  "its",
  "they",
  "their",
  "about",
  "into",
  "here",
  "what",
  "when",
  "who",
  "why",
  "how",
  "too",
  "very",
  "more",
  "than",
  "post",
  "nice",
  "good",
]);

function extractCaptionFromDetail(detail: Record<string, unknown>): string {
  const edge = detail.edge_media_to_caption as
    | { edges?: Array<{ node?: { text?: string } }> }
    | undefined;
  return edge?.edges?.[0]?.node?.text ?? "";
}

function getLikeCount(detail: Record<string, unknown>): number {
  const edge = detail.edge_media_preview_like as { count?: number } | undefined;
  return edge?.count ?? 0;
}

function getCommentCount(detail: Record<string, unknown>): number {
  const parent = detail.edge_media_to_parent_comment as
    | { count?: number }
    | undefined;
  const preview = detail.edge_media_preview_comment as
    | { count?: number }
    | undefined;
  return parent?.count ?? preview?.count ?? 0;
}

function calcHookScore(caption: string): number {
  const firstLine = caption.split("\n")[0] ?? "";
  let score = 50;
  if (firstLine.length >= 8 && firstLine.length <= 90) score += 20;
  if (/[!?]/.test(firstLine)) score += 10;
  if (/^\d+|how to|stop|why|3 ways|5 tips/i.test(firstLine.trim())) score += 15;
  return Math.max(0, Math.min(100, score));
}

function calcCaptionScore(caption: string): number {
  const len = caption.trim().length;
  let score = 50;
  if (len >= 80 && len <= 500) score += 25;
  else if (len >= 40 && len <= 700) score += 15;
  if (CTA_REGEX.test(caption)) score += 20;
  if (caption.split("\n").length >= 2) score += 5;
  return Math.max(0, Math.min(100, score));
}

function calcHashtagFitScore(caption: string): {
  score: number;
  count: number;
} {
  const hashtags = caption.match(/#[\p{L}\p{N}_]+/gu) ?? [];
  const count = hashtags.length;
  let score = 40;
  if (count >= 5 && count <= 12) score += 40;
  else if (count >= 3 && count <= 15) score += 25;
  const unique = new Set(hashtags.map((h) => h.toLowerCase())).size;
  if (unique === count) score += 20;
  return { score: Math.max(0, Math.min(100, score)), count };
}

function summarizeCommentSentiment(comments: string[]) {
  let positive = 0;
  let negative = 0;
  for (const c of comments) {
    const lower = c.toLowerCase();
    if (POSITIVE_WORDS.some((w) => lower.includes(w))) positive += 1;
    if (NEGATIVE_WORDS.some((w) => lower.includes(w))) negative += 1;
  }
  const total = comments.length || 1;
  return {
    positiveRate: Number(((positive / total) * 100).toFixed(1)),
    negativeRate: Number(((negative / total) * 100).toFixed(1)),
    neutralRate: Number(
      (((total - positive - negative) / total) * 100).toFixed(1),
    ),
  };
}

function topThemes(comments: string[]): string[] {
  const freq = new Map<string, number>();
  for (const comment of comments) {
    const tokens = comment.toLowerCase().match(/[a-z]{3,}/g) ?? [];
    for (const token of tokens) {
      if (STOPWORDS.has(token)) continue;
      freq.set(token, (freq.get(token) ?? 0) + 1);
    }
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}

function buildRewriteSuggestions(input: {
  hookScore: number;
  captionScore: number;
  hashtagCount: number;
  engagementDeltaPct: number;
}): string[] {
  const suggestions: string[] = [];
  if (input.hookScore < 65) {
    suggestions.push(
      "Rewrite the first line into a curiosity hook (question, bold claim, or numbered promise).",
    );
  }
  if (input.captionScore < 65) {
    suggestions.push(
      "Add a clearer CTA near the end (e.g. comment, save, or share) and tighten caption structure.",
    );
  }
  if (input.hashtagCount < 5 || input.hashtagCount > 12) {
    suggestions.push(
      "Adjust hashtags to 5-12 focused tags mixing niche + broad discovery terms.",
    );
  }
  if (input.engagementDeltaPct < 0) {
    suggestions.push(
      "Replicate the format of your top-performing post type and test a stronger opening visual.",
    );
  }
  if (!suggestions.length) {
    suggestions.push(
      "Keep the structure, then A/B test two hook variants to push additional engagement.",
    );
  }
  return suggestions.slice(0, 4);
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plan = getUserPlan(session.user);
    if (!(plan === "pro" || plan === "agency")) {
      return NextResponse.json(
        {
          error: "Post-level audit is available on Pro/Agency plans.",
          code: "UPGRADE_REQUIRED",
        },
        { status: 403 },
      );
    }

    const body = await request.json();
    const postUrl = String(body?.postUrl ?? "").trim();
    if (!postUrl) {
      return NextResponse.json(
        { error: "postUrl is required" },
        { status: 400 },
      );
    }

    const mediaCode = normalizeMediaShortcode(postUrl);
    const detail = (await getPostDetail(mediaCode)) as unknown as Record<
      string,
      unknown
    >;
    const mediaId = String(detail.id ?? "");
    const owner = detail.owner as { username?: string } | undefined;
    const caption = extractCaptionFromDetail(detail);
    const likeCount = getLikeCount(detail);
    const commentCount = getCommentCount(detail);

    let comments: string[] = [];
    if (mediaId) {
      const commentsRes = await getPostComments(mediaId);
      comments = (commentsRes.comments ?? [])
        .map((c) => c.text?.trim() ?? "")
        .filter(Boolean)
        .slice(0, 100);
    }

    let accountAvgEngagementRate = 0;
    if (owner?.username) {
      const profile = await fetchProfile(owner.username, plan, session.user.id);
      accountAvgEngagementRate =
        profile.avgEngagementRate ??
        (profile.posts.length
          ? (profile.posts.reduce(
              (sum, p) => sum + p.likeCount + p.commentCount,
              0,
            ) /
              profile.posts.length /
              Math.max(1, profile.followerCount)) *
            100
          : 0);
    }

    const postEngagementRate = accountAvgEngagementRate
      ? ((likeCount + commentCount) /
          Math.max(
            1,
            Number(
              (detail.owner &&
                (detail.owner as { edge_followed_by?: { count?: number } })
                  .edge_followed_by?.count) ??
                0,
            ),
          )) *
        100
      : 0;

    const engagementDeltaPct =
      accountAvgEngagementRate > 0
        ? Number(
            (
              ((postEngagementRate - accountAvgEngagementRate) /
                accountAvgEngagementRate) *
              100
            ).toFixed(1),
          )
        : 0;

    const hookScore = calcHookScore(caption);
    const captionScore = calcCaptionScore(caption);
    const hashtag = calcHashtagFitScore(caption);
    const sentiment = summarizeCommentSentiment(comments);
    const themes = topThemes(comments);

    const rewriteSuggestions = buildRewriteSuggestions({
      hookScore,
      captionScore,
      hashtagCount: hashtag.count,
      engagementDeltaPct,
    });

    return NextResponse.json({
      success: true,
      result: {
        postUrl,
        mediaCode,
        ownerUsername: owner?.username ?? null,
        scores: {
          hookScore,
          captionScore,
          hashtagFitScore: hashtag.score,
        },
        engagement: {
          likes: likeCount,
          comments: commentCount,
          engagementVsAccountAveragePct: engagementDeltaPct,
          accountAverageEngagementRate: Number(
            accountAvgEngagementRate.toFixed(2),
          ),
        },
        comments: {
          analyzedCount: comments.length,
          sentiment,
          topThemes: themes,
        },
        rewriteSuggestions,
      },
    });
  } catch (error) {
    if (error instanceof RapidApiClientError) {
      const statusMap: Record<string, number> = {
        NOT_FOUND: 404,
        PRIVATE_ACCOUNT: 422,
        RATE_LIMITED: 429,
        BLOCKED: 503,
        FETCH_FAILED: 502,
      };
      const status = statusMap[error.code] ?? 502;
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status },
      );
    }
    console.error("[audits/post] Failed:", error);
    return NextResponse.json(
      { error: "Failed to run post audit" },
      { status: 500 },
    );
  }
}
