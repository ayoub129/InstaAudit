import type { ProfileData, InstagramApiUser, InstagramApiPostNode, RawPost } from "./types"
import { trackScraperApiCall } from "@/lib/analytics/usage-tracker"

const IG_APP_ID = "936619743392459"

const SCRAPER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "*/*",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://www.instagram.com/",
  "X-IG-App-ID": IG_APP_ID,
  "X-Requested-With": "XMLHttpRequest",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
}

export class ScraperError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "NOT_FOUND"
      | "PRIVATE_ACCOUNT"
      | "RATE_LIMITED"
      | "BLOCKED"
      | "FETCH_FAILED"
  ) {
    super(message)
    this.name = "ScraperError"
  }
}

async function rapidApiPost(
  host: string,
  key: string,
  path: string,
  body: Record<string, string>
): Promise<{ ok: boolean; status: number; json: any }> {
  await trackScraperApiCall(`rapidapi:${path}`)
  const url = `https://${host}${path}`
  const params = new URLSearchParams(body).toString()
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "X-RapidAPI-Key": key,
      "X-RapidAPI-Host": host,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
    next: { revalidate: 0 },
  })
  const status = res.status
  let json: any = null
  try { json = await res.json() } catch {}
  return { ok: res.ok, status, json }
}

async function tryRapidApiScraper(username: string): Promise<ProfileData> {
  const key = process.env.RAPIDAPI_KEY
  const host = process.env.RAPIDAPI_HOST || "instagram-scraper-stable-api.p.rapidapi.com"

  if (!key) throw new ScraperError("RapidAPI key not configured", "FETCH_FAILED")

  const { ok, status, json } = await rapidApiPost(
    host, key,
    "/ig_get_fb_profile_v3.php",
    { username_or_url: username }
  )

  if (status === 403) {
    throw new ScraperError(
      `RapidAPI returned 403 — your key is not subscribed to ${host}. Subscribe at rapidapi.com.`,
      "FETCH_FAILED"
    )
  }

  if (!ok || !json) {
    throw new ScraperError(
      `RapidAPI profile fetch failed (status ${status})`,
      "FETCH_FAILED"
    )
  }

  // The profile is returned at root level — check for account-not-found
  if (!json.username && !json.pk) {
    const msg = (json?.message ?? json?.error ?? "").toLowerCase()
    if (msg.includes("not found") || msg.includes("no user") || msg.includes("doesn't exist")) {
      throw new ScraperError(`Instagram account @${username} not found.`, "NOT_FOUND")
    }
    throw new ScraperError("Could not extract profile data from RapidAPI response", "FETCH_FAILED")
  }

  if (json.is_private) {
    throw new ScraperError(
      `@${username} is a private account. Only public accounts can be audited without connecting via Instagram.`,
      "PRIVATE_ACCOUNT"
    )
  }

  const posts = await tryRapidApiPosts(username, key, host)
  return normalizeRapidApiProfile(json, posts)
}

