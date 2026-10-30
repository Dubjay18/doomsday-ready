import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Icon } from '../components/Icon'
import type { IconName } from '../components/Icon'
import { Chip, cn } from '../components/comic'

const sectionReveal = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { type: 'spring' as const, stiffness: 380, damping: 30, delay: 0.56 + i * 0.07 },
})

function accentForUniverse(universe: 'mcu' | 'fox' | 'fantastic-four') {
  return universe === 'fox' ? 'bg-sky' : universe === 'fantastic-four' ? 'bg-blast' : 'bg-pow'
}

const STARBURST_POINTS =
  '100,0 118,58 180,30 142,82 200,100 142,118 180,170 118,142 100,200 82,142 20,170 58,118 0,100 58,82 20,30 82,58'

/** One panel of the "story so far" mini-comic: an icon badge that pops in, a label, and a line of flavor text. */
function StoryPanel({
  icon,
  fill,
  label,
  text,
  index,
  accentClass,
  spark,
}: {
  icon: IconName
  fill?: string
  label: string
  text: string
  index: number
  accentClass: string
  spark?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: index % 2 === 0 ? -6 : 6 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 360, damping: 15, delay: 0.1 + index * 0.13 }}
      className={cn('halftone relative flex-1 border-4 border-ink p-3 text-center shadow-[5px_5px_0_#111]', accentClass)}
    >
      <div className="relative mx-auto flex h-14 w-14 items-center justify-center">
        {spark && (
          <motion.svg
            viewBox="0 0 200 200"
            className="absolute -inset-4"
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.2, rotate: -25 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 12, delay: 0.26 + index * 0.13 }}
          >
            <polygon points={STARBURST_POINTS} fill="#FFD23F" stroke="#111" strokeWidth="6" />
          </motion.svg>
        )}
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-ink bg-paper shadow-[3px_3px_0_#111]">
          <Icon name={icon} size={26} fill={fill} />
        </div>
      </div>
      <p className="font-display m-0 mt-2 text-lg leading-none tracking-wide">{label}</p>
      <p className="mt-1.5 text-[12.5px] font-semibold leading-snug text-ink/80 line-clamp-3">{text}</p>
    </motion.div>
  )
}

