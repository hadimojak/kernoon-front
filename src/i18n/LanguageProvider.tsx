import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { en, fa } from './translations'
import { LanguageContext, type Lang } from './useI18n'

const STORAGE_KEY = 'kernoon-lang'

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

  const value = useMemo(() => {
    const dictionary = lang === 'fa' ? fa : en
    return {
      lang,
      toggle: () => setLang((current) => (current === 'en' ? 'fa' : 'en')),
      t: (key: keyof typeof en, vars?: Record<string, string>) => {
        let text: string = dictionary[key]
        if (vars) {
          for (const [name, replacement] of Object.entries(vars)) {
            text = text.replace(`{${name}}`, replacement)
          }
        }
        return text
      },
    }
  }, [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
