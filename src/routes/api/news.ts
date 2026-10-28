import { createFileRoute } from '@tanstack/react-router'
import { getNews } from '../../server/services/news'

/** Tiny headline feed for the service worker's background alert checks (the page itself uses `newsFn`). */
export const Route = createFileRoute('/api/news')({
  server: {
    handlers: {
      GET: async () => {
        const { items: all } = await getNews(5)
        const items = all.map((i) => ({ id: i.id, title: i.title, url: i.url, source: i.source, spoiler: i.spoiler }))
        return Response.json({ items }, { headers: { 'cache-control': 'no-store' } })
      },
    },
  },
})
