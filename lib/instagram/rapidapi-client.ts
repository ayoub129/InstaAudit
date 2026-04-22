/**
 * Typed RapidAPI client for Instagram scraper endpoints (same transport as scraper.ts:
 * POST + application/x-www-form-urlencoded + X-RapidAPI-* headers).
 *
 * Env: RAPIDAPI_KEY (required), RAPIDAPI_HOST (optional, default matches scraper fallback).
 */

import type {
  RapidApiAccountBasic,
  RapidApiAccountV2,
  RapidApiBioLink,
  RapidApiErrorCode,
  RapidApiFeedPostEdge,
  RapidApiFeedPostNode,
  RapidApiHighlightEdge,
  RapidApiReelEdge,
  RapidApiSimilarAccount,
  RapidApiStoryItem,
  RapidApiTaggedPostEdge,
  RapidApiUserAbout,
  RapidApiPostCommentItem,
  RapidApiPostCommentsResult,
  RapidApiPostLiker,
  RapidApiPostLikersResult,
  RapidApiPostMediaDetail,
  RapidApiSearchHashtagResult,
  RapidApiSearchUsersAndHashtagsResult,
  RapidApiUserPostsResult,
  RapidApiUserReelsResult,
  RapidApiUserTaggedPostsResult,
} from "./types"
import { trackScraperApiCall } from "@/lib/analytics/usage-tracker"

export class RapidApiClientError extends Error {
  constructor(
    message: string,
    public readonly code: RapidApiErrorCode,
    public readonly status?: number,
  ) {
    super(message)
    this.name = "RapidApiClientError"
  }
}

const DEFAULT_HOST = "instagram-scraper-stable-api.p.rapidapi.com"

export function normalizeUsernameOrUrl(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) {
    throw new RapidApiClientError("Username or Instagram URL is required.", "FETCH_FAILED")
  }
  return trimmed
}

