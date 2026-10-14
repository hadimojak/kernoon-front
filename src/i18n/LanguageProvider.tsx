import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { en, fa, type MessageKey } from './translations'

export type Lang = 'en' | 'fa'

const STORAGE_KEY = 'kernoon-lang'

type LanguageContextValue = {
  lang: Lang
  toggle: () => void
  t: (key: MessageKey, vars?: Record<string, string>) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function readLang(): Lang {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'fa' ? 'fa' : 'en'
  } catch {
    return 'en'
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(readLang)

  useEffect(() => {
    document.documentElement.lang = lang === 'fa' ? 'fa' : 'en'
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr'
    localStorage.setItem(STORAGE_KEY, lang)
  }, [lang])

  const value = useMemo<LanguageContextValue>(() => {
    const dictionary = lang === 'fa' ? fa : en
    return {
      lang,
      toggle: () => setLang((current) => (current === 'en' ? 'fa' : 'en')),
      t: (key, vars) => {
        let text: string = dictionary[key]
        if (vars) {
          for (const [name, value] of Object.entries(vars)) {
            text = text.replace(`{${name}}`, value)
          }
        }
        return text
      },
    }
  }, [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useI18n() {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('useI18n must be used within LanguageProvider')
  return value
}
