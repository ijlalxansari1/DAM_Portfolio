'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'
import { useRef } from 'react'

export function MobileNavigation({
  links,
  current,
  currentLabel,
}: {
  links: { label: string; href: string }[]
  current?: { href: string; kind: 'page' | 'location' }
  currentLabel?: string
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
      <summary
        ref={toggle}
        aria-label="Menu"
        aria-describedby={currentLabel ? 'mobile-current-section' : undefined}
      >
        {currentLabel && (
          <span className="mobile-nav-current" id="mobile-current-section">
            {currentLabel}
          </span>
        )}
        <Menu size={20} aria-hidden /> <span>Menu</span>
      </summary>
      <nav aria-label="Primary mobile">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={
              current?.href === item.href ? current.kind : undefined
            }
            onClick={() => {
              if (details.current) details.current.open = false
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </details>
  )
}
