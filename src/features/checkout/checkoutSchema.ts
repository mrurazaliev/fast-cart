import { z } from 'zod'

export const checkoutSchema = z.object({
  firstName: z.string().trim().min(1, 'Enter your first name.'),
  lastName: z.string().trim().min(1, 'Enter your last name.'),
  streetAddress: z.string().trim().min(1, 'Enter your street address.'),
  apartment: z.string().trim(),
  city: z.string().trim().min(1, 'Enter your town or city.'),
  phoneNumber: z
    .string()
    .trim()
    .min(1, 'Enter your phone number.')
    .refine(
      (value) =>
        /^\+?[\d\s()-]+$/.test(value) &&
        value.replace(/\D/g, '').length >= 7 &&
        value.replace(/\D/g, '').length <= 15,
      'Enter a valid phone number (7–15 digits).',
    ),
  email: z
    .string()
    .trim()
    .min(1, 'Enter your email address.')
    .email('Enter a valid email address.'),
})

export type CheckoutValues = z.infer<typeof checkoutSchema>
