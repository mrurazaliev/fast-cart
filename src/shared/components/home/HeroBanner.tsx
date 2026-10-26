import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import iphoneImage from '@/assets/iphone-14-pro.jpg'

const HeroBanner = () => {
  return (
    <section
      aria-labelledby="hero-title"
      className="grid min-w-0 overflow-hidden bg-black text-white sm:grid-cols-[1fr_1.05fr] lg:min-h-86"
    >
      <div className="relative z-10 flex flex-col items-start justify-center gap-5 px-6 py-8 sm:py-10 sm:pl-8 lg:pl-12">
        <p className="flex items-center gap-4 text-sm">
          <svg
            viewBox="0 0 24 28"
            fill="currentColor"
            className="h-9 w-8"
            aria-hidden="true"
          >
            <path d="M17.4 4.5c1-1.2 1.7-2.8 1.5-4.5-1.5.1-3.3 1-4.4 2.2-1 1-1.8 2.6-1.6 4.2 1.7.2 3.4-.8 4.5-1.9ZM21 15c0-3.1 2.5-4.7 2.6-4.8-1.4-2.2-3.6-2.4-4.4-2.5-1.9-.2-3.7 1.1-4.7 1.1s-2.4-1.1-4-1c-2.1 0-4 1.2-5 3-2.2 3.8-.6 9.5 1.5 12.6 1 1.5 2.2 3.1 3.8 3 1.5 0 2.1-1 4-1s2.4 1 4 1c1.6 0 2.7-1.5 3.7-3 .9-1.3 1.5-2.7 1.7-3.2-.1 0-3.2-1.3-3.2-5.2Z" />
          </svg>
          iPhone 14 Series
        </p>
        <h1
          id="hero-title"
          className="text-4xl leading-[1.22] font-medium tracking-wide sm:text-[38px] xl:text-5xl"
        >
          Up to 10%
          <br />
          off Voucher
        </h1>
        <Link
          to="/products"
          className="inline-flex items-center gap-3 rounded-sm py-1 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <span className="border-b border-white pb-1">Shop Now</span>
          <ArrowRight className="size-5" aria-hidden="true" />
        </Link>
      </div>
      <div className="relative min-h-52 sm:min-h-80">
        <img
          src={iphoneImage}
          alt="Purple iPhone 14 Pro, front display and rear cameras"
          width="1440"
          height="810"
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover object-center"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/70" />
      </div>
    </section>
  )
}

export default HeroBanner
