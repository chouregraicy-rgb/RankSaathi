"use client";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-gray-400 mb-10">Last updated: May 18, 2026</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
            <p>
              Welcome to VidyaSaathi, operated by GlobalWebSaaS (<a href="mailto:contact@globalwebsaas.org" className="text-blue-400 hover:underline">contact@globalwebsaas.org</a>). 
              This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform at{" "}
              <a href="https://vidhyasaathi.online" className="text-blue-400 hover:underline">vidhyasaathi.online</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Account Information:</strong> Name, email address, and role (student/parent) when you register.</li>
              <li><strong>Usage Data:</strong> Test scores, doubt queries, revision activity, and learning analytics.</li>
              <li><strong>Location Data:</strong> If you use the live location feature, we collect and share your location with linked parent accounts only.</li>
              <li><strong>Payment Information:</strong> Processed securely through Razorpay. We do not store card details.</li>
              <li><strong>Device Information:</strong> Browser type, IP address, and device identifiers for security purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>To provide and improve our AI-powered NEET/JEE preparation services.</li>
              <li>To personalize your learning experience and analytics.</li>
              <li>To process payments and manage subscriptions.</li>
              <li>To allow parents to monitor their linked student's progress and location.</li>
              <li>To send important updates about your account or platform changes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Data Sharing</h2>
            <p>
              We do not sell or rent your personal data to third parties. We may share data with:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li><strong>Supabase:</strong> Our database and authentication provider.</li>
              <li><strong>Razorpay:</strong> For payment processing.</li>
              <li><strong>OpenRouter:</strong> For AI doubt-solving features (queries only, no personal data).</li>
              <li><strong>Linked parent accounts:</strong> Location and academic progress as per your consent during linking.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Data Security</h2>
            <p>
              We use industry-standard security including encrypted connections (HTTPS), row-level security on our database, 
              and secure authentication via Supabase. However, no system is 100% secure and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Children's Privacy</h2>
            <p>
              VidyaSaathi is designed for students aged 15 and above preparing for NEET/JEE. 
              Users under 18 should use the platform with parental awareness. 
              Parents can link their accounts to monitor their child's activity.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Your Rights</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Access and download your personal data.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Delete your account and associated data.</li>
              <li>Unlink parent-student connections at any time.</li>
            </ul>
            <p className="mt-2">To exercise these rights, email us at <a href="mailto:contact@globalwebsaas.org" className="text-blue-400 hover:underline">contact@globalwebsaas.org</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Cookies</h2>
            <p>
              We use essential cookies for authentication and session management. 
              We do not use advertising or tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant changes via email 
              or a notice on the platform. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Contact Us</h2>
            <p>
              For any privacy-related questions or requests, contact us at:<br />
              <a href="mailto:contact@globalwebsaas.org" className="text-blue-400 hover:underline">contact@globalwebsaas.org</a><br />
              GlobalWebSaaS, India
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex gap-6 text-sm text-gray-500">
          <a href="/terms" className="hover:text-gray-300">Terms of Service</a>
          <a href="/contact" className="hover:text-gray-300">Contact</a>
          <a href="/" className="hover:text-gray-300">Back to Home</a>
        </div>
      </div>
    </div>
  );
}