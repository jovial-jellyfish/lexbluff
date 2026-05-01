// src/components/phases/Lobby.js
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Lobby({ gameState, playerId, shareUrl, isHost, onStartGame }) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canStart = gameState.players?.length >= 3;

  return (
    <div className="phase lobby-phase">
      <motion.div
        className="phase-card"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="phase-title">Waiting Room</h1>
        <p className="phase-sub">Share the link to invite players</p>

        <div className="share-box" onClick={copyLink}>
          <span className="share-url">{shareUrl}</span>
          <span className="share-btn">{copied ? "✓ Copied!" : "Copy"}</span>
        </div>

        <div className="room-code-display">
          Room Code: <strong>{gameState.roomId}</strong>
        </div>

        <div className="player-list">
          <h3>Players ({gameState.players?.length})</h3>
          <div className="players">
            {gameState.players?.map((p, i) => (
              <motion.div
                key={p.id}
                className={`player-chip ${p.id === playerId ? "me" : ""}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <span className="player-avatar">{p.name[0].toUpperCase()}</span>
                <span>{p.name}</span>
                {p.isHost && <span className="host-badge">HOST</span>}
                {p.id === playerId && <span className="you-badge">YOU</span>}
              </motion.div>
            ))}
          </div>
        </div>

        {!canStart && (
          <p className="waiting-note">Need at least 3 players to start</p>
        )}

        {isHost ? (
          <button
            className="btn btn-primary btn-lg"
            onClick={onStartGame}
            disabled={!canStart}
          >
            Start Game →
          </button>
        ) : (
          <p className="waiting-note">⏳ Waiting for host to start...</p>
        )}
      </motion.div>
    </div>
  );
}
