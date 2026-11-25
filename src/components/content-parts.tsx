import Image from 'next/image'
import Link from 'next/link'
import { safeLink } from '@/lib/site'
import { document, documents } from '@/lib/content'
import { imageURL } from '@/lib/metadata'
import type { Media, Metric, Post, Project } from '@/payload-types'

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}

export function Cover({
  media,
  className = '',
}: {
  media?: Media
  className?: string
}) {
  const source = imageURL(media)
  if (!source || !media?.mimeType?.startsWith('image/')) return null
  return (
    <Image
      src={source}
      alt={media.alt || ''}
      width={media.width || 1200}
      height={media.height || 800}
      className={className}
      unoptimized
    />
  )
}

export function Metrics({ metrics }: { metrics: Metric[] }) {
  return (
    <dl className="metric-grid">
      {metrics.map((metric) => (
        <div key={metric.id}>
          <dt>{metric.name}</dt>
          <dd>{metric.display}</dd>
        </div>
      ))}
    </dl>
  )
}

export function SectionIntro({
  eyebrow,
  heading,
  description,
  children,
}: {
  eyebrow?: string | null
  heading?: string | null
  description?: string | null
  children?: React.ReactNode
}) {
  return (
    <div className="section-intro">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        {heading && <h2>{heading}</h2>}
        {description && <p className="section-description">{description}</p>}
      </div>
      {children}
    </div>
  )
}

export function ProjectCard({ project }: { project: Project }) {
  const cover = document(project.cover)
  const organisation = document(project.organisation)
  return (
    <article className="project-card">
      <p className="project-affiliation">
        <span>{organisation?.name ?? 'Case study'}</span>
        <span>{project.period}</span>
      </p>
      <div className="card-body">
        <h3>
          <Link href={'/projects/' + project.slug}>{project.title}</Link>
        </h3>
        <p>{project.excerpt}</p>
      </div>
      <Cover media={cover} className="project-listing-cover" />
    </article>
  )
}

export function PostCard({ post }: { post: Post }) {
  const category = documents(post.categories)[0]
  return (
    <article className="post-card">
      <p className="eyebrow">
        {category?.name || (post.kind === 'research' ? 'Research' : 'Article')}
      </p>
      <h3>
        <Link href={'/insights/' + post.slug}>{post.title}</Link>
      </h3>
      <p>{post.excerpt}</p>
      <Link
        className="text-link"
        aria-label={'Read ' + post.title}
        href={'/insights/' + post.slug}
      >
        Read {post.kind === 'research' ? 'research' : 'article'}
      </Link>
    </article>
  )
}

export function Breadcrumbs({
  links,
}: {
  links: { href: string; label: string }[]
}) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        <li>
          <Link href="/">Home</Link>
        </li>
        {links.map(({ href, label }, index) => (
          <li key={href}>
            {index === links.length - 1 ? (
              <span aria-current="page">{label}</span>
            ) : safeLink(href) ? (
              <Link href={href}>{label}</Link>
            ) : (
              label
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
