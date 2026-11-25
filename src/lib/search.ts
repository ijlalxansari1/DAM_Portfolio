import { sql } from '@payloadcms/db-postgres'
import { unstable_cache } from 'next/cache'
import { payload } from './content'

export function searchQuery(input: string | string[] | undefined) {
  return (typeof input === 'string' ? input : '').trim().slice(0, 96)
}

export const matchEditorial = unstable_cache(
  async (collection: 'projects' | 'posts', query: string) => {
    const cms = await payload()
    const table = collection === 'projects' ? sql`projects` : sql`posts`
    const result = await cms.db.drizzle.execute(sql`
    SELECT id FROM ${table}, websearch_to_tsquery('english', ${query}) AS terms
    WHERE _status = 'published'
      AND to_tsvector('english', coalesce(title, '') || ' ' || coalesce(excerpt, '')) @@ terms
    ORDER BY ts_rank(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(excerpt, '')), terms) DESC, id
  `)
    return result.rows.map((row) => Number(row.id))
  },
  ['editorial-search'],
  { tags: ['archive-content'], revalidate: 3600 },
)
