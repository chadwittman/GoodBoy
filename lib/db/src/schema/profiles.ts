import { pgTable, text, timestamp, serial, integer, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// The person being gifted (Emma, Mom, etc.)
export const personsTable = pgTable("persons", {
  id: serial("id").primaryKey(),
  ownerEmail: text("owner_email").notNull(),
  name: text("name").notNull(),
  relationship: text("relationship").notNull(),
  location: text("location").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Preferences for a person
export const preferencesTable = pgTable("preferences", {
  id: serial("id").primaryKey(),
  personId: integer("person_id").notNull().references(() => personsTable.id, { onDelete: "cascade" }),
  jewelryStyle: text("jewelry_style"),
  foodPrefs: text("food_prefs"),
  favoriteRestaurants: text("favorite_restaurants"),
  flowerPrefs: text("flower_prefs"),
  clothingStyle: text("clothing_style"),
  otherLikes: text("other_likes"),
  dislikes: text("dislikes"),
  budgetCents: integer("budget_cents").notNull().default(30000),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Key dates for a person
export const occasionsTable = pgTable("occasions", {
  id: serial("id").primaryKey(),
  personId: integer("person_id").notNull().references(() => personsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  occasionDate: date("occasion_date").notNull(),
  recurrence: text("recurrence").notNull().default("yearly"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Research results from Hyperbrowser agent
export const researchTable = pgTable("research", {
  id: serial("id").primaryKey(),
  personId: integer("person_id").notNull().references(() => personsTable.id, { onDelete: "cascade" }),
  occasionId: integer("occasion_id").references(() => occasionsTable.id),
  status: text("status").notNull().default("pending"),
  resultsJson: text("results_json"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const insertPersonSchema = createInsertSchema(personsTable).omit({ id: true, createdAt: true });
export const insertPreferencesSchema = createInsertSchema(preferencesTable).omit({ id: true, updatedAt: true });
export const insertOccasionSchema = createInsertSchema(occasionsTable).omit({ id: true, createdAt: true });

export type Person = typeof personsTable.$inferSelect;
export type Preferences = typeof preferencesTable.$inferSelect;
export type Occasion = typeof occasionsTable.$inferSelect;
export type Research = typeof researchTable.$inferSelect;
export type InsertPerson = z.infer<typeof insertPersonSchema>;
