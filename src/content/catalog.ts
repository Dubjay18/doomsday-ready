/**
 * The catalogue. Source of truth for titles and tracks.
 * Runtimes are approximate and get replaced by TMDB values when
 * `pnpm tmdb:sync` runs with TMDB_READ_TOKEN set (see scripts/tmdb-sync.ts).
 */

export type TitleKind = 'film' | 'series' | 'special'
export type Universe = 'mcu' | 'fox' | 'sony'
export type Phase = 1 | 2 | 3 | 4 | 5 | 6

export interface Title {
  id: string
  name: string
  kind: TitleKind
  year: number
  runtimeMin: number
  episodes?: number
  universe: Universe
  /** Marvel Studios' official release Phase. Absent for titles from other studios. */
  phase?: Phase
  /** 0..1, how much Doomsday leans on it. Drives quiz sampling. */
  weight: number
  why: string
  /** Panel colour for the placeholder poster. */
  color: string
  /** Chronological (in-universe) order key; lower = earlier. */
  chrono: number
}

const C = { red: '#C8102E', blue: '#1E5AA8', yellow: '#FFD23F', sky: '#4FC3F7', orange: '#FF8A3D', purple: '#6A1B9A', green: '#2E7D32', ink: '#111111', violet: '#B388FF' }

const t = (x: Title) => x

