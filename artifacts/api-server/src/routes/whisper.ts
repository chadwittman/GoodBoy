import { Router, type IRouter } from "express";
import { promises as fs } from "fs";
import path from "path";

const router: IRouter = Router();

const WHISPER_PATH = path.join(process.cwd(), "whispers.json");

type Entry = { hint: string; timestamp: string };

router.post("/whisper", async (req, res) => {
  try {
    const { hint } = req.body ?? {};
    if (!hint || typeof hint !== "string") {
      res.status(400).json({ error: "Invalid" });
      return;
    }

    const entry: Entry = {
      hint: hint.trim().slice(0, 500),
      timestamp: new Date().toISOString(),
    };

    let existing: Entry[] = [];
    try {
      const raw = await fs.readFile(WHISPER_PATH, "utf-8");
      existing = JSON.parse(raw);
    } catch {
      // first entry
    }

    existing.push(entry);
    await fs.writeFile(WHISPER_PATH, JSON.stringify(existing, null, 2));

    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "whisper route failed");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
