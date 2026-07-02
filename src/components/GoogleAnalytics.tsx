"use client";
// src/components/GoogleAnalytics.tsx
// GA4 integration for Next.js 15 (App Router).
// Tracks: PageView on every route change, sign_up on auth, purchase on payment.
// Fires only if NEXT_PUBLIC_GA_MEASUREMENT_ID is set.

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// ── Client-side event helpers ────────────────────────────────────────────
export function gaPageView(url: string) {
  if (typeof window !== "undefined" && window.gtag && GA_ID) {
    window.gtag("config", GA_ID, { page_path: url });
  }
}

export function gaSignUp(method = "email") {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "sign_up", { method });
  }
}

export function gaPurchase(transactionId: string, valueINR: number) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "purchase", {
      transaction_id: transactionId,
      value:          valueINR,
      currency:       "INR",
      items: [{
        item_id:   "lifetime_access",
        item_name: "VidyaSaathi Lifetime Access",
        price:     valueINR,
        quantity:  1,
      }],
    });
  }
}

export function gaInitiateCheckout() {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "begin_checkout", {
      currency: "INR",
      value:    499,
      items: [{
        item_id:   "lifetime_access",
        item_name: "VidyaSaathi Lifetime Access",
        price:     499,
        quantity:  1,
      }],
    });
  }
}

// ── Component ─────────────────────────────────────────────────────────────
export default function GoogleAnalytics() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_ID) return;
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    gaPageView(url);
  }, [pathname, searchParams]);

  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
              send_page_view: true,
            });
          `,
        }}
      />
    </>
  );
}
