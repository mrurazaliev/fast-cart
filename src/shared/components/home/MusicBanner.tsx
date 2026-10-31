import { useText } from '@/shared/i18n/useText'
import { Link } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { getCategoryLink } from '@/features/categories/categoryLinks'
import { Button } from '@/components/ui/button'
import speakerImage from '@/assets/home/music-speaker.png'

const MusicBanner = () => {
  const { t } = useText()

  const categories = useAppSelector((state) => state.categories.items)
  return (
    <section
      aria-labelledby="music-banner-title"
      className="mt-12 grid min-w-0 overflow-hidden bg-black text-white sm:mt-16 md:min-h-100 md:grid-cols-[.9fr_1.1fr]"
    >
      <div className="flex flex-col items-start justify-center gap-7 px-6 py-10 sm:px-10 lg:py-14 lg:pl-14">
        <p className="text-sm font-semibold text-green-400">
          {t('Categories')}
        </p>
        <h2
          id="music-banner-title"
          className="text-3xl leading-tight font-semibold tracking-wide sm:text-4xl lg:text-5xl"
        >
          {t('Enhance your music experience')}
        </h2>
        <Button
          asChild
          className="h-12 rounded-sm bg-green-500 px-10 text-black hover:bg-green-400 focus-visible:ring-green-400"
        >
          <Link to={getCategoryLink(categories, 'Electronic')}>
            {t('Shop Now')}
          </Link>
        </Button>
      </div>
      <div className="relative flex min-h-64 items-center justify-center px-6 pb-10 md:min-h-80 md:py-10 lg:pr-12">
        <div
          aria-hidden="true"
          className="absolute inset-10 rounded-full bg-white/20 blur-3xl"
        />
        <img
          src={speakerImage}
          alt={t('Black JBL portable speaker')}
          width="568"
          height="330"
          loading="lazy"
          className="relative max-h-96 w-full object-contain"
        />
      </div>
    </section>
  )
}

export default MusicBanner
