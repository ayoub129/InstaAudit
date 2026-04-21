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
  scoreDistribution: {
    poor: number
    fair: number
    good: number
    excellent: number
  }
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
    .select("handle result.overallScore")
    .lean()

  const scores = audits
    .map((audit: any) => Number(audit?.result?.overallScore ?? 0))
    .filter((score) => Number.isFinite(score))
  const totalAudits = audits.length
  const avgScore = totalAudits ? Math.round(scores.reduce((sum, score) => sum + score, 0) / totalAudits) : 0
  const bestScore = totalAudits ? Math.max(...scores) : 0
  const profilesAnalyzed = new Set(audits.map((audit: any) => String(audit.handle ?? "").toLowerCase()).filter(Boolean)).size

  return {
    totalAudits,
    avgScore,
    bestScore,
    profilesAnalyzed,
    scoreDistribution: calcDistribution(scores),
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

export async function buildReportPdfBuffer(report: any): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  let y = 790
  const left = 50
  const lineHeight = 20

  function drawLine(text: string, opts?: { bold?: boolean; size?: number; color?: [number, number, number] }) {
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

  drawLine("InstaAudit Report", { bold: true, size: 22 })
  drawLine(report.title ?? "Report", { bold: true, size: 14 })
  drawLine(
    `Period: ${new Date(report.startDate).toLocaleDateString()} - ${new Date(report.endDate).toLocaleDateString()}`,
    { size: 10, color: [0.4, 0.4, 0.4] },
  )
  y -= 10
  drawLine("Summary", { bold: true, size: 13 })
  drawLine(`Total audits: ${report.summary?.totalAudits ?? 0}`)
  drawLine(`Average score: ${report.summary?.avgScore ?? 0}/100`)
  drawLine(`Best score: ${report.summary?.bestScore ?? 0}/100`)
  drawLine(`Profiles analyzed: ${report.summary?.profilesAnalyzed ?? 0}`)
  y -= 10
  drawLine("Score distribution", { bold: true, size: 13 })
  const distribution = report.summary?.scoreDistribution ?? {}
  drawLine(`Poor (0-39): ${distribution.poor ?? 0}`)
  drawLine(`Fair (40-59): ${distribution.fair ?? 0}`)
  drawLine(`Good (60-79): ${distribution.good ?? 0}`)
  drawLine(`Excellent (80-100): ${distribution.excellent ?? 0}`)
  y -= 10
  drawLine(`Generated on ${new Date().toLocaleString()}`, { size: 9, color: [0.4, 0.4, 0.4] })

  const bytes = await pdfDoc.save()
  return Buffer.from(bytes)
}

export function buildReportCsv(report: any): string {
  const distribution = report.summary?.scoreDistribution ?? {}
  const rows = [
    ["field", "value"],
    ["title", report.title ?? ""],
    ["startDate", new Date(report.startDate).toISOString()],
    ["endDate", new Date(report.endDate).toISOString()],
    ["totalAudits", String(report.summary?.totalAudits ?? 0)],
    ["avgScore", String(report.summary?.avgScore ?? 0)],
    ["bestScore", String(report.summary?.bestScore ?? 0)],
    ["profilesAnalyzed", String(report.summary?.profilesAnalyzed ?? 0)],
    ["distribution_poor", String(distribution.poor ?? 0)],
    ["distribution_fair", String(distribution.fair ?? 0)],
    ["distribution_good", String(distribution.good ?? 0)],
    ["distribution_excellent", String(distribution.excellent ?? 0)],
  ]
  return rows.map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n")
}
