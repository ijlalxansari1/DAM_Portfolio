import { PayloadRedirect } from '@/components/payload-redirect'

export const metadata = { robots: { index: false, follow: false } }
export const revalidate = 3600
export const generateStaticParams = () => []
export default async function Page({
  params,
}: {
  params: Promise<{ path: string[] }>
}) {
  return <PayloadRedirect path={'/' + (await params).path.join('/')} />
}
