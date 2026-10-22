import { scrollToTarget } from '../lib/scroll'
import { profile } from '../data'
import Smoke from './Smoke'

function Icon({ d }: { d: string }) {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d={d} />
    </svg>
  )
}

const ICONS = {
  github:
    'M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z',
  linkedin:
    'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z',
  mail: 'M2 5.5A2.5 2.5 0 0 1 4.5 3h15A2.5 2.5 0 0 1 22 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 18.5v-13Zm2.3-.5 7.7 6.2L19.7 5H4.3ZM20 6.6l-7.37 5.93a1 1 0 0 1-1.26 0L4 6.6v11.9c0 .28.22.5.5.5h15a.5.5 0 0 0 .5-.5V6.6Z',
}

const year = new Date().getFullYear()

export default function Contact() {
  const rows = [
    { k: 'Email', v: profile.email, href: `mailto:${profile.email}` },
    { k: 'Phone', v: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}` },
    { k: 'Based in', v: profile.location },
  ]

  return (
    <section id="contact" className="relative overflow-hidden bg-black text-white">
      <Smoke />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#050505] to-transparent" />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-6xl items-center gap-14 px-6 py-28 md:grid-cols-2 md:px-16">
        <div data-reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 font-display text-[9px] font-semibold tracking-[0.28em] text-white/70 uppercase backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            Available for work
          </span>
          <h2 className="text-chrome mt-5 font-display text-5xl leading-none font-black tracking-tighter md:text-6xl">Get in touch</h2>
          <p className="mt-6 max-w-sm text-[14px] leading-relaxed text-white/70">
            Looking to build a career in AI engineering in a team that ships fast. Email is the best way to reach me.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#f1eee8] px-5 py-2.5 text-[12px] font-semibold text-black transition-transform hover:scale-105"
            >
              Send an email <Icon d={ICONS.mail} />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-5 py-2.5 text-[12px] font-semibold backdrop-blur transition-colors hover:bg-white/10"
            >
              LinkedIn <Icon d={ICONS.linkedin} />
            </a>
          </div>
        </div>

        <div data-reveal data-delay="0.15" className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] shadow-2xl backdrop-blur-xl">
          {rows.map((r) => (
            <div key={r.k} className="border-b border-white/10 px-6 py-5">
              <div className="label !text-[8px]">{r.k}</div>
              {r.href ? (
                <a href={r.href} className="mt-2 block text-[14px] break-all transition-colors hover:text-white/70">
                  {r.v}
                </a>
              ) : (
                <div className="mt-2 text-[14px]">{r.v}</div>
              )}
            </div>
          ))}
          <div className="px-6 py-5">
            <div className="label !text-[8px]">Elsewhere</div>
            <div className="mt-3 flex gap-2">
              {[
                { href: profile.github, d: ICONS.github, label: 'GitHub' },
                { href: profile.linkedin, d: ICONS.linkedin, label: 'LinkedIn' },
                { href: `mailto:${profile.email}`, d: ICONS.mail, label: 'Email' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/80 transition-colors hover:bg-white hover:text-black"
                >
                  <Icon d={s.d} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-4 border-t border-white/10 px-6 pt-6 pb-9 text-[11px] text-white/45 md:flex-row md:items-center md:justify-between md:px-16">
        <p>© {year} {profile.fullName}. All rights reserved.</p>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {[
            ['Home', '#home'],
            ['About', '#about'],
            ['Services', '#service'],
            ['Projects', '#work'],
            ['Experience', '#experience'],
          ].map(([l, h]) => (
            <button key={h} onClick={() => scrollToTarget(h)} className="transition-colors hover:text-white">
              {l}
            </button>
          ))}
        </nav>
      </footer>
    </section>
  )
}