export const TITLES: Title[] = [
  // ── Phase 1 ──
  t({ id: 'iron-man', phase: 1, name: 'Iron Man', kind: 'film', year: 2008, runtimeMin: 126, universe: 'mcu', weight: 0.5, color: C.red, chrono: 40, why: 'Where it all starts. Tony Stark, whose legacy hangs over Robert Downey Jr.’s return as Doom.' }),
  t({ id: 'the-incredible-hulk', phase: 1, name: 'The Incredible Hulk', kind: 'film', year: 2008, runtimeMin: 112, universe: 'mcu', weight: 0.2, color: C.green, chrono: 50, why: 'Introduces Thaddeus Ross and Samuel Sterns, who come back in Brave New World.' }),
  t({ id: 'iron-man-2', phase: 1, name: 'Iron Man 2', kind: 'film', year: 2010, runtimeMin: 124, universe: 'mcu', weight: 0.3, color: C.red, chrono: 45, why: 'Black Widow’s debut and War Machine’s first suit.' }),
  t({ id: 'thor', phase: 1, name: 'Thor', kind: 'film', year: 2011, runtimeMin: 115, universe: 'mcu', weight: 0.5, color: C.blue, chrono: 48, why: 'Thor and Loki’s origin, both confirmed for Doomsday.' }),
  t({ id: 'captain-america-the-first-avenger', phase: 1, name: 'Captain America: The First Avenger', kind: 'film', year: 2011, runtimeMin: 124, universe: 'mcu', weight: 0.8, color: C.blue, chrono: 10, why: 'Steve Rogers, Bucky and Peggy Carter. All three are back for Doomsday.' }),
  t({ id: 'the-avengers', phase: 1, name: 'The Avengers', kind: 'film', year: 2012, runtimeMin: 143, universe: 'mcu', weight: 0.8, color: C.red, chrono: 60, why: 'The team forms, Loki invades, and Thanos is teased.' }),
  // ── Phase 2 ──
  t({ id: 'iron-man-3', phase: 2, name: 'Iron Man 3', kind: 'film', year: 2013, runtimeMin: 130, universe: 'mcu', weight: 0.3, color: C.red, chrono: 70, why: 'Tony’s post-New York anxiety and the fake Mandarin.' }),
  t({ id: 'thor-the-dark-world', phase: 2, name: 'Thor: The Dark World', kind: 'film', year: 2013, runtimeMin: 112, universe: 'mcu', weight: 0.3, color: C.blue, chrono: 72, why: 'The Reality Stone, and Loki at his most slippery.' }),
  t({ id: 'captain-america-the-winter-soldier', phase: 2, name: 'Captain America: The Winter Soldier', kind: 'film', year: 2014, runtimeMin: 136, universe: 'mcu', weight: 0.8, color: C.green, chrono: 75, why: 'Bucky returns as the Winter Soldier, and Sam Wilson, the future Captain America, debuts.' }),
  t({ id: 'guardians-of-the-galaxy', phase: 2, name: 'Guardians of the Galaxy', kind: 'film', year: 2014, runtimeMin: 121, universe: 'mcu', weight: 0.4, color: C.orange, chrono: 74, why: 'The cosmic side of the MCU and the Power Stone.' }),
  t({ id: 'avengers-age-of-ultron', phase: 2, name: 'Avengers: Age of Ultron', kind: 'film', year: 2015, runtimeMin: 141, universe: 'mcu', weight: 0.5, color: C.red, chrono: 80, why: 'Sokovia falls, which leads to the Accords. Vision and Wanda arrive.' }),
  t({ id: 'ant-man', phase: 2, name: 'Ant-Man', kind: 'film', year: 2015, runtimeMin: 117, universe: 'mcu', weight: 0.6, color: C.red, chrono: 82, why: 'Scott and Cassie Lang, plus the Quantum Realm. Both Langs are in Doomsday.' }),
  // ── Phase 3 ──
  t({ id: 'captain-america-civil-war', phase: 3, name: 'Captain America: Civil War', kind: 'film', year: 2016, runtimeMin: 147, universe: 'mcu', weight: 0.8, color: C.orange, chrono: 84, why: 'The Avengers split, Black Panther arrives, and the Bucky–Tony wound opens.' }),
  t({ id: 'doctor-strange', phase: 3, name: 'Doctor Strange', kind: 'film', year: 2016, runtimeMin: 115, universe: 'mcu', weight: 0.5, color: C.purple, chrono: 88, why: 'Magic and the multiverse enter the MCU.' }),
  t({ id: 'guardians-of-the-galaxy-vol-2', phase: 3, name: 'Guardians of the Galaxy Vol. 2', kind: 'film', year: 2017, runtimeMin: 136, universe: 'mcu', weight: 0.3, color: C.orange, chrono: 76, why: 'Quill’s father and the Guardians as a family.' }),
  t({ id: 'spider-man-homecoming', phase: 3, name: 'Spider-Man: Homecoming', kind: 'film', year: 2017, runtimeMin: 133, universe: 'mcu', weight: 0.3, color: C.red, chrono: 86, why: 'Peter Parker under Tony’s wing.' }),
  t({ id: 'thor-ragnarok', phase: 3, name: 'Thor: Ragnarok', kind: 'film', year: 2017, runtimeMin: 130, universe: 'mcu', weight: 0.7, color: C.violet, chrono: 89, why: 'Asgard falls, and Thor and Loki finally act like brothers.' }),
  t({ id: 'black-panther', phase: 3, name: 'Black Panther', kind: 'film', year: 2018, runtimeMin: 134, universe: 'mcu', weight: 0.8, color: C.purple, chrono: 85, why: 'Shuri and M’Baku, both confirmed for Doomsday.' }),
  t({ id: 'avengers-infinity-war', phase: 3, name: 'Avengers: Infinity War', kind: 'film', year: 2018, runtimeMin: 149, universe: 'mcu', weight: 1, color: C.purple, chrono: 92, why: 'The Russos’ first Avengers epic. Doomsday is built the same way.' }),
  t({ id: 'ant-man-and-the-wasp', phase: 3, name: 'Ant-Man and the Wasp', kind: 'film', year: 2018, runtimeMin: 118, universe: 'mcu', weight: 0.4, color: C.sky, chrono: 90, why: 'Introduces Ghost, who returns in Thunderbolts* and Doomsday.' }),
  t({ id: 'captain-marvel', phase: 3, name: 'Captain Marvel', kind: 'film', year: 2019, runtimeMin: 124, universe: 'mcu', weight: 0.4, color: C.blue, chrono: 20, why: 'Carol Danvers, the Skrulls and young Nick Fury.' }),
  t({ id: 'avengers-endgame', phase: 3, name: 'Avengers: Endgame', kind: 'film', year: 2019, runtimeMin: 181, universe: 'mcu', weight: 1, color: C.ink, chrono: 94, why: 'Tony’s sacrifice and Steve’s ending. The emotional set-up for everything since.' }),
  t({ id: 'spider-man-far-from-home', phase: 3, name: 'Spider-Man: Far From Home', kind: 'film', year: 2019, runtimeMin: 129, universe: 'mcu', weight: 0.3, color: C.red, chrono: 96, why: 'The world after Tony. Mysterio sells a fake multiverse.' }),
  // ── Phase 4 ──
  t({ id: 'black-widow', phase: 4, name: 'Black Widow', kind: 'film', year: 2021, runtimeMin: 134, universe: 'mcu', weight: 0.6, color: C.ink, chrono: 87, why: 'Introduces Yelena and Red Guardian, the heart of the Thunderbolts.' }),
  t({ id: 'shang-chi', phase: 4, name: 'Shang-Chi and the Legend of the Ten Rings', kind: 'film', year: 2021, runtimeMin: 132, universe: 'mcu', weight: 0.6, color: C.orange, chrono: 101, why: 'Shang-Chi is confirmed for Doomsday.' }),
  t({ id: 'eternals', phase: 4, name: 'Eternals', kind: 'film', year: 2021, runtimeMin: 157, universe: 'mcu', weight: 0.2, color: C.yellow, chrono: 103, why: 'Celestials, and the frozen giant that becomes Celestial Island.' }),
  t({ id: 'spider-man-no-way-home', phase: 4, name: 'Spider-Man: No Way Home', kind: 'film', year: 2021, runtimeMin: 148, universe: 'mcu', weight: 0.6, color: C.red, chrono: 104, why: 'The multiverse cracks open with villains and Spider-Men from other universes.' }),
  t({ id: 'doctor-strange-multiverse-of-madness', phase: 4, name: 'Doctor Strange in the Multiverse of Madness', kind: 'film', year: 2022, runtimeMin: 126, universe: 'mcu', weight: 0.7, color: C.purple, chrono: 106, why: 'Names the Incursion, the event Doomsday is about, and cameos Patrick Stewart’s Professor X.' }),
  t({ id: 'thor-love-and-thunder', phase: 4, name: 'Thor: Love and Thunder', kind: 'film', year: 2022, runtimeMin: 119, universe: 'mcu', weight: 0.4, color: C.violet, chrono: 107, why: 'Where Thor’s story stands before Doomsday.' }),
  t({ id: 'black-panther-wakanda-forever', phase: 4, name: 'Black Panther: Wakanda Forever', kind: 'film', year: 2022, runtimeMin: 161, universe: 'mcu', weight: 0.8, color: C.purple, chrono: 109, why: 'Shuri becomes Black Panther and Namor arrives. Both are in Doomsday.' }),
  // ── Phase 5 ──
  t({ id: 'ant-man-quantumania', phase: 5, name: 'Ant-Man and the Wasp: Quantumania', kind: 'film', year: 2023, runtimeMin: 125, universe: 'mcu', weight: 0.6, color: C.sky, chrono: 112, why: 'Scott and Cassie in the Quantum Realm, a set-up for the multiverse war.' }),
  t({ id: 'guardians-of-the-galaxy-vol-3', phase: 5, name: 'Guardians of the Galaxy Vol. 3', kind: 'film', year: 2023, runtimeMin: 150, universe: 'mcu', weight: 0.2, color: C.orange, chrono: 111, why: 'A goodbye to this Guardians line-up.' }),
  t({ id: 'the-marvels', phase: 5, name: 'The Marvels', kind: 'film', year: 2023, runtimeMin: 105, universe: 'mcu', weight: 0.5, color: C.yellow, chrono: 113, why: 'Its mid-credits scene opens a door to the X-Men universe.' }),
  t({ id: 'deadpool-and-wolverine', phase: 5, name: 'Deadpool & Wolverine', kind: 'film', year: 2024, runtimeMin: 128, universe: 'mcu', weight: 0.9, color: C.red, chrono: 114, why: 'The TVA, the Void and Gambit (Channing Tatum, confirmed for Doomsday).' }),
  t({ id: 'captain-america-brave-new-world', phase: 5, name: 'Captain America: Brave New World', kind: 'film', year: 2025, runtimeMin: 118, universe: 'mcu', weight: 0.9, color: C.blue, chrono: 115, why: 'Sam Wilson as Captain America, and the new Falcon.' }),
  t({ id: 'thunderbolts', phase: 5, name: 'Thunderbolts*', kind: 'film', year: 2025, runtimeMin: 127, universe: 'mcu', weight: 1, color: C.yellow, chrono: 116, why: 'Yelena, Bucky, Red Guardian, US Agent, Ghost and Sentry. A whole Doomsday team.' }),
  // ── Phase 6 ──
  t({ id: 'fantastic-four-first-steps', phase: 6, name: 'The Fantastic Four: First Steps', kind: 'film', year: 2025, runtimeMin: 115, universe: 'mcu', weight: 1, color: C.sky, chrono: 117, why: 'Marvel’s First Family, from another universe and headed for Doomsday.' }),
  t({ id: 'spider-man-brand-new-day', phase: 6, name: 'Spider-Man: Brand New Day', kind: 'film', year: 2026, runtimeMin: 132, universe: 'mcu', weight: 0.9, color: C.red, chrono: 118, why: 'The last MCU film before Doomsday.' }),

  // ── Disney+ series & specials ──
  t({ id: 'wandavision', phase: 4, name: 'WandaVision', kind: 'series', year: 2021, runtimeMin: 350, episodes: 9, universe: 'mcu', weight: 0.4, color: C.violet, chrono: 98, why: 'Wanda’s grief, the Darkhold and Agatha.' }),
  t({ id: 'falcon-and-the-winter-soldier', phase: 4, name: 'The Falcon and the Winter Soldier', kind: 'series', year: 2021, runtimeMin: 300, episodes: 6, universe: 'mcu', weight: 0.9, color: C.blue, chrono: 99, why: 'Sam takes up the shield, Bucky heals, and US Agent arrives.' }),
  t({ id: 'loki-s1', phase: 4, name: 'Loki (Season 1)', kind: 'series', year: 2021, runtimeMin: 290, episodes: 6, universe: 'mcu', weight: 1, color: C.green, chrono: 95, why: 'The TVA, variants, and how the multiverse broke open.' }),
  t({ id: 'what-if-s1', phase: 4, name: 'What If…? (Season 1)', kind: 'series', year: 2021, runtimeMin: 300, episodes: 9, universe: 'mcu', weight: 0.5, color: C.purple, chrono: 200, why: 'A primer on alternate universes, narrated by the Watcher.' }),
  t({ id: 'hawkeye', phase: 4, name: 'Hawkeye', kind: 'series', year: 2021, runtimeMin: 300, episodes: 6, universe: 'mcu', weight: 0.2, color: C.purple, chrono: 105, why: 'Kate Bishop, and Yelena after Black Widow.' }),
  t({ id: 'ms-marvel', phase: 4, name: 'Ms. Marvel', kind: 'series', year: 2022, runtimeMin: 280, episodes: 6, universe: 'mcu', weight: 0.4, color: C.red, chrono: 108, why: 'Kamala Khan, who is rumoured to return.' }),
  t({ id: 'secret-invasion', phase: 5, name: 'Secret Invasion', kind: 'series', year: 2023, runtimeMin: 260, episodes: 6, universe: 'mcu', weight: 0.3, color: C.green, chrono: 110, why: 'Skrulls on Earth and Nick Fury’s reckoning.' }),
  t({ id: 'loki-s2', phase: 5, name: 'Loki (Season 2)', kind: 'series', year: 2023, runtimeMin: 300, episodes: 6, universe: 'mcu', weight: 1, color: C.green, chrono: 113.5, why: 'Loki’s fate at the heart of the multiverse.' }),
  t({ id: 'agatha-all-along', phase: 5, name: 'Agatha All Along', kind: 'series', year: 2024, runtimeMin: 330, episodes: 9, universe: 'mcu', weight: 0.2, color: C.purple, chrono: 114.5, why: 'Westview’s witch walks the Witches’ Road.' }),
  t({ id: 'visionquest', phase: 6, name: 'VisionQuest', kind: 'series', year: 2026, runtimeMin: 360, episodes: 8, universe: 'mcu', weight: 0.4, color: C.violet, chrono: 119, why: 'The latest Disney+ series before Doomsday.' }),

  // ── More Disney+ (Phases 4–6) ──
  t({ id: 'moon-knight', phase: 4, name: 'Moon Knight', kind: 'series', year: 2022, runtimeMin: 300, episodes: 6, universe: 'mcu', weight: 0.1, color: C.ink, chrono: 107.5, why: 'Marc Spector and the Egyptian gods. Self-contained, but it widens the MCU’s mystical side.' }),
  t({ id: 'she-hulk', phase: 4, name: 'She-Hulk: Attorney at Law', kind: 'series', year: 2022, runtimeMin: 270, episodes: 9, universe: 'mcu', weight: 0.15, color: C.green, chrono: 108.5, why: 'Jennifer Walters, the Abomination’s return and Daredevil’s first MCU appearance as Matt Murdock.' }),
  t({ id: 'werewolf-by-night', phase: 4, name: 'Werewolf by Night', kind: 'special', year: 2022, runtimeMin: 53, universe: 'mcu', weight: 0.05, color: C.ink, chrono: 109.5, why: 'A black-and-white monster special that introduces Elsa Bloodstone and Man-Thing.' }),
  t({ id: 'guardians-holiday-special', phase: 4, name: 'The Guardians of the Galaxy Holiday Special', kind: 'special', year: 2022, runtimeMin: 44, universe: 'mcu', weight: 0.05, color: C.orange, chrono: 110.5, why: 'Mantis learns she is Peter Quill’s half-sister. A light, optional watch.' }),
  t({ id: 'echo', phase: 5, name: 'Echo', kind: 'series', year: 2024, runtimeMin: 150, episodes: 5, universe: 'mcu', weight: 0.2, color: C.red, chrono: 112.5, why: 'Maya Lopez and the Kingpin. It feeds straight into Daredevil: Born Again.' }),
  t({ id: 'x-men-97', phase: 5, name: 'X-Men ’97', kind: 'series', year: 2024, runtimeMin: 300, episodes: 10, universe: 'mcu', weight: 0.5, color: C.yellow, chrono: 400, why: 'Marvel Animation’s revival of the 1990s X-Men cartoon, and the closest thing Marvel Studios has made to its own X-Men team.' }),
  t({ id: 'your-friendly-neighborhood-spider-man', phase: 5, name: 'Your Friendly Neighborhood Spider-Man', kind: 'series', year: 2025, runtimeMin: 270, episodes: 10, universe: 'mcu', weight: 0.1, color: C.red, chrono: 116.5, why: 'An animated, younger Peter Parker in Norman Osborn’s New York.' }),
  t({ id: 'daredevil-born-again-s1', phase: 5, name: 'Daredevil: Born Again (Season 1)', kind: 'series', year: 2025, runtimeMin: 520, episodes: 9, universe: 'mcu', weight: 0.3, color: C.red, chrono: 115.5, why: 'Matt Murdock and Wilson Fisk go to war, with Fisk now aiming at City Hall.' }),
  t({ id: 'ironheart', phase: 6, name: 'Ironheart', kind: 'series', year: 2025, runtimeMin: 300, episodes: 6, universe: 'mcu', weight: 0.1, color: C.red, chrono: 117.5, why: 'Riri Williams builds her own Iron Man-style suit. A look at Tony Stark’s legacy.' }),
  t({ id: 'eyes-of-wakanda', phase: 6, name: 'Eyes of Wakanda', kind: 'series', year: 2025, runtimeMin: 130, episodes: 4, universe: 'mcu', weight: 0.1, color: C.purple, chrono: 5, why: 'Animated tales of Wakanda’s Hatut Zeraze spies, spanning thousands of years.' }),
  t({ id: 'wonder-man', phase: 6, name: 'Wonder Man', kind: 'series', year: 2026, runtimeMin: 330, episodes: 8, universe: 'mcu', weight: 0.2, color: C.sky, chrono: 118.5, why: 'Simon Williams, an actor with ionic powers, in a Hollywood satire that revisits Trevor Slattery.' }),
  t({ id: 'daredevil-born-again-s2', phase: 6, name: 'Daredevil: Born Again (Season 2)', kind: 'series', year: 2026, runtimeMin: 400, episodes: 8, universe: 'mcu', weight: 0.3, color: C.red, chrono: 119.2, why: 'The Murdock–Fisk fight continues. Street-level Marvel on the road to Doomsday.' }),

  // ── Fox X-Men & Marvel films from other studios ──
  t({ id: 'x-men', name: 'X-Men', kind: 'film', year: 2000, runtimeMin: 104, universe: 'fox', weight: 0.8, color: C.yellow, chrono: 300, why: 'Xavier, Magneto, Cyclops and Mystique. Stewart, McKellen, Marsden and Romijn all return in Doomsday. On Disney+’s official “before Doomsday” list.' }),
  t({ id: 'x2', name: 'X2', kind: 'film', year: 2003, runtimeMin: 134, universe: 'fox', weight: 0.8, color: C.yellow, chrono: 301, why: 'Alan Cumming’s Nightcrawler, confirmed for Doomsday. On Disney+’s official “before Doomsday” list.' }),
  t({ id: 'x-men-the-last-stand', name: 'X-Men: The Last Stand', kind: 'film', year: 2006, runtimeMin: 104, universe: 'fox', weight: 0.75, color: C.yellow, chrono: 302, why: 'Kelsey Grammer’s Beast, who is back for Doomsday.' }),
  t({ id: 'x-men-days-of-future-past', name: 'X-Men: Days of Future Past', kind: 'film', year: 2014, runtimeMin: 132, universe: 'fox', weight: 0.8, color: C.yellow, chrono: 303, why: 'Time travel and both X-Men casts. The closest thing to a multiverse primer.' }),
  t({ id: 'x-men-first-class', name: 'X-Men: First Class', kind: 'film', year: 2011, runtimeMin: 132, universe: 'fox', weight: 0.6, color: C.yellow, chrono: 295, why: 'Young Charles Xavier and Erik Lehnsherr in 1962. How the friendship and the war between them began. Recommended by marvelwatchlist.' }),
  t({ id: 'x-men-origins-wolverine', name: 'X-Men Origins: Wolverine', kind: 'film', year: 2009, runtimeMin: 107, universe: 'fox', weight: 0.2, color: C.orange, chrono: 296, why: 'Logan and Victor Creed’s history, plus the Wade Wilson that Deadpool & Wolverine jokes about.' }),
  t({ id: 'the-wolverine', name: 'The Wolverine', kind: 'film', year: 2013, runtimeMin: 126, universe: 'fox', weight: 0.2, color: C.orange, chrono: 302.5, why: 'Logan in Japan. Its mid-credits scene sets up Days of Future Past.' }),
  t({ id: 'x-men-apocalypse', name: 'X-Men: Apocalypse', kind: 'film', year: 2016, runtimeMin: 144, universe: 'fox', weight: 0.3, color: C.yellow, chrono: 304, why: 'The young X-Men assemble, including Nightcrawler, against the first mutant, En Sabah Nur.' }),
  t({ id: 'dark-phoenix', name: 'Dark Phoenix', kind: 'film', year: 2019, runtimeMin: 113, universe: 'fox', weight: 0.3, color: C.red, chrono: 305, why: 'Jean Grey’s power spirals out of control. The final film of the Fox X-Men era.' }),
  t({ id: 'deadpool', name: 'Deadpool', kind: 'film', year: 2016, runtimeMin: 108, universe: 'fox', weight: 0.5, color: C.red, chrono: 306, why: 'Wade Wilson’s origin and the fourth-wall humour Deadpool & Wolverine builds on.' }),
  t({ id: 'logan', name: 'Logan', kind: 'film', year: 2017, runtimeMin: 137, universe: 'fox', weight: 0.6, color: C.ink, chrono: 307, why: 'Wolverine’s farewell. Deadpool & Wolverine opens by digging up this Logan’s grave.' }),
  t({ id: 'deadpool-2', name: 'Deadpool 2', kind: 'film', year: 2018, runtimeMin: 119, universe: 'fox', weight: 0.4, color: C.red, chrono: 308, why: 'Cable, X-Force and a time-travel fix that Deadpool & Wolverine later reverses.' }),
  // ── Sony Spider-Man films that No Way Home brought back ──
  t({ id: 'spider-man-2002', name: 'Spider-Man', kind: 'film', year: 2002, runtimeMin: 121, universe: 'sony', weight: 0.4, color: C.red, chrono: 320, why: 'Tobey Maguire’s Peter Parker and Willem Dafoe’s Green Goblin, both back in No Way Home.' }),
  t({ id: 'spider-man-2', name: 'Spider-Man 2', kind: 'film', year: 2004, runtimeMin: 127, universe: 'sony', weight: 0.3, color: C.blue, chrono: 321, why: 'Alfred Molina’s Doctor Octopus, who returns in No Way Home.' }),
  t({ id: 'spider-man-3', name: 'Spider-Man 3', kind: 'film', year: 2007, runtimeMin: 139, universe: 'sony', weight: 0.3, color: C.ink, chrono: 322, why: 'Sandman (Thomas Haden Church), who comes back in No Way Home.' }),
  t({ id: 'the-amazing-spider-man', name: 'The Amazing Spider-Man', kind: 'film', year: 2012, runtimeMin: 136, universe: 'sony', weight: 0.3, color: C.red, chrono: 325, why: 'Andrew Garfield’s Peter Parker and Rhys Ifans’ Lizard, both back in No Way Home.' }),
  t({ id: 'the-amazing-spider-man-2', name: 'The Amazing Spider-Man 2', kind: 'film', year: 2014, runtimeMin: 142, universe: 'sony', weight: 0.4, color: C.sky, chrono: 326, why: 'Jamie Foxx’s Electro and the loss of Gwen Stacy, which gives No Way Home its emotional payoff.' }),
]

