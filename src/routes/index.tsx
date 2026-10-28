import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { TRACKS, releaseDateFor, trackMinutes } from '../content/catalog'
import { Chip, SpinningBurst, btnClass, useCountdown } from '../components/comic'
import { Icon } from '../components/Icon'
import { NewsCard } from '../components/NewsCard'
import { TrailerPlayer } from '../components/Trailer'
import type { IconName } from '../components/Icon'
import { leaderboardQuery, meQuery, newsQuery } from '../lib/queries'

export const Route = createFileRoute('/')({
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(newsQuery(3))
    return context.queryClient.ensureQueryData(leaderboardQuery('global'))
  },
  component: Landing,
})

const TICKER: { label: string; icon: IconName }[] = [
  { label: '5 TRACKS', icon: 'target' },
  { label: 'MCU + X-MEN + SPIDER-MEN', icon: 'film' },
  { label: 'TRAILERS', icon: 'play' },
  { label: 'PHASE ROADMAP', icon: 'layers' },
  { label: 'RANDOM QUIZZES', icon: 'bolt' },
  { label: '80% = READY', icon: 'star' },
  { label: 'GLOBAL RANKS', icon: 'trophy' },
]

const TOOLKIT: { title: string; body: string; icon: IconName; color: string }[] = [
  { title: 'CURATED TRACKS', body: 'Five paths to opening night, from a cram to the complete saga and the Fox X-Men.', icon: 'film', color: '#FFD23F' },
  { title: 'TRAILERS', body: 'Watch the trailer for every title before you commit.', icon: 'play', color: '#4FC3F7' },
  { title: 'WHERE TO WATCH', body: 'Legal streams, rentals and buys for your country.', icon: 'tvPlay', color: '#B388FF' },
  { title: 'PHASE ROADMAP', body: 'All six MCU Phases laid out, with your progress in each.', icon: 'layers', color: '#FF8A3D' },
  { title: 'MCU NEWS', body: 'Fresh Marvel headlines, linked straight to the source.', icon: 'alert', color: '#FFD23F' },
  { title: 'KNOW YOUR MCU', body: 'Stan Lee, Doctor Doom, where Strange is now, and more.', icon: 'bulb', color: '#4FC3F7' },
  { title: 'READINESS EXAM', body: '20 random, server-graded questions. Score 80% to pass.', icon: 'bolt', color: '#FF8A3D' },
  { title: 'COMBOS & XP', body: 'Chain correct answers for up to a ×5 multiplier.', icon: 'flame', color: '#C8102E' },
  { title: 'DAILY CHALLENGE', body: 'Same five questions for everyone, every day. One shot.', icon: 'calendar', color: '#B388FF' },
  { title: 'LEADERBOARDS', body: 'All-time, weekly and daily boards.', icon: 'trophy', color: '#FFD23F' },
  { title: 'WEAK-SPOT REPORT', body: 'Every miss points you to the exact title to rewatch.', icon: 'target', color: '#4FC3F7' },
  { title: 'READY CARD', body: 'Share your verdict on X and WhatsApp.', icon: 'share', color: '#FF8A3D' },
]

const STEPS = [
  { n: '1', title: 'PICK A TRACK', body: 'Speedrun, Essentials, Deep Dive, Multiverse or Legacy. Each one is a curated path to opening night.', sfx: 'ZWIP!', icon: 'target' as IconName, bg: 'bg-paper' },
  { n: '2', title: 'WATCH & TICK', body: 'Check off titles as you go. Your readiness meter fills, and you see where each one streams.', sfx: 'KA-CHUNK!', icon: 'tvPlay' as IconName, bg: 'bg-pow' },
  { n: '3', title: 'PROVE IT', body: 'Take a randomised exam drawn from the whole MCU. Hit 80% and you earn the READY badge.', sfx: 'KRAKA-BOOM!', icon: 'bolt' as IconName, bg: 'bg-paper' },
]

const trackIcon: Record<string, IconName> = { stopwatch: 'stopwatch', star: 'star', layers: 'layers', rings: 'rings', users: 'users' }

