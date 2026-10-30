import { BadgePercent, ChartNoAxesColumnIncreasing, Check } from 'lucide-react'

const metrics = {
  Sales: {
    icon: ChartNoAxesColumnIncreasing,
    background: 'bg-[#fff4f2]',
    back: 'bg-[#ffb2a0]',
    front: 'bg-[#ff9b87]',
  },
  Cost: {
    icon: BadgePercent,
    background: 'bg-[#fff9e9]',
    back: 'bg-[#ffcf9e]',
    front: 'bg-[#ffb682]',
  },
  Profit: {
    icon: Check,
    background: 'bg-[#effbf7]',
    back: 'bg-[#50d56e]',
    front: 'bg-[#8ee493]',
  },
}

const DashboardMetric = ({ label }: { label: keyof typeof metrics }) => {
  const { icon: Icon, background, back, front } = metrics[label]
  return (
    <div
      className={`flex h-[84px] min-w-0 items-center gap-3 rounded-[3px] px-4 sm:px-5 lg:px-3 xl:px-5 ${background}`}
    >
      <span
        aria-hidden="true"
        className="relative flex size-11 shrink-0 items-center justify-center"
      >
        <span className={`absolute inset-1 -rotate-12 rounded-lg ${back}`} />
        <span
          className={`relative flex size-9 items-center justify-center rounded-lg text-white ${front}`}
        >
          <Icon className="size-6" strokeWidth={2} />
        </span>
      </span>
      <div className="min-w-0">
        <p className="text-sm leading-5 text-[#707584]">{label}</p>
        <p
          aria-label={`${label} unavailable`}
          className="text-[28px] leading-8 font-semibold"
        >
          —
        </p>
      </div>
    </div>
  )
}
export default DashboardMetric
