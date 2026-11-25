import { draftMode } from 'next/headers'
import { previewDestination, previewUser } from '@/lib/preview'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const destination = previewDestination(
    url.searchParams.get('kind'),
    url.searchParams.get('slug'),
  )
  if (!destination)
    return new Response('Invalid preview target.', { status: 400 })
  if (!(await previewUser()))
    return new Response('Sign in to Payload to preview content.', {
      status: 401,
    })
  const draft = await draftMode()
  draft.enable()
  return new Response(null, {
    status: 307,
    headers: { Location: destination, 'Cache-Control': 'private, no-store' },
  })
}
