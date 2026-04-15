import { Navigation } from "@/components/landing/navigation"
import { Footer } from "@/components/landing/footer"

export default function CookiesPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Cookie Policy</h1>
          <p className="text-foreground/60 mb-8">Last updated: January 2026</p>

          <div className="space-y-8 text-foreground/80">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. What Are Cookies?</h2>
              <p>
                Cookies are small pieces of text stored on your device when you visit a website. They help websites
                remember information about your visit, such as your preferences and login details.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Cookies</h2>
              <p className="mb-3">InstaAudit uses cookies for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Authentication and security</li>
                <li>Remembering user preferences</li>
                <li>Analytics and performance monitoring</li>
                <li>Personalizing user experience</li>
                <li>Advertising and marketing purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Types of Cookies We Use</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Essential Cookies</h3>
                  <p>Required for the website to function properly. Cannot be disabled.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Analytics Cookies</h3>
                  <p>Help us understand how visitors interact with our website.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Marketing Cookies</h3>
                  <p>Used to track advertising effectiveness and user interests.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Managing Cookies</h2>
              <p>
                Most browsers allow you to control cookies through their settings. You can set your browser to refuse
                cookies or to alert you when cookies are being sent. However, disabling cookies may affect the
                functionality of this website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Third-Party Cookies</h2>
              <p>
                Some of our partners may use cookies on our website to analyze usage, deliver targeted advertisements,
                or provide other services. We are not responsible for the privacy practices of these third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Changes to This Cookie Policy</h2>
              <p>
                We may update this Cookie Policy from time to time. We recommend reviewing this policy periodically to
                stay informed about how we use cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Contact Us</h2>
              <p>
                If you have questions about this Cookie Policy, please contact us at privacy@instaaudit.com or visit our
                contact page.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
