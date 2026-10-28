# 06 · Design System: "Ink & Halftone"

## Design canvas

All six screens are on the Claude Design canvas. Four are clickable (track picker, watched toggles, a working 5-question quiz, leaderboard tabs):
**https://claude.ai/artifact/FzQMxAsCmMNnTGCw8gaa6a**

| Artboard | Shows |
|---|---|
| 01 · Landing | live countdown, spinning burst, speech bubble, how-it-works panels, track teasers, top-3 board |
| 02 · Pick your track | selectable track cards, mission-briefing side panel with hrs/day maths, placement CTA |
| 03 · Track watchlist | readiness meter, filters, comic-panel title cards, WATCHED! stamp animation, where-to-watch chips |
| 04 · Readiness quiz | dark "night panel", draining timer, combo counter, THWACK!/KRAK! bursts, shake on wrong |
| 05 · Verdict | sunburst rays, slammed READY! stamp, score/XP/rank tiles, weak-spot report, share CTA |
| 06 · Leaderboard | podium with floating avatars, scope tabs, ranked table, rank ladder, squad creator |

## Principles

1. **Every screen is a comic page.** Content sits in panels with 4 px ink borders and hard offset shadows. No soft drop shadows, no gradients except the halftone and sunburst.
2. **Short captions, loud display.** Bangers for anything shouted. Archivo for anything read.
3. **Motion is punctuation.** Animations mark moments (tick, correct, wrong, rank up). They aren't ambient noise. Everything respects `prefers-reduced-motion`.
4. **Original art only.** No Marvel logos, wordmarks or character drawings. Posters come from TMDB with attribution. Our own visual identity is the ink-and-halftone system plus SFX words.

## Tokens (Tailwind v4 `@theme`)

```css
/* src/styles/app.css */
@import "tailwindcss";

@theme {
  --color-ink: #111111;
  --color-paper: #FFF4DC;      /* newsprint */
  --color-white: #FFFFFF;
  --color-hero-red: #C8102E;
  --color-pow-yellow: #FFD23F;
  --color-sky: #4FC3F7;
  --color-blast: #FF8A3D;
  --color-cosmic: #B388FF;
  --color-deep-blue: #1E5AA8;
  --color-success: #2E7D32;

  --font-display: "Bangers", "Impact", sans-serif;
  --font-body: "Archivo", system-ui, sans-serif;

  --shadow-panel: 6px 6px 0 var(--color-ink);
  --shadow-panel-lg: 10px 10px 0 var(--color-ink);
  --shadow-panel-hot: 10px 10px 0 var(--color-hero-red);
  --border-ink: 4px;
  --radius-panel: 0;
  --ease-pop: cubic-bezier(.2, 1.6, .4, 1);
  --ease-slam: cubic-bezier(.2, 1.8, .4, 1);
}

.halftone      { background-image: radial-gradient(rgb(17 17 17 / .22) 1.6px, transparent 1.8px); background-size: 12px 12px; }
.halftone-lite { background-image: radial-gradient(rgb(255 255 255 / .28) 2px, transparent 2.2px); background-size: 14px 14px; }
.sunburst      { background: repeating-conic-gradient(from 0deg at 50% 45%, var(--color-pow-yellow) 0 10deg, #FFC107 10deg 20deg); }
```

Track colours: Speedrun = pow-yellow, Essentials = sky, Deep Dive = blast, Multiverse = cosmic.

**Contrast:** ink on paper/yellow/sky/blast/cosmic all pass 4.5:1. Paper text on hero-red passes only at ≥ 24 px bold. Keep red-background body copy at 19 px+ weight 600 **and** add the 3 px ink text-stroke for display text.

## Component kit (`src/components/comic/`)

| Component | Notes |
|---|---|
| `<Panel tone="paper|yellow|ink" tilt={-1}>` | border + offset shadow; optional tilt; hover lift |
| `<InkButton variant="primary|ghost|dark">` | press = translate(3px,3px) + shadow shrink |
| `<Burst color sfx="THWACK!">` | 16-point SVG star, scale-in with `--ease-slam` |
| `<SpeechBubble tail="bottom-left">` | SVG tail; `role="note"` |
| `<Stamp text="WATCHED!">` | rotates in from 2.2× scale; red outline |
| `<SfxText>` | Bangers, stroke, layered shadow; aria-hidden when decorative |
| `<Meter value max>` | halftone fill, springy width transition; `role="progressbar"` |
| `<Countdown target>` | ticking digits with `tick` keyframe; `aria-live="off"` (announce only on demand) |
| `<PanelGrid>` | CSS grid with "gutters" and an optional splash cell (`grid-column: span 2`) |
| `<PageTurn>` | route transition wrapper |

