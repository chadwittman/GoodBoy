import { useState, useEffect, useRef } from 'react'
import ChatDemo from '@/components/ChatDemo'

// ─── Shared helpers ───────────────────────────────────────────────────────────

function useInView(threshold = 0.25) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function SceneLabel({ n, label }: { n: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
      <span style={{
        fontSize: 10, fontWeight: 700, color: 'var(--ios-blue)',
        letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>{n}</span>
      <div style={{ flex: 1, height: 1, background: 'var(--ios-separator)' }} />
      <span style={{
        fontSize: 10, fontWeight: 600, color: 'var(--ios-timestamp)',
        letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>{label}</span>
    </div>
  )
}

// ─── Scene 1: Onboarding ──────────────────────────────────────────────────────

const ONBOARDING_FIELDS = [
  { label: 'Who are we gifting?', value: 'Emma', delay: 300 },
  { label: 'Relationship', value: 'Girlfriend', delay: 900 },
  { label: 'Next occasion', value: "Birthday — April 7th, recurring", delay: 1600 },
  { label: 'She loves', value: 'Mejuri, minimal gold, no rose gold', delay: 2400 },
  { label: 'Dietary', value: 'Vegetarian. Loves Lilia, Rosewood.', delay: 3200 },
  { label: 'Monthly budget', value: '$300', delay: 4000 },
]

function TypedValue({ value, active }: { value: string; active: boolean }) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    if (!active) return
    setDisplayed('')
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(value.slice(0, i))
      if (i >= value.length) clearInterval(interval)
    }, 28)
    return () => clearInterval(interval)
  }, [active, value])
  return <span>{displayed}{active && displayed.length < value.length ? '|' : ''}</span>
}

