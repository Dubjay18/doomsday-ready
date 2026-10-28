/**
 * Doomsday Alerts: local web notifications (no push server). The page and the service worker share one
 * small state record in Cache Storage; the worker (public/sw.js) reads it to fire countdown, headline and
 * comeback alerts, even when the tab is closed on browsers that support periodic background sync.
 */
import { useCallback, useEffect, useState } from 'react'

export interface AlertPrefs {
  countdown: boolean
  news: boolean
  nudge: boolean
  rank: boolean
}
interface AlertState {
  prefs: AlertPrefs
  sentCountdown: number[]
  lastNewsId: string | null
  lastNudgeAt: number
  lastVisit: number
  lastRank: string | null
}

const CACHE = 'dr-alerts'
const KEY = '/__alerts-state'
/** Keep in sync with RELEASE / MILESTONES in public/sw.js. */
export const RELEASE = new Date(2026, 11, 18)
const MILESTONES = [100, 50, 30, 14, 7, 3, 1, 0]
export const daysToDoomsday = (now = Date.now()) => Math.ceil((RELEASE.getTime() - now) / 86400000)

export const DEFAULT_PREFS: AlertPrefs = { countdown: true, news: true, nudge: true, rank: true }

export const alertsSupported = () => typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator && 'caches' in window

async function read(): Promise<AlertState | null> {
  try {
    const hit = await (await caches.open(CACHE)).match(KEY)
    return hit ? ((await hit.json()) as AlertState) : null
  } catch {
    return null
  }
}
async function write(s: AlertState) {
  await (await caches.open(CACHE)).put(KEY, new Response(JSON.stringify(s), { headers: { 'content-type': 'application/json' } }))
}
const swReady = () => navigator.serviceWorker.ready

async function notify(title: string, body: string, tag: string, url = '/') {
  try {
    const reg = await swReady()
    await reg.showNotification(title, { body, tag, icon: '/icons/icon-192.png', badge: '/icons/icon-192.png', data: { url } })
  } catch {
    /* permission revoked mid-session or unsupported: a missed ping must never break the app */
  }
}

/** Must be called from a click: browsers only show the permission prompt for a user gesture. */
export async function enableAlerts(prefs: AlertPrefs = DEFAULT_PREFS, rank: string | null = null): Promise<NotificationPermission> {
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return permission
  const d = daysToDoomsday()
  // Only milestones still ahead should fire: mark the ones we've already passed as sent.
  const prev = await read()
  await write({
    prefs,
    sentCountdown: prev?.sentCountdown ?? MILESTONES.filter((m) => d <= m),
    lastNewsId: prev?.lastNewsId ?? null,
    lastNudgeAt: prev?.lastNudgeAt ?? 0,
    lastVisit: Date.now(),
    lastRank: prev?.lastRank ?? rank,
  })
  const reg = await swReady()
  try {
    // Chromium-only: lets the worker run the checks in the background for installed PWAs.
    await (reg as ServiceWorkerRegistration & { periodicSync?: { register(tag: string, o: { minInterval: number }): Promise<void> } }).periodicSync?.register('dr-alert-checks', { minInterval: 12 * 3600 * 1000 })
  } catch {
    /* not installed / not permitted: checks still run whenever the app is opened */
  }
  await notify('ALERTS ARMED', d > 0 ? `${d} days to Doomsday. We'll ping you at the big moments, nothing more.` : 'Doomsday is here. Enjoy the film, agent.', 'welcome')
  return permission
}

export async function disableAlerts() {
  const reg = await swReady()
  try {
    await (reg as ServiceWorkerRegistration & { periodicSync?: { unregister(tag: string): Promise<void> } }).periodicSync?.unregister('dr-alert-checks')
  } catch {
    /* ignore */
  }
  await (await caches.open(CACHE)).delete(KEY)
}

export async function setPrefs(prefs: AlertPrefs) {
  const st = await read()
  if (st) await write({ ...st, prefs })
}

/** Called on every app open: records the visit (for the comeback nudge), watches for rank-ups, and asks the worker to run its checks. */
export async function onAppOpen(rank?: string) {
  const st = await read()
  if (!st || Notification.permission !== 'granted') return
  const promoted = st.prefs.rank && rank && st.lastRank && st.lastRank !== rank
  await write({ ...st, lastVisit: Date.now(), lastRank: rank ?? st.lastRank })
  if (promoted) await notify('PROMOTED!', `You've reached the rank of ${rank}. Keep climbing.`, 'rank', '/me')
  const reg = await swReady()
  reg.active?.postMessage('run-alert-checks')
}

/** Rank changes while the app is already open. */
export async function onRankChange(rank: string) {
  const st = await read()
  if (!st || Notification.permission !== 'granted' || st.lastRank === rank) return
  await write({ ...st, lastRank: rank })
  if (st.prefs.rank && st.lastRank && document.visibilityState === 'hidden') await notify('PROMOTED!', `You've reached the rank of ${rank}.`, 'rank', '/me')
}

export function useAlerts() {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('unsupported')
  const [prefs, setPrefsState] = useState<AlertPrefs>(DEFAULT_PREFS)
  const [on, setOn] = useState(false)

  useEffect(() => {
    if (!alertsSupported()) return
    setPermission(Notification.permission)
    read().then((st) => {
      if (st) {
        setPrefsState(st.prefs)
        setOn(Notification.permission === 'granted')
      }
    })
  }, [])

  const enable = useCallback(async (rank?: string) => {
    const p = await enableAlerts(prefs, rank ?? null)
    setPermission(p)
    setOn(p === 'granted')
    return p
  }, [prefs])

  const disable = useCallback(async () => {
    await disableAlerts()
    setOn(false)
  }, [])

  const toggle = useCallback(
    async (k: keyof AlertPrefs) => {
      const next = { ...prefs, [k]: !prefs[k] }
      setPrefsState(next)
      await setPrefs(next)
    },
    [prefs],
  )

  return { supported: permission !== 'unsupported', permission, prefs, on, enable, disable, toggle }
}

/* ── install prompt ── */

interface InstallEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}
let deferred: InstallEvent | null = null
const listeners = new Set<() => void>()

export function captureInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferred = e as InstallEvent
    listeners.forEach((l) => l())
  })
  window.addEventListener('appinstalled', () => {
    deferred = null
    listeners.forEach((l) => l())
  })
}

export function useInstall() {
  const [, bump] = useState(0)
  useEffect(() => {
    const l = () => bump((n) => n + 1)
    listeners.add(l)
    return () => void listeners.delete(l)
  }, [])
  return {
    canInstall: deferred !== null,
    install: async () => {
      if (!deferred) return
      await deferred.prompt()
      await deferred.userChoice
      deferred = null
      listeners.forEach((l) => l())
    },
  }
}
