import { promises as fs } from 'fs'
import path from 'path'

const WAITLIST_PATH = path.join(process.cwd(), 'waitlist.json')

export async function POST(req: Request) {
  const { email, prompt } = await req.json()

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return Response.json({ error: 'Invalid email' }, { status: 400 })
  }

  const entry = {
    email: email.trim().toLowerCase().slice(0, 254),
    prompt: prompt ? String(prompt).slice(0, 500) : '',
    timestamp: new Date().toISOString(),
  }

  let existing: typeof entry[] = []
  try {
    const raw = await fs.readFile(WAITLIST_PATH, 'utf-8')
    existing = JSON.parse(raw)
  } catch {
    // File doesn't exist yet — start fresh
  }

  existing.push(entry)
  await fs.writeFile(WAITLIST_PATH, JSON.stringify(existing, null, 2))

  return Response.json({ ok: true })
}
