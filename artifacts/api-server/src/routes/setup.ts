import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  personsTable,
  preferencesTable,
  occasionsTable,
  researchTable,
} from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { runResearchAgent } from "../lib/hyperbrowser.js";

const router: IRouter = Router();

// POST /api/setup — create person + preferences + occasions
router.post("/setup", async (req, res) => {
  try {
    const {
      ownerEmail, name, relationship, location,
      jewelryStyle, foodPrefs, favoriteRestaurants, flowerPrefs,
      clothingStyle, otherLikes, dislikes, budgetCents,
      occasions,
    } = req.body ?? {};

    if (!ownerEmail || !name || !relationship || !location) {
      res.status(400).json({ error: "ownerEmail, name, relationship, location are required" });
      return;
    }

    const [person] = await db
      .insert(personsTable)
      .values({ ownerEmail, name, relationship, location })
      .returning();

    await db.insert(preferencesTable).values({
      personId: person.id,
      jewelryStyle: jewelryStyle ?? null,
      foodPrefs: foodPrefs ?? null,
      favoriteRestaurants: favoriteRestaurants ?? null,
      flowerPrefs: flowerPrefs ?? null,
      clothingStyle: clothingStyle ?? null,
      otherLikes: otherLikes ?? null,
      dislikes: dislikes ?? null,
      budgetCents: budgetCents ?? 30000,
    });

    const insertedOccasions = [];
    if (Array.isArray(occasions) && occasions.length > 0) {
      for (const occ of occasions) {
        if (!occ.title || !occ.occasionDate) continue;
        const [inserted] = await db
          .insert(occasionsTable)
          .values({
            personId: person.id,
            title: occ.title,
            occasionDate: occ.occasionDate,
            recurrence: occ.recurrence ?? "yearly",
            notes: occ.notes ?? null,
          })
          .returning();
        insertedOccasions.push(inserted);
      }
    }

    res.json({ personId: person.id, occasionIds: insertedOccasions.map((o) => o.id) });
  } catch (err) {
    req.log.error({ err }, "setup route failed");
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/setup/:personId — get full profile
router.get("/setup/:personId", async (req, res) => {
  try {
    const personId = parseInt(req.params.personId, 10);
    if (isNaN(personId)) { res.status(400).json({ error: "Invalid personId" }); return; }

    const [person] = await db.select().from(personsTable).where(eq(personsTable.id, personId)).limit(1);
    if (!person) { res.status(404).json({ error: "Person not found" }); return; }

    const [prefs] = await db.select().from(preferencesTable).where(eq(preferencesTable.personId, personId)).limit(1);
    const occasions = await db.select().from(occasionsTable).where(eq(occasionsTable.personId, personId));
    const research = await db.select().from(researchTable).where(eq(researchTable.personId, personId));

    res.json({ person, prefs, occasions, research });
  } catch (err) {
    req.log.error({ err }, "get setup failed");
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/research/:personId — trigger Hyperbrowser agent
router.post("/research/:personId", async (req, res) => {
  try {
    const personId = parseInt(req.params.personId, 10);
    if (isNaN(personId)) { res.status(400).json({ error: "Invalid personId" }); return; }

    const { occasionId } = req.body ?? {};

    const [person] = await db.select().from(personsTable).where(eq(personsTable.id, personId)).limit(1);
    if (!person) { res.status(404).json({ error: "Person not found" }); return; }

    const [prefs] = await db.select().from(preferencesTable).where(eq(preferencesTable.personId, personId)).limit(1);
    if (!prefs) { res.status(400).json({ error: "No preferences set" }); return; }

    let occasion;
    if (occasionId) {
      const [occ] = await db.select().from(occasionsTable).where(eq(occasionsTable.id, Number(occasionId))).limit(1);
      occasion = occ;
    } else {
      const all = await db.select().from(occasionsTable).where(eq(occasionsTable.personId, personId));
      occasion = all.sort(
        (a: { occasionDate: string }, b: { occasionDate: string }) =>
          new Date(a.occasionDate).getTime() - new Date(b.occasionDate).getTime()
      )[0];
    }

    if (!occasion) { res.status(400).json({ error: "No occasion found" }); return; }

    const [research] = await db
      .insert(researchTable)
      .values({ personId, occasionId: occasion.id, status: "running" })
      .returning();

    res.json({ researchId: research.id, status: "running" });

    // Fire-and-forget: run agent in background
    runResearchAgent(person, prefs, occasion)
      .then(async (plan) => {
        await db.update(researchTable).set({
          status: "done",
          resultsJson: JSON.stringify(plan),
          completedAt: new Date(),
        }).where(eq(researchTable.id, research.id));
      })
      .catch(async (err) => {
        const msg = err instanceof Error ? err.message : String(err);
        await db.update(researchTable).set({ status: "error", errorMessage: msg }).where(eq(researchTable.id, research.id));
      });
  } catch (err) {
    req.log.error({ err }, "research route failed");
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/research/:researchId/status — poll for completion
router.get("/research/:researchId/status", async (req, res) => {
  try {
    const researchId = parseInt(req.params.researchId, 10);
    if (isNaN(researchId)) { res.status(400).json({ error: "Invalid researchId" }); return; }

    const [row] = await db.select().from(researchTable).where(eq(researchTable.id, researchId)).limit(1);
    if (!row) { res.status(404).json({ error: "Research not found" }); return; }

    res.json({
      status: row.status,
      plan: row.resultsJson ? JSON.parse(row.resultsJson) : null,
      error: row.errorMessage ?? null,
    });
  } catch (err) {
    req.log.error({ err }, "research status failed");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
