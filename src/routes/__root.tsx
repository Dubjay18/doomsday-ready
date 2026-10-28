import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { MotionConfig } from 'motion/react'
import appCss from '../styles.css?url'
import { Footer, Header } from '../components/Header'
import { ErrorPanel, NotFound } from '../components/NotFound'
import { meQuery } from '../lib/queries'
import { ToastProvider } from '../lib/toast'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Doomsday Ready: get ready for Avengers: Doomsday' },
      { name: 'description', content: 'Pick a watch track, tick off the MCU, and prove you’re ready for Avengers: Doomsday with randomised quizzes and leaderboards.' },
      { name: 'theme-color', content: '#111111' },
      { property: 'og:title', content: 'Doomsday Ready' },
      { property: 'og:description', content: 'Are you ready for Avengers: Doomsday? Pick a track, binge, and prove it.' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><polygon points=%2220,1 25,13 39,9 29,20 39,31 25,27 20,39 15,27 1,31 11,20 1,9 15,13%22 fill=%22%23FFD23F%22 stroke=%22%23111%22 stroke-width=%222%22/></svg>' },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(meQuery),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
  errorComponent: ({ error }) => <ErrorPanel error={error} />,
})

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:bg-pow focus:p-2">
          Skip to content
        </a>
        <MotionConfig reducedMotion="user">
          <ToastProvider>
            <Header />
            <div id="main" className="flex-1">
              {children}
            </div>
            <Footer />
          </ToastProvider>
        </MotionConfig>
        <Scripts />
      </body>
    </html>
  )
}
