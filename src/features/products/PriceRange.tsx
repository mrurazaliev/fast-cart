import { useText } from '@/shared/i18n/useText'
import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { Slider } from 'radix-ui'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type PriceRangeProps = {
  minPrice?: number
  maxPrice?: number
  bounds: { minPrice: number; maxPrice: number } | null
  onApply: (minPrice?: number, maxPrice?: number) => void
}

const PriceRange = ({
  minPrice,
  maxPrice,
  bounds,
  onApply,
}: PriceRangeProps) => {
  const { t } = useText()

  const [minimum, setMinimum] = useState(minPrice?.toString() || '')
  const [maximum, setMaximum] = useState(maxPrice?.toString() || '')
  const [error, setError] = useState<string | null>(null)
  const id = useId()
  const sliderMax = Math.max(
    bounds?.maxPrice || 0,
    minPrice || 0,
    maxPrice || 0,
  )
  const sliderMinValue = Math.min(sliderMax, Math.max(0, Number(minimum) || 0))
  const sliderMaxValue = maximum.trim() ? Number(maximum) : sliderMax

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const min = minimum.trim() ? Number(minimum) : undefined
    const max = maximum.trim() ? Number(maximum) : undefined
    if (min !== undefined && (!Number.isFinite(min) || min < 0)) {
      setError('Minimum price must be zero or greater.')
      return
    }
    if (max !== undefined && (!Number.isFinite(max) || max <= 0)) {
      setError('Maximum price must be greater than zero.')
      return
    }
    if (min !== undefined && max !== undefined && min > max) {
      setError('Minimum price cannot exceed maximum price.')
      return
    }
    setError(null)
    onApply(min, max)
  }

  return (
    <section
      aria-labelledby={`${id}-heading`}
      className="space-y-4 border-t pt-4"
    >
      <h2 id={`${id}-heading`} className="font-semibold">
        {t('Price range')}
      </h2>
      <form noValidate onSubmit={handleSubmit} className="space-y-4">
        {bounds && sliderMax > 0 && (
          <Slider.Root
            min={0}
            max={sliderMax}
            step={0.01}
            minStepsBetweenThumbs={0}
            value={[
              sliderMinValue,
              Math.max(
                sliderMinValue,
                Math.min(sliderMax, sliderMaxValue || 0),
              ),
            ]}
            onValueChange={([min, max]) => {
              setMinimum(String(min))
              setMaximum(String(max))
              setError(null)
            }}
            className="relative flex h-6 w-full touch-none items-center select-none"
          >
            <Slider.Track className="relative h-1 grow rounded-full bg-primary/20">
              <Slider.Range className="absolute h-full bg-primary" />
            </Slider.Track>
            {['Minimum price', 'Maximum price'].map((label) => (
              <Slider.Thumb
                key={label}
                aria-label={t(label || '')}
                className="block size-4 rounded-full border border-primary bg-background shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              />
            ))}
          </Slider.Root>
        )}
        <div className="grid grid-cols-2 gap-2">
          <label
            htmlFor={`${id}-min`}
            className="min-w-0 space-y-1 text-xs text-muted-foreground"
          >
            <span>{t('Min')}</span>
            <Input
              id={`${id}-min`}
              name="MinPrice"
              inputMode="decimal"
              value={minimum}
              placeholder="0"
              aria-invalid={!!error}
              aria-describedby={error ? `${id}-error` : undefined}
              onChange={(event) => {
                setMinimum(event.target.value)
                setError(null)
              }}
            />
          </label>
          <label
            htmlFor={`${id}-max`}
            className="min-w-0 space-y-1 text-xs text-muted-foreground"
          >
            <span>{t('Max')}</span>
            <Input
              id={`${id}-max`}
              name="MaxPrice"
              inputMode="decimal"
              value={maximum}
              placeholder={bounds?.maxPrice.toString() || t('Any')}
              aria-invalid={!!error}
              aria-describedby={error ? `${id}-error` : undefined}
              onChange={(event) => {
                setMaximum(event.target.value)
                setError(null)
              }}
            />
          </label>
        </div>
        {error && (
          <p
            id={`${id}-error`}
            role="alert"
            className="text-xs text-destructive"
          >
            {t(error || '')}
          </p>
        )}
        <Button
          type="submit"
          variant="outline"
          className="w-full border-primary text-primary"
        >
          {t('Apply')}
        </Button>
        {(minPrice !== undefined || maxPrice !== undefined) && (
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => onApply()}
          >
            {t('Reset price')}
          </Button>
        )}
      </form>
    </section>
  )
}

export default PriceRange
