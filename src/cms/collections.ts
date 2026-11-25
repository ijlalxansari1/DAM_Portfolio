import { createHash } from 'node:crypto'
import type { CollectionConfig, Field } from 'payload'
import {
  administrator,
  authenticated,
  editor,
  manageRole,
  publicMedia,
  published,
} from './access'
import {
  choices,
  link,
  list,
  longText,
  relationship,
  slugField,
  text,
} from './fields'
import {
  collectionInvalidation,
  drafts,
  invalidatePublic,
  previewPath,
  recordPreviousSlug,
  redirectOldSlug,
} from './publishing'

const publicationFields: Field[] = [
  { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
  {
    name: 'revisedAt',
    type: 'date',
    admin: {
      position: 'sidebar',
      description: 'Set after a significant editorial revision.',
    },
  },
  link('canonicalURL'),
  {
    name: 'noIndex',
    type: 'checkbox',
    defaultValue: false,
    admin: { position: 'sidebar' },
  },
  {
    name: 'lastPublishedSlug',
    type: 'text',
    admin: { hidden: true },
    access: { read: authenticated, create: () => false, update: () => false },
  },
]

const access = {
  read: published,
  create: editor,
  update: editor,
  delete: administrator,
}
const date = (name: string): Field => ({ name, type: 'date' })
const number = (name: string): Field => ({ name, type: 'number' })
const richText = (name: string): Field => ({
  name,
  type: 'richText',
  required: true,
})
const upload = (name: string): Field => ({
  name,
  type: 'upload',
  relationTo: 'media',
})

function catalogue(
  slug: CollectionConfig['slug'],
  group: string,
  fields: Field[],
  title = 'name',
): CollectionConfig {
  return {
    slug,
    access,
    versions: drafts,
    hooks: collectionInvalidation,
    admin: { group, useAsTitle: title },
    fields,
  }
}

function editorial(
  slug: 'projects' | 'posts',
  base: string,
  fields: Field[],
): CollectionConfig {
  return {
    ...catalogue(
      slug,
      'Publishing',
      [text('title', true), slugField, ...fields, ...publicationFields],
      'title',
    ),
    admin: {
      group: 'Publishing',
      useAsTitle: 'title',
      defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
      preview: (doc) =>
        previewPath(slug, typeof doc.slug === 'string' ? doc.slug : undefined),
      livePreview: {
        url: ({ data }) =>
          previewPath(
            slug,
            typeof data.slug === 'string' ? data.slug : undefined,
          ),
      },
    },
    hooks: {
      beforeChange: [recordPreviousSlug(base)],
      afterChange: [
        redirectOldSlug(base),
        async ({ doc, previousDoc, req }) => {
          if (
            doc._status === 'published' ||
            previousDoc?._status === 'published'
          )
            await invalidatePublic(req)
        },
      ],
      afterDelete: collectionInvalidation?.afterDelete,
    },
  }
}

const users: CollectionConfig = {
  slug: 'users',
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    tokenExpiration: 7200,
  },
  admin: { group: 'Administration', useAsTitle: 'name' },
  access: {
    admin: authenticated,
    create: administrator,
    delete: administrator,
    read: ({ req }) =>
      req.user?.role === 'admin' ||
      (req.user ? { id: { equals: req.user.id } } : false),
    update: ({ req }) =>
      req.user?.role === 'admin' ||
      (req.user ? { id: { equals: req.user.id } } : false),
  },
  fields: [
    text('name', true),
    {
      name: 'role',
      type: 'select',
      options: ['admin', 'editor'],
      defaultValue: 'editor',
      required: true,
      access: { create: manageRole, update: manageRole },
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        const { totalDocs } = await req.payload.count({
          collection: 'users',
          req,
          overrideAccess: true,
        })
        if (totalDocs === 0) return { ...data, role: 'admin' }
        return data
      },
    ],
    beforeChange: [
      async ({ data, originalDoc, operation, req }) => {
        if (
          operation === 'update' &&
          originalDoc?.id === req.user?.id &&
          data.role === 'editor'
        ) {
          throw new Error(
            'An administrator cannot remove their own administrator role.',
          )
        }
        return data
      },
    ],
    beforeDelete: [
      ({ id, req }) => {
        if (id === req.user?.id)
          throw new Error(
            'Use another administrator account to remove this account.',
          )
      },
    ],
  },
}