function OnboardingScene() {
  const { ref, visible } = useInView()
  const [activeField, setActiveField] = useState(-1)
  const [doneFields, setDoneFields] = useState<number[]>([])

  useEffect(() => {
    if (!visible) return
    ONBOARDING_FIELDS.forEach((f, i) => {
      setTimeout(() => {
        setActiveField(i)
        setTimeout(() => setDoneFields(d => [...d, i]), f.value.length * 28 + 200)
      }, f.delay)
    })
  }, [visible])

  const allDone = doneFields.length >= ONBOARDING_FIELDS.length

  return (
    <div ref={ref} style={{ maxWidth: 440, margin: '0 auto' }}>
      <div style={{
        background: 'var(--ios-surface)', border: '1px solid var(--ios-separator)',
        borderRadius: 20, overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid var(--ios-separator)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: 'var(--ios-blue)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
          }}>🐕</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>GoodBoy Setup</div>
            <div style={{ fontSize: 11, color: 'var(--ios-timestamp)' }}>Tell me who to look out for</div>
          </div>
          <div style={{
            marginLeft: 'auto', fontSize: 11, color: allDone ? 'var(--ios-green)' : 'var(--ios-blue)',
            fontWeight: 600, transition: 'color 0.4s',
          }}>
            {allDone ? 'Ready ✓' : `${doneFields.length}/${ONBOARDING_FIELDS.length}`}
          </div>
        </div>

        {/* Fields */}
        <div style={{ padding: '4px 0' }}>
          {ONBOARDING_FIELDS.map((f, i) => {
            const isActive = activeField === i && !doneFields.includes(i)
            const isDone = doneFields.includes(i)
            const isVisible = activeField >= i
            if (!isVisible) return null
            return (
              <div
                key={i}
                style={{
                  padding: '12px 20px',
                  borderBottom: i < ONBOARDING_FIELDS.length - 1 ? '1px solid rgba(56,56,58,0.5)' : 'none',
                  animation: 'msgIn 0.2s ease forwards',
                }}
              >
                <div style={{ fontSize: 11, color: 'var(--ios-timestamp)', marginBottom: 3, letterSpacing: '0.02em' }}>
                  {f.label}
                </div>
                <div style={{
                  fontSize: 15, color: isDone ? '#fff' : 'rgba(235,235,245,0.8)',
                  fontWeight: isDone ? 500 : 400,
                  minHeight: 22,
                }}>
                  {isDone
                    ? f.value
                    : isActive
                      ? <TypedValue value={f.value} active={true} />
                      : null}
                </div>
              </div>
            )
          })}
        </div>

        {allDone && (
          <div style={{
            padding: '14px 20px', borderTop: '1px solid var(--ios-separator)',
            background: 'rgba(48,209,88,0.06)',
            animation: 'msgIn 0.3s ease forwards',
          }}>
            <p style={{ fontSize: 13, color: 'var(--ios-green)', fontWeight: 500 }}>
              🐕 Got it. I'll start watching for her birthday.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Scene 3: Execution ───────────────────────────────────────────────────────

const EXECUTION_BEATS = [
  { icon: '🔍', label: 'Checking Mejuri stock…', status: 'Croissant Hoops — in stock, 2-day ship', delay: 0, conf: null },
  { icon: '🛍️', label: 'Placing Mejuri order…', status: 'Ordered · Conf #MJ-48201 · Tracking to follow', delay: 1800, conf: 'MJ-48201' },
  { icon: '📅', label: 'Checking Lilia availability…', status: 'Sat Apr 5 · 7:30pm · Party of 2 — open', delay: 3800, conf: null },
  { icon: '🍝', label: 'Booking Lilia…', status: 'Confirmed · Reservation #LIL-7732', delay: 5400, conf: 'LIL-7732' },
  { icon: '🌹', label: 'Scheduling The Bouqs delivery…', status: 'Garden roses · Delivery morning of Apr 7', delay: 7200, conf: 'BQ-2049' },
  { icon: '📱', label: 'Sending you a summary…', status: 'Text sent · "Everything\'s set for Emma\'s birthday 🐕"', delay: 9000, conf: null },
]

function ExecutionScene() {
  const { ref, visible } = useInView(0.2)
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (!visible) return
    EXECUTION_BEATS.forEach((b, i) => {
      setTimeout(() => setShown(i + 1), b.delay + 400)
    })
  }, [visible])

  const isDone = shown >= EXECUTION_BEATS.length

  return (
    <div ref={ref} style={{ maxWidth: 440, margin: '0 auto' }}>
      {/* Status bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16,
      }}>
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
          color: isDone ? 'var(--ios-green)' : 'var(--ios-blue)',
          transition: 'color 0.5s',
        }}>
          {isDone ? 'GoodBoy — all done ✓' : 'GoodBoy — executing…'}
        </span>
        <span style={{ fontSize: 11, color: 'var(--ios-timestamp)' }}>
          {shown}/{EXECUTION_BEATS.length} steps
        </span>
      </div>

      {/* Beat list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {EXECUTION_BEATS.map((b, i) => {
          if (i >= shown) return null
          const isLatest = i === shown - 1 && !isDone
          return (
            <div
              key={i}
              style={{
                background: isLatest ? 'var(--ios-surface)' : 'rgba(28,28,30,0.5)',
                border: `1px solid ${isLatest ? 'rgba(0,122,255,0.3)' : 'var(--ios-separator)'}`,
                borderRadius: 14, padding: '12px 14px',
                animation: 'msgIn 0.25s ease forwards',
                transition: 'all 0.3s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{b.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 12, color: isLatest ? '#fff' : 'rgba(235,235,245,0.45)',
                    fontWeight: isLatest ? 600 : 400, marginBottom: 2,
                    transition: 'color 0.3s',
                  }}>
                    {b.label}
                  </div>
                  <div style={{
                    fontSize: 11, color: isLatest ? 'rgba(235,235,245,0.6)' : 'rgba(235,235,245,0.25)',
                    transition: 'color 0.3s',
                  }}>
                    {b.status}
                  </div>
                </div>
                {b.conf && (
                  <span style={{
                    fontSize: 10, color: 'var(--ios-green)', fontWeight: 700,
                    fontFamily: 'monospace', flexShrink: 0,
                    background: 'rgba(48,209,88,0.1)', borderRadius: 6, padding: '2px 6px',
                  }}>
                    #{b.conf}
                  </span>
                )}
              </div>
            </div>
          )
        })}

        {!isDone && shown > 0 && (
          <div style={{
            padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                width: 5, height: 5, borderRadius: '50%',
                background: 'rgba(235,235,245,0.2)',
                display: 'inline-block',
                animation: `typingBounce 1.1s ease-in-out ${i * 0.18}s infinite`,
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Summary receipt */}
      {isDone && (
        <div style={{
          marginTop: 16,
          background: 'rgba(48,209,88,0.06)',
          border: '1px solid rgba(48,209,88,0.2)',
          borderRadius: 16, padding: '16px 18px',
          animation: 'msgIn 0.4s ease forwards',
        }}>
          <p style={{ fontSize: 12, color: 'var(--ios-green)', fontWeight: 600, marginBottom: 10 }}>
            Everything confirmed ✓
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { label: 'Mejuri Croissant Hoops', price: '$128', conf: '#MJ-48201' },
              { label: 'Lilia · Sat 7:30pm', price: '~$127', conf: '#LIL-7732' },
              { label: 'The Bouqs · Apr 7 AM', price: '$45', conf: '#BQ-2049' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: 13, color: '#fff' }}>{r.label}</span>
                  <span style={{ fontSize: 11, color: 'var(--ios-timestamp)', marginLeft: 6 }}>{r.conf}</span>
                </div>
                <span style={{ fontSize: 13, color: 'rgba(235,235,245,0.5)' }}>{r.price}</span>
              </div>
            ))}
            <div style={{
              borderTop: '1px solid rgba(48,209,88,0.15)', marginTop: 6, paddingTop: 6,
              display: 'flex', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>Total committed</span>
              <span style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>$300</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Scene 4: Whisper ─────────────────────────────────────────────────────────

const WHISPER_HINTS = [
  { text: "I've been eyeing those Mejuri croissant hoops for months 🥹", delay: 600 },
  { text: "Honestly any Lilia reservation would make my year", delay: 3200 },
  { text: "Garden roses > everything else, just saying 🌹", delay: 5800 },
]

const GOODBOY_READS = [
  { text: 'Hint received: Mejuri Croissant Hoops', delay: 1400, icon: '💛' },
  { text: 'Noted: Lilia is her spot', delay: 4000, icon: '🍝' },
  { text: 'Locked in: garden roses only', delay: 6600, icon: '🌹' },
]

function WhisperScene() {
  const { ref, visible } = useInView(0.2)
  const [shownHints, setShownHints] = useState(0)
  const [shownReads, setShownReads] = useState(0)

  useEffect(() => {
    if (!visible) return
    WHISPER_HINTS.forEach((h, i) => setTimeout(() => setShownHints(i + 1), h.delay))
    GOODBOY_READS.forEach((r, i) => setTimeout(() => setShownReads(i + 1), r.delay))
  }, [visible])

  return (
    <div ref={ref} style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
      }}>
        {/* Emma's side */}
        <div style={{
          background: 'var(--ios-surface)', border: '1px solid var(--ios-separator)',
          borderRadius: 18, overflow: 'hidden',
        }}>
          <div style={{
            padding: '12px 14px', borderBottom: '1px solid var(--ios-separator)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 18 }}>🤫</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>Emma's Whisper</div>
              <div style={{ fontSize: 10, color: 'var(--ios-timestamp)' }}>goodboy.gift/whisper</div>
            </div>
          </div>
          <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 180 }}>
            {WHISPER_HINTS.slice(0, shownHints).map((h, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--ios-surface2)', borderRadius: '12px 12px 4px 12px',
                  padding: '8px 10px', fontSize: 12, color: '#fff', lineHeight: 1.5,
                  animation: 'msgIn 0.2s ease forwards',
                  alignSelf: 'flex-end', maxWidth: '90%',
                }}
              >
                {h.text}
              </div>
            ))}
            {shownHints > 0 && shownHints < WHISPER_HINTS.length && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 4 }}>
                <span style={{ fontSize: 10, color: 'var(--ios-timestamp)', fontStyle: 'italic' }}>Emma is typing…</span>
              </div>
            )}
          </div>
        </div>

        {/* GoodBoy's side */}
        <div style={{
          background: 'var(--ios-surface)', border: '1px solid var(--ios-separator)',
          borderRadius: 18, overflow: 'hidden',
        }}>
          <div style={{
            padding: '12px 14px', borderBottom: '1px solid var(--ios-separator)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%', background: 'var(--ios-blue)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
            }}>🐕</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>GoodBoy hears it</div>
              <div style={{ fontSize: 10, color: 'var(--ios-timestamp)' }}>updating plan context</div>
            </div>
          </div>
          <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 180 }}>
            {GOODBOY_READS.slice(0, shownReads).map((r, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 6,
                  animation: 'msgIn 0.2s ease forwards',
                }}
              >
                <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }}>{r.icon}</span>
                <span style={{ fontSize: 11, color: 'rgba(235,235,245,0.65)', lineHeight: 1.5 }}>
                  {r.text}
                </span>
              </div>
            ))}
            {shownReads >= GOODBOY_READS.length && (
              <div style={{
                marginTop: 8, padding: '8px 10px',
                background: 'rgba(0,122,255,0.08)', borderRadius: 10, border: '1px solid rgba(0,122,255,0.2)',
                animation: 'msgIn 0.3s ease forwards',
              }}>
                <p style={{ fontSize: 11, color: 'var(--ios-blue)', fontWeight: 500 }}>
                  Plan updated. Next time I ping you, her hints are already in it.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <p style={{
        fontSize: 13, color: 'rgba(235,235,245,0.3)', textAlign: 'center',
        marginTop: 16, lineHeight: 1.6, fontStyle: 'italic',
      }}>
        She thinks she&rsquo;s leaving hints. She is. That&rsquo;s the whole point.
      </p>
    </div>
  )
}

