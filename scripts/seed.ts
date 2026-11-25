import {
  getPayload,
  type CollectionSlug,
  type DataFromCollectionSlug,
  type RequiredDataFromCollectionSlug,
} from 'payload'
import config from '../src/payload.config'
import { archive, navigation, sectionDefinitions } from '../src/lib/site'
import {
  capabilities,
  categories,
  essays,
  metrics,
  organisations,
  platforms,
  projects,
} from './content'
import { labAssets, terms, workflow } from './lab-content'

const payload = await getPayload({ config })
const context = { skipRevalidation: true }

async function seed<C extends CollectionSlug>(
  collection: C,
  field: string,
  value: string,
  data: RequiredDataFromCollectionSlug<C>,
): Promise<DataFromCollectionSlug<C>> {
  const existing = await payload.find({
    collection,
    where: { [field]: { equals: value } },
    depth: 0,
    limit: 1,
  })
  return (
    existing.docs[0] ??
    (await payload.create({ collection, data, context, depth: 0 }))
  )
}

function rich(sections: string[][]) {
  return {
    root: {
      type: 'root',
      version: 1,
      format: '' as const,
      indent: 0,
      direction: 'ltr' as const,
      children: sections.flatMap(([heading, paragraph]) => [
        {
          type: 'heading',
          tag: 'h2',
          version: 1,
          format: '',
          indent: 0,
          direction: 'ltr',
          children: [
            {
              type: 'text',
              text: heading,
              version: 1,
              mode: 'normal',
              format: 0,
              detail: 0,
              style: '',
            },
          ],
        },
        {
          type: 'paragraph',
          version: 1,
          format: '',
          indent: 0,
          direction: 'ltr',
          children: [
            {
              type: 'text',
              text: paragraph,
              version: 1,
              mode: 'normal',
              format: 0,
              detail: 0,
              style: '',
            },
          ],
        },
      ]),
    },
  }
}

const bullets = (items: readonly string[]) => items.map((text) => ({ text }))
const published = { _status: 'published' as const }
const publicationDate = new Date().toISOString()

