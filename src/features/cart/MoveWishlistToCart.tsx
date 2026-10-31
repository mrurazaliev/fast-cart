import { useText } from '@/shared/i18n/useText'
import { useLocation, useNavigate } from 'react-router-dom'
import { useStore } from 'react-redux'
import type { RootState } from '@/app/store'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { mutateCart } from '@/features/cart/cartSlice'
import { Button } from '@/components/ui/button'

const MoveWishlistToCart = () => {
  const { t } = useText()

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const store = useStore<RootState>()
  const session = useAppSelector((state) => state.auth.session)
  const ids = useAppSelector((state) => state.wishlist.ids)
  const { mutating } = useAppSelector((state) => state.cart)

  const handleMove = async () => {
    if (mutating || ids.length === 0) return
    if (!session) {
      navigate('/login', {
        state: {
          returnTo: `${location.pathname}${location.search}${location.hash}`,
        },
      })
      return
    }
    await dispatch(mutateCart({ type: 'moveWishlist' }))
    if (!store.getState().auth.session)
      navigate('/login', {
        state: {
          returnTo: `${location.pathname}${location.search}${location.hash}`,
        },
      })
  }

  return (
    <Button
      type="button"
      variant="outline"
      disabled={mutating || ids.length === 0}
      onClick={() => void handleMove()}
      className="h-12 rounded-sm px-8"
    >
      {mutating ? t('Updating cart…') : t('Move All To Bag')}
    </Button>
  )
}

export default MoveWishlistToCart
