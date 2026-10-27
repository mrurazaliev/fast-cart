import { useAppSelector } from '@/app/hooks'
import { getCategoryLink } from '@/features/categories/categoryLinks'
import SectionHeading from '@/shared/components/home/SectionHeading'
import FeaturedTile from '@/shared/components/home/FeaturedTile'
import playstationImage from '@/assets/home/playstation.png'
import womensImage from '@/assets/home/womens-collection.png'
import speakersImage from '@/assets/home/speakers.png'
import perfumeImage from '@/assets/home/perfume.png'

const NewArrival = () => {
  const categories = useAppSelector((state) => state.categories.items)

  return (
    <section
      aria-labelledby="new-arrival-title"
      className="mt-12 space-y-8 sm:mt-16"
    >
      <SectionHeading
        id="new-arrival-title"
        label="Featured"
        title="New Arrival"
      />
      <div className="grid min-w-0 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[284px_284px]">
        <FeaturedTile
          id="featured-playstation"
          title="PlayStation 5"
          description="Explore gaming and electronics."
          image={playstationImage}
          alt="Black and white PlayStation 5 consoles with a controller"
          to={getCategoryLink(categories, 'Electronic')}
          className="min-h-100 sm:col-span-2 sm:min-h-120 lg:row-span-2 lg:min-h-0"
          imageClassName="object-bottom p-4 pt-12"
        />
        <FeaturedTile
          id="featured-womens"
          title="Women's Collections"
          description="Discover your next style."
          image={womensImage}
          alt="Woman wearing a wide-brimmed black hat"
          to={getCategoryLink(categories, "Woman's Fashion")}
          className="min-h-64 sm:col-span-2 sm:min-h-72 lg:min-h-0"
          imageClassName="object-cover object-right p-0"
        />
        <FeaturedTile
          id="featured-speakers"
          title="Speakers"
          description="Make room for great sound."
          image={speakersImage}
          alt="Three Amazon Echo speakers"
          to={getCategoryLink(categories, 'Electronic')}
          className="min-h-72 lg:min-h-0"
          imageClassName="px-8 pt-4 pb-12"
        />
        <FeaturedTile
          id="featured-perfume"
          title="Perfume"
          description="Find your signature scent."
          image={perfumeImage}
          alt="Perfume bottle and presentation box"
          to={getCategoryLink(categories, 'Health & Beauty')}
          className="min-h-72 lg:min-h-0"
          imageClassName="px-8 pt-4 pb-12"
        />
      </div>
    </section>
  )
}

export default NewArrival
