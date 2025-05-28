import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { Instagram } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-slate-50 py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center mb-8">
              <Instagram className="h-12 w-12 text-pink-500" />
            </div>
            <h1 className="text-4xl font-bold text-center mb-6">Terms of Service</h1>
            <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              {/* Introduction */}
              <div>
                <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                <p className="text-gray-600 mb-4">
                  Welcome to InstaAudit. By accessing our website and using our services, you agree to these terms of service. 
                  Please read them carefully before using our platform.
                </p>
                <p className="text-gray-600">
                  These Terms of Service ("Terms") govern your access to and use of InstaAudit's website and services. 
                  By using our services, you agree to be bound by these Terms.
                </p>
              </div>

              {/* Services */}
              <div>
                <h2 className="text-2xl font-bold mb-4">2. Services</h2>
                <p className="text-gray-600 mb-4">
                  InstaAudit provides Instagram analytics and optimization tools to help users improve their social media presence. 
                  Our services include but are not limited to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Instagram account analytics</li>
                  <li>Content performance tracking</li>
                  <li>Audience insights</li>
                  <li>Engagement metrics</li>
                  <li>Optimization recommendations</li>
                </ul>
              </div>

              {/* User Accounts */}
              <div>
                <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
                <p className="text-gray-600 mb-4">
                  To use our services, you must create an account. You are responsible for:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Maintaining the security of your account</li>
                  <li>All activities that occur under your account</li>
                  <li>Providing accurate and complete information</li>
                  <li>Updating your information as needed</li>
                </ul>
              </div>

              {/* Privacy */}
              <div>
                <h2 className="text-2xl font-bold mb-4">4. Privacy</h2>
                <p className="text-gray-600 mb-4">
                  Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. 
                  By using our services, you agree to our Privacy Policy.
                </p>
              </div>

              {/* Payment Terms */}
              <div>
                <h2 className="text-2xl font-bold mb-4">5. Payment Terms</h2>
                <p className="text-gray-600 mb-4">
                  Some of our services require payment. By subscribing to a paid plan, you agree to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Pay all fees in accordance with your selected plan</li>
                  <li>Provide valid payment information</li>
                  <li>Authorize us to charge your payment method</li>
                  <li>Pay any applicable taxes</li>
                </ul>
              </div>

              {/* Prohibited Activities */}
              <div>
                <h2 className="text-2xl font-bold mb-4">6. Prohibited Activities</h2>
                <p className="text-gray-600 mb-4">
                  You agree not to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Use our services for any illegal purpose</li>
                  <li>Violate any laws or regulations</li>
                  <li>Infringe on others' intellectual property rights</li>
                  <li>Attempt to gain unauthorized access</li>
                  <li>Interfere with the proper functioning of our services</li>
                </ul>
              </div>

              {/* Termination */}
              <div>
                <h2 className="text-2xl font-bold mb-4">7. Termination</h2>
                <p className="text-gray-600 mb-4">
                  We may terminate or suspend your account and access to our services at any time, with or without cause, 
                  and without prior notice. Upon termination, your right to use our services will immediately cease.
                </p>
              </div>

              {/* Changes to Terms */}
              <div>
                <h2 className="text-2xl font-bold mb-4">8. Changes to Terms</h2>
                <p className="text-gray-600 mb-4">
                  We reserve the right to modify these terms at any time. We will notify users of any material changes via email 
                  or through our website. Your continued use of our services after such modifications constitutes your acceptance 
                  of the modified terms.
                </p>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
                <p className="text-gray-600">
                  If you have any questions about these Terms, please contact us at{" "}
                  <a href="mailto:legal@instaaudit.com" className="text-pink-500 hover:text-pink-600">
                    legal@instaaudit.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  )
} 