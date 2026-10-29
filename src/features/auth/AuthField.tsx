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
}: AuthFieldProps) => (
  <div className="space-y-2">
    <label htmlFor={field.name} className="sr-only">
      {label}
    </label>
    <Input
      {...field}
      id={field.name}
      type={type}
      autoComplete={autoComplete}
      placeholder={label}
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
        {error}
      </p>
    )}
  </div>
)

export default AuthField