## Motion catalogue

| Moment | Animation | Lib |
|---|---|---|
| Route change | page-turn: outgoing panel skews −6° and slides, incoming wipes from the right with a halftone mask | Motion `AnimatePresence` |
| Landing hero | headline letters drop in staggered; burst spins slowly; speech bubble wobbles | Motion + CSS |
| Landing scroll | panels "ink in" (clip-path reveal) as they enter; speed lines parallax | GSAP ScrollTrigger (landing only, lazy) |
| Tick title | stamp slam + meter spring + "+150 XP" floater | Motion |
| Correct answer | yellow burst THWACK!, green option, combo counter bumps | Motion |
| Wrong answer | red burst KRAK!, option shake 400 ms | CSS keyframes |
| READY verdict | screen-shake 200 ms, stamp slam, confetti in palette colours | canvas-confetti |
| Rank up | full-screen "issue cover" reveal with new rank title | Motion |
| Leaderboard | podium rises, avatars float, row slide on hover | CSS |

```ts
// src/components/motion/presets.ts
export const slam = { initial: { scale: 2.2, rotate: -25, opacity: 0 },
                      animate: { scale: 1, rotate: -12, opacity: 1 },
                      transition: { type: 'spring', stiffness: 600, damping: 18 } }
export const pop  = { initial: { scale: .4, rotate: -8, opacity: 0 },
                      animate: { scale: 1, rotate: 0, opacity: 1 },
                      transition: { type: 'spring', stiffness: 420, damping: 14 } }
```

**Reduced motion:** wrap the app in `<MotionConfig reducedMotion="user">`. CSS keyframes are disabled under `@media (prefers-reduced-motion: reduce)`, and a "Calm mode" toggle in `/me` forces the same.

**Sound (P1):** Howler sprite with ~6 short SFX (stamp, correct, wrong, rank-up, tick, whoosh). Off by default, toggle persisted on the profile.

## Iconography

One custom stroke icon set, drawn on a 24×24 grid with a 2.5 px round stroke so it matches the ink borders. Icons sit in **ink-bordered circles** (track emblems, feature tiles, rank ladder) or inline beside labels (nav, chips, buttons). Ship them as a typed React component, `src/components/comic/Icon.tsx`:

```tsx
const paths = {
  film: 'M3 4h18v16H3z M7 4v16 M17 4v16 M3 9h4 M3 15h4 M17 9h4 M17 15h4',
  tv: 'M3 7h18v13H3z M8 3l4 4 4-4',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7z',
  trophy: 'M8 21h8 M12 17v4 M7 4h10v5a5 5 0 0 1-10 0z M7 6H4a3 3 0 0 0 3 4 M17 6h3a3 3 0 0 1-3 4',
  target: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  stopwatch: 'M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M12 10v4l2 2 M10 2h4 M12 2v4',
  star: 'M12 2l3 7h7l-5.5 4.5 2 7.5L12 17l-6.5 4 2-7.5L2 9h7z',
  layers: 'M12 2 2 7l10 5 10-5z M2 12l10 5 10-5 M2 17l10 5 10-5',
  rings: 'M8 19a5 5 0 1 0 0-10 5 5 0 0 0 0 10z M16 19a5 5 0 1 0 0-10 5 5 0 0 0 0 10z M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10z',
  flame: 'M12 22c4 0 7-3 7-7 0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-3 2-5 5-5 8 0 4 3 7 7 7z',
  shield: 'M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z',
  crown: 'M3 17h18 M3 17l2-11 5 5 2-7 2 7 5-5 2 11z',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2',
  calendar: 'M3 5h18v16H3z M3 10h18 M8 3v4 M16 3v4',
  users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M2 21a7 7 0 0 1 14 0 M16 3.5a4 4 0 0 1 0 7.5 M22 21a7 7 0 0 0-4-6.3',
  share: 'M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M8.6 13.5l6.8 4 M15.4 6.5l-6.8 4',
  bulb: 'M9 18h6 M10 22h4 M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z',
  alert: 'M12 2 1 21h22z M12 9v5 M12 17v.5',
  globe: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M2 12h20 M12 2a15 15 0 0 1 0 20 M12 2a15 15 0 0 0 0 20',
  check: 'M4 12l5 5L20 6',
  plus: 'M12 5v14 M5 12h14',
  play: 'M6 4l14 8-14 8z',
} as const
export type IconName = keyof typeof paths

export function Icon({ name, size = 20, fill = 'none', className }: { name: IconName; size?: number; fill?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={2.5}
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d={paths[name]} />
    </svg>
  )
}
```

