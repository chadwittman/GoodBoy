
import { useState } from 'react'
import { trackEvent } from '@/lib/analytics'

export default function CommitmentCTA({ prompt }: { prompt: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    trackEvent('cta_click', { cta_name: 'commitment' })
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, prompt, commitment: 100 }),
      })
      const ok = res.ok
      setStatus(ok ? 'done' : 'error')
      trackEvent('waitlist_submit', { status: ok ? 'success' : 'error', source: 'commitment_cta' })
    } catch {
      setStatus('error')
      trackEvent('waitlist_submit', { status: 'error', source: 'commitment_cta' })
    }
  }

  if (status === 'done') {
    return (
      <div style={{ textAlign: 'center', padding: '6px 0' }}>
        <p style={{ fontSize: 15, color: '#fff', fontWeight: 600, marginBottom: 4 }}>
          You&rsquo;re in. 🐕
        </p>
        <p style={{ fontSize: 12, color: 'var(--ios-timestamp)', lineHeight: 1.5 }}>
          GoodBoy will reach out before your next occasion.
          <br />Charged when your first gift ships.
        </p>
      </div>
    )
  }

  return (
    <div>
      <p style={{
        fontSize: 13, color: '#fff', fontWeight: 600,
        marginBottom: 3, letterSpacing: '-0.01em',
      }}>
        GoodBoy isn&rsquo;t live yet.
      </p>
      <p style={{
        fontSize: 12, color: 'var(--ios-timestamp)',
        marginBottom: 10, lineHeight: 1.5,
      }}>
        $9.99/mo. Commit 3 months to join the waitlist.
      </p>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          style={{
            background: 'var(--ios-surface2)',
            border: '1px solid var(--ios-separator)',
            borderRadius: 12, padding: '11px 14px',
            fontSize: 15, color: '#fff', fontFamily: 'inherit',
            outline: 'none', width: '100%', transition: 'border-color 0.15s',
          }}
          onFocus={e => (e.target.style.borderColor = 'rgba(0,122,255,0.5)')}
          onBlur={e => (e.target.style.borderColor = 'var(--ios-separator)')}
        />
        <button
          type="submit"
          disabled={!email.trim() || status === 'loading'}
          style={{
            width: '100%', padding: '13px 20px', borderRadius: 13, border: 'none',
            background: email.trim() && status !== 'loading' ? 'var(--ios-blue)' : 'var(--ios-separator)',
            color: '#fff', fontSize: 15, fontWeight: 700,
            fontFamily: 'inherit', letterSpacing: '-0.02em',
            cursor: email.trim() && status !== 'loading' ? 'pointer' : 'not-allowed',
            transition: 'all 0.15s',
            boxShadow: email.trim() && status !== 'loading'
              ? '0 4px 20px rgba(0,122,255,0.3)' : 'none',
          }}
        >
          {status === 'loading' ? 'Joining…' : 'Commit 3 months for $29.97 →'}
        </button>
      </form>
      <p style={{ fontSize: 11, color: 'rgba(142,142,147,0.5)', textAlign: 'center', marginTop: 8 }}>
        Billed when GoodBoy goes live · Cancel after 3 months
      </p>
      {status === 'error' && (
        <p style={{ fontSize: 12, color: '#ff453a', textAlign: 'center', marginTop: 6 }}>
          Something went wrong. Try again.
        </p>
      )}
    </div>
  )
}
