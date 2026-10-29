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
    <label htmlFor={field.name} className="text-sm font-medium">
      {label}
    </label>
    <Input
      {...field}
      id={field.name}
      type={type}
      autoComplete={autoComplete}
      aria-invalid={!!error}
      aria-describedby={error ? `${field.name}-error` : undefined}
      className="h-12 rounded-none border-0 border-b px-0 shadow-none"
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
