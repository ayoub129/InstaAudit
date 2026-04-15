import { Navigation } from "@/components/landing/navigation"
import { Footer } from "@/components/landing/footer"

export default function TermsPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-foreground/60 mb-8">Last updated: January 2026</p>

          <div className="space-y-8 text-foreground/80">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing and using InstaAudit, you accept and agree to be bound by the terms and provision of this
                agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Use License</h2>
              <p className="mb-3">
                Permission is granted to temporarily download one copy of the materials (information or software):
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>For personal, non-commercial transitory viewing only</li>
                <li>This is the grant of a license, not a transfer of title</li>
                <li>Under this license you may not modify the materials</li>
                <li>Not copy the materials</li>
                <li>Not use the materials for any commercial purpose</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Disclaimer</h2>
              <p>
                The materials on InstaAudit's website are provided on an 'as is' basis. InstaAudit makes no warranties,
                expressed or implied, and hereby disclaims and negates all other warranties including, without
                limitation, implied warranties or conditions of merchantability, fitness for a particular purpose.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Limitations</h2>
              <p>
                In no event shall InstaAudit or its suppliers be liable for any damages (including, without limitation,
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability
                to use the materials on InstaAudit's website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Accuracy of Materials</h2>
              <p>
                The materials appearing on InstaAudit's website could include technical, typographical, or photographic
                errors. InstaAudit does not warrant that any of the materials on its website are accurate, complete, or
                current.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Modifications</h2>
              <p>
                InstaAudit may revise these terms of service for its website at any time without notice. By using this
                website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of the United
                States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at legal@instaaudit.com or
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
