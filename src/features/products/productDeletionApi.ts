import { z } from 'zod'
import { api } from '@/shared/api/client'
import { ApiError } from '@/shared/api/types'
import { isProductMutationConfirmed } from './productFormApi'

export type DeletionProduct = { id: number; productName: string }
export type ProductDeletionResult = {
  deleted: DeletionProduct[]
  absent: DeletionProduct[]
  failed: { product: DeletionProduct; message: string }[]
  uncertain: DeletionProduct[]
  notAttempted: DeletionProduct[]
  stopReason: string | null
}

const presenceSchema = z.object({
  data: z.object({ id: z.number().int().positive() }),
})

const getProductPresence = async (id: number, signal: AbortSignal) => {
  signal.throwIfAborted()
  try {
    const response = await api.get<unknown>('/Product/get-product-by-id', {
      params: { id },
      signal,
    })
    signal.throwIfAborted()
    if (response.status === 204) return false
    const parsed = presenceSchema.safeParse(response.data)
    if (!parsed.success || parsed.data.data.id !== id)
      throw new Error('Unable to verify this product on the server.')
    return true
  } catch (error) {
    if (!signal.aborted && error instanceof ApiError && error.status === 404)
      return false
    throw error
  }
}

const getDeletionError = (error: unknown) => {
  if (error instanceof ApiError && error.status === 401)
    return 'Please sign in again before deleting products.'
  if (error instanceof ApiError && error.status === 403)
    return 'You do not have permission to delete this product.'
  return error instanceof Error
    ? error.message
    : 'Unable to delete this product.'
}

export const deleteProducts = async (
  products: DeletionProduct[],
  signal: AbortSignal,
): Promise<ProductDeletionResult> => {
  const targets = products.filter(
    (product, index) =>
      products.findIndex((item) => item.id === product.id) === index,
  )
  if (
    targets.some(
      (product) =>
        !Number.isInteger(product.id) ||
        product.id <= 0 ||
        product.id > 2147483647,
    )
  )
    throw new Error('Invalid product ID. Reload the product list.')
  const result: ProductDeletionResult = {
    deleted: [],
    absent: [],
    failed: [],
    uncertain: [],
    notAttempted: [],
    stopReason: null,
  }
  for (const [index, product] of targets.entries()) {
    if (signal.aborted) {
      result.notAttempted.push(...targets.slice(index))
      break
    }
    let deleteStarted = false
    try {
      if (!(await getProductPresence(product.id, signal))) {
        result.absent.push(product)
        continue
      }
      signal.throwIfAborted()
      deleteStarted = true
      const response = await api.delete<unknown>('/Product/delete-product', {
        params: { id: product.id },
        signal,
      })
      if (isProductMutationConfirmed(response.data)) {
        result.deleted.push(product)
        continue
      }
      throw new Error('The server did not confirm deletion.')
    } catch (error) {
      const status = error instanceof ApiError ? error.status : undefined
      const definiteFailure =
        status !== undefined && status >= 400 && status < 500 && status !== 408
      if (!deleteStarted || definiteFailure) {
        result.failed.push({
          product,
          message: signal.aborted
            ? 'The session changed or the operation was stopped.'
            : getDeletionError(error),
        })
      } else {
        try {
          const exists = await getProductPresence(product.id, signal)
          if (exists)
            result.failed.push({
              product,
              message:
                'The request was not confirmed. The server still lists this product; it has not been retried.',
            })
          else result.absent.push(product)
        } catch (verificationError) {
          result.uncertain.push(product)
          result.stopReason = signal.aborted
            ? 'The session changed or the operation was stopped.'
            : getDeletionError(verificationError)
          result.notAttempted.push(...targets.slice(index + 1))
          break
        }
      }
      if (signal.aborted || status === 401 || status === 403) {
        result.notAttempted.push(...targets.slice(index + 1))
        break
      }
    }
  }
  return result
}
