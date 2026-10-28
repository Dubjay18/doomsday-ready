import { Link, createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { LORE, LORE_CATEGORIES } from '../content/lore'
import type { LoreCategory, LoreItem } from '../content/lore'
import { TITLE_BY_ID } from '../content/catalog'
import { cn } from '../components/comic'
import { Icon } from '../components/Icon'

export const Route = createFileRoute('/lore')({
  head: () => ({ meta: [{ title: 'Know your MCU · Doomsday Ready' }] }),
  component: LorePage,
})

function LorePage() {
  const [cat, setCat] = useState<LoreCategory | 'all'>('all')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<string | null>(null)
  const [revealed, setRevealed] = useState<Set<string>>(new Set())

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return LORE.filter((x) => (cat === 'all' || x.category === cat) && (!needle || `${x.q} ${x.a.join(' ')}`.toLowerCase().includes(needle)))
  }, [cat, q])

  const reveal = (id: string) => setRevealed((s) => new Set(s).add(id))

  return (
    <main className="halftone min-h-[80vh]">
      <div className="mx-auto max-w-5xl px-4 pb-20 pt-14">
        <div className="text-sm font-black uppercase tracking-[0.15em] text-hero-red">Things people will assume you know</div>
        <h1 className="font-display m-0 mt-1 text-[clamp(56px,7vw,96px)] leading-[0.95]">
          KNOW YOUR <span className="ink-stroke text-hero-red" style={{ WebkitTextStroke: '2px #111' }}>MCU</span>
        </h1>
        <p className="mt-3 max-w-2xl text-lg font-semibold">
          Who Stan Lee was, where Doctor Strange went, what Doom’s deal is. Short answers to the questions that come up in the cinema queue. Answers that give away a title are hidden until you tap them.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-2.5">
          <button type="button" onClick={() => setCat('all')} className={cn(chipClass(cat === 'all'), cat === 'all' && 'bg-ink !text-pow')}>
            <Icon name="grid" size={16} strokeWidth={2.8} /> ALL ({LORE.length})
          </button>
          {LORE_CATEGORIES.map((c) => (
            <button key={c.id} type="button" onClick={() => setCat(c.id)} className={chipClass(cat === c.id)} style={cat === c.id ? { background: c.color } : undefined} title={c.blurb}>
              {c.label} ({LORE.filter((x) => x.category === c.id).length})
            </button>
          ))}
        </div>
        <label className="mt-4 flex max-w-md items-center gap-2 border-4 border-ink bg-white px-3 py-2 shadow-[4px_4px_0_#111]">
          <Icon name="compass" size={18} />
          <span className="sr-only">Search questions</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search: doom, stan lee, strange…" className="w-full border-0 bg-transparent font-bold outline-none placeholder:font-semibold" />
        </label>

        <div className="mt-8 flex flex-col gap-4">
          {shown.length === 0 && <p className="text-lg font-bold">Nothing matches. Try a different word.</p>}
          {shown.map((x) => (
            <LoreCard key={x.id} item={x} open={open === x.id} onToggle={() => setOpen(open === x.id ? null : x.id)} hidden={x.spoiler > 0 && !revealed.has(x.id)} onReveal={() => reveal(x.id)} />
          ))}
        </div>
        <p className="mt-10 text-sm font-semibold">
          These answers cover each character’s last on-screen appearance and what Marvel has publicly announced. Anything marked <b>NOT CONFIRMED</b> is unannounced, so we don’t guess. For fresh news, see <Link to="/news">MCU news</Link>.
        </p>
      </div>
    </main>
  )
}

const chipClass = (on: boolean) =>
  cn('flex items-center gap-2 border-[3px] border-ink px-3.5 py-2 text-sm font-black tracking-wide transition-transform hover:-translate-y-0.5', on ? 'text-ink shadow-[4px_4px_0_#111]' : 'bg-paper text-ink')

function LoreCard({ item, open, onToggle, hidden, onReveal }: { item: LoreItem; open: boolean; onToggle: () => void; hidden: boolean; onReveal: () => void }) {
  const cat = LORE_CATEGORIES.find((c) => c.id === item.category)!
  return (
    <article className="border-4 border-ink bg-white shadow-[6px_6px_0_#111]">
      <h2 className="m-0">
        <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full items-center gap-3 border-0 bg-transparent p-0 text-left text-ink">
          <span className="flex self-stretch items-center border-r-4 border-ink px-3" style={{ background: cat.color }} title={cat.label}>
            <Icon name="bulb" size={20} />
          </span>
          <span className="flex-1 py-4 pr-2 text-xl font-black leading-tight">{item.q}</span>
          {item.spoiler > 0 && <span className="hidden border-2 border-hero-red px-1.5 text-xs font-black text-hero-red sm:inline">SPOILERS</span>}
          <Icon name="plus" size={24} strokeWidth={3} className={cn('mr-4 flex-none transition-transform', open && 'rotate-45')} />
        </button>
      </h2>
      {open && (
        <div className="border-t-4 border-ink p-5">
          {item.status === 'open' && <div className="mb-3 inline-block border-2 border-ink bg-pow px-2 py-0.5 text-xs font-black tracking-wider">NOT CONFIRMED BY MARVEL</div>}
          {hidden ? (
            <div className="flex flex-col items-start gap-3">
              <p className="m-0 font-bold">This answer spoils {item.spoils ?? 'a recent title'}.</p>
              <button type="button" onClick={onReveal} className="font-display border-4 border-ink bg-hero-red px-5 py-1.5 text-2xl text-paper shadow-[4px_4px_0_#111]">
                SHOW ME ANYWAY
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 text-[17px] font-semibold leading-relaxed">
              {item.a.map((para) => (
                <p key={para} className="m-0">
                  {para}
                </p>
              ))}
              {item.titles && (
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm font-bold">
                  Watch:
                  {item.titles.map((id) => {
                    const t = TITLE_BY_ID.get(id)
                    return t ? (
                      <Link key={id} to="/titles/$titleId" params={{ titleId: id }} className="border-2 border-ink px-2 py-0.5 font-black text-ink no-underline" style={{ background: t.color === '#111111' ? '#FFD23F' : t.color + '55' }}>
                        {t.name}
                      </Link>
                    ) : null
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  )
}
