// src/app/layout.tsx
import type { Metadata } from "next";
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
  themeColor: "#2b7fff",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
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
