import type { ReactNode } from 'react'

const ProductField = ({
  name,
  label,
  error,
  children,
}: {
  name: string
  label: string
  error?: string
  children: ReactNode
}) => (
  <div className="min-w-0 space-y-2">
    <label htmlFor={name} className="text-sm font-medium">
      {label}
    </label>
    {children}
    {error && (
      <p id={`${name}-error`} role="alert" className="text-xs text-destructive">
        {error}
      </p>
    )}
  </div>
)

export default ProductField
