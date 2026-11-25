import Link from 'next/link'
import { global } from '@/lib/content'
import { pageMetadata } from '@/lib/metadata'

export const generateMetadata = () =>
  pageMetadata(
    '/privacy',
    'Privacy',
    'How the portfolio handles enquiries, analytics and the DAM Lab.',
  )
export default async function Page() {
  const [site, contact] = await Promise.all([
    global('siteSettings'),
    global('contactSettings'),
  ])
  return (
    <article className="wrap detail-page">
      <div className="route-head">
        <p className="eyebrow">Site information</p>
        <h1>Privacy</h1>
        <p>
          {site.privacyIntro ||
            'How information is handled when you use the portfolio.'}
        </p>
      </div>
      <div className="prose privacy-prose">
        <h2>Enquiries</h2>
        <p>
          If you submit the enquiry form, the site stores your name, email
          address, subject and message so the portfolio administrator can review
          and respond. The site also uses a short, pseudonymous rate-limit
          identifier to control automated submissions.
        </p>
        <h2>DAM Lab</h2>
        <p>
          The Lab uses demonstration records. Changes you make during a
          simulation are held in the current page session and are cleared when
          you reload or leave it.
        </p>
        <h2>Analytics and sessions</h2>
        <p>
          The production site uses Vercel Analytics to measure visits and Speed
          Insights to assess page performance. The administration and preview
          routes use session cookies to control authorised access.
        </p>
        <h2>Contact</h2>
        <p>
          For questions about an enquiry or information you shared,{' '}
          {contact.publicEmail ? (
            <a href={'mailto:' + contact.publicEmail}>
              email the portfolio administrator
            </a>
          ) : (
            <Link href="/#contact">use the contact section</Link>
          )}
          .
        </p>
      </div>
    </article>
  )
}
