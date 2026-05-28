import { useState, useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

type Tier = 'goodboy' | 'whisper'

const GOODBOY_PRICE = 9.99
const WHISPER_PRICE = 14.98

type CheckoutStatus = 'idle' | 'loading' | 'error' | 'success' | 'cancelled' | 'failed'

function useCheckoutResult() {
  const [result, setResult] = useState<{ status: CheckoutStatus; tier?: string; code?: string }>({ status: 'idle' })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const checkout = params.get('checkout')
    if (checkout === 'success') {
      setResult({
        status: 'success',
        tier: params.get('tier') ?? 'goodboy',
        code: params.get('code') ?? undefined,
      })
      window.history.replaceState({}, '', window.location.pathname)
    } else if (checkout === 'cancelled') {
      setResult({ status: 'cancelled' })
      window.history.replaceState({}, '', window.location.pathname)
    } else if (checkout === 'failed') {
      setResult({ status: 'failed' })
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  return result
}

const BOOKING_STEPS = [
  { icon: '📅', text: 'Scanning your calendar…', delay: 400 },
  { icon: '🎂', text: "Found her birthday — 11 days out.", delay: 1400 },
  { icon: '🌹', text: 'Ordering flowers from Bouqs…', delay: 2600 },
  { icon: '✅', text: 'Flowers confirmed. Arrives the morning of.', delay: 3800 },
  { icon: '🍽️', text: 'Checking dinner spots she saved…', delay: 5200 },
  { icon: '📍', text: 'Table booked at Rosewood. 7:30pm.', delay: 6600 },
  { icon: '💌', text: 'Writing a card in your voice…', delay: 8000 },
  { icon: '🐕', text: "Done. She won't see it coming.", delay: 9200 },
]

function BookingAnimation() {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    BOOKING_STEPS.forEach((step, i) => {
      setTimeout(() => setVisibleCount(i + 1), step.delay)
    })
  }, [])

  const isDone = visibleCount >= BOOKING_STEPS.length

  return (
    <div style={{
      background: 'var(--ios-surface)', border: '1px solid var(--ios-separator)',
      borderRadius: 20, padding: '20px 18px', textAlign: 'left',
    }}>
      <p style={{
        fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
        color: isDone ? 'var(--ios-green)' : 'var(--ios-blue)',
        marginBottom: 16, fontWeight: 600,
        transition: 'color 0.4s',
      }}>
        {isDone ? 'GoodBoy — done' : 'GoodBoy — working…'}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {BOOKING_STEPS.slice(0, visibleCount).map((step, i) => (
          <div
            key={i}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              animation: 'fadeSlideIn 0.35s ease forwards',
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1.4, flexShrink: 0 }}>{step.icon}</span>
            <span style={{
              fontSize: 14, color: i === visibleCount - 1 ? '#fff' : 'rgba(235,235,245,0.55)',
              lineHeight: 1.5, letterSpacing: '-0.01em',
              transition: 'color 0.6s',
            }}>
              {step.text}
            </span>
          </div>
        ))}

        {!isDone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 26 }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                width: 5, height: 5, borderRadius: '50%',
                background: 'rgba(235,235,245,0.25)',
                display: 'inline-block',
                animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.25; }
          50%       { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}

