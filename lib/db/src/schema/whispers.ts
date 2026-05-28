import { pgTable, text, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const whispersTable = pgTable("whispers", {
  id: serial("id").primaryKey(),
  hint: text("hint").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWhisperSchema = createInsertSchema(whispersTable).omit({ id: true, createdAt: true });
export type InsertWhisper = z.infer<typeof insertWhisperSchema>;
export type Whisper = typeof whispersTable.$inferSelect;
