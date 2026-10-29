import { z } from 'zod'

export const brandFormSchema = z.object({
  brandName: z.string().trim().min(1, 'Enter a brand name.'),
})
export type BrandFormValues = z.infer<typeof brandFormSchema>
