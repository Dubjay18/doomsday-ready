import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Icon } from '../components/Icon'
import { Chip, cn } from '../components/comic'

export const Route = createFileRoute('/characters')({
  head: () => ({ meta: [{ title: 'Doomsday Trailer Characters · Doomsday Ready' }] }),
  component: CharactersPage,
})

type Character = {
  id: string
  name: string
  alias?: string
  actor: string
  universe: 'mcu' | 'fox' | 'fantastic-four'
  faction: string
  originStory: string
  firstAppearance: string
  greatestFeat: string
  otherFacts: string[]
  status?: 'confirmed'
}

const CHARACTERS: Character[] = [
  {
    id: 'doctor-doom',
    name: 'Doctor Doom',
    alias: 'Victor von Doom',
    actor: 'Robert Downey Jr.',
    universe: 'fantastic-four',
    faction: 'Latveria',
    originStory: 'Brilliant scientist and sorcerer from Latveria. Obsessed with power and order, he forged his armor and mask to become the ruler of Latveria.',
    firstAppearance: 'Fantastic Four #5 (July 1962)',
    greatestFeat: 'One of Marvel\'s most dangerous minds, mastering both science and sorcery to challenge cosmic powers.',
    otherFacts: ['Master of science and sorcery', 'Believes he alone can save reality', 'Confirmed for Avengers: Doomsday'],
    status: 'confirmed',
  },
  {
    id: 'mister-fantastic',
    name: 'Mister Fantastic',
    alias: 'Reed Richards',
    actor: 'Pedro Pascal',
    universe: 'fantastic-four',
    faction: 'Fantastic Four',
    originStory: 'Scientific genius whose body gained elastic properties after cosmic ray exposure on a space mission. From Earth-828.',
    firstAppearance: 'Fantastic Four #1 (November 1961)',
    greatestFeat: 'Solved multiversal equations and used his intellect to outmaneuver reality-threatening forces.',
    otherFacts: ['Leader of the Fantastic Four', 'From Earth-828', 'One of the smartest beings in the multiverse'],
    status: 'confirmed',
  },
  {
    id: 'invisible-woman',
    name: 'Invisible Woman',
    alias: 'Sue Storm',
    actor: 'Vanessa Kirby',
    universe: 'fantastic-four',
    faction: 'Fantastic Four',
    originStory: 'Gained invisibility and force field manipulation from cosmic rays. One of Marvel\'s most powerful heroes.',
    firstAppearance: 'Fantastic Four #1 (November 1961)',
    greatestFeat: 'Created force fields strong enough to contain universal threats.',
    otherFacts: ['Reed Richards\' wife', 'Incredibly powerful psionically', 'Heart of the Fantastic Four'],
    status: 'confirmed',
  },
  {
    id: 'human-torch',
    name: 'Human Torch',
    alias: 'Johnny Storm',
    universe: 'fantastic-four',
    faction: 'Fantastic Four',
    actor: 'Joseph Quinn',
    originStory: 'Sue\'s younger brother who can engulf himself in flames, fly, and reach nova temperatures.',
    firstAppearance: 'Fantastic Four #1 (November 1961)',
    greatestFeat: 'Achieved supernova-level heat output in battle against cosmic threats.',
    otherFacts: ['Hot-headed but loyal', 'Fastest flyer in the FF', 'Fearless to a fault'],
    status: 'confirmed',
  },
  {
    id: 'thing',
    name: 'The Thing',
    alias: 'Ben Grimm',
    actor: 'Ebon Moss-Bachrach',
    universe: 'fantastic-four',
    faction: 'Fantastic Four',
    originStory: 'Reed\'s best friend and pilot, transformed into a rock-like form with immense strength and durability.',
    firstAppearance: 'Fantastic Four #1 (November 1961)',
    greatestFeat: 'Tanked blows from planet-level threats through sheer grit and durability.',
    otherFacts: ['Soul of the team', 'Former test pilot', '"It\'s clobberin\' time!"'],
    status: 'confirmed',
  },
  {
    id: 'captain-america-steve',
    name: 'Captain America',
    alias: 'Steve Rogers',
    actor: 'Chris Evans',
    universe: 'mcu',
    faction: 'Avengers',
    originStory: 'Scrawny Brooklyn kid transformed by the Super Soldier Serum in WWII, frozen in ice for 70 years.',
    firstAppearance: 'Captain America Comics #1 (March 1941) / MCU: Captain America: The First Avenger (2011)',
    greatestFeat: 'Led the Avengers in Endgame to undo the Snap, wielding Mjolnir in battle against Thanos.',
    otherFacts: ['Symbol of hope', 'Wielder of Mjolnir', 'Returned to the past to live with Peggy Carter'],
    status: 'confirmed',
  },
  {
    id: 'captain-america-sam',
    name: 'Captain America',
    alias: 'Sam Wilson',
    actor: 'Anthony Mackie',
    universe: 'mcu',
    faction: 'Avengers',
    originStory: 'Pararescue veteran and Falcon who was entrusted with Steve Rogers\' shield to carry on the mantle.',
    firstAppearance: 'Captain America #117 (September 1969) / MCU: Captain America: The Winter Soldier (2014)',
    greatestFeat: 'Embraced the Captain America mantle and led in the fight to protect a divided world.',
    otherFacts: ['Uses vibranium wings', 'Close ally of Bucky Barnes', 'Now fully the new Captain America'],
    status: 'confirmed',
  },
  {
    id: 'thor',
    name: 'Thor Odinson',
    alias: 'God of Thunder',
    actor: 'Chris Hemsworth',
    universe: 'mcu',
    faction: 'Avengers',
    originStory: 'Crown prince of Asgard, banished to Earth to learn humility, became worthy of Mjolnir and protector of the Nine Realms.',
    firstAppearance: 'Journey into Mystery #83 (August 1962) / MCU: Thor (2011)',
    greatestFeat: 'Nearly killed Thanos in Infinity War with Stormbreaker after surviving immense odds.',
    otherFacts: ['King of Asgard', 'Wields Stormbreaker', 'Raising Love after Love and Thunder'],
    status: 'confirmed',
  },
  {
    id: 'loki',
    name: 'Loki Laufeyson',
    alias: 'God of Mischief',
    actor: 'Tom Hiddleston',
    universe: 'mcu',
    faction: 'Avengers (Variant)',
    originStory: 'Adopted son of Odin, prince of Asgard, god of mischief who has walked the line between hero and villain.',
    firstAppearance: 'Journey into Mystery #85 (October 1962) / MCU: Thor (2011)',
    greatestFeat: 'Sacrificed himself to weave and hold together the multiverse at the end of Loki Season 2.',
    otherFacts: ['Master of illusion and magic', 'Holds the timelines together', 'Evolved from villain to guardian'],
    status: 'confirmed',
  },
  {
    id: 'ant-man',
    name: 'Ant-Man',
    alias: 'Scott Lang',
    actor: 'Paul Rudd',
    universe: 'mcu',
    faction: 'Avengers',
    originStory: 'Former thief turned hero who stole Hank Pym\'s Ant-Man suit to save his daughter and became Earth\'s smallest Avenger.',
    firstAppearance: 'Tales to Astonish #35 (September 1962) / MCU: Ant-Man (2015)',
    greatestFeat: 'Played a crucial role in the Time Heist in Endgame, enabling the reversal of the Snap.',
    otherFacts: ['Expert in quantum realm', 'Father to Cassie Lang', 'Heart and humor of the Avengers'],
    status: 'confirmed',
  },
  {
    id: 'bucky',
    name: 'Winter Soldier',
    alias: 'Bucky Barnes',
    actor: 'Sebastian Stan',
    universe: 'mcu',
    faction: 'Thunderbolts',
    originStory: 'Steve Rogers\' best friend, captured and brainwashed by HYDRA into the Winter Soldier for decades.',
    firstAppearance: 'Captain America Comics #1 (March 1941) / MCU: Captain America: The First Avenger (2011)',
    greatestFeat: 'Broke free of HYDRA control and became a hero worthy of carrying on Steve\'s legacy.',
    otherFacts: ['Vibranium arm', 'Now a Congressman', 'Leads the New Avengers/Thunderbolts'],
    status: 'confirmed',
  },
  {
    id: 'shuri',
    name: 'Black Panther',
    alias: 'Shuri',
    actor: 'Letitia Wright',
    universe: 'mcu',
    faction: 'Wakanda',
    originStory: 'Princess and genius inventor of Wakanda who took on the mantle of Black Panther after T\'Challa\'s death.',
    firstAppearance: 'Black Panther #2 (May 2005) / MCU: Black Panther (2018)',
    greatestFeat: 'Led Wakanda through grief and invasion while protecting it as its new Panther.',
    otherFacts: ['Genius inventor', 'Master strategist', 'Wields Vibranium tech'],
    status: 'confirmed',
  },
  {
    id: 'mbaku',
    name: 'M\'Baku',
    actor: "Winston Duke",
    universe: 'mcu',
    faction: 'Wakanda',
    originStory: 'Leader of the Jabari tribe, initially rival to T\'Challa who became a key ally and protector of Wakanda.',
    firstAppearance: 'Black Panther #8 (January 1978) / MCU: Black Panther (2018)',
    greatestFeat: 'Led the Jabari to aid Wakanda in its greatest battles and stood as a pillar of strength.',
    otherFacts: ['Fearless warrior', 'King of the Jabari Mountain tribe', 'Wakanda\'s stalwart ally'],
    status: 'confirmed',
  },
  {
    id: 'falcon',
    name: 'Falcon',
    alias: 'Joaquin Torres',
    actor: 'Danny Ramirez',
    universe: 'mcu',
    faction: 'Avengers',
    originStory: 'Air Force lieutenant who took up the Falcon mantle after Sam Wilson became Captain America.',
    firstAppearance: 'Captain America: Sam Wilson #1 (November 2015) / MCU: The Falcon and the Winter Soldier (2021)',
    greatestFeat: 'Proved himself as a worthy successor, mastering the EXO-7 Falcon suit.',
    otherFacts: ['EXO-7 Falcon suit', 'Skilled pilot and tactician', 'New generation hero'],
    status: 'confirmed',
  },
  {
    id: 'professor-x',
    name: 'Professor X',
    alias: 'Charles Xavier',
    actor: 'Patrick Stewart',
    universe: 'fox',
    faction: 'X-Men',
    originStory: 'Paralyzed telepath who founded Xavier\'s School for Gifted Youngsters to foster peace between humans and mutants.',
    firstAppearance: 'X-Men #1 (September 1963)',
    greatestFeat: 'Built the X-Men and worked tirelessly for mutant-human coexistence for decades.',
    otherFacts: ['Most powerful telepath', 'Founder of the X-Men', 'Hope for peaceful coexistence'],
    status: 'confirmed',
  },
  {
    id: 'magneto',
    name: 'Magneto',
    alias: 'Erik Lehnsherr',
    actor: 'Ian McKellen',
    universe: 'fox',
    faction: 'X-Men',
    originStory: 'Holocaust survivor whose powers awakened in trauma, leading him to believe mutants must protect themselves by any means.',
    firstAppearance: 'X-Men #1 (September 1963)',
    greatestFeat: 'Mastered magnetism to planetary scales, reshaping battlefields with his will.',
    otherFacts: ['Holocaust survivor', 'Master of magnetism', 'Complex frenemy to Xavier'],
    status: 'confirmed',
  },
  {
    id: 'wolverine',
    name: 'Wolverine',
    alias: 'Logan',
    actor: 'Hugh Jackman',
    universe: 'fox',
    faction: 'X-Men',
    originStory: 'Mutant with animal-keen senses, healing factor, and adamantium-laced skeleton and claws.',
    firstAppearance: 'The Incredible Hulk #180 (October 1974)',
    greatestFeat: 'Survived impossible odds countless times, protecting the X-Men as their fiercest warrior.',
    otherFacts: ['Adamantium claws and skeleton', 'Rapid healing factor', 'Gruff but deeply loyal'],
    status: 'confirmed',
  },
  {
    id: 'cyclops',
    name: 'Cyclops',
    alias: 'Scott Summers',
    actor: 'James Marsden',
    universe: 'fox',
    faction: 'X-Men',
    originStory: 'Orphan whose eyes emit concussive optic beams he cannot control without his ruby quartz visor.',
    firstAppearance: 'X-Men #1 (September 1963)',
    greatestFeat: 'Led the X-Men through their darkest hours with tactical brilliance and unflinching resolve.',
    otherFacts: ['First X-Man', 'Tactical leader', 'Optic blast powerhouse'],
    status: 'confirmed',
  },
  {
    id: 'beast',
    name: 'Beast',
    alias: 'Hank McCoy',
    actor: 'Kelsey Grammer',
    universe: 'fox',
    faction: 'X-Men',
    originStory: 'Brilliant biochemist who transformed himself, gaining a blue furred simian form with enhanced strength and agility.',
    firstAppearance: 'X-Men #1 (September 1963)',
    greatestFeat: 'Saved the X-Men countless times through both scientific genius and physical prowess.',
    otherFacts: ['Polymath scientist', 'Former Secretary of Mutant Affairs', 'Gentle soul in a fearsome form'],
    status: 'confirmed',
  },
  {
    id: 'mystique',
    name: 'Mystique',
    alias: 'Raven Darkhölme',
    actor: 'Rebecca Romijn',
    universe: 'fox',
    faction: 'X-Men',
    originStory: 'Shapeshifting mutant who can mimic anyone, walking the line between ally and enemy for years.',
    firstAppearance: 'Ms. Marvel #16 (April 1978)',
    greatestFeat: 'Infiltrated the highest levels of power using her perfect shapeshifting abilities.',
    otherFacts: ['Master shapeshifter', 'Complex loyalties', 'Expert infiltrator'],
    status: 'confirmed',
  },
  {
    id: 'nightcrawler',
    name: 'Nightcrawler',
    alias: 'Kurt Wagner',
    actor: 'Alan Cumming',
    universe: 'fox',
    faction: 'X-Men',
    originStory: 'Demon-looking teleporting mutant, deeply devout and one of the kindest hearts among the X-Men.',
    firstAppearance: 'Giant-Size X-Men #1 (May 1975)',
    greatestFeat: 'Bamfed through impossible situations to rescue his teammates time and again.',
    otherFacts: ['Teleportation', 'Devout Catholic', 'Acrobatic swordmaster'],
    status: 'confirmed',
  },
  {
    id: 'gambit',
    name: 'Gambit',
    alias: 'Remy LeBeau',
    actor: 'Channing Tatum',
    universe: 'fox',
    faction: 'X-Men',
    originStory: 'Cajun thief and card-thrower who can charge objects with kinetic energy, causing explosive results.',
    firstAppearance: 'Uncanny X-Men #266 (August 1990)',
    greatestFeat: 'Turned seemingly innocuous playing cards into devastating weapons against overwhelming odds.',
    otherFacts: ['Kinetic charging', 'Master card thrower', 'Smooth-talking rogue'],
    status: 'confirmed',
  },
  {
    id: 'yelena',
    name: 'Black Widow',
    alias: 'Yelena Belova',
    actor: 'Florence Pugh',
    universe: 'mcu',
    faction: 'Thunderbolts',
    originStory: 'Trained in the Red Room as a Black Widow, Natasha\'s surrogate sister turned reluctant hero.',
    firstAppearance: 'Inhumans #5 (March 1999) / MCU: Black Widow (2021)',
    greatestFeat: 'United the misfit Thunderbolts team and outmaneuvered Valentina Allegra de Fontaine.',
    otherFacts: ['Elite spy and assassin', 'Sharp wit', 'Now leader of the New Avengers'],
    status: 'confirmed',
  },
  {
    id: 'red-guardian',
    name: 'Red Guardian',
    alias: 'Alexei Shostakov',
    actor: 'David Harbour',
    universe: 'mcu',
    faction: 'Thunderbolts',
    originStory: 'Soviet super-soldier, Russia\'s answer to Captain America, Yelena\'s adoptive father figure.',
    firstAppearance: 'The Incredible Hulk #258 (April 1981) / MCU: Black Widow (2021)',
    greatestFeat: 'Proved there\'s more to the Red Guardian than propaganda - he\'s a true hero at heart.',
    otherFacts: ['Super soldier', 'Crude but lovable', 'Proud of his "family"'],
    status: 'confirmed',
  },
  {
    id: 'us-agent',
    name: 'U.S. Agent',
    alias: 'John Walker',
    actor: 'Wyatt Russell',
    universe: 'mcu',
    faction: 'Thunderbolts',
    originStory: 'Former Captain America replacement who struggled with the weight of the shield before finding his own path.',
    firstAppearance: 'Captain America #323 (November 1986) / MCU: The Falcon and the Winter Soldier (2021)',
    greatestFeat: 'Redeemed himself by fighting for others rather than the approval of the government.',
    otherFacts: ['Enhanced by serum', 'Shield wielder', 'Complex redemption arc'],
    status: 'confirmed',
  },
  {
    id: 'ghost',
    name: 'Ghost',
    alias: 'Ava Starr',
    actor: 'Hannah John-Kamen',
    universe: 'mcu',
    faction: 'Thunderbolts',
    originStory: 'S.H.I.E.L.D. experiment left her molecularly unstable, phasing in and out of reality.',
    firstAppearance: 'Astonishing Tales #6 (June 1971) / MCU: Ant-Man and The Wasp (2018)',
    greatestFeat: 'Learned to control her phasing abilities and fight for redemption.',
    otherFacts: ['Quantum phasing', 'Stealth specialist', 'Seeking to heal herself'],
    status: 'confirmed',
  },
  {
    id: 'sentry',
    name: 'Sentry',
    alias: 'Bob Reynolds',
    actor: 'Lewis Pullman',
    universe: 'mcu',
    faction: 'Thunderbolts',
    originStory: 'Man with the power of a million exploding suns, battling his dark side known as The Void.',
    firstAppearance: 'Sentry #1 (September 2000) / MCU: Thunderbolts* (2025)',
    greatestFeat: 'Fought his own inner darkness to become a force for good alongside the Thunderbolts.',
    otherFacts: ['Power of a million exploding suns', 'Battles The Void', 'Redeemed himself'],
    status: 'confirmed',
  },
  {
    id: 'namor',
    name: 'Namor',
    alias: 'Namor McKenzie',
    actor: 'Tenoch Huerta Mejía',
    universe: 'mcu',
    faction: 'Talokan',
    originStory: 'Mutant king of Talokan, an underwater civilization hidden from the surface world.',
    firstAppearance: 'Marvel Comics #1 (October 1939) / MCU: Black Panther: Wakanda Forever (2022)',
    greatestFeat: 'Defended Talokan fiercely against surface world threats, nearly toppling Wakanda.',
    otherFacts: ['Marvel\'s first mutant', 'Winged feet', 'King of Talokan'],
    status: 'confirmed',
  },
  {
    id: 'namora',
    name: 'Namora',
    actor: 'Mabel Cadena',
    universe: 'mcu',
    faction: 'Talokan',
    originStory: 'Cousin and loyal warrior to Namor, one of Talokan\'s fiercest protectors.',
    firstAppearance: 'Marvel Mystery Comics #82 (May 1947) / MCU: Black Panther: Wakanda Forever (2022)',
    greatestFeat: 'Fought valiantly to protect Talokan and its people from invasion.',
    otherFacts: ['Talokan warrior', 'Loyal to Namor', 'Skilled combatant'],
    status: 'confirmed',
  },
  {
    id: 'shang-chi',
    name: 'Shang-Chi',
    alias: 'Xu Shang-Chi',
    actor: 'Simu Liu',
    universe: 'mcu',
    faction: 'Avengers',
    originStory: 'Son of Wenwu, trained as an assassin from childhood who escaped to live a normal life before reclaiming his destiny.',
    firstAppearance: 'Special Marvel Edition #15 (December 1973) / MCU: Shang-Chi and the Legend of the Ten Rings (2021)',
    greatestFeat: 'Defeated his father and took control of the Ten Rings to use them for good.',
    otherFacts: ['Master of martial arts', 'Wields the Ten Rings', 'Son of the Mandarin'],
    status: 'confirmed',
  },
  {
    id: 'peggy-carter',
    name: 'Peggy Carter',
    actor: 'Hayley Atwell',
    universe: 'mcu',
    faction: 'SSR/SHIELD',
    originStory: 'Strategic Scientific Reserve agent during WWII, co-founder of S.H.I.E.L.D., and Steve Rogers\' love.',
    firstAppearance: 'Captain America: The First Avenger (2011)',
    greatestFeat: 'Helped found S.H.I.E.L.D. and shaped the early days of superhuman defense.',
    otherFacts: ['Founder of S.H.I.E.L.D.', 'Steve Rogers\' love', 'Badass spy'],
    status: 'confirmed',
  },
]

