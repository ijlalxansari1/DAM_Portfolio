'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookOpen,
  BriefcaseBusiness,
  Compass,
  FlaskConical,
  House,
  Layers3,
  Mail,
  UserRound,
} from 'lucide-react'
import { useEffect, useRef, useState, type RefObject } from 'react'
import type { Header } from '@/payload-types'
import { archive, navigation, safeLink, type SectionAnchor } from '@/lib/site'
import { MobileNavigation } from './mobile-nav'

const homeHref = '/#home'
const railIcons = {
  '/#work': BriefcaseBusiness,
  '/#projects': BriefcaseBusiness,
  '/#expertise': Layers3,
  '/#dam-lab': FlaskConical,
  '/#insights': BookOpen,
  '/#about': UserRound,
}
const sectionGroup: Record<SectionAnchor, string> = {
  home: 'home',
  impact: 'work',
  work: 'work',
  projects: 'work',
  expertise: 'expertise',
  'dam-lab': 'dam-lab',
  platforms: 'expertise',
  insights: 'insights',
  experience: 'about',
  education: 'about',
  about: 'about',
  contact: 'contact',
}

const collectionRoutes = [
  { path: '/projects', sections: ['work', 'projects'] },
  { path: '/insights', sections: ['insights'] },
  { path: '/lab', sections: ['dam-lab'] },
]

type NavigationLink = { href: string; label: string }
type CurrentLink = { href: string; kind: 'page' | 'location' }

function currentLink(
  pathname: string,
  section: SectionAnchor,
  links: NavigationLink[],
): CurrentLink | undefined {
  const available = (href: string) => links.some((link) => link.href === href)
  if (pathname === '/') {
    const href = ['/#' + section, '/#' + sectionGroup[section]].find(available)
    return href ? { href, kind: 'location' } : undefined
  }
  if (available(pathname)) return { href: pathname, kind: 'page' }
  const route = collectionRoutes.find(
    ({ path }) => pathname === path || pathname.startsWith(path + '/'),
  )
  const href =
    route &&
    [route.path, ...route.sections.map((anchor) => '/#' + anchor)].find(
      available,
    )
  return href ? { href, kind: 'location' } : undefined
}

function useActiveSection(
  pathname: string,
  header: RefObject<HTMLElement | null>,
) {
  const [active, setActive] = useState<SectionAnchor>('home')

  useEffect(() => {
    if (pathname !== '/') return
    const main = document.getElementById('main-content')
    if (!main) return
    const pageContent = main

    let timer: number | undefined
    function measure() {
      timer = undefined
      const sections = Array.from(
        pageContent.querySelectorAll<HTMLElement>('section[id]'),
      ).filter((section) => Object.hasOwn(sectionGroup, section.id))
      if (!sections.length) return

      const page = document.documentElement
      const atBottom =
        window.scrollY > 0 &&
        window.scrollY + window.innerHeight >= page.scrollHeight - 2
      // Align the reading line with the existing offset used by fragment links.
      const offset = Number.parseFloat(getComputedStyle(page).scrollPaddingTop)
      const line =
        (Number.isFinite(offset)
          ? offset
          : (header.current?.getBoundingClientRect().bottom ?? 0)) + 8
      let current = sections[0]
      for (const section of sections) {
        if (!atBottom && section.getBoundingClientRect().top > line) break
        current = section
      }
      setActive(current.id as SectionAnchor)
    }

    function queueMeasure() {
      if (timer === undefined) timer = window.setTimeout(measure, 32)
    }

    const resize = new ResizeObserver(queueMeasure)
    resize.observe(main)
    if (header.current) resize.observe(header.current)
    window.addEventListener('scroll', queueMeasure, { passive: true })
    window.addEventListener('resize', queueMeasure)
    window.addEventListener('hashchange', queueMeasure)
    window.addEventListener('pageshow', queueMeasure)
    queueMeasure()

    return () => {
      window.clearTimeout(timer)
      resize.disconnect()
      window.removeEventListener('scroll', queueMeasure)
      window.removeEventListener('resize', queueMeasure)
      window.removeEventListener('hashchange', queueMeasure)
      window.removeEventListener('pageshow', queueMeasure)
    }
  }, [pathname, header])

  return active
}

export function SiteHeader({ header }: { header: Header }) {
  const headerRef = useRef<HTMLElement>(null)
  const pathname = usePathname()
  const section = useActiveSection(pathname, headerRef)
  const cta = {
    href: safeLink(header.ctaHref) ? header.ctaHref : '/#contact',
    label: header.ctaLabel || 'Get in touch',
  }
  const seen = new Set([homeHref, cta.href])
  const links = (header.links ?? navigation).filter(({ href }) => {
    if (!safeLink(href) || seen.has(href)) return false
    seen.add(href)
    return true
  })
  const mobileLinks = [...links, cta]
  const current = currentLink(pathname, section, [
    { href: homeHref, label: 'Home' },
    ...mobileLinks,
  ])
  const currentLabel =
    current?.href === homeHref
      ? 'Home'
      : mobileLinks.find(({ href }) => href === current?.href)?.label
  const isCurrent = (href: string) =>
    current?.href === href ? current.kind : undefined
  const name = header.name || archive.person

  return (
    <header className="site-header" ref={headerRef}>
      <div className="wrap header-grid">
        <Link
          href={homeHref}
          className="brand"
          aria-label={name + ' home'}
          aria-current={isCurrent(homeHref)}
        >
          <House className="portfolio-rail-icon" size={19} aria-hidden />
          <span className="site-brand-name">
            <strong>{name}</strong>
            {header.subtitle && header.subtitle !== archive.name && (
              <small>{header.subtitle}</small>
            )}
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary">
          {links.map(({ href, label }) => {
            const Icon = railIcons[href as keyof typeof railIcons] ?? Compass
            return (
              <Link key={href} href={href} aria-current={isCurrent(href)}>
                <Icon className="portfolio-rail-icon" size={19} aria-hidden />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="header-cta">
          <Link href={cta.href} aria-current={isCurrent(cta.href)}>
            <Mail className="portfolio-rail-icon" size={19} aria-hidden />
            {cta.label}
          </Link>
        </div>
        <MobileNavigation
          links={mobileLinks}
          current={current}
          currentLabel={currentLabel}
        />
      </div>
    </header>
  )
}
