import type { ProfileData, RawPost } from "./types"
import { extractHashtags } from "./scraper"

const GRAPH_BASE = "https://graph.instagram.com"

export class GraphApiError extends Error {
  constructor(
    message: string,
    public readonly code: "TOKEN_EXPIRED" | "INVALID_TOKEN" | "API_ERROR" | "INSUFFICIENT_SCOPE"
  ) {
    super(message)
    this.name = "GraphApiError"
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
  profile_picture_url?: string
}

interface GraphMedia {
  id: string
  caption?: string
  media_type?: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM"
  timestamp?: string
  like_count?: number
  comments_count?: number
}

async function graphFetch<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${GRAPH_BASE}${path}&access_token=${token}`, {
    next: { revalidate: 0 },
  })

  const json = await res.json()

  if (!res.ok) {
    const errCode: string = json?.error?.code ?? ""
    const errMessage: string = json?.error?.message ?? `Graph API error ${res.status}`

    if (errCode === "190" || errMessage.includes("token") || errMessage.includes("Session")) {
      throw new GraphApiError(
        "Instagram access token has expired. Please reconnect your Instagram account.",
        "TOKEN_EXPIRED"
      )
    }

    if (errCode === "100" || errCode === "10") {
      throw new GraphApiError(
        "Insufficient permissions on Instagram access token. Please reconnect your account.",
        "INSUFFICIENT_SCOPE"
      )
    }

    throw new GraphApiError(errMessage, "API_ERROR")
  }

  return json as T
}

export async function fetchProfileViaGraphApi(
  accessToken: string
): Promise<ProfileData> {
  const userFields =
    "biography,followers_count,follows_count,media_count,website,account_type,username,name"

  const user = await graphFetch<GraphUser>(
    `/me?fields=${userFields}`,
    accessToken
  )

  const mediaFields = "id,caption,media_type,timestamp,like_count,comments_count"
  const mediaRes = await graphFetch<{ data: GraphMedia[] }>(
    `/me/media?fields=${mediaFields}&limit=20`,
    accessToken
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

  // Calculate avg engagement rate if we have followers + posts
  let avgEngagementRate: number | undefined
  if (user.followers_count && posts.length > 0) {
    const totalEngagement = posts.reduce(
      (sum, p) => sum + p.likeCount + p.commentCount,
      0
    )
    avgEngagementRate =
      (totalEngagement / posts.length / user.followers_count) * 100
  }

  const bio = user.biography ?? ""

  return {
    username: user.username ?? "",
    bio,
    fullName: user.name ?? "",
    followerCount: user.followers_count ?? 0,
    followingCount: user.follows_count ?? 0,
    postCount: user.media_count ?? 0,
    hasLinkInBio: !!(user.website),
    websiteUrl: user.website ?? null,
    accountType: normalizeGraphAccountType(user.account_type),
    isVerified: false, // Graph API doesn't expose this on basic scope
    isPrivate: false,  // Connected accounts are accessible by definition
    posts,
    avgEngagementRate,
    dataSource: "graph_api",
  }
}

function normalizeGraphMediaType(
  mediaType?: GraphMedia["media_type"]
): RawPost["mediaType"] {
  if (mediaType === "VIDEO") return "video"
  if (mediaType === "CAROUSEL_ALBUM") return "carousel"
  return "image"
}

function normalizeGraphAccountType(
  raw?: string
): ProfileData["accountType"] {
  if (!raw) return "unknown"
  const upper = raw.toUpperCase()
  if (upper === "BUSINESS") return "business"
  if (upper === "CREATOR") return "creator"
  if (upper === "PERSONAL") return "personal"
  return "unknown"
}
