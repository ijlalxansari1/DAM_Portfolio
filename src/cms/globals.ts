import type { Block, Field, GlobalConfig } from 'payload'
import { administrator, editor } from './access'
import { choices, link, longText, relationship, text } from './fields'
import { globalInvalidation, previewPath } from './publishing'
import { archive, navigation, sectionDefinitions } from '@/lib/site'

const links: Field = {
  name: 'links',
  type: 'array',
  fields: [text('label', true), link('href', true)],
}
const blocks: Block[] = sectionDefinitions.map(({ slug, label }) => ({
  slug,
  labels: { singular: label, plural: label },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
      admin: { readOnly: slug === 'hero' || slug === 'contact' },
    },
    text('eyebrow'),
    text('heading'),
    longText('description'),
    text('ctaLabel'),
    link('ctaHref'),
    ...(['featured', 'projects'].includes(slug)
      ? [relationship('projects', 'projects', slug === 'projects')]
      : []),
    ...(slug === 'impact' ? [relationship('metrics', 'metrics', true)] : []),
    ...(slug === 'insights' ? [relationship('posts', 'posts', true)] : []),
    ...(slug === 'expertise'
      ? [relationship('expertise', 'expertise', true)]
      : []),
    ...(slug === 'hero'
      ? [
          text('secondaryLabel'),
          link('secondaryHref'),
          choices('layout', ['balanced', 'wide-diagram'], 'balanced'),
        ]
      : []),
  ],
}))

function global(
  slug: GlobalConfig['slug'],
  label: string,
  fields: Field[],
  adminOnly = false,
): GlobalConfig {
  return {
    slug,
    label,
    fields,
    hooks: globalInvalidation,
    admin: { group: 'Site configuration' },
    access: {
      read: adminOnly ? administrator : () => true,
      update: adminOnly ? administrator : editor,
    },
  }
}

export const globals: GlobalConfig[] = [
  {
    ...global('homepage', 'Homepage sections', [
      {
        name: 'sections',
        type: 'blocks',
        blocks,
        required: true,
        validate: (value) => {
          if (
            !Array.isArray(value) ||
            value[0]?.blockType !== 'hero' ||
            value[0].enabled === false
          )
            return 'Keep an enabled hero first.'
          const types = value.map((section) => section.blockType)
          if (new Set(types).size !== types.length)
            return 'Use each section at most once.'
          if (
            !value.some(
              (section) =>
                section.blockType === 'contact' && section.enabled !== false,
            )
          )
            return 'Keep an enabled contact section.'
          return true
        },
      },
    ]),
    versions: { drafts: true, max: 30 },
    admin: {
      group: 'Site configuration',
      preview: () => previewPath('homepage'),
      livePreview: { url: () => previewPath('homepage') },
    },
  },
  global('profile', 'Professional profile', [
    { ...text('name', true), defaultValue: archive.person },
    { ...text('title', true), defaultValue: archive.positioning },
    { ...text('location', true), defaultValue: archive.location },
    longText('biography'),
    { name: 'portrait', type: 'upload', relationTo: 'media' },
    { name: 'cv', type: 'upload', relationTo: 'media' },
  ]),
  global('header', 'Header and navigation', [
    { ...text('name', true), defaultValue: archive.person },
    { ...text('subtitle'), defaultValue: archive.name },
    { ...links, defaultValue: navigation },
    { ...text('ctaLabel', true), defaultValue: 'Get in touch' },
    { ...link('ctaHref', true), defaultValue: '/#contact' },
    link('linkedinURL'),
    link('githubURL'),
    link('whatsappURL'),
  ]),
  global('footer', 'Footer', [text('name'), text('descriptor'), links]),
  global('siteSettings', 'Site settings', [
    text('name', true),
    longText('description'),
    longText('privacyIntro'),
  ]),
  global('seoSettings', 'SEO defaults', [
    text('defaultTitle'),
    longText('defaultDescription'),
    { name: 'socialImage', type: 'upload', relationTo: 'media' },
    { name: 'allowIndexing', type: 'checkbox', defaultValue: true },
    text('googleVerification'),
  ]),
  global('labSettings', 'Lab settings', [
    text('title', true),
    longText('description'),
    longText('datasetNotice'),
    choices('defaultView', ['library', 'taxonomy', 'workflow'], 'library'),
  ]),
  global('contactSettings', 'Contact settings', [
    text('enquiryHeading'),
    longText('enquiryDescription'),
    { name: 'formEnabled', type: 'checkbox', defaultValue: true },
    { name: 'publicEmail', type: 'email' },
    link('professionalURL'),
  ]),
]
