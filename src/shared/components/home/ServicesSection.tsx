import { Headset, ShieldCheck, Truck } from 'lucide-react'

const services = [
  {
    title: 'DELIVERY',
    description: 'Delivery options and shipping information.',
    icon: <Truck className="size-7" strokeWidth={1.75} />,
  },
  {
    title: 'CUSTOMER SUPPORT',
    description: 'Help with products and shopping.',
    icon: <Headset className="size-7" strokeWidth={1.75} />,
  },
  {
    title: 'RETURNS',
    description: 'Returns and refund information.',
    icon: <ShieldCheck className="size-7" strokeWidth={1.75} />,
  },
]

const ServicesSection = () => {
  return (
    <section aria-label="Shopping services" className="py-16 sm:py-24">
      <ul className="mx-auto grid max-w-5xl gap-12 sm:grid-cols-3 sm:gap-6">
        {services.map(({ title, description, icon }) => (
          <li
            key={title}
            className="flex min-w-0 flex-col items-center text-center"
          >
            <div
              aria-hidden="true"
              className="mb-6 flex size-20 items-center justify-center rounded-full bg-neutral-300"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-black text-white">
                {icon}
              </span>
            </div>
            <h2 className="text-base font-semibold lg:text-lg">{title}</h2>
            <p className="mt-2 max-w-64 text-sm leading-6">{description}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ServicesSection
