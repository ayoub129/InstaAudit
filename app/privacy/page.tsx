import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { Instagram } from "lucide-react"

export default function PrivacyPage() {
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
            <h1 className="text-4xl font-bold text-center mb-6">Privacy Policy</h1>
            <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </section>

        {/* Privacy Content */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              {/* Introduction */}
              <div>
                <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                <p className="text-gray-600 mb-4">
                  At InstaAudit, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
                  and safeguard your information when you use our service.
                </p>
                <p className="text-gray-600">
                  Please read this privacy policy carefully. By using our service, you consent to the practices described in this policy.
                </p>
              </div>

              {/* Information We Collect */}
              <div>
                <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
                <p className="text-gray-600 mb-4">We collect several types of information from and about users of our service:</p>
                
                <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                  <li>Name and contact information</li>
                  <li>Email address</li>
                  <li>Payment information</li>
                  <li>Account credentials</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Instagram Data</h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                  <li>Profile information</li>
                  <li>Post content and engagement metrics</li>
                  <li>Follower and following data</li>
                  <li>Analytics and insights</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Usage Information</h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Log data and device information</li>
                  <li>IP address and browser type</li>
                  <li>Time and date of access</li>
                  <li>Pages visited and features used</li>
                </ul>
              </div>

              {/* How We Use Your Information */}
              <div>
                <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
                <p className="text-gray-600 mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Provide and maintain our service</li>
                  <li>Process your transactions</li>
                  <li>Send you updates and marketing communications</li>
                  <li>Improve our service and user experience</li>
                  <li>Analyze usage patterns and trends</li>
                  <li>Prevent fraud and enhance security</li>
                </ul>
              </div>

              {/* Information Sharing */}
              <div>
                <h2 className="text-2xl font-bold mb-4">4. Information Sharing</h2>
                <p className="text-gray-600 mb-4">
                  We may share your information with:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Service providers and business partners</li>
                  <li>Analytics and marketing tools</li>
                  <li>Legal authorities when required by law</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  We do not sell your personal information to third parties.
                </p>
              </div>

              {/* Data Security */}
              <div>
                <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
                <p className="text-gray-600 mb-4">
                  We implement appropriate security measures to protect your personal information, including:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Encryption of sensitive data</li>
                  <li>Regular security assessments</li>
                  <li>Access controls and authentication</li>
                  <li>Secure data storage and transmission</li>
                </ul>
              </div>

              {/* Your Rights */}
              <div>
                <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
                <p className="text-gray-600 mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Export your data</li>
                </ul>
              </div>

              {/* Cookies */}
              <div>
                <h2 className="text-2xl font-bold mb-4">7. Cookies</h2>
                <p className="text-gray-600 mb-4">
                  We use cookies and similar tracking technologies to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Remember your preferences</li>
                  <li>Analyze site usage</li>
                  <li>Improve our service</li>
                  <li>Provide personalized content</li>
                </ul>
              </div>

              {/* Children's Privacy */}
              <div>
                <h2 className="text-2xl font-bold mb-4">8. Children's Privacy</h2>
                <p className="text-gray-600">
                  Our service is not intended for children under 13 years of age. We do not knowingly collect personal information 
                  from children under 13. If you are a parent or guardian and believe your child has provided us with personal 
                  information, please contact us.
                </p>
              </div>

              {/* Changes to Privacy Policy */}
              <div>
                <h2 className="text-2xl font-bold mb-4">9. Changes to Privacy Policy</h2>
                <p className="text-gray-600">
                  We may update this privacy policy from time to time. We will notify you of any changes by posting the new 
                  privacy policy on this page and updating the "Last updated" date.
                </p>
              </div>

              {/* Contact Us */}
              <div>
                <h2 className="text-2xl font-bold mb-4">10. Contact Us</h2>
                <p className="text-gray-600">
                  If you have any questions about this Privacy Policy, please contact us at{" "}
                  <a href="mailto:privacy@instaaudit.com" className="text-pink-500 hover:text-pink-600">
                    privacy@instaaudit.com
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