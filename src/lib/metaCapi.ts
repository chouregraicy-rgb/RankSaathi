// src/lib/metaCapi.ts
// Server-side Meta Conversions API (CAPI) helper.
// Called from trusted API routes (verify/route.ts, auth routes) so events
// cannot be blocked by ad blockers and carry full user signals for attribution.

const PIXEL_ID   = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const CAPI_TOKEN = process.env.META_CAPI_TOKEN;
const CAPI_URL   = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events`;

import crypto from "crypto";

function hashValue(value: string): string {
  return crypto.createHash("sha256").update(value.toLowerCase().trim()).digest("hex");
}

interface CapiUserData {
  email?:    string;
  phone?:    string;
  clientIp?: string;
  userAgent?: string;
  fbp?:      string; // _fbp cookie value
  fbc?:      string; // _fbc cookie value
}

interface CapiEventOptions {
  eventName:    string;
  eventTime?:   number;  // unix timestamp, defaults to now
  userData:     CapiUserData;
  customData?:  Record<string, any>;
  eventSourceUrl?: string;
  testEventCode?: string; // set this in Meta Events Manager → Test Events tab
}

export async function sendCapiEvent(options: CapiEventOptions): Promise<void> {
  if (!PIXEL_ID || !CAPI_TOKEN) {
    console.warn("[CAPI] Missing PIXEL_ID or CAPI_TOKEN — skipping event:", options.eventName);
    return;
  }

  const { eventName, userData, customData, eventSourceUrl, testEventCode } = options;
  const eventTime = options.eventTime ?? Math.floor(Date.now() / 1000);

  const user_data: Record<string, any> = {};
  if (userData.email)     user_data.em        = [hashValue(userData.email)];
  if (userData.phone)     user_data.ph        = [hashValue(userData.phone)];
  if (userData.clientIp)  user_data.client_ip_address = userData.clientIp;
  if (userData.userAgent) user_data.client_user_agent  = userData.userAgent;
  if (userData.fbp)       user_data.fbp       = userData.fbp;
  if (userData.fbc)       user_data.fbc       = userData.fbc;

  const payload: Record<string, any> = {
    data: [
      {
        event_name:        eventName,
        event_time:        eventTime,
        action_source:     "website",
        event_source_url:  eventSourceUrl ?? "https://vidhyasaathi.online",
        user_data,
        ...(customData ? { custom_data: customData } : {}),
      },
    ],
  };

  if (testEventCode) {
    payload.test_event_code = testEventCode;
  }

  try {
    const res = await fetch(`${CAPI_URL}?access_token=${CAPI_TOKEN}`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("[CAPI] Error sending event:", eventName, err);
    }
  } catch (err) {
    console.error("[CAPI] Network error:", err);
  }
}

// ── Convenience wrappers ─────────────────────────────────────────────────

export async function capiPurchase(opts: {
  email:        string;
  amountINR:    number;
  orderId:      string;
  clientIp?:    string;
  userAgent?:   string;
  fbp?:         string;
  fbc?:         string;
  testEventCode?: string;
}) {
  return sendCapiEvent({
    eventName:  "Purchase",
    userData:   { email: opts.email, clientIp: opts.clientIp, userAgent: opts.userAgent, fbp: opts.fbp, fbc: opts.fbc },
    customData: { value: opts.amountINR, currency: "INR", order_id: opts.orderId, content_name: "VidyaSaathi Lifetime" },
    testEventCode: opts.testEventCode,
  });
}

export async function capiLead(opts: {
  email:       string;
  clientIp?:   string;
  userAgent?:  string;
  fbp?:        string;
  fbc?:        string;
  testEventCode?: string;
}) {
  return sendCapiEvent({
    eventName:  "Lead",
    userData:   { email: opts.email, clientIp: opts.clientIp, userAgent: opts.userAgent, fbp: opts.fbp, fbc: opts.fbc },
    customData: { content_name: "VidyaSaathi Signup" },
    testEventCode: opts.testEventCode,
  });
}
