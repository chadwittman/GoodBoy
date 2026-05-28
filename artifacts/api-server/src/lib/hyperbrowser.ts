import Hyperbrowser from "@hyperbrowser/sdk";
import type { Person, Preferences, Occasion } from "@workspace/db";

export interface GiftItem {
  type: "product" | "restaurant" | "experience";
  title: string;
  description: string;
  priceEstimate: number;
  url?: string;
  notes?: string;
}

export interface GiftPlan {
  occasionTitle: string;
  daysUntil: number;
  budgetCents: number;
  items: GiftItem[];
  totalEstimateCents: number;
  agentNotes?: string;
}

let cachedClient: Hyperbrowser | null = null;
function getClient(): Hyperbrowser {
  if (!cachedClient) {
    const apiKey = process.env["HYPERBROWSER_API_KEY"];
    if (!apiKey) throw new Error("HYPERBROWSER_API_KEY not set");
    cachedClient = new Hyperbrowser({ apiKey });
  }
  return cachedClient;
}

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export async function runResearchAgent(
  person: Person,
  prefs: Preferences,
  occasion: Occasion,
): Promise<GiftPlan> {
  const client = getClient();
  const budget = prefs.budgetCents / 100;
  const days = daysUntil(occasion.occasionDate);

  const task = buildAgentTask({ person, prefs, occasion, budget, days });

  const session = await client.sessions.create();
  try {
    const result = await client.agents.browserUse.startAndWait({
      task,
      sessionId: session.id,
      maxSteps: 20,
    });

    const plan = parseAgentResult(result.data?.finalResult ?? "", {
      person,
      prefs,
      occasion,
      budget,
      days,
    });
    return plan;
  } finally {
    await client.sessions.stop(session.id).catch(() => {});
  }
}

function buildAgentTask({
  person,
  prefs,
  occasion,
  budget,
  days,
}: {
  person: Person;
  prefs: Preferences;
  occasion: Occasion;
  budget: number;
  days: number;
}): string {
  const parts: string[] = [
    `You are GoodBoy, an AI gifting agent. Research real, specific gift options for the following person and occasion.`,
    ``,
    `PERSON: ${person.name} (${person.relationship})`,
    `LOCATION: ${person.location}`,
    `OCCASION: ${occasion.title} in ${days} days (${occasion.occasionDate})`,
    `TOTAL BUDGET: $${budget.toFixed(2)}`,
    ``,
    `HER PREFERENCES:`,
  ];

  if (prefs.jewelryStyle) parts.push(`- Jewelry/gifts: ${prefs.jewelryStyle}`);
  if (prefs.foodPrefs) parts.push(`- Food: ${prefs.foodPrefs}`);
  if (prefs.favoriteRestaurants) parts.push(`- Favorite restaurants: ${prefs.favoriteRestaurants}`);
  if (prefs.flowerPrefs) parts.push(`- Flowers: ${prefs.flowerPrefs}`);
  if (prefs.clothingStyle) parts.push(`- Style: ${prefs.clothingStyle}`);
  if (prefs.otherLikes) parts.push(`- Also likes: ${prefs.otherLikes}`);
  if (prefs.dislikes) parts.push(`- DISLIKES (avoid): ${prefs.dislikes}`);

  parts.push(
    ``,
    `TASK: Browse the web to find a specific, complete gift plan. You must:`,
    `1. Search for 1-2 specific gift products matching her style. Get real product names, current prices, and direct URLs from the retailer's website.`,
    `2. Find a restaurant reservation option in ${person.location}. Check if a restaurant she likes (or similar) has availability around the occasion date. Get a real reservation link or phone number.`,
    `3. Find a flower delivery option that matches her preferences and can deliver to ${person.location} by ${occasion.occasionDate}.`,
    `4. Make sure the total stays under $${budget.toFixed(2)}.`,
    ``,
    `Return your findings as a JSON object in this exact format:`,
    `{`,
    `  "items": [`,
    `    { "type": "product", "title": "...", "description": "...", "priceEstimate": 128, "url": "https://...", "notes": "ships in X days" },`,
    `    { "type": "restaurant", "title": "...", "description": "...", "priceEstimate": 130, "url": "https://...", "notes": "call to reserve or use Resy" },`,
    `    { "type": "product", "title": "...", "description": "...", "priceEstimate": 45, "url": "https://...", "notes": "delivery by occasion date" }`,
    `  ],`,
    `  "agentNotes": "Brief note on what you found and any caveats"`,
    `}`,
    ``,
    `Be specific — real product names, real prices from real websites, real URLs. Do not invent information.`,
  );

  return parts.join("\n");
}

function parseAgentResult(
  raw: string,
  context: {
    person: Person;
    prefs: Preferences;
    occasion: Occasion;
    budget: number;
    days: number;
  },
): GiftPlan {
  const jsonMatch = raw.match(/\{[\s\S]*"items"[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]) as {
        items: GiftItem[];
        agentNotes?: string;
      };
      const total = parsed.items.reduce((sum, i) => sum + (i.priceEstimate ?? 0), 0);
      return {
        occasionTitle: context.occasion.title,
        daysUntil: context.days,
        budgetCents: context.prefs.budgetCents,
        items: parsed.items,
        totalEstimateCents: Math.round(total * 100),
        agentNotes: parsed.agentNotes,
      };
    } catch {
      // fall through to fallback
    }
  }

  return {
    occasionTitle: context.occasion.title,
    daysUntil: context.days,
    budgetCents: context.prefs.budgetCents,
    items: [],
    totalEstimateCents: 0,
    agentNotes: `Agent output: ${raw.slice(0, 500)}`,
  };
}
