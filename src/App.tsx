import { useEffect, useState } from 'react'
import { gsap, initSmoothScroll, ScrollTrigger } from './lib/scroll'
import Loader from './components/Loader'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Work from './components/Work'
import ExperienceSection from './components/Experience'
import Education from './components/Education'
import Play from './components/Play'
import Contact from './components/Contact'

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    initSmoothScroll()
    document.body.classList.add('is-loading')
  }, [])

  useEffect(() => {
    if (!ready) return
    document.body.classList.remove('is-loading')

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 48, opacity: 0, filter: 'blur(6px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1.1,
            ease: 'power3.out',
            delay: Number(el.dataset.delay ?? 0),
            scrollTrigger: { trigger: el, start: 'top 88%' },
          },
        )
      })
    })
    const t = setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => {
      clearTimeout(t)
      ctx.revert()
    }
  }, [ready])

  return (
    <>
      {!ready && <Loader onDone={() => setReady(true)} />}
      <Nav visible={ready} />
      <main>
        <Hero ready={ready} />
        <About />
        <Services />
        <Work />
        <ExperienceSection />
        <Education />
        <Play />
        <Contact />
      </main>
    </>
  )
}
