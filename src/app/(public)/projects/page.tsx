import { EditorialArchive } from '@/components/editorial'
import { pageMetadata } from '@/lib/metadata'
export const generateMetadata = () =>
  pageMetadata('/projects', 'Projects & case studies')
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  return <EditorialArchive kind="projects" query={await searchParams} />
}
