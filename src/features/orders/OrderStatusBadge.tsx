import { useText } from '@/shared/i18n/useText'
const OrderStatusBadge = ({
  value,
  payment = false,
}: {
  value: string
  payment?: boolean
}) => {
  const { t } = useText()

  let style = 'bg-secondary text-muted-foreground'
  const status = value.trim().toLowerCase()
  if (payment && status === 'paid')
    style = 'bg-[#B9F5DC] text-[#075d40] dark:bg-[#153e31] dark:text-[#8ce4b8]'
  else if (!payment && status === 'ready')
    style = 'bg-[#FF9900] text-[#351f00] dark:bg-[#60400f] dark:text-[#ffd69a]'
  else if (!payment && status === 'shipped') style = 'bg-[#5A6080] text-white'
  else if (!payment && status === 'received')
    style = 'bg-primary text-primary-foreground'
  return (
    <span className={`inline-flex rounded-sm px-2 py-0.5 text-sm ${style}`}>
      {t(
        (
          {
            paid: 'Paid',
            ready: 'Ready',
            shipped: 'Shipped',
            received: 'Received',
          } as Record<string, string>
        )[status] ||
          value ||
          'Unknown',
      )}
    </span>
  )
}
export default OrderStatusBadge
