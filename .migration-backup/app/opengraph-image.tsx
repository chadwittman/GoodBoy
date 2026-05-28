import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#000000',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: '72px 80px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {/* iMessage bubble — simulated conversation */}
        <div
          style={{
            position: 'absolute',
            top: 64,
            left: 80,
            right: 80,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {/* Timestamp */}
          <div style={{
            fontSize: 13,
            color: '#8e8e93',
            textAlign: 'center',
            marginBottom: 4,
            display: 'flex',
            justifyContent: 'center',
          }}>
            Today 9:41 AM
          </div>

          {/* GoodBoy bubble */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 8,
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#007AFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              flexShrink: 0,
            }}>🐕</div>
            <div style={{
              background: '#007AFF',
              color: '#ffffff',
              borderRadius: '18px 18px 18px 4px',
              padding: '12px 16px',
              fontSize: 17,
              lineHeight: 1.45,
              maxWidth: '72%',
              whiteSpace: 'pre-wrap',
            }}>
              {"Hey — Emma's birthday is 9 days out. 💛\n\nMejuri Hoops · Lilia Sat 7:30pm · Flowers morning of the 7th. Comes to $303.\n\nSound good?"}
            </div>
          </div>

          {/* User bubble */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}>
            <div style={{
              background: '#3a3a3c',
              color: '#ffffff',
              borderRadius: '18px 18px 4px 18px',
              padding: '12px 16px',
              fontSize: 17,
              lineHeight: 1.45,
              maxWidth: '50%',
            }}>
              Yes, go ahead
            </div>
          </div>

          {/* GoodBoy reply */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 8,
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#007AFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              flexShrink: 0,
            }}>🐕</div>
            <div style={{
              background: '#007AFF',
              color: '#ffffff',
              borderRadius: '18px 18px 18px 4px',
              padding: '12px 16px',
              fontSize: 17,
              lineHeight: 1.45,
              maxWidth: '65%',
              whiteSpace: 'pre-wrap',
            }}>
              {"Done. 🐕\n\nHoops ordered. Lilia confirmed. Flowers scheduled."}
            </div>
          </div>
        </div>

        {/* Bottom wordmark */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            fontSize: 72,
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.04em',
            lineHeight: 1,
          }}>
            GoodBoy.
          </div>
          <div style={{
            fontSize: 22,
            color: 'rgba(235,235,245,0.6)',
            fontWeight: 500,
            letterSpacing: '-0.02em',
          }}>
            The gifting agent who lives to please her.
          </div>
          <div style={{
            fontSize: 16,
            color: 'rgba(235,235,245,0.35)',
            letterSpacing: '-0.01em',
            marginTop: 4,
          }}>
            Powered by Robinhood Gold
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
