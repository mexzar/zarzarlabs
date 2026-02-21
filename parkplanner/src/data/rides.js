const rides = [
  // ============================================================
  // WALT DISNEY WORLD
  // ============================================================

  // --- Magic Kingdom ---
  { id: 1, name: "Space Mountain", park: "Magic Kingdom", resort: "Disney World", area: "Tomorrowland", type: "Roller Coaster", thrill: "High", description: "Blast through the darkness of outer space on this iconic indoor roller coaster." },
  { id: 2, name: "Big Thunder Mountain Railroad", park: "Magic Kingdom", resort: "Disney World", area: "Frontierland", type: "Roller Coaster", thrill: "Moderate", description: "Race through a haunted gold mine on the wildest ride in the wilderness." },
  { id: 3, name: "Splash Mountain", park: "Magic Kingdom", resort: "Disney World", area: "Frontierland", type: "Water Ride", thrill: "Moderate", description: "Now Tiana's Bayou Adventure - a musical journey through the bayou with a thrilling drop." },
  { id: 4, name: "Tiana's Bayou Adventure", park: "Magic Kingdom", resort: "Disney World", area: "Frontierland", type: "Water Ride", thrill: "Moderate", description: "Join Tiana on a musical adventure through the bayou, culminating in a splashy finale." },
  { id: 5, name: "Pirates of the Caribbean", park: "Magic Kingdom", resort: "Disney World", area: "Adventureland", type: "Boat Ride", thrill: "Low", description: "Set sail on a swashbuckling voyage through pirate-infested waters." },
  { id: 6, name: "Haunted Mansion", park: "Magic Kingdom", resort: "Disney World", area: "Liberty Square", type: "Dark Ride", thrill: "Low", description: "Tour a haunted estate inhabited by 999 happy haunts." },
  { id: 7, name: "Seven Dwarfs Mine Train", park: "Magic Kingdom", resort: "Disney World", area: "Fantasyland", type: "Roller Coaster", thrill: "Moderate", description: "Race through the diamond mine where the Seven Dwarfs work, in swaying mine cars." },
  { id: 8, name: "TRON Lightcycle / Run", park: "Magic Kingdom", resort: "Disney World", area: "Tomorrowland", type: "Roller Coaster", thrill: "High", description: "Board a Lightcycle and race through the digital Grid on this high-speed coaster." },
  { id: 9, name: "Buzz Lightyear's Space Ranger Spin", park: "Magic Kingdom", resort: "Disney World", area: "Tomorrowland", type: "Interactive Ride", thrill: "Low", description: "Blast targets with your laser cannon to defeat Emperor Zurg." },
  { id: 10, name: "The Jungle Cruise", park: "Magic Kingdom", resort: "Disney World", area: "Adventureland", type: "Boat Ride", thrill: "Low", description: "Cruise through exotic rivers encountering animatronic animals and skipper jokes." },
  { id: 11, name: "it's a small world", park: "Magic Kingdom", resort: "Disney World", area: "Fantasyland", type: "Boat Ride", thrill: "Low", description: "Sail past singing dolls representing cultures from around the world." },
  { id: 12, name: "Peter Pan's Flight", park: "Magic Kingdom", resort: "Disney World", area: "Fantasyland", type: "Dark Ride", thrill: "Low", description: "Soar over London and Never Land aboard a pirate galleon." },
  { id: 13, name: "The Many Adventures of Winnie the Pooh", park: "Magic Kingdom", resort: "Disney World", area: "Fantasyland", type: "Dark Ride", thrill: "Low", description: "Bounce along with Pooh and friends through the Hundred Acre Wood." },
  { id: 14, name: "Under the Sea ~ Journey of The Little Mermaid", park: "Magic Kingdom", resort: "Disney World", area: "Fantasyland", type: "Dark Ride", thrill: "Low", description: "Descend under the sea and relive Ariel's story with music and animatronics." },
  { id: 15, name: "The Barnstormer", park: "Magic Kingdom", resort: "Disney World", area: "Fantasyland", type: "Roller Coaster", thrill: "Low", description: "A kid-friendly coaster that swoops through Goofy's barnyard." },
  { id: 16, name: "Mad Tea Party", park: "Magic Kingdom", resort: "Disney World", area: "Fantasyland", type: "Spinner", thrill: "Low", description: "Spin inside oversized teacups at Alice's unbirthday celebration." },
  { id: 17, name: "Dumbo the Flying Elephant", park: "Magic Kingdom", resort: "Disney World", area: "Fantasyland", type: "Spinner", thrill: "Low", description: "Soar through the sky aboard Dumbo on this classic aerial carousel." },
  { id: 18, name: "The Magic Carpets of Aladdin", park: "Magic Kingdom", resort: "Disney World", area: "Adventureland", type: "Spinner", thrill: "Low", description: "Take flight on a magic carpet above Agrabah's marketplace." },
  { id: 19, name: "Astro Orbiter", park: "Magic Kingdom", resort: "Disney World", area: "Tomorrowland", type: "Spinner", thrill: "Low", description: "Pilot a rocket ship high above Tomorrowland." },
  { id: 20, name: "Tomorrowland Speedway", park: "Magic Kingdom", resort: "Disney World", area: "Tomorrowland", type: "Track Ride", thrill: "Low", description: "Drive a gas-powered car around a winding grand prix raceway." },
  { id: 21, name: "Prince Charming Regal Carrousel", park: "Magic Kingdom", resort: "Disney World", area: "Fantasyland", type: "Carousel", thrill: "Low", description: "A classic carousel featuring beautifully hand-painted horses." },
  { id: 22, name: "Walt Disney's Carousel of Progress", park: "Magic Kingdom", resort: "Disney World", area: "Tomorrowland", type: "Theater Ride", thrill: "Low", description: "A revolving theater showcasing 100 years of technological progress." },
  { id: 23, name: "PeopleMover (Tomorrowland Transit Authority)", park: "Magic Kingdom", resort: "Disney World", area: "Tomorrowland", type: "Track Ride", thrill: "Low", description: "Glide above Tomorrowland on a relaxing elevated tour." },
  { id: 24, name: "The Hall of Presidents", park: "Magic Kingdom", resort: "Disney World", area: "Liberty Square", type: "Theater Ride", thrill: "Low", description: "An audio-animatronic show featuring every U.S. president." },
  { id: 25, name: "Liberty Square Riverboat", park: "Magic Kingdom", resort: "Disney World", area: "Liberty Square", type: "Boat Ride", thrill: "Low", description: "Cruise the Rivers of America on a replica steam-powered paddleboat." },
  { id: 26, name: "Tom Sawyer Island", park: "Magic Kingdom", resort: "Disney World", area: "Frontierland", type: "Walk-Through", thrill: "Low", description: "Explore caves, bridges, and trails on this raft-accessible island." },

  // --- EPCOT ---
  { id: 27, name: "Guardians of the Galaxy: Cosmic Rewind", park: "EPCOT", resort: "Disney World", area: "World Discovery", type: "Roller Coaster", thrill: "High", description: "A reverse-launch indoor coaster with a rotating ride vehicle set to a cosmic playlist." },
  { id: 28, name: "Test Track", park: "EPCOT", resort: "Disney World", area: "World Discovery", type: "Simulator", thrill: "High", description: "Design a virtual concept car and put it through high-speed performance tests." },
  { id: 29, name: "Frozen Ever After", park: "EPCOT", resort: "Disney World", area: "World Showcase", type: "Boat Ride", thrill: "Low", description: "Float through Arendelle and join Elsa, Anna, and Olaf in a winter celebration." },
  { id: 30, name: "Soarin' Around the World", park: "EPCOT", resort: "Disney World", area: "World Nature", type: "Simulator", thrill: "Moderate", description: "Hang-glide over breathtaking landscapes and landmarks across the globe." },
  { id: 31, name: "Living with the Land", park: "EPCOT", resort: "Disney World", area: "World Nature", type: "Boat Ride", thrill: "Low", description: "Cruise through greenhouses and learn about innovative agriculture." },
  { id: 32, name: "Spaceship Earth", park: "EPCOT", resort: "Disney World", area: "World Celebration", type: "Dark Ride", thrill: "Low", description: "Journey through the history of human communication inside the iconic geodesic sphere." },
  { id: 33, name: "Journey of Water, Inspired by Moana", park: "EPCOT", resort: "Disney World", area: "World Nature", type: "Walk-Through", thrill: "Low", description: "An interactive outdoor water trail inspired by Moana's journey." },
  { id: 34, name: "The Seas with Nemo & Friends", park: "EPCOT", resort: "Disney World", area: "World Nature", type: "Dark Ride", thrill: "Low", description: "Ride through an undersea adventure with Nemo, then explore a massive aquarium." },
  { id: 35, name: "Remy's Ratatouille Adventure", park: "EPCOT", resort: "Disney World", area: "World Showcase", type: "Dark Ride", thrill: "Low", description: "Shrink to Remy's size and scurry through Gusteau's restaurant in a trackless ride." },
  { id: 36, name: "Gran Fiesta Tour Starring The Three Caballeros", park: "EPCOT", resort: "Disney World", area: "World Showcase", type: "Boat Ride", thrill: "Low", description: "Cruise through scenes of Mexico with Donald Duck and friends." },
  { id: 37, name: "Mission: SPACE", park: "EPCOT", resort: "Disney World", area: "World Discovery", type: "Simulator", thrill: "High", description: "Experience a simulated space launch to Mars in a centrifuge capsule." },

  // --- Hollywood Studios ---
  { id: 38, name: "Star Wars: Rise of the Resistance", park: "Hollywood Studios", resort: "Disney World", area: "Star Wars: Galaxy's Edge", type: "Dark Ride", thrill: "High", description: "Join the Resistance in an epic battle against the First Order in this groundbreaking ride." },
  { id: 39, name: "Millennium Falcon: Smugglers Run", park: "Hollywood Studios", resort: "Disney World", area: "Star Wars: Galaxy's Edge", type: "Simulator", thrill: "Moderate", description: "Pilot the Millennium Falcon on a smuggling mission through hyperspace." },
  { id: 40, name: "Tower of Terror", park: "Hollywood Studios", resort: "Disney World", area: "Sunset Boulevard", type: "Drop Ride", thrill: "High", description: "Plunge 13 stories in a haunted hotel elevator in the Twilight Zone." },
  { id: 41, name: "Rock 'n' Roller Coaster Starring Aerosmith", park: "Hollywood Studios", resort: "Disney World", area: "Sunset Boulevard", type: "Roller Coaster", thrill: "High", description: "Launch from 0-57 mph in 2.8 seconds on this indoor looping coaster." },
  { id: 42, name: "Slinky Dog Dash", park: "Hollywood Studios", resort: "Disney World", area: "Toy Story Land", type: "Roller Coaster", thrill: "Moderate", description: "Race around Andy's backyard on Slinky Dog in this family-friendly coaster." },
  { id: 43, name: "Toy Story Mania!", park: "Hollywood Studios", resort: "Disney World", area: "Toy Story Land", type: "Interactive Ride", thrill: "Low", description: "Compete in carnival-style 3D shooting games with Woody and Buzz." },
  { id: 44, name: "Alien Swirling Saucers", park: "Hollywood Studios", resort: "Disney World", area: "Toy Story Land", type: "Spinner", thrill: "Low", description: "Whirl around in a toy flying saucer piloted by a little green alien." },
  { id: 45, name: "Mickey & Minnie's Runaway Railway", park: "Hollywood Studios", resort: "Disney World", area: "Hollywood Boulevard", type: "Dark Ride", thrill: "Low", description: "Step into a Mickey Mouse cartoon on this trackless, screen-enhanced dark ride." },
  { id: 46, name: "Star Tours – The Adventures Continue", park: "Hollywood Studios", resort: "Disney World", area: "Echo Lake", type: "Simulator", thrill: "Moderate", description: "Blast through the Star Wars galaxy in a 3D motion simulator with random storylines." },

  // --- Animal Kingdom ---
  { id: 47, name: "Avatar Flight of Passage", park: "Animal Kingdom", resort: "Disney World", area: "Pandora", type: "Simulator", thrill: "High", description: "Soar on a banshee over Pandora's bioluminescent landscape in stunning 3D." },
  { id: 48, name: "Na'vi River Journey", park: "Animal Kingdom", resort: "Disney World", area: "Pandora", type: "Boat Ride", thrill: "Low", description: "Float through a glowing bioluminescent rainforest on Pandora." },
  { id: 49, name: "Expedition Everest", park: "Animal Kingdom", resort: "Disney World", area: "Asia", type: "Roller Coaster", thrill: "High", description: "Race forward and backward through the Himalayas while evading the Yeti." },
  { id: 50, name: "Kilimanjaro Safaris", park: "Animal Kingdom", resort: "Disney World", area: "Africa", type: "Safari", thrill: "Low", description: "Ride through an African savanna spotting real lions, elephants, giraffes, and more." },
  { id: 51, name: "Kali River Rapids", park: "Animal Kingdom", resort: "Disney World", area: "Asia", type: "Water Ride", thrill: "Moderate", description: "Brave the rapids on a whitewater raft ride through the rainforest." },
  { id: 52, name: "Dinosaur", park: "Animal Kingdom", resort: "Disney World", area: "DinoLand U.S.A.", type: "Dark Ride", thrill: "High", description: "Travel back in time to rescue an Iguanodon before an asteroid impact." },
  { id: 53, name: "TriceraTop Spin", park: "Animal Kingdom", resort: "Disney World", area: "DinoLand U.S.A.", type: "Spinner", thrill: "Low", description: "Fly aboard a friendly Triceratops on this aerial spinner." },
  { id: 54, name: "Wildlife Express Train", park: "Animal Kingdom", resort: "Disney World", area: "Africa", type: "Train", thrill: "Low", description: "Ride the train to Rafiki's Planet Watch conservation area." },

  // ============================================================
  // UNIVERSAL ORLANDO RESORT
  // ============================================================

  // --- Universal Studios Florida ---
  { id: 55, name: "Harry Potter and the Escape from Gringotts", park: "Universal Studios Florida", resort: "Universal Orlando", area: "Diagon Alley", type: "Roller Coaster", thrill: "High", description: "Plunge deep below Gringotts bank on a multi-dimensional coaster." },
  { id: 56, name: "Hogwarts Express", park: "Universal Studios Florida", resort: "Universal Orlando", area: "Diagon Alley", type: "Train", thrill: "Low", description: "Board the Hogwarts Express for the journey between London and Hogsmeade." },
  { id: 57, name: "Transformers: The Ride-3D", park: "Universal Studios Florida", resort: "Universal Orlando", area: "Production Central", type: "Simulator", thrill: "High", description: "Join the Autobots in a 3D battle against the Decepticons." },
  { id: 58, name: "Revenge of the Mummy", park: "Universal Studios Florida", resort: "Universal Orlando", area: "New York", type: "Roller Coaster", thrill: "High", description: "A high-speed indoor coaster through ancient tombs with fire and special effects." },
  { id: 59, name: "Hollywood Rip Ride Rockit", park: "Universal Studios Florida", resort: "Universal Orlando", area: "Production Central", type: "Roller Coaster", thrill: "High", description: "Choose your own soundtrack on this 17-story coaster with a vertical lift." },
  { id: 60, name: "Men in Black: Alien Attack", park: "Universal Studios Florida", resort: "Universal Orlando", area: "World Expo", type: "Interactive Ride", thrill: "Moderate", description: "Blast aliens with your laser gun as you spin through the streets of New York." },
  { id: 61, name: "E.T. Adventure", park: "Universal Studios Florida", resort: "Universal Orlando", area: "Woody Woodpecker's KidZone", type: "Dark Ride", thrill: "Low", description: "Fly on a bicycle past the moon and help E.T. save his home planet." },
  { id: 62, name: "Race Through New York Starring Jimmy Fallon", park: "Universal Studios Florida", resort: "Universal Orlando", area: "New York", type: "Simulator", thrill: "Moderate", description: "Race Jimmy Fallon through NYC in a motion-simulator theater." },
  { id: 63, name: "The Simpsons Ride", park: "Universal Studios Florida", resort: "Universal Orlando", area: "Springfield", type: "Simulator", thrill: "Moderate", description: "Join the Simpsons on a wild virtual roller coaster through Krustyland." },
  { id: 64, name: "Fast & Furious: Supercharged", park: "Universal Studios Florida", resort: "Universal Orlando", area: "San Francisco", type: "Simulator", thrill: "Moderate", description: "Join Dom and the crew in a high-speed chase with 3D projections." },
  { id: 65, name: "Woody Woodpecker's Nuthouse Coaster", park: "Universal Studios Florida", resort: "Universal Orlando", area: "Woody Woodpecker's KidZone", type: "Roller Coaster", thrill: "Low", description: "A kid-friendly coaster through Woody's nut factory." },
  { id: 66, name: "Kang & Kodos' Twirl 'n' Hurl", park: "Universal Studios Florida", resort: "Universal Orlando", area: "Springfield", type: "Spinner", thrill: "Low", description: "Spin in a flying saucer piloted by Kang and Kodos from The Simpsons." },

  // --- Islands of Adventure ---
  { id: 67, name: "Harry Potter and the Forbidden Journey", park: "Islands of Adventure", resort: "Universal Orlando", area: "The Wizarding World of Harry Potter - Hogsmeade", type: "Dark Ride", thrill: "High", description: "Soar over Hogwarts castle in a groundbreaking robotic arm dark ride." },
  { id: 68, name: "Hagrid's Magical Creatures Motorbike Adventure", park: "Islands of Adventure", resort: "Universal Orlando", area: "The Wizarding World of Harry Potter - Hogsmeade", type: "Roller Coaster", thrill: "High", description: "Race through the Forbidden Forest on Hagrid's motorbike encountering magical creatures." },
  { id: 69, name: "Jurassic World VelociCoaster", park: "Islands of Adventure", resort: "Universal Orlando", area: "Jurassic Park", type: "Roller Coaster", thrill: "High", description: "A top-tier launch coaster with inversions racing alongside raptors at 70 mph." },
  { id: 70, name: "The Incredible Hulk Coaster", park: "Islands of Adventure", resort: "Universal Orlando", area: "Marvel Super Hero Island", type: "Roller Coaster", thrill: "High", description: "Launch into a gamma-ray-powered coaster with seven inversions." },
  { id: 71, name: "The Amazing Adventures of Spider-Man", park: "Islands of Adventure", resort: "Universal Orlando", area: "Marvel Super Hero Island", type: "Simulator", thrill: "High", description: "Swing through New York with Spider-Man in this 3D motion-based dark ride." },
  { id: 72, name: "Jurassic Park River Adventure", park: "Islands of Adventure", resort: "Universal Orlando", area: "Jurassic Park", type: "Water Ride", thrill: "Moderate", description: "Float past dinosaurs before plunging down an 85-foot water drop." },
  { id: 73, name: "Skull Island: Reign of Kong", park: "Islands of Adventure", resort: "Universal Orlando", area: "Skull Island", type: "Dark Ride", thrill: "High", description: "Face prehistoric predators and King Kong on this immersive trackless ride." },
  { id: 74, name: "Popeye & Bluto's Bilge-Rat Barges", park: "Islands of Adventure", resort: "Universal Orlando", area: "Toon Lagoon", type: "Water Ride", thrill: "Moderate", description: "Get soaked on this whitewater raft ride through Popeye's world." },
  { id: 75, name: "Dudley Do-Right's Ripsaw Falls", park: "Islands of Adventure", resort: "Universal Orlando", area: "Toon Lagoon", type: "Water Ride", thrill: "Moderate", description: "A log flume ride with a 75-foot plunge through a TNT shack." },
  { id: 76, name: "Doctor Doom's Fearfall", park: "Islands of Adventure", resort: "Universal Orlando", area: "Marvel Super Hero Island", type: "Drop Ride", thrill: "High", description: "Launch skyward and free-fall on Doctor Doom's fear-extracting towers." },
  { id: 77, name: "Storm Force Accelatron", park: "Islands of Adventure", resort: "Universal Orlando", area: "Marvel Super Hero Island", type: "Spinner", thrill: "Low", description: "Spin in a pod and help Storm battle Magneto with centrifugal force." },
  { id: 78, name: "The Cat in the Hat", park: "Islands of Adventure", resort: "Universal Orlando", area: "Seuss Landing", type: "Dark Ride", thrill: "Low", description: "Ride through the classic Dr. Seuss story in a couch on wheels." },
  { id: 79, name: "One Fish, Two Fish, Red Fish, Blue Fish", park: "Islands of Adventure", resort: "Universal Orlando", area: "Seuss Landing", type: "Spinner", thrill: "Low", description: "Pilot a Seussian fish up and down while dodging squirts of water." },
  { id: 80, name: "The High in the Sky Seuss Trolley Train Ride!", park: "Islands of Adventure", resort: "Universal Orlando", area: "Seuss Landing", type: "Track Ride", thrill: "Low", description: "Glide above Seuss Landing on an elevated trolley through colorful scenes." },
  { id: 81, name: "Caro-Seuss-el", park: "Islands of Adventure", resort: "Universal Orlando", area: "Seuss Landing", type: "Carousel", thrill: "Low", description: "Ride whimsical Dr. Seuss creatures on this interactive carousel." },
  { id: 82, name: "Pteranodon Flyers", park: "Islands of Adventure", resort: "Universal Orlando", area: "Jurassic Park", type: "Track Ride", thrill: "Low", description: "Soar over Jurassic Park suspended beneath a Pteranodon." },
  { id: 83, name: "Camp Jurassic", park: "Islands of Adventure", resort: "Universal Orlando", area: "Jurassic Park", type: "Walk-Through", thrill: "Low", description: "Explore caves, rope bridges, and water cannons in this dinosaur playground." },

  // --- Universal's Volcano Bay ---
  { id: 84, name: "Krakatau Aqua Coaster", park: "Volcano Bay", resort: "Universal Orlando", area: "Krakatau", type: "Water Ride", thrill: "High", description: "A water coaster through the volcano using linear induction technology." },
  { id: 85, name: "Ko'okiri Body Plunge", park: "Volcano Bay", resort: "Universal Orlando", area: "Krakatau", type: "Water Slide", thrill: "High", description: "A 125-foot drop slide through a trap door at 70 degrees." },
  { id: 86, name: "Kala & Tai Nui Serpentine Body Slides", park: "Volcano Bay", resort: "Universal Orlando", area: "Krakatau", type: "Water Slide", thrill: "High", description: "Intertwining translucent body slides spiraling down the volcano." },
  { id: 87, name: "Punga Racers", park: "Volcano Bay", resort: "Universal Orlando", area: "Rainforest Village", type: "Water Slide", thrill: "Moderate", description: "Race head-first on manta ray mats down multi-lane slides." },
  { id: 88, name: "Maku of the Maku Round Raft Rides", park: "Volcano Bay", resort: "Universal Orlando", area: "Rainforest Village", type: "Water Ride", thrill: "Moderate", description: "Ride a raft through a massive bowl before dropping into a splash pool." },
  { id: 89, name: "TeAwa The Fearless River", park: "Volcano Bay", resort: "Universal Orlando", area: "Rainforest Village", type: "Water Ride", thrill: "Moderate", description: "A fast-paced lazy river with waves and rapids." },
  { id: 90, name: "Kopiko Wai Winding River", park: "Volcano Bay", resort: "Universal Orlando", area: "Wave Village", type: "Water Ride", thrill: "Low", description: "A gentle lazy river winding through the park with starlight caverns." },
  { id: 91, name: "Waturi Beach", park: "Volcano Bay", resort: "Universal Orlando", area: "Wave Village", type: "Water Ride", thrill: "Low", description: "A massive wave pool with sandy beaches." },
  { id: 92, name: "Honu of the Honu ika Moana", park: "Volcano Bay", resort: "Universal Orlando", area: "Wave Village", type: "Water Slide", thrill: "Moderate", description: "Multi-person raft slides with big drops and wall rides." },
  { id: 93, name: "Taniwha Tubes", park: "Volcano Bay", resort: "Universal Orlando", area: "Rainforest Village", type: "Water Slide", thrill: "Moderate", description: "Two twisting water slide options with different paths down the volcano." },
  { id: 94, name: "Ohyah & Ohno Drop Slides", park: "Volcano Bay", resort: "Universal Orlando", area: "Krakatau", type: "Water Slide", thrill: "High", description: "Twist down slides and launch off a ledge into a pool below." },

  // --- Universal Epic Universe ---
  { id: 95, name: "Harry Potter and the Battle at the Ministry", park: "Epic Universe", resort: "Universal Orlando", area: "The Wizarding World of Harry Potter - Ministry of Magic", type: "Dark Ride", thrill: "High", description: "A next-gen dark ride through the Ministry of Magic with cutting-edge technology." },
  { id: 96, name: "Stardust Racers", park: "Epic Universe", resort: "Universal Orlando", area: "Celestial Park", type: "Roller Coaster", thrill: "High", description: "A dual-launch racing coaster reaching thrilling heights in Celestial Park." },
  { id: 97, name: "Starfall Racers", park: "Epic Universe", resort: "Universal Orlando", area: "Celestial Park", type: "Roller Coaster", thrill: "High", description: "The companion racing coaster to Stardust Racers with its own unique track." },
  { id: 98, name: "How to Train Your Dragon - Hiccup's Wing Gliders", park: "Epic Universe", resort: "Universal Orlando", area: "How to Train Your Dragon - Isle of Berk", type: "Suspended Ride", thrill: "Moderate", description: "Soar over the Isle of Berk suspended beneath dragon wings." },
  { id: 99, name: "Dragon Racer's Rally", park: "Epic Universe", resort: "Universal Orlando", area: "How to Train Your Dragon - Isle of Berk", type: "Roller Coaster", thrill: "Moderate", description: "A family coaster racing through the Viking village of Berk." },
  { id: 100, name: "Fyre Drill", park: "Epic Universe", resort: "Universal Orlando", area: "How to Train Your Dragon - Isle of Berk", type: "Spinner", thrill: "Low", description: "A Viking fire drill training spinner ride for the whole family." },
  { id: 101, name: "The Untrainable Dragon", park: "Epic Universe", resort: "Universal Orlando", area: "How to Train Your Dragon - Isle of Berk", type: "Walk-Through", thrill: "Low", description: "Walk through Berk and encounter animatronic dragons up close." },
  { id: 102, name: "Mario Kart: Bowser's Challenge", park: "Epic Universe", resort: "Universal Orlando", area: "Super Nintendo World", type: "Interactive Ride", thrill: "Moderate", description: "Race through Mario Kart courses in AR-enhanced karts throwing shells at rivals." },
  { id: 103, name: "Yoshi's Adventure", park: "Epic Universe", resort: "Universal Orlando", area: "Super Nintendo World", type: "Track Ride", thrill: "Low", description: "Ride Yoshi on a gentle omnimover through the Mushroom Kingdom." },
  { id: 104, name: "Curse of the Werewolf", park: "Epic Universe", resort: "Universal Orlando", area: "Dark Universe", type: "Roller Coaster", thrill: "High", description: "A high-speed coaster through the world of classic Universal Monsters." },
  { id: 105, name: "Monsters Unchained: The Frankenstein Experiment", park: "Epic Universe", resort: "Universal Orlando", area: "Dark Universe", type: "Dark Ride", thrill: "High", description: "A massive dark ride through Dr. Frankenstein's experiments gone wrong." },
  { id: 106, name: "Let's a Go!", park: "Epic Universe", resort: "Universal Orlando", area: "Super Nintendo World", type: "Spinner", thrill: "Low", description: "A family-friendly spinning ride set in Super Nintendo World." },

  // ============================================================
  // SCHLITTERBAHN
  // ============================================================

  // --- Schlitterbahn New Braunfels ---
  { id: 107, name: "Master Blaster", park: "Schlitterbahn New Braunfels", resort: "Schlitterbahn", area: "Blastenhoff", type: "Water Ride", thrill: "High", description: "The world's first uphill water coaster blasts riders uphill using water jet propulsion." },
  { id: 108, name: "Dragon Blaster", park: "Schlitterbahn New Braunfels", resort: "Schlitterbahn", area: "Blastenhoff", type: "Water Ride", thrill: "Moderate", description: "A family-friendly water coaster winding through the park with gentle drops and turns." },
  { id: 109, name: "Wolfpack", park: "Schlitterbahn New Braunfels", resort: "Schlitterbahn", area: "Surfenburg", type: "Water Slide", thrill: "Moderate", description: "Race friends down multi-lane mat racer slides to the splashdown." },
  { id: 110, name: "Torrent River", park: "Schlitterbahn New Braunfels", resort: "Schlitterbahn", area: "Tubenbach", type: "Water Ride", thrill: "Moderate", description: "A raging river adventure with rapids, rolling waves, and surprise splashes." },
  { id: 111, name: "The Falls", park: "Schlitterbahn New Braunfels", resort: "Schlitterbahn", area: "Tubenbach", type: "Water Slide", thrill: "Moderate", description: "Tube slides that send riders plunging down cascading waterfalls into pools below." },
  { id: 112, name: "Boogie Bahn", park: "Schlitterbahn New Braunfels", resort: "Schlitterbahn", area: "Surfenburg", type: "Water Ride", thrill: "Moderate", description: "Ride the endless wave on this surfing simulator — try to stay standing!" },
  { id: 113, name: "Thunder Tub", park: "Schlitterbahn New Braunfels", resort: "Schlitterbahn", area: "Wasserfest", type: "Water Slide", thrill: "Moderate", description: "Multi-person tube slide through dark tunnels with surprise drops and splashes." },
  { id: 114, name: "Whitewater Tube Chute", park: "Schlitterbahn New Braunfels", resort: "Schlitterbahn", area: "Tubenbach", type: "Water Slide", thrill: "Low", description: "A classic tube ride through gentle rapids and lazy turns under shaded trees." },
  { id: 115, name: "Black Knight", park: "Schlitterbahn New Braunfels", resort: "Schlitterbahn", area: "Blastenhoff", type: "Water Slide", thrill: "High", description: "An enclosed pitch-black speed slide that twists through total darkness." },
  { id: 116, name: "Screaming Serpents", park: "Schlitterbahn New Braunfels", resort: "Schlitterbahn", area: "Surfenburg", type: "Water Slide", thrill: "High", description: "Intertwining body slides that twist and drop at thrilling speeds." },
  { id: 117, name: "Hillside Tube Chute", park: "Schlitterbahn New Braunfels", resort: "Schlitterbahn", area: "Tubenbach", type: "Water Slide", thrill: "Low", description: "A mellow tube ride winding down a tree-shaded hillside fed by cool spring water." },
  { id: 118, name: "Kristal River", park: "Schlitterbahn New Braunfels", resort: "Schlitterbahn", area: "Wasserfest", type: "Water Ride", thrill: "Low", description: "A spring-fed lazy river perfect for floating and relaxing under the Texas sun." },
  { id: 119, name: "Cliffhanger", park: "Schlitterbahn New Braunfels", resort: "Schlitterbahn", area: "Surfenburg", type: "Water Slide", thrill: "High", description: "A near-vertical drop slide that plunges riders into a splashdown pool." },

];

export default rides;

export const resorts = ["Disney World", "Universal Orlando", "Schlitterbahn"];

export const parks = {
  "Disney World": ["Magic Kingdom", "EPCOT", "Hollywood Studios", "Animal Kingdom"],
  "Universal Orlando": ["Universal Studios Florida", "Islands of Adventure", "Volcano Bay", "Epic Universe"],
  "Schlitterbahn": ["Schlitterbahn New Braunfels"],
};

export const thrillLevels = ["Low", "Moderate", "High"];

export const rideTypes = [
  "Roller Coaster", "Dark Ride", "Simulator", "Water Ride", "Water Slide",
  "Boat Ride", "Interactive Ride", "Spinner", "Drop Ride", "Track Ride",
  "Carousel", "Theater Ride", "Train", "Safari", "Walk-Through", "Suspended Ride",
];