export default function GetAccess() {
  const [tier, setTier] = useState<Tier>('whisper')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  const checkoutResult = useCheckoutResult()

  const price = tier === 'whisper' ? WHISPER_PRICE : GOODBOY_PRICE

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    trackEvent('cta_click', { cta_name: 'get_access', tier, price })
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tier }),
      })
      if (!res.ok) throw new Error('Server error')
      const { url } = await res.json()
      if (url) {
        window.location.href = url
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
      trackEvent('waitlist_submit', { status: 'error', source: 'get_access', tier })
    }
  }

  if (checkoutResult.status === 'success') {
    return (
      <div>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', marginBottom: 8 }}>
            GoodBoy is on it.
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(235,235,245,0.4)', lineHeight: 1.7 }}>
            No confirmation needed. He&rsquo;s already working.
          </p>
        </div>

        <BookingAnimation />

        <p style={{ fontSize: 12, color: 'rgba(142,142,147,0.3)', textAlign: 'center', marginTop: 20, lineHeight: 1.7 }}>
          Welcome, founding member. GoodBoy will be in touch.
        </p>
      </div>
    )
  }

  return (
    <div>
      <p style={{
        fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'var(--ios-timestamp)', marginBottom: 20, fontWeight: 500, textAlign: 'center',
      }}>Get access</p>

      <h2 style={{
        fontSize: 'clamp(30px, 6vw, 40px)',
        fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1.1,
        color: '#fff', marginBottom: 10, textAlign: 'center',
      }}>
        Join as a founding member.
      </h2>

      <p style={{
        fontSize: 15, color: 'rgba(235,235,245,0.45)',
        textAlign: 'center', lineHeight: 1.6, marginBottom: 28, letterSpacing: '-0.01em',
      }}>
        One-time founding member fee. GoodBoy goes live when it&rsquo;s ready.
      </p>

      {/* Tier selector */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
        <button
          onClick={() => setTier('goodboy')}
          style={{
            background: tier === 'goodboy' ? 'var(--ios-surface)' : 'transparent',
            border: `1px solid ${tier === 'goodboy' ? 'rgba(0,122,255,0.5)' : 'var(--ios-separator)'}`,
            borderRadius: 16, padding: '16px 14px', textAlign: 'left',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
        >
          <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em', marginBottom: 6 }}>GoodBoy</p>
          <p style={{ fontSize: 12, color: 'var(--ios-timestamp)', lineHeight: 1.5, marginBottom: 10 }}>
            Plans gifts, books tables, sends flowers.
          </p>
          <p style={{ fontSize: 13, color: tier === 'goodboy' ? '#fff' : 'rgba(235,235,245,0.4)', fontWeight: tier === 'goodboy' ? 600 : 400 }}>
            ${GOODBOY_PRICE.toFixed(2)}
          </p>
        </button>

        <button
          onClick={() => setTier('whisper')}
          style={{
            background: tier === 'whisper' ? 'var(--ios-surface)' : 'transparent',
            border: `1px solid ${tier === 'whisper' ? 'rgba(0,122,255,0.5)' : 'var(--ios-separator)'}`,
            borderRadius: 16, padding: '16px 14px', textAlign: 'left',
            cursor: 'pointer', transition: 'all 0.15s', position: 'relative',
          }}
        >
          <span style={{
            position: 'absolute', top: -10, right: 12,
            background: 'var(--ios-blue)', color: '#fff',
            fontSize: 10, fontWeight: 700, padding: '3px 8px',
            borderRadius: 10, letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>Popular</span>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em', marginBottom: 6 }}>
            GoodBoy + Whisper 🤫
          </p>
          <p style={{ fontSize: 12, color: 'var(--ios-timestamp)', lineHeight: 1.5, marginBottom: 10 }}>
            She texts GoodBoy ideas. He actually uses them.
          </p>
          <p style={{ fontSize: 13, color: tier === 'whisper' ? '#fff' : 'rgba(235,235,245,0.4)', fontWeight: tier === 'whisper' ? 600 : 400 }}>
            ${WHISPER_PRICE.toFixed(2)}
          </p>
        </button>
      </div>

      {tier === 'whisper' && (
        <div style={{ borderLeft: '2px solid var(--ios-separator)', paddingLeft: 14, marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: 'rgba(235,235,245,0.4)', lineHeight: 1.7, fontStyle: 'italic' }}>
            She gets her own line to GoodBoy. Drop a hint, he&rsquo;ll remember it.
          </p>
        </div>
      )}

      {/* Price summary */}
      <div style={{
        background: 'var(--ios-surface)', border: '1px solid var(--ios-separator)',
        borderRadius: 14, padding: '14px 16px', marginBottom: 18, fontSize: 13,
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          color: '#fff', fontWeight: 600, fontSize: 14,
        }}>
          <span>Founding member fee</span>
          <span>${price.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          style={{
            background: 'var(--ios-surface)', border: '1px solid var(--ios-separator)',
            borderRadius: 14, padding: '14px 16px', fontSize: 15, color: '#fff',
            fontFamily: 'inherit', outline: 'none', width: '100%', transition: 'border-color 0.15s',
          }}
          onFocus={e => (e.target.style.borderColor = 'rgba(0,122,255,0.5)')}
          onBlur={e => (e.target.style.borderColor = 'var(--ios-separator)')}
        />
        <button
          type="submit"
          disabled={!email.trim() || status === 'loading'}
          style={{
            width: '100%', padding: '16px 24px', borderRadius: 14, border: 'none',
            background: email.trim() && status !== 'loading' ? 'var(--ios-blue)' : 'var(--ios-separator)',
            color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
            letterSpacing: '-0.02em',
            cursor: email.trim() && status !== 'loading' ? 'pointer' : 'not-allowed',
            transition: 'all 0.15s',
            boxShadow: email.trim() && status !== 'loading'
              ? '0 1px 2px rgba(0,0,0,0.3), 0 8px 32px rgba(0,122,255,0.22)' : 'none',
          }}
          onMouseEnter={e => { if (email.trim()) e.currentTarget.style.background = 'var(--ios-blue-dark)' }}
          onMouseLeave={e => { if (email.trim()) e.currentTarget.style.background = 'var(--ios-blue)' }}
        >
          {status === 'loading' ? 'Opening checkout…' : `Become a founding member for $${price.toFixed(2)} →`}
        </button>
      </form>

      <p style={{ fontSize: 12, color: 'rgba(142,142,147,0.4)', textAlign: 'center', marginTop: 12, lineHeight: 1.7 }}>
        Charged now via Stripe. One-time founding member fee.
      </p>

      {checkoutResult.status === 'cancelled' && (
        <p style={{ fontSize: 13, color: 'rgba(235,235,245,0.45)', textAlign: 'center', marginTop: 10 }}>
          Payment cancelled — no charge was made. Try again when you&rsquo;re ready.
        </p>
      )}

      {(checkoutResult.status === 'failed' || status === 'error') && (
        <p style={{ fontSize: 13, color: '#ff453a', textAlign: 'center', marginTop: 10 }}>
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  )
}
