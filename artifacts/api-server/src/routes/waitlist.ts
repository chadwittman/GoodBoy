import { Router, type IRouter } from "express";
import { promises as fs } from "fs";
import path from "path";

const router: IRouter = Router();

const WAITLIST_PATH = path.join(process.cwd(), "waitlist.json");

type Entry = {
  email: string;
  prompt: string;
  timestamp: string;
  extra?: Record<string, unknown>;
};

router.post("/waitlist", async (req, res) => {
  try {
    const { email, prompt, ...rest } = req.body ?? {};

    if (!email || typeof email !== "string" || !email.includes("@")) {
      res.status(400).json({ error: "Invalid email" });
      return;
    }

    const entry: Entry = {
      email: email.trim().toLowerCase().slice(0, 254),
      prompt: prompt ? String(prompt).slice(0, 500) : "",
      timestamp: new Date().toISOString(),
      extra: rest && Object.keys(rest).length > 0 ? rest : undefined,
    };

    let existing: Entry[] = [];
    try {
      const raw = await fs.readFile(WAITLIST_PATH, "utf-8");
      existing = JSON.parse(raw);
    } catch {
      // file doesn't exist yet
    }

    existing.push(entry);
    await fs.writeFile(WAITLIST_PATH, JSON.stringify(existing, null, 2));

    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "waitlist route failed");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
