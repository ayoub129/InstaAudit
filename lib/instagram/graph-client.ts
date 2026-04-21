import type { ProfileData, ProfileInsights, RawPost, SourcedMetric } from "./types"
import { extractHashtags } from "./scraper"

const GRAPH_BASE = "https://graph.instagram.com"

export class GraphClientError extends Error {
  constructor(
    message: string,
    public readonly code: "TOKEN_EXPIRED" | "INVALID_TOKEN" | "API_ERROR" | "INSUFFICIENT_SCOPE",
  ) {
    super(message)
    this.name = "GraphClientError"
  }
}

interface GraphUser {
  id: string
  username: string
  biography?: string
  name?: string
  followers_count?: number
  follows_count?: number
  media_count?: number
  website?: string
  account_type?: string
}

interface GraphMedia {
  id: string
  caption?: string
  media_type?: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM" | "STORY"
  timestamp?: string
  like_count?: number
  comments_count?: number
}

function sourced<T>(value: T, source: "graph" | "scraper" | "inferred"): SourcedMetric<T> {
  return { value, source }
}

async function graphFetch<T>(path: string, token: string): Promise<T> {
  const join = path.includes("?") ? "&" : "?"
  const res = await fetch(`${GRAPH_BASE}${path}${join}access_token=${token}`, {
    next: { revalidate: 0 },
  })
  const json = await res.json()
  if (!res.ok) {
    const errCode: string = String(json?.error?.code ?? "")
    const errMessage: string = json?.error?.message ?? `Graph API error ${res.status}`
    if (errCode === "190" || /token|session/i.test(errMessage)) {
      throw new GraphClientError(
        "Instagram access token has expired. Please reconnect your Instagram account.",
        "TOKEN_EXPIRED",
      )
    }
    if (errCode === "100" || errCode === "10") {
      throw new GraphClientError(
        "Insufficient permissions on Instagram access token. Please reconnect your account.",
        "INSUFFICIENT_SCOPE",
      )
    }
    throw new GraphClientError(errMessage, "API_ERROR")
  }
  return json as T
}

function normalizeGraphMediaType(mediaType?: GraphMedia["media_type"]): RawPost["mediaType"] {
  if (mediaType === "VIDEO") return "video"
  if (mediaType === "CAROUSEL_ALBUM") return "carousel"
  if (mediaType === "STORY") return "reel"
  return "image"
}

function normalizeGraphAccountType(raw?: string): ProfileData["accountType"] {
  if (!raw) return "unknown"
  const upper = raw.toUpperCase()
  if (upper === "BUSINESS") return "business"
  if (upper === "CREATOR") return "creator"
  if (upper === "PERSONAL") return "personal"
  return "unknown"
}

async function fetchAccountInsights(userId: string, token: string): Promise<ProfileInsights["account"]> {
  try {
    const insights = await graphFetch<{ data?: Array<{ name?: string; values?: Array<{ value?: number; end_time?: string }> }> }>(
      `/${userId}/insights?metric=impressions,reach,profile_views,website_clicks&period=day`,
      token,
    )
    const map = new Map((insights.data ?? []).map((x) => [x.name, x.values?.[0]?.value ?? 0]))
    return {
      impressions: sourced(Number(map.get("impressions") ?? 0), "graph"),
      reach: sourced(Number(map.get("reach") ?? 0), "graph"),
      profileVisits: sourced(Number(map.get("profile_views") ?? 0), "graph"),
      websiteClicks: sourced(Number(map.get("website_clicks") ?? 0), "graph"),
    }
  } catch {
    return {}
  }
}

async function fetchFollowerGrowth(userId: string, token: string): Promise<Array<{ date: string; value: number }>> {
  try {
    const timeline = await graphFetch<{ data?: Array<{ values?: Array<{ value?: number; end_time?: string }> }> }>(
      `/${userId}/insights?metric=follower_count&period=day`,
      token,
    )
    return (timeline.data?.[0]?.values ?? [])
      .filter((x) => typeof x.value === "number")
      .map((x) => ({ date: x.end_time ?? "", value: x.value as number }))
  } catch {
    return []
  }
}

