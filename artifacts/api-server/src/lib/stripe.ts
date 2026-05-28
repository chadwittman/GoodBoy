import Stripe from "stripe";

export function getStripeClient(): Stripe {
  const isProduction = process.env.REPLIT_DEPLOYMENT === "1";
  const key = isProduction
    ? process.env.STRIPE_SECRET_KEY_PROD
    : process.env.STRIPE_SECRET_KEY;

  if (!key) {
    throw new Error(
      isProduction
        ? "STRIPE_SECRET_KEY_PROD must be set in production"
        : "STRIPE_SECRET_KEY must be set"
    );
  }

  return new Stripe(key, {
    apiVersion: "2026-04-22.dahlia",
  });
}