// ─── Demo page ────────────────────────────────────────────────────────────────

export default function Demo() {
  return (
    <main style={{ minHeight: '100vh', background: '#000' }}>

      {/* Nav */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--ios-separator)',
        padding: '12px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <a href="/" style={{
          fontSize: 15, fontWeight: 700, color: '#fff', textDecoration: 'none',
          letterSpacing: '-0.02em',
        }}>GoodBoy.</a>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--ios-blue)', background: 'rgba(0,122,255,0.12)',
          padding: '4px 10px', borderRadius: 20,
        }}>
          POC Demo
        </span>
        <a
          href="/#get-access"
          style={{
            fontSize: 13, fontWeight: 600, color: '#fff', textDecoration: 'none',
            background: 'var(--ios-blue)', padding: '7px 16px', borderRadius: 20,
          }}
        >
          Get access →
        </a>
      </div>

      {/* Hero */}
      <section style={{
        padding: '72px 24px 56px', textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <p style={{
          fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--ios-timestamp)', marginBottom: 18, fontWeight: 500,
        }}>
          Proof of concept · No Robinhood card required
        </p>
        <h1 style={{
          fontSize: 'clamp(40px, 9vw, 72px)',
          fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05,
          color: '#fff', marginBottom: 16, maxWidth: 700,
        }}>
          GoodBoy, start to finish.
        </h1>
        <p style={{
          fontSize: 17, color: 'rgba(235,235,245,0.5)',
          maxWidth: 460, lineHeight: 1.6, letterSpacing: '-0.01em',
        }}>
          Set up a person. GoodBoy watches their calendar, pings you with a plan,
          executes it when you say go, and listens when she drops hints.
          Everything except the final card charge.
        </p>

        <div style={{
          display: 'flex', gap: 8, marginTop: 32, flexWrap: 'wrap', justifyContent: 'center',
        }}>
          {['01 Setup', '02 The ping', '03 Execution', '04 Whisper'].map((s, i) => (
            <a
              key={i}
              href={`#scene-${i + 1}`}
              style={{
                fontSize: 12, fontWeight: 600, color: 'rgba(235,235,245,0.5)',
                textDecoration: 'none', padding: '6px 14px',
                border: '1px solid var(--ios-separator)', borderRadius: 20,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#fff'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'rgba(235,235,245,0.5)'
                e.currentTarget.style.borderColor = 'var(--ios-separator)'
              }}
            >
              {s}
            </a>
          ))}
        </div>
      </section>

      {/* ── Scene 1: Setup ── */}
      <section id="scene-1" style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <SceneLabel n="01" label="The setup" />
          <div style={{ marginBottom: 32 }}>
            <h2 style={{
              fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 700,
              letterSpacing: '-0.03em', color: '#fff', marginBottom: 10,
            }}>
              Tell GoodBoy who matters.
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(235,235,245,0.45)', lineHeight: 1.6 }}>
              Add a person once. GoodBoy watches their calendar, remembers what they like,
              and starts planning 2 weeks before anything important.
            </p>
          </div>
          <OnboardingScene />
        </div>
      </section>

      <div style={{ height: 1, background: 'var(--ios-separator)', margin: '0 24px' }} />

      {/* ── Scene 2: The ping ── */}
      <section id="scene-2" style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <SceneLabel n="02" label="The ping" />
          <div style={{ marginBottom: 32 }}>
            <h2 style={{
              fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 700,
              letterSpacing: '-0.03em', color: '#fff', marginBottom: 10,
            }}>
              GoodBoy comes to you first.
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(235,235,245,0.45)', lineHeight: 1.6 }}>
              9 days out. Plan already built. Budget respected. Try typing "yes" or ask it to change something.
            </p>
          </div>

          <div style={{
            width: '100%', maxWidth: 393, margin: '0 auto',
            borderRadius: 24, overflow: 'hidden',
            boxShadow: [
              '0 0 0 1px rgba(255,255,255,0.08)',
              '0 8px 32px rgba(0,0,0,0.6)',
              '0 32px 80px rgba(0,0,0,0.4)',
            ].join(', '),
          }}>
            <ChatDemo />
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: 'var(--ios-separator)', margin: '0 24px' }} />

      {/* ── Scene 3: Execution ── */}
      <section id="scene-3" style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <SceneLabel n="03" label="Execution" />
          <div style={{ marginBottom: 32 }}>
            <h2 style={{
              fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 700,
              letterSpacing: '-0.03em', color: '#fff', marginBottom: 10,
            }}>
              GoodBoy actually does it.
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(235,235,245,0.45)', lineHeight: 1.6 }}>
              Browses product pages, checks restaurant availability, places orders.
              Right now it stops before the card charge — that&rsquo;s the Robinhood integration.
              Everything else is live.
            </p>
          </div>
          <ExecutionScene />
        </div>
      </section>

      <div style={{ height: 1, background: 'var(--ios-separator)', margin: '0 24px' }} />

      {/* ── Scene 4: Whisper ── */}
      <section id="scene-4" style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <SceneLabel n="04" label="The Whisper loop" />
          <div style={{ marginBottom: 32 }}>
            <h2 style={{
              fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 700,
              letterSpacing: '-0.03em', color: '#fff', marginBottom: 10,
            }}>
              She leaves hints. He uses them.
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(235,235,245,0.45)', lineHeight: 1.6 }}>
              She gets a link. She thinks she&rsquo;s just venting to the universe.
              GoodBoy reads every word and updates the plan.
            </p>
          </div>
          <WhisperScene />
        </div>
      </section>

      <div style={{ height: 1, background: 'var(--ios-separator)', margin: '0 24px' }} />

      {/* ── CTA ── */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <p style={{
          fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--ios-timestamp)', marginBottom: 20, fontWeight: 500,
        }}>What's missing</p>
        <h2 style={{
          fontSize: 'clamp(28px, 6vw, 48px)', fontWeight: 700,
          letterSpacing: '-0.035em', color: '#fff', marginBottom: 14, lineHeight: 1.1,
        }}>
          One integration away<br />from fully automatic.
        </h2>
        <p style={{
          fontSize: 15, color: 'rgba(235,235,245,0.45)',
          maxWidth: 400, lineHeight: 1.7, margin: '0 auto 40px',
        }}>
          The Robinhood Agentic Card API is the last piece.
          When it&rsquo;s live, GoodBoy completes the checkout himself.
          Everything you just saw runs without it.
        </p>

        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          maxWidth: 340, margin: '0 auto',
        }}>
          <a
            href="/"
            style={{
              display: 'block', width: '100%', padding: '16px 24px',
              borderRadius: 14, background: 'var(--ios-blue)',
              color: '#fff', fontSize: 16, fontWeight: 700,
              textDecoration: 'none', textAlign: 'center', letterSpacing: '-0.02em',
              boxShadow: '0 1px 2px rgba(0,0,0,0.3), 0 8px 32px rgba(0,122,255,0.25)',
            }}
          >
            Become a founding member →
          </a>
          <p style={{ fontSize: 12, color: 'rgba(142,142,147,0.4)' }}>
            $9.99/mo · First 3 months · Cancel after
          </p>
        </div>
      </section>

    </main>
  )
}
