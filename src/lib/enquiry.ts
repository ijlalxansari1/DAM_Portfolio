import { z } from 'zod'

export const enquirySchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    email: z.email().max(254),
    subject: z.string().trim().min(3).max(140),
    message: z.string().trim().min(10).max(3000),
    website: z.string().max(0).optional(),
  })
  .strict()
