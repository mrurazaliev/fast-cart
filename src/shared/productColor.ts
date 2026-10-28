const colorSwatches: Record<string, string> = {
  black: '#171717',
  white: '#ffffff',
  blue: '#2563eb',
  red: '#dc2626',
  green: '#16a34a',
  silver: '#c0c0c0',
  gray: '#737373',
  grey: '#737373',
  brown: '#92400e',
  gold: '#d4af37',
  pink: '#ec4899',
}

export const getColorSwatch = (name: string) =>
  colorSwatches[name.trim().toLowerCase()] || null
