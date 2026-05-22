/**
 * razorpayCheckout.ts
 * Call initiateRazorpayCheckout() from your pricing page.
 *
 * Flow:
 *   1. POST /api/payment/create-order  → get orderId
 *   2. Open Razorpay modal
 *   3. On success → POST /api/payment/verify → subscription saved in DB
 *   4. onSuccess(planLabel, expiresAt) called → you can refetch badge
 */

export type Plan = "student_monthly" | "student_yearly" | "family_monthly" | "family_yearly";

export interface CheckoutOptions {
  plan:      Plan;
  userId:    string;
  userEmail: string;
  userName:  string;
  coupon?:   string;
  onSuccess?: (planLabel: string, expiresAt: string) => void;
  onFailure?: (reason: string) => void;
}

const PLAN_LABELS: Record<Plan, string> = {
  student_monthly: "Student Monthly",
  student_yearly:  "Student Yearly",
  family_monthly:  "Family Monthly",
  family_yearly:   "Family Yearly",
};

declare global { interface Window { Razorpay: any; } }

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export async function initiateRazorpayCheckout(opts: CheckoutOptions) {
  const { plan, userId, userEmail, userName, coupon, onSuccess, onFailure } = opts;

  if (!(await loadRazorpay())) {
    return onFailure?.("Could not load payment gateway. Please refresh and try again.");
  }

  // Step 1: Create order
  let orderId: string;
  let amount: number;
  let free = false;

  try {
    const res  = await fetch("/api/payment/create-order", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ plan, userId, coupon }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Order creation failed");
    orderId = data.orderId;
    amount  = data.amount;
    free    = data.free;
  } catch (err: any) {
    return onFailure?.(err.message);
  }

  // Step 2: 100% coupon — skip modal, call verify directly with synthetic IDs
  if (free) {
    try {
      const res = await fetch("/api/payment/verify", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          razorpay_order_id:   orderId,
          razorpay_payment_id: "free_payment",
          razorpay_signature:  "free_signature",
          plan, userId, coupon,
          isFree: true,        // verify route checks this to skip HMAC for free orders
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Activation failed");
      return onSuccess?.(data.planLabel, data.expiresAt);
    } catch (err: any) {
      return onFailure?.(err.message);
    }
  }

  // Step 3: Paid — open Razorpay modal
  const rzp = new window.Razorpay({
    key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount,
    currency:    "INR",
    name:        "VidyaSaathi",
    description: PLAN_LABELS[plan],
    order_id:    orderId,
    prefill:     { name: userName, email: userEmail },
    theme:       { color: "#6366f1" },

    handler: async (resp: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) => {
      try {
        const res = await fetch("/api/payment/verify", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({
            razorpay_order_id:   resp.razorpay_order_id,
            razorpay_payment_id: resp.razorpay_payment_id,
            razorpay_signature:  resp.razorpay_signature,
            plan, userId, coupon,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Verification failed");
        onSuccess?.(data.planLabel, data.expiresAt);
      } catch (err: any) {
        onFailure?.(err.message);
      }
    },

    modal: { ondismiss: () => {} },
  });

  rzp.on("payment.failed", (r: any) =>
    onFailure?.(r.error?.description || "Payment failed")
  );
  rzp.open();
}