/** A small bolt that zaps in between two story panels, comic-sound-effect style. */
function StoryZap({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.2, rotate: -15 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 14, delay }}
      className="hidden flex-none items-center justify-center text-hero-red sm:flex"
      aria-hidden="true"
    >
      <Icon name="bolt" size={22} fill="#FFD23F" />
    </motion.div>
  )
}

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
  weapon: string
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
    weapon: 'Armor forged from sorcery and stolen super-science, letting him throw force bolts, conjure mystic shields, and bend matter at will.',
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
    weapon: 'His own elastic body — stretching, reshaping, and absorbing impacts — paired with a genius intellect that out-thinks nearly any threat.',
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
    weapon: 'Invisibility and force-field projection powerful enough to shield a city block or crush an enemy in an invisible fist.',
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
    weapon: 'Full-body flame generation that lets him fly at jet speed and blast nova-hot fireballs.',
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
    weapon: 'A rock-hard body built for brawling — immense strength and durability he throws straight into the fight.',
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
    weapon: 'The vibranium-and-steel shield he\'s carried since WWII, thrown like a boomerang and strong enough to even wield Mjolnir.',
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
    weapon: 'Steve\'s old shield paired with vibranium wings and twin EXO-7 blasters from his Falcon days.',
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
    weapon: 'Stormbreaker, the axe that can summon the Bifrost and channel the full force of Asgardian storm magic.',
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
    weapon: 'Illusion magic, shapeshifting, and a handful of throwing knives he uses to talk — or stab — his way out of anything.',
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
    weapon: 'The Ant-Man suit\'s Pym Particles, letting him shrink to subatomic size or grow into a building-sized brawler.',
    firstAppearance: 'Tales to Astonish #35 (September 1962) / MCU: Ant-Man (2015)',
    greatestFeat: 'Played a crucial role in the Time Heist in Endgame, enabling the reversal of the Snap.',
    otherFacts: ['Expert in quantum realm', 'Father to Cassie Lang', 'Heart and humor of the Avengers'],
    status: 'confirmed',
  },
  {
    id: 'cassie-lang',
    name: 'Cassie Lang',
    alias: 'Stature',
    actor: 'Kathryn Newton',
    universe: 'mcu',
    faction: 'Avengers',
    originStory: 'Scott Lang\'s daughter, who grew up around the Quantum Realm and became a size-changing hero in her own right after Ant-Man and the Wasp: Quantumania.',
    weapon: 'A Pym Particle suit of her own, letting her shrink down or grow giant-sized just like her father.',
    firstAppearance: 'Ant-Man (2015, as a child) / MCU hero debut: Ant-Man and the Wasp: Quantumania (2023)',
    greatestFeat: 'Helped lead the resistance against Kang the Conqueror from inside the Quantum Realm.',
    otherFacts: ['Known as Stature in the comics', 'Scott Lang\'s daughter', 'Grew up alongside the Pym/Van Dyne family'],
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
    weapon: 'A vibranium prosthetic arm with the strength of a sledgehammer, backed by decades of black-ops combat training.',
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
    weapon: 'The vibranium Black Panther suit and a Wakandan tech arsenal she engineered herself.',
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
    weapon: 'A Jabari war club and raw hand-to-hand strength, backed by a mountain tribe that never bends to outsiders.',
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
    weapon: 'The EXO-7 Falcon suit\'s retractable wings and drone-assisted aerial combat systems.',
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
    weapon: 'The most powerful telepathy on Earth, amplified through Cerebro to reach — or control — every mutant mind on the planet.',
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
    weapon: 'Magnetokinesis strong enough to rip steel from the earth and turn entire battlefields into weapons.',
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
    weapon: 'Retractable adamantium claws paired with a healing factor that lets him shrug off nearly any wound.',
    firstAppearance: 'The Incredible Hulk #180 (October 1974)',
    greatestFeat: 'Survived impossible odds countless times, protecting the X-Men as their fiercest warrior.',
    otherFacts: ['Adamantium claws and skeleton', 'Rapid healing factor', 'Jackman pitched a Doomsday cameo at D23 2026, but Marvel hasn\'t confirmed it — so his spot here is unconfirmed'],
  },
  {
    id: 'cyclops',
    name: 'Cyclops',
    alias: 'Scott Summers',
    actor: 'James Marsden',
    universe: 'fox',
    faction: 'X-Men',
    originStory: 'Orphan whose eyes emit concussive optic beams he cannot control without his ruby quartz visor.',
    weapon: 'Concussive optic blasts held in check only by his ruby-quartz visor, fired with pinpoint tactical precision.',
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
    weapon: 'Enhanced strength, agility, and claws from his transformed simian form, backed by a genius-level scientific mind.',
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
    weapon: 'Perfect shapeshifting that lets her become anyone — the ultimate weapon for infiltration and betrayal.',
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
    weapon: 'Instant teleportation ("bamf") combined with acrobatic swordsmanship that turns him into an unpredictable blur in a fight.',
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
    weapon: 'Kinetic energy channeled through charged playing cards, turning a deck into a volley of tiny explosives.',
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
    weapon: 'Red Room-honed hand-to-hand combat and marksmanship, lethal with a baton, a blade, or bare hands.',
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
    weapon: 'A Soviet-era shield and a super-soldier serum that gives him strength to match Captain America, with none of the restraint.',
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
    weapon: 'A government-issue shield and the same super-soldier serum that once powered Captain America.',
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
    weapon: 'Molecular phasing that lets her turn intangible, walk through walls, and disrupt enemies mid-strike.',
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
    weapon: 'The power of a million exploding suns — strength, flight, and energy blasts on a cosmic scale, barely held in check.',
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
    weapon: 'Enhanced Atlantean strength and winged ankles that let him fly and fight equally well above or below the waves.',
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
    weapon: 'Talokan-bred super-strength and speed in the water, making her one of the kingdom\'s fiercest hand-to-hand fighters.',
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
    weapon: 'The mystical Ten Rings fused to his forearms, wielded with a lifetime of elite martial arts training.',
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
    weapon: 'SSR-trained combat skills and a tactical mind sharp enough to co-found S.H.I.E.L.D. from scratch.',
    firstAppearance: 'Captain America: The First Avenger (2011)',
    greatestFeat: 'Helped found S.H.I.E.L.D. and shaped the early days of superhuman defense.',
    otherFacts: ['Founder of S.H.I.E.L.D.', 'Steve Rogers\' love', 'Badass spy'],
    status: 'confirmed',
  },
]

