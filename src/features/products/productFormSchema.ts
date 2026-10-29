import { z } from 'zod'

const idSchema = z.number().int().positive('Choose an option.').max(2147483647)

export const productFormSchema = z
  .object({
    productName: z.string().trim().min(1, 'Enter a product name.').max(100),
    code: z.string().trim().min(1, 'Enter a product code.'),
    description: z.string().trim().min(1, 'Enter a description.').max(500),
    price: z.number().finite().nonnegative('Price cannot be negative.'),
    quantity: z
      .number()
      .int('Use a whole number.')
      .nonnegative()
      .max(2147483647),
    categoryId: idSchema,
    subCategoryId: idSchema,
    brandId: idSchema,
    colorId: idSchema,
    hasDiscount: z.boolean(),
    discountPrice: z.number().finite().nonnegative().nullable(),
    size: z.string().trim(),
    weight: z.string().trim(),
    newImages: z.array(
      z
        .instanceof(File)
        .refine((file) => file.size > 0, 'Choose a non-empty image.')
        .refine(
          (file) => !file.type || file.type.startsWith('image/'),
          'Choose image files.',
        ),
    ),
  })
  .superRefine((values, context) => {
    if (
      values.hasDiscount &&
      (values.discountPrice === null || values.discountPrice >= values.price)
    ) {
      context.addIssue({
        code: 'custom',
        path: ['discountPrice'],
        message: 'Enter a discounted price below the regular price.',
      })
    }
  })

export const createProductSchema = productFormSchema.refine(
  (values) => values.newImages.length > 0,
  { path: ['newImages'], message: 'Choose at least one image.' },
)

export type ProductFormValues = z.infer<typeof productFormSchema>

export const emptyProductValues: ProductFormValues = {
  productName: '',
  code: '',
  description: '',
  price: 0,
  quantity: 0,
  categoryId: 0,
  subCategoryId: 0,
  brandId: 0,
  colorId: 0,
  hasDiscount: false,
  discountPrice: null,
  size: '',
  weight: '',
  newImages: [],
}
