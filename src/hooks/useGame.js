// src/hooks/useGame.js
import { useState, useEffect, useCallback } from "react";
import {
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { getRandomWord } from "../utils/wordBank";
import {
  assignTeamsRandomly,
  pickTruthSpeaker,
  calculateScores,
  generateRoomCode,
  GAME_PHASES,
  TEAMS,
} from "../utils/gameLogic";

export function useGame(roomId, playerId, playerName) {
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Subscribe to game state
  useEffect(() => {
    if (!roomId) return;
    const unsub = onSnapshot(
      doc(db, "games", roomId),
      (snap) => {
        if (snap.exists()) {
          setGameState({ id: snap.id, ...snap.data() });
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, [roomId]);

  // Create a new room
  const createRoom = useCallback(async (name) => {
    const code = generateRoomCode();
    const pid = `player_${Date.now()}`;
    await setDoc(doc(db, "games", code), {
      roomId: code,
      phase: GAME_PHASES.LOBBY,
      players: [{ id: pid, name, isHost: true }],
      teams: {},
      scores: {},
      round: 0,
      currentWord: null,
      truthSpeakerId: null,
      definitions: [],
      votes: [],
      usedWords: [],
      createdAt: Date.now(),
    });
    return { roomId: code, playerId: pid };
  }, []);

  // Join existing room
  const joinRoom = useCallback(async (code, name) => {
    const pid = `player_${Date.now()}`;
    const ref = doc(db, "games", code.toUpperCase());
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("Room not found");
    await updateDoc(ref, {
      players: arrayUnion({ id: pid, name, isHost: false }),
    });
    return { roomId: code.toUpperCase(), playerId: pid };
  }, []);

  // Host starts the game
  const startGame = useCallback(async () => {
    if (!gameState) return;
    const teams = assignTeamsRandomly(gameState.players);
    await updateDoc(doc(db, "games", roomId), {
      phase: GAME_PHASES.TEAM_SELECTION,
      teams,
    });
  }, [gameState, roomId]);

  // Confirm teams and start round
  const startRound = useCallback(async () => {
    if (!gameState) return;
    const wordEntry = getRandomWord(gameState.usedWords || []);
    const speakers = gameState.players.filter(
      (p) => gameState.teams[p.id] === TEAMS.SPEAKERS
    );
    const truthSpeaker = speakers[Math.floor(Math.random() * speakers.length)];
    await updateDoc(doc(db, "games", roomId), {
      phase: GAME_PHASES.WRITING,
      currentWord: wordEntry,
      truthSpeakerId: truthSpeaker.id,
      definitions: [],
      votes: [],
      round: (gameState.round || 0) + 1,
      usedWords: arrayUnion(wordEntry.word),
    });
  }, [gameState, roomId]);

  // Submit a definition (speaker)
  const submitDefinition = useCallback(
    async (text) => {
      if (!gameState) return;
      const isTruth = playerId === gameState.truthSpeakerId;
      await updateDoc(doc(db, "games", roomId), {
        definitions: arrayUnion({
          speakerId: playerId,
          speakerName: playerName,
          text,
          isTrue: isTruth,
        }),
      });
    },
    [gameState, roomId, playerId, playerName]
  );

  // Move to explaining phase (host)
  const startExplaining = useCallback(async () => {
    await updateDoc(doc(db, "games", roomId), {
      phase: GAME_PHASES.EXPLAINING,
    });
  }, [roomId]);

  // Move to voting phase (host)
  const startVoting = useCallback(async () => {
    await updateDoc(doc(db, "games", roomId), {
      phase: GAME_PHASES.VOTING,
    });
  }, [roomId]);

  // Cast a vote (guesser)
  const castVote = useCallback(
    async (speakerId) => {
      if (!gameState) return;
      await updateDoc(doc(db, "games", roomId), {
        votes: arrayUnion({ voterId: playerId, votedFor: speakerId }),
      });
    },
    [gameState, roomId, playerId]
  );

  // Tally results (host)
  const showResults = useCallback(async () => {
    if (!gameState) return;
    const newScores = calculateScores(
      gameState.votes,
      gameState.truthSpeakerId,
      gameState.scores
    );
    await updateDoc(doc(db, "games", roomId), {
      phase: GAME_PHASES.RESULTS,
      scores: newScores,
    });
  }, [gameState, roomId]);

  // Next round or end game
  const nextRound = useCallback(async () => {
    if (!gameState) return;
    if (gameState.round >= 5) {
      await updateDoc(doc(db, "games", roomId), {
        phase: GAME_PHASES.GAME_OVER,
      });
    } else {
      // Swap teams
      const swappedTeams = Object.fromEntries(
        Object.entries(gameState.teams).map(([pid, team]) => [
          pid,
          team === TEAMS.SPEAKERS ? TEAMS.GUESSERS : TEAMS.SPEAKERS,
        ])
      );
      await updateDoc(doc(db, "games", roomId), {
        teams: swappedTeams,
        phase: GAME_PHASES.ROUND_START,
      });
    }
  }, [gameState, roomId]);

  return {
    gameState,
    loading,
    error,
    createRoom,
    joinRoom,
    startGame,
    startRound,
    submitDefinition,
    startExplaining,
    startVoting,
    castVote,
    showResults,
    nextRound,
    isHost: gameState?.players?.find((p) => p.id === playerId)?.isHost,
    myTeam: gameState?.teams?.[playerId],
    isTruthSpeaker: gameState?.truthSpeakerId === playerId,
    myDefinition: gameState?.definitions?.find((d) => d.speakerId === playerId),
  };
}
