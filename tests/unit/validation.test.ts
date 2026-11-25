import { expect, it } from 'vitest'
import { enquirySchema } from '../../src/lib/enquiry'
import { localURL, safeLink } from '../../src/lib/site'

it('allows only supported navigation links', () => {
  expect(localURL('/#work')).toBe(true)
  expect(localURL('//example.com')).toBe(false)
  expect(localURL('/\\example.com')).toBe(false)
  expect(safeLink('javascript:alert(1)')).toBe(false)
  expect(safeLink('https://example.com/path')).toBe(true)
})

it('validates enquiries and rejects automated honeypot data', () => {
  const valid = {
    name: 'Test Reader',
    email: 'test@example.com',
    subject: 'Portfolio',
    message: 'A sample enquiry.',
  }
  expect(enquirySchema.safeParse(valid).success).toBe(true)
  expect(enquirySchema.safeParse({ ...valid, website: 'bot' }).success).toBe(
    false,
  )
  expect(enquirySchema.safeParse({ ...valid, email: 'invalid' }).success).toBe(
    false,
  )
})
