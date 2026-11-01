import { Link, createFileRoute } from '@tanstack/react-router'
import { btnClass } from '../../components/comic'
import { ErrorPanel } from '../../components/NotFound'
import { getPublicCardFn, siteOriginFn } from '../../server/fns'
import { stampLabel } from '../../shared/game'

export const Route = createFileRoute('/card/$sessionId')({
  loader: async ({ params }) => {
    const [card, origin] = await Promise.all([
      getPublicCardFn({ data: { sessionId: params.sessionId } }),
      siteOriginFn(),
    ])
    return { card, origin }
  },
  head: ({ loaderData }) => {
    const card = loaderData?.card
    const origin = loaderData?.origin ?? ''
    if (!card) return { meta: [{ title: 'Card not found · Doomsday Ready' }] }
    const stamp = stampLabel(card.mode, card.title, card.ready, card.pct)
    const title = `${card.name} scored ${card.pct}% · ${stamp}`
    const description = `${card.name} got ${card.correct}/${card.total} on Doomsday Ready. Rank: ${card.rank}. No answers on this card.`
    const image = `${origin}/api/og/card/${card.sessionId}`
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
        { property: 'og:image:type', content: 'image/png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image },
      ],
    }
  },
  errorComponent: ({ error }) => <ErrorPanel error={error} />,
  component: CardPage,
})

function CardPage() {
  const { card } = Route.useLoaderData()
  const stamp = stampLabel(card.mode, card.title, card.ready, card.pct)
  const color = card.ready ? '#2E7D32' : card.pct >= 50 ? '#FF8A3D' : '#C8102E'
  const where =
    card.mode === 'exam' ? 'READINESS EXAM' : card.mode === 'daily' ? 'DAILY CHALLENGE' : `TITLE QUIZ${card.titleName ? ` · ${card.titleName.toUpperCase()}` : ''}`

  return (
    <main className="sunburst min-h-[85vh]">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center">
        <p className="bg-ink px-3 py-1 text-sm font-black tracking-[0.2em] text-pow">{where}</p>
        <p className="mt-6 text-xl font-black">{card.name}</p>
        <div className="mt-6 border-[6px] border-ink bg-paper px-8 py-5 shadow-[14px_14px_0_#111]">
          <div className="font-display text-[clamp(48px,9vw,96px)] leading-[0.9]" style={{ color, textShadow: '6px 6px 0 #111' }}>
            {stamp}
          </div>
        </div>
        <p className="mt-8 font-display text-6xl text-hero-red">
          {card.correct}/{card.total}
        </p>
        <p className="font-black tracking-wider">{card.pct}%</p>
        <p className="mt-4 font-display text-3xl">RANK: {card.rank.toUpperCase()}</p>
        <p className="mt-4 max-w-md font-semibold">
          {card.mode === 'exam' ? card.line : 'This card shows the stamp and the score. The answer key stays with the person who took the quiz.'}
        </p>
        <Link to="/" className={`${btnClass('yellow', 'lg')} mt-8`}>
          TAKE THE EXAM
        </Link>
      </div>
    </main>
  )
}
