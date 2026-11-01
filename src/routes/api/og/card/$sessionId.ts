import { createFileRoute } from '@tanstack/react-router'
import { renderShareCard } from '../../../../server/og/card-png'
import { QuizError, getPublicCard } from '../../../../server/services/quiz/sessions'
import { stampLabel } from '../../../../shared/game'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const Route = createFileRoute('/api/og/card/$sessionId')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        if (!UUID_RE.test(params.sessionId)) return new Response('Not found', { status: 404 })
        try {
          const card = await getPublicCard(params.sessionId)
          const stamp = stampLabel(card.mode, card.title, card.ready, card.pct)
          const kicker = card.mode === 'exam' ? 'READINESS EXAM' : card.mode === 'daily' ? 'DAILY CHALLENGE' : (card.titleName ?? 'TITLE QUIZ')
          const png = renderShareCard({
            name: card.name,
            stamp,
            scoreLine: `${card.correct}/${card.total}  ${card.pct}%`,
            rankLine: `RANK ${card.rank}`,
            kicker,
            ready: card.ready,
            pct: card.pct,
          })
          return new Response(new Uint8Array(png), {
            headers: {
              'content-type': 'image/png',
              'cache-control': 'public, max-age=120',
            },
          })
        } catch (e) {
          if (e instanceof QuizError && e.code === 'NOT_FOUND') return new Response('Not found', { status: 404 })
          throw e
        }
      },
    },
  },
})
