import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { MotionConfig } from 'motion/react'
import { Analytics } from '@vercel/analytics/react'
import appCss from '../styles.css?url'
import { Footer, Header } from '../components/Header'
import { PwaBoot } from '../components/PwaBoot'
import { ErrorPanel, NotFound } from '../components/NotFound'
import { meQuery } from '../lib/queries'
import { ToastProvider } from '../lib/toast'
import { siteOriginFn } from '../server/fns'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: ({ loaderData }) => {
    const origin = (loaderData as { origin?: string } | undefined)?.origin ?? ''
    const image = `${origin}/og.png`
    const desc = 'Pick a watch track, tick off the MCU, and prove you’re ready for Avengers: Doomsday with randomised quizzes and leaderboards.'
    return {
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { title: 'Doomsday Ready: get ready for Avengers: Doomsday' },
      { name: 'description', content: desc },
      { name: 'theme-color', content: '#111111' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-title', content: 'Doomsday' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Doomsday Ready' },
      { property: 'og:title', content: 'Doomsday Ready: are you ready for Avengers: Doomsday?' },
      { property: 'og:description', content: 'Pick a track, binge, and prove it. Watch tracks, quizzes and a leaderboard for Dec 18, 2026.' },
      { property: 'og:image', content: image },
      { property: 'og:image:type', content: 'image/png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: 'Doomsday Ready: Are you ready for Doomsday? Avengers: Doomsday, December 18, 2026.' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Doomsday Ready: are you ready for Avengers: Doomsday?' },
      { name: 'twitter:description', content: 'Pick a track, binge, and prove it.' },
      { name: 'twitter:image', content: image },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'manifest', href: '/manifest.webmanifest' },
      { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.png' },
      { rel: 'icon', href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><polygon points=%2220,1 25,13 39,9 29,20 39,31 25,27 20,39 15,27 1,31 11,20 1,9 15,13%22 fill=%22%23FFD23F%22 stroke=%22%23111%22 stroke-width=%222%22/></svg>' },
    ],
    }
  },
  loader: async ({ context }): Promise<{ origin: string }> => {
    const [, origin] = await Promise.all([context.queryClient.ensureQueryData(meQuery), siteOriginFn()])
    return { origin }
  },
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
            <PwaBoot />
            <Header />
            <div id="main" className="flex-1">
              {children}
            </div>
            <Footer />
          </ToastProvider>
        </MotionConfig>
        <Analytics />
        <Scripts />
      </body>
    </html>
  )
}