const UNIVERSES = [
  { id: 'all', label: 'ALL' },
  { id: 'mcu', label: 'MCU' },
  { id: 'fox', label: 'FOX X-MEN' },
  { id: 'fantastic-four', label: 'FANTASTIC FOUR' },
]

export default function CharactersPage() {
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<Character | null>(null)

  const filtered = filter === 'all' ? CHARACTERS : CHARACTERS.filter((c) => c.universe === filter)

  return (
    <main className="halftone min-h-[80vh]">
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-14">
        <div className="text-sm font-black uppercase tracking-[0.15em] text-hero-red">From the Avengers: Doomsday Cast Reveal</div>
        <h1 className="font-display m-0 mt-1 text-[clamp(48px,7vw,96px)] leading-[0.95]">
          DOOMSDAY <span className="ink-stroke text-hero-red" style={{ WebkitTextStroke: '2px #111' }}>CHARACTERS</span>
        </h1>
        <p className="mt-3 max-w-3xl text-lg font-semibold">
          All confirmed characters from the Avengers: Doomsday cast. Origin stories, first appearances, greatest feats, and more.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-2.5">
          {UNIVERSES.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => setFilter(u.id)}
              className={cn(
                'flex items-center gap-2 border-[3px] border-ink px-3.5 py-2 text-sm font-black tracking-wide transition-transform hover:-translate-y-0.5',
                filter === u.id ? 'bg-ink text-pow shadow-[4px_4px_0_#111]' : 'bg-paper text-ink shadow-[4px_4px_0_#111]',
              )}
            >
              {u.label}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
          {filtered.map((char) => (
            <button
              key={char.id}
              type="button"
              onClick={() => setSelected(char)}
              className="panel group relative overflow-hidden bg-white p-5 text-left transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0_#111]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display m-0 text-2xl leading-tight">{char.name}</h2>
                  {char.alias && <p className="m-0 mt-1 text-xs font-bold text-hero-red">{char.alias}</p>}
                  <p className="m-0 mt-1 text-xs font-semibold text-ink/70">{char.actor}</p>
                </div>
                <Chip icon={char.universe === 'fox' ? 'rings' : char.universe === 'fantastic-four' ? 'star' : 'users'} dark>
                  {char.universe === 'fox' ? 'FOX' : char.universe === 'fantastic-four' ? 'FF' : 'MCU'}
                </Chip>
              </div>
              <p className="mt-3 text-sm font-semibold leading-relaxed line-clamp-2">{char.originStory}</p>
              <div className="mt-4 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-ink/70">
                <Icon name="info" size={14} /> View Details
              </div>
            </button>
          ))}
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4" onClick={() => setSelected(null)}>
          <div
            className="panel max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-white p-6 shadow-[12px_12px_0_#C8102E]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display m-0 text-4xl leading-none">{selected.name}</h2>
                {selected.alias && <p className="m-0 mt-2 text-lg font-black text-hero-red">{selected.alias}</p>}
                <p className="m-0 mt-1 text-base font-bold">Portrayed by {selected.actor}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="border-[3px] border-ink bg-hero-red p-2 text-paper shadow-[3px_3px_0_#111]"
              >
                <Icon name="x" size={24} strokeWidth={3} />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Chip icon="users">{selected.faction}</Chip>
              {selected.status === 'confirmed' && <Chip icon="check" dark>CONFIRMED FOR DOOMSDAY</Chip>}
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <h3 className="font-display m-0 flex items-center gap-2 text-2xl">
                  <Icon name="book" size={24} /> ORIGIN STORY
                </h3>
                <p className="mt-2 text-base font-semibold leading-relaxed">{selected.originStory}</p>
              </div>

              <div>
                <h3 className="font-display m-0 flex items-center gap-2 text-2xl">
                  <Icon name="calendar" size={24} /> FIRST APPEARANCE
                </h3>
                <p className="mt-2 text-base font-semibold leading-relaxed">{selected.firstAppearance}</p>
              </div>

              <div>
                <h3 className="font-display m-0 flex items-center gap-2 text-2xl">
                  <Icon name="star" size={24} fill="#C8102E" /> GREATEST FEAT
                </h3>
                <p className="mt-2 text-base font-semibold leading-relaxed">{selected.greatestFeat}</p>
              </div>

              <div>
                <h3 className="font-display m-0 flex items-center gap-2 text-2xl">
                  <Icon name="bulb" size={24} /> MORE DETAILS
                </h3>
                <ul className="mt-2 space-y-2">
                  {selected.otherFacts.map((fact, i) => (
                    <li key={i} className="flex items-start gap-2 text-base font-semibold">
                      <Icon name="bolt" size={18} className="mt-0.5 flex-none text-hero-red" />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
