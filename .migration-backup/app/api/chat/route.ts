import OpenAI from 'openai'
import { GOODBOY_SYSTEM_PROMPT } from '@/lib/goodboy-prompt'

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return new Response('Bad request', { status: 400 })
  }

  const safeMessages: { role: 'user' | 'assistant'; content: string }[] = messages.map(
    (m: { role: string; content: string }) => ({
      role: (m.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
      content: String(m.content).slice(0, 1000),
    })
  )

  const stream = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 400,
    stream: true,
    messages: [
      { role: 'system', content: GOODBOY_SYSTEM_PROMPT },
      ...safeMessages,
    ],
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? ''
        if (text) controller.enqueue(encoder.encode(text))
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
