import { ChartNoAxesCombined } from 'lucide-react'

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const SalesRevenue = () => (
  <section
    aria-labelledby="sales-revenue-heading"
    className="flex h-[326px] min-w-0 flex-col rounded-[3px] border border-[#e6e6ec] p-5"
  >
    <h2
      id="sales-revenue-heading"
      className="text-base leading-6 font-semibold"
    >
      Sales Revenue
    </h2>
    <div
      role="img"
      aria-label="Sales revenue chart unavailable: no financial time series is provided"
      className="relative mt-4 min-h-0 flex-1 pl-6"
    >
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 flex w-4 flex-col justify-between text-[10px] leading-none text-[#9aa3c8]"
      >
        {Array.from({ length: 6 }, (_, index) => (
          <span key={index}>—</span>
        ))}
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 left-6 flex flex-col justify-between"
      >
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="border-t border-dashed border-[#dde5ff]"
          />
        ))}
      </div>
      <div className="relative flex h-full items-center justify-center p-3 text-center">
        <div className="max-w-[240px] space-y-2 bg-white/95 p-4">
          <ChartNoAxesCombined
            aria-hidden="true"
            className="mx-auto size-8 text-primary/40"
          />
          <p className="text-sm font-medium">Sales revenue unavailable</p>
          <p className="text-xs leading-5 text-[#7f88ad]">
            Monthly financial data is not provided by the current API.
          </p>
        </div>
      </div>
    </div>
    <div
      aria-hidden="true"
      className="mt-3 grid grid-cols-12 pl-6 text-center text-[9px] leading-4 text-[#9aa3c8] sm:text-[11px]"
    >
      {months.map((month) => (
        <span key={month}>{month}</span>
      ))}
    </div>
  </section>
)
export default SalesRevenue
