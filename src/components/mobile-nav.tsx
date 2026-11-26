'use client'

import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { Menu } from 'lucide-react'
import { useRef } from 'react'

export function MobileNavigation({
  links,
  socials,
}: {
  links: { label: string; href: string }[]
  socials: { label: string; href: string; icon: LucideIcon }[]
}) {
  const details = useRef<HTMLDetailsElement>(null)
  const toggle = useRef<HTMLElement>(null)
  return (
    <details
      ref={details}
      className="mobile-nav"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && details.current?.open) {
          details.current.open = false
          toggle.current?.focus()
        }
      }}
    >
      <summary ref={toggle}>
        <Menu size={20} aria-hidden /> Menu
      </summary>
      <nav aria-label="Primary mobile">
        {links.map((item, index) => (
          <Link
            key={`${item.href}-${item.label}-${index}`}
            href={item.href}
            onClick={() => {
              if (details.current) details.current.open = false
            }}
          >
            {item.label}
          </Link>
        ))}
        {socials.length > 0 && (
          <div className="mobile-socials" aria-label="Social links">
            {socials.map(({ label, href, icon: Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer">
                <Icon size={16} aria-hidden /> {label}
              </a>
            ))}
          </div>
        )}
      </nav>
    </details>
  )
}
