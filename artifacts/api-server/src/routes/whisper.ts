import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { whispersTable } from "@workspace/db/schema";

const router: IRouter = Router();

router.post("/whisper", async (req, res) => {
  try {
    const { hint } = req.body ?? {};
    if (!hint || typeof hint !== "string") {
      res.status(400).json({ error: "Invalid" });
      return;
    }

    await db.insert(whispersTable).values({
      hint: hint.trim().slice(0, 500),
    });

    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "whisper route failed");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
