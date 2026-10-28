/**
 * End-to-end smoke test: guest ticks → full Readiness Exam → sign-up (progress carries over)
 * → leaderboard → daily challenge → mobile overflow check. Saves screenshots.
 * Usage: pnpm dev (or pnpm start), then: BASE=http://localhost:3000 pnpm smoke [outDir]
 * First run: npx playwright install chromium
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = process.env.BASE ?? 'http://localhost:3000'
const OUT = process.argv[2] ?? 'smoke-shots'
mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1360, height: 900 } })
const page = await ctx.newPage()
const errors = []
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
page.on('console', (m) => m.type() === 'error' && errors.push('console: ' + m.text()))
const step = (s) => console.log('▶', s)

step('landing')
await page.goto(BASE + '/', { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
await page.screenshot({ path: `${OUT}/01-landing.png`, fullPage: false })

step('tracks picker → start Speedrun')
await page.goto(BASE + '/tracks', { waitUntil: 'networkidle' })
await page.getByRole('radio', { name: /SPEEDRUN/ }).click()
await page.waitForTimeout(400)
await page.screenshot({ path: `${OUT}/02-tracks.png` })
await page.getByRole('button', { name: /START SPEEDRUN/ }).click()
await page.waitForURL(/\/tracks\/speedrun/)
await page.waitForLoadState('networkidle')

step('tick 3 titles as guest')
const buttons = page.getByRole('button', { name: /MARK AS WATCHED/ })
for (let i = 0; i < 3; i++) {
  await buttons.first().click()
  await page.waitForTimeout(700)
}
await page.waitForTimeout(800)
const meter = await page.getByRole('progressbar').getAttribute('aria-valuenow')
console.log('  meter after 3 ticks:', meter)
await page.screenshot({ path: `${OUT}/03-watchlist.png` })
const headerXp = await page.locator('header').innerText()
console.log('  header:', headerXp.replace(/\s+/g, ' '))

step('title page')
await page.goto(BASE + '/titles/thunderbolts', { waitUntil: 'networkidle' })
await page.screenshot({ path: `${OUT}/04-title.png` })

step('readiness exam: answer all 20')
await page.goto(BASE + '/quiz', { waitUntil: 'networkidle' })
await page.getByRole('button', { name: /START THE EXAM/ }).click()
await page.waitForURL(/\/quiz\/[0-9a-f-]{36}/)
let shot = false
for (let i = 0; i < 20; i++) {
  await page.getByRole('group', { name: 'Answers' }).getByRole('button').first().waitFor()
  await page.waitForTimeout(250)
  if (i === 1) {
    await page.getByRole('button', { name: /50\/50/ }).click()
    await page.waitForTimeout(300)
  }
  const opts = page.getByRole('group', { name: 'Answers' }).getByRole('button', { disabled: false })
  await opts.nth(i % 2).click()
  await page.getByRole('button', { name: /NEXT QUESTION|SEE MY VERDICT/ }).waitFor()
  if (!shot) {
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${OUT}/05-quiz-feedback.png` })
    shot = true
  }
  await page.getByRole('button', { name: /NEXT QUESTION|SEE MY VERDICT/ }).click()
}
await page.waitForURL(/\/result\//)
await page.waitForLoadState('networkidle')
await page.waitForTimeout(1200)
await page.screenshot({ path: `${OUT}/06-result.png` })
console.log('  verdict:', (await page.locator('main').innerText()).split('\n').slice(0, 6).join(' | '))

step('sign up (guest progress should carry over)')
const xpBefore = (await page.locator('header').innerText()).match(/([\d,]+) XP/)?.[1]
await page.goto(BASE + '/auth?mode=signup', { waitUntil: 'networkidle' })
await page.getByLabel(/HERO HANDLE/i).fill('jeje_assembles')
await page.getByLabel(/EMAIL/i).fill(`jay${Date.now()}@example.com`)
await page.getByLabel(/PASSWORD/i).fill('assemble123')
await page.getByRole('button', { name: /CREATE ACCOUNT/ }).click()
await page.waitForURL(/\/me/, { timeout: 15000 })
await page.waitForLoadState('networkidle')
await page.screenshot({ path: `${OUT}/07-me.png` })
const xpAfter = (await page.locator('header').innerText()).match(/([\d,]+) XP/)?.[1]
console.log('  XP before sign-up:', xpBefore, '→ after:', xpAfter)

step('leaderboard')
await page.goto(BASE + '/leaderboard', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
await page.screenshot({ path: `${OUT}/08-leaderboard.png` })
console.log('  board:', (await page.locator('tbody').innerText()).replace(/\s+/g, ' ').slice(0, 160))

step('daily challenge')
await page.goto(BASE + '/quiz', { waitUntil: 'networkidle' })
await page.getByRole('button', { name: /PLAY TODAY/ }).click()
await page.waitForURL(/\/quiz\/[0-9a-f-]{36}/)
await page.getByRole('group', { name: 'Answers' }).getByRole('button').first().waitFor()
await page.screenshot({ path: `${OUT}/09-daily.png` })

step('mobile landing')
const m = await browser.newPage({ viewport: { width: 390, height: 844 } })
await m.goto(BASE + '/', { waitUntil: 'networkidle' })
await m.waitForTimeout(800)
const overflow = await m.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
console.log('  mobile horizontal overflow px:', overflow)
await m.screenshot({ path: `${OUT}/10-mobile.png` })

console.log('\nERRORS:', errors.length ? errors.join('\n') : 'none')
await browser.close()
if (errors.length) process.exit(1)
