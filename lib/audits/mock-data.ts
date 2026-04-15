import type { AuditResult } from "./types"

const MOCK_USERNAME = "ayoubberouijil"

export const MOCK_RESULTS: Record<"free" | "starter" | "pro" | "agency", AuditResult> = {
  free: {
    username: MOCK_USERNAME,
    overallScore: 54,
    profileSnapshot: {
      followerCount: 1240,
      followingCount: 890,
      postCount: 47,
      bio: "Helping entrepreneurs grow online 🚀 | DM for collabs",
      hasLinkInBio: false,
      accountType: "personal",
      dataSource: "scraper",
    },
    metrics: {
      bio: {
        score: 62,
        status: "good",
        details: [
          "Bio is a bit short. Aim for 80–150 characters to communicate more value.",
          "Add a call-to-action to your bio (e.g. 'DM for collabs' or 'Link below ↓').",
        ],
      },
      cta: {
        score: 38,
        status: "poor",
        details: [
          "No link found in your bio. Add a link (or Linktree) to direct followers to your content or offers.",
        ],
      },
      positioning: {
        score: 58,
        status: "fair",
        details: [
          "Your bio doesn't communicate a clear outcome or benefit for your audience.",
        ],
      },
    },
    tips: [
      "Add a link to your bio immediately. Use a link aggregator (Linktree, Beacons) if you have multiple destinations.",
      "Your bio is a bit short. Aim for 80–150 characters to clearly communicate who you are and who you help.",
      "Strengthen your positioning — try 'I help [audience] achieve [result] through [method]' as your bio formula.",
      "No CTA in your bio means followers don't know what to do next. Add 'DM for X' or 'Link below ↓'.",
    ],
    lockedPreviews: [
      { key: "captions", title: "Caption & hashtag analysis", requiredPlan: "starter" },
      { key: "contentPlan", title: "AI-powered 7-day content plan", requiredPlan: "pro" },
    ],
  },

  starter: {
    username: MOCK_USERNAME,
    overallScore: 68,
    profileSnapshot: {
      followerCount: 1240,
      followingCount: 890,
      postCount: 47,
      bio: "Helping entrepreneurs grow online 🚀 | DM for collabs",
      hasLinkInBio: false,
      accountType: "personal",
      dataSource: "scraper",
    },
    metrics: {
      bio: {
        score: 62,
        status: "good",
        details: ["Bio is a bit short. Aim for 80–150 characters."],
      },
      cta: {
        score: 38,
        status: "poor",
        details: ["No link found in your bio. Add a Linktree or direct link."],
      },
      positioning: {
        score: 58,
        status: "fair",
        details: ["Your bio doesn't communicate a clear outcome for your audience."],
      },
      captions: {
        score: 72,
        status: "good",
        details: ["Less than half of your posts open with a strong hook."],
      },
      hashtags: {
        score: 55,
        status: "fair",
        details: [
          "You're averaging ~8 hashtags per post — good range.",
          "Almost identical hashtags used on every post. Rotate them to reach different audiences.",
        ],
      },
      content: {
        score: 78,
        status: "good",
        details: ["You're posting about 2x/week. 3–5 posts/week accelerates growth."],
      },
    },
    tips: [
      "Add a link to your bio — it's the #1 missing piece. Your caption CTAs keep saying 'link in bio' but there's no link there.",
      "Your captions are solid in length but the first lines aren't stopping the scroll. Lead with a bold claim or question, not 'I'.",
      "Rotate your hashtag sets — you're using nearly identical tags every post which Instagram deprioritizes over time.",
      "You post consistently at ~2x/week which is a good foundation. Getting to 3–4 would meaningfully accelerate your reach.",
      "Your positioning as 'helping entrepreneurs grow online' is vague. What kind of growth? What platform? What method?",
    ],
    lockedPreviews: [
      { key: "contentPlan", title: "AI-powered 7-day content plan", requiredPlan: "pro" },
      { key: "engagement", title: "Engagement rate analysis", requiredPlan: "pro" },
    ],
  },

  pro: {
    username: MOCK_USERNAME,
    overallScore: 76,
    profileSnapshot: {
      followerCount: 1240,
      followingCount: 890,
      postCount: 47,
      bio: "Helping entrepreneurs grow online 🚀 | DM for collabs",
      hasLinkInBio: false,
      accountType: "personal",
      dataSource: "scraper",
    },
    metrics: {
      bio: { score: 62, status: "good", details: ["Bio is a bit short. Expand to 80–150 chars."] },
      cta: { score: 38, status: "poor", details: ["No link in bio — add one immediately."] },
      positioning: { score: 58, status: "fair", details: ["Niche is too broad. Narrow it down."] },
      captions: { score: 72, status: "good", details: ["Hooks need work on first lines."] },
      hashtags: { score: 55, status: "fair", details: ["Rotate your hashtag sets between posts."] },
      content: { score: 78, status: "good", details: ["Good posting frequency for this follower tier."] },
      engagement: {
        score: 81,
        status: "excellent",
        details: [
          "Strong engagement rate of 4.2% — above average for your follower tier (benchmark: 3.0%).",
          "Very few comments relative to likes. Use prompts to spark discussions.",
        ],
      },
      strategy: {
        score: 64,
        status: "good",
        details: [
          "Posts cover a wide range of topics. Narrowing to 2–3 content pillars would help.",
          "No Reels detected. Reels consistently get the highest organic reach on Instagram.",
        ],
      },
    },
    tips: [
      "The missing link in bio is costing you every time someone clicks through from a caption CTA. Fix this today — it takes 2 minutes.",
      "Your engagement rate of 4.2% is genuinely strong for 1.2K followers. Your audience is engaged — now you need to grow it.",
      "You're relying entirely on static images. Adding 1 Reel per week would expose your content to a much larger audience via the Explore page.",
      "Your captions reference 'growing online' a lot but your content doesn't have a clear theme. Pick 2–3 pillars and stick to them.",
      "The follower/following ratio of 1:0.7 is solid — keep unfollowing inactive accounts to maintain authority signaling.",
      "Your best-performing posts seem to be educational content. Double down on that format and test long-form carousels.",
    ],
    contentPlan: [
      {
        day: "Monday",
        contentType: "Reel",
        topic: "One mindset shift that changed how you approach client work",
        captionHook: "Most entrepreneurs get this completely backwards (and it costs them everything)",
        hashtagTip: "Mix niche entrepreneur tags with creator-specific discovery tags",
      },
      {
        day: "Tuesday",
        contentType: "Carousel",
        topic: "3 mistakes killing your Instagram growth (with your specific examples)",
        captionHook: "I audited 100 entrepreneur accounts. Here's what 90% of them got wrong:",
        hashtagTip: "Use audit, growth, and Instagram strategy hashtags",
      },
      {
        day: "Wednesday",
        contentType: "Image",
        topic: "Behind-the-scenes of your daily workflow or client process",
        captionHook: "This is what my actual workday looks like (no filter, no polish)",
        hashtagTip: "Lifestyle + entrepreneur community hashtags",
      },
      {
        day: "Thursday",
        contentType: "Reel",
        topic: "Quick tip: one tool or tactic you use that most people don't know",
        captionHook: "The tool I use daily that nobody in this niche talks about",
        hashtagTip: "Productivity + tool-specific hashtags for discovery",
      },
      {
        day: "Friday",
        contentType: "Carousel",
        topic: "Results post — a client win or your own milestone with lessons",
        captionHook: "From 0 to [result] in [timeframe] — here's exactly what we changed:",
        hashtagTip: "Success, results, and testimonial-style hashtags",
      },
      {
        day: "Saturday",
        contentType: "Story",
        topic: "Poll or question — ask your audience what they struggle with most",
        captionHook: "Quick question for my audience 👇",
        hashtagTip: "Story hashtags are less critical — focus on interactive stickers",
      },
      {
        day: "Sunday",
        contentType: "Image",
        topic: "Motivational/reflective post tied to your niche — the why behind the work",
        captionHook: "Why I almost quit building this — and what made me stay",
        hashtagTip: "Inspirational + niche community hashtags to close the week",
      },
    ],
  },

  agency: {
    username: MOCK_USERNAME,
    overallScore: 76,
    profileSnapshot: {
      followerCount: 1240,
      followingCount: 890,
      postCount: 47,
      bio: "Helping entrepreneurs grow online 🚀 | DM for collabs",
      hasLinkInBio: false,
      accountType: "personal",
      dataSource: "scraper",
    },
    metrics: {
      bio: { score: 62, status: "good", details: ["Bio is a bit short. Expand to 80–150 chars."] },
      cta: { score: 38, status: "poor", details: ["No link in bio — add one immediately."] },
      positioning: { score: 58, status: "fair", details: ["Niche is too broad. Narrow it down."] },
      captions: { score: 72, status: "good", details: ["Hooks need work on first lines."] },
      hashtags: { score: 55, status: "fair", details: ["Rotate your hashtag sets between posts."] },
      content: { score: 78, status: "good", details: ["Good posting frequency."] },
      engagement: {
        score: 81,
        status: "excellent",
        details: ["Engagement rate of 4.2% — above average for this tier."],
      },
      strategy: {
        score: 64,
        status: "good",
        details: ["Add Reels. Narrow content to 2–3 pillars."],
      },
    },
    tips: [
      "The missing link in bio is costing you every time someone clicks through from a caption CTA.",
      "Engagement rate of 4.2% is strong — your audience is engaged, focus on growing it now.",
      "Add 1 Reel per week for exponential reach expansion via the Explore page.",
      "Pick 2–3 content pillars and build your editorial calendar around them exclusively.",
      "Test long-form carousels — they consistently outperform single images for saves and shares.",
      "Your follower/following ratio is solid — continue unfollowing inactive accounts.",
    ],
    contentPlan: [
      {
        day: "Monday",
        contentType: "Reel",
        topic: "One mindset shift that changed how you approach client work",
        captionHook: "Most entrepreneurs get this completely backwards",
        hashtagTip: "Mix niche entrepreneur tags with creator discovery tags",
      },
      {
        day: "Tuesday",
        contentType: "Carousel",
        topic: "3 mistakes killing your Instagram growth",
        captionHook: "I audited 100 entrepreneur accounts. Here's what 90% got wrong:",
        hashtagTip: "Use audit, growth, and strategy hashtags",
      },
      {
        day: "Wednesday",
        contentType: "Image",
        topic: "Behind-the-scenes of your daily workflow",
        captionHook: "This is what my actual workday looks like (no filter)",
        hashtagTip: "Lifestyle + entrepreneur community hashtags",
      },
      {
        day: "Thursday",
        contentType: "Reel",
        topic: "Quick tip: one tool or tactic most people don't know",
        captionHook: "The tool I use daily that nobody in this niche talks about",
        hashtagTip: "Productivity + tool-specific hashtags",
      },
      {
        day: "Friday",
        contentType: "Carousel",
        topic: "Results post — client win or your own milestone",
        captionHook: "From 0 to [result] in [timeframe] — here's exactly what changed:",
        hashtagTip: "Success, results, and testimonial hashtags",
      },
      {
        day: "Saturday",
        contentType: "Story",
        topic: "Poll — ask your audience what they struggle with most",
        captionHook: "Quick question for my audience 👇",
        hashtagTip: "Story hashtags less critical — use interactive stickers",
      },
      {
        day: "Sunday",
        contentType: "Image",
        topic: "Motivational post tied to your niche — the why behind the work",
        captionHook: "Why I almost quit building this — and what made me stay",
        hashtagTip: "Inspirational + niche community hashtags",
      },
    ],
  },
}
