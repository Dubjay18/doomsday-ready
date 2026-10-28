# 05 · Content Catalogue and Tracks

Source of truth: `content/catalog.ts`. Runtimes, posters and IDs are pulled from TMDB at seed time, so hours on track cards are computed, not hand-typed. Years below are release years. Confirm 2026 dates and runtimes against TMDB when seeding.

Legend for tracks: **S** Speedrun · **E** Essentials · **D** Deep Dive · **M** Multiverse. Weight = `doomsday_weight` used by the quiz sampler (1.0 = critical for Doomsday).

## Doomsday context (why the tracks look like this)

Confirmed for *Avengers: Doomsday* (Dec 18 2026, dir. Russo brothers): Robert Downey Jr. as **Doctor Doom**; Thor, Steve Rogers, Sam Wilson's Captain America, Bucky, Falcon (Joaquin Torres), Ant-Man and Cassie Lang, Shang-Chi, Peggy Carter, Loki; the **Fantastic Four**; the **Thunderbolts** (Yelena, Red Guardian, US Agent, Ghost, Sentry); **Shuri** and **M'Baku**, plus **Namor**; and the **Fox X-Men** (Professor X, Magneto, Cyclops, Beast, Mystique, Nightcrawler, Gambit). The plot centres on **Incursions**: universes colliding.

## MCU films

| # | Title | Year | S | E | D | M | Weight |
|---|---|---|---|---|---|---|---|
| 1 | Iron Man | 2008 | | | ✓ | | 0.5 |
| 2 | The Incredible Hulk | 2008 | | | ✓ | | 0.2 |
| 3 | Iron Man 2 | 2010 | | | ✓ | | 0.3 |
| 4 | Thor | 2011 | | | ✓ | | 0.5 |
| 5 | Captain America: The First Avenger | 2011 | | ✓ | ✓ | | 0.8 |
| 6 | The Avengers | 2012 | | ✓ | ✓ | | 0.8 |
| 7 | Iron Man 3 | 2013 | | | ✓ | | 0.3 |
| 8 | Thor: The Dark World | 2013 | | | ✓ | | 0.3 |
| 9 | Captain America: The Winter Soldier | 2014 | | ✓ | ✓ | | 0.8 |
| 10 | Guardians of the Galaxy | 2014 | | | ✓ | | 0.4 |
| 11 | Avengers: Age of Ultron | 2015 | | | ✓ | | 0.5 |
| 12 | Ant-Man | 2015 | | ✓ | ✓ | | 0.6 |
| 13 | Captain America: Civil War | 2016 | | ✓ | ✓ | | 0.8 |
| 14 | Doctor Strange | 2016 | | | ✓ | | 0.5 |
| 15 | Guardians of the Galaxy Vol. 2 | 2017 | | | ✓ | | 0.3 |
| 16 | Spider-Man: Homecoming | 2017 | | | ✓ | | 0.3 |
| 17 | Thor: Ragnarok | 2017 | | ✓ | ✓ | | 0.7 |
| 18 | Black Panther | 2018 | | ✓ | ✓ | | 0.8 |
| 19 | Avengers: Infinity War | 2018 | ✓ | ✓ | ✓ | ✓ | 1.0 |
| 20 | Ant-Man and the Wasp | 2018 | | | ✓ | | 0.4 |
| 21 | Captain Marvel | 2019 | | | ✓ | | 0.4 |
| 22 | Avengers: Endgame | 2019 | ✓ | ✓ | ✓ | ✓ | 1.0 |
| 23 | Spider-Man: Far From Home | 2019 | | | ✓ | | 0.3 |
| 24 | Black Widow | 2021 | | | ✓ | | 0.6 |
| 25 | Shang-Chi and the Legend of the Ten Rings | 2021 | | ✓ | ✓ | | 0.6 |
| 26 | Eternals | 2021 | | | ✓ | | 0.2 |
| 27 | Spider-Man: No Way Home | 2021 | | | ✓ | ✓ | 0.6 |
| 28 | Doctor Strange in the Multiverse of Madness | 2022 | | | ✓ | ✓ | 0.7 |
| 29 | Thor: Love and Thunder | 2022 | | | ✓ | | 0.4 |
| 30 | Black Panther: Wakanda Forever | 2022 | | ✓ | ✓ | | 0.8 |
| 31 | Ant-Man and the Wasp: Quantumania | 2023 | | ✓ | ✓ | | 0.6 |
| 32 | Guardians of the Galaxy Vol. 3 | 2023 | | | ✓ | | 0.2 |
| 33 | The Marvels | 2023 | | | ✓ | ✓ | 0.5 |
| 34 | Deadpool & Wolverine | 2024 | ✓ | ✓ | ✓ | ✓ | 0.9 |
| 35 | Captain America: Brave New World | 2025 | ✓ | ✓ | ✓ | | 0.9 |
| 36 | Thunderbolts* | 2025 | ✓ | ✓ | ✓ | | 1.0 |
| 37 | The Fantastic Four: First Steps | 2025 | ✓ | ✓ | ✓ | ✓ | 1.0 |
| 38 | Spider-Man: Brand New Day | 2026 | ✓ | ✓ | ✓ | | 0.9 |

