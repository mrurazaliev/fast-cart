export const flashSaleStartsAt = '2026-10-29T00:00:00+05:00'
export const flashSaleEndsAt = '2026-11-05T00:00:00+05:00'

export const getFlashSaleTime = (now: number) => {
  const start = Date.parse(flashSaleStartsAt)
  const end = Date.parse(flashSaleEndsAt)
  const seconds = Math.ceil(Math.max(0, end - Math.max(start, now)) / 1000)

  return {
    Days: Math.floor(seconds / 86400),
    Hours: Math.floor((seconds % 86400) / 3600),
    Minutes: Math.floor((seconds % 3600) / 60),
    Seconds: seconds % 60,
  }
}
