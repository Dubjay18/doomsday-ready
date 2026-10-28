import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { meQuery } from '../lib/queries'
import { alertsSupported, captureInstallPrompt, onAppOpen, onRankChange } from '../lib/alerts'

/** Renders nothing. Registers the service worker, captures the install prompt and drives alert checks. */
export function PwaBoot() {
  const { data: me } = useQuery(meQuery)
  const rank = me?.stats?.rank

  useEffect(() => {
    captureInstallPrompt()
    // The worker only runs in production builds: in dev it would cache stale HMR bundles.
    if (import.meta.env.PROD && 'serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {})
  }, [])

  useEffect(() => {
    if (rank === undefined || !alertsSupported()) return
    void onAppOpen(rank)
  }, [rank === undefined]) // once, when the first profile load lands

  const prevRank = useRef<string | undefined>(undefined)
  useEffect(() => {
    // Skip the first value (onAppOpen handles it) so the two never race on the shared state.
    if (rank && prevRank.current && prevRank.current !== rank && alertsSupported()) void onRankChange(rank)
    if (rank) prevRank.current = rank
  }, [rank])

  return null
}
