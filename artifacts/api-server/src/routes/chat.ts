import { Router, type IRouter } from "express";
import OpenAI from "openai";
import { GOODBOY_SYSTEM_PROMPT } from "../lib/goodboy-prompt";

const router: IRouter = Router();

let cachedClient: OpenAI | null = null;
function getClient(): OpenAI {
  if (!cachedClient) {
    cachedClient = new OpenAI({ apiKey: process.env["OPENAI_API_KEY"] });
  }
  return cachedClient;
}

router.post("/chat", async (req, res) => {
  try {
    if (!process.env["OPENAI_API_KEY"]) {
      res.status(503).send("OPENAI_API_KEY not configured");
      return;
    }
    const { messages } = req.body ?? {};

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).send("Bad request");
      return;
    }

    const safeMessages = messages.map(
      (m: { role: string; content: string }) => ({
        role: (m.role === "assistant" ? "assistant" : "user") as
          | "user"
          | "assistant",
        content: String(m.content).slice(0, 1000),
      }),
    );

    const stream = await getClient().chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 400,
      stream: true,
      messages: [
        { role: "system", content: GOODBOY_SYSTEM_PROMPT },
        ...safeMessages,
      ],
    });

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content ?? "";
      if (text) res.write(text);
    }
    res.end();
  } catch (err) {
    req.log.error({ err }, "chat route failed");
    if (!res.headersSent) res.status(500).send("Server error");
    else res.end();
  }
});

export default router;
