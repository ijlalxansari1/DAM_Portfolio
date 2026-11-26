import localFont from 'next/font/local'
import type { ReactNode } from 'react'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { global } from '@/lib/content'
import { SiteFooter, SiteHeader } from '@/components/site-shell'
import './styles.css'

const geist = localFont({
  src: './fonts/geistvariable.woff2',
  display: 'swap',
  weight: '100 900',
  variable: '--font-geist',
})
const newsreader = localFont({
  src: './fonts/newsreader.woff2',
  display: 'swap',
  weight: '200 800',
  variable: '--font-newsreader',
})

export default async function Layout({ children }: { children: ReactNode }) {
  const [header, footer] = await Promise.all([
    global('header'),
    global('footer'),
  ])
  return (
    <html lang="en-GB" className={geist.variable + ' ' + newsreader.variable}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader header={header} />
        <main id="main-content">{children}</main>
        <SiteFooter footer={footer} header={header} />
        {process.env.VERCEL_ENV === 'production' && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  )
}
