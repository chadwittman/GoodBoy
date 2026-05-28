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
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
          padding: '80px',
          gap: 0,
        }}
      >
        {/* Shushing emoji */}
        <div style={{ fontSize: 96, lineHeight: 1, marginBottom: 32, display: 'flex' }}>
          🤫
        </div>

        {/* Headline */}
        <div style={{
          fontSize: 64,
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: '-0.04em',
          lineHeight: 1.05,
          textAlign: 'center',
          marginBottom: 20,
          display: 'flex',
        }}>
          GoodBoy is listening.
        </div>

        {/* Subline */}
        <div style={{
          fontSize: 26,
          color: 'rgba(235,235,245,0.55)',
          fontWeight: 500,
          letterSpacing: '-0.02em',
          textAlign: 'center',
          lineHeight: 1.4,
          maxWidth: 700,
          display: 'flex',
        }}>
          Your partner uses AI to buy your gifts.
          Drop a hint — he&apos;ll get it right this time.
        </div>

        {/* Divider */}
        <div style={{
          width: 48,
          height: 2,
          background: '#38383a',
          margin: '36px auto',
          display: 'flex',
        }} />

        {/* Wordmark */}
        <div style={{
          fontSize: 20,
          color: 'rgba(235,235,245,0.3)',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          fontWeight: 600,
          display: 'flex',
        }}>
          GoodBoy · Powered by Robinhood Gold
        </div>
      </div>
    ),
    { ...size }
  )
}