export const TITLE_BY_ID = new Map(TITLES.map((x) => [x.id, x]))

export type TrackId = 'speedrun' | 'essentials' | 'deep-dive' | 'multiverse' | 'legacy'

export interface Track {
  id: TrackId
  name: string
  level: string
  color: string
  blurb: string
  brief: string
  icon: 'stopwatch' | 'star' | 'layers' | 'rings' | 'users'
  titleIds: string[]
  /** Titles marked optional inside this track. */
  optional?: string[]
}

const byRelease = (ids: string[]) =>
  [...ids].sort((a, b) => {
    const A = TITLE_BY_ID.get(a)!, B = TITLE_BY_ID.get(b)!
    return A.year - B.year || TITLES.indexOf(A) - TITLES.indexOf(B)
  })

export const TRACKS: Track[] = [
  {
    id: 'speedrun', name: 'Speedrun', level: 'Casual', color: '#FFD23F', icon: 'stopwatch',
    blurb: 'Only the titles Doomsday leans on hardest, starting with X-Men and X2 as on Disney+’s official list. Perfect for a last-minute cram.',
    brief: 'The bare minimum to follow who’s who and why the multiverse is collapsing.',
    titleIds: byRelease(['x-men', 'x2', 'avengers-infinity-war', 'avengers-endgame', 'loki-s1', 'loki-s2', 'deadpool-and-wolverine', 'captain-america-brave-new-world', 'thunderbolts', 'fantastic-four-first-steps', 'spider-man-brand-new-day']),
  },
  {
    id: 'essentials', name: 'Essentials', level: 'Fan', color: '#4FC3F7', icon: 'star',
    blurb: 'The main road through the Infinity and Multiverse Sagas.',
    brief: 'Every title that sets up Doomsday characters: the Avengers, the Thunderbolts, Wakanda, the Fantastic Four and the Fox X-Men (the original actors are in the Doomsday cast).',
    titleIds: byRelease(['x-men', 'x2', 'x-men-the-last-stand', 'x-men-first-class', 'x-men-days-of-future-past', 'logan', 'spider-man-no-way-home', 'doctor-strange-multiverse-of-madness', 'captain-america-the-first-avenger', 'the-avengers', 'captain-america-the-winter-soldier', 'ant-man', 'captain-america-civil-war', 'thor-ragnarok', 'black-panther', 'avengers-infinity-war', 'avengers-endgame', 'black-widow', 'falcon-and-the-winter-soldier', 'loki-s1', 'shang-chi', 'black-panther-wakanda-forever', 'loki-s2', 'ant-man-quantumania', 'deadpool-and-wolverine', 'captain-america-brave-new-world', 'thunderbolts', 'fantastic-four-first-steps', 'spider-man-brand-new-day']),
    optional: ['x-men-first-class', 'logan'],
  },
  {
    id: 'deep-dive', name: 'Deep Dive', level: 'True Believer', color: '#FF8A3D', icon: 'layers',
    blurb: 'Every MCU film and the key Disney+ series, in release order.',
    brief: 'The complete saga from Iron Man (2008) to the latest Disney+ series. No skips.',
    titleIds: byRelease(TITLES.filter((x) => x.universe === 'mcu').map((x) => x.id)),
    optional: ['eternals', 'guardians-of-the-galaxy-vol-3', 'agatha-all-along', 'hawkeye', 'moon-knight', 'she-hulk', 'werewolf-by-night', 'guardians-holiday-special', 'echo', 'ironheart', 'eyes-of-wakanda', 'your-friendly-neighborhood-spider-man', 'x-men-97'],
  },
  {
    id: 'multiverse', name: 'Multiverse', level: 'Plot Nerd', color: '#B388FF', icon: 'rings',
    blurb: 'Variants, Incursions and the Fox X-Men. Built for the plot Doomsday is about.',
    brief: 'Doomsday brings heroes from three universes together. This track covers all three.',
    titleIds: byRelease(['x-men-first-class', 'x-men', 'x2', 'x-men-the-last-stand', 'x-men-days-of-future-past', 'logan', 'avengers-infinity-war', 'avengers-endgame', 'loki-s1', 'what-if-s1', 'spider-man-no-way-home', 'doctor-strange-multiverse-of-madness', 'the-marvels', 'loki-s2', 'deadpool-and-wolverine', 'fantastic-four-first-steps']),
  },
  {
    id: 'legacy', name: 'Legacy Universes', level: 'Multiverse Hopper', color: '#FF6F61', icon: 'users',
    blurb: 'Every Fox X-Men and Deadpool film, plus the Sony Spider-Men. The heroes Doomsday is bringing back.',
    brief: 'Before the MCU had mutants, Fox did. This track covers the X-Men saga, Deadpool, Logan and the Sony Spider-Man films that No Way Home pulled into the multiverse.',
    titleIds: byRelease([...TITLES.filter((x) => x.universe !== 'mcu').map((x) => x.id), 'x-men-97']),
    optional: ['x-men-origins-wolverine', 'the-wolverine', 'dark-phoenix', 'spider-man-3'],
  },
]

export const TRACK_BY_ID = new Map(TRACKS.map((x) => [x.id, x]))

export function trackMinutes(track: Track) {
  return track.titleIds.reduce((m, id) => m + (TITLE_BY_ID.get(id)?.runtimeMin ?? 0), 0)
}

/** Doomsday release. Some markets open a day early; adjust per region closer to the date. */
export const RELEASE_DATES: Record<string, string> = { '*': '2026-12-18T00:00:00' }
export function releaseDateFor(country?: string | null) {
  return RELEASE_DATES[country ?? ''] ?? RELEASE_DATES['*']
}
