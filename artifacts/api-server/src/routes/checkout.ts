import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { membersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { getStripeClient } from "../lib/stripe.js";

const router: IRouter = Router();

const TIER_PRICES: Record<string, number> = {
  goodboy: 999,
  whisper: 1498,
};

const TIER_LABELS: Record<string, string> = {
  goodboy: "GoodBoy founding member ($9.99)",
  whisper: "GoodBoy + Whisper founding member ($14.98)",
};

function getAppBaseUrl(): string {
  if (process.env.APP_BASE_URL) return process.env.APP_BASE_URL.replace(/\/$/, "");
  const domain = process.env.REPLIT_DEV_DOMAIN;
  if (domain) return `https://${domain}`;
  return "http://localhost:3000";
}

router.post("/checkout", async (req, res) => {
  try {
    const { email, tier } = req.body ?? {};

    if (!email || typeof email !== "string" || !email.includes("@")) {
      res.status(400).json({ error: "Invalid email" });
      return;
    }

    const normalizedTier = typeof tier === "string" && TIER_PRICES[tier] ? tier : "goodboy";
    const amountCents = TIER_PRICES[normalizedTier];
    const label = TIER_LABELS[normalizedTier];

    const stripe = getStripeClient();
    const base = getAppBaseUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email.trim().toLowerCase(),
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: amountCents,
            product_data: { name: label },
          },
          quantity: 1,
        },
      ],
      success_url: `${base}/api/checkout/confirm?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/?checkout=cancelled`,
      metadata: { tier: normalizedTier, email: email.trim().toLowerCase() },
    });

    res.json({ url: session.url });
  } catch (err) {
    req.log.error({ err }, "checkout route failed");
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/checkout/confirm", async (req, res) => {
  const base = getAppBaseUrl();
  try {
    const { session_id } = req.query;

    if (!session_id || typeof session_id !== "string") {
      res.status(400).json({ error: "Missing session_id" });
      return;
    }

    const existing = await db
      .select()
      .from(membersTable)
      .where(eq(membersTable.stripeSessionId, session_id))
      .limit(1);

    if (existing.length > 0) {
      const member = existing[0];
      const params = new URLSearchParams({
        checkout: "success",
        tier: member.tier,
        code: member.whisperCode ?? "",
      });
      res.redirect(`${base}/?${params.toString()}`);
      return;
    }

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["payment_intent"],
    });

    if (session.payment_status !== "paid") {
      res.redirect(`${base}/?checkout=failed`);
      return;
    }

    const email = (session.metadata?.email ?? session.customer_email ?? "").toLowerCase();
    const tier = session.metadata?.tier ?? "goodboy";
    const amountPaid = session.amount_total ?? 0;
    const stripeSessionId = session.id;
    const stripePaymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;

    const whisperCode = Math.random().toString(36).slice(2, 7);

    await db.insert(membersTable).values({
      email,
      tier,
      whisperCode,
      stripeSessionId,
      stripePaymentIntentId,
      amountPaid,
    });

    const params = new URLSearchParams({
      checkout: "success",
      tier,
      code: whisperCode,
    });
    res.redirect(`${base}/?${params.toString()}`);
  } catch (err) {
    req.log.error({ err }, "checkout confirm failed");
    res.redirect(`${base}/?checkout=failed`);
  }
});

export default router;
