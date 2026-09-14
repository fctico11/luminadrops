const ADJECTIVES = [
  "Moon",
  "Sage",
  "Ever",
  "Velvet",
  "Midnight",
  "Amber",
  "Wild",
  "Quiet",
  "Golden",
  "Hollow",
  "Twilight",
  "Lush",
  "Soft",
  "Wandering",
  "Honey",
  "Dusk",
];

const NOUNS = [
  "child",
  "lime",
  "Here",
  "bloom",
  "ember",
  "wren",
  "hush",
  "glow",
  "drift",
  "muse",
  "noir",
  "light",
  "moth",
  "spark",
  "vale",
  "bramble",
];

/** A whimsical, fully anonymous display name for a Back Room post — no
 * visitor identity is ever stored, just this generated at post time. */
export function randomHandle(): string {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adjective}${noun}`;
}
