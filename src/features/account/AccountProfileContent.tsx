import { useText } from '@/shared/i18n/useText'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { getAccountProfile } from '@/features/account/accountApi'
import type { AccountProfile } from '@/features/account/accountApi'
import { getAuthErrors } from '@/features/auth/authApi'
import { loggedOut } from '@/features/auth/authSlice'
import RequestState from '@/shared/components/RequestState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

type ProfileState = {
  status: 'loading' | 'succeeded' | 'failed'
  profile: AccountProfile | null
  error: string | null
}

const ProfileField = ({
  label,
  name,
  value,
}: {
  label: string
  name: string
  value: string | null | undefined
}) => {
  const { t } = useText()
  return (
    <div className="space-y-2">
      <label htmlFor={`profile-${name}`} className="text-sm">
        {t(label || '')}
      </label>
      <Input
        id={`profile-${name}`}
        value={value?.trim() || t('Not provided')}
        readOnly
        className="h-12 rounded-sm bg-secondary/50"
      />
    </div>
  )
}

const AccountProfileContent = ({ userId }: { userId: string | null }) => {
  const { t } = useText()

  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.auth.session?.token)
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<ProfileState>({
    status: 'loading',
    profile: null,
    error: null,
  })

  useEffect(() => {
    if (!userId || !token) return
    const controller = new AbortController()
    let active = true
    void getAccountProfile(userId, controller.signal)
      .then((profile) => {
        if (active) setResult({ status: 'succeeded', profile, error: null })
      })
      .catch((error: unknown) => {
        if (active && !controller.signal.aborted)
          setResult({
            status: 'failed',
            profile: null,
            error: getAuthErrors(error).message,
          })
      })
    return () => {
      active = false
      controller.abort()
    }
  }, [userId, token, attempt])

  const handleRetry = () => {
    setResult({ status: 'loading', profile: null, error: null })
    setAttempt((value) => value + 1)
  }

  if (!userId)
    return (
      <div role="alert" className="space-y-5">
        <h1 className="text-xl font-medium">{t('Profile unavailable')}</h1>
        <p className="text-muted-foreground">
          {t('Your session does not identify a profile. Please sign in again.')}
        </p>
        <Button onClick={() => dispatch(loggedOut())}>
          {t('Sign In Again')}
        </Button>
      </div>
    )

  return (
    <section
      aria-labelledby="profile-title"
      aria-busy={result.status === 'loading'}
    >
      <h1 id="profile-title" className="mb-6 text-xl font-medium text-primary">
        {t('My Profile')}
      </h1>
      {result.status === 'loading' && (
        <div role="status">
          <span className="sr-only">{t('Loading your profile')}</span>
          <div aria-hidden="true" className="grid gap-6 sm:grid-cols-2">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-20" />
            ))}
          </div>
        </div>
      )}
      <RequestState error={result.error} onRetry={handleRetry} />
      {result.status === 'succeeded' &&
        (result.profile ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2">
              <ProfileField
                label={t('Username')}
                name="username"
                value={result.profile.userName}
              />
              <ProfileField
                label={t('Email address')}
                name="email"
                value={result.profile.email}
              />
              <ProfileField
                label={t('First name')}
                name="first-name"
                value={result.profile.firstName}
              />
              <ProfileField
                label={t('Last name')}
                name="last-name"
                value={result.profile.lastName}
              />
              <ProfileField
                label={t('Phone number')}
                name="phone"
                value={result.profile.phoneNumber}
              />
              <ProfileField
                label={t('Date of birth')}
                name="dob"
                value={result.profile.dob}
              />
            </div>
            <p
              id="profile-editing-note"
              className="mt-8 text-sm leading-6 text-muted-foreground"
            >
              {t(
                'Your profile is read-only. Profile editing requires an image upload and is not connected yet. Password changes and saved addresses are also unavailable.',
              )}
            </p>
            <div className="mt-6 flex justify-end">
              <Button
                disabled
                aria-describedby="profile-editing-note"
                className="h-12 w-full rounded-sm px-8 sm:w-auto"
              >
                {t('Save Changes')}
              </Button>
            </div>
          </>
        ) : (
          <div role="status" className="space-y-3 py-6">
            <h2 className="text-lg font-medium">{t('No profile found')}</h2>
            <p className="text-sm text-muted-foreground">
              {t('The server did not return a profile for this account.')}
            </p>
            <Button variant="outline" onClick={handleRetry}>
              {t('Try again')}
            </Button>
          </div>
        ))}
    </section>
  )
}

export default AccountProfileContent
