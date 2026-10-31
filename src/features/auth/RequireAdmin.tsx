import AppearanceControls from '@/shared/preferences/AppearanceControls'
import { useText } from '@/shared/i18n/useText'
import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { loggedOut } from './authSlice'
import { verifyAdminAccess } from './adminAccessSlice'
import { Button } from '@/components/ui/button'
import RequestState from '@/shared/components/RequestState'

const RequireAdmin = () => {
  const { t } = useText()

  const session = useAppSelector((state) => state.auth.session)
  const { status, error } = useAppSelector((state) => state.adminAccess)
  const dispatch = useAppDispatch()
  const location = useLocation()

  useEffect(() => {
    if (!session) return
    const request = dispatch(verifyAdminAccess())
    return () => request.abort()
  }, [dispatch, session])

  let title = 'Checking admin access'
  if (status === 'denied') title = 'Admin access required'
  else if (status === 'failed') title = 'Unable to confirm admin access'

  if (!session)
    return (
      <Navigate
        to="/login"
        replace
        state={{ returnTo: `${location.pathname}${location.search}` }}
      />
    )

  if (status === 'allowed') return <Outlet />

  return (
    <main className="grid min-h-svh place-items-center bg-secondary p-6">
      <div className="fixed top-4 right-4">
        <AppearanceControls />
      </div>
      <section
        aria-labelledby="access-heading"
        className="w-full max-w-md space-y-5 rounded-lg border bg-background p-8"
      >
        <ShieldAlert className="size-9 text-primary" aria-hidden="true" />
        <h1 id="access-heading" className="text-2xl font-semibold">
          {t(title || '')}
        </h1>
        {(status === 'idle' || status === 'pending') && (
          <RequestState loading />
        )}
        {status === 'denied' && (
          <p className="text-sm leading-6 text-muted-foreground">
            {t(
              'This account does not have a confirmed Admin role. Sign in with an authorized account or contact your administrator.',
            )}
          </p>
        )}
        {status === 'failed' && (
          <RequestState
            error={error}
            onRetry={() => void dispatch(verifyAdminAccess())}
          />
        )}
        <Button variant="outline" onClick={() => dispatch(loggedOut())}>
          {t('Sign out')}
        </Button>
      </section>
    </main>
  )
}

export default RequireAdmin
