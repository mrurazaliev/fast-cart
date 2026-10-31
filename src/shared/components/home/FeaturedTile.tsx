import { useText } from '@/shared/i18n/useText'
import { Link } from 'react-router-dom'
import type { To } from 'react-router-dom'
import { cn } from '@/shared/utils'

type FeaturedTileProps = {
  id: string
  title: string
  description: string
  image: string
  alt: string
  to: To
  className?: string
  imageClassName?: string
}

const FeaturedTile = ({
  id,
  title,
  description,
  image,
  alt,
  to,
  className,
  imageClassName,
}: FeaturedTileProps) => {
  const { t } = useText()

  return (
    <article
      aria-labelledby={id}
      className={cn(
        'relative isolate min-w-0 overflow-hidden bg-black text-white',
        className,
      )}
    >
      <img
        src={image}
        alt={alt}
        loading="lazy"
        className={cn(
          'absolute inset-0 size-full object-contain p-6',
          imageClassName,
        )}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-black/90 via-black/10 to-transparent"
      />
      <div className="absolute inset-x-6 bottom-6 space-y-3 sm:inset-x-8 sm:bottom-8">
        <h3 id={id} className="text-xl font-semibold tracking-wide lg:text-2xl">
          {t(title || '')}
        </h3>
        <p className="max-w-64 text-sm leading-5 text-neutral-200">
          {t(description || '')}
        </p>
        <Link
          to={to}
          aria-label={t('Shop {{value0}}', { value0: title })}
          className="inline-block rounded-sm border-b border-white/70 pb-1 text-sm font-medium hover:border-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          {t('Shop Now')}
        </Link>
      </div>
    </article>
  )
}

export default FeaturedTile
