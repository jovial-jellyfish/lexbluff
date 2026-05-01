// src/components/phases/VotingPhase.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import { TEAMS } from "../../utils/gameLogic";

export default function VotingPhase({
  gameState, playerId, myTeam, isHost,
  onCastVote, onShowResults
}) {
  const [voted, setVoted] = useState(null);
  const isGuesser = myTeam === TEAMS.GUESSERS;
  const myVote = gameState.votes?.find(v => v.voterId === playerId);
  const totalGuessers = gameState.players?.filter(p => gameState.teams?.[p.id] === TEAMS.GUESSERS).length || 0;
  const votesIn = gameState.votes?.length || 0;
  const allVoted = votesIn >= totalGuessers;

  const handleVote = async (speakerId) => {
    if (myVote || voted) return;
    setVoted(speakerId);
    await onCastVote(speakerId);
  };

  return (
    <div className="phase voting-phase">
      <div className="phase-card">
        <div className="word-banner">
          <span className="word-label-sm">Word:</span>
          <span className="the-word-sm">{gameState.currentWord?.word}</span>
        </div>

        <h2 className="phase-title">Vote for the Truth</h2>

        {isGuesser ? (
          <>
            {!myVote && !voted ? (
              <>
                <p className="phase-sub">Which speaker gave the REAL definition?</p>
                <div className="definitions-vote-list">
                  {gameState.definitions?.map((def, i) => (
                    <motion.button
                      key={def.speakerId}
                      className="def-vote-card"
                      onClick={() => handleVote(def.speakerId)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="def-speaker-name">{def.speakerName}</div>
                      <div className="def-text-preview">"{def.text}"</div>
                    </motion.button>
                  ))}
                </div>
              </>
            ) : (
              <div className="voted-confirmation">
                <div className="big-icon">🗳️</div>
                <p>Vote cast! Waiting for others...</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(votesIn / totalGuessers) * 100}%` }} />
                </div>
                <p className="progress-label">{votesIn}/{totalGuessers} votes in</p>
              </div>
            )}
          </>
        ) : (
          <div className="speaker-wait-vote">
            <div className="big-icon">⏳</div>
            <p>Guessers are voting on who told the truth...</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(votesIn / Math.max(totalGuessers, 1)) * 100}%` }} />
            </div>
            <p className="progress-label">{votesIn}/{totalGuessers} votes in</p>
          </div>
        )}

        {isHost && allVoted && (
          <button className="btn btn-primary btn-lg mt" onClick={onShowResults}>
            Reveal Results →
          </button>
        )}
      </div>
    </div>
  );
}
