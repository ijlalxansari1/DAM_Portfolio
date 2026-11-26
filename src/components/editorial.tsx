import Link from 'next/link'
import { Search } from 'lucide-react'
import { PayloadRedirect } from '@/components/payload-redirect'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Post, Project } from '@/payload-types'
import { catalogue, document, documents, entry } from '@/lib/content'
import { formattedDate, imageURL, pageMetadata } from '@/lib/metadata'
import { absolute, archive, safeLink } from '@/lib/site'
import { matchEditorial, searchQuery } from '@/lib/search'
import {
  Breadcrumbs,
  Cover,
  JsonLd,
  Metrics,
  PostCard,
  ProjectCard,
  SectionIntro,
} from './content-parts'
import { ArchiveArtwork, MigrationDiagram } from './diagrams'
import { Button } from './ui/button'

const bases = { projects: '/projects', posts: '/insights' }
const labels = { projects: 'Projects', posts: 'Insights' }
const intros = {
  projects: {
    eyebrow: 'Work',
    header: 'Projects & case studies',
    text: 'Enterprise DAM, archival discovery and content operations in practice.',
  },
  posts: {
    eyebrow: 'Writing & research',
    header: 'Insights',
    text: 'Notes on digital asset management, metadata, rights and AI-assisted cataloguing.',
  },
}
type Editorial = keyof typeof bases
type Query = Record<string, string | string[] | undefined>

export async function EditorialArchive({
  kind,
  query,
  categorySlug,
}: {
  kind: Editorial
  query: Query
  categorySlug?: string
}) {
  const q = searchQuery(query.q)
  const active = categorySlug || searchQuery(query.topic)
  const [all, categories, ranked] = await Promise.all([
    kind === 'projects'
      ? catalogue('projects', '-publishedAt')
      : catalogue('posts', '-publishedAt'),
    catalogue('categories', 'name'),
    q ? matchEditorial(kind, q) : Promise.resolve(null),
  ])
  const used = new Set(
    all.flatMap((item) =>
      documents(item.categories).map((category) => category.slug),
    ),
  )
  const available = categories.filter((category) => used.has(category.slug))
  const category = categorySlug
    ? available.find((item) => item.slug === categorySlug)
    : undefined
  const base = bases[kind]
  if (categorySlug && !category)
    return <PayloadRedirect path={base + '/category/' + categorySlug} />
  const byID = new Map(all.map((item) => [item.id, item]))
  const rankedItems =
    ranked?.flatMap((id) => (byID.get(id) ? [byID.get(id)!] : [])) ?? all
  const items = active
    ? rankedItems.filter((item) =>
        documents(item.categories).some((topic) => topic.slug === active),
      )
    : rankedItems
  const title = category?.name || intros[kind].header
  const desc = category?.description || intros[kind].text
  const destination = category ? base + '/category/' + category.slug : base
  const breadcrumb = [
    { href: base, label: labels[kind] },
    ...(category ? [{ href: destination, label: title }] : []),
  ]
  const queryForTopic = (slug?: string) => {
    const search = new URLSearchParams()
    if (q) search.set('q', q)
    if (slug && kind === 'projects') search.set('topic', slug)
    const url = slug && kind === 'posts' ? base + '/category/' + slug : base
    return search.size ? url + '?' + search.toString() : url
  }
  return (
    <div className="wrap archive-page">
      <div className="route-head">
        <Breadcrumbs links={breadcrumb} />
        <p className="eyebrow">{intros[kind].eyebrow}</p>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: title,
          description: desc,
          url: absolute(destination),
        }}
      />
      <div className="archive-tools">
        <nav aria-label="Filter by topic" className="filter-bar">
          <Link
            href={queryForTopic()}
            aria-current={!active ? 'page' : undefined}
          >
            All topics
          </Link>
          {available.map((topic) => (
            <Link
              key={topic.id}
              href={queryForTopic(topic.slug)}
              aria-current={active === topic.slug ? 'page' : undefined}
            >
              {topic.name}
            </Link>
          ))}
        </nav>
        <form action={destination} className="archive-search" role="search">
          <label htmlFor="archive-query" className="sr-only">
            Search {labels[kind].toLowerCase()}
          </label>
          <Search size={18} aria-hidden />
          <input
            id="archive-query"
            type="search"
            name="q"
            maxLength={96}
            placeholder={'Search ' + labels[kind].toLowerCase()}
            defaultValue={q}
          />
          {active && !category && (
            <input type="hidden" name="topic" value={active} />
          )}
          <Button type="submit">Search</Button>
        </form>
      </div>
      <p className="result-count">
        {items.length}{' '}
        {kind === 'posts'
          ? items.length === 1
            ? 'article'
            : 'articles'
          : items.length === 1
            ? 'project'
            : 'projects'}
        {q && <> for “{q}”</>}
      </p>
      {items.length ? (
        <div className="cards-grid">
          {items.map((item) =>
            'challenge' in item ? (
              <ProjectCard key={item.id} project={item} />
            ) : (
              <PostCard key={item.id} post={item} />
            ),
          )}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No results</h2>
          <p>Try a different search term or browse all topics.</p>
          <Link className="text-link" href={base}>
            Clear filters
          </Link>
        </div>
      )}
    </div>
  )
}

export async function editorialMetadata(kind: Editorial, slug: string) {
  const doc =
    kind === 'projects'
      ? await entry('projects', slug)
      : await entry('posts', slug)
  const metadata = await pageMetadata(
    bases[kind] + '/' + slug,
    doc?.title || 'Page not found',
    doc?.excerpt,
    doc || undefined,
  )
  return doc
    ? metadata
    : { ...metadata, robots: { index: false, follow: false } }
}

