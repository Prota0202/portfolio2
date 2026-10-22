import { useEffect, useRef, useState } from 'react'
import { gsap, scrollToTarget, setScrollLocked } from '../lib/scroll'
import { profile } from '../data'

const links = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Service', href: '#service' },
  { label: 'Project', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav({ visible }: { visible: boolean }) {
  const [open, setOpen] = useState(false)
  const bar = useRef<HTMLDivElement>(null)
  const menu = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      if (bar.current) bar.current.style.transform = `scaleX(${p})`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setScrollLocked(open)
    const el = menu.current
    if (!el) return
    const items = el.querySelectorAll('[data-menu-item]')
    if (open) {
      gsap.set(el, { display: 'flex' })
      gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'expo.inOut' })
      gsap.fromTo(items, { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: 'expo.out', stagger: 0.05, delay: 0.3 })
    } else {
      gsap.to(el, { clipPath: 'inset(0 0 100% 0)', duration: 0.6, ease: 'expo.inOut', onComplete: () => void gsap.set(el, { display: 'none' }) })
    }
  }, [open])

  const go = (href: string) => {
    setOpen(false)
    setTimeout(() => scrollToTarget(href), open ? 350 : 0)
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-black/60 backdrop-blur-md transition-all duration-700 ${
          visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className="flex h-14 items-center justify-between px-6 md:h-[70px] md:px-10">
          <button onClick={() => go('#home')} className="font-display text-sm font-extrabold tracking-[0.12em] uppercase md:text-[15px]">
            {profile.fullName}
          </button>
          <div className="hidden items-center gap-8 lg:flex">
            {links.slice(1).map((l) => (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                className="group relative font-display text-[11px] font-semibold tracking-[0.22em] text-white/60 uppercase transition-colors hover:text-white"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-300 group-hover:scale-x-100" />
              </button>
            ))}
          </div>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="flex h-9 items-center gap-3 rounded-full border border-white/15 px-4 font-display text-[11px] font-semibold tracking-[0.22em] uppercase lg:hidden"
          >
            {open ? 'Close' : 'Menu'}
            <span className="relative block h-2 w-4">
              <span className={`absolute left-0 h-px w-4 bg-white transition-transform ${open ? 'top-1 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 h-px w-4 bg-white transition-transform ${open ? 'top-1 -rotate-45' : 'top-2'}`} />
            </span>
          </button>
        </div>
        <div ref={bar} className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-white/80" />
      </nav>

      <div ref={menu} className="fixed inset-0 z-40 hidden flex-col justify-center bg-[#050505] px-8">
        <ul className="space-y-2">
          {links.map((l, i) => (
            <li key={l.href} className="overflow-hidden">
              <button data-menu-item onClick={() => go(l.href)} className="flex items-baseline gap-4 text-left">
                <span className="font-mono text-xs text-white/40">0{i + 1}</span>
                <span className="text-chrome font-display text-5xl font-black tracking-tighter uppercase sm:text-6xl">{l.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