async function tryRapidApiPosts(
  username: string,
  key: string,
  host: string
): Promise<RawPost[]> {
  try {
    const { ok, json } = await rapidApiPost(
      host, key,
      "/get_ig_user_posts.php",
      { username_or_url: username, amount: "20", pagination_token: "" }
    )

    if (!ok || !json) return []

    // Response shape: { "posts": [ { "node": { caption, like_count, ... } } ] }
    const nodes: any[] = json?.posts ?? []
    if (nodes.length === 0) return []

    return nodes.slice(0, 20).map((item: any) => {
      const node = item?.node ?? item
      const caption: string = node?.caption?.text ?? node?.caption ?? ""
      return {
        caption,
        hashtags: extractHashtags(caption),
        likeCount: node?.like_count ?? 0,
        commentCount: node?.comment_count ?? 0,
        mediaType: normalizeMediaType(node?.media_type, node?.is_video),
        timestamp: node?.taken_at ?? 0,
      }
    })
  } catch {
    return []
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeRapidApiProfile(data: any, posts: RawPost[]): ProfileData {
  const bio: string = data?.biography ?? ""
  return {
    username: data?.username ?? "",
    bio,
    fullName: data?.full_name ?? "",
    followerCount: data?.follower_count ?? 0,
    followingCount: data?.following_count ?? 0,
    postCount: data?.media_count ?? 0,
    hasLinkInBio: !!(data?.external_url || data?.bio_links?.length),
    websiteUrl: data?.external_url ?? null,
    accountType: inferAccountType(data?.account_type, data?.is_business),
    isVerified: data?.is_verified ?? false,
    isPrivate: data?.is_private ?? false,
    posts,
    dataSource: "scraper",
  }
}

async function tryInstagramWebApi(username: string): Promise<ProfileData> {
  await trackScraperApiCall("instagram:web_profile_info")
  const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`

  console.log(`[scraper] Fetching Instagram web API for @${username}`)
  console.log(`[scraper] URL: ${url}`)

  let res: Response
  try {
    res = await fetch(url, {
      headers: SCRAPER_HEADERS,
      next: { revalidate: 0 },
    })
  } catch (fetchErr) {
    console.error(`[scraper] Network error fetching @${username}:`, fetchErr)
    throw new ScraperError(
      `Network error while fetching Instagram profile.`,
      "FETCH_FAILED"
    )
  }

  console.log(`[scraper] Instagram API response status: ${res.status} for @${username}`)

  // Log response headers that are useful for debugging blocks
  const rateLimitHeader = res.headers.get("x-ratelimit-remaining")
  const contentType = res.headers.get("content-type")
  console.log(`[scraper] Content-Type: ${contentType} | x-ratelimit-remaining: ${rateLimitHeader}`)

  if (res.status === 404) {
    throw new ScraperError(
      `Instagram account @${username} not found.`,
      "NOT_FOUND"
    )
  }

  if (res.status === 401 || res.status === 403) {
    // Try to log the response body to see what Instagram is saying
    try {
      const body = await res.text()
      console.error(`[scraper] Instagram 401/403 body for @${username}:`, body.slice(0, 500))
    } catch {}
    throw new ScraperError(
      "Instagram is requiring authentication to fetch this profile. Please connect your Instagram account.",
      "BLOCKED"
    )
  }

  if (res.status === 429) {
    console.error(`[scraper] Rate limited by Instagram for @${username}`)
    throw new ScraperError(
      "Instagram rate limit reached. Please wait a few minutes and try again.",
      "RATE_LIMITED"
    )
  }

  if (!res.ok) {
    let body = ""
    try { body = await res.text() } catch {}
    console.error(`[scraper] Unexpected status ${res.status} for @${username}. Body:`, body.slice(0, 500))
    throw new ScraperError(
      `Failed to fetch Instagram profile (status ${res.status}).`,
      "FETCH_FAILED"
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let json: any
  try {
    json = await res.json()
  } catch (parseErr) {
    const raw = await res.clone().text().catch(() => "(unreadable)")
    console.error(`[scraper] Failed to parse JSON for @${username}. Raw response:`, raw.slice(0, 500))
    throw new ScraperError(`Instagram returned non-JSON response.`, "FETCH_FAILED")
  }

  console.log(`[scraper] JSON keys at root:`, Object.keys(json ?? {}))

  const user: InstagramApiUser = json?.data?.user

  if (!user) {
    console.error(`[scraper] No user object in response for @${username}. Full JSON:`, JSON.stringify(json).slice(0, 500))
    throw new ScraperError(
      `Could not find profile data for @${username}. The account may not exist.`,
      "NOT_FOUND"
    )
  }

  if (user.is_private) {
    throw new ScraperError(
      `@${username} is a private account. Only public accounts can be audited without connecting via Instagram.`,
      "PRIVATE_ACCOUNT"
    )
  }

  return normalizeWebApiProfile(user)
}

function normalizeWebApiProfile(user: InstagramApiUser): ProfileData {
  const bio = user.biography ?? ""
  const postEdges = user.edge_owner_to_timeline_media?.edges ?? []

  const posts: RawPost[] = postEdges.map((edge) =>
    normalizeWebApiPost(edge.node)
  )

  return {
    username: user.username ?? "",
    bio,
    fullName: user.full_name ?? "",
    followerCount: user.edge_followed_by?.count ?? 0,
    followingCount: user.edge_follow?.count ?? 0,
    postCount: user.edge_owner_to_timeline_media?.count ?? 0,
    hasLinkInBio: !!(user.external_url),
    websiteUrl: user.external_url ?? null,
    accountType: inferAccountType(
      undefined,
      user.is_business_account ?? user.is_professional_account
    ),
    isVerified: user.is_verified ?? false,
    isPrivate: user.is_private ?? false,
    posts,
    dataSource: "scraper",
  }
}

function normalizeWebApiPost(node: InstagramApiPostNode): RawPost {
  const caption =
    node.edge_media_to_caption?.edges?.[0]?.node?.text ?? ""
  const likeCount =
    node.edge_liked_by?.count ??
    node.edge_media_preview_like?.count ??
    0

  return {
    caption,
    hashtags: extractHashtags(caption),
    likeCount,
    commentCount: node.edge_media_to_comment?.count ?? 0,
    mediaType: normalizeMediaType(undefined, node.is_video, node.__typename),
    timestamp: node.taken_at_timestamp ?? 0,
  }
}

export async function scrapeProfile(username: string): Promise<ProfileData> {
  // Try the direct Instagram web API first
  try {
    return await tryInstagramWebApi(username)
  } catch (err) {
    // If it was a definitive error (account not found, private), re-throw immediately
    if (err instanceof ScraperError) {
      if (err.code === "NOT_FOUND" || err.code === "PRIVATE_ACCOUNT") {
        throw err
      }
      console.error(`[scraper] Instagram web API failed (code=${err.code}): ${err.message}`)
    } else {
      console.error(`[scraper] Instagram web API threw unexpected error:`, err)
    }

    // If we have a RapidAPI key configured, fall back to it
    if (process.env.RAPIDAPI_KEY) {
      console.log(`[scraper] Falling back to RapidAPI scraper for @${username}`)
      try {
        return await tryRapidApiScraper(username)
      } catch (rapidErr) {
        console.error(`[scraper] RapidAPI also failed for @${username}:`, rapidErr)
        // If RapidAPI also says not found, use that error
        if (
          rapidErr instanceof ScraperError &&
          rapidErr.code === "NOT_FOUND"
        ) {
          throw rapidErr
        }
      }
    } else {
      console.warn(`[scraper] No RAPIDAPI_KEY set — cannot use fallback scraper`)
    }

    // Both failed — surface a helpful message
    throw new ScraperError(
      "Could not fetch Instagram profile data. Instagram may be temporarily blocking automated requests. " +
        "Try connecting your Instagram account for reliable audits, or try again in a few minutes.",
      "FETCH_FAILED"
    )
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function extractHashtags(text: string): string[] {
  const matches = text.match(/#[\w]+/g) ?? []
  return matches.map((h) => h.toLowerCase())
}

function normalizeMediaType(
  apiMediaType?: number,
  isVideo?: boolean,
  typename?: string
): RawPost["mediaType"] {
  if (typename === "GraphSidecar" || apiMediaType === 8) return "carousel"
  if (typename === "GraphVideo" || isVideo === true || apiMediaType === 2)
    return "video"
  return "image"
}

function inferAccountType(
  rawType?: string,
  isBusiness?: boolean
): ProfileData["accountType"] {
  if (rawType === "BUSINESS" || isBusiness === true) return "business"
  if (rawType === "CREATOR") return "creator"
  if (rawType === "PERSONAL") return "personal"
  return "unknown"
}
