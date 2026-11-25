import type {
  CollectionAfterChangeHook,
  CollectionBeforeChangeHook,
  CollectionConfig,
  GlobalConfig,
} from 'payload'
import { localURL, siteURL } from '@/lib/site'

export const drafts = { drafts: true, maxPerDoc: 30 }

export function previewPath(kind: string, slug?: string) {
  const query = new URLSearchParams({ kind })
  if (slug) query.set('slug', slug)
  return `${siteURL()}/api/preview?${query}`
}

export const invalidatePublic = async (req: {
  context?: Record<string, unknown>
}) => {
  if (req.context?.skipRevalidation) return
  try {
    const { revalidateTag } = await import('next/cache')
    revalidateTag('archive-content', { expire: 0 })
  } catch (error) {
    // Payload migrations and local seed scripts run without a Next request.
    if (
      !(error instanceof Error) ||
      !/static generation store|request scope/i.test(error.message)
    )
      throw error
  }
}

export const recordPreviousSlug =
  (base: string): CollectionBeforeChangeHook =>
  async ({ data, originalDoc, req }) => {
    if (data._status !== 'published' || req.context.skipRevalidation)
      return data
    const next = data.slug
    const current = originalDoc?.slug
    const previous =
      originalDoc?._status === 'published'
        ? originalDoc.slug
        : originalDoc?.lastPublishedSlug
    if (typeof next !== 'string') return data
    if (typeof previous === 'string' && previous !== next) {
      req.context.previousArchivePath = `${base}/${previous}`
    } else if (current !== next) {
      delete req.context.previousArchivePath
    }
    data.lastPublishedSlug = next
    if (!data.publishedAt && !originalDoc?.publishedAt)
      data.publishedAt = new Date().toISOString()
    return data
  }

export const redirectOldSlug =
  (base: string): CollectionAfterChangeHook =>
  async ({ doc, req }) => {
    if (doc._status !== 'published' || req.context.skipRevalidation) return doc
    const from = req.context.previousArchivePath
    delete req.context.previousArchivePath
    if (!localURL(from) || !from.startsWith(base + '/')) return doc
    const destination = `${base}/${doc.slug}`
    if (from === destination) return doc
    const existing = await req.payload.find({
      collection: 'redirects',
      depth: 0,
      limit: 1,
      where: { from: { equals: from } },
      req,
    })
    const data = {
      from,
      to: { type: 'custom' as const, url: destination },
      type: '301' as const,
    }
    if (existing.docs[0]) {
      await req.payload.update({
        collection: 'redirects',
        id: existing.docs[0].id,
        data,
        req,
      })
    } else {
      await req.payload.create({ collection: 'redirects', data, req })
    }
    return doc
  }

export const collectionInvalidation: CollectionConfig['hooks'] = {
  afterChange: [
    async ({ req }) => {
      await invalidatePublic(req)
    },
  ],
  afterDelete: [
    async ({ req }) => {
      await invalidatePublic(req)
    },
  ],
}

export const globalInvalidation: GlobalConfig['hooks'] = {
  afterChange: [
    async ({ req }) => {
      await invalidatePublic(req)
    },
  ],
}
