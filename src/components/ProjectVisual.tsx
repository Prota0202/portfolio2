import type { Project } from '../data'

const HAND: [number, number][] = [
  [200, 330], [160, 300], [135, 262], [118, 228], [100, 200],
  [175, 215], [168, 160], [164, 125], [160, 92],
  [205, 208], [206, 148], [207, 108], [208, 72],
  [234, 215], [242, 160], [247, 124], [251, 94],
  [260, 232], [278, 190], [290, 162], [300, 136],
]
const BONES = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17],
]

function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div className="grain relative h-full w-full overflow-hidden rounded-sm bg-[#070707]">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 45% at 50% 92%, rgba(255,255,255,0.13), transparent 70%)' }} />
      <div
        className="absolute -top-10 left-1/2 h-[120%] w-[55%] -translate-x-1/2 opacity-60"
        style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.16), transparent 75%)', clipPath: 'polygon(42% 0, 58% 0, 100% 100%, 0 100%)' }}
      />
      <div className="relative flex h-full w-full items-center justify-center">{children}</div>
    </div>
  )
}

function SignVisual() {
  const probs = [
    ['BONJOUR', 98],
    ['MERCI', 1.2],
    ['OUI', 0.6],
  ] as const
  return (
    <Stage>
      <div className="flex w-full max-w-xl items-center justify-center gap-6 px-6">
        <div className="relative aspect-[4/5] w-[48%] rounded-xl border border-white/10 bg-black/60 p-2 shadow-2xl">
          <div className="absolute top-3 left-3 flex items-center gap-1.5 font-mono text-[9px] text-red-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" /> LIVE · webcam
          </div>
          <svg viewBox="60 40 280 320" className="h-full w-full">
            <g className="origin-center animate-[float_4s_ease-in-out_infinite]">
              {BONES.map(([a, b], i) => (
                <line key={i} x1={HAND[a][0]} y1={HAND[a][1]} x2={HAND[b][0]} y2={HAND[b][1]} stroke="#93a5e0" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
              ))}
              {HAND.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={i === 0 ? 6 : 4} fill="#fff" />
              ))}
            </g>
          </svg>
          <div className="absolute right-3 bottom-3 font-mono text-[9px] text-white/40">21 landmarks · MediaPipe</div>
        </div>
        <div className="w-[44%] space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <div className="label mb-2 !text-[8px]">LSTM prediction</div>
            <div className="font-display text-2xl font-black tracking-tight">BONJOUR</div>
            <div className="mt-1 font-mono text-[10px] text-emerald-400">▶ text + speech</div>
          </div>
          <div className="space-y-2.5 rounded-xl border border-white/10 bg-white/[0.04] p-4">
            {probs.map(([k, v]) => (
              <div key={k}>
                <div className="mb-1 flex justify-between font-mono text-[9px] text-white/60">
                  <span>{k}</span>
                  <span>{v}%</span>
                </div>
                <div className="h-1 rounded bg-white/10">
                  <div className="h-1 rounded bg-white" style={{ width: `${Math.max(v, 2)}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 font-mono text-[9px] leading-relaxed text-white/50">
            ESP32 glove · connected
            <br />
            16 classes · 5 unseen signers
          </div>
        </div>
      </div>
    </Stage>
  )
}

function MatchVisual() {
  return (
    <Stage>
      <div className="flex w-full max-w-xl items-center justify-center gap-8 px-6">
        <div className="relative h-[300px] w-[210px]">
          {[2, 1].map((i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-2xl border border-white/10 bg-[#111]"
              style={{ transform: `translateY(${i * 10}px) scale(${1 - i * 0.05})`, opacity: 1 - i * 0.3 }}
            />
          ))}
          <div className="absolute inset-0 flex animate-[swipe_5s_ease-in-out_infinite] flex-col rounded-2xl border border-white/15 bg-gradient-to-b from-[#1b1b1b] to-[#0c0c0c] p-5 shadow-2xl">
            <div className="label !text-[8px]">Offer #2041</div>
            <div className="mt-2 font-display text-lg leading-tight font-extrabold">ML Engineer</div>
            <div className="text-[11px] text-white/50">Brussels · Full-time</div>
            <div className="mt-5 space-y-2">
              {['Python', 'LLM pipelines', 'Docker'].map((t) => (
                <div key={t} className="flex items-center gap-2 text-[11px] text-white/70">
                  <span className="h-1 w-1 rounded-full bg-emerald-400" /> {t}
                </div>
              ))}
            </div>
            <div className="mt-auto">
              <div className="flex items-end justify-between">
                <span className="font-mono text-[9px] text-white/40">Mistral fit score</span>
                <span className="font-display text-3xl font-black">87%</span>
              </div>
              <div className="mt-3 flex justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60">✕</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black">♥</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden w-[200px] rounded-xl border border-white/10 bg-white/[0.04] p-4 sm:block">
          <div className="label mb-3 !text-[8px]">ROC — LLM vs baseline</div>
          <svg viewBox="0 0 100 100" className="w-full">
            <path d="M0 100 L100 0" stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" fill="none" />
            <path d="M0 100 C 10 55, 25 30, 100 0" stroke="#93a5e0" strokeWidth="2" fill="none" />
            <path d="M0 100 C 4 25, 15 10, 100 0" stroke="#fff" strokeWidth="2" fill="none" />
          </svg>
          <div className="mt-3 space-y-1 font-mono text-[9px]">
            <div className="flex items-center gap-2 text-white"><span className="h-0.5 w-3 bg-white" /> LLM</div>
            <div className="flex items-center gap-2 text-[#93a5e0]"><span className="h-0.5 w-3 bg-[#93a5e0]" /> Tabular ML</div>
          </div>
        </div>
      </div>
    </Stage>
  )
}

function QuestVisual() {
  const quests = [
    ['Morning run', '+40 XP', true],
    ['Read 20 pages', '+25 XP', true],
    ['Ship a feature', '+120 XP', false],
    ['Learn 10 Dutch words', '+30 XP', false],
  ] as const
  return (
    <Stage>
      <div className="relative h-[86%] max-h-[440px] aspect-[9/18.5] rounded-[2.2rem] border-[3px] border-[#2a2a2a] bg-black p-2 shadow-[0_40px_80px_rgba(0,0,0,0.8)]" style={{ transform: 'perspective(900px) rotateY(-14deg) rotateX(4deg)' }}>
        <div className="flex h-full flex-col overflow-hidden rounded-[1.8rem] bg-gradient-to-b from-[#14161c] to-[#0a0a0c] p-4">
          <div className="mx-auto mb-4 h-4 w-16 rounded-full bg-black" />
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[9px] text-white/40">Level 12</div>
              <div className="font-display text-base font-extrabold">Quests</div>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-500 text-[10px] font-black text-black">12</div>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-white/10">
            <div className="h-1.5 w-[68%] rounded-full bg-gradient-to-r from-[#7b8fd1] to-white" />
          </div>
          <div className="mt-1 text-right font-mono text-[8px] text-white/40">1 360 / 2 000 XP</div>
          <div className="mt-4 space-y-2">
            {quests.map(([q, xp, done]) => (
              <div key={q} className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.04] px-2.5 py-2">
                <span className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border text-[7px] ${done ? 'border-emerald-400 bg-emerald-400 text-black' : 'border-white/30'}`}>
                  {done ? '✓' : ''}
                </span>
                <span className={`flex-1 text-[10px] ${done ? 'text-white/40 line-through' : 'text-white/85'}`}>{q}</span>
                <span className="font-mono text-[8px] text-amber-300">{xp}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto flex justify-around border-t border-white/5 pt-3 text-[8px] text-white/40">
            <span className="text-white">Quests</span>
            <span>Progress</span>
            <span>Profile</span>
          </div>
        </div>
      </div>
    </Stage>
  )
}

export default function ProjectVisual({ kind }: { kind: Project['visual'] }) {
  if (kind === 'sign') return <SignVisual />
  if (kind === 'match') return <MatchVisual />
  return <QuestVisual />
}
