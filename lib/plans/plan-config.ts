export type PlanKey = "free" | "starter" | "pro" | "agency"

export const PLAN_CONFIG = {
  free: {
    auditsPerMonth: 1,
    auditDepth: "basic",
    allowInstagramConnect: false,
    canExport: false,
    canCompare: false,
    canUseWorkspace: false,
  },
  starter: {
    auditsPerMonth: 10,
    auditDepth: "full",
    allowInstagramConnect: true,
    canExport: false,
    canCompare: false,
    canUseWorkspace: false,
  },
  pro: {
    auditsPerMonth: -1,
    auditDepth: "advanced",
    allowInstagramConnect: true,
    canExport: true,
    canCompare: true,
    canUseWorkspace: false,
  },
  agency: {
    auditsPerMonth: -1,
    auditDepth: "advanced",
    allowInstagramConnect: true,
    canExport: true,
    canCompare: true,
    canUseWorkspace: true,
  },
} as const