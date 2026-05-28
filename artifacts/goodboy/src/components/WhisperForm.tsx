
import { useState } from 'react'
import { trackEvent } from '@/lib/analytics'

export default function WhisperForm() {
  const [hint, setHint] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hint.trim()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/whisper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hint }),
      })
      const ok = res.ok
      setStatus(ok ? 'done' : 'error')
      trackEvent('whisper_submit', { status: ok ? 'success' : 'error' })
    } catch {
      setStatus('error')
      trackEvent('whisper_submit', { status: 'error' })
    }
  }

  if (status === 'done') {
    return (
      <div style={{ textAlign: 'center', width: '100%' }}>
        <div style={{ fontSize: 36, marginBottom: 16 }}>🤫</div>
        <p style={{
          fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em',
          color: '#fff', marginBottom: 10,
        }}>Whispered.</p>
        <p style={{
          fontSize: 14, color: 'rgba(235,235,245,0.45)',
          lineHeight: 1.7,
        }}>
          GoodBoy heard you.<br />
          No promises — but it pays attention.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <textarea
        value={hint}
        onChange={e => setHint(e.target.value)}
        placeholder="Tiffany Open Heart necklace, 18k gold… or literally anything"
        rows={3}
        disabled={status === 'loading'}
        style={{
          width: '100%',
          background: 'var(--ios-surface)',
          border: '1px solid var(--ios-separator)',
          borderRadius: 16, padding: '14px 16px',
          fontSize: 15, color: '#fff', fontFamily: 'inherit',
          resize: 'none', outline: 'none', lineHeight: 1.5,
          transition: 'border-color 0.15s',
        }}
        onFocus={e => (e.target.style.borderColor = 'rgba(0,122,255,0.4)')}
        onBlur={e => (e.target.style.borderColor = 'var(--ios-separator)')}
      />
      <button
        type="submit"
        disabled={!hint.trim() || status === 'loading'}
        style={{
          width: '100%', padding: '15px 24px',
          borderRadius: 14, border: 'none',
          background: hint.trim() && status !== 'loading' ? 'var(--ios-blue)' : 'var(--ios-separator)',
          color: '#fff', fontSize: 16, fontWeight: 700,
          fontFamily: 'inherit', letterSpacing: '-0.02em',
          cursor: hint.trim() && status !== 'loading' ? 'pointer' : 'not-allowed',
          transition: 'all 0.15s',
          boxShadow: hint.trim() && status !== 'loading'
            ? '0 8px 32px rgba(0,122,255,0.25)' : 'none',
        }}
        onMouseEnter={e => { if (hint.trim()) e.currentTarget.style.background = 'var(--ios-blue-dark)' }}
        onMouseLeave={e => { if (hint.trim()) e.currentTarget.style.background = 'var(--ios-blue)' }}
      >
        {status === 'loading' ? 'Whispering…' : 'Whisper it →'}
      </button>
      {status === 'error' && (
        <p style={{ fontSize: 13, color: '#ff453a', textAlign: 'center', marginTop: 4 }}>
          Something went wrong. Try again.
        </p>
      )}
    </form>
  )
}
