export type Category = 'newborn' | 'toddler' | 'kids' | 'sleepwear' | 'outerwear'

export type SizeId = '0-3' | '3-6' | '6-12' | '1-2' | '2-3' | '3-4'

export const sizeIds: SizeId[] = ['0-3', '3-6', '6-12', '1-2', '2-3', '3-4']

export const clothingColorIds = [
  'white',
  'black',
  'navy',
  'blue',
  'pink',
  'red',
  'beige',
  'gray',
  'green',
  'yellow',
  'brown',
  'multi',
] as const

export type ClothingColorId = (typeof clothingColorIds)[number]

export const clothingColorHex: Record<ClothingColorId, string> = {
  white: '#f4f4f4',
  black: '#1c1c1c',
  navy: '#1f2a44',
  blue: '#3b6ea5',
  pink: '#e8a0b5',
  red: '#c0392b',
  beige: '#d7c4a8',
  gray: '#8a8a8a',
  green: '#3d7a5a',
  yellow: '#e2c15a',
  brown: '#7a5230',
  multi: 'linear-gradient(135deg,#e8a0b5,#3b6ea5,#e2c15a)',
}

export function formatMoney(
  product: { usd: number; toman: number },
  lang: 'en' | 'fa',
) {
  if (lang === 'fa') return `${product.toman.toLocaleString('fa-IR')} تومان`
  return `$${product.usd.toFixed(2)}`
}
