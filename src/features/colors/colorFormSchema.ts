import { z } from 'zod'

export const colorFormSchema = z.object({
  colorName: z.string().trim().min(1, 'Enter a color name.'),
})
export type ColorFormValues = z.infer<typeof colorFormSchema>
