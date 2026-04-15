import { Navigation } from "@/components/landing/navigation"
import { Footer } from "@/components/landing/footer"

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-foreground/60 mb-8">Last updated: January 2026</p>

          <div className="space-y-8 text-foreground/80">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
              <p>
                InstaAudit ("we", "us", "our", or "Company") operates the InstaAudit website and application. This page
                informs you of our policies regarding the collection, use, and disclosure of personal data when you use
                our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Information Collection and Use</h2>
              <p className="mb-3">
                We collect several different types of information for various purposes to provide and improve our
                service:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Account information (name, email, password)</li>
                <li>Profile data (Instagram username, analytics)</li>
                <li>Usage data (pages visited, time spent, interactions)</li>
                <li>Device information (device type, browser, IP address)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Use of Data</h2>
              <p>InstaAudit uses the collected data for various purposes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>To provide and maintain our service</li>
                <li>To notify you about changes to our service</li>
                <li>To allow you to participate in interactive features</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information to improve our service</li>
                <li>To monitor the usage of our service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Security of Data</h2>
              <p>
                The security of your data is important to us but remember that no method of transmission over the
                Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable
                means to protect your personal data, we cannot guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
                Privacy Policy on this page and updating the "effective date" at the top of this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at privacy@instaaudit.com or
                visit our contact page.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
