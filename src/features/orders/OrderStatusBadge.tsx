const OrderStatusBadge = ({
  value,
  payment = false,
}: {
  value: string
  payment?: boolean
}) => {
  let style = 'bg-[#E6E9F4] text-[#5A6384]'
  const status = value.trim().toLowerCase()
  if (payment && status === 'paid') style = 'bg-[#B9F5DC] text-[#00A66A]'
  else if (!payment && status === 'ready') style = 'bg-[#FF9900] text-white'
  else if (!payment && status === 'shipped') style = 'bg-[#5A6080] text-white'
  else if (!payment && status === 'received') style = 'bg-primary text-white'
  return (
    <span className={`inline-flex rounded-sm px-2 py-0.5 text-sm ${style}`}>
      {value || 'Unknown'}
    </span>
  )
}
export default OrderStatusBadge
