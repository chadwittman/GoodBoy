
import { useState } from 'react'

export default function WaitlistForm({ prompt }: { prompt: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, prompt }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div style={{ textAlign: 'center', padding: '4px 0' }}>
        <div style={{ fontSize: 13, color: 'var(--ios-green)', fontWeight: 500 }}>
          You&rsquo;re on the list. GoodBoy will fetch you.
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ fontSize: 12, color: 'var(--ios-timestamp)', marginBottom: 8, textAlign: 'center' }}>
        GoodBoy isn&rsquo;t live yet — be first to know
      </div>
      <form onSubmit={submit} style={{ display: 'flex', gap: 8 }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          style={{
            flex: 1,
            background: 'var(--ios-surface2)',
            border: '1px solid var(--ios-separator)',
            borderRadius: 20,
            padding: '10px 14px',
            fontSize: 15,
            color: '#fff',
            fontFamily: 'inherit',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="action-btn-primary"
          style={{ whiteSpace: 'nowrap', padding: '10px 18px', fontSize: 14 }}
        >
          {status === 'loading' ? '...' : 'Join'}
        </button>
      </form>
      {status === 'error' && (
        <div style={{ fontSize: 12, color: '#ff453a', marginTop: 6, textAlign: 'center' }}>
          Something went wrong. Try again.
        </div>
      )}
    </div>
  )
}
