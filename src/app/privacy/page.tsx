// src/app/privacy/page.tsx
import Link from "next/link";
import { GraduationCap, Shield, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
            <Shield className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-3">Privacy Policy</h1>
          <p className="text-brand-100 text-lg">Your privacy is our priority. Here's how we handle your data.</p>
          <p className="text-brand-200 text-sm mt-2">Last updated: May 14, 2026</p>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">

        <section>
          <h2 className="text-xl font-display font-bold mb-3">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            RankSaathi ("we", "our", or "us") is operated by GlobalWebSaaS and is committed to protecting the privacy of students, parents, and institutions who use our platform. This Privacy Policy explains what information we collect, how we use it, and your rights regarding your data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold mb-3">2. Information We Collect</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <div className="bg-muted/40 rounded-xl p-4 border border-border">
              <p className="font-semibold text-foreground mb-1">Account Information</p>
              <p>When you register, we collect your name, email address, password (encrypted), and role (student or parent).</p>
            </div>
            <div className="bg-muted/40 rounded-xl p-4 border border-border">
              <p className="font-semibold text-foreground mb-1">Student Academic Data</p>
              <p>Test scores, practice question attempts, chapter revision history, study streaks, and rank estimates.</p>
            </div>
            <div className="bg-muted/40 rounded-xl p-4 border border-border">
              <p className="font-semibold text-foreground mb-1">Location Data (Optional)</p>
              <p>If a student enables location sharing, we collect GPS coordinates, location labels, accuracy, and timestamps. This data is only shared with the student's linked parent. Location sharing is entirely voluntary and can be stopped at any time.</p>
            </div>
            <div className="bg-muted/40 rounded-xl p-4 border border-border">
              <p className="font-semibold text-foreground mb-1">Device & Usage Data</p>
              <p>Browser type, device information, pages visited, and interaction logs to improve platform performance.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold mb-3">3. How We Use Your Information</h2>
          <ul className="space-y-2 text-muted-foreground">
            {[
              "To provide and improve the RankSaathi platform and its features",
              "To generate AI-powered study recommendations and doubt solutions",
              "To enable parents to monitor their child's academic progress and location",
              "To send important notifications about test results, alerts, and platform updates",
              "To analyze usage patterns and improve the learning experience",
              "To process subscription payments and manage account access",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-brand-500/15 text-brand-600 text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">{i + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold mb-3">4. Data Sharing & Third Parties</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            We do not sell, trade, or rent your personal information to third parties. We may share data only in the following circumstances:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            {[
              "With your linked parent account (location, scores, mood data — as enabled by the student)",
              "With Supabase (our database provider) under strict data processing agreements",
              "With payment processors for subscription billing",
              "When required by law or to protect the rights and safety of our users",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-brand-500 mt-1.5 flex-shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold mb-3">5. Location Data & Minor Protection</h2>
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
            <p className="text-muted-foreground leading-relaxed">
              RankSaathi takes the safety of minors very seriously. Location data is:
            </p>
            <ul className="mt-3 space-y-1.5 text-muted-foreground text-sm">
              <li>• Only collected when explicitly enabled by the student</li>
              <li>• Only accessible to the student's verified linked parent</li>
              <li>• Never shared with any third party or used for advertising</li>
              <li>• Automatically cleared after 30 days of inactivity</li>
              <li>• Encrypted in transit and at rest</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold mb-3">6. Data Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            We implement industry-standard security measures including SSL/TLS encryption, Row-Level Security (RLS) on our database, and secure authentication via Supabase. Passwords are never stored in plain text. However, no system is 100% secure — we encourage users to use strong passwords and keep their login credentials private.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold mb-3">7. Your Rights</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">You have the right to:</p>
          <ul className="space-y-2 text-muted-foreground">
            {[
              "Access and download your personal data at any time",
              "Correct inaccurate or incomplete information",
              "Delete your account and all associated data",
              "Withdraw consent for location sharing at any time",
              "Opt out of non-essential communications",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-brand-500 mt-1.5 flex-shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground mt-3">
            To exercise any of these rights, contact us at{" "}
            <a href="mailto:contact@globalwebsaas.org" className="text-brand-600 hover:underline font-medium">
              contact@globalwebsaas.org
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold mb-3">8. Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">
            RankSaathi uses essential cookies for authentication and session management. We do not use advertising or tracking cookies. You can disable cookies in your browser settings, but this may affect platform functionality.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold mb-3">9. Changes to This Policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Privacy Policy from time to time. When we do, we will notify registered users via email and update the "Last updated" date at the top of this page. Continued use of RankSaathi after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold mb-3">10. Contact Us</h2>
          <div className="bg-muted/40 rounded-xl p-5 border border-border">
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions, concerns, or requests regarding this Privacy Policy or your data, please contact us:
            </p>
            <div className="mt-3 space-y-1 text-sm">
              <p><span className="font-medium">Email:</span>{" "}
                <a href="mailto:contact@globalwebsaas.org" className="text-brand-600 hover:underline">contact@globalwebsaas.org</a>
              </p>
              <p><span className="font-medium">Company:</span> GlobalWebSaaS</p>
              <p><span className="font-medium">Platform:</span> RankSaathi — NEET & JEE Preparation</p>
            </div>
          </div>
        </section>

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
            <Link href="/privacy" className="hover:text-foreground transition-colors font-medium text-foreground">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 GlobalWebSaaS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
