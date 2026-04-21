import type { ProfileData } from "./types";
import { scrapeProfile, ScraperError } from "./scraper";
import {
  GraphClientError,
  fetchProfileViaGraphClient,
  mergeProfileData,
} from "./graph-client";
import { getConnectedInstagramAccount } from "./get-connected-instagram-account";
import {
  getAccountBasic,
  getAccountV2,
  getUserAbout,
  getUserHighlights,
  getUserPosts,
  getUserReels,
  RapidApiClientError,
} from "./rapidapi-client";
import { PLAN_CONFIG, type PlanKey } from "@/lib/plans/plan-config";
import { connectDB } from "@/lib/mongodb";

interface ConnectedAccount {
  username: string;
  accessToken: string;
}

function inferAccountType(
  accountType?: number,
  isBusiness?: boolean,
): ProfileData["accountType"] {
  if (accountType === 2 || isBusiness) return "business";
  if (accountType === 3) return "creator";
  if (accountType === 1) return "personal";
  return "unknown";
}

function extractHashtags(caption: string): string[] {
  return Array.from(
    new Set(
      caption.match(/#[\p{L}\p{N}_]+/gu)?.map((t) => t.toLowerCase()) ?? [],
    ),
  );
}

function normalizeMediaType(
  mediaType?: number,
): "image" | "video" | "carousel" | "reel" {
  if (mediaType === 8) return "carousel";
  if (mediaType === 2) return "video";
  return "image";
}

async function fetchRapidApiProfileByPlan(
  username: string,
  plan: PlanKey,
): Promise<ProfileData> {
  let basic: Awaited<ReturnType<typeof getAccountBasic>>;
  let v2: Awaited<ReturnType<typeof getAccountV2>> | null = null;
  let posts: Awaited<ReturnType<typeof getUserPosts>>["posts"] = [];

  if (plan === "free") {
    basic = await getAccountBasic(username);
  } else if (plan === "starter") {
    [basic, v2, { posts }] = await Promise.all([
      getAccountBasic(username),
      getAccountV2(username),
      getUserPosts(username, 12),
    ]);
  } else {
    [basic, v2, , { posts }, ,] = await Promise.all([
      getAccountBasic(username),
      getAccountV2(username),
      getUserAbout(username),
      getUserPosts(username, 30),
      getUserReels(username, 20),
      getUserHighlights(username),
    ]);
  }

  const profileSource = v2 ?? basic;
  const normalizedPosts = posts.map((edge) => {
    const node = edge?.node ?? {};
    const caption = node.caption?.text ?? "";
    return {
      caption,
      hashtags: extractHashtags(caption),
      likeCount: node.like_count ?? 0,
      commentCount: node.comment_count ?? 0,
      mediaType: normalizeMediaType(node.media_type),
      timestamp: node.taken_at ?? 0,
    };
  });

  const source: "graph" | "scraper" | "inferred" = "scraper";

  return {
    username: profileSource.username ?? basic.username ?? username,
    bio: profileSource.biography ?? basic.biography ?? "",
    fullName: profileSource.full_name ?? basic.full_name ?? "",
    followerCount: profileSource.follower_count ?? basic.follower_count ?? 0,
    followingCount: profileSource.following_count ?? basic.following_count ?? 0,
    postCount: profileSource.media_count ?? basic.media_count ?? 0,
    hasLinkInBio: !!(
      profileSource.external_url ||
      basic.external_url ||
      basic.bio_links?.length
    ),
    websiteUrl:
      (profileSource.external_url as string | null | undefined) ??
      basic.external_url ??
      null,
    accountType: inferAccountType(
      profileSource.account_type,
      profileSource.is_business,
    ),
    isVerified: profileSource.is_verified ?? basic.is_verified ?? false,
    isPrivate: profileSource.is_private ?? basic.is_private ?? false,
    posts: normalizedPosts,
    dataSource: "scraper",
    insights: {
      account: {
        followerGrowthTimeline: { value: [], source: "inferred" },
      },
      posts: {
        averageReach: { value: 0, source },
        averageSaves: { value: 0, source },
        averageShares: { value: 0, source },
      },
      audience: {
        ageRanges: { value: {}, source: "inferred" },
        genderSplit: { value: {}, source: "inferred" },
        topLocations: { value: [], source: "inferred" },
      },
      stories: {
        averageReach: { value: 0, source: "inferred" },
        averageExits: { value: 0, source: "inferred" },
        averageReplies: { value: 0, source: "inferred" },
      },
    },
  };
}

export class ProfileFetchError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "NOT_FOUND"
      | "PRIVATE_ACCOUNT"
      | "RATE_LIMITED"
      | "BLOCKED"
      | "TOKEN_EXPIRED"
      | "FETCH_FAILED",
  ) {
    super(message);
    this.name = "ProfileFetchError";
  }
}

export async function fetchProfile(
  username: string,
  plan: PlanKey,
  userId: string,
): Promise<ProfileData> {
  const planConfig = PLAN_CONFIG[plan];

  // If the plan supports Instagram connect, check if the user has
  // a connected account that matches the handle being audited.
  if (planConfig.allowInstagramConnect) {
    try {
      await connectDB();
      const connected = (await getConnectedInstagramAccount(
        userId,
      )) as ConnectedAccount | null;

      if (
        connected &&
        connected.username.toLowerCase() === username.toLowerCase() &&
        connected.accessToken
      ) {
        try {
          const [graphProfile, scraperProfile] = await Promise.all([
            fetchProfileViaGraphClient(connected.accessToken),
            fetchRapidApiProfileByPlan(username, plan).catch(() => null),
          ]);
          return scraperProfile
            ? mergeProfileData(scraperProfile, graphProfile)
            : graphProfile;
        } catch (err) {
          if (err instanceof GraphClientError && err.code === "TOKEN_EXPIRED") {
            throw new ProfileFetchError(err.message, "TOKEN_EXPIRED");
          }
        }
      }
    } catch (err) {
      if (err instanceof ProfileFetchError) throw err;
    }
  }

  // RapidAPI path by plan (free plan, or no connected account, or auditing a different handle)
  try {
    return await fetchRapidApiProfileByPlan(username, plan);
  } catch (err) {
    if (err instanceof RapidApiClientError) {
      throw new ProfileFetchError(err.message, err.code);
    }
    if (err instanceof ScraperError) {
      throw new ProfileFetchError(err.message, err.code);
    }
    // Last fallback in case RapidAPI host/key is temporarily unavailable.
    try {
      return await scrapeProfile(username);
    } catch (scrapeErr) {
      if (scrapeErr instanceof ScraperError) {
        throw new ProfileFetchError(scrapeErr.message, scrapeErr.code);
      }
      throw new ProfileFetchError(
        "Unexpected error while fetching Instagram profile.",
        "FETCH_FAILED",
      );
    }
  }
}