/** Portraits live in public/characters/<id>.jpg (see scripts/fetch-character-images.mjs). Missing ones fall back to a comic tile. */
function Portrait({ char, className }: { char: Character; className?: string }) {
  const [failed, setFailed] = useState(false)
  const tone = accentForUniverse(char.universe)
  if (failed)
    return (
      <div className={cn('halftone flex items-center justify-center', tone, className)} role="img" aria-label={char.name}>
        <span className="font-display text-7xl text-ink/80">{char.name.replace(/^(The|Doctor|Professor|Captain) /, '')[0]}</span>
      </div>
    )
  return (
    <img
      src={`/characters/${char.id}.jpg`}
      alt={`${char.actor} as ${char.name}`}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={cn('bg-ink/10 object-cover object-top', className)}
    />
  )
}

const UNIVERSES = [
  { id: 'all', label: 'ALL' },
  { id: 'mcu', label: 'MCU' },
  { id: 'fox', label: 'FOX X-MEN' },
  { id: 'fantastic-four', label: 'FANTASTIC FOUR' },
]

export default function CharactersPage() {
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<Character | null>(null)

  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [selected])

  const filtered = filter === 'all' ? CHARACTERS : CHARACTERS.filter((c) => c.universe === filter)

  return (
    <main className="halftone min-h-[80vh]">
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:pt-14">
        <div className="text-sm font-black uppercase tracking-[0.15em] text-hero-red">From the Avengers: Doomsday Cast Reveal</div>
        <h1 className="font-display m-0 mt-1 text-[clamp(40px,11vw,96px)] leading-[0.95]">
          DOOMSDAY <span className="ink-stroke text-hero-red" style={{ WebkitTextStroke: '2px #111' }}>CHARACTERS</span>
        </h1>
        <p className="mt-3 max-w-3xl text-lg font-semibold">
          All confirmed characters from the Avengers: Doomsday cast. Origin stories, first appearances, greatest feats, and more.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-2 sm:gap-2.5">
          {UNIVERSES.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => setFilter(u.id)}
              className={cn(
                'flex items-center gap-2 border-[3px] border-ink px-3 py-2 text-xs font-black tracking-wide transition-transform sm:px-3.5 sm:text-sm hover:-translate-y-0.5',
                filter === u.id ? 'bg-ink text-pow shadow-[4px_4px_0_#111]' : 'bg-paper text-ink shadow-[4px_4px_0_#111]',
              )}
            >
              {u.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 sm:mt-10 sm:gap-6 [grid-template-columns:repeat(auto-fill,minmax(min(100%,240px),1fr))]">
          {filtered.map((char) => (
            <button
              key={char.id}
              type="button"
              onClick={() => setSelected(char)}
              className="panel group relative flex flex-col overflow-hidden bg-white text-left transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0_#111]"
            >
              <div className="relative border-b-4 border-ink">
                <Portrait char={char} className="aspect-square w-full sm:aspect-[4/5]" />
                <span className="absolute right-2 top-2">
                  <Chip icon={char.universe === 'fox' ? 'rings' : char.universe === 'fantastic-four' ? 'star' : 'users'} dark>
                    {char.universe === 'fox' ? 'FOX' : char.universe === 'fantastic-four' ? 'FF' : 'MCU'}
                  </Chip>
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4 sm:p-5">
              <div>
                <div>
                  <h2 className="font-display m-0 text-2xl leading-tight">{char.name}</h2>
                  {char.alias && <p className="m-0 mt-1 text-xs font-bold text-hero-red">{char.alias}</p>}
                  <p className="m-0 mt-1 text-xs font-semibold text-ink/70">{char.actor}</p>
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold leading-relaxed line-clamp-2">{char.originStory}</p>
              <div className="mt-auto flex items-center gap-2 pt-4 text-xs font-black uppercase tracking-wider text-ink/70">
                <Icon name="info" size={14} /> View Details
              </div>
              </div>
            </button>
          ))}
        </div>
        <p className="mt-10 text-xs font-semibold">
          Cast portraits are free-licensed photos from Wikimedia Commons. Doomsday Ready is an unofficial fan project.
        </p>
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/80 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={selected.name} onClick={() => setSelected(null)}>
          <div
            className="panel max-h-[92dvh] w-full max-w-2xl overflow-y-auto bg-white p-4 shadow-none sm:max-h-[90vh] sm:p-6 sm:shadow-[12px_12px_0_#C8102E]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <Portrait char={selected} className="hidden h-36 w-28 flex-none border-4 border-ink shadow-[4px_4px_0_#111] min-[420px]:block sm:h-44 sm:w-36" />
              <div className="min-w-0 flex-1">
                <h2 className="font-display m-0 text-3xl leading-none sm:text-4xl">{selected.name}</h2>
                {selected.alias && <p className="m-0 mt-2 text-lg font-black text-hero-red">{selected.alias}</p>}
                <p className="m-0 mt-1 text-base font-bold">Portrayed by {selected.actor}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="flex-none border-[3px] border-ink bg-hero-red p-2 text-paper shadow-[3px_3px_0_#111]"
                aria-label="Close"
              >
                <Icon name="x" size={24} strokeWidth={3} />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Chip icon="users">{selected.faction}</Chip>
              {selected.status === 'confirmed' && <Chip icon="check" dark>CONFIRMED FOR DOOMSDAY</Chip>}
            </div>

            <div className="mt-5">
              <h3 className="font-display m-0 flex items-center gap-2 text-2xl">
                <Icon name="film" size={24} /> THE STORY SO FAR
              </h3>
              <div className="mt-3 flex flex-col gap-2.5 sm:flex-row sm:items-stretch sm:gap-2">
                <StoryPanel index={0} icon="book" label="ORIGIN" text={selected.originStory} accentClass={accentForUniverse(selected.universe)} />
                <StoryZap delay={0.3} />
                <StoryPanel index={1} icon="shield" fill="#FFD23F" label="WEAPON" text={selected.weapon} accentClass={accentForUniverse(selected.universe)} spark />
                <StoryZap delay={0.56} />
                <StoryPanel index={2} icon="star" fill="#C8102E" label="FEAT" text={selected.greatestFeat} accentClass={accentForUniverse(selected.universe)} />
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <motion.div {...sectionReveal(0)}>
                <h3 className="font-display m-0 flex items-center gap-2 text-2xl">
                  <Icon name="book" size={24} /> ORIGIN STORY
                </h3>
                <p className="mt-2 text-base font-semibold leading-relaxed">{selected.originStory}</p>
              </motion.div>

              <motion.div {...sectionReveal(1)}>
                <h3 className="font-display m-0 flex items-center gap-2 text-2xl">
                  <Icon name="shield" size={24} fill="#FFD23F" /> WEAPON / POWER
                </h3>
                <p className="mt-2 text-base font-semibold leading-relaxed">{selected.weapon}</p>
              </motion.div>

              <motion.div {...sectionReveal(2)}>
                <h3 className="font-display m-0 flex items-center gap-2 text-2xl">
                  <Icon name="calendar" size={24} /> FIRST APPEARANCE
                </h3>
                <p className="mt-2 text-base font-semibold leading-relaxed">{selected.firstAppearance}</p>
              </motion.div>

              <motion.div {...sectionReveal(3)}>
                <h3 className="font-display m-0 flex items-center gap-2 text-2xl">
                  <Icon name="star" size={24} fill="#C8102E" /> GREATEST FEAT
                </h3>
                <p className="mt-2 text-base font-semibold leading-relaxed">{selected.greatestFeat}</p>
              </motion.div>

              <motion.div {...sectionReveal(4)}>
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
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