Optional extra: *Avengers: Endgame Encore* (Sept 2026 re-release). Some listings say it adds new scenes. Treat it as an optional special and verify before writing questions about it.

## MCU series and specials (Disney+)

| Title | Year | E | D | M | Weight |
|---|---|---|---|---|---|
| WandaVision | 2021 | | ✓ | | 0.4 |
| The Falcon and the Winter Soldier | 2021 | ✓ | ✓ | | 0.9 |
| Loki (Season 1) | 2021 | ✓ (S) | ✓ | ✓ | 1.0 |
| What If…? (Season 1) | 2021 | | ✓ | ✓ | 0.5 |
| Hawkeye | 2021 | | ✓ | | 0.2 |
| Moon Knight | 2022 | | ✓ | | 0.1 |
| Ms. Marvel | 2022 | | ✓ | | 0.4 |
| She-Hulk: Attorney at Law | 2022 | | ✓ | | 0.1 |
| Werewolf by Night (special) | 2022 | | ✓ | | 0.1 |
| The Guardians of the Galaxy Holiday Special | 2022 | | ✓ | | 0.1 |
| Secret Invasion | 2023 | | ✓ | | 0.3 |
| Loki (Season 2) | 2023 | ✓ (S) | ✓ | ✓ | 1.0 |
| What If…? (Season 2) | 2023 | | ✓ | | 0.2 |
| Echo | 2024 | | ✓ | | 0.1 |
| Agatha All Along | 2024 | | ✓ | | 0.2 |
| What If…? (Season 3) | 2024 | | ✓ | | 0.2 |
| Daredevil: Born Again (Season 1) | 2025 | | ✓ | | 0.2 |
| Ironheart | 2025 | | ✓ | | 0.2 |
| Eyes of Wakanda (animated) | 2025 | | ✓ | | 0.2 |
| Marvel Zombies (animated) | 2025 | | ✓ | | 0.1 |
| Wonder Man | 2026 | | ✓ | | 0.2 |
| Daredevil: Born Again (Season 2) | 2026 | | ✓ | | 0.2 |
| The Punisher: One Last Kill (special) | 2026 | | ✓ | | 0.1 |
| VisionQuest | 2026 | | ✓ | | 0.4 |

(S) = Loki S1 + S2 are in Speedrun as one "Loki (S1–S2)" entry. Animated non-canon-adjacent shows (*I Am Groot*, *X-Men '97*, *Your Friendly Neighborhood Spider-Man*) are tagged `optional` in Deep Dive only.

## Fox X-Men films (Multiverse track)

| Title | Year | Why it's here | Weight |
|---|---|---|---|
| X-Men | 2000 | Xavier, Magneto, Cyclops, Mystique: the same actors return | 0.8 |
| X2 | 2003 | Nightcrawler (Alan Cumming) | 0.7 |
| X-Men: The Last Stand | 2006 | Kelsey Grammer's Beast | 0.6 |
| X-Men: Days of Future Past | 2014 | Time travel, both casts; closest thing to a multiverse primer | 0.8 |

## Track summary

| Track | Titles | Approx. hours* | Who it's for |
|---|---|---|---|
| **Speedrun** | 8 (Infinity War, Endgame, Loki S1–S2, Deadpool & Wolverine, Brave New World, Thunderbolts*, First Steps, Brand New Day) | ~25 | Crammers |
| **Essentials** | 20 (First Avenger, Avengers, Winter Soldier, Civil War, Ant-Man, Ragnarok, Black Panther, Infinity War, Endgame, Falcon & Winter Soldier, Loki S1, Shang-Chi, Wakanda Forever, Loki S2, Quantumania, Deadpool & Wolverine, Brave New World, Thunderbolts*, First Steps, Brand New Day) | ~54 | Most fans |
| **Deep Dive** | Everything above in release order | ~200+ | True believers |
| **Multiverse** | 14 (X-Men, X2, Last Stand, DOFP, Infinity War, Endgame, Loki S1, Loki S2, What If S1, No Way Home, Multiverse of Madness, The Marvels, Deadpool & Wolverine, First Steps) | ~38 | Plot nerds |

\* Computed from TMDB runtimes at seed time. The design mockups show rounded figures.

## Where to watch: approach

**Decision (ADR-004):** link only to **licensed** providers.

- Pull `GET /3/{movie|tv}/{id}/watch/providers` from TMDB nightly for each title. The data is supplied by JustWatch. Store per region in `title_providers`.
- Show stream / rent / buy groups with provider logos. Each chip deep-links to the TMDB/JustWatch page for that title and region, which links out to the provider.
- Show the attribution "Watch data by JustWatch" next to provider lists (TMDB requires it).
- No providers in the user's region → show "Not streaming in {country} right now" plus rent/buy options from TMDB, and a link to switch region.
- Unlicensed streaming sites are **not** linked (copyright exposure, host/ad-network bans, malware risk for users).