const media: CollectionConfig = {
  slug: 'media',
  access: {
    read: publicMedia,
    create: editor,
    update: editor,
    delete: administrator,
  },
  admin: {
    group: 'Library & taxonomy',
    useAsTitle: 'title',
    defaultColumns: ['title', 'mimeType', 'licence', 'visibility', 'approval'],
  },
  upload: {
    staticDir: '.local/media',
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'application/pdf',
      'audio/mpeg',
      'audio/wav',
      'video/mp4',
      'video/webm',
    ],
    adminThumbnail: 'thumbnail',
    imageSizes: [
      { name: 'thumbnail', width: 480, height: 320, withoutEnlargement: true },
    ],
  },
  hooks: {
    ...collectionInvalidation,
    beforeValidate: [
      ({ data, operation, req }) => {
        if (!data) return data
        if (operation === 'create' && req.user?.id) data.uploader = req.user.id
        const file = req.file
        if (file?.data)
          data.checksum = createHash('sha256').update(file.data).digest('hex')
        return data
      },
    ],
  },
  fields: [
    text('title', true),
    longText('description'),
    {
      ...text('alt'),
      validate: (
        value: unknown,
        { siblingData }: { siblingData: Record<string, unknown> },
      ) =>
        siblingData.visibility !== 'public' ||
        typeof siblingData.mimeType !== 'string' ||
        !siblingData.mimeType.startsWith('image/') ||
        (typeof value === 'string' && Boolean(value.trim())) ||
        'Provide alternative text for a public image.',
    },
    longText('caption'),
    longText('transcript'),
    relationship('keywords', 'tags', true),
    relationship('subjects', 'taxonomyTerms', true),
    text('archiveCollection'),
    relationship('category', 'categories'),
    text('creator'),
    text('copyrightHolder'),
    text('licence', true),
    text('attribution'),
    longText('permittedUsage'),
    date('expiry'),
    { ...text('checksum'), admin: { readOnly: true } },
    {
      ...relationship('uploader', 'users'),
      access: { read: editor },
      admin: { readOnly: true },
    },
    choices('approval', ['pending', 'approved', 'retired'], 'pending'),
    choices(
      'confidentiality',
      ['public', 'internal', 'restricted'],
      'internal',
    ),
    choices('visibility', ['private', 'public'], 'private'),
  ],
}

const projects = editorial('projects', '/projects', [
  longText('excerpt', true),
  relationship('organisation', 'organisations'),
  text('period', true),
  relationship('categories', 'categories', true),
  relationship('tags', 'tags', true),
  relationship('platforms', 'platforms', true),
  relationship('metrics', 'metrics', true),
  upload('cover'),
  longText('challenge', true),
  list('methodology'),
  longText('outcomes', true),
  choices('visual', ['migration', 'workflow', 'archive', 'rights'], 'archive'),
  { name: 'showMigrationDiagram', type: 'checkbox' },
  relationship('related', 'projects', true),
])

const posts = editorial('posts', '/insights', [
  longText('excerpt', true),
  relationship('author', 'authors'),
  relationship('categories', 'categories', true),
  relationship('tags', 'tags', true),
  choices('kind', ['article', 'research'], 'article'),
  upload('cover'),
  richText('body'),
  {
    name: 'references',
    type: 'array',
    fields: [text('label', true), link('url', true)],
  },
  relationship('related', 'posts', true),
])

