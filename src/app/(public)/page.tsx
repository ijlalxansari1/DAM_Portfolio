import { HomepageContent } from '@/components/homepage'
import { pageMetadata } from '@/lib/metadata'

export const revalidate = 3600
export const generateMetadata = () => pageMetadata('/')
export default function Page() {
  return <HomepageContent />
}
