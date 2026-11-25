import { getPayload } from 'payload'
import { z } from 'zod'
import config from '../src/payload.config'

const supplied = z
  .object({
    email: z.email(),
    password: z.string().min(16),
    name: z.string().trim().min(2),
  })
  .safeParse({
    email: process.env.INITIAL_ADMIN_EMAIL,
    password: process.env.INITIAL_ADMIN_PASSWORD,
    name: process.env.INITIAL_ADMIN_NAME || 'Portfolio Administrator',
  })

if (!supplied.success)
  throw new Error(
    'Set INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD (16 characters or more).',
  )

const payload = await getPayload({ config })
try {
  if ((await payload.count({ collection: 'users' })).totalDocs)
    throw new Error('The database already contains an administration account.')
  await payload.create({
    collection: 'users',
    data: { ...supplied.data, role: 'admin' },
  })
} finally {
  await payload.db.pool.end()
  await payload.destroy()
}
process.stdout.write('Created the initial administrator.\n', () =>
  process.exit(0),
)