async function fetchMediaInsights(
  media: GraphMedia[],
  token: string,
): Promise<{ posts: ProfileInsights["posts"]; stories: ProfileInsights["stories"] }> {
  const postRows = media.filter((m) => m.media_type !== "STORY").slice(0, 10)
  const storyRows = media.filter((m) => m.media_type === "STORY").slice(0, 10)

  const postMetrics = await Promise.all(
    postRows.map(async (m) => {
      try {
        const r = await graphFetch<{ data?: Array<{ name?: string; values?: Array<{ value?: number }> }> }>(
          `/${m.id}/insights?metric=reach,saved,shares`,
          token,
        )
        const map = new Map((r.data ?? []).map((x) => [x.name, Number(x.values?.[0]?.value ?? 0)]))
        return { reach: map.get("reach") ?? 0, saves: map.get("saved") ?? 0, shares: map.get("shares") ?? 0 }
      } catch {
        return { reach: 0, saves: 0, shares: 0 }
      }
    }),
  )

  const storyMetrics = await Promise.all(
    storyRows.map(async (m) => {
      try {
        const r = await graphFetch<{ data?: Array<{ name?: string; values?: Array<{ value?: number }> }> }>(
          `/${m.id}/insights?metric=reach,exits,replies`,
          token,
        )
        const map = new Map((r.data ?? []).map((x) => [x.name, Number(x.values?.[0]?.value ?? 0)]))
        return { reach: map.get("reach") ?? 0, exits: map.get("exits") ?? 0, replies: map.get("replies") ?? 0 }
      } catch {
        return { reach: 0, exits: 0, replies: 0 }
      }
    }),
  )

  const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0)
  return {
    posts: {
      averageReach: sourced(Math.round(avg(postMetrics.map((m) => m.reach))), "graph"),
      averageSaves: sourced(Math.round(avg(postMetrics.map((m) => m.saves))), "graph"),
      averageShares: sourced(Math.round(avg(postMetrics.map((m) => m.shares))), "graph"),
    },
    stories: {
      averageReach: sourced(Math.round(avg(storyMetrics.map((m) => m.reach))), "graph"),
      averageExits: sourced(Math.round(avg(storyMetrics.map((m) => m.exits))), "graph"),
      averageReplies: sourced(Math.round(avg(storyMetrics.map((m) => m.replies))), "graph"),
    },
  }
}

async function fetchAudienceDemographics(userId: string, token: string): Promise<ProfileInsights["audience"]> {
  try {
    const data = await graphFetch<{
      data?: Array<{ name?: string; total_value?: { breakdowns?: Array<{ results?: Array<{ dimension_values?: string[]; value?: number }> }> } }>
    }>(`/${userId}/insights?metric=follower_demographics&period=lifetime`, token)
    const results = data.data?.[0]?.total_value?.breakdowns?.[0]?.results ?? []
    const ageRanges: Record<string, number> = {}
    const genderSplit: Record<string, number> = {}
    const locationMap = new Map<string, number>()
    for (const row of results) {
      const dims = row.dimension_values ?? []
      const value = Number(row.value ?? 0)
      if (dims.length >= 2) {
        const [age, gender] = dims
        ageRanges[age] = (ageRanges[age] ?? 0) + value
        genderSplit[gender] = (genderSplit[gender] ?? 0) + value
      } else if (dims.length === 1) {
        locationMap.set(dims[0], (locationMap.get(dims[0]) ?? 0) + value)
      }
    }
    const topLocations = [...locationMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }))
    return {
      ageRanges: sourced(ageRanges, "graph"),
      genderSplit: sourced(genderSplit, "graph"),
      topLocations: sourced(topLocations, "graph"),
    }
  } catch {
    return {}
  }
}

