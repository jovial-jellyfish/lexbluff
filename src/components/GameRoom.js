// src/components/GameRoom.js
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GAME_PHASES, TEAMS } from "../utils/gameLogic";
import Lobby from "./phases/Lobby";
import TeamSelection from "./phases/TeamSelection";
import WritingPhase from "./phases/WritingPhase";
import ExplainingPhase from "./phases/ExplainingPhase";
import VotingPhase from "./phases/VotingPhase";
import ResultsPhase from "./phases/ResultsPhase";
import GameOver from "./phases/GameOver";

export default function GameRoom({ session, gameHook }) {
  const { gameState, loading, error } = gameHook;
  const { playerId, playerName } = session;

  if (loading) return <div className="loading-screen"><div className="spinner" /><p>Connecting...</p></div>;
  if (error) return <div className="error-screen"><p>⚠️ {error}</p></div>;
  if (!gameState) return <div className="loading-screen"><p>Room not found.</p></div>;

  const phase = gameState.phase;
  const shareUrl = `${window.location.origin}/room/${gameState.roomId}`;

  const phaseProps = {
    gameState,
    playerId,
    playerName,
    shareUrl,
    isHost: gameHook.isHost,
    myTeam: gameHook.myTeam,
    isTruthSpeaker: gameHook.isTruthSpeaker,
    myDefinition: gameHook.myDefinition,
    onStartGame: gameHook.startGame,
    onStartRound: gameHook.startRound,
    onSubmitDefinition: gameHook.submitDefinition,
    onStartExplaining: gameHook.startExplaining,
    onStartVoting: gameHook.startVoting,
    onCastVote: gameHook.castVote,
    onShowResults: gameHook.showResults,
    onNextRound: gameHook.nextRound,
  };

  return (
    <div className="game-room">
      <header className="game-header">
        <div className="game-logo-sm">LEX<span>BLUFF</span></div>
        <div className="game-meta">
          <span className="room-badge">#{gameState.roomId}</span>
          {gameState.round > 0 && <span className="round-badge">Round {gameState.round}</span>}
        </div>
        <div className="player-count">{gameState.players?.length} players</div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          className="phase-container"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.35 }}
        >
          {phase === GAME_PHASES.LOBBY && <Lobby {...phaseProps} />}
          {phase === GAME_PHASES.TEAM_SELECTION && <TeamSelection {...phaseProps} />}
          {(phase === GAME_PHASES.ROUND_START || phase === GAME_PHASES.WRITING) && <WritingPhase {...phaseProps} />}
          {phase === GAME_PHASES.EXPLAINING && <ExplainingPhase {...phaseProps} />}
          {phase === GAME_PHASES.VOTING && <VotingPhase {...phaseProps} />}
          {phase === GAME_PHASES.RESULTS && <ResultsPhase {...phaseProps} />}
          {phase === GAME_PHASES.GAME_OVER && <GameOver {...phaseProps} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
