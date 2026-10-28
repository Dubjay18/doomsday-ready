export type QuizMode = 'exam' | 'title' | 'daily'

/** What the browser sees for a question. Never contains the answer. */
export interface ClientQuestion {
  index: number
  prompt: string
  source: string
  difficulty: 'easy' | 'medium' | 'hard'
  /** id = original option index; the order is shuffled per session. */
  options: { id: number; label: string; hidden: boolean }[]
  remainingMs: number
  hint: string | null
}

export interface QuizState {
  sessionId: string
  mode: QuizMode
  titleName: string | null
  total: number
  cursor: number
  score: number
  combo: number
  correct: number
  lifelines: { fifty: boolean; hint: boolean }
  status: 'active' | 'finished' | 'abandoned'
  timeLimitMs: number
  question: ClientQuestion | null
}

export interface AnswerResult {
  correct: boolean
  timedOut: boolean
  correctOption: number
  explanation: string
  points: number
  score: number
  combo: number
  finished: boolean
}

export interface QuizResult {
  sessionId: string
  mode: QuizMode
  titleName: string | null
  total: number
  correct: number
  score: number
  bestCombo: number
  pct: number
  ready: boolean
  title: string
  line: string
  countsForReady: boolean
  sessionXp: number
  totalXp: number
  rank: string
  readyAt: string | null
  weakSpots: { titleId: string; name: string; missed: number }[]
  review: {
    prompt: string
    source: string
    titleId: string
    yourAnswer: string | null
    correctAnswer: string
    correct: boolean
    explanation: string
    points: number
  }[]
}
