import { z } from 'zod'

export const loginSchema = z.object({
  userName: z.string().trim().min(1, 'Enter your username.'),
  password: z.string().min(1, 'Enter your password.'),
})

export const registerSchema = loginSchema
  .extend({
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
      .min(1, 'Enter your email.')
      .email('Enter a valid email.'),
    confirmPassword: z.string().min(1, 'Confirm your password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>
