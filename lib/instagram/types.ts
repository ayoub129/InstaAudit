export interface RawPost {
  caption: string
  hashtags: string[]
  likeCount: number
  commentCount: number
  mediaType: "image" | "video" | "carousel" | "reel"
  timestamp: number // unix seconds
}

export interface ProfileData {
  username: string
  bio: string
  fullName: string
  followerCount: number
  followingCount: number
  postCount: number
  hasLinkInBio: boolean
  websiteUrl: string | null
  accountType: "business" | "creator" | "personal" | "unknown"
  isVerified: boolean
  isPrivate: boolean
  posts: RawPost[]
  // Only available via Graph API with insights scope (business/creator accounts)
  avgEngagementRate?: number
  dataSource: "graph_api" | "scraper"
}

// Raw response shapes from Instagram unofficial API
export interface InstagramApiUser {
  biography?: string
  full_name?: string
  username?: string
  id?: string
  external_url?: string | null
  edge_followed_by?: { count: number }
  edge_follow?: { count: number }
  is_business_account?: boolean
  is_professional_account?: boolean
  is_private?: boolean
  is_verified?: boolean
  category_name?: string | null
  edge_owner_to_timeline_media?: {
    count: number
    edges: Array<{
      node: InstagramApiPostNode
    }>
  }
}

export interface InstagramApiPostNode {
  __typename?: string
  id?: string
  is_video?: boolean
  taken_at_timestamp?: number
  edge_media_to_caption?: {
    edges: Array<{ node: { text: string } }>
  }
  edge_liked_by?: { count: number }
  edge_media_preview_like?: { count: number }
  edge_media_to_comment?: { count: number }
}
