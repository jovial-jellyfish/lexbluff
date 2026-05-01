// src/components/phases/GameOver.js
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function GameOver({ gameState, playerId }) {
  const navigate = useNavigate();
  const scores = gameState.scores || {};

  const sortedPlayers = [...(gameState.players || [])].sort(
    (a, b) => (scores[b.id] || 0) - (scores[a.id] || 0)
  );

  const winner = sortedPlayers[0];
  const MEDALS = ["🥇", "🥈", "🥉"];

  return (
    <div className="phase gameover-phase">
      <motion.div
        className="phase-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="trophy"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          🏆
        </motion.div>

        <h1 className="phase-title">Game Over!</h1>
        <p className="winner-announce">
          <strong>{winner?.name}</strong> wins with {scores[winner?.id] || 0} points!
        </p>

        <div className="final-scoreboard">
          {sortedPlayers.map((p, i) => (
            <motion.div
              key={p.id}
              className={`final-score-row ${p.id === playerId ? "me" : ""} ${i === 0 ? "winner" : ""}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="medal">{MEDALS[i] || `#${i + 1}`}</span>
              <span className="score-name">{p.name}</span>
              {p.id === playerId && <span className="you-badge">YOU</span>}
              <span className="score-pts">{scores[p.id] || 0} pts</span>
            </motion.div>
          ))}
        </div>

        <button className="btn btn-primary btn-lg" onClick={() => navigate("/")}>
          Play Again
        </button>
      </motion.div>
    </div>
  );
}
