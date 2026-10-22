import { education, languages } from '../data'

export default function Education() {
  return (
    <section id="education" className="relative bg-[#050505] px-6 py-24 text-white md:px-16 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-[1.4fr_1fr]">
        <div>
          <div data-reveal className="mb-8 flex items-center gap-4">
            <span className="label">Education</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {education.map((e, i) => (
              <div key={e.title} data-reveal data-delay={String(i * 0.08)} className="grid grid-cols-[110px_1fr] gap-4 py-6 md:grid-cols-[160px_1fr]">
                <span className="font-mono text-[11px] text-white/45">{e.period}</span>
                <div>
                  <h3 className="font-display text-lg font-extrabold tracking-tight md:text-xl">{e.title}</h3>
                  <div className="font-serif text-lg text-white/65 italic">{e.org}</div>
                  {e.note && (
                    <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[10px] font-semibold tracking-wider text-emerald-300 uppercase">
                      ★ {e.note}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div data-reveal className="mb-8 flex items-center gap-4">
            <span className="label">Languages</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {languages.map((l, i) => (
              <div key={l.name} data-reveal data-delay={String(i * 0.08)} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                <div className="font-display text-lg font-extrabold">{l.name}</div>
                <div className="mt-1 text-[12px] leading-snug text-white/55">{l.level}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
