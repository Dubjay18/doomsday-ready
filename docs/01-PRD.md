# 01 · Product Requirements

## 1. Problem

*Avengers: Doomsday* (Russo brothers, Dec 18 2026) pulls heroes from **three universes** into one story: the MCU Avengers, the Fantastic Four from *First Steps*, and the Fox X-Men (Stewart, McKellen, Marsden, Grammer, Romijn, Cumming, Tatum). Robert Downey Jr. returns as Doctor Doom. The plot centres on *Incursions*, universes colliding.

That's 38 MCU films, 25+ Disney+ series and a handful of Fox X-Men films. Casual fans don't know what to watch, how long it takes, or whether they've "got it". Existing watch-order sites are static lists. Nobody turns the prep into a game or tells you when you're done.

## 2. Users

| Persona | Situation | What they need |
|---|---|---|
| **The Crammer** | Saw Endgame, stopped there. 2 weeks left. | Shortest path, time estimate, a "you'll be fine" signal |
| **The Returner** | Watched most of it years ago | Recaps of what they forgot, a quiz to find gaps |
| **The True Believer** | Has seen everything | Hard quizzes, bragging rights, leaderboards |
| **The Squad Organiser** | Group chat going to opening night together | Private squad board, shared progress, a watch-party plan |

## 3. Goals and non-goals

**Goals**
- Get a user from landing to a chosen track in **< 30 s**.
- Make "READY" a clear, earned state: ≥ 80% on the Readiness Exam.
- Make it social enough to spread through group chats before Dec 18.

**Non-goals**
- Hosting or embedding video. We link to licensed providers only.
- Being a general MCU wiki.
- Native mobile apps (PWA is enough).

## 4. Feature list

Priorities: **P0** ships by MVP (day 14), **P1** ships before Dec 1, **P2** if time allows. Status `[ ]` for tracking.

### 4.1 Onboarding and identity
| # | Feature | Pri |
|---|---|---|
| F1 | Landing page with live countdown (region-aware release date), animated hero, track teaser | P0 |
| F2 | **Guest mode**: use tracks and take quizzes without signing up; progress in localStorage, merged on sign-in | P0 |
| F3 | Sign-in with Google, Discord, email magic link (Better Auth) | P0 |
| F4 | Pick a handle + avatar ("hero mask" generator: colour, emblem, pattern, no copyrighted characters) | P1 |
| F5 | Country (auto from IP, editable) for country board + watch-provider region | P0 |
| F6 | Spoiler-safe mode toggle (hide questions and notes for unwatched titles) | P1 |

### 4.2 Tracks
| # | Feature | Pri |
|---|---|---|
| T1 | Four curated tracks: **Speedrun**, **Essentials**, **Deep Dive**, **Multiverse** | P0 |
| T2 | Track card: title count, total hours (from TMDB runtimes), hours/day needed to finish before release | P0 |
| T3 | Switch tracks without losing ticks (ticks belong to titles, not tracks) | P0 |
| T4 | **Build my track**: 60-second placement quiz + "what have you seen" checklist → custom ordered list | P1 |
| T5 | Ordering toggle: release order vs. chronological (in-universe) order | P1 |
| T6 | "Watch plan" scheduler: pick days/hours available → calendar (.ics export) | P2 |

### 4.3 Watchlist and titles
| # | Feature | Pri |
|---|---|---|
| W1 | Comic-panel grid of titles: poster, year, runtime, priority (Essential/Recommended/Optional) | P0 |
| W2 | "Why it matters for Doomsday" note per title (spoiler-light) | P0 |
| W3 | Mark as watched (with stamp animation), unmark, per-episode ticks for series | P0 (title) / P1 (episode) |
| W4 | **Where to watch**: providers per user's country from TMDB watch/providers (stream, rent, buy) with JustWatch attribution | P0 |
| W5 | Readiness meter for the track | P0 |
| W6 | Title page: synopsis, cast who appear in Doomsday, connections graph ("leads to …"), 60-second text recap | P1 |
| W7 | Filters: to watch, watched, series only, films only, by phase | P0 |
| W8 | "Skip it? Here's the recap" for optional titles | P1 |

