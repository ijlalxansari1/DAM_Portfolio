import { createHmac } from 'node:crypto'
import { sql } from '@payloadcms/db-postgres'
import { NextResponse } from 'next/server'
import { global, payload } from '@/lib/content'
import { enquirySchema } from '@/lib/enquiry'
import { siteURL } from '@/lib/site'

const response = (message: string, status: number) =>
  NextResponse.json(
    { message },
    { status, headers: { 'Cache-Control': 'no-store' } },
  )

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  if (origin !== new URL(siteURL()).origin)
    return response('Submit the enquiry from the portfolio.', 403)
  if (!request.headers.get('content-type')?.startsWith('application/json'))
    return response('Use the enquiry form.', 415)

  const reader = request.body?.getReader()
  if (!reader) return response('Complete the enquiry form.', 400)
  const chunks: Uint8Array[] = []
  let total = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      total += value.byteLength
      if (total > 16_384) {
        await reader.cancel()
        return response('The enquiry is too long.', 413)
      }
      chunks.push(value)
    }
    const parsed = enquirySchema.safeParse(
      JSON.parse(Buffer.concat(chunks).toString('utf8')),
    )
    if (!parsed.success)
      return response(
        'Check your name, email address, subject and message.',
        400,
      )
    if ((await global('contactSettings')).formEnabled === false)
      return response('The enquiry form is currently closed.', 503)
    const cms = await payload()
    const address =
      request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ||
      'local'
    const rateKey = createHmac('sha256', cms.secret)
      .update(address)
      .digest('hex')
    const rate = await cms.db.drizzle.execute(sql`
      INSERT INTO enquiry_limits (client, window_start, count)
      VALUES (${rateKey}, date_trunc('hour', now()), 1)
      ON CONFLICT (client, window_start) DO UPDATE SET count = enquiry_limits.count + 1
      WHERE enquiry_limits.count < 5
      RETURNING count
    `)
    if (!rate.rows.length)
      return response('Too many enquiries. Please try again later.', 429)
    await cms.db.drizzle.execute(
      sql`DELETE FROM enquiry_limits WHERE window_start < now() - interval '24 hours'`,
    )
    const { name, email, subject, message } = parsed.data
    await cms.create({
      collection: 'enquiries',
      data: { name, email, subject, message, status: 'new' },
      depth: 0,
    })
    return response('Your enquiry has been sent.', 201)
  } catch (error) {
    if (error instanceof SyntaxError)
      return response('Complete the enquiry form.', 400)
    console.error(
      'Unable to save enquiry',
      error instanceof Error ? error.name : 'unknown error',
    )
    return response('The enquiry could not be sent. Please try again.', 500)
  }
}
