export type SizeGuideRow = {
  size: string
  heightCm: string
  chestCm: string
  waistCm: string
  note?: string
}

const defaults: Record<string, Omit<SizeGuideRow, 'size' | 'note'>> = {
  '0-3': { heightCm: '50–61', chestCm: '40–43', waistCm: '40–43' },
  '3-6': { heightCm: '61–67', chestCm: '43–45', waistCm: '43–45' },
  '6-12': { heightCm: '67–74', chestCm: '45–48', waistCm: '45–47' },
  '1-2': { heightCm: '74–86', chestCm: '48–51', waistCm: '47–50' },
  '2-3': { heightCm: '86–98', chestCm: '51–54', waistCm: '50–53' },
  '3-4': { heightCm: '98–104', chestCm: '54–56', waistCm: '53–55' },
}

export function defaultSizeGuide(sizes: string[]): SizeGuideRow[] {
  return sizes.map((size) => ({
    size,
    ...(defaults[size] ?? { heightCm: '—', chestCm: '—', waistCm: '—' }),
  }))
}

export function mergeSizeGuide(
  sizes: string[],
  guide?: SizeGuideRow[] | null,
): SizeGuideRow[] {
  const bySize = new Map((guide ?? []).map((row) => [row.size, row]))
  return sizes.map((size) => {
    const existing = bySize.get(size)
    if (existing?.heightCm && existing.chestCm && existing.waistCm) {
      return {
        size,
        heightCm: existing.heightCm,
        chestCm: existing.chestCm,
        waistCm: existing.waistCm,
        ...(existing.note?.trim() ? { note: existing.note.trim() } : {}),
      }
    }
    return defaultSizeGuide([size])[0]
  })
}