| Where | Icons |
|---|---|
| Nav | film (Tracks), bolt (Quiz), trophy (Leaderboard), user (Sign in) |
| Track emblems | stopwatch (Speedrun), star (Essentials), layers (Deep Dive), rings (Multiverse) |
| Hero Toolkit tiles (landing) | film, tv, bolt, flame, calendar, trophy, users, share |
| Title cards | film/tv kind, calendar year, clock runtime, star priority, play on provider chips, plus/check on the watch button |
| Quiz | star score, flame combo, stopwatch timer, split-circle 50/50, bulb hint/explanation |
| Verdict | shield badge, target %, bolt XP, alert weak spots, share, refresh |
| Leaderboard | trophy title, crown on #1, globe/calendar/flag/users scope tabs, shield tiers, rank-ladder icons per rank |

Motion: icons in tiles rotate −12° and scale 1.15 on hover with `--ease-pop`; the leaderboard trophy floats; the landing trophy wobbles.

## Branding and IP

The brand is **Doomsday Ready's own**: the starburst "DR" mark, the Bangers wordmark, ink-and-halftone panels and the icon set above. The site doesn't use Marvel or Disney logos, wordmarks, logo-style lettering or character art. That keeps it clearly a fan project and avoids takedowns. The official look appears only through **TMDB poster and backdrop images**, which carry each film's own branding and are used under TMDB's API terms with attribution. The footer disclaimer ("Unofficial fan project. Not affiliated with or endorsed by Marvel or Disney.") stays on every page.

## Accessibility checklist

- Real `<button>`/`<a>`; quiz options are a `radiogroup` with arrow-key navigation.
- Timer has a visible number and an `aria-live="polite"` warning at 5 s, not every second.
- SFX words are `aria-hidden`; result is announced in plain text ("Correct. +240 points").
- Focus ring: 3 px pow-yellow outline + 3 px ink offset (visible on every background).
- Touch targets ≥ 44 px. All layouts tested at 360 px width.

## Research and references

Comic-UI patterns studied while designing:

- **daisyUI "Halftone / Comic Book" trend** (palette, shape language, Bangers pairing, splash panel + smaller beats): https://trends.daisyui.com/trend/halftone-comic-book/ · demo: https://trends.daisyui.com/halftone-comic-book/admin/demo/
- **Andy Clarke, comic book layouts as web design inspiration** (panels, gutters, rhythm): https://stuffandnonsense.co.uk/blog/comic-book-layouts-as-web-design-inspiration/
- **Speckyboy, 8 comic-inspired CSS/JS snippets**: https://speckyboy.com/?p=174756, notably:
  - Comic Style Text Bubbles (Josetxu): https://codepen.io/josetxu/pen/eYoKONP
  - Comic Book Style CSS UI (Gabriele Corti): https://codepen.io/borntofrappe/pen/GeXMgm
  - Comic Types halftone text (Antoinette Janus): https://codepen.io/internette/pen/GRKVZOE
  - Responsive & Accessible Comic Page with "CC" panel descriptions (Sarah Frisk): https://codepen.io/sfrisk/pen/XWdLWZY
- **Pop-art halftone history** (for the dot-screen look): Lichtenstein resource at National Galleries of Scotland, MoMA on Sigmar Polke's printed dots (linked from the daisyUI page).
- **Watch-order sites benchmarked:** marvelwatchlist.com (per-year lists with Essential/Recommended/Optional and runtimes; we adopted that priority vocabulary) and thepopverse.com's release/chronological lists (we offer both orders).
