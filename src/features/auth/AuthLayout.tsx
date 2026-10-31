import { useText } from '@/shared/i18n/useText'
import type { ReactNode } from 'react'

const AuthLayout = ({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) => {
  const { t } = useText()
  return (
    <div className="container py-12 sm:py-20">
      <section
        aria-labelledby="auth-heading"
        className="mx-auto w-full max-w-md self-center space-y-8"
      >
        <div className="space-y-3">
          <h1 id="auth-heading" className="text-3xl font-medium sm:text-4xl">
            {t(title || '')}
          </h1>
          <p>{t('Enter your details below')}</p>
        </div>
        {children}
      </section>
    </div>
  )
}

export default AuthLayout
