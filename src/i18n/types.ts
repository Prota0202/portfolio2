export type Locale = 'en' | 'fr'

export type IntroSegment = { t: string; b?: boolean }

export type Service = { title: string; items: string[]; text: string; cta?: boolean }

export type Project = {
  title: [string, string]
  subtitle: string
  text: string
  tags: string[]
  links: { label: string; href: string }[]
  visual: 'sign' | 'match' | 'quest'
}

export type Experience = {
  period: string
  role: string
  org: string
  kind: string
  text: string
  link?: string
}

export type EducationRow = { period: string; title: string; org: string; note?: string }

export type LanguageRow = { name: string; level: string }

export type PortfolioContent = {
  meta: { title: string; description: string }
  profile: {
    role: { strong: string; light: string }
    location: string
  }
  ui: {
    nav: { home: string; about: string; service: string; project: string; experience: string; contact: string; services: string; projects: string; menu: string; close: string; language: string }
    hero: { contact: string; goContact: string }
    about: { label: string; stack: string }
    services: { line1: string; line2: string; viewProjects: string }
    work: { selected: string; work: string; blurb: string; readMore: string }
    experience: { label: string; titleStrong: string; titleLight: string; blurb: string; scrollHint: string; github: string }
    education: { label: string; languages: string }
    play: { tagline: string; ready: string; score: (n: number) => string; won: (n: number) => string; lost: (n: number) => string; play: string; restart: string }
    contact: {
      available: string
      title: string
      blurb: string
      sendEmail: string
      email: string
      phone: string
      basedIn: string
      elsewhere: string
      rights: (year: number, name: string) => string
    }
    loaderPortrait: (name: string) => string
  }
  intro: IntroSegment[]
  stackRows: string[][]
  services: Service[]
  projects: Project[]
  experiences: Experience[]
  education: EducationRow[]
  languages: LanguageRow[]
}
