import type { ScoringModule } from "./types"
import { scoreWithAI } from "@/lib/audits/ai-scorer"
import { sortPostsByNewest } from "./helpers"

export const scoreContentMix: ScoringModule = async (profile) => {
  const posts = sortPostsByNewest(profile.posts).slice(0, 30)
  if (!posts.length) {
    return scoreWithAI("contentMix", { postsAnalyzed: 0 }, {
      username: profile.username,
      followers: profile.followerCount,
    })
  }

  const totals = {
    image: posts.filter((p) => p.mediaType === "image").length,
    carousel: posts.filter((p) => p.mediaType === "carousel").length,
    reel: posts.filter((p) => p.mediaType === "reel" || p.mediaType === "video").length,
  }
  const total = posts.length
  const reelAdoptionRate = (totals.reel / total) * 100
  const carouselRate = (totals.carousel / total) * 100
  return scoreWithAI(
    "contentMix",
    {
      postsAnalyzed: total,
      imageCount: totals.image,
      carouselCount: totals.carousel,
      reelCount: totals.reel,
      imageRate: Number(((totals.image / total) * 100).toFixed(2)),
      carouselRate: Number(carouselRate.toFixed(2)),
      reelAdoptionRate: Number(reelAdoptionRate.toFixed(2)),
    },
    {
      username: profile.username,
      followers: profile.followerCount,
    },
  )
}

