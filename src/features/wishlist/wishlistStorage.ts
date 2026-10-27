const storageKey = 'fastcart-wishlist'

export const readWishlistIds = (): number[] => {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey) || '[]')
    if (!Array.isArray(value)) return []
    return [
      ...new Set(
        value.filter(
          (id): id is number =>
            typeof id === 'number' && Number.isSafeInteger(id) && id > 0,
        ),
      ),
    ]
  } catch {
    return []
  }
}

export const saveWishlistIds = (ids: number[]) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(ids))
  } catch {
    return
  }
}
