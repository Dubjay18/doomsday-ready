import { Link } from '@tanstack/react-router'
import { Burst, btnClass } from './comic'

export function NotFound() {
  return (
    <main className="halftone mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-20 text-center">
      <Burst color="#C8102E" size={200}>
        <span className="text-paper">404!</span>
      </Burst>
      <h1 className="font-display m-0 text-5xl">This page got snapped.</h1>
      <p className="text-lg font-semibold">Half of all URLs are gone. This was one of them.</p>
      <Link to="/" className={btnClass('yellow', 'lg')}>
        BACK TO BASE
      </Link>
    </main>
  )
}

export function ErrorPanel({ error }: { error: unknown }) {
  const msg = error instanceof Error ? error.message : 'Something went wrong'
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-20 text-center">
      <Burst color="#C8102E" size={190}>
        <span className="text-paper">KRAK!</span>
      </Burst>
      <h1 className="font-display m-0 text-5xl">We took a hit.</h1>
      <p className="max-w-md text-lg font-semibold">{msg}</p>
      <Link to="/" className={btnClass('yellow', 'lg')}>
        BACK TO BASE
      </Link>
    </main>
  )
}
