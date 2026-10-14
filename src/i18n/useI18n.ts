import { createContext, useContext } from 'react'
import type { MessageKey } from './translations'

export type Lang = 'en' | 'fa'

export type LanguageContextValue = {
  lang: Lang
  toggle: () => void
  t: (key: MessageKey, vars?: Record<string, string>) => string
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)

export function useI18n() {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('useI18n must be used within LanguageProvider')
  return value
}
