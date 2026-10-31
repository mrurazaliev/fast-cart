import { useText } from '@/shared/i18n/useText'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkoutSchema } from '@/features/checkout/checkoutSchema'
import type { CheckoutValues } from '@/features/checkout/checkoutSchema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const fields = [
  { name: 'firstName', label: 'First name', autoComplete: 'given-name' },
  { name: 'lastName', label: 'Last name', autoComplete: 'family-name' },
  {
    name: 'streetAddress',
    label: 'Street address',
    autoComplete: 'address-line1',
  },
  {
    name: 'apartment',
    label: 'Apartment, floor, etc. (optional)',
    autoComplete: 'address-line2',
  },
  { name: 'city', label: 'Town / City', autoComplete: 'address-level2' },
  {
    name: 'phoneNumber',
    label: 'Phone number',
    autoComplete: 'tel',
    type: 'tel',
  },
  {
    name: 'email',
    label: 'Email address',
    autoComplete: 'email',
    type: 'email',
  },
] satisfies {
  name: keyof CheckoutValues
  label: string
  autoComplete: string
  type?: string
}[]

const CheckoutForm = ({
  disabled,
  onSave,
}: {
  disabled: boolean
  onSave: (values: CheckoutValues) => void
}) => {
  const { t } = useText()

  const [saveError, setSaveError] = useState<string | null>(null)
  const submitting = useRef(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted, isSubmitting, isValid },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      streetAddress: '',
      apartment: '',
      city: '',
      phoneNumber: '',
      email: '',
    },
  })

  return (
    <form
      noValidate
      onChange={() => setSaveError(null)}
      onSubmit={(event) => {
        event.preventDefault()
        if (disabled || isSubmitting || submitting.current) return
        submitting.current = true
        setSaveError(null)
        void handleSubmit((values) => {
          try {
            onSave(values)
          } catch (error) {
            setSaveError(
              error instanceof Error
                ? error.message
                : 'Unable to save locally. Please try again.',
            )
          }
        })(event).finally(() => {
          submitting.current = false
        })
      }}
      aria-describedby="checkout-availability-note checkout-form-note"
      aria-busy={isSubmitting}
      className="min-w-0 space-y-5 p-5 shadow-[0_1px_18px_0_rgb(0_0_0/8%)] sm:p-6"
    >
      <fieldset
        disabled={disabled || isSubmitting}
        className="min-w-0 space-y-5"
      >
        <legend className="sr-only">{t('Contact and billing address')}</legend>
        {fields.map((field) => {
          const error = errors[field.name]?.message
          const id = `checkout-${field.name}`
          return (
            <div key={field.name} className="space-y-2">
              <label htmlFor={id} className="text-sm text-muted-foreground">
                {t(field.label || '')}
              </label>
              <Input
                {...register(field.name)}
                id={id}
                type={'type' in field ? field.type : 'text'}
                autoComplete={field.autoComplete}
                aria-required={field.name !== 'apartment'}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                className="h-12 rounded-sm px-3"
              />
              {error && (
                <p
                  id={`${id}-error`}
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {t(error || '')}
                </p>
              )}
            </div>
          )
        })}
        <Button type="submit" className="h-12 w-full rounded-sm">
          {isSubmitting ? t('Saving locally…') : t('Save local order')}
        </Button>
      </fieldset>
      {isSubmitted && !isValid && (
        <p role="alert" className="text-sm text-destructive">
          {t('Please correct the highlighted fields. No information was sent.')}
        </p>
      )}
      {saveError && (
        <p role="alert" className="text-sm text-destructive">
          {t(saveError || '')}
        </p>
      )}
      <p id="checkout-form-note" className="text-xs text-muted-foreground">
        {t(
          'Saving stores your billing details and a cart snapshot in this browser for this account. No real order or payment is submitted. You can delete the saved local order afterwards.',
        )}
      </p>
    </form>
  )
}

export default CheckoutForm
