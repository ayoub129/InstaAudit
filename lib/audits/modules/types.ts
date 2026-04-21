import type { ProfileData } from "@/lib/instagram/types"

export interface ModuleResult<T extends Record<string, unknown> = Record<string, unknown>> {
  score: number
  findings: string[]
  rawData: T
}

export type ScoringModule<T extends Record<string, unknown> = Record<string, unknown>> = (
  profile: ProfileData,
) => Promise<ModuleResult<T>>

