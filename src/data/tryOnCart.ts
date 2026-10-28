import type { ClothingColorId } from './catalog'
import { clothingColorIds } from './catalog'

export type TryOnSlot =
  | 'body'
  | 'top'
  | 'bottom'
  | 'outer'
  | 'gloves'
  | 'socks'

export const tryOnSlots: TryOnSlot[] = [
  'body',
  'top',
  'bottom',
  'outer',
  'gloves',
  'socks',
]

export type SlotOffset = { x: number; y: number }

export type TryOnItem = {
  id: string
  productId: string
  name: string
  nameFa: string
  image: string
  category: string
  colors: ClothingColorId[]
  color: ClothingColorId
  slot: TryOnSlot
}

const STORAGE_KEY = 'kernoon-try-on-cart'
const OFFSET_KEY = 'kernoon-try-on-offsets'

export function slotForCategory(category: string, name = ''): TryOnSlot {
  const lower = `${category} ${name}`.toLowerCase()
  if (/sock|جوراب/.test(lower)) return 'socks'
  if (/glove|mitten|دستکش/.test(lower)) return 'gloves'
  if (category === 'outerwear' || /cardigan|hoodie|jacket|coat/.test(lower)) {
    return 'outer'
  }
  if (/jogger|pants|overall|trouser|bottom|شلوار|بیلر|جاگر/.test(lower)) {
    return 'bottom'
  }
  if (
    category === 'newborn' ||
    category === 'sleepwear' ||
    /onesie|sleep|سرهمی|قنداق/.test(lower)
  ) {
    return 'body'
  }
  return 'top'
}

export function normalizeColors(colors?: string[]): ClothingColorId[] {
  const allowed = new Set<string>(clothingColorIds)
  const unique = [
    ...new Set(
      (colors ?? []).filter((item): item is ClothingColorId => allowed.has(item)),
    ),
  ]
  return unique.length ? unique : ['white']
}

export function readTryOnCart(): TryOnItem[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as TryOnItem[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === 'string' &&
        typeof item.productId === 'string' &&
        typeof item.name === 'string' &&
        tryOnSlots.includes(item.slot),
    )
  } catch {
    return []
  }
}

export function writeTryOnCart(items: TryOnItem[]) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('kernoon-try-on'))
}

export function readTryOnOffsets(): Partial<Record<TryOnSlot, SlotOffset>> {
  try {
    const raw = sessionStorage.getItem(OFFSET_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Partial<Record<TryOnSlot, SlotOffset>>
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export function writeTryOnOffsets(offsets: Partial<Record<TryOnSlot, SlotOffset>>) {
  sessionStorage.setItem(OFFSET_KEY, JSON.stringify(offsets))
}

export function makeTryOnId() {
  return `try-${crypto.randomUUID()}`
}

/** Local samples so try-on works when the shop catalog is empty. */
export const tryOnSamples: Omit<TryOnItem, 'id' | 'color'>[] = [
  {
    productId: 'sample-onesie',
    name: 'Cotton snap onesie',
    nameFa: 'سرهمی نخی دکمه‌دار',
    image: '/clothes/onesie.svg',
    category: 'newborn',
    colors: ['white', 'beige', 'pink'],
    slot: 'body',
  },
  {
    productId: 'sample-tee',
    name: 'Striped toddler tee',
    nameFa: 'تی‌شرت راه‌راه نوپا',
    image: '/clothes/tee.svg',
    category: 'toddler',
    colors: ['navy', 'white', 'pink'],
    slot: 'top',
  },
  {
    productId: 'sample-joggers',
    name: 'Jogger set',
    nameFa: 'ست جاگر',
    image: '/clothes/joggers.svg',
    category: 'kids',
    colors: ['navy', 'gray'],
    slot: 'bottom',
  },
  {
    productId: 'sample-cardigan',
    name: 'Knit cardigan',
    nameFa: 'ژاکت بافت',
    image: '/clothes/cardigan.svg',
    category: 'outerwear',
    colors: ['beige', 'gray', 'pink'],
    slot: 'outer',
  },
  {
    productId: 'sample-dress',
    name: 'Summer dress',
    nameFa: 'پیراهن تابستانی',
    image: '/clothes/dress.svg',
    category: 'toddler',
    colors: ['yellow', 'pink', 'white'],
    slot: 'top',
  },
  {
    productId: 'sample-hoodie',
    name: 'Kids hoodie',
    nameFa: 'هودی کودک',
    image: '/clothes/hoodie.svg',
    category: 'kids',
    colors: ['gray', 'pink', 'green'],
    slot: 'outer',
  },
  {
    productId: 'sample-gloves',
    name: 'Soft baby mittens',
    nameFa: 'دستکش نرم نوزاد',
    image: '/clothes/onesie.svg',
    category: 'newborn',
    colors: ['pink', 'white', 'beige'],
    slot: 'gloves',
  },
  {
    productId: 'sample-socks',
    name: 'Cotton ankle socks',
    nameFa: 'جوراب نخی مچی',
    image: '/clothes/tee.svg',
    category: 'toddler',
    colors: ['white', 'navy', 'yellow'],
    slot: 'socks',
  },
]
