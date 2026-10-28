/**
 * Downloads a portrait for every cast member in src/routes/characters.tsx into public/characters/<id>.jpg
 * and prints the credit for each. Usage:  node scripts/fetch-character-images.mjs [--only id1,id2]
 *
 * Portraits are the lead image of each actor's Wikipedia article (free-licensed files on Wikimedia Commons),
 * so they're safe to self-host. Self-hosting also lets the service worker cache them for offline use.
 * Review the credits it prints: a few Commons photos are CC BY / CC BY-SA and need attribution.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const src = readFileSync(`${root}src/routes/characters.tsx`, 'utf8')
const UA = 'doomsday-ready/1.0 (fan project; https://github.com/Dubjay18)'

const cast = [...src.matchAll(/id: '([^']+)',\s+name: [^\n]+\n(?:\s+(?:alias|image): [^\n]+\n)*\s+actor: ["']([^"']+)["']/g)].map((m) => ({ id: m[1], actor: m[2] }))
const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1].split(',') : null
const OVERRIDE = { 'Tenoch Huerta Mejía': 'Tenoch Huerta', 'Rebecca Romijn': 'Rebecca Romijn', 'Danny Ramirez': 'Danny Ramirez (actor)' }

mkdirSync(`${root}public/characters`, { recursive: true })
const credits = {}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

for (const { id, actor } of cast) {
  if (only && !only.includes(id)) continue
  const out = `${root}public/characters/${id}.jpg`
  if (!only && existsSync(out)) continue
  const title = OVERRIDE[actor] ?? actor
  try {
    const q = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&piprop=thumbnail|name&pithumbsize=500&redirects=1&format=json`
    const page = Object.values((await (await fetch(q, { headers: { 'user-agent': UA } })).json()).query.pages)[0]
    const url = page?.thumbnail?.source
    if (!url) throw new Error('no lead image')
    const img = await fetch(url, { headers: { 'user-agent': UA } })
    if (!img.ok) throw new Error(`download ${img.status}`)
    writeFileSync(out, Buffer.from(await img.arrayBuffer()))
    credits[id] = `${actor}: ${page.pageimage}`
    console.log(`ok   ${id.padEnd(22)} ${credits[id]}`)
  } catch (e) {
    console.log(`MISS ${id.padEnd(22)} ${actor}: ${e.message}`)
  }
  await sleep(400)
}
