import { useText } from '@/shared/i18n/useText'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ProductField from '@/features/products/ProductField'
import RequestState from '@/shared/components/RequestState'
import { createBrand, getBrand, getBrandError, updateBrand } from './brandsApi'
import type { Brand } from './brandsApi'
import { brandFormSchema } from './brandFormSchema'
import type { BrandFormValues } from './brandFormSchema'
import useBrandMutation from './useBrandMutation'

const BrandForm = ({
  brand,
  onCancel,
  onPendingChange,
}: {
  brand?: Brand
  onCancel: () => void
  onPendingChange?: (pending: boolean) => void
}) => {
  const { t } = useText()

  const mutation = useBrandMutation()
  const submitting = useRef(false)
  const [loaded, setLoaded] = useState(!brand)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: { brandName: '' },
  })
  useEffect(() => {
    onPendingChange?.(mutation.pending)
  }, [mutation.pending, onPendingChange])
  useEffect(() => {
    if (!brand) return
    const controller = new AbortController()
    getBrand(brand.id, controller.signal)
      .then((value) => {
        if (!controller.signal.aborted) {
          reset({ brandName: value.brandName })
          setLoaded(true)
        }
      })
      .catch((failure: unknown) => {
        if (!controller.signal.aborted) setLoadError(getBrandError(failure))
      })
    return () => controller.abort()
  }, [brand, attempt, reset])
  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting.current || mutation.pending || mutation.locked || !loaded)
      return
    submitting.current = true
    try {
      await handleSubmit((values) =>
        mutation.run((signal) =>
          brand
            ? updateBrand(brand.id, values, signal)
            : createBrand(values, signal),
        ),
      )(event)
    } finally {
      submitting.current = false
    }
  }
  return (
    <section
      aria-labelledby="brand-form-heading"
      className="space-y-5 rounded-sm border p-5 sm:p-7"
    >
      <h2 id="brand-form-heading" className="text-xl font-semibold">
        {brand ? t('Edit brand') : t('Add new brand')}
      </h2>
      {brand && (
        <p className="text-sm text-muted-foreground">
          {t('Editing brand #')}
          {brand.id}
        </p>
      )}
      {!loaded && (
        <RequestState
          loading={!loadError}
          error={loadError}
          onRetry={() => {
            setLoadError(null)
            setAttempt((value) => value + 1)
          }}
        />
      )}
      {loaded && (
        <form
          onSubmit={handleFormSubmit}
          className="space-y-5"
          aria-busy={mutation.pending}
        >
          <ProductField
            name="brandName"
            label={t('Brand name')}
            error={errors.brandName?.message}
          >
            <Input
              id="brandName"
              {...register('brandName')}
              placeholder={t('Brand name')}
              disabled={mutation.pending || mutation.locked}
              aria-invalid={!!errors.brandName}
              aria-describedby={
                errors.brandName ? 'brandName-error' : undefined
              }
              className="h-14 rounded-sm"
            />
          </ProductField>
          {mutation.error && (
            <p role="alert" className="text-sm text-destructive">
              {t(mutation.error || '')}
            </p>
          )}
          {mutation.confirmed && (
            <p role="status" className="text-sm">
              {brand ? t('Brand updated.') : t('Brand created.')}
            </p>
          )}
          {mutation.refreshError && (
            <div role="alert" className="space-y-2 text-sm">
              <p>{t(mutation.refreshError || '')}</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => void mutation.reload()}
              >
                {t('Reload list')}
              </Button>
            </div>
          )}
          <div className="flex justify-end gap-3">
            {(brand || mutation.locked) && (
              <Button
                type="button"
                variant="outline"
                disabled={mutation.pending}
                onClick={onCancel}
              >
                {brand ? t('Cancel') : t('Add another brand')}
              </Button>
            )}
            {!mutation.locked && (
              <Button type="submit" disabled={mutation.pending}>
                {mutation.pending
                  ? t('Saving…')
                  : brand
                    ? t('Save')
                    : t('Create')}
              </Button>
            )}
          </div>
        </form>
      )}
      {!loaded && (
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('Cancel')}
        </Button>
      )}
    </section>
  )
}
export default BrandForm
