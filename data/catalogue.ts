/**
 * The catalogue source of data.
 *
 * This project deliberately has no database: the catalogue is a plain
 * TypeScript module so the vertical slice stays easy to read, test and extend.
 * Read it through `lib/catalogue.ts` rather than importing it directly.
 */

export interface Category {
  id: string;
  name: string;
  description: string;
  /** Search term used when asking Unsplash for photos for this category. */
  photoQuery: string;
}

export interface Game {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  /** ISO 4217 currency code, rendered as `12.50 JOD`. */
  currency: string;
  /** ISO 8601 date (YYYY-MM-DD), rendered as `15 Sep 2026`. */
  releaseDate: string;
  imageUrl: string;
}

export const categories: Category[] = [
  {
    id: "strategy",
    name: "Strategy",
    description:
      "Long games with deep decisions, tight economies and very little luck. Best with players who enjoy planning several turns ahead.",
    photoQuery: "board game strategy table",
  },
  {
    id: "family",
    name: "Family",
    description:
      "Approachable games that teach in a few minutes and still reward clever play. Designed for mixed ages around one table.",
    photoQuery: "family board game tiles",
  },
  {
    id: "party",
    name: "Party",
    description:
      "Loud, quick games for larger groups. Rules fit on a card, and everyone stays involved between turns.",
    photoQuery: "party game friends cards",
  },
  {
    id: "cooperative",
    name: "Cooperative",
    description:
      "Everyone wins or loses together against the game itself. Best when the table talks through every decision out loud.",
    photoQuery: "cooperative board game team",
  },
];

