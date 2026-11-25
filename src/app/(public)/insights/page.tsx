import { EditorialArchive } from '@/components/editorial'
import { pageMetadata } from '@/lib/metadata'
export const generateMetadata = () => pageMetadata('/insights', 'Insights')
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  return <EditorialArchive kind="posts" query={await searchParams} />
}
