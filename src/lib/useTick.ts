import { useMutation, useQueryClient } from '@tanstack/react-query'
import { markWatched } from '../server/fns'
import { useToast } from './toast'
import type { getMe } from '../server/fns'

type Me = Awaited<ReturnType<typeof getMe>>

/** Optimistic "mark as watched" toggle shared by the watchlist and title pages. */
export function useTick() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (v: { titleId: string; watched: boolean }) => markWatched({ data: v }),
    onMutate: async (v) => {
      await qc.cancelQueries({ queryKey: ['me'] })
      const prev = qc.getQueryData<Me>(['me'])
      if (prev) {
        const ids = new Set(prev.watchedIds)
        if (v.watched) ids.add(v.titleId)
        else ids.delete(v.titleId)
        qc.setQueryData<Me>(['me'], { ...prev, watchedIds: [...ids] })
      }
      return { prev }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(['me'], ctx.prev)
      toast({ text: 'KRAK! Couldn’t save that.', icon: 'alert', tone: 'red' })
    },
    onSuccess: (res) => {
      if (res.xpDelta > 0) toast({ text: `+${res.xpDelta} XP`, icon: 'star' })
      else if (res.capped) toast({ text: 'Daily watch-XP cap reached', icon: 'clock', tone: 'ink' })
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['me'] })
      qc.invalidateQueries({ queryKey: ['lb'] })
    },
  })
}
