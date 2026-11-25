export const archive = {
  name: 'The Intelligent Archive',
  person: 'Khalid Ansari',
  positioning:
    'Digital Asset Management, Metadata Governance & Content Operations Specialist',
  headline: 'Making digital assets work smarter.',
  location: 'London, United Kingdom',
  description:
    'I design the metadata, governance frameworks and content workflows that make complex digital asset libraries discoverable, usable and scalable.',
}

export const navigation = [
  { label: 'Work', href: '/#work' },
  { label: 'Expertise', href: '/#expertise' },
  { label: 'DAM Lab', href: '/#dam-lab' },
  { label: 'Insights', href: '/#insights' },
  { label: 'About', href: '/#about' },
]

export const sectionDefinitions = [
  { slug: 'hero', label: 'Hero', anchor: 'home' },
  { slug: 'impact', label: 'Professional impact', anchor: 'impact' },
  { slug: 'featured', label: 'Featured project', anchor: 'work' },
  { slug: 'projects', label: 'Selected projects', anchor: 'projects' },
  { slug: 'expertise', label: 'Expertise', anchor: 'expertise' },
  { slug: 'lab', label: 'DAM Lab preview', anchor: 'dam-lab' },
  { slug: 'platforms', label: 'Platforms and standards', anchor: 'platforms' },
  { slug: 'insights', label: 'Latest insights', anchor: 'insights' },
  { slug: 'career', label: 'Career timeline', anchor: 'experience' },
  {
    slug: 'education',
    label: 'Education and credentials',
    anchor: 'education',
  },
  { slug: 'about', label: 'About', anchor: 'about' },
  { slug: 'contact', label: 'Contact', anchor: 'contact' },
] as const

export type SectionKind = (typeof sectionDefinitions)[number]['slug']
export type SectionAnchor = (typeof sectionDefinitions)[number]['anchor']

export function siteURL() {
  return process.env.SITE_URL || 'http://localhost:3000'
}

export function localURL(value: unknown): value is string {
  return typeof value === 'string' && /^\/(?![/\\])[^\\\s]*$/.test(value)
}

export function safeLink(value: unknown): value is string {
  if (localURL(value)) return true
  if (typeof value !== 'string') return false
  try {
    const url = new URL(value)
    return (
      ['https:', 'mailto:'].includes(url.protocol) &&
      !url.username &&
      !url.password
    )
  } catch {
    return false
  }
}

export function absolute(path: string) {
  return new URL(path, siteURL()).toString()
}
