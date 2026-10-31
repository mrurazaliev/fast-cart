import { z } from 'zod'
import type { Cart } from '@/features/cart/cartApi'
import { checkoutSchema } from './checkoutSchema'
import type { CheckoutValues } from './checkoutSchema'
import { hasValidDiscount } from '@/shared/productPrice'

const localOrderSchema = z.object({
  id: z.string().startsWith('LOCAL-'),
  createdAt: z.iso.datetime(),
  billing: checkoutSchema,
  items: z
    .array(
      z.object({
        productId: z.number(),
        name: z.string(),
        quantity: z.number().int().positive(),
        unitPrice: z.number().finite().nonnegative(),
      }),
    )
    .min(1),
  total: z.number().finite().nonnegative(),
})

export type LocalOrder = z.infer<typeof localOrderSchema>

const getOrderKey = (userName: string) =>
  `fastcart-local-order-v1:${encodeURIComponent(userName.toLowerCase())}`

export const readLocalOrder = (userName: string): LocalOrder | null => {
  try {
    const result = localOrderSchema.safeParse(
      JSON.parse(localStorage.getItem(getOrderKey(userName)) || 'null'),
    )
    return result.success ? result.data : null
  } catch {
    return null
  }
}

export const createLocalOrder = (
  billing: CheckoutValues,
  cart: Cart,
): LocalOrder =>
  localOrderSchema.parse({
    id: `LOCAL-${Date.now().toString(36)}-${crypto.getRandomValues(new Uint32Array(1)).join('')}`,
    createdAt: new Date().toISOString(),
    billing,
    items: cart.items.map((line) => ({
      productId: line.product.id,
      name: line.product.productName,
      quantity: line.quantity,
      unitPrice: hasValidDiscount(line.product)
        ? line.product.discountPrice
        : line.product.price,
    })),
    total: cart.total,
  })

export const saveLocalOrder = (userName: string, order: LocalOrder) => {
  try {
    localStorage.setItem(getOrderKey(userName), JSON.stringify(order))
  } catch {
    throw new Error(
      'Unable to save in this browser. Allow browser storage and try again. Nothing was submitted.',
    )
  }
}

export const deleteLocalOrder = (userName: string) => {
  try {
    localStorage.removeItem(getOrderKey(userName))
  } catch {
    throw new Error(
      'Unable to delete the local order. Allow browser storage and try again.',
    )
  }
}
