
import { useState, useRef, useEffect } from 'react'
import CommitmentCTA from './CommitmentCTA'

type Message = {
  role: 'agent' | 'user'
  content: string
  timestamp?: string
  receipt?: string
}

const FAUX_ORDER_SEQUENCE: { delay: number; typingBefore: number; content: string }[] = [
  { typingBefore: 700, delay: 0, content: 'On it. Spinning up now…' },
  { typingBefore: 900, delay: 0, content: 'Mejuri — placing the Croissant Hoops order…' },
  { typingBefore: 1100, delay: 0, content: 'Ordered. Confirmation #MJ-48201, ships 2-day. 📦' },
  { typingBefore: 900, delay: 0, content: 'Lilia — calling the reservation line…' },
  { typingBefore: 1300, delay: 0, content: 'Table for 2 confirmed, Sat 7:30pm. Conf #LIL-7732. 🍝' },
  { typingBefore: 800, delay: 0, content: 'The Bouqs — scheduling the garden roses…' },
  { typingBefore: 1100, delay: 0, content: 'Set for delivery morning of the 7th. Order #BQ-2049. 🌹' },
  {
    typingBefore: 1200,
    delay: 0,
    content: `All set. 🐕

• Mejuri hoops — $128, ships 2-day
• Lilia — Sat 7:30pm, ~$127
• The Bouqs — morning of the 7th, $45

$300 committed. I'll ping you when things ship.`,
  },
]

const INITIAL_MESSAGE: Message = {
  role: 'agent',
  timestamp: 'Today 9:41 AM',
  content: `Hey, Emma's birthday is 9 days out. 💛

Here's what I'm thinking with your $300 budget:

• Mejuri Croissant Hoops, $128
  Ships 2-day, lands before the 7th
• Dinner at Lilia, Sat 7:30pm
  Reservation for 2, around $127
• Morning flower delivery, $45
  The Bouqs, garden roses

Comes to $300. Sound good?`,
}

const CONFIRM_MESSAGE: Message = {
  role: 'agent',
  receipt: 'Read',
  content: `Done. 🐕

• Hoops ordered, tracking on the way
• Lilia confirmed for Sat 7:30pm
• Flowers scheduled for morning of the 7th

All set. I'll ping you when things ship.`,
}

const BUDGET_TOTAL = 300
const BUDGET_COMMITTED = 300

