import Link from 'next/link'
import { Button } from '@/components/ui/button'
export default function Page() {
  return (
    <section className="wrap route-head">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p>The requested record may have moved or been removed.</p>
      <Button asChild>
        <Link href="/">Return to the archive</Link>
      </Button>
    </section>
  )
}
