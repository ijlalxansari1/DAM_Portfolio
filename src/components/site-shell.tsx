import Link from 'next/link'
import {
  ArrowDown,
  ArrowUpRight,
  Box,
  BriefcaseBusiness,
  GitBranch,
  MessageCircle,
} from 'lucide-react'
import type { Footer, Header } from '@/payload-types'
import { archive, navigation, safeLink } from '@/lib/site'
import { Button } from './ui/button'
import { MobileNavigation } from './mobile-nav'

export function socialLinks(header: Header) {
  return [
    { label: 'LinkedIn', href: header.linkedinURL, icon: BriefcaseBusiness },
    { label: 'GitHub', href: header.githubURL, icon: GitBranch },
    { label: 'WhatsApp', href: header.whatsappURL, icon: MessageCircle },
  ].filter(
    (item): item is { label: string; href: string; icon: typeof BriefcaseBusiness } =>
      typeof item.href === 'string' && safeLink(item.href),
  )
}

export function SiteHeader({ header }: { header: Header }) {
  const links = (header.links || navigation).filter((item) =>
    safeLink(item.href),
  )
  const cta = typeof header.ctaHref === 'string' && safeLink(header.ctaHref)
    ? header.ctaHref
    : '/#contact'
  const socials = socialLinks(header)
  const mobileLinks = [
    ...links,
    { href: '/#work', label: 'View work' },
    { href: cta, label: header.ctaLabel || 'Get in touch' },
  ].filter(
    (item, index, items) =>
      items.findIndex((candidate) => candidate.href === item.href) === index,
  )
  return (
    <header className="site-header">
      <div className="wrap header-grid">
        <Link
          href="/#home"
          className="brand"
          aria-label={(header.name || archive.person) + ' home'}
        >
          <span className="brand-mark">
            <Box size={22} strokeWidth={1.6} aria-hidden />
          </span>
          <span>
            <strong>{header.name || archive.person}</strong>
            <small>{header.subtitle || archive.name}</small>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary">
          {links.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <div className="header-socials" aria-label="Social links">
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                className="social-icon"
                aria-label={label}
                target="_blank"
                rel="noreferrer"
              >
                <Icon size={16} strokeWidth={1.8} aria-hidden />
              </a>
            ))}
          </div>
          <div className="header-cta">
            <Button asChild variant="secondary" className="header-work-cta">
              <Link href="/#work">
                View work <ArrowUpRight size={15} aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="primary">
              <Link href={cta}>{header.ctaLabel || 'Get in touch'}</Link>
            </Button>
          </div>
        </div>
        <MobileNavigation
          links={mobileLinks}
          socials={socials}
        />
      </div>
    </header>
  )
}

export function SiteFooter({ footer, header }: { footer: Footer; header: Header }) {
  const socials = socialLinks(header)
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <Link href="/" className="brand footer-brand">
            <span className="brand-mark">
              <Box size={22} aria-hidden />
            </span>
            <strong>{footer.name || archive.name}</strong>
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
        {socials.length > 0 && (
          <div className="footer-socials" aria-label="Social links">
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                className="social-icon"
                aria-label={label}
                target="_blank"
                rel="noreferrer"
              >
                <Icon size={16} strokeWidth={1.8} aria-hidden />
                <span>{label}</span>
              </a>
            ))}
          </div>
        )}
        <Link href="/#home" className="back-top">
          <ArrowDown size={16} aria-hidden /> Back to top
        </Link>
      </div>
    </footer>
  )
}
