// src/components/phases/ExplainingPhase.js
import React from "react";
import { motion } from "framer-motion";
import { TEAMS } from "../../utils/gameLogic";

export default function ExplainingPhase({ gameState, playerId, myTeam, isHost, onStartVoting }) {
  const speakers = gameState.players?.filter(p => gameState.teams?.[p.id] === TEAMS.SPEAKERS) || [];

  return (
    <div className="phase explaining-phase">
      <div className="phase-card">
        <div className="word-banner">
          <span className="word-label-sm">Word:</span>
          <span className="the-word-sm">{gameState.currentWord?.word}</span>
        </div>

        <h2 className="phase-title">Explanation Time!</h2>

        {myTeam === TEAMS.SPEAKERS ? (
          <div className="speaker-instructions">
            <p>📢 Each speaker takes a turn explaining their definition (voice or text).</p>
            <p>Be convincing. Be confident. Don't give away the truth!</p>
          </div>
        ) : (
          <div className="guesser-instructions">
            <p>👂 Listen carefully to each Speaker explain their definition.</p>
            <p>Take mental notes — who sounds confident? Who hesitates?</p>
          </div>
        )}

        <div className="speakers-list">
          <h3>Speakers presenting:</h3>
          {speakers.map((p, i) => (
            <motion.div
              key={p.id}
              className={`speaker-row ${p.id === playerId ? "me" : ""}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="speaker-avatar">{p.name[0].toUpperCase()}</span>
              <span className="speaker-name">{p.name}</span>
              {p.id === playerId && <span className="you-badge">YOU</span>}
              <span className="mic-icon">🎙️</span>
            </motion.div>
          ))}
        </div>

        <div className="definitions-preview">
          <p className="preview-note">
            {gameState.definitions?.length}/{speakers.length} definitions submitted
          </p>
        </div>

        {isHost && (
          <button className="btn btn-primary btn-lg" onClick={onStartVoting}>
            Open Voting →
          </button>
        )}
        {!isHost && <p className="waiting-note">⏳ Host will open voting when ready...</p>}
      </div>
    </div>
  );
}
