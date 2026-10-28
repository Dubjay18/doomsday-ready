import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Burst, cn } from '../../components/comic'
import { Icon } from '../../components/Icon'
import { answerFn, getQuizStateFn, lifelineFn } from '../../server/fns'
import type { AnswerResult, ClientQuestion, QuizState } from '../../shared/quiz-types'

export const Route = createFileRoute('/quiz/$sessionId')({
  head: () => ({ meta: [{ title: 'Quiz in progress · Doomsday Ready' }] }),
  component: QuizPlay,
})

const KEYS = ['A', 'B', 'C', 'D']
const HIT = ['THWACK!', 'KA-POW!', 'BLAM!', 'ZZAKK!', 'SHRAKK!', 'WHAM!']

type Phase = 'loading' | 'question' | 'submitting' | 'feedback'

function QuizPlay() {
  const { sessionId } = Route.useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [state, setState] = useState<QuizState | null>(null)
  const [question, setQuestion] = useState<ClientQuestion | null>(null)
  const [phase, setPhase] = useState<Phase>('loading')
  const [picked, setPicked] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<AnswerResult | null>(null)
  const [results, setResults] = useState<boolean[]>([])
  const [timeLeft, setTimeLeft] = useState(20_000)
  const [error, setError] = useState<string | null>(null)
  const [sfx, setSfx] = useState(HIT[0])
  const deadline = useRef(0)
  const phaseRef = useRef<Phase>('loading')
  phaseRef.current = phase
  const navRef = useRef(navigate)
  navRef.current = navigate

  const load = useCallback(async () => {
    setPhase('loading')
    setError(null)
    try {
      const s = await getQuizStateFn({ data: { sessionId } })
      if (s.status !== 'active' || !s.question) {
        navRef.current({ to: '/result/$sessionId', params: { sessionId }, replace: true })
        return
      }
      setState(s)
      setQuestion(s.question)
      setPicked(null)
      setFeedback(null)
      setResults((r) => (r.length === s.cursor ? r : [...r, ...Array<boolean>(Math.max(0, s.cursor - r.length)).fill(false)].slice(0, s.cursor)))
      deadline.current = performance.now() + s.question.remainingMs
      setTimeLeft(s.question.remainingMs)
      setPhase('question')
    } catch (e) {
      setError((e as Error).message)
    }
  }, [sessionId])

  useEffect(() => {
    void load()
  }, [load])

  const submit = useCallback(
    async (choice: number | null) => {
      if (!question || phaseRef.current !== 'question') return
      setPhase('submitting')
      setPicked(choice)
      try {
        const res = await answerFn({ data: { sessionId, index: question.index, choice } })
        setFeedback(res)
        setSfx(res.correct ? HIT[Math.floor(Math.random() * HIT.length)] : res.timedOut ? 'TOO SLOW!' : 'KRAK!')
        setResults((r) => [...r, res.correct])
        setState((s) => (s ? { ...s, score: res.score, combo: res.combo, cursor: s.cursor + 1 } : s))
        setPhase('feedback')
        if (res.finished) {
          qc.invalidateQueries({ queryKey: ['me'] })
          qc.invalidateQueries({ queryKey: ['lb'] })
          qc.invalidateQueries({ queryKey: ['recent-quizzes'] })
        }
      } catch {
        // Most likely the question timed out server-side or was answered in another tab: resync.
        void load()
      }
    },
    [question, sessionId, load, qc],
  )

  // countdown
  useEffect(() => {
    if (phase !== 'question') return
    const t = setInterval(() => {
      const left = Math.max(0, deadline.current - performance.now())
      setTimeLeft(left)
      if (left <= 0) void submit(null)
    }, 100)
    return () => clearInterval(t)
  }, [phase, submit])

  const next = useCallback(() => {
    if (feedback?.finished) navigate({ to: '/result/$sessionId', params: { sessionId } })
    else void load()
  }, [feedback, navigate, sessionId, load])

  // keyboard: A–D / 1–4 to answer, Enter to continue
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.metaKey || e.ctrlKey) return
      if (phase === 'question' && question) {
        const i = KEYS.indexOf(e.key.toUpperCase()) >= 0 ? KEYS.indexOf(e.key.toUpperCase()) : ['1', '2', '3', '4'].indexOf(e.key)
        const opt = question.options[i]
        if (opt && !opt.hidden) void submit(opt.id)
      } else if (phase === 'feedback' && e.key === 'Enter') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, question, submit, next])

  const lifeline = async (kind: 'fifty' | 'hint') => {
    if (!question || !state || phase !== 'question') return
    try {
      const r = await lifelineFn({ data: { sessionId, index: question.index, kind } })
      setState({ ...state, lifelines: { ...state.lifelines, [kind]: false } })
      setQuestion({ ...question, options: question.options.map((o) => ({ ...o, hidden: o.hidden || r.hidden.includes(o.id) })), hint: r.hint ?? question.hint })
    } catch (e) {
      setError((e as Error).message)
    }
  }

  if (error && !state)
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-ink p-6 text-paper">
        <p className="font-display text-4xl">{error}</p>
      </main>
    )

  const total = state?.total ?? 0
  const limit = state?.timeLimitMs ?? 20_000
  const secs = Math.ceil(timeLeft / 1000)
  const modeLabel = state?.mode === 'exam' ? 'READINESS EXAM' : state?.mode === 'daily' ? 'DAILY CHALLENGE' : `TITLE QUIZ · ${state?.titleName?.toUpperCase() ?? ''}`

  return (
    <main className="halftone-dark min-h-[85vh] bg-ink text-paper">
      <div className="border-b-4 border-pow">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-3 text-sm font-black tracking-wider">
          <span className="text-pow">{modeLabel}</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Icon name="star" size={20} fill="#FFD23F" strokeWidth={2} className="text-pow" /> SCORE
              <motion.span key={state?.score} initial={{ scale: 1.6 }} animate={{ scale: 1 }} className="font-display text-3xl text-pow">
                {state?.score ?? 0}
              </motion.span>
            </span>
            <motion.span key={state?.combo} initial={{ scale: 1.4, rotate: -6 }} animate={{ scale: 1, rotate: 0 }} className="flex items-center gap-1.5 border-2 border-paper bg-hero-red px-2.5 py-1">
              <Icon name="flame" size={18} fill="#FFD23F" strokeWidth={2} /> COMBO ×{state?.combo ?? 1}
            </motion.span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-20 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-[13px] font-black tracking-[0.15em] text-pow">
            QUESTION {Math.min((question?.index ?? 0) + 1, total)} OF {total}
          </div>
          <div className="flex gap-1.5" aria-hidden="true">
            {Array.from({ length: total }, (_, i) => (
              <span
                key={i}
                className="h-5 w-5 rotate-45 border-[3px] border-paper"
                style={{ background: i < results.length ? (results[i] ? '#2E7D32' : '#C8102E') : i === question?.index ? '#FFD23F' : 'transparent' }}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Icon name="stopwatch" size={26} className={cn(secs <= 5 && phase === 'question' ? 'anim-shake text-hero-red' : 'text-pow')} />
          <div className="h-4 flex-1 border-[3px] border-paper bg-[#222]">
            <div className="h-full transition-[width] duration-100 ease-linear" style={{ width: `${(timeLeft / limit) * 100}%`, background: secs <= 5 ? '#C8102E' : '#FFD23F' }} />
          </div>
          <span className="font-display w-10 text-right text-3xl" aria-live={secs === 5 ? 'polite' : 'off'}>
            {phase === 'question' ? secs : '–'}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {question && (
            <motion.section
              key={question.index}
              initial={{ x: 60, opacity: 0, rotate: 1 }}
              animate={{ x: 0, opacity: 1, rotate: 0 }}
              exit={{ x: -60, opacity: 0, rotate: -1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              className="relative mt-7 border-4 border-paper bg-paper p-7 text-ink shadow-[10px_10px_0_#C8102E] sm:p-8"
            >
              <span className="absolute -top-[18px] left-6 flex items-center gap-1.5 border-[3px] border-ink bg-pow px-3 py-1 text-[13px] font-black tracking-wider">
                <Icon name="film" size={14} strokeWidth={2.8} /> FROM: {question.source.toUpperCase()} · {question.difficulty.toUpperCase()}
              </span>
              <h1 className="font-display m-0 mt-2 pr-4 text-[clamp(30px,4.2vw,50px)] leading-[1.06]">{question.prompt}</h1>
              <AnimatePresence>
                {phase === 'feedback' && feedback && (
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: -8 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 520, damping: 14 }}
                    className="absolute -top-14 right-4 sm:right-6"
                    aria-hidden="true"
                  >
                    <Burst color={feedback.correct ? '#FFD23F' : '#C8102E'} size={160}>
                      <span className={feedback.correct ? 'text-ink' : 'text-paper'} style={{ fontSize: sfx.length > 7 ? '1.7rem' : undefined }}>
                        {sfx}
                      </span>
                    </Burst>
                  </motion.div>
                )}
              </AnimatePresence>
              {question.hint && phase !== 'feedback' && (
                <p className="mb-0 mt-4 flex items-center gap-2 font-bold text-deep">
                  <Icon name="bulb" size={20} /> {question.hint}
                </p>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        <div className="mt-7 grid gap-4 sm:grid-cols-2" role="group" aria-label="Answers">
          {question?.options.map((o, i) => {
            const isAnswer = feedback && o.id === feedback.correctOption
            const isWrongPick = feedback && picked === o.id && !feedback.correct
            const submittingThis = phase === 'submitting' && picked === o.id
            return (
              <motion.button
                key={`${question.index}-${o.id}`}
                type="button"
                disabled={phase !== 'question' || o.hidden || phase === 'submitting'}
                onClick={() => submit(o.id)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: o.hidden ? 0.25 : submittingThis ? 0.7 : 1, y: 0, x: isWrongPick ? [0, -10, 10, -6, 6, 0] : 0 }}
                transition={{ delay: phase === 'question' ? i * 0.05 : 0 }}
                className={cn(
                  'flex items-center gap-4 border-4 border-paper px-5 py-4 text-left shadow-[6px_6px_0_#FFF4DC] transition-colors',
                  phase === 'question' && !o.hidden && 'cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_#FFD23F]',
                  submittingThis && 'cursor-wait',
                  isAnswer ? 'bg-win text-paper' : isWrongPick ? 'bg-hero-red text-paper' : 'bg-ink text-paper',
                  o.hidden && 'line-through',
                )}
              >
                <span className="font-display flex h-11 w-11 flex-none items-center justify-center border-[3px] border-current text-3xl">
                  {submittingThis ? <span className="h-5 w-5 animate-spin border-2 border-current border-t-transparent" /> : isAnswer ? <Icon name="check" size={26} strokeWidth={3.2} /> : isWrongPick ? <Icon name="x" size={26} strokeWidth={3.2} /> : KEYS[i]}
                </span>
                <span className="text-lg font-extrabold">{o.label}</span>
              </motion.button>
            )
          })}
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-3.5">
          <button
            type="button"
            disabled={!state?.lifelines.fifty || phase !== 'question'}
            onClick={() => lifeline('fifty')}
            className="flex items-center gap-2 border-[3px] border-dashed border-paper bg-transparent px-3.5 py-2.5 font-black text-paper disabled:opacity-35"
          >
            <Icon name="half" size={20} className="text-pow" /> 50/50 ×{state?.lifelines.fifty ? 1 : 0}
          </button>
          <button
            type="button"
            disabled={!state?.lifelines.hint || phase !== 'question'}
            onClick={() => lifeline('hint')}
            className="flex items-center gap-2 border-[3px] border-dashed border-paper bg-transparent px-3.5 py-2.5 font-black text-paper disabled:opacity-35"
          >
            <Icon name="bulb" size={20} className="text-pow" /> ARCHIVE HINT ×{state?.lifelines.hint ? 1 : 0}
          </button>
          <span className="flex-1" />
          {phase === 'feedback' && (
            <motion.button
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              type="button"
              onClick={next}
              autoFocus
              className="font-display flex items-center gap-2 border-4 border-paper bg-pow px-6 py-2.5 text-3xl text-ink"
            >
              {feedback?.finished ? 'SEE MY VERDICT' : 'NEXT QUESTION'} <Icon name="arrowRight" size={26} />
            </motion.button>
          )}
          {phase === 'submitting' && (
            <div className="flex items-center gap-3 font-black text-pow">
              <span className="h-6 w-6 animate-spin border-[3px] border-pow border-t-transparent" />
              CHECKING ANSWER...
            </div>
          )}
        </div>

        <AnimatePresence>
          {phase === 'feedback' && feedback && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5 flex items-start gap-3 border-[3px] border-paper bg-[#222] px-5 py-4 font-semibold leading-relaxed" role="status">
              <Icon name="bulb" size={24} className="mt-0.5 text-pow" />
              <span>
                <b>{feedback.correct ? `Correct. +${feedback.points} points.` : feedback.timedOut ? 'Out of time.' : 'Not quite.'}</b> {feedback.explanation}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        {error && <p className="mt-4 font-bold text-pow">{error}</p>}
        <p className="mt-8 text-sm font-semibold opacity-70">Tip: press A–D to answer, Enter for the next question.</p>
      </div>
    </main>
  )
}