function Landing() {
  const { data: me } = useQuery(meQuery)
  const cd = useCountdown(releaseDateFor(me?.country))
  const { data: lb } = useQuery(leaderboardQuery('global'))
  const top = lb?.rows.slice(0, 3) ?? []
  const { data: news } = useQuery(newsQuery(3))

  return (
    <main className="overflow-hidden">
      {/* ── HERO ── */}
      <section className="halftone-light border-b-4 border-ink bg-hero-red">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-12 px-4 pb-20 pt-10 sm:pt-14">
          <div className="min-w-0 flex-[999_1_540px]">
            <div className="anim-pop inline-flex -rotate-2 items-center gap-2 border-4 border-ink bg-pow px-3.5 py-1.5 text-[15px] font-black uppercase shadow-[5px_5px_0_#111]">
              <Icon name="ticket" size={18} /> In cinemas December 18, 2026
            </div>
            <h1 className="font-display ink-stroke m-0 mt-6 text-[clamp(64px,9vw,132px)] leading-[0.9] text-paper" style={{ textShadow: '6px 6px 0 #111' }}>
              {['ARE YOU', 'READY FOR'].map((line, i) => (
                <motion.span key={line} className="block" initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 + i * 0.12, type: 'spring', stiffness: 380, damping: 16 }}>
                  {line}
                </motion.span>
              ))}
              <motion.span className="block text-pow" initial={{ scale: 2, rotate: -10, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ delay: 0.4, type: 'spring', stiffness: 500, damping: 14 }}>
                DOOMSDAY?
              </motion.span>
            </h1>
            <p className="mt-7 max-w-xl text-xl font-semibold leading-relaxed text-paper">
              Pick a track, binge what matters, tick it off, then prove it. Score 80% or higher on the Readiness Exam and you’re cleared for opening night.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/tracks" className={btnClass('yellow', 'lg')}>
                <Icon name="target" size={30} strokeWidth={2.6} /> PICK YOUR TRACK
              </Link>
              <Link to="/quiz" className={btnClass('paper', 'lg')}>
                <Icon name="bolt" size={30} fill="#FFD23F" strokeWidth={2.2} /> TEST ME NOW
              </Link>
            </div>
          </div>

          <div className="relative flex min-w-0 flex-[1_1_360px] flex-col items-center gap-6">
            <SpinningBurst size={380} className="absolute -top-8 opacity-90" />
            <div className="panel anim-pop relative mt-10 rotate-2 bg-paper px-7 py-6 text-center">
              <div className="flex items-center justify-center gap-2 text-sm font-black uppercase tracking-[0.15em]">
                <Icon name="ticket" size={20} className="text-hero-red" /> {cd.done ? 'In cinemas now' : 'Countdown to opening night'}
              </div>
              <div className="mt-3 flex justify-center gap-3" aria-live="off">
                {(
                  [
                    [cd.d, 'DAYS'],
                    [cd.h, 'HRS'],
                    [cd.m, 'MIN'],
                    [cd.s, 'SEC'],
                  ] as const
                ).map(([v, l]) => (
                  <div key={l} className="min-w-[72px] border-[3px] border-ink bg-ink px-1.5 pb-1.5 pt-2.5 text-pow">
                    <div key={v} className="font-display anim-tick text-5xl leading-none">
                      {v}
                    </div>
                    <div className="text-xs font-extrabold tracking-wider text-paper">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="anim-wobble relative max-w-[320px] rounded-[28px] border-4 border-ink bg-white px-5 py-4 text-center font-display text-[1.75rem] leading-tight">
              NO SPOILERS. NO EXCUSES. JUST HOMEWORK.
              <svg width="40" height="30" viewBox="0 0 40 30" aria-hidden="true" className="absolute -bottom-[27px] left-12">
                <path d="M2 0 L38 0 L6 28 Z" fill="#fff" stroke="#111" strokeWidth="4" strokeLinejoin="round" />
                <rect x="0" y="0" width="40" height="5" fill="#fff" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <section className="overflow-hidden border-b-4 border-ink bg-ink py-3.5 text-paper" aria-label="Highlights">
        <div className="anim-marquee flex w-max gap-12 whitespace-nowrap font-display text-[1.75rem]">
          {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((k, i) => (
            <span key={i} className="inline-flex items-center gap-2.5" aria-hidden={i >= TICKER.length}>
              <Icon name={k.icon} size={26} className="text-pow" /> {k.label}
            </span>
          ))}
        </div>
      </section>

      {/* ── TOOLKIT ── */}
      <section className="border-b-4 border-ink">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="font-display m-0 text-5xl sm:text-6xl">YOUR HERO TOOLKIT</h2>
          <div className="mt-7 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))]">
            {TOOLKIT.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 4) * 0.06 }}
                className="lift flex items-start gap-3.5 border-4 border-ink bg-white p-4 shadow-[5px_5px_0_#111]"
              >
                <span className="ico flex h-14 w-14 flex-none items-center justify-center rounded-full border-[3px] border-ink shadow-[3px_3px_0_#111]" style={{ background: f.color }}>
                  <Icon name={f.icon} size={28} strokeWidth={2.4} className={f.color === '#C8102E' ? 'text-paper' : undefined} />
                </span>
                <div>
                  <div className="font-display text-[1.6rem] leading-tight">{f.title}</div>
                  <div className="text-[15px] font-semibold leading-snug">{f.body}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="halftone">
        <div className="mx-auto max-w-7xl px-4 py-[72px]">
          <h2 className="font-display m-0 text-5xl sm:text-6xl">HOW IT WORKS</h2>
          <div className="mt-8 grid gap-7 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
            {STEPS.map((s) => (
              <article key={s.n} className={`panel lift relative p-7 ${s.bg}`}>
                <Icon name={s.icon} size={52} strokeWidth={2.2} className="ico absolute right-4 top-4" />
                <div className="font-display absolute -left-4 -top-5 flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-paper bg-ink text-4xl text-pow">{s.n}</div>
                <h3 className="font-display m-0 mb-2 mt-4 text-4xl">{s.title}</h3>
                <p className="m-0 text-[17px] font-semibold leading-relaxed">{s.body}</p>
                <div className="font-display mt-4 inline-block -rotate-3 text-3xl text-hero-red">{s.sfx}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRACKS ── */}
      <section className="halftone-light border-y-4 border-ink bg-deep">
        <div className="mx-auto max-w-7xl px-4 py-[72px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display m-0 text-5xl sm:text-6xl text-paper" style={{ textShadow: '4px 4px 0 #111' }}>
              CHOOSE YOUR MISSION
            </h2>
            <Link to="/tracks" className="flex items-center gap-1.5 font-black uppercase text-pow">
              See all tracks <Icon name="arrowRight" size={18} />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
            {TRACKS.map((t) => (
              <Link key={t.id} to="/tracks/$trackId" params={{ trackId: t.id }} className="panel lift flex flex-col bg-paper text-ink no-underline">
                <div className="font-display flex items-center gap-3 border-b-4 border-ink px-4 py-3.5 text-[2.1rem]" style={{ background: t.color }}>
                  <span className="ico flex h-11 w-11 flex-none items-center justify-center rounded-full border-[3px] border-ink bg-paper">
                    <Icon name={trackIcon[t.icon]} size={24} strokeWidth={2.4} />
                  </span>
                  {t.name.toUpperCase()}
                </div>
                <div className="flex flex-col gap-2.5 p-5">
                  <div className="flex flex-wrap gap-2">
                    <Chip icon="film" dark>
                      {t.titleIds.length} TITLES
                    </Chip>
                    <Chip icon="clock">~{Math.round(trackMinutes(t) / 60)} HRS</Chip>
                  </div>
                  <p className="m-0 font-semibold leading-snug">{t.blurb}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRAILER + NEWS ── */}
      <section className="border-b-4 border-ink bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="flex flex-wrap items-start gap-10">
            <div className="min-w-0 flex-[1_1_440px]">
              <h2 className="font-display m-0 text-5xl sm:text-6xl">THE TRAILER</h2>
              <p className="mb-5 mt-1 text-lg font-semibold">Avengers: Doomsday, in cinemas December 18.</p>
              <TrailerPlayer titleId="doomsday" name="Avengers: Doomsday" />
            </div>
            <div className="min-w-0 flex-[1_1_400px]">
              <div className="flex items-end justify-between gap-3">
                <h2 className="font-display m-0 text-5xl sm:text-6xl">LATEST NEWS</h2>
                <Link to="/news" className="flex items-center gap-1.5 pb-2 font-black uppercase text-hero-red">
                  All news <Icon name="arrowRight" size={18} />
                </Link>
              </div>
              <div className="mt-5 grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(min(100%,220px),1fr))]">
                {(news?.items ?? []).slice(0, 2).map((n) => (
                  <NewsCard key={n.id} item={n} compact />
                ))}
                {news && news.items.length === 0 && <p className="font-bold">No headlines right now.</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PHASES + LORE ── */}
      <section className="halftone border-b-4 border-ink">
        <div className="mx-auto grid max-w-7xl gap-7 px-4 py-16 md:grid-cols-2">
          <Link to="/phases" className="panel lift flex flex-col gap-3 bg-deep p-7 text-paper no-underline">
            <Icon name="layers" size={48} strokeWidth={2.2} className="text-pow" />
            <h2 className="font-display m-0 text-5xl text-pow">THE PHASE ROADMAP</h2>
            <p className="m-0 text-lg font-semibold">Phases 1 to 6, the Infinity and Multiverse Sagas, and what each era set up. Tap into any Phase to see its titles and your progress.</p>
            <span className="mt-auto flex items-center gap-1.5 font-black uppercase text-pow">
              Open the roadmap <Icon name="arrowRight" size={18} />
            </span>
          </Link>
          <Link to="/lore" className="panel lift flex flex-col gap-3 bg-pow p-7 text-ink no-underline">
            <Icon name="bulb" size={48} strokeWidth={2.2} />
            <h2 className="font-display m-0 text-5xl">KNOW YOUR MCU</h2>
            <p className="m-0 text-lg font-semibold">Who was Stan Lee? What is Doctor Doom’s backstory? Where is Doctor Strange now? Quick answers, spoilers hidden until you ask.</p>
            <span className="mt-auto flex items-center gap-1.5 font-black uppercase">
              Read the answers <Icon name="arrowRight" size={18} />
            </span>
          </Link>
        </div>
      </section>

      {/* ── TOP AGENTS ── */}
      <section className="border-b-4 border-ink bg-pow">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-10 px-4 py-16">
          <div className="min-w-0 flex-[999_1_460px]">
            <h2 className="font-display m-0 flex items-center gap-4 text-5xl sm:text-6xl">
              <Icon name="trophy" size={64} fill="#FFF4DC" strokeWidth={2} className="anim-wobble" /> TOP AGENTS
            </h2>
            <p className="max-w-lg text-lg font-semibold">XP stacks from watching, quizzing and passing the exam. Claim your spot before December 18.</p>
            <Link to="/leaderboard" className={btnClass('ink', 'md')} style={{ boxShadow: '6px 6px 0 #C8102E' }}>
              VIEW LEADERBOARD
            </Link>
          </div>
          <ol className="panel m-0 min-w-0 flex-[1_1_360px] list-none bg-paper p-0">
            {top.length === 0 && (
              <li className="flex items-center gap-3 p-5 font-bold">
                <Icon name="crown" size={28} /> The board is empty. Be the first legend.
              </li>
            )}
            {top.map((r, i) => (
              <li key={r.userId} className="flex items-center gap-3.5 border-b-[3px] border-ink px-4 py-3.5 last:border-b-0">
                <span className="font-display w-8 text-4xl">{r.position}</span>
                <Icon name="medal" size={26} strokeWidth={2.6} className={['text-[#B8860B]', 'text-[#555]', 'text-[#8B4513]'][i]} />
                <span className="flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-ink font-black" style={{ background: ['#FFD23F', '#4FC3F7', '#FF8A3D'][i] }}>
                  {r.name[0]?.toUpperCase()}
                </span>
                <span className="min-w-0 flex-1 truncate font-extrabold">{r.name}</span>
                <span className="font-display text-2xl text-hero-red">{r.value.toLocaleString()} XP</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  )
}
