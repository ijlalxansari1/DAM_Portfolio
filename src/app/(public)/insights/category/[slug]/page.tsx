import { EditorialArchive } from '@/components/editorial'
import { catalogue } from '@/lib/content'
import { pageMetadata } from '@/lib/metadata'
type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const topic = (await catalogue('categories', 'name')).find(
    (category) => category.slug === slug,
  )
  return pageMetadata(
    '/insights/category/' + slug,
    topic?.name || 'Topic not found',
    topic?.description,
  )
}
export default async function Page({ params, searchParams }: Props) {
  const [{ slug }, query] = await Promise.all([params, searchParams])
  return <EditorialArchive kind="posts" categorySlug={slug} query={query} />
}
