export type OrderDisplayRow = {
  id: string
  order: string
  date: string
  customer: string
  paymentStatus: string
  orderStatus: string
  total: string
}

export type OrdersViewState =
  | { status: 'unavailable' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | {
      status: 'ready'
      rows: OrderDisplayRow[]
      query: string
      page: number
      totalPages: number
      totalResults: number
    }
