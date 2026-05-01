// src/utils/gameLogic.js

export const GAME_PHASES = {
  LOBBY: "lobby",
  TEAM_SELECTION: "team_selection",
  ROUND_START: "round_start",
  WRITING: "writing",
  EXPLAINING: "explaining",
  VOTING: "voting",
  RESULTS: "results",
  GAME_OVER: "game_over",
};

export const TEAMS = {
  SPEAKERS: "speakers",
  GUESSERS: "guessers",
};

export function assignTeamsRandomly(players) {
  const shuffled = [...players].sort(() => Math.random() - 0.5);
  const half = Math.ceil(shuffled.length / 2);
  return shuffled.reduce((acc, player, i) => {
    acc[player.id] = i < half ? TEAMS.SPEAKERS : TEAMS.GUESSERS;
    return acc;
  }, {});
}

export function pickTruthSpeaker(players, teams) {
  const speakers = players.filter((p) => teams[p.id] === TEAMS.SPEAKERS);
  return speakers[Math.floor(Math.random() * speakers.length)];
}

export function calculateScores(votes, truthSpeakerId, currentScores = {}) {
  const newScores = { ...currentScores };

  votes.forEach((vote) => {
    if (vote.votedFor === truthSpeakerId) {
      // Guesser found the truth — guessers score
      if (!newScores[vote.voterId]) newScores[vote.voterId] = 0;
      newScores[vote.voterId] += 2;
    } else {
      // Guesser was fooled — the bluffer scores
      if (!newScores[vote.votedFor]) newScores[vote.votedFor] = 0;
      newScores[vote.votedFor] += 1;
    }
  });

  return newScores;
}

export function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}
