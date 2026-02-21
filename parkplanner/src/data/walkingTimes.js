// Walking times in minutes between areas within each park.
// Matrix is symmetric — walkingTimes[park][areaA][areaB] === walkingTimes[park][areaB][areaA]
// Default fallback for unknown pairs: 10 minutes

const walkingTimes = {
  "Magic Kingdom": {
    "Tomorrowland": { "Tomorrowland": 0, "Fantasyland": 4, "Liberty Square": 7, "Frontierland": 8, "Adventureland": 10 },
    "Fantasyland": { "Fantasyland": 0, "Tomorrowland": 4, "Liberty Square": 5, "Frontierland": 6, "Adventureland": 8 },
    "Liberty Square": { "Liberty Square": 0, "Fantasyland": 5, "Frontierland": 3, "Adventureland": 5, "Tomorrowland": 7 },
    "Frontierland": { "Frontierland": 0, "Liberty Square": 3, "Adventureland": 4, "Fantasyland": 6, "Tomorrowland": 8 },
    "Adventureland": { "Adventureland": 0, "Frontierland": 4, "Liberty Square": 5, "Fantasyland": 8, "Tomorrowland": 10 },
  },
  "EPCOT": {
    "World Celebration": { "World Celebration": 0, "World Discovery": 4, "World Nature": 5, "World Showcase": 8 },
    "World Discovery": { "World Discovery": 0, "World Celebration": 4, "World Nature": 6, "World Showcase": 7 },
    "World Nature": { "World Nature": 0, "World Celebration": 5, "World Discovery": 6, "World Showcase": 6 },
    "World Showcase": { "World Showcase": 0, "World Celebration": 8, "World Discovery": 7, "World Nature": 6 },
  },
  "Hollywood Studios": {
    "Hollywood Boulevard": { "Hollywood Boulevard": 0, "Echo Lake": 4, "Star Wars: Galaxy's Edge": 8, "Toy Story Land": 7, "Sunset Boulevard": 5 },
    "Echo Lake": { "Echo Lake": 0, "Hollywood Boulevard": 4, "Star Wars: Galaxy's Edge": 5, "Toy Story Land": 6, "Sunset Boulevard": 7 },
    "Star Wars: Galaxy's Edge": { "Star Wars: Galaxy's Edge": 0, "Echo Lake": 5, "Toy Story Land": 4, "Hollywood Boulevard": 8, "Sunset Boulevard": 10 },
    "Toy Story Land": { "Toy Story Land": 0, "Star Wars: Galaxy's Edge": 4, "Echo Lake": 6, "Hollywood Boulevard": 7, "Sunset Boulevard": 8 },
    "Sunset Boulevard": { "Sunset Boulevard": 0, "Hollywood Boulevard": 5, "Echo Lake": 7, "Toy Story Land": 8, "Star Wars: Galaxy's Edge": 10 },
  },
  "Animal Kingdom": {
    "Pandora": { "Pandora": 0, "Africa": 5, "Asia": 10, "DinoLand U.S.A.": 12 },
    "Africa": { "Africa": 0, "Pandora": 5, "Asia": 6, "DinoLand U.S.A.": 8 },
    "Asia": { "Asia": 0, "Africa": 6, "DinoLand U.S.A.": 5, "Pandora": 10 },
    "DinoLand U.S.A.": { "DinoLand U.S.A.": 0, "Asia": 5, "Africa": 8, "Pandora": 12 },
  },
  "Universal Studios Florida": {
    "Production Central": { "Production Central": 0, "New York": 3, "San Francisco": 5, "World Expo": 6, "Springfield": 7, "Woody Woodpecker's KidZone": 8, "Diagon Alley": 7 },
    "New York": { "New York": 0, "Production Central": 3, "San Francisco": 4, "Diagon Alley": 5, "World Expo": 7, "Springfield": 8, "Woody Woodpecker's KidZone": 9 },
    "San Francisco": { "San Francisco": 0, "New York": 4, "Production Central": 5, "Diagon Alley": 4, "World Expo": 5, "Springfield": 6, "Woody Woodpecker's KidZone": 7 },
    "Diagon Alley": { "Diagon Alley": 0, "San Francisco": 4, "New York": 5, "World Expo": 5, "Springfield": 6, "Production Central": 7, "Woody Woodpecker's KidZone": 8 },
    "World Expo": { "World Expo": 0, "Springfield": 3, "San Francisco": 5, "Diagon Alley": 5, "Woody Woodpecker's KidZone": 4, "New York": 7, "Production Central": 6 },
    "Springfield": { "Springfield": 0, "World Expo": 3, "Woody Woodpecker's KidZone": 4, "San Francisco": 6, "Diagon Alley": 6, "New York": 8, "Production Central": 7 },
    "Woody Woodpecker's KidZone": { "Woody Woodpecker's KidZone": 0, "Springfield": 4, "World Expo": 4, "San Francisco": 7, "Diagon Alley": 8, "New York": 9, "Production Central": 8 },
  },
  "Islands of Adventure": {
    "Marvel Super Hero Island": { "Marvel Super Hero Island": 0, "Toon Lagoon": 4, "Skull Island": 6, "Jurassic Park": 8, "The Wizarding World of Harry Potter - Hogsmeade": 10, "Seuss Landing": 12 },
    "Toon Lagoon": { "Toon Lagoon": 0, "Marvel Super Hero Island": 4, "Skull Island": 3, "Jurassic Park": 5, "The Wizarding World of Harry Potter - Hogsmeade": 8, "Seuss Landing": 10 },
    "Skull Island": { "Skull Island": 0, "Toon Lagoon": 3, "Jurassic Park": 3, "Marvel Super Hero Island": 6, "The Wizarding World of Harry Potter - Hogsmeade": 6, "Seuss Landing": 10 },
    "Jurassic Park": { "Jurassic Park": 0, "Skull Island": 3, "The Wizarding World of Harry Potter - Hogsmeade": 4, "Toon Lagoon": 5, "Marvel Super Hero Island": 8, "Seuss Landing": 12 },
    "The Wizarding World of Harry Potter - Hogsmeade": { "The Wizarding World of Harry Potter - Hogsmeade": 0, "Jurassic Park": 4, "Skull Island": 6, "Seuss Landing": 5, "Toon Lagoon": 8, "Marvel Super Hero Island": 10 },
    "Seuss Landing": { "Seuss Landing": 0, "The Wizarding World of Harry Potter - Hogsmeade": 5, "Marvel Super Hero Island": 12, "Toon Lagoon": 10, "Skull Island": 10, "Jurassic Park": 12 },
  },
  "Volcano Bay": {
    "Krakatau": { "Krakatau": 0, "Wave Village": 4, "Rainforest Village": 5 },
    "Wave Village": { "Wave Village": 0, "Krakatau": 4, "Rainforest Village": 5 },
    "Rainforest Village": { "Rainforest Village": 0, "Krakatau": 5, "Wave Village": 5 },
  },
  "Epic Universe": {
    "Celestial Park": { "Celestial Park": 0, "The Wizarding World of Harry Potter - Ministry of Magic": 5, "How to Train Your Dragon - Isle of Berk": 6, "Super Nintendo World": 5, "Dark Universe": 6 },
    "The Wizarding World of Harry Potter - Ministry of Magic": { "The Wizarding World of Harry Potter - Ministry of Magic": 0, "Celestial Park": 5, "How to Train Your Dragon - Isle of Berk": 8, "Super Nintendo World": 8, "Dark Universe": 10 },
    "How to Train Your Dragon - Isle of Berk": { "How to Train Your Dragon - Isle of Berk": 0, "Celestial Park": 6, "The Wizarding World of Harry Potter - Ministry of Magic": 8, "Super Nintendo World": 10, "Dark Universe": 8 },
    "Super Nintendo World": { "Super Nintendo World": 0, "Celestial Park": 5, "Dark Universe": 4, "The Wizarding World of Harry Potter - Ministry of Magic": 8, "How to Train Your Dragon - Isle of Berk": 10 },
    "Dark Universe": { "Dark Universe": 0, "Super Nintendo World": 4, "Celestial Park": 6, "How to Train Your Dragon - Isle of Berk": 8, "The Wizarding World of Harry Potter - Ministry of Magic": 10 },
  },
  "Schlitterbahn New Braunfels": {
    "Blastenhoff": { "Blastenhoff": 0, "Surfenburg": 4, "Tubenbach": 5, "Wasserfest": 7 },
    "Surfenburg": { "Surfenburg": 0, "Blastenhoff": 4, "Tubenbach": 3, "Wasserfest": 5 },
    "Tubenbach": { "Tubenbach": 0, "Surfenburg": 3, "Blastenhoff": 5, "Wasserfest": 4 },
    "Wasserfest": { "Wasserfest": 0, "Tubenbach": 4, "Surfenburg": 5, "Blastenhoff": 7 },
  },
};

export function getWalkingTime(park, fromArea, toArea) {
  if (fromArea === toArea) return 0;
  const parkMap = walkingTimes[park];
  if (!parkMap) return 10;
  const fromMap = parkMap[fromArea];
  if (!fromMap) return 10;
  return fromMap[toArea] ?? 10;
}

export default walkingTimes;
