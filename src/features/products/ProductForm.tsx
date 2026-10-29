import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from 'react-redux'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import { useAppDispatch } from '@/app/hooks'
import type { RootState } from '@/app/store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getAuthErrors } from '@/features/auth/authApi'
import { productsInvalidated } from './productsSlice'
import { createProductSchema, emptyProductValues } from './productFormSchema'
import type { ProductFormValues } from './productFormSchema'
import { createProduct, isUncertainProductError } from './productFormApi'
import type { ProductLookups } from './productFormApi'
import ProductField from './ProductField'
import ProductFiles from './ProductFiles'
import ProductSavedDialog from './ProductSavedDialog'

const selectClassName =
  'h-12 w-full min-w-0 rounded-sm border bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-primary'

const ProductForm = ({
  lookups,
  backTo,
}: {
  lookups: ProductLookups
  backTo: string
}) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const store = useStore<RootState>()
  const submitting = useRef(false)
  const controller = useRef<AbortController | null>(null)
  const [saved, setSaved] = useState(false)
  const [unconfirmed, setUnconfirmed] = useState(false)
  const {
    register,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: emptyProductValues,
  })
  const categoryId = useWatch({ control, name: 'categoryId' })
  const hasDiscount = useWatch({ control, name: 'hasDiscount' })
  const files = useWatch({ control, name: 'newImages' })
  const category = lookups.categories.find((item) => item.id === categoryId)
  const disabled = isSubmitting || saved || unconfirmed

  useEffect(() => () => controller.current?.abort(), [])

  const onSubmit = async (values: ProductFormValues) => {
    if (
      !lookups.categories
        .find((item) => item.id === values.categoryId)
        ?.subCategories.some((item) => item.id === values.subCategoryId)
    ) {
      setError('subCategoryId', {
        message: 'Choose a subcategory belonging to this category.',
      })
      return
    }
    if (
      !lookups.brands.some((item) => item.id === values.brandId) ||
      !lookups.colors.some((item) => item.id === values.colorId)
    ) {
      setError('root', { message: 'Choose an available brand and color.' })
      return
    }
    const session = store.getState().auth.session
    if (!session) {
      setError('root', { message: 'Please sign in again before saving.' })
      return
    }
    const request = new AbortController()
    controller.current = request
    try {
      const confirmed = await createProduct(values, request.signal)
      if (request.signal.aborted || session !== store.getState().auth.session)
        return
      dispatch(productsInvalidated())
      if (!confirmed) {
        setUnconfirmed(true)
        setError('root', {
          message:
            'The server responded, but the save could not be confirmed. Check the product list before trying again.',
        })
        return
      }
      setSaved(true)
    } catch (error) {
      if (request.signal.aborted || session !== store.getState().auth.session)
        return
      const result = getAuthErrors(error)
      if (isUncertainProductError(error)) {
        setUnconfirmed(true)
        dispatch(productsInvalidated())
      }
      setError('root', { message: result.message })
      for (const field of Object.keys(
        emptyProductValues,
      ) as (keyof ProductFormValues)[]) {
        if (result.fields[field])
          setError(field, { message: result.fields[field] })
      }
    }
  }

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting.current || saved || unconfirmed) return
    submitting.current = true
    try {
      await handleSubmit(onSubmit)(event)
    } finally {
      submitting.current = false
    }
  }

  return (
    <section className="space-y-6" aria-labelledby="product-form-heading">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1
          id="product-form-heading"
          className="flex items-center gap-3 text-2xl font-semibold"
        >
          <ArrowLeft
            className="size-5 text-muted-foreground"
            aria-hidden="true"
          />
          Products / Add new
        </h1>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => navigate(backTo)}
          >
            Cancel
          </Button>
          <Button type="submit" form="product-form" disabled={disabled}>
            {isSubmitting ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>
      {errors.root?.message && (
        <p role="alert" className="text-sm text-destructive">
          {errors.root.message}
        </p>
      )}
      {saved && (
        <div
          role="status"
          className="space-y-3 rounded-sm border border-primary/30 p-4"
        >
          <p>Product created. The server confirmed the save.</p>
          <Button asChild>
            <Link to={backTo}>Back to products</Link>
          </Button>
        </div>
      )}
      {unconfirmed && (
        <Button asChild variant="outline">
          <Link to={backTo}>Check product list</Link>
        </Button>
      )}
      <form
        id="product-form"
        noValidate
        onSubmit={(event) => void handleFormSubmit(event)}
        aria-busy={isSubmitting}
      >
        <fieldset
          disabled={disabled}
          className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1.7fr)_minmax(260px,1fr)]"
        >
          <div className="min-w-0 space-y-6">
            <h2 className="font-semibold">Information</h2>
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_160px]">
              <ProductField
                name="productName"
                label="Product name"
                error={errors.productName?.message}
              >
                <Input
                  id="productName"
                  {...register('productName')}
                  maxLength={100}
                  aria-invalid={!!errors.productName}
                  aria-describedby={
                    errors.productName ? 'productName-error' : undefined
                  }
                  className="h-12"
                />
              </ProductField>
              <ProductField
                name="code"
                label="Code"
                error={errors.code?.message}
              >
                <Input
                  id="code"
                  {...register('code')}
                  aria-invalid={!!errors.code}
                  className="h-12"
                />
              </ProductField>
            </div>
            <ProductField
              name="description"
              label="Description"
              error={errors.description?.message}
            >
              <textarea
                id="description"
                {...register('description')}
                maxLength={500}
                rows={7}
                aria-invalid={!!errors.description}
                className="w-full rounded-sm border p-3 text-sm focus-visible:outline-2 focus-visible:outline-primary"
              />
            </ProductField>
            <div className="grid gap-4 sm:grid-cols-2">
              <ProductField
                name="categoryId"
                label="Category"
                error={errors.categoryId?.message}
              >
                <select
                  id="categoryId"
                  {...register('categoryId', {
                    valueAsNumber: true,
                    onChange: () => setValue('subCategoryId', 0),
                  })}
                  aria-invalid={!!errors.categoryId}
                  className={selectClassName}
                >
                  <option value={0}>Choose category</option>
                  {lookups.categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.categoryName} (#{item.id})
                    </option>
                  ))}
                </select>
              </ProductField>
              <ProductField
                name="subCategoryId"
                label="Subcategory"
                error={errors.subCategoryId?.message}
              >
                <select
                  id="subCategoryId"
                  {...register('subCategoryId', { valueAsNumber: true })}
                  disabled={disabled || !category}
                  aria-invalid={!!errors.subCategoryId}
                  className={selectClassName}
                >
                  <option value={0}>Choose subcategory</option>
                  {category?.subCategories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.subCategoryName} (#{item.id})
                    </option>
                  ))}
                </select>
              </ProductField>
              <ProductField
                name="brandId"
                label="Brand"
                error={errors.brandId?.message}
              >
                <select
                  id="brandId"
                  {...register('brandId', { valueAsNumber: true })}
                  aria-invalid={!!errors.brandId}
                  className={selectClassName}
                >
                  <option value={0}>Choose brand</option>
                  {lookups.brands.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.brandName} (#{item.id})
                    </option>
                  ))}
                </select>
              </ProductField>
              <ProductField
                name="quantity"
                label="Stock quantity"
                error={errors.quantity?.message}
              >
                <Input
                  id="quantity"
                  type="number"
                  min={0}
                  step={1}
                  {...register('quantity', { valueAsNumber: true })}
                  aria-invalid={!!errors.quantity}
                  className="h-12"
                />
              </ProductField>
            </div>
            <h2 className="font-semibold">Price</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <ProductField
                name="price"
                label="Regular price"
                error={errors.price?.message}
              >
                <Input
                  id="price"
                  type="number"
                  min={0}
                  step="any"
                  {...register('price', { valueAsNumber: true })}
                  aria-invalid={!!errors.price}
                  className="h-12"
                />
              </ProductField>
              <ProductField
                name="discountPrice"
                label="Discounted price"
                error={errors.discountPrice?.message}
              >
                <Input
                  id="discountPrice"
                  type="number"
                  min={0}
                  step="any"
                  {...register('discountPrice', {
                    setValueAs: (value: string) =>
                      value === '' ? null : Number(value),
                  })}
                  disabled={disabled || !hasDiscount}
                  aria-invalid={!!errors.discountPrice}
                  className="h-12"
                />
              </ProductField>
            </div>
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                {...register('hasDiscount')}
                className="size-4 accent-primary"
              />
              Apply a discounted price
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <ProductField
                name="size"
                label="Size"
                error={errors.size?.message}
              >
                <Input id="size" {...register('size')} className="h-12" />
              </ProductField>
              <ProductField
                name="weight"
                label="Weight"
                error={errors.weight?.message}
              >
                <Input id="weight" {...register('weight')} className="h-12" />
              </ProductField>
            </div>
          </div>
          <div className="min-w-0 space-y-6">
            <div className="rounded-sm border p-5">
              <ProductField
                name="colorId"
                label="Color"
                error={errors.colorId?.message}
              >
                <select
                  id="colorId"
                  {...register('colorId', { valueAsNumber: true })}
                  aria-invalid={!!errors.colorId}
                  className={selectClassName}
                >
                  <option value={0}>Choose color</option>
                  {lookups.colors.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.colorName} (#{item.id})
                    </option>
                  ))}
                </select>
              </ProductField>
            </div>
            <p className="rounded-sm border p-5 text-sm leading-6 text-muted-foreground">
              Tags, tax, HEX colors and multiple variants are unavailable. The
              description is saved as plain text.
            </p>
            <ProductFiles
              files={files}
              onChange={(value) =>
                setValue('newImages', value, { shouldValidate: true })
              }
              error={errors.newImages?.message}
              disabled={disabled}
            />
          </div>
        </fieldset>
      </form>
      {saved && (
        <ProductSavedDialog message="Product created" backTo={backTo} />
      )}
    </section>
  )
}

export default ProductForm
