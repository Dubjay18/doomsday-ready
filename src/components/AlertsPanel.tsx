import { useQuery } from '@tanstack/react-query'
import { daysToDoomsday, useAlerts, useInstall } from '../lib/alerts'
import type { AlertPrefs } from '../lib/alerts'
import { meQuery } from '../lib/queries'
import { btnClass, cn } from './comic'
import { Icon } from './Icon'

const OPTIONS: { key: keyof AlertPrefs; title: string; blurb: string }[] = [
  { key: 'countdown', title: 'Countdown', blurb: 'T-100, 50, 30, 14, 7, 3 and 1 day, plus release day.' },
  { key: 'news', title: 'Breaking headlines', blurb: 'One ping for a fresh MCU story. Spoilers never hit your lock screen.' },
  { key: 'nudge', title: 'Comeback nudge', blurb: 'If you vanish for 2+ days, a reminder to keep your streak sharp. Max one per 3 days.' },
  { key: 'rank', title: 'Rank-ups', blurb: 'Celebrate when you get promoted.' },
]

export function AlertsPanel() {
  const { data: me } = useQuery(meQuery)
  const { supported, permission, prefs, on, enable, disable, toggle } = useAlerts()
  const { canInstall, install } = useInstall()
  const d = daysToDoomsday()

  return (
    <section id="alerts" className="panel bg-white p-5 sm:p-6" aria-labelledby="alerts-h">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="alerts-h" className="font-display m-0 flex items-center gap-2 text-3xl sm:text-4xl">
          <Icon name="bell" size={30} /> DOOMSDAY ALERTS
        </h2>
        {d > 0 && <span className="border-2 border-ink bg-pow px-2.5 py-1 text-sm font-black">{d} DAYS TO GO</span>}
      </div>

      {!supported ? (
        <p className="mb-0 mt-3 font-semibold">This browser can’t show notifications. On iPhone, add the app to your Home Screen first, then come back here.</p>
      ) : permission === 'denied' ? (
        <p className="mb-0 mt-3 font-semibold">Notifications are blocked for this site. Allow them in your browser’s site settings, then reload.</p>
      ) : (
        <>
          <p className="mt-3 font-semibold">Quiet, useful pings only. Everything is checked on your device, nothing is tracked.</p>
          <ul className="m-0 mt-4 list-none space-y-3 p-0">
            {OPTIONS.map((o) => (
              <li key={o.key}>
                <label className="flex cursor-pointer items-start gap-3">
                  <input type="checkbox" checked={prefs[o.key]} onChange={() => toggle(o.key)} className="mt-1 h-6 w-6 flex-none accent-ink" />
                  <span className="min-w-0">
                    <span className="block font-black">{o.title}</span>
                    <span className="block text-sm font-semibold text-ink/70">{o.blurb}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            {on ? (
              <button type="button" onClick={disable} className={btnClass('paper')}>
                TURN OFF ALERTS
              </button>
            ) : (
              <button type="button" onClick={() => enable(me?.stats?.rank)} className={btnClass('yellow')}>
                <Icon name="bell" size={22} /> TURN ON ALERTS
              </button>
            )}
          </div>
        </>
      )}

      {canInstall && (
        <div className={cn('mt-5 flex flex-wrap items-center gap-3 border-t-4 border-ink pt-5')}>
          <p className="m-0 min-w-0 flex-1 font-semibold">Install Doomsday Ready for a full-screen app and background alerts.</p>
          <button type="button" onClick={install} className={btnClass('ink')}>
            <Icon name="download" size={22} /> INSTALL
          </button>
        </div>
      )}
    </section>
  )
}
