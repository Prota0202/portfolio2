import { usePortfolio } from '../i18n/context'

function Pill({ label }: { label: string }) {
  return (
    <span className="mx-1.5 inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[12px] font-medium whitespace-nowrap text-white/80 transition-colors hover:border-white/30 hover:text-white">
      <span className="h-1 w-1 rounded-full bg-white/40" />
      {label}
    </span>
  )
}

function MarqueeRow({ items, reverse, duration }: { items: string[]; reverse?: boolean; duration: number }) {
  const loop = [...items, ...items, ...items, ...items]
  return (
    <div className="marquee overflow-hidden py-1">
      <div className={`marquee-track ${reverse ? 'reverse' : ''}`} style={{ ['--duration' as string]: `${duration}s` }}>
        {loop.map((s, i) => (
          <Pill key={i} label={s} />
        ))}
        {loop.map((s, i) => (
          <Pill key={`b${i}`} label={s} />
        ))}
      </div>
    </div>
  )
}

export default function About() {
  const { content } = usePortfolio()
  const { intro, stackRows } = content
  const a = content.ui.about

  return (
    <section id="about" className="relative bg-[#050505] px-6 pt-24 pb-0 text-white md:px-16 md:pt-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-[1fr_1.05fr]">
        <div data-reveal className="flex flex-col items-start md:items-center">
          <span className="label mb-2">{a.label}</span>
          <h2 className="text-chrome font-display text-[26vw] leading-[0.85] font-black tracking-tighter md:text-[11rem]">Intro</h2>
        </div>
        <div data-reveal data-delay="0.15" className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 text-[15px] leading-relaxed text-white/75 shadow-2xl backdrop-blur md:p-8">
          {intro.map((seg, i) =>
            seg.b ? (
              <strong key={i} className="font-semibold text-white">
                {seg.t}
              </strong>
            ) : (
              <span key={i}>{seg.t}</span>
            ),
          )}
        </div>
      </div>

      <div className="mt-24 border-t border-white/10 pt-6 md:mt-32">
        <div className="mb-5 flex items-center gap-4">
          <span className="label">{a.stack}</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>
        <div className="-mx-6 space-y-2 md:-mx-16">
          {stackRows.map((row, i) => (
            <MarqueeRow key={i} items={row} reverse={i % 2 === 1} duration={38 + i * 6} />
          ))}
        </div>
      </div>
    </section>
  )
}
