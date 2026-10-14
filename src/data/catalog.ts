export type Category = 'newborn' | 'toddler' | 'kids' | 'sleepwear' | 'outerwear'

export type SizeId = '0-3' | '3-6' | '6-12' | '1-2' | '2-3' | '3-4'

export type CatalogProduct = {
  id: 'onesie' | 'tee' | 'cardigan' | 'joggers' | 'sleep' | 'overalls' | 'hoodie' | 'dress'
  usd: number
  toman: number
  image: string
  category: Category
  sizes: SizeId[]
}

export const catalog: CatalogProduct[] = [
  { id: 'onesie', usd: 24, toman: 890000, image: '/clothes/onesie.svg', category: 'newborn', sizes: ['0-3', '3-6', '6-12'] },
  { id: 'tee', usd: 18, toman: 650000, image: '/clothes/tee.svg', category: 'toddler', sizes: ['1-2', '2-3'] },
  { id: 'cardigan', usd: 36, toman: 1290000, image: '/clothes/cardigan.svg', category: 'outerwear', sizes: ['6-12', '1-2', '2-3'] },
  { id: 'joggers', usd: 32, toman: 1150000, image: '/clothes/joggers.svg', category: 'kids', sizes: ['2-3', '3-4'] },
  { id: 'sleep', usd: 28, toman: 990000, image: '/clothes/sleep.svg', category: 'sleepwear', sizes: ['0-3', '3-6', '6-12'] },
  { id: 'overalls', usd: 40, toman: 1450000, image: '/clothes/overalls.svg', category: 'toddler', sizes: ['1-2', '2-3', '3-4'] },
  { id: 'hoodie', usd: 34, toman: 1220000, image: '/clothes/hoodie.svg', category: 'kids', sizes: ['2-3', '3-4'] },
  { id: 'dress', usd: 30, toman: 1080000, image: '/clothes/dress.svg', category: 'toddler', sizes: ['1-2', '2-3'] },
]

export const sizeIds: SizeId[] = ['0-3', '3-6', '6-12', '1-2', '2-3', '3-4']

export function formatMoney(product: CatalogProduct, lang: 'en' | 'fa') {
  if (lang === 'fa') return `${product.toman.toLocaleString('fa-IR')} تومان`
  return `$${product.usd.toFixed(2)}`
}
