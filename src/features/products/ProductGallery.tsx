import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import { getImageUrl } from '@/shared/api/imageUrl'
import { Button } from '@/components/ui/button'

const GalleryImage = ({
  filename,
  alt,
  thumbnail = false,
}: {
  filename: string | null
  alt: string
  thumbnail?: boolean
}) => {
  const url = getImageUrl(filename)
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  if (!url || failedUrl === url)
    return (
      <span className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
        <ImageOff className="size-7" aria-hidden="true" />
        {!thumbnail && 'Image unavailable'}
      </span>
    )
  return (
    <img
      src={url}
      alt={alt}
      onError={() => setFailedUrl(url)}
      className="size-full object-contain mix-blend-multiply"
    />
  )
}

const ProductGallery = ({
  images,
  name,
}: {
  images: string[]
  name: string
}) => {
  const filenames = [...new Set(images.filter((filename) => filename.trim()))]
  const [selected, setSelected] = useState<string | null>(filenames[0] || null)
  const active =
    selected && filenames.includes(selected) ? selected : filenames[0] || null

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[96px_minmax(0,1fr)]">
      <div className="flex h-80 min-w-0 items-center justify-center rounded-sm bg-secondary p-8 sm:h-[460px] lg:col-start-2 lg:row-start-1 lg:h-[560px]">
        <GalleryImage filename={active} alt={name} />
      </div>
      {filenames.length > 0 && (
        <div
          role="group"
          aria-label="Product images"
          className="flex min-w-0 gap-3 overflow-x-auto pb-2 lg:col-start-1 lg:row-start-1 lg:max-h-[560px] lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto lg:pb-0"
        >
          {filenames.map((filename, index) => (
            <Button
              key={filename}
              type="button"
              variant="ghost"
              aria-label={`Show image ${index + 1} of ${name}`}
              aria-pressed={active === filename}
              onClick={() => setSelected(filename)}
              className="size-20 shrink-0 rounded-sm border border-transparent bg-secondary p-3 hover:bg-secondary aria-pressed:border-primary focus-visible:ring-primary lg:h-28 lg:w-full"
            >
              <GalleryImage filename={filename} alt="" thumbnail />
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductGallery
