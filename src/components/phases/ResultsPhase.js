// src/components/phases/ResultsPhase.js
import React from "react";
import { motion } from "framer-motion";

export default function ResultsPhase({ gameState, playerId, isHost, onNextRound }) {
  const truthSpeaker = gameState.players?.find(p => p.id === gameState.truthSpeakerId);
  const truthDef = gameState.definitions?.find(d => d.isTrue);
  const correctVoters = gameState.votes?.filter(v => v.votedFor === gameState.truthSpeakerId) || [];
  const scores = gameState.scores || {};

  const sortedPlayers = [...(gameState.players || [])].sort(
    (a, b) => (scores[b.id] || 0) - (scores[a.id] || 0)
  );

  const guesserWon = correctVoters.length > 0;

  return (
    <div className="phase results-phase">
      <div className="phase-card">
        <motion.div
          className={`result-banner ${guesserWon ? "guessers-win" : "speakers-win"}`}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {guesserWon ? "🔍 Guessers Found the Truth!" : "🎭 Bluffers Won the Round!"}
        </motion.div>

        <div className="reveal-section">
          <p className="reveal-label">The word was: <strong>{gameState.currentWord?.word}</strong></p>
          <p className="truth-speaker-reveal">
            🧠 <strong>{truthSpeaker?.name}</strong> knew the real definition:
          </p>
          <div className="true-def-box">
            "{truthDef?.text || gameState.currentWord?.definition}"
          </div>
        </div>

        {gameState.definitions?.filter(d => !d.isTrue).length > 0 && (
          <div className="bluffs-reveal">
            <h3>The Bluffs:</h3>
            {gameState.definitions?.filter(d => !d.isTrue).map(def => (
              <div key={def.speakerId} className="bluff-item">
                <span className="bluff-name">{def.speakerName}:</span>
                <span className="bluff-text">"{def.text}"</span>
              </div>
            ))}
          </div>
        )}

        <div className="scoreboard">
          <h3>🏆 Scoreboard</h3>
          {sortedPlayers.map((p, i) => (
            <motion.div
              key={p.id}
              className={`score-row ${p.id === playerId ? "me" : ""}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <span className="score-rank">#{i + 1}</span>
              <span className="score-name">{p.name}</span>
              {p.id === playerId && <span className="you-badge">YOU</span>}
              <span className="score-pts">{scores[p.id] || 0} pts</span>
            </motion.div>
          ))}
        </div>

        {isHost ? (
          <button className="btn btn-primary btn-lg" onClick={onNextRound}>
            {gameState.round >= 5 ? "See Final Results →" : "Next Round →"}
          </button>
        ) : (
          <p className="waiting-note">⏳ Host is moving to next round...</p>
        )}
      </div>
    </div>
  );
}
