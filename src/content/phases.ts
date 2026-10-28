/**
 * The MCU roadmap: Marvel Studios' official release Phases, grouped into Sagas.
 * Titles are pulled from the catalogue by `phase`, so adding a title there places it here.
 */
export interface PhaseInfo {
  phase: 1 | 2 | 3 | 4 | 5 | 6
  saga: 'infinity' | 'multiverse'
  name: string
  years: string
  color: string
  tagline: string
  summary: string
  /** Big story beats. Light spoilers. */
  beats: string[]
  /** What this phase hands to the next one. */
  leadsTo: string
}

export const SAGAS = {
  infinity: { name: 'The Infinity Saga', years: '2008–2019', blurb: 'Six Infinity Stones, one Mad Titan, and the team that assembled to stop him.' },
  multiverse: { name: 'The Multiverse Saga', years: '2021–2027', blurb: 'Variants, Incursions and a new threat that ends with Doctor Doom and Avengers: Secret Wars.' },
} as const

export const PHASES: PhaseInfo[] = [
  {
    phase: 1, saga: 'infinity', name: 'Avengers Assemble', years: '2008–2012', color: '#C8102E',
    tagline: 'A billionaire, a god, a soldier and a monster walk into New York.',
    summary: 'Six films build the heroes one by one, then bring them together. Nick Fury’s “Avengers Initiative” goes from a post-credits tease to a movie event.',
    beats: [
      'Iron Man launches the universe, and Tony Stark announces himself to the world.',
      'The Tesseract (the Space Stone) turns up across Captain America and Thor.',
      'Loki leads a Chitauri invasion of New York and the Avengers form to stop him.',
      'A mid-credits scene in The Avengers shows Thanos for the first time.',
    ],
    leadsTo: 'The world now knows aliens and gods exist. Phase 2 is about the fallout.',
  },
  {
    phase: 2, saga: 'infinity', name: 'The Fallout', years: '2013–2015', color: '#1E5AA8',
    tagline: 'After New York, nobody feels safe. Not even S.H.I.E.L.D.',
    summary: 'Heroes deal with trauma and betrayal. The cosmic side of the universe opens up, and the Infinity Stones start to matter.',
    beats: [
      'Iron Man 3 shows Tony struggling after New York, and swaps the Mandarin for a twist.',
      'The Winter Soldier exposes HYDRA inside S.H.I.E.L.D. and takes the agency down.',
      'Guardians of the Galaxy introduces the cosmos, the Power Stone and Thanos’s plans.',
      'Age of Ultron creates Vision and the Maximoffs, and Ant-Man opens up the Quantum Realm.',
    ],
    leadsTo: 'The Avengers are broken in spirit. Phase 3 breaks them for real.',
  },
  {
    phase: 3, saga: 'infinity', name: 'Civil War to Endgame', years: '2016–2019', color: '#6A1B9A',
    tagline: 'The Avengers split, the Titan arrives, and the Snap changes everything.',
    summary: 'The biggest phase of the MCU: eleven films that add Spider-Man, Black Panther, Doctor Strange and Captain Marvel, then pay off a decade of story.',
    beats: [
      'Civil War splits the Avengers over the Sokovia Accords.',
      'Doctor Strange adds magic and the Time Stone; Black Panther reveals Wakanda.',
      'Infinity War ends with Thanos snapping half of all life away.',
      'Endgame undoes the Snap, and Tony Stark and Steve Rogers both get their endings.',
    ],
    leadsTo: 'The Infinity Saga is over. With the old guard gone, a new generation and the multiverse take over.',
  },
  {
    phase: 4, saga: 'multiverse', name: 'The Multiverse Opens', years: '2021–2022', color: '#2E7D32',
    tagline: 'Marvel goes to Disney+, and reality cracks.',
    summary: 'The first phase to mix films and streaming series. It mourns the Avengers, introduces new heroes and finishes by breaking the multiverse open.',
    beats: [
      'WandaVision starts the Multiverse Saga, and Loki’s season 1 finale introduces Kang’s variant.',
      'Shang-Chi, Eternals and Black Widow bring in new heroes, a new Celestial threat and Yelena.',
      'No Way Home pulls Spider-Men and villains from other universes into the MCU.',
      'Multiverse of Madness names the Incursion, and Wakanda Forever passes the Panther mantle to Shuri.',
    ],
    leadsTo: 'The multiverse is open and there is no closing it. Phase 5 goes looking for the villain behind it.',
  },
  {
    phase: 5, saga: 'multiverse', name: 'The Multiverse War', years: '2023–2025', color: '#FF8A3D',
    tagline: 'Kang arrives, Kang leaves, and the TVA gets rebuilt.',
    summary: 'A messy, ambitious phase: the Kang storyline is cut short, the X-Men and Deadpool arrive, and the Thunderbolts quietly turn into the next Avengers.',
    beats: [
      'Quantumania introduces Kang the Conqueror. Loki season 2 reshapes the TVA and the multiverse.',
      'Deadpool & Wolverine brings Fox’s Wolverine, and the TVA, into the MCU.',
      'Brave New World puts Sam Wilson in the shield; Thunderbolts* assembles a team of ex-villains.',
      'Marvel drops Kang as the big bad and shifts the saga to Doctor Doom.',
    ],
    leadsTo: 'New teams are in place, and the saga’s real villain is about to be revealed.',
  },
  {
    phase: 6, saga: 'multiverse', name: 'Doomsday', years: '2025–2027', color: '#FFD23F',
    tagline: 'The Fantastic Four arrive and the road runs into Doctor Doom.',
    summary: 'The last stretch of the Multiverse Saga: new street-level and cosmic stories, Spider-Man’s next chapter, then two Avengers films back to back.',
    beats: [
      'The Fantastic Four: First Steps brings Marvel’s First Family into the MCU from another universe.',
      'Spider-Man: Brand New Day is the last Spider-Man film before Doomsday.',
      'Avengers: Doomsday (December 18, 2026) brings heroes from three universes together against Doctor Doom.',
      'Avengers: Secret Wars (December 17, 2027) ends the saga.',
    ],
    leadsTo: 'Secret Wars closes the Multiverse Saga. What comes after it is unannounced.',
  },
]

/** Films still to come. Only dates Marvel has announced. */
export const ROAD_AHEAD = [
  { id: 'doomsday', name: 'Avengers: Doomsday', date: 'December 18, 2026', note: 'Heroes from three universes face Doctor Doom (Robert Downey Jr.). Directed by Anthony and Joe Russo.' },
  { id: 'secret-wars', name: 'Avengers: Secret Wars', date: 'December 17, 2027', note: 'Closes the Multiverse Saga. Also from the Russo brothers.' },
] as const
