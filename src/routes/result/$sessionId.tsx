import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { btnClass, cn } from '../../components/comic'
import { Icon } from '../../components/Icon'
import { meQuery, quizResultQuery } from '../../lib/queries'
import { startQuizFn } from '../../server/fns'

export const Route = createFileRoute('/result/$sessionId')({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(quizResultQuery(params.sessionId)),
  head: () => ({ meta: [{ title: 'Your verdict · Doomsday Ready' }] }),
  component: ResultPage,
})

function ResultPage() {
  const { sessionId } = Route.useParams()
  const { data: r } = useQuery(quizResultQuery(sessionId))
  const { data: me } = useQuery(meQuery)
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const retake = useMutation({
    mutationFn: () => startQuizFn({ data: { mode: r!.mode === 'daily' ? 'exam' : r!.mode, titleId: r!.mode === 'title' ? r!.review[0]?.titleId : undefined } }),
    onSuccess: ({ sessionId: id }) => navigate({ to: '/quiz/$sessionId', params: { sessionId: id } }),
  })

  useEffect(() => {
    if (!r?.ready) return
    let cancelled = false
    void import('canvas-confetti').then(({ default: confetti }) => {
      if (cancelled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const colors = ['#FFD23F', '#C8102E', '#4FC3F7', '#111111', '#FFF4DC']
      confetti({ particleCount: 140, spread: 90, origin: { y: 0.35 }, colors, shapes: ['square', 'circle'] })
      setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0 }, colors }), 300)
      setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1 }, colors }), 500)
    })
    return () => {
      cancelled = true
    }
  }, [r?.ready])

  if (!r) return null
  const shareText =
    r.mode === 'exam'
      ? `I scored ${r.pct}% on the Avengers: Doomsday Readiness Exam: ${r.title} Are you ready?`
      : `I scored ${r.correct}/${r.total} on Doomsday Ready${r.titleName ? ` (${r.titleName})` : ''}. Can you beat it?`
  const url = typeof window !== 'undefined' ? window.location.origin : ''
  const verdictColor = r.ready ? '#2E7D32' : r.pct >= 50 ? '#FF8A3D' : '#C8102E'

  return (
    <main className="sunburst min-h-[85vh]">
      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 pb-20 pt-10 sm:pt-14 text-center">
        <div className="flex items-center gap-2 bg-ink px-3.5 py-1.5 text-sm font-black tracking-[0.2em] text-pow">
          <Icon name="shieldCheck" size={18} />
          {r.mode === 'exam' ? 'THE VERDICT IS IN' : r.mode === 'daily' ? 'DAILY CHALLENGE RESULT' : `TITLE QUIZ · ${r.titleName?.toUpperCase()}`}
        </div>

        <motion.div
          initial={{ scale: 3, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: -4, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 13, delay: 0.15 }}
          className="mt-8 border-[6px] border-ink bg-paper px-8 py-5 shadow-[14px_14px_0_#111] sm:px-12"
        >
          <div className="font-display ink-stroke text-[clamp(56px,11vw,140px)] leading-[0.9]" style={{ color: verdictColor, textShadow: '6px 6px 0 #111' }}>
            {r.mode === 'exam' ? r.title : r.ready ? 'NAILED IT!' : r.pct >= 50 ? 'NOT BAD!' : 'OOF!'}
          </div>
        </motion.div>
        <p className="mt-6 max-w-xl text-xl font-bold">{r.mode === 'exam' ? r.line : 'Title and daily quizzes earn XP. Only the Readiness Exam awards the READY badge.'}</p>

        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 grid w-full gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr))]">
          <Tile icon="target" value={`${r.pct}%`} label={`${r.correct} / ${r.total} CORRECT`} sub={r.mode === 'exam' ? 'Pass mark: 80%' : undefined} red />
          <Tile icon="bolt" value={`+${r.sessionXp.toLocaleString()}`} label="XP EARNED" sub={`Score ${r.score.toLocaleString()} · best combo ×${r.bestCombo}`} />
          <div className="flex flex-col items-center gap-1.5 border-4 border-ink bg-ink p-5 text-paper shadow-[8px_8px_0_#C8102E]">
            <Icon name="star" size={64} fill="#FFD23F" strokeWidth={1.6} className="anim-spin text-pow" />
            <div className="font-display text-3xl text-pow">RANK: {r.rank.toUpperCase()}</div>
            <div className="text-sm font-bold">{r.totalXp.toLocaleString()} XP total</div>
          </div>
        </motion.div>

        {r.weakSpots.length > 0 && (
          <section className="panel mt-10 w-full bg-paper p-6 text-left">
            <h2 className="font-display m-0 flex items-center gap-2.5 text-4xl">
              <Icon name="alert" size={32} fill="#FFD23F" strokeWidth={2.2} /> YOUR WEAK SPOTS
            </h2>
            <p className="mb-4 mt-1 font-semibold">You missed questions from these titles. A rewatch (or a title quiz) will close the gap.</p>
            <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr))]">
              {r.weakSpots.map((w) => (
                <Link key={w.titleId} to="/titles/$titleId" params={{ titleId: w.titleId }} className="lift border-[3px] border-ink bg-white p-3.5 text-ink no-underline">
                  <b className="flex items-center gap-1.5">
                    <Icon name="film" size={16} strokeWidth={2.8} className="text-hero-red" /> {w.name}
                  </b>
                  <div className="mt-1 text-sm font-semibold">
                    {w.missed} miss{w.missed > 1 ? 'es' : ''} · where to watch →
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer" className={btnClass('ink', 'lg')} style={{ boxShadow: '6px 6px 0 #C8102E' }}>
            <Icon name="share" size={26} /> SHARE ON X
          </a>
          <a href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${url}`)}`} target="_blank" rel="noreferrer" className={btnClass('paper', 'lg')}>
            <Icon name="share" size={26} /> WHATSAPP
          </a>
          <button
            type="button"
            className={btnClass('paper', 'lg')}
            onClick={() => {
              void navigator.clipboard?.writeText(`${shareText} ${url}`)
              setCopied(true)
            }}
          >
            <Icon name={copied ? 'check' : 'plus'} size={26} /> {copied ? 'COPIED' : 'COPY'}
          </button>
          {r.mode !== 'daily' && (
            <button type="button" disabled={retake.isPending} onClick={() => retake.mutate()} className={btnClass('yellow', 'lg')}>
              <Icon name="refresh" size={26} /> RETAKE (NEW QUESTIONS)
            </button>
          )}
        </div>

        {me?.user?.isAnonymous && (
          <div className="mt-10 flex w-full flex-wrap items-center justify-center gap-4 border-4 border-ink bg-white p-5 shadow-[6px_6px_0_#111]">
            <Icon name="trophy" size={36} />
            <span className="text-lg font-bold">You’re playing as a guest. Sign up to keep your XP and appear on the leaderboard.</span>
            <Link to="/auth" search={{ mode: 'signup' }} className={btnClass('yellow')}>
              CLAIM MY PROGRESS
            </Link>
          </div>
        )}

        <section className="mt-12 w-full text-left">
          <h2 className="font-display m-0 text-4xl">MISSION DEBRIEF</h2>
          <ol className="mt-4 flex list-none flex-col gap-3 p-0">
            {r.review.map((q, i) => (
              <li key={i} className={cn('border-[3px] border-ink bg-paper p-4', q.correct ? 'shadow-[5px_5px_0_#2E7D32]' : 'shadow-[5px_5px_0_#C8102E]')}>
                <div className="flex items-start gap-3">
                  <span className={cn('flex h-8 w-8 flex-none items-center justify-center border-[3px] border-ink', q.correct ? 'bg-win text-paper' : 'bg-hero-red text-paper')}>
                    <Icon name={q.correct ? 'check' : 'x'} size={18} strokeWidth={3.2} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-black tracking-wider text-hero-red">{q.source.toUpperCase()}</div>
                    <div className="font-extrabold">{q.prompt}</div>
                    <div className="mt-1 text-sm font-semibold">
                      {!q.correct && <span>Your answer: {q.yourAnswer ?? 'timed out'} · </span>}
                      Correct: <b>{q.correctAnswer}</b> {q.points > 0 && <span className="text-win">· +{q.points}</span>}
                    </div>
                    <div className="mt-1 text-sm">{q.explanation}</div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  )
}

function Tile({ icon, value, label, sub, red }: { icon: 'target' | 'bolt'; value: string; label: string; sub?: string; red?: boolean }) {
  return (
    <div className="border-4 border-ink bg-paper p-5 shadow-[8px_8px_0_#111]">
      <Icon name={icon} size={42} strokeWidth={2.2} fill={icon === 'bolt' ? '#FFD23F' : 'none'} className="mx-auto mb-1.5 block" />
      <div className={cn('font-display text-7xl leading-none', red && 'text-hero-red')}>{value}</div>
      <div className="font-black tracking-wider">{label}</div>
      {sub && <div className="mt-1.5 text-[13px] font-bold">{sub}</div>}
    </div>
  )
}
