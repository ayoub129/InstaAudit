import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const pricingPlans = [
  {
    slug: "free",
    name: "Free Audit",
    subtitle: "Try InstaAudit with a full audit and see how the product works before upgrading.",
    priceMonthly: 0,
    priceAnnual: 0,
    ctaText: "Get Free Audit",
    ctaLink: "/signup?plan=free",
    badge: "",
    isPopular: false,
    order: 1,
    note: "Perfect for getting started",
    features: [
      "1 full Instagram audit",
      "AI score out of 100",
      "Basic profile feedback",
      "Starter recommendations",
      "Basic export",
      "No credit card required",
    ],
    compare: {
      instagramAuditsPerMonth: "1",
      accounts: "1",
      aiScoreOutOf100: "✓",
      profileAndContentBreakdown: "Basic",
      contentRecommendations: "Basic",
      sevenDayContentDirection: "—",
      positioningAndCtaSuggestions: "—",
      strategyInsights: "—",
      exportableReports: "Basic",
      multiAccountSupport: "—",
      teamCollaboration: "—",
      support: "Standard",
    },
  },
  {
    slug: "starter",
    name: "Starter",
    subtitle: "For solo creators and freelancers who want recurring audits without going fully unlimited.",
    priceMonthly: 19,
    priceAnnual: 15,
    ctaText: "Start Starter",
    ctaLink: "/signup?plan=starter",
    badge: "",
    isPopular: false,
    order: 2,
    note: "Billed monthly, cancel anytime",
    features: [
      "10 audits per month",
      "Full profile and content breakdown",
      "Positioning recommendations",
      "Caption and CTA suggestions",
      "Priority fixes to improve first",
      "Standard email support",
    ],
    compare: {
      instagramAuditsPerMonth: "10",
      accounts: "1",
      aiScoreOutOf100: "✓",
      profileAndContentBreakdown: "Full",
      contentRecommendations: "✓",
      sevenDayContentDirection: "—",
      positioningAndCtaSuggestions: "✓",
      strategyInsights: "—",
      exportableReports: "✓",
      multiAccountSupport: "—",
      teamCollaboration: "—",
      support: "Standard",
    },
  },
  {
    slug: "pro",
    name: "Pro",
    subtitle: "For creators, consultants, and growing brands that want ongoing AI-powered guidance.",
    priceMonthly: 39,
    priceAnnual: 31,
    ctaText: "Start Pro",
    ctaLink: "/signup?plan=pro",
    badge: "Most popular",
    isPopular: true,
    order: 3,
    note: "Billed monthly, cancel anytime",
    features: [
      "Unlimited audits",
      "Advanced AI analysis",
      "7-day content direction",
      "Deeper positioning guidance",
      "Content and CTA improvement suggestions",
      "Monthly strategy insights",
      "Priority support",
    ],
    compare: {
      instagramAuditsPerMonth: "Unlimited",
      accounts: "1",
      aiScoreOutOf100: "✓",
      profileAndContentBreakdown: "Advanced",
      contentRecommendations: "✓",
      sevenDayContentDirection: "✓",
      positioningAndCtaSuggestions: "✓",
      strategyInsights: "Monthly",
      exportableReports: "✓",
      multiAccountSupport: "—",
      teamCollaboration: "—",
      support: "Priority",
    },
  },
  {
    slug: "agency",
    name: "Agency",
    subtitle: "For teams and agencies managing multiple brands or client accounts.",
    priceMonthly: 99,
    priceAnnual: 79,
    ctaText: "Contact Sales",
    ctaLink: "/contact",
    badge: "",
    isPopular: false,
    order: 4,
    note: "Billed monthly, cancel anytime",
    features: [
      "Everything in Pro",
      "Multi-account workflow",
      "Team collaboration",
      "Client-ready reporting",
      "Shared access for team members",
      "Priority onboarding support",
      "Custom setup help",
    ],
    compare: {
      instagramAuditsPerMonth: "Unlimited",
      accounts: "10+",
      aiScoreOutOf100: "✓",
      profileAndContentBreakdown: "Advanced",
      contentRecommendations: "✓",
      sevenDayContentDirection: "✓",
      positioningAndCtaSuggestions: "✓",
      strategyInsights: "Advanced",
      exportableReports: "✓",
      multiAccountSupport: "✓",
      teamCollaboration: "✓",
      support: "Priority + onboarding",
    },
  },
]

async function seedPricing() {
  try {
    console.log("MONGODB_URI loaded:", !!process.env.MONGODB_URI)

    const { connectDB } = await import("../lib/mongodb")
    const { default: Pricing } = await import("../models/Pricing")

    await connectDB()
    console.log("MongoDB connected")

    await Pricing.deleteMany({})
    console.log("Old pricing deleted")

    await Pricing.insertMany(pricingPlans)
    console.log("Pricing seeded successfully")

    process.exit(0)
  } catch (error) {
    console.error("Seed failed:", error)
    process.exit(1)
  }
}

seedPricing()