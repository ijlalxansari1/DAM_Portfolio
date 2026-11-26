import Link from 'next/link'
import {
  Archive,
  ArrowDown,
  Layers3,
  MapPin,
  Network,
  ShieldCheck,
  Workflow,
} from 'lucide-react'
import { catalogue, document, documents, global, payload } from '@/lib/content'
import { imageURL } from '@/lib/metadata'
import { absolute, archive, safeLink, sectionDefinitions } from '@/lib/site'
import type { Homepage, Project, User } from '@/payload-types'
import {
  Cover,
  JsonLd,
  Metrics,
  PostCard,
  ProjectCard,
  SectionIntro,
} from './content-parts'
import { ArchiveArtwork, ArchiveDiagram } from './diagrams'
import { Button } from './ui/button'
import { ContactForm } from './contact-form'

type Section = NonNullable<Homepage['sections']>[number]

function SectionLink({
  section,
  backup,
}: {
  section: Section
  backup?: string
}) {
  const href = safeLink(section.ctaHref) ? section.ctaHref : backup
  return href && section.ctaLabel ? (
    <Link href={href} className="text-link section-link">
      {section.ctaLabel}
    </Link>
  ) : null
}

function Featured({ project }: { project: Project }) {
  const organisation = document(project.organisation)
  const metrics = documents(project.metrics)
  const media = document(project.cover)
  return (
    <article className="featured-card">
      {imageURL(media) ? (
        <Cover media={media} className="feature-image" />
      ) : (
        <ArchiveArtwork kind={project.visual} />
      )}
      <div className="featured-copy">
        <p className="eyebrow">
          {organisation?.name || 'Case study'} <span>{project.period}</span>
        </p>
        <h3>
          <Link href={'/projects/' + project.slug}>{project.title}</Link>
        </h3>
        <p>{project.excerpt}</p>
        <Metrics metrics={metrics.slice(0, 2)} />
        <Link className="text-link" href={'/projects/' + project.slug}>
          Read the case study
        </Link>
      </div>
    </article>
  )
}

async function Hero({
  section,
}: {
  section: Extract<Section, { blockType: 'hero' }>
}) {
  const profile = await global('profile')
  const cv = imageURL(document(profile.cv))
  const workHref = safeLink(section.ctaHref) ? section.ctaHref : '/#work'
  const workLabel = section.ctaLabel || 'Explore My Work'
  return (
    <section
      className={
        'hero' + (section.layout === 'wide-diagram' ? ' hero-wide' : '')
      }
      id="home"
    >
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">
            <span className="marker" />
            {section.eyebrow || 'Digital asset management'}
          </p>
          <h1>{section.heading || archive.headline}</h1>
          <p className="hero-description">
            {section.description || archive.description}
          </p>
          <div className="hero-actions">
            <Button asChild>
              {workHref.startsWith('/#') ? (
                <a href={workHref.slice(1)}>{workLabel}</a>
              ) : (
                <Link href={workHref}>{workLabel}</Link>
              )}
            </Button>
            <Button asChild variant="secondary">
              <Link
                href={
                  safeLink(section.secondaryHref)
                    ? section.secondaryHref
                    : '/lab'
                }
              >
                {section.secondaryLabel || 'Experience the DAM Lab'}
              </Link>
            </Button>
          </div>
          <p className="hero-role">{profile.title || archive.positioning}</p>
          <div className="hero-meta">
            <MapPin size={16} aria-hidden />
            {profile.location || archive.location}
            {cv && (
              <>
                <span aria-hidden>·</span>
                <a href={cv} download>
                  Download CV
                </a>
              </>
            )}
          </div>
        </div>
        <ArchiveDiagram />
      </div>
    </section>
  )
}

