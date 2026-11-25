import type { Access, FieldAccess, PayloadRequest, Where } from 'payload'

export const administrator: Access = ({ req }) => req.user?.role === 'admin'
export const editor = ({ req }: { req: PayloadRequest }) =>
  ['admin', 'editor'].includes(req.user?.role || '')
export const manageRole: FieldAccess = ({ req }) => req.user?.role === 'admin'
export const authenticated = ({ req }: { req: PayloadRequest }) =>
  Boolean(req.user)
export const published: Access = ({ req }) =>
  req.user ? true : { _status: { equals: 'published' } }

export const publicMedia: Access = ({ req }) => {
  if (req.user) return true
  const where: Where = {
    and: [
      { visibility: { equals: 'public' } },
      { approval: { equals: 'approved' } },
      { confidentiality: { equals: 'public' } },
      {
        or: [
          { expiry: { exists: false } },
          { expiry: { greater_than: new Date().toISOString() } },
        ],
      },
    ],
  }
  return where
}
