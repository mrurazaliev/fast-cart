import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'
import { loggedOut, sessionStarted } from '@/features/auth/authSlice'
import { getAuthErrors } from '@/features/auth/authApi'
import { removeFromWishlist } from '@/features/wishlist/wishlistSlice'
import {
  addCartProduct,
  clearServerCart,
  getCart,
  getCartSignal,
  increaseCartLine,
  reduceCartLine,
  removeCartLine,
} from '@/features/cart/cartApi'
import type { Cart } from '@/features/cart/cartApi'

type CartOperation =
  | {
      type: 'add'
      productId: number
      quantity?: number
      moveFromWishlist?: boolean
    }
  | { type: 'increase' | 'reduce' | 'remove'; lineId: number }
  | { type: 'clear' }
  | { type: 'moveWishlist' }

type CartResult = {
  cart: Cart | null
  confirmed: number
  requested: number
  errors: string[]
  message: string | null
}

type CartState = Cart & {
  status: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | null
  mutating: boolean
  mutationError: string | null
  message: string | null
  fetchRequestId: string | null
  mutationRequestId: string | null
  operation: CartOperation | null
}

const initialState: CartState = {
  items: [],
  totalProducts: 0,
  totalPrice: 0,
  totalDiscountPrice: 0,
  total: 0,
  status: 'idle',
  error: null,
  mutating: false,
  mutationError: null,
  message: null,
  fetchRequestId: null,
  mutationRequestId: null,
  operation: null,
}

export const fetchCart = createAsyncThunk<
  Cart,
  void,
  { state: RootState; rejectValue: string }
>(
  'cart/fetch',
  async (_, { signal, rejectWithValue }) => {
    try {
      return await getCart(getCartSignal(signal))
    } catch (error) {
      return rejectWithValue(getAuthErrors(error).message)
    }
  },
  {
    condition: (_, { getState }) =>
      !!getState().auth.session &&
      !getState().cart.mutating &&
      getState().cart.status !== 'pending',
  },
)

export const mutateCart = createAsyncThunk<
  CartResult,
  CartOperation,
  { state: RootState; rejectValue: string }
