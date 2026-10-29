import { useId } from 'react'
import { Star } from 'lucide-react'

const UnavailableFilters = () => {
  const id = useId()

  return (
    <>
      <fieldset
        disabled
        aria-describedby={`${id}-condition`}
        className="space-y-3 border-t pt-4"
      >
        <legend className="float-left mb-4 w-full font-semibold">
          Condition
        </legend>
        {['Any', 'Refurbished', 'Brand new', 'Old items'].map((condition) => (
          <label
            key={condition}
            className="flex items-center gap-3 text-sm text-muted-foreground"
          >
            <input
              type="radio"
              name={`${id}-condition`}
              value={condition}
              defaultChecked={condition === 'Any'}
              className="size-4 accent-primary"
            />
            {condition}
          </label>
        ))}
        <p id={`${id}-condition`} className="text-xs text-muted-foreground">
          Condition filtering is unavailable.
        </p>
      </fieldset>
      <fieldset
        disabled
        aria-describedby={`${id}-ratings`}
        className="space-y-3 border-t pt-4"
      >
        <legend className="float-left mb-4 w-full font-semibold">
          Ratings
        </legend>
        {[5, 4, 3, 2].map((rating) => (
          <label key={rating} className="flex items-center gap-3">
            <input
              type="checkbox"
              aria-label={`${rating} stars and up`}
              className="size-4 accent-primary"
            />
            <span className="flex gap-0.5" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={
                    star <= rating
                      ? 'size-4 fill-amber-500 text-amber-500'
                      : 'size-4 fill-muted text-muted-foreground/50'
                  }
                />
              ))}
            </span>
          </label>
        ))}
        <p id={`${id}-ratings`} className="text-xs text-muted-foreground">
          Rating filtering is unavailable.
        </p>
      </fieldset>
    </>
  )
}

export default UnavailableFilters
