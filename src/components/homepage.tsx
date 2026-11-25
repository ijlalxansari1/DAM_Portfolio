import Image from 'next/image'
import Link from 'next/link'
import {
  Archive,
  ArrowUpRight,
  Layers3,
  MapPin,
  Network,
  Plus,
  ShieldCheck,
  Workflow,
} from 'lucide-react'
import { catalogue, document, documents, global, payload } from '@/lib/content'
import { imageURL } from '@/lib/metadata'
import { absolute, archive, safeLink, sectionDefinitions } from '@/lib/site'
import type { Homepage, Profile, Project, User } from '@/payload-types'
import {
  Cover,
  JsonLd,
  Metrics,
  PostCard,
  ProjectCard,
  SectionIntro,
} from './content-parts'
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
  const hasImage = media?.mimeType?.startsWith('image/') && imageURL(media)
  return (
    <article className="featured-card">
      <div className="featured-copy">
        <p className="eyebrow">
          {organisation?.name || 'Case study'} <span>{project.period}</span>
        </p>
        <h3>
          <Link href={'/projects/' + project.slug}>{project.title}</Link>
        </h3>
        <p>{project.excerpt}</p>
        <Link className="text-link" href={'/projects/' + project.slug}>
          Read the case study
        </Link>
      </div>
      {(hasImage || metrics.length > 0) && (
        <div className="featured-evidence">
          {hasImage && <Cover media={media} className="feature-image" />}
          {metrics.length > 0 && <Metrics metrics={metrics.slice(0, 2)} />}
        </div>
      )}
    </article>
  )
}

function PortfolioProfile({ profile }: { profile: Profile }) {
  const name = profile.name || archive.person
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
  const cv = imageURL(document(profile.cv))
  const portrait = document(profile.portrait)
  const hasPortrait =
    portrait?.mimeType?.startsWith('image/') && imageURL(portrait)

  return (
    <aside className="portfolio-profile" aria-label="Profile">
      <div
        className="portfolio-profile-cover"
        data-portrait={hasPortrait ? 'true' : undefined}
      >
        {hasPortrait ? (
          <Cover media={portrait} className="portfolio-portrait" />
        ) : (
          <>
            <Image
              src="/images/archive-still-life.webp"
              alt=""
              width={1000}
              height={1250}
              preload
              unoptimized
              className="portfolio-cover-texture"
            />
            <span className="portfolio-monogram" aria-hidden="true">
              {initials}
            </span>
          </>
        )}
      </div>
      <div className="portfolio-identity">
        <h1>{name}</h1>
        <p className="portfolio-role">{profile.title || archive.positioning}</p>
        <p className="portfolio-location">
          <MapPin size={16} aria-hidden />
          {profile.location || archive.location}
        </p>
      </div>
      <div className="portfolio-profile-actions">
        <a href="#contact">
          Contact me <ArrowUpRight size={15} aria-hidden />
        </a>
        {cv && (
          <a href={cv} download>
            Download CV
          </a>
        )}
      </div>
    </aside>
  )
}

function Hero({
  section,
  featured,
}: {
  section: Extract<Section, { blockType: 'hero' }>
  featured?: Project
}) {
  const workHref = safeLink(section.ctaHref) ? section.ctaHref : '/#work'
  const workLabel = section.ctaLabel || 'Explore My Work'
  const workTitle =
    section.heading && section.heading !== archive.headline
      ? section.heading
      : 'I make digital collections easier to use.'
  const organisation = document(featured?.organisation)

  return (
    <section className="portfolio-intro">
      <div className="portfolio-intro-copy">
        <p className="eyebrow">
          {section.eyebrow || 'Digital asset management & metadata governance'}
        </p>
        <h2>{workTitle}</h2>
        <p className="portfolio-intro-description">
          {section.description || archive.description}
        </p>
        <div className="portfolio-intro-actions">
          <Button asChild>
            {workHref.startsWith('/#') ? (
              <a href={workHref.slice(1)}>{workLabel}</a>
            ) : (
              <Link href={workHref}>{workLabel}</Link>
            )}
          </Button>
          <Link
            className="text-link"
            href={
              safeLink(section.secondaryHref) ? section.secondaryHref : '/lab'
            }
          >
            {section.secondaryLabel || 'Experience the DAM Lab'}
          </Link>
        </div>
      </div>
      {featured && (
        <div className="portfolio-spotlight">
          <div>
            <p className="eyebrow">
              {organisation?.name || 'Selected case study'}
              {featured.period && <> · {featured.period}</>}
            </p>
            <h3>
              <Link href={'/projects/' + featured.slug}>
                {featured.title}
                <ArrowUpRight size={21} aria-hidden />
              </Link>
            </h3>
          </div>
          <p>{featured.excerpt}</p>
        </div>
      )}
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
      return null
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
        <section id={anchor} className="wrap section homepage-featured">
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
            <div className="capability-list">
              {expertise.map((item, index) => {
                const category = document(item.category)?.slug
                const Icon = icons[category as keyof typeof icons] ?? Layers3
                const projects = documents(item.relatedProjects)
                return (
                  <details
                    key={item.id}
                    name="portfolio-expertise"
                    open={index === 0}
                    className="capability"
                  >
                    <summary>
                      <Icon size={23} strokeWidth={1.65} aria-hidden />
                      <span>{item.name}</span>
                      <Plus
                        className="disclosure-indicator"
                        size={19}
                        aria-hidden
                      />
                    </summary>
                    <div className="capability-body">
                      <p>{item.description}</p>
                      {projects.length > 0 && (
                        <ul aria-label="Related case studies">
                          {projects.map((project) => (
                            <li key={project.id}>
                              <Link
                                className="text-link"
                                href={'/projects/' + project.slug}
                              >
                                {project.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </details>
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
              <Button asChild variant="secondary">
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
                  name: 'Asset catalogue',
                  detail: 'Search by asset, subject or collection',
                  panel: 'library',
                },
                {
                  name: 'Controlled vocabulary',
                  detail: 'Find preferred terms and their synonyms',
                  panel: 'taxonomy',
                },
                {
                  name: 'Rights & workflow',
                  detail: 'Check access and distribution rules',
                  panel: 'workflow',
                },
              ].map(({ name, detail, panel }) => (
                <Link key={panel} href={'/lab?view=' + panel}>
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
                  {!!role.responsibilities?.length && (
                    <details className="timeline-details">
                      <summary>
                        Responsibilities
                        <Plus
                          className="disclosure-indicator"
                          size={16}
                          aria-hidden
                        />
                      </summary>
                      <ul>
                        {role.responsibilities.map((result) => (
                          <li key={result.id || result.text}>{result.text}</li>
                        ))}
                      </ul>
                    </details>
                  )}
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
  const intro = sections.find((section) => section.blockType === 'hero') ?? {
    blockType: 'hero' as const,
  }
  const featured = sections.find(
    (section) => section.blockType === 'featured' && section.enabled !== false,
  )
  const selectedProject =
    featured?.blockType === 'featured' ? document(featured.projects) : undefined
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
      <section
        id="home"
        aria-label="Portfolio"
        className={
          previewUser
            ? 'portfolio-shell'
            : 'portfolio-shell portfolio-shell--home'
        }
      >
        <PortfolioProfile profile={profile} />
        <div className="portfolio-pages">
          <Hero section={intro} featured={selectedProject} />
          {sections.map((section) => (
            <RenderSection
              key={section.id || section.blockType}
              section={section}
            />
          ))}
        </div>
      </section>
    </>
  )
}