>(
  'cart/mutate',
  async (operation, { getState, dispatch, signal, rejectWithValue }) => {
    const session = getState().auth.session
    const requestSignal = getCartSignal(signal)
    const ensureSession = () => {
      if (
        !session ||
        getState().auth.session?.token !== session.token ||
        (session.expiresAt !== null && session.expiresAt <= Date.now()) ||
        requestSignal.aborted
      )
        throw new Error('Your session has ended. Please sign in again.')
    }
    let cart: Cart | null
    try {
      ensureSession()
      const current = getState().cart
      cart =
        current.status === 'succeeded' &&
        operation.type !== 'add' &&
        operation.type !== 'moveWishlist'
          ? current
          : await getCart(requestSignal)
      ensureSession()
    } catch (error) {
      return rejectWithValue(getAuthErrors(error).message)
    }
    const errors: string[] = []
    let confirmed = 0
    const ids =
      operation.type === 'moveWishlist' ? [...getState().wishlist.ids] : []
    const requested =
      operation.type === 'add'
        ? (operation.quantity ?? 1)
        : operation.type === 'moveWishlist'
          ? ids.length
          : 1
    if (!Number.isSafeInteger(requested) || requested < 1)
      return rejectWithValue(
        'Choose a valid quantity or at least one saved product.',
      )

    const refresh = async () => {
      try {
        ensureSession()
        cart = await getCart(requestSignal)
        ensureSession()
        return true
      } catch {
        cart = null
        errors.push(
          confirmed > 0
            ? 'A cart change was confirmed, but the cart could not be refreshed. Refresh the cart before trying again.'
            : 'The cart may have changed, but could not be refreshed. Refresh the cart and check quantities before trying again.',
        )
        return false
      }
    }

    const addUnit = async (productId: number, move: boolean) => {
      try {
        ensureSession()
        const line = cart?.items.find((item) => item.product.id === productId)
        if (line) {
          if (
            line.product.quantity !== null &&
            line.product.quantity !== undefined &&
            line.quantity >= line.product.quantity
          )
            throw new Error(
              'The requested quantity exceeds the available stock.',
            )
          await increaseCartLine(line.id, requestSignal)
        } else await addCartProduct(productId, requestSignal)
        ensureSession()
        confirmed += 1
        if (move) dispatch(removeFromWishlist(productId))
        return await refresh()
      } catch (error) {
        errors.push(`Product #${productId}: ${getAuthErrors(error).message}`)
        await refresh()
        return false
      }
    }

    if (operation.type === 'add') {
      for (let index = 0; index < requested; index++) {
        if (
          !(await addUnit(
            operation.productId,
            operation.moveFromWishlist === true,
          ))
        )
          break
      }
    } else if (operation.type === 'moveWishlist') {
      for (const id of ids) {
        if (
          !cart ||
          requestSignal.aborted ||
          getState().auth.session?.token !== session?.token
        )
          break
        await addUnit(id, true)
      }
    } else {
      try {
        ensureSession()
        if (operation.type === 'clear') await clearServerCart(requestSignal)
        else {
          const line = cart.items.find((item) => item.id === operation.lineId)
          if (!line) throw new Error('This cart item is no longer available.')
          if (operation.type === 'increase') {
            if (
              line.product.quantity !== null &&
              line.product.quantity !== undefined &&
              line.quantity >= line.product.quantity
            )
              throw new Error(
                'The requested quantity exceeds the available stock.',
              )
            await increaseCartLine(line.id, requestSignal)
          } else if (operation.type === 'reduce') {
            if (line.quantity <= 1)
              throw new Error('Use Remove to delete the last unit.')
            await reduceCartLine(line.id, requestSignal)
          } else await removeCartLine(line.id, requestSignal)
        }
        ensureSession()
        confirmed = 1
        await refresh()
      } catch (error) {
        errors.push(getAuthErrors(error).message)
        await refresh()
      }
    }
    const message =
      confirmed === 0
        ? null
        : operation.type === 'add'
          ? `Added ${confirmed} of ${requested} units to your cart.`
          : operation.type === 'moveWishlist'
            ? `Moved ${confirmed} of ${requested} products to your cart.`
            : 'Cart updated.'
    return { cart, confirmed, requested, errors, message }
  },
  {
    condition: (operation, { getState }) =>
      !!getState().auth.session &&
      !getState().cart.mutating &&
      (operation.type === 'add' ||
        operation.type === 'moveWishlist' ||
        getState().cart.status === 'succeeded'),
  },
)

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loggedOut, () => initialState)
      .addCase(sessionStarted, () => initialState)
      .addCase(fetchCart.pending, (state, action) => {
        state.status = 'pending'
        state.error = null
        state.mutationError = null
        state.message = null
        state.operation = null
        state.fetchRequestId = action.meta.requestId
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        if (state.fetchRequestId !== action.meta.requestId) return
        Object.assign(state, action.payload)
        state.status = 'succeeded'
      })
      .addCase(fetchCart.rejected, (state, action) => {
        if (state.fetchRequestId !== action.meta.requestId) return
        state.status = action.meta.aborted ? 'idle' : 'failed'
        state.error = action.meta.aborted
          ? null
          : action.payload || 'Unable to load the cart. Please try again.'
      })
      .addCase(mutateCart.pending, (state, action) => {
        state.fetchRequestId = null
        state.mutating = true
        state.mutationRequestId = action.meta.requestId
        state.mutationError = null
        state.message = null
        state.operation = action.meta.arg
      })
      .addCase(mutateCart.fulfilled, (state, action) => {
        if (state.mutationRequestId !== action.meta.requestId) return
        state.mutating = false
        state.mutationError = action.payload.errors.join(' ') || null
        state.message = action.payload.errors.length
          ? null
          : action.payload.message
        if (action.payload.cart) {
          Object.assign(state, action.payload.cart)
          state.status = 'succeeded'
          state.error = null
        } else {
          state.status = 'failed'
          state.error =
            'Unable to refresh the cart. Check the current cart before trying again.'
        }
      })
      .addCase(mutateCart.rejected, (state, action) => {
        if (state.mutationRequestId !== action.meta.requestId) return
        state.mutating = false
        state.status = state.items.length ? 'succeeded' : 'failed'
        state.mutationError =
          action.payload || 'Unable to update the cart. Please try again.'
        state.error = state.items.length ? null : state.mutationError
      })
  },
})

export default cartSlice.reducer
