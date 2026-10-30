import { ArrowRight, PackageSearch } from 'lucide-react'

const TopSellingProducts = () => (
  <section
    aria-labelledby="top-selling-heading"
    className="flex min-h-[300px] min-w-0 flex-col rounded-[3px] border border-[#e6e6ec] p-4 lg:h-[426px]"
  >
    <div className="flex items-start justify-between gap-3">
      <h2
        id="top-selling-heading"
        className="text-base leading-6 font-semibold"
      >
        Top selling products
      </h2>
      <button
        type="button"
        disabled
        aria-describedby="top-selling-unavailable"
        title="A sales ranking is not available from the API."
        className="inline-flex shrink-0 items-center gap-2 pt-0.5 text-xs leading-5 font-medium text-foreground/50 disabled:cursor-not-allowed"
      >
        See All
        <ArrowRight aria-hidden="true" className="size-4" />
      </button>
    </div>
    <div
      id="top-selling-unavailable"
      role="status"
      className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-2 py-10 text-center"
    >
      <PackageSearch aria-hidden="true" className="size-9 text-[#a2a9c5]" />
      <p className="text-sm font-medium">Sales ranking unavailable</p>
      <p className="max-w-56 text-xs leading-5 text-[#7f88ad]">
        Sales and units-sold data are not provided. Catalog stock is not a sales
        ranking.
      </p>
    </div>
  </section>
)
export default TopSellingProducts
