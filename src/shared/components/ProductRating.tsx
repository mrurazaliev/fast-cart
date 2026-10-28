import { Star } from 'lucide-react'

const ProductRating = () => (
  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
    <span className="flex gap-1" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className="size-4 fill-none text-muted-foreground/50"
          strokeWidth={1.5}
        />
      ))}
    </span>
    <span>Rating unavailable</span>
  </div>
)

export default ProductRating
