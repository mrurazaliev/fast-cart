import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import { getImageUrl } from '@/shared/api/imageUrl'

const CategoryImage = ({
  image,
  name,
}: {
  image: string | null | undefined
  name: string
}) => {
  const [failed, setFailed] = useState<string | null>(null)
  const url = getImageUrl(image)
  return (
    <div className="flex h-16 items-center justify-start overflow-hidden">
      {url && failed !== url ? (
        <img
          src={url}
          alt={name}
          loading="lazy"
          onError={() => setFailed(url)}
          className="max-h-full max-w-full object-contain"
        />
      ) : (
        <span role="img" aria-label={`Image unavailable for ${name}`}>
          <ImageOff
            aria-hidden="true"
            className="size-10 text-muted-foreground"
          />
        </span>
      )}
    </div>
  )
}
export default CategoryImage
