import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import mongoose from "mongoose"
import { connectDB } from "@/lib/mongodb"
import { UserReport } from "@/models/UserReport"
import { Audit } from "@/models/Audit"

type ReportSummary = {
  totalAudits: number
  avgScore: number
  bestScore: number
  profilesAnalyzed: number
  avgEngagementRate: number
  totalPostsAnalyzed: number
  totalReelsAnalyzed: number
  topHandle: string | null
  scoreDistribution: {
    poor: number
    fair: number
    good: number
    excellent: number
  }
  handles: Array<{
    handle: string
    audits: number
    avgScore: number
    bestScore: number
    avgEngagementRate: number
    postsAnalyzed: number
    reelsAnalyzed: number
    latestAuditAt: string
    scoreDistribution: {
      poor: number
      fair: number
      good: number
      excellent: number
    }
  }>
  recentAudits: Array<{
    handle: string
    score: number
    engagementRate: number
    postsAnalyzed: number
    reelsAnalyzed: number
    createdAt: string
  }>
}

export type UserReportListItem = {
  id: string
  reportType: "monthly" | "custom_30d" | "custom_range"
  periodKey: string
  title: string
  dateLabel: string
  startDate: string
  endDate: string
  summary: ReportSummary
  createdAt: string
}

function getMonthPeriodKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`
}

function getMonthLabel(periodKey: string) {
  const [year, month] = periodKey.split("-").map(Number)
  if (!year || !month) return periodKey
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })
}

function getMonthRange(periodKey: string) {
  const [year, month] = periodKey.split("-").map(Number)
  const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0))
  const end = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0))
  return { start, end }
}

function calcDistribution(scores: number[]) {
  const buckets = { poor: 0, fair: 0, good: 0, excellent: 0 }
  for (const score of scores) {
    if (score < 40) buckets.poor += 1
    else if (score < 60) buckets.fair += 1
    else if (score < 80) buckets.good += 1
    else buckets.excellent += 1
  }
  return buckets
}

async function buildSummary(userId: mongoose.Types.ObjectId, startDate: Date, endDate: Date): Promise<ReportSummary> {
  const audits = await Audit.find({
    userId,
    createdAt: { $gte: startDate, $lt: endDate },
  })
    .select("handle result.overallScore avgEngagementRate postsAnalyzed reelsAnalyzed createdAt")
    .sort({ createdAt: -1 })
    .lean()

  const scores = audits
    .map((audit: any) => Number(audit?.result?.overallScore ?? 0))
    .filter((score) => Number.isFinite(score))
  const totalAudits = audits.length
  const avgScore = totalAudits ? Math.round(scores.reduce((sum, score) => sum + score, 0) / totalAudits) : 0
  const bestScore = totalAudits ? Math.max(...scores) : 0
  const profilesAnalyzed = new Set(audits.map((audit: any) => String(audit.handle ?? "").toLowerCase()).filter(Boolean)).size
  const avgEngagementRate = totalAudits
    ? Number(
        (
          audits.reduce((sum: number, audit: any) => sum + Number(audit.avgEngagementRate ?? 0), 0) / totalAudits
        ).toFixed(2),
      )
    : 0
  const totalPostsAnalyzed = audits.reduce((sum: number, audit: any) => sum + Number(audit.postsAnalyzed ?? 0), 0)
  const totalReelsAnalyzed = audits.reduce((sum: number, audit: any) => sum + Number(audit.reelsAnalyzed ?? 0), 0)

  const handleMap = new Map<
    string,
    {
      handle: string
      scores: number[]
      engagementRates: number[]
      postsAnalyzed: number
      reelsAnalyzed: number
      latestAuditAt: Date
    }
  >()

  for (const audit of audits as any[]) {
    const rawHandle = String(audit?.handle ?? "").trim().replace(/^@/, "").toLowerCase()
    if (!rawHandle) continue

    const score = Number(audit?.result?.overallScore ?? 0)
    const engagementRate = Number(audit?.avgEngagementRate ?? 0)
    const postsAnalyzed = Number(audit?.postsAnalyzed ?? 0)
    const reelsAnalyzed = Number(audit?.reelsAnalyzed ?? 0)
    const createdAt = new Date(audit?.createdAt ?? 0)

    const current = handleMap.get(rawHandle) ?? {
      handle: rawHandle,
      scores: [],
      engagementRates: [],
      postsAnalyzed: 0,
      reelsAnalyzed: 0,
      latestAuditAt: createdAt,
    }

    if (Number.isFinite(score)) current.scores.push(score)
    if (Number.isFinite(engagementRate)) current.engagementRates.push(engagementRate)
    current.postsAnalyzed += Number.isFinite(postsAnalyzed) ? postsAnalyzed : 0
    current.reelsAnalyzed += Number.isFinite(reelsAnalyzed) ? reelsAnalyzed : 0
    if (createdAt > current.latestAuditAt) current.latestAuditAt = createdAt

    handleMap.set(rawHandle, current)
  }

  const handles = Array.from(handleMap.values())
    .map((item) => {
      const auditsCount = item.scores.length
      const avgHandleScore = auditsCount
        ? Math.round(item.scores.reduce((sum, score) => sum + score, 0) / auditsCount)
        : 0
      const avgHandleEngagement = item.engagementRates.length
        ? Number(
            (
              item.engagementRates.reduce((sum, rate) => sum + rate, 0) / item.engagementRates.length
            ).toFixed(2),
          )
        : 0
      return {
        handle: item.handle,
        audits: auditsCount,
        avgScore: avgHandleScore,
        bestScore: auditsCount ? Math.max(...item.scores) : 0,
        avgEngagementRate: avgHandleEngagement,
        postsAnalyzed: item.postsAnalyzed,
        reelsAnalyzed: item.reelsAnalyzed,
        latestAuditAt: item.latestAuditAt.toISOString(),
        scoreDistribution: calcDistribution(item.scores),
      }
    })
    .sort((a, b) => b.audits - a.audits || b.avgScore - a.avgScore)

  const recentAudits = (audits as any[]).slice(0, 50).map((audit) => ({
    handle: String(audit?.handle ?? "").replace(/^@/, "").toLowerCase(),
    score: Number(audit?.result?.overallScore ?? 0),
    engagementRate: Number(audit?.avgEngagementRate ?? 0),
    postsAnalyzed: Number(audit?.postsAnalyzed ?? 0),
    reelsAnalyzed: Number(audit?.reelsAnalyzed ?? 0),
    createdAt: new Date(audit?.createdAt ?? Date.now()).toISOString(),
  }))

  return {
    totalAudits,
    avgScore,
    bestScore,
    profilesAnalyzed,
    avgEngagementRate,
    totalPostsAnalyzed,
    totalReelsAnalyzed,
    topHandle: handles[0]?.handle ?? null,
    scoreDistribution: calcDistribution(scores),
    handles,
    recentAudits,
  }
}

export async function ensureCurrentMonthlyReport(userId: string) {
  await connectDB()
  const objectId = new mongoose.Types.ObjectId(userId)
  const periodKey = getMonthPeriodKey(new Date())
  const { start, end } = getMonthRange(periodKey)
  const summary = await buildSummary(objectId, start, end)

  await UserReport.updateOne(
    { userId: objectId, reportType: "monthly", periodKey },
    {
      $set: {
        title: `Monthly Instagram Audit Report - ${getMonthLabel(periodKey)}`,
        startDate: start,
        endDate: end,
        summary,
      },
    },
    { upsert: true },
  )
}

export async function createLast30DaysReport(userId: string) {
  await connectDB()
  const objectId = new mongoose.Types.ObjectId(userId)
  const endDate = new Date()
  const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000)
  const periodKey = `last30-${endDate.toISOString().slice(0, 10)}`
  const summary = await buildSummary(objectId, startDate, endDate)

  const created = await UserReport.create({
    userId: objectId,
    reportType: "custom_30d",
    periodKey,
    title: "Custom Report - Last 30 Days",
    startDate,
    endDate,
    summary,
  })

  return String(created._id)
}

export async function createCustomRangeReport(userId: string, startDate: Date, endDate: Date) {
  await connectDB()
  const objectId = new mongoose.Types.ObjectId(userId)
  const periodKey = `range-${startDate.toISOString().slice(0, 10)}_${endDate.toISOString().slice(0, 10)}`
  const summary = await buildSummary(objectId, startDate, endDate)

  const created = await UserReport.create({
    userId: objectId,
    reportType: "custom_range",
    periodKey,
    title: `Custom Report - ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
    startDate,
    endDate,
    summary,
  })

  return String(created._id)
}

