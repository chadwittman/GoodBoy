import WhisperForm from '@/components/WhisperForm'

export const metadata = {
  title: 'GoodBoy is listening. 🤫',
  description: 'Your partner uses AI to buy your gifts. Drop a hint — GoodBoy hears everything.',
  openGraph: {
    title: 'GoodBoy is listening. 🤫',
    description: 'Your partner uses AI to buy your gifts. Drop a hint — he\'ll get it right this time.',
    type: 'website',
    siteName: 'GoodBoy',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GoodBoy is listening. 🤫',
    description: 'Your partner uses AI to buy your gifts. Drop a hint — he\'ll get it right this time.',
  },
}

export default function WhisperPage() {
  return (
    <main style={{
      minHeight: '100vh', background: '#000',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '48px 24px',
    }}>

      {/* Centered card */}
      <div style={{
        width: '100%', maxWidth: 380,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center',
      }}>

        <div style={{ fontSize: 48, marginBottom: 28, lineHeight: 1 }}>🤫</div>

        <p style={{
          fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--ios-timestamp)', marginBottom: 16, fontWeight: 500,
        }}>GoodBoy is listening</p>

        <h1 style={{
          fontSize: 'clamp(30px, 8vw, 40px)',
          fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1,
          color: '#fff', marginBottom: 14,
        }}>
          Your partner uses<br />AI to buy your gifts.
        </h1>

        <p style={{
          fontSize: 15, color: 'rgba(235,235,245,0.55)',
          lineHeight: 1.6, marginBottom: 8, letterSpacing: '-0.01em',
        }}>
          Drop a hint. GoodBoy hears everything.
        </p>
        <p style={{
          fontSize: 13, color: 'rgba(235,235,245,0.28)',
          lineHeight: 1.6, marginBottom: 40,
        }}>
          No guarantees. But GoodBoy pays attention.
        </p>

        <WhisperForm />
      </div>

      {/* Reverse viral CTA */}
      <div style={{
        marginTop: 64, textAlign: 'center', maxWidth: 320,
      }}>
        <div style={{ height: 1, background: 'var(--ios-separator)', marginBottom: 32 }} />
        <p style={{
          fontSize: 13, color: 'rgba(235,235,245,0.3)',
          lineHeight: 1.7, marginBottom: 16,
        }}>
          Want your own AI that actually listens?<br />
          Your partner could set this up for you.
        </p>
        <a
          href="/"
          style={{
            color: 'var(--ios-blue)', fontSize: 14,
            fontWeight: 600, textDecoration: 'none',
            letterSpacing: '-0.01em',
          }}
        >
          Get GoodBoy for him →
        </a>
      </div>

    </main>
  )
}
