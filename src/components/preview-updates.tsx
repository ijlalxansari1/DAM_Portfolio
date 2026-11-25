'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function PreviewUpdates() {
  const router = useRouter()
  useEffect(() => {
    if (window.parent === window) return
    const origin = window.location.origin
    const listener = (event: MessageEvent) => {
      if (
        event.origin === origin &&
        event.source === window.parent &&
        event.data?.type === 'payload-document-event'
      )
        router.refresh()
    }
    window.addEventListener('message', listener)
    window.parent.postMessage(
      { type: 'payload-live-preview', ready: true },
      origin,
    )
    return () => window.removeEventListener('message', listener)
  }, [router])
  return null
}
