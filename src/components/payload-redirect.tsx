import { notFound, permanentRedirect, redirect } from 'next/navigation'
import { redirectRecord } from '@/lib/content'
import { localURL, safeLink } from '@/lib/site'

export async function PayloadRedirect({
  path,
}: {
  path: string
}): Promise<never> {
  const visited = new Set([path])
  let destination = path
  let isPermanent = true
  for (let hop = 0; hop < 10; hop++) {
    const record = await redirectRecord(destination)
    if (!record) {
      if (destination === path) notFound()
      break
    }
    const reference = record.to?.reference
    const next =
      record.to?.type === 'reference' &&
      reference &&
      typeof reference.value === 'object'
        ? (reference.relationTo === 'posts' ? '/insights/' : '/projects/') +
          reference.value.slug
        : record.to?.url
    if (!safeLink(next) || next.startsWith('mailto:') || visited.has(next))
      notFound()
    isPermanent &&= ['301', '308'].includes(record.type || '301')
    visited.add(next)
    destination = next
    if (!localURL(destination)) break
    if (hop === 9) notFound()
  }
  return isPermanent ? permanentRedirect(destination) : redirect(destination)
}
