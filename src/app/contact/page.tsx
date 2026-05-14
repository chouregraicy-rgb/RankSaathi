// src/app/contact/page.tsx
import Link from "next/link";
import { GraduationCap, Mail, ArrowLeft, MessageCircle, Clock, Building2, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg">RankSaathi</span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 py-14 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-3">Contact Us</h1>
          <p className="text-brand-100 text-lg">We're here to help. Reach out anytime.</p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">

          {/* Contact Cards */}
          <div className="space-y-5">
            <h2 className="text-xl font-display font-bold">Get in Touch</h2>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Email Us</p>
                  <a href="mailto:contact@globalwebsaas.org"
                    className="text-brand-600 hover:underline text-sm font-medium mt-0.5 block">
                    contact@globalwebsaas.org
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">For all queries, support, and feedback</p>
                </div>
              </div>

              <div className="border-t border-border" />

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Response Time</p>
                  <p className="text-sm text-muted-foreground mt-0.5">We respond within 24 hours on business days</p>
                  <p className="text-xs text-muted-foreground mt-1">Mon – Sat, 9 AM – 6 PM IST</p>
                </div>
              </div>

              <div className="border-t border-border" />

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Company</p>
                  <p className="text-sm text-muted-foreground mt-0.5">GlobalWebSaaS</p>
                  <p className="text-xs text-muted-foreground mt-1">Operator of RankSaathi Platform</p>
                </div>
              </div>
            </div>

            {/* Quick Topics */}
            <div className="bg-muted/40 rounded-2xl p-5 border border-border">
              <p className="font-semibold text-sm mb-3">Common Topics</p>
              <div className="space-y-2">
                {[
                  { topic: "Subscription & Billing", desc: "Plans, payments, cancellations" },
                  { topic: "Technical Support", desc: "App issues, login problems" },
                  { topic: "School/Institution Plans", desc: "Bulk licensing for schools" },
                  { topic: "Data & Privacy", desc: "Account deletion, data requests" },
                  { topic: "Partnership Enquiries", desc: "Coaching centres, institutions" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5">
                    <div>
                      <p className="text-sm font-medium">{item.topic}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <a href={`mailto:contact@globalwebsaas.org?subject=${encodeURIComponent(item.topic)}`}
                      className="text-xs text-brand-600 hover:underline font-medium">
                      Email →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side — Email CTA */}
          <div className="space-y-5">
            <h2 className="text-xl font-display font-bold">Send Us a Message</h2>

            <div className="bg-card border border-border rounded-2xl p-6">
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                For the fastest response, email us directly at{" "}
                <a href="mailto:contact@globalwebsaas.org" className="text-brand-600 font-medium hover:underline">
                  contact@globalwebsaas.org
                </a>{" "}
                with your query. Please include your registered email and a brief description of the issue.
              </p>

              <a href="mailto:contact@globalwebsaas.org"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all">
                <Mail className="h-4 w-4" />
                Email contact@globalwebsaas.org
              </a>

              <div className="mt-6 pt-5 border-t border-border space-y-3">
                <p className="text-sm font-semibold">For School & Institution Plans</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  If you're a school, coaching centre, or institution looking for bulk access or custom pricing, email us with the subject line <strong>"Institution Plan"</strong> and we'll get back to you within 48 hours with a tailored proposal.
                </p>
                <a href="mailto:contact@globalwebsaas.org?subject=Institution Plan Enquiry"
                  className="inline-flex items-center gap-1.5 text-xs text-brand-600 font-medium hover:underline">
                  Send Institution Enquiry →
                </a>
              </div>
            </div>

            {/* FAQ snippet */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <p className="font-semibold text-sm">Frequently Asked</p>
              {[
                {
                  q: "How do I link my parent account?",
                  a: "After logging in as a parent, click 'Link Student' in the sidebar and enter the 8-character invite code from the student's Settings page.",
                },
                {
                  q: "Is there a free trial?",
                  a: "Yes! RankSaathi offers a 7-day free trial for all premium features. No credit card required.",
                },
                {
                  q: "How do I cancel my subscription?",
                  a: "Email us at contact@globalwebsaas.org with your registered email and we'll process the cancellation within 24 hours.",
                },
              ].map((item, i) => (
                <div key={i} className="pb-4 border-b border-border last:border-0 last:pb-0">
                  <p className="text-sm font-medium mb-1">{item.q}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <GraduationCap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-sm">RankSaathi</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors font-medium text-foreground">Contact</Link>
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 GlobalWebSaaS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}