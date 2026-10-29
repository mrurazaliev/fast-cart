import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import { getImageUrl } from '@/shared/api/imageUrl'

const ProductImage = ({
  image,
  name,
}: {
  image: string | null | undefined
  name: string
}) => {
  const [failedImage, setFailedImage] = useState<string | null>(null)
  const imageUrl = getImageUrl(image)
  return (
    <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-secondary">
      {imageUrl && failedImage !== imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          loading="lazy"
          onError={() => setFailedImage(imageUrl)}
          className="size-full object-contain"
        />
      ) : (
        <span role="img" aria-label={`Image unavailable for ${name}`}>
          <ImageOff
            className="size-5 text-muted-foreground"
            aria-hidden="true"
          />
        </span>
      )}
    </span>
  )
}

export default ProductImage
