import { usePortfolio } from '../i18n/context'
import type { Locale } from '../i18n/types'

export default function LanguageToggle({ className = '' }: { className?: string }) {
  const { locale, setLocale, content } = usePortfolio()
  const { language } = content.ui.nav

  const btn = (l: Locale, label: string) => (
    <button
      type="button"
      onClick={() => setLocale(l)}
      aria-pressed={locale === l}
      className={`min-w-[2.25rem] px-2 py-1 font-display text-[10px] font-semibold tracking-[0.18em] uppercase transition-colors ${
        locale === l ? 'bg-white text-black' : 'text-white/55 hover:text-white'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div
      role="group"
      aria-label={language}
      className={`inline-flex items-center overflow-hidden rounded-full border border-white/15 bg-black/30 p-0.5 backdrop-blur ${className}`}
    >
      {btn('en', 'EN')}
      {btn('fr', 'FR')}
    </div>
  )
}
