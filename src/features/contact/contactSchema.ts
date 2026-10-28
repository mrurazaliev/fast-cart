import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name.'),
  email: z.string().trim().email('Enter a valid email address.'),
  phone: z.string().trim(),
  message: z.string().trim().min(1, 'Enter your message.'),
})

export type ContactValues = z.infer<typeof contactSchema>
