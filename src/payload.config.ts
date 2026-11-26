import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { administrator, editor } from '@/cms/access'
import { collections } from '@/cms/collections'
import { globals } from '@/cms/globals'
import { collectionInvalidation } from '@/cms/publishing'
import { archive, localURL, siteURL } from '@/lib/site'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const {
  DATABASE_URL,
  PAYLOAD_SECRET,
  BLOB_READ_WRITE_TOKEN,
} = process.env
const blobConfigured = Boolean(BLOB_READ_WRITE_TOKEN)

if (
  process.env.VERCEL &&
  (!DATABASE_URL || !PAYLOAD_SECRET || !blobConfigured || !process.env.SITE_URL)
) {
  throw new Error(
    'Set DATABASE_URL, PAYLOAD_SECRET, SITE_URL and BLOB_READ_WRITE_TOKEN before deploying.',
  )
}

export default buildConfig({
  secret: PAYLOAD_SECRET || '',
  telemetry: false,
  serverURL: siteURL(),
  admin: {
    user: 'users',
    importMap: { baseDir: dirname, autoGenerate: false },
    components: {
      graphics: {
        Icon: '/components/admin/brand#ArchiveIcon',
        Logo: '/components/admin/brand#ArchiveLogo',
      },
      views: {
        dashboard: { Component: '/components/admin/dashboard#Dashboard' },
      },
    },
    meta: { titleSuffix: ' · The Intelligent Archive' },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections,
  globals,
  db: postgresAdapter({
    pool: { connectionString: DATABASE_URL, max: 5 },
    push: false,
    migrationDir: path.join(dirname, 'migrations'),
  }),
  editor: lexicalEditor(),
  ...(process.env.VERCEL && {
    email: () => ({
      name: 'unconfigured',
      defaultFromAddress: 'archive@invalid.example',
      defaultFromName: archive.name,
      sendEmail: async () => {
        throw new Error(
          'Password recovery requires a configured transactional email adapter.',
        )
      },
    }),
  }),
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
    autoGenerate: false,
  },
  graphQL: { disable: true, disablePlaygroundInProduction: true },
  upload: { limits: { fileSize: (blobConfigured ? 30 : 3) * 1024 * 1024 } },
  plugins: [
    seoPlugin({
      collections: ['projects', 'posts'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) =>
        doc?.title ? `${doc.title} | ${archive.name}` : archive.name,
      generateDescription: ({ doc }) => doc?.excerpt ?? archive.description,
      generateURL: ({ collectionSlug, doc }) =>
        `${siteURL()}/${collectionSlug === 'posts' ? 'insights' : 'projects'}/${doc?.slug}`,
      tabbedUI: true,
    }),
    redirectsPlugin({
      collections: ['projects', 'posts'],
      redirectTypes: ['301', '302', '307', '308'],
      overrides: {
        access: {
          read: editor,
          create: editor,
          update: editor,
          delete: administrator,
        },
        admin: { group: 'Publishing' },
        hooks: collectionInvalidation,
        fields: ({ defaultFields }) =>
          defaultFields.map((field) => {
            if (
              'name' in field &&
              field.name === 'from' &&
              field.type === 'text'
            ) {
              return {
                ...field,
                validate: (value: unknown) =>
                  (localURL(value) && /^\/[^?#]+$/.test(value)) ||
                  'Enter an internal path without a query or fragment.',
              }
            }
            return field
          }),
      },
      redirectTypeFieldOverride: { defaultValue: '301' },
    }),
    vercelBlobStorage({
      enabled: blobConfigured,
      alwaysInsertFields: true,
      addRandomSuffix: true,
      clientUploads: {
        access: ({ req }) =>
          req.user?.role === 'admin' || req.user?.role === 'editor',
      },
      token: BLOB_READ_WRITE_TOKEN,
      collections: { media: { prefix: 'archive' } },
    }),
  ],
})
