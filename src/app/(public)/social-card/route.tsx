import { ImageResponse } from 'next/og'
import { archive } from '@/lib/site'

export const dynamic = 'force-static'

export function GET() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: 72,
        width: '100%',
        height: '100%',
        background: '#101827',
        color: '#fff',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', width: '74%' }}>
        <div
          style={{
            display: 'flex',
            color: '#bacaff',
            fontSize: 29,
            marginBottom: 20,
          }}
        >
          {archive.name}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 84,
            fontWeight: 700,
            letterSpacing: -6,
          }}
        >
          {archive.person}
        </div>
        <div
          style={{
            display: 'flex',
            color: '#e1e9fe',
            fontSize: 31,
            maxWidth: 680,
            marginTop: 20,
          }}
        >
          {archive.positioning}
        </div>
      </div>
      <svg
        width="240"
        height="240"
        viewBox="0 0 240 240"
        style={{ marginLeft: 'auto' }}
        aria-hidden
      >
        <path
          d="m120 27 80 43v90l-80 48-80-48V70z"
          fill="#244fdb"
          stroke="#93acfb"
          strokeWidth="3"
        />
        <path
          d="m40 70 80 43 80-43m-80 43v95"
          fill="none"
          stroke="#dce5ff"
          strokeWidth="3"
        />
      </svg>
    </div>,
    { width: 1200, height: 630 },
  )
}
