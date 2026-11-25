import Link from 'next/link'
import { ArrowDown } from 'lucide-react'
import type { Footer } from '@/payload-types'
import { archive, safeLink } from '@/lib/site'

export function SiteFooter({ footer }: { footer: Footer }) {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <Link href="/" className="brand footer-brand">
            <strong>{footer.name || archive.person}</strong>
          </Link>
          <p>{footer.descriptor || archive.positioning}</p>
        </div>
        <nav aria-label="Footer">
          {(footer.links?.length
            ? footer.links
            : [
                { label: 'Projects', href: '/projects' },
                { label: 'Insights', href: '/insights' },
                { label: 'DAM Lab', href: '/lab' },
              ]
          )
            .filter((item) => safeLink(item.href))
            .map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          <Link href="/privacy">Privacy</Link>
        </nav>
        <Link href="/#home" className="back-top">
          <ArrowDown size={16} aria-hidden /> Back to top
        </Link>
      </div>
    </footer>
  )
}
