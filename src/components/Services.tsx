import { useEffect, useRef, useState } from 'react'
import { gsap, scrollToTarget, ScrollTrigger } from '../lib/scroll'
import { services } from '../data'

function Row({ index, open, onToggle }: { index: number; open: boolean; onToggle: () => void }) {
  const s = services[index]
  const body = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = body.current!
    gsap.to(el, {
      height: open ? 'auto' : 0,
      opacity: open ? 1 : 0,
      duration: 0.7,
      ease: 'expo.inOut',
      onComplete: () => ScrollTrigger.refresh(),
    })
  }, [open])

  return (
    <div className="border-b border-white/10">
      <button onClick={onToggle} className="group flex w-full items-center gap-8 py-5 text-left md:gap-12 md:py-6">
        <span className="w-8 font-display text-lg text-white/80 tabular-nums md:text-xl">{String(index + 1).padStart(2, '0')}</span>
        <span className="flex-1 font-display text-sm font-extrabold tracking-wide uppercase transition-transform duration-500 group-hover:translate-x-2 md:text-lg">
          {s.title}
        </span>
        <span className="relative h-4 w-4 shrink-0">
          <span className="absolute top-1/2 left-0 h-px w-4 bg-white/70" />
          <span className={`absolute top-0 left-1/2 h-4 w-px bg-white/70 transition-transform duration-500 ${open ? 'scale-y-0' : ''}`} />
        </span>
      </button>
      <div ref={body} className="h-0 overflow-hidden opacity-0">
        <div className="grid gap-10 pb-10 md:grid-cols-2 md:pl-20">
          <ul className="space-y-3">
            {s.items.map((it) => (
              <li key={it} className="flex items-center gap-4 text-sm text-white/80 md:text-[15px]">
                <span className="text-[8px] text-white/50">■</span>
                {it}
              </li>
            ))}
          </ul>
          <div>
            <p className="max-w-md text-sm leading-relaxed text-white/60 md:text-[15px]">{s.text}</p>
            {s.cta && (
              <button
                onClick={() => scrollToTarget('#work')}
                className="mt-6 rounded-full bg-[#f1eee8] px-6 py-2.5 font-display text-[11px] font-bold tracking-[0.18em] text-black uppercase transition-transform hover:scale-105"
              >
                View projects
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Services() {
  const [open, setOpen] = useState(0)
  const heading = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-service-line]',
        { yPercent: 100 },
        { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: heading.current, start: 'top 85%' } },
      )
    }, heading)
    return () => ctx.revert()
  }, [])

  return (
    <section id="service" className="relative bg-[#050505] px-6 pt-28 pb-0 text-white md:px-16 md:pt-40">
      <h2 ref={heading} className="mb-14 font-display text-[15vw] leading-[0.88] font-black tracking-tighter uppercase md:mb-20 md:text-[9rem]">
        <span className="block overflow-hidden">
          <span data-service-line className="text-chrome block">
            What I
          </span>
        </span>
        <span className="block overflow-hidden">
          <span data-service-line className="text-chrome block md:pl-[18vw]">
            can do
          </span>
        </span>
      </h2>
      <div className="-mx-6 border-t border-white/10 px-6 md:-mx-16 md:px-16">
        {services.map((_, i) => (
          <Row key={i} index={i} open={open === i} onToggle={() => setOpen((o) => (o === i ? -1 : i))} />
        ))}
      </div>
    </section>
  )
}
