import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ProductField from '@/features/products/ProductField'
import RequestState from '@/shared/components/RequestState'
import AdminDialog from '@/shared/components/admin/AdminDialog'
import { colorFormSchema } from './colorFormSchema'
import type { ColorFormValues } from './colorFormSchema'
import { createColor, getColor, getColorError, updateColor } from './colorsApi'
import type { Color } from './colorsApi'
import useColorMutation from './useColorMutation'

const ColorForm = ({
  color,
  onClose,
}: {
  color?: Color
  onClose: () => void
}) => {
  const mutation = useColorMutation()
  const submitting = useRef(false)
  const [loaded, setLoaded] = useState(!color)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ColorFormValues>({
    resolver: zodResolver(colorFormSchema),
    defaultValues: { colorName: '' },
  })
  useEffect(() => {
    if (!color) return
    const controller = new AbortController()
    getColor(color.id, controller.signal)
      .then((value) => {
        if (controller.signal.aborted) return
        reset({ colorName: value.colorName })
        setLoaded(true)
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setLoadError(getColorError(error))
      })
    return () => controller.abort()
  }, [color, attempt, reset])
  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting.current || mutation.pending || mutation.locked || !loaded)
      return
    submitting.current = true
    try {
      await handleSubmit((values) =>
        mutation.run((signal) =>
          color
            ? updateColor(color.id, values, signal)
            : createColor(values, signal),
        ),
      )(event)
    } finally {
      submitting.current = false
    }
  }
  return (
    <AdminDialog
      title={color ? 'Edit color' : 'New color'}
      description="Colors are saved by name. Exact color values are unavailable."
      pending={mutation.pending}
      onClose={onClose}
    >
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
          onSubmit={(event) => void handleFormSubmit(event)}
          className="space-y-5"
        >
          <ProductField
            name="colorName"
            label="Color name"
            error={errors.colorName?.message}
          >
            <Input
              id="colorName"
              {...register('colorName')}
              placeholder="Color name"
              disabled={mutation.pending || mutation.locked}
              aria-invalid={!!errors.colorName}
              aria-describedby={
                errors.colorName ? 'colorName-error' : undefined
              }
              className="h-14 rounded-sm"
            />
          </ProductField>
          {mutation.error && (
            <p role="alert" className="text-sm text-destructive">
              {mutation.error}
            </p>
          )}
          {mutation.confirmed && (
            <p role="status" className="text-sm">
              Color saved.
            </p>
          )}
          {mutation.refreshError && (
            <div role="alert" className="space-y-2 text-sm">
              <p>{mutation.refreshError}</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => void mutation.reload()}
              >
                Reload list
              </Button>
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={mutation.pending}
              onClick={onClose}
            >
              {mutation.locked ? 'Close' : 'Cancel'}
            </Button>
            {!mutation.locked && (
              <Button type="submit" disabled={mutation.pending}>
                {mutation.pending
                  ? 'Saving…'
                  : color
                    ? 'Save changes'
                    : 'Create'}
              </Button>
            )}
          </div>
        </form>
      )}
    </AdminDialog>
  )
}
export default ColorForm
