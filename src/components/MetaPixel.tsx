"use client";
// src/components/MetaPixel.tsx
// Loads the Meta Pixel base code on every page and exposes helper functions
// for firing standard events (PageView, Lead, Purchase).
// Only fires if NEXT_PUBLIC_META_PIXEL_ID is set in env.

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    _fbq: any;
  }
}

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

// ── Client-side event helpers (call these from any component) ────────────
export function pixelPageView() {
  if (typeof window !== "undefined" && window.fbq && PIXEL_ID) {
    window.fbq("track", "PageView");
  }
}

export function pixelLead(email?: string) {
  if (typeof window !== "undefined" && window.fbq && PIXEL_ID) {
    window.fbq("track", "Lead", email ? { em: email } : {});
  }
}

export function pixelPurchase(valueINR: number, currency = "INR") {
  if (typeof window !== "undefined" && window.fbq && PIXEL_ID) {
    window.fbq("track", "Purchase", { value: valueINR, currency });
  }
}

export function pixelInitiateCheckout() {
  if (typeof window !== "undefined" && window.fbq && PIXEL_ID) {
    window.fbq("track", "InitiateCheckout", { value: 499, currency: "INR" });
  }
}

// ── Component ─────────────────────────────────────────────────────────────
export default function MetaPixel() {
  const pathname    = usePathname();
  const searchParams = useSearchParams();

  // Fire PageView on every route change (SPA navigation)
  useEffect(() => {
    pixelPageView();
  }, [pathname, searchParams]);

  if (!PIXEL_ID) return null;

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
