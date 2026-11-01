import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { reportQuestionFn } from '../server/fns'

export function ReportQuestion({ sessionId, index, dark = false }: { sessionId: string; index: number; dark?: boolean }) {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const send = useMutation({
    mutationFn: () => reportQuestionFn({ data: { sessionId, index, note: note.trim() || undefined } }),
    onSuccess: () => {
      setSent(true)
      setOpen(false)
    },
    onError: (e: Error) => setErr(e.message),
  })

  if (sent) return <p className={dark ? 'mt-2 text-sm font-bold text-pow' : 'mt-2 text-sm font-bold'}>Reported. Thanks.</p>

  return (
    <div className="mt-2">
      <button
        type="button"
        className={dark ? 'text-sm font-black text-pow underline' : 'text-sm font-black underline'}
        onClick={() => setOpen((v) => !v)}
      >
        Report this question
      </button>
      {open && (
        <form
          className="mt-2 flex max-w-md flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            send.mutate()
          }}
        >
          <label className={dark ? 'text-xs font-bold text-paper' : 'text-xs font-bold'}>
            Optional note
            <textarea
              value={note}
              maxLength={280}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1 w-full border-2 border-ink bg-paper p-2 text-sm font-semibold text-ink"
              rows={2}
            />
          </label>
          <button type="submit" disabled={send.isPending} className="self-start border-2 border-ink bg-pow px-3 py-1 text-sm font-black text-ink">
            {send.isPending ? 'SENDING' : 'SEND REPORT'}
          </button>
          {err && <p className="text-sm font-bold text-hero-red">{err}</p>}
        </form>
      )}
    </div>
  )
}
