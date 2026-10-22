import { useEffect, useRef } from 'react'
import { gsap } from '../lib/scroll'
import { usePortfolio } from '../i18n/context'

export default function Loader({ onDone }: { onDone: () => void }) {
  const { profile } = usePortfolio()
  const root = useRef<HTMLDivElement>(null)
  const done = useRef(onDone)

  useEffect(() => {
    done.current = onDone
  }, [onDone])

  useEffect(() => {
    const el = root.current!
    const letters = el.querySelectorAll<HTMLElement>('[data-letter]')
    const dot = el.querySelector<HTMLElement>('[data-dot]')
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => done.current() })
      tl.set(el, { opacity: 1 })
        .fromTo(dot, { y: -window.innerHeight * 0.6, scale: 0.6 }, { y: 0, scale: 1, duration: 0.9, ease: 'bounce.out' })
        .fromTo(
          letters,
          { yPercent: 120, rotate: (i) => (i % 2 ? 8 : -8), opacity: 0 },
          { yPercent: 0, rotate: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.06 },
          '-=0.35',
        )
        .to(letters, { rotate: (i) => (i === 2 ? -14 : 0), y: (i) => (i === 2 ? -6 : 0), duration: 0.35, ease: 'power2.out' }, '+=0.15')
        .to(dot, { y: 28, duration: 0.35, ease: 'power2.in' }, '<')
        .to(letters, { yPercent: -120, opacity: 0, duration: 0.6, ease: 'expo.in', stagger: 0.03 }, '+=0.45')
        .to(dot, { scale: 60, opacity: 0, duration: 0.8, ease: 'expo.in' }, '-=0.45')
        .to(el, { opacity: 0, duration: 0.4 }, '-=0.15')
    }, el)
    return () => ctx.revert()
  }, [])

  const word = profile.firstName.toUpperCase()

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex items-center justify-center opacity-0"
      style={{ background: 'radial-gradient(circle at 50% 60%, #1a1a1a 0%, #000 70%)' }}
    >
      <div className="relative flex flex-col items-center">
        <h1 className="flex overflow-hidden font-display text-[14vw] md:text-[8rem] font-black leading-none tracking-tighter">
          {word.split('').map((c, i) => (
            <span key={i} data-letter className="text-chrome inline-block origin-bottom">
              {c}
            </span>
          ))}
        </h1>
        <span data-dot className="mt-4 block h-5 w-5 rounded-full bg-white shadow-[0_0_30px_rgba(255,255,255,0.6)]" />
      </div>
    </div>
  )
}