export async function listUserReports(userId: string): Promise<UserReportListItem[]> {
  await connectDB()
  const objectId = new mongoose.Types.ObjectId(userId)

  const reports = await UserReport.find({ userId: objectId })
    .sort({ createdAt: -1 })
    .lean()

  return reports.map((report: any) => ({
    id: String(report._id),
    reportType: report.reportType,
    periodKey: report.periodKey,
    title: report.title,
    dateLabel:
      report.reportType === "monthly"
        ? getMonthLabel(report.periodKey)
        : `${new Date(report.startDate).toLocaleDateString()} - ${new Date(report.endDate).toLocaleDateString()}`,
    startDate: new Date(report.startDate).toISOString(),
    endDate: new Date(report.endDate).toISOString(),
    summary: report.summary,
    createdAt: new Date(report.createdAt).toISOString(),
  }))
}

export async function getUserReport(userId: string, reportId: string) {
  await connectDB()
  if (!mongoose.Types.ObjectId.isValid(reportId)) return null

  const report = await UserReport.findOne({
    _id: new mongoose.Types.ObjectId(reportId),
    userId: new mongoose.Types.ObjectId(userId),
  }).lean()

  return report as any
}

export async function deleteUserReport(userId: string, reportId: string): Promise<boolean> {
  await connectDB()
  if (!mongoose.Types.ObjectId.isValid(reportId)) return false

  const deleted = await UserReport.deleteOne({
    _id: new mongoose.Types.ObjectId(reportId),
    userId: new mongoose.Types.ObjectId(userId),
  })

  return deleted.deletedCount > 0
}

