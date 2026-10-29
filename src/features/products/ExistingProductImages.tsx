import { Trash2, Undo2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProductImage from './ProductImage'
import type { ProductImageData } from './productEditApi'

const ExistingProductImages = ({
  images,
  removedIds,
  onToggle,
  disabled,
}: {
  images: ProductImageData[]
  removedIds: number[]
  onToggle: (id: number) => void
  disabled: boolean
}) => (
  <section aria-labelledby="existing-images-heading" className="space-y-3">
    <h2 id="existing-images-heading" className="font-semibold">
      Existing images
    </h2>
    <p className="text-xs text-muted-foreground">
      Removals are applied only when you save. You can undo them before saving.
    </p>
    {images.length === 0 && (
      <p className="text-sm text-muted-foreground">No existing images.</p>
    )}
    <ul className="divide-y rounded-sm border">
      {images.map((image) => {
        const removed = removedIds.includes(image.id)
        return (
          <li
            key={image.id}
            className={`flex items-center gap-3 p-3 ${removed ? 'bg-muted' : ''}`}
          >
            <ProductImage
              image={image.images}
              name={`Existing image ${image.id}`}
            />
            <div className="min-w-0 flex-1 text-xs">
              <p className="break-words">{image.images}</p>
              {removed && (
                <p className="text-destructive">Marked for removal</p>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={disabled}
              aria-label={
                removed
                  ? `Undo removal of image ${image.id}`
                  : `Remove existing image ${image.id}`
              }
              onClick={() => onToggle(image.id)}
            >
              {removed ? (
                <Undo2 aria-hidden="true" />
              ) : (
                <Trash2 aria-hidden="true" />
              )}
            </Button>
          </li>
        )
      })}
    </ul>
  </section>
)

export default ExistingProductImages
