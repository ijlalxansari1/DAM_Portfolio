'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'

export type ResourceGroup = {
  title: string
  links: { label: string; href: string }[]
}

export function ResourceDirectory({ groups }: { groups: ResourceGroup[] }) {
  const [query, setQuery] = useState('')
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  const matches = groups
    .map(({ title, links }) => ({
      title,
      links: links.filter(({ label }) =>
        words.every((word) =>
          (title + ' ' + label).toLowerCase().includes(word),
        ),
      ),
    }))
    .filter(({ links }) => links.length)
  const count = matches.reduce((total, group) => total + group.links.length, 0)

  return (
    <section
      className="archive-admin-panel archive-admin-directory"
      aria-labelledby="archive-admin-tools"
    >
      <header className="archive-admin-panel-heading">
        <h2 id="archive-admin-tools">Workspace tools</h2>
        <label className="archive-admin-search">
          <span className="archive-admin-visually-hidden">
            Find a workspace tool
          </span>
          <Search size={18} aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find a tool…"
          />
        </label>
      </header>
      <p className="archive-admin-visually-hidden" role="status">
        {words.length
          ? `${count} matching ${count === 1 ? 'tool' : 'tools'}`
          : ''}
      </p>
      {matches.length ? (
        <div className="archive-admin-tool-grid">
          {matches.map(({ title, links }) => (
            <div key={title} className="archive-admin-tool-group">
              <h3>{title}</h3>
              <ul>
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href}>
                      {label} <ArrowRight size={14} aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="archive-admin-empty">No tools match “{query.trim()}”.</p>
      )}
    </section>
  )
}
