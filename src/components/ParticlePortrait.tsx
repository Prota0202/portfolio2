import { useEffect, useRef } from 'react'

type P = {
  x: number
  y: number
  vx: number
  vy: number
  tx: number
  ty: number
  dx: number
  dy: number
  s: number
  c: string
  a: number
}

const PALETTE = ['#ffffff', '#e5e7eb', '#c7d2fe', '#93a5e0', '#7b8fd1', '#f3f4f6']

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function drawSource(ctx: CanvasRenderingContext2D, w: number, h: number, img: HTMLImageElement | null, text: string) {
  ctx.clearRect(0, 0, w, h)
  if (img) {
    const scale = (h * 0.95) / img.height
    const iw = img.width * scale
    const ih = img.height * scale
    ctx.drawImage(img, (w - iw) / 2, h - ih, iw, ih)
    return
  }
  const size = Math.min(h * 0.62, w * 0.62)
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.font = `900 ${size}px Archivo, Inter, sans-serif`
  const g = ctx.createLinearGradient(0, h * 0.2, 0, h * 0.75)
  g.addColorStop(0, '#ffffff')
  g.addColorStop(1, '#5a5a5a')
  ctx.fillStyle = g
  ctx.fillText(text, w / 2, h * 0.7)
}

export default function ParticlePortrait({
  ready,
  src,
  text,
  portraitLabel,
}: {
  ready: boolean
  src: string
  text: string
  portraitLabel: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const readyRef = useRef(ready)

  useEffect(() => {
    readyRef.current = ready
  }, [ready])

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const off = document.createElement('canvas')
    const octx = off.getContext('2d', { willReadFrequently: true })!
    let particles: P[] = []
    let stars: { x: number; y: number; s: number; p: number }[] = []
    let w = 0
    let h = 0
    let raf = 0
    let visible = true
    let img: HTMLImageElement | null = null
    const mouse = { x: -9999, y: -9999 }

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      off.width = w
      off.height = h
      drawSource(octx, w, h, img, text)
      const data = octx.getImageData(0, 0, w, h).data
      const step = Math.max(4, Math.round(w / (img ? 210 : 170)))
      const old = particles
      const next: P[] = []
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const i = (y * w + x) * 4
          const a = data[i + 3] / 255
          const l = ((data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255) * a
          if (l < 0.1) continue
          const prev = old[next.length]
          const ang = Math.random() * Math.PI * 2
          const dist = 200 + Math.random() * Math.max(w, h) * 0.7
          next.push({
            x: prev ? prev.x : Math.random() * w,
            y: prev ? prev.y : Math.random() * h,
            vx: 0,
            vy: 0,
            tx: x + (Math.random() - 0.5) * step * 0.4,
            ty: y + (Math.random() - 0.5) * step * 0.4,
            dx: Math.cos(ang) * dist,
            dy: Math.sin(ang) * dist,
            s: step * (0.3 + 0.55 * l),
            c: PALETTE[(Math.random() * PALETTE.length) | 0],
            a: 0.35 + 0.65 * l,
          })
        }
      }
      particles = next
      stars = Array.from({ length: Math.round((w * h) / 2600) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        s: Math.random() * 1.4 + 0.3,
        p: Math.random() * Math.PI * 2,
      }))
    }

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick)
      if (!visible) return
      const scroll = Math.min(1, Math.max(0, window.scrollY / (h * 0.9)))
      const formed = readyRef.current
      ctx.clearRect(0, 0, w, h)

      for (const s of stars) {
        ctx.globalAlpha = 0.15 + 0.35 * (0.5 + 0.5 * Math.sin(t * 0.0015 + s.p))
        ctx.fillStyle = '#fff'
        ctx.fillRect(s.x, s.y, s.s, s.s)
      }

      const scatter = formed ? scroll * scroll : 1
      const fade = 1 - scroll * 0.75
      for (const p of particles) {
        const tx = p.tx + p.dx * scatter
        const ty = p.ty + p.dy * scatter
        p.vx += (tx - p.x) * 0.018
        p.vy += (ty - p.y) * 0.018
        const mx = p.x - mouse.x
        const my = p.y - mouse.y
        const d2 = mx * mx + my * my
        if (d2 < 5000) {
          const f = (5000 - d2) / 5000
          p.vx += mx * f * 0.06
          p.vy += my * f * 0.06
        }
        p.vx *= 0.86
        p.vy *= 0.86
        p.x += p.vx
        p.y += p.vy
        ctx.globalAlpha = p.a * fade
        ctx.fillStyle = p.c
        ctx.fillRect(p.x, p.y, p.s, p.s)
      }
      ctx.globalAlpha = 1
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
    }
    const onLeave = () => {
      mouse.x = mouse.y = -9999
    }

    let resizeTimer = 0
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(build, 150)
    }

    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))
    io.observe(canvas)

    let cancelled = false
    ;(async () => {
      img = await loadImage(src).catch(() => null)
      await document.fonts.ready
      if (cancelled) return
      build()
      raf = requestAnimationFrame(tick)
    })()

    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerleave', onLeave)
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [src, text])

  return <canvas ref={canvasRef} role="img" aria-label={portraitLabel} className="pointer-events-none absolute inset-0 z-10 h-full w-full" />
}