export async function buildReportPdfBuffer(report: any): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const pageWidth = 595
  const pageHeight = 842
  const left = 44
  const right = pageWidth - 44
  let page = pdfDoc.addPage([pageWidth, pageHeight])
  let y = pageHeight - 46
  const lineHeight = 18

  const summary = report.summary ?? {}
  const distribution = summary.scoreDistribution ?? {}
  const handleRows = Array.isArray(summary.handles) ? summary.handles : []
  const recentRows = Array.isArray(summary.recentAudits) ? summary.recentAudits : []

  function ensureSpace(minY: number) {
    if (y >= minY) return
    page = pdfDoc.addPage([pageWidth, pageHeight])
    y = pageHeight - 46
  }

  function drawLine(text: string, opts?: { bold?: boolean; size?: number; color?: [number, number, number] }) {
    ensureSpace(56)
    const size = opts?.size ?? 12
    const color = opts?.color ?? [0.1, 0.1, 0.1]
    page.drawText(text, {
      x: left,
      y,
      size,
      font: opts?.bold ? bold : font,
      color: rgb(color[0], color[1], color[2]),
    })
    y -= lineHeight
  }

  function drawSectionTitle(text: string) {
    ensureSpace(88)
    page.drawRectangle({
      x: left,
      y: y - 4,
      width: right - left,
      height: 24,
      color: rgb(0.96, 0.94, 0.99),
      borderWidth: 0,
    })
    drawLine(text, { bold: true, size: 12, color: [0.32, 0.2, 0.58] })
  }

  drawLine("InstaAudit Performance Report", { bold: true, size: 24, color: [0.22, 0.14, 0.45] })
  drawLine(report.title ?? "Report", { bold: true, size: 14 })
  drawLine(
    `Period: ${new Date(report.startDate).toLocaleDateString()} - ${new Date(report.endDate).toLocaleDateString()}`,
    { size: 10, color: [0.4, 0.4, 0.4] },
  )
  drawLine(`Generated: ${new Date().toLocaleString()}`, { size: 10, color: [0.4, 0.4, 0.4] })
  y -= 8

  drawSectionTitle("Executive Summary")
  drawLine(`Total audits: ${summary.totalAudits ?? 0}`)
  drawLine(`Profiles analyzed: ${summary.profilesAnalyzed ?? 0}`)
  drawLine(`Average score: ${summary.avgScore ?? 0}/100`)
  drawLine(`Best score: ${summary.bestScore ?? 0}/100`)
  drawLine(`Average engagement rate: ${summary.avgEngagementRate ?? 0}%`)
  drawLine(`Posts analyzed: ${summary.totalPostsAnalyzed ?? 0}`)
  drawLine(`Reels analyzed: ${summary.totalReelsAnalyzed ?? 0}`)
  drawLine(`Top handle by activity: ${summary.topHandle ? `@${summary.topHandle}` : "N/A"}`)
  y -= 6

  drawSectionTitle("Score Distribution")
  drawLine(`Poor (0-39): ${distribution.poor ?? 0}`)
  drawLine(`Fair (40-59): ${distribution.fair ?? 0}`)
  drawLine(`Good (60-79): ${distribution.good ?? 0}`)
  drawLine(`Excellent (80-100): ${distribution.excellent ?? 0}`)
  y -= 6

  drawSectionTitle("Per-Handle Breakdown")
  if (!handleRows.length) {
    drawLine("No handle-level data available for this period.", { size: 10, color: [0.4, 0.4, 0.4] })
  } else {
    for (const handle of handleRows) {
      ensureSpace(120)
      drawLine(`@${handle.handle}`, { bold: true, size: 11 })
      drawLine(
        `Audits: ${handle.audits} | Avg: ${handle.avgScore}/100 | Best: ${handle.bestScore}/100 | Engagement: ${handle.avgEngagementRate}%`,
        { size: 10 },
      )
      drawLine(
        `Posts: ${handle.postsAnalyzed} | Reels: ${handle.reelsAnalyzed} | Latest: ${new Date(handle.latestAuditAt).toLocaleDateString()}`,
        { size: 10, color: [0.35, 0.35, 0.35] },
      )
      drawLine(
        `Distribution: Poor ${handle.scoreDistribution.poor} • Fair ${handle.scoreDistribution.fair} • Good ${handle.scoreDistribution.good} • Excellent ${handle.scoreDistribution.excellent}`,
        { size: 9, color: [0.45, 0.45, 0.45] },
      )
      y -= 4
    }
  }

  drawSectionTitle("Recent Audit Entries")
  if (!recentRows.length) {
    drawLine("No recent audits available.", { size: 10, color: [0.4, 0.4, 0.4] })
  } else {
    for (const audit of recentRows.slice(0, 20)) {
      ensureSpace(72)
      drawLine(
        `${new Date(audit.createdAt).toLocaleDateString()}  @${audit.handle}  Score ${audit.score}/100  Engagement ${audit.engagementRate}%`,
        { size: 9 },
      )
    }
  }

  const bytes = await pdfDoc.save()
  return Buffer.from(bytes)
}

