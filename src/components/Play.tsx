import { useEffect, useRef, useState } from 'react'

const GLYPHS: Record<string, string[]> = {
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  W: ['10001', '10001', '10001', '10101', '10101', '10101', '01010'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
}
const LINES = ['HELLO', 'WORLD']

type Brick = { x: number; y: number; s: number; alive: boolean }
type Mode = 'demo' | 'playing' | 'won' | 'lost'

export default function Play() {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const modeRef = useRef<Mode>('demo')
  const resetRef = useRef<() => void>(() => {})
  const [mode, setMode] = useState<Mode>('demo')
  const [score, setScore] = useState(0)

  useEffect(() => {
    const c = canvas.current!
    const ctx = c.getContext('2d')!
    let w = 0
    let h = 0
    let bricks: Brick[] = []
    let raf = 0
    let visible = false
    let hits = 0
    const paddle = { x: 0, w: 0, h: 8, target: 0 }
    const ball = { x: 0, y: 0, vx: 0, vy: 0, r: 6 }

    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = wrap.current!.clientWidth
      h = Math.min(560, Math.max(380, w * 0.5))
      c.width = w * dpr
      c.height = h * dpr
      c.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const cols = 5 * 5 + 4
      const cell = Math.floor(Math.min((w * 0.62) / cols, h / 22))
      const gap = Math.max(2, Math.round(cell * 0.18))
      const totalW = cols * cell
      const ox = (w - totalW) / 2
      const oy = cell * 1.5
      bricks = []
      LINES.forEach((word, li) => {
        word.split('').forEach((ch, ci) => {
          GLYPHS[ch].forEach((row, ry) => {
            row.split('').forEach((bit, rx) => {
              if (bit !== '1') return
              bricks.push({ x: ox + (ci * 6 + rx) * cell, y: oy + (li * 9 + ry) * cell, s: cell - gap, alive: true })
            })
          })
        })
      })
      paddle.w = Math.max(80, w * 0.11)
      ball.r = Math.max(4, cell * 0.32)
    }

    const serve = () => {
      paddle.x = paddle.target = w / 2 - paddle.w / 2
      ball.x = w / 2
      ball.y = h - 60
      const speed = Math.max(4, w / 220)
      const a = (-Math.PI / 2) + (Math.random() - 0.5) * 0.9
      ball.vx = Math.cos(a) * speed
      ball.vy = Math.sin(a) * speed
    }

    const reset = () => {
      bricks.forEach((b) => (b.alive = true))
      hits = 0
      setScore(0)
      serve()
    }
    resetRef.current = reset

    const step = () => {
      const m = modeRef.current
      if (m === 'won' || m === 'lost') return
      if (m === 'demo') paddle.target = ball.x - paddle.w / 2 + Math.sin(ball.y * 0.05) * paddle.w * 0.3
      paddle.x += (paddle.target - paddle.x) * (m === 'demo' ? 0.12 : 0.35)
      paddle.x = Math.max(0, Math.min(w - paddle.w, paddle.x))

      ball.x += ball.vx
      ball.y += ball.vy
      if (ball.x < ball.r || ball.x > w - ball.r) {
        ball.vx *= -1
        ball.x = Math.max(ball.r, Math.min(w - ball.r, ball.x))
      }
      if (ball.y < ball.r) {
        ball.vy = Math.abs(ball.vy)
      }

      const py = h - 34
      if (ball.vy > 0 && ball.y + ball.r >= py && ball.y + ball.r <= py + paddle.h + 6 && ball.x >= paddle.x - ball.r && ball.x <= paddle.x + paddle.w + ball.r) {
        const rel = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2)
        const speed = Math.hypot(ball.vx, ball.vy) * 1.01
        const a = -Math.PI / 2 + rel * 1.05
        ball.vx = Math.cos(a) * speed
        ball.vy = Math.sin(a) * speed
      }

      if (ball.y > h + 20) {
        if (m === 'playing') {
          modeRef.current = 'lost'
          setMode('lost')
        } else serve()
      }

      for (const b of bricks) {
        if (!b.alive) continue
        const nx = Math.max(b.x, Math.min(ball.x, b.x + b.s))
        const ny = Math.max(b.y, Math.min(ball.y, b.y + b.s))
        const dx = ball.x - nx
        const dy = ball.y - ny
        if (dx * dx + dy * dy > ball.r * ball.r) continue
        b.alive = false
        if (Math.abs(dx) > Math.abs(dy)) ball.vx *= -1
        else ball.vy *= -1
        if (m === 'playing') {
          hits += 1
          setScore(hits)
          if (hits === bricks.length) {
            modeRef.current = 'won'
            setMode('won')
          }
        } else if (bricks.every((x) => !x.alive)) {
          bricks.forEach((x) => (x.alive = true))
        }
        break
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#f4f4f4'
      for (const b of bricks) if (b.alive) ctx.fillRect(b.x, b.y, b.s, b.s)
      ctx.fillStyle = '#f1eee8'
      ctx.beginPath()
      ctx.roundRect(paddle.x, h - 34, paddle.w, paddle.h, 4)
      ctx.fill()
      ctx.fillStyle = '#fff'
      ctx.shadowColor = 'rgba(255,255,255,0.7)'
      ctx.shadowBlur = 14
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
    }

    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (!visible) return
      step()
      draw()
    }

    const pointer = (clientX: number) => {
      if (modeRef.current !== 'playing') return
      const r = c.getBoundingClientRect()
      paddle.target = clientX - r.left - paddle.w / 2
    }
    const onMouse = (e: PointerEvent) => pointer(e.clientX)
    const onTouch = (e: TouchEvent) => pointer(e.touches[0].clientX)
    const onKey = (e: KeyboardEvent) => {
      if (modeRef.current !== 'playing') return
      if (e.key === 'ArrowLeft') paddle.target -= w * 0.08
      if (e.key === 'ArrowRight') paddle.target += w * 0.08
    }

    layout()
    serve()
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting))
    io.observe(c)
    raf = requestAnimationFrame(loop)

    const onResize = () => {
      layout()
      serve()
    }
    window.addEventListener('resize', onResize)
    c.addEventListener('pointermove', onMouse)
    c.addEventListener('touchmove', onTouch, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', onResize)
      c.removeEventListener('pointermove', onMouse)
      c.removeEventListener('touchmove', onTouch)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  const start = () => {
    resetRef.current()
    modeRef.current = 'playing'
    setMode('playing')
  }

  const status = {
    demo: 'Ready',
    playing: `Score ${score}`,
    won: `Hello, world. ${score} bricks — you win.`,
    lost: `Game over — ${score} bricks`,
  }[mode]

  return (
    <section id="play" className="bg-[#050505] px-4 py-24 text-white sm:px-6 md:px-16 md:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="mx-auto w-max border-b border-white/40 pb-1 text-[11px] text-white/80">Train it, break it, ship it.</p>
        <div ref={wrap} className="relative mt-6">
          <canvas ref={canvas} className={`block w-full ${mode === 'playing' ? 'cursor-none' : ''}`} aria-label="Breakout game spelling HELLO WORLD" />
          <div className="mt-4 flex items-center justify-between">
            <span className="font-mono text-[11px] text-white/50">{status}</span>
            <button
              onClick={start}
              className="border border-white/30 px-4 py-1.5 font-mono text-[10px] tracking-[0.25em] uppercase transition-colors hover:bg-white hover:text-black"
            >
              {mode === 'playing' ? 'Restart' : 'Play'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