async function RenderSection({ section }: { section: Section }) {
  const anchor = sectionDefinitions.find(
    (item) => item.slug === section.blockType,
  )?.anchor
  if (
    section.enabled === false &&
    section.blockType !== 'hero' &&
    section.blockType !== 'contact'
  )
    return null
  switch (section.blockType) {
    case 'hero':
      return <Hero section={section} />
    case 'impact': {
      const values = documents(section.metrics)
      if (!values.length) return null
      return (
        <section id={anchor} className="impact-band">
          <div className="wrap impact-grid">
            <div>
              <p className="eyebrow">{section.eyebrow}</p>
              <h2>{section.heading || 'Professional impact'}</h2>
              {section.description && <p>{section.description}</p>}
            </div>
            <Metrics metrics={values} />
          </div>
        </section>
      )
    }
    case 'featured': {
      const project = document(section.projects)
      if (!project) return null
      return (
        <section id={anchor} className="wrap section">
          <SectionIntro {...section} />
          <Featured project={project} />
        </section>
      )
    }
    case 'projects': {
      const projects = documents(section.projects)
      return (
        <section id={anchor} className="wrap section section-compact">
          <SectionIntro {...section}>
            <SectionLink section={section} backup="/projects" />
          </SectionIntro>
          <div className="cards-grid">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )
    }
    case 'expertise': {
      const selection = documents(section.expertise)
      const expertise = selection.length
        ? selection
        : await catalogue('expertise', 'sortOrder')
      const icons = {
        'enterprise-dam': Archive,
        'metadata-taxonomy': Network,
        'governance-rights': ShieldCheck,
        'content-operations': Workflow,
      }
      return (
        <section id={anchor} className="section paper-section">
          <div className="wrap">
            <SectionIntro {...section} />
            <div className="capability-grid">
              {expertise.map((item) => {
                const category = document(item.category)?.slug
                const Icon = icons[category as keyof typeof icons] ?? Layers3
                return (
                  <article key={item.id}>
                    <Icon size={24} strokeWidth={1.6} aria-hidden />
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )
    }
    case 'lab':
      return (
        <section id={anchor} className="wrap section">
          <div className="lab-teaser">
            <div>
              <SectionIntro {...section} />
              <Button asChild variant="inverse">
                <Link
                  href={safeLink(section.ctaHref) ? section.ctaHref : '/lab'}
                >
                  {section.ctaLabel || 'Open the DAM Lab'}
                </Link>
              </Button>
            </div>
            <div className="lab-teaser-stack">
              {[
                {
                  Icon: Archive,
                  name: 'Asset catalogue',
                  detail: 'Search by asset, subject or collection',
                  panel: 'library',
                },
                {
                  Icon: Network,
                  name: 'Controlled vocabulary',
                  detail: 'Find preferred terms and their synonyms',
                  panel: 'taxonomy',
                },
                {
                  Icon: ShieldCheck,
                  name: 'Rights & workflow',
                  detail: 'Check access and distribution rules',
                  panel: 'workflow',
                },
              ].map(({ Icon, name, detail, panel }) => (
                <Link key={panel} href={'/lab?view=' + panel}>
                  <Icon size={21} aria-hidden />
                  <span>
                    <strong>{name}</strong>
                    <small>{detail}</small>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )
    case 'platforms': {
      const platforms = await catalogue('platforms', 'name')
      const groups = [...new Set(platforms.map((item) => item.category))]
      return (
        <section id={anchor} className="wrap section section-compact">
          <SectionIntro {...section} />
          <div className="platforms-grid">
            {groups.map((group) => (
              <div key={group}>
                <h3>{group}</h3>
                <ul className="chips">
                  {platforms
                    .filter((tool) => tool.category === group)
                    .map((tool) => (
                      <li key={tool.id} title={tool.proficiency || undefined}>
                        {tool.name}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )
    }
    case 'insights': {
      const chosen = documents(section.posts)
      const posts = chosen.length
        ? chosen
        : (await catalogue('posts', '-publishedAt')).slice(0, 3)
      return (
        <section id={anchor} className="section paper-section">
          <div className="wrap">
            <SectionIntro {...section}>
              <SectionLink section={section} backup="/insights" />
            </SectionIntro>
            <div className="cards-grid">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )
    }
    case 'career': {
      const roles = await catalogue('experience', 'sortOrder')
      return (
        <section id={anchor} className="wrap section timeline">
          <SectionIntro {...section} />
          <ol>
            {roles.map((role) => (
              <li key={role.id}>
                <p className="eyebrow">{role.period}</p>
                <div>
                  <h3>{role.role}</h3>
                  <p className="timeline-org">
                    {document(role.organisation)?.name}
                  </p>
                  <ul>
                    {role.responsibilities?.map((result) => (
                      <li key={result.id || result.text}>{result.text}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )
    }
    case 'education': {
      const [degrees, certificates] = await Promise.all([
        catalogue('education', 'sortOrder'),
        catalogue('certifications', 'name'),
      ])
      return (
        <section id={anchor} className="wrap section section-compact">
          <SectionIntro {...section} />
          <div className="education-grid">
            {degrees.map((degree) => (
              <article key={degree.id}>
                <p className="eyebrow">{degree.period}</p>
                <h3>{degree.degree}</h3>
                <p>
                  <strong>{document(degree.institution)?.name}</strong>
                  {degree.distinction && <> · {degree.distinction}</>}
                </p>
                <p>{degree.highlight}</p>
              </article>
            ))}
          </div>
          {certificates.length > 0 && (
            <ul className="chips credentials">
              {certificates.map((item) => (
                <li key={item.id}>
                  {safeLink(item.verificationURL) ? (
                    <a href={item.verificationURL}>{item.name}</a>
                  ) : (
                    item.name
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      )
    }
    case 'about': {
      const profile = await global('profile')
      return (
        <section id={anchor} className="section paper-section">
          <div className="wrap about-grid">
            <SectionIntro {...section} />
            <div>
              <p className="about-title">
                {profile.title || archive.positioning}
              </p>
              <p>{profile.biography}</p>
              <Cover media={document(profile.portrait)} />
            </div>
          </div>
        </section>
      )
    }
    case 'contact': {
      const contact = await global('contactSettings')
      return (
        <section id={anchor} className="contact-section">
          <div className="wrap contact-grid">
            <div>
              <SectionIntro
                {...section}
                heading={
                  contact.enquiryHeading || section.heading || 'Get in touch'
                }
                description={contact.enquiryDescription || section.description}
              />
              {contact.publicEmail && (
                <p>
                  <a
                    className="text-link"
                    href={'mailto:' + contact.publicEmail}
                  >
                    {contact.publicEmail}
                  </a>
                </p>
              )}
              {safeLink(contact.professionalURL) && (
                <p>
                  <a className="text-link" href={contact.professionalURL}>
                    Professional profile
                  </a>
                </p>
              )}
              {contact.formEnabled !== false && (
                <p className="subtle">
                  Enquiry details are used to respond to your message.{' '}
                  <Link href="/privacy">Privacy information</Link>
                </p>
              )}
            </div>
            {contact.formEnabled !== false && <ContactForm />}
          </div>
        </section>
      )
    }
  }
}

export async function HomepageContent({ previewUser }: { previewUser?: User }) {
  const [homepage, profile] = await Promise.all([
    previewUser
      ? (await payload()).findGlobal({
          slug: 'homepage',
          draft: true,
          depth: 2,
          user: previewUser,
          overrideAccess: false,
        })
      : global('homepage'),
    global('profile'),
  ])
  const sections = homepage.sections?.length
    ? homepage.sections
    : [{ blockType: 'hero' as const }, { blockType: 'contact' as const }]
  return (
    <>
      {!previewUser && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@graph': [
              { '@type': 'WebSite', name: archive.name, url: absolute('/') },
              {
                '@type': 'ProfilePage',
                url: absolute('/'),
                mainEntity: {
                  '@type': 'Person',
                  name: profile.name || archive.person,
                  jobTitle: profile.title || archive.positioning,
                  url: absolute('/'),
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'London',
                    addressCountry: 'GB',
                  },
                },
              },
            ],
          }}
        />
      )}
      {sections.map((section) => (
        <RenderSection
          key={section.id || section.blockType}
          section={section}
        />
      ))}
      <Link href="/#home" className="sr-only">
        <ArrowDown /> Return to the top
      </Link>
    </>
  )
}
