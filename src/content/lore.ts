/**
 * "Know your MCU": the questions every fan gets asked in the cinema queue.
 * Keep answers short and factual. `spoiler` is the level of what the answer gives away
 * (same scale as the quiz bank: 0 none · 1 mid-film detail · 2 major twist/ending),
 * and `spoils` names the title so readers can decide before they reveal it.
 * "Where are they now" answers describe the last on-screen appearance plus what Marvel has announced.
 */
export type LoreCategory = 'basics' | 'characters' | 'where-now' | 'multiverse' | 'doomsday'
export type LoreStatus = 'confirmed' | 'open'

export interface LoreItem {
  id: string
  category: LoreCategory
  q: string
  /** Paragraphs. */
  a: string[]
  spoiler: 0 | 1 | 2
  spoils?: string
  /** Where "open" means Marvel hasn't said, so this is the honest answer rather than a guess. */
  status?: LoreStatus
  /** Catalogue ids worth watching to understand the answer. */
  titles?: string[]
}

export const LORE_CATEGORIES: { id: LoreCategory; label: string; blurb: string; color: string }[] = [
  { id: 'basics', label: 'THE BASICS', blurb: 'How the MCU fits together', color: '#FFD23F' },
  { id: 'characters', label: 'WHO IS…?', blurb: 'The names people keep dropping', color: '#4FC3F7' },
  { id: 'where-now', label: 'WHERE ARE THEY NOW?', blurb: 'Last seen, and what is next', color: '#FF8A3D' },
  { id: 'multiverse', label: 'MULTIVERSE 101', blurb: 'Variants, TVA, Incursions', color: '#B388FF' },
  { id: 'doomsday', label: 'DOOMSDAY', blurb: 'What we know about the film', color: '#C8102E' },
]

