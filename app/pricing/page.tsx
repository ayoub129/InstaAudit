import type { Metadata } from "next"
import { PricingPageClient } from "./pricing-page-client"

export const metadata: Metadata = {
  title: "Pricing | InstaAudit",
  description:
    "Explore InstaAudit pricing. Start with a free audit, then upgrade for more AI-powered profile insights, content direction, and multi-account workflows.",
  openGraph: {
    title: "Pricing | InstaAudit",
    description:
      "Simple pricing for creators, brands, and teams. Start free and upgrade when you need more audits and deeper AI-powered recommendations.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | InstaAudit",
    description:
      "Simple pricing for creators, brands, and teams. Start free and upgrade when you need more audits and deeper AI-powered recommendations.",
  },
}

export default function PricingPage() {
  return <PricingPageClient />
}