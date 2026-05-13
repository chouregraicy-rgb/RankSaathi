// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import "@/styles/globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";

export const metadata: Metadata = {
  title: {
    default: "RankSaathi — NEET & JEE Preparation",
    template: "%s | RankSaathi",
  },
  description:
    "AI-powered study platform for NEET UG, JEE Main & JEE Advanced aspirants. Track progress, solve doubts, analyse performance.",
  keywords: ["NEET preparation", "JEE Main", "JEE Advanced", "study app", "AI tutor"],
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    title: "RankSaathi",
    description: "AI-powered NEET & JEE preparation platform",
    type: "website",
  },
};

// ✅ viewport and themeColor must be separate exports in Next.js 15
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#2b7fff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}