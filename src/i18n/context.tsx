import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ScrollTrigger } from '../lib/scroll'
import { en } from './en'
import { fr } from './fr'
import { profileStatic } from './shared'
import type { Locale, PortfolioContent } from './types'

const STORAGE_KEY = 'portfolio-locale'

function readInitialLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'fr') return saved
  } catch {
    /* ignore */
  }
  if (typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('fr')) return 'fr'
  return 'en'
}

type Ctx = {
  locale: Locale
  setLocale: (l: Locale) => void
  content: PortfolioContent
  profile: typeof profileStatic & PortfolioContent['profile']
}

const PortfolioContext = createContext<Ctx | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale)

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch {
      /* ignore */
    }
  }

  const content = locale === 'fr' ? fr : en
  const profile = useMemo(() => ({ ...profileStatic, ...content.profile }), [content])

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = content.meta.title
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', content.meta.description)
    const t = setTimeout(() => ScrollTrigger.refresh(), 100)
    return () => clearTimeout(t)
  }, [locale, content])

  const value = useMemo(() => ({ locale, setLocale, content, profile }), [locale, content, profile])

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext)
  if (!ctx) throw new Error('usePortfolio must be used within LocaleProvider')
  return ctx
}