export const LORE: LoreItem[] = [
  // ── Basics ──
  {
    id: 'what-is-the-mcu', category: 'basics', spoiler: 0,
    q: 'What is the MCU?',
    a: ['The Marvel Cinematic Universe is the shared world of Marvel Studios films and Disney+ series, starting with Iron Man in 2008. Characters and events carry over from one title to the next, which is why Doomsday has a homework list.', 'Kevin Feige, president of Marvel Studios, has produced it from the start.'],
    titles: ['iron-man'],
  },
  {
    id: 'sagas', category: 'basics', spoiler: 0,
    q: 'What are the Infinity Saga and the Multiverse Saga?',
    a: ['Marvel groups its films into Phases, and Phases into Sagas. The Infinity Saga is Phases 1–3 (2008–2019), ending with Avengers: Endgame. The Multiverse Saga is Phases 4–6 (2021–2027), which ends with Avengers: Secret Wars.', 'Avengers: Doomsday (Dec 18, 2026) is the penultimate chapter.'],
  },
  {
    id: 'stan-lee', category: 'basics', spoiler: 0,
    q: 'Who is Stan Lee?',
    a: [
      'Stan Lee (1922–2018) was the writer, editor and face of Marvel Comics. With artists like Jack Kirby and Steve Ditko he co-created Spider-Man, the X-Men, Iron Man, the Hulk, Thor, the Fantastic Four, Doctor Strange, Black Panther and Daredevil, and he helped build Marvel’s idea of heroes with ordinary, human problems.',
      'He is famous in the films for cameos. He appeared in most Marvel movies from the early 2000s on, starting in the MCU with Iron Man (2008, mistaken for Hugh Hefner). His last filmed cameo is in Avengers: Endgame (2019), and Captain Marvel opens with a Marvel Studios logo tribute to him.',
    ],
    titles: ['iron-man', 'avengers-endgame', 'captain-marvel'],
  },
  {
    id: 'kevin-feige', category: 'basics', spoiler: 0,
    q: 'Who is Kevin Feige?',
    a: ['The president of Marvel Studios and the producer behind the MCU. If a Marvel project is being announced, he is usually the one on stage.'],
  },
  {
    id: 'russos', category: 'basics', spoiler: 0,
    q: 'Who are the Russo brothers?',
    a: ['Anthony and Joe Russo directed Captain America: The Winter Soldier, Civil War, Infinity War and Endgame. They return to direct Avengers: Doomsday and Avengers: Secret Wars, which is why Doomsday is being sold as the spiritual sequel to Infinity War.'],
    titles: ['captain-america-the-winter-soldier', 'captain-america-civil-war', 'avengers-infinity-war', 'avengers-endgame'],
  },
  {
    id: 'infinity-stones', category: 'basics', spoiler: 2, spoils: 'Infinity War',
    q: 'What are the Infinity Stones?',
    a: ['Six gems that each control an aspect of existence: Space (the Tesseract), Mind (Loki’s sceptre, later Vision), Reality (the Aether), Power (the Orb), Time (the Eye of Agamotto) and Soul (hidden on Vormir).', 'Thanos gathered all six in Infinity War and used them to wipe out half of all life. Endgame reverses it.'],
    titles: ['avengers-infinity-war', 'avengers-endgame'],
  },
  {
    id: 'the-snap', category: 'basics', spoiler: 2, spoils: 'Infinity War & Endgame',
    q: 'What was the Snap, and what is the Blip?',
    a: ['At the end of Infinity War, Thanos snaps his fingers and half of all living things turn to dust. Five years later the Avengers undo it in Endgame. Characters call the return “the Blip”, and it explains why some people are five years older than others in later titles.'],
    titles: ['avengers-infinity-war', 'avengers-endgame'],
  },
  {
    id: 'vibranium', category: 'basics', spoiler: 0,
    q: 'What is Wakanda and what is vibranium?',
    a: ['Wakanda is a hidden African nation and the most advanced country on Earth. Its power comes from vibranium, a rare metal that fell to Earth in a meteorite and absorbs vibrations and kinetic energy. Captain America’s shield is made of it.'],
    titles: ['black-panther', 'black-panther-wakanda-forever'],
  },
  {
    id: 'kree-skrulls', category: 'basics', spoiler: 1, spoils: 'Captain Marvel',
    q: 'Who are the Kree and the Skrulls?',
    a: ['Two alien civilisations who have been at war for centuries. The Kree are a militaristic empire (Ronan and Captain Marvel’s Starforce). The Skrulls are shape-shifters who, after losing their home, hide among humans. Captain Marvel sets up the conflict and Secret Invasion follows it up.'],
    titles: ['captain-marvel', 'secret-invasion'],
  },
  {
    id: 'celestials', category: 'basics', spoiler: 1, spoils: 'Eternals',
    q: 'What are the Celestials?',
    a: ['Cosmic beings so large that a sleeping one forms an island on Earth. Eternals reveals they seed planets with life, and that Earth’s own Celestial, Arishem, has been waiting to be “born” from it. They are among the most powerful beings in the MCU.'],
    titles: ['eternals'],
  },

  // ── Who is…? ──
  {
    id: 'doctor-doom', category: 'characters', spoiler: 0,
    q: 'Who is Doctor Doom? (His backstory)',
    a: [
      'Victor von Doom is one of Marvel’s greatest villains. He first appeared in Fantastic Four #5 (1962), created by Stan Lee and Jack Kirby. In the comics he is born in Latveria, a small fictional European country, to a Romani healer father and a mother, Cynthia, who dealt with demons. His mother’s death leaves him obsessed with proving himself and saving her soul.',
      'He becomes a prodigy in both science and sorcery. At university he meets Reed Richards, and the two become rivals. One of Victor’s experiments, a machine to reach his mother, backfires and scars his face. He blames Reed, is expelled, and eventually joins a monastery in Tibet, where he forges his iron armour and mask.',
      'He then takes control of Latveria and rules it as its king. He is a genius inventor, a powerful sorcerer, and a leader who genuinely believes the world would be better under his rule. In the MCU, Robert Downey Jr. plays him in Avengers: Doomsday.',
    ],
    titles: ['fantastic-four-first-steps'],
  },
  {
    id: 'rdj-doom', category: 'characters', spoiler: 0, status: 'open',
    q: 'Is Robert Downey Jr.’s Doom actually Tony Stark?',
    a: ['No. Marvel says he plays Victor von Doom, not Tony. Tony Stark died in Endgame and the MCU has not suggested Doom is a version of him. How Marvel explains the shared face, if it does, has not been revealed.'],
    titles: ['iron-man', 'avengers-endgame'],
  },
  {
    id: 'fantastic-four', category: 'characters', spoiler: 0,
    q: 'Who are the Fantastic Four?',
    a: ['Marvel’s “First Family”: Reed Richards (Mr. Fantastic, stretches), Sue Storm (Invisible Woman), Johnny Storm (the Human Torch) and Ben Grimm (the Thing). They gained powers from cosmic rays on a space flight. In The Fantastic Four: First Steps they are played by Pedro Pascal, Vanessa Kirby, Joseph Quinn and Ebon Moss-Bachrach and live in a retro-futuristic 1960s world known as Earth-828. They are from a different universe from the Avengers.'],
    titles: ['fantastic-four-first-steps'],
  },
  {
    id: 'galactus', category: 'characters', spoiler: 1, spoils: 'The Fantastic Four: First Steps',
    q: 'Who are Galactus and the Silver Surfer?',
    a: ['Galactus is a cosmic being who devours planets to survive, and the Silver Surfer (Shalla-Bal in First Steps) is his herald, who scouts worlds for him. First Steps is their MCU debut and sees the Four defend Earth-828 from them.'],
    titles: ['fantastic-four-first-steps'],
  },
  {
    id: 'xmen', category: 'characters', spoiler: 0,
    q: 'Who are the X-Men, and why are they in an MCU film?',
    a: ['Mutants are people born with powers because of a gene, and the X-Men are a team of them, led by Professor Charles Xavier. Fox owned the film rights until Disney bought Fox in 2019. Since then Marvel Studios has been able to use them.', 'Deadpool & Wolverine brought Hugh Jackman’s Wolverine into the MCU, and the Doomsday cast includes Patrick Stewart (Professor X), Ian McKellen (Magneto), James Marsden (Cyclops), Kelsey Grammer (Beast), Alan Cumming (Nightcrawler), Rebecca Romijn (Mystique) and Channing Tatum (Gambit).'],
    titles: ['x-men', 'x-men-days-of-future-past', 'deadpool-and-wolverine'],
  },
  {
    id: 'namor', category: 'characters', spoiler: 1, spoils: 'Wakanda Forever',
    q: 'Who is Namor?',
    a: ['The king of Talokan, an underwater civilisation in Black Panther: Wakanda Forever, played by Tenoch Huerta Mejía. In the comics he debuted in 1939, among the oldest Marvel characters, and is often called Marvel’s first mutant. He is in the Doomsday cast.'],
    titles: ['black-panther-wakanda-forever'],
  },
  {
    id: 'thunderbolts', category: 'characters', spoiler: 2, spoils: 'Thunderbolts*',
    q: 'Who are the Thunderbolts, and what are the “New Avengers”?',
    a: ['A team of misfits and ex-villains: Yelena Belova, Bucky Barnes, Red Guardian, Ghost, U.S. Agent and Bob (the Sentry). Thunderbolts* ends with the public learning of them as “the New Avengers”, which is why several of them are in the Doomsday cast.'],
    titles: ['thunderbolts', 'black-widow', 'falcon-and-the-winter-soldier'],
  },
  {
    id: 'sam-wilson', category: 'characters', spoiler: 1, spoils: 'The Falcon and the Winter Soldier',
    q: 'Why is Sam Wilson Captain America?',
    a: ['Steve Rogers handed Sam his shield at the end of Endgame. Sam struggled with it in The Falcon and the Winter Soldier before accepting the role, and Captain America: Brave New World is his first film as Cap.'],
    titles: ['avengers-endgame', 'falcon-and-the-winter-soldier', 'captain-america-brave-new-world'],
  },
  {
    id: 'watcher', category: 'characters', spoiler: 0,
    q: 'Who is the Watcher?',
    a: ['Uatu the Watcher is a cosmic being who observes the multiverse and never interferes. He narrates What If…? and has taken a more active role in that series by breaking his own rule.'],
    titles: ['what-if-s1'],
  },

  // ── Where are they now ──
  {
    id: 'where-strange', category: 'where-now', spoiler: 1, spoils: 'Multiverse of Madness', status: 'open',
    q: 'Where is Doctor Strange right now?',
    a: ['Last seen in Doctor Strange in the Multiverse of Madness (2022), where he stops Wanda Maximoff and ends the film with a third eye after using dark magic. In the mid-credits scene Clea tells him that his actions have caused an Incursion. He was not part of Marvel’s March 2025 Doomsday cast reveal and has not been confirmed since, so his Doomsday role is unannounced.', 'He also appears in Spider-Man: No Way Home, where his spell causes the multiverse to open.'],
    titles: ['doctor-strange-multiverse-of-madness', 'spider-man-no-way-home'],
  },
  {
    id: 'where-wanda', category: 'where-now', spoiler: 2, spoils: 'Multiverse of Madness', status: 'open',
    q: 'Where is Wanda Maximoff (Scarlet Witch)?',
    a: ['At the end of Multiverse of Madness she brings Mount Wundagore down on herself to destroy the Darkhold, and is presumed dead. The MCU has not said what actually happened to her.'],
    titles: ['wandavision', 'doctor-strange-multiverse-of-madness', 'agatha-all-along'],
  },
  {
    id: 'where-thor', category: 'where-now', spoiler: 1, spoils: 'Love and Thunder',
    q: 'Where is Thor right now?',
    a: ['After Thor: Love and Thunder (2022), Thor is raising Love, the daughter of the god-killer Gorr, and fighting alongside her. Chris Hemsworth is in the Doomsday cast.'],
    titles: ['thor-love-and-thunder'],
  },
  {
    id: 'where-loki', category: 'where-now', spoiler: 2, spoils: 'Loki season 2',
    q: 'Where is Loki?',
    a: ['At the end of Loki season 2, Loki takes on a new role at the centre of the multiverse, holding it together. Tom Hiddleston is in the Doomsday cast.'],
    titles: ['loki-s1', 'loki-s2'],
  },
  {
    id: 'where-tony', category: 'where-now', spoiler: 2, spoils: 'Endgame',
    q: 'What happened to Tony Stark?',
    a: ['Tony dies in Avengers: Endgame after using the Infinity Stones to defeat Thanos. His legacy continues through Riri Williams in Ironheart and through Peter Parker. Robert Downey Jr. returns as Doctor Doom, not as Tony.'],
    titles: ['avengers-endgame', 'ironheart'],
  },
  {
    id: 'where-steve', category: 'where-now', spoiler: 2, spoils: 'Endgame',
    q: 'What happened to Steve Rogers (Captain America)?',
    a: ['At the end of Endgame, Steve returns the Stones and chooses to stay in the past to live with Peggy Carter, then returns as an old man and gives his shield to Sam Wilson. Chris Evans and Hayley Atwell are on the Doomsday cast list.'],
    titles: ['avengers-endgame'],
  },
  {
    id: 'where-spider-man', category: 'where-now', spoiler: 2, spoils: 'No Way Home',
    q: 'Where is Spider-Man right now?',
    a: ['At the end of No Way Home, Doctor Strange casts a spell that makes everyone forget Peter Parker, and Peter starts a new life alone. His next film is Spider-Man: Brand New Day (2026).'],
    titles: ['spider-man-no-way-home', 'spider-man-brand-new-day'],
  },
  {
    id: 'where-hulk', category: 'where-now', spoiler: 0, status: 'open',
    q: 'Where is Bruce Banner (the Hulk)?',
    a: ['Last seen in She-Hulk: Attorney at Law (2022). Banner is not on the confirmed Doomsday cast list, and Thaddeus Ross became the Red Hulk in Captain America: Brave New World.'],
    titles: ['she-hulk', 'captain-america-brave-new-world'],
  },
  {
    id: 'where-wolverine', category: 'where-now', spoiler: 2, spoils: 'Deadpool & Wolverine',
    q: 'Which Wolverine is in the MCU?',
    a: ['Hugh Jackman’s Logan, but a variant. The Logan of the 2017 film dies, and Deadpool & Wolverine opens by digging up his grave. The Wolverine who stars in it is a different version, from another universe, whom Deadpool recruits. Marvel has not said whether either joins Doomsday.'],
    titles: ['logan', 'deadpool-and-wolverine'],
  },

  // ── Multiverse ──
  {
    id: 'multiverse', category: 'multiverse', spoiler: 0,
    q: 'What is the multiverse?',
    a: ['A set of parallel universes, each with its own history. The main MCU timeline is officially Earth-199999. The multiverse is introduced in Loki and What If…?, becomes central after Spider-Man: No Way Home, and is the engine of the entire Multiverse Saga.'],
    titles: ['loki-s1', 'what-if-s1', 'spider-man-no-way-home'],
  },
  {
    id: 'variants', category: 'multiverse', spoiler: 0,
    q: 'What is a variant?',
    a: ['Someone from another timeline who is a version of a person you already know. A “Loki variant”, a “Peter variant” or a “Wade Wilson variant” are all the same person who made different choices. Doomsday’s premise is that variants will meet.'],
    titles: ['loki-s1'],
  },
  {
    id: 'tva', category: 'multiverse', spoiler: 1, spoils: 'Loki',
    q: 'What is the TVA?',
    a: ['The Time Variance Authority is a bureaucracy outside of time that monitors the “Sacred Timeline” and prunes anyone who threatens it. It is introduced in Loki, seen again in Loki season 2 and plays a major role in Deadpool & Wolverine.'],
    titles: ['loki-s1', 'loki-s2', 'deadpool-and-wolverine'],
  },
  {
    id: 'incursion', category: 'multiverse', spoiler: 1, spoils: 'Multiverse of Madness',
    q: 'What is an Incursion?',
    a: ['When two universes collide, both can be destroyed. The word is introduced in the mid-credits scene of Multiverse of Madness, and Doomsday is built around it.', 'The idea comes from Jonathan Hickman’s Avengers comics (2012–2015), which lead into the Secret Wars story that the final film is named after.'],
    titles: ['doctor-strange-multiverse-of-madness'],
  },
  {
    id: 'kang', category: 'multiverse', spoiler: 1, spoils: 'Quantumania',
    q: 'What happened to Kang?',
    a: ['Jonathan Majors played He Who Remains in Loki and Kang the Conqueror in Ant-Man and the Wasp: Quantumania, and Kang was meant to be the saga’s main villain. Marvel ended its work with Majors in December 2023 and later moved the saga’s focus to Doctor Doom.'],
    titles: ['loki-s1', 'ant-man-quantumania'],
  },
  {
    id: 'quantum-realm', category: 'multiverse', spoiler: 0,
    q: 'What is the Quantum Realm?',
    a: ['A dimension below the subatomic scale, discovered via Pym Particles in Ant-Man. Endgame uses it for time travel, and Quantumania takes the story there.'],
    titles: ['ant-man', 'avengers-endgame', 'ant-man-quantumania'],
  },

  // ── Doomsday ──
  {
    id: 'dd-date', category: 'doomsday', spoiler: 0,
    q: 'When is Avengers: Doomsday out?',
    a: ['December 18, 2026, in cinemas. Some countries release a day earlier, so check your local listings. Avengers: Secret Wars follows on December 17, 2027.'],
  },
  {
    id: 'dd-premise', category: 'doomsday', spoiler: 0,
    q: 'What is Avengers: Doomsday about?',
    a: ['Marvel’s official summary: “Beloved heroes from three distinct universes are set on a deadly collision course and face an existential threat unlike anything they’ve ever encountered.” The three universes are the main MCU, the Fox X-Men universe and the Fantastic Four’s Earth-828, and Doctor Doom is the villain.'],
  },
  {
    id: 'dd-cast', category: 'doomsday', spoiler: 0,
    q: 'Who is in the Doomsday cast?',
    a: [
      'Marvel has announced 31 cast members. Avengers: Tom Hiddleston, Anthony Mackie, Danny Ramirez, Chris Evans, Hayley Atwell, Chris Hemsworth, Paul Rudd and Sebastian Stan. X-Men: Patrick Stewart, Ian McKellen, James Marsden, Kelsey Grammer, Alan Cumming, Rebecca Romijn and Channing Tatum. Fantastic Four: Pedro Pascal, Vanessa Kirby, Joseph Quinn and Ebon Moss-Bachrach.',
      'Thunderbolts: David Harbour, Lewis Pullman, Florence Pugh, Hannah John-Kamen and Wyatt Russell. Wakanda: Winston Duke and Letitia Wright. Others: Tenoch Huerta Mejía (Namor), Mabel Cadena (Namora), Kathryn Newton (Cassie Lang) and Simu Liu (Shang-Chi). Robert Downey Jr. plays Doctor Doom.',
      'Marvel has said more casting is still unannounced, so this is not the final list.',
    ],
  },
  {
    id: 'dd-homework', category: 'doomsday', spoiler: 0,
    q: 'Do I really have to watch everything?',
    a: ['No. The Speedrun track is the short list, and it now opens with X-Men and X2, the same way Disney+’s official “before Doomsday” list does. Essentials is the main road and includes the X-Men films. For every Fox X-Men and Sony Spider-Man film, take the Legacy Universes track.'],
  },
  {
    id: 'dd-fox', category: 'doomsday', spoiler: 0,
    q: 'Which X-Men movies do I need before Doomsday?',
    a: [
      'Several X-Men actors are in the Doomsday cast: Patrick Stewart, Ian McKellen, James Marsden, Kelsey Grammer, Alan Cumming and Rebecca Romijn, plus Channing Tatum as Gambit. Disney+’s official 15-title list starts with X-Men (2000) and X2 (2003) for that reason, and marvelwatchlist also marks both as essential.',
      'Our picks, from most to least important: X-Men and X2 (essential); The Last Stand (Kelsey Grammer’s Beast) and Days of Future Past (the film that links the original and younger casts); then X-Men: First Class and Logan as optional. The Wolverine, Apocalypse, Dark Phoenix and Origins: Wolverine are only for completists.',
      'Deadpool & Wolverine is already on every list, and Deadpool 2 is a good warm-up for it.',
    ],
    titles: ['x-men', 'x2', 'x-men-the-last-stand', 'x-men-days-of-future-past', 'x-men-first-class', 'logan'],
  },
  {
    id: 'dd-xmen-timeline', category: 'doomsday', spoiler: 0, status: 'open',
    q: 'Which version of the X-Men is in Doomsday?',
    a: ['Marvel hasn’t said. The cast are the original Fox actors, and some outlets speculate the story sits after Days of Future Past, but that is a guess. It is also why Days of Future Past, which resets the timeline, is worth watching.'],
    titles: ['x-men-days-of-future-past'],
  },
  {
    id: 'dd-disney-list', category: 'doomsday', spoiler: 0,
    q: 'What is Disney+’s official “before Doomsday” list?',
    a: ['Disney+ named 15 titles: X-Men, X2, Captain America: The First Avenger, The Avengers, Infinity War, Endgame, Loki, Shang-Chi, Spider-Man: No Way Home, Wakanda Forever, Brave New World, Deadpool & Wolverine, Multiverse of Madness, Thunderbolts* and The Fantastic Four: First Steps. Our Essentials track covers all of them.'],
    titles: ['x-men', 'x2', 'loki-s1', 'shang-chi', 'spider-man-no-way-home', 'black-panther-wakanda-forever'],
  },
]
