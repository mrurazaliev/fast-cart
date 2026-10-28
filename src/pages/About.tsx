import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Store, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ServicesSection from '@/shared/components/home/ServicesSection'
import storyImage from '@/assets/home/womens-collection.png'

const shoppingLinks = [
  {
    title: 'Discover',
    description: 'Browse products and find the details that matter to you.',
    to: '/products',
    icon: Store,
  },
  {
    title: 'Save',
    description: 'Keep your favourites together in your wishlist.',
    to: '/wishlist',
    icon: Heart,
  },
  {
    title: 'Your account',
    description: 'Sign in to manage your account and shopping cart.',
    to: '/account',
    icon: UserRound,
  },
  {
    title: 'Your cart',
    description: 'Review your products and choose the quantity you need.',
    to: '/cart',
    icon: ShoppingBag,
  },
]

const About = () => {
  return (
    <div className="pt-2 sm:pt-6">
      <nav aria-label="Breadcrumb" className="mb-10 text-sm sm:mb-14">
        <ol className="flex flex-wrap items-center gap-3">
          <li>
            <Link
              to="/"
              className="rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-muted-foreground">
            /
          </li>
          <li aria-current="page">About</li>
        </ol>
      </nav>
      <section
        aria-labelledby="about-title"
        className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
      >
        <div className="space-y-6">
          <h1
            id="about-title"
            className="text-4xl font-semibold tracking-wide sm:text-5xl"
          >
            Our Story
          </h1>
          <p className="text-sm leading-7 sm:text-base">
            FastCart brings product discovery, your favourites and your shopping
            cart together in one place. Explore the catalogue by category or
            search for something specific, then take a closer look at the
            product details.
          </p>
          <p className="text-sm leading-7 sm:text-base">
            Save the items you want to revisit, compare the available details
            and choose what belongs in your cart. Your next find starts with a
            look around.
          </p>
          <Button asChild className="h-12 rounded-sm px-8">
            <Link to="/products">Explore Our Products</Link>
          </Button>
        </div>
        <div className="overflow-hidden rounded-sm bg-black">
          <img
            src={storyImage}
            alt="Fashion editorial featuring a wide-brimmed hat"
            className="aspect-[1.35] w-full object-cover"
          />
        </div>
      </section>
      <section aria-label="Shopping with FastCart" className="py-16 sm:py-24">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {shoppingLinks.map(({ title, description, to, icon: Icon }) => (
            <li key={to} className="min-w-0">
              <Link
                to={to}
                className="group flex h-full flex-col items-center rounded-sm border px-5 py-8 text-center transition-colors hover:border-primary hover:bg-primary hover:text-white focus-visible:border-primary focus-visible:bg-primary focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <span
                  aria-hidden="true"
                  className="mb-5 flex size-16 items-center justify-center rounded-full bg-neutral-300 group-hover:bg-white/30 group-focus-visible:bg-white/30"
                >
                  <span className="flex size-11 items-center justify-center rounded-full bg-black text-white group-hover:bg-white group-hover:text-black group-focus-visible:bg-white group-focus-visible:text-black">
                    <Icon className="size-6" strokeWidth={1.75} />
                  </span>
                </span>
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="mt-3 text-sm leading-6">{description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <ServicesSection />
    </div>
  )
}

export default About
