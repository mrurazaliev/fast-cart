import { useText } from '@/shared/i18n/useText'
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
}) => {
  const { t } = useText()
  return (
    <div className="min-w-0 space-y-2">
      <label htmlFor={name} className="text-sm font-medium">
        {t(label || '')}
      </label>
      {children}
      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          className="text-xs text-destructive"
        >
          {t(error || '')}
        </p>
      )}
    </div>
  )
}

export default ProductField
