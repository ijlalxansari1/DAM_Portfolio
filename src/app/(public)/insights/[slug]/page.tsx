import { Insight, editorialMetadata } from '@/components/editorial'
import { PayloadRedirect } from '@/components/payload-redirect'
import { entry } from '@/lib/content'
type Props = { params: Promise<{ slug: string }> }
export const revalidate = 3600
export const generateStaticParams = () => []
export const generateMetadata = async ({ params }: Props) =>
  editorialMetadata('posts', (await params).slug)
export default async function Page({ params }: Props) {
  const { slug } = await params
  const post = await entry('posts', slug)
  return post ? (
    <Insight post={post} />
  ) : (
    <PayloadRedirect path={'/insights/' + slug} />
  )
}