export default function ChatDemo() {
  const [phase, setPhase] = useState<'initial' | 'confirmed' | 'cta'>('initial')
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [agentTyping, setAgentTyping] = useState(false)
  const [lastUserPrompt, setLastUserPrompt] = useState('')
  const msgContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  void setPhase

  // Scroll within chat only
  useEffect(() => {
    const el = msgContainerRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  const isApproval = (text: string) =>
    /\b(yes|yeah|yep|sure|ok|okay|go|go ahead|do it|book|book it|approve|sounds good|perfect|great|let'?s do it|looks good|confirmed|confirm|all good|do that|do this)\b/i.test(text)

  const sendChange = async () => {
    const content = input.trim()
    if (!content || loading || messages.length === 0) return

    setMessages(m => [...m, { role: 'user', content, receipt: 'Delivered' }])
    setLastUserPrompt(content)
    setInput('')
    setLoading(true)

    // Approval path — simulate GoodBoy executing the plan as a scripted sequence
    if (isApproval(content)) {
      for (const beat of FAUX_ORDER_SEQUENCE) {
        setAgentTyping(true)
        await new Promise(r => setTimeout(r, beat.typingBefore))
        setAgentTyping(false)
        setMessages(m => [...m, { role: 'agent', content: beat.content }])
        await new Promise(r => setTimeout(r, 180))
      }
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user' as const,
            content: `Gifting scenario: Emma's birthday in 9 days, $300 budget. Original plan: Mejuri Croissant Hoops $128, dinner at Lilia Sat 7:30pm around $127, The Bouqs flowers $45. Total $300. The user wants to change: ${content}`,
          }],
        }),
      })
      if (!res.ok || !res.body) throw new Error()
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
      }
      setMessages(m => [...m, { role: 'agent', content: accumulated }])
    } catch {
      setMessages(m => [...m, { role: 'agent', content: 'Something went wrong. Try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChange() }
  }

  const budgetPct = Math.min(100, Math.round((BUDGET_COMMITTED / BUDGET_TOTAL) * 100))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>

      {/* ── Header ── */}
      <div style={{
        background: 'var(--ios-surface)',
        borderBottom: '1px solid var(--ios-separator)',
        padding: '12px 16px 10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'var(--ios-blue)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0,
          }}>🐕</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>GoodBoy</span>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--ios-green)', flexShrink: 0 }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--ios-timestamp)', marginTop: 1 }}>agent · Robinhood Gold</div>
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ios-timestamp)', marginBottom: 5 }}>
            <span>${BUDGET_COMMITTED} of ${BUDGET_TOTAL} committed this month</span>
            <span style={{ color: 'rgba(235,235,245,0.4)' }}>${BUDGET_TOTAL - BUDGET_COMMITTED} left</span>
          </div>
          <div className="budget-bar-track">
            <div className="budget-bar-fill" style={{ width: `${budgetPct}%` }} />
          </div>
        </div>
      </div>

      {/* ── Messages ── */}
      <div style={{ position: 'relative' }}>
        <div
          ref={msgContainerRef}
          className="no-scrollbar"
          style={{
            background: 'var(--ios-bg)',
            height: 460,
            overflowY: 'auto',
            padding: '8px 12px 72px', // extra bottom padding so content clears the fade
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {messages.length > 0 && messages[0].timestamp && (
            <div className="bubble-timestamp">{messages[0].timestamp}</div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className="msg-enter"
              style={{
                display: 'flex', flexDirection: 'column',
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: msg.receipt ? 0 : 2,
              }}
            >
              <div className={msg.role === 'agent' ? 'bubble-agent' : 'bubble-user'}>
                {msg.content}
              </div>
              {msg.receipt && <div className="bubble-receipt">{msg.receipt}</div>}
            </div>
          ))}

          {/* Typing dots — waiting for API response or between scripted beats */}
          {((loading && messages[messages.length - 1]?.role === 'user') || agentTyping) && (
            <div className="msg-enter" style={{ display: 'flex', alignItems: 'flex-start', marginTop: 2 }}>
              <div className="bubble-agent" style={{ padding: '13px 16px' }}>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            </div>
          )}

          <div />
        </div>

        {/* Feathered fade — shorter so typing dots aren't obscured */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 48,
          background: 'linear-gradient(to bottom, transparent, #000)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* ── Action bar ── */}
      <div style={{
        background: 'var(--ios-surface)',
        borderTop: '1px solid var(--ios-separator)',
        padding: '10px 12px 12px',
      }}>

        {phase === 'cta' ? (
          <CommitmentCTA prompt={lastUserPrompt || "Emma's birthday, Mejuri hoops, Lilia dinner, flowers"} />
        ) : (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="iMessage"
              disabled={loading}
              style={{
                flex: 1,
                background: 'var(--ios-surface2)',
                border: '1px solid var(--ios-separator)',
                borderRadius: 18, padding: '7px 14px',
                fontSize: 15, color: '#fff', fontFamily: 'inherit',
                outline: 'none', lineHeight: 1.4, height: 34,
                minWidth: 0,
              }}
            />
            <button
              onClick={sendChange}
              disabled={!input.trim() || loading}
              style={{
                width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                background: input.trim() && !loading ? 'var(--ios-blue)' : 'var(--ios-separator)',
                border: 'none',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s',
              }}
            >
              <svg width="13" height="13" fill="none" stroke="#fff" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
