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
  ],
  'ms-marvel': [
    ['easy', 'Who is Kamala Khan’s biggest hero?', ['*Captain Marvel', 'Iron Man', 'Thor', 'Black Widow'], 'She writes fan fiction about her.', 0],
  ],
  'secret-invasion': [
    ['easy', 'Which race secretly infiltrates Earth in Secret Invasion?', ['*Skrulls', 'Kree', 'Chitauri', 'Celestials'], 'A rogue Skrull faction led by Gravik.', 0],
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