export const games: Game[] = [
  {
    id: "terraforming-mars",
    categoryId: "strategy",
    name: "Terraforming Mars",
    description:
      "Rival corporations raise the temperature, oxygen and ocean coverage of the red planet. Card combinations build an engine that pays out over the full game, so early investments matter more than late grabs.",
    price: 64.9,
    currency: "JOD",
    releaseDate: "2016-10-01",
    imageUrl: "/images/terraforming-mars.svg",
  },
  {
    id: "scythe",
    categoryId: "strategy",
    name: "Scythe",
    description:
      "Five factions compete for a fractured 1920s Europa using mechs, workers and carefully timed encounters. Every action unlocks another, which keeps turns short despite the size of the board.",
    price: 74.5,
    currency: "JOD",
    releaseDate: "2016-07-13",
    imageUrl: "/images/scythe.svg",
  },
  {
    id: "brass-birmingham",
    categoryId: "strategy",
    name: "Brass: Birmingham",
    description:
      "An economic game about building canals, rails and industry during the industrial revolution. Selling goods needs someone else's network, so the map turns into a negotiation you never speak out loud.",
    price: 69.0,
    currency: "JOD",
    releaseDate: "2018-11-02",
    imageUrl: "/images/brass-birmingham.svg",
  },
  {
    id: "great-western-trail",
    categoryId: "strategy",
    name: "Great Western Trail",
    description:
      "Drive cattle from Texas to Kansas City while reshaping the route you travel. A deck-building core sits inside a rondel-like track, and the herd you buy early decides how the last third plays.",
    price: 54.95,
    currency: "JOD",
    releaseDate: "2016-10-13",
    imageUrl: "/images/great-western-trail.svg",
  },
  {
    id: "ticket-to-ride",
    categoryId: "family",
    name: "Ticket to Ride",
    description:
      "Collect coloured train cards and claim routes across a map of North America. The rules take three minutes to explain, and the tension comes entirely from the route someone else might take first.",
    price: 44.99,
    currency: "JOD",
    releaseDate: "2004-09-13",
    imageUrl: "/images/ticket-to-ride.svg",
  },
  {
    id: "carcassonne",
    categoryId: "family",
    name: "Carcassonne",
    description:
      "Draw a tile, place it, and decide whether to commit one of your followers to a road, city or field. The board is different every game because the players build it as they go.",
    price: 29.95,
    currency: "JOD",
    releaseDate: "2000-03-15",
    imageUrl: "/images/carcassonne.svg",
  },
  {
    id: "azul",
    categoryId: "family",
    name: "Azul",
    description:
      "Draft ceramic tiles from shared factories to decorate a palace wall. Taking the tiles you want often hands your neighbour exactly what they needed, which is where the whole game lives.",
    price: 39.5,
    currency: "JOD",
    releaseDate: "2017-10-19",
    imageUrl: "/images/azul.svg",
  },
  {
    id: "kingdomino",
    categoryId: "family",
    name: "Kingdomino",
    description:
      "Build a five-by-five kingdom from domino-shaped tiles. Picking a strong tile pushes you later in the next turn order, so every choice trades value now against position later.",
    price: 19.99,
    currency: "JOD",
    releaseDate: "2016-10-15",
    imageUrl: "/images/kingdomino.svg",
  },
  {
    id: "codenames",
    categoryId: "party",
    name: "Codenames",
    description:
      "Two spymasters give one-word clues to link several agents at once while avoiding the assassin. The best moments happen when a clue is obvious to everyone except the team that has to guess it.",
    price: 17.5,
    currency: "JOD",
    releaseDate: "2015-08-01",
    imageUrl: "/images/codenames.svg",
  },
  {
    id: "just-one",
    categoryId: "party",
    name: "Just One",
    description:
      "Everybody writes a one-word clue for the same mystery word, then every duplicate clue is thrown away. Cooperative, fast, and reliably funny with a table of eight.",
    price: 22.9,
    currency: "JOD",
    releaseDate: "2018-10-25",
    imageUrl: "/images/just-one.svg",
  },
  {
    id: "wavelength",
    categoryId: "party",
    name: "Wavelength",
    description:
      "One player sees a hidden point on a spectrum between two opposites and gives a clue to place it. The arguments the team has before committing the dial are the actual game.",
    price: 34.95,
    currency: "JOD",
    releaseDate: "2019-11-15",
    imageUrl: "/images/wavelength.svg",
  },
  {
    id: "dixit",
    categoryId: "party",
    name: "Dixit",
    description:
      "Describe a surreal illustration so that some, but not all, of the table finds it. Scoring punishes clues that are too clear and clues that are too obscure in equal measure.",
    price: 32.0,
    currency: "JOD",
    releaseDate: "2008-08-01",
    imageUrl: "/images/dixit.svg",
  },
  {
    id: "pandemic",
    categoryId: "cooperative",
    name: "Pandemic",
    description:
      "Four diseases spread across the world while the team races to research cures before an outbreak cascades out of control. Each role has one strength, so the plan only works if everyone says what they can do.",
    price: 34.9,
    currency: "JOD",
    releaseDate: "2008-08-01",
    imageUrl: "/images/pandemic.svg",
  },
  {
    id: "spirit-island",
    categoryId: "cooperative",
    name: "Spirit Island",
    description:
      "Nature spirits defend an island from colonising invaders, combining slow-building powers to clear explorers before towns and cities take root. Heavier than most cooperative games, and it stays tense until the last card.",
    price: 59.95,
    currency: "JOD",
    releaseDate: "2017-04-12",
    imageUrl: "/images/spirit-island.svg",
  },
  {
    id: "the-crew",
    categoryId: "cooperative",
    name: "The Crew",
    description:
      "A trick-taking game where the team must land specific cards in a specific order, but talking about your hand is almost entirely forbidden. Missions escalate over a campaign, one deal at a time.",
    price: 18.5,
    currency: "JOD",
    releaseDate: "2019-10-01",
    imageUrl: "/images/the-crew.svg",
  },
  {
    id: "forbidden-island",
    categoryId: "cooperative",
    name: "Forbidden Island",
    description:
      "A sinking island must be searched for four treasures before it goes under completely. Shorter and lighter than Pandemic, and a common first cooperative game for new tables.",
    price: 16.95,
    currency: "JOD",
    releaseDate: "2010-04-15",
    imageUrl: "/images/forbidden-island.svg",
  },
];
