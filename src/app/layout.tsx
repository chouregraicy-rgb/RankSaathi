// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import "@/styles/globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";

export const metadata: Metadata = {
  title: {
    default: "VidyaSaathi — NEET & JEE Preparation",
    template: "%s | VidyaSaathi",
  },
  description:
    "AI-powered study platform for NEET UG, JEE Main & JEE Advanced aspirants. Track progress, solve doubts, analyse performance.",
  keywords: ["NEET preparation", "JEE Main", "JEE Advanced", "study app", "AI tutor"],
  manifest: "/manifest.json",
  icons: {
      icon: "/favicon-32x32.png",
      apple: "/apple-touch-icon.png",
      shortcut: "/favicon-32x32.png",
  },
  openGraph: {
    title: "VidyaSaathi",
    description: "AI-powered NEET & JEE preparation platform",
    type: "website",
    images: [{ url: "/logo/logo.png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1e3a6e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
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
