import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowRight,
  BookOpen,
  Boxes,
  FolderKanban,
  Images,
  LayoutTemplate,
  Mail,
  PenLine,
  Plus,
  ScanSearch,
  Upload,
  type LucideIcon,
} from 'lucide-react'
import type { AdminViewServerProps, CollectionSlug } from 'payload'
import { ResourceDirectory, type ResourceGroup } from './resource-directory'

const overview = [
  { slug: 'projects', label: 'Projects', Icon: FolderKanban, tone: 'blue' },
  { slug: 'posts', label: 'Insights', Icon: BookOpen, tone: 'violet' },
  { slug: 'media', label: 'Media assets', Icon: Images, tone: 'green' },
  { slug: 'enquiries', label: 'New enquiries', Icon: Mail, tone: 'amber' },
] as const

const groups = [
  {
    title: 'Publishing',
    items: [
      ['projects', 'Projects'],
      ['posts', 'Insights'],
      ['authors', 'Authors'],
      ['redirects', 'Redirects'],
    ],
  },
  {
    title: 'Media & taxonomy',
    items: [
      ['media', 'Media library'],
      ['categories', 'Categories'],
      ['tags', 'Tags'],
    ],
  },
  {
    title: 'Professional profile',
    items: [
      ['organisations', 'Organisations'],
      ['experience', 'Experience'],
      ['education', 'Education'],
      ['certifications', 'Credentials'],
      ['expertise', 'Expertise'],
      ['platforms', 'Platforms'],
      ['metrics', 'Impact metrics'],
    ],
  },
  {
    title: 'DAM Lab',
    items: [
      ['labAssets', 'Lab assets'],
      ['taxonomyTerms', 'Taxonomy terms'],
      ['labWorkflows', 'Lab workflows'],
      ['labSettings', 'Lab settings', 'global'],
    ],
  },
  {
    title: 'Site settings',
    items: [
      ['homepage', 'Homepage sections', 'global'],
      ['profile', 'Profile', 'global'],
      ['header', 'Header', 'global'],
      ['footer', 'Footer', 'global'],
      ['siteSettings', 'Site settings', 'global'],
      ['seoSettings', 'SEO defaults', 'global'],
      ['contactSettings', 'Contact settings', 'global'],
    ],
  },
  {
    title: 'Administration',
    items: [
      ['enquiries', 'Enquiries'],
      ['users', 'Users'],
    ],
  },
] as const

type RecentEntry = {
  id: number
  title: string
  updatedAt: string
  _status?: 'draft' | 'published' | null
}
type QuickAction = {
  label: string
  detail: string
  href: string
  Icon: LucideIcon
}

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Europe/London',
})

