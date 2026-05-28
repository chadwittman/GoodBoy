'use client'

import { useState } from 'react'

type Tier = 'goodboy' | 'whisper'

function generateCode() {
  return Math.random().toString(36).slice(2, 7)
}

const BASE_MO = 9.99
const WHISPER_MO = 4.99
const MONTHS = 3

export default function GetAccess() {
  const [tier, setTier] = useState<Tier>('whisper')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [whisperCode] = useState(generateCode)
  const [copied, setCopied] = useState(false)

  const whisperUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/whisper`
    : 'goodboy.gift/whisper'

  const monthlyTotal = tier === 'whisper' ? BASE_MO + WHISPER_MO : BASE_MO
  const upfront = (monthlyTotal * MONTHS).toFixed(2)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(whisperUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* silent */ }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tier, whisperCode, upfront }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 20 }}>🐕</div>
        <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', marginBottom: 10 }}>
          You&rsquo;re in.
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(235,235,245,0.45)', lineHeight: 1.7, marginBottom: 36 }}>
          GoodBoy will reach out before your next occasion.<br />
          First 3 months committed. Billed when you go live.
        </p>

        {tier === 'whisper' && (
          <div style={{
            background: 'var(--ios-surface)', border: '1px solid var(--ios-separator)',
            borderRadius: 18, padding: '24px 20px',
          }}>
            <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ios-timestamp)', marginBottom: 14, fontWeight: 500 }}>
              Your Whisper link
            </p>
            <p style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.025em', color: '#fff', marginBottom: 6 }}>
              Give her the link.
            </p>
            <p style={{ fontSize: 14, color: 'rgba(235,235,245,0.45)', lineHeight: 1.6, marginBottom: 20 }}>
              She&rsquo;ll use it. She always does.
            </p>
            <div style={{
              background: 'var(--ios-surface2)', borderRadius: 12, padding: '12px 14px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 10, marginBottom: 14, border: '1px solid var(--ios-separator)',
            }}>
              <span style={{ fontSize: 13, color: 'rgba(235,235,245,0.5)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {whisperUrl}
              </span>
              <button
                onClick={copyLink}
                style={{
                  background: copied ? 'var(--ios-green)' : 'var(--ios-blue)',
                  color: '#fff', border: 'none', borderRadius: 8,
                  padding: '6px 12px', fontSize: 13, fontWeight: 600,
                  fontFamily: 'inherit', cursor: 'pointer', flexShrink: 0,
                  transition: 'background 0.2s', whiteSpace: 'nowrap',
                }}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p style={{ fontSize: 12, color: 'rgba(142,142,147,0.5)', lineHeight: 1.6, fontStyle: 'italic' }}>
              &ldquo;She&rsquo;s going to pick up your phone anyway.<br />
              Now she has a reason to stay quiet.&rdquo;
            </p>
          </div>
        )}
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
        3 months to get in.<br />Cancel after that.
      </h2>

      <p style={{
        fontSize: 15, color: 'rgba(235,235,245,0.45)',
        textAlign: 'center', lineHeight: 1.6, marginBottom: 28, letterSpacing: '-0.01em',
      }}>
        $9.99/mo. Three months up front to join the waitlist.
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
            $9.99/mo
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
            She gets a link. Drops hints. GoodBoy hears them.
          </p>
          <p style={{ fontSize: 13, color: tier === 'whisper' ? '#fff' : 'rgba(235,235,245,0.4)', fontWeight: tier === 'whisper' ? 600 : 400 }}>
            $14.98/mo
          </p>
        </button>
      </div>

      {tier === 'whisper' && (
        <div style={{ borderLeft: '2px solid var(--ios-separator)', paddingLeft: 14, marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: 'rgba(235,235,245,0.4)', lineHeight: 1.7, fontStyle: 'italic' }}>
            &ldquo;She&rsquo;s going to pick up your phone anyway.<br />
            Now she has a reason to stay quiet.&rdquo;
          </p>
        </div>
      )}

      {/* Price breakdown */}
      <div style={{
        background: 'var(--ios-surface)', border: '1px solid var(--ios-separator)',
        borderRadius: 14, padding: '14px 16px', marginBottom: 18, fontSize: 13,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(235,235,245,0.55)', marginBottom: 6 }}>
          <span>GoodBoy ({MONTHS} months)</span>
          <span>${(BASE_MO * MONTHS).toFixed(2)}</span>
        </div>
        {tier === 'whisper' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(235,235,245,0.55)', marginBottom: 6 }}>
            <span>Whisper ({MONTHS} months)</span>
            <span>${(WHISPER_MO * MONTHS).toFixed(2)}</span>
          </div>
        )}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          borderTop: '1px solid var(--ios-separator)', marginTop: 8, paddingTop: 8,
          color: '#fff', fontWeight: 600, fontSize: 14,
        }}>
          <span>Due today</span>
          <span>${upfront}</span>
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
          {status === 'loading' ? 'Joining…' : `Commit 3 months for $${upfront} →`}
        </button>
      </form>

      <p style={{ fontSize: 12, color: 'rgba(142,142,147,0.4)', textAlign: 'center', marginTop: 12, lineHeight: 1.7 }}>
        Billed when GoodBoy goes live. Cancel anytime after 3 months.<br />
        <span style={{ color: 'rgba(142,142,147,0.25)' }}>Powered by Robinhood Gold</span>
      </p>

      {status === 'error' && (
        <p style={{ fontSize: 13, color: '#ff453a', textAlign: 'center', marginTop: 10 }}>Something went wrong. Try again.</p>
      )}
    </div>
  )
}
