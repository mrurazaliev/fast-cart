import { useState } from 'react'
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

const CheckoutForm = ({ disabled }: { disabled: boolean }) => {
  const [validated, setValidated] = useState(false)
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
      onChange={() => setValidated(false)}
      onSubmit={(event) => {
        event.preventDefault()
        if (disabled || isSubmitting) return
        void handleSubmit(
          () => setValidated(true),
          () => setValidated(false),
        )(event)
      }}
      aria-describedby="checkout-availability-note checkout-form-note"
      aria-busy={isSubmitting}
      className="min-w-0 space-y-5 p-5 shadow-[0_1px_18px_0_rgb(0_0_0/8%)] sm:p-6"
    >
      <fieldset
        disabled={disabled || isSubmitting}
        className="min-w-0 space-y-5"
      >
        <legend className="sr-only">Contact and billing address</legend>
        {fields.map((field) => {
          const error = errors[field.name]?.message
          const id = `checkout-${field.name}`
          return (
            <div key={field.name} className="space-y-2">
              <label htmlFor={id} className="text-sm text-muted-foreground">
                {field.label}
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
                  {error}
                </p>
              )}
            </div>
          )
        })}
        <Button type="submit" className="h-12 w-full rounded-sm">
          Check billing details
        </Button>
      </fieldset>
      {isSubmitted && !isValid && (
        <p role="alert" className="text-sm text-destructive">
          Please correct the highlighted fields. No information was sent.
        </p>
      )}
      {validated && !disabled && (
        <p role="status" className="text-sm">
          Details checked locally. No order was created and no information was
          sent.
        </p>
      )}
      <p id="checkout-form-note" className="text-xs text-muted-foreground">
        These details are only used for local validation. They are not saved for
        your next visit or submitted to the server.
      </p>
    </form>
  )
}

export default CheckoutForm