export const collections: CollectionConfig[] = [
  users,
  projects,
  posts,
  media,
  catalogue('organisations', 'Professional profile', [
    text('name', true),
    slugField,
    upload('logo'),
    link('website'),
    longText('description'),
  ]),
  catalogue(
    'experience',
    'Professional profile',
    [
      text('role', true),
      relationship('organisation', 'organisations'),
      date('start'),
      date('end'),
      text('period', true),
      list('responsibilities'),
      number('sortOrder'),
    ],
    'role',
  ),
  catalogue(
    'education',
    'Professional profile',
    [
      text('degree', true),
      relationship('institution', 'organisations'),
      date('start'),
      date('end'),
      text('period', true),
      text('distinction'),
      longText('highlight'),
      number('sortOrder'),
    ],
    'degree',
  ),
  catalogue('certifications', 'Professional profile', [
    text('name', true),
    text('issuer', true),
    date('date'),
    link('verificationURL'),
  ]),
  catalogue('expertise', 'Professional profile', [
    text('name', true),
    longText('description', true),
    relationship('category', 'categories'),
    relationship('relatedProjects', 'projects', true),
    number('sortOrder'),
  ]),
  catalogue('platforms', 'Professional profile', [
    text('name', true),
    slugField,
    choices('proficiency', ['expert', 'working knowledge', 'standard', 'tool']),
    text('category', true),
    relationship('relatedProjects', 'projects', true),
  ]),
  catalogue('metrics', 'Professional profile', [
    text('name', true),
    slugField,
    number('value'),
    text('unit'),
    text('display', true),
    longText('context'),
    text('source', true),
    relationship('project', 'projects'),
  ]),
  catalogue('categories', 'Library & taxonomy', [
    text('name', true),
    slugField,
    longText('description', true),
  ]),
  catalogue('tags', 'Library & taxonomy', [
    text('name', true),
    slugField,
    relationship('relatedTerms', 'taxonomyTerms', true),
  ]),
  catalogue('authors', 'Publishing', [
    text('name', true),
    slugField,
    longText('biography'),
    upload('portrait'),
  ]),
  catalogue(
    'labAssets',
    'DAM Lab',
    [
      text('title', true),
      slugField,
      text('recordId', true),
      text('archiveCollection', true),
      longText('description', true),
      choices('kind', ['Image', 'Document', 'Audio', 'Video'], 'Image'),
      choices(
        'visual',
        ['ridge', 'field', 'folio', 'sound', 'pattern', 'water'],
        'folio',
      ),
      text('creator'),
      text('rightsHolder'),
      text('licence'),
      date('expiry'),
      text('language'),
      relationship('subjects', 'taxonomyTerms', true),
      choices(
        'state',
        ['Intake', 'Review', 'Approved', 'Restricted'],
        'Intake',
      ),
      list('channels'),
    ],
    'title',
  ),
  catalogue('taxonomyTerms', 'DAM Lab', [
    text('name', true),
    slugField,
    longText('description'),
    list('synonyms'),
    relationship('parent', 'taxonomyTerms'),
    relationship('relatedTerms', 'taxonomyTerms', true),
  ]),
  catalogue('labWorkflows', 'DAM Lab', [
    text('name', true),
    slugField,
    longText('description'),
    {
      name: 'stages',
      type: 'array',
      fields: [
        text('name', true),
        longText('description'),
        list('requirements'),
        list('transitions', 'target'),
      ],
    },
  ]),
  {
    slug: 'enquiries',
    admin: {
      group: 'Administration',
      useAsTitle: 'subject',
      defaultColumns: ['subject', 'status', 'createdAt'],
    },
    access: {
      create: () => false,
      read: administrator,
      update: administrator,
      delete: administrator,
    },
    fields: [
      text('name', true),
      { name: 'email', type: 'email', required: true },
      text('subject', true),
      longText('message', true),
      choices('status', ['new', 'reviewed', 'closed'], 'new'),
      {
        ...text('rateKey'),
        access: { read: () => false },
        admin: { hidden: true },
      },
    ],
  },
]
