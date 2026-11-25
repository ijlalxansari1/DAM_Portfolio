import { headers } from 'next/headers'
import { payload } from './content'
import { slugPattern } from '@/cms/fields'

export const previewKind = (
  value: string | null,
): value is 'homepage' | 'projects' | 'posts' =>
  value === 'homepage' || value === 'projects' || value === 'posts'

export function previewDestination(kind: string | null, slug: string | null) {
  if (!previewKind(kind)) return null
  if (kind === 'homepage') return '/preview/homepage'
  return slug && slugPattern.test(slug) ? '/preview/' + kind + '/' + slug : null
}

export async function previewUser() {
  const cms = await payload()
  const { user } = await cms.auth({ headers: await headers() })
  return user && ['admin', 'editor'].includes(user.role) ? user : null
}
