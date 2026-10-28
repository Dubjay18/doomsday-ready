/* Doomsday Ready service worker: offline support + background alert checks. Plain JS, no build step. */
const VERSION = 'v1'
const STATIC = `dr-static-${VERSION}`
const PAGES = `dr-pages-${VERSION}`
const ALERTS = 'dr-alerts' // survives SW updates; holds alert prefs/state (see src/lib/alerts.ts)
const STATE_KEY = '/__alerts-state'

const RELEASE = new Date(2026, 11, 18) // Avengers: Doomsday, Dec 18 2026 (local time)
const MILESTONES = [100, 50, 30, 14, 7, 3, 1, 0]
const DAY = 86400000
/** Pages with per-user data: never kept for offline use. */
const PRIVATE = /^\/(me|auth|quiz|result|api)(\/|$)/

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(STATIC).then((c) => c.addAll(['/offline.html', '/icons/icon-192.png', '/icons/icon-512.png'])).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    (async () => {
      for (const k of await caches.keys()) if (k.startsWith('dr-') && k !== ALERTS && k !== STATIC && k !== PAGES) await caches.delete(k)
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  const url = new URL(req.url)
  if (req.method !== 'GET' || url.origin !== location.origin) return
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/_serverFn')) return // always live

  if (req.mode === 'navigate') {
    e.respondWith(networkFirstPage(req, url))
  } else if (/^\/(assets|characters|icons)\//.test(url.pathname)) {
    e.respondWith(cacheFirst(req))
  }
})

async function networkFirstPage(req, url) {
  try {
    const res = await fetch(req)
    if (res.ok && !PRIVATE.test(url.pathname)) (await caches.open(PAGES)).put(req, res.clone())
    return res
  } catch {
    return (await caches.match(req)) || (await caches.match('/offline.html')) || Response.error()
  }
}

async function cacheFirst(req) {
  const hit = await caches.match(req)
  if (hit) return hit
  const res = await fetch(req)
  if (res.ok) (await caches.open(STATIC)).put(req, res.clone())
  return res
}

/* ── alerts ─────────────────────────────────────────── */

async function readState() {
  const hit = await (await caches.open(ALERTS)).match(STATE_KEY)
  return hit ? hit.json() : null
}
async function writeState(s) {
  await (await caches.open(ALERTS)).put(STATE_KEY, new Response(JSON.stringify(s), { headers: { 'content-type': 'application/json' } }))
}
const daysLeft = (now) => Math.ceil((RELEASE.getTime() - now) / DAY)

function countdownCopy(d) {
  if (d <= 0) return { title: 'IT’S DOOMSDAY.', body: 'Avengers: Doomsday is in cinemas today. Go get your seat, agent.' }
  if (d === 1) return { title: 'T-MINUS 1 DAY', body: 'Doomsday lands tomorrow. Final check: are you actually ready?' }
  return { title: `${d} DAYS TO DOOMSDAY`, body: d <= 14 ? 'The clock is loud now. Top up your watch list and retake the exam.' : 'Still time to finish your watch track. Tick a few more titles.' }
}

const show = (title, body, tag, url) =>
  self.registration.showNotification(title, { body, tag, icon: '/icons/icon-192.png', badge: '/icons/icon-192.png', data: { url }, renotify: false })

async function runChecks() {
  const st = await readState()
  if (!st || Notification.permission !== 'granted') return
  const { prefs } = st
  const now = Date.now()
  const d = daysLeft(now)

  if (prefs.countdown) {
    const due = MILESTONES.filter((m) => d <= m && !st.sentCountdown.includes(m))
    if (due.length) {
      st.sentCountdown.push(...due)
      const c = countdownCopy(d)
      await show(c.title, c.body, 'countdown', '/')
    }
  }

  if (prefs.news) {
    try {
      const { items } = await (await fetch('/api/news', { cache: 'no-store' })).json()
      const fresh = items.find((i) => !i.spoiler) // never push a spoiler headline to the lock screen
      if (fresh && fresh.id !== st.lastNewsId) {
        if (st.lastNewsId) await show(`${fresh.source.toUpperCase()}: NEW HEADLINE`, fresh.title, 'news', '/news')
        st.lastNewsId = fresh.id
      }
    } catch {
      /* offline: try again next check */
    }
  }

  // Comeback nudge: 2+ days away, at most one every 3 days, never after release.
  if (prefs.nudge && d > 0 && now - st.lastVisit > 2 * DAY && now - (st.lastNudgeAt || 0) > 3 * DAY) {
    st.lastNudgeAt = now
    await show('YOUR FILE IS GATHERING DUST', `${d} days to Doomsday. A 2-minute readiness quiz keeps you sharp.`, 'nudge', '/quiz')
  }

  await writeState(st)
}

self.addEventListener('periodicsync', (e) => {
  if (e.tag === 'dr-alert-checks') e.waitUntil(runChecks())
})

self.addEventListener('message', (e) => {
  if (e.data === 'run-alert-checks') e.waitUntil(runChecks())
})

self.addEventListener('notificationclick', (e) => {
  e.notification.close()
  const target = new URL(e.notification.data?.url || '/', location.origin).href
  e.waitUntil(
    (async () => {
      const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      const open = all.find((c) => c.url.startsWith(location.origin))
      if (open) {
        await open.focus()
        if ('navigate' in open) await open.navigate(target).catch(() => {})
      } else await self.clients.openWindow(target)
    })(),
  )
})