### 4.4 Quizzes
| # | Feature | Pri |
|---|---|---|
| Q1 | **Title quiz**: 5 questions on one title, unlocked when ticked | P0 |
| Q2 | **Readiness Exam**: 20 random questions from the whole MCU, weighted toward Doomsday-relevant titles. ≥ 80% = READY badge | P0 |
| Q3 | Server-side grading; answers never shipped to the client before the answer is locked in | P0 |
| Q4 | Timer per question (20 s), combo multiplier, SFX bursts (THWACK!/KRAK!) | P0 |
| Q5 | Lifelines: 50/50 and "Archive hint" (one each per exam) | P1 |
| Q6 | Weak-spot report: missed questions grouped by title, with rewatch/recap links | P0 |
| Q7 | Question types: multiple choice, true/false, order-the-events, poster-crop ("which film is this frame from?") | P0 (MC, T/F) / P1 (others) |
| Q8 | **Daily Challenge**: same 5 questions for everyone today, one attempt, global daily board | P1 |
| Q9 | **Versus**: 1v1 live duel via shareable link (same seed, side-by-side scores) | P2 |
| Q10 | Report-a-question button (wrong answer / spoiler) → moderation queue | P1 |

### 4.5 Gamification
| # | Feature | Pri |
|---|---|---|
| G1 | XP ledger: ticks, quiz points, streaks, achievements | P0 |
| G2 | Ranks: Civilian → Recruit → Agent → Avenger → Founding Member → Multiverse Legend | P0 |
| G3 | Daily streak (watch or quiz each day) with streak freeze (1/week) | P1 |
| G4 | Achievements (≈ 30): "Snap Back" (finish Endgame), "Variant Hunter" (Loki S1+S2), "Mutant Ally" (all 4 X-Men films), "Speedrunner" (Speedrun track in 7 days), "Flawless" (100% exam)… | P1 |
| G5 | Collectible "issue covers": each finished title unlocks a procedurally generated comic cover for your profile | P2 |

### 4.6 Leaderboards and social
| # | Feature | Pri |
|---|---|---|
| L1 | Global all-time board (top 100 + "you" row) | P0 |
| L2 | Weekly board (resets Monday 00:00 UTC) | P1 |
| L3 | Country board | P1 |
| L4 | **Squads**: private boards via invite code (≤ 50 members) | P1 |
| L5 | Shareable **Ready Card** (OG image: handle, %, rank, track) for X/WhatsApp/IG stories | P0 |
| L6 | Public profile `/u/$handle` | P1 |

### 4.7 Platform
| # | Feature | Pri |
|---|---|---|
| P1 | PWA: installable, offline title list | P2 |
| P2 | `prefers-reduced-motion` and a global "calm mode" switch | P0 |
| P3 | Sound toggle (off by default) | P1 |
| P4 | Admin: question CRUD, review queue, catalogue editor, feature flags | P1 |
| P5 | Analytics funnel: landing → track → first tick → first quiz → READY → share | P0 |

## 5. Core user stories (acceptance criteria)

- **As a Crammer**, I pick Speedrun and immediately see 8 titles, the total hours, and that I need ~0.5 h/day. *AC: hours come from TMDB runtimes; hrs/day = total ÷ days left in my region.*
- **As any user**, I tap "Mark as watched" and the meter animates up and I get XP. *AC: optimistic UI, idempotent server call, XP awarded once per title.*
- **As any user**, I take the Readiness Exam and get 17/20. *AC: 85% ≥ 80% → READY badge persisted, Ready Card generated, rank updated within 2 s.*
- **As a Squad Organiser**, I create "OAU Assemble", share the link, and friends who join appear on the squad board.
- **As a guest**, I finish a quiz, then sign in, and my XP and ticks follow me.

## 6. Success metrics

| Metric | Target by Dec 18 |
|---|---|
| Landing → track chosen | ≥ 45% |
| Track chosen → first quiz | ≥ 30% |
| Users reaching READY | ≥ 15% of signed-in users |
| Ready Cards shared per READY user | ≥ 0.4 |
| p75 LCP on mobile (Lagos 4G profile) | < 2.5 s |
