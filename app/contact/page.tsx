"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Navigation } from "@/components/landing/navigation"
import { Footer } from "@/components/landing/footer"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" })
      setIsSubmitted(false)
    }, 3000)
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl mb-4">
              Get in{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="border-border/50 bg-background/50">
                <CardContent className="pt-6">
                  <div className="text-2xl mb-3">📧</div>
                  <h3 className="font-semibold text-foreground mb-2">Email</h3>
                  <p className="text-foreground/70 text-sm">support@instaaudit.org</p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-background/50">
                <CardContent className="pt-6">
                  <div className="text-2xl mb-3">💬</div>
                  <h3 className="font-semibold text-foreground mb-2">Chat</h3>
                  <p className="text-foreground/70 text-sm">Chat with our support team</p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-background/50">
                <CardContent className="pt-6">
                  <div className="text-2xl mb-3">🌐</div>
                  <h3 className="font-semibold text-foreground mb-2">Social</h3>
                  <p className="text-foreground/70 text-sm">@InstaAudit on Twitter</p>
                </CardContent>
              </Card>
            </div>

            {/* Form */}
            <div className="md:col-span-2">
              <Card className="border-border/50 bg-background/50">
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>Fill out the form below and we'll get back to you.</CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-3">✓</div>
                      <h3 className="font-semibold text-foreground mb-2">Message Sent!</h3>
                      <p className="text-foreground/70">We'll be in touch shortly.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Name</label>
                          <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            className="bg-background/50 border-border/50"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Email</label>
                          <Input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            className="bg-background/50 border-border/50"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Subject</label>
                        <Input
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="How can we help?"
                          className="bg-background/50 border-border/50"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Message</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us more..."
                          rows={6}
                          className="w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm text-foreground placeholder:text-foreground/50"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                      >
                        Send Message
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
