import type {
  CollectionSlug,
  Field,
  RelationshipField,
  TextField,
} from 'payload'
import { localURL, safeLink } from '@/lib/site'

export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function slugify(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export const slugField: TextField = {
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'Generated from the title when left empty.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => value || slugify(data?.title || data?.name || ''),
    ],
  },
  validate: (value: unknown) =>
    (typeof value === 'string' && slugPattern.test(value)) ||
    'Use lower-case letters, numbers and single hyphens.',
}

export const text = (name: string, required = false): TextField => ({
  name,
  type: 'text',
  required,
})
export const longText = (name: string, required = false): Field => ({
  name,
  type: 'textarea',
  required,
})
export const relationship = (
  name: string,
  relationTo: CollectionSlug,
  hasMany = false,
): RelationshipField =>
  hasMany
    ? { name, type: 'relationship', relationTo, hasMany: true }
    : { name, type: 'relationship', relationTo }
export const choices = (
  name: string,
  options: string[],
  defaultValue?: string,
): Field => ({ name, type: 'select', options, defaultValue })
export const link = (
  name: string,
  required = false,
  local = false,
): TextField => ({
  name,
  type: 'text',
  required,
  validate: (value: unknown) =>
    !value ||
    (local ? localURL(value) : safeLink(value)) ||
    'Enter a rooted site path, an HTTPS link or an email link.',
})

export const list = (name: string, key = 'text'): Field => ({
  name,
  type: 'array',
  fields: [text(key, true)],
})
