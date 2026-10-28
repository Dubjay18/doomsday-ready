import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { TITLES, TITLE_BY_ID } from '../../content/catalog'
import { btnClass, cn } from '../../components/comic'
import { Icon } from '../../components/Icon'
import { meQuery, questionCountsQuery, recentQuizzesQuery } from '../../lib/queries'
import { startQuizFn } from '../../server/fns'
import { EXAM_SIZE, PASS_MARK } from '../../shared/game'
import type { QuizMode } from '../../shared/quiz-types'

export const Route = createFileRoute('/quiz/')({
  loader: ({ context }) => context.queryClient.ensureQueryData(questionCountsQuery),
  head: () => ({ meta: [{ title: 'Readiness Quiz · Doomsday Ready' }] }),
  component: QuizHub,
})

function QuizHub() {
  const navigate = useNavigate()
  const { data: me } = useQuery(meQuery)
  const { data: counts } = useQuery(questionCountsQuery)
  const { data: recent } = useQuery(recentQuizzesQuery)
  const watched = new Set(me?.watchedIds ?? [])

  const start = useMutation({
    mutationFn: (v: { mode: QuizMode; titleId?: string }) => startQuizFn({ data: v }),
    onSuccess: ({ sessionId }) => navigate({ to: '/quiz/$sessionId', params: { sessionId } }),
  })

  const titleQuizzes = TITLES.filter((t) => (counts?.counts[t.id] ?? 0) > 0).sort((a, b) => Number(watched.has(b.id)) - Number(watched.has(a.id)) || b.weight - a.weight)
  const ready = me?.stats?.readyAt

  return (
    <main className="halftone-dark min-h-[80vh] bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-14">
        <div className="flex items-center gap-2 text-[13px] font-black tracking-[0.15em] text-pow">
          <Icon name="bolt" size={16} /> {counts?.total ?? '…'} QUESTIONS IN THE ARCHIVE
        </div>
        <h1 className="font-display m-0 mt-1 text-[clamp(56px,7vw,96px)] leading-[0.95]">
          PROVE <span className="text-pow">IT.</span>
        </h1>

        <div className="mt-10 grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
          <section className="relative border-4 border-paper bg-hero-red p-7 shadow-[10px_10px_0_#FFD23F]">
            {ready && (
              <span className="font-display absolute -right-3 -top-5 rotate-6 border-4 border-ink bg-win px-3 py-1 text-2xl text-paper shadow-[4px_4px_0_#111]">READY ✓</span>
            )}
            <h2 className="font-display m-0 flex items-center gap-3 text-5xl">
              <Icon name="shieldCheck" size={44} /> READINESS EXAM
            </h2>
            <ul className="mt-4 flex list-none flex-col gap-2 p-0 text-lg font-bold">
              <li className="flex items-center gap-2">
                <Icon name="layers" size={20} /> {EXAM_SIZE} random questions from the whole MCU + Fox X-Men
              </li>
              <li className="flex items-center gap-2">
                <Icon name="stopwatch" size={20} /> 20 seconds each; the server keeps time
              </li>
              <li className="flex items-center gap-2">
                <Icon name="target" size={20} /> Score {PASS_MARK * 100}%+ to earn the READY badge
              </li>
              <li className="flex items-center gap-2">
                <Icon name="refresh" size={20} /> Retake any time; you get fresh questions
              </li>
            </ul>
            <button type="button" disabled={start.isPending} onClick={() => start.mutate({ mode: 'exam' })} className={cn(btnClass('yellow', 'lg'), 'mt-5 w-full')}>
              <Icon name="bolt" size={30} fill="#111" strokeWidth={2} /> {ready ? 'RETAKE THE EXAM' : 'START THE EXAM'}
            </button>
            {me?.stats?.bestExamPct != null && <p className="mb-0 mt-3 font-bold">Your best: {me.stats.bestExamPct}%</p>}
          </section>

          <section className="border-4 border-paper bg-cosmic p-7 text-ink shadow-[10px_10px_0_#4FC3F7]">
            <h2 className="font-display m-0 flex items-center gap-3 text-5xl">
              <Icon name="calendar" size={44} /> DAILY CHALLENGE
            </h2>
            <p className="mt-4 text-lg font-bold">Five questions. Everyone on Earth gets the same five today. One attempt. Top scores make the daily board.</p>
            <button type="button" disabled={start.isPending} onClick={() => start.mutate({ mode: 'daily' })} className={cn(btnClass('ink', 'lg'), 'mt-2 w-full')}>
              <Icon name="flame" size={28} fill="#FFD23F" strokeWidth={2} /> PLAY TODAY’S FIVE
            </button>
            <Link to="/leaderboard" search={{ scope: 'daily' }} className="mt-3 flex items-center gap-1.5 font-black text-ink">
              <Icon name="trophy" size={18} /> Today’s board
            </Link>
          </section>
        </div>

        {start.isError && <p className="mt-4 font-bold text-pow">{(start.error as Error).message}</p>}

        {recent && recent.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display m-0 text-4xl">YOUR RECENT MISSIONS</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {recent.map((r) => (
                <Link
                  key={r.id}
                  to={r.status === 'active' ? '/quiz/$sessionId' : '/result/$sessionId'}
                  params={{ sessionId: r.id }}
                  className="flex items-center gap-2 border-[3px] border-paper bg-paper/10 px-3 py-2 text-sm font-extrabold text-paper no-underline hover:bg-paper hover:text-ink"
                >
                  <Icon name={r.mode === 'exam' ? 'shieldCheck' : r.mode === 'daily' ? 'calendar' : 'film'} size={16} />
                  {r.mode === 'exam' ? 'Exam' : r.mode === 'daily' ? `Daily ${r.dailyKey}` : TITLE_BY_ID.get(r.titleId ?? '')?.name}
                  <span className="text-pow">{r.status === 'active' ? 'RESUME' : `${r.correct}/${r.total}`}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-14">
          <h2 className="font-display m-0 flex items-center gap-3 text-5xl">
            <Icon name="film" size={40} className="text-pow" /> TITLE QUIZZES
          </h2>
          <p className="font-semibold">Five quick questions on one title. Titles you’ve watched come first.</p>
          <div className="mt-5 grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(250px,1fr))]">
            {titleQuizzes.map((t) => (
              <button
                key={t.id}
                type="button"
                disabled={start.isPending}
                onClick={() => start.mutate({ mode: 'title', titleId: t.id })}
                className="lift flex items-center gap-3 border-[3px] border-paper bg-paper p-3 text-left text-ink"
              >
                <span className="halftone flex h-12 w-12 flex-none items-center justify-center border-[3px] border-ink" style={{ backgroundColor: t.color }}>
                  <Icon name={watched.has(t.id) ? 'check' : 'bolt'} size={22} strokeWidth={3} className="text-paper" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-extrabold">{t.name}</span>
                  <span className="text-xs font-bold">
                    {Math.min(5, counts?.counts[t.id] ?? 0)} questions · {t.year}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
