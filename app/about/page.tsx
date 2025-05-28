import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { Instagram } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
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
            <h1 className="text-4xl font-bold text-center mb-6">About InstaAudit</h1>
            <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto">
              We're on a mission to help Instagram creators and businesses optimize their social media presence
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                At InstaAudit, we believe that every Instagram creator deserves the tools and insights needed to grow their presence effectively. 
                Our platform provides comprehensive analytics and actionable recommendations to help you understand your audience better and 
                create more engaging content.
              </p>
              <p className="text-lg text-gray-600">
                Whether you're a content creator, business owner, or social media manager, we're here to help you make data-driven decisions 
                that will elevate your Instagram strategy.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-slate-50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Data-Driven Insights</h3>
                <p className="text-gray-600">
                  We believe in the power of data to drive better decisions and create more effective content strategies.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">User-Focused Design</h3>
                <p className="text-gray-600">
                  Our platform is built with you in mind, making complex analytics simple and actionable.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Continuous Innovation</h3>
                <p className="text-gray-600">
                  We're constantly evolving our tools to meet the changing needs of the Instagram community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Team</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">John Doe</h3>
                <p className="text-gray-600">Founder & CEO</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">Jane Smith</h3>
                <p className="text-gray-600">Head of Product</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">Mike Johnson</h3>
                <p className="text-gray-600">Lead Developer</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-slate-50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              <p className="text-lg text-gray-600 mb-8">
                Have questions about InstaAudit? We'd love to hear from you.
              </p>
              <Link href="/contact" className="bg-pink-500 text-white px-8 py-3 rounded-lg hover:bg-pink-600 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  )
} 