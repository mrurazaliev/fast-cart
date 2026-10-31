import { useText } from '@/shared/i18n/useText'
import { Link, Navigate } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { getProfileUserId } from '@/features/account/accountApi'
import AccountProfileContent from '@/features/account/AccountProfileContent'

const Account = () => {
  const { t } = useText()

  const session = useAppSelector((state) => state.auth.session)

  if (!session)
    return <Navigate to="/login" replace state={{ returnTo: '/account' }} />

  const userId = getProfileUserId(session.token)

  return (
    <div className="py-4 sm:py-8">
      <nav
        aria-label={t('Breadcrumb')}
        className="mb-8 flex flex-wrap gap-3 text-sm sm:mb-12"
      >
        <Link to="/" className="text-muted-foreground hover:underline">
          {t('Home')}
        </Link>
        <span aria-hidden="true">/</span>
        <span>{t('My Account')}</span>
      </nav>
      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
        <aside>
          <h2 className="mb-4 font-medium">{t('Manage My Account')}</h2>
          <nav
            aria-label={t('Account')}
            className="flex flex-wrap gap-4 text-sm lg:flex-col lg:items-start lg:pl-6"
          >
            <Link
              to="/account"
              aria-current="page"
              className="text-primary hover:underline"
            >
              {t('My Profile')}
            </Link>
            <Link to="/cart" className="hover:underline">
              {t('My Cart')}
            </Link>
            <Link to="/wishlist" className="hover:underline">
              {t('My Wishlist')}
            </Link>
          </nav>
          <p className="mt-6 max-w-xs text-sm leading-6 text-muted-foreground">
            {t(
              'Payment options, order history and returns are not connected yet.',
            )}
          </p>
        </aside>
        <div className="min-w-0 rounded-sm p-5 shadow-[0_1px_14px_0_rgb(0_0_0/8%)] sm:p-10">
          <AccountProfileContent
            key={`${userId || session.userName}:${session.expiresAt}`}
            userId={userId}
          />
        </div>
      </div>
    </div>
  )
}

export default Account
