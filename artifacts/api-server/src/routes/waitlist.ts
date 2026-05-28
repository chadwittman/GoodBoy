import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { waitlistTable } from "@workspace/db/schema";

const router: IRouter = Router();

router.post("/waitlist", async (req, res) => {
  try {
    const { email, prompt, ...rest } = req.body ?? {};

    if (!email || typeof email !== "string" || !email.includes("@")) {
      res.status(400).json({ error: "Invalid email" });
      return;
    }

    await db.insert(waitlistTable).values({
      email: email.trim().toLowerCase().slice(0, 254),
      prompt: prompt ? String(prompt).slice(0, 500) : null,
      extra: rest && Object.keys(rest).length > 0 ? JSON.stringify(rest) : null,
    });

    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "waitlist route failed");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
