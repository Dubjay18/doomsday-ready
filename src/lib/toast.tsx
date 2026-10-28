import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Icon } from '../components/Icon'
import type { IconName } from '../components/Icon'

interface Toast {
  id: number
  text: string
  icon?: IconName
  tone?: 'yellow' | 'red' | 'ink'
}

const Ctx = createContext<(t: Omit<Toast, 'id'>) => void>(() => {})

export function useToast() {
  return useContext(Ctx)
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const push = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random()
    setToasts((xs) => [...xs.slice(-2), { ...t, id }])
    setTimeout(() => setToasts((xs) => xs.filter((x) => x.id !== id)), 2600)
  }, [])
  const bg = { yellow: 'bg-pow text-ink', red: 'bg-hero-red text-paper', ink: 'bg-ink text-pow' }
  return (
    <Ctx.Provider value={push}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ scale: 0.4, rotate: -8, opacity: 0 }}
              animate={{ scale: 1, rotate: -2, opacity: 1 }}
              exit={{ x: 80, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }}
              className={`font-display flex items-center gap-2 border-4 border-ink px-4 py-2 text-2xl shadow-[6px_6px_0_#111] ${bg[t.tone ?? 'yellow']}`}
            >
              {t.icon && <Icon name={t.icon} size={24} />}
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  )
}
