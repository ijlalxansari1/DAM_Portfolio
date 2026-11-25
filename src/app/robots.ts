import type { MetadataRoute } from 'next'
import { indexing } from '@/lib/metadata'
import { absolute } from '@/lib/site'
export default async function robots(): Promise<MetadataRoute.Robots> {
  const allow = await indexing()
  return {
    rules: [
      {
        userAgent: '*',
        allow: allow ? '/' : undefined,
        disallow: allow ? ['/admin', '/api', '/preview'] : '/',
      },
    ],
    sitemap: absolute('/sitemap.xml'),
  }
}
