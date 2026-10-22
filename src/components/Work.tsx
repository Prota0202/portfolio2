import { useEffect, useRef } from 'react'
import { gsap } from '../lib/scroll'
import { profile, projects } from '../data'
import ProjectVisual from './ProjectVisual'

function Arrow() {
  return (
    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H8M17 7V16" />
    </svg>
  )
}

export default function Work() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-project]').forEach((card, i, all) => {
        if (i === all.length - 1) return
        gsap.to(card.querySelector('[data-project-inner]'), {
          scale: 0.9,
          opacity: 0.25,
          ease: 'none',
          scrollTrigger: { trigger: all[i + 1], start: 'top bottom', end: 'top top', scrub: true },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="work" ref={root} className="relative bg-[#050505] pt-28 text-white md:pt-40">
      <div className="mb-16 flex flex-col gap-8 px-6 md:mb-24 md:flex-row md:items-start md:justify-between md:px-16">
        <h2 data-reveal className="flex items-baseline gap-3 font-display text-5xl leading-none font-black tracking-tighter uppercase md:text-7xl">
          <span className="text-chrome">Selected</span>
          <span className="font-serif text-5xl font-normal tracking-normal text-white/90 normal-case italic md:text-7xl">work</span>
        </h2>
        <div data-reveal data-delay="0.1" className="max-w-xs">
          <p className="text-[13px] leading-relaxed text-white/60">
            AI-powered products built end to end — LLM and machine learning pipelines on one side, TypeScript full-stack applications on the other.
          </p>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#f1eee8] px-5 py-2 text-[11px] font-semibold text-black transition-transform hover:scale-105"
          >
            Read More <Arrow />
          </a>
        </div>
      </div>

      {projects.map((p, i) => (
        <article key={p.subtitle} data-project className="sticky top-0 flex h-screen items-center bg-[#050505]">
          <div data-project-inner className="grid w-full items-center gap-8 px-6 pt-16 md:grid-cols-[1.65fr_1fr] md:gap-14 md:px-8">
            <div className="h-[46vh] md:h-[72vh]">
              <ProjectVisual kind={p.visual} />
            </div>
            <div className="max-w-md">
              <span className="font-mono text-[10px] text-white/50">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-3 font-display text-3xl leading-[1.02] font-black tracking-tight uppercase md:text-[2.6rem]">
                {p.title[0]}
                <span className="font-serif font-normal tracking-normal normal-case italic">{p.title[1]}</span>
                <br />
                {p.subtitle}
              </h3>
              <p className="mt-5 text-[13px] leading-relaxed text-white/55">{p.text}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] text-white/60">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-7 flex gap-3">
                {p.links.map((l, j) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-[11px] font-semibold transition-transform hover:scale-105 ${
                      j === 0 ? 'bg-[#f1eee8] text-black' : 'border border-white/20 text-white'
                    }`}
                  >
                    {l.label} <Arrow />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}
