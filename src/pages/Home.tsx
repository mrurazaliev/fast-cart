import { ShoppingCart } from 'lucide-react'

const Home = () => {
  return (
    <section className="max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <ShoppingCart className="size-8 text-primary" aria-hidden="true" />
        <span className="text-2xl font-semibold tracking-tight">
          FastCart Admin
        </span>
      </div>
      <div className="h-1 w-12 rounded-full bg-primary" />
      <h1 className="text-3xl leading-tight font-semibold sm:text-5xl">
        Your admin workspace.
      </h1>
      <p className="text-base leading-7 text-muted-foreground">
        The administration foundation is ready. Product and catalog management
        will be added in the next stages.
      </p>
    </section>
  )
}

export default Home
