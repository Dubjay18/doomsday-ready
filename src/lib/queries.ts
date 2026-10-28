import { queryOptions } from '@tanstack/react-query'
import { getMe, getQuizResultFn, leaderboardFn, newsFn, postersFn, questionCountsFn, recentQuizzesFn, watchOptionsFn } from '../server/fns'

export const meQuery = queryOptions({
  queryKey: ['me'],
  queryFn: () => getMe(),
  staleTime: 15_000,
})

export const leaderboardQuery = (scope: 'global' | 'week' | 'daily') =>
  queryOptions({
    queryKey: ['lb', scope],
    queryFn: () => leaderboardFn({ data: { scope } }),
    staleTime: 15_000,
  })

export const quizResultQuery = (sessionId: string) =>
  queryOptions({
    queryKey: ['quiz-result', sessionId],
    queryFn: () => getQuizResultFn({ data: { sessionId } }),
    staleTime: Infinity,
  })

export const recentQuizzesQuery = queryOptions({
  queryKey: ['recent-quizzes'],
  queryFn: () => recentQuizzesFn(),
})

export const watchQuery = (titleId: string, region?: string) =>
  queryOptions({
    queryKey: ['watch', titleId, region ?? 'auto'],
    queryFn: () => watchOptionsFn({ data: { titleId, region } }),
    staleTime: 60 * 60 * 1000,
  })

export const questionCountsQuery = queryOptions({
  queryKey: ['question-counts'],
  queryFn: () => questionCountsFn(),
  staleTime: Infinity,
})

export const postersQuery = (ids: string[]) =>
  queryOptions({
    queryKey: ['posters', ids.join(',')],
    queryFn: () => postersFn({ data: { ids } }),
    staleTime: Infinity,
  })

export const newsQuery = (limit = 24) =>
  queryOptions({
    queryKey: ['news', limit],
    queryFn: () => newsFn({ data: { limit } }),
    staleTime: 10 * 60 * 1000,
  })
