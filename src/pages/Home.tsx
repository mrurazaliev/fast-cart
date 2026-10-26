import { ShoppingCart } from 'lucide-react'

const Home = () => {
  return (
    <section className="max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <ShoppingCart className="size-8 text-primary" aria-hidden="true" />
        <span className="text-2xl font-semibold tracking-tight">FastCart</span>
      </div>
      <div className="h-1 w-12 rounded-full bg-primary" />
      <h1 className="text-3xl leading-tight font-semibold sm:text-5xl">
        A new shopping experience is on its way.
      </h1>
      <p className="text-base leading-7 text-muted-foreground">
        We’re getting the store ready. Products and shopping features are coming
        soon.
      </p>
    </section>
  )
}

export default Home
