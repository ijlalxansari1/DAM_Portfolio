import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { draftEntry } from '@/lib/content'
import { previewDestination, previewUser } from '@/lib/preview'
import { CaseStudy, Insight } from '@/components/editorial'
import { HomepageContent } from '@/components/homepage'
import { PreviewUpdates } from '@/components/preview-updates'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Draft preview',
  robots: { index: false, follow: false },
}
export default async function Page({
  params,
}: {
  params: Promise<{ preview: string[] }>
}) {
  const {
    preview: [kind, slug, ...rest],
  } = await params
  const draft = await draftMode()
  if (
    !draft.isEnabled ||
    rest.length ||
    !previewDestination(kind, slug || null)
  )
    notFound()
  const user = await previewUser()
  if (!user) notFound()
  const bar = (
    <div className="preview-bar">
      <span>Draft preview</span>
      <form action="/api/exit-preview" method="get">
        <button type="submit">Exit preview</button>
      </form>
      <PreviewUpdates />
    </div>
  )
  if (kind === 'homepage')
    return (
      <>
        {bar}
        <HomepageContent previewUser={user} />
      </>
    )
  if (kind !== 'projects' && kind !== 'posts') notFound()
  const item = await draftEntry(kind, slug, user)
  if (!item) notFound()
  return (
    <>
      {bar}
      {'challenge' in item ? (
        <CaseStudy project={item} preview />
      ) : (
        <Insight post={item} preview />
      )}
    </>
  )
}
