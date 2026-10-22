import { useEffect, useRef } from 'react'
import { gsap } from '../lib/scroll'
import { usePortfolio } from '../i18n/context'

export default function ExperienceSection() {
  const { content } = usePortfolio()
  const { experiences } = content
  const e = content.ui.experience
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLSpanElement>(null)
  const progress = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => {
      const el = track.current!
      const distance = () => el.scrollWidth - window.innerWidth + 64
      gsap.to(el, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const n = Math.min(experiences.length, Math.floor(self.progress * experiences.length) + 1)
            if (counter.current) counter.current.textContent = `${n} / ${experiences.length}`
            if (progress.current) progress.current.textContent = `P ${self.progress.toFixed(2)}`
          },
        },
      })
    })
    return () => mm.revert()
  }, [experiences.length, content])

  return (
    <section id="experience" ref={root} className="relative flex w-full flex-col justify-center overflow-hidden bg-[#050505] py-24 text-white md:h-screen md:py-0">
      <div className="mb-10 flex items-end justify-between px-6 md:mb-14 md:px-16">
        <div>
          <span className="label">{e.label}</span>
          <h2 className="mt-3 max-w-xl font-display text-4xl leading-[0.95] font-black tracking-tighter md:text-6xl">
            <span className="text-chrome">{e.titleStrong}</span>
            <span className="font-serif font-normal tracking-normal text-white/90 italic">{e.titleLight}</span>
          </h2>
          <p className="mt-4 max-w-md text-[13px] leading-relaxed text-white/55">{e.blurb}</p>
        </div>
        <div className="hidden text-right font-mono text-[10px] tracking-widest text-white/40 md:block">
          <div>{e.scrollHint}</div>
          <div className="mt-2 text-white/70">
            <span ref={counter}>1 / {experiences.length}</span> · <span ref={progress}>P 0.00</span>
          </div>
        </div>
      </div>

      <div ref={track} className="flex flex-col gap-5 px-6 md:w-max md:flex-row md:px-16">
        {experiences.map((exp, i) => (
          <article
            key={exp.role + exp.period}
            className="group relative flex shrink-0 flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.015] p-7 transition-colors hover:border-white/25 md:h-[54vh] md:w-[400px]"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-white/40">{String(i + 1).padStart(2, '0')}</span>
              <span className="rounded-full border border-white/10 px-3 py-1 font-display text-[9px] font-semibold tracking-[0.2em] text-white/60 uppercase">{exp.kind}</span>
            </div>
            <div aria-hidden className="text-chrome mt-6 hidden font-display text-[5.5rem] leading-none font-black tracking-tighter opacity-15 transition-opacity duration-500 group-hover:opacity-40 md:block">
              {exp.period.match(/\d{4}/g)?.pop()}
            </div>
            <div className="mt-8 md:mt-auto">
              <div className="font-mono text-[11px] text-white/50">{exp.period}</div>
              <h3 className="mt-2 font-display text-2xl leading-tight font-extrabold tracking-tight">{exp.role}</h3>
              <div className="font-serif text-xl text-white/70 italic">{exp.org}</div>
              <p className="mt-4 text-[13px] leading-relaxed text-white/55">{exp.text}</p>
              {exp.link && (
                <a href={exp.link} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold text-white underline-offset-4 hover:underline">
                  {e.github}
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
