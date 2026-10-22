import { useEffect, useRef } from 'react'
import { gsap, scrollToTarget } from '../lib/scroll'
import { usePortfolio } from '../i18n/context'
import ParticlePortrait from './ParticlePortrait'

export default function Hero({ ready }: { ready: boolean }) {
  const { profile, content } = usePortfolio()
  const h = content.ui.hero
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-hero-word]', { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.2, ease: 'expo.out', stagger: 0.12, delay: 0.6 })
      gsap.fromTo('[data-hero-sub]', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 1.2, stagger: 0.1 })

      const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to('[data-split="left"]', { x: -220, ease: 'none', scrollTrigger: st })
      gsap.to('[data-split="right"]', { x: 220, ease: 'none', scrollTrigger: st })
      gsap.to('[data-hero-title]', { opacity: 0.15, ease: 'none', scrollTrigger: st })
    }, root)
    return () => ctx.revert()
  }, [ready])

  return (
    <section
      id="home"
      ref={root}
      className="relative flex min-h-screen items-end justify-center overflow-hidden"
      style={{ background: 'radial-gradient(circle at 50% 55%, #222 0%, #000 80%)' }}
    >
      <ParticlePortrait ready={ready} src={profile.portrait} text="AL" portraitLabel={content.ui.loaderPortrait(profile.fullName)} />

      <div data-hero-title className="pointer-events-none absolute top-[74%] left-1/2 z-20 flex w-max -translate-x-1/2 -translate-y-1/2 flex-col items-start select-none">
        <h1 className="flex overflow-hidden font-display text-[min(15.5vw,14rem)] leading-none font-black tracking-tighter uppercase drop-shadow-2xl">
          <span data-split="left" className="inline-block">
            <span data-hero-word className="text-chrome inline-block pr-[0.04em]">
              Port
            </span>
          </span>
          <span data-split="right" className="inline-block">
            <span data-hero-word className="text-chrome inline-block pr-[0.04em]">
              folio
            </span>
          </span>
        </h1>

        <p data-hero-sub className="absolute -bottom-10 left-1/2 w-max -translate-x-1/2 text-base text-white opacity-0 drop-shadow-md md:-bottom-12 md:left-8 md:translate-x-0 md:text-2xl lg:text-4xl">
          <span className="font-bold">{profile.role.strong}</span> <span className="font-light text-gray-300 italic">{profile.role.light}</span>
        </p>

        <div data-hero-sub className="pointer-events-auto absolute -bottom-24 left-1/2 flex w-max -translate-x-1/2 items-center gap-2 opacity-0 md:-bottom-12 md:left-auto md:right-20 md:translate-x-0 md:gap-4">
          <button
            onClick={() => scrollToTarget('#contact')}
            aria-label={h.goContact}
            className="group flex h-9 w-9 items-center justify-center rounded-full border border-gray-400/30 bg-black/20 backdrop-blur-md transition-all hover:border-gray-400/50 hover:bg-white/10 md:h-12 md:w-12"
          >
            <svg className="h-3 w-3 text-gray-300 transition-transform duration-300 group-hover:rotate-45 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 7L7 17M7 17H16M7 17V8" />
            </svg>
          </button>
          <button
            onClick={() => scrollToTarget('#contact')}
            className="flex items-center justify-center rounded-full border border-gray-400/30 bg-black/20 px-5 py-2 backdrop-blur-md transition-all hover:border-gray-400/50 hover:bg-white/10 md:px-6 md:py-2.5"
          >
            <span className="text-xs font-light tracking-wider text-gray-300 italic md:text-base">{h.contact}</span>
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-40 bg-gradient-to-b from-transparent to-[#050505]" />
    </section>
  )
}
