import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import {
  getPayload,
  type CollectionSlug,
  type GlobalSlug,
  type PayloadRequest,
} from 'payload'

const cache = <Args extends unknown[], Result>(
  fn: (...args: Args) => Promise<Result>,
  key: string,
) => unstable_cache(fn, [key], { tags: ['archive-content'], revalidate: 3600 })
export const payload = () => getPayload({ config })

type PublicCollection = Exclude<
  CollectionSlug,
  | 'users'
  | 'enquiries'
  | 'redirects'
  | 'payload-locked-documents'
  | 'payload-preferences'
  | 'payload-migrations'
>

async function getCatalogue<C extends PublicCollection>(
  collection: C,
  sort = 'title',
) {
  const cms = await payload()
  return (
    await cms.find({
      collection,
      sort,
      pagination: false,
      depth: 2,
      overrideAccess: false,
      draft: false,
    })
  ).docs
}
export const catalogue = cache(getCatalogue, 'catalogue') as typeof getCatalogue

async function getGlobal<G extends GlobalSlug>(slug: G) {
  return (await payload()).findGlobal({
    slug,
    depth: 2,
    draft: false,
    overrideAccess: false,
  })
}
export const global = cache(getGlobal, 'global') as typeof getGlobal

async function getEntry<C extends 'projects' | 'posts'>(
  collection: C,
  slug: string,
) {
  const result = await (
    await payload()
  ).find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    overrideAccess: false,
    draft: false,
  })
  return result.docs[0] ?? null
}
export const entry = cache(getEntry, 'editorial-entry') as typeof getEntry

export async function draftEntry(
  collection: 'projects' | 'posts',
  slug: string,
  user: PayloadRequest['user'],
) {
  const result = await (
    await payload()
  ).find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    overrideAccess: false,
    draft: true,
    user,
  })
  return result.docs[0] ?? null
}

export const redirectRecord = cache(async (path: string) => {
  const result = await (
    await payload()
  ).find({
    collection: 'redirects',
    where: { from: { equals: path } },
    depth: 1,
    limit: 1,
  })
  return result.docs[0] ?? null
}, 'redirect-record')

export function documents<T extends object>(
  items?: (T | number | string | null)[] | null,
): T[] {
  return (items ?? []).filter((item): item is T =>
    Boolean(item && typeof item === 'object'),
  )
}
export function document<T extends object>(
  item: T | number | string | null | undefined,
): T | undefined {
  return item && typeof item === 'object' ? item : undefined
}
