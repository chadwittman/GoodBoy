import { promises as fs } from 'fs'
import path from 'path'

const WHISPER_PATH = path.join(process.cwd(), 'whispers.json')

export async function POST(req: Request) {
  const { hint } = await req.json()
  if (!hint || typeof hint !== 'string') {
    return Response.json({ error: 'Invalid' }, { status: 400 })
  }

  const entry = {
    hint: hint.trim().slice(0, 500),
    timestamp: new Date().toISOString(),
  }

  let existing: typeof entry[] = []
  try {
    const raw = await fs.readFile(WHISPER_PATH, 'utf-8')
    existing = JSON.parse(raw)
  } catch { /* first entry */ }

  existing.push(entry)
  await fs.writeFile(WHISPER_PATH, JSON.stringify(existing, null, 2))

  return Response.json({ ok: true })
}
