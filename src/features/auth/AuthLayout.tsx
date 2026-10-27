import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'

const AuthLayout = ({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) => (
  <div className="container grid gap-10 py-12 sm:py-20 lg:grid-cols-2 lg:gap-20">
    <div className="hidden min-h-[480px] flex-col justify-center gap-6 bg-secondary p-12 lg:flex">
      <ShoppingBag
        className="size-16 text-primary"
        strokeWidth={1.3}
        aria-hidden="true"
      />
      <p className="text-4xl font-semibold">Welcome to FastCart</p>
      <p className="max-w-sm text-muted-foreground">
        Discover products and keep your favorites in one place.
      </p>
      <Link to="/products" className="w-fit underline underline-offset-8">
        Explore Our Products
      </Link>
    </div>
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
