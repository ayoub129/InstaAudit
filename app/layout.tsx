import type React from "react"
import type { Metadata, Viewport } from "next"
import { Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "@/components/auth/session-provider"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
})

const siteName = "InstaAudit"
const siteUrl = "https://instaaudit.org"
const title = "InstaAudit - Optimize Your Instagram Strategy"
const description =
  "Get AI-powered insights on your Instagram profile. Audit your bio, captions, hashtags, and engagement with actionable recommendations."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s | ${siteName}`,
  },
  description,
  applicationName: siteName,
  keywords: [
    "Instagram audit",
    "Instagram analytics",
    "AI Instagram audit",
    "Instagram bio analysis",
    "Instagram growth tool",
    "Instagram content strategy",
    "social media audit",
    "creator analytics",
    "Instagram recommendations",
    "InstaAudit",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  category: "technology",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: "InstaAudit - AI-Powered Instagram Analytics",
    description:
      "Get instant AI-powered insights on your Instagram profile. Free audit, content recommendations, and actionable next steps.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "InstaAudit - AI-Powered Instagram Analytics",
    description:
      "Get instant AI-powered insights on your Instagram profile. Free audit, content recommendations, and actionable next steps.",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: ["/favicon.ico"],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  colorScheme: "dark light",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={poppins.variable}>
      <body className={`${poppins.className} min-h-screen bg-background text-foreground antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <SessionProvider>
            {children}
            <Analytics />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}