import { useText } from '@/shared/i18n/useText'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'

type AuthFieldProps = {
  label: string
  field: UseFormRegisterReturn
  type?: string
  autoComplete: string
  error?: string
}

const AuthField = ({
  label,
  field,
  type = 'text',
  autoComplete,
  error,
}: AuthFieldProps) => {
  const { t } = useText()
  return (
    <div className="space-y-2">
      <label htmlFor={field.name} className="sr-only">
        {t(label || '')}
      </label>
      <Input
        {...field}
        id={field.name}
        type={type}
        autoComplete={autoComplete}
        placeholder={t(label || '')}
        aria-invalid={!!error}
        aria-describedby={error ? `${field.name}-error` : undefined}
        className="h-14 rounded-sm px-4 pr-14 shadow-none"
      />
      {error && (
        <p
          id={`${field.name}-error`}
          role="alert"
          className="text-sm text-destructive"
        >
          {t(error || '')}
        </p>
      )}
    </div>
  )
}

export default AuthField
