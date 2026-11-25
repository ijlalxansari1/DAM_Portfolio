import type { Metadata } from 'next'
import { absolute, archive, safeLink } from '@/lib/site'
import { document, global } from '@/lib/content'
import type { Media, Post, Project } from '@/payload-types'

export async function indexing() {
  const settings = await global('seoSettings')
  return (
    process.env.SITE_INDEXABLE === 'true' && settings.allowIndexing !== false
  )
}

export function imageURL(media: Media | undefined) {
  if (
    !media ||
    media.visibility !== 'public' ||
    media.confidentiality !== 'public' ||
    media.approval !== 'approved'
  )
    return undefined
  if (media.expiry && Date.parse(media.expiry) <= Date.now()) return undefined
  return safeLink(media.url) ? media.url : undefined
}

export async function pageMetadata(
  path: string,
  title?: string,
  description?: string,
  doc?: Post | Project,
): Promise<Metadata> {
  const [settings, site] = await Promise.all([
    global('seoSettings'),
    global('siteSettings'),
  ])
  const name = site.name || archive.name
  const nameAndBrand = title
    ? title + ' | ' + name
    : settings.defaultTitle || archive.person + ' | ' + name
  const headline = doc?.meta?.title || nameAndBrand
  const summary =
    doc?.meta?.description ||
    description ||
    settings.defaultDescription ||
    site.description ||
    archive.description
  const canonical =
    doc?.canonicalURL &&
    safeLink(doc.canonicalURL) &&
    !doc.canonicalURL.startsWith('mailto:')
      ? absolute(doc.canonicalURL)
      : absolute(path)
  const image = absolute(
    imageURL(document(doc?.meta?.image)) ||
      imageURL(document(doc?.cover)) ||
      imageURL(document(settings.socialImage)) ||
      '/social-card',
  )
  const indexable =
    process.env.SITE_INDEXABLE === 'true' &&
    settings.allowIndexing !== false &&
    !doc?.noIndex
  return {
    title: headline,
    description: summary,
    alternates: { canonical },
    robots: { index: indexable, follow: indexable },
    verification: settings.googleVerification
      ? { google: settings.googleVerification }
      : undefined,
    openGraph: {
      type: doc ? 'article' : 'website',
      siteName: name,
      title: headline,
      description: summary,
      url: canonical,
      locale: 'en_GB',
      images: [image],
      ...(doc && {
        publishedTime: doc.publishedAt || undefined,
        modifiedTime: doc.revisedAt || doc.publishedAt || undefined,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: headline,
      description: summary,
      images: [image],
    },
  }
}

export function formattedDate(date?: string | null) {
  return date
    ? new Intl.DateTimeFormat('en-GB', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(date))
    : ''
}
