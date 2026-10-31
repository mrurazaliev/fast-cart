import { useText } from '@/shared/i18n/useText'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ProductField from '@/features/products/ProductField'
import RequestState from '@/shared/components/RequestState'
import { categoryFormSchema } from './categoryFormSchema'
import type { CategoryFormValues } from './categoryFormSchema'
import {
  createCategory,
  getCategory,
  getCategoryError,
  updateCategory,
} from './categoriesApi'
import type { Category } from './categoriesApi'
import CategoryDialog from './CategoryDialog'
import CategoryImage from './CategoryImage'
import useCategoryMutation from './useCategoryMutation'

const CategoryForm = ({
  category,
  onClose,
}: {
  category?: Category
  onClose: () => void
}) => {
  const { t } = useText()

  const mutation = useCategoryMutation()
  const submitting = useRef(false)
  const preview = useRef<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(!category)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const [current, setCurrent] = useState(category)
  const {
    register,
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { categoryName: '', categoryImage: null },
  })
  const file = useWatch({ control, name: 'categoryImage' })
  useEffect(
    () => () => {
      if (preview.current) URL.revokeObjectURL(preview.current)
    },
    [],
  )
  useEffect(() => {
    if (!category) return
    const controller = new AbortController()
    getCategory(category.id, controller.signal)
      .then((value) => {
        if (controller.signal.aborted) return
        setCurrent(value)
        reset({ categoryName: value.categoryName, categoryImage: null })
        setLoaded(true)
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setLoadError(getCategoryError(error))
      })
    return () => controller.abort()
  }, [category, attempt, reset])
  const handleFile = (file: File | null) => {
    if (preview.current) URL.revokeObjectURL(preview.current)
    preview.current = file ? URL.createObjectURL(file) : null
    setPreviewUrl(preview.current)
    setValue('categoryImage', file, { shouldValidate: true, shouldDirty: true })
  }
  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting.current || mutation.pending || mutation.locked || !loaded)
      return
    submitting.current = true
    try {
      await handleSubmit((values) =>
        mutation.run((signal) =>
          category
            ? updateCategory(category.id, values, signal)
            : createCategory(values, signal),
        ),
      )(event)
    } finally {
      submitting.current = false
    }
  }
  return (
    <CategoryDialog
      title={category ? t('Edit category') : t('Add category')}
      description={
        category
          ? t(
              'Updating a category requires a new image file. The existing image cannot be submitted as a replacement file.',
            )
          : t('Enter a name and choose a category image.')
      }
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
        <form onSubmit={handleFormSubmit} className="space-y-5">
          <ProductField
            name="categoryName"
            label={t('Category name')}
            error={errors.categoryName?.message}
          >
            <Input
              id="categoryName"
              {...register('categoryName')}
              disabled={mutation.pending || mutation.locked}
              aria-invalid={!!errors.categoryName}
              aria-describedby={
                errors.categoryName ? 'categoryName-error' : undefined
              }
            />
          </ProductField>
          {current && (
            <div className="space-y-2 text-sm">
              <p>{t('Current image')}</p>
              <CategoryImage
                image={current.categoryImage}
                name={current.categoryName}
              />
            </div>
          )}
          <ProductField
            name="categoryImage"
            label={category ? t('New image (required)') : t('Image')}
            error={errors.categoryImage?.message}
          >
            <Input
              id="categoryImage"
              name="categoryImage"
              type="file"
              accept="image/*"
              disabled={mutation.pending || mutation.locked}
              className="h-auto p-2"
              aria-invalid={!!errors.categoryImage}
              aria-describedby={
                errors.categoryImage ? 'categoryImage-error' : undefined
              }
              onChange={(event) => {
                const chosen = event.target.files?.[0]
                if (chosen) handleFile(chosen)
                event.target.value = ''
              }}
            />
          </ProductField>
          {file && (
            <div className="space-y-2 text-sm">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt={t('Preview {{value0}}', { value0: file.name })}
                  className="h-32 max-w-full object-contain"
                />
              )}
              <p className="break-words">{file.name}</p>
              <Button
                type="button"
                variant="outline"
                disabled={mutation.pending || mutation.locked}
                onClick={() => handleFile(null)}
              >
                {t('Remove selected image')}
              </Button>
            </div>
          )}
          {mutation.error && (
            <p role="alert" className="text-sm text-destructive">
              {t(mutation.error || '')}
            </p>
          )}
          {mutation.confirmed && (
            <p role="status" className="text-sm">
              {t('The server confirmed the category was saved.')}
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
            <Button
              type="button"
              variant="outline"
              disabled={mutation.pending}
              onClick={onClose}
            >
              {mutation.locked ? t('Close') : t('Cancel')}
            </Button>
            {!mutation.locked && (
              <Button type="submit" disabled={mutation.pending}>
                {mutation.pending ? t('Saving…') : t('Save')}
              </Button>
            )}
          </div>
        </form>
      )}
    </CategoryDialog>
  )
}
export default CategoryForm
