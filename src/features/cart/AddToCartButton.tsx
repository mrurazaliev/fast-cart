import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useStore } from 'react-redux'
import type { RootState } from '@/app/store'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { mutateCart } from '@/features/cart/cartSlice'
import { Button } from '@/components/ui/button'
import { getCartQuantityIntent, getLoginReturnPath } from '@/shared/loginReturn'

type AddToCartButtonProps = {
  productId: number
  quantity?: number
  disabled?: boolean
  className?: string
  wrapperClassName?: string
  moveFromWishlist?: boolean
}

const AddToCartButton = ({
  productId,
  quantity = 1,
  disabled = false,
  className,
  wrapperClassName,
  moveFromWishlist = false,
}: AddToCartButtonProps) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const store = useStore<RootState>()
  const session = useAppSelector((state) => state.auth.session)
  const { mutating, mutationRequestId } = useAppSelector((state) => state.cart)
  const [result, setResult] = useState<{
    requestId: string
    message: string | null
    error: string | null
  } | null>(null)

  const openLogin = () => {
    const returnTo = getLoginReturnPath({
      returnTo: `${location.pathname}${location.search}${location.hash}`,
    })
    const cartQuantity = getCartQuantityIntent({
      cartQuantity: { productId, quantity },
    })
    navigate('/login', {
      state: { returnTo, ...(cartQuantity ? { cartQuantity } : {}) },
    })
  }

  const handleAdd = async () => {
    if (disabled || mutating) return
    if (!session) {
      openLogin()
      return
    }
    const action = await dispatch(
      mutateCart({ type: 'add', productId, quantity, moveFromWishlist }),
    )
    if (!store.getState().auth.session) {
      openLogin()
      return
    }
    if (mutateCart.fulfilled.match(action)) {
      setResult({
        requestId: action.meta.requestId,
        message: action.payload.message,
        error: action.payload.errors.join(' ') || null,
      })
    } else if (!action.meta.condition) {
      setResult({
        requestId: action.meta.requestId,
        message: null,
        error:
          typeof action.payload === 'string'
            ? action.payload
            : 'Unable to update the cart. Please try again.',
      })
    }
  }

  const currentResult = result?.requestId === mutationRequestId ? result : null

  return (
    <div className={wrapperClassName}>
      <Button
        type="button"
        disabled={disabled || mutating}
        onClick={() => void handleAdd()}
        title={disabled ? 'This product is unavailable' : undefined}
        className={className}
      >
        {disabled ? 'Unavailable' : mutating ? 'Updating cart…' : 'Add To Cart'}
      </Button>
      {currentResult?.message && (
        <p
          role="status"
          className="bg-background px-2 py-1 text-xs text-foreground"
        >
          {currentResult.message}
        </p>
      )}
      {currentResult?.error && (
        <p
          role="alert"
          className="bg-background px-2 py-1 text-xs text-destructive"
        >
          {currentResult.error}
        </p>
      )}
    </div>
  )
}

export default AddToCartButton