/** Instagram post/reel shortcode, or full `instagram.com/p/…` / `reel/…` / `tv/…` URL. */
export function normalizeMediaShortcode(mediaCodeOrUrl: string): string {
  const trimmed = mediaCodeOrUrl.trim()
  if (!trimmed) {
    throw new RapidApiClientError("Media code or URL is required.", "FETCH_FAILED")
  }
  try {
    const href = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`
    if (href.includes("instagram.com")) {
      const u = new URL(href)
      const parts = u.pathname.split("/").filter(Boolean)
      for (const key of ["p", "reel", "reels", "tv"] as const) {
        const idx = parts.indexOf(key)
        if (idx >= 0 && parts[idx + 1]) {
          return parts[idx + 1].split("?")[0]
        }
      }
    }
  } catch {
    /* treat as raw shortcode */
  }
  return trimmed.replace(/^\/+|\/+$/g, "").split("?")[0]
}

function normalizePostMediaId(postId: string): string {
  const id = postId.trim()
  if (!id) {
    throw new RapidApiClientError("Post / media id is required.", "FETCH_FAILED")
  }
  return id
}

function getCredentials(): { host: string; key: string } {
  const key = process.env.RAPIDAPI_KEY
  const host = process.env.RAPIDAPI_HOST || DEFAULT_HOST
  if (!key) {
    throw new RapidApiClientError(
      "RAPIDAPI_KEY is not set. Add it to your environment to use RapidAPI profile endpoints.",
      "FETCH_FAILED",
    )
  }
  return { host, key }
}

async function rapidApiPost(
  host: string,
  key: string,
  path: string,
  body: Record<string, string>,
): Promise<{ ok: boolean; status: number; json: unknown }> {
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
  let json: unknown = null
  try {
    json = await res.json()
  } catch {
    json = null
  }
  return { ok: res.ok, status, json }
}

function isNotFoundMessage(text: string): boolean {
  const t = text.toLowerCase()
  return (
    t.includes("not found") ||
    t.includes("no user") ||
    t.includes("doesn't exist") ||
    t.includes("does not exist") ||
    t.includes("user not found")
  )
}

function extractApiMessage(json: unknown): string {
  if (!json || typeof json !== "object") return ""
  const o = json as Record<string, unknown>
  const msg = o.message ?? o.error ?? o.msg ?? o.detail
  if (typeof msg === "string") return msg
  if (msg && typeof msg === "object" && "message" in msg && typeof (msg as { message: unknown }).message === "string") {
    return (msg as { message: string }).message
  }
  return ""
}

function assertHttpOk(ok: boolean, status: number, json: unknown, context: string) {
  if (status === 403) {
    throw new RapidApiClientError(
      `RapidAPI returned 403 for ${context}. Check your API key subscription for this host.`,
      "FETCH_FAILED",
      status,
    )
  }
  if (status === 429) {
    throw new RapidApiClientError("RapidAPI rate limit reached. Try again shortly.", "RATE_LIMITED", status)
  }
  if (status === 401) {
    throw new RapidApiClientError("RapidAPI authentication failed (401).", "BLOCKED", status)
  }
  if (!ok) {
    const msg = extractApiMessage(json)
    throw new RapidApiClientError(
      msg || `RapidAPI request failed (${status}) for ${context}.`,
      "FETCH_FAILED",
      status,
    )
  }
}

function assertProfileShape(json: unknown, context: string): asserts json is Record<string, unknown> {
  if (!json || typeof json !== "object" || Array.isArray(json)) {
    throw new RapidApiClientError(`Invalid JSON for ${context}.`, "FETCH_FAILED")
  }
  const o = json as Record<string, unknown>
  if (!o.username && !o.pk) {
    const msg = extractApiMessage(json)
    if (isNotFoundMessage(msg)) {
      throw new RapidApiClientError("Instagram account not found.", "NOT_FOUND", 404)
    }
    if (isNotFoundMessage(JSON.stringify(json).slice(0, 400))) {
      throw new RapidApiClientError("Instagram account not found.", "NOT_FOUND", 404)
    }
    throw new RapidApiClientError(msg || `Could not read profile from ${context}.`, "FETCH_FAILED")
  }
}

function throwIfPrivate(json: Record<string, unknown>, handleHint: string) {
  if (json.is_private === true) {
    throw new RapidApiClientError(
      `${handleHint} is a private account. Public data is not available without Instagram connection.`,
      "PRIVATE_ACCOUNT",
      422,
    )
  }
}

// ─── Profile ─────────────────────────────────────────────────────────────────

/**
 * `ig_get_fb_profile.php` with `data=basic` — lightweight profile + friendship + bio links snippet.
 */
export async function getAccountBasic(usernameOrUrl: string): Promise<RapidApiAccountBasic> {
  const { host, key } = getCredentials()
  const username = normalizeUsernameOrUrl(usernameOrUrl)
  const { ok, status, json } = await rapidApiPost(host, key, "/ig_get_fb_profile.php", {
    username_or_url: username,
    data: "basic",
  })
  assertHttpOk(ok, status, json, "getAccountBasic")
  assertProfileShape(json, "getAccountBasic")
  const data = json as RapidApiAccountBasic
  throwIfPrivate(data as Record<string, unknown>, `@${data.username ?? username}`)
  return data
}

/**
 * `ig_get_fb_profile_v3.php` — full / v3 profile payload (same as scraper fallback path).
 */
export async function getAccountV2(usernameOrUrl: string): Promise<RapidApiAccountV2> {
  const { host, key } = getCredentials()
  const username = normalizeUsernameOrUrl(usernameOrUrl)
  const { ok, status, json } = await rapidApiPost(host, key, "/ig_get_fb_profile_v3.php", {
    username_or_url: username,
  })
  assertHttpOk(ok, status, json, "getAccountV2")
  assertProfileShape(json, "getAccountV2")
  const data = json as RapidApiAccountV2
  throwIfPrivate(data as Record<string, unknown>, `@${data.username ?? username}`)
  return data
}

/**
 * `get_ig_user_about.php` — account transparency style fields (joined date, country, etc.).
 */
export async function getUserAbout(usernameOrUrl: string): Promise<RapidApiUserAbout> {
  const { host, key } = getCredentials()
  const username = normalizeUsernameOrUrl(usernameOrUrl)
  const { ok, status, json } = await rapidApiPost(host, key, "/get_ig_user_about.php", {
    username_or_url: username,
  })
  assertHttpOk(ok, status, json, "getUserAbout")
  if (!json || typeof json !== "object" || Array.isArray(json)) {
    const msg = extractApiMessage(json)
    if (isNotFoundMessage(msg)) {
      throw new RapidApiClientError("User about data not found.", "NOT_FOUND", 404)
    }
    throw new RapidApiClientError(msg || "Invalid getUserAbout response.", "FETCH_FAILED")
  }
  return json as RapidApiUserAbout
}

/**
 * `ig_get_fb_profile.php` with `data=bio_links` — link-in-bio list only.
 */
export async function getBioLinks(usernameOrUrl: string): Promise<RapidApiBioLink[]> {
  const { host, key } = getCredentials()
  const username = normalizeUsernameOrUrl(usernameOrUrl)
  const { ok, status, json } = await rapidApiPost(host, key, "/ig_get_fb_profile.php", {
    username_or_url: username,
    data: "bio_links",
  })
  assertHttpOk(ok, status, json, "getBioLinks")
  return extractArray<RapidApiBioLink>(json, ["bio_links", "data", "links"])
}

/**
 * `get_ig_similar_accounts.php` — suggested / similar accounts (competitor discovery).
 */
export async function getSimilarAccounts(usernameOrUrl: string): Promise<RapidApiSimilarAccount[]> {
  const { host, key } = getCredentials()
  const username = normalizeUsernameOrUrl(usernameOrUrl)
  const { ok, status, json } = await rapidApiPost(host, key, "/get_ig_similar_accounts.php", {
    username_or_url: username,
  })
  assertHttpOk(ok, status, json, "getSimilarAccounts")
  return extractArray<RapidApiSimilarAccount>(json, [
    "similar_accounts",
    "accounts",
    "users",
    "data",
    "items",
  ])
}

function extractArray<T>(json: unknown, nestedKeys: string[]): T[] {
  if (Array.isArray(json)) {
    return json as T[]
  }
  if (json && typeof json === "object" && !Array.isArray(json)) {
    const o = json as Record<string, unknown>
    for (const key of nestedKeys) {
      const v = o[key]
      if (Array.isArray(v)) return v as T[]
    }
    for (const v of Object.values(o)) {
      if (Array.isArray(v) && v.length > 0 && typeof v[0] === "object") {
        return v as T[]
      }
    }
  }
  const msg = extractApiMessage(json)
  if (isNotFoundMessage(msg)) {
    throw new RapidApiClientError("No similar accounts data found.", "NOT_FOUND", 404)
  }
  return []
}

// ─── Content / feed posts ───────────────────────────────────────────────────

const MAX_POSTS_PER_REQUEST = 50

function parsePostsPayload(json: unknown): RapidApiUserPostsResult {
  if (!json || typeof json !== "object" || Array.isArray(json)) {
    throw new RapidApiClientError("Invalid posts response.", "FETCH_FAILED")
  }
  const root = json as Record<string, unknown>
  const msg = extractApiMessage(json)
  if (isNotFoundMessage(msg)) {
    throw new RapidApiClientError("Instagram account or posts not found.", "NOT_FOUND", 404)
  }

  let raw = root.posts
  if (!Array.isArray(raw) && root.data && typeof root.data === "object") {
    const data = root.data as Record<string, unknown>
    raw = data.posts ?? data.edges
  }
  if (!Array.isArray(raw)) {
    return { posts: [], paginationToken: readPaginationToken(root) }
  }

  const posts: RapidApiFeedPostEdge[] = raw.map((item: unknown) => {
    if (item && typeof item === "object" && "node" in item) {
      return item as RapidApiFeedPostEdge
    }
    if (item && typeof item === "object") {
      return { node: item as RapidApiFeedPostEdge["node"] }
    }
    return { node: {} as RapidApiFeedPostEdge["node"] }
  })

  return {
    posts,
    paginationToken: readPaginationToken(root),
  }
}

function readPaginationToken(root: Record<string, unknown>): string | null {
  const token = root.pagination_token ?? root.paginationToken ?? root.next_max_id
  if (typeof token === "string" && token.length > 0) return token
  return null
}

/**
 * `get_ig_user_posts.php` — user feed timeline (paginated).
 *
 * @param amount — page size (clamped 1–50; API default in docs is often 12–20).
 * @param paginationToken — pass previous `paginationToken` for next page; omit or empty for first page.
 */
export async function getUserPosts(
  usernameOrUrl: string,
  amount: number,
  paginationToken?: string | null,
): Promise<RapidApiUserPostsResult> {
  const { host, key } = getCredentials()
  const username = normalizeUsernameOrUrl(usernameOrUrl)
  const safeAmount = Math.min(Math.max(Math.floor(Number(amount)) || 12, 1), MAX_POSTS_PER_REQUEST)
  const body: Record<string, string> = {
    username_or_url: username,
    amount: String(safeAmount),
    pagination_token: paginationToken?.trim() ?? "",
  }

  const { ok, status, json } = await rapidApiPost(host, key, "/get_ig_user_posts.php", body)
  assertHttpOk(ok, status, json, "getUserPosts")
  return parsePostsPayload(json)
}

// ─── Reels ──────────────────────────────────────────────────────────────────

function parseReelsPayload(json: unknown): RapidApiUserReelsResult {
  if (Array.isArray(json)) {
    return {
      reels: json.filter((x) => x && typeof x === "object") as RapidApiReelEdge[],
      paginationToken: null,
    }
  }
  if (!json || typeof json !== "object") {
    throw new RapidApiClientError("Invalid reels response.", "FETCH_FAILED")
  }
  const root = json as Record<string, unknown>
  const msg = extractApiMessage(json)
  if (isNotFoundMessage(msg)) {
    throw new RapidApiClientError("Instagram account or reels not found.", "NOT_FOUND", 404)
  }

  let raw = root.reels
  if (!Array.isArray(raw) && root.data && typeof root.data === "object") {
    const data = root.data as Record<string, unknown>
    raw = data.reels ?? data.edges
  }
  if (!Array.isArray(raw)) {
    return { reels: [], paginationToken: readPaginationToken(root) }
  }

  const reels: RapidApiReelEdge[] = raw.map((item: unknown) => {
    if (item && typeof item === "object") {
      return item as RapidApiReelEdge
    }
    return { node: {} }
  })

  return { reels, paginationToken: readPaginationToken(root) }
}

/**
 * `get_ig_user_reels.php` — Reels / clips tab (paginated); includes `play_count` / `view_count` when exposed.
 */
export async function getUserReels(
  usernameOrUrl: string,
  amount: number,
  paginationToken?: string | null,
): Promise<RapidApiUserReelsResult> {
  const { host, key } = getCredentials()
  const username = normalizeUsernameOrUrl(usernameOrUrl)
  const safeAmount = Math.min(Math.max(Math.floor(Number(amount)) || 12, 1), MAX_POSTS_PER_REQUEST)
  const body: Record<string, string> = {
    username_or_url: username,
    amount: String(safeAmount),
    pagination_token: paginationToken?.trim() ?? "",
  }
  const { ok, status, json } = await rapidApiPost(host, key, "/get_ig_user_reels.php", body)
  assertHttpOk(ok, status, json, "getUserReels")
  return parseReelsPayload(json)
}

// ─── Highlights ─────────────────────────────────────────────────────────────

/**
 * `get_ig_user_highlights.php` — profile highlight reels (title + cover).
 */
export async function getUserHighlights(usernameOrUrl: string): Promise<RapidApiHighlightEdge[]> {
  const { host, key } = getCredentials()
  const username = normalizeUsernameOrUrl(usernameOrUrl)
  const { ok, status, json } = await rapidApiPost(host, key, "/get_ig_user_highlights.php", {
    username_or_url: username,
  })
  assertHttpOk(ok, status, json, "getUserHighlights")
  if (Array.isArray(json)) {
    return json as RapidApiHighlightEdge[]
  }
  return extractArray<RapidApiHighlightEdge>(json, ["highlights", "edges", "items", "data"])
}

// ─── Stories ────────────────────────────────────────────────────────────────

/**
 * `get_ig_user_stories.php` — current stories for the user (often empty for non-followers).
 */
export async function getUserStories(usernameOrUrl: string): Promise<RapidApiStoryItem[]> {
  const { host, key } = getCredentials()
  const username = normalizeUsernameOrUrl(usernameOrUrl)
  const { ok, status, json } = await rapidApiPost(host, key, "/get_ig_user_stories.php", {
    username_or_url: username,
  })
  assertHttpOk(ok, status, json, "getUserStories")
  if (Array.isArray(json)) {
    return json as RapidApiStoryItem[]
  }
  return extractArray<RapidApiStoryItem>(json, ["stories", "items", "reels_media", "data"])
}

// ─── Tagged posts ─────────────────────────────────────────────────────────────

function parseTaggedPostsPayload(json: unknown): RapidApiUserTaggedPostsResult {
  if (!json || typeof json !== "object" || Array.isArray(json)) {
    throw new RapidApiClientError("Invalid tagged posts response.", "FETCH_FAILED")
  }
  const root = json as Record<string, unknown>
  const msg = extractApiMessage(json)
  if (isNotFoundMessage(msg)) {
    throw new RapidApiClientError("Instagram account or tagged posts not found.", "NOT_FOUND", 404)
  }

  let raw = root.tagged_posts ?? root.taggedPosts
  if (!Array.isArray(raw) && root.data && typeof root.data === "object") {
    const data = root.data as Record<string, unknown>
    raw = data.tagged_posts ?? data.edges
  }
  if (!Array.isArray(raw)) {
    return { taggedPosts: [], paginationToken: readPaginationToken(root) }
  }

  const taggedPosts: RapidApiTaggedPostEdge[] = raw.map((item: unknown) => {
    if (item && typeof item === "object" && "node" in item) {
      return item as RapidApiTaggedPostEdge
    }
    if (item && typeof item === "object") {
      return { node: item as RapidApiFeedPostNode }
    }
    return { node: {} as RapidApiFeedPostNode }
  })

  return { taggedPosts, paginationToken: readPaginationToken(root) }
}

/**
 * `get_ig_user_tagged_posts.php` — posts where the user is tagged (amount only; no pagination in typical API).
 */
export async function getUserTaggedPosts(
  usernameOrUrl: string,
  amount: number,
): Promise<RapidApiUserTaggedPostsResult> {
  const { host, key } = getCredentials()
  const username = normalizeUsernameOrUrl(usernameOrUrl)
  const safeAmount = Math.min(Math.max(Math.floor(Number(amount)) || 12, 1), MAX_POSTS_PER_REQUEST)
  const body: Record<string, string> = {
    username_or_url: username,
    amount: String(safeAmount),
  }
  const { ok, status, json } = await rapidApiPost(host, key, "/get_ig_user_tagged_posts.php", body)
  assertHttpOk(ok, status, json, "getUserTaggedPosts")
  return parseTaggedPostsPayload(json)
}

// ─── Single post / engagement ───────────────────────────────────────────────

function unwrapMediaDataV2(json: unknown): Record<string, unknown> {
  if (!json || typeof json !== "object" || Array.isArray(json)) {
    return {}
  }
  const root = json as Record<string, unknown>
  const data = root.data
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const d = data as Record<string, unknown>
    const inner = d.xdt_shortcode_media ?? d.shortcode_media ?? d.media
    if (inner && typeof inner === "object" && !Array.isArray(inner)) {
      return inner as Record<string, unknown>
    }
    return d
  }
  return root
}

function parseMediaDataV2(json: unknown): RapidApiPostMediaDetail {
  const root = unwrapMediaDataV2(json)
  const msg = extractApiMessage(json)
  if (isNotFoundMessage(msg)) {
    throw new RapidApiClientError("Media not found.", "NOT_FOUND", 404)
  }
  if (!root.id && !root.shortcode) {
    if (isNotFoundMessage(JSON.stringify(json).slice(0, 400))) {
      throw new RapidApiClientError("Media not found.", "NOT_FOUND", 404)
    }
    throw new RapidApiClientError(msg || "Invalid media detail response.", "FETCH_FAILED")
  }
  return root as RapidApiPostMediaDetail
}

/**
 * `get_media_data_v2.php` — full Graph-style payload for one post/reel by **shortcode** (e.g. `DE5qYzkTQsv`)
 * or Instagram `p` / `reel` / `tv` URL.
 */
export async function getPostDetail(mediaCodeOrUrl: string): Promise<RapidApiPostMediaDetail> {
  const { host, key } = getCredentials()
  const code = normalizeMediaShortcode(mediaCodeOrUrl)
  const { ok, status, json } = await rapidApiPost(host, key, "/get_media_data_v2.php", {
    code,
  })
  assertHttpOk(ok, status, json, "getPostDetail")
  return parseMediaDataV2(json)
}

function parsePostCommentsPayload(json: unknown): RapidApiPostCommentsResult {
  if (!json || typeof json !== "object" || Array.isArray(json)) {
    throw new RapidApiClientError("Invalid post comments response.", "FETCH_FAILED")
  }
  const root = json as Record<string, unknown>
  const msg = extractApiMessage(json)
  if (isNotFoundMessage(msg)) {
    throw new RapidApiClientError("Post comments not found.", "NOT_FOUND", 404)
  }
  const raw = root.comments
  const comments: RapidApiPostCommentItem[] = Array.isArray(raw) ? (raw as RapidApiPostCommentItem[]) : []
  const paginationToken =
    typeof root.pagination_token === "string" && root.pagination_token.length > 0
      ? root.pagination_token
      : null
  return {
    ...root,
    comments,
    paginationToken,
  } as RapidApiPostCommentsResult
}

/**
 * `get_post_child_comments.php` — top-level comments + caption meta for sentiment / moderation.
 *
 * @param postId — Instagram **media id** (numeric pk, often `media_id` on comment objects).
 * @param paginationToken — optional `pagination_token` from a previous response for more pages.
 */
export async function getPostComments(
  postId: string,
  paginationToken?: string | null,
): Promise<RapidApiPostCommentsResult> {
  const { host, key } = getCredentials()
  const mediaId = normalizePostMediaId(postId)
  const body: Record<string, string> = {
    media_id: mediaId,
    pagination_token: paginationToken?.trim() ?? "",
  }
  const { ok, status, json } = await rapidApiPost(host, key, "/get_post_child_comments.php", body)
  assertHttpOk(ok, status, json, "getPostComments")
  return parsePostCommentsPayload(json)
}

function parsePostLikersPayload(json: unknown): RapidApiPostLikersResult {
  if (!json || typeof json !== "object" || Array.isArray(json)) {
    throw new RapidApiClientError("Invalid post likers response.", "FETCH_FAILED")
  }
  const root = json as Record<string, unknown>
  const msg = extractApiMessage(json)
  if (isNotFoundMessage(msg)) {
    throw new RapidApiClientError("Post likers not found.", "NOT_FOUND", 404)
  }
  const raw = root.post_likers
  const postLikers: RapidApiPostLiker[] = Array.isArray(raw) ? (raw as RapidApiPostLiker[]) : []
  const paginationToken =
    typeof root.pagination_token === "string" && root.pagination_token.length > 0
      ? root.pagination_token
      : null
  const totalLikes = typeof root.total_likes === "number" ? root.total_likes : undefined
  return {
    ...root,
    totalLikes,
    postLikers,
    paginationToken,
  } as RapidApiPostLikersResult
}

/**
 * `get_post_likers.php` — sample of accounts who liked the post + `total_likes`.
 *
 * @param postId — same **media id** as for {@link getPostComments}.
 * @param paginationToken — optional token for next liker page when the API returns one.
 */
export async function getPostLikers(
  postId: string,
  paginationToken?: string | null,
): Promise<RapidApiPostLikersResult> {
  const { host, key } = getCredentials()
  const mediaId = normalizePostMediaId(postId)
  const body: Record<string, string> = {
    media_id: mediaId,
    pagination_token: paginationToken?.trim() ?? "",
  }
  const { ok, status, json } = await rapidApiPost(host, key, "/get_post_likers.php", body)
  assertHttpOk(ok, status, json, "getPostLikers")
  return parsePostLikersPayload(json)
}

function readStringField(root: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = root[key]
    if (typeof value === "string" && value.trim().length > 0) {
      return value
    }
  }
  return null
}

function parseHashtagSearchPayload(json: unknown): RapidApiSearchHashtagResult {
  if (!json || typeof json !== "object" || Array.isArray(json)) {
    throw new RapidApiClientError("Invalid hashtag search response.", "FETCH_FAILED")
  }
  const root = json as Record<string, unknown>
  const msg = extractApiMessage(json)
  if (isNotFoundMessage(msg)) {
    throw new RapidApiClientError("Hashtag not found.", "NOT_FOUND", 404)
  }
  const name = typeof root.name === "string" ? root.name : null
  if (!name) {
    throw new RapidApiClientError(msg || "Could not read hashtag search response.", "FETCH_FAILED")
  }
  const posts =
    root.posts && typeof root.posts === "object" && !Array.isArray(root.posts)
      ? (root.posts as Record<string, unknown>)
      : {}
  const topPosts =
    root.top_posts && typeof root.top_posts === "object" && !Array.isArray(root.top_posts)
      ? (root.top_posts as Record<string, unknown>)
      : {}
  const paginationToken = readStringField(root, ["pagination_token", "paginationToken", "next_max_id"])
  return {
    ...root,
    posts: {
      ...posts,
      edges: Array.isArray(posts.edges) ? (posts.edges as RapidApiFeedPostEdge[]) : [],
    },
    top_posts: {
      ...topPosts,
      edges: Array.isArray(topPosts.edges) ? (topPosts.edges as RapidApiFeedPostEdge[]) : [],
    },
    paginationToken,
  } as RapidApiSearchHashtagResult
}

/**
 * `search_hashtag.php` — hashtag lookup including recent posts + top posts.
 */
export async function searchHashtag(hashtag: string): Promise<RapidApiSearchHashtagResult> {
  const { host, key } = getCredentials()
  const value = hashtag.trim().replace(/^#+/, "")
  if (!value) {
    throw new RapidApiClientError("Hashtag is required.", "FETCH_FAILED")
  }
  const { ok, status, json } = await rapidApiPost(host, key, "/search_hashtag.php", {
    hashtag: value,
  })
  assertHttpOk(ok, status, json, "searchHashtag")
  return parseHashtagSearchPayload(json)
}

function parseSearchIgPayload(json: unknown): RapidApiSearchUsersAndHashtagsResult {
  if (!json || typeof json !== "object" || Array.isArray(json)) {
    throw new RapidApiClientError("Invalid search response.", "FETCH_FAILED")
  }
  const root = json as Record<string, unknown>
  const msg = extractApiMessage(json)
  if (isNotFoundMessage(msg)) {
    throw new RapidApiClientError("Search query returned no results.", "NOT_FOUND", 404)
  }
  return {
    ...root,
    hashtags: Array.isArray(root.hashtags) ? root.hashtags : [],
    users: Array.isArray(root.users) ? root.users : [],
    places: Array.isArray(root.places) ? root.places : [],
  } as RapidApiSearchUsersAndHashtagsResult
}

/**
 * `search_ig.php` — mixed search results (users + hashtags + suggestions).
 */
export async function searchUsersAndHashtags(
  query: string,
): Promise<RapidApiSearchUsersAndHashtagsResult> {
  const { host, key } = getCredentials()
  const value = query.trim()
  if (!value) {
    throw new RapidApiClientError("Search query is required.", "FETCH_FAILED")
  }
  const { ok, status, json } = await rapidApiPost(host, key, "/search_ig.php", {
    query: value,
  })
  assertHttpOk(ok, status, json, "searchUsersAndHashtags")
  return parseSearchIgPayload(json)
}
