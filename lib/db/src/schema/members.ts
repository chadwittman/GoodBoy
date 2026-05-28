import { pgTable, text, integer, timestamp, serial, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const membersTable = pgTable("members", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  tier: text("tier").notNull(),
  whisperCode: text("whisper_code"),
  stripeSessionId: text("stripe_session_id"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  amountPaid: integer("amount_paid"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  unique("members_stripe_session_id_unique").on(t.stripeSessionId),
]);

export const insertMemberSchema = createInsertSchema(membersTable).omit({ id: true, createdAt: true });
export type InsertMember = z.infer<typeof insertMemberSchema>;
export type Member = typeof membersTable.$inferSelect;
