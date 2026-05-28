import ChatDemo from "@/components/ChatDemo";
import GetAccess from "@/components/GetAccess";

const STEPS = [
  { n: '01', title: 'Connect Robinhood Gold', body: 'Links to your Agentic Card API. Sets a monthly gift budget. Never goes over.' },
  { n: '02', title: 'Watches your calendar', body: 'Birthdays, anniversaries, Mother\'s Day. Starts planning 2 to 4 weeks early.' },
  { n: '03', title: 'Pings you to approve', body: 'GoodBoy orders, books, delivers. Texts you the receipts.' },
];

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column' }}>

      <section style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', padding: '72px 24px 48px',
      }}>
        <p style={{
          fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--ios-timestamp)', marginBottom: 18, fontWeight: 500,
        }}>Early access</p>

        <h1 style={{
          fontSize: 'clamp(54px, 12vw, 92px)',
          fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.0,
          color: '#fff', marginBottom: 16,
        }}>GoodBoy.</h1>

        <p style={{
          fontSize: 'clamp(18px, 3.5vw, 24px)',
          color: 'rgba(235,235,245,0.75)',
          maxWidth: 340, lineHeight: 1.35, fontWeight: 500,
          letterSpacing: '-0.02em', marginBottom: 14,
        }}>The gifting agent who lives to please her.</p>

        <p style={{
          fontSize: 15, color: 'rgba(235,235,245,0.42)',
          maxWidth: 320, lineHeight: 1.8, letterSpacing: '-0.01em',
        }}>
          He knows exactly what she wants before she says it.
          Powered by Robinhood Gold. She can even drop hints.
        </p>
      </section>

      <section style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '0 16px 0',
      }}>
        <div style={{
          width: '100%', maxWidth: 393,
          borderRadius: '24px 24px 0 0',
          overflow: 'hidden',
          boxShadow: [
            '0 0 0 1px rgba(255,255,255,0.08)',
            '0 8px 32px rgba(0,0,0,0.6)',
            '0 32px 80px rgba(0,0,0,0.5)',
          ].join(', '),
        }}>
          <ChatDemo />
        </div>

        <div style={{
          width: '100%', maxWidth: 393,
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          background: 'var(--ios-separator)',
          gap: 1,
          borderRadius: '0 0 20px 20px',
          overflow: 'hidden',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.08)',
          marginBottom: 80,
        }}>
          {STEPS.map(({ n, title, body }) => (
            <div key={n} style={{
              background: 'var(--ios-surface)',
              padding: '14px 12px 16px',
            }}>
              <span style={{
                fontSize: 10, fontWeight: 700, color: 'var(--ios-blue)',
                letterSpacing: '0.04em', display: 'block', marginBottom: 7,
              }}>{n}</span>
              <p style={{
                fontSize: 12, color: '#fff', fontWeight: 600,
                lineHeight: 1.3, marginBottom: 5, letterSpacing: '-0.01em',
              }}>{title}</p>
              <p style={{
                fontSize: 11, color: 'var(--ios-timestamp)',
                lineHeight: 1.5, margin: 0,
              }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <div style={{ height: 1, background: 'var(--ios-separator)' }} />
      <section style={{
        padding: '72px 24px 80px',
        maxWidth: 440, margin: '0 auto', width: '100%',
      }}>
        <GetAccess />
      </section>

      <footer style={{
        borderTop: '1px solid var(--ios-separator)',
        padding: '20px 24px',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: 8,
      }}>
        <span style={{ fontSize: 13, color: 'var(--ios-timestamp)', fontWeight: 600 }}>GoodBoy</span>
        <span style={{ fontSize: 12, color: 'rgba(142,142,147,0.4)' }}>$9.99/mo. Cancel after 3 months.</span>
      </footer>

    </main>
  );
}
