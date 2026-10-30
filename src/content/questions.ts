/**
 * Question bank. Each question: one correct option (prefixed with *), three distractors.
 * Spoiler level: 0 none · 1 mid-film detail · 2 major twist/ending.
 * IDs are stable (`<titleId>-<n>`). Never renumber, since sessions store them.
 */
import { TITLE_BY_ID } from './catalog'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Question {
  id: string
  titleId: string
  difficulty: Difficulty
  prompt: string
  options: string[]
  answer: number
  explanation: string
  spoiler: 0 | 1 | 2
}

type Raw = [Difficulty, string, string[], string, (0 | 1 | 2)?]

const BANK: Record<string, Raw[]> = {
  'iron-man': [
    ['easy', 'Who builds the first Iron Man suit in a cave?', ['*Tony Stark', 'Obadiah Stane', 'James Rhodes', 'Happy Hogan'], 'Captured by the Ten Rings, Tony builds the Mark I to escape.', 1],
    ['medium', 'Who helps Tony build the Mark I while they are held captive?', ['*Ho Yinsen', 'Happy Hogan', 'Phil Coulson', 'Obadiah Stane'], 'Yinsen keeps Tony alive and helps build the suit, then sacrifices himself.', 1],
    ['medium', 'Which group holds Tony captive in Afghanistan?', ['*The Ten Rings', 'HYDRA', 'A.I.M.', 'The Hand'], 'The Ten Rings later get their full story in Shang-Chi.', 0],
    ['easy', 'How does Tony end the film at the press conference?', ['*"I am Iron Man."', 'He denies being Iron Man', 'He resigns from Stark Industries', 'He announces the Avengers'], 'He goes off-script and reveals his identity.', 2],
    ['hard', 'Who visits Tony in the post-credits scene to talk about the "Avenger Initiative"?', ['*Nick Fury', 'Phil Coulson', 'Maria Hill', 'Thaddeus Ross'], 'Samuel L. Jackson’s first appearance as Fury.', 2],
  ],
  'the-incredible-hulk': [
    ['medium', 'Which general hunts Bruce Banner in The Incredible Hulk?', ['*Thaddeus "Thunderbolt" Ross', 'Nick Fury', 'Glenn Talbot', 'William Stryker'], 'Ross later becomes US President and Red Hulk in Brave New World.', 0],
    ['medium', 'Emil Blonsky becomes which creature?', ['*Abomination', 'Red Hulk', 'The Leader', 'Absorbing Man'], 'Blonsky resurfaces years later in Shang-Chi and She-Hulk.', 1],
  ],
  'iron-man-2': [
    ['medium', 'What is the real name of the villain Whiplash?', ['*Ivan Vanko', 'Justin Hammer', 'Aldrich Killian', 'Anton Vanko'], 'Ivan builds his own arc reactor to get revenge on the Starks.', 0],
    ['easy', 'Which hero goes undercover at Stark Industries as "Natalie Rushman"?', ['*Natasha Romanoff', 'Pepper Potts', 'Maria Hill', 'Sharon Carter'], 'Black Widow’s MCU debut.', 1],
    ['medium', 'Rhodey takes one of Tony’s suits and becomes…', ['*War Machine', 'Iron Patriot', 'Rescue', 'Iron Monger'], 'He becomes War Machine. The suit is rebranded Iron Patriot later.', 1],
  ],
  thor: [
    ['easy', 'What is the name of Thor’s hammer?', ['*Mjolnir', 'Stormbreaker', 'Gungnir', 'Jarnbjorn'], 'Only the worthy can lift it.', 0],
    ['easy', 'Where is Thor banished to?', ['*Earth (New Mexico)', 'Jotunheim', 'Vanaheim', 'Sakaar'], 'Odin strips his powers and sends him to Earth.', 0],
    ['medium', 'Who turns out to be Loki’s biological father?', ['*Laufey, king of the Frost Giants', 'Odin', 'Bor', 'Malekith'], 'Odin took the infant Loki from Jotunheim.', 1],
  ],
  'captain-america-the-first-avenger': [
    ['easy', 'What turns Steve Rogers into a super-soldier?', ['*The Super-Soldier Serum', 'Gamma radiation', 'The Tesseract', 'Vibranium armour'], 'Steve is the first and only success of Project Rebirth.', 0],
    ['medium', 'Which scientist created the serum given to Steve?', ['*Dr. Abraham Erskine', 'Howard Stark', 'Arnim Zola', 'Hank Pym'], 'Erskine is killed right after the procedure.', 1],
    ['medium', 'Who leads HYDRA in The First Avenger?', ['*Johann Schmidt, the Red Skull', 'Baron Zemo', 'Arnim Zola', 'Alexander Pierce'], 'Schmidt took an earlier version of the serum.', 0],
    ['easy', 'Who does Steve promise a dance before he goes into the ice?', ['*Peggy Carter', 'Sharon Carter', 'Natasha Romanoff', 'Lorraine'], 'He finally gets that dance at the end of Endgame.', 2],
    ['hard', 'How is Bucky Barnes presumed dead?', ['*He falls from a HYDRA train in the Alps', 'He is shot by Red Skull', 'He dies in the Valkyrie crash', 'He is caught in a factory explosion'], 'He survives, and HYDRA turns him into the Winter Soldier.', 2],
  ],
  'the-avengers': [
    ['easy', 'Who leads the alien army invading New York?', ['*Loki', 'Thanos', 'Ronan', 'Malekith'], 'Loki leads the Chitauri, on loan from Thanos.', 0],
    ['medium', 'What is the alien army called?', ['*The Chitauri', 'The Kree', 'The Skrulls', 'The Dark Elves'], 'They pour through a portal above Stark Tower.', 0],
    ['medium', 'Which object does Loki steal at the start of the film?', ['*The Tesseract', 'The Aether', 'The Orb', 'The Eye of Agamotto'], 'The Tesseract holds the Space Stone.', 0],
    ['medium', 'Whose death pushes the team to come together?', ['*Phil Coulson', 'Maria Hill', 'Erik Selvig', 'Jasper Sitwell'], 'Loki stabs Coulson on the Helicarrier.', 1],
    ['hard', 'Who is revealed in the mid-credits scene as the power behind Loki?', ['*Thanos', 'Ronan the Accuser', 'Ultron', 'Dormammu'], 'The first proper look at the Mad Titan.', 2],
  ],
  'iron-man-3': [
    ['medium', 'The "Mandarin" turns out to be…', ['*An actor named Trevor Slattery', 'Aldrich Killian', 'Wenwu', 'Justin Hammer'], 'Killian hired Slattery. The real Mandarin story comes in Shang-Chi.', 2],
    ['medium', 'Who is the real villain of Iron Man 3?', ['*Aldrich Killian', 'Trevor Slattery', 'Ivan Vanko', 'Obadiah Stane'], 'He runs A.I.M. and the Extremis programme.', 2],
  ],
  'thor-the-dark-world': [
    ['medium', 'Which Infinity Stone is the Aether?', ['*The Reality Stone', 'The Power Stone', 'The Soul Stone', 'The Mind Stone'], 'It ends up with the Collector.', 1],
    ['medium', 'Who leads the Dark Elves?', ['*Malekith', 'Kurse', 'Surtur', 'Laufey'], 'Malekith wants to plunge the universe back into darkness.', 0],
  ],
  'captain-america-the-winter-soldier': [
    ['easy', 'Who is the Winter Soldier?', ['*Bucky Barnes', 'Brock Rumlow', 'Helmut Zemo', 'John Walker'], 'Steve’s best friend, brainwashed by HYDRA.', 1],
    ['medium', 'What organisation is revealed to be hidden inside S.H.I.E.L.D.?', ['*HYDRA', 'A.I.M.', 'The Hand', 'The Red Room'], 'HYDRA had been growing inside S.H.I.E.L.D. since its founding.', 1],
    ['easy', 'Whom does Steve keep lapping on his morning run in Washington?', ['*Sam Wilson', 'Bucky Barnes', 'Clint Barton', 'Rhodey'], 'Sam later becomes Captain America.', 0],
    ['medium', 'What is the S.H.I.E.L.D. programme of three linked Helicarriers called?', ['*Project Insight', 'Project Pegasus', 'Project Rebirth', 'Operation Paperclip'], 'Its targeting algorithm would wipe out HYDRA’s threats.', 1],
    ['hard', 'Which senior S.H.I.E.L.D. official is secretly HYDRA?', ['*Alexander Pierce', 'Maria Hill', 'Nick Fury', 'Jasper Sitwell'], 'Robert Redford plays Pierce. Sitwell is HYDRA too, but Pierce runs it.', 2],
  ],
  'guardians-of-the-galaxy': [
    ['easy', 'What is the only thing Groot says?', ['*"I am Groot."', '"We are Groot."', '"Groot smash."', '"I am Root."'], 'Rocket is one of the few who understands what he means.', 0],
    ['medium', 'Which Infinity Stone is inside the Orb?', ['*The Power Stone', 'The Space Stone', 'The Reality Stone', 'The Time Stone'], 'The Guardians share its power to defeat Ronan.', 1],
    ['easy', 'What does Peter Quill call himself?', ['*Star-Lord', 'Star-Prince', 'Captain Quill', 'Space Ranger'], 'Legendary outlaw, to hear him tell it.', 0],
  ],
  'avengers-age-of-ultron': [
    ['easy', 'Who creates Ultron?', ['*Tony Stark and Bruce Banner', 'Hank Pym', 'Baron Strucker', 'Wanda Maximoff'], 'They build him from code found in Loki’s sceptre.', 0],
    ['medium', 'Which country does Ultron lift into the sky?', ['*Sokovia', 'Wakanda', 'Latveria', 'Madripoor'], 'Its destruction leads to the Sokovia Accords.', 1],
    ['medium', 'Which Infinity Stone sits in Vision’s forehead?', ['*The Mind Stone', 'The Soul Stone', 'The Space Stone', 'The Power Stone'], 'It came from Loki’s sceptre.', 1],
    ['medium', 'Which Maximoff twin dies in Sokovia?', ['*Pietro (Quicksilver)', 'Wanda (Scarlet Witch)', 'Both', 'Neither'], 'He shields Clint and a child from gunfire.', 2],
  ],
  'ant-man': [
    ['easy', 'Who gives Scott Lang the Ant-Man suit?', ['*Hank Pym', 'Darren Cross', 'Hope van Dyne', 'Tony Stark'], 'Pym recruits Scott for a heist.', 0],
    ['medium', 'Into what does Scott shrink to stop Yellowjacket?', ['*The Quantum Realm', 'The Dark Dimension', 'The Void', 'The Astral Plane'], 'He’s the first person known to come back from it.', 2],
    ['medium', 'Who becomes Yellowjacket?', ['*Darren Cross', 'Hank Pym', 'Ava Starr', 'Bill Foster'], 'Pym’s former protégé.', 1],
    ['easy', 'What is the name of Scott’s daughter?', ['*Cassie', 'Hope', 'Kate', 'Morgan'], 'Cassie Lang is confirmed for Doomsday.', 0],
  ],
  'captain-america-civil-war': [
    ['easy', 'Which agreement splits the Avengers?', ['*The Sokovia Accords', 'The Superhuman Registration Act', 'The Wakanda Treaty', 'The Avengers Charter'], 'They put the Avengers under UN oversight.', 0],
    ['medium', 'Who manipulates events from the shadows?', ['*Helmut Zemo', 'Alexander Pierce', 'Thaddeus Ross', 'Brock Rumlow'], 'Zemo wants revenge for Sokovia.', 1],
    ['medium', 'Which hero joins Team Iron Man at the airport and snatches Cap’s shield?', ['*Spider-Man', 'Black Panther', 'Vision', 'War Machine'], 'Peter Parker’s MCU debut.', 1],
    ['hard', 'What does Tony learn at the Siberian HYDRA base?', ['*Bucky killed his parents', 'Steve knew where Thanos was', 'Zemo built Ultron', 'Ross ordered the Raft'], 'Steve knew. That fight breaks the team.', 2],
    ['medium', 'Which king is killed in the bombing at the Vienna UN meeting?', ['*T’Chaka', 'T’Challa', 'M’Baku', 'N’Jobu'], 'His death pulls T’Challa into the story.', 1],
  ],
  'doctor-strange': [
    ['easy', 'What was Stephen Strange’s job before magic?', ['*Neurosurgeon', 'Physicist', 'Lawyer', 'Architect'], 'A car crash wrecked his hands.', 0],
    ['medium', 'Which Infinity Stone is inside the Eye of Agamotto?', ['*The Time Stone', 'The Mind Stone', 'The Soul Stone', 'The Reality Stone'], 'Strange later trades it to Thanos.', 1],
    ['medium', 'Which dark entity does Strange trap in a time loop?', ['*Dormammu', 'Kaecilius', 'Mephisto', 'Shuma-Gorath'], '"Dormammu, I’ve come to bargain."', 2],
  ],
  'guardians-of-the-galaxy-vol-2': [
    ['medium', 'Who is Peter Quill’s father?', ['*Ego', 'Yondu', 'The Collector', 'The High Evolutionary'], 'A Celestial who is literally a planet.', 1],
    ['hard', 'Who sacrifices himself to save Peter at the end?', ['*Yondu', 'Drax', 'Kraglin', 'Rocket'], '"He may have been your father, boy, but he wasn’t your daddy."', 2],
  ],
  'spider-man-homecoming': [
    ['medium', 'Who is the Vulture?', ['*Adrian Toomes', 'Herman Schultz', 'Mac Gargan', 'Quentin Beck'], 'A salvage contractor selling alien tech.', 1],
    ['easy', 'Who mentors Peter in Homecoming?', ['*Tony Stark', 'Steve Rogers', 'Nick Fury', 'Happy Hogan'], 'Tony gives Peter the Stark suit.', 0],
  ],
  'thor-ragnarok': [
    ['medium', 'Who is Hela?', ['*Odin’s firstborn and the goddess of death', 'Loki’s daughter', 'Queen of the Frost Giants', 'A Valkyrie'], 'Thor’s older sister.', 1],
    ['easy', 'On which planet does Thor fight the Hulk in an arena?', ['*Sakaar', 'Xandar', 'Titan', 'Vormir'], 'The Grandmaster runs the Contest of Champions there.', 0],
    ['medium', 'Who destroys Mjolnir?', ['*Hela', 'Surtur', 'Thanos', 'The Grandmaster'], 'She crushes it in one hand.', 1],
    ['medium', 'What happens to Asgard at the end?', ['*Surtur destroys it', 'Thanos destroys it', 'It is moved to Earth', 'Hela rules it'], 'Asgard is a people, not a place.', 2],
  ],
  'black-panther': [
    ['easy', 'What metal powers Wakanda?', ['*Vibranium', 'Adamantium', 'Uru', 'Carbonadium'], 'A vibranium meteorite struck Wakanda long ago.', 0],
    ['easy', 'What gives the Black Panther their powers?', ['*The Heart-Shaped Herb', 'Vibranium dust', 'The Super-Soldier Serum', 'The Space Stone'], 'The herb grew from vibranium-touched soil.', 0],
    ['medium', 'Who challenges T’Challa for the throne?', ['*Erik Killmonger', 'M’Baku', 'Ulysses Klaue', 'W’Kabi'], 'Killmonger is T’Challa’s cousin.', 1],
    ['easy', 'Who is T’Challa’s sister and Wakanda’s tech genius?', ['*Shuri', 'Nakia', 'Okoye', 'Ramonda'], 'Shuri is confirmed for Doomsday.', 0],
    ['medium', 'Which Wakandan tribe does M’Baku lead?', ['*The Jabari', 'The Border Tribe', 'The Merchant Tribe', 'The River Tribe'], 'The mountain tribe that rejects vibranium tech.', 0],
  ],
  'avengers-infinity-war': [
    ['easy', 'How many Infinity Stones are there?', ['*Six', 'Five', 'Seven', 'Nine'], 'Space, Mind, Reality, Power, Time, Soul.', 0],
    ['medium', 'Where is the Soul Stone hidden?', ['*Vormir', 'Titan', 'Knowhere', 'Nidavellir'], 'It demands a sacrifice of someone you love.', 1],
    ['medium', 'Whom does Thanos sacrifice for the Soul Stone?', ['*Gamora', 'Nebula', 'Loki', 'Vision'], 'His adopted daughter.', 2],
    ['medium', 'Where is the final battle fought?', ['*Wakanda', 'New York', 'Titan', 'Edinburgh'], 'The Avengers defend Vision there.', 1],
    ['hard', 'Which weapon does Thor forge at Nidavellir?', ['*Stormbreaker', 'Mjolnir', 'Jarnbjorn', 'The Infinity Gauntlet'], 'Eitri forges it with Thor holding the star open.', 1],
    ['easy', 'What does Thanos do once he has all six stones?', ['*Snaps and wipes out half of all life', 'Destroys Earth', 'Resurrects Gamora', 'Opens the multiverse'], 'The Snap, later called the Blip.', 2],
  ],
  'ant-man-and-the-wasp': [
    ['medium', 'Whom are Hank and Hope trying to rescue from the Quantum Realm?', ['*Janet van Dyne', 'Cassie Lang', 'Bill Foster', 'Kang'], 'Hope’s mother, lost for 30 years.', 0],
    ['medium', 'What is the name of the phasing villain?', ['*Ghost', 'Yellowjacket', 'Whiplash', 'Crossbones'], 'Ava Starr returns in Thunderbolts* and Doomsday.', 0],
  ],
  'captain-marvel': [
    ['easy', 'What do the Kree call Carol Danvers?', ['*Vers', 'Binary', 'Warbird', 'Mar-Vell'], 'She has no memory of her life on Earth.', 0],
    ['medium', 'What is Goose, really?', ['*A Flerken', 'A Skrull', 'A Kree spy', 'An ordinary cat'], 'She swallows the Tesseract.', 1],
    ['medium', 'Which shape-shifting race is at war with the Kree?', ['*The Skrulls', 'The Chitauri', 'The Sovereign', 'The Badoon'], 'They return in Secret Invasion.', 0],
  ],
  'avengers-endgame': [
    ['easy', 'How far does Endgame jump ahead after the Snap?', ['*Five years', 'One year', 'Ten years', 'Six months'], '"Five years later."', 1],
    ['medium', 'Who dies on Vormir in Endgame?', ['*Natasha Romanoff', 'Clint Barton', 'Nebula', 'Gamora'], 'She sacrifices herself for the Soul Stone.', 2],
    ['easy', 'Who, besides Thor, lifts Mjolnir in the final battle?', ['*Captain America', 'Captain Marvel', 'Vision', 'Scarlet Witch'], '"I knew it!"', 2],
    ['medium', 'Who uses the stones to defeat Thanos’ army?', ['*Tony Stark', 'Bruce Banner', 'Steve Rogers', 'Carol Danvers'], '"I am Iron Man." Tony pays with his life.', 2],
    ['medium', 'During the 2012 heist, who escapes with the Tesseract?', ['*Loki', 'Thanos', 'Red Skull', 'Nebula'], 'That escape creates the variant in the Loki series.', 2],
    ['easy', 'Who receives Captain America’s shield?', ['*Sam Wilson', 'Bucky Barnes', 'John Walker', 'Peggy Carter'], 'An older Steve passes it on.', 2],
    ['hard', 'Why do Tony and Steve travel to 1970?', ['*To get the Tesseract and more Pym Particles', 'To stop Thanos being born', 'To save Howard Stark', 'To find the Soul Stone'], 'Camp Lehigh, New Jersey.', 2],
  ],
  'spider-man-far-from-home': [
    ['medium', 'What is Mysterio’s real name?', ['*Quentin Beck', 'Adrian Toomes', 'Mac Gargan', 'Dmitri Smerdyakov'], 'A disgruntled ex-Stark employee using illusions.', 1],
    ['hard', 'What happens in the mid-credits scene?', ['*Peter’s identity is revealed to the world', 'Nick Fury is shown to be a Skrull', 'Venom arrives', 'Kang appears'], 'J. Jonah Jameson airs Beck’s doctored video.', 2],
  ],
  'black-widow': [
    ['medium', 'Who is Natasha’s "sister"?', ['*Yelena Belova', 'Melina Vostokoff', 'Antonia Dreykov', 'Kate Bishop'], 'Yelena leads the Thunderbolts later.', 0],
    ['easy', 'Who is the Red Guardian?', ['*Alexei Shostakov', 'Dreykov', 'Rick Mason', 'Ivan Vanko'], 'The Soviet answer to Captain America, played by David Harbour.', 0],
    ['medium', 'What programme trained the Black Widows?', ['*The Red Room', 'Project Insight', 'Weapon X', 'The Winter Soldier Program'], 'Run by General Dreykov.', 0],
    ['hard', 'Who approaches Yelena in the post-credits scene?', ['*Valentina Allegra de Fontaine', 'Nick Fury', 'Sharon Carter', 'Melina Vostokoff'], 'Val later assembles the Thunderbolts.', 2],
  ],
  'falcon-and-the-winter-soldier': [
    ['medium', 'Whom does the US government name the new Captain America?', ['*John Walker', 'Sam Wilson', 'Isaiah Bradley', 'Lemar Hoskins'], 'He later becomes US Agent.', 1],
    ['medium', 'Which veteran was secretly given the serum and imprisoned?', ['*Isaiah Bradley', 'Eli Bradley', 'Lemar Hoskins', 'Joaquin Torres'], 'His story shapes Sam’s decision about the shield.', 1],
    ['medium', 'Who leads the Flag Smashers?', ['*Karli Morgenthau', 'Sharon Carter', 'Valentina', 'Georges Batroc'], 'A super-soldier group fighting post-Blip borders.', 1],
    ['easy', 'What does Sam become by the finale?', ['*Captain America', 'The Falcon again', 'US Agent', 'Director of S.H.I.E.L.D.'], 'He takes up the shield.', 2],
    ['medium', 'Which Air Force lieutenant later becomes the new Falcon?', ['*Joaquin Torres', 'Rhodey', 'Lemar Hoskins', 'Eli Bradley'], 'Torres is confirmed for Doomsday.', 1],
  ],
  'loki-s1': [
    ['easy', 'Which organisation polices the Sacred Timeline?', ['*The Time Variance Authority', 'S.H.I.E.L.D.', 'S.W.O.R.D.', 'The Ten Rings'], 'The TVA prunes branch timelines.', 0],
    ['medium', 'Which TVA analyst partners with Loki?', ['*Mobius', 'Hunter B-15', 'Ravonna Renslayer', 'Casey'], 'Owen Wilson, jet-ski enthusiast.', 0],
    ['medium', 'Who is Sylvie?', ['*A variant of Loki', 'A TVA hunter', 'Odin’s daughter', 'An Asgardian sorceress'], 'She’s been hiding from the TVA her whole life.', 1],
    ['hard', 'Who is waiting at the Citadel at the End of Time?', ['*He Who Remains', 'Kang the Conqueror', 'Alioth', 'The Time-Keepers'], 'A variant of Kang.', 2],
    ['medium', 'What happens when Sylvie kills He Who Remains?', ['*The timeline branches into a multiverse', 'Time stops', 'The TVA is erased', 'Loki becomes king'], 'This is where the Multiverse Saga really begins.', 2],
  ],
  'loki-s2': [
    ['medium', 'Which TVA engineer helps fix the Temporal Loom?', ['*Ouroboros ("O.B.")', 'Mobius', 'Casey', 'Miss Minutes'], 'Played by Ke Huy Quan.', 0],
    ['hard', 'What does Loki do in the finale?', ['*Holds the branching timelines together from the End of Time', 'Destroys the multiverse', 'Becomes head of the TVA', 'Returns to Asgard'], 'He takes the throne as a sort of God of Stories.', 2],
  ],
  'what-if-s1': [
    ['easy', 'Who narrates What If…?', ['*The Watcher (Uatu)', 'Nick Fury', 'Loki', 'Doctor Strange'], 'He observes the multiverse and swears never to interfere.', 0],
    ['medium', 'In the first episode, who takes the Super-Soldier Serum instead of Steve?', ['*Peggy Carter', 'Bucky Barnes', 'Howard Stark', 'Sharon Carter'], 'She becomes Captain Carter.', 0],
  ],
  'shang-chi': [
    ['medium', 'Who is Shang-Chi’s father?', ['*Wenwu', 'Razor Fist', 'Trevor Slattery', 'Morris'], 'The real leader of the Ten Rings.', 0],
    ['medium', 'What is the name of the hidden village of his mother’s family?', ['*Ta Lo', 'K’un-Lun', 'Kamar-Taj', 'Talokan'], 'Home of mythical creatures and the Great Protector.', 1],
  ],
  eternals: [
    ['medium', 'What is the Celestial emerging from Earth called?', ['*Tiamut', 'Arishem', 'Ego', 'Knowhere'], 'Its frozen body becomes Celestial Island.', 2],
    ['easy', 'What are the Eternals?', ['*Ancient alien beings sent to protect Earth from Deviants', 'Human-engineered super-soldiers', 'Asgardian warriors', 'Kree soldiers'], 'Sent by the Celestial Arishem thousands of years ago.', 0],
    ['medium', 'Which Eternal can transmute matter, like turning weapons into bubbles?', ['*Sersi', 'Sprite', 'Thena', 'Ajak'], 'Gemma Chan’s character, who becomes the group’s de facto leader.', 0],
    ['easy', 'Who is the Eternals’ leader before Sersi, able to heal others?', ['*Ajak', 'Thena', 'Gilgamesh', 'Druig'], 'Salma Hayek’s character, killed by a Deviant early in the film.', 1],
    ['hard', 'What does Arishem do at the end of the film?', ['*Takes Sersi, Phastos and Kingo to judge humanity’s fate', 'Destroys Earth immediately', 'Rewards the Eternals with new powers', 'Erases their memories again'], 'A cliffhanger ending left unresolved on-screen.', 2],
  ],
  'spider-man-no-way-home': [
    ['medium', 'What is Doctor Strange’s spell meant to do?', ['*Make the world forget Peter is Spider-Man', 'Send Peter back in time', 'Open the multiverse on purpose', 'Banish the villains'], 'Peter interrupts it and the multiverse breaks.', 1],
    ['easy', 'How many Spider-Men fight in the final battle?', ['*Three', 'Two', 'Four', 'Five'], 'Three generations of web-slingers.', 2],
    ['medium', 'Which villain does Willem Dafoe play?', ['*Green Goblin', 'Doctor Octopus', 'Electro', 'Sandman'], 'Norman Osborn, from another universe.', 0],
  ],
  'doctor-strange-multiverse-of-madness': [
    ['medium', 'Which teenager can jump between universes?', ['*America Chavez', 'Kate Bishop', 'Kamala Khan', 'Riri Williams'], 'Wanda wants her power.', 0],
    ['medium', 'What is the book that corrupts Wanda?', ['*The Darkhold', 'The Book of Vishanti', 'The Book of Cagliostro', 'The Necronomicon'], 'She first used it in WandaVision.', 1],
    ['hard', 'Which X-Men leader sits on Earth-838’s Illuminati?', ['*Professor X', 'Magneto', 'Cyclops', 'Beast'], 'Patrick Stewart, who is back in Doomsday.', 1],
    ['medium', 'What is it called when two universes collide and destroy each other?', ['*An Incursion', 'A Nexus event', 'The Blip', 'A Convergence'], 'Incursions are at the centre of Doomsday’s plot.', 2],
  ],
  'thor-love-and-thunder': [
    ['medium', 'Who becomes the Mighty Thor?', ['*Jane Foster', 'Valkyrie', 'Sif', 'Darcy Lewis'], 'Mjolnir reforms for her.', 1],
    ['medium', 'What is Gorr’s title?', ['*The God Butcher', 'The Mad Titan', 'The Conqueror', 'The Destroyer'], 'Christian Bale’s villain.', 0],
  ],
  'black-panther-wakanda-forever': [
    ['easy', 'Who becomes the new Black Panther?', ['*Shuri', 'Okoye', 'Nakia', 'M’Baku'], 'Shuri is confirmed for Doomsday.', 2],
    ['medium', 'What is Namor’s underwater kingdom called?', ['*Talokan', 'Atlantis', 'Wakanda', 'Lemuria'], 'Rich in vibranium too.', 0],
    ['medium', 'Which Wakandan queen dies during the conflict with Talokan?', ['*Ramonda', 'Shuri', 'Okoye', 'Nakia'], 'Angela Bassett’s Queen Ramonda.', 2],
    ['hard', 'Who is revealed in the mid-credits scene?', ['*T’Challa’s son', 'Killmonger', 'Storm', 'White Wolf'], 'His name is Toussaint, or T’Challa.', 2],
  ],
  'ant-man-quantumania': [
    ['medium', 'Who rules the Quantum Realm in Quantumania?', ['*Kang the Conqueror', 'M.O.D.O.K.', 'Janet van Dyne', 'Ultron'], 'An exiled Kang.', 0],
    ['medium', 'Who turns out to be M.O.D.O.K.?', ['*Darren Cross', 'Hank Pym', 'Bill Foster', 'Ghost'], 'The former Yellowjacket.', 2],
    ['hard', 'What does the mid-credits scene reveal?', ['*A Council of Kangs', 'Doctor Doom', 'Galactus', 'The Fantastic Four'], 'Countless Kang variants assemble.', 2],
  ],
  'guardians-of-the-galaxy-vol-3': [
    ['medium', 'Who experimented on Rocket?', ['*The High Evolutionary', 'Ego', 'The Collector', 'Ronan'], 'He wanted to build a perfect society.', 0],
    ['medium', 'What does the High Evolutionary want from Rocket?', ['*The access code locked in his brain', 'His gun arm', 'His ship', 'His loyalty'], 'Rocket was one of his earliest, most successful experiments.', 1],
    ['medium', 'Who takes over as the Guardians’ leader at the end of the film?', ['*Rocket Raccoon', 'Peter Quill', 'Nebula', 'Kraglin'], 'Quill steps down to reunite with his grandfather on Earth.', 2],
    ['easy', 'Which new member officially joins the Guardians by the film’s end?', ['*Adam Warlock', 'Beta Ray Bill', 'Phyla-Vell', 'Moondragon'], 'He has a change of heart after Ayesha’s betrayal.', 2],
    ['hard', 'What does Rocket’s flashback reveal about his original "batch" of experiments?', ['*His friends Lylla, Teefs and Floor were killed trying to escape', 'He was created alone', 'He escaped with no losses', 'He was the High Evolutionary’s first success'], 'A gut-wrenching backstory for Rocket’s trauma.', 2],
  ],
  'the-marvels': [
    ['medium', 'Which hero keeps swapping places with Carol and Monica?', ['*Kamala Khan', 'Kate Bishop', 'Valkyrie', 'Nebula'], 'Their light-based powers get entangled.', 0],
    ['hard', 'In the mid-credits scene, Monica wakes up in a world with which X-Men?', ['*Beast (Kelsey Grammer)', 'Wolverine', 'Storm', 'Jean Grey'], 'Grammer’s Beast is confirmed for Doomsday.', 2],
  ],
  'deadpool-and-wolverine': [
    ['medium', 'Which organisation recruits Deadpool at the start?', ['*The TVA', 'S.H.I.E.L.D.', 'The X-Men', 'Weapon X'], 'Mr. Paradox wants to prune Deadpool’s universe.', 0],
    ['easy', 'Who is the "anchor being" of Deadpool’s universe?', ['*Wolverine (Logan)', 'Deadpool', 'Colossus', 'Professor X'], 'His death puts the universe at risk.', 1],
    ['medium', 'Who rules the Void?', ['*Cassandra Nova', 'Alioth', 'Sabretooth', 'He Who Remains'], 'Charles Xavier’s twin sister.', 1],
    ['medium', 'Which mutant does Channing Tatum finally get to play?', ['*Gambit', 'Cyclops', 'Pyro', 'Colossus'], 'Gambit is confirmed for Doomsday.', 1],
  ],
  'captain-america-brave-new-world': [
    ['easy', 'Who is Captain America in Brave New World?', ['*Sam Wilson', 'Steve Rogers', 'Bucky Barnes', 'John Walker'], 'Sam’s first film with the shield.', 0],
    ['medium', 'What does President Thaddeus Ross transform into?', ['*Red Hulk', 'Abomination', 'The Leader', 'Hulk'], 'Gamma exposure, engineered by Samuel Sterns.', 2],
    ['medium', 'Which metal is discovered on Celestial Island?', ['*Adamantium', 'Vibranium', 'Uru', 'Promethium'], 'It sparks a global scramble.', 1],
    ['medium', 'Who is the new Falcon?', ['*Joaquin Torres', 'Bucky Barnes', 'Rhodey', 'Isaiah Bradley'], 'Confirmed for Doomsday.', 0],
    ['hard', 'Who is the mastermind behind the manipulation in Brave New World?', ['*Samuel Sterns (The Leader)', 'Thaddeus Ross', 'Sidewinder', 'Valentina'], 'Last seen in The Incredible Hulk.', 2],
  ],
  thunderbolts: [
    ['easy', 'Which Avenger fights alongside the Thunderbolts?', ['*Bucky Barnes', 'Sam Wilson', 'Clint Barton', 'Scott Lang'], 'Bucky is a congressman by this point.', 0],
    ['medium', 'What is John Walker’s codename?', ['*US Agent', 'Captain America', 'Battlestar', 'Patriot'], 'Wyatt Russell, confirmed for Doomsday.', 0],
    ['medium', 'What is the dark side of Bob’s powers called?', ['*The Void', 'The Darkhold', 'The Dark Dimension', 'Knull'], 'Bob is also the Sentry.', 2],
    ['medium', 'What is the team branded as at the end of the film?', ['*The New Avengers', 'The Dark Avengers', 'The Secret Avengers', 'The Young Avengers'], 'That’s what the asterisk was about.', 2],
    ['medium', 'Who leads the team in Thunderbolts*?', ['*Yelena Belova', 'Bucky Barnes', 'Red Guardian', 'Valentina'], 'Florence Pugh, confirmed for Doomsday.', 0],
  ],
  'fantastic-four-first-steps': [
    ['easy', 'Who comes to devour the Fantastic Four’s Earth?', ['*Galactus', 'Doctor Doom', 'Annihilus', 'The Mole Man'], 'The World Devourer.', 0],
    ['medium', 'Who is Galactus’ herald in First Steps?', ['*The Silver Surfer (Shalla-Bal)', 'Terrax', 'Firelord', 'Nova'], 'Played by Julia Garner.', 0],
    ['medium', 'What is Reed and Sue’s baby called?', ['*Franklin', 'Valeria', 'Johnny', 'Benjamin'], 'Galactus wants him.', 1],
    ['easy', 'Who is the Thing?', ['*Ben Grimm', 'Johnny Storm', 'Reed Richards', 'H.E.R.B.I.E.'], 'Ebon Moss-Bachrach, confirmed for Doomsday.', 0],
    ['medium', 'What is the family’s helper robot called?', ['*H.E.R.B.I.E.', 'J.A.R.V.I.S.', 'F.R.I.D.A.Y.', 'K.A.R.E.N.'], 'Humanoid Experimental Robot-B Type Integrated Electronics.', 0],
  ],
  wandavision: [
    ['medium', 'What is the name of the town Wanda takes over?', ['*Westview', 'Leonia', 'Greenwich', 'Riverdale'], 'In New Jersey.', 0],
    ['medium', 'Who is "Agnes" really?', ['*Agatha Harkness', 'Monica Rambeau', 'Darcy Lewis', 'Sharon Carter'], '"It was Agatha all along."', 2],
    ['hard', 'Which agency is monitoring Westview?', ['*S.W.O.R.D.', 'S.H.I.E.L.D.', 'The TVA', 'Damage Control'], 'Led by Director Hayward.', 1],
  ],
  hawkeye: [
    ['easy', 'Who becomes Clint Barton’s protégé?', ['*Kate Bishop', 'Yelena Belova', 'Maya Lopez', 'Cassie Lang'], 'An archer who idolised Hawkeye since 2012.', 0],
    ['medium', 'What does Kate Bishop accidentally put on at a charity auction?', ['*Ronin’s old suit', 'Captain America’s shield', 'Black Widow’s suit', 'The Winter Soldier’s arm'], 'It drags her into the Tracksuit Mafia’s orbit.', 0],
    ['easy', 'Who is revealed as the secret head of the Tracksuit Mafia?', ['*Eleanor Bishop, Kate’s mother', 'Jack Duquesne', 'Maya Lopez', 'Yelena Belova'], 'A twist involving Kate’s own family.', 2],
    ['medium', 'Who confronts Clint, believing he is responsible for her sister’s death?', ['*Yelena Belova', 'Kate Bishop', 'Maya Lopez', 'Eleanor Bishop'], 'She blames Clint for Natasha’s sacrifice before learning the truth.', 1],
    ['hard', 'Who is revealed as the true crime boss, the Kingpin, at the end?', ['*Wilson Fisk', 'Jack Duquesne', 'Eleanor Bishop', 'Maya Lopez'], 'Vincent D’Onofrio reprises his Daredevil role in the MCU.', 2],
  ],
  'ms-marvel': [
    ['easy', 'Who is Kamala Khan’s biggest hero?', ['*Captain Marvel', 'Iron Man', 'Thor', 'Black Widow'], 'She writes fan fiction about her.', 0],
    ['easy', 'What gives Kamala her powers?', ['*A mysterious bangle passed down through her family', 'A cosmic ray accident', 'Mutant genetics alone', 'Terrigen Mist'], 'The bangle unlocks powers tied to her great-grandmother Aisha.', 0],
    ['medium', 'What group is secretly hunting Kamala for her powers?', ['*The Department of Damage Control', 'HYDRA', 'The Ten Rings', 'A.I.M.'], 'A government group also seen in Spider-Man: Far From Home.', 0],
    ['easy', 'What is Kamala’s superhero name in the show?', ['*Ms. Marvel', 'Captain Marvel', 'Miss America', 'Spider-Woman'], 'A tribute to her idol, Carol Danvers.', 0],
    ['hard', 'What does the finale reveal about Kamala’s heritage?', ['*She is a mutant, awakening X-gene-like powers', 'She is secretly Kree', 'She is related to Carol Danvers', 'She loses her powers'], 'A surprise tag teasing the mutant side of the MCU.', 2],
  ],
  'secret-invasion': [
    ['easy', 'Which race secretly infiltrates Earth in Secret Invasion?', ['*Skrulls', 'Kree', 'Chitauri', 'Celestials'], 'A rogue Skrull faction led by Gravik.', 0],
    ['medium', 'Which Skrull leads the rogue faction invading Earth?', ['*Gravik', 'Talos', 'Fury', 'G’iah'], 'A former Fury protégé who grows impatient waiting for a Skrull homeworld.', 0],
    ['medium', 'What does Gravik want to use to create super-powered Skrulls?', ['*Extracted Super-Skrull DNA experiments', 'The Darkhold', 'Pym Particles', 'The Tesseract'], 'Mirroring the comics’ Super-Skrull concept.', 1],
    ['easy', 'Who becomes President of the United States during the crisis?', ['*Ritson', 'Thaddeus Ross', 'Valentina Allegra de Fontaine', 'Everett Ross'], 'A hardline president who escalates tensions with Russia.', 0],
    ['hard', 'What dark twist is revealed about Maria Hill at the end of the series?', ['*She was a Skrull impersonator; the real Hill died earlier', 'She defects to Gravik', 'She retires from S.H.I.E.L.D.', 'She becomes Fury’s successor'], 'Revealed in her death scene.', 2],
  ],
  'x-men': [
    ['easy', 'Who founded the school where the X-Men train?', ['*Charles Xavier', 'Erik Lehnsherr', 'Hank McCoy', 'Jean Grey'], 'Xavier’s School for Gifted Youngsters.', 0],
    ['medium', 'What is Magneto’s real name?', ['*Erik Lehnsherr', 'Max Eisenhardt', 'Victor Creed', 'William Stryker'], 'Ian McKellen returns as Magneto in Doomsday.', 0],
    ['medium', 'Where is the climactic battle of X-Men (2000)?', ['*The Statue of Liberty', 'Alcatraz', 'The Pentagon', 'Alkali Lake'], 'Magneto plans to mutate world leaders nearby.', 2],
  ],
  x2: [
    ['medium', 'Which mutant attacks the White House at the start of X2?', ['*Nightcrawler', 'Mystique', 'Pyro', 'Lady Deathstrike'], 'Under William Stryker’s mind control.', 0],
    ['medium', 'Who leads the military raid on the X-Mansion?', ['*William Stryker', 'Bolivar Trask', 'Senator Kelly', 'Magneto'], 'Wolverine’s past is tied to him.', 1],
    ['hard', 'Who sacrifices herself at Alkali Lake?', ['*Jean Grey', 'Storm', 'Rogue', 'Mystique'], 'She returns as the Phoenix.', 2],
  ],
  'x-men-the-last-stand': [
    ['medium', 'Jean Grey returns as…', ['*The Phoenix', 'Shadow King', 'Marvel Girl', 'White Queen'], 'Her power is unleashed.', 1],
    ['medium', 'The mutant "cure" is derived from which boy?', ['*Leech', 'Jubilee', 'Iceman', 'Pyro'], 'His power cancels other mutants’ abilities.', 1],
    ['medium', 'What government role does Hank McCoy (Beast) hold?', ['*Secretary of Mutant Affairs', 'Senator', 'Director of S.H.I.E.L.D.', 'Ambassador to the UN'], 'Kelsey Grammer returns as Beast in Doomsday.', 0],
  ],
  'x-men-days-of-future-past': [
    ['medium', 'Who is sent back in time?', ['*Wolverine', 'Kitty Pryde', 'Professor X', 'Bishop'], 'His mind goes back to his 1973 body.', 0],
    ['medium', 'To which year?', ['*1973', '1962', '1983', '1999'], 'Right after the Vietnam War.', 0],
    ['medium', 'What are the mutant-hunting robots called?', ['*Sentinels', 'Ultrons', 'Mandroids', 'Doombots'], 'Designed by Bolivar Trask.', 0],
    ['hard', 'Whose assassination of Trask must be stopped?', ['*Mystique', 'Magneto', 'Beast', 'Quicksilver'], 'Her capture gives the Sentinels her DNA.', 1],
  ],
  'x-men-first-class': [
    ['easy', 'What historical crisis forms the backdrop of X-Men: First Class?', ['*The Cuban Missile Crisis', 'The Cold War Space Race', 'World War II', 'The Vietnam War'], 'Sebastian Shaw tries to trigger nuclear war between the US and USSR.', 0],
    ['medium', 'Who is the villain manipulating both superpowers into war?', ['*Sebastian Shaw', 'William Stryker', 'Bolivar Trask', 'Mister Sinister'], 'Kevin Bacon plays the Hellfire Club leader.', 1],
    ['hard', 'What causes the rift between Charles and Erik at the film’s end?', ['*Erik deflects a bullet that paralyzes Charles', 'Erik kills Moira MacTaggert', 'Charles destroys Cerebro', 'Erik abandons the team'], 'A stray bullet meant for Shaw hits Charles instead, leaving him paralyzed.', 2],
    ['easy', 'What does Erik call himself by the end of the film?', ['*Magneto', 'Master Magnet', 'The Metal Man', 'Iron Will'], 'He takes the name after breaking from Xavier.', 2],
    ['medium', 'Which young mutant becomes Mystique in this film?', ['*Raven Darkhölme', 'Emma Frost', 'Angel Salvadore', 'Moira MacTaggert'], 'Jennifer Lawrence plays young Raven, Rebecca Romijn’s role in the original trilogy.', 0],
  ],
  'x-men-origins-wolverine': [
    ['easy', 'What metal is bonded to Logan’s skeleton in the Weapon X program?', ['*Adamantium', 'Vibranium', 'Promethium', 'Uru'], 'The experiment also wipes most of his memory.', 1],
    ['medium', 'Who is Logan’s half-brother in the film?', ['*Victor Creed, Sabretooth', 'William Stryker', 'Gambit', 'Deadpool'], 'The two have fought together for over a century before falling out.', 0],
    ['medium', 'Which mutant is experimented on to become "Weapon XI"?', ['*Wade Wilson', 'Victor Creed', 'John Wraith', 'Chris Bradley'], 'An early, much-mocked version of Deadpool.', 2],
    ['easy', 'Who runs the Weapon X program?', ['*William Stryker', 'Bolivar Trask', 'Nathaniel Essex', 'Charles Xavier'], 'He appears again, years earlier, in X2.', 1],
    ['hard', 'What does the mid-credits scene tease about Wade Wilson?', ['*That he survives, with his mouth sewn shut', 'That he becomes Weapon X’s new leader', 'That he dies for good', 'That he joins the X-Men'], 'Setting up his eventual solo Deadpool film.', 2],
  ],
  'the-wolverine': [
    ['easy', 'Where is most of The Wolverine set?', ['*Japan', 'Canada', 'Germany', 'Russia'], 'Logan is summoned to say goodbye to a dying friend he saved in WWII.', 0],
    ['medium', 'What does Yashida’s technology temporarily strip from Logan?', ['*His healing factor', 'His claws', 'His memory', 'His strength'], 'A device keeps him from healing, making him vulnerable for the first time in decades.', 1],
    ['medium', 'Who helps Yashida try to steal Logan’s healing factor?', ['*Dr. Viper, a mutant toxicologist', 'Mariko Yashida', 'Harada', 'Professor X'], 'She poses as a kindly doctor.', 2],
    ['easy', 'Who does Logan protect throughout the film?', ['*Mariko Yashida', 'Jean Grey', 'Mystique', 'Itsu'], 'Yashida’s granddaughter and heir.', 1],
    ['hard', 'What does the mid-credits scene set up?', ['*Days of Future Past', 'Apocalypse', 'Logan (2017)', 'Deadpool'], 'Magneto and Professor X approach Logan at an airport.', 2],
  ],
  'x-men-apocalypse': [
    ['easy', 'Who is the ancient mutant villain awakened in the film?', ['*En Sabah Nur, Apocalypse', 'Mister Sinister', 'Sebastian Shaw', 'Mojo'], 'The "first mutant," worshipped as a god in ancient Egypt.', 0],
    ['medium', 'Which young mutant joins Apocalypse’s Four Horsemen under duress?', ['*Magneto', 'Mystique', 'Quicksilver', 'Beast'], 'Apocalypse manipulates Erik after his family is killed.', 1],
    ['medium', 'Who destroys Apocalypse’s stronghold using her powers at full strength for the first time?', ['*Jean Grey', 'Storm', 'Mystique', 'Jubilee'], 'A tease of her Phoenix power.', 2],
    ['easy', 'Which mutant speedster rescues students from an exploding mansion?', ['*Quicksilver', 'Nightcrawler', 'Angel', 'Banshee'], 'A fan-favorite slow-motion sequence, echoing Days of Future Past.', 1],
    ['medium', 'Where does the climactic battle take place?', ['*Cairo, Egypt', 'New York City', 'Alkali Lake', 'Genosha'], 'Apocalypse tries to transfer his consciousness into Xavier’s body.', 2],
  ],
  'dark-phoenix': [
    ['easy', 'What cosmic force takes over Jean Grey in this film?', ['*The Phoenix Force', 'The Darkhold', 'The Mind Stone', 'The Void'], 'A solar-flare-like entity she absorbs during a space rescue mission.', 0],
    ['medium', 'Which alien race tries to harness the Phoenix Force for themselves?', ['*The D’Bari', 'The Skrulls', 'The Kree', 'The Shi’ar'], 'Led by Vuk, who shapeshifts to manipulate Jean.', 1],
    ['medium', 'Who dies protecting the team during the Phoenix’s rampage?', ['*Mystique', 'Beast', 'Storm', 'Nightcrawler'], 'Her death pushes Hank McCoy toward revenge.', 2],
    ['easy', 'What kind of mission goes wrong at the start of the film?', ['*A space shuttle rescue', 'A deep-sea rescue', 'A satellite repair', 'A Moon landing'], 'The X-Men save astronauts, and Jean absorbs the Phoenix Force in the process.', 0],
    ['hard', 'What happens to the X-Men team by the end of this film?', ['*They disband after Jean’s sacrifice', 'They move to Genosha', 'They merge with the Avengers', 'They are all arrested'], 'The last film of the original Fox X-Men timeline.', 2],
  ],
  deadpool: [
    ['easy', 'What gives Wade Wilson his healing factor and scarred appearance?', ['*A torturous experiment meant to create super-soldiers', 'A spider bite', 'Gamma radiation', 'The Super Soldier Serum'], 'Run by the villain Ajax.', 1],
    ['medium', 'What is the real name of the villain Ajax?', ['*Francis Freeman', 'Wade Wilson', 'Weasel', 'Dopinder'], 'He runs the black-site lab that experiments on Wade.', 1],
    ['easy', 'Which X-Men characters help Deadpool in the final battle?', ['*Colossus and Negasonic Teenage Warhead', 'Wolverine and Cyclops', 'Storm and Beast', 'Professor X and Magneto'], 'Deadpool jokes about Marvel’s budget for more X-Men.', 0],
    ['medium', 'What happens to Wade’s disfigurement by the end of the film?', ['*Nothing fixes it; he accepts his new look', 'He gets plastic surgery', 'He finds a cure from Xavier', 'He steals Mystique’s powers'], 'The film plays this for dark comedy throughout.', 1],
    ['hard', 'Who is Wade proposing to when the opening action sequence interrupts the timeline?', ['*Vanessa', 'Weasel', 'Blind Al', 'Angel Dust'], 'Flashbacks reveal their relationship before his transformation.', 1],
  ],
  'deadpool-2': [
    ['easy', 'Who is the time-travelling soldier hunting Russell, "Firefist"?', ['*Cable', 'Domino', 'Juggernaut', 'Shatterstar'], 'Josh Brolin plays Cable here, shortly after playing Thanos.', 0],
    ['medium', 'What is Domino’s mutant power?', ['*Probability manipulation, pure luck', 'Teleportation', 'Super strength', 'Telepathy'], 'She’s "lucky," which looks spectacular in action.', 0],
    ['medium', 'What tragedy motivates Deadpool at the start of the film?', ['*Vanessa is killed', 'Weasel betrays him', 'He loses his powers', 'Colossus quits the X-Men'], 'He tries, and fails, to end his own life afterward.', 2],
    ['easy', 'Which young mutant is Deadpool trying to protect and reform?', ['*Russell "Firefist" Collins', 'Wade Jr.', 'Hope Summers', 'Ellie Phimister'], 'An orphan with fire powers being targeted by Cable.', 0],
    ['hard', 'How does Deadpool ultimately fix the future for Cable?', ['*He time-travels to stop Vanessa’s death and other tragedies', 'He kills Cable', 'He joins the X-Force permanently', 'He erases his own memory'], 'A time-loop finale that also revives several X-Force members as a joke.', 2],
  ],
  'spider-man-2002': [
    ['easy', 'How does Peter Parker get his powers?', ['*Bitten by a genetically modified spider', 'Exposure to gamma radiation', 'A lab accident with Pym Particles', 'Born with mutant genes'], 'On a school field trip to a genetics lab.', 0],
    ['medium', 'Who is the Green Goblin?', ['*Norman Osborn', 'Harry Osborn', 'Otto Octavius', 'Flint Marko'], 'Peter’s best friend’s father, driven mad by his own formula.', 0],
    ['medium', 'What company does Norman Osborn run?', ['*Oscorp', 'Stark Industries', 'Roxxon', 'Alchemax'], 'He tests an experimental performance-enhancing formula on himself.', 0],
    ['easy', 'Who does Peter have feelings for throughout the film?', ['*Mary Jane Watson', 'Gwen Stacy', 'Felicia Hardy', 'Liz Allan'], 'His neighbor and longtime crush.', 0],
    ['hard', 'How does the Green Goblin die?', ['*Impaled by his own glider, redirected by Spider-Man', 'Falls from a bridge', 'Explodes in his lab', 'Arrested by police'], 'Peter keeps his secret and promises Harry he didn’t kill his father.', 2],
  ],
  'spider-man-2': [
    ['easy', 'Who is the villain Doctor Octopus in this film?', ['*Otto Octavius', 'Norman Osborn', 'Curt Connors', 'Max Dillon'], 'A fusion experiment fuses mechanical arms to his spine and corrupts his mind.', 0],
    ['medium', 'What rare element powers Octavius’s fusion experiment?', ['*Tritium', 'Vibranium', 'Adamantium', 'Palladium'], 'The experiment goes wrong and kills his wife.', 1],
    ['medium', 'Why does Peter briefly lose his powers partway through the film?', ['*A psychosomatic crisis over his double life', 'He is poisoned by Octavius', 'He loses his mask', 'Mary Jane rejects him publicly'], 'His doubts make his powers falter until he recommits.', 1],
    ['easy', 'Who nearly learns Peter’s secret identity in this film?', ['*Mary Jane Watson', 'Harry Osborn', 'J. Jonah Jameson', 'Aunt May'], 'Both MJ and Harry get close to the truth.', 2],
    ['hard', 'How does Doctor Octopus ultimately redeem himself?', ['*He sacrifices himself to sink his own fusion reactor', 'He is defeated by Harry Osborn', 'He joins Spider-Man', 'He is arrested by police'], 'Seeing Peter unmasked snaps him briefly out of Octavius’s rage.', 2],
  ],
  'spider-man-3': [
    ['easy', 'What alien substance bonds with Peter Parker in this film?', ['*The symbiote, which becomes Venom', 'Kryptonite', 'Pym Particles', 'Vibranium'], 'It arrives on a meteorite and amplifies his darker impulses.', 0],
    ['medium', 'Who becomes Sandman in this film?', ['*Flint Marko', 'Eddie Brock', 'Harry Osborn', 'Curt Connors'], 'A prison escapee caught in a sand-manipulation experiment, also revealed as Uncle Ben’s real killer.', 0],
    ['medium', 'Who does the symbiote abandon Peter for, becoming Venom?', ['*Eddie Brock', 'Harry Osborn', 'Flint Marko', 'J. Jonah Jameson'], 'Peter’s photography rival at the Daily Bugle.', 1],
    ['easy', 'What identity does Harry Osborn take on to fight Peter?', ['*The New Goblin', 'The Hobgoblin', 'Green Goblin II', 'Venom'], 'Using his father’s old equipment.', 0],
    ['hard', 'How is Sandman’s story ultimately resolved?', ['*He admits killing Ben accidentally and leaves peacefully after Peter forgives him', 'He is arrested', 'He dies in an explosion', 'He is captured by the Goblin'], 'A surprisingly sympathetic, non-violent resolution.', 2],
  ],
  'the-amazing-spider-man': [
    ['easy', 'What company did Peter’s father work for before disappearing?', ['*Oscorp', 'Stark Industries', 'Horizon Labs', 'Alchemax'], 'His research into cross-species genetics drives the plot.', 0],
    ['medium', 'Who is the villain "The Lizard"?', ['*Dr. Curt Connors', 'Norman Osborn', 'Otto Octavius', 'Flint Marko'], 'He experiments on himself with reptile DNA to regrow his missing arm.', 0],
    ['hard', 'What happens to Captain Stacy, Gwen’s father?', ['*He dies protecting the city, extracting a promise from Peter to stay away from Gwen', 'He arrests Peter', 'He becomes the Lizard’s ally', 'He retires'], 'Peter struggles to keep this promise in the sequel.', 2],
    ['easy', 'Who does Peter fall for in this film?', ['*Gwen Stacy', 'Mary Jane Watson', 'Felicia Hardy', 'Liz Allan'], 'Emma Stone’s take on the classic Spider-Man love interest.', 0],
    ['hard', 'What does the mid-credits scene tease?', ['*A mysterious figure asking Connors about Peter’s father’s other "children"', 'The arrival of Venom', 'The Sinister Six forming', 'Peter’s death'], 'A dangling plot thread never fully resolved in this series.', 2],
  ],
  'the-amazing-spider-man-2': [
    ['easy', 'Who is the villain Electro in this film?', ['*Max Dillon', 'Harry Osborn', 'Aleksei Sytsevich', 'Felicia Hardy'], 'An Oscorp engineer who falls into a tank of genetically altered electric eels.', 0],
    ['medium', 'What does Harry Osborn become by the film’s end?', ['*The Green Goblin', 'The Hobgoblin', 'Electro’s ally only', 'Venom'], 'He injects himself with a formula that drives him mad, like his father.', 0],
    ['hard', 'What tragic event closes out this film?', ['*Gwen Stacy’s death', 'Peter’s death', 'Aunt May’s death', 'Harry’s redemption'], 'A direct adaptation of the classic comic storyline "The Night Gwen Stacy Died."', 2],
    ['medium', 'Who appears briefly as the Rhino, in a mech suit?', ['*Aleksei Sytsevich', 'Max Dillon', 'Harry Osborn', 'Felicia Hardy'], 'Teased for a planned, later scrapped, Sinister Six film.', 1],
    ['hard', 'What organization is revealed to be tracking super-powered people throughout the film?', ['*Oscorp, continuing Richard Parker’s research', 'S.H.I.E.L.D.', 'Damage Control', 'Alchemax'], 'Part of the "Spider-Man universe" world-building this series attempted.', 1],
  ],
  'moon-knight': [
    ['easy', 'Which Egyptian god shares Steven Grant’s body?', ['*Khonshu', 'Ammit', 'Taweret', 'Horus'], 'The moon god of vengeance, who needs a human avatar.', 0],
    ['medium', 'What does the show explore through Steven and Marc sharing one body?', ['*Dissociative identity disorder', 'PTSD alone', 'Amnesia', 'Schizophrenia'], 'Steven and Marc Spector are alternate personalities.', 1],
    ['medium', 'Who is the villain trying to free the goddess Ammit?', ['*Arthur Harrow', 'Khonshu', 'Taweret', 'Anton Mogart'], 'A former avatar of Khonshu turned zealot.', 0],
    ['easy', 'Which goddess guides souls through the Duat, the afterlife?', ['*Taweret', 'Ammit', 'Isis', 'Bastet'], 'She appears as a hippo-headed guide.', 1],
    ['hard', 'Who is revealed as a third personality at the end of the season?', ['*Jake Lockley', 'Harrow', 'Layla El-Faouly', 'Khonshu himself'], 'A mid-credits stinger reveals a third alter alongside Steven and Marc.', 2],
  ],
  'she-hulk': [
    ['easy', 'How does Jennifer Walters get Hulk-like powers?', ['*Bruce Banner’s blood enters her bloodstream in a car accident', 'Direct gamma radiation exposure', 'A lab experiment', 'A bite from a gamma-irradiated animal'], 'Unlike Bruce, she quickly gains control over her transformation.', 0],
    ['medium', 'What is Jennifer’s profession before becoming She-Hulk?', ['*A lawyer', 'A doctor', 'A journalist', 'A police officer'], 'She later specializes in superhuman law.', 0],
    ['medium', 'Which gamma-powered villain from a 2008 film returns in this series?', ['*Emil Blonsky, the Abomination', 'Samuel Sterns', 'Thaddeus Ross', 'Betty Ross'], 'Tim Roth reprises his role from The Incredible Hulk.', 0],
    ['easy', 'What does the finale controversially do?', ['*Jen breaks the fourth wall and rewrites the episode herself', 'Jen loses her powers forever', 'Jen joins the Avengers', 'Jen marries Daredevil'], 'A meta finale where Jen confronts the show’s own writers’ room.', 2],
    ['hard', 'Which MCU hero does Jen share a brief romance with in the series?', ['*Matt Murdock, Daredevil', 'Sam Wilson', 'Scott Lang', 'Steven Grant'], 'Charlie Cox reprises Daredevil for a crossover episode.', 1],
  ],
  'x-men-97': [
    ['easy', 'X-Men \'97 continues which 1990s animated series?', ['*X-Men: The Animated Series', 'Spider-Man: The Animated Series', 'The Avengers: United They Stand', 'Iron Man: The Animated Series'], 'It picks up right after the original show’s finale.', 0],
    ['medium', 'Who leads the X-Men after Professor X disappears at the start of the series?', ['*Cyclops and Storm', 'Wolverine', 'Magneto', 'Jean Grey'], 'Scott and Ororo share leadership duties.', 0],
    ['medium', 'Which villain manipulates humanity against mutants?', ['*Bastion', 'Apocalypse', 'Mister Sinister', 'Juggernaut'], 'A techno-organic fusion of Nimrod and a human senator.', 1],
    ['easy', 'Who unexpectedly joins the X-Men as headmaster for a time?', ['*Magneto', 'Mister Sinister', 'Apocalypse', 'Sabretooth'], 'A surprising twist carried over from the comics.', 0],
    ['hard', 'What tragedy strikes Genosha midway through the season?', ['*Bastion’s forces commit genocide against the mutant population', 'An alien invasion destroys it', 'Magneto blows it up', 'It sinks into the ocean'], 'A gut-punch episode echoing the comics’ "Age of Apocalypse" build-up.', 2],
  ],
  'agatha-all-along': [
    ['easy', 'What path do Agatha and her coven walk to try to regain their powers?', ['*The Witches’ Road', 'The Darkhold Trail', 'The Scarlet Path', 'The Ley Line'], 'A mystical road that tests, and sometimes kills, witches who walk it.', 0],
    ['medium', 'Who is revealed to be the mysterious teen traveling with Agatha?', ['*Billy Kaplan, Wanda’s son', 'A random runaway', 'Agatha’s own son', 'A Darkhold cultist'], 'He’s searching for his identity as Wiccan.', 1],
    ['hard', 'What is Agatha’s greatest fear, personified on the Road?', ['*Being alone, having no one', 'Death', 'Losing her magic', 'Being exposed as a fraud'], 'Her trial on the Road forces her to confront isolation.', 2],
    ['medium', 'Who are the members of Agatha’s coven?', ['*Jennifer Kale, Lilia Calderu, Alice Wu-Gulliver, and Sharon Davis', 'The Scarlet Witch and Mephisto', 'Wanda and Vision', 'Darkhold cultists'], 'A mismatched group of witches, each with a secret.', 1],
    ['hard', 'What happens to Agatha at the end of the season?', ['*She dies, but her spirit lingers to guide Billy', 'She becomes the new Scarlet Witch', 'She is imprisoned by S.W.O.R.D.', 'She disappears into the Darkhold'], 'A bittersweet ending that sets up Billy’s future as Wiccan.', 2],
  ],
  logan: [
    ['easy', 'What year is Logan set in?', ['*2029', '2023', '2035', '2017'], 'A near-future where most mutants are gone.', 0],
    ['medium', 'Who is Laura Kinney, the girl Logan protects?', ['*X-23, a clone with powers like his own', 'Jean Grey’s daughter', 'Rogue’s sister', 'A random runaway'], 'Created from Logan’s own DNA by Alkali-Transigen.', 0],
    ['medium', 'What illness is slowly killing Professor X in this film?', ['*A degenerative brain condition affecting his telepathy', 'Cancer', 'Adamantium poisoning', 'Old age alone'], 'His unstable mind becomes a danger to everyone nearby.', 1],
    ['easy', 'Who is the main antagonist pursuing Laura?', ['*Donald Pierce and the Reavers', 'Magneto', 'William Stryker', 'Mister Sinister'], 'A cybernetic mercenary working for Transigen.', 0],
    ['hard', 'How does Logan die?', ['*Impaled protecting Laura from his own clone, X-24', 'Shot by Pierce', 'Old age', 'Sacrificing himself in an explosion'], 'His final act of fatherhood; Laura turns his grave cross on its side into an X.', 2],
  ],
  echo: [
    ['easy', 'Who is the main character of Echo?', ['*Maya Lopez', 'Kate Bishop', 'Yelena Belova', 'Jessica Jones'], 'A deaf Native American woman trained as an assassin.', 0],
    ['medium', 'Which crime boss does Maya betray at the start of the series?', ['*Wilson Fisk, Kingpin', 'Gravik', 'Madame Masque', 'Scorpion'], 'Her surrogate father figure, whom she shoots and leaves for dead.', 0],
    ['medium', 'What community does Maya return to for strength and healing?', ['*Her Choctaw family and community in Oklahoma', 'The Tracksuit Mafia', 'S.H.I.E.L.D.', 'The Fisk family'], 'The show leans heavily into her Native American heritage.', 1],
    ['easy', 'Which MCU hero cameos to confront Maya near the end?', ['*Daredevil, Matt Murdock', 'Hawkeye', 'Black Widow', 'Moon Knight'], 'Setting up Daredevil: Born Again.', 2],
    ['hard', 'Does Wilson Fisk actually die from Maya’s shooting?', ['*No, he survives and later confronts her', 'Yes, permanently', 'He is left in a coma', 'He loses his memory'], 'He returns for a tense sit-down with Maya.', 2],
  ],
  'werewolf-by-night': [
    ['easy', 'What is the setting of Werewolf by Night?', ['*A gathering of monster hunters at a mansion', 'A modern city', 'Ancient Egypt', 'A circus'], 'Hunters compete for a powerful relic after their leader’s death.', 0],
    ['medium', 'Who is the special’s main character, secretly a werewolf?', ['*Jack Russell', 'Elsa Bloodstone', 'Ted, the Man-Thing', 'Verussa Bloodstone'], 'He hides his curse from the other hunters.', 0],
    ['medium', 'What creature does Jack bond with and protect during the hunt?', ['*Man-Thing, Ted', 'A vampire', 'A gargoyle', 'A werewolf pup'], 'A gentle swamp monster being hunted as a prize.', 0],
    ['easy', 'What visual style is the special shot in?', ['*Black and white, like a classic monster movie', 'Full color', 'Animated', 'Found footage'], 'A deliberate homage to old Universal horror films.', 0],
    ['hard', 'Who ends up with the powerful relic at the end?', ['*It’s destroyed, denied to the villain Verussa', 'Verussa Bloodstone', 'Jack Russell', 'Man-Thing'], 'Elsa and Jack team up to stop her from gaining its power.', 2],
  ],
}

export const QUESTIONS: Question[] = Object.entries(BANK).flatMap(([titleId, raws]) => {
  if (!TITLE_BY_ID.has(titleId)) throw new Error(`Unknown title in question bank: ${titleId}`)
  return raws.map(([difficulty, prompt, opts, explanation, spoiler = 1], i) => {
    const answer = opts.findIndex((o) => o.startsWith('*'))
    if (answer < 0 || opts.filter((o) => o.startsWith('*')).length !== 1)
      throw new Error(`Question ${titleId}-${i + 1} must have exactly one correct option`)
    return {
      id: `${titleId}-${i + 1}`,
      titleId,
      difficulty,
      prompt,
      options: opts.map((o) => o.replace(/^\*/, '')),
      answer,
      explanation,
      spoiler,
    }
  })
})

export const QUESTION_BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]))

export function questionsForTitle(titleId: string) {
  return QUESTIONS.filter((q) => q.titleId === titleId)
}
