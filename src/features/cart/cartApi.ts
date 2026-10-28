import { z } from 'zod'
import { api } from '@/shared/api/client'
import { productSchema } from '@/features/products/productsApi'
import { hasValidDiscount } from '@/shared/productPrice'

const cartLineSchema = z.object({
  id: z.number().int().positive(),
  quantity: z.number().int().positive(),
  product: productSchema.extend({
    quantity: z.number().int().nonnegative().nullish(),
    color: z.string().nullish(),
  }),
})

const cartResponseSchema = z.object({
  data: z
    .array(
      z.object({
        productsInCart: z.array(cartLineSchema),
        totalProducts: z.number().int().nonnegative(),
        totalPrice: z.number().nonnegative(),
        totalDiscountPrice: z.number().nonnegative(),
      }),
    )
    .length(1),
  errors: z.array(z.unknown()).length(0),
  statusCode: z.literal(200),
})

const mutationSchema = z.object({
  errors: z.array(z.unknown()).length(0),
  statusCode: z.literal(200),
})

export type CartLine = z.infer<typeof cartLineSchema>
export type Cart = {
  items: CartLine[]
  totalProducts: number
  totalPrice: number
  totalDiscountPrice: number
  total: number
}

let sessionController = new AbortController()

export const cancelCartRequests = () => {
  sessionController.abort()
  sessionController = new AbortController()
}

export const getCartSignal = (signal: AbortSignal) =>
  AbortSignal.any([signal, sessionController.signal])

export const getCart = async (signal: AbortSignal): Promise<Cart> => {
  const response = await api.get<unknown>('/Cart/get-products-from-cart', {
    signal,
  })
  const result = cartResponseSchema.safeParse(response.data)
  const group = result.success ? result.data.data[0] : undefined
  if (!group) throw new Error('Unable to read the cart. Please try again.')
  const total = group.productsInCart.reduce((sum, line) => {
    const price = hasValidDiscount(line.product)
      ? line.product.discountPrice
      : line.product.price
    return sum + price * line.quantity
  }, 0)
  return {
    items: group.productsInCart,
    totalProducts: group.totalProducts,
    totalPrice: group.totalPrice,
    totalDiscountPrice: group.totalDiscountPrice,
    total: Math.round(total * 100) / 100,
  }
}

const mutate = async (
  method: 'post' | 'put' | 'delete',
  path: string,
  signal: AbortSignal,
  id?: number,
) => {
  const response = await api.request<unknown>({
    method,
    url: `/Cart/${path}`,
    params: id === undefined ? undefined : { id },
    signal,
  })
  if (!mutationSchema.safeParse(response.data).success)
    throw new Error(
      'The server did not confirm the cart change. Refresh the cart before trying again.',
    )
}

export const addCartProduct = (productId: number, signal: AbortSignal) =>
  mutate('post', 'add-product-to-cart', signal, productId)
export const increaseCartLine = (lineId: number, signal: AbortSignal) =>
  mutate('put', 'increase-product-in-cart', signal, lineId)
export const reduceCartLine = (lineId: number, signal: AbortSignal) =>
  mutate('put', 'reduce-product-in-cart', signal, lineId)
export const removeCartLine = (lineId: number, signal: AbortSignal) =>
  mutate('delete', 'delete-product-from-cart', signal, lineId)
export const clearServerCart = (signal: AbortSignal) =>
  mutate('delete', 'clear-cart', signal)