try {
  const org = new Map()
  const cat = new Map()
  const platform = new Map()
  const metric = new Map()
  const project = new Map()
  const term = new Map()
  for (const data of organisations)
    org.set(
      data.slug,
      (
        await seed('organisations', 'slug', data.slug, {
          ...data,
          ...published,
        })
      ).id,
    )
  for (const data of categories)
    cat.set(
      data.slug,
      (await seed('categories', 'slug', data.slug, { ...data, ...published }))
        .id,
    )
  for (const [name, slug, proficiency, category] of platforms)
    platform.set(
      slug,
      (
        await seed('platforms', 'slug', slug, {
          name,
          slug,
          proficiency,
          category,
          ...published,
        })
      ).id,
    )
  for (const [slug, name, value, unit, display, context] of metrics)
    metric.set(
      slug,
      (
        await seed('metrics', 'slug', slug, {
          slug,
          name,
          value,
          unit,
          display,
          context,
          source: 'Khalid Ansari CV, September 2026',
          ...published,
        })
      ).id,
    )
  for (const {
    metricKeys,
    categories,
    platforms,
    organisation,
    methodology,
    visual,
    ...data
  } of projects) {
    const doc = await seed('projects', 'slug', data.slug, {
      ...data,
      visual: visual as 'migration' | 'workflow' | 'archive' | 'rights',
      ...published,
      organisation: org.get(organisation),
      methodology: bullets(methodology),
      categories: categories.map((key) => cat.get(key)),
      platforms: platforms.map((key) => platform.get(key)),
      metrics: metricKeys.map((key) => metric.get(key)),
      showMigrationDiagram: visual === 'migration',
      publishedAt: publicationDate,
      lastPublishedSlug: data.slug,
    })
    project.set(data.slug, doc.id)
    if (doc.updatedAt !== doc.createdAt) continue
    for (const key of metricKeys) {
      const id = metric.get(key)
      const relatedMetric = await payload.findByID({
        collection: 'metrics',
        id,
        depth: 0,
      })
      if (!relatedMetric.project)
        await payload.update({
          collection: 'metrics',
          id,
          data: { project: doc.id },
          context,
        })
    }
    for (const key of platforms) {
      const id = platform.get(key)
      const tool = await payload.findByID({
        collection: 'platforms',
        id,
        depth: 0,
      })
      const relationships = tool.relatedProjects || []
      if (!relationships.includes(doc.id))
        await payload.update({
          collection: 'platforms',
          id,
          data: { relatedProjects: [...relationships, doc.id] },
          context,
        })
    }
  }
  for (const [sortOrder, data] of capabilities.entries())
    await seed('expertise', 'name', data.name, {
      name: data.name,
      description: data.description,
      category: cat.get(data.icon),
      relatedProjects: data.relatedProjects.map((key) => project.get(key)),
      sortOrder,
      ...published,
    })

  const author = await seed('authors', 'slug', 'archive-editorial', {
    name: archive.name,
    slug: 'archive-editorial',
    biography: 'Editorial notes and research summaries for the portfolio.',
    ...published,
  })
  for (const { sections, category, kind, ...data } of essays)
    await seed('posts', 'slug', data.slug, {
      ...data,
      kind: kind as 'article' | 'research',
      body: rich(sections),
      author: author.id,
      categories: [cat.get(category)],
      publishedAt: publicationDate,
      lastPublishedSlug: data.slug,
      ...published,
    })

  const roles = [
    {
      role: 'Digital Content Officer',
      organisation: 'iis',
      period: 'December 2025–present',
      start: '2025-12-01',
      responsibilities: [
        'Manage the content supply chain, WordPress CMS and publishing approvals.',
        'Introduced Wrike and led editorial and multimedia production across formats.',
      ],
    },
    {
      role: 'Digital Asset Officer',
      organisation: 'wateraid',
      period: 'January–December 2025',
      start: '2025-01-01',
      end: '2025-12-01',
      responsibilities: [
        'Led the enterprise migration into Orange Logic and designed the supporting metadata and taxonomy.',
        'Integrated DAM with CMS and brand workflows and trained staff across global offices.',
      ],
    },
    {
      role: 'Digital Archivist Intern, Special Collections',
      organisation: 'iis',
      period: 'September–December 2024',
      start: '2024-09-01',
      end: '2024-12-01',
      responsibilities: [
        'Digitised and catalogued images and transcripts and extended subject access across 14 collections.',
      ],
    },
    {
      role: 'Co-founder & Digital Content Manager',
      organisation: 'hunza-folk',
      period: 'March 2018–present',
      start: '2018-03-01',
      responsibilities: [
        'Manage tagging, versions and rights clearance for community-sourced multimedia.',
      ],
    },
  ]
  for (const [sortOrder, data] of roles.entries())
    await seed('experience', 'role', data.role, {
      ...data,
      organisation: org.get(data.organisation),
      responsibilities: bullets(data.responsibilities),
      sortOrder,
      ...published,
    })

  await seed('education', 'degree', 'MA Digital Asset & Media Management', {
    degree: 'MA Digital Asset & Media Management',
    institution: org.get('kcl'),
    period: '2023–2024',
    sortOrder: 0,
    distinction: 'Dissertation distinction',
    highlight:
      'Research on AI-driven metadata enrichment for cultural heritage cataloguing.',
    ...published,
  })
  await seed('education', 'degree', 'MA History', {
    degree: 'MA History',
    institution: org.get('soas'),
    period: '2021–2023',
    distinction: 'Merit',
    sortOrder: 1,
    highlight:
      'Research on access, colonial archives and digital preservation.',
    ...published,
  })
  await seed(
    'certifications',
    'name',
    'Orange Logic University certification',
    {
      name: 'Orange Logic University certification',
      issuer: 'Orange Logic University',
      ...published,
    },
  )
  await seed(
    'certifications',
    'name',
    'Merit-based dual master’s scholarship',
    {
      name: 'Merit-based dual master’s scholarship',
      issuer: 'SOAS and King’s College London',
      ...published,
    },
  )

  for (const { synonyms, parent, ...data } of terms)
    term.set(
      data.slug,
      (
        await seed('taxonomyTerms', 'slug', data.slug, {
          ...data,
          synonyms: bullets(synonyms),
          parent: parent ? term.get(parent) : undefined,
          ...published,
        })
      ).id,
    )
  for (const { subjects, channels, kind, state, visual, ...data } of labAssets)
    await seed('labAssets', 'slug', data.slug, {
      ...data,
      kind: kind as 'Image' | 'Document' | 'Audio' | 'Video',
      visual: visual as
        'ridge' | 'field' | 'folio' | 'sound' | 'pattern' | 'water',
      state: state as 'Intake' | 'Review' | 'Approved' | 'Restricted',
      creator: 'Synthetic catalogue',
      rightsHolder: 'Demonstration collection',
      language: 'English',
      channels: bullets(channels),
      subjects: subjects.map((key) => term.get(key)),
      ...published,
    })
  await seed('labWorkflows', 'slug', workflow.slug, {
    ...workflow,
    stages: workflow.stages.map((stage) => ({
      ...stage,
      requirements: bullets(stage.requirements),
      transitions: stage.transitions.map((target) => ({ target })),
    })),
    ...published,
  })

  const homepage = await payload.findGlobal({ slug: 'homepage', depth: 0 })
  if (!homepage.updatedAt) {
    const sections = [
      {
        blockType: 'hero' as const,
        eyebrow: 'Digital asset management & metadata governance',
        heading: archive.headline,
        description: archive.description,
        ctaLabel: 'Explore My Work',
        ctaHref: '/#work',
        secondaryLabel: 'Experience the DAM Lab',
        secondaryHref: '/lab',
      },
      {
        blockType: 'impact' as const,
        eyebrow: 'WaterAid UK',
        heading: 'Professional impact',
        metrics: [
          'assets-migrated',
          'ingest-success',
          'retrieval-time',
          'adoption',
        ].map((key) => metric.get(key)),
      },
      {
        blockType: 'featured' as const,
        eyebrow: 'Flagship case study',
        heading: 'From migration to discovery',
        projects: project.get('wateraid-dam-migration'),
      },
      {
        blockType: 'projects' as const,
        eyebrow: 'Case studies',
        heading: 'Selected work',
        ctaLabel: 'All projects',
        ctaHref: '/projects',
        projects: [
          'iis-content-supply-chain',
          'iis-special-collections',
          'hunza-folk-media-archive',
        ].map((key) => project.get(key)),
      },
      {
        blockType: 'expertise' as const,
        eyebrow: 'Practice',
        heading: 'Expertise & capabilities',
      },
      {
        blockType: 'lab' as const,
        eyebrow: 'Interactive workspace',
        heading: 'The DAM Lab',
        description:
          'Explore a sample asset catalogue, trace a controlled vocabulary and see how a rights decision affects distribution.',
        ctaLabel: 'Open the DAM Lab',
        ctaHref: '/lab',
      },
      {
        blockType: 'platforms' as const,
        eyebrow: 'Tools and methods',
        heading: 'Platforms & metadata standards',
      },
      {
        blockType: 'insights' as const,
        eyebrow: 'Writing & research',
        heading: 'Latest insights',
        ctaLabel: 'Browse all insights',
        ctaHref: '/insights',
      },
      {
        blockType: 'career' as const,
        eyebrow: 'Career',
        heading: 'Professional experience',
      },
      {
        blockType: 'education' as const,
        eyebrow: 'Academic background',
        heading: 'Education & credentials',
      },
      {
        blockType: 'about' as const,
        eyebrow: 'About Khalid',
        heading: 'Information worth finding',
      },
      {
        blockType: 'contact' as const,
        eyebrow: 'Contact',
        heading: 'Let’s talk about your archive',
        description:
          'Get in touch about enterprise DAM, metadata governance or content operations.',
      },
    ]
    if (sections.length !== sectionDefinitions.length)
      throw new Error('Each homepage section needs a seed.')
    await payload.updateGlobal({
      slug: 'homepage',
      data: { sections, ...published },
      context,
    })
  }
  const profile = await payload.findGlobal({ slug: 'profile' })
  if (!profile.updatedAt)
    await payload.updateGlobal({
      slug: 'profile',
      data: {
        name: archive.person,
        title: archive.positioning,
        location: archive.location,
        biography:
          'I’m a London-based digital asset management specialist with experience in global charities, cultural heritage and digital publishing. I translate business requirements into metadata, permissions and workflows teams can use. My research at King’s College London explored how AI can support cultural heritage cataloguing.',
      },
      context,
    })
  const header = await payload.findGlobal({ slug: 'header' })
  if (!header.updatedAt)
    await payload.updateGlobal({
      slug: 'header',
      data: { name: archive.person, subtitle: archive.name, links: navigation },
      context,
    })
  const site = await payload.findGlobal({ slug: 'siteSettings' })
  if (!site.updatedAt)
    await payload.updateGlobal({
      slug: 'siteSettings',
      data: { name: archive.name, description: archive.description },
      context,
    })
  const lab = await payload.findGlobal({ slug: 'labSettings' })
  if (!lab.updatedAt)
    await payload.updateGlobal({
      slug: 'labSettings',
      data: {
        title: 'The DAM Lab',
        description:
          'Explore how metadata, controlled vocabularies and permissions work together in a digital asset library.',
        datasetNotice:
          'Illustrative dataset. Changes to the workflow are local to your session.',
        defaultView: 'library',
      },
      context,
    })
} finally {
  await payload.db.pool.end()
  await payload.destroy()
}
process.stdout.write('Seeded the portfolio catalogue.\n', () => process.exit(0))
