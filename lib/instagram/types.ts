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
  insights?: ProfileInsights
}

export type MetricSource = "graph" | "scraper" | "inferred"

export interface SourcedMetric<T> {
  value: T
  source: MetricSource
}

export interface ProfileInsights {
  account?: {
    impressions?: SourcedMetric<number>
    reach?: SourcedMetric<number>
    profileVisits?: SourcedMetric<number>
    websiteClicks?: SourcedMetric<number>
    followerGrowthTimeline?: SourcedMetric<Array<{ date: string; value: number }>>
  }
  posts?: {
    averageReach?: SourcedMetric<number>
    averageSaves?: SourcedMetric<number>
    averageShares?: SourcedMetric<number>
  }
  audience?: {
    ageRanges?: SourcedMetric<Record<string, number>>
    genderSplit?: SourcedMetric<Record<string, number>>
    topLocations?: SourcedMetric<Array<{ name: string; value: number }>>
  }
  stories?: {
    averageReach?: SourcedMetric<number>
    averageExits?: SourcedMetric<number>
    averageReplies?: SourcedMetric<number>
  }
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

// ─── RapidAPI (instagram-scraper-stable-api / compatible hosts) ─────────────
// Response field names mirror the API (snake_case).

export type RapidApiErrorCode =
  | "NOT_FOUND"
  | "PRIVATE_ACCOUNT"
  | "RATE_LIMITED"
  | "BLOCKED"
  | "FETCH_FAILED"

/** Friendship block on basic profile (`ig_get_fb_profile.php` data=basic). */
export interface RapidApiFriendshipStatus {
  following?: boolean
  blocking?: boolean
  is_feed_favorite?: boolean
  outgoing_request?: boolean
  followed_by?: boolean
  incoming_request?: boolean
  is_restricted?: boolean
  is_bestie?: boolean
  muting?: boolean
  is_muting_reel?: boolean
}

export interface RapidApiBioLink {
  image_url?: string
  is_pinned?: boolean
  link_type?: string
  lynx_url?: string
  title?: string
  url?: string
}

export interface RapidApiHdProfilePicUrlInfo {
  url?: string
  height?: number
  width?: number
}

export interface RapidApiBiographyWithEntities {
  raw_text?: string
  entities?: unknown[]
}

/** `ig_get_fb_profile.php` with `data=basic` — core public profile fields. */
export interface RapidApiAccountBasic {
  friendship_status?: RapidApiFriendshipStatus
  full_name?: string
  gating?: unknown
  is_checkpoint_memorialized?: boolean
  is_private?: boolean
  has_story_archive?: boolean | null
  username?: string
  supervision_info?: unknown
  is_regulated_c18?: boolean
  regulated_news_in_locations?: unknown[]
  bio_links?: RapidApiBioLink[]
  text_post_app_badge_label?: string | null
  show_text_post_app_badge?: boolean | null
  text_post_new_post_count?: number | null
  pk?: string
  live_broadcast_visibility?: string | null
  live_broadcast_id?: string | null
  profile_pic_url?: string
  hd_profile_pic_url_info?: RapidApiHdProfilePicUrlInfo
  is_unpublished?: boolean
  latest_reel_media?: number
  has_profile_pic?: boolean | null
  account_type?: number
  follower_count?: number
  is_verified?: boolean
  mutual_followers_count?: number
  profile_context_links_with_user_ids?: unknown[]
  address_street?: string
  city_name?: string
  is_business?: boolean
  zip?: string
  biography_with_entities?: RapidApiBiographyWithEntities
  category?: string
  should_show_category?: boolean
  account_badges?: unknown[]
  ai_agent_type?: string | null
  fb_profile_bio_link_web?: string | null
  external_lynx_url?: string | null
  external_url?: string | null
  pronouns?: string[]
  biography?: string
  transparency_label?: string | null
  transparency_product?: string | null
  has_chaining?: boolean
  remove_message_entrypoint?: boolean
  fbid_v2?: string
  interop_messaging_user_fbid?: string | number
  show_account_transparency_details?: boolean
  is_embeds_disabled?: boolean
  is_professional_account?: boolean | null
  following_count?: number
  media_count?: number
  total_clips_count?: number
  latest_besties_reel_media?: number
  reel_media_seen_timestamp?: number | null
  id?: string
  email_from_biography?: string[]
  phone_from_biography?: string[]
  /** Extra keys returned by the API — preserved for forward compatibility */
  [key: string]: unknown
}

/**
 * `ig_get_fb_profile_v3.php` — extended profile / business fields.
 * Many optional fields; only commonly used keys are listed.
 */
export interface RapidApiAccountV2 {
  primary_profile_link_type?: number
  show_fb_link_on_profile?: boolean
  show_fb_page_link_on_profile?: boolean
  can_hide_category?: boolean
  account_type?: number
  ads_page_id?: string | null
  ads_page_name?: string | null
  current_catalog_id?: string | null
  mini_shop_seller_onboarding_status?: string | null
  ads_incentive_expiration_date?: string | null
  account_category?: string
  can_add_fb_group_link_on_profile?: boolean
  can_use_affiliate_partnership_messaging_as_creator?: boolean
  can_use_affiliate_partnership_messaging_as_brand?: boolean
  existing_user_age_collection_enabled?: boolean
  fbid_v2?: string
  feed_post_reshare_disabled?: boolean
  full_name?: string
  has_gen_ai_personas_for_profile_banner?: boolean
  has_guides?: boolean
  has_ig_profile?: boolean
  has_nme_badge?: boolean
  has_public_tab_threads?: boolean
  highlight_reshare_disabled?: boolean
  highlights_tray_type?: string
  include_direct_blacklist_status?: boolean
  is_direct_roll_call_enabled?: boolean
  is_eligible_for_meta_verified_links_in_reels?: boolean
  is_eligible_for_post_boost_mv_upsell?: boolean
  is_meta_verified_related_accounts_display_enabled?: boolean
  is_eligible_for_meta_verified_label?: boolean
  is_new_to_instagram?: boolean
  is_parenting_account?: boolean
  is_private?: boolean
  is_profile_broadcast_sharing_enabled?: boolean
  is_recon_ad_cta_on_profile_eligible_with_viewer?: boolean
  is_secondary_account_creation?: boolean
  pk?: string
  pk_id?: string
  profile_type?: number
  show_account_transparency_details?: boolean
  show_post_insights_entry_point?: boolean
  third_party_downloads_enabled?: number
  username?: string
  is_opal_enabled?: boolean
  strong_id__?: string
  has_ever_selected_topics?: boolean
  is_auto_confirm_enabled_for_all_reciprocal_follow_requests?: boolean
  is_active_on_text_post_app?: boolean
  views_on_grid_status?: string
  id?: string
  biography?: string
  biography_with_entities?: RapidApiBiographyWithEntities
  external_url?: string
  has_biography_translation?: boolean
  can_hide_public_contacts?: boolean
  category?: string
  should_show_category?: boolean
  category_id?: string
  is_category_tappable?: boolean
  should_show_public_contacts?: boolean
  is_eligible_for_smb_support_flow?: boolean
  is_eligible_for_lead_center?: boolean
  is_business?: boolean
  professional_conversion_suggested_account_type?: number
  direct_messaging?: string
  fb_page_call_to_action_id?: string
  instagram_location_id?: string
  address_street?: string
  business_contact_method?: string
  city_id?: string
  city_name?: string
  contact_phone_number?: string
  is_profile_audio_call_enabled?: boolean
  latitude?: number
  longitude?: number
  public_email?: string
  public_phone_country_code?: string
  public_phone_number?: string
  zip?: string
  displayed_action_button_partner?: string | null
  smb_delivery_partner?: string | null
  smb_support_delivery_partner?: string | null
  displayed_action_button_type?: string
  smb_support_partner?: string | null
  is_call_to_action_enabled?: boolean
  num_of_admined_pages?: number | null
  page_id?: string | null
  page_name?: string | null
  shopping_post_onboard_nux_type?: string | null
  account_badges?: unknown[]
  active_standalone_fundraisers?: Record<string, unknown>
  additional_business_addresses?: unknown[]
  auto_expand_chaining?: boolean
  bio_links?: RapidApiBioLink[]
  charity_profile_fundraiser_info?: Record<string, unknown>
  fan_club_info?: Record<string, unknown>
  follow_friction_type?: number
  follower_count?: number
  following_count?: number
  has_active_charity_business_profile_fundraiser?: boolean
  has_anonymous_profile_picture?: boolean
  has_chaining?: boolean
  has_chains?: boolean
  has_collab_collections?: boolean
  has_exclusive_feed_content?: boolean
  has_fan_club_subscriptions?: boolean
  has_highlight_reels?: boolean
  has_igtv_series?: boolean
  has_legacy_bb_pending_profile_picture_update?: boolean
  has_music_on_profile?: boolean
  has_mv4b_pending_profile_picture_update?: boolean
  has_private_collections?: boolean
  has_videos?: boolean
  has_views_fetching?: boolean
  hd_profile_pic_url_info?: RapidApiHdProfilePicUrlInfo
  interop_messaging_user_fbid?: number
  instagram_pk?: string
  is_bestie?: boolean
  is_creator_agent_enabled?: boolean
  is_eligible_for_meta_verified_enhanced_link_sheet?: boolean
  is_eligible_for_meta_verified_enhanced_link_sheet_consumption?: boolean
  is_eligible_for_meta_verified_multiple_addresses_creation?: boolean
  is_eligible_for_meta_verified_multiple_addresses_consumption?: boolean
  is_eligible_for_meta_verified_related_accounts?: boolean
  is_legacy_verified_max_profile_pic_edit_reached?: boolean
  is_mv4b_application_matured_for_profile_edit?: boolean
  is_mv4b_biz_asset_profile_locked?: boolean
  is_mv4b_max_profile_edit_reached?: boolean
  meta_verified_related_accounts_count?: number
  is_facebook_onboarded_charity?: boolean
  is_favorite?: boolean
  is_in_canada?: boolean
  is_interest_account?: boolean
  is_memorialized?: boolean
  is_potential_business?: boolean
  is_regulated_news_in_viewer_location?: boolean
  is_remix_setting_enabled_for_posts?: boolean
  is_remix_setting_enabled_for_reels?: boolean
  is_regulated_c18?: boolean
  is_stories_teaser_muted?: boolean
  is_supervision_features_enabled?: boolean
  is_verified?: boolean
  is_whatsapp_linked?: boolean
  latest_besties_reel_media?: number
  latest_reel_media?: number
  live_subscription_status?: string
  media_count?: number
  mutual_followers_count?: number
  pinned_channels_info?: Record<string, unknown>
  profile_pic_url?: string
  pronouns?: string[]
  total_ar_effects?: number
  total_clips_count?: number
  total_igtv_videos?: number
  transparency_product_enabled?: boolean
  whatsapp_number?: string
  is_profile_picture_expansion_enabled?: boolean
  is_eligible_for_request_message?: boolean
  is_open_to_collab?: boolean
  is_oregon_custom_gender_consented?: boolean
  profile_reels_sorting_eligibility?: string
  email_from_biography?: string[]
  phone_from_biography?: string[]
  [key: string]: unknown
}

/** `get_ig_user_about.php` — transparency / account meta. */
export interface RapidApiUserAbout {
  date_joined?: string
  verified_on?: string
  creation_country?: string
  active_ads?: string
  no_of_accounts_with_shared_followers?: string
  no_of_former_usernames?: string
  [key: string]: unknown
}

/** `get_ig_similar_accounts.php` — one suggested account row. */
export interface RapidApiSimilarAccount {
  friendship_status?: RapidApiFriendshipStatus | null
  full_name?: string
  is_verified?: boolean
  pk?: string
  profile_pic_url?: string
  username?: string
  is_private?: boolean
  supervision_info?: unknown | null
  social_context?: string
  live_broadcast_visibility?: string | null
  live_broadcast_id?: string | null
  hd_profile_pic_url_info?: RapidApiHdProfilePicUrlInfo | null
  is_unpublished?: boolean | null
  id?: string
  [key: string]: unknown
}

// ─── Feed posts (`get_ig_user_posts.php`) ───────────────────────────────────

export interface RapidApiPostCaption {
  has_translation?: boolean | null
  created_at?: number
  pk?: string
  text?: string
  [key: string]: unknown
}

export interface RapidApiImageCandidate {
  url?: string
  height?: number
  width?: number
  [key: string]: unknown
}

export interface RapidApiImageVersions2 {
  candidates?: RapidApiImageCandidate[]
  [key: string]: unknown
}

export interface RapidApiVideoVersion {
  width?: number
  height?: number
  url?: string
  type?: number
  [key: string]: unknown
}

export interface RapidApiPostUserStub {
  pk?: string
  username?: string
  full_name?: string
  profile_pic_url?: string
  is_verified?: boolean
  is_private?: boolean
  id?: string
  [key: string]: unknown
}

export interface RapidApiUsertagEntry {
  user?: RapidApiPostUserStub
  position?: number[]
  [key: string]: unknown
}

export interface RapidApiUsertags {
  in?: RapidApiUsertagEntry[]
  [key: string]: unknown
}

/** One carousel slide / child media (subset of fields). */
export interface RapidApiCarouselMediaItem {
  id?: string
  pk?: string
  media_type?: number
  taken_at?: number
  accessibility_caption?: string | null
  image_versions2?: RapidApiImageVersions2
  video_versions?: RapidApiVideoVersion[] | null
  carousel_parent_id?: string | null
  usertags?: RapidApiUsertags | null
  [key: string]: unknown
}

/**
 * Graph-style media node under `posts[].node` from `get_ig_user_posts.php`.
 * Includes image, video, carousel, reels/clips; extra API fields allowed via index signature.
 */
export interface RapidApiFeedPostNode {
  code?: string
  pk?: string
  id?: string
  caption?: RapidApiPostCaption | null
  caption_is_edited?: boolean
  taken_at?: number
  like_count?: number
  comment_count?: number
  media_type?: number
  product_type?: string | null
  carousel_media_count?: number | null
  carousel_media?: RapidApiCarouselMediaItem[] | null
  image_versions2?: RapidApiImageVersions2
  video_versions?: RapidApiVideoVersion[] | null
  video_dash_manifest?: string | null
  is_dash_eligible?: number | null
  number_of_qualities?: number | null
  user?: RapidApiPostUserStub | null
  owner?: RapidApiPostUserStub | null
  usertags?: RapidApiUsertags | null
  clips_metadata?: Record<string, unknown> | null
  __typename?: string
  [key: string]: unknown
}

export interface RapidApiFeedPostEdge {
  node: RapidApiFeedPostNode
  [key: string]: unknown
}

/** Parsed result from `get_ig_user_posts.php`. */
export interface RapidApiUserPostsResult {
  posts: RapidApiFeedPostEdge[]
  paginationToken: string | null
}

// ─── Reels (`get_ig_user_reels.php`) — `reels[].node.media` ─────────────────

/** Clip / reel media object (play_count, view_count, etc.). */
export interface RapidApiReelMedia {
  pk?: string
  id?: string
  code?: string
  media_type?: number
  product_type?: string | null
  play_count?: number
  view_count?: number | null
  like_count?: number
  comment_count?: number
  like_and_view_counts_disabled?: boolean
  user?: RapidApiPostUserStub | null
  owner?: RapidApiPostUserStub | null
  caption?: RapidApiPostCaption | string | null
  video_versions?: RapidApiVideoVersion[] | null
  image_versions2?: RapidApiImageVersions2
  carousel_media?: unknown
  original_height?: number
  original_width?: number
  taken_at?: number
  __typename?: string
  [key: string]: unknown
}

export interface RapidApiReelNode {
  media?: RapidApiReelMedia | null
  [key: string]: unknown
}

export interface RapidApiReelEdge {
  node?: RapidApiReelNode
  cursor?: string
  [key: string]: unknown
}

export interface RapidApiUserReelsResult {
  reels: RapidApiReelEdge[]
  paginationToken: string | null
}

// ─── Highlights (`get_ig_user_highlights.php`) ──────────────────────────────

export interface RapidApiHighlightCoverCropped {
  url?: string
  [key: string]: unknown
}

export interface RapidApiHighlightCoverMedia {
  cropped_image_version?: RapidApiHighlightCoverCropped | null
  [key: string]: unknown
}

export interface RapidApiHighlightNode {
  id?: string
  title?: string
  cover_media?: RapidApiHighlightCoverMedia | null
  user?: RapidApiPostUserStub | null
  __typename?: string
  [key: string]: unknown
}

export interface RapidApiHighlightEdge {
  node: RapidApiHighlightNode
  cursor?: string
  [key: string]: unknown
}

// ─── Stories (`get_ig_user_stories.php`) ───────────────────────────────────

export interface RapidApiStoryItem {
  pk?: string
  id?: string
  media_type?: number
  product_type?: string | null
  taken_at?: number
  expiring_at?: number
  has_audio?: boolean
  user?: RapidApiPostUserStub | null
  caption?: RapidApiPostCaption | null
  image_versions2?: RapidApiImageVersions2
  video_versions?: RapidApiVideoVersion[] | null
  video_dash_manifest?: string | null
  video_duration?: number
  original_height?: number
  original_width?: number
  is_dash_eligible?: number | null
  number_of_qualities?: number | null
  __typename?: string
  [key: string]: unknown
}

// ─── Tagged posts (`get_ig_user_tagged_posts.php`) ─────────────────────────

export interface RapidApiTaggedPostEdge {
  node: RapidApiFeedPostNode
  cursor?: string
  [key: string]: unknown
}

export interface RapidApiUserTaggedPostsResult {
  taggedPosts: RapidApiTaggedPostEdge[]
  paginationToken: string | null
}

// ─── Single media / post engagement (`get_media_data_v2.php`, etc.) ─────────

export interface RapidApiMediaDisplayResource {
  src?: string
  config_width?: number
  config_height?: number
  [key: string]: unknown
}

export interface RapidApiClipsMusicAttributionInfo {
  artist_name?: string
  song_name?: string
  uses_original_audio?: boolean
  should_mute_audio?: boolean
  should_mute_audio_reason?: string
  audio_id?: string
  [key: string]: unknown
}

/** Owner block on web-style media detail. */
export interface RapidApiMediaDetailOwner {
  id?: string
  username?: string
  full_name?: string
  is_verified?: boolean
  profile_pic_url?: string
  is_private?: boolean
  edge_followed_by?: { count?: number; [key: string]: unknown }
  edge_owner_to_timeline_media?: { count?: number; [key: string]: unknown }
  [key: string]: unknown
}

/**
 * Root payload from `get_media_data_v2.php` (Graph-style shortcode media).
 * Many nested `edge_*` fields; only common keys are listed — rest via index signature.
 */
export interface RapidApiPostMediaDetail {
  id?: string
  shortcode?: string
  thumbnail_src?: string
  dimensions?: { height?: number; width?: number; [key: string]: unknown }
  display_url?: string
  display_resources?: RapidApiMediaDisplayResource[]
  video_url?: string | null
  video_view_count?: number | null
  video_play_count?: number | null
  video_duration?: number | null
  has_audio?: boolean
  is_video?: boolean
  product_type?: string | null
  title?: string | null
  taken_at_timestamp?: number
  owner?: RapidApiMediaDetailOwner
  edge_media_preview_like?: { count?: number; edges?: unknown[]; [key: string]: unknown }
  edge_media_to_caption?: {
    edges?: Array<{ node?: { text?: string; [key: string]: unknown }; [key: string]: unknown }>
    [key: string]: unknown
  }
  edge_media_to_parent_comment?: Record<string, unknown>
  edge_media_preview_comment?: Record<string, unknown>
  edge_media_to_tagged_user?: { edges?: unknown[]; [key: string]: unknown }
  clips_music_attribution_info?: RapidApiClipsMusicAttributionInfo | null
  comments_disabled?: boolean
  commenting_disabled_for_viewer?: boolean
  like_and_view_counts_disabled?: boolean
  is_paid_partnership?: boolean
  is_ad?: boolean
  location?: unknown
  accessibility_caption?: string | null
  media_preview?: string | null
  sharing_friction_info?: Record<string, unknown> | null
  __typename?: string
  [key: string]: unknown
}

// ─── Post comments (`get_post_child_comments.php`) ──────────────────────────

export interface RapidApiCommentAuthor {
  id?: string
  pk?: string
  pk_id?: string
  username?: string
  full_name?: string
  is_verified?: boolean
  is_private?: boolean
  profile_pic_url?: string
  [key: string]: unknown
}

/** One row in `comments[]` from `get_post_child_comments.php`. */
export interface RapidApiPostCommentItem {
  pk?: string
  id?: string
  user_id?: string
  text?: string
  created_at?: number
  created_at_utc?: number
  media_id?: string
  comment_like_count?: number
  child_comment_count?: number
  has_more_head_child_comments?: boolean
  user?: RapidApiCommentAuthor
  edge_threaded_comments?: Record<string, unknown>
  [key: string]: unknown
}

export interface RapidApiPostCommentsCaption {
  pk?: string
  user_id?: string
  text?: string
  created_at?: number
  user?: RapidApiCommentAuthor
  [key: string]: unknown
}

export interface RapidApiPostCommentsResult {
  comments: RapidApiPostCommentItem[]
  caption?: RapidApiPostCommentsCaption | null
  comment_count?: number
  caption_is_edited?: boolean
  can_view_more_preview_comments?: boolean
  comment_likes_enabled?: boolean
  has_more_comments?: boolean
  has_more_headload_comments?: boolean
  is_ranked?: boolean
  sort_order?: string
  status?: string
  liked_by_media_owner_badge_enabled?: boolean
  paginationToken: string | null
  [key: string]: unknown
}

// ─── Post likers (`get_post_likers.php`) ─────────────────────────────────────

export interface RapidApiPostLiker {
  id?: string
  username?: string
  full_name?: string
  profile_pic_url?: string
  is_private?: boolean
  is_verified?: boolean
  followed_by_viewer?: boolean
  requested_by_viewer?: boolean
  [key: string]: unknown
}

export interface RapidApiPostLikersResult {
  totalLikes?: number
  postLikers: RapidApiPostLiker[]
  paginationToken: string | null
  [key: string]: unknown
}

// ─── Search (`search_hashtag.php`, `search_ig.php`) ─────────────────────────

export interface RapidApiSearchHashtagKeyword {
  id?: string
  name?: string
  allow_following?: boolean
  is_following?: boolean
  is_top_media_only?: boolean
  profile_pic_url?: string
  [key: string]: unknown
}

export interface RapidApiSearchHashtagPosts {
  count?: number
  edges?: RapidApiFeedPostEdge[]
  [key: string]: unknown
}

export interface RapidApiSearchHashtagTopPosts {
  edges?: RapidApiFeedPostEdge[]
  [key: string]: unknown
}

export interface RapidApiSearchHashtagResult {
  id?: string
  name?: string
  allow_following?: boolean
  is_following?: boolean
  is_top_media_only?: boolean
  profile_pic_url?: string
  posts: RapidApiSearchHashtagPosts
  top_posts: RapidApiSearchHashtagTopPosts
  content_advisory_posts?: { count?: number; edges?: unknown[]; [key: string]: unknown }
  paginationToken: string | null
  [key: string]: unknown
}

export interface RapidApiSearchIgKeyword {
  name?: string
  id?: string
  [key: string]: unknown
}

export interface RapidApiSearchIgSeeMoreItem {
  position?: number
  keyword?: RapidApiSearchIgKeyword
  [key: string]: unknown
}

export interface RapidApiSearchIgSeeMore {
  preview_number?: number
  list?: RapidApiSearchIgSeeMoreItem[]
  [key: string]: unknown
}

export interface RapidApiSearchIgHashtag {
  name?: string
  media_count?: number
  id?: string
  [key: string]: unknown
}

export interface RapidApiSearchIgHashtagItem {
  position?: number
  hashtag?: RapidApiSearchIgHashtag
  [key: string]: unknown
}

export interface RapidApiSearchIgUser {
  username?: string
  is_verified?: boolean
  full_name?: string
  search_social_context?: string | null
  unseen_count?: number | null
  pk?: string
  profile_pic_url?: string
  id?: string | null
  [key: string]: unknown
}

export interface RapidApiSearchIgUserItem {
  position?: number
  user?: RapidApiSearchIgUser
  [key: string]: unknown
}

export interface RapidApiSearchUsersAndHashtagsResult {
  see_more?: RapidApiSearchIgSeeMore | null
  inform_module?: unknown | null
  hashtags: RapidApiSearchIgHashtagItem[]
  places?: unknown[]
  users: RapidApiSearchIgUserItem[]
  rank_token?: string
  [key: string]: unknown
}
