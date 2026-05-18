"use client";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-gray-400 mb-10">Last updated: May 18, 2026</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using VidyaSaathi at <a href="https://vidhyasaathi.online" className="text-blue-400 hover:underline">vidhyasaathi.online</a>, 
              you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.
              VidyaSaathi is operated by GlobalWebSaaS (<a href="mailto:contact@globalwebsaas.org" className="text-blue-400 hover:underline">contact@globalwebsaas.org</a>).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Description of Service</h2>
            <p>
              VidyaSaathi is an AI-powered educational platform designed to help students prepare for NEET and JEE examinations. 
              Our services include AI doubt solving, practice tests, revision scheduling, performance analytics, 
              and parent-student progress tracking.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. User Accounts</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>You must provide accurate and complete information when creating an account.</li>
              <li>You are responsible for maintaining the security of your account credentials.</li>
              <li>You must notify us immediately of any unauthorized use of your account.</li>
              <li>One person may not maintain multiple accounts without prior permission.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Subscriptions and Payments</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Paid plans (Student ₹99/mo or ₹799/yr, Family ₹149/mo or ₹1199/yr) are billed in advance.</li>
              <li>All payments are processed securely through Razorpay.</li>
              <li>Subscriptions auto-renew unless cancelled before the renewal date.</li>
              <li>Refunds are considered on a case-by-case basis within 7 days of purchase. Contact us at <a href="mailto:contact@globalwebsaas.org" className="text-blue-400 hover:underline">contact@globalwebsaas.org</a>.</li>
              <li>We reserve the right to change pricing with 30 days' notice.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Share your account credentials with others.</li>
              <li>Use the platform to distribute spam, malware, or harmful content.</li>
              <li>Attempt to reverse engineer, scrape, or copy our AI models or content.</li>
              <li>Use automated tools to access the platform without permission.</li>
              <li>Misuse the community features to harass or harm other users.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Intellectual Property</h2>
            <p>
              All content on VidyaSaathi — including question banks, AI responses, UI design, and branding — 
              is owned by GlobalWebSaaS. You may not reproduce, distribute, or create derivative works 
              without explicit written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Parent-Student Features</h2>
            <p>
              The parent dashboard and live location tracking features require explicit consent via invite code linking. 
              By linking accounts, both parties consent to sharing academic progress and location data 
              as described in our Privacy Policy. Either party may unlink at any time from their settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Disclaimer of Warranties</h2>
            <p>
              VidyaSaathi is provided "as is" without warranties of any kind. We do not guarantee specific 
              exam results or rank improvements. AI-generated content may occasionally be inaccurate — 
              always verify with official study materials.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Limitation of Liability</h2>
            <p>
              GlobalWebSaaS shall not be liable for any indirect, incidental, or consequential damages 
              arising from your use of VidyaSaathi. Our total liability shall not exceed the amount 
              paid by you in the last 3 months.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Termination</h2>
            <p>
              We reserve the right to suspend or terminate accounts that violate these terms. 
              You may delete your account at any time from settings. Upon termination, your data 
              will be retained for 30 days before permanent deletion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Governing Law</h2>
            <p>
              These terms are governed by the laws of India. Any disputes shall be subject to 
              the jurisdiction of courts in India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">12. Contact</h2>
            <p>
              For any questions about these Terms, contact us at:<br />
              <a href="mailto:contact@globalwebsaas.org" className="text-blue-400 hover:underline">contact@globalwebsaas.org</a><br />
              GlobalWebSaaS, India
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex gap-6 text-sm text-gray-500">
          <a href="/privacy" className="hover:text-gray-300">Privacy Policy</a>
          <a href="/contact" className="hover:text-gray-300">Contact</a>
          <a href="/" className="hover:text-gray-300">Back to Home</a>
        </div>
      </div>
    </div>
  );
}