export async function fetchProfileViaGraphClient(accessToken: string): Promise<ProfileData> {
  const userFields = "id,biography,followers_count,follows_count,media_count,website,account_type,username,name"
  const user = await graphFetch<GraphUser>(`/me?fields=${userFields}`, accessToken)
  const mediaRes = await graphFetch<{ data: GraphMedia[] }>(
    "/me/media?fields=id,caption,media_type,timestamp,like_count,comments_count&limit=30",
    accessToken,
  )

  const posts: RawPost[] = (mediaRes.data ?? []).map((m) => {
    const caption = m.caption ?? ""
    return {
      caption,
      hashtags: extractHashtags(caption),
      likeCount: m.like_count ?? 0,
      commentCount: m.comments_count ?? 0,
      mediaType: normalizeGraphMediaType(m.media_type),
      timestamp: m.timestamp ? Math.floor(new Date(m.timestamp).getTime() / 1000) : 0,
    }
  })

  const account = await fetchAccountInsights(user.id, accessToken)
  const followerGrowthTimeline = await fetchFollowerGrowth(user.id, accessToken)
  const audience = await fetchAudienceDemographics(user.id, accessToken)
  const mediaInsights = await fetchMediaInsights(mediaRes.data ?? [], accessToken)

  const avgEngagementRate =
    user.followers_count && posts.length
      ? (posts.reduce((sum, p) => sum + p.likeCount + p.commentCount, 0) / posts.length / user.followers_count) * 100
      : undefined

  return {
    username: user.username ?? "",
    bio: user.biography ?? "",
    fullName: user.name ?? "",
    followerCount: user.followers_count ?? 0,
    followingCount: user.follows_count ?? 0,
    postCount: user.media_count ?? 0,
    hasLinkInBio: !!user.website,
    websiteUrl: user.website ?? null,
    accountType: normalizeGraphAccountType(user.account_type),
    isVerified: false,
    isPrivate: false,
    posts,
    avgEngagementRate,
    dataSource: "graph_api",
    insights: {
      account: {
        ...account,
        followerGrowthTimeline: sourced(followerGrowthTimeline, followerGrowthTimeline.length ? "graph" : "inferred"),
      },
      posts: mediaInsights.posts,
      audience,
      stories: mediaInsights.stories,
    },
  }
}

export function mergeProfileData(
  scraperProfile: ProfileData,
  graphProfile: ProfileData,
): ProfileData {
  return {
    ...scraperProfile,
    ...graphProfile,
    username: graphProfile.username || scraperProfile.username,
    bio: graphProfile.bio || scraperProfile.bio,
    fullName: graphProfile.fullName || scraperProfile.fullName,
    followerCount: graphProfile.followerCount || scraperProfile.followerCount,
    followingCount: graphProfile.followingCount || scraperProfile.followingCount,
    postCount: graphProfile.postCount || scraperProfile.postCount,
    hasLinkInBio: graphProfile.hasLinkInBio || scraperProfile.hasLinkInBio,
    websiteUrl: graphProfile.websiteUrl ?? scraperProfile.websiteUrl,
    accountType: graphProfile.accountType !== "unknown" ? graphProfile.accountType : scraperProfile.accountType,
    isVerified: graphProfile.isVerified || scraperProfile.isVerified,
    isPrivate: graphProfile.isPrivate ?? scraperProfile.isPrivate,
    posts: graphProfile.posts.length ? graphProfile.posts : scraperProfile.posts,
    avgEngagementRate: graphProfile.avgEngagementRate ?? scraperProfile.avgEngagementRate,
    dataSource: "graph_api",
    insights: {
      ...(scraperProfile.insights ?? {}),
      ...(graphProfile.insights ?? {}),
      account: {
        ...(scraperProfile.insights?.account ?? {}),
        ...(graphProfile.insights?.account ?? {}),
      },
      posts: {
        ...(scraperProfile.insights?.posts ?? {}),
        ...(graphProfile.insights?.posts ?? {}),
      },
      audience: {
        ...(scraperProfile.insights?.audience ?? {}),
        ...(graphProfile.insights?.audience ?? {}),
      },
      stories: {
        ...(scraperProfile.insights?.stories ?? {}),
        ...(graphProfile.insights?.stories ?? {}),
      },
    },
  }
}

