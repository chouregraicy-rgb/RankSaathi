"use client";

import { useState } from "react";
import { Mail, MapPin, Clock, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    // Simple mailto fallback — replace with your email API if needed
    const mailtoLink = `mailto:contact@globalwebsaas.org?subject=${encodeURIComponent(form.subject || "VidyaSaathi Enquiry")}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
    window.location.href = mailtoLink;
    setStatus("sent");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-white mb-3">Contact Us</h1>
          <p className="text-gray-400 text-lg">Have a question or need help? We're here for you.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">Get in Touch</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Email</p>
                    <a href="mailto:contact@globalwebsaas.org" className="text-white hover:text-blue-400 transition-colors">
                      contact@globalwebsaas.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Location</p>
                    <p className="text-white">India</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Response Time</p>
                    <p className="text-white">Within 24–48 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Support</p>
                    <p className="text-white">Technical, billing & general queries</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Common Questions</h2>
              <div className="space-y-4 text-sm">
                {[
                  { q: "How do I cancel my subscription?", a: "Go to Settings → Subscription → Cancel Plan." },
                  { q: "Can I switch from Student to Family plan?", a: "Yes, email us and we'll handle the upgrade/downgrade." },
                  { q: "Is there a free trial?", a: "Yes! All new signups get a 7-day free trial." },
                  { q: "How does parent linking work?", a: "Students share an invite code with parents from their settings." },
                ].map((faq) => (
                  <div key={faq.q} className="bg-gray-900 rounded-lg p-4">
                    <p className="text-white font-medium mb-1">{faq.q}</p>
                    <p className="text-gray-400">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-900 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-white mb-6">Send a Message</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Message *</label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Describe your issue or question..."
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={status === "sending"}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {status === "sending" ? "Opening mail..." : status === "sent" ? "Message sent! ✓" : "Send Message"}
              </button>
              <p className="text-xs text-gray-500 text-center">
                Or email us directly at contact@globalwebsaas.org
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex gap-6 text-sm text-gray-500">
          <a href="/privacy" className="hover:text-gray-300">Privacy Policy</a>
          <a href="/terms" className="hover:text-gray-300">Terms of Service</a>
          <a href="/" className="hover:text-gray-300">Back to Home</a>
        </div>
      </div>
    </div>
  );
}