export function buildReportCsv(report: any): string {
  const summary = report.summary ?? {}
  const distribution = summary.scoreDistribution ?? {}
  const handles = Array.isArray(summary.handles) ? summary.handles : []
  const recentAudits = Array.isArray(summary.recentAudits) ? summary.recentAudits : []

  const encodeRow = (row: Array<string | number>) =>
    row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")

  const sections: string[] = []

  sections.push(
    [
      encodeRow(["section", "field", "value"]),
      encodeRow(["metadata", "title", report.title ?? ""]),
      encodeRow(["metadata", "startDate", new Date(report.startDate).toISOString()]),
      encodeRow(["metadata", "endDate", new Date(report.endDate).toISOString()]),
      encodeRow(["summary", "totalAudits", summary.totalAudits ?? 0]),
      encodeRow(["summary", "avgScore", summary.avgScore ?? 0]),
      encodeRow(["summary", "bestScore", summary.bestScore ?? 0]),
      encodeRow(["summary", "profilesAnalyzed", summary.profilesAnalyzed ?? 0]),
      encodeRow(["summary", "avgEngagementRate", summary.avgEngagementRate ?? 0]),
      encodeRow(["summary", "totalPostsAnalyzed", summary.totalPostsAnalyzed ?? 0]),
      encodeRow(["summary", "totalReelsAnalyzed", summary.totalReelsAnalyzed ?? 0]),
      encodeRow(["summary", "topHandle", summary.topHandle ?? ""]),
      encodeRow(["distribution", "poor", distribution.poor ?? 0]),
      encodeRow(["distribution", "fair", distribution.fair ?? 0]),
      encodeRow(["distribution", "good", distribution.good ?? 0]),
      encodeRow(["distribution", "excellent", distribution.excellent ?? 0]),
    ].join("\n"),
  )

  sections.push(
    [
      encodeRow([
        "handle",
        "audits",
        "avgScore",
        "bestScore",
        "avgEngagementRate",
        "postsAnalyzed",
        "reelsAnalyzed",
        "latestAuditAt",
        "poor",
        "fair",
        "good",
        "excellent",
      ]),
      ...handles.map((handle) =>
        encodeRow([
          handle.handle,
          handle.audits,
          handle.avgScore,
          handle.bestScore,
          handle.avgEngagementRate,
          handle.postsAnalyzed,
          handle.reelsAnalyzed,
          handle.latestAuditAt,
          handle.scoreDistribution?.poor ?? 0,
          handle.scoreDistribution?.fair ?? 0,
          handle.scoreDistribution?.good ?? 0,
          handle.scoreDistribution?.excellent ?? 0,
        ]),
      ),
    ].join("\n"),
  )

  sections.push(
    [
      encodeRow(["auditDate", "handle", "score", "engagementRate", "postsAnalyzed", "reelsAnalyzed"]),
      ...recentAudits.map((audit) =>
        encodeRow([
          audit.createdAt,
          audit.handle,
          audit.score,
          audit.engagementRate,
          audit.postsAnalyzed,
          audit.reelsAnalyzed,
        ]),
      ),
    ].join("\n"),
  )

  return sections.join("\n\n")
}
