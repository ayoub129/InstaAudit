import type { ProfileData } from "./types"
import { scrapeProfile, ScraperError } from "./scraper"
import { fetchProfileViaGraphApi, GraphApiError } from "./graph-api"
import { getConnectedInstagramAccount } from "./get-connected-instagram-account"
import { PLAN_CONFIG, type PlanKey } from "@/lib/plans/plan-config"
import { connectDB } from "@/lib/mongodb"

interface ConnectedAccount {
  username: string
  accessToken: string
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
      | "FETCH_FAILED"
  ) {
    super(message)
    this.name = "ProfileFetchError"
  }
}

export async function fetchProfile(
  username: string,
  plan: PlanKey,
  userId: string
): Promise<ProfileData> {
  const planConfig = PLAN_CONFIG[plan]

  // If the plan supports Instagram connect, check if the user has
  // a connected account that matches the handle being audited.
  if (planConfig.allowInstagramConnect) {
    try {
      await connectDB()
      const connected = (await getConnectedInstagramAccount(userId)) as ConnectedAccount | null

      if (
        connected &&
        connected.username.toLowerCase() === username.toLowerCase() &&
        connected.accessToken
      ) {
        try {
          return await fetchProfileViaGraphApi(connected.accessToken)
        } catch (err) {
          if (err instanceof GraphApiError && err.code === "TOKEN_EXPIRED") {
            throw new ProfileFetchError(err.message, "TOKEN_EXPIRED")
          }
          // Any other Graph API error → fall through to scraper
        }
      }
    } catch (err) {
      // If it's a ProfileFetchError we re-threw above, propagate it
      if (err instanceof ProfileFetchError) throw err
      // Otherwise DB lookup failed, fall through to scraper silently
    }
  }

  // Scraper path (free plan, or no connected account, or auditing a different handle)
  try {
    return await scrapeProfile(username)
  } catch (err) {
    if (err instanceof ScraperError) {
      throw new ProfileFetchError(err.message, err.code)
    }
    throw new ProfileFetchError(
      "Unexpected error while fetching Instagram profile.",
      "FETCH_FAILED"
    )
  }
}
