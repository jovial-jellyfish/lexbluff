// src/utils/wordBank.js

export const WORD_BANK = [
  {
    word: "Sonder",
    definition: "The realization that each passerby has a life as vivid and complex as your own.",
  },
  {
    word: "Petrichor",
    definition: "The pleasant, earthy smell produced when rain falls on dry soil.",
  },
  {
    word: "Hiraeth",
    definition: "A homesickness for somewhere you cannot return to, or never was.",
  },
  {
    word: "Vellichor",
    definition: "The strange wistfulness of used bookshops.",
  },
  {
    word: "Schadenfreude",
    definition: "Pleasure derived from another person's misfortune.",
  },
  {
    word: "Mamihlapinatapai",
    definition: "A look shared by two people, each wishing the other would initiate something they both desire.",
  },
  {
    word: "Alexithymia",
    definition: "Difficulty identifying and expressing one's own emotions.",
  },
  {
    word: "Apophenia",
    definition: "The tendency to perceive meaningful connections between unrelated things.",
  },
  {
    word: "Dysania",
    definition: "The state of finding it difficult to get out of bed in the morning.",
  },
  {
    word: "Logomachy",
    definition: "An argument about words or the meaning of words.",
  },
  {
    word: "Numinous",
    definition: "Having a strong religious or spiritual quality; awe-inspiring.",
  },
  {
    word: "Ephemeral",
    definition: "Lasting for a very short time; transitory.",
  },
  {
    word: "Apricity",
    definition: "The warmth of the sun in winter.",
  },
  {
    word: "Meliorism",
    definition: "The belief that the world can be made better by human effort.",
  },
  {
    word: "Phosphene",
    definition: "The light you see when you press on your closed eyelids.",
  },
  {
    word: "Quiddity",
    definition: "The inherent nature or essence of someone or something.",
  },
  {
    word: "Syzygy",
    definition: "The alignment of three or more celestial bodies in a straight line.",
  },
  {
    word: "Tmesis",
    definition: "Inserting a word in the middle of another word for emphasis (e.g., abso-blooming-lutely).",
  },
  {
    word: "Ultracrepidarian",
    definition: "Someone who gives opinions on matters beyond their knowledge.",
  },
  {
    word: "Woolgathering",
    definition: "Indulging in aimless thought or daydreaming.",
  },
];

export function getRandomWord(usedWords = []) {
  const available = WORD_BANK.filter((w) => !usedWords.includes(w.word));
  if (available.length === 0) return WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
  return available[Math.floor(Math.random() * available.length)];
}
