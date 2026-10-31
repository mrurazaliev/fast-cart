import { useText } from '@/shared/i18n/useText'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ProductField from '@/features/products/ProductField'
import RequestState from '@/shared/components/RequestState'
import { getAuthErrors } from '@/features/auth/authApi'
import { getCategories } from './categoriesApi'
import type { Category } from './categoriesApi'
import CategoryDialog from './CategoryDialog'
import useCategoryMutation from './useCategoryMutation'
import {
  createSubcategory,
  getSubcategory,
  getSubcategoryParent,
  updateSubcategory,
} from './subcategoriesApi'
import type { Subcategory } from './subcategoriesApi'
import { subcategoryFormSchema } from './subcategoryFormSchema'
import type { SubcategoryFormValues } from './subcategoryFormSchema'

type FormData = {
  categories: Category[]
  subcategory: Subcategory | null
  categoryId: number
}

const SubcategoryFields = ({
  data,
  onClose,
}: {
  data: FormData
  onClose: () => void
}) => {
  const { t } = useText()

  const mutation = useCategoryMutation()
  const submitting = useRef(false)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SubcategoryFormValues>({
    resolver: zodResolver(subcategoryFormSchema),
    defaultValues: {
      subCategoryName: data.subcategory?.subCategoryName || '',
      categoryId: data.categoryId,
    },
  })
  const onSubmit = async (values: SubcategoryFormValues) => {
    if (
      !data.categories.some((category) => category.id === values.categoryId)
    ) {
      setError('categoryId', {
        message: 'Choose an available parent category.',
      })
      return
    }
    await mutation.run(async (signal) => {
      const categories = await getCategories(signal)
      if (!categories.some((category) => category.id === values.categoryId))
        throw new Error(
          'The selected parent category is no longer available. Close and reopen the form to reload categories.',
        )
      if (data.subcategory) {
        const currentParent = getSubcategoryParent(
          categories,
          data.subcategory.id,
        )
        if (!currentParent || currentParent.id !== data.categoryId)
          throw new Error(
            'The parent association changed or could not be verified. Close and reopen the form before saving.',
          )
        return updateSubcategory(data.subcategory.id, values, signal)
      }
      return createSubcategory(values, signal)
    })
  }
  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting.current || mutation.locked || mutation.pending) return
    submitting.current = true
    try {
      await handleSubmit(onSubmit)(event)
    } finally {
      submitting.current = false
    }
  }
  const disabled = mutation.pending || mutation.locked
  return (
    <CategoryDialog
      title={data.subcategory ? t('Edit subcategory') : t('Add subcategory')}
      description={t('Choose the category this subcategory belongs to.')}
      pending={mutation.pending}
      onClose={onClose}
    >
      <form
        onSubmit={(event) => void handleFormSubmit(event)}
        className="space-y-5"
        aria-busy={mutation.pending}
      >
        <ProductField
          name="subCategoryName"
          label={t('Subcategory name')}
          error={errors.subCategoryName?.message}
        >
          <Input
            id="subCategoryName"
            {...register('subCategoryName')}
            disabled={disabled}
            aria-invalid={!!errors.subCategoryName}
            aria-describedby={
              errors.subCategoryName ? 'subCategoryName-error' : undefined
            }
          />
        </ProductField>
        <ProductField
          name="categoryId"
          label={t('Parent category')}
          error={errors.categoryId?.message}
        >
          <select
            id="categoryId"
            {...register('categoryId', { valueAsNumber: true })}
            disabled={disabled}
            aria-invalid={!!errors.categoryId}
            aria-describedby={
              errors.categoryId ? 'categoryId-error' : undefined
            }
            className="h-11 w-full min-w-0 rounded-sm border bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-primary"
          >
            <option value={0}>{t('Choose a category')}</option>
            {data.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </ProductField>
        {data.subcategory && (
          <p className="text-sm text-muted-foreground">
            {t(
              'The existing parent is selected. Change it only if you intend to move this subcategory.',
            )}
          </p>
        )}
        {mutation.error && (
          <p role="alert" className="text-sm text-destructive">
            {t(mutation.error || '')}
          </p>
        )}
        {mutation.confirmed && (
          <p role="status" className="text-sm">
            {t('Subcategory')} {data.subcategory ? t('updated') : t('created')}
            {t('. The server confirmed the save.')}
          </p>
        )}
        {mutation.refreshError && (
          <div role="alert" className="space-y-3 text-sm">
            <p>{t(mutation.refreshError || '')}</p>
            <Button
              type="button"
              variant="outline"
              disabled={mutation.pending}
              onClick={() => void mutation.reload()}
            >
              {t('Reload categories')}
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
            {mutation.confirmed ? t('Close') : t('Cancel')}
          </Button>
          {!mutation.confirmed && (
            <Button type="submit" disabled={disabled}>
              {mutation.pending ? t('Saving…') : t('Save')}
            </Button>
          )}
        </div>
      </form>
    </CategoryDialog>
  )
}

const SubcategoryForm = ({
  subcategoryId,
  categoryId,
  onClose,
}: {
  subcategoryId?: number
  categoryId: number | null
  onClose: () => void
}) => {
  const { t } = useText()

  const [data, setData] = useState<FormData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    Promise.all([
      getCategories(controller.signal),
      subcategoryId
        ? getSubcategory(subcategoryId, controller.signal)
        : Promise.resolve(null),
    ])
      .then(([categories, subcategory]) => {
        if (controller.signal.aborted) return
        if (subcategoryId && !subcategory)
          throw new Error('This subcategory is no longer available.')
        let parentId =
          categoryId &&
          categories.some((category) => category.id === categoryId)
            ? categoryId
            : 0
        if (subcategory) {
          const parent = getSubcategoryParent(categories, subcategory.id)
          if (!parent)
            throw new Error(
              'The parent category could not be identified uniquely. Reload categories before editing this subcategory.',
            )
          parentId = parent.id
        }
        setData({ categories, subcategory, categoryId: parentId })
      })
      .catch((failure: unknown) => {
        if (!controller.signal.aborted) setError(getAuthErrors(failure).message)
      })
    return () => controller.abort()
  }, [subcategoryId, categoryId, attempt])
  if (data) return <SubcategoryFields data={data} onClose={onClose} />
  return (
    <CategoryDialog
      title={subcategoryId ? t('Edit subcategory') : t('Add subcategory')}
      description={t('Loading current categories and parent association.')}
      pending={false}
      onClose={onClose}
    >
      <RequestState
        loading={!error}
        error={error}
        onRetry={() => {
          setError(null)
          setAttempt((value) => value + 1)
        }}
      />
      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          {t('Cancel')}
        </Button>
      </div>
    </CategoryDialog>
  )
}

export default SubcategoryForm
