import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function LandingFAQ() {
  const faqs = [
    {
      question: "How does InstaAudit analyze my Instagram profile?",
      answer:
        "InstaAudit uses AI algorithms to analyze your Instagram profile, including your bio, content, engagement rates, and posting patterns. We provide insights based on industry best practices and what's working for successful accounts in your niche.",
    },
    {
      question: "Do I need to provide my Instagram password?",
      answer:
        "No, you don't need to provide your Instagram password. InstaAudit only requires your public Instagram handle to analyze publicly available data from your profile.",
    },
    {
      question: "How often should I run an audit on my Instagram profile?",
      answer:
        "For best results, we recommend running a full audit monthly, with weekly check-ins on specific metrics like engagement rate and follower growth. This helps you stay on track with your Instagram strategy and make timely adjustments.",
    },
    {
      question: "Can I audit multiple Instagram accounts?",
      answer:
        "Yes, depending on your plan. The Free plan allows for 1 Instagram profile, the Pro plan allows for 3 profiles, and the Business plan allows for up to 10 profiles.",
    },
    {
      question: "How accurate are the AI recommendations?",
      answer:
        "Our AI recommendations are based on analyzing thousands of successful Instagram accounts and current platform trends. While we can't guarantee specific results, our users typically see significant improvements in engagement and follower growth when implementing our suggestions.",
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer:
        "Yes, you can cancel your subscription at any time. If you cancel, you'll continue to have access to your plan until the end of your current billing period.",
    },
  ]

  return (
    <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-pink-100 px-3 py-1 text-sm text-pink-500">FAQ</div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Frequently Asked Questions</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Find answers to common questions about InstaAudit and how it can help you grow your Instagram presence.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl py-12">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
