export type Category = 'newborn' | 'toddler' | 'kids' | 'sleepwear' | 'outerwear'

export type SizeId = '0-3' | '3-6' | '6-12' | '1-2' | '2-3' | '3-4'

export type CatalogProduct = {
  id: string
  name: string
  nameFa: string
  usd: number
  toman: number
  image: string
  category: Category
  sizes: SizeId[]
}

/** Keep in sync with backend `seedProductIds`. */
export const catalog: CatalogProduct[] = [
  {
    id: 'b0000000-0000-4000-8000-000000000001',
    name: 'Cotton snap onesie',
    nameFa: 'سرهمی نخی دکمه‌دار',
    usd: 24,
    toman: 890000,
    image: '/clothes/onesie.svg',
    category: 'newborn',
    sizes: ['0-3', '3-6', '6-12'],
  },
  {
    id: 'b0000000-0000-4000-8000-000000000002',
    name: 'Striped toddler tee',
    nameFa: 'تی‌شرت راه‌راه نوپا',
    usd: 18,
    toman: 650000,
    image: '/clothes/tee.svg',
    category: 'toddler',
    sizes: ['1-2', '2-3'],
  },
  {
    id: 'b0000000-0000-4000-8000-000000000003',
    name: 'Knit cardigan',
    nameFa: 'ژاکت بافت',
    usd: 36,
    toman: 1290000,
    image: '/clothes/cardigan.svg',
    category: 'outerwear',
    sizes: ['6-12', '1-2', '2-3'],
  },
  {
    id: 'b0000000-0000-4000-8000-000000000004',
    name: 'Jogger set',
    nameFa: 'ست جاگر',
    usd: 32,
    toman: 1150000,
    image: '/clothes/joggers.svg',
    category: 'kids',
    sizes: ['2-3', '3-4'],
  },
  {
    id: 'b0000000-0000-4000-8000-000000000005',
    name: 'Cotton sleep sack',
    nameFa: 'قنداق خواب نخی',
    usd: 28,
    toman: 990000,
    image: '/clothes/sleep.svg',
    category: 'sleepwear',
    sizes: ['0-3', '3-6', '6-12'],
  },
  {
    id: 'b0000000-0000-4000-8000-000000000006',
    name: 'Denim overalls',
    nameFa: 'بیلر جین',
    usd: 40,
    toman: 1450000,
    image: '/clothes/overalls.svg',
    category: 'toddler',
    sizes: ['1-2', '2-3', '3-4'],
  },
  {
    id: 'b0000000-0000-4000-8000-000000000007',
    name: 'Kids hoodie',
    nameFa: 'هودی کودک',
    usd: 34,
    toman: 1220000,
    image: '/clothes/hoodie.svg',
    category: 'kids',
    sizes: ['2-3', '3-4'],
  },
  {
    id: 'b0000000-0000-4000-8000-000000000008',
    name: 'Summer dress',
    nameFa: 'پیراهن تابستانی',
    usd: 30,
    toman: 1080000,
    image: '/clothes/dress.svg',
    category: 'toddler',
    sizes: ['1-2', '2-3'],
  },
]

export const sizeIds: SizeId[] = ['0-3', '3-6', '6-12', '1-2', '2-3', '3-4']

export function formatMoney(product: Pick<CatalogProduct, 'usd' | 'toman'>, lang: 'en' | 'fa') {
  if (lang === 'fa') return `${product.toman.toLocaleString('fa-IR')} تومان`
  return `$${product.usd.toFixed(2)}`
}
