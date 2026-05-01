// src/components/phases/TeamSelection.js
import React from "react";
import { motion } from "framer-motion";
import { TEAMS } from "../../utils/gameLogic";

export default function TeamSelection({ gameState, playerId, isHost, myTeam, onStartRound }) {
  const speakers = gameState.players?.filter(p => gameState.teams?.[p.id] === TEAMS.SPEAKERS) || [];
  const guessers = gameState.players?.filter(p => gameState.teams?.[p.id] === TEAMS.GUESSERS) || [];

  return (
    <div className="phase team-phase">
      <div className="phase-card">
        <h1 className="phase-title">Teams Formed!</h1>
        <p className="phase-sub">
          Your team: <span className={`team-label ${myTeam}`}>
            {myTeam === TEAMS.SPEAKERS ? "🎙️ Speakers" : "🔍 Guessers"}
          </span>
        </p>

        <div className="teams-grid">
          <motion.div
            className="team-panel speakers"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h3>🎙️ Speakers</h3>
            <p className="team-role-desc">One knows the truth. Others must bluff convincingly.</p>
            {speakers.map(p => (
              <div key={p.id} className={`player-chip ${p.id === playerId ? "me" : ""}`}>
                <span className="player-avatar">{p.name[0].toUpperCase()}</span>
                <span>{p.name}</span>
                {p.id === playerId && <span className="you-badge">YOU</span>}
              </div>
            ))}
          </motion.div>

          <motion.div
            className="team-panel guessers"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3>🔍 Guessers</h3>
            <p className="team-role-desc">Listen carefully. Detect the truth among the lies.</p>
            {guessers.map(p => (
              <div key={p.id} className={`player-chip ${p.id === playerId ? "me" : ""}`}>
                <span className="player-avatar">{p.name[0].toUpperCase()}</span>
                <span>{p.name}</span>
                {p.id === playerId && <span className="you-badge">YOU</span>}
              </div>
            ))}
          </motion.div>
        </div>

        {isHost ? (
          <button className="btn btn-primary btn-lg" onClick={onStartRound}>
            Begin Round 1 →
          </button>
        ) : (
          <p className="waiting-note">⏳ Host is starting the round...</p>
        )}
      </div>
    </div>
  );
}