export async function Dashboard({
  initPageResult,
  user,
}: AdminViewServerProps) {
  const { req, permissions, visibleEntities } = initPageResult
  const { payload } = req
  const base = payload.config.routes.admin
  if (!req.user || !permissions.canAccessAdmin)
    redirect(base + payload.config.admin.routes.login)

  const collectionURL = (slug: string) => base + '/collections/' + slug
  const globalURL = (slug: string) => base + '/globals/' + slug
  const canRead = (slug: string) =>
    visibleEntities.collections.includes(slug as CollectionSlug) &&
    permissions.collections?.[slug]?.read === true
  const canCreate = (slug: string) =>
    canRead(slug) && permissions.collections?.[slug]?.create === true
  const query = { req, overrideAccess: false as const }

  async function recent(slug: 'projects' | 'posts') {
    if (!canRead(slug)) return []
    const { docs } = await payload.find({
      ...query,
      collection: slug,
      draft: true,
      depth: 0,
      limit: 5,
      sort: '-updatedAt',
      select: { title: true, updatedAt: true, _status: true },
    })
    return (docs as RecentEntry[]).map((doc) => ({
      ...doc,
      slug,
      href: collectionURL(slug) + '/' + doc.id,
    }))
  }

  const [stats, projects, posts] = await Promise.all([
    Promise.all(
      overview
        .filter(({ slug }) => canRead(slug))
        .map(async (item) => {
          const { totalDocs } = await payload.count({
            ...query,
            collection: item.slug,
            ...(item.slug === 'enquiries' && {
              where: { status: { equals: 'new' } },
            }),
          })
          return { ...item, totalDocs }
        }),
    ),
    recent('projects'),
    recent('posts'),
  ])

  const latest = [...projects, ...posts]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5)
  const shortcuts: QuickAction[] = []
  if (
    visibleEntities.globals.includes('homepage') &&
    permissions.globals?.homepage?.update
  ) {
    shortcuts.push({
      label: 'Edit homepage',
      detail: 'Manage sections and featured content',
      href: globalURL('homepage'),
      Icon: LayoutTemplate,
    })
  }
  if (canCreate('media')) {
    shortcuts.push({
      label: 'Upload media',
      detail: 'Add a file and its usage rights',
      href: collectionURL('media') + '/create',
      Icon: Upload,
    })
  }
  if (canCreate('posts')) {
    shortcuts.push({
      label: 'Write an insight',
      detail: 'Start an article or a research note',
      href: collectionURL('posts') + '/create',
      Icon: PenLine,
    })
  }
  if (canRead('labAssets')) {
    shortcuts.push({
      label: 'Manage the DAM Lab',
      detail: 'Edit demonstration asset records',
      href: collectionURL('labAssets'),
      Icon: ScanSearch,
    })
  }

  const resources: ResourceGroup[] = groups
    .map(({ title, items }) => ({
      title,
      links: items.flatMap(([slug, label, kind]) => {
        const visible =
          kind === 'global'
            ? visibleEntities.globals.includes(
                slug as (typeof visibleEntities.globals)[number],
              ) && permissions.globals?.[slug]?.read === true
            : canRead(slug)
        return visible
          ? [
              {
                label,
                href: kind === 'global' ? globalURL(slug) : collectionURL(slug),
              },
            ]
          : []
      }),
    }))
    .filter(({ links }) => links.length > 0)

  const firstName = user?.name?.trim().split(/\s+/)[0]

  return (
    <section
      className="archive-admin-dashboard"
      aria-labelledby="archive-admin-title"
    >
      <header className="archive-admin-hero">
        <div className="archive-admin-hero-copy">
          <p className="archive-admin-eyebrow">
            <Boxes size={17} aria-hidden /> The Intelligent Archive
          </p>
          <h1 id="archive-admin-title">
            {firstName ? `Welcome, ${firstName}` : 'Content dashboard'}
          </h1>
          <p>
            Manage your portfolio, media library, and DAM Lab from one place.
          </p>
          <div className="archive-admin-hero-actions">
            {canCreate('projects') && (
              <Link
                className="archive-admin-primary"
                href={collectionURL('projects') + '/create'}
              >
                <Plus size={18} aria-hidden /> New project
              </Link>
            )}
            <Link
              className="archive-admin-secondary"
              href="/"
              target="_blank"
              rel="noopener noreferrer"
            >
              View portfolio <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
        <svg
          className="archive-admin-hero-illustration"
          aria-hidden="true"
          viewBox="0 0 340 235"
          fill="none"
        >
          <path
            d="m170 21 117 64v64L170 214 53 149V85z"
            stroke="currentColor"
            strokeOpacity=".34"
          />
          <path
            d="m170 47 94 52v37l-94 52-94-52V99z"
            fill="#192f65"
            stroke="#6e93ff"
          />
          <path
            d="m76 99 94 52 94-52M170 151v37M170 47v104M76 136l94-53 94 53"
            stroke="#7092e5"
          />
          <path
            d="m170 66 61 33-61 34-61-34z"
            fill="#315de8"
            stroke="#a6bdff"
          />
          <path
            d="M14 117h62m188 0h62M170 0v47m0 141v47"
            stroke="currentColor"
            strokeDasharray="4 6"
          />
          <circle cx="14" cy="117" r="3" fill="#a6bdff" />
          <circle cx="326" cy="117" r="3" fill="#a6bdff" />
          <circle cx="170" cy="99" r="5" fill="#c8d6ff" />
        </svg>
      </header>

      {stats.length > 0 && (
        <section
          aria-label="Content overview"
          className="archive-admin-overview"
        >
          {stats.map(({ slug, label, Icon, tone, totalDocs }) => (
            <Link
              key={slug}
              href={
                collectionURL(slug) +
                (slug === 'enquiries' ? '?where[status][equals]=new' : '')
              }
              className="archive-admin-stat"
            >
              <span className="archive-admin-icon" data-tone={tone}>
                <Icon size={21} strokeWidth={1.8} aria-hidden />
              </span>
              <span className="archive-admin-stat-content">
                <strong>{totalDocs.toLocaleString('en-GB')}</strong>
                <span>{label}</span>
              </span>
              <ArrowRight
                className="archive-admin-arrow"
                size={17}
                aria-hidden
              />
            </Link>
          ))}
        </section>
      )}

      <div className="archive-admin-main-grid">
        <section
          className="archive-admin-panel"
          aria-labelledby="archive-admin-recent"
        >
          <header className="archive-admin-panel-heading">
            <h2 id="archive-admin-recent">Recent edits</h2>
          </header>
          {latest.length ? (
            <ul className="archive-admin-recent">
              {latest.map((item) => {
                const Icon = item.slug === 'projects' ? FolderKanban : BookOpen
                return (
                  <li key={item.slug + '-' + item.id}>
                    <Link
                      href={item.href}
                      className="archive-admin-recent-link"
                    >
                      <span className="archive-admin-entry-icon">
                        <Icon size={19} strokeWidth={1.8} aria-hidden />
                      </span>
                      <span className="archive-admin-entry-title">
                        <strong>{item.title || 'Untitled draft'}</strong>
                        <span>
                          {item.slug === 'projects' ? 'Project' : 'Insight'} ·{' '}
                          <time dateTime={item.updatedAt}>
                            {dateFormat.format(new Date(item.updatedAt))}
                          </time>
                        </span>
                      </span>
                      <span
                        className="archive-admin-status"
                        data-state={
                          item._status === 'published' ? 'published' : 'draft'
                        }
                      >
                        {item._status === 'published' ? 'Published' : 'Draft'}
                      </span>
                      <ArrowRight
                        className="archive-admin-arrow"
                        size={17}
                        aria-hidden
                      />
                    </Link>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="archive-admin-empty">
              Your recently edited projects and insights will appear here.
            </p>
          )}
        </section>

        {shortcuts.length > 0 && (
          <section
            className="archive-admin-panel"
            aria-labelledby="archive-admin-actions"
          >
            <header className="archive-admin-panel-heading">
              <h2 id="archive-admin-actions">Quick actions</h2>
            </header>
            <ul className="archive-admin-shortcuts">
              {shortcuts.map(({ href, Icon, label, detail }) => (
                <li key={href}>
                  <Link href={href} className="archive-admin-shortcut">
                    <span className="archive-admin-entry-icon">
                      <Icon size={19} strokeWidth={1.8} aria-hidden />
                    </span>
                    <span>
                      <strong>{label}</strong>
                      <small>{detail}</small>
                    </span>
                    <ArrowRight
                      className="archive-admin-arrow"
                      size={17}
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {resources.length > 0 && <ResourceDirectory groups={resources} />}
    </section>
  )
}