function articleJSON(doc: Project | Post, path: string, brand: string) {
  const author = 'author' in doc ? document(doc.author)?.name : archive.person
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type':
          'kind' in doc
            ? doc.kind === 'research'
              ? 'Article'
              : 'BlogPosting'
            : 'CreativeWork',
        name: doc.title,
        headline: doc.title,
        description: doc.excerpt,
        url: absolute(path),
        author: author && {
          '@type': author === archive.person ? 'Person' : 'Organization',
          name: author,
        },
        datePublished: doc.publishedAt || undefined,
        dateModified: doc.revisedAt || doc.publishedAt || undefined,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: archive.name,
            item: absolute('/'),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: brand,
            item: absolute(path.split('/').slice(0, 2).join('/')),
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: doc.title,
            item: absolute(path),
          },
        ],
      },
    ],
  }
}

export function CaseStudy({
  project,
  preview = false,
}: {
  project: Project
  preview?: boolean
}) {
  const path = '/projects/' + project.slug
  const organisation = document(project.organisation)
  const cover = document(project.cover)
  const metrics = documents(project.metrics)
  const platforms = documents(project.platforms)
  const related = documents(project.related)
  return (
    <article className="wrap detail-page">
      {!preview && <JsonLd data={articleJSON(project, path, 'Projects')} />}
      <div className="route-head">
        <Breadcrumbs
          links={[
            { href: '/projects', label: 'Projects' },
            { href: path, label: project.title },
          ]}
        />
        <p className="eyebrow">
          {organisation?.name || 'Case study'} · {project.period}
        </p>
        <h1>{project.title}</h1>
        <p>{project.excerpt}</p>
      </div>
      {imageURL(cover) ? (
        <Cover media={cover} className="detail-cover" />
      ) : (
        <ArchiveArtwork kind={project.visual} />
      )}
      {metrics.length > 0 && (
        <div className="detail-metrics">
          <Metrics metrics={metrics} />
        </div>
      )}
      <div className="detail-body">
        <aside>
          <p className="eyebrow">On this page</p>
          <nav aria-label="Case study sections">
            <a href="#challenge">Challenge</a>
            <a href="#methodology">Methodology</a>
            <a href="#outcomes">Outcomes</a>
          </nav>
          {platforms.length > 0 && (
            <>
              <p className="eyebrow">Platforms</p>
              <ul className="chips">
                {platforms.map((item) => (
                  <li key={item.id}>{item.name}</li>
                ))}
              </ul>
            </>
          )}
        </aside>
        <div className="prose">
          <section id="challenge">
            <h2>Challenge</h2>
            <p>{project.challenge}</p>
          </section>
          <section id="methodology">
            <h2>Methodology</h2>
            <ol>
              {project.methodology?.map((step) => (
                <li key={step.id || step.text}>{step.text}</li>
              ))}
            </ol>
            {project.showMigrationDiagram && <MigrationDiagram />}
          </section>
          <section id="outcomes">
            <h2>Outcomes</h2>
            <p>{project.outcomes}</p>
          </section>
        </div>
      </div>
      {related.length > 0 && (
        <div className="section">
          <SectionIntro heading="Related case studies" />
          <div className="cards-grid">
            {related.map((item) => (
              <ProjectCard key={item.id} project={item} />
            ))}
          </div>
        </div>
      )}
    </article>
  )
}

export function Insight({
  post,
  preview = false,
}: {
  post: Post
  preview?: boolean
}) {
  const path = '/insights/' + post.slug
  const author = document(post.author)
  const categories = documents(post.categories)
  const related = documents(post.related)
  return (
    <article className="wrap detail-page insight-page">
      {!preview && <JsonLd data={articleJSON(post, path, 'Insights')} />}
      <div className="route-head">
        <Breadcrumbs
          links={[
            { href: '/insights', label: 'Insights' },
            { href: path, label: post.title },
          ]}
        />
        <p className="eyebrow">
          {post.kind === 'research' ? 'Research' : 'Article'}
        </p>
        <h1>{post.title}</h1>
        <p>{post.excerpt}</p>
        <div className="article-byline">
          {author?.name}
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {formattedDate(post.publishedAt)}
            </time>
          )}
          {post.revisedAt && (
            <time dateTime={post.revisedAt}>
              Updated {formattedDate(post.revisedAt)}
            </time>
          )}
        </div>
      </div>
      <Cover media={document(post.cover)} className="detail-cover" />
      <div className="detail-body">
        <aside>
          <p className="eyebrow">Topics</p>
          <ul className="chips">
            {categories.map((topic) => (
              <li key={topic.id}>
                <Link href={'/insights/category/' + topic.slug}>
                  {topic.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
        <div className="prose">
          {post.body && <RichText data={post.body} />}
          {!!post.references?.length && (
            <section>
              <h2>References</h2>
              <ul>
                {post.references
                  .filter((ref) => safeLink(ref.url))
                  .map((ref) => (
                    <li key={ref.id || ref.url}>
                      <a href={ref.url}>{ref.label}</a>
                    </li>
                  ))}
              </ul>
            </section>
          )}
        </div>
      </div>
      {related.length > 0 && (
        <div className="section">
          <SectionIntro heading="Related insights" />
          <div className="cards-grid">
            {related.map((item) => (
              <PostCard key={item.id} post={item} />
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
