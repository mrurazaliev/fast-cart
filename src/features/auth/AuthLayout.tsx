import type { ReactNode } from 'react'

const AuthLayout = ({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) => (
  <div className="container py-12 sm:py-20">
    <section
      aria-labelledby="auth-heading"
      className="mx-auto w-full max-w-md self-center space-y-8"
    >
      <div className="space-y-3">
        <h1 id="auth-heading" className="text-3xl font-medium sm:text-4xl">
          {title}
        </h1>
        <p>Enter your details below</p>
      </div>
      {children}
    </section>
  </div>
)

export default AuthLayout
