import { useText } from '@/shared/i18n/useText'
import { useState } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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

  const [visible, setVisible] = useState(false)
  const password = type === 'password'

  return (
    <div className="space-y-2">
      <label htmlFor={field.name} className="text-sm font-medium">
        {t(label || '')}
      </label>
      <div className="relative">
        <Input
          {...field}
          id={field.name}
          type={password && visible ? 'text' : type}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${field.name}-error` : undefined}
          className={`h-12 rounded-none border-0 border-b px-0 shadow-none ${password ? 'pr-11' : ''}`}
        />
        {password && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setVisible((value) => !value)}
            aria-label={visible ? t('Hide password') : t('Show password')}
            aria-pressed={visible}
            aria-controls={field.name}
            className="absolute right-0 top-1 size-10"
          >
            {visible ? (
              <EyeOff aria-hidden="true" />
            ) : (
              <Eye aria-hidden="true" />
            )}
          </Button>
        )}
      </div>
